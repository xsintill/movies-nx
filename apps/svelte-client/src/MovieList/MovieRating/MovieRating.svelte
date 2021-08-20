<script lang="ts">
  export let rate: number;
</script>

{#if (rate)}<span class="movie-rating" title="TMDB User Rating">
  {rate}
</span>
{/if}

<style lang="scss">
  .movie-rating {    
    font-size: 22px;
    font-weight:700
  }
</style>
