<script lang="ts">
  import type { LetterCombo } from './LetterCombo.type';

  export let letterCombo: LetterCombo;
  let twoLetterOccuranceCompletion: number = 0;
  let threeLetterOccuranceCompletion: number= 0;
</script>

{#if (letterCombo)}<div class="letter-combo-tile">
  <div class="collapse-to-top button">^</div>
  <span class="row">
    <span class="collapse-to-left button">&lt;</span>
    <span class="lettercombo">{letterCombo}</span>
    <span class="column">
      <span class="letter-occurance-completion">{twoLetterOccuranceCompletion}%</span>
      <span class="letter-occurance-completion">{threeLetterOccuranceCompletion}%</span>
    </span>
    <span class="expand-to-right button">></span>
  </span>
  <!-- {#if (bottomExpanded)} -->
  <div class="expand-to-bottom button">V</div>
  <!-- {/if} -->
</div>
{/if}
<style lang="scss">
  //wrapper class show itç children in a row using flexbox
  .row {
    display: flex;
    flex-direction: row;
    flex-wrap: nowrap;
  }
  .column {
    display: flex;
    flex-direction: column;
    flex-wrap: nowrap;
  }
  .lettercombo {
    display: flex;
    font-size: 1.5em;
    font-weight: bold;
    text-align: center;
    width: 100%;
    vertical-align: middle;     
    text-align: center;
  }
  .button {
    border: 1px solid #ccc;
    cursor: pointer;
    //darken on hover
    &:hover {
      background-color: #ddd;
    }
  }
  .letter-combo-tile {    
    // small border around the div
    width: 75px;
    
    vertical-align: middle; 

  }
  .collapse-to-top{    
    height: auto;
    //center text horizontally using textAlign
    text-align: center;
  }
  .collapse-to-left{
    width: 24px;
    //center text vertically
    vertical-align: middle; 
  }
  .expand-to-right{
    height: auto;
    width: 24px;
    //center text vertically
    vertical-align: middle; 
  }
  .expand-to-bottom{
    width: 100%;
    //center text horizontally using textAlign
    text-align: center; 
  }
  .two-letter-occurance-completion {
    display: inline-block;
    font-size: 1.5em;
    font-weight: bold;
    text-align: center;
    width: 100%;
  }
  .three-letter-occurance-completion {
    display: inline-block;
    font-size: 1.5em;
    font-weight: bold;
    text-align: center;
    width: 100%;
  }
</style>
