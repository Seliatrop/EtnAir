FROM node:18-alpine

# Installer OpenSSL pour Prisma
RUN apk add --no-cache openssl

WORKDIR /app

# Copier les fichiers package.json et package-lock.json
COPY package*.json ./
COPY prisma ./prisma/

# Installer les dépendances
RUN npm install

# Générer le client Prisma
RUN npx prisma generate

# Copier le reste des fichiers de l'application
COPY . .

# Exposer le port sur lequel l'application écoute
EXPOSE 2999

# Démarrer l'application avec migration Prisma puis nodemon
CMD ["sh", "-c", "npx prisma migrate deploy && npm run dev"]