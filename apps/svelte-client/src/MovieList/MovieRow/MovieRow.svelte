<script lang="ts">
  // function clickHandler(url: string) {
  //   window.open(url);   
  // }
  export let url: string;
</script>

<!-- on:click={()=>clickHandler(url)} -->
<div on:click>
  <slot />
</div>

<style lang="scss">
  div{  
    margin-bottom: 4px;
    margin-left: 6px;
    margin-right: 6px;
    padding-left: 16px;
    padding-top: 8px;
    padding-bottom: 8px;
    border-left: lightblue solid 4px;

    &:hover {
      background-color: rgba(243, 243, 243, 0.767);
      box-shadow: 0 8px 16px rgba(0,0,0,0.25), 0 8px 8px rgba(0,0,0,0.22);
      transform: scale(1.01);
    }
  }
</style>
