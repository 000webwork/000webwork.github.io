'use strict';
const FULLPAGE = 'js-fullpage';
const MENU = 'js-menu';
const LOADER = 'js-loader';

window.addEventListener('DOMContentLoaded', mousemove_handler);
window.addEventListener('DOMContentLoaded', hash_change);
window.addEventListener('hashchange', hash_change);
window.addEventListener('load', loader);
window.addEventListener('load', wheel_handler);
window.addEventListener('load', keydown_handler);
window.addEventListener('load', touchmove_handler);
let fullpage = document.getElementById(FULLPAGE);
let sections = document.querySelectorAll(` #${FULLPAGE} > * `);
let menu_anchors = document.querySelectorAll(` #${MENU} a `);
let hash = window.location.hash;
let current = set_current(hash);
let animation_playing = false;


function set_current(anchor) {
  let result = '';
  if (anchor == '') {
    result = fullpage.firstElementChild;
  } else {
    try {
      result = document.querySelector(`#${FULLPAGE} ${anchor}`);
    } catch {
      result = fullpage.firstElementChild;
    }
    result = result || fullpage.firstElementChild;
  }
  return result;
}

function wheel_handler() {
  window.addEventListener('wheel', event => {
    if (event.defaultPrevented) return;
    
    scroll_page(event.deltaY);
    event.preventDefault();
  }, { passive: false });
}

function keydown_handler() {
  window.addEventListener('keydown', event => {
    if (event.defaultPrevented) return;
  
    switch(event.code) {
      case 'KeyS':
      case 'ArrowDown':
        scroll_page(1);
        break;
      case 'KeyW':
      case 'ArrowUp':
        scroll_page(-1);
        break;
      case 'KeyA':
      case 'ArrowLeft':
        scroll_page(-1);
        break;
      case 'KeyD':
      case 'ArrowRight':
        scroll_page(1);
        break;
    }
    event.preventDefault();
  });
}

function touchmove_handler() {
  let startY;
  window.addEventListener('touchstart', event => {
    startY = event.touches[0].clientY;
  });
  window.addEventListener('touchmove', event => {
    let deltaY = startY - event.changedTouches[0].clientY;
    if (deltaY > 50 || deltaY < -50) {
      scroll_page(deltaY);
    }
  });
}

function mousemove_handler() {
  let blur = document.querySelector('.blur');
  document.addEventListener('mousemove', event => {
    blur.style.background = 'radial-gradient(circle 30vw at ' + event.clientX + 'px ' + event.clientY + 'px, rgba(200, 0, 200, 0.9) 0%, transparent 100%)';
  });
}

async function scroll_page(deltaY) {
  if (animation_playing == true) return;

  if (deltaY > 0) {
    let next = current.nextElementSibling;
    if (next != null) {
      current = next;
    } else return;
  } else if (deltaY < 0) {
    let previous = current.previousElementSibling;
    if (previous != null) {
      current = previous;
    } else return;
  } else return;
  animation_playing = true;
  window.location.hash = current.id; //current.scrollIntoView();

  await sleep(1000);
  animation_playing = false;
  return true;
}

function hash_change() {
  hash = window.location.hash;
  current = set_current(hash);
  for (let anchor of menu_anchors) {
    if (anchor.hash == hash) {
      anchor.classList.add('active');
    } else {
      anchor.classList.remove('active');
    }
  }
  if (hash == '') {
    menu_anchors[0].classList.add('active');
  }
  
  for (let section of sections) {
      section.classList.remove('active');
  }
  current.classList.add('active');
  footer.classList.remove('active');
}

function loader() {
  document.getElementById(LOADER).style.display = 'none';
  document.querySelector('.background').style.zIndex = '0';
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}