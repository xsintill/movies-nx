<script lang="ts">
  import dayjs from 'dayjs';
  import localizedFormat from 'dayjs/plugin/localizedFormat';

  dayjs.extend(localizedFormat);

  export let date;  
  let internalDate = dayjs(date).format('ll');
</script>

<span class="movie-seen-at">
  {internalDate}  
</span>

<style lang="scss">
  .movie-seen-at { 
    color: rgb(180, 180, 175);     
    display: block;
  }
</style>
