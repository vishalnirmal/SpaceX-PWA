if (localStorage.getItem('user')){
    history.back();
}

document.addEventListener('DOMContentLoaded', ()=>{
    let form = document.querySelector("form");
    let error = document.querySelector("p.error");
    form.addEventListener("submit", async (e)=>{
        e.preventDefault();
        let details = {};
        if (e.target.name)
            details["name"] = e.target.name.value;
        details["username"] = e.target.username.value;
        details["password"] = e.target.password.value;
        let useFunction = (form.id === "login")? login: register;
        let response = await useFunction(details);
        if (response.code === 200){
            error.classList.remove("show-error");
            localStorage.setItem("user", JSON.stringify(response.data));
            history.back();
        }
        else{
            error.classList.add("show-error");
            error.textContent = response.message;
        }
        form.reset();
    });

});

async function login(details){
    let response = await fetch("/user/login", {
        method: "POST",
        headers: {
            'Content-type': 'application/json'
        },
        body: JSON.stringify(details)
    });
    return response.json();
}

async function register(details){
    let response = await fetch("/user/register", {
        method: "POST",
        headers: {
            'Content-type': 'application/json'
        },
        body: JSON.stringify(details)
    });
    return response.json();
}