const SEARCH = document.querySelector('.search');
const MAINSEARCH = document.querySelector('#mainSearch');
const SEARCHBUTTON = document.querySelector('#searchButton');
const CLOSEBUTTON = document.querySelector('#closeButton');
const SEARCHFORM = document.querySelector('#searchform');

SEARCHFORM.addEventListener('submit', $event => {
  $event.preventDefault();
  var data = new FormData(SEARCHFORM);
  for (const [name, value] of data) {
    search(value);
  }
});

SEARCHBUTTON.addEventListener('click', $event => {
  if (!searchIsOpen()) {
    $event.preventDefault();
    openSearchbar();
  }
});

CLOSEBUTTON.addEventListener('click', () => {
  closeSearchbar();
});

MAINSEARCH.addEventListener('keyup', () => {
  search(MAINSEARCH.value);
});

window.onkeyup = $keyboardEvent => {
  if (searchShortcut($keyboardEvent)) {
    openSearchbar();
  }
  if (isleavingSearchbar($keyboardEvent)) {
    closeSearchbar();
  }
};

const searchIsOpen = () => {
  return SEARCH.classList.contains('open');
};

const search = searchString => {
  console.log(`Searchstring: ${searchString}`);
};

const searchShortcut = keyboardEvent => {
  return keyboardEvent.code === 'KeyS' && keyboardEvent.target === document.body;
};

const isleavingSearchbar = keyboardEvent => {
  return keyboardEvent.code === 'Escape';
};

const openSearchbar = () => {
  SEARCH.classList.add('open');
  MAINSEARCH.focus();
};

const closeSearchbar = () => {
  SEARCH.classList.remove('open');
  MAINSEARCH.value = '';
  document.activeElement.blur();
};
