import pb from '$lib/pb';

/**
 * @typedef {object} Posts
 * @prop {string} name
 */

export async function getPosts() {
	/** @type {Array<Posts>} */
	const records = await pb.collection('posts').getFullList({
		sort: '-created'
	});
	return records;
}
