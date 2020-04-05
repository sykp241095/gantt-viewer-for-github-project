var tabInfo = {}

chrome.runtime.onInstalled.addListener(function() {
  window.localStorage.setItem('vuex', '{"localPanel":{"panels":{"e01b0220-0111-4541-9c70-0b647c08a50d":{"id":"e01b0220-0111-4541-9c70-0b647c08a50d","name":"breeswish/my-gantt-viewer","timestamp":1583775552731,"projects":{"MDc6UHJvamVjdDM5ODA1MTc=":{"id":"MDc6UHJvamVjdDM5ODA1MTc=","url":"https://github.com/breeswish/my-gantt-viewer/projects/1","name":"0.1"}}},"fd44c9b9-f05b-4430-81ed-1fe1ffd8a6c3":{"id":"fd44c9b9-f05b-4430-81ed-1fe1ffd8a6c3","name":"pingcap-incubator/tidb-dashboard","timestamp":1583805248560,"projects":{"MDc6UHJvamVjdDM5ODEyMjE=":{"id":"MDc6UHJvamVjdDM5ODEyMjE=","url":"https://github.com/pingcap-incubator/tidb-dashboard/projects/5","name":"User Experience"},"MDc6UHJvamVjdDM5ODEyMjM=":{"id":"MDc6UHJvamVjdDM5ODEyMjM=","url":"https://github.com/pingcap-incubator/tidb-dashboard/projects/6","name":"Security"},"MDc6UHJvamVjdDM5ODEyMzY=":{"id":"MDc6UHJvamVjdDM5ODEyMzY=","url":"https://github.com/pingcap-incubator/tidb-dashboard/projects/7","name":"Better PD Integration"},"MDc6UHJvamVjdDM5ODEyNDk=":{"id":"MDc6UHJvamVjdDM5ODEyNDk=","url":"https://github.com/pingcap-incubator/tidb-dashboard/projects/8","name":"I18N"},"MDc6UHJvamVjdDM5ODE0NTM=":{"id":"MDc6UHJvamVjdDM5ODE0NTM=","url":"https://github.com/pingcap-incubator/tidb-dashboard/projects/9","name":"DBaas Integration"},"MDc6UHJvamVjdDM5ODE1NDU=":{"id":"MDc6UHJvamVjdDM5ODE1NDU=","url":"https://github.com/pingcap-incubator/tidb-dashboard/projects/10","name":"Key Visualizer"},"MDc6UHJvamVjdDM5ODE2NjI=":{"id":"MDc6UHJvamVjdDM5ODE2NjI=","url":"https://github.com/pingcap-incubator/tidb-dashboard/projects/11","name":"Statements"},"MDc6UHJvamVjdDM5ODE2NzI=":{"id":"MDc6UHJvamVjdDM5ODE2NzI=","url":"https://github.com/pingcap-incubator/tidb-dashboard/projects/12","name":"Cluster Info"},"MDc6UHJvamVjdDM5ODg2ODg=":{"id":"MDc6UHJvamVjdDM5ODg2ODg=","url":"https://github.com/pingcap-incubator/tidb-dashboard/projects/14","name":"FlameGraph"},"MDc6UHJvamVjdDM5ODg3MDM=":{"id":"MDc6UHJvamVjdDM5ODg3MDM=","url":"https://github.com/pingcap-incubator/tidb-dashboard/projects/15","name":"Log Exporting"},"MDc6UHJvamVjdDM5ODg3NTI=":{"id":"MDc6UHJvamVjdDM5ODg3NTI=","url":"https://github.com/pingcap-incubator/tidb-dashboard/projects/16","name":"Cluster Report"},"MDc6UHJvamVjdDQwMjk2MjU=":{"id":"MDc6UHJvamVjdDQwMjk2MjU=","url":"https://github.com/pingcap-incubator/tidb-dashboard/projects/17","name":"Challenge Program"}}},"4fca7dd4-53d8-4ffb-90f9-634b32fff538":{"id":"4fca7dd4-53d8-4ffb-90f9-634b32fff538","name":"pingcap/tidb","timestamp":1583805456011,"projects":{}}}}}')
});

chrome.extension.onMessage.addListener(function(request, sender, sendResponse) {
    if (request.msg === 'githubProject') {
        tabInfo[sender.tab.id] = request.content
        return sendResponse({})
    } else if (request.msg === 'getProject') {
        return sendResponse({
            ...tabInfo[request.tab]
        })
    }
})

chrome.tabs.onRemoved.addListener(function(tabId) {
    delete tabInfo[tabId];
})

chrome.runtime.onInstalled.addListener(function (){
    chrome.tabs.create({url:chrome.extension.getURL("dist/index.html")},function(){})
})
