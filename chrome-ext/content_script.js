(function() {
    var githubShortcut = document.getElementsByName('github-keyboard-shortcuts')[0]
    var repo = ''
    var GITHUB_PROJECT_REGEX = /^\/([\w|-]+\/[\w|-]+)/
    if (githubShortcut && githubShortcut.content.indexOf('repository') > -1) {
        if (window.location.hostname === 'github.com' && window.location.pathname.match(GITHUB_PROJECT_REGEX)) {
            repo = window.location.pathname.match(GITHUB_PROJECT_REGEX)[1]
        }
    }
    chrome.extension.sendMessage({
        msg: "githubProject",
        content: repo
    })
})();
