// const staticCacheName = "static-v4";
// const dynamicCacheName = "dynamic-v1";
// const basicList = [
//     "/",
//     "/assets/css/reset.css",
//     "/assets/css/index.css",
//     "/assets/css/theme.css",
//     "/assets/js/index.js",
//     "/assets/js/register.js",
//     "/assets/images/droneship-landing.png",
//     "/assets/images/facility-1.webp",
//     "/assets/images/facility-2.webp",
//     "/assets/images/facility-3.webp",
//     "/assets/images/facility-4.webp",
//     "/assets/images/facility-5.webp",
//     "/assets/images/facility-6.webp",
//     "/assets/images/mars.jpg",
//     "/assets/images/section-background-2.jpg",
//     "https://kit.fontawesome.com/66d1c73752.js",
//     "https://fonts.googleapis.com/css2?family=Play:wght@400;700&display=swap",
//     "https://fonts.gstatic.com/s/play/v12/6aez4K2oVqwIvtg2H68T.woff2",
//     "https://fonts.gstatic.com/s/play/v12/6ae84K2oVqwItm4TCpQy2knT.woff2",
//     "https://fonts.gstatic.com/s/play/v12/6ae84K2oVqwItm4TCpAy2g.woff2"
// ];
// self.addEventListener("install", event=>{
//     event.waitUntil(
//         caches.open(staticCacheName).then(cache=>{
//             cache.addAll(basicList);
//         })
//     );
// });

// self.addEventListener("fetch", event=>{
//     event.respondWith(
//         caches.match(event.request.url).then(cacheRes=>{
//             return cacheRes || fetch(event.request.url);
//         })
//     );
// });