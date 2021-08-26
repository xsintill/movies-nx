<script lang="ts">
  export let label: string;
  export let id: string;
  export let value: string;
</script>

<div>
  {#if label}
    <label for={id || label}>{label}</label>
  {/if}
  <input bind:value id={id || label} on:blur {...$$props} />
</div>

<style lang="scss">
    div {
        input {
            width: 100%;
        }
    }
</style>
