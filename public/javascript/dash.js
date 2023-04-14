
// let cat=document.getElementById("invisible").textContent;
// console.log(cat);
// let dog=JSON.stringify(cat);
// console.log(dog);
// const availableKeywords=dog.split(' ');
// console.log(availableKeywords);
// const resultsBox=document.querySelector(".result-box");
// const inputBox=document.getElementById("input-box");

// inputBox.onkeyup=function(){
//     let result = [];
//     let input = inputBox.value;
//     if(input.length){
//         result = availableKeywords.filter((keyword)=>{
//            return keyword.toLowerCase().startsWith(input.toLowerCase());
//         });
//         console.log(result);
//     }
//     display(result);
// }

// function display(result){
//     const content=result.map((list)=>{
//         return "<li onclick=selectInput(this)>" + list + "</li>";
//     });

//     resultsBox.innerHTML = "<ul>" + content.join('') + "</ul>";
// }

// function selectInput(list){
//     resultsBox.innerHTML="";
//     inputBox.value=list.innerHTML;
// }



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