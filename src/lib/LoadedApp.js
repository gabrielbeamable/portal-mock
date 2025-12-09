import JSZip, { files } from 'jszip';

// class TryItOut extends HTMLElement {
//     connectedCallback() {
//         requestExtension();
//         this.waitForApp();
//     }

//     waitForApp() {
//         if (window.TestingApp && window.TestingApp.bind) {
//             this.init();
//         } else {
//             setTimeout(() => this.waitForApp(), 50);
//         }
//     }

//     init() {
//         const title = this.getAttribute('title') || 'Untitled';
//         const args = this.getAttribute('args') || '';
//         const gitFragment = this.getAttribute('git-fragment') || '';

//         window.TestingApp.bind(this, {
//             gitFragment: gitFragment,
//             gitCommit: 'Empty',
//             args: args,
//             title: title
//         });
//     }
// }

