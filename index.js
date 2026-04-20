const api = globalThis.browser || globalThis.chrome
const action = api.action || api.browserAction

if (!globalThis.easyArchiver && typeof importScripts === 'function') {
    importScripts('archiver.js')
}

action.onClicked.addListener((tab) => {
    easyArchiver.archiveTab(tab)
})

api.contextMenus.create({
    id: 'archivePage',
    title: 'Archive this page',
    contexts: ['page']
})

api.contextMenus.create({
    id: 'archiveLink',
    title: 'Archive this link',
    contexts: ['link']
})

api.contextMenus.onClicked.addListener((info, tab) => {
    if (info.menuItemId === 'archivePage') {
        easyArchiver.archiveTab(tab, { active: false })
    } else if (info.menuItemId === 'archiveLink') {
        easyArchiver.archiveLink(info.linkUrl, { active: false })
    }
})
