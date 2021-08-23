<script lang="ts">
    export let name;
    export let width = "32";
    export let height = "32";
    export let fill = "gray";
    export let viewBox = `0 0 ${width} ${height}`;
    // export let focusable = false;


</script>
<svg 
  width={width} 
  height={height} 
  fill={fill} 
  viewBox={viewBox}
  xmlns="http://www.w3.org/2000/svg">
    <use href={`/assets/svgs/${name}.svg#${name}`}/>     
</svg>

<style lang="scss">   
</style>

