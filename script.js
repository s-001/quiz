let btn = document.querySelector(".btn");
let lvl = document.querySelector("#lvl");

lvl.innerHTML = localStorage.getItem("lvl");

btn.addEventListener("click", function () {
    location.href = "./game/game.html"
})