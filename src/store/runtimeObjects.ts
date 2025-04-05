import { writable } from 'svelte/store';
import type { GridRuntimeObject } from '../types/types';

export const runtimeObjectsStore = writable<GridRuntimeObject[]>([]); 