import { ax } from '../axios/axios';
import { environment } from '../environments/environment';
import type { TMDBMovie, TMDBMovieVideos, TMDBSearchMovieResult } from './TMDB.type';

const url = 'https://api.themoviedb.org/3/';

export async function getMovieByImdbId(imdbId: string): Promise<TMDBMovie> {
  return (await ax.get(`${url}find/${imdbId}?api_key=${environment.tmdbApiKey}&external_source=imdb_id`))
    .data.movie_results[0];
}

export async function searchMovie(title: string): Promise<TMDBSearchMovieResult> {
  return (await ax.get(`${url}search/movie?api_key=${environment.tmdbApiKey}&query=${title}&language=en-US&page=1&include_adult=true`))
    .data.results[0];
}

export async function getMovie(tmdbId: number): Promise<TMDBMovie> {
  return (await ax.get(`${url}movie/${tmdbId}?api_key=${environment.tmdbApiKey}`)).data;
}

export async function getMovieVideos(tmdbId: number): Promise<TMDBMovieVideos> {
  return (await ax.get(`${url}movie/${tmdbId}/videos?api_key=${environment.tmdbApiKey}`)).data;
}