/*
for side navigation on profile window
*/

const container = document.querySelector('#exit');
const options = document.querySelector('#options img');

let sideNavStyle = sideNav.style.display;
if (sideNavStyle !== 'block' || sideNavStyle !== 'block') {
  sideNav.style.display = 'none';
}


options.addEventListener('click', () => {
  if (window.innerWidth < 650) {
    let sideNav = document.querySelector('#sideNav');
    let sideNavStyle = sideNav.style.display;
    if (sideNavStyle === 'flex')
      sideNav.style.display = 'none';
    else {
      sideNav.style.display = 'flex';
      sideNav.style.animation = "sidebar 0.2s linear 0s 1";
    }
  }
})

container.addEventListener('click', () => {
  if (window.innerWidth < 650) {
    let sideNav = document.querySelector('#sideNav');
    let sideNavStyle = sideNav.style.display;
    if (sideNavStyle == 'flex') {
      sideNav.style.animation = "sidebar_rev 0.5s linear 0s 1";
      setTimeout(() => {
        sideNav.style.display = 'none';
      }, 450)
    }
  }
})

if (window.innerWidth > 650) {
  let sideNav = document.querySelector('#sideNav');
  sideNav.style.display = 'flex';
}

let follow = document.querySelector("#newButtons1");

follow.addEventListener('click', () => {
  let number = document.querySelector('#followers span');
  let count = parseInt(number.innerHTML);

  if (follow.innerHTML.toLowerCase() == "follow") {
    follow.innerHTML = "FOLLOWING";
    number.innerHTML = ++count;
  }
  else {
    follow.innerHTML = "FOLLOW";
    number.innerHTML = --count;
  }
})