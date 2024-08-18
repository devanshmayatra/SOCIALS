let input = document.querySelector('#search_input');
let search = document.querySelector('#search_box');
let feed = document.querySelector('#feed');
let nope = document.querySelector('#nope');


input.addEventListener('click',()=>{
  search.style.display = "flex"
  feed.style.display = "none"
})

nope.addEventListener('click',()=>{
  search.style.display = "none"
  feed.style.display = "flex"
})

