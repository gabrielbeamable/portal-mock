<script>
  import LoadedApp from './lib/LoadedApp.svelte'
</script>

<main>
  <div class="title">
    <h1>Below this should have a built portal extension</h1>
  </div>

  <div class="integration-wrapper">
    <LoadedApp />
  </div>
</main>

<style>

  .title {
    display: flex;
    align-items: center;
    gap: 1rem;
  }

  .card {
    align-self: center;
  }

  .logo {
    height: 6em;
    padding: 1.5em;
    will-change: filter;
    transition: filter 300ms;
  }
  .logo.beam:hover {
    filter: drop-shadow(0 0 2em #ff3e00aa);
  }
  .read-the-docs {
    color: #888;
    align-self: center;
  }
</style>
