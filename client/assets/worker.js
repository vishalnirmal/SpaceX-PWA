const staticCacheName = "static-v36";
const dynamicCacheName = "dynamic-v36";
const assets = [
    "/",
    "/fallback",
    "/css/reset.css",
    "/css/theme.css",
    "/css/header.css",
    "/css/footer.css",
    "/css/index.css",
    "/css/fallback.css",
    "/css/comments.css",
    "/js/db.js",
    "/js/index.js",
    "/js/register.js",
    "/js/commentSync.js",
    "/js/headerUi.js",
    "/js/ui.js",
    "/images/mars.jpg",
    "/images/favicon.ico",
    "/images/logo-144.png",
    "/images/droneship-landing.png",
    "/images/facility-1.webp",
    "/images/facility-2.webp",
    "/images/facility-3.webp",
    "/images/facility-4.webp",
    "/images/facility-5.webp",
    "/images/facility-6.webp",
    "/images/section-background-2.jpg",
    "/images/comments/profile-picture.png",
    "https://kit.fontawesome.com/66d1c73752.js",
    "https://cdnjs.cloudflare.com/ajax/libs/uuid/8.1.0/uuidv4.min.js",
    "/manifest.json"
];
const routes = [
    "",
    "falcon-9",
    "falcon-heavy",
    "dragon",
    "starship",
    "journey",
    "fallback",
    "login",
    "register"
];
self.addEventListener("install", e => {
    e.waitUntil(
        caches.open(staticCacheName).then(cache => {
            cache.addAll(assets);
        })
    );
    self.skipWaiting();
});

self.addEventListener("activate", e => {
    console.log("Worker Activated");
    e.waitUntil(
        caches.keys().then(keys => {
            return Promise.all(
                keys
                .filter(key => key !== staticCacheName && key !== dynamicCacheName)
                .map(key => caches.delete(key))
            );
        })
    );
});

self.addEventListener("fetch", e => {
    if (e.request.url.indexOf('socket.io') > -1) {
        return;
    }
    if (e.request.url.indexOf('api/comment') > -1) {
        return;
    }
    e.respondWith(
        caches.match(e.request).then(cacheRes => {
            return cacheRes || fetch(e.request).then(fetchRes => {
                if (e.request.url.indexOf('user') > -1) {
                    return fetchRes;
                }
                return caches.open(dynamicCacheName).then(cache => {
                    cache.put(e.request.url, fetchRes.clone());
                    return fetchRes;
                });
            }).catch(_ => {
                let url = e.request.url;
                if (routes.includes(url.slice(url.lastIndexOf("/") + 1)))
                    return caches.match("/fallback");
            });
        })
    );
});

self.addEventListener('sync', (e) => {
    if (e.tag === 'sync-comments-offline') {
        e.waitUntil(syncTransactions());
        if (Notification.permission === 'granted') {
            var options = {
                body: 'The changes you made while offline are successfully uploaded to the server.',
                icon: "/images/logo-144.png",
                vibrate: [100, 50, 100]
            };
            self.registration.showNotification("Comments Updated!!!", options);
        }
    } else if (e.tag === 'sync-comments-online') {
        e.waitUntil(syncTransactions());
    }
});

let idb = async function (dbname) {
    return new Promise((resolve, reject) => {
        if (!('indexedDB' in self))
            reject("Your browser doesn't support IndexedDB");
        let db = null;
        let dbReq = indexedDB.open(dbname, 3);
        dbReq.onerror = (error) => {
            reject("Unable to open database, are you in private mode?");
            alert("Unable to open database, are you in private mode? If so then switch to normal mode to access spacex-wiki");
        }
        dbReq.onsuccess = (ev) => {
            db = ev.target.result;
            resolve(functions);
        }
        const get = async (_id) => {
            return new Promise((resolve, reject) => {
                let comment = {};
                let tx = db.transaction('transactionStore', 'readonly');
                tx.oncomplete = (ev) => {
                    resolve(comment);
                }
                tx.onerror = reject;
                let store = tx.objectStore('transactionStore');
                let request = store.get(_id);
                request.onsuccess = (ev) => {
                    comment = ev.target.result;
                }
                request.onerror = reject;
            });
        }
        const _delete = async (_id) => {
            return new Promise(async (resolve, reject) => {
                let comment = await get(_id);
                if (!comment) {
                    reject("No comment to delete");
                    return;
                }
                let tx = db.transaction('transactionStore', 'readwrite');
                tx.oncomplete = (ev) => {
                    resolve(comment);
                }
                tx.onerror = reject;
                let store = tx.objectStore('transactionStore');
                let request = store.delete(_id);
                request.onerror = reject;
            });
        }
        const getTxns = async () => {
            return new Promise((resolve, reject) => {
                let tx = db.transaction('transactionStore', 'readonly');
                tx.oncomplete = (ev) => {
                    resolve(comments);
                }
                tx.onerror = reject;
                let store = tx.objectStore('transactionStore');
                let index = store.index('timestampIndex');
                let request = index.getAll();
                let comments = [];
                request.onsuccess = (ev) => {
                    comments = ev.target.result;
                }
                request.onerror = reject;
            });
        }
        let functions = {
            _delete,
            getTxns
        }
    });
};

const syncTransactions = async () => {
    return new Promise((resolve, reject) => {
        idb('spacexDb').then((res) => {
            res.getTxns().then(async (transactions) => {
                for (let i = 0; i < transactions.length; i++) {
                    let transaction = transactions[i];
                    try {
                        await syncTransaction(res, transaction);
                    } catch (err) {
                        break;
                    }
                }
            }).then(resolve).catch(reject);
        })
    });
}

const syncTransaction = async (res, transaction) => {
    return new Promise((resolve, reject) => {
        fetch(transaction.url, {
            method: 'POST',
            headers: {
                'Content-type': 'application/json',
            },
            body: JSON.stringify(transaction.data)
        }).then(async () => {
            await res._delete(transaction._id).catch(console.log);
            resolve("Done");
        }).catch(() => {
            sendUploadNotification = true;
        });
    });
}