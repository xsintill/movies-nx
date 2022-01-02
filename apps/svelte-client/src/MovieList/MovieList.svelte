<script lang="ts">
  // import List, { Item, Graphic, Text } from '@smui/list';
  import {debounce} from 'lodash';
  import type { CancelTokenSource } from 'axios';

  import LetterComboTile from './LetterComboTile/LetterComboTile.svelte';
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
  import { latestMovies, tmdbMovies, letterCombos, retrievingMovies, canLoadMore,showLoadMore } from '../movie/movie.store';
  import { getIMDBNumber } from './IMDB.utils';
  import { getMovieByImdbId } from '../tmdb/TMDB.utils';
  import type { DbMovie, Movie, PagedMovie } from '../movie/movie.type';
  import { getCancelToken } from '../axios/getCancelToken';
	
	let error;
  let dialog: Dialog;
  let deleteConfirmationDialog: Dialog;
  let letterComboDialog: Dialog;
  let movie: DbMovie;
  let numberOfMoviesSearched: number;
  let numberOfMoviesInDB: number;
  let numberOfMoviesTotal: number;
  let numberOfMoviesSeenAfterCrash: number;
  let numberOfMoviesToAddUntilCompletion: number;
  let selectedMovie: Movie;
  let prevSearchTerm = '';
  let currentPageIndex = 0;
  $: editMode = movie?.Id >= 0;
  $: upsertDialogTitle = (editMode) ? `Edit movie '${movie?.Title}'` : 'Add new movie';

  function load() {
    refresh();
  };

  // REACTIVE DECLARATIONS
  let elementRef = null;
  $: {
    if (elementRef) {
      infiniteScroll({ fetch: load, element: elementRef });
    }
  }
  let cancelToken: CancelTokenSource;

  export const infiniteScroll = ({ fetch, element }) => {
    if (element) {
      const observer = new IntersectionObserver(
        (entries) => {
          const first = entries[0];
          if (first.isIntersecting) {
            fetch();
          }
        },
        { threshold: 1 }
      );
      observer.observe(element);
    }
  };

  function getAllLetterComboFromBackend() {
    return get<string[]>('/api/film/getAllOcurring2and3LetterCombos',
      undefined,
      cancelToken.token
    ).then((res)=>{
      console.log(res);
      letterCombos.set(res);
      return res;
    }).catch((err)=>{
      console.log(err);
    });
  }

  function refresh(cacheChange = false) {
    retrievingMovies.set(true);
    let movies: Movie[] = [];
    let searchTermHasChanged = prevSearchTerm !== $searchTerm
    if (prevSearchTerm !== $searchTerm) {currentPageIndex = 0} 
    prevSearchTerm = $searchTerm;
    if (cancelToken !== undefined) {
      cancelToken.cancel("Operation canceled due to new request.");
    }
    cancelToken = getCancelToken();
    get<PagedMovie>(
      `api/film/latest?search=${$searchTerm}&pageIndex=${currentPageIndex}`,
      undefined,
      cancelToken.token
      ).then(({
      results:res, 
      pageIndex,
      pageSize,
      filmsToAddUntilCompletion,
      seenAfterCrashCount,
      totalDbCount,
      totalCount,
      searchCount,
      pageCount}: PagedMovie) => {	
      numberOfMoviesToAddUntilCompletion = filmsToAddUntilCompletion;
      numberOfMoviesSeenAfterCrash = seenAfterCrashCount;
      numberOfMoviesInDB = totalDbCount;
      numberOfMoviesTotal = totalCount;
      numberOfMoviesSearched = searchCount;
      canLoadMore.set(pageIndex + 1 * pageSize < searchCount);
      
      if (res?.length !== 0) {
        const internalTmdbMovies: Movie[] = [];
        let i: number = 0;
        movies = res?.map((item, index) => {  
          const imdbNumber = getIMDBNumber(item?.Url);
          if (!imdbNumber) {
            internalTmdbMovies[index] = {
                ...item,
                imdbNumber,
                tmdbMovie: undefined,
              };
              return {...item}
            }
          tmdbMovies.update(t=>{
            getMovieByImdbId(imdbNumber).then((tmdb) => {
              internalTmdbMovies[index] = {
                ...item,
                imdbNumber,
                tmdbMovie: tmdb,
              };
              i++;
              if (i >= internalTmdbMovies.length || internalTmdbMovies.length === 10) {
                (searchTermHasChanged || cacheChange) ? tmdbMovies.set([...internalTmdbMovies]) : tmdbMovies.set([...t,...internalTmdbMovies]);                
                retrievingMovies.set(false)
              }
            });
            console.log('t',t);            return [...t]
          });
          retrievingMovies.set(false)
          showLoadMore.set($canLoadMore && !$retrievingMovies)
          return {
            ...item, 
            imdbNumber
          }
        });
      } 
      latestMovies.set(movies);

      if (movies?.length === 0) {
        tmdbMovies.set([])
        numberOfMoviesSearched = 0;
        retrievingMovies.set(false)
          showLoadMore.set($canLoadMore && !$retrievingMovies)
      }
    });
  }

  const searchValueChangeHandler = debounce((event) => {
    searchTerm.set(event.target.value);
    refresh();
  },300);

  refresh();

  function editMovie(film: Movie, e){
    e.stopPropagation();
    movie = {...film};
    dialog.show();
  }

  function newClickHandler() {
    dialog.show();
  } 

  function showLetterComboDialogHandler() {
    //getAllLetterComboFromBackend().then((res)=>{
      letterComboDialog.show();
    //});
  } 

  function showDeleteConfirmationDialog(tmdbMovie: Movie, e) {
    e.stopPropagation();
    selectedMovie = tmdbMovie;
    deleteConfirmationDialog.show();
  } 

  async function saveClickHandler() {  
    //TODO:add validation before adding movie
    if (editMode) {
      put(`api/film/update`, movie).then(()=>{
        dialog.hide();
        movie = undefined;
        refresh(true);
      })
    } else {
      post(`api/film/add`, movie).then(()=>{
        console.log('film added')
        dialog.hide();
        console.log('dialog hidden')
        movie = undefined;
        refresh(true);
      });
    }
  } 

  async function deleteClickHandler() {
    remove(`api/film/remove/${selectedMovie.Id}`).then(()=>{
      deleteConfirmationDialog.hide();
      selectedMovie = undefined;
      refresh(true);
    });
  }

  async function cancelClickHandler() {
    selectedMovie = undefined;
    deleteConfirmationDialog.hide();
  }

  async function cancelUpsertClickHandler() {
    movie = undefined;
    dialog.hide();
  }

  async function closeLetterComboDialogHandler() {
    letterComboDialog.hide();
  }

  async function loadMoreHandler() {
    currentPageIndex = currentPageIndex+1;
    refresh();   
  }
