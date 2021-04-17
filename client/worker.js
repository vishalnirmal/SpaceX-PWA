const staticCacheName = "static-v4";
const dynamicCacheName = "dynamic-v4";
const assets = [
    "/",
    "/fallback",
    "/assets/css/reset.css",
    "/assets/css/theme.css",
    "/assets/css/header.css",
    "/assets/css/footer.css",
    "/assets/css/index.css",
    "/assets/css/fallback.css",
    "/assets/js/index.js",
    "/assets/js/register.js",
    "/assets/images/mars.jpg",
    "/assets/images/droneship-landing.png",
    "/assets/images/facility-1.webp",
    "/assets/images/facility-2.webp",
    "/assets/images/facility-3.webp",
    "/assets/images/facility-4.webp",
    "/assets/images/facility-5.webp",
    "/assets/images/facility-6.webp",
    "/assets/images/section-background-2.jpg",
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
self.addEventListener("install", e=>{
    console.log("Worker Installed");
    e.waitUntil(
        caches.open(staticCacheName).then(cache=>{
            cache.addAll(assets);
        })
    );
});

self.addEventListener("activate", e=>{
    console.log("Worker Activated");
    e.waitUntil(
        caches.keys().then(keys=>{
            return Promise.all(
                keys
                .filter(key=> key !== staticCacheName && key !== dynamicCacheName)
                .map(key=>caches.delete(key))
            );
        })
    );
});

self.addEventListener("fetch", e=>{
    e.respondWith(
        caches.match(e.request).then(cacheRes =>{
            return cacheRes || fetch(e.request).then(fetchRes => {
                return caches.open(dynamicCacheName).then(cache=>{
                    cache.put(e.request.url, fetchRes.clone());
                    return fetchRes;
                });
            }).catch(_=>{
                let url = e.request.url;
                console.log(url.slice(url.lastIndexOf("/")+1), routes.includes(url.slice(url.lastIndexOf("/")+1)));
                if (routes.includes(url.slice(url.lastIndexOf("/")+1)))
                    return caches.match("/fallback");
            });
        })
    );
});