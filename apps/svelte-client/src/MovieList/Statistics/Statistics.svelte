<script lang="ts">  
  export let searchedCount: number;
  export let inDBCount: number;
  export let totalCount: number;
  export let addUntilCompleteCount: number;
  export let seenAfterCrashCount: number;
</script>

<div>
  <span class="total-count">Total: {totalCount}</span>
  <span>Filtered: {searchedCount}</span>
  <span>In DB: {inDBCount}</span>
  <span>Seen after crash: {seenAfterCrashCount}</span>
  <span>Add to complete: {addUntilCompleteCount}</span>
</div>

<style lang="scss">
  div {
    font-size: 9px;
    font-weight: 400;
  }
  .total-count {
    font-size: 12px;
    font-weight: 500;

  }
</style>
