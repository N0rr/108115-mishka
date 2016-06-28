'use strict'; 

var openMenu = document.querySelector('#mobile-menu-toggle');
var menuList = document.querySelectorAll('.header-menu__item');

var checkMenu = function() {  
  Array.prototype.forEach.call(menuList, function(item) {
    if (openMenu.checked || window.innerWidth > 767) {    
      item.style.display = 'flex';

    } else {
      item.style.display = 'none'; 
    }
  });
}

openMenu.addEventListener('click', checkMenu);
window.addEventListener('load', checkMenu);
window.addEventListener('resize', checkMenu);