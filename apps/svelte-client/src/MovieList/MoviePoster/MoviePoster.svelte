<script lang="ts">
  import { TMDBPosterSize } from "../../tmdb/TMDB.const";

  export let src: string;
  export let alt: string;
  export let size: string = TMDBPosterSize.w154;
  export let url: string;

  let widthClass = size;

  function clickHandler(url: string, e) {
    e.stopPropagation();
    window.open(url);   
  }

  $: posterPath = src ? `http://image.tmdb.org/t/p/${size}/${src}`: '/assets/images/placeholder-movie-poster.jpg'; 
</script>

<img 
  {...$$props} 
  class={`${$$props.class || ''} ${widthClass}`} 
  src={posterPath} 
  alt={alt}
  on:click={(e)=>clickHandler(url,e)} />


<style lang="scss">
  .w92 {
    width: 92px;
  }
  .w154 {
    width: 154px;
  }
  .w185 {
    width: 185px;
  }
  .w342 {
    width: 342px;
  }
  .w500 {
    width: 500px;
  }
  .w780 {
    width: 780px;
  }
  img:hover {    
    cursor: pointer;
  }
</style>
