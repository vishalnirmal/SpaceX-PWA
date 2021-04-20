var firebaseConfig = {
    apiKey: "AIzaSyBdE3mrEb8mT-ntgOUuM5U_7X-wAbsxTko",
    authDomain: "spacex-pwa-40850.firebaseapp.com",
    projectId: "spacex-pwa-40850",
    storageBucket: "spacex-pwa-40850.appspot.com",
    messagingSenderId: "944958377475",
    appId: "1:944958377475:web:6e5cdec6dcd8290e624836"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();
db.enablePersistence()
    .catch(err=>{
        if (err.code === "failed-precondition"){
                console.log("Persistence failed");
        }
        if (err.code === "unimplemented"){
            console.log("persistence unavailable");
        }
    });

db.collection(collection_path).onSnapshot(snapshot=>{
    snapshot.docChanges().forEach(change =>{
        let obj = change.doc.data();
        if (change.type === "added"){
            if (!obj.isAReply){
                console.log("called render comment");
                renderComments(obj, change.doc.id);
            }
            else{
                console.log("called render reply");
                renderReplies(obj, change.doc.id);
            }
        }
    });
});

let add_comment = document.querySelector("#demo-form");
add_comment.addEventListener("submit", e=>{
    e.preventDefault();
    let obj = {
        username: "Anonymous",
        date: Date.now(),
        isAReply: false,
        repliedTo: "",
        replies: [],
        comment: e.target.comment.value
    };
    e.target.comment.value = "";
    db.collection(collection_path).add(obj).catch(err=>console.log(err));
});
let add_reply = (reply, comment_id)=>{
    db.collection(collection_path).add({
        comment: reply,
        date: Date.now(),
        isAReply: true,
        repliedTo: comment_id,
        replies: [],
        username: "Anonymous"
    }).then(docRef=>{
        db.collection(collection_path).doc(comment_id).update({
            replies: firebase.firestore.FieldValue.arrayUnion(docRef.id)
        }).catch(err=>console.log("Error while updating comment reply."));
    }).catch(err=>{
        console.log(err);
    })
}