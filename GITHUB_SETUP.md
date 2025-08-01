# 📋 Guia para Subir o Projeto no GitHub

## 🚀 Passos para Criar o Repositório no GitHub

### 1. Criar Repositório no GitHub
1. Acesse [GitHub.com](https://github.com)
2. Clique em "New" ou "+" no canto superior direito
3. Escolha "New repository"
4. Configure o repositório:
   - **Nome**: `super-jump-2d`
   - **Descrição**: `Jogo de plataforma 2D desenvolvido pela XD Plans`
   - **Visibilidade**: Public ou Private (sua escolha)
   - **Não** marque "Initialize with README" (já temos um)

### 2. Inicializar Git Localmente
Abra o terminal no Replit e execute os comandos:

```bash
# Inicializar repositório Git
git init

# Adicionar todos os arquivos
git add .

# Fazer o primeiro commit
git commit -m "Initial commit - Super Jump 2D Game by XD Plans"

# Adicionar o repositório remoto (substitua SEU_USUARIO pelo seu username do GitHub)
git remote add origin https://github.com/SEU_USUARIO/super-jump-2d.git

# Fazer push para o GitHub
git push -u origin main
```

### 3. Se você não tem Git configurado no Replit

```bash
# Configurar usuário Git (substitua pelos seus dados)
git config --global user.name "David Xavier"
git config --global user.email "seu-email@exemplo.com"
```

## 📁 Arquivos Preparados

Já criei os seguintes arquivos essenciais para o GitHub:
- ✅ `README.md` - Documentação completa do projeto
- ✅ `.gitignore` - Arquivos que não devem ser versionados
- ✅ `replit.md` - Documentação da arquitetura

## 🎯 Após Subir no GitHub

1. **Atualize o README.md** com o link correto do repositório
2. **Adicione screenshots** do jogo na pasta `docs/images/`
3. **Configure GitHub Pages** se quiser hospedar o jogo gratuitamente
4. **Adicione tags/releases** para versões estáveis

## 🔒 Variáveis de Ambiente

Lembre-se de configurar as seguintes variáveis no GitHub (Settings > Secrets):
- `DATABASE_URL` (se usar banco de dados)
- Outras chaves de API necessárias

## 📱 Deploy Automático

Para configurar deploy automático no GitHub Pages:
1. Vá em Settings > Pages
2. Source: GitHub Actions
3. Configure o workflow para build automático

## 🤝 Colaboração

Se quiser que outras pessoas contribuam:
1. Configure branch protection rules
2. Crie templates para Issues e Pull Requests
3. Adicione um CONTRIBUTING.md

---

**Esse guia te ajuda a colocar o projeto no GitHub de forma profissional! 🚀**