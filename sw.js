var cacheName = 'hello-pwa-v01';
var filesToCache = [
  './',
  './index.html',
  './static/css/style.css',
  './static/js/main.js'
];

/* Start the service worker and cache all of the app's content */
self.addEventListener('install', function(e) {
  e.waitUntil(
    caches.open(cacheName).then(function(cache) {
      return cache.addAll(filesToCache);
    })
  );
});

/* Serve cached content when offline */
self.addEventListener('fetch', function(e) {
  e.respondWith(
    caches.match(e.request).then(function(response) {
      return response || fetch(e.request);
    })
  );
});

/* Serve cached content when offline */
self.addEventListener('fetch', function(e) {
  e.respondWith(
    caches.match(e.request).then(function(response) {
      return response || fetch(e.request);
    })
  );
});

/**
 * Some useful info about IndexedDB here:
 * https://itnext.io/indexeddb-your-second-step-towards-progressive-web-apps-pwa-dcbcd6cc2076
 */
class formDataIndexed {
  formDB = null;
  formDBStore = null;

  constructor() {
    this.init();
  }

  init = () => {
    // Create db (if needed) with version 1
    this.formDB = self.indexedDB.open('FORM_DATA', 1);    

    // add debugging success handler
    this.formDB.onsuccess = (event) => {
      console.log('[onsuccess]', this.formDB.result);
    };
    
    // add debugging error handler
    this.formDB.onerror = (event) => {
      console.log('[onerror]', this.formDB.error);
    };

    this.formDB.onupgradeneeded = function(event) {
      // debugger;
      var db = event.target.result;
      var store = db.createObjectStore('form1');
      var transaction = event.target.transaction;
    }
  }

  /**
   * Check indexedDB.form1 to find new records
   * If there are new records push them to the server and, after that, clear indexedDB.form1
   */
  pushToServer = () => {
    const transaction = this.formDB.result.transaction('form1', 'readwrite');
    const form1ObjectStore = transaction.objectStore('form1');
    const getAll = form1ObjectStore.getAll();

    transaction.oncomplete = (event) => {
      const needToPush = getAll.result || [];

      if (needToPush.length && navigator.onLine) {
        console.log("Push to server: " + JSON.stringify(needToPush)); // FINALLY PUSH DATA TO SERVER

        // Remove all data from IndexedDB
        const clearTransaction = this.formDB.result.transaction('form1', 'readwrite');
        const form1ClearObjectStore = clearTransaction.objectStore('form1');
        form1ClearObjectStore.clear();
      }
    };
  }
};

self.addEventListener('activate', event => {
  event.waitUntil(clients.claim());

  if(!self.indexedDB)
    return;
  
  const formDataIndexedDB = new formDataIndexed();

  setInterval(function () {
    formDataIndexedDB.pushToServer();
  }, 3000);
});