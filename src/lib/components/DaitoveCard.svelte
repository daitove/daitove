<script lang="ts">
  import { getMonth } from '$lib/datetime';

  const imageUrl: string =
    $$props.imageUrl ||
    'https://www.pngkey.com/png/full/233-2332677_image-500580-placeholder-transparent.png';
  const imageDescription: string = $$props.imageDescription || 'ოთახის ფოტო';
  const district: string = $$props.district || 'თავისუფლება';
  const address: string = $$props.address || 'რუსთაველის გამზირი 8';
  const fromDate: Date = $$props.fromDate || new Date();
  const tillDate: Date = $$props.tillDate || new Date();
  const numberOfPeople: number = $$props.numberOfPeople || 1;
  const duration: number = Math.floor(
    (tillDate.getTime() - fromDate.getTime()) / (24 * 60 * 60 * 1000)
  );
</script>

<figure class="">
  <img src={imageUrl} alt={imageDescription} />
  <figcaption>
    <div>{district}, {address}</div>
    <div>{fromDate.getDate()} {getMonth(fromDate)} - {tillDate.getDate()} {getMonth(tillDate)}</div>
    <div>{numberOfPeople} ადამიანი</div>
    <div>{duration} დღით</div>
  </figcaption>
</figure>
