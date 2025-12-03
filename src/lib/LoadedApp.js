import JSZip, { files } from 'jszip';

class TryItOut extends HTMLElement {
    connectedCallback() {
        downloadLogs();
        this.waitForApp();
    }

    waitForApp() {
        if (window.TestingApp && window.TestingApp.bind) {
            this.init();
        } else {
            setTimeout(() => this.waitForApp(), 50);
        }
    }

    init() {
        const title = this.getAttribute('title') || 'Untitled';
        const args = this.getAttribute('args') || '';
        const gitFragment = this.getAttribute('git-fragment') || '';

        // Now we are 100% sure this exists
        window.TestingApp.bind(this, {
            gitFragment: gitFragment,
            gitCommit: 'Empty',
            args: args,
            title: title
        });
    }
}

async function downloadLogs() {
  try {
    const response = await fetch('https://dev.api.beamable.com/basic/33995890352142336.DE_33995890354239488.micro_PortalExtensionDiscoveryService/RequestPortalExtensionData', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        "Authorization": "Bearer 0d13f86a-4811-4a98-be0b-98c81c24d9e3",
        "x-de-scope": "gabriel-dev-55.DE_33995890354239488",
        "X-BEAM-SERVICE-ROUTING-KEY": 'micro_PortalExtensionDiscoveryService:macbook-pro_0c51c29b1b543f682209a4f6e4c64b0d'
      }
    });

    if (!response.ok) {
      throw new Error(`Error fetching logs: ${response.statusText}`);
    }

    const base64String = await response.text();

    console.log(base64String);

    if(!base64String) return;

    const zip = await JSZip.loadAsync(base64String, { base64: true });

    zip.forEach(async (relativePath, zipEntry) => {
        const fileString = await zipEntry.async("string");

        console.log(fileString);
    });

  } catch (error) {
    console.error('Download failed:', error);
  }
}

customElements.define('try-it-out', TryItOut);