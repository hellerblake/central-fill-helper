import pb from '$lib/pb';
import { writable } from 'svelte/store';

/** @type {RackStore} */
const rackStore = writable([]);
const rackFields =
	'collectionId, id, location, revalves, test, toggles, lot, proof, expand.sizes.id, expand.sizes.name, expand.sizes.count';
const rackSizeFields = 'id, name, count';
export const sizesAvalible = ['M6', 'M9', 'DA', 'EA', 'E', 'M60', 'M90', 'M122'];
/**
 * @typedef RackSize
 * @prop {string} id
 * @prop {string} name
 * @prop {number} count
 */

/**
 * @typedef Rack
 * @prop {string} collectionId
 * @prop {string} id
 * @prop {string} lot
 * @prop {string} location
 * @prop {number} test
 * @prop {number} toggles
 * @prop {number} revalves
 * @prop {string[]} proof
 * @prop {RackWithSizes} [expand]
 */

/**
 * @typedef {Object} RackWithSizes
 * @prop {Array<RackSize>} [sizes]
 */

/** @typedef RackStore
 *
 * @type {import('svelte/store').Writable<Array<Rack>>  }
 * @prop {function} deleteRack
 */

/**
 * @param {RackStore} store
 * @param {string[]} lotNumbers - One or many lot numbers in array
 */
function getByLot(store, lotNumbers) {
	const filter = lotNumbers[0] ? lotNumbers.map((lot) => `lot="${lot}"`).join('||') : `lot=""`;

	/** @returns {Promise<null | Rack[]>} */
	pb.collection('racks')
		.getFullList({
			fields: rackFields,
			filter,
			sort: 'lot, location',
			expand: 'sizes'
		})
		.then((records) => {
			records.forEach((rack) => (rack = sortRackSizes(rack)));
			store.set(records);
		});
}


/**
 * @param {RackStore} store
 * @param {string} lotNumber
 */
async function create(store, lotNumber) {
	const data = {
		for: 'BHC',
		lot: lotNumber,
		location: 'Everett',
		toggles: 0,
		revalves: 0,
		test: 0
	};
	/** @type {Rack}*/
	const newRack = await pb.collection('racks').create(data, { fields: rackFields });
	store.update((racks) => {
		racks.push(newRack);
		return racks;
	});
}

/** @param {Rack} rack  */
function sortRackSizes(rack) {
	if (rack.expand?.sizes) {
		rack.expand.sizes.sort((a, b) => sizesAvalible.indexOf(a.name) - sizesAvalible.indexOf(b.name));
	}
	return rack;
}

/** @param {string} id - Rack Id
 * @param {Partial<Rack>} rack - Properties to update
 */
async function updateRack(store, rack, id) {
	const updatedRack = await pb
		.collection('racks')
		.update(id, rack, { fields: rackFields, expand: 'sizes' });
	store.update((racks) => {
		const index = racks.findIndex((r) => r.id === updatedRack.id);
		racks[index] = sortRackSizes(updatedRack);
		return racks;
	});
}

async function deleteRack(store, id) {
	/** @type {string[] | null} */
	const sizeIds = await pb.collection('racks').getOne(id, { fields: 'sizes' });
	pb.collection('racks')
		.delete(id)
		.then((b) => {
			if (b)
				if (Array.isArray(sizeIds?.sizes))
					sizeIds.sizes.forEach(async (sId) => {
						try {
							await pb.collection('rack_sizes').delete(sId);
							console.log('deleteing size: ', sId);
						} catch (error) {
							console.log('error deleting', error);
						}
					});
			store.update((racks) => {
				const index = racks.findIndex((r) => r.id === id);
				racks.splice(index, 1);
				return racks;
			});
		});
}

/**
 * @param {RackStore} store
 * @param {string} id - Rack Size Id
 * @param {Partial<RackSize>} partialSize
 */
async function updateRackSize(store, id, rackId, partialSize) {
	const updatedSize = await pb
		.collection('rack_sizes')
		.update(id, partialSize, { fields: rackSizeFields });
	store.update((racks) => {
		const rIndex = racks.findIndex((r) => r.id == rackId);
		const sIndex = racks[rIndex].expand?.sizes?.findIndex((s) => s.id == id);
		if (sIndex) {
			racks[rIndex].expand.sizes[sIndex] = updatedSize;
			racks[rIndex] = sortRackSizes(racks[rIndex]);
		}
		return racks;
	});
}

async function deleteRackSize(store, id, rackId) {
	await pb.collection('rack_sizes').delete(id);
	store.update((racks) => {
		const rIndex = racks.findIndex((r) => r.id == rackId);
		const sIndex = racks[rIndex].expand?.sizes?.findIndex((s) => s.id == id);
		if (sIndex !== undefined) {
			racks[rIndex].expand.sizes.splice(sIndex, 1);
		}
		return racks;
	});
}

function createRackSize(store, rackId, sizeName) {
	pb.collection('rack_sizes')
		.create({ name: sizeName, count: 1 }, { fields: rackSizeFields })
		.then((size) => {
			pb.collection('racks')
				.update(rackId, { 'sizes+': size.id }, { fields: rackFields, expand: 'sizes' })
				.then((rack) => {
					store.update((racks) => {
						const index = racks.findIndex((r) => r.id === rackId);
						if (index !== -1) {
							rack = sortRackSizes(rack);
							racks[index] = rack;
						}
						return racks;
					});
				});
		});
}

rackStore.getByLot = (lotNumbers) => getByLot(rackStore, lotNumbers);
/** @param {string} lot} */
rackStore.createRack = (lot) => create(rackStore, lot);
/** @param {string} id - Id of Rack */
rackStore.deleteRack = (id) => deleteRack(rackStore, id);
rackStore.updateRackSize = (id, rackId, partialSize) =>
	updateRackSize(rackStore, id, rackId, partialSize);
rackStore.deleteRackSize = (id, rackId) => deleteRackSize(rackStore, id, rackId);
rackStore.createRackSize = (rackId, sizeName) => createRackSize(rackStore, rackId, sizeName);
rackStore.updateRack = (rack, id) => updateRack(rackStore, rack, id);

export default rackStore;
