import pb from './pb';

export async function login() {
	pb.admins.authWithPassword('local@dev.com', 'Ldb2#xGJZWi9*!');
}

export function isLoggedin() {
	return pb.authStore.isValid;
}
