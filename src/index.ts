import browser from "webextension-polyfill"
import { archiveTab, archiveLink } from "./archiver"

const enum MenuItem {
    ArchivePage = "archivePage",
    ArchiveLink = "archiveLink",
}

browser.action.onClicked.addListener((tab) => {
    void archiveTab(tab)
})

browser.runtime.onInstalled.addListener(() => {
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
})

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
