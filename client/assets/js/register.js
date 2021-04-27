// if ("serviceWorker" in navigator){
//     navigator.serviceWorker.register("/worker.js").then((worker)=>{
//         console.log("Service Worker registered");
//         Notification.requestPermission().then(status=>{
//             console.log(status);
//         })
//     }).catch(()=>{
//         console.log("Error occured");
//     });
// }