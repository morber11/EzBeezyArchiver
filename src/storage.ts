import browser from "webextension-polyfill"

export interface ArchiveConfig {
    service: string
    queryParameters: string
}

export const DEFAULT_ARCHIVE_CONFIG: ArchiveConfig = {
    service: "https://archive.is",
    queryParameters: "/?run=1&url=",
}

const STORAGE_KEY = "ezBeezyArchiver.config"

export async function loadArchiveConfig(): Promise<ArchiveConfig> {
    const value = await browser.storage.local.get(STORAGE_KEY)
    const stored = value[STORAGE_KEY]

    if (stored) {
        return stored as ArchiveConfig
    }

    await saveArchiveConfig(DEFAULT_ARCHIVE_CONFIG)
    return DEFAULT_ARCHIVE_CONFIG
}

export function saveArchiveConfig(config: ArchiveConfig) {
    return browser.storage.local.set({ [STORAGE_KEY]: config })
}
