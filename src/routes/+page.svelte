<script lang="ts">
	import { Icon } from '$lib/components';
	import bgImage from '$lib/images/coming-soon-bg.jpg';
</script>

<div
	class="grid min-h-full grid-cols-1 grid-rows-[1fr,auto,1fr] bg-white lg:grid-cols-[max(50%,36rem),1fr]"
>
	<header
		class="w-full px-6 pt-6 mx-auto max-w-7xl sm:pt-10 lg:col-span-2 lg:col-start-1 lg:row-start-1 lg:px-8"
	>
		<a class="text-[#f00]" href="/">
			<span class="sr-only">Daitove.ge</span>
			<Icon name="ge_flag" class="w-auto h-10 sm:h-12" />
		</a>
	</header>

	<main
		class="w-full px-6 py-24 mx-auto max-w-7xl sm:py-32 lg:col-span-2 lg:col-start-1 lg:row-start-2 lg:px-8"
	>
		<div class="max-w-lg">
			<p class="text-base font-semibold leading-8 text-[#039]">DAITOVE.GE</p>
			<h1 class="mt-4 text-3xl font-bold tracking-tight text-gray-900 sm:text-5xl">
				🚌 საიტი გზაშია...
			</h1>
			<p class="mt-6 text-base leading-7 text-gray-600">
				საიტი მზადების პროცესშია და ძალიან მალე გაეშვება.
			</p>
			<div class="mt-10">
				<a
					href="https://www.facebook.com/groups/337755359323575"
					class="text-sm font-semibold leading-7 text-[#039]"
					target="_blank"><span aria-hidden="true">&larr;</span> შემოგვიერთი Facebook ჯგუფში</a
				>
			</div>
		</div>
	</main>

	<div class="hidden lg:relative lg:col-start-2 lg:row-start-1 lg:row-end-4 lg:block">
		<img
			src={bgImage}
			alt="აქცია პარლამენტის შენობასთან"
			class="absolute inset-0 object-cover w-full h-full"
		/>
	</div>
</div>
