let container = document.querySelector(".container");
let comment = document.querySelector(".comments .add-comment");
let user_id = document.body.getAttribute("user-id");
let mainComment = document.querySelector("form#demo-form");
mainComment.addEventListener("submit", (e) => {
    e.preventDefault();
    sendComment({
        text: mainComment.comment.value
    });
    e.target.reset();
});
if (user_id) {
    comment.classList.remove("hidden");
} else {
    comment.classList.add("hidden");
}
container.addEventListener("click", (e) => {
    let likes = JSON.parse(localStorage.getItem("likes"));
    let dislikes = JSON.parse(localStorage.getItem("dislikes"));
    let comment_id = e.target.getAttribute("data-id");
    let comment_element = document.querySelector(`.comment[data-id="${comment_id}"]`);
    if (user_id) {
        if (e.target.tagName === "P") {
            if (e.target.classList.contains("reply-btn")) {
                comment_element.classList.add("show-reply-form");
            } else if (e.target.classList.contains("cancel-btn")) {
                comment_element.classList.remove("show-reply-form");
            } else if (e.target.classList.contains("cancel-update-btn")) {
                comment_element.classList.remove("edit");
            }
        } 
        else if (e.target.tagName === "I") {
            let type = "";
            let comment = {
                comment_id
            };
            let indexl = likes.indexOf(comment_id);
            let indexd = dislikes.indexOf(comment_id);
            if (e.target.classList.contains("like")) {
                if (indexl > -1) {
                    type = "removeLike";
                    likes.splice(indexl, 1)
                } else {
                    type = "addLike";
                    likes.push(comment_id);
                    if (indexd > -1)
                        dislikes.splice(indexd, 1);
                }
                localStorage.setItem("likes", JSON.stringify(likes));
                localStorage.setItem("dislikes", JSON.stringify(dislikes));
                updateComment(comment, type);
            } else if (e.target.classList.contains("dislike")) {
                if (indexd > -1) {
                    type = "removeDislike";
                    dislikes.splice(indexd, 1);
                } else {
                    type = "addDislike";
                    dislikes.push(comment_id);
                    if (indexl > -1)
                        likes.splice(indexl, 1);
                }
                localStorage.setItem("likes", JSON.stringify(likes));
                localStorage.setItem("dislikes", JSON.stringify(dislikes));
                updateComment(comment, type);
            } else if (e.target.classList.contains("delete")) {
                type = "deleteComment";
                updateComment(comment, type);
            } else if (e.target.classList.contains("edit")) {
                comment_element.classList.add("edit");
            }
        } else if (e.target.tagName === "BUTTON") {
            e.preventDefault();
            let form = e.target.parentElement.parentElement;
            let comment_field = form.comment.value;
            if (form.classList.contains("add-reply")) {
                let comment = {
                    text: comment_field,
                    replied_to: e.target.getAttribute("data-id")
                };
                sendComment(comment);
                comment_element.classList.remove("show-reply-form");
            } else if (form.classList.contains("update-comment")) {
                let comment = {
                    text: comment_field,
                    _id: e.target.getAttribute("data-id")
                }
                updateCommentText(comment);
                comment_element.classList.remove("edit");
            }
            form.comment.value = "";
        }
    }
});

const deleteComment = (comment_id) => {
    let comment = document.querySelector(`.comment[data-id="${comment_id}"]`);
    comment.remove();
}

