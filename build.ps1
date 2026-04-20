function Get-SourceFiles($param) {
    $param = $param.ToLower()
    if ($param -eq "f" -or $param -eq "firefox") {
        return "src\manifest.firefox.json", "src\index.js"
    }
    if ($param -eq "g" -or $param -eq "c" -or $param -eq "chrome") {
        return "src\manifest.chrome.json", "src\index.js"
    }
    Write-Host "Invalid parameter."
    exit 1
}

function Check-FileExists($file) {
    if (!(Test-Path $file)) {
        Write-Host "$file not found."
        exit 1
    }
}

function Create-OutputDirectory($path) {
    if (!(Test-Path $path)) {
        New-Item -ItemType Directory -Force -Path $path | Out-Null
    }
}

function Copy-Files($files, $param, $outputPath) {
    foreach ($file in $files) {
        if (!(Test-Path $file)) {
            Write-Host "Error: $file not found."
            exit 1
        }
        $item = Get-Item $file
        if ($item.PSIsContainer) {
            if ($file -eq "media" -and ($param -eq "f" -or $param -eq "firefox")) {
                Copy-Item -Path "$file\*" -Destination "$outputPath\" -Recurse -Force
            }
            else {
                Copy-Item -Path $file -Destination "$outputPath\" -Recurse -Force
            }
        }
        else {
            $fileName = Split-Path $file -Leaf
            Copy-Item -Path $file -Destination "$outputPath\$fileName" -Force
        }
    }
}

function Get-Version() {
    $package = Get-Content "package.json" -Raw | ConvertFrom-Json
    return $package.version
}

function Compress-Output($outputPath, $param, $version) {
    $zipName = "EzBeezyArchiver-$version-$param.zip"
    $zipPath = Join-Path $outputPath $zipName

    Remove-Item -Force $zipPath -ErrorAction SilentlyContinue
    Compress-Archive -Path "$outputPath\*" -DestinationPath $zipPath -Force
}

function Clean-OutputDirectory() {
    if (Test-Path "out") {
        Remove-Item -Recurse -Force "out"
    }
}

function Update-ManifestName($manifestPath) {
    $json = Get-Content $manifestPath -Raw
    if ($json -notmatch '"name"\s*:\s*"\[DEV\]') {
        $updated = $json -replace '("name"\s*:\s*")([^"]+)(")', '$1[DEV] $2$3'
        Set-Content -Path $manifestPath -Value $updated
    }
}

function Build-Target($param, $devEnabled) {
    Write-Host "Starting build for $param"
    $srcFile, $indexFile = Get-SourceFiles $param
    $outputPath = "out\$param"

    Check-FileExists $srcFile
    Create-OutputDirectory $outputPath

    Copy-Item -Path $srcFile -Destination "$outputPath\manifest.json" -Force

    if ($devEnabled) {
        Update-ManifestName "$outputPath\manifest.json"
    }

    $files = @("src\index.js", "src\archiver.js", "src\storage.js", "src\options.html", "src\options.css", "src\options.js", "package.json", "media")
    Copy-Files $files $param $outputPath

    $version = Get-Version
    Compress-Output $outputPath $param $version

    Write-Host "Build complete for $param"
}

$devEnabled = $false
$targetArgs = @()
foreach ($arg in $args) {
    if ($arg -eq "-d" -or $arg -eq "-dev") {
        $devEnabled = $true
    }
    else {
        $targetArgs += $arg
    }
}

$param = if ($targetArgs.Count -gt 0) { $targetArgs[0] } else { $null }

Clean-OutputDirectory

if ($param -eq $null) {
    Build-Target "firefox" $devEnabled
    Build-Target "chrome" $devEnabled
    return
}

Build-Target $param $devEnabled