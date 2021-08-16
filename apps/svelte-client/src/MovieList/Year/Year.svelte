<script lang="ts">
  import dayjs from 'dayjs';

  export let date: Date;
</script>

<span>
  {dayjs(date).year()}
</span>
