<script lang="ts">
  export let rate: number;
  export let voteCount: number;
</script>

<span class="movie-rating" title="TMDB User Rating">
  {rate}
  <!-- /{voteCount} -->
</span>

<style lang="scss">
  .movie-rating {    
    font-size: 22px;
    font-weight:700
  }
</style>
