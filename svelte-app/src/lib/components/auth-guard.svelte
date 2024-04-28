<script>
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import { authModel } from '$lib/stores/auth.store';

	const url = $page.url.pathname;
	$: authorized = $authModel;
	$: if (!$authModel) {
		goto('/login?ret=' + url);
	}
</script>

{#if authorized}
	<slot />
{:else}
	<p>not authorized</p>
{/if}
