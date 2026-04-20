const DEFAULT_ARCHIVE_CONFIG = {
    service: 'https://archive.is',
    queryParameters: '/?run=1&url='
}

function getStorageLocal() {
    const api = globalThis.browser || globalThis.chrome
    return api.storage.local
}

function storageGet(key) {
    const storage = getStorageLocal()

    return new Promise((resolve) => {
        storage.get(key, resolve)
    })
}

function storageSet(payload) {
    const storage = getStorageLocal()

    return new Promise((resolve) => {
        storage.set(payload, resolve)
    })
}

async function loadArchiveConfig() {
    const defaultConfig = { ...DEFAULT_ARCHIVE_CONFIG }
    const value = await storageGet('ezBeezyArchiver.config')
    const config = value?.['ezBeezyArchiver.config'] || defaultConfig

    if (!value?.['ezBeezyArchiver.config']) {
        await saveArchiveConfig(defaultConfig)
    }
    
    return config
}

function saveArchiveConfig(config) {
    return storageSet({ 'ezBeezyArchiver.config': config })
}