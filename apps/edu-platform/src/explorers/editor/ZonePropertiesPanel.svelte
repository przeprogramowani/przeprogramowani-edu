<script lang="ts">
  import type { ZoneObject, TiledProperty } from './types';
  import { TILE_SIZE } from '../config/constants';

  const ZONE_SIZE_OPTIONS = [1, 2, 3].map((n) => ({
    value: TILE_SIZE * n,
    label: `${n} ${n === 1 ? 'tile' : 'tiles'} (${TILE_SIZE * n}px)`,
  }));

  interface Props {
    zone: ZoneObject | null;
    knownEventIds: string[];
    knownTargetMaps: string[];
    onUpdate: (zone: ZoneObject) => void;
    onDelete: (zoneId: number) => void;
  }

  let { zone, knownEventIds, knownTargetMaps, onUpdate, onDelete }: Props = $props();
  let confirmDelete = $state(false);

  function getProp(name: string): string {
    if (!zone) return '';
    const prop = zone.properties.find((p) => p.name === name);
    return prop ? String(prop.value) : '';
  }

  function getIntProp(name: string): number {
    if (!zone) return 0;
    const prop = zone.properties.find((p) => p.name === name);
    return prop ? Number(prop.value) : 0;
  }

  function setProp(name: string, value: string | number, type: TiledProperty['type'] = 'string') {
    if (!zone) return;
    const props = [...zone.properties];
    const existing = props.findIndex((p) => p.name === name);
    if (existing >= 0) {
      props[existing] = { ...props[existing], value };
    } else {
      props.push({ name, type, value });
    }
    onUpdate({ ...zone, properties: props });
  }

  function setType(newType: ZoneObject['type']) {
    if (!zone) return;
    // Build default properties for the new type
    const baseProps: TiledProperty[] = [
      { name: 'id', type: 'string', value: getProp('id') || zone.name.toLowerCase().replace(/\s+/g, '-') },
    ];

    if (newType === 'trigger') {
      baseProps.push({ name: 'eventId', type: 'string', value: getProp('eventId') || '' });
      const reqFlag = getProp('requiredFlag');
      if (reqFlag) baseProps.push({ name: 'requiredFlag', type: 'string', value: reqFlag });
    } else if (newType === 'door') {
      baseProps.push({ name: 'targetMap', type: 'string', value: getProp('targetMap') || '' });
      baseProps.push({ name: 'spawnX', type: 'int', value: getIntProp('spawnX') });
      baseProps.push({ name: 'spawnY', type: 'int', value: getIntProp('spawnY') });
      const reqFlags = getProp('requiredFlags');
      if (reqFlags) baseProps.push({ name: 'requiredFlags', type: 'string', value: reqFlags });
    } else if (newType === 'terminal') {
      baseProps.push({ name: 'eventId', type: 'string', value: getProp('eventId') || '' });
    } else if (newType === 'npc') {
      baseProps.push({ name: 'npcType', type: 'string', value: 'scientist' });
    } else if (newType === 'exam') {
      baseProps.push({ name: 'examId', type: 'string', value: getProp('examId') || '' });
    } else if (newType === 'arcade') {
      baseProps.push({ name: 'arcadeGameId', type: 'string', value: getProp('arcadeGameId') || '' });
    }

    onUpdate({ ...zone, type: newType, properties: baseProps });
  }

  function handleDelete() {
    if (!zone) return;
    if (!confirmDelete) {
      confirmDelete = true;
      return;
    }
    onDelete(zone.id);
    confirmDelete = false;
  }

  // Reset confirm state when zone changes
  $effect(() => {
    zone;
    confirmDelete = false;
  });
</script>

{#if zone}
  <div class="p-2 border-b border-gray-700">
    <div class="text-xs text-gray-400 mb-2 uppercase tracking-wider">Zone Properties</div>

    <div class="flex flex-col gap-2">
      <!-- Name -->
      <label class="flex flex-col gap-0.5">
        <span class="text-xs text-gray-500">Name</span>
        <input
          type="text"
          value={zone.name}
          oninput={(e) => onUpdate({ ...zone, name: (e.target as HTMLInputElement).value })}
          class="bg-gray-800 border border-gray-600 rounded px-2 py-1 text-xs text-gray-200 focus:border-blue-500 focus:outline-none"
        />
      </label>

      <!-- Type -->
      <label class="flex flex-col gap-0.5">
        <span class="text-xs text-gray-500">Type</span>
        <select
          value={zone.type}
          onchange={(e) => setType((e.target as HTMLSelectElement).value as ZoneObject['type'])}
          class="bg-gray-800 border border-gray-600 rounded px-2 py-1 text-xs text-gray-200 focus:border-blue-500 focus:outline-none"
        >
          <option value="trigger">trigger</option>
          <option value="door">door</option>
          <option value="terminal">terminal</option>
          <option value="npc">npc</option>
          <option value="exam">exam</option>
          <option value="arcade">arcade</option>
        </select>
      </label>

      <!-- Position (read-only) -->
      <div class="flex gap-2">
        <label class="flex flex-col gap-0.5 flex-1">
          <span class="text-xs text-gray-500">X (px)</span>
          <input type="number" value={zone.x} readonly class="bg-gray-900 border border-gray-700 rounded px-2 py-1 text-xs text-gray-400 min-w-0 w-full" />
        </label>
        <label class="flex flex-col gap-0.5 flex-1">
          <span class="text-xs text-gray-500">Y (px)</span>
          <input type="number" value={zone.y} readonly class="bg-gray-900 border border-gray-700 rounded px-2 py-1 text-xs text-gray-400 min-w-0 w-full" />
        </label>
      </div>

      <!-- Size -->
      <div class="flex gap-2">
        <label class="flex flex-col gap-0.5 flex-1">
          <span class="text-xs text-gray-500">Width</span>
          <select
            value={zone.width}
            onchange={(e) => onUpdate({ ...zone, width: Number((e.target as HTMLSelectElement).value) })}
            class="bg-gray-800 border border-gray-600 rounded px-2 py-1 text-xs text-gray-200 focus:border-blue-500 focus:outline-none"
          >
            {#each ZONE_SIZE_OPTIONS as opt}
              <option value={opt.value}>{opt.label}</option>
            {/each}
          </select>
        </label>
        <label class="flex flex-col gap-0.5 flex-1">
          <span class="text-xs text-gray-500">Height</span>
          <select
            value={zone.height}
            onchange={(e) => onUpdate({ ...zone, height: Number((e.target as HTMLSelectElement).value) })}
            class="bg-gray-800 border border-gray-600 rounded px-2 py-1 text-xs text-gray-200 focus:border-blue-500 focus:outline-none"
          >
            {#each ZONE_SIZE_OPTIONS as opt}
              <option value={opt.value}>{opt.label}</option>
            {/each}
          </select>
        </label>
      </div>

      <hr class="border-gray-700" />

      <!-- ID (all types) -->
      <label class="flex flex-col gap-0.5">
        <span class="text-xs text-gray-500">id</span>
        <input
          type="text"
          value={getProp('id')}
          oninput={(e) => setProp('id', (e.target as HTMLInputElement).value)}
          class="bg-gray-800 border border-gray-600 rounded px-2 py-1 text-xs text-gray-200 focus:border-blue-500 focus:outline-none"
        />
      </label>

      <!-- Trigger fields -->
      {#if zone.type === 'trigger'}
        <label class="flex flex-col gap-0.5">
          <span class="text-xs text-gray-500">eventId</span>
          <input
            type="text"
            value={getProp('eventId')}
            oninput={(e) => setProp('eventId', (e.target as HTMLInputElement).value)}
            list="event-ids"
            class="bg-gray-800 border border-gray-600 rounded px-2 py-1 text-xs text-gray-200 focus:border-blue-500 focus:outline-none"
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
            oninput={(e) => {
              const val = (e.target as HTMLInputElement).value;
              if (val) setProp('requiredFlag', val);
              else if (zone) onUpdate({ ...zone, properties: zone.properties.filter(p => p.name !== 'requiredFlag') });
            }}
            class="bg-gray-800 border border-gray-600 rounded px-2 py-1 text-xs text-gray-200 focus:border-blue-500 focus:outline-none"
          />
        </label>
      {/if}

      <!-- Door fields -->
      {#if zone.type === 'door'}
        <label class="flex flex-col gap-0.5">
          <span class="text-xs text-gray-500">targetMap</span>
          <select
            value={getProp('targetMap')}
            onchange={(e) => setProp('targetMap', (e.target as HTMLSelectElement).value)}
            class="bg-gray-800 border border-gray-600 rounded px-2 py-1 text-xs text-gray-200 focus:border-blue-500 focus:outline-none"
          >
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
              oninput={(e) => setProp('spawnX', Number((e.target as HTMLInputElement).value), 'int')}
              class="bg-gray-800 border border-gray-600 rounded px-2 py-1 text-xs text-gray-200 focus:border-blue-500 focus:outline-none min-w-0 w-full"
            />
          </label>
          <label class="flex flex-col gap-0.5 flex-1">
            <span class="text-xs text-gray-500">spawnY (tile)</span>
            <input
              type="number"
              value={getIntProp('spawnY')}
              oninput={(e) => setProp('spawnY', Number((e.target as HTMLInputElement).value), 'int')}
              class="bg-gray-800 border border-gray-600 rounded px-2 py-1 text-xs text-gray-200 focus:border-blue-500 focus:outline-none min-w-0 w-full"
            />
          </label>
        </div>
        <label class="flex flex-col gap-0.5">
          <span class="text-xs text-gray-500">requiredFlags (comma-separated)</span>
          <input
            type="text"
            value={getProp('requiredFlags')}
            oninput={(e) => {
              const val = (e.target as HTMLInputElement).value;
              if (val) setProp('requiredFlags', val);
              else if (zone) onUpdate({ ...zone, properties: zone.properties.filter(p => p.name !== 'requiredFlags') });
            }}
            placeholder="flag-a,flag-b"
            class="bg-gray-800 border border-gray-600 rounded px-2 py-1 text-xs text-gray-200 focus:border-blue-500 focus:outline-none"
          />
        </label>
      {/if}

      <!-- NPC fields -->
      {#if zone.type === 'npc'}
        <label class="flex flex-col gap-0.5">
          <span class="text-xs text-gray-500">npcType</span>
          <select
            value={getProp('npcType')}
            onchange={(e) => setProp('npcType', (e.target as HTMLSelectElement).value)}
            class="bg-gray-800 border border-gray-600 rounded px-2 py-1 text-xs text-gray-200 focus:border-blue-500 focus:outline-none"
          >
            <option value="scientist">scientist</option>
            <option value="alien">alien</option>
            <option value="philosopher">philosopher</option>
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
            class="bg-gray-800 border border-gray-600 rounded px-2 py-1 text-xs text-gray-200 focus:border-blue-500 focus:outline-none"
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
            class="bg-gray-800 border border-gray-600 rounded px-2 py-1 text-xs text-gray-200 focus:border-blue-500 focus:outline-none"
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
            class="bg-gray-800 border border-gray-600 rounded px-2 py-1 text-xs text-gray-200 focus:border-blue-500 focus:outline-none"
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
