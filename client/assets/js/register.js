if ("serviceWorker" in navigator){
    navigator.serviceWorker.register("/worker.js").then((worker)=>{
        console.log("Service Worker registered");
    }).catch(()=>{
        console.log("Error occured");
    });
}