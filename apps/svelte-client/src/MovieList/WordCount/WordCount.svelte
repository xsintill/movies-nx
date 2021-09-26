<script lang="ts">
  import type { WordCount } from "../../movie/movie.type";
  import Dialog from '../../ui/Dialog/Dialog.svelte';
  import Button from '../../ui/Button/Button.svelte';  
  import { get } from '../../axios/get';

  export let wordCount: WordCount[];
  let dialog: Dialog;
  let word: string;
  let films: {Title: string}[];
  let scale: number;

  async function showFilmsForWordDialog(innerWord: string, e: Event) {
    e.stopPropagation();
    word = innerWord;
    films = (await get<{films: {Title: string}[]}>(`api/film/getFilmsForWord?word=${innerWord}`)).films;
    dialog.show();
  } 
  async function closeHandler(e: Event) {    
    e.stopPropagation();
    dialog.hide();
  }
</script>

{#each wordCount as {word, count}}
  <span 
    class={count===1 && 'unique'} 
    disabled={count===1} 
    on:click={(e) => showFilmsForWordDialog(word, e)}>
    {word}: {count}
  </span>
{/each}
<Dialog bind:this={dialog} onclose={closeHandler}>
  <h2>Movies for '{word}'</h2>
  {#each films as {Title}}<div>{Title}</div>{/each}
  <Button on:click={(e) => closeHandler(e)}>Ok</Button>
</Dialog>

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

  span:hover:not(.unique) {
    color: #ffee10;
    box-shadow: 0 0 5px #ffee10;
    text-shadow: 0 0 5px #ffee10;
    cursor: pointer;
    transform: scale(1.1); 
  }
  
  .unique {
    border: 2px solid orange;
    background-color: orange;
    color: darkred
  }

</style>