const renderComment = (comment)=>{
    let likes = localStorage.getItem("likes");
    let dislikes = localStorage.getItem("dislikes");
    let is_a_comment = !(comment.replied_to);
    let reply_button = `<p class="cta cta-comment reply-btn" data-id="${comment._id}">Relpy</p>`;
    let user_previleges = `<div class="count">
                            <p class="count-btn" data-id="${comment._id}"><i class="far fa-trash-alt delete" data-id="${comment._id}"></i></p>
                        </div>
                        <div class="count">
                            <p class="count-btn" data-id="${comment._id}"><i class="far fa-edit edit" data-id="${comment._id}"></i></p>
                        </div>`;
    let reply_form = `<form class="add-comment add-reply" onsubmit="return false">
                            <input type="text" name="comment" id="comment" placeholder="Add a comment" autocomplete="off" required>
                            <div class="comment-btn">
                                <button class="cta cta-comment" type="button" data-id="${comment._id}">Comment</button>
                                <p class="cta cta-comment cancel-btn" data-id="${comment._id}">Cancel</p>
                            </div>
                        </form>`;
    let update_form = `<form class="add-comment update-comment" onsubmit="return false">
                            <input type="text" name="comment" id="comment" value="${comment.text}" autocomplete="off" required>
                            <div class="comment-btn">
                                <button class="cta cta-comment" type="button" data-id="${comment._id}">Update</button>
                                <p class="cta cta-comment cancel-update-btn" data-id="${comment._id}">Cancel</p>
                            </div>
                        </form>`;
    let comment_text = `<p class="comment-text">${comment.text}</p>`;
    let html = `
                <div class="comment" data-id="${comment._id}">
                    <img src="images/comments/profile-picture.png" alt="Profile picture of ${comment.user.name}">
                    <div class="comment-section">
                        <p class="name">${comment.user.name} <span class="date">${new Date(comment.date).toLocaleDateString()}</span></p>
                        ${update_form}
                        ${comment_text}
                        <div class="ctas">
                            <div class="count">
                                <p class="count-btn" data-id="${comment._id}"><i class="fa-heart like ${(likes.includes(comment._id))?"fas":"far"}" data-id="${comment._id}"></i></p>
                                <p>${comment.likes.length}</p>
                            </div>
                            <div class="count">
                                <p class="count-btn" data-id="${comment._id}"><i class="fa-thumbs-down dislike ${(dislikes.includes(comment._id))?"fas":"far"}" data-id="${comment._id}"></i></p>
                                <p>${comment.dislikes.length}</p>
                            </div>
                            ${
                                (user_id && is_a_comment)?reply_button:""
                            }
                            
                            ${
                                (user_id === comment.user._id)?user_previleges:""
                            }
                        </div>
                        ${
                            (user_id && is_a_comment)?reply_form:""
                        }
                        ${
                            (is_a_comment)?`<div class="reply"></div>`:""
                        }
                    </div>
                </div>
    `;
    if (is_a_comment){
        let comment_tab = document.querySelector(".comments .container");
        comment_tab.innerHTML += html;
        comment.replies.forEach(reply => {
            renderComment(reply);
        });
    }
    else{
        let reply = document.querySelector(`.comment[data-id="${comment.replied_to}"] .reply`);
        reply.innerHTML += html;
    }
}

const changeComment = (comment)=>{
    let likes = localStorage.getItem("likes");
    let dislikes = localStorage.getItem("dislikes");
    let is_a_comment = !(comment.replied_to);
    let reply_button = `<p class="cta cta-comment reply-btn" data-id="${comment._id}">Relpy</p>`;
    let user_previleges = `<div class="count">
                            <p class="count-btn" data-id="${comment._id}"><i class="far fa-trash-alt delete" data-id="${comment._id}"></i></p>
                        </div>
                        <div class="count">
                            <p class="count-btn" data-id="${comment._id}"><i class="far fa-edit edit" data-id="${comment._id}"></i></p>
                        </div>`;
    let reply_form = `<form class="add-comment add-reply" onsubmit="return false">
                            <input type="text" name="comment" id="comment" placeholder="Add a comment" autocomplete="off" required>
                            <div class="comment-btn">
                                <button class="cta cta-comment" type="button" data-id="${comment._id}">Comment</button>
                                <p class="cta cta-comment cancel-btn" data-id="${comment._id}">Cancel</p>
                            </div>
                        </form>`;
    let update_form = `<form class="add-comment update-comment" onsubmit="return false">
                            <input type="text" name="comment" id="comment" value="${comment.text}" autocomplete="off" required>
                            <div class="comment-btn">
                                <button class="cta cta-comment" type="button" data-id="${comment._id}">Update</button>
                                <p class="cta cta-comment cancel-update-btn" data-id="${comment._id}">Cancel</p>
                            </div>
                        </form>`;
    let comment_text = `<p class="comment-text">${comment.text}</p>`;
    let html = `
                    <img src="images/comments/profile-picture.png" alt="Profile picture of ${comment.user.name}">
                    <div class="comment-section">
                        <p class="name">${comment.user.name} <span class="date">${new Date(comment.date).toLocaleDateString()}</span></p>
                        ${update_form}
                        ${comment_text}
                        <div class="ctas">
                            <div class="count">
                                <p class="count-btn" data-id="${comment._id}"><i class="fa-heart like ${(likes.includes(comment._id))?"fas":"far"}" data-id="${comment._id}"></i></p>
                                <p>${comment.likes.length}</p>
                            </div>
                            <div class="count">
                                <p class="count-btn" data-id="${comment._id}"><i class="fa-thumbs-down dislike ${(dislikes.includes(comment._id))?"fas":"far"}" data-id="${comment._id}"></i></p>
                                <p>${comment.dislikes.length}</p>
                            </div>
                            ${
                                (user_id && is_a_comment)?reply_button:""
                            }
                            
                            ${
                                (user_id === comment.user._id)?user_previleges:""
                            }
                        </div>
                        ${
                            (user_id && is_a_comment)?reply_form:""
                        }
                        ${
                            (is_a_comment)?`<div class="reply"></div>`:""
                        }
                    </div>
    `;
    if (is_a_comment){
        let comment_tab = document.querySelector(`.comment[data-id="${comment._id}"]`);
        comment_tab.innerHTML = html;
        comment.replies.forEach(reply => {
            renderComment(reply);
        });
    }
    else{
        let reply_area = document.querySelector(`.comment[data-id="${comment._id}"]`);
        reply_area.innerHTML = html;
    }
}