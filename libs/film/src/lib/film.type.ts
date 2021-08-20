import { Entity, Paging } from "@lsn/core";
import type { TMDBMovie } from './tmdb.type';

/**
 * Any changes here should be done on the client side also
 */

export interface WordCount {
  word: string;
  count: number;
}

export interface DbMovie extends Entity {
  Title: string;
  Url: string;
  SeenAt: string;
  Genres: number;
}

export interface PresentableMovie {
  imdbNumber?: string;
  tmdbMovie?: TMDBMovie;
  wordCount: WordCount[];
}

export interface Movie extends DbMovie, PresentableMovie {}

export interface PagedMovie extends Paging {
  results: Movie[];
}