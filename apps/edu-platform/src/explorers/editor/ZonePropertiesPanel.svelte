<script lang="ts">
  import type { ZoneSource, ZoneType } from '../levels/mapAuthoring/types';
  import { ZONE_TYPES } from '../levels/mapAuthoring/types';
  import { NPC_COLOR_VARIANTS } from '../config/constants';

  const SIZE_OPTIONS = [1, 2, 3];

  interface Props {
    zone: ZoneSource | null;
    linkableProps: { id: string; at: [number, number] }[];
    knownEventIds: string[];
    knownTargetMaps: string[];
    onUpdate: (zone: ZoneSource) => void;
    onDelete: () => void;
  }

  let { zone, linkableProps, knownEventIds, knownTargetMaps, onUpdate, onDelete }: Props = $props();
  let confirmDelete = $state(false);

  function getProp(name: string): string {
    const value = zone?.properties[name];
    return value === undefined ? '' : String(value);
  }

  function getIntProp(name: string): number {
    const value = zone?.properties[name];
    return value === undefined ? 0 : Number(value);
  }

  function setProp(name: string, value: string | number | boolean) {
    if (!zone) return;
    onUpdate({ ...zone, properties: { ...zone.properties, [name]: value } });
  }

  function removeProp(name: string) {
    if (!zone) return;
    const { [name]: _removed, ...rest } = zone.properties;
    onUpdate({ ...zone, properties: rest });
  }

  function setOptionalProp(name: string, value: string) {
    if (value) setProp(name, value);
    else removeProp(name);
  }

  function setId(value: string) {
    if (!zone) return;
    onUpdate({ ...zone, id: value });
  }

  function setName(value: string) {
    if (!zone) return;
    const { name: _name, ...rest } = zone;
    onUpdate(value ? { ...rest, name: value } : rest);
  }

  function setSize(axis: 0 | 1, tiles: number) {
    if (!zone) return;
    const size: [number, number] = [...zone.size];
    size[axis] = tiles;
    onUpdate({ ...zone, size });
  }

  function setType(newType: ZoneType) {
    if (!zone) return;
    const p = zone.properties;
    // Per-type defaults, carrying over values that survive the type switch.
    const next: Record<string, string | number | boolean> = {};
    if (newType === 'trigger') {
      next.eventId = p.eventId ?? '';
      if (p.requiredFlag) next.requiredFlag = p.requiredFlag;
    } else if (newType === 'terminal') {
      next.eventId = p.eventId ?? '';
    } else if (newType === 'door') {
      next.targetMap = p.targetMap ?? '';
      next.spawnX = Number(p.spawnX ?? 0);
      next.spawnY = Number(p.spawnY ?? 0);
      if (p.requiredFlags) next.requiredFlags = p.requiredFlags;
    } else if (newType === 'npc') {
      next.npcType = p.npcType ?? 'scientist';
      if (p.npcVariant) next.npcVariant = p.npcVariant;
    } else if (newType === 'exam') {
      next.examId = p.examId ?? '';
    } else if (newType === 'arcade') {
      next.arcadeGameId = p.arcadeGameId ?? '';
    }
    onUpdate({ ...zone, type: newType, properties: next });
  }

  function linkToProp(propId: string) {
    if (!zone) return;
    const prop = linkableProps.find((p) => p.id === propId);
    if (!prop) return;
    onUpdate({ ...zone, propId, at: [...prop.at] });
  }

  function detachProp() {
    if (!zone) return;
    const { propId: _propId, ...rest } = zone;
    onUpdate(rest);
  }

  function handleDelete() {
    if (!zone) return;
    if (!confirmDelete) {
      confirmDelete = true;
      return;
    }
    onDelete();
    confirmDelete = false;
  }

  // Reset confirm state when zone changes
  $effect(() => {
    zone;
    confirmDelete = false;
  });

  const inputClass =
    'bg-gray-800 border border-gray-600 rounded px-2 py-1 text-xs text-gray-200 focus:border-blue-500 focus:outline-none';
</script>

