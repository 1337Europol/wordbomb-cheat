# Sécurité

Ce document décrit les mesures de sécurité intégrées et les bonnes pratiques pour héberger ce projet.

## Mesures intégrées

| Mesure | Description |
|--------|-------------|
| **Helmet** | En-têtes HTTP sécurisés (CSP, X-Frame-Options, etc.) |
| **Rate limiting** | Limite les requêtes sur `/api` (120/min par IP par défaut) |
| **Validation des entrées** | Requêtes de recherche : 2–32 caractères, lettres/tiret/apostrophe uniquement |
| **Réponses filtrées** | Le champ interne `norm` n'est jamais exposé via l'API |
| **Fichiers statiques** | Fichiers cachés (`.env`, etc.) refusés ; seul `src/client/` est servi |
| **Erreurs génériques** | Pas de stack trace exposée en production |
| **XSS côté client** | Échappement HTML systématique avant injection DOM |
| **Contact anti-abus** | Rate limit par IP **et** identifiant navigateur ; journal local |

### Formulaire contact

- Identifiant persistant généré côté client (`localStorage`, UUID v4) — envoyé via `X-Client-Id`
- Limite : **5 messages / heure** par IP **ou** par identifiant navigateur (changer d'IP ne suffit pas)
- Chaque envoi est journalisé dans `src/data/contact-log.json` (IP, clientId, user-agent, sujet, hash e-mail)
- Ce fichier est dans `.gitignore` — ne pas le committer
- Honeypot anti-bot, validation stricte des champs, clé Web3Forms côté serveur uniquement

## Déploiement en production

1. **Variables d'environnement**

   ```bash
   cp .env.example .env
   ```

   Définir au minimum :

   ```env
   NODE_ENV=production
   TRUST_PROXY=true
   PORT=3000
   ```

2. **Reverse proxy (recommandé)**

   Place nginx, Caddy ou Cloudflare devant Node. Le serveur n'expose que le port interne ; le proxy gère TLS/HTTPS.

3. **HTTPS obligatoire**

   Ne déploie jamais en production sans TLS. Helmet active `upgradeInsecureRequests` automatiquement.

4. **Dictionnaire**

   `src/data/words.json` doit exister avant le démarrage :

   ```bash
   npm run build-dict
   npm start
   ```

5. **Dépendances**

   Vérifie régulièrement les vulnérabilités :

   ```bash
   npm audit
   npm audit fix
   ```

## Signaler une faille

Ouvre une issue privée ou contacte le mainteneur du dépôt. Ne publie pas de failles de sécurité publiquement avant correction.

## Ce que ce projet ne fait pas

- Pas d'authentification (API publique en lecture seule)
- Pas de base de données externe
- Pas de stockage de données utilisateur

Le risque principal est l'abus de l'API (DoS par requêtes massives) — atténué par le rate limiting.
