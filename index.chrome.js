importScripts("archiver.js")

chrome.action.onClicked.addListener((tab) => {
    easyArchiver.archiveTab(tab)
})

chrome.contextMenus.create({
    id: "archivePage",
    title: "Archive this page",
    contexts: ["page"]
})

chrome.contextMenus.create({
    id: "archiveLink",
    title: "Archive this link",
    contexts: ["link"]
})

chrome.contextMenus.onClicked.addListener((info, tab) => {
    if (info.menuItemId === "archivePage") {
        easyArchiver.archiveTab(tab, { active: false })
    } else if (info.menuItemId === "archiveLink") {
        easyArchiver.archiveLink(info.linkUrl, { active: false })
    }
})
