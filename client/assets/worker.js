const staticCacheName = "static-v59";
const dynamicCacheName = "dynamic-v22";
const assets = [
    "/",
    "/fallback",
    "css/reset.css",
    "css/theme.css",
    "css/header.css",
    "css/footer.css",
    "css/index.css",
    "css/fallback.css",
    "css/comments.css",
    "js/db.js",
    "js/index.js",
    "js/register.js",
    "images/mars.jpg",
    "images/favicon.ico",
    "images/droneship-landing.png",
    "images/facility-1.webp",
    "images/facility-2.webp",
    "images/facility-3.webp",
    "images/facility-4.webp",
    "images/facility-5.webp",
    "images/facility-6.webp",
    "images/section-background-2.jpg",
    "images/comments/profile-picture.png",
    "https://kit.fontawesome.com/66d1c73752.js"
];
const routes = [
    "",
    "falcon-9",
    "falcon-heavy",
    "dragon",
    "starship",
    "journey",
    "fallback"
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
    if (e.request.url.indexOf("firestore.googleapis.com") > -1) return;
    e.respondWith(
        caches.match(e.request).then(cacheRes => {
            return cacheRes || fetch(e.request).then(fetchRes => {
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

// self.addEventListener('notificationclick', function(e) {
//     var notification = e.notification;
//     var primaryKey = notification.data.primaryKey;
//     var action = e.action;
  
//     if (action === 'close') {
//       notification.close();
//     } else {
//         self.window.location.focus();
//         notification.close();
//     }
//   });