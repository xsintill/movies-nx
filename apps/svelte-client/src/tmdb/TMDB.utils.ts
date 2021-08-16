import { ax } from '../axios/axios';
import { environment } from '../environments/environment';
import type { TMDBMovie } from './TMDB.type';

const url = 'https://api.themoviedb.org/3/';

export async function getMovieByImdbId(imdbId: string): Promise<TMDBMovie> {
  return await (
    await ax.get(`${url}find/${imdbId}?api_key=${environment.tmdbApiKey}&external_source=imdb_id`)
  ).data.movie_results[0];
}
