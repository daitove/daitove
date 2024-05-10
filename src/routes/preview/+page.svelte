<script lang="ts">
  import { browser } from '$app/environment';
  import { fromEvent } from 'rxjs';
  import { debounceTime, map, pairwise, filter } from 'rxjs/operators';

  import { firestore } from '$lib/firebase';
  import Daitove from '$lib/classes/Daitove';
  import Gaikole from '$lib/classes/Gaikole';
  import DaitoveCardShort from '$lib/components/cards/DaitoveCardShort.svelte';
  import GaikoleCardShort from '$lib/components/cards/GaikoleCardShort.svelte';
  import { afterNavigate } from '$app/navigation';
  import DaitoveFetcher from '$lib/classes/DaitoveFetcher';
  import GaikoleFetcher from '$lib/classes/GaikoleFetcher';
  import districts from '$lib/districts.json';
  import settlements from '$lib/settlements.json';

  let category: 'დამიტოვე' | 'გამიყოლე' = 'დამიტოვე';
  let daitoves: { [key: string]: Daitove } = {};
  let daitoveFetcher = new DaitoveFetcher();
  let gaikoles: { [key: string]: Gaikole } = {};
  let gaikoleFetcher = new GaikoleFetcher();
  let sortedDaitoves: Daitove[] = [];
  let sortedGaikoles: Gaikole[] = [];

  let sortedDistricts = Array.from(districts);
  let sortedSettlements = Object.values(settlements)
    .flat()
    .sort((a, b) => b.population - a.population)
    .map((el) => el.name);

  let datePicker: HTMLInputElement | null = null;

  let daitoveFilters: {
    district: string | null;
    numberOfPeople: number | null;
    fromDate: string | null;
  } = {
    district: null,
    numberOfPeople: null,
    fromDate: null
  };

  let gaikoleFilters: {
    departurePoint: string | null;
    numberOfPeople: number | null;
    departureTime: string | null;
  } = {
    departurePoint: null,
    numberOfPeople: null,
    departureTime: null
  };

  $: {
    sortedDaitoves = Object.values(daitoves).sort(
      (a, b) => a.fromDate.getTime() - b.fromDate.getTime()
    );

    if (daitoveFilters.district) {
      sortedDaitoves = sortedDaitoves.filter(
        (daitove) => daitove.district === daitoveFilters.district
      );
    }

    if (daitoveFilters.numberOfPeople) {
      sortedDaitoves = sortedDaitoves.filter(
        (daitove) => daitove.numberOfPeople >= Number(daitoveFilters.numberOfPeople)
      );
    }

    if (daitoveFilters.fromDate) {
      const fromDate = new Date(daitoveFilters.fromDate);
      fromDate.setHours(0, 0, 0, 0);

      sortedDaitoves = sortedDaitoves.filter(
        (daitove) => daitove.fromDate.getTime() >= fromDate.getTime()
      );
    }
  }
  $: {
    sortedGaikoles = Object.values(gaikoles).sort(
      (a, b) => a.departureTime.getTime() - b.departureTime.getTime()
    );

    if (gaikoleFilters.departurePoint) {
      sortedGaikoles = sortedGaikoles.filter(
        (gaikole) => gaikole.departurePoint === gaikoleFilters.departurePoint
      );
    }

    if (gaikoleFilters.numberOfPeople) {
      sortedGaikoles = sortedGaikoles.filter(
        (gaikole) => gaikole.numberOfPeople >= Number(gaikoleFilters.numberOfPeople)
      );
    }

    if (gaikoleFilters.departureTime) {
      const fromDate = new Date(gaikoleFilters.departureTime);

      sortedGaikoles = sortedGaikoles.filter(
        (gaikole) => fromDate.toDateString() === gaikole.departureTime.toDateString()
      );
    }
  }

  afterNavigate(async () => {
    daitoves = { ...daitoves, ...(await daitoveFetcher.fetch(firestore, 72)) };
    gaikoles = { ...gaikoles, ...(await gaikoleFetcher.fetch(firestore, 72)) };
  });

  if (browser) {
    fromEvent(window, 'scroll')
      .pipe(
        debounceTime(100),
        map(() => window.scrollY),
        pairwise(),
        filter(([y1, y2]) => y2 > y1), // only proceed if scrolling down
        map(() => {
          const scrollHeight = document.documentElement.scrollHeight;
          const scrollPosition = window.innerHeight + window.scrollY;
          return scrollHeight - scrollPosition <= 2 * window.innerHeight;
        })
      )
      .subscribe(async (isNearBottom) => {
        if (isNearBottom) {
          if (category === 'დამიტოვე') {
            daitoves = { ...daitoves, ...(await daitoveFetcher.fetch(firestore)) };
          } else if (category === 'გამიყოლე') {
            gaikoles = { ...gaikoles, ...(await gaikoleFetcher.fetch(firestore)) };
          }
        }
      });
  }
