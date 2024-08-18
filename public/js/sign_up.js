let show = document.querySelector('#showPassword');

show.addEventListener('click',()=>{
  let password = document.querySelector('#password');
  if(password.type === 'password'){
    password.type = 'text';
  }
  else{
    password.type = 'password';
  }
})

let up = (i)=>{
  let place = document.querySelectorAll('.placeholder');
  if(!input[i].value || input[i].value) {
    place[i].style.bottom = '18px'

  }
}

let input = document.querySelectorAll('input');

input[0].addEventListener('click',()=>{
  up(0);
})

input[1].addEventListener('click',()=>{
  up(1);
})

input[2].addEventListener('click',()=>{
  up(2);
})