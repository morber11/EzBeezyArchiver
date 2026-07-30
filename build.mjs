import { execSync } from "child_process"
import { copyFileSync, existsSync, mkdirSync, readdirSync, readFileSync, rmSync, writeFileSync } from "fs"
import { dirname, join } from "path"

const Target = {
    Firefox: "firefox",
    Chrome: "chrome",
}

const GECKO_ID = "{02497381-8eaf-45e3-a8b8-1157b8fe6f1d}"
const DEV_GECKO_ID = "{02497381-8eaf-45e3-a8b8-1157b8fe6f1e}"

const args = process.argv.slice(2)
const isProd = args.includes("prod")
const cliTarget = args.find(a => a === Target.Firefox || a === Target.Chrome)
const buildTargets = cliTarget ? [cliTarget] : [Target.Firefox, Target.Chrome]

function copy(src, dest) {
    if (!existsSync(dirname(dest))) {
        mkdirSync(dirname(dest), { recursive: true })
    }

    copyFileSync(src, dest)
}

function createZip(dir, outPath) {
    execSync(
        `powershell -NoProfile -Command "Compress-Archive -Path '${dir}\\*' -DestinationPath '${outPath}' -Force"`,
        { stdio: "inherit" },
    )
}

if (existsSync("out")) {
    rmSync("out", { recursive: true })
}

if (isProd) {
    try {
        execSync("npm run lint", { stdio: "inherit" })
    } catch {
        console.log("\x1b[31mlint failed — aborting build\x1b[0m")
        process.exit(1)
    }
}

execSync("npm run build:ts", { stdio: "inherit" })

for (const targetName of buildTargets) {
    console.log(`Starting build for ${targetName}`)
    
    const outDir = `out/${targetName}`
    const manifestSrc = `src/manifest.${targetName}.json`
    const version = JSON.parse(readFileSync("package.json", "utf-8")).version

    if (existsSync(outDir)) {
        rmSync(outDir, { recursive: true })
    }

    mkdirSync(outDir, { recursive: true })

    let manifest = readFileSync(manifestSrc, "utf-8")

    if (!isProd) {
        manifest = manifest.replace(/"name"\s*:\s*"([^"]+)"/, `"name": "[DEV] $1"`)

        if (targetName === Target.Firefox) {
            manifest = manifest.replace(GECKO_ID, DEV_GECKO_ID)
        }
    }

    writeFileSync(join(outDir, "manifest.json"), manifest, "utf-8")

    copy("out/index.js", join(outDir, "index.js"))
    copy("out/popup.js", join(outDir, "popup.js"))
    copy("src/popup.html", join(outDir, "popup.html"))
    copy("src/popup.css", join(outDir, "popup.css"))
    copy("package.json", join(outDir, "package.json"))

    if (existsSync("media")) {
        for (const f of readdirSync("media")) {
            copy(join("media", f), join(outDir, "media", f))
        }
    }

    const suffix = isProd ? "" : "-dev"
    const zipName = `EzBeezyArchiver-${version}-${targetName}${suffix}.zip`

    createZip(outDir, join(outDir, zipName))

    console.log(`\x1b[32mbuild complete for ${targetName}\x1b[0m`)
}
