const input = document.querySelector('.search__input');
const autocomplete = document.querySelector('.autocomplete');
const selectedRepositories = document.querySelector('.repositories');

const debounce = (fn, debounceTime) => {
  let timeout;
  return function() {
    clearTimeout(timeout);
    timeout = setTimeout(() => fn.apply(this, arguments), debounceTime)
  }
};

async function onChange(e) {
  const inputsValue = e.target.value;
  const response = await fetch(`https://api.github.com/search/repositories?q=${inputsValue}`);
  const arrayOfRepositories = await response.json();
  createAutocompleteList(arrayOfRepositories.items);
  autocomplete.classList.add('visible');
}

function createAutocompleteList(data) {
  autocomplete.innerHTML = '';

  data.forEach((elem, index) => {
    if(index < 5) {
      const item = document.createElement('li');
      item.classList.add('autocomplete__item');
      item.innerText = `${elem.name}`;
      autocomplete.append(item);
    }
  })

  let autocompleteItems = autocomplete.querySelectorAll('.autocomplete__item');
  autocompleteItems.forEach((item, index) => {
    item.addEventListener('click',  addRepositoryInList.bind(this, data, index));
  })
}

function addRepositoryInList(data, index) {
  autocomplete.classList.remove('visible');
  const wrapper = document.createElement('div');
  wrapper.classList.add('repositories__item');
  wrapper.innerHTML = `
    <div class="container-for-text">
      <p><span>Name: </span>${data[index].name}</p>
      <p><span>Owner: </span>${data[index].owner.login}</p>
      <p><span>Stars: </span>${data[index].stargazers_count}</p>
    </div>
  `;
  wrapper.append(createDeleteButton.call(this, wrapper));
  selectedRepositories.append(wrapper);
  input.value = '';
  autocomplete.innerHTML = '';
  return wrapper;
}

function createDeleteButton(element) {
  const button = document.createElement('button');
  button.classList.add('delete-button');
  button.addEventListener('click', () => {
    element.innerHTML = '';
    element.classList.add('hidden');
  })
  return button;
}

onChange = debounce(onChange, 180);

input.addEventListener('keydown', onChange);


