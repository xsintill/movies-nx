<script lang="ts">
  import { getIMDBNumber } from '../IMDB.utils';
  
  export let url: string;
</script>

<span>
  {getIMDBNumber(url)}
</span>

<style lang="scss">

</style>
