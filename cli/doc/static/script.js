/* eslint-env browser */

document.querySelectorAll('.categorie h2').forEach((cate) => {
  cate.addEventListener('click', (e) => {
    e.target.parentNode
      .querySelector('.categorieContent')
      .classList.toggle('hidden');
  });
});

document.querySelectorAll('.route h3').forEach((cate) => {
  cate.addEventListener('click', (e) => {
    e.target.parentNode
      .querySelector('.routeContent')
      .classList.toggle('hidden');
  });
});

const bddTitle = document.querySelector('.bddTitle');
bddTitle.addEventListener('click', () => {
  document.querySelector('.bdd').classList.toggle('hidden');
  bddTitle.classList.toggle('opened');
});
