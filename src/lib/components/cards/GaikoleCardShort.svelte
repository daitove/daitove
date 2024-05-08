<script lang="ts">
  import months from '$lib/months.json';
  import { formatPhoneNumber, formatTime } from '$lib/formatting';

  import RegionMap from '$lib/components/RegionMap.svelte';
  import IconPhone from '$lib/components/icons/IconPhone.svelte';
  import IconUser from '$lib/components/icons/IconUser.svelte';
  import settlements from '$lib/settlements.json';

  const id: string = $$props.id;
  const index: number = $$props.index;
  const departurePoint: string = $$props.departurePoint;
  const numberOfPeople: number = $$props.numberOfPeople;
  const departureTime: Date = $$props.departureTime;
  const authorUid: string = $$props.authorUid;
  const authorName: string = $$props.authorName;
  const phoneNumber: string = $$props.phoneNumber;

  $: region = Object.fromEntries(
    Object.entries(settlements).flatMap(([region, settlementList]) =>
      settlementList.map((settlement) => [settlement.name, region])
    )
  )[departurePoint];
</script>

<section
  {id}
  class="relative m-4 text-gray-700 h-36 min-w-96 animate-fade-in-right"
  style="animation-delay: {index * 0.2}s"
>
  <slot />
  <div class="absolute top-5 left-1 w-[8.5rem]">
    <RegionMap {region} />
  </div>
  <h3 class="absolute text-base font-medium left-36 top-2">
    {departurePoint}
  </h3>
  <p class="absolute text-sm left-36 top-10">
    გავიყოლებ {numberOfPeople} ადამიანს
    <br />
    გასვლა
    {departureTime.getDate()}
    {months.when[departureTime.getMonth()].slice(0, -1)}ს,
    {formatTime(departureTime)}-ზე
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
