import browser from "webextension-polyfill"

export interface ArchiveConfig {
    name: string
    serviceUrl: string
    queryParameters: string
}

export const PRESETS = {
    ArchiveIs: {
        name: "archive.is",
        serviceUrl: "https://archive.is",
        queryParameters: "/?run=1&url=",
    },
    ArchiveLi: {
        name: "archive.li",
        serviceUrl: "https://archive.li",
        queryParameters: "/?run=1&url=",
    },
    ArchivePh: {
        name: "archive.ph",
        serviceUrl: "https://archive.ph",
        queryParameters: "/?run=1&url=",
    },
} satisfies Record<string, ArchiveConfig>

export const DEFAULT_ARCHIVE_CONFIG = PRESETS.ArchiveIs

const STORAGE_KEY = "ezBeezyArchiver.config"

export async function loadArchiveConfig() {
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
