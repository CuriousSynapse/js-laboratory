const string = "0123456789ABCDEF";
const btn = document.getElementById("btn");
const id = document.getElementById("color-value")


btn.addEventListener("click", function(){
    let hex = "#";
    for (let i = 1; i <= 6; i++){
        const randomIndex = Math.floor(Math.random() * 16);
        hex += string[randomIndex];
    }
    document.body.style.backgroundColor = hex;
    id.textContent = hex;
})



