function Get-SourceFiles($param) {
    $param = $param.ToLower()
    if ($param -eq "f" -or $param -eq "firefox") {
        return "manifest.firefox.json", "index.js"
    }
    if ($param -eq "g" -or $param -eq "c" -or $param -eq "chrome") {
        return "manifest.chrome.json", "index.js"
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
        $item = Get-Item $file
        switch (Test-Path $file) {
            $true {
                if ($item.PSIsContainer) {
                    if ($file -eq "media" -and ($param -eq "f" -or $param -eq "firefox")) {
                        Copy-Item -Path "$file\*" -Destination "$outputPath\" -Recurse -Force
                    }
                    else {
                        Copy-Item -Path $file -Destination "$outputPath\" -Recurse -Force
                    }
                }
                else {
                    Copy-Item -Path $file -Destination "$outputPath\$file" -Force
                }
            }
            $false {
                Write-Host "Error: $file not found."
                exit 1
            }
        }
    }
}

function Compress-Output($outputPath) {
    Compress-Archive -Path "$outputPath\*" -DestinationPath "$outputPath\EzBeezyArchiver.zip" -Update
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

    $files = @("index.js", "archiver.js", "storage.js", "options.html", "options.css", "options.js", "package.json", "media")
    Copy-Files $files $param $outputPath
    Compress-Output $outputPath

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