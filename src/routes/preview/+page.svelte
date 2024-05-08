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

  let category: 'დამიტოვე' | 'გამიყოლე' = 'დამიტოვე';
  let daitoves: { [key: string]: Daitove } = {};
  let daitoveFetcher = new DaitoveFetcher();
  let gaikoles: { [key: string]: Gaikole } = {};
  let gaikoleFetcher = new GaikoleFetcher();
  $: sortedDaitoves = Object.values(daitoves).sort(
    (a, b) => a.fromDate.getTime() - b.fromDate.getTime()
  );
  $: sortedGaikoles = Object.values(gaikoles).sort(
    (a, b) => a.departureTime.getTime() - b.departureTime.getTime()
  );

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
