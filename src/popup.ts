import browser from "webextension-polyfill"
import { loadArchiveConfig, saveArchiveConfig, DEFAULT_ARCHIVE_CONFIG, PRESETS, type ArchiveConfig } from "./storage"
import { archiveTab } from "./archiver"

const EXAMPLE_URL = "https://example.com/"

// needed because getElementById can return null
function getById(id: string): HTMLElement {
    const el = document.getElementById(id)
    if (!el) throw new Error(`element #${id} not found`)
    return el
}

function setStatus(text: string, ms = 1500) {
    const status = document.getElementById("status")
    if (!status) return

    status.textContent = text

    setTimeout(() => {
        status.textContent = ""
    }, ms)
}

function buildUrl(service: string, queryParameters: string, target: string): string {
    return `${service}${queryParameters}${encodeURIComponent(target)}`
}

async function loadOptions() {
    const preset = getById("preset") as HTMLSelectElement
    const service = getById("service") as HTMLInputElement
    const queryParameters = getById("queryParameters") as HTMLInputElement
    const sampleUrl = getById("sampleUrl") as HTMLInputElement
    const saveBtn = getById("saveBtn") as HTMLButtonElement
    const resetBtn = getById("resetBtn") as HTMLButtonElement
    const testBtn = getById("testBtn") as HTMLButtonElement
    const archiveBtn = getById("archiveBtn") as HTMLButtonElement

    const config = await loadArchiveConfig()

    service.value = config.serviceUrl
    queryParameters.value = config.queryParameters
    sampleUrl.value = EXAMPLE_URL

    preset.addEventListener("change", () => {
        if (preset.value === "custom") return

        const picked = preset.value === "archive.li" ? PRESETS.ArchiveLi
            : preset.value === "archive.ph" ? PRESETS.ArchivePh
                : DEFAULT_ARCHIVE_CONFIG
        service.value = picked.serviceUrl
        queryParameters.value = picked.queryParameters
    })

    saveBtn.addEventListener("click", () => {
        const cfg: ArchiveConfig = {
            serviceUrl: service.value.trim(),
            queryParameters: queryParameters.value.trim(),
            name: "custom",
        }

        void saveArchiveConfig(cfg).then(() => { setStatus("Saved") })
    })

    resetBtn.addEventListener("click", () => {
        const def = DEFAULT_ARCHIVE_CONFIG

        service.value = def.serviceUrl
        queryParameters.value = def.queryParameters

        void saveArchiveConfig(def).then(() => { setStatus("Reset") })
    })

    testBtn.addEventListener("click", () => {
        const target = (sampleUrl.value || "").trim() || EXAMPLE_URL
        const url = buildUrl(service.value.trim(), queryParameters.value.trim(), target)

        void browser.tabs.create({ url })
    })

    archiveBtn.addEventListener("click", () => {
        void browser.tabs.query({ active: true, currentWindow: true }).then(([tab]) => {
            if (!tab?.url) return
            void archiveTab(tab)
        })
    })
}

document.addEventListener("DOMContentLoaded", () => {
    void loadOptions()
})
