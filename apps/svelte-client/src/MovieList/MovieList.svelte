<script lang="ts">
  // import List, { Item, Graphic, Text } from '@smui/list';
  import {debounce} from 'lodash';

  import MovieForm from '../MovieForm/MovieForm.svelte';
  import MovieTitle from './MovieTitle/MovieTitle.svelte';
  import MovieSeenAt from './MovieSeenAt/MovieSeenAt.svelte';
  import MovieRow from './MovieRow/MovieRow.svelte';
  import Poster from './MoviePoster/MoviePoster.svelte';
  import MovieRating from './MovieRating/MovieRating.svelte';
  import MovieDescription from './MovieDescription/MovieDescription.svelte';
  import WordCount from './WordCount/WordCount.svelte';
  import Videos from './Videos/Videos.svelte';
  import Statistics from './Statistics/Statistics.svelte';
  // import Virtuallist from '../ui/VirtualList/Virtuallist.svelte';
  import Search from '../Search/Search.svelte';
  import {searchTerm} from '../Search/search.store';
  import Dialog from '../ui/Dialog/Dialog.svelte';
  import IconButton from '../ui/Button/IconButton.svelte';
  // // import { IMDBNumber } from './IMDBNumber/index';
  import { Year } from './Year/index';
  import { get } from '../axios/get';
  import { post } from '../axios/post';
  import { latestMovies, tmdbMovies } from '../movie/movie.store';
  import { getIMDBNumber } from './IMDB.utils';
  import { getMovieByImdbId } from '../tmdb/TMDB.utils';
  import type { DbMovie, Movie, PagedMovie } from '../movie/movie.type';
	
	let error;
  let dialog: Dialog;
  let movie: DbMovie;
  let numberOfMoviesSearched: number;
  let numberOfMoviesInDB: number;
  let numberOfMoviesTotal: number;
  let numberOfMoviesSeenAfterCrash: number;
  let numberOfMoviesToAddUntilCompletion: number;

  function refresh(pageIndex: number) {
    let movies: Movie[] = [];
    get<PagedMovie>(`api/film/latest?search=${$searchTerm}&pageIndex=${pageIndex}`).then(({
      results:res, 
      pageIndex,
      pageSize,
      filmsToAddUntilCompletion,
      seenAfterCrashCount,
      totalDbCount,
      totalCount,
      searchCount,
      pageCount}: PagedMovie) => {	
      numberOfMoviesToAddUntilCompletion =  filmsToAddUntilCompletion;
      numberOfMoviesSeenAfterCrash = seenAfterCrashCount;
      numberOfMoviesInDB = totalDbCount;
      numberOfMoviesTotal = totalCount;
      numberOfMoviesSearched =searchCount;
      
      if (res.length !== 0) {
        const internalTmdbMovies: Movie[] = [];
        let i: number = 0;
        movies = res.map(item => {  
          const imdbNumber = getIMDBNumber(item?.Url);
          if (!imdbNumber) return {...item};
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
        numberOfMoviesSearched = 0;
      }
    });
  }

  const searchValueChangeHandler = debounce((event) => {
    searchTerm.set(event.target.value);
    refresh(0);
  },300);

  refresh(0);

  function newClickHandler() {
    dialog.show();
  } 

  async function saveClickHandler() {
    //TODO:add validation before adding movie
    post(`api/film/add`, movie).then(()=>{
      dialog.hide();
      refresh(0);
    });
  } 
</script>

{#if error}
  <div>Error: found{error}</div>
  }
{/if}
{#if !error}
  <div>
    <Search on:input={searchValueChangeHandler} label={'Search'}/> 
    <IconButton iconName={'add'} viewBox={'0 -2 24 24'} on:click={()=>newClickHandler()}/> 
    <Statistics 
      searchedCount={numberOfMoviesSearched} 
      inDBCount={numberOfMoviesInDB} 
      totalCount={numberOfMoviesTotal} 
      addUntilCompleteCount={numberOfMoviesToAddUntilCompletion} 
      seenAfterCrashCount={numberOfMoviesSeenAfterCrash} 
    />
    {#if $tmdbMovies.length === 0}
      No movies found searching {$searchTerm}
    {:else}
      {#each $tmdbMovies as {Url, Title, SeenAt, tmdbMovie, wordCount}}
        <MovieRow url={Url}>
          <MovieTitle>{Title}</MovieTitle>(<Year date={tmdbMovie?.release_date} />)
          <MovieSeenAt date={SeenAt}></MovieSeenAt>    
          <Poster src={tmdbMovie?.poster_path} alt={`Poster for movie '${Title}'`} />   
          <MovieRating rate={tmdbMovie?.vote_average} /> 
          <WordCount wordCount={wordCount} />
          
          <Videos tmdbId={tmdbMovie?.id}/>
          <MovieDescription description={tmdbMovie?.overview} />
        </MovieRow>      
      {/each}
    {/if} 
    <Dialog bind:this={dialog}>
      <h2>Add new movie</h2>
      <MovieForm bind:movie={movie}/>
      <button on:click={() => saveClickHandler()}>Save</button>
    </Dialog>
  </div>
{/if}

<style lang="scss">
</style>

