<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import { addDoc, collection, Timestamp } from 'firebase/firestore/lite';

  import { formatPhoneNumber } from '$lib/formatting';
  import { filterNumericInput } from '$lib/filters';
  import { auth, firestore } from '$lib/firebase';
  import months from '$lib/months.json';
  import districts from '$lib/districts.json';
  import DistrictMap from '$lib/components/DistrictMap.svelte';
  import IconPhone from '$lib/components/icons/IconPhone.svelte';
  import IconUser from '$lib/components/icons/IconUser.svelte';
  import { bestMatchFactory } from '$lib/sorting';
  import IconSend from '$lib/components/icons/IconSend.svelte';

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  let district = '';
  let numberOfPeople = '';
  let duration = '';
  let fromDate = today.getDate().toString();
  let fromMonth = months.from[today.getMonth()];

  const authorUid: string = auth.currentUser!.uid;
  const authorName: string = auth.currentUser!.displayName!.split(' ')[0];
  const phoneNumber: string = auth.currentUser!.phoneNumber!;

  $: fromDate_ = new Date(today.getFullYear(), months.from.indexOf(fromMonth), parseInt(fromDate));

  const dispatch = createEventDispatcher();

  async function publish() {
    const tillDate = new Date(fromDate_);
    tillDate.setDate(tillDate.getDate() + parseInt(duration));

    const doc = await addDoc(collection(firestore, 'daitove'), {
      authorUid: auth.currentUser!.uid,
      authorName: auth.currentUser!.displayName?.split(' ')[0],
      phoneNumber: auth.currentUser!.phoneNumber,
      district: district,
      numberOfPeople: parseInt(numberOfPeople),
      fromDate: Timestamp.fromDate(fromDate_),
      tillDate: Timestamp.fromDate(tillDate),
      createdAt: Timestamp.now()
    });

    district = '';
    numberOfPeople = '';
    duration = '';

    dispatch('publish', { docId: doc.id, docPath: doc.path });
  }

  let districtInputFocused = false;
  let fromMonthInputFocused = false;
  let sortedDistricts = Array.from(districts);
  let sortedMonths = [
    ...months.from.slice(today.getMonth()),
    ...months.from.slice(0, today.getMonth())
  ];

  function onDistrictInput(this: HTMLInputElement) {
    district = this.value.replace(/[^ა-ჰ]/g, '');
    if (district) {
      sortedDistricts = districts.sort(bestMatchFactory(district));
    } else {
      sortedDistricts = Array.from(districts);
    }
  }

  function onMonthsInput(this: HTMLInputElement) {
    fromMonth = this.value.replace(/[^ა-ჰ]/g, '');
    if (fromMonth) {
      sortedMonths = months.from.sort(bestMatchFactory(fromMonth));
    } else {
      sortedMonths = [
        ...months.from.slice(today.getMonth()),
        ...months.from.slice(0, today.getMonth())
      ];
    }
  }

  $: isDaitoveValid =
    districts.indexOf(district) !== -1 &&
    months.from.indexOf(fromMonth) !== -1 &&
    parseInt(fromDate) <= getDayCount(months.from.indexOf(fromMonth));

  const getDayCount = (month: number) => new Date(today.getFullYear(), month + 1, 0).getDate();
</script>

<form class="relative z-10 m-4 text-gray-700 h-36 min-w-96 animate-fade-in-down">
  <div class="absolute top-0 left-0 h-36 w-36">
    <DistrictMap {district} />
  </div>
  <input
    type="text"
    placeholder="მთაწმინდა"
    on:focus={() => {
      district = '';
      districtInputFocused = true;
    }}
    on:blur={() => {
      districtInputFocused = false;
    }}
    on:input={onDistrictInput}
    bind:value={district}
    class="absolute w-32 h-6 overflow-hidden text-base font-medium border-b border-gray-700 outline-none appearance-none left-36 top-2 bg-inherit focus:bg-inherit"
  />
  {#if districtInputFocused}
    <ul class="absolute z-10 w-32 left-36 top-8 bg-stone-200">
      {#each sortedDistricts as dst}
        <li>
          <button
            class="w-full text-left hover:cursor-pointer hover:bg-stone-100"
            on:mousedown={() => (district = dst)}
          >
            {dst}
          </button>
        </li>
      {/each}
    </ul>
  {/if}
  <p class="absolute text-sm left-36 top-10">
    დავიტოვებ
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
    <input
      inputmode="numeric"
      type="text"
      placeholder="3"
      minlength="1"
      maxlength="2"
      on:input={filterNumericInput}
      bind:value={duration}
      class="w-4 text-right border-b border-gray-700 outline-none bg-inherit focus:bg-inherit"
    />
    დღით
    <br />
    <input
      inputmode="numeric"
      type="text"
      placeholder={today.getDate().toString()}
      minlength="1"
      maxlength="2"
      on:mousedown={() => (fromDate = '')}
      on:input={filterNumericInput}
      bind:value={fromDate}
      class="absolute w-4 h-5 border-b border-gray-700 outline-none top-5 bg-inherit focus:bg-inherit"
    />
    <input
      type="text"
      placeholder={months.from[today.getDate()]}
      on:focus={() => {
        fromMonth = '';
        fromMonthInputFocused = true;
      }}
      on:blur={() => {
        fromMonthInputFocused = false;
      }}
      on:input={onMonthsInput}
      bind:value={fromMonth}
      class="absolute h-5 border-b border-gray-700 outline-none left-5 top-5 w-28 bg-inherit focus:bg-inherit"
    />
    {#if fromMonthInputFocused}
      <ul class="absolute z-10 left-5 top-10 w-28 bg-stone-200">
        {#each sortedMonths as month}
          <li>
            <button
              class="w-full text-left hover:cursor-pointer hover:bg-stone-100"
              on:mousedown={() => (fromMonth = month)}
            >
              {month}
            </button>
          </li>
        {/each}
      </ul>
    {/if}
  </p>
  {#if isDaitoveValid}
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
