import { writable } from 'svelte/store';

import type { Movie } from './movie.type';

export const latestMovies = writable<Movie[]>([]);
export const tmdbMovies = writable<Movie[]>([]);
