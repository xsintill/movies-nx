<script lang="ts">
  // import List, { Item, Graphic, Text } from '@smui/list';
  import {debounce} from 'lodash';
  import MovieTitle from './MovieTitle/MovieTitle.svelte';
  import MovieSeenAt from './MovieSeenAt/MovieSeenAt.svelte';
  import MovieRow from './MovieRow/MovieRow.svelte';
  import Poster from './MoviePoster/MoviePoster.svelte';
  import MovieRating from './MovieRating/MovieRating.svelte';
  import Search from '../Search/Search.svelte';
  import {searchTerm} from '../Search/search.store';
  // // import { IMDBNumber } from './IMDBNumber/index';
  import { Year } from './Year/index';
  import get from '../axios/get';
  import type { Movie } from '../movie/movie.type';
  import { latestMovies, tmdbMovies } from '../movie/movie.store';
  import { getIMDBNumber } from './IMDB.utils';
  import { getMovieByImdbId } from '../tmdb/TMDB.utils';
  import type { FilmResponse } from '../axios/FilmResponse.type';
	
	let error;
  let numberOfMoviesFound: number;
  function refresh() {
    let movies: Movie[] = [];
    get<Movie[]>(`api/film/latest?search=${$searchTerm}`).then(({results:res, totalCount, searchCount}: FilmResponse<Movie[]>) => {	
      numberOfMoviesFound = searchCount;
      if (res.length !== 0) {
        const internalTmdbMovies: Movie[] = [];
        let i: number = 0;
        movies = res.map(item => {      
          const imdbNumber = getIMDBNumber(item?.Url);
          tmdbMovies.update(t=>{
            getMovieByImdbId(imdbNumber).then((tmdb) => {
              internalTmdbMovies.push({
                ...item,
                imdbNumber,
                tmdbMovie: tmdb,
              });
              i++;
              if (i >= internalTmdbMovies.length) {
                tmdbMovies.set(internalTmdbMovies);
              }
            });
            return [...t]
          });
          return {
            ...item, 
            imdbNumber
          }
        });
      } 
      latestMovies.set(movies);
      movies.length === 0 && tmdbMovies.set([]);
      if (movies.length === 0) {
        numberOfMoviesFound = 0;
      }
    });
  }

  function movieClickHandler(url: string) {
    console.log(1,url)
    // window.open(url)    
  }
  const handleInput = debounce((event) => {
    searchTerm.set(event.target.value);
    refresh()
  },300)
  refresh()
</script>

{#if error}
  <div>Error: found{error}</div>
  }
{/if}
{#if !error}
  <div>
    <!-- <List class="demo-list" twoLine avatarList> -->
    
  <Search on:input={handleInput} label={'Search'}/>
  {numberOfMoviesFound}
  {#if $tmdbMovies.length === 0}
    No movies found searching {$searchTerm}
  {:else}
    {#each $tmdbMovies as {Url, Title, SeenAt, tmdbMovie}}
      <MovieRow on:click={()=>movieClickHandler(Url)}>
        <MovieTitle>{Title}</MovieTitle>(<Year date={tmdbMovie?.release_date} />)
        <MovieSeenAt date={SeenAt}></MovieSeenAt>    
        <Poster src={tmdbMovie?.poster_path} alt={`Poster for movie '${Title}'`} />   
        <MovieRating rate={tmdbMovie?.vote_average} /> 
        <!-- <Trailer video={tmdbMovie?.videos}/> -->
        <div>
          {tmdbMovie?.overview}
        </div>
        <!-- {JSON.stringify(tmdbMovie)} -->
      </MovieRow>
      <!-- <Item on:click={movieClickHandler(Url)}>
        <Graphic style="background-image: url(https://place-hold.it/40x40?text=&fontsize=16);" />
        <Text>
          {tmdbMovie?.release_date}        
        </Text>
      </Item> -->
    {/each}
  {/if} 
    <!-- </List> -->
  </div>
{/if}

