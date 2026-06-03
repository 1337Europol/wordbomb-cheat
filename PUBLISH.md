# Guide — Créer le dépôt GitHub

Guide complet pour publier **Word Bomb FR** sur GitHub, de A à Z.

---

## Prérequis

Avant de commencer, vérifie que tu as :

| Outil | Vérification | Installation |
|-------|--------------|--------------|
| **Git** | `git --version` | [git-scm.com](https://git-scm.com/download/win) |
| **Node.js 18+** | `node --version` | [nodejs.org](https://nodejs.org/) |
| **Compte GitHub** | — | [github.com/signup](https://github.com/signup) |

---

## Étape 1 — Préparer le projet en local

Ouvre PowerShell dans le dossier du projet :

```powershell
cd "c:\Users\ton nom frero\Downloads\wordbomb-main\wordbomb-main\wordbomb"
```

### 1.1 Tester que tout fonctionne

```powershell
npm install
npm start
```

Ouvre [http://localhost:3000](http://localhost:3000) — la recherche doit marcher.

### 1.2 Personnaliser (recommandé avant le push)

#### a) Lien GitHub du site

Édite `src/client/js/site-config.js` :

```javascript
export const SITE_CONFIG = {
    githubUrl: 'https://github.com/TON-PSEUDO/wordbomb',
};
```

Remplace `TON-PSEUDO` par ton username GitHub.

#### b) Formulaire contact (optionnel mais recommandé)

```powershell
copy .env.example .env
```

1. Va sur [web3forms.com](https://web3forms.com)
2. Entre ton e-mail → récupère la **access key**
3. Colle-la dans `.env` :

```env
WEB3FORMS_ACCESS_KEY=ta-clé-ici
```

> `.env` ne sera **jamais** pushé sur GitHub (déjà dans `.gitignore`).

#### c) README

Dans `README.md`, remplace `TON-USERNAME` par ton pseudo dans l'URL de clone.

#### d) Auteur (optionnel)

Dans `package.json` : `"author": "Ton Nom"`

---

## Étape 2 — Créer le dépôt sur GitHub

1. Va sur **[github.com/new](https://github.com/new)**
2. Remplis :
   - **Repository name** : `wordbomb`
   - **Description** : `Lexique français pour Word Bomb — recherche par syllabe`
   - **Public** ✓
   - **Ne coche pas** « Add a README file »
   - **Ne coche pas** « Add .gitignore »
   - **Ne choisis pas** de licence (tu as déjà `LICENSE` en local)
3. Clique **Create repository**

GitHub affiche une page avec des commandes — **ignore-les**, suis l'étape 3 ci-dessous.

---

## Étape 3 — Premier commit et push

Toujours dans le dossier du projet :

```powershell
git init
git add .
git status
```

Vérifie que tu ne vois **pas** :
- `node_modules/`
- `.env`
- `src/data/contact-log.json`

Si tout est bon :

```powershell
git commit -m "Initial commit — lexique Word Bomb FR"
git branch -M main
git remote add origin https://github.com/TON-PSEUDO/wordbomb.git
git push -u origin main
```

Remplace `TON-PSEUDO` par ton username.

### Authentification GitHub

Au premier push, GitHub demandera de te connecter :
- **Navigateur** → connexion OAuth (le plus simple)
- Ou **Personal Access Token** si demandé : [github.com/settings/tokens](https://github.com/settings/tokens)

---

## Étape 4 — Vérifier sur GitHub

Une fois le push terminé, va sur :

```
https://github.com/TON-PSEUDO/wordbomb
```

Checklist :
- [ ] README s'affiche correctement
- [ ] Dossiers `src/client`, `src/server`, `src/data` visibles
- [ ] Pas de `node_modules/` ni `.env`
- [ ] Fichier `LICENSE` présent

---

## Étape 5 — Tester un clone frais (recommandé)

Pour vérifier que d'autres personnes peuvent utiliser ton repo :

```powershell
cd $env:TEMP
git clone https://github.com/TON-PSEUDO/wordbomb.git wordbomb-test
cd wordbomb-test
npm install
npm start
```

Si ça marche → ton repo est prêt.

---

## Étape 6 — Héberger en ligne (optionnel)

GitHub héberge le **code**, pas le site Node.js. Pour un site public :

### Render (gratuit, simple)

1. [render.com](https://render.com) → **New +** → **Web Service**
2. Connecte ton repo GitHub `wordbomb`
3. Paramètres :
   - **Build Command** : `npm install`
   - **Start Command** : `npm start`
4. Variables d'environnement :

```
NODE_ENV=production
TRUST_PROXY=true
WEB3FORMS_ACCESS_KEY=ta-clé
```

5. Deploy → tu obtiens une URL du type `https://wordbomb-xxxx.onrender.com`

> **Note :** GitHub Pages ne suffit pas — le projet a besoin de Node.js pour l'API de recherche.

---

## Commandes utiles après la release

```powershell
# Voir l'état
git status

# Ajouter des modifications
git add .
git commit -m "Description du changement"
git push

# Voir l'historique
git log --oneline
```

---

## Problèmes fréquents

| Problème | Solution |
|----------|----------|
| `git push` refusé (auth) | Reconnecte-toi via GitHub Desktop ou un token |
| `remote origin already exists` | `git remote remove origin` puis re-ajoute |
| Fichier trop gros (>100 Mo) | Ne commit pas `node_modules/` — vérifie `.gitignore` |
| `.env` pushé par erreur | `git rm --cached .env` → commit → régénère ta clé Web3Forms |
| Contact ne marche pas en prod | Vérifie `WEB3FORMS_ACCESS_KEY` dans les variables d'hébergeur |

---

## Récap — ordre des actions

```
1. npm install && npm start          → tester en local
2. site-config.js + README           → personnaliser
3. .env (local seulement)            → contact e-mail
4. github.com/new                    → créer le repo vide
5. git init → add → commit → push    → publier
6. Tester un clone frais             → valider
7. (Optionnel) Render / Railway      → site en ligne
```

---

## Autres guides

- **[SETUP.md](SETUP.md)** — détail de chaque fichier à modifier
- **[SECURITY.md](SECURITY.md)** — sécurité et déploiement prod
- **[README.md](README.md)** — présentation du projet
