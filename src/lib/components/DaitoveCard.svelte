<script lang="ts">
  import { getMonth } from '$lib/datetime';
  import checkIcon from '$lib/images/check-icon.svg';
  import phoneIcon from '$lib/images/phone-icon.svg';
  import copyIcon from '$lib/images/copy-icon.svg';
  // const imageUrl: string =
  //   $$props.imageUrl ||
  //   'https://www.pngkey.com/png/full/233-2332677_image-500580-placeholder-transparent.png';
  // const imageDescription: string = $$props.imageDescription || 'ოთახის ფოტო';
  const district: string = $$props.district || 'თავისუფლება';
  const address: string = $$props.address || 'რუსთაველის გამზირი 8';
  const fromDate: Date = $$props.fromDate || new Date();
  const tillDate: Date = $$props.tillDate || new Date();
  const numberOfPeople: number = $$props.numberOfPeople || 1;
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
      {getMonth(fromDate)} - {tillDate.getDate()}
      {getMonth(tillDate)}
    </div>
    <div class="flex items-center gap-2">
      <a href="tel:+555123123" class="hover:opacity-60">
        <button
          class="flex items-center gap-2 mt-5 rounded-md px-3 py-2 border border-dashed border-gray-200 bg-gray-100"
        >
          <img src={phoneIcon} alt="" />
          555123123
        </button>
      </a>
      <button
        on:click={() => navigator.clipboard.writeText('55512312')}
        class="hover:opacity-60 pt-4"
      >
        <img class="w-5 h-5" src={copyIcon} alt="" />
      </button>
    </div>
  </figcaption>
</figure>
