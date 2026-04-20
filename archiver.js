function getConfig() {
    return loadArchiveConfig()
}

async function buildArchiveUrl(targetUrl) {
    const config = await getConfig()
    return `${config.service}${config.queryParameters}${encodeURIComponent(targetUrl)}`
}

async function archiveUrl(targetUrl, { active = false } = {}) {
    const api = globalThis.browser || globalThis.chrome
    const url = await buildArchiveUrl(targetUrl)

    api.tabs.create({ url, active })
}

async function archiveTab(tab, options = {}) {
    await archiveUrl(tab.url, options)
}

async function archiveLink(targetUrl, options = {}) {
    await archiveUrl(targetUrl, options)
}

globalThis.ezBeezyArchiver = {
    buildArchiveUrl,
    archiveUrl,
    archiveTab,
    archiveLink
}
