<script lang="ts">
  import { afterNavigate } from '$app/navigation';
  import { browser } from '$app/environment';
  import { onAuthStateChanged, type User } from 'firebase/auth';
  import { doc, getDoc, deleteDoc, where } from 'firebase/firestore/lite';
  import { fromEvent } from 'rxjs';
  import { debounceTime, map, pairwise, filter } from 'rxjs/operators';

  import { auth, firestore } from '$lib/firebase';
  import Daitove from '$lib/classes/Daitove';
  import Gaikole from '$lib/classes/Gaikole';
  import DaitoveCardShort from '$lib/components/cards/DaitoveCardShort.svelte';
  import GaikoleCardShort from '$lib/components/cards/GaikoleCardShort.svelte';
  import DaitoveFormShort from '$lib/components/forms/DaitoveFormShort.svelte';
  import GaikoleFormShort from '$lib/components/forms/GaikoleFormShort.svelte';
  import IconPlus from '$lib/components/icons/IconPlus.svelte';
  import IconMinus from '$lib/components/icons/IconMinus.svelte';
  import IconTrash from '$lib/components/icons/IconTrash.svelte';
  import DaitoveFetcher from '$lib/classes/DaitoveFetcher';
  import GaikoleFetcher from '$lib/classes/GaikoleFetcher';

  export let data;

  let category: 'daitove' | 'gaikole' = 'daitove';
  let daitoves: { [key: string]: Daitove } = {};
  let daitoveFetcher = new DaitoveFetcher();
  let gaikoles: { [key: string]: Gaikole } = {};
  let gaikoleFetcher = new GaikoleFetcher();
  let user: User | null = null;
  let showDaitoveForm = false;
  let showGaikoleForm = false;
  $: showDaitoveForm = showDaitoveForm && category === 'daitove' && data.uid === user?.uid;
  $: showGaikoleForm = showGaikoleForm && category === 'gaikole' && data.uid === user?.uid;
  $: sortedDaitoves = Object.values(daitoves).sort(
    (a, b) => b.createdAt.getTime() - a.createdAt.getTime()
  );
  $: sortedGaikoles = Object.values(gaikoles).sort(
    (a, b) => b.createdAt?.getTime() - a.createdAt?.getTime()
  );

  onAuthStateChanged(auth, (usr) => (user = usr));

  const onDelete = async (model: Daitove | Gaikole) => {
    if (confirm('ნამდვილად გსურთ განცხადების წაშლა?')) {
      handleDelete(model);
    }
  };

  const handleDelete = async (model: Daitove | Gaikole) => {
    if (model instanceof Daitove) {
      await deleteDoc(doc(firestore, 'daitove', model.id));
      delete daitoves[model.id];
      daitoves = { ...daitoves };
    } else if (model instanceof Gaikole) {
      await deleteDoc(doc(firestore, 'gaikole', model.id));
      delete gaikoles[model.id];
      gaikoles = { ...gaikoles };
    }
  };

  afterNavigate(async () => {
    daitoves = {
      ...daitoves,
      ...(await daitoveFetcher.fetch(firestore, 72, where('authorUid', '==', data.uid)))
    };
    gaikoles = {
      ...gaikoles,
      ...(await gaikoleFetcher.fetch(firestore, 72, where('authorUid', '==', data.uid)))
    };
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
          if (category === 'daitove') {
            daitoves = {
              ...daitoves,
              ...(await daitoveFetcher.fetch(firestore, 36, where('authorUid', '==', data.uid)))
            };
          } else if (category === 'gaikole') {
            gaikoles = {
              ...gaikoles,
              ...(await gaikoleFetcher.fetch(firestore, 36, where('authorUid', '==', data.uid)))
            };
          }
        }
      });
  }
</script>

<nav class="sticky top-0 z-10 flex items-center justify-center h-16 select-none bg-stone-100">
  <form class="relative pb-2 w-fit h-fit">
    <label
      for="category-damitove"
      class="
        {category === 'daitove' ? 'selected-category' : 'unselected-category'}
        pb-1 mr-1
        cursor-pointer
      "
    >
      {data.uid === user?.uid ? 'ვიტოვებ' : 'იტოვებს'}
    </label>
    <input
      id="category-damitove"
      type="radio"
      name="category"
      value="daitove"
      bind:group={category}
      class="hidden"
    />
    {#if category === 'daitove' && data.uid === user?.uid}
      {#if showDaitoveForm}
        <button
          on:click={() => (showDaitoveForm = false)}
          class="absolute w-5 h-5 text-green-800 top-1 -left-6 fx-rotate"
        >
          <IconMinus />
        </button>
      {:else}
        <button
          on:click={() => (showDaitoveForm = true)}
          class="absolute w-5 h-5 text-green-800 top-1 -left-6 fx-rotate"
        >
          <IconPlus />
        </button>
      {/if}
    {/if}

    <label
      for="category-gamikole"
      class="
        {category === 'gaikole' ? 'selected-category' : 'unselected-category'}
        pb-1 ml-1
        cursor-pointer
      "
    >
      {data.uid === user?.uid ? 'ვიყოლებ' : 'იყოლებს'}
    </label>
    <input
      id="category-gamikole"
      type="radio"
      name="category"
      value="gaikole"
      bind:group={category}
      class="hidden"
    />
    {#if category === 'gaikole' && data.uid === user?.uid}
      {#if showGaikoleForm}
        <button
          on:click={() => (showGaikoleForm = false)}
          class="absolute w-5 h-5 text-green-800 top-1 -right-6 fx-rotate"
        >
          <IconMinus />
        </button>
      {:else}
        <button
          on:click={() => (showGaikoleForm = true)}
          class="absolute w-5 h-5 text-green-800 top-1 -right-6 fx-rotate"
        >
          <IconPlus />
        </button>
      {/if}
    {/if}
  </form>
</nav>

<ul class="grid grid-cols-1 mx-16 lg:grid-cols-2 xl:grid-cols-3">
  <li class="flex justify-center col-span-full">
    {#if showDaitoveForm}
      <DaitoveFormShort
        on:publish={async (e) => {
          const d = await getDoc(doc(firestore, e.detail.docPath));
          daitoves[d.id] = Daitove.fromDoc(d);
          daitoves = { ...daitoves };
        }}
      />
    {:else if showGaikoleForm}
      <GaikoleFormShort
        on:publish={async (e) => {
          const d = await getDoc(doc(firestore, e.detail.docPath));
          gaikoles[d.id] = Gaikole.fromDoc(d);
          gaikoles = { ...gaikoles };
        }}
      />
    {/if}
  </li>
  {#if category === 'daitove'}
    {#each sortedDaitoves as daitove, i (daitove.id)}
      <li class="flex justify-center">
        <DaitoveCardShort
          index={i}
          id={daitove.id}
          district={daitove.district}
          numberOfPeople={daitove.numberOfPeople}
          fromDate={daitove.fromDate}
          tillDate={daitove.tillDate}
          authorUid={daitove.authorUid}
          authorName={daitove.authorName}
          phoneNumber={daitove.phoneNumber}
        >
          <button
            on:click={() => onDelete(daitove)}
            class="absolute right-0 w-5 h-5 text-red-800 top-2 fx-click"
          >
            <IconTrash />
          </button>
        </DaitoveCardShort>
      </li>
    {/each}
  {:else if category === 'gaikole'}
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
        >
          <button
            on:click={() => onDelete(gaikole)}
            class="absolute right-0 w-5 h-5 text-red-800 top-2 fx-click"
          >
            <IconTrash />
          </button>
        </GaikoleCardShort>
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
