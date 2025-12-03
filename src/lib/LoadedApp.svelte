<script>
    import { onMount } from 'svelte';
    import './LoadedApp.js'
    import * as BeamableSDK from 'beamable-sdk';

    let readyToLoadExternal = false;

    onMount(() => {
        if (!window.Beamable) {
            window.Beamable = BeamableSDK;
        }

        readyToLoadExternal = true;
    });
</script>

<svelte:head>
    {#if readyToLoadExternal}
        <script src="/external-app/main.js"></script>
        
        <link rel="stylesheet" href="/external-app/main.css">
    {/if}
</svelte:head>

<div>
</div>

<try-it-out>
</try-it-out>

<style>
  /* Local styles for the container if needed */
  div {
    width: 100%;
    min-height: 400px;
  }
</style>