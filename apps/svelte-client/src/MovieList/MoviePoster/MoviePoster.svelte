<script lang="ts">
  export let src: string;
  export let alt: string;

  const posterPath = src ? `http://image.tmdb.org/t/p/w154/${src}`: '/assets/images/placeholder-movie-poster.jpg'; 
</script>

<img src={posterPath} alt={alt}>

<style lang="scss">
  img {
    width: 154px;
  }
</style>
