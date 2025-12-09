<script>
    import { onMount, onDestroy } from 'svelte';
    import JSZip, { files } from 'jszip';
    import './LoadedApp.js'
    import * as BeamableSDK from 'beamable-sdk';

    let isMounted = false;
    let timeoutId = null;
    let container;
    let appInstance = null;

    let blobUrl;
    let scriptElement;
    let styleElement;

    const namespace = "TestingApp";

    onMount(() => {
        if (!window.Beamable) {
            window.Beamable = BeamableSDK;
        }

        isMounted = true;

        loadAppDynamically();
    });

    onDestroy(() => {
        isMounted = false;
        clearTimeout(timeoutId);
        cleanupPreviousRender();
    });

    async function loadAppDynamically(){
        await requestExtension();
        timeoutId = setTimeout(loadAppDynamically, 250);
    }

    function cleanupPreviousRender() {
        if (appInstance && window[namespace]?.unmount) {
            window[namespace].unmount(appInstance);
            appInstance = null;
        }

        if (scriptElement) {
            scriptElement.remove();
            scriptElement = null;
        }
        if (styleElement) {
            styleElement.remove();
            styleElement = null;
        }

        if (blobUrl) {
            URL.revokeObjectURL(blobUrl);
            blobUrl = null;
        }
        
        if (window[namespace]) {
            delete window[namespace];
        }
    }

    async function requestExtension() {
        try {
            const response = await fetch('https://dev.api.beamable.com/basic/33995890352142336.DE_33995890354239488.micro_PortalExtensionDiscoveryService/RequestPortalExtensionData', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                "Authorization": "Bearer 4d298a48-eaeb-41cb-961e-7f9a9f77e3c3",
                "x-de-scope": "gabriel-dev-55.DE_33995890354239488",
                "X-BEAM-SERVICE-ROUTING-KEY": 'micro_PortalExtensionDiscoveryService:macbook-pro_0c51c29b1b543f682209a4f6e4c64b0d'
            }
            });

            if (!response.ok) {
                throw new Error(`Error fetching extension files: ${response.statusText}`);
            }

            const base64String = await response.text();

            if(base64String.length < 3) return;

            if (!isMounted) return;

            cleanupPreviousRender();

            console.log(JSON.stringify(base64String));
            const zip = await JSZip.loadAsync(base64String, { base64: true });

            const readPromises = [];

            zip.forEach(async (relativePath, zipEntry) => {

                const readTask = async () => {
                    const content = await zipEntry.async("string");
                    return { 
                        name: relativePath, 
                        content: content 
                    };
                }

                readPromises.push(readTask());
            });

            const files = await Promise.all(readPromises);

            let jsContent = null;
            let cssContent = null;

            files.forEach(file => {
                if (file.name.endsWith(".css")) {
                    cssContent = file.content;
                } else if (file.name.endsWith(".js")) {
                    jsContent = file.content;
                }
            });

            if(cssContent){
                console.log("Creating the style element");
                styleElement = document.createElement('style');
                styleElement.textContent = cssContent;
                document.head.appendChild(styleElement);
            }

            if(jsContent){
                console.log("Creating the script element");
                scriptElement = document.createElement('script');
                scriptElement.textContent = jsContent.replace(/<\/script>/g, '<\\/script>');

                document.body.appendChild(scriptElement);

                if (window[namespace] && window[namespace].mount) {
                    appInstance = window[namespace].mount(container);
                } else {
                    console.warn(`${namespace} not found on window after script injection.`);
                }
            }

            return;

        } catch (error) {
            console.error('Request failed:', error);
        }
    }
</script>

<div bind:this={container} class="remote-app-container">
  </div>

<style>
  /* Local styles for the container if needed */
  div {
    width: 100%;
    min-height: 400px;
  }
</style>