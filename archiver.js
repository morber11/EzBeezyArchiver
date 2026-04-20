const archiveUrlBase = 'https://archive.is/?run=1&url='

function buildArchiveUrl(targetUrl) {
    return `${archiveUrlBase}${encodeURIComponent(targetUrl)}`
}

function archiveUrl(targetUrl, { active = false } = {}) {
    const api = globalThis.browser || globalThis.chrome
    api.tabs.create({ url: buildArchiveUrl(targetUrl), active })
}

function archiveTab(tab, options = {}) {
    archiveUrl(tab.url, options)
}

function archiveLink(targetUrl, options = {}) {
    archiveUrl(targetUrl, options)
}

globalThis.easyArchiver = {
    buildArchiveUrl,
    archiveUrl,
    archiveTab,
    archiveLink
}
