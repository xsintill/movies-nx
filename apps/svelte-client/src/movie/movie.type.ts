import type { TMDBMovie } from '../tmdb/TMDB.type';

export interface DbMovie {
  Id: number;
  Title: string;
  Url: string;
  SeenAt: string;
  Genres: number;
}

export interface PresentableMovie {
  imdbNumber: string;
  tmdbMovie?: TMDBMovie;
}

export interface Movie extends DbMovie, PresentableMovie {}