</script>

{#if error}
  <div>Error: found{error}</div>
  }
{:else}
  <div>
    <Search on:input={searchValueChangeHandler} label={'Search'}/> 
    <IconButton iconName={'add'} viewBox={'0 -2 24 24'} on:click={()=>newClickHandler()}/> 
    <Button on:click={()=>showLetterComboDialogHandler()}>Letter Combos</Button> 
    <LetterComboTile letterCombo="A"/>
    {#if numberOfMoviesSearched}<Statistics 
      searchedCount={numberOfMoviesSearched} 
      inDBCount={numberOfMoviesInDB} 
      totalCount={numberOfMoviesTotal} 
      addUntilCompleteCount={numberOfMoviesToAddUntilCompletion} 
      seenAfterCrashCount={numberOfMoviesSeenAfterCrash} 
    />
    {/if}
    {#if $retrievingMovies}
        <div>Retrieving movies...</div>
    {/if}    
    {#if $tmdbMovies.length === 0 && !$retrievingMovies}
      No movies found searching "{$searchTerm}"
    {:else}
      {#each $tmdbMovies.filter(x => x !== undefined) as movie}
        <MovieRow on:click={(e)=>editMovie(movie, e)}>
          <MovieTitle>{movie?.Title}</MovieTitle>(<Year date={movie?.tmdbMovie?.release_date} />)
          <MovieSeenAt date={movie?.SeenAt}></MovieSeenAt>    
          <Poster url={movie?.Url} src={movie?.tmdbMovie?.poster_path} alt={`Poster for movie '${movie?.Title}'`} />   
          <MovieRating rate={movie?.tmdbMovie?.vote_average} /> 
          <WordCount wordCount={movie?.wordCount} />          
          <Videos tmdbId={movie?.tmdbMovie?.id}/>
          <MovieDescription description={movie?.tmdbMovie?.overview} />
          <IconButton iconName="bin" on:click={(e)=>showDeleteConfirmationDialog(movie,e)}/>
        </MovieRow>      
      {/each}
      {#if $showLoadMore}
        <Button on:click={()=> loadMoreHandler()}>Load more</Button>
      {/if}   
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
    <Dialog bind:this={letterComboDialog} onclose={closeLetterComboDialogHandler}>
      <h2>Letter Combos</h2>
      <LetterComboTile letterCombo="A"/>
      <!-- {#each $letterCombos as letterCombo}
        <span>{letterCombo}, </span>
      {/each} -->
      <Button on:click={(e) => closeLetterComboDialogHandler()}>Ok</Button>
    </Dialog>
  </div>
{/if}

<style lang="scss">
  .movie-title {
    text-transform: capitalize;
  }
</style>

