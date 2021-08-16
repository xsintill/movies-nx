<script lang="ts">
  // import List, { Item, Graphic, Text } from '@smui/list';
  import MovieTitle from './MovieTitle/MovieTitle.svelte';
  import MovieSeenAt from './MovieSeenAt/MovieSeenAt.svelte';
  import MovieRow from './MovieRow/MovieRow.svelte';
  import Poster from './MoviePoster/MoviePoster.svelte';
  import MovieRating from './MovieRating/MovieRating.svelte';
  import Trailer from './Trailer/Trailer.svelte';
  // // import { IMDBNumber } from './IMDBNumber/index';
  import { Year } from './Year/index';
  import get from '../axios/get';
  import type { Movie } from '../movie/movie.type';
  import { latestMovies, tmdbMovies } from '../movie/movie.store';
  import { getIMDBNumber } from './IMDB.utils';
  import { getMovieByImdbId } from '../tmdb/TMDB.utils';
	
	let error;	
	get<Movie[]>(`api/film/latest`).then(res => {	
    const internalTmdbMovies: Movie[] = [];
    let i: number = 0;
    const movies = res.map(item => {      
      const imdbNumber = getIMDBNumber(item.Url);
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
    latestMovies.set(movies);
  });

  function movieClickHandler(url: string) {
    console.log(1,url)
    // window.open(url)    
  }
</script>

{#if error}
  <div>Error: found{error}</div>
  }
{/if}
{#if !error}
  <div>
    <!-- <List class="demo-list" twoLine avatarList> -->
    
      {#each $tmdbMovies as {Url, Title, SeenAt, tmdbMovie}}
      <MovieRow on:click={()=>movieClickHandler(Url)}>
        <MovieTitle>{Title}</MovieTitle>(<Year date={tmdbMovie?.release_date} />)
        <MovieSeenAt date={SeenAt}></MovieSeenAt>    
        <Poster src={tmdbMovie?.poster_path} alt={`Poster for movie '${Title}'`} />   
        <MovieRating rate={tmdbMovie?.vote_average} voteCount={tmdbMovie?.vote_count}/> 
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
    <!-- </List> -->
  </div>
{/if}

