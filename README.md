## Service worker sample offline form submission

## Online demo available here:

https://giub.github.io/service-worker-sample-offline-form-submission/

A dummy demo by: giub.it

### Before u try

Under `sw.js` remove these from _fileToCache_:
```bash
'/index.html',
'/static/js/main.js'
```

### How it works:

After form submission, data are stored in indexedDB
Check `Chrome -> Application -> IndexedDB.form1`
To understand the _save method_ check the code under `main.js -> storeData()`
Note: we used indexedDB cause localStorage does not work with service-worker

Every 6 seconds we scheduled an event that check if there are new formData stored under indexedDB.form1, if so, push them to the server (with a fake console.log 🙃) then clear indexedDB Note: check `sw.js -> formDataIndexed.pushToServer()`

Note: If u have problems try to "Unregister" the service worker or check "Update on reload"
Note: If you want to test locally create your self-signed certificate and run this command from terminal (used to `--ignore-certificate-errors`):

```bash
/Applications/Google\ Chrome.app/Contents/MacOS/Google\ Chrome --user-data-dir=/tmp/foo --ignore-certificate-errors --unsafely-treat-insecure-origin-as-secure=https://sw.local
```