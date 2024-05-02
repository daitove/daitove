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
  import DaitoveCard from '$lib/components/DaitoveCard.svelte';
  import DaitoveForm from '$lib/components/DaitoveForm.svelte';

  let category: 'daitove' | 'gaikole' = 'daitove';
  let showDaitoveForm = false;
  let showGaikoleForm = false;

  let daitoveList: Daitove[] = [];
  let gaikoleList: Gaikole[] = [];
  let lastDaitoveDoc: QueryDocumentSnapshot<DocumentData, DocumentData> | undefined = undefined;
  let lastGaikoleDoc: QueryDocumentSnapshot<DocumentData, DocumentData> | undefined = undefined;

  onMount(async () => {
    await fetchDaitove();
    await fetchGaikole();
  });

  async function fetchDaitove() {
    const snapshot = await getDocs(
      query(
        collection(firestore, 'daitove'),
        where('tillDate', '>', Timestamp.now()),
        orderBy('fromDate'),
        ...(lastDaitoveDoc ? [startAfter(lastDaitoveDoc)] : []),
        limit(32)
      )
    );
    lastDaitoveDoc = snapshot.docs[snapshot.docs.length - 1];
    snapshot.forEach((doc) => {
      const data = doc.data();
      daitoveList.push({
        numberOfPeople: data.numberOfPeople as number,
        fromDate: data.fromDate.toDate() as Date,
        tillDate: data.tillDate.toDate() as Date,
        district: data.district as string,
        foodIncluded: data.foodIncluded as boolean,
        phoneNumber: data.phoneNumber as string
      });
    });
    daitoveList = daitoveList;
  }

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
          fetchDaitove();
        } else if (category === 'gaikole') {
          fetchGaikole();
        }
      }
    });

  interface Daitove {
    numberOfPeople: number;
    fromDate: Date;
    tillDate: Date;
    district: string;
    foodIncluded: boolean;
    phoneNumber: string;
  }

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

{#if category === 'daitove'}
  <ul>
    {#each daitoveList as daitove}
      <li>
        <DaitoveCard
          numberOfPeople={daitove.numberOfPeople}
          fromDate={daitove.fromDate}
          tillDate={daitove.tillDate}
          district={daitove.district}
          foodIncluded={daitove.foodIncluded}
          phoneNumber={daitove.phoneNumber}
        />
      </li>
    {/each}
  </ul>

  <DaitoveForm bind:showDaitoveForm />
  <button on:click={() => (showDaitoveForm = true)}>დაიტოვე!</button>
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
