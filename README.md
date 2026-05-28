# 🚀 GearShift-API — Location de Matériel Technologique

GearShift-API est une plateforme de location de matériel technologique (ordinateurs, écrans, accessoires) conçue avec une architecture robuste, des tests unitaires et d'intégration automatisés, et un pipeline DevOps complet (Docker, CI/CD, IaC, Monitoring).

---

## 🛠️ Stack Technique

* **Backend :** Node.js (TypeScript) avec Express
* **Base de Données :** PostgreSQL (production) & SQLite / In-Memory (tests)
* **Tests :** Jest & Supertest
* **Conteneurisation :** Docker & Docker Compose
* **CI/CD :** GitHub Actions (Vérifications, Linting, Security Audit, Trivy Scan, CD Staging via GHCR)
* **Infrastructure as Code (IaC) :** Ansible

---

## 📦 Lancement du Projet

### 1. En local (Développement)

Pour lancer l'application en mode développement local :

```bash
# Installation des dépendances
npm install

# Lancement des tests locaux avec couverture
npm run test:coverage

# Lancement du serveur en mode dev (live reload)
npm run dev
```

L'API sera disponible sur : [http://localhost:3000](http://localhost:3000)

### 2. Avec Docker Compose (Production-Ready)

Pour instancier l'API et sa base de données PostgreSQL dans des conteneurs isolés :

```bash
# Lancement des conteneurs en tâche de fond
docker-compose up -d

# Arrêt des conteneurs
docker-compose down
```

L'API effectue un healthcheck automatique et attend que PostgreSQL soit sain (`service_healthy`) avant de démarrer.

---

## 📐 Architecture & Design Patterns

Le projet est structuré selon les principes de la Clean Architecture / Hexagonale, séparant le domaine métier (le cœur), l'application (les cas d'usage) et l'infrastructure (les frameworks et la BDD).

### 1. Singleton (Création)
* **Où :** Dans [Database.ts](file:///Users/venusasseakakpo/CI_CD/GearShift-API/src/infrastructure/database/Database.ts) et [Logger.ts](file:///Users/venusasseakakpo/CI_CD/GearShift-API/src/infrastructure/logging/Logger.ts).
* **Pourquoi :** Assure qu'une unique connexion à la base de données et qu'une seule instance de log soient partagées à travers toute l'application, évitant les fuites de mémoire et les ouvertures multiples de ports.

### 2. Repository Pattern (Structure)
* **Où :** Défini dans le domaine (`src/domain/repositories/`) et implémenté dans l'infrastructure (`src/infrastructure/repositories/`).
* **Pourquoi :** Permet d'isoler la logique métier des outils de stockage. On peut passer d'une base de données en mémoire (pour les tests) à une vraie BDD PostgreSQL (en production) sans toucher à une seule ligne de code métier.

### 3. State Pattern (Comportement)
* **Où :** Dans [EquipmentState.ts](file:///Users/venusasseakakpo/CI_CD/GearShift-API/src/domain/states/EquipmentState.ts).
* **Pourquoi :** Gère le cycle de vie d'un équipement (Available, Rented, Maintenance, Retired). Chaque état définit quelles actions sont autorisées (ex: impossible de louer un équipement déjà loué ou en maintenance), éliminant ainsi les chaînes complexes de conditions if/else.

### 4. Strategy Pattern (Comportement)
* **Où :** Dans [PricingStrategy.ts](file:///Users/venusasseakakpo/CI_CD/GearShift-API/src/domain/strategies/PricingStrategy.ts).
* **Pourquoi :** Permet de changer dynamiquement l'algorithme de calcul du prix de location selon le profil (Tarif Standard, Student avec 20% de remise, Weekend avec 15% de majoration, ou Enterprise).

---

## 🧪 Tests & Couverture de Code

La suite de tests respecte strictement les bonnes pratiques demandées :

* **Structure AAA (Arrange, Act, Assert) :** Chaque test prépare ses données (Arrange), exécute l'action (Act) et valide le résultat (Assert).
* **Nommage explicite :** Tous les tests suivent la convention `should [resultat] when [condition]`.
* **Couverture globale de code :** **88.6%** de couverture de code (seuil minimal fixé à 70% dans `jest.config.ts`), garantissant la résilience de l'application en cas de refactoring.

Pour exécuter les tests :
```bash
npm run test:coverage
```

---

## 🚀 Pipeline CI/CD (GitHub Actions)

Le pipeline défini dans [.github/workflows/ci.yml](file:///Users/venusasseakakpo/CI_CD/GearShift-API/.github/workflows/ci.yml) orchestre les étapes de livraison continue :

* **Qualité en parallèle :** Lancement simultané du Linting (ESLint/Prettier), des tests unitaires/intégration avec blocage si couverture $< 70\%$, et audit de sécurité des dépendances (`npm audit`).
* **Build :** Compilation TypeScript vers JavaScript.
* **Docker Scan (Trivy) :** Construction de l'image Docker de production et scan par Trivy pour s'assurer qu'aucune faille système ou applicative critique n'est présente.
* **Déploiement Continu (CD) :** Lors d'un push sur `main`, l'image Docker est automatiquement poussée sur GitHub Container Registry (ghcr.io) sous les tags `latest` et l'identifiant du commit (sha).

---

## 🏗️ Infrastructure as Code (IaC)

Un script Ansible complet est disponible dans le dossier [/ansible](file:///Users/venusasseakakpo/CI_CD/GearShift-API/ansible) pour provisionner automatiquement et déployer l'application sur un serveur distant :

* **[inventory.ini](file:///Users/venusasseakakpo/CI_CD/GearShift-API/ansible/inventory.ini) :** Déclare les adresses IP des serveurs de Staging et Production.
* **[playbook.yml](file:///Users/venusasseakakpo/CI_CD/GearShift-API/ansible/playbook.yml) :** Installe Docker, Docker Compose, configure les répertoires, copie la configuration, et déploie le conteneur de production de manière idempotente (si l'outil est déjà installé, Ansible passe à la suite sans erreur).

---

## 📊 Monitoring & Observabilité

* **Healthcheck :** Un endpoint `/health` est disponible pour interroger l'état de l'application et de sa base de données. Il est utilisé par le Dockerfile pour vérifier la santé du conteneur toutes les 30 secondes.
* **Logging structuré en JSON :** L'application implémente un logger structuré. Toutes les requêtes HTTP (méthode, URL, status, temps de réponse) et toutes les exceptions attrapées dans les middlewares sont loguées en format JSON standard. Cela permet aux agrégateurs de logs (Datadog, Loki) de filtrer et de créer des métriques/alertes en direct.

---

## ⚠️ Justification des Choix Impossibles (Workarounds)

Afin de respecter les contraintes de coût et de droits d'accès, les compromis suivants ont été adoptés :

* **SonarCloud (Analyse statique) :** L'analyse automatique de la Pull Request a été configurée dans le pipeline CI/CD, mais nécessite un jeton privé `SONAR_TOKEN`. Pour les besoins du TP et pour conserver un pipeline vert au rendu, les étapes de scan ont été temporairement commentées dans le fichier YAML. Elles peuvent être réactivées immédiatement en créant le projet SonarCloud et en ajoutant le token dans les secrets GitHub.
* **Serveur de Déploiement Continu :** Aucun serveur VPS cloud n'étant alloué, le déploiement continu réel vers une instance en ligne a été simulé. L'image de production est construite, testée et publiée sur le registre public GHCR (ghcr.io) de GitHub. L'architecture de déploiement finale est quant à elle fournie via les playbooks Ansible prêts à l'emploi.
