import { writable } from 'svelte/store';

interface IValue {
	name: string;
	num: number;
}

const store = writable<IValue[]>([]);

export const Rlevel = writable<number>(1);

export default store;
