function scrolll(){
    var left=document.querySelector(".scroll-images");
    left.scrollBy(-650,0);

}
function scrollr(){
    var right=document.querySelector(".scroll-images");
    right.scrollBy(650,0);

}
const count = document.querySelector('#count');

updateVisitors();

function updateVisitors() {
    fetch('https://api.countapi.xyz/update/dbmsphase2/phase2/?amount=1')
        .then(res => res.json())
        .then(res => count.innerHTML = res.value)
}

