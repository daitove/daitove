<script lang="ts">
  import { onMount } from 'svelte';
  import {
    getDocs,
    collection,
    query,
    where,
    orderBy,
    limit,
    startAfter,
    Timestamp,
    type QueryDocumentSnapshot,
    type DocumentData
  } from 'firebase/firestore/lite';
  import { fromEvent } from 'rxjs';
  import { debounceTime, map, pairwise, filter } from 'rxjs/operators';

  import { firestore } from '$lib/firebase';
  import GaikoleCardShort from '$lib/components/GaikoleCardShort.svelte';
  import GaikoleFormShort from '$lib/components/GaikoleFormShort.svelte';

  let category: 'daitove' | 'gaikole' = 'daitove';
  let showGaikoleForm = false;

  let gaikoleList: Gaikole[] = [];
  let lastGaikoleDoc: QueryDocumentSnapshot<DocumentData, DocumentData> | undefined = undefined;

  onMount(() => fetchGaikole());

  async function fetchGaikole() {
    const snapshot = await getDocs(
      query(
        collection(firestore, 'gaikole'),
        where('departureTime', '>', Timestamp.now()),
        orderBy('departureTime'),
        ...(lastGaikoleDoc ? [startAfter(lastGaikoleDoc)] : []),
        limit(32)
      )
    );
    lastGaikoleDoc = snapshot.docs[snapshot.docs.length - 1];
    snapshot.forEach((doc) => {
      const data = doc.data();
      gaikoleList.push({
        departurePoint: data.departurePoint as string,
        numberOfPeople: data.numberOfPeople as number,
        departureTime: data.departureTime.toDate() as Date,
        phoneNumber: data.phoneNumber as string
      });
    });
    gaikoleList = gaikoleList;
  }

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
    .subscribe((isNearBottom) => {
      if (isNearBottom) {
        if (category === 'daitove') {
          console.log('TODO');
        } else if (category === 'gaikole') {
          fetchGaikole();
        }
      }
    });

  interface Gaikole {
    departurePoint: string;
    numberOfPeople: number;
    departureTime: Date;
    phoneNumber: string;
  }
</script>

<nav>
  <ul>
    <li><a href="#top" on:click={() => (category = 'daitove')}>დაიტოვე</a></li>
    <li><a href="#top" on:click={() => (category = 'gaikole')}>გაიყოლე</a></li>
  </ul>
</nav>

<p>{category}</p>

{#if category === 'daitove'}
  <ul><li>დატიე</li></ul>
{:else if category === 'gaikole'}
  <ul>
    {#each gaikoleList as gaikole}
      <li>
        <GaikoleCardShort
          departurePoint={gaikole.departurePoint}
          numberOfPeople={gaikole.numberOfPeople}
          departureTime={gaikole.departureTime}
          phoneNumber={gaikole.phoneNumber}
        />
      </li>
    {/each}
  </ul>

  <GaikoleFormShort bind:showGaikoleForm />
  <button on:click={() => (showGaikoleForm = true)}>გაიყოლე!</button>
{/if}
