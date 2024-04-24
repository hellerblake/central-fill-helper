import { writable } from 'svelte/store';

// initialize with the light theme, dawn
const isDark = writable(true);

function toggle() {
  isDark.update((v) => !v);
}

export { isDark, toggle };
