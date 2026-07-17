---
date: 2026-06-04T15:34:15+0200
researcher: psmyrdek
git_commit: 29bab2184db42103dd30c0827059ef3f854847d4
branch: master
repository: mattermost
topic: "Analiza przepływu zapisu postów — trace e2e, luki w testach, blast radius"
tags: [research, codebase, posts, store, app-layer, api4, websocket, mattermost-redux, codegen, blast-radius]
status: complete
last_updated: 2026-06-04
last_updated_by: psmyrdek
---

# Research: Analiza przepływu zapisu postów (post save flow)

**Date**: 2026-06-04T15:34:15+0200
**Researcher**: psmyrdek
**Git Commit**: 29bab2184db42103dd30c0827059ef3f854847d4
**Branch**: master
**Repository**: mattermost

## Research Question

Przeanalizuj proces zapisu postów, ze szczególnym uwzględnieniem obszarów powiązanych zdefiniowanych w `context/map/repo-map.md`. Trzy równoległe wątki:

1. **Trace e2e** — ścieżka od entry pointu, przez warstwy, do zapisu/odczytu i z powrotem (sekwencja `file:line` + diagram Mermaid).
2. **Luki w testach** — które metody/gałęzie na tej ścieżce mają pokrycie, a które nie.
3. **Blast radius** — co musi zmienić się razem (szew interfejsu, warstwy generowane, model, migracje, testy); graf statyczny + co-change z gita.

Raport musi zawierać **Feature overview** i **Technical debt**. Skupienie wyłącznie na stanie obecnym repozytorium.

---

## Summary

Zapis posta to klasyczna ścieżka warstwowa Mattermost: **API4 → App → szew `PostStore` → warstwy generowane → `sqlstore` → DB → broadcast WebSocket → frontend (Redux)**. Kluczowe ustalenia:

- **Szew (`store.go` `PostStore`)** jest czysty i wąski; `Save` to czysty delegat do `SaveMultiple` — cała realna logika zapisu (transakcja, liczniki kanału, wątki, priorytety) żyje w jednym miejscu (`sqlstore/post_store.go:159`).
- **Warstwy generowane to TYLKO retrylayer + timerlayer** (`make store-layers`). **`opentracinglayer` NIE ISTNIEJE** w tym checkout (premisa zadania jest nieaktualna). `searchlayer` i `localcachelayer` są **ręczne** (brak `DO NOT EDIT`).
- **Read-back nie jest re-SELECT-em** — `SaveMultiple` zwraca te same struktury w pamięci, uzupełnione o `Id`/`CreateAt`/`ReplyCount`; mapowanie odczytu to refleksja `sqlx` po nazwie pola.
- **Pokrycie testami jest mocne na warstwach app/api4/store** (głównie integracyjne, z DB), ale **warstwy generowane mają zero bezpośredniego pokrycia** dla `Post().Save` (retry tylko na `Bot().Get`, timerlayer bez `_test.go`), a **hak indeksacji w `searchlayer` (save→index) jest niepokryty**.
- **Najdroższe sprzężenie (najwyższy dług)**: ręczny mirror modelu **`server/public/model/post.go` ↔ `webapp/platform/types/src/posts.ts`** — brak codegenu, brak wspólnej schemy, w ostatnich 300 commitach tylko **2** razy zmieniane w jednym commicie. Drugi punkt zapalny: **trzy pozycyjne tablice kolumn** w `post_store.go` (zapis pozycyjny, brak ochrony kompilatora).

To potwierdza i uszczegóławia strefy ryzyka R6 (store/migracje) i R5-styl (ręczna synchronizacja kontraktu) z `context/map/repo-map.md`.

---

## Feature overview

### Czym jest przepływ zapisu posta

