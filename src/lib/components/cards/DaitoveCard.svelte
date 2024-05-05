<!-- <script lang="ts">
  import months from '$lib/months.json';
  import checkIcon from '$lib/images/check-icon.svg';
  import phoneIcon from '$lib/images/phone-icon.svg';
  import copyIcon from '$lib/images/copy-icon.svg';

  // const imageUrl: string =
  //   $$props.imageUrl ||
  //   'https://www.pngkey.com/png/full/233-2332677_image-500580-placeholder-transparent.png';
  // const imageDescription: string = $$props.imageDescription || 'ოთახის ფოტო';
  const district: string = $$props.district;
  const address: string = $$props.address;
  const fromDate: Date = $$props.fromDate;
  const tillDate: Date = $$props.tillDate;
  const numberOfPeople: number = $$props.numberOfPeople;

  const duration: number = Math.floor(
    (tillDate.getTime() - fromDate.getTime()) / (24 * 60 * 60 * 1000)
  );
</script>

<figure class="relative w-full max-w-[259px]">
  <div class="rounded-xl bg-gray-200 w-[259px] h-[279px]" />
  <img src={checkIcon} alt="Check Icon" class="absolute -top-2.5 -left-3" />
  <section class="flex items-center gap-2 absolute top-3 right-3">
    <p class="text-primary-900 font-medium shadow-xl bg-white rounded-md px-2 py-1">
      {numberOfPeople ?? 0} ადამიანი
    </p>
    <p class="text-primary-900 font-medium shadow-xl bg-white rounded-md px-2 py-1">
      {duration ?? 0} დღით
    </p>
  </section>
  <figcaption>
    <div class="text-primary-900 font-bold">{district}, {address}</div>

    <div class="text-primary-900 font-medium opacity-50 text-sm">
      {fromDate.getDate()}
      {months[fromDate.getMonth()]} - {tillDate.getDate()}
      {months[tillDate.getMonth()]}
    </div>
    <div class="flex items-center gap-2">
      <a href="tel:+995505102030" class="hover:opacity-60">
        <button
          class="flex items-center gap-2 mt-5 rounded-md px-3 py-2 border border-dashed border-gray-200 bg-gray-100"
        >
          <img src={phoneIcon} alt="" />
          555123123
        </button>
      </a>
      <button
        on:click={() => navigator.clipboard.writeText('505102030')}
        class="hover:opacity-60 pt-4"
      >
        <img class="w-5 h-5" src={copyIcon} alt="" />
      </button>
    </div>
  </figcaption>
</figure> -->
