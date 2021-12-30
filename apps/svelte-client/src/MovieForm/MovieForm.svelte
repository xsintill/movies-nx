<script lang="ts">
  import type { DbMovie } from '../movie/movie.type';
  import Form from '../ui/Form/Form.svelte';
  import IconButton from '../ui/Button/IconButton.svelte';
  import Input from '../ui/Input/Input.svelte';
  import MoviePoster from '../MovieList/MoviePoster/MoviePoster.svelte';
  import { getMovie, searchMovie } from '../tmdb/TMDB.utils';
  import type { TMDBMovie } from '../tmdb/TMDB.type';
  import { TMDBPosterSize } from '../tmdb/TMDB.const';

  let now = new Date();
  now.setHours(now.getHours() + 4)
  const defaultMovie: DbMovie = {
      Id: -1,
      Title: undefined,
      Url: undefined,
      SeenAt: now.toISOString().slice(0,19),
      Genres: undefined,
  };
  export let movie: DbMovie = defaultMovie;
  //datetime-local accepts a very specific format
  movie.SeenAt = new Date(movie.SeenAt).toISOString().slice(0,19)
  let posterPath: string;
  let tmdbMovie: TMDBMovie;

  function onSubmit() {}
  function setSeenAtToReleaseYear() {}

  async function onTitleBlur() {
    let {Title, Url} = movie;
    if (Title && !Url) {
        const tmdbSearchMovieResult = await searchMovie(Title);
        let innerTmdbMovie = await getMovie(tmdbSearchMovieResult.id);
        
        if (movie) {
            tmdbMovie = {...innerTmdbMovie};
            movie.Url = `http://www.imdb.com/title/${innerTmdbMovie.imdb_id}`;
            posterPath = innerTmdbMovie.poster_path;
        }        
    }
  }
</script>

<Form ref="movie-form-layout" on:submit={onSubmit}>
  <Input id="movieTitle" ref="movie-form-controls" label="Title" bind:value={movie.Title} on:blur={()=>onTitleBlur()}/>
  <Input id="movieUrl"ref="movie-form-controls" label="Url" bind:value={movie.Url} />
  <div>
    <Input id="movieSeenAt" ref="movie-form-controls" label="Seen At" type="datetime-local" bind:value={movie.SeenAt} />
    <IconButton ref="movie-form-history" on:click={() => setSeenAtToReleaseYear()} iconName="go-back-in-history" viewBox="0 0 48 48"/>
  </div>
  <MoviePoster url={movie.Url} ref="movie-form-poster" src={posterPath} size={TMDBPosterSize.w342} alt={`movie poster for ${movie.Title}`}/>
</Form>

<style lang="scss">
    :global([ref=movie-form-layout]) {
        display: grid;
        grid-gap: 8px;
        grid-template-columns: auto 342px;
        grid-template-rows: repeat(4, min-content) 1fr;
        min-height: 500px;
    }
    :global([ref=movie-form-poster]) {
        background-color: yellow;
        grid-column-start: 2; 
        grid-column-end: -1;
        grid-row-start: 1;
        grid-row-end: 5;

    }
    /* .movie-poster {
        background-color: yellow;
        grid-column-start: 2;
        grid-column-end: -1;
        grid-row-start: 1;
        grid-row-end: 4;
        width: 342px;
    } */
    :global([ref=movie-form-controls]) {
        grid-column-start: 1;
        grid-column-end: 2;
    }
    :global([ref=movie-form-history]) {
        grid-column-start: 1;
        grid-column-end: 2;
        width: 54px;
    } 

    /* :global([ref=movie-form-elements]) {
        display: grid;
        grid-template-rows: repeat(6, min-content);
    } */
    :global([ref=movie-form-date-controls]) {
        grid-column-start: 1;
        grid-column-end: 2;
        /* display: grid;
        column-gap: 8px;
        grid-template-columns: auto min-content; */
    } 
    /*:global([ref=movie-form-history]) {
        width: 54px;
    } */
</style>
