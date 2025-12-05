# Politique de branches et flux Git

Ce document explique la stratégie de branches utilisée pour ce dépôt afin d'avoir un flux propre et professionnel.

Principes généraux
- **`main`** : branche de production (toujours déployable). Elle est protégée.
- **`dev`** : branche d'intégration continue — toutes les fonctionnalités validées arrivent ici avant release.
- **`feature/<nom>`** : branches de travail pour une fonctionnalité ou tâche.
- **`bugfix/<nom>`** : corrections ciblées.
- **`release/<version>`** : préparation de release (optionnel).
- **`hotfix/<version>`** : correctif critique appliqué sur `main`.

Règles de travail
- Créer une branche de fonctionnalité depuis `dev` :
  ```powershell
  git checkout dev
  git pull
  git checkout -b feature/ma-feature
  ```
- Faire des commits atomiques et lisibles (préfixes : `feat:`, `fix:`, `docs:`, `chore:`).
- Pousser la branche et ouvrir une Merge Request (MR) / Pull Request vers `dev` :
  ```powershell
  git push -u origin feature/ma-feature
  ```
- Mettre à jour votre branche avant MR :
  ```powershell
  git fetch origin
  git rebase origin/dev
  # ou, si vous préférez merges:
  # git merge origin/dev
  ```
- Demander une revue via MR et attendre l'approbation + CI verte avant merge.

Gestion des releases
- Quand `dev` est stable, créer une `release/<version>` depuis `dev`, faire les tests, puis fusionner dans `main`.
- Tagger la release :
  ```powershell
  git checkout main
  git merge --no-ff release/1.2.3
  git tag -a v1.2.3 -m "Release v1.2.3"
  git push origin main --tags
  ```

Remarques pour les protections (GitLab)
- Protéger `main` et `dev` via l'interface GitLab : empêcher les pushes directs, exiger MR et approbations.
- Activer les pipelines CI sur MR et les règles de merge (ex : pipeline green, au moins 1 approbation).

Commandes utiles de nettoyage local
- Supprimer une branche locale terminée :
  ```powershell
  git branch -d feature/ancienne
  ```
- Supprimer une branche distante (après confirmation) :
  ```powershell
  git push origin --delete feature/ancienne
  ```

Checklist pour les développeurs
- Créer une branche depuis `dev`.
- Faire des commits clairs et tests locaux.
- Pousser la branche et ouvrir une MR vers `dev`.
- Résoudre les conflits et mettre à jour depuis `dev` avant merge.
- S'assurer que CI passe et obtenir approbation.

Contact / Processus
- Utilisez les MR pour discuter des changements et laissez des descriptions claires.
- Pour suppression massive de branches ou changement de protection, contactez l'administrateur GitLab.

---
Fichier généré automatiquement pour harmoniser le flux Git du projet.
