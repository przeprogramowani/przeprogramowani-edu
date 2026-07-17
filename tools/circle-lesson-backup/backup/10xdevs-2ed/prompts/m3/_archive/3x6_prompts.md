---
title: "Feature Flags System Design"
description: "Designs universal TypeScript feature flag module for frontend and backend supporting environment-based toggles for auth and collections."
collection: m3-prod
segment: l6-deploy
sort-order: 0
status: published
---

W mojej aplikacji chciałbym rozdzielić deploymenty od releasów wprowadzając system feature flag.

Powinien być możliwy do zastosowania:

- na poziomie endpointów api (collections, auth)
- na poziomie stron astro – @login.astro @signup.astro @reset-password.astro
- na poziomie widoczności kolekcji – @TwoPane.tsx oraz @MobileNavigation.tsx

Na poziomie wspomnianych modułów powinienem być w stanie sprawdzić stan flagi określonej funkcjonalności, wg środowiska.

Zaprojektuj uniwersalny moduł TypeScript z którego będzie można korzystać na frontendzie i backendzie (src/features), który będzie przechowywał konfigurację flag dla środowisk local, integration i production. Dodaj flagi dla "auth" i "collections".

Środowisko dostarczę jako zmienną ENV_NAME (local, integration, prod)

Integracją zajmiemy się w kolejnym kroku. Zanim rozpoczniemy, zadaj mi 5 pytań, które ułatwią ci całą implementację.



---
title: "Cloudflare Pages Deployment Setup"
description: "Configures project for Cloudflare Pages and creates GitHub Actions workflow for automated deployment without e2e tests."
collection: m3-prod
segment: l6-deploy
sort-order: 1
status: published
---

Jesteś specjalistą GitHub Actions i Cloudflare.

1) Zapoznaj się z projektem:

- Tech Stack @tech-stack.md
- Aktualna konfiguracja projektu @astro.config.mjs
- Zależności i skrypty @package.json
- Dostępne zmienne środowiskowe @.env.example

2) Dostosuj projekt aby wspierać deployment na Cloudflare

3) Utwórz scenariusz CI/CD "master.yml" gdzie przeprowadzimy wdrożenie na istniejący projekt Cloudflare Pages. Bazuj na @pull-request.yml ale w nowym scenariuszu nie testuj E2E.

4) Na koniec popraw scenariusz z wykorzystaniem @github-action.mdc



---
title: "Docker DigitalOcean Deployment Pipeline"
description: "Creates GitHub Actions workflow building Docker image, pushing to GitHub Container Registry, and deploying to DigitalOcean App Platform."
collection: m3-prod
segment: l6-deploy
sort-order: 2
status: published
---

Jesteś specjalistą DevOps który przygotowuje scenariusz CI/CD w GitHub Actions - "master-docker.yml".

Przygotuj scenariusz  który umieści obraz @Dockerfile w GitHub Container Registry - "{owner}/{appname}" a następnie wykona Deploy na DigitalOcean App Platform. Kontener może być tagowany SHA ostatniego commita na masterze.

Job do budowania obrazu powinien korzystać ze środowiska GHA "production" i jako argument pobierać sekret PUBLIC_ENV_NAME.

<owner>psmyrdek</owner>
<appname>10xrules</appname>

Tworząc akcję bazuj na @master.yml (najważniejsze kroki - lint, unit-test)

Po ukończeniu draftu, upewnij się, że korzystasz z najnowszych i aktualnych wersji akcji @github-action.mdc

Zanim rozpoczniemy, zadaj mi dodatkowe pytania które pomogą ci ukończyć to zadanie.



---
title: "GitHub Action Version Fix"
description: "Troubleshoots and fixes DigitalOcean action version error in deployment workflow using updated GitHub Actions."
collection: m3-prod
segment: l6-deploy
sort-order: 3
status: published
---

Scenariusz ma błąd: "Unable to resolve action `digitalocean/app-deploy-action@v1`, repository or version not found"

Napraw to z @github-action.mdc
