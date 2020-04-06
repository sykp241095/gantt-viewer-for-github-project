function sendGithubMetaToEXT () {
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
            window.location.pathname.match(/issues\/\d+$/) &&
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
}

(function() {
    sendGithubMetaToEXT()

    let url = location.href
    document.body.addEventListener('click', ()=>{
        requestAnimationFrame(()=>{
            if (url !== location.href) {
                setTimeout(sendGithubMetaToEXT, 1000)
                url = location.href
            }
        })
    }, true)

    window.onpopstate = (event) => {
        if (url !== location.href) {
            setTimeout(sendGithubMetaToEXT, 1000)
            url = location.href
        }
    }
})();
