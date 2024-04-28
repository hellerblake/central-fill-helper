import pb from '$lib/pb';
import { readable } from 'svelte/store';
// import { invalidateAll } from "$app/navigation";

/** @type {import('pocketbase').AuthModel} AuthModel */
const initAuthModel = {};

/**
 * @typedef {Object} Credentials
 * @property {string} username - The username of the user.
 * @property {string} password - The password of the user.
 */

/**
 * Function to authenticate a user.
 * @param {Credentials} credentials - The user's credentials.
 * @returns {Promise<void>} A Promise that resolves when authentication is successful.
 */
export const login = async (credentials) => {
	await pb.collection('users').authWithPassword(credentials.username, credentials.password);
};

export const logout = () => {
	pb.authStore.clear();
};

export const authModel = readable(initAuthModel, function (set) {
	pb.authStore.onChange((token, model) => {
		set(model);
		// invalidateAll(); // re-run load functions for current page
	}, true);
});

// export const avatarUrl(){
//   const authM = authModel.subscribe()
//   if(authModel) return pb.files.getUrl($authModel, $authModel.avatar)
//
// }

export function getAvatarUrl(
  model
) {
  if (!model) return undefined;
  if (typeof model.avatar !== 'string' || !model.avatar) return undefined;

  return absoluteToRelative(pb.files.getUrl(model, model.avatar));
}


function absoluteToRelative(absoluteUrl) {
    const base = window.location.origin;
    const absolutePath = new URL(absoluteUrl).pathname;
    const basePath = new URL(base).pathname;

    // Check if the absolute URL is under the same origin
    if (absoluteUrl.startsWith(base)) {
        return absolutePath.substring(basePath.length);
    } else {
        // If it's not under the same origin, return the absolute URL
        return absoluteUrl;
    }
}
