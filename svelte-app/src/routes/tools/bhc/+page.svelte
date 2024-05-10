<script>
	// import { createBHCPDF } from '$lib/loadBHC.js';
	import RackComponent from './rack.svelte';
	import RackStore from '$lib/stores/rack.store';
	import { onMount } from 'svelte';
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';
	import { createBHCPDF } from '$lib/loadBHC';
	import pb from '$lib/pb';
	import { get } from 'svelte/store';

	async function getPdfFileUrl() {
		const record = await pb.collection('pdfs').getFirstListItem('title="bhc"');
		const fileUrl = pb.getFileUrl(record, record.file);
		const blobUrl = await createBHCPDF(fileUrl, get(RackStore), lotNumbers);
		var fileLink = document.createElement('a');
		fileLink.href = blobUrl;
		fileLink.target = '_blank';
		fileLink.download = `BHC_${lotNumbers.join('_')}.pdf`;
		fileLink.click();
	}

	/** @type {import('$lib/stores/rack.store').Rack[] | null} */
	let racks = null;
	/** @type {string[]} */
	let lotNumbers = [];
	let inputValue = '';
	let disablePrint = true;
	/** @type {string[]} */
	$: filteredSuggestions = [];
  
	$: lotParam = $page.url.searchParams.get('lot');

	RackStore.subscribe((value) => {
		racks = value;
		if (Array.isArray(racks) && racks.length > 0) disablePrint = false;
		else disablePrint = true;
	});

	function handleInput() {
		generateSugguestions();
	}

	function handleKeyPress(event) {
		if (event.key === ' ' || event.key === 'Enter') {
			event.preventDefault(); // Prevent default behavior of space/enter key
			if (inputValue.trim() !== '') {
				addLotNumbers([inputValue.trim()]);
				inputValue = ''; // Clear the input value
				filteredSuggestions = [];
			}
		}
	}

	function generateSugguestions() {
    console.log('inputValue', inputValue)
    if(inputValue === '') {
      const today = new Date()
      return filteredSuggestions = [
        lotBase('P', today, '1'),
        lotBase('P', today, '2'),
        lotBase('P', today, '3'),
      ]  
    }
    
    let line = 'P'
    let date = new Date();
    if(inputValue.length >= 1) line = inputValue[0].toUpperCase()
    if(inputValue.length >= 3 ){
      if(inputValue.length >= 5) date.setMonth(parseInt(inputValue.slice(1,3))-1, parseInt(inputValue.slice(3,5)))
      else  date.setMonth(parseInt(inputValue.slice(1,3))-1)
             
    }
    return filteredSuggestions = [
        lotBase(line, date, '1'),
        lotBase(line, date, '2'),
        lotBase(line, date, '3'),
      ]

		// filteredSuggestions = suggestions.filter((suggestion) =>
		// 	suggestion.toLowerCase().includes(inputValue.toLowerCase())
		// );
	}

	function selectSuggestion(suggestion) {
    console.log(suggestion)
		inputValue = suggestion;
		filteredSuggestions = [];
	}

	/** @param {string[]} lots  */
	function addLotNumbers(lots) {
		lotNumbers = [...lotNumbers, ...lots];
		goto(`?lot=${lotNumbers.toString()}`);
		RackStore.getByLot(lotNumbers);
	}

	/** @param {number} index  */
	function removeLotNumber(index) {
		lotNumbers.splice(index, 1);
		lotNumbers = [...lotNumbers];
		goto(`?lot=${lotNumbers.toString()}`);
		RackStore.getByLot(lotNumbers);
	}

	function handlePopState() {
		if (lotParam) lotNumbers = [...lotNumbers, ...lotParam.split(',')];
		RackStore.getByLot(lotNumbers);
    generateSugguestions();
	}
  
 	const lotBase = (line, date, fill) => {
		let baseString = line;
		baseString += String(date.getMonth() + 1).padStart(2, '0');
		baseString += String(date.getDate()).padStart(2, '0');
		baseString += date.getFullYear() % 10;
		baseString += fill.padStart(2, '0');

		return baseString;
	};


	onMount(() => {
		handlePopState();
		window.addEventListener('popstate', handlePopState);
		return () => {
			window.removeEventListener('popstate', handlePopState);
		};
	});
</script>

<div class="container mx-auto grid justify-items-center px-2">
	<div class="flex w-full max-w-96 flex-col space-y-4">
		<div class="flex flex-wrap justify-center rounded py-2">
			{#each lotNumbers as item, i}
				<button
					on:click={() => removeLotNumber(i)}
					class="badge badge-outline m-1 p-3 pt-4 hover:bg-warning">{item}</button
				>
			{/each}
		</div>
		<div class="dropdown">
			<div class="flex">
				<label class="input input-bordered flex grow items-center gap-2 rounded-r-none">
					<input
						type="text"
						id="textInput"
						class="grow"
						placeholder="Search lot numbers"
						bind:value={inputValue}
						on:input={handleInput}
						on:keypress={handleKeyPress}
						autocomplete="off"
					/>
				</label>
				<button
					class="btn btn-square btn-outline btn-secondary rounded-l-none {disablePrint
						? 'btn-disabled'
						: ''}"
					on:click={getPdfFileUrl}
				>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						width="16"
						height="16"
						fill="currentColor"
						class="bi bi-printer"
						viewBox="0 0 16 16"
					>
						<path d="M2.5 8a.5.5 0 1 0 0-1 .5.5 0 0 0 0 1" />
						<path
							d="M5 1a2 2 0 0 0-2 2v2H2a2 2 0 0 0-2 2v3a2 2 0 0 0 2 2h1v1a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2v-1h1a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-1V3a2 2 0 0 0-2-2zM4 3a1 1 0 0 1 1-1h6a1 1 0 0 1 1 1v2H4zm1 5a2 2 0 0 0-2 2v1H2a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h12a1 1 0 0 1 1 1v3a1 1 0 0 1-1 1h-1v-1a2 2 0 0 0-2-2zm7 2v3a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1v-3a1 1 0 0 1 1-1h6a1 1 0 0 1 1 1"
						/>
					</svg>
				</button>
			</div>

			<ul
				class="menu dropdown-content z-[1] w-52 rounded-box bg-base-100 p-2 shadow"
        tabindex="0"
			>
				{#each filteredSuggestions as suggestion}
					<li on:click={() => selectSuggestion(suggestion)}>
						<a>{suggestion}</a>
					</li>
				{/each}
			</ul>
		</div>
		{#if racks}
			{#each racks as rack}
				<div class="divider divider-primary">Rack {rack.id.substring(0, 3).toUpperCase()}</div>
				<RackComponent {...rack} {lotNumbers} />
			{/each}
       <div class="divider divider-primary"></div>
		{/if}
		{#if lotNumbers.length > 0}
			<button class="btn btn-warning" on:click={() => RackStore.createRack(lotNumbers.at(-1))}
				>Create Rack</button
			>
		{/if}
	</div>
</div>
