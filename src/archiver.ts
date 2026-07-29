import browser from "webextension-polyfill"
import { loadArchiveConfig } from "./storage"

async function buildArchiveUrl(targetUrl: string): Promise<string> {
    const config = await loadArchiveConfig()
    return `${config.service}${config.queryParameters}${encodeURIComponent(targetUrl)}`
}

async function archiveUrl(targetUrl: string, active = false) {
    const url = await buildArchiveUrl(targetUrl)

    await browser.tabs.create({ url, active })
}

async function archiveTab(tab: browser.Tabs.Tab, active = false) {
    if (!tab.url) return

    await archiveUrl(tab.url, active)
}

async function archiveLink(targetUrl: string, active = false) {
    await archiveUrl(targetUrl, active)
}

export { buildArchiveUrl, archiveUrl, archiveTab, archiveLink }
