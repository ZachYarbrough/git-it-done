var issueContainerEl = document.querySelector("#issues-container");
var limitWarningEl = document.querySelector("#limit-warning");
var repoNameEl = document.querySelector("#repo-name");

var backBtn = document.querySelector('.btn-back');

var getRepoName = function() {
    var queryString = document.location.search;
    var repoUser = queryString.split('/')[0];
    var repoName = queryString.split("=")[1];
    if(repoName) {
        repoNameEl.textContent = repoName;
        console.log(repoUser);
        backBtn.href = './index.html' + repoUser;
        getRepoIssues(repoName);
    } else  {
        document.location.replace("./index.html");
    }
}

var getRepoIssues = function(repo) {
    var apiUrl = "https://api.github.com/repos/" + repo + "/issues?direction=asc";

    fetch(apiUrl).then(function(response) {
        if(response.ok) {
            response.json().then(function(data) {
                displayIssues(data);

                if(response.headers.get("Link")) {
                    displayWarning(repo)
                }
            })
        } else {
            document.location.replace('.index/html');
        }
    })
}

var displayIssues = function(issues) {
    if (issues.length === 0) {
        issueContainerEl.textContent = "This repo has no open issues!";
        return;
    }
    for(var i = 0; i < issues.length; i++) {
        var issueEl = document.createElement('a');
        issueEl.classList = "list-item flex-row justify-space-between align-center";
        issueEl.setAttribute('href', issues[i].html_url);
        issueEl.setAttribute("target", "_blank");

        var titleEl = document.createElement('span');
        titleEl.textContent = issues[i].title;
        issueEl.append(titleEl);

        var typeEl = document.createElement('span');
        if(issues[i].pull_request) {
            typeEl.textContent = "(Pull Request)";
        } else {
            typeEl.textContent = "(Issue)";
        }
        issueEl.append(typeEl);
        issueContainerEl.appendChild(issueEl);
    }
};

var displayWarning =  function(repo) {
    limitWarningEl.textContent = "To see more than 30 issues, visit ";
    var linkEl = document.createElement("a");
    linkEl.textContent = "See More Issues on GitHub.com";
    linkEl.setAttribute("href", "https://github.com/" + repo + "/issues");
    linkEl.setAttribute("target", "_blank");
  
    limitWarningEl.appendChild(linkEl);
};

getRepoName();