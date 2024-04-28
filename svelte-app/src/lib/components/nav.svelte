<script>
	import { authModel, logout, getAvatarUrl } from '$lib/stores/auth.store';
	$: avatarUrl = getAvatarUrl($authModel);
</script>

<div class="navbar bg-base-100">
	<div class="flex-none">
		<button class="btn btn-square btn-ghost">
			<svg
				xmlns="http://www.w3.org/2000/svg"
				fill="none"
				viewBox="0 0 24 24"
				class="inline-block h-5 w-5 stroke-current"
				><path
					stroke-linecap="round"
					stroke-linejoin="round"
					stroke-width="2"
					d="M4 6h16M4 12h16M4 18h16"
				></path></svg
			>
		</button>
	</div>
	<div class="flex-1">
		<a href="/" class="btn btn-ghost text-xl">CFH</a>
	</div>
	<div class="flex-none">
		{#if $authModel}
			<div class="dropdown dropdown-end">
				<div tabindex="0" role="button" class="avatar btn btn-circle btn-ghost">
					<div class="w-10 rounded-full">
						<img alt="Tailwind CSS Navbar component" src="/{avatarUrl}" />
					</div>
				</div>
				<ul
					class="menu dropdown-content menu-sm z-[1] mt-3 w-52 rounded-box bg-base-200 p-2 shadow"
				>
					<li><button on:click={logout} class="btn btn-ghost">Logout</button></li>
				</ul>
			</div>
		{:else}
			<a href="/login">login</a>
		{/if}
	</div>
</div>
