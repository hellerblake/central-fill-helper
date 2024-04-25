<script>
	export let accepted = 120;
	export let filled = 110;
</script>

<div class="mx-auto flex w-11/12 rounded bg-base-200">
	<div class="w-1/2 flex-none p-3">
		<div class="text-xs font-bold text-gray-400">3-7-24 @ 9:30am</div>
		<div class="text-lg font-bold">P0307401</div>
	</div>
	<div class="w-1/2 flex-none p-1 pl-4">
		<div class="relative h-full w-full">
			<svg class="absolute h-full w-full stroke-neutral-content stroke-2" viewBox="0 0 165 56">
				<line x1="40" y1="56" x2="125" y2="0" />
			</svg>
			<div class="text-xs font-bold text-gray-400">FILLED</div>
			<div class="flex justify-between text-lg font-bold">
				<span>{filled}</span> <span>{accepted}</span>
			</div>
			<div class="text-right text-xs font-bold text-gray-400">ACCEPTED</div>
		</div>
	</div>
</div>
