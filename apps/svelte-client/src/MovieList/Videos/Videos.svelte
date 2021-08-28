<script lang="ts">
  import type { TMDBMovieVideo } from "../../tmdb/TMDB.type";
  import Button from "../../ui/Button/Button.svelte";
  import { getMovieVideos } from "../../tmdb/TMDB.utils";


  // export let video: string;
  export let tmdbId: number;

  async function getVideos(id: number) {
    return await (await getMovieVideos(id)).results;
  }
  let videos: TMDBMovieVideo[] = [];
  if (tmdbId) {
    getVideos(tmdbId).then(results=> videos = [...results]);
  }

  function trailerClick(key, site, e) {    
    let url: string;
    e.stopPropagation();
    if (site === 'YouTube') {
      url = `https://www.youtube.com/watch?v=${key}`;
    } else if (site === 'vimeo') {
      url = `https://vimeo.com/${key}`;
    }
    window.open(url);
  }
</script>

{#each videos as {key, site, type}}
<Button class="trailer-button" on:click={(e)=>trailerClick(key, site, e)}>{type}</Button>
{/each}

<style lang="scss">
 
</style>
