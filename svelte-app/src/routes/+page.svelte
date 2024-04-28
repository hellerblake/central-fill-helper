<script>
	import AuthGuard from '$lib/components/auth-guard.svelte';
	import FillRecord from '$lib/components/fill-record.svelte';
</script>
<AuthGuard>
  <FillRecord />
</AuthGuard>
