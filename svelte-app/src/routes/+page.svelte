<script>
	import { login, isLoggedin } from '$lib/auth.js';
	import { getPosts } from '$lib/posts.js';
	login();
	if (!isLoggedin()) login();
	const postsP = getPosts();
</script>

<h1>Welcome to SvelteKit</h1>
<p>Visit <a href="https://kit.svelte.dev">kit.svelte.dev</a> to read the documentation</p>
{#await postsP then posts}
	{#each posts as post}
		<!-- content here -->
		<div>{post.name}</div>
	{/each}
	<!-- promise was fulfilled -->
{/await}
