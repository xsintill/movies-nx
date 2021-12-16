import { writable } from 'svelte/store';

import type { Movie } from './movie.type';

export const latestMovies = writable<Movie[]>([]);
export const tmdbMovies = writable<Movie[]>([]);
export const combinedTmdbMovies = writable<Movie[]>([]);
export const letterCombos = writable<string[]>([]);
