let container = document.querySelector(".container");
let comment = document.querySelector(".comments .add-comment");
let user_id = document.body.getAttribute("user-id");
let mainComment = document.querySelector("form#demo-form");
mainComment.addEventListener("submit", (e) => {
    e.preventDefault();
    sendComment({
        text: mainComment.comment.value,
        username: JSON.parse(localStorage.getItem('user')).name
    });
    e.target.reset();
});
if (user_id) {
    comment.classList.remove("hidden");
} else {
    comment.classList.add("hidden");
}
container.addEventListener("click", (e) => {
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
        } else if (e.target.tagName === "I") {
            let comment = {
                comment_id
            };
            if (e.target.classList.contains("like")) {
                if (e.target.classList.contains("fas"))
                    comment.operation = "remove";
                else if (e.target.classList.contains("far")) {
                    comment.operation = "add";
                }
                updateComment(comment, "like");
            } else if (e.target.classList.contains("dislike")) {
                if (e.target.classList.contains("fas"))
                    comment.operation = "remove";
                else if (e.target.classList.contains("far")) {
                    comment.operation = "add";
                }
                updateComment(comment, "dislike");
            } else if (e.target.classList.contains("delete")) {
                deleteCommentFromDb(comment);
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
                    replied_to: e.target.getAttribute("data-id"),
                    username: JSON.parse(localStorage.getItem('user')).name
                };
                sendComment(comment);
                comment_element.classList.remove("show-reply-form");
                form.comment.value = "";
            } else if (form.classList.contains("update-comment")) {
                let previous_text = comment_element.querySelector('p.comment-text').textContent;
                let comment = {
                    text: comment_field,
                    comment_id: e.target.getAttribute("data-id")
                }
                if (previous_text !== comment_field) {
                    updateComment(comment, "updateText");
                    form.comment.value = "";
                }
                comment_element.classList.remove("edit");
            }

        }
    }
});

const deleteComment = (comment_id) => {
    let repeat = setInterval(() => {
        let comment = document.querySelector(`.comment[data-id="${comment_id}"]`);
        if (comment) {
            comment.remove();
            clearInterval(repeat);
        }
    }, 100);
}

const renderComment = (comment) => {
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
                                <button class="cta cta-comment" type="button" data-id="${comment._id}">Reply</button>
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
                    <img src="images/comments/profile-picture.png" alt="Profile picture of ${comment.username}">
                    <div class="comment-section">
                        <div class="details">
                            <p class="name">${comment.username} <span class="date">${new Date(comment.date).toLocaleDateString()}</span></p>
                            ${update_form}
                            ${comment_text}
                            <div class="ctas">
                                <div class="count">
                                    <p class="count-btn" data-id="${comment._id}"><i class="fa-heart like ${(comment.likes.includes(user_id))?"fas":"far"}" data-id="${comment._id}"></i></p>
                                    <p>${comment.likes.length}</p>
                                </div>
                                <div class="count">
                                    <p class="count-btn" data-id="${comment._id}"><i class="fa-thumbs-down dislike ${(comment.dislikes.includes(user_id))?"fas":"far"}" data-id="${comment._id}"></i></p>
                                    <p>${comment.dislikes.length}</p>
                                </div>
                                ${
                                    (user_id && is_a_comment)?reply_button:""
                                }
                                
                                ${
                                    (user_id === comment.user)?user_previleges:""
                                }
                            </div>
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
    let repeat = setInterval(() => {
        if (is_a_comment) {
            let comment_tab = document.querySelector(".comments .container");
            if (comment_tab) {
                comment_tab.innerHTML += html;
                clearInterval(repeat);
            }
        } else {
            let reply = document.querySelector(`.comment[data-id="${comment.replied_to}"] .reply`);
            if (reply) {
                reply.innerHTML += html;
                clearInterval(repeat);
            }
        }
    }, 100);
}

const changeComment = (comment) => {
    let is_a_comment = !(comment.replied_to);
    let reply_button = `<p class="cta cta-comment reply-btn" data-id="${comment._id}">Relpy</p>`;
    let user_previleges = `<div class="count">
                            <p class="count-btn" data-id="${comment._id}"><i class="far fa-trash-alt delete" data-id="${comment._id}"></i></p>
                        </div>
                        <div class="count">
                            <p class="count-btn" data-id="${comment._id}"><i class="far fa-edit edit" data-id="${comment._id}"></i></p>
                        </div>`;
    let update_form = `<form class="add-comment update-comment" onsubmit="return false">
                            <input type="text" name="comment" id="comment" value="${comment.text}" autocomplete="off" required>
                            <div class="comment-btn">
                                <button class="cta cta-comment" type="button" data-id="${comment._id}">Update</button>
                                <p class="cta cta-comment cancel-update-btn" data-id="${comment._id}">Cancel</p>
                            </div>
                        </form>`;
    let comment_text = `<p class="comment-text">${comment.text}</p>`;
    let html = `
                        <p class="name">${comment.username} <span class="date">${new Date(comment.date).toLocaleDateString()}</span></p>
                        ${update_form}
                        ${comment_text}
                        <div class="ctas">
                            <div class="count">
                                <p class="count-btn" data-id="${comment._id}"><i class="fa-heart like ${(comment.likes.includes(user_id))?"fas":"far"}" data-id="${comment._id}"></i></p>
                                <p>${comment.likes.length}</p>
                            </div>
                            <div class="count">
                                <p class="count-btn" data-id="${comment._id}"><i class="fa-thumbs-down dislike ${(comment.dislikes.includes(user_id))?"fas":"far"}" data-id="${comment._id}"></i></p>
                                <p>${comment.dislikes.length}</p>
                            </div>
                            ${
                                (user_id && is_a_comment)?reply_button:""
                            }
                            
                            ${
                                (user_id === comment.user)?user_previleges:""
                            }
                        </div>
    `;
    let repeat = setInterval(() => {
        let comment_tab = document.querySelector(`.comment[data-id="${comment._id}"] .details`);
        if (comment_tab) {
            comment_tab.innerHTML = html;
            clearInterval(repeat);
        }
    }, 100);
}