<script>
	import AuthGuard from '$lib/components/auth-guard.svelte';
</script>

<AuthGuard>
	<slot />
</AuthGuard>
