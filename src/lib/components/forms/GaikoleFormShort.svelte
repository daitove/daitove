<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import { addDoc, collection, Timestamp } from 'firebase/firestore/lite';

  import { formatPhoneNumber } from '$lib/formatting';
  import { filterNumericInput } from '$lib/filters';
  import { auth, firestore } from '$lib/firebase';
  import { bestMatchFactory } from '$lib/sorting';
  import months from '$lib/months.json';
  import settlements from '$lib/settlements.json';
  import RegionMap from '$lib/components/RegionMap.svelte';
  import IconPhone from '$lib/components/icons/IconPhone.svelte';
  import IconUser from '$lib/components/icons/IconUser.svelte';
  import IconSend from '$lib/components/icons/IconSend.svelte';

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  let departurePoint = '';
  let numberOfPeople = '';
  let departureDate = today.getDate().toString();
  let departureMonth = months.when[today.getMonth()];
  let departureHour = '';
  let departureMinute = '';

  const authorUid: string = auth.currentUser!.uid;
  const authorName: string = auth.currentUser!.displayName!.split(' ')[0];
  const phoneNumber: string = auth.currentUser!.phoneNumber!;

  $: departureTime = new Date(
    today.getFullYear(),
    months.when.indexOf(departureMonth),
    parseInt(departureDate),
    parseInt(departureHour),
    parseInt(departureMinute)
  );

  const dispatch = createEventDispatcher();

  async function publish() {
    const doc = await addDoc(collection(firestore, 'gaikole'), {
      departurePoint: departurePoint.trim(),
      numberOfPeople: parseInt(numberOfPeople),
      departureTime: Timestamp.fromDate(departureTime),
      authorUid: auth.currentUser!.uid,
      authorName: auth.currentUser!.displayName?.split(' ')[0],
      phoneNumber: auth.currentUser!.phoneNumber,
      createdAt: Timestamp.now()
    });

    departurePoint = '';
    numberOfPeople = '';
    departureDate = today.getDate().toString();
    departureMonth = months.when[today.getMonth()];
    departureHour = '';
    departureMinute = '';

    dispatch('publish', { docId: doc.id, docPath: doc.path });
  }

  let fromMonthInputFocused = false;
  let sortedMonths = [
    ...months.when.slice(today.getMonth()),
    ...months.when.slice(0, today.getMonth())
  ];
  let departurePointInputFocused = false;
  let sortedSettlements = Object.values(settlements)
    .flat()
    .sort((a, b) => b.population - a.population)
    .map((el) => el.name);

  function onDeparturePointInput(this: HTMLInputElement) {
    departurePoint = this.value.replace(/[^ა-ჰ]/g, '');
    if (departurePoint) {
      sortedSettlements = sortedSettlements.sort(bestMatchFactory(departurePoint));
    } else {
      sortedSettlements = Object.values(settlements)
        .flat()
        .sort((a, b) => b.population - a.population)
        .map((el) => el.name);
    }
  }

  function onMonthsInput(this: HTMLInputElement) {
    departureMonth = this.value.replace(/[^ა-ჰ]/g, '');
    if (departureMonth) {
      sortedMonths = months.when.sort(bestMatchFactory(departureMonth));
    } else {
      sortedMonths = [
        ...months.when.slice(today.getMonth()),
        ...months.when.slice(0, today.getMonth())
      ];
    }
  }

  $: region = Object.fromEntries(
    Object.entries(settlements).flatMap(([region, settlementList]) =>
      settlementList.map((settlement) => [settlement.name, region])
    )
  )[departurePoint];

  $: isGaikoleValid =
    sortedSettlements.indexOf(departurePoint) !== -1 &&
    parseInt(departureHour) <= 24 &&
    parseInt(departureMinute) < 60 &&
    months.when.indexOf(departureMonth) !== -1 &&
    parseInt(departureDate) <= getDayCount(months.when.indexOf(departureMonth));

  const getDayCount = (month: number) => new Date(today.getFullYear(), month + 1, 0).getDate();
</script>

