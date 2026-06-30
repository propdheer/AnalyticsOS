Set-Location $PSScriptRoot\..

$apiPath = ".\frontend\lib\api.ts"

if (!(Test-Path $apiPath)) {
    Write-Host "Could not find frontend/lib/api.ts" -ForegroundColor Red
    exit 1
}

$content = Get-Content $apiPath -Raw

if ($content -notmatch "export type RuntimeStatus") {
$runtimeTypes = @'

export type RuntimeCheck = {
  name: string;
  ok: boolean;
  details: string;
};

export type RuntimeStatus = {
  version: string;
  project_root: string;
  data_dir: string;
  knowledge_dir: string;
  venv: string;
  checks: RuntimeCheck[];
};
'@
    $content = $content -replace "export type BackupPayload = \{", "$runtimeTypes`nexport type BackupPayload = {"
}

if ($content -notmatch "getRuntimeStatus") {
$runtimeFn = @'

export async function getRuntimeStatus(): Promise<RuntimeStatus> {
  return fetchJson<RuntimeStatus>("/api/v1/runtime/status");
}
'@
    $content = $content + $runtimeFn
}

[System.IO.File]::WriteAllText((Resolve-Path $apiPath), $content, [System.Text.UTF8Encoding]::new($false))
Write-Host "frontend/lib/api.ts patched for runtime status." -ForegroundColor Green
