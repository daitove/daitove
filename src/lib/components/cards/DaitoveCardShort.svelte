<script lang="ts">
  import months from '$lib/months.json';
  import { formatPhoneNumber } from '$lib/formatting';

  import DistrictMap from '$lib/components/DistrictMap.svelte';
  import IconPhone from '$lib/components/icons/IconPhone.svelte';
  import IconUser from '$lib/components/icons/IconUser.svelte';

  const id: string = $$props.id;
  const index: number = $$props.index;
  const district: string = $$props.district;
  const numberOfPeople: number = $$props.numberOfPeople;
  const fromDate: Date = $$props.fromDate;
  const tillDate: Date = $$props.tillDate;
  const authorUid: string = $$props.authorUid;
  const authorName: string = $$props.authorName;
  const phoneNumber: string = $$props.phoneNumber;

  const duration: number = Math.floor(
    (tillDate.getTime() - fromDate.getTime()) / (24 * 60 * 60 * 1000)
  );
</script>

<section
  {id}
  class="relative m-4 text-gray-700 h-36 min-w-96 animate-fade-in-right"
  style="animation-delay: {index * 0.2}s"
>
  <slot />
  <div class="absolute top-0 left-0 w-36">
    <DistrictMap {district} />
  </div>
  <h3 class="absolute text-base font-medium left-36 top-2">
    {district}
  </h3>
  <p class="absolute text-sm left-36 top-10">
    დავიტოვებ {numberOfPeople} ადამიანს {duration} დღით
    <br />
    {#if fromDate.getMonth() === tillDate.getMonth()}
      {fromDate.getDate()}-დან
      {tillDate.getDate()}
      {months.till[tillDate.getMonth()]}
    {:else}
      {fromDate.getDate()}
      {months.from[fromDate.getMonth()]}
      {tillDate.getDate()}
      {months.till[tillDate.getMonth()]}
    {/if}
  </p>
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
</section>
