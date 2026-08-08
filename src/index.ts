import browser from "webextension-polyfill"
import { archiveTab, archiveLink } from "./archiver"

const enum MenuItem {
    ArchivePage = "archivePage",
    ArchiveLink = "archiveLink",
}

function createContextMenus() {
    browser.contextMenus.create({
        id: MenuItem.ArchivePage,
        title: "Archive this page",
        contexts: ["page"],
    })

    browser.contextMenus.create({
        id: MenuItem.ArchiveLink,
        title: "Archive this link",
        contexts: ["link"],
    })
}

// Firefox does not persist menus from a persistent background page
// so we need to re-register on every start
browser.contextMenus
    .removeAll()
    .then(createContextMenus)
    .catch(console.error)

browser.contextMenus.onClicked.addListener((info, tab) => {
    if (!tab) return

    if (info.menuItemId === MenuItem.ArchivePage) {
        void archiveTab(tab)
        return
    }

    if (info.menuItemId === MenuItem.ArchiveLink) {
        if (!info.linkUrl) return
        void archiveLink(info.linkUrl)
    }
})
