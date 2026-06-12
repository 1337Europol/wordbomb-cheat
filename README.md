# Word Bomb FR — Lexique

Outil de recherche de mots français pour le jeu **Word Bomb**. Entre une syllabe ou une combinaison de lettres, et retrouve tous les mots du dictionnaire qui la contiennent — triés par longueur.

## Démarrage rapide (utiliser le projet)

N'importe qui peut l'utiliser en local :

```bash
git clone https://github.com/1337Europol/wordbomb.git
cd wordbomb
npm install
npm start
```

Ouvre [http://localhost:3000](http://localhost:3000).

> Si `src/data/words.json` n'est pas présent : `npm run build-dict` puis `npm start`.

**Application Electron (fenêtre flottante) :** `npm run app`

---

## Guides

| Guide | Contenu |
|-------|---------|
| **[PUBLISH.md](PUBLISH.md)** | **Créer le repo GitHub** — guide complet étape par étape |
| **[SETUP.md](SETUP.md)** | Personnaliser le site (contact, config, déploiement) |
| **[SECURITY.md](SECURITY.md)** | Mesures de sécurité |

---

## Fonctionnalités

- Recherche instantanée avec debounce
- Tri par longueur ou ordre alphabétique
- Filtres : pluriels, verbes, mots longs (8+), trait d'union
- Copie d'un mot au clic (ou Entrée / Espace)
- Pages Support et Contact
- Formulaire contact sécurisé (rate limit IP + identifiant navigateur)
- Dictionnaire construit à partir de sources ouvertes

---

## Prérequis

- [Node.js](https://nodejs.org/) 18 ou supérieur

---

## Structure

```
src/
├── client/          # Interface (HTML, CSS, JS)
├── data/            # Dictionnaire + logs contact (log gitignoré)
└── server/
    ├── config/
    ├── lib/
    ├── middleware/
    ├── routes/
    └── scripts/build-dict/
```

---

## API

| Route | Description |
|-------|-------------|
| `GET /api/info` | Nombre de mots dans le dictionnaire |
| `GET /api/search` | Recherche de mots |
| `POST /api/contact` | Envoi formulaire contact |

---

## Sécurité — prêt pour release ?

**Oui**, pour un projet open source de cette taille :

- Helmet (CSP, en-têtes sécurisés)
- Rate limiting API + contact
- Validation stricte des entrées (recherche + contact)
- Clés secrètes dans `.env` uniquement
- Pas de stack trace en production
- Journal contact local (IP + ID navigateur)

**À faire avant la mise en prod publique :**

1. Créer `.env` avec `WEB3FORMS_ACCESS_KEY`
2. Mettre ton URL GitHub dans `site-config.js`
3. HTTPS derrière un reverse proxy

Détails : [SECURITY.md](SECURITY.md)

---

## Support / Aide

Besoin d'aide, ajoute-moi sur Discord : **httpmethod**

---

## Avertissement

Ce projet est fourni à des fins éducatives et de divertissement uniquement. L'auteur n'encourage pas et ne cautionne pas toute utilisation visant à obtenir un avantage déloyal dans un jeu en ligne. Toute utilisation de cet outil est sous la seule et entière responsabilité de l'utilisateur. L'auteur ne pourra en aucun cas être tenu responsable des conséquences — sanctions, bannissements ou autres — découlant d'un usage contraire aux conditions d'utilisation de Word Bomb ou à la législation applicable.

---

## Licence

MIT
