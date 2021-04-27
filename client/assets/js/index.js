let user = JSON.parse(localStorage.getItem("user"));
if (user)
    document.body.setAttribute("user-id", user.id);
document.addEventListener("DOMContentLoaded", () => {
    let menu = document.querySelector(".icon-menu");
    let logout = document.querySelector(".logout");
    let icon = document.querySelector(".icon-menu i");
    let header = document.querySelector("header");
    menu.addEventListener("click", () => {
        if (header.classList.contains("show-menu")) {
            header.classList.remove("show-menu");
            icon.classList.remove("fa-times");
            icon.classList.add("fa-bars");
        } else {
            header.classList.add("show-menu");
            icon.classList.remove("fa-bars");
            icon.classList.add("fa-times");
        }
    });
    logout.addEventListener("click", ()=>{
        localStorage.removeItem("user");
        location.reload();
    });
});

