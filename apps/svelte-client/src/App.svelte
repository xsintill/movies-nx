<script lang="ts">
  // import Paper, { Title, Content } from '@smui/paper';
  import MovieList from './MovieList/MovieList.svelte'; 
</script>

<main>
  <!-- <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/svelte-material-ui@4.0.0/bare.min.css" /> -->
  <h1>Movies Last Seen</h1>
  <MovieList /> 
  <!-- <Paper color="primary" class="paper-demo">
    <Title>Last Movies Seen</Title>
    <Content>
    </Content>
  </Paper> -->
</main>

<style lang="scss">
  /* :root {
    --mdc-theme-primary: black;
    --mdc-theme-secondary: #1d1ddf;
    --mdc-theme-background: #fff;
    --mdc-theme-surface: #fff;
    --mdc-theme-error: #b71c1c;
    --mdc-theme-on-primary: rgb(238, 235, 162);
    --mdc-theme-on-secondary: #fff;
    --mdc-theme-on-surface: #000;
    --mdc-theme-on-error: #fff;
    --mdc-theme-text-primary-on-background: rgba(0, 0, 0, 0.87);
    --mdc-theme-text-secondary-on-background: rgba(0, 0, 0, 0.54);
    --mdc-theme-text-hint-on-background: rgba(0, 0, 0, 0.38);
    --mdc-theme-text-disabled-on-background: rgba(0, 0, 0, 0.38);
    --mdc-theme-text-icon-on-background: rgba(0, 0, 0, 0.38);
    --mdc-theme-text-primary-on-light: rgba(0, 0, 0, 0.87);
    --mdc-theme-text-secondary-on-light: rgba(0, 0, 0, 0.54);
    --mdc-theme-text-hint-on-light: rgba(0, 0, 0, 0.38);
    --mdc-theme-text-disabled-on-light: rgba(0, 0, 0, 0.38);
    --mdc-theme-text-icon-on-light: rgba(0, 0, 0, 0.38);
    --mdc-theme-text-primary-on-dark: #fff;
    --mdc-theme-text-secondary-on-dark: hsla(0, 0%, 100%, 0.7);
    --mdc-theme-text-hint-on-dark: hsla(0, 0%, 100%, 0.5);
    --mdc-theme-text-disabled-on-dark: hsla(0, 0%, 100%, 0.5);
    --mdc-theme-text-icon-on-dark: hsla(0, 0%, 100%, 0.5);
  } */
  /* $titleColor: darkgrey; */

  /* * :global(.paper-demo) {
    margin: 0 auto;
    max-width: 1080px;
  } */
</style>
