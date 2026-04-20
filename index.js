const api = globalThis.browser || globalThis.chrome
const action = api.action || api.browserAction

if (!globalThis.ezBeezyArchiver && typeof importScripts === 'function') {
    importScripts('storage.js', 'archiver.js')
}

action.onClicked.addListener(async (tab) => {
    await ezBeezyArchiver.archiveTab(tab)
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

api.contextMenus.onClicked.addListener(async (info, tab) => {
    if (info.menuItemId === 'archivePage') {
        await ezBeezyArchiver.archiveTab(tab, { active: false })
    } else if (info.menuItemId === 'archiveLink') {
        await ezBeezyArchiver.archiveLink(info.linkUrl, { active: false })
    }
})
