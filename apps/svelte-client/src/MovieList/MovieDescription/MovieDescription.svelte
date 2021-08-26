<script lang="ts">
  export let description: string;
</script>

{#if (description)}<div>
  {description}
</div>
{/if}

<style lang="scss">
  div {    
    font-style: italic;
    &::first-letter {
      font-size: 200%;
    }
  }
</style>
