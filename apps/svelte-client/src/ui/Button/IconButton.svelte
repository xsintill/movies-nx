<script lang="ts">
    import Icon from '../Icon/Icon.svelte';

    export let iconName: string;
    export let width: string = "32";
    export let height: string = "32";
    export let viewBox: string = `0 0 ${width} ${height}`;
</script>

<button type="button" on:click>
    <Icon name={iconName} {width} {height} {viewBox}/>
</button>

<style>
 
</style>
