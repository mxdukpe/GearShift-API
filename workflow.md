# 🚀 Workflow du Projet : GearShift-API

## 🎯 Phase 0 : Vision & Objectifs

### Le But du Projet
L'objectif est de concevoir et déployer une plateforme professionnelle de **location de matériel technologique** (ordinateurs, écrans, accessoires). Le système doit assurer la gestion de l'inventaire en temps réel, le traitement sécurisé des réservations et le suivi rigoureux de l'état du matériel.

### Pourquoi ce projet (n°3) répond aux exigences ?
* **Complexité Logique** : La gestion des stocks et des périodes de location impose des règles métier réelles, idéales pour dépasser le seuil des **15 tests automatisés**.
* **Architecture & Design Patterns** : Le cycle de vie du matériel (Disponible, Loué, Maintenance) justifie pleinement l'usage du pattern **State**, tandis que la tarification flexible valide le pattern **Strategy**.
* **Démonstration DevOps** : La stack multi-services (API + Database) permet de construire un pipeline CI/CD complexe avec du parallélisme, du scan de sécurité et une gestion d'infrastructure reproductible.

### Stack Technique & Justifications
* **Langage : Node.js (TypeScript)** : Choisi pour la robustesse du typage, ce qui rend l'implémentation des Design Patterns (Repository, Singleton) explicite et facile à maintenir.
* **Base de Données : PostgreSQL** : Indispensable pour gérer les relations complexes entre utilisateurs, matériels et contrats de location.
* **Tests : Jest & Supertest** : Pour garantir une **couverture de code $\ge$ 70%** via des tests unitaires et d'intégration.
* **Frontend : React (Tailwind CSS)** : Pour offrir une interface de gestion claire, facilitant la démonstration du projet.

---

## 🛠️ Phases de Réalisation

### 📅 Jour 1 : Architecture & Cœur Métier
* **Setup Git** : Initialisation du repo, configuration du `.gitignore` et activation des **Conventional Commits**.
* **Structure du Code** : Mise en place d'une architecture propre (MVC ou Hexagonale) avec séparation des responsabilités.
* **Design Patterns** : Développement du **Singleton** pour la DB et du **Repository Pattern** pour l'accès aux données.
* **API REST** : Développement des **7 endpoints CRUD** pour la gestion du matériel et des réservations.
* **Tests Unitaires** : Implémentation de la logique de calcul de prix et de validation des états (Méthode TDD).

### 📅 Jour 2 : Automatisation & Qualité
* **Tests d'Intégration** : Validation des routes API avec une base de données de test (utilisation de Mocks si nécessaire).
* **Analyse de Code** : Configuration de **ESLint** (Linting) et mise en place de hooks de pre-commit (Husky).
* **Conteneurisation** : Écriture d'un **Dockerfile multi-stage** optimisé et d'un fichier `docker-compose.yml`.
* **Pipeline CI** : Création du workflow GitHub Actions (Jobs : Lint ➔ Tests ➔ SonarCloud ➔ Docker Build).
* **Sécurité** : Intégration d'un scan de vulnérabilités (Trivy ou Dependabot) dans le pipeline.

### 📅 Jour 3 : Infrastructure, Monitoring & Doc
* **Infrastructure as Code** : Création de scripts **Ansible** (configuration serveur) ou **Terraform** (provisionnement).
* **Observabilité** : Ajout d'un endpoint de **Health Check** (`/health`) et mise en place de logs structurés en JSON.
* **Pipeline CD** : Configuration du déploiement automatique vers un registre d'images (GHCR ou Docker Hub).
* **Documentation Finale** : Rédaction du **README.md** incluant les schémas d'architecture et les justifications techniques.
* **Validation** : Vérification finale du pipeline (doit être **VERT** sur `main`) et préparation du fichier de rollback.

