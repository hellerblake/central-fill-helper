<script>
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import pb from '$lib/pb';

	let username = '';
	let password = '';
	let errorMsg = '';

	let returnTo = '';

	$: returnTo = $page.url.searchParams.get('ret') || '/';

	async function login() {
		try {
			await pb.collection('users').authWithPassword(username, password);
			errorMsg = '';
			goto(returnTo);
		} catch (error) {
			// @ts-ignore
			errorMsg = error.message;
		}
	}
</script>

<main class="p-4">
	<div class="mx-auto max-w-md overflow-hidden rounded-lg bg-base-200 shadow-lg">
		<div class="px-6 py-4">
			<h2 class="mb-2 text-2xl font-bold">Login</h2>
			<form on:submit|preventDefault={login}>
				<div class="mb-4">
					<label for="username" class="block text-sm font-medium text-base-content">Username</label>
					<input
						type="text"
						bind:value={username}
						id="username"
						class="input input-bordered w-full max-w-md"
					/>
				</div>
				<div class="mb-6">
					<label for="password" class="block text-sm font-medium text-base-content">Password</label>
					<input
						type="password"
						id="password"
						bind:value={password}
						class="input input-bordered w-full max-w-md"
					/>
				</div>
				<button type="submit" class="btn btn-outline btn-primary w-full max-w-md">Login</button>
				{#if errorMsg}
					<div class="mt-4 flex justify-center">
						<div class="text-error">{errorMsg}</div>
					</div>
				{/if}
			</form>
		</div>
	</div>
</main>
