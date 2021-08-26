<script lang="ts">
  export let label: string;
</script>

<button type="button" on:click {...$$props}>{label ? label : ''}<slot/></button>

<style>
</style>
