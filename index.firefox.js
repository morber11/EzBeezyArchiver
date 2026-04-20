browser.browserAction.onClicked.addListener((tab) => {
    easyArchiver.archiveTab(tab)
})

browser.contextMenus.create({
    id: "archivePage",
    title: "Archive this page",
    contexts: ["page"]
})

browser.contextMenus.create({
    id: "archiveLink",
    title: "Archive this link",
    contexts: ["link"]
})

browser.contextMenus.onClicked.addListener((info, tab) => {
    if (info.menuItemId === "archivePage") {
        easyArchiver.archiveTab(tab, { active: false })
    } else if (info.menuItemId === "archiveLink") {
        easyArchiver.archiveLink(info.linkUrl, { active: false })
    }
})
