<script>
	import rackStore from '$lib/stores/rack.store';
	import ImageUploader from './image-uploader.svelte';
	import Sizes from './sizes.svelte';

	export let id = '';
	export let location = '';
	export let revalves = 0;
	export let test = 0;
	export let toggles = 0;
	export let lot = '';
  /** @type {string[]} */
  export let proof = [];
  export let collectionId = ''
  
  $: currentImageId = ""
	/** @type {import('$lib/stores/rack.store').RackWithSizes} */
	export let expand = {};

	/** @type {string[]} */
	export let lotNumbers = [];

	const locations = [
    'Albany',
		'Everett',
		'Bellingham',
		'P.T',
		'Tacoma',
		'Olympia',
		'Tukwila',
		'Bremerton',
		'Portland',
		'Vancouver',
		'Burlington'
	];

  let imageModal;

	function updateLot() {
		if (lot === 'delete') return rackStore.deleteRack(id);
		rackStore.updateRack({ lot }, id);
	}

	function updateLocation() {
		rackStore.updateRack({ location }, id);
	}

	function updateTest() {
		rackStore.updateRack({ test }, id);
	}

	function updateToggle() {
		rackStore.updateRack({ toggles }, id);
	}

	function updateRevalve() {
		rackStore.updateRack({ revalves }, id);
	}

	const handleEnter = (e) => e.key === 'Enter' && e.target.blur();

  function handleShowModal(e) {
    currentImageId = e.target.dataset.imageId
    imageModal.showModal()
    console.log(e.target.dataset.imageId)
  }
</script>

<div class="flex flex-col gap-4">
 <select bind:value={lot} on:change={updateLot} class="select select-bordered text-base">
	<option disabled selected>What Lot number?</option>
	<option value="delete">Delete Rack</option>
	{#each lotNumbers as item}
		<option value={item}>{item}</option>
	{/each}
</select>
<select bind:value={location} on:change={updateLocation} class="select select-bordered text-base">
	<option disabled selected>Location?</option>
	{#each locations as site}
		<option>{site}</option>
	{/each}
</select>
<Sizes rackId={id} sizes={expand.sizes} />
<label class="input input-bordered flex items-center gap-2">
	Toggle
	<input
		type="number"
		bind:value={toggles}
		on:change={updateToggle}
		on:keydown={handleEnter}
		class="grow"
		placeholder="Count"
	/>
</label>

<label class="input input-bordered flex items-center gap-2">
	Test
	<input
		type="number"
		class="grow"
		bind:value={test}
		on:change={updateTest}
		on:keydown={handleEnter}
		placeholder="Count"
	/>
</label>

<label class="input input-bordered flex items-center gap-2">
	Revalve
	<input
		type="number"
		class="grow"
		placeholder="Count"
		bind:value={revalves}
		on:change={updateRevalve}
		on:keydown={handleEnter}
	/>
</label>
  {#if Array.isArray(proof) && proof.length > 0}

<div class="carousel carousel-center max-w-md h-60 p-4 space-x-4 bg-neutral rounded-box mx-auto">
      {#each proof as image}
    <div class="carousel-item">
    <img on:click={handleShowModal} role="presentation" data-image-id="{image}" src="/api/files/{collectionId}/{id}/{image}?thumb=0x750" class="w-full" alt="thumbnail of rack" />
  </div>
      {/each}
</div>
{/if}

<ImageUploader rackId={id} lotNumber={lot}/>
<dialog bind:this={imageModal} id="my_modal_2" class="modal">
  <div class="modal-box p-0">
      {#if currentImageId !== ""}
    <img  src="/api/files/{collectionId}/{id}/{currentImageId}" class="w-full" alt="visual of completed rack" />
      {/if}
    <p class="py-4">Press ESC key or click outside to close</p>
  </div>
  <form method="dialog" class="modal-backdrop">
    <button>close</button>
  </form>
</dialog>
</div>

