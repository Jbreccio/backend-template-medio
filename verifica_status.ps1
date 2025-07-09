Write-Host "Verificando status do repositório atual..."

# Verifica se .gitignore contém .env
if ((Get-Content ".gitignore" -Raw) -match "\.env") {
    Write-Host ".env está no .gitignore"
} else {
    Write-Host "Atenção: .env NÃO está no .gitignore"
}

# Verifica se há alterações não comitadas
$status = git status --porcelain
if ($status) {
    Write-Host "Existem mudanças não comitadas:"
    Write-Host $status
} else {
    Write-Host "Tudo commitado e limpo!"
}

Write-Host ""
Write-Host "Feito por Jose Roberto Breccio - @Jbreccio"
