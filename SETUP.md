# Guide de configuration — Word Bomb FR

Ce guide explique **ce que chaque personne doit modifier** selon son usage.

---

## Tu veux juste utiliser le site en local

**Rien à modifier.** Clone, installe, lance :

```bash
npm install
npm start
```

Le dictionnaire (`words.json`) est inclus dans le repo → ça marche direct.

---

## Tu es le créateur — avant de publier sur GitHub

### Obligatoire (3 fichiers)

#### 1. `src/client/js/site-config.js`

```javascript
export const SITE_CONFIG = {
    githubUrl: 'https://github.com/TON-PSEUDO/wordbomb',
};
```

Remplace `TON-PSEUDO` par ton username GitHub.  
Les liens « Ouvrir une issue » et « Voir le dépôt » sur la page Contact en dépendent.

#### 2. `.env` (copie de `.env.example`)

```bash
copy .env.example .env    # Windows
# cp .env.example .env    # Mac/Linux
```

Contenu minimum :

```env
NODE_ENV=production
TRUST_PROXY=true
PORT=3000
WEB3FORMS_ACCESS_KEY=ta-clé-web3forms
```

**Web3Forms (gratuit) :**
1. Va sur [web3forms.com](https://web3forms.com)
2. Entre **ton e-mail** (tu recevras les messages contact)
3. Colle la access key dans `.env`

> Sans cette clé, le formulaire contact affichera une erreur — le reste du site fonctionne.

#### 3. `README.md` — ligne clone

Remplace `TON-USERNAME` par ton pseudo dans l'URL de clone.

---

### Optionnel

| Fichier | Modification |
|---------|--------------|
| `package.json` | `"author": "Ton Nom"` |
| `src/client/index.html` | Titre, description meta |
| `src/client/support.html` | Textes support |
| `src/client/contact.html` | Textes contact |
| `.env` | `CONTACT_MAX_PER_HOUR=5` pour ajuster la limite contact |

---

## Tu fork / redéploies le projet (autre personne)

### Minimum pour que ça tourne

```bash
git clone https://github.com/auteur/wordbomb.git
cd wordbomb
npm install
npm start
```

### Pour héberger en ligne (Render, Railway, etc.)

1. Fork le repo sur GitHub
2. Modifier `site-config.js` avec **ton** URL GitHub
3. Créer `.env` sur l'hébergeur avec :

```
NODE_ENV=production
TRUST_PROXY=true
PORT=3000
WEB3FORMS_ACCESS_KEY=ta-propre-clé
```

4. Build : `npm install` (+ `npm run build-dict` si pas de `words.json`)
5. Start : `npm start`

> **GitHub Pages ne suffit pas** — le site a besoin de Node.js pour l'API de recherche.

---

## Fichiers à ne jamais committer

| Fichier | Raison |
|---------|--------|
| `.env` | Clés secrètes |
| `node_modules/` | Trop lourd, regénéré par `npm install` |
| `src/data/contact-log.json` | Logs IP / identifiants visiteurs |

Tout est déjà dans `.gitignore`.

---

## Ce qui fonctionne sans configuration

- Recherche de mots
- Filtres et tri
- Copie au clic
- Pages Support
- Rate limiting et sécurité API

## Ce qui nécessite ta config

- Formulaire contact → e-mail (`WEB3FORMS_ACCESS_KEY`)
- Liens GitHub sur Contact → `site-config.js`

---

## Publier sur GitHub

Voir [PUBLISH.md](PUBLISH.md) pour les commandes git complètes.

---

## Sécurité

Le site est **safe pour une release publique** si tu respectes :

- `.env` jamais pushé
- HTTPS en production
- `TRUST_PROXY=true` derrière un proxy

Détails : [SECURITY.md](SECURITY.md)