Tworzenie posta (wiadomości czatu) to gorąca ścieżka produktu (`repo-map.md` §6 wskazuje `server/channels/app/post.go` jako „logikę domenową postów — gorącą ścieżkę"). Pojedyncze `POST /api/v4/posts` przechodzi przez:

1. **API4 (transport/HTTP)** — dekodowanie, sanityzacja wejścia, sprawdzenie uprawnień.
2. **App (domena)** — deduplikacja, walidacja wątków, haki pluginów, wzbogacenie (hashtagi, embeds, mentions), wywołanie persystencji, broadcast.
3. **Szew `PostStore`** — wąski interfejs (`Save`/`SaveMultiple`).
4. **Warstwy generowane/owijające** — `LocalCache → Timer → Search → Retry → SqlStore`.
5. **`sqlstore`** — transakcja INSERT + liczniki kanału + wątki + priorytety + persistent notifications.
6. **Broadcast** — event `posted` po WebSocket do klientów w kanale.
7. **Frontend** — optymistyczny insert w Redux, wysyłka HTTP, a następnie odbiór `posted` po WS i konwergencja na tym samym reducerze.

### Ścieżka e2e — sekwencja `file:line`

**Backend (zapis):**

1. **Rejestracja trasy** — `InitPost` — `server/channels/api4/post.go:24` — `POST /api/v4/posts` → `createPost`.
2. **Handler HTTP** — `createPost` — `server/channels/api4/post.go:96` — decode JSON, `SanitizeInput()` (:103), `UserId` z sesji (:104), `CreateAt=0` jeśli nie ManageSystem (:110-112), `createPostChecks` (:114), → `c.App.CreatePostAsUser(...)` **(:130)**, `201 Created` (:154), `rp.EncodeJSON(w)` (:178). Gałąź `PostTypeBurnOnRead` re-czyta z mastera (:159-176).
3. **App entry** — `App.CreatePostAsUser` — `server/channels/app/post.go:40` — odrzuca system-message (:48), skasowane kanały (:53), restricted DM (:58); → `CreatePost` z `CreatePostFlags{TriggerWebhooks, SetOnline}` (:67); `MarkChannelsAsViewed` dla nadawcy (:85-93). Rodzeństwo: `CreatePostMissingChannel` (:99) — webhooki/integracje.
4. **App rdzeń** — `App.CreatePost` — `server/channels/app/post.go:162`:
   - shared-channel DM/GM guard (:163), burn-on-read (:168);
   - `deduplicateCreatePost` (closure :203, helper :116) na `seenPendingPostIdsCache` + `PendingPostId`;
   - walidacja recipient-count dla persistent notification (:209-221);
   - `SanitizeProps()` (:223);
   - **gałąź wątku**: jeśli `RootId != ""` — async fetch rodzica z mastera (:226-233), walidacja (:277-295);
   - load nadawcy (:235), flagi `from_bot`/`force_notification`/`from_oauth_app` (:246-254);
   - ephemeral ostrzeżenie przy braku `UseChannelMentions` (:258-273);
   - `ParseHashtags` (:297), `FillInPostProps` (:299), normalizacja załączników (:304);
   - **HAK PRE-SAVE**: `RunMultiHook(... MessageWillBePosted ...)` **(:324-344)** — plugin może odrzucić (:346) lub podmienić post;
   - `CreateAt` (:352), `getEmbedsAndImages` (:356), preview-prop (:357-360);
   - **PERSYSTENCJA (szew)**: `a.Srv().Store().Post().Save(rctx, post)` **(:365)**;
   - update cache pending→id (:381), metryki (:386), `attachFilesToPost` (:391);
   - **HAK POST-SAVE (async)**: `a.Srv().Go(... MessageHasBeenPosted ...)` **(:406-414)**;
   - `PreparePostForClient` (:420), auto-translation (:425-445), `applyPostWillBeConsumedHook` (:447);
   - persistent-notification dla replies (:449-461), `Thread().MaintainMembership` (:464-472);
   - **BROADCAST**: `a.handlePostEvents(...)` **(:474)**; ephemeral (:479), `SanitizePostMetadataForUser` (:483), return `rpost` (:488).
5. **SZEW** — `PostStore` — `server/channels/store/store.go:375` — `SaveMultiple` (:376), `Save` (:377). Codegen: `store.go:1` (`//go:generate`). Kompozycja warstw budowana w `server/channels/app/platform/service.go:289-305`: **`LocalCacheLayer → TimerLayer → SearchLayer → RetryLayer → SqlStore`**.
6. **LocalCacheLayer** (GEN) — `server/channels/store/localcachelayer/` — przepuszcza `Save`.
7. **TimerLayer** (GEN) — `TimerLayerPostStore.Save` — `server/channels/store/timerlayer/timerlayer.go:7183` (`SaveMultiple` :7199) — metryka `ObserveStoreMethodDuration`.
8. **SearchLayer** (RĘCZNY) — `SearchPostStore.Save` — `server/channels/store/searchlayer/post_layer.go:104` — po sukcesie `indexPost(rctx, npost)` (:108) → ES/OpenSearch/Bleve. Wpięte w `searchlayer/layer.go:35`.
9. **RetryLayer** (GEN) — `RetryLayerPostStore.Save` — `server/channels/store/retrylayer/retrylayer.go:8949` (`SaveMultiple` :8970) — 3× retry na błędach serializacji/deadlock, backoff 100ms. Header `DO NOT EDIT` (:4-5).
10. **SqlStore.Save** — `SqlPostStore.Save` — `server/channels/store/sqlstore/post_store.go:341` — delegat: `SaveMultiple(rctx, []*model.Post{post})` → `posts[0]`. **Save zawsze przez SaveMultiple.**
11. **SqlStore.SaveMultiple** — `server/channels/store/sqlstore/post_store.go:159`:
    - per-post: odrzuć niepuste `Id` dla nie-remote (:168), `PreSave()` (Id/CreateAt), `IsValid` (:174), `ValidateProps` (:177);
    - gałąź burn-on-read → `TemporaryPost` (:179-200);
    - akumulacja liczników kanału i max CreateAt (:202-235), reply-counts per `RootId` (:237-245);
    - **transakcja**: `GetMaster().Beginx()` (:248), deferred rollback (:252);
    - chunked `INSERT INTO Posts` (squirrel) (:254-263);
    - `updateThreadsFromPosts` (:265), `savePostsPriority` (:269), `savePostsPersistentNotifications` (:273), burn-on-read save (:277-288);
    - `transaction.Commit()` (:290);
    - **po commicie (poza tx)**: `UPDATE Channels SET LastPostAt/LastRootPostAt/TotalMsgCount(+Root)` (:298-309), `UPDATE Posts SET UpdateAt` dla root (reply bump) (:314-318), in-memory `ReplyCount` + `populateReplyCount` (:320-336);
    - return `posts` (:338). **Read-back = te same obiekty w pamięci, bez ponownego SELECT-a treści.**

**Broadcast z powrotem:**

12. `App.handlePostEvents` — `server/channels/app/post.go:643` — invalidacja cache kanału (:663-667), `SendNotifications` (:669), async auto-responder (:673-680), `handleWebhookEvents` (:682-688).
13. `App.SendNotifications` — `server/channels/app/notification.go:54` — buduje event `model.NewWebSocketEvent(model.WebsocketEventPosted, ...)` **(notification.go:679)**, dodaje metadane, → `publishWebsocketEventForPost` (:726). Reply→ `WebsocketEventThreadUpdated` per follower (:741+).
14. `publishWebsocketEventForPost` — `server/channels/app/post.go:985` — strip metadanych per-recipient (:1001-1002), `post.ToJSON()` (:1005), broadcast hooks (:1020-1037), `a.Publish(message)` (:1039).
15. `App.Publish` — `server/channels/app/web_hub.go:19` → platform web-hub → WebSocket fan-out.

**Frontend (dispatch + odbiór):**

16. **Akcja Redux** — `createPost` — `webapp/channels/src/packages/mattermost-redux/src/actions/posts.ts:179` — `pendingPostId` (:189), optymistyczny `RECEIVED_NEW_POST` jako `BATCH_CREATE_POST_INIT` (:249-258).
17. **Wysyłka** — `createPostWrapper` — `posts.ts:260-322` — `Client4.createPost(...)` (:262); sukces → `BATCH_CREATE_POST` (receivedPost, CREATE_POST_SUCCESS, INCREMENT_TOTAL_MSG_COUNT, DECREMENT_UNREAD) (:264-295); błąd → `CREATE_POST_FAILURE` (+ removePost dla wybranych `server_error_ids`) (:298-320).
18. **Transport** — `Client4.createPost` — `webapp/platform/client/src/client4.ts:2319` — `doFetch<Post>(getPostsRoute(), {method:'post', ...})` (`getPostsRoute` :365 = `/api/v4/posts`).
19. **WS dispatcher** — `handleEvent` — `webapp/channels/src/actions/websocket_actions.ts:398` → `WebSocketEvents.Posted` → `handleNewPostEventDebounced` (100ms, :402/:846).
20. `handleNewPostEvent` — `websocket_actions.ts:848` — `JSON.parse(msg.data.post)` (:850), `handleNewPost` (:857).
21. `handleNewPost` — `webapp/channels/src/actions/post_actions.ts:69` → `completePostReceive` (:84).
22. `completePostReceive` — `webapp/channels/src/actions/new_post.ts:38` → `PostActions.receivedNewPost(post, crtEnabled)` (:68) → `PostTypes.RECEIVED_NEW_POST`.
23. **Reducer** — `webapp/channels/src/packages/mattermost-redux/src/reducers/entities/posts.ts` — `RECEIVED_NEW_POST` w `handlePosts` (:209 → `handlePostReceived` :476) i `handlePostsInChannel` (:558). **Optymistyczny post autora i broadcast serwera konwergują na tym samym reducerze.**

### Diagram Mermaid (pełny round-trip)

```mermaid
sequenceDiagram
    participant FE as Webapp (Redux)
    participant C4 as Client4
    participant API as api4/post.go
    participant APP as app/post.go
    participant SEAM as store.go PostStore (SZEW)
    participant GEN as Warstwy generowane/owijające<br/>LocalCache→Timer→Search→Retry
    participant SQL as sqlstore/post_store.go
    participant DB as Postgres
    participant WS as Platform WebHub
    participant FEW as Webapp WS receive

    FE->>FE: createPost() dispatch RECEIVED_NEW_POST (optymistyczny, pending_post_id)
    FE->>C4: Client4.createPost(post)
    C4->>API: POST /api/v4/posts (doFetch)
    API->>API: createPost: decode, SanitizeInput, createPostChecks
    API->>APP: CreatePostAsUser
    APP->>APP: CreatePost: dedupe, validate, FillInPostProps
    APP->>APP: RunMultiHook MessageWillBePosted (pluginy)
    APP->>SEAM: Store().Post().Save(rctx, post)
    SEAM->>GEN: Save (Timer metric, Search index po, Retry x3)
    GEN->>SQL: SqlPostStore.Save -> SaveMultiple
    SQL->>DB: BEGIN; INSERT INTO Posts; updateThreads/Priority; COMMIT
    SQL->>DB: UPDATE Channels LastPostAt/TotalMsgCount; UPDATE Posts UpdateAt (root)
    DB-->>SQL: ok
    SQL-->>GEN: posts[0] (Id/CreateAt uzupelnione, read-back w pamieci)
    GEN-->>APP: rpost
    APP->>APP: PreparePostForClient; Go(MessageHasBeenPosted)
    APP->>APP: handlePostEvents -> SendNotifications
    APP->>WS: NewWebSocketEvent(WebsocketEventPosted) -> publishWebsocketEventForPost -> Publish
    APP-->>API: rpost
    API-->>C4: 201 Created (rp.EncodeJSON)
    C4-->>FE: created Post -> dispatch receivedPost / CREATE_POST_SUCCESS
    WS-->>FEW: "posted" event
    FEW->>FEW: handleEvent->handleNewPostEvent->handleNewPost->completePostReceive
    FEW->>FE: dispatch RECEIVED_NEW_POST (reducer entities/posts.ts)
```

### Gałęzie / warianty
- **Save vs SaveMultiple** — `Save` to czysty delegat (`sqlstore:342`); cała logika w `SaveMultiple` (`:159`).
- **Wątki/replies (`RootId`)** — rodzic z mastera + walidacja (`post.go:226-295`), membership wątku (`:464-472`, `sqlstore:265`), bump `UpdateAt` root (`sqlstore:314-318`), reply counts (`:320-336`), CRT `thread_updated` (`notification.go:741+`).
- **Posty zaplanowane (scheduled)** — osobna trasa, NIE `createPost` (klient `client4.ts:4661`); poza gorącą ścieżką.
- **Persistent notifications** — walidacja pre-save (`post.go:209-221`), zapis `savePostsPersistentNotifications` (`sqlstore:273`), resolve dla replies (`post.go:449-461`).
- **Haki pluginów** — `MessageWillBePosted` (pre-save, sync, może odrzucić/podmienić — `post.go:324-344`), `MessageHasBeenPosted` (post-save, async goroutine — `post.go:406-414`). Oba pomijane dla burn-on-read.
- **Burn-on-read** — pomija haki, zapis jako `TemporaryPost`, strip treści/plików z broadcastu (`post.go:986-989`, `sqlstore:179-200`), API re-czyta z mastera (`api4/post.go:159-176`).
- **Generated vs ręczne warstwy** — retrylayer/timerlayer/localcachelayer = codegen (`DO NOT EDIT`); **searchlayer ręczny**; **opentracinglayer nie istnieje**.

---

## Detailed Findings

### Obszar 1 — Luki w pokryciu testami

Większość testów na tej ścieżce to **integracyjne (wymagają DB)**: cały zestaw `storetest/post_store.go` (przez `sqlstore/post_store_test.go:13`), wszystkie `api4/post_test.go` (`Setup(t).InitBasic`), `app/post_test.go` + `plugin_hooks_test.go`. **Unit (mocki):** `retrylayer/retrylayer_test.go`, `mattermost-redux/.../posts.test.ts`.

**Co jest dobrze pokryte:**
- API4 `createPost` — `TestCreatePost` (`api4/post_test.go:45`): root+reply, pliki, USE_CHANNEL_MENTIONS ephemeral, niepoprawne typy/rootId, brak sesji, uprawnienia upload, admin CreateAt, pełna macierz priority/persistent-notification (`:369-541`), CRT (`:5127`), OAuth, online-status.
- App — `TestCreatePost` (`app/post_test.go:955`), `TestCreatePostDeduplicate` (`:41`, wszystkie kluczowe gałęzie dedup), haki `MessageWillBePosted`/`MessageHasBeenPosted` (`plugin_hooks_test.go:78,311`), mentions/ephemeral, permalink preview, załączniki, shared DM/GM, burn-on-read, force-notification.
- Store — `testPostStoreSave` (`storetest/post_store.go:78`): single save, replies, existing-id error, reply `UpdateAt` bump, `LastPostAt`+`TotalMsgCount` (z gałęzią no-bump dla starszego CreateAt :219-233), card, priority. `SaveMultiple` + **partial-failure `errIdx` + rollback** (`:390-404`).
- Frontend — `posts.test.ts:56,92,132`: sukces, błąd, pliki (nock).

**Najwyższe ryzyko — luki (ranking):**
1. **`searchlayer.Post().Save` → indeksacja — ZERO pokrycia** (`searchlayer/post_layer.go:104-111`). Regresja gubiąca `indexPost` = posty nieprzeszukiwalne, żaden test nie złapie.
2. **`retrylayer`/`opentracinglayer`/`timerlayer` Post().Save — brak bezpośrednich testów** (retry tylko `Bot().Get` w `retrylayer_test.go:79`; timer/opentracing bez `_test.go`). Retry na deadlock dla zapisu posta niezweryfikowany.
3. **Mapowanie błędu store w app** (`app/post.go:366-377`): `ErrInvalidInput`→`save.existing` vs generyczne — nietestowane na warstwie app.
4. **Dedup `pending_post_id` nietestowany e2e przez handler HTTP** — tylko app-layer (`app/post_test.go:41`).
5. **Single `Save` commit-failure/rollback** (`sqlstore/post_store.go:505-507`) — tylko `SaveMultiple` rollback assertowany.
6. **Walidacja recipient-count persistent notification** (`app/post.go:209-221`) — brak testu.
7. **Auto-translation** (`app/post.go:425-445`) — wszystkie gałęzie błędów nietestowane.
8. **`CreatePostMissingChannel` NotFound vs internal** (`app/post.go:104-109`) — brak bezpośredniego testu.
9. **Odrzucenie skasowanego/zarchiwizowanego kanału na poziomie API4** (`app/post.go:53-56` to tylko app); `set_online` parse-error (`api4/post.go:122-128`) nieasertowane.
10. **Frontend: optymistyczny insert→rollback** nie asertowany jawnie (`posts.ts` `createPost`).

### Obszar 2 — Blast radius (statyka + co-change)

**Szew + warstwy generowane:**
- `PostStore` — `server/channels/store/store.go:375-432` (58 metod), codegen `store.go:1`.
- **Generowane: tylko retrylayer + timerlayer** (`make store-layers` → `server/Makefile:352` → `go generate ./channels/store`). Generator: `store/layer_generators/main.go` (`buildRetryLayer` :39-50, `buildTimerLayer` :52-62).
- **Mocki** — `server/channels/store/storetest/mocks/PostStore.go` (NIE `store/mocks/`), mockery v2.53.4, `make store-mocks` → `server/Makefile:343`; config `.mockery.yaml` (`include-regex: ".*Store"`).
- **Ręczne warstwy (brak DO NOT EDIT)** — `searchlayer/post_layer.go`, `localcachelayer/post_layer.go` + `temporary_post_layer.go`.
- Ręcznie współedytowane przy nowej metodzie: `storetest/post_store.go` (suite), `testlib/store.go`.

**Model + schema:**
- `server/public/model/post.go:114-150` (`Post struct`), `IsValid` :466, `PreSave` :621, `PreCommit` :636. Powiązane: `post_list.go`, `post_metadata.go`, `post_priority.go`, `post_acknowledgement.go`, `post_embed.go`.
- **FRAGILNY szew kolumn** w `sqlstore/post_store.go`: trzy ręczne tablice muszą być zsynchronizowane bajt-w-bajt: `postSliceColumnsWithTypes()` (:53-80, 18 kolumn), `postToSlice()` (:82-103, kolejność zapisu), `postSliceCoalesceQuery()` (:123-143). INSERT pozycyjny (:256) — zła kolejność = cicha korupcja danych.
- **Migracje**: `server/channels/db/migrations/postgres/` (MySQL usunięty — commit `41e5c7286b`). Posts: `000020`, `000066`, `000076`, `000080`, `000095`, `000097_priority`, `000098_acknowledgements`, `000102`, `000118`, `000128_scheduled`, `000148_burn_on_read`. Najnowsza ogólnie `000169`. Embed `db/assets.go:8`. Manifest `migrations.list` autogenerowany — `make migrations-extract` (`server/Makefile:923`, sprawdzany w CI).
- **Mirror frontu**: `webapp/platform/types/src/posts.ts:89-119` (`Post` po nazwach JSON), redux `{actions,reducers/entities,selectors/entities,action_types,constants}/posts.ts`. Brak codegenu.
- **Read-back automatyczny** — `sqlx` po nazwie pola (`Get(&post)` :758, `Select(&posts)` :592). Dodanie pola-kolumny czyta się samo.

**Call sites zapisu (produkcyjne) — tylko 4:** `app/post.go:365` (jedyna realna ścieżka `CreatePost`; `TemporaryPost().Save` :3702), `app/import_functions.go:1470/1915/2434`, `slackimport/slackimport.go:700`. Reszta to testy/helpery — zapis jest dobrze scentralizowany.

**Co-change (dowody z gita):**
- **Klaster 1 — zmiana metody interfejsu ZAWSZE ciągnie set generowany** (tight, wymuszone): potwierdzone na 8 ostatnich commitach `store.go` (np. `3fa8776095`, `48f2fd0873`): store.go ↔ retrylayer ↔ timerlayer ↔ mocks ↔ storetest ↔ testlib/store.go. **TANIE** (regen).
- **Klaster 2 — zmiana kształtu posta** rozlewa się na model + sqlstore + migrację + app + cały front. Kanonicznie burn-on-read `084006c0ea` (**156 plików**): model/post.go(+post_list,metadata), sqlstore(+93)/store(+22), migracja 000148+migrations.list, generated retrylayer(+307)/timerlayer(+260)/mocks/storetest, app/post.go(+735), front types/posts.ts + cały redux.
- **Klaster 3 — mirror front/back NIE współcommitowany** (fragile, EXPENSIVE): w ostatnich 300 commitach tylko **2** dotknęły jednocześnie `model/post.go` i `webapp/platform/types/src/posts.ts` (`084006c0ea`, `f0a336ba07`). **Najwyższe ryzyko driftu.**
- **Klaster 4 — semantyka app ↔ testy ↔ plugin API**: `app/post.go` niezawodnie współzmienia się z `api4/post_test.go` i `app/post_test.go`; plugin API tylko gdy zmienia się sygnatura.

**Mapa blast radius wg typu zmiany:**

- **(a) Dodanie/zmiana metody `PostStore`** → `store.go` [ręcznie] + `sqlstore/post_store.go` [ręcznie] + retrylayer/timerlayer [**`make store-layers` — TANIE**] + mocks [**`make store-mocks` — TANIE**] + `storetest/post_store.go` + `testlib/store.go` [ręcznie] + (jeśli nowe zachowanie) `searchlayer`/`localcachelayer` [ręcznie — łatwo zapomnieć].
- **(b) Dodanie pola do modelu Post** → `model/post.go` (+IsValid/PreSave) + **wszystkie trzy** tablice w `sqlstore` (kolejność!) + nowa migracja postgres + regen `migrations.list` + front `types/posts.ts` + redux [EXPENSIVE, nie wymuszone co-commitem] + testy. (Read-back automatyczny.)
- **(c) Zmiana semantyki zapisu w app** → `app/post.go` + `app/post_test.go` + `api4/post_test.go` + (jeśli sygnatura do pluginów) `plugin_api.go`/`client_rpc.go`/`pluginapi`; audyt `import_functions.go`, `slackimport.go`.

---

## Technical debt

Dług uporządkowany od najwyższego ryzyka. Klasyfikacja **CHEAP** = sprzężenie mechaniczne, łapane regeneracją/CI; **EXPENSIVE** = ręczna synchronizacja bez ochrony narzędziowej.

### TD-1 — Ręczny mirror modelu front/back (EXPENSIVE, najwyższe ryzyko)
- **Co**: `server/public/model/post.go:114` (`Post struct`) i `webapp/platform/types/src/posts.ts:89` (`Post` type) to dwie połowy tego samego kontraktu, synchronizowane ręcznie po nazwach JSON. Brak codegenu, brak wspólnej schemy.
- **Dowód**: w ostatnich 300 commitach tylko **2** dotknęły obu plików naraz (`084006c0ea` burn-on-read, `f0a336ba07`). Połowy kontraktu normalnie driftują w osobnych PR-ach — nic tego nie wymusza.
- **Ryzyko**: ciche rozjechanie się typu posta między backendem a frontem; analogiczne do ryzyka R5 (`config.go`↔`config.ts`) z `repo-map.md`, ale dla modelu wiadomości.

### TD-2 — Pozycyjne tablice kolumn w sqlstore (EXPENSIVE)
- **Co**: `server/channels/store/sqlstore/post_store.go:53-143` — trzy ręczne tablice (`postSliceColumnsWithTypes`, `postToSlice`, `postSliceCoalesceQuery`) muszą być zgodne co do kolejności; INSERT jest pozycyjny (:256).
- **Ryzyko**: dodanie kolumny w złej pozycji = **cicha korupcja danych**, brak ochrony kompilatora. Asymetria: zapis pozycyjny vs odczyt przez refleksję `sqlx` (po nazwie pola) — odczyt wybacza, zapis nie.

### TD-3 — God-files na całej ścieżce (EXPENSIVE strukturalnie)
- `server/channels/app/post.go` ≈ 3 957 linii, `server/channels/store/sqlstore/post_store.go` ≈ 3 418, `server/public/model/post.go` ≈ 1 387, `server/channels/store/store.go` ≈ 1 332.
- `SaveMultiple` (`post_store.go:159`) to god-method: walidacja + transakcja + INSERT + 4 efekty uboczne (wątki, priorytety, persistent notifications, burn-on-read) w jednym ciele. Wszystkie cztery pliki rutynowo pojawiają się razem w dużych commitach → szeroki blast radius każdej zmiany.

### TD-4 — Ręczne warstwy store poza codegenem (EXPENSIVE, łatwe do przeoczenia)
- `searchlayer/post_layer.go` i `localcachelayer/post_layer.go` NIE mają nagłówka `DO NOT EDIT` — przy zmianie zachowania metody trzeba je poprawić ręcznie, w przeciwieństwie do retrylayer/timerlayer (regenerowanych `make store-layers`). Łatwo zapomnieć, bo „warstwy store" intuicyjnie kojarzą się z generowanymi.

### TD-5 — Luki testowe jako dług bezpieczeństwa zmian
- **`searchlayer.Save → indexPost` — zero pokrycia** (`searchlayer/post_layer.go:104-111`): regresja gubiąca indeksację = posty nieprzeszukiwalne, żaden test nie złapie.
- **Warstwy generowane `Post().Save` bez bezpośrednich testów**: retry tylko na `Bot().Get` (`retrylayer_test.go:79`), timerlayer/opentracinglayer bez `_test.go`. Retry na deadlock dla zapisu posta niezweryfikowany.
- **Mapowanie błędu store w app** (`app/post.go:366-377`), **single `Save` rollback** (`post_store.go:505-507`), **walidacja persistent-notification** (`app/post.go:209-221`), **auto-translation** (`app/post.go:425-445`) — nietestowane gałęzie błędów. To podnosi koszt każdego bezpiecznego refaktoru tej ścieżki.

### Dług TANI (dla kontrastu — nie myl go z powyższym)
- retrylayer/timerlayer + mocki + `migrations.list` — sprzężone, ale mechaniczne: `make store-layers`, `make store-mocks`, `make migrations-extract`; drift łapie CI. `repo-map.md` §3 słusznie waży to taniej niż ręczną edycję.

### Sygnały do dalszej weryfikacji
- Brak (potwierdzonego) lintu/CI na spójność trzech tablic kolumn TD-2 — jeśli faktycznie go nie ma, to luka warta domknięcia przed jakąkolwiek zmianą schematu Posts.

---

## Code References

- `server/channels/api4/post.go:24` — rejestracja trasy `POST /api/v4/posts`.
- `server/channels/api4/post.go:96` — handler `createPost` (entry point).
- `server/channels/app/post.go:40` — `CreatePostAsUser`.
- `server/channels/app/post.go:162` — `CreatePost` (rdzeń orkiestracji).
- `server/channels/app/post.go:324-344` — hak `MessageWillBePosted`.
- `server/channels/app/post.go:365` — **wywołanie persystencji (szew)**.
- `server/channels/app/post.go:406-414` — hak `MessageHasBeenPosted` (async).
- `server/channels/app/post.go:474,643,985` — broadcast (`handlePostEvents`, `publishWebsocketEventForPost`).
- `server/channels/app/notification.go:679` — budowa eventu `WebsocketEventPosted`.
- `server/channels/app/platform/service.go:289-305` — kompozycja warstw store.
- `server/channels/store/store.go:375` — interfejs `PostStore` (szew).
- `server/channels/store/timerlayer/timerlayer.go:7183` — `TimerLayerPostStore.Save` (GEN).
- `server/channels/store/searchlayer/post_layer.go:104` — `SearchPostStore.Save` + `indexPost` (RĘCZNY).
- `server/channels/store/retrylayer/retrylayer.go:8949` — `RetryLayerPostStore.Save` (GEN).
- `server/channels/store/sqlstore/post_store.go:341` — `SqlPostStore.Save` (delegat).
- `server/channels/store/sqlstore/post_store.go:159` — `SaveMultiple` (realna logika zapisu).
- `server/channels/store/sqlstore/post_store.go:53-143` — trzy pozycyjne tablice kolumn (FRAGILNE).
- `server/public/model/post.go:114` — `Post struct`.
- `webapp/channels/src/packages/mattermost-redux/src/actions/posts.ts:179` — akcja `createPost`.
- `webapp/platform/client/src/client4.ts:2319` — `Client4.createPost`.
- `webapp/channels/src/actions/websocket_actions.ts:398,848` — odbiór eventu `posted`.
- `webapp/channels/src/packages/mattermost-redux/src/reducers/entities/posts.ts:209,476,558` — reducer `RECEIVED_NEW_POST`.
- `webapp/platform/types/src/posts.ts:89` — mirror typu `Post` (kontrakt front/back).
- `server/Makefile:343,352,923` — `store-mocks`, `store-layers`, `migrations-extract`.

**Testy:** `server/channels/api4/post_test.go:45` · `server/channels/app/post_test.go:41,955,1584` · `server/channels/app/plugin_hooks_test.go:78,311` · `server/channels/store/storetest/post_store.go:78,290,390` · `server/channels/store/retrylayer/retrylayer_test.go:79` · `webapp/channels/src/packages/mattermost-redux/src/actions/posts.test.ts:56`.

---

## Architecture Insights

- **Wzorzec warstw store (decorator chain).** Szew `PostStore` jest owijany łańcuchem `LocalCache → Timer → Search → Retry → Sql`. Część warstw generowana (cross-cutting: metryki, retry), część ręczna (cache, search). To **kontrolowane** sprzężenie — `repo-map.md` §3 trafnie klasyfikuje je jako tańsze (regeneracja) niż realny dług, ale **tylko dla warstw generowanych**; searchlayer/localcachelayer wymagają ręcznej dyscypliny.
- **Save = SaveMultiple.** Pojedynczy zapis to zawsze batch-of-one. Cała logika transakcyjna (liczniki kanału, wątki, priorytety) w jednym miejscu — dobra centralizacja, ale `SaveMultiple` jest przez to bardzo gęste.
- **Read-back bez SELECT-a.** Zwracane są mutowane struktury w pamięci. Asymetria z odczytem przez `sqlx` (refleksja po nazwie) — dodanie pola-kolumny czyta się automatycznie, ale **zapis jest pozycyjny** (ręczne tablice). To źródło najsubtelniejszych błędów.
- **Konwergencja optymistyczna.** Autor widzi własny post natychmiast (optymistyczny `RECEIVED_NEW_POST` z `pending_post_id`), a potem ten sam reducer dostaje wersję z serwera (HTTP 201) i broadcast WS — wszystkie trzy ścieżki spotykają się na `entities/posts.ts`. Dedup po `pending_post_id` zapobiega duplikatom.
- **Kontrakt front/back bez codegenu.** `model/post.go` ↔ `types/posts.ts` synchronizowane ręcznie po nazwach JSON — analogiczne do ryzyka R5 (`config.go`↔`config.ts`) z `repo-map.md`, ale dla modelu posta. Brak wymuszenia co-commitem.

## Historical Context (from prior changes)

- `context/map/repo-map.md` — mapa projektu. §3 (regeneracja `store.go → sqlstore + retrylayer + timerlayer` jako tańsze sprzężenie), §4 R6 (store + migracje: rdzeń danych, migracje nieodwracalne, sprzężenie przez regenerację), §6 pkt 5 i 8 (`store.go` i `app/post.go` jako rekomendowane lektury). Niniejsze badanie **potwierdza i uszczegóławia** te tezy oraz koryguje jeden punkt: graf importów w repo-map dotyczy tylko frontu — backend Go (ta ścieżka) był tam `unknown`; teraz mamy konkretny trace.

## Open Questions

- **Czy `searchlayer.Save→index` jest gdziekolwiek pokryty pośrednio** (np. w `searchtest`)? Wstępnie nie — warto potwierdzić przed refaktorem indeksacji.
- **Czy istnieje lint/CI sprawdzający spójność trzech tablic kolumn** w `post_store.go`? Jeśli nie — to realne ryzyko cichej korupcji.
- **Czy drift `model/post.go` ↔ `types/posts.ts`** kiedykolwiek spowodował bug w historii? Wymaga przeglądu issue/PR (poza zakresem statycznym).
- **Scheduled posts** — osobna trasa; czy dzieli logikę walidacji z `CreatePost`, czy duplikuje? (poza gorącą ścieżką, ale powiązane).

## Korekty nieaktualnych założeń

- **`opentracinglayer` NIE ISTNIEJE** w tym checkout — pozostały tylko retrylayer + timerlayer (codegen).
- **Mocki** są w `server/channels/store/storetest/mocks/`, nie `store/mocks/`.
- **Migracje** żyją pod `db/migrations/postgres/` — MySQL usunięty (commit `41e5c7286b`).
