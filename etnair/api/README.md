# EtnAir API - Configuration Prisma

## Prérequis
- Docker et Docker Compose installés
- Node.js 18+ (optionnel, seulement si vous voulez exécuter en local)

## Installation

1. **Démarrer les conteneurs Docker** :
```bash
cd etnair
docker-compose up -d
```

2. **Installer les dépendances** (depuis le dossier `api`) :
```bash
cd api
npm install
```

## Utilisation de Prisma

### ⚠️ Important : Problème de connexion Windows
Sur Windows, il y a un problème d'authentification avec Prisma depuis l'hôte. Utilisez les commandes Docker ci-dessous.

### Commandes via Docker (Recommandé)

Depuis le dossier `api/`, utilisez les scripts npm qui encapsulent les commandes Docker :

```bash
# Créer une nouvelle migration
npm run docker:migrate

# Générer le client Prisma
npm run docker:generate

# Ouvrir Prisma Studio (interface graphique)
npm run docker:studio

# Réinitialiser la base de données
npm run docker:reset
```

### Commandes Docker directes (si npm scripts ne fonctionnent pas)

**⚠️ Important : Exécutez ces commandes depuis le dossier `api/`**

**Sur PowerShell (Windows) :**
```powershell
# Pour les migrations
docker run --rm --network etnair_etnair_net -v "${PWD}:/app" -w /app node:18-alpine sh -c "npx prisma migrate dev --name nom_migration"

# Pour Prisma Studio
docker run --rm --network etnair_etnair_net -v "${PWD}:/app" -w /app -p 5555:5555 node:18-alpine sh -c "npx prisma studio"

# Pour générer le client
docker run --rm --network etnair_etnair_net -v "${PWD}:/app" -w /app node:18-alpine sh -c "npx prisma generate"
```

**Sur CMD (Command Prompt Windows) :**
```cmd
# Pour les migrations
docker run --rm --network etnair_etnair_net -v "%cd%:/app" -w /app node:18-alpine sh -c "npx prisma migrate dev --name nom_migration"

# Pour Prisma Studio
docker run --rm --network etnair_etnair_net -v "%cd%:/app" -w /app -p 5555:5555 node:18-alpine sh -c "npx prisma studio"

# Pour générer le client
docker run --rm --network etnair_etnair_net -v "%cd%:/app" -w /app node:18-alpine sh -c "npx prisma generate"
```

**Sur Linux/Mac (Bash/Zsh) :**
```bash
# Pour les migrations
docker run --rm --network etnair_etnair_net -v "$(pwd):/app" -w /app node:18-alpine sh -c "npx prisma migrate dev --name nom_migration"

# Pour Prisma Studio
docker run --rm --network etnair_etnair_net -v "$(pwd):/app" -w /app -p 5555:5555 node:18-alpine sh -c "npx prisma studio"

# Pour générer le client
docker run --rm --network etnair_etnair_net -v "$(pwd):/app" -w /app node:18-alpine sh -c "npx prisma generate"
```

## Configuration

Le fichier `.env` contient la connexion à la base de données :
```env
DATABASE_URL=postgresql://etnair_user:etnair_pass@db:5432/etnair_db
```

- `db:5432` → Utilisé par les conteneurs Docker (réseau interne)
- `localhost:5432` ou `127.0.0.1:5432` → Pour connexion locale (ne fonctionne pas sur Windows avec Prisma actuellement)

## Structure de la base de données

Le schéma Prisma définit deux modèles :

- **Utilisateur** : id, email (unique), nom, password
- **Annonce** : id, titre, description, prix, utilisateurId (relation vers Utilisateur)

## Accès à la base de données

- **PostgreSQL** : `localhost:5432`
  - User: `etnair_user`
  - Password: `etnair_pass`
  - Database: `etnair_db`

- **pgAdmin** : http://localhost:5050
  - Email: `admin@etnair.com`
  - Password: `admin`

## API Routes (à implémenter dans index.js)

```javascript
GET    /utilisateurs      - Liste tous les utilisateurs
POST   /utilisateurs      - Créer un utilisateur
GET    /annonces          - Liste toutes les annonces
POST   /annonces          - Créer une annonce
```

## Dépannage

Si vous rencontrez l'erreur `P1001: Can't reach database server at 'db:5432'` :
- Assurez-vous que Docker est lancé : `docker ps`
- Vérifiez que le conteneur `etnair_db` est en état `healthy`
- Utilisez les commandes `docker:*` au lieu des commandes locales

Si l'erreur est `P1000: Authentication failed` avec "(not available)" :
- C'est un bug connu sur Windows avec Prisma
- Utilisez obligatoirement les commandes Docker (`npm run docker:migrate` etc.)