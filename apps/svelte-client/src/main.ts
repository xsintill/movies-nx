import App from './App.svelte';
import { initGetCache } from './axios/cache/cache';

let app;
function timeout() {
  setTimeout(() => { 
    app = new App({
      target: document.body
    });
  }, 100);
} 
initGetCache(timeout);
 

export default app;
