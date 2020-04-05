(function() {
    var githubShortcut = document.getElementsByName('github-keyboard-shortcuts')[0],
        githuRepoMeta = document.getElementsByName('octolytics-dimension-repository_nwo')[0],
        githubAnalytic = document.getElementsByName('analytics-location')[0],
        issueBodyHtml = document.getElementsByName('issue[body]')
    var repoFullName, repoOwner, repoName, issueNumber, issueBody

    if (window.location.hostname === 'github.com' && githubShortcut && githuRepoMeta) {
        if (githubShortcut.content.indexOf('repository') > -1) {
            repoFullName = githuRepoMeta.content
            repoOwner = repoFullName.split('/')[0]
            repoName = repoFullName.split('/')[1]
        }
        if (githubShortcut.content.indexOf('issues') > -1 &&
            githubAnalytic.content.indexOf('issues/show') > -1 &&
            issueBodyHtml.length > 0) {
            issueNumber = window.location.pathname.split('/').slice(-1)[0]
        }
    }
    chrome.extension.sendMessage({
        msg: "githubProject",
        content: {
            repoFullName,
            repoName,
            repoOwner,
            issueNumber
        }
    })
})();
