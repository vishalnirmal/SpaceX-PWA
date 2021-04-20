document.addEventListener("DOMContentLoaded", () => {
    let menu = document.querySelector(".icon-menu");
    let icon = document.querySelector(".icon-menu i");
    menu.addEventListener("click", () => {
        if (menu.parentElement.classList.contains("show-menu")) {
            menu.parentElement.classList.remove("show-menu");
            icon.classList.remove("fa-times");
            icon.classList.add("fa-bars");
        } else {
            menu.parentElement.classList.add("show-menu");
            icon.classList.remove("fa-bars");
            icon.classList.add("fa-times");
        }
    });
    let container = document.querySelector(".container");
    container.addEventListener("click", (e) => {
        if (e.target.tagName === "P") {
            if (e.target.classList.contains("reply-btn")) {
                let comment = e.target.parentElement.parentElement.parentElement;
                comment.classList.add("show-reply-form");
            } 
            else if (e.target.classList.contains("cancel-btn")) {
                let comment = e.target.parentElement.parentElement.parentElement.parentElement;
                comment.classList.remove("show-reply-form");
            } 
            else if (e.target.classList.contains("cta-comment")) {
                e.preventDefault();
                let comment = e.target.parentElement.parentElement.parentElement.parentElement;
                console.log(comment.id, comment.textContent);
            }
            
        }
        else if (e.target.tagName === "BUTTON"){
            let comment = e.target.parentElement.parentElement.parentElement.parentElement;
            let comment_id = comment.id.slice(7);
            let reply = e.target.parentElement.parentElement.comment;
            add_reply(reply.value, comment_id);
            reply.value = "";
            comment.classList.remove("show-reply-form");
        }
    });
});

const renderComments = async (data, id) => {
    let html = `
                <div class="comment" id="comment${id}">
                    <img src="images/comments/profile-picture.png" alt="Profile picture of ${data.username}">
                    <div class="comment-section">
                        <p class="name">${data.username} <span class="date">${new Date(data.date).toLocaleDateString()}</span></p>
                        <p class="comment-text">${data.comment}</p>
                        <div class="ctas">
                            <p class="cta cta-comment reply-btn">Relpy</p>
                        </div>
                        <form class="add-comment add-reply" onsubmit="return false">
                            <input type="text" name="comment" id="comment" placeholder="Add a comment" required>
                            <div class="comment-btn">
                                <button class="cta cta-comment">Comment</button>
                                <p class="cta cta-comment cancel-btn">Cancel</p>
                            </div>
                        </form>
                        <div class="reply">
                        </div>
                    </div>
                </div>
    `;
    let comment_tab = document.querySelector(".comments .container");
    comment_tab.innerHTML = html + comment_tab.innerHTML;
}

const renderReplies = (replyComment, replyId)=>{
    let html_reply = `
                    <div class="comment" id="${replyId}">
                        <img src="images/comments/profile-picture.png" alt="User Profile picture">
                        <div class="comment-section">
                            <p class="name">${replyComment.username} <span class="date">${new Date(replyComment.date).toLocaleDateString()}</span></p>
                            <p class="comment-text">${replyComment.comment}</p>
                        </div>
                    </div>`;
    let tid = setInterval(function(){
        let reply = document.querySelector("#comment"+replyComment.repliedTo+" .reply");
        if (reply){
            reply.innerHTML = html_reply + reply.innerHTML;
            clearInterval(tid);
        }
    }, 100);
}