</script>

<nav class="sticky top-0 z-10 flex items-center justify-center h-16 select-none bg-stone-100">
  <form class="pb-2 w-fit h-fit">
    <label
      for="category-damitove"
      class="
        {category === 'დამიტოვე' ? 'selected-category' : 'unselected-category'}
        pb-1 mr-1
        cursor-pointer
      "
    >
      დამიტოვე
    </label>
    <input
      id="category-damitove"
      type="radio"
      name="category"
      value="დამიტოვე"
      bind:group={category}
      class="hidden"
    />

    <label
      for="category-gamikole"
      class="
        {category === 'გამიყოლე' ? 'selected-category' : 'unselected-category'}
        pb-1 ml-1
        cursor-pointer
      "
    >
      გამიყოლე
    </label>
    <input
      id="category-gamikole"
      type="radio"
      name="category"
      value="გამიყოლე"
      bind:group={category}
      class="hidden"
    />
  </form>
</nav>

<div class="flex items-center justify-center mx-4 space-x-2">
  {#if category === 'დამიტოვე'}
    <div>
      <select
        class="block form-select rounded-md border-0 py-1.5 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
        bind:value={daitoveFilters.district}
      >
        <option value={null}>აირჩიე უბანი</option>
        {#each sortedDistricts as district}
          <option>{district}</option>
        {/each}
      </select>
    </div>

    <div>
      <input
        class="block form-input rounded-md border-0 py-1.5 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
        type="number"
        bind:value={daitoveFilters.numberOfPeople}
        placeholder="რამდენი ადამიანი?"
        min="1"
      />
    </div>

    <div>
      <input
        class="block form-input rounded-md border-0 py-1.5 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 w-44"
        type="text"
        bind:this={datePicker}
        min={new Date().toLocaleDateString('en-CA')}
        bind:value={daitoveFilters.fromDate}
        placeholder="როდიდან?"
        on:focus={() => {
          if (datePicker) {
            datePicker.type = 'date';
          }
        }}
        on:blur={() => {
          if (datePicker && !daitoveFilters.fromDate) {
            datePicker.type = 'text';
          }
        }}
      />
    </div>
  {:else if category === 'გამიყოლე'}
    <div>
      <select
        class="block form-select rounded-md border-0 py-1.5 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
        bind:value={gaikoleFilters.departurePoint}
      >
        <option value={null}>აირჩიე ქალაქი</option>
        {#each sortedSettlements as settlement}
          <option>{settlement}</option>
        {/each}
      </select>
    </div>

    <div>
      <input
        class="block form-input rounded-md border-0 py-1.5 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
        type="number"
        bind:value={gaikoleFilters.numberOfPeople}
        placeholder="რამდენი ადამიანი?"
        min="1"
      />
    </div>

    <div>
      <input
        class="block form-input rounded-md border-0 py-1.5 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 w-44"
        type="text"
        bind:this={datePicker}
        min={new Date().toLocaleDateString('en-CA')}
        bind:value={gaikoleFilters.departureTime}
        placeholder="როდიდან?"
        on:focus={() => {
          if (datePicker) {
            datePicker.type = 'date';
          }
        }}
        on:blur={() => {
          if (datePicker && !gaikoleFilters.departureTime) {
            datePicker.type = 'text';
          }
        }}
      />
    </div>
  {/if}
</div>

<ul class="grid grid-cols-1 mx-16 lg:grid-cols-2 xl:grid-cols-3">
  {#if category === 'დამიტოვე'}
    {#each sortedDaitoves as daitove, i (daitove.id)}
      <li class="flex justify-center">
        <DaitoveCardShort
          index={i}
          id={daitove.id}
          district={daitove.district}
          numberOfPeople={daitove.numberOfPeople}
          fromDate={daitove.fromDate}
          tillDate={daitove.tillDate}
          foodIncluded={daitove.foodIncluded}
          authorUid={daitove.authorUid}
          authorName={daitove.authorName}
          phoneNumber={daitove.phoneNumber}
        />
      </li>
    {/each}
  {:else if category === 'გამიყოლე'}
    {#each sortedGaikoles as gaikole, i (gaikole.id)}
      <li class="flex justify-center">
        <GaikoleCardShort
          index={i}
          id={gaikole.id}
          departurePoint={gaikole.departurePoint}
          numberOfPeople={gaikole.numberOfPeople}
          departureTime={gaikole.departureTime}
          authorUid={gaikole.authorUid}
          authorName={gaikole.authorName}
          phoneNumber={gaikole.phoneNumber}
        />
      </li>
    {/each}
  {/if}
</ul>

<style lang="postcss">
  .selected-category {
    @apply font-medium text-gray-700 border-b border-green-800;
  }

  .unselected-category {
    @apply text-gray-500;
  }
</style>
