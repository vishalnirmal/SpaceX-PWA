document.addEventListener("DOMContentLoaded", ()=>{
    let menu = document.querySelector(".icon-menu");
    let icon = document.querySelector(".icon-menu i");
    menu.addEventListener("click", ()=>{
        if (menu.parentElement.classList.contains("show-menu")){
            menu.parentElement.classList.remove("show-menu");
            icon.classList.remove("fa-times");
            icon.classList.add("fa-bars");
        }
        else{
            menu.parentElement.classList.add("show-menu");
            icon.classList.remove("fa-bars");
            icon.classList.add("fa-times");
        }
    });
});