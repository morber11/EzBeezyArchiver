const api = globalThis.browser || globalThis.chrome

function presetsFor(value) {
    if (value === 'archive.li') return { service: 'https://archive.li', queryParameters: '/?run=1&url=' }
    if (value === 'archive.ph') return { service: 'https://archive.ph', queryParameters: '/?run=1&url=' }

    return DEFAULT_ARCHIVE_CONFIG
}

function setStatus(text, ms = 1500) {
    const status = document.getElementById('status')
    status.textContent = text

    setTimeout(() => { status.textContent = '' }, ms)
}

function buildUrl(service, queryParameters, target) {
    return `${service}${queryParameters}${encodeURIComponent(target)}`
}

document.addEventListener('DOMContentLoaded', async () => {
    const preset = document.getElementById('preset')
    const service = document.getElementById('service')
    const queryParameters = document.getElementById('queryParameters')
    const sampleUrl = document.getElementById('sampleUrl')
    const saveBtn = document.getElementById('saveBtn')
    const resetBtn = document.getElementById('resetBtn')
    const testBtn = document.getElementById('testBtn')

    const config = await loadArchiveConfig()
    const current = config || presetsFor('archive.is')
    service.value = current.service
    queryParameters.value = current.queryParameters
    sampleUrl.value = 'https://example.com/'

    preset.addEventListener('change', () => {
        if (preset.value === 'custom') return

        const picked = presetsFor(preset.value)
        service.value = picked.service
        queryParameters.value = picked.queryParameters
    })

    saveBtn.addEventListener('click', async () => {
        const cfg = { service: service.value.trim(), queryParameters: queryParameters.value.trim() }

        await saveArchiveConfig(cfg)
        setStatus('Saved')
    })

    resetBtn.addEventListener('click', async () => {
        const def = presetsFor('archive.is')

        service.value = def.service
        queryParameters.value = def.queryParameters

        await saveArchiveConfig(def)
        setStatus('Reset')
    })

    testBtn.addEventListener('click', () => {
        const target = (sampleUrl.value || '').trim() || 'https://example.com/'
        const url = buildUrl(service.value.trim(), queryParameters.value.trim(), target)

        api.tabs.create({ url })
    })
})
