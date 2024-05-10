<script>
	import rackStore, { sizesAvalible } from '$lib/stores/rack.store';

	/** @type {string} */
	export let rackId;
	/**
	 * @type {Array<import('$lib/stores/rack.store').RackSize>}
	 */
	export let sizes = [];

	/**
	 * Handle event from select element and retrieve selected value.
	 * @param {Event & { currentTarget: EventTarget & HTMLSelectElement; }} event - The event object with a specific type signature.
	 */
	function handleCreateSize(event) {
		rackStore.createRackSize(rackId, event.currentTarget.value);
		event.currentTarget.value = 'default';
	}

	/**
	 * Handle event from select element and retrieve selected value.
	 * @param {Event & { currentTarget: EventTarget & HTMLInputElement; }} event - The event object with a specific type signature.
	 */
	function handleCountChange(event) {
		const id = event.currentTarget.dataset.sizeId;
		const count = parseInt(event.currentTarget.value);
		if (count !== 0) return rackStore.updateRackSize(id, rackId, { count });
		rackStore.deleteRackSize(id, rackId);
	}
</script>

{#if sizes && Array.isArray(sizes)}
	{#each sizes as rSize (rSize.id)}
		<div class="flex items-center">
			<!-- Dropdown -->
			<select
				name="size_select"
				class="select rounded-none rounded-l-lg border-y-2 border-l-2 border-neutral text-base"
				bind:value={rSize.name}
			>
				{#each sizesAvalible as size}
					<option value={size}>{size}</option>
				{/each}
			</select>

			<!-- Input field -->
			<label
				class="input flex items-center rounded-none rounded-r-lg border-y-2 border-r-2 border-neutral grow"
			>
				<input
					type="number"
					bind:value={rSize.count}
					on:change={handleCountChange}
					class="grow"
					placeholder="Count"
					data-size-id={rSize.id}
				/>
			</label>
		</div>
		<!-- content here -->
	{/each}
{/if}
<div class="flex items-center">
	<!-- Dropdown -->
	<select
		name="size_select"
		class="select rounded-none rounded-l-lg border-y-2 border-l-2 border-neutral text-base"
		on:change={handleCreateSize}
	>
		<option selected disabled value="default">Size?</option>
		{#each sizesAvalible as size}
			<option value={size}>{size}</option>
		{/each}
	</select>

	<!-- Input field -->
	<label
		class="input flex items-center rounded-none rounded-r-lg border-y-2 border-r-2 border-neutral grow"
	>
		<input type="number" disabled class="grow" placeholder="Count" />
	</label>
</div>
