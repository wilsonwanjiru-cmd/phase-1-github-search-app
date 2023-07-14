const form = document.querySelector('#github-form');
const searchInput = document.querySelector('#search');
const userList = document.querySelector('#user-list');
const reposList = document.querySelector('#repos-list');
const toggleSearchTypeButton = document.querySelector('#toggle-search-type');

let currentSearchType = 'users'; // Default search type

form.addEventListener('submit', (e) => {
  e.preventDefault();
  const searchTerm = searchInput.value.trim();

  if (searchTerm === '') {
    alert('Please enter a GitHub username.');
    return;
  }

  if (currentSearchType === 'users') {
    searchUsers(searchTerm);
  } else {
    searchRepos(searchTerm);
  }
});

toggleSearchTypeButton.addEventListener('click', () => {
  if (currentSearchType === 'users') {
    currentSearchType = 'repos';
    searchInput.placeholder = 'Enter a keyword to search repositories';
    toggleSearchTypeButton.textContent = 'Toggle to User Search';
  } else {
    currentSearchType = 'users';
    searchInput.placeholder = 'Enter a GitHub username';
    toggleSearchTypeButton.textContent = 'Toggle to Repo Search';
  }
});

function searchUsers(username) {
  const searchUrl = `https://api.github.com/search/users?q=${username}`;
  fetch(searchUrl)
    .then((response) => response.json())
    .then((data) => {
      displayUsers(data.items);
    })
    .catch((error) => {
      console.log('Error:', error);
    });
}

function displayUsers(users) {
  userList.innerHTML = '';

  users.forEach((user) => {
    const { login, avatar_url, html_url } = user;

    const li = document.createElement('li');
    li.innerHTML = `
      <img src="${avatar_url}" alt="${login}" />
      <div>
        <h3>${login}</h3>
        <a href="${html_url}" target="_blank">View Profile</a>
      </div>
    `;

    li.addEventListener('click', () => {
      getRepos(login);
    });

    userList.appendChild(li);
  });
}

function getRepos(username) {
  const reposUrl = `https://api.github.com/users/${username}/repos`;
  fetch(reposUrl)
    .then((response) => response.json())
    .then((data) => {
      displayRepos(data);
    })
    .catch((error) => {
      console.log('Error:', error);
    });
}

function displayRepos(repos) {
  reposList.innerHTML = '';

  repos.forEach((repo) => {
    const { name, html_url } = repo;

    const li = document.createElement('li');
    li.innerHTML = `
      <a href="${html_url}" target="_blank">${name}</a>
    `;

    reposList.appendChild(li);
  });
}
