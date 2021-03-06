import type { TMDBMovie } from '../tmdb/TMDB.type';

export interface WordCount {
  word: string;
  count: number;
}

export interface Entity {
  Id: number;
}

export interface DbMovie extends Entity {
  Title: string;
  Url: string;
  SeenAt: string;
  Genres: number;
}

export interface PresentableMovie {
  imdbNumber: string;
  tmdbMovie?: TMDBMovie;
  wordCount: WordCount[];
}

export interface Movie extends DbMovie, PresentableMovie {}

export interface Paging {
  pageIndex: number;
  pageSize: number;
  filmsToAddUntilCompletion: number;
  seenAfterCrashCount: number;
  totalDbCount: number;
  totalCount: number;
  searchCount: number;
  pageCount: number;
}

export interface PagedMovie extends Paging {
  results: Movie[];
}