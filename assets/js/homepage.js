var userFormEl = document.querySelector('#user-form');
var nameInputEl = document.querySelector('#username');

var repoContainerEl = document.querySelector("#repos-container");
var repoSearchTerm = document.querySelector('#repo-search-term');

var repoUser = document.location.search;
var currRepo = repoUser.split('=')[1];

var languageButtonsEl = document.querySelector('#language-buttons');

var getUserRepos = function(user) {
    var apiUrl = 'https://api.github.com/users/' + user + '/repos';

    fetch(apiUrl).then(function(response) {
        if (response.ok) {
            response.json().then(function(data) {
            displayRepos(data, user);
            });
        } else {
            alert("Error: GitHub User Not Found");
        }
    }).catch(function(error) {
        alert("Unable to connect to GitHub");
      });
};

var getFeaturedRepos = function(language) {
    var apiUrl = 'https://api.github.com/search/repositories?q=' + language + '+is:featured&sort=help-wanted-issues';

    fetch(apiUrl).then(function(response) {
        if(response.ok) {
            response.json().then(function(data) {
                displayRepos(data.items, language);
            }) 
        } else {
            alert('Error: Github User Not Found');
        }
    })
}

var formSubmitHandler = function(event) {
    event.preventDefault();

    var username = nameInputEl.value.trim();

    if(username) {
        getUserRepos(username);
        nameInputEl.value = '';
    } else {
        alert('Please enter a Github username');
    }
}

userFormEl.addEventListener('submit', formSubmitHandler);

var displayRepos = function(repos, searchTerm) {
    repoContainerEl.textContent = "";
    repoSearchTerm.textContent = searchTerm;

    if (repos.length === 0) {
        repoContainerEl.textContent = "No repositories found.";
        return;
    }

    for(var i = 0; i < repos.length; i++) {
        var repoName = repos[i].owner.login + "/" + repos[i].name;
        var repoEl = document.createElement('a');
        repoEl.href = './single-repo.html?repo=' + repoName;
        repoEl.classList = "list-item flex-row justify-space-between align-center";

        var titleEl = document.createElement('span');
        titleEl.textContent = repoName;

        var statusEl = document.createElement('span');
        statusEl.classList = 'flex-row align-center';

        if(repos[i].open_issues_count > 0) {
            statusEl.innerHTML = "<i class='fas fa-times status-icon icon-danger'></i>" + repos[i].open_issues_count + " issue(s)";
        } else {
            statusEl.innerHTML = "<i class='fas fa-check-square status-icon icon-success'></i>";
          }

        repoEl.append(titleEl);
        repoEl.appendChild(statusEl);
        repoContainerEl.append(repoEl);
    }
}

var buttonClickHandler = function(event) {
    var language = event.target.getAttribute("data-language");

    if(language) {
        getFeaturedRepos(language);
    } else {
        repoContainerEl.textContent = '';
    }
}

languageButtonsEl.addEventListener('click', buttonClickHandler);
getUserRepos(currRepo);