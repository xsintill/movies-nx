<script lang="ts">
    export let label: string;
    export let id: string;
    export let type: string = "text";
</script>

{#if label}
<label for={id||label}>{label}</label>
{/if}
<input id={id||label} {type} {...$$props}/>