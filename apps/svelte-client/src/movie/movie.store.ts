import { writable } from 'svelte/store';

import type { Movie } from './movie.type';

export const latestMovies = writable<Movie[]>([]);
export const tmdbMovies = writable<Movie[]>([]);
export const combinedTmdbMovies = writable<Movie[]>([]);
export const letterCombos = writable<string[]>([]);
export const retrievingMovies = writable<boolean>(false);
export const canLoadMore = writable<boolean>(true);
export const showLoadMore = writable<boolean>(false);
