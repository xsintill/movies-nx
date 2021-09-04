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
  import Button from '../ui/Button/Button.svelte';
  // // import { IMDBNumber } from './IMDBNumber/index';
  import { Year } from './Year/index';
  import { get } from '../axios/get';
  import { post } from '../axios/post';
  import { put } from '../axios/put';
  import { remove } from '../axios/remove';
  import { latestMovies, tmdbMovies } from '../movie/movie.store';
  import { getIMDBNumber } from './IMDB.utils';
  import { getMovieByImdbId } from '../tmdb/TMDB.utils';
  import type { DbMovie, Movie, PagedMovie } from '../movie/movie.type';
	
	let error;
  let dialog: Dialog;
  let deleteConfirmationDialog: Dialog;
  let movie: DbMovie;
  let numberOfMoviesSearched: number;
  let numberOfMoviesInDB: number;
  let numberOfMoviesTotal: number;
  let numberOfMoviesSeenAfterCrash: number;
  let numberOfMoviesToAddUntilCompletion: number;
  let selectedMovie: Movie;
  $: editMode = movie?.Id >= 0;
  $: upsertDialogTitle = (editMode) ? `Edit movie '${movie?.Title}'` : 'Add new movie';

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
        movies = res.map((item, index) => {  
          const imdbNumber = getIMDBNumber(item?.Url);
          if (!imdbNumber) return {...item};
          tmdbMovies.update(t=>{
            getMovieByImdbId(imdbNumber).then((tmdb) => {
              internalTmdbMovies[index] = {
                ...item,
                imdbNumber,
                tmdbMovie: tmdb,
              };
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

  function editMovie(film: Movie){
    movie = {...film};
    dialog.show();
  }

  function newClickHandler() {
    dialog.show();
  } 

  function showDeleteConfirmationDialog(tmdbMovie: Movie, e) {
    e.stopPropagation();
    selectedMovie = tmdbMovie;
    deleteConfirmationDialog.show();
  } 

  async function saveClickHandler() {   
    console.log('editMode',editMode)  
    //TODO:add validation before adding movie
    if (editMode) {
      put(`api/film/update`, movie).then(()=>{
        dialog.hide();
        refresh(0);
      })
    } else {
      post(`api/film/add`, movie).then(()=>{
        dialog.hide();
        refresh(0);
      })
    }
    movie = undefined;
  } 

  async function deleteClickHandler() {
    console.log('delete confirmed clicked');
    remove(`api/film/remove/${selectedMovie.Id}`).then(()=>{
      deleteConfirmationDialog.hide();
      refresh(0);
    });
    selectedMovie = undefined;
  }
  async function cancelClickHandler() {
    selectedMovie = undefined;
    deleteConfirmationDialog.hide();
  }
  async function cancelUpsertClickHandler() {
    movie = undefined;
    dialog.hide();
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
      {#each $tmdbMovies as movie}
        <MovieRow on:click={()=>editMovie(movie)}>
          <MovieTitle>{movie?.Title}</MovieTitle>(<Year date={movie?.tmdbMovie?.release_date} />)
          <MovieSeenAt date={movie?.SeenAt}></MovieSeenAt>    
          <Poster url={movie?.Url} src={movie?.tmdbMovie?.poster_path} alt={`Poster for movie '${movie?.Title}'`} />   
          <MovieRating rate={movie?.tmdbMovie?.vote_average} /> 
          <WordCount wordCount={movie?.wordCount} />
          
          <Videos  tmdbId={movie?.tmdbMovie?.id}/>
          <MovieDescription description={movie?.tmdbMovie?.overview} />
          <IconButton iconName="bin" on:click={(e)=>showDeleteConfirmationDialog(movie,e)}/>
        </MovieRow>      
      {/each}
    {/if} 
    <Dialog bind:this={dialog} onclose={cancelUpsertClickHandler}>
      <h2>{upsertDialogTitle}</h2>
      <MovieForm bind:movie={movie} />
      <Button on:click={() => cancelUpsertClickHandler()}>Cancel</Button>
      <Button on:click={() => saveClickHandler()}>Save</Button>
    </Dialog>
    <Dialog bind:this={deleteConfirmationDialog} onclose={()=>console.log(undefined)}>
      <h2>Are you sure you want to delete <span class="movie-title">'{selectedMovie?.Title}'</span>?</h2>
      <Button on:click={() => cancelClickHandler()}>Cancel</Button>
      <Button on:click={() => deleteClickHandler()}>Delete</Button>
    </Dialog>
  </div>
{/if}

<style lang="scss">
  .movie-title {
    text-transform: capitalize;
  }
</style>

