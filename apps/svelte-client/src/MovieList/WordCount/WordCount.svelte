<script lang="ts">
  import type { WordCount } from "../../movie/movie.type";

  export let wordCount: WordCount[];
</script>

{#each wordCount as {word, count}}<span class={count===1 && 'unique'}>{word}: {count}</span>{/each}

<style lang="scss">
  span {
    padding-right: 4px;
    display: inline-block;
    color: #fff;
    font-size: 12px;
    font-family: Arial, sans-serif;
    border: 2px solid #333;
    background-color: #333;
    padding: 2px 8px 4px;
    margin: 3px 3px 0 0;
    
    -moz-border-radius: 4px;
    -webkit-border-radius: 4px;
    border-radius: 4px;
  }
  .unique {
    border: 2px solid orange;
    background-color: orange;
    color: darkred
  }
</style>
