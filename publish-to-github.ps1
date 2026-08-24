param(
  [Parameter(Mandatory = $true)]
  [string]$GitHubUser,

  [Parameter(Mandatory = $false)]
  [string]$Repository = "dp700-interactive-prep"
)

$ErrorActionPreference = "Stop"

if (-not (Get-Command git -ErrorAction SilentlyContinue)) {
  throw "Git is not installed or is not available in PATH. Install Git for Windows first."
}

$remoteUrl = "https://github.com/$GitHubUser/$Repository.git"
$pagesUrl = "https://$GitHubUser.github.io/$Repository/"

if (-not (Test-Path ".git")) {
  git init
}

git branch -M main
git add .

$commitCount = [int](git rev-list --count --all)
if ($commitCount -eq 0) {
  git commit -m "Launch DP-700 interactive study simulator"
} else {
  $changes = git status --porcelain
  if ($changes) {
    git commit -m "Update DP-700 interactive study simulator"
  }
}

$remotes = @(git remote)
if ($remotes -notcontains "origin") {
  git remote add origin $remoteUrl
} else {
  $origin = git remote get-url origin
  if ($origin -ne $remoteUrl) {
    git remote set-url origin $remoteUrl
  }
}

git push -u origin main

Write-Host ""
Write-Host "Push complete." -ForegroundColor Green
Write-Host "Enable GitHub Pages: Repository Settings > Pages > Deploy from a branch > main > /(root)."
Write-Host "Your site will be: $pagesUrl" -ForegroundColor Cyan
Write-Host "Badge Markdown:"
Write-Host "[![Live DP-700 Simulator](https://img.shields.io/badge/Live-DP--700%20Simulator-2563EB?style=for-the-badge&logo=github)]($pagesUrl)"