{#if zone}
  <div class="p-2 border-b border-gray-700">
    <div class="text-xs text-gray-400 mb-2 uppercase tracking-wider">Zone Properties</div>

    <div class="flex flex-col gap-2">
      <!-- Id (the interaction key) -->
      <label class="flex flex-col gap-0.5">
        <span class="text-xs text-gray-500">id</span>
        <input type="text" value={zone.id} oninput={(e) => setId((e.target as HTMLInputElement).value)} class={inputClass} />
      </label>

      <!-- Name (optional display name) -->
      <label class="flex flex-col gap-0.5">
        <span class="text-xs text-gray-500">name (optional)</span>
        <input
          type="text"
          value={zone.name ?? ''}
          oninput={(e) => setName((e.target as HTMLInputElement).value)}
          class={inputClass}
        />
      </label>

      <!-- Type -->
      <label class="flex flex-col gap-0.5">
        <span class="text-xs text-gray-500">Type</span>
        <select value={zone.type} onchange={(e) => setType((e.target as HTMLSelectElement).value as ZoneType)} class={inputClass}>
          {#each ZONE_TYPES as zoneType}
            <option value={zoneType}>{zoneType}</option>
          {/each}
        </select>
      </label>

      <!-- Position + prop link -->
      <div class="flex flex-col gap-0.5">
        <span class="text-xs text-gray-500">Position (tiles)</span>
        <div class="text-xs text-gray-300 px-2 py-1 bg-gray-900 border border-gray-700 rounded">
          ({zone.at[0]}, {zone.at[1]})
          {#if zone.propId}
            <span class="text-cyan-400">· linked to prop “{zone.propId}”</span>
          {/if}
        </div>
        {#if zone.propId}
          <button
            onclick={detachProp}
            class="self-start px-2 py-0.5 rounded text-[11px] bg-gray-800 hover:bg-gray-700 text-gray-300 border border-gray-600"
          >
            Detach from prop
          </button>
        {:else if linkableProps.length > 0}
          <select value="" onchange={(e) => linkToProp((e.target as HTMLSelectElement).value)} class={inputClass}>
            <option value="" disabled>Link to prop…</option>
            {#each linkableProps as prop}
              <option value={prop.id}>{prop.id} ({prop.at[0]}, {prop.at[1]})</option>
            {/each}
          </select>
        {/if}
      </div>

      <!-- Size -->
      <div class="flex gap-2">
        <label class="flex flex-col gap-0.5 flex-1">
          <span class="text-xs text-gray-500">Width</span>
          <select value={zone.size[0]} onchange={(e) => setSize(0, Number((e.target as HTMLSelectElement).value))} class={inputClass}>
            {#each SIZE_OPTIONS as n}
              <option value={n}>{n} {n === 1 ? 'tile' : 'tiles'}</option>
            {/each}
          </select>
        </label>
        <label class="flex flex-col gap-0.5 flex-1">
          <span class="text-xs text-gray-500">Height</span>
          <select value={zone.size[1]} onchange={(e) => setSize(1, Number((e.target as HTMLSelectElement).value))} class={inputClass}>
            {#each SIZE_OPTIONS as n}
              <option value={n}>{n} {n === 1 ? 'tile' : 'tiles'}</option>
            {/each}
          </select>
        </label>
      </div>

      <hr class="border-gray-700" />

      <!-- Trigger fields -->
      {#if zone.type === 'trigger'}
        <label class="flex flex-col gap-0.5">
          <span class="text-xs text-gray-500">eventId</span>
          <input
            type="text"
            value={getProp('eventId')}
            oninput={(e) => setProp('eventId', (e.target as HTMLInputElement).value)}
            list="event-ids"
            class={inputClass}
          />
          <datalist id="event-ids">
            {#each knownEventIds as eid}
              <option value={eid}></option>
            {/each}
          </datalist>
        </label>
        <label class="flex flex-col gap-0.5">
          <span class="text-xs text-gray-500">requiredFlag (optional)</span>
          <input
            type="text"
            value={getProp('requiredFlag')}
            oninput={(e) => setOptionalProp('requiredFlag', (e.target as HTMLInputElement).value)}
            class={inputClass}
          />
        </label>
      {/if}

      <!-- Door fields -->
      {#if zone.type === 'door'}
        <label class="flex flex-col gap-0.5">
          <span class="text-xs text-gray-500">targetMap</span>
          <select value={getProp('targetMap')} onchange={(e) => setProp('targetMap', (e.target as HTMLSelectElement).value)} class={inputClass}>
            <option value="" disabled>-- select map --</option>
            {#each knownTargetMaps as tm}
              <option value={tm}>{tm}</option>
            {/each}
          </select>
        </label>
        <div class="flex gap-2">
          <label class="flex flex-col gap-0.5 flex-1">
            <span class="text-xs text-gray-500">spawnX (tile)</span>
            <input
              type="number"
              value={getIntProp('spawnX')}
              oninput={(e) => setProp('spawnX', Number((e.target as HTMLInputElement).value))}
              class="{inputClass} min-w-0 w-full"
            />
          </label>
          <label class="flex flex-col gap-0.5 flex-1">
            <span class="text-xs text-gray-500">spawnY (tile)</span>
            <input
              type="number"
              value={getIntProp('spawnY')}
              oninput={(e) => setProp('spawnY', Number((e.target as HTMLInputElement).value))}
              class="{inputClass} min-w-0 w-full"
            />
          </label>
        </div>
        <label class="flex flex-col gap-0.5">
          <span class="text-xs text-gray-500">requiredFlags (comma-separated)</span>
          <input
            type="text"
            value={getProp('requiredFlags')}
            oninput={(e) => setOptionalProp('requiredFlags', (e.target as HTMLInputElement).value)}
            placeholder="flag-a,flag-b"
            class={inputClass}
          />
        </label>
      {/if}

      <!-- NPC fields -->
      {#if zone.type === 'npc'}
        <label class="flex flex-col gap-0.5">
          <span class="text-xs text-gray-500">npcType</span>
          <select value={getProp('npcType')} onchange={(e) => setProp('npcType', (e.target as HTMLSelectElement).value)} class={inputClass}>
            <option value="scientist">scientist</option>
            <option value="alien">alien</option>
            <option value="robot">robot</option>
            <option value="orb">orb</option>
          </select>
        </label>
        <label class="flex flex-col gap-0.5">
          <span class="text-xs text-gray-500">npcVariant</span>
          <select value={getProp('npcVariant')} onchange={(e) => setOptionalProp('npcVariant', (e.target as HTMLSelectElement).value)} class={inputClass}>
            <option value="">default</option>
            {#each Object.keys(NPC_COLOR_VARIANTS) as variant}
              <option value={variant}>{variant}</option>
            {/each}
          </select>
        </label>
      {/if}

      <!-- Exam fields -->
      {#if zone.type === 'exam'}
        <label class="flex flex-col gap-0.5">
          <span class="text-xs text-gray-500">examId</span>
          <input
            type="text"
            value={getProp('examId')}
            oninput={(e) => setProp('examId', (e.target as HTMLInputElement).value)}
            class={inputClass}
          />
        </label>
      {/if}

      <!-- Arcade fields -->
      {#if zone.type === 'arcade'}
        <label class="flex flex-col gap-0.5">
          <span class="text-xs text-gray-500">arcadeGameId</span>
          <input
            type="text"
            value={getProp('arcadeGameId')}
            oninput={(e) => setProp('arcadeGameId', (e.target as HTMLInputElement).value)}
            class={inputClass}
          />
        </label>
      {/if}

      <!-- Terminal fields -->
      {#if zone.type === 'terminal'}
        <label class="flex flex-col gap-0.5">
          <span class="text-xs text-gray-500">eventId</span>
          <input
            type="text"
            value={getProp('eventId')}
            oninput={(e) => setProp('eventId', (e.target as HTMLInputElement).value)}
            list="event-ids-terminal"
            class={inputClass}
          />
          <datalist id="event-ids-terminal">
            {#each knownEventIds as eid}
              <option value={eid}></option>
            {/each}
          </datalist>
        </label>
      {/if}

      <hr class="border-gray-700" />

      <!-- Delete -->
      <button
        onclick={handleDelete}
        class="px-3 py-1.5 rounded text-xs transition-colors {confirmDelete ? 'bg-red-600 text-white' : 'bg-red-900/30 text-red-400 hover:bg-red-900/50'}"
      >
        {confirmDelete ? 'Click again to confirm' : 'Delete Zone'}
      </button>
    </div>
  </div>
{/if}