<form class="relative z-10 m-4 text-gray-700 h-36 min-w-96 animate-fade-in-down">
  <div class="absolute top-5 left-1 w-[8.5rem]">
    <RegionMap {region} />
  </div>
  <input
    type="text"
    placeholder="ბათუმი"
    on:focus={() => {
      departurePoint = '';
      departurePointInputFocused = true;
    }}
    on:blur={() => {
      departurePointInputFocused = false;
    }}
    on:input={onDeparturePointInput}
    bind:value={departurePoint}
    class="absolute w-32 h-6 overflow-hidden text-base font-medium border-b border-gray-700 outline-none appearance-none left-36 top-2 bg-inherit focus:bg-inherit"
  />
  {#if departurePointInputFocused}
    <ul class="absolute z-10 w-32 overflow-auto left-36 top-8 max-h-64 bg-stone-200">
      {#each sortedSettlements as settlement}
        <li class="h-6">
          <button
            class="w-full text-left hover:cursor-pointer hover:bg-stone-100"
            on:mousedown={() => (departurePoint = settlement)}
          >
            {settlement}
          </button>
        </li>
      {/each}
    </ul>
  {/if}
  <p class="absolute text-sm left-36 top-10">
    გავიყოლებ
    <input
      inputmode="numeric"
      type="text"
      placeholder="2"
      minlength="1"
      maxlength="2"
      on:input={filterNumericInput}
      bind:value={numberOfPeople}
      class="w-4 text-right border-b border-gray-700 outline-none bg-inherit focus:bg-inherit"
    />
    ადამიანს
    <br />
    <span class="absolute top-5 w-14">გასვლა</span>
    <input
      inputmode="numeric"
      type="text"
      placeholder={today.getDate().toString()}
      minlength="1"
      maxlength="2"
      on:mousedown={() => (departureDate = '')}
      on:input={filterNumericInput}
      bind:value={departureDate}
      class="absolute w-4 h-5 border-b border-gray-700 outline-none top-5 left-14 bg-inherit focus:bg-inherit"
    />
    <input
      type="text"
      placeholder={months.when[today.getMonth()]}
      on:focus={() => {
        departureMonth = '';
        fromMonthInputFocused = true;
      }}
      on:blur={() => {
        fromMonthInputFocused = false;
      }}
      on:input={onMonthsInput}
      bind:value={departureMonth}
      class="absolute w-24 h-5 border-b border-gray-700 outline-none top-5 left-20 bg-inherit focus:bg-inherit"
    />
    {#if fromMonthInputFocused}
      <ul class="absolute z-10 w-24 top-10 left-20 bg-stone-200">
        {#each sortedMonths as month}
          <li>
            <button
              class="w-full text-left hover:cursor-pointer hover:bg-stone-100"
              on:mousedown={() => (departureMonth = month)}
            >
              {month}
            </button>
          </li>
        {/each}
      </ul>
    {/if}
    <input
      inputmode="numeric"
      type="text"
      placeholder="14"
      minlength="1"
      maxlength="2"
      on:mousedown={() => (departureHour = '')}
      on:input={filterNumericInput}
      bind:value={departureHour}
      class="absolute top-5 left-[11.5rem] w-4 h-5 bg-inherit outline-none border-b border-gray-700 focus:bg-inherit"
    />
    <span class="absolute top-5 left-[12.625rem]">:</span>
    <input
      inputmode="numeric"
      type="text"
      placeholder="30"
      minlength="1"
      maxlength="2"
      on:mousedown={() => (departureMinute = '')}
      on:input={filterNumericInput}
      bind:value={departureMinute}
      class="absolute w-4 h-5 border-b border-gray-700 outline-none top-5 left-52 bg-inherit focus:bg-inherit"
    />
  </p>
  {#if isGaikoleValid}
    <button on:click={publish} class="absolute right-0 w-6 h-6 text-green-800 top-2 fx-click">
      <IconSend />
    </button>
  {:else}
    <div class="absolute right-0 w-6 h-6 text-red-800 top-2">
      <IconSend />
    </div>
  {/if}
  <a href="/profiles/{authorUid}" class="absolute left-36 top-[5.5rem] text-sm fx-click group">
    <div class="inline-block h-4 w-4 translate-y-[0.2rem] text-gray-800">
      <IconUser />
    </div>
    <div class="inline-block">
      {authorName}
    </div>
  </a>
  <a
    href="tel:{phoneNumber}"
    class="absolute right-0 top-[5.5rem] flex text-sm text-green-800 fx-click"
  >
    <div class="inline-block px-1 border border-green-800 rounded-tl-lg rounded-bl-lg">
      <div class="inline-block w-3 h-3">
        <IconPhone />
      </div>
    </div>
    <div
      class="inline-block px-1 border-green-800 border-y-[1px] border-r-[1px] rounded-tr-lg rounded-br-lg"
    >
      {formatPhoneNumber(phoneNumber)}
    </div>
  </a>
</form>

<style lang="postcss">
  input {
    border-radius: 0;
    appearance: none;
    -webkit-appearance: none;
  }
</style>
