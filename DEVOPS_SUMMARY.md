# 🎓 Rapport Détaillé — TP DevOps & CI/CD (GearShift-API)

Ce document résume l'ensemble des concepts, choix d'architecture et implémentations techniques réalisés sur le projet **GearShift-API**. Il a pour but de t'aider à comprendre en profondeur chaque composant du TP, leur utilité et comment ils s'articulent.

---

## 🎯 1. But du Projet & Objectifs du TP

**GearShift-API** est une application Node.js/TypeScript permettant de gérer la location de matériel technologique (ex: ordinateurs, écrans, accessoires). 

L'objectif de ce TP n'était pas seulement de coder l'application, mais de mettre en place une **chaîne DevOps complète** garantissant :
1. **La qualité du code** (Clean Architecture, patterns de conception et tests automatisés).
2. **La reproductibilité de l'environnement** (Docker & Docker Compose).
3. **L'automatisation et la validation** (Pipeline CI/CD avec GitHub Actions).
4. **La sécurité** (Audits de dépendances et scans d'images de conteneurs).
5. **Le déploiement automatisé** (Infrastructure as Code avec Ansible).
6. **L'observabilité** (Logs structurés en JSON et Healthchecks).

---

## 📐 2. Architecture & Design Patterns (Côté Code)

Pour que l'application soit maintenable et évolutive, elle est structurée selon la **Clean Architecture** (ou Architecture Hexagonale). Le code métier (le domaine) est totalement indépendant des frameworks, bases de données ou outils de log (l'infrastructure).

Quatre Design Patterns majeurs ont été mis en œuvre :

### 1. Singleton (Patron de Création)
* **Où :** Dans [Database.ts](file:///Users/venusasseakakpo/CI_CD/GearShift-API/src/infrastructure/database/Database.ts) (connexion BDD) et [Logger.ts](file:///Users/venusasseakakpo/CI_CD/GearShift-API/src/infrastructure/logging/Logger.ts) (logs).
* **Pourquoi :** Il garantit qu'une classe n'a qu'une **unique instance** au sein de l'application et fournit un point d'accès global.
* **Intérêt :** Évite d'ouvrir plusieurs connexions à la base de données (ce qui épuiserait les ports réseau) et centralise la configuration des logs.

### 2. Repository Pattern (Patron de Structure)
* **Où :** Interface définie dans le domaine (`src/domain/repositories/`), implémentée dans l'infrastructure (`src/infrastructure/repositories/`).
* **Pourquoi :** Il sert de passerelle entre le domaine métier et la persistance des données. 
* **Intérêt :** Le code métier ne sait pas comment les données sont stockées. Pendant les tests, on utilise un dépôt en mémoire (rapide), alors qu'en production on utilise PostgreSQL, sans changer une seule ligne du code métier.

### 3. State Pattern (Patron de Comportement)
* **Où :** Dans [EquipmentState.ts](file:///Users/venusasseakakpo/CI_CD/GearShift-API/src/domain/states/EquipmentState.ts).
* **Pourquoi :** Il permet à un objet de modifier son comportement lorsque son état interne change. Un équipement passe par plusieurs états : `Available`, `Rented`, `Maintenance`, `Retired`.
* **Intérêt :** Élimine les structures conditionnelles complexes (`if/else` imbriqués). Si un équipement est en `Maintenance`, la méthode `rent()` lèvera automatiquement une erreur via la classe d'état associée.

### 4. Strategy Pattern (Patron de Comportement)
* **Où :** Dans [PricingStrategy.ts](file:///Users/venusasseakakpo/CI_CD/GearShift-API/src/domain/strategies/PricingStrategy.ts).
* **Pourquoi :** Il définit une famille d'algorithmes, les encapsule et les rend interchangeables.
* **Intérêt :** Permet de calculer dynamiquement le prix d'une location en fonction du profil de l'utilisateur (`StandardPricing`, `StudentPricing` avec 20% de réduction, `WeekendPricing` avec 15% de majoration, ou `EnterprisePricing`).

---

## 🧪 3. Validation & Tests Automatisés

Un des prérequis essentiels du TP était d'avoir une couverture de tests supérieure à **70%**. Nous avons atteint **88.6%** grâce à l'implémentation de tests rigoureux.

* **Jest & Supertest** : Utilisés pour lancer des tests unitaires (tester une fonction isolée) et d'intégration (tester des routes HTTP de bout en bout).
* **Structure AAA (Arrange, Act, Assert)** : 
  - *Arrange* : On prépare les données et l'environnement de test.
  - *Act* : On exécute l'action / la fonction à tester.
  - *Assert* : On valide que le résultat obtenu est celui attendu.
* **Règle de nommage** : Les tests sont nommés sous la forme `should [résultat] when [condition]` (ex: `should calculate base price when standard strategy is used`).
* **Résolution du TS Conflict** : Pour éviter que le compilateur TypeScript de production (`tsconfig.json`) n'entre en conflit avec les types de tests, nous avons créé un fichier dédié [tests/tsconfig.json](file:///Users/venusasseakakpo/CI_CD/GearShift-API/tests/tsconfig.json) qui force l'inclusion des fichiers `.test.ts`.

---

## 🐳 4. Conteneurisation (Docker & Docker Compose)

Docker permet d'encapsuler l'application dans un conteneur contenant tout le nécessaire pour s'exécuter, éliminant le fameux *"ça marche sur ma machine"*.

### Le Dockerfile (Multi-stage Build)
Le [Dockerfile](file:///Users/venusasseakakpo/CI_CD/GearShift-API/Dockerfile) est divisé en deux étapes (stages) :
1. **Étape 1 : Builder** : On installe toutes les dépendances (y compris de développement) et on compile le code TypeScript en JavaScript (`npm run build`).
2. **Étape 2 : Production** : On ne repart que d'une image Node.js ultra-légère, on y copie uniquement le code compilé et on y installe uniquement les dépendances nécessaires à l'exécution (`npm ci --omit=dev --ignore-scripts`).
   - *Pourquoi `--ignore-scripts` ?* En mode production sans les dépendances de développement, Husky (gestionnaire de hooks git) ne peut pas s'installer et ferait échouer le build Docker si les scripts d'installation se déclenchaient.

### Docker Compose
Le fichier `docker-compose.yml` orchestre deux conteneurs :
1. **L'API** (notre application Node.js).
2. **La base de données PostgreSQL**.
* **Healthcheck & Dépendance** : Le conteneur PostgreSQL dispose d'un test de santé (`healthcheck`). Grâce à la directive `depends_on` avec la condition `service_healthy`, le conteneur API attend que PostgreSQL soit totalement prêt à recevoir des connexions avant de démarrer.

---

## 🚀 5. Pipeline CI/CD (GitHub Actions)

Le pipeline CI/CD automatisé est défini dans [.github/workflows/ci.yml](file:///Users/venusasseakakpo/CI_CD/GearShift-API/.github/workflows/ci.yml). Il s'exécute à chaque Pull Request ou Push sur la branche principale `main`.

### Fonctionnement du Pipeline :
1. **Étape 1 : Vérifications en parallèle** (Gain de temps) :
   - `lint` : Vérifie la mise en forme du code.
   - `test` : Exécute les tests Jest et vérifie que la couverture de code est supérieure au seuil imposé.
   - `security-audit` : Analyse si les dépendances npm contiennent des vulnérabilités connues (`npm audit`).
2. **Étape 2 : Build** (s'exécute uniquement si l'étape 1 est verte) :
   - Compile le code TypeScript.
3. **Étape 3 : Docker Scan (Trivy)** :
   - Construit l'image Docker de production en local.
   - Utilise **Trivy** pour scanner cette image Docker et s'assurer que l'OS de base ou le code ne contiennent pas de failles de sécurité critiques. Si Trivy trouve une faille critique, le pipeline échoue.
4. **Étape 4 : Déploiement Staging (CD)** :
   - S'exécute uniquement sur un push sur la branche `main`.
   - Convertit le nom du dépôt GitHub en minuscules (car les registres Docker refusent les majuscules).
   - Se connecte au registre sécurisé de GitHub (GHCR - GitHub Container Registry).
   - Publie l'image finale sous les tags `latest` et `[commit_sha]`.

---

## 🏗️ 6. Infrastructure as Code (Ansible)

Pour automatiser la mise en production sur un vrai serveur sans le configurer à la main, nous utilisons **Ansible**.

* **[inventory.ini](file:///Users/venusasseakakpo/CI_CD/GearShift-API/ansible/inventory.ini)** : Contient les adresses IP et identifiants des serveurs cibles (Staging/Production).
* **[playbook.yml](file:///Users/venusasseakakpo/CI_CD/GearShift-API/ansible/playbook.yml)** : Décrit les étapes à suivre de manière **idempotente** (si une action a déjà été réalisée, Ansible ne la refait pas et ne génère pas d'erreur) :
  1. Mise à jour du cache des paquets (`apt update`).
  2. Installation de Docker et de Docker Compose sur le serveur.
  3. Démarrage du service Docker.
  4. Création des répertoires du projet.
  5. Copie du fichier `docker-compose.yml`.
  6. Lancement de l'application via `docker-compose up -d`.

---

## 📊 7. Monitoring, Observabilité & Logging

Un projet DevOps doit être surveillé en temps réel.
* **Logs structurés en JSON** : Au lieu d'écrire de simples messages textuels via `console.log`, l'application utilise une classe [Logger.ts](file:///Users/venusasseakakpo/CI_CD/GearShift-API/src/infrastructure/logging/Logger.ts) pour générer des logs au format JSON structuré. Chaque log contient un `timestamp`, le niveau (`info`, `error`), le message, les détails de la requête HTTP (méthode, URL, statut) et la trace d'erreur complète en cas de crash.
  - *Pourquoi ?* Les outils modernes de gestion de logs (Datadog, Kibana, Loki) peuvent parser le JSON instantanément pour créer des graphiques de trafic, de temps de réponse ou d'erreurs en temps réel.
* **Endpoint de santé (`/health`)** : Permet à un système externe (comme Docker ou un Load Balancer) de vérifier si l'API et sa connexion avec la BDD fonctionnent correctement.

---

## 📌 8. Ce qui est indispensable vs optionnel pour un TP complet

| Composant | Statut dans le TP | Pourquoi ? |
| :--- | :--- | :--- |
| **Clean Arch & Design Patterns** | **Indispensable** | Démontre la maîtrise de la conception logicielle et facilite l'écriture des tests. |
| **Tests automatisés ($\ge 70\%$)** | **Indispensable** | Bloque le pipeline en cas de régression. Essentiel pour la CI. |
| **Dockerfile & Docker Compose** | **Indispensable** | Assure que l'app tourne de façon identique partout. |
| **Pipeline GitHub Actions** | **Indispensable** | Automatise toutes les étapes du cycle de développement. |
| **Ansible Playbook** | **Indispensable** | Représente la partie "IaC" (Infrastructure as Code) demandée. |
| **Logs Structurés & Healthcheck** | **Indispensable** | Fournit les bases du monitoring et de la surveillance applicative. |
| **Scan de vulnérabilités (Trivy/Audit)** | **Indispensable** | Assure la sécurité du conteneur avant publication. |
| **SonarCloud (Analyse statique)** | *Optionnel / Workaround* | Idéal en entreprise, mais nécessite un compte et un jeton privé. Commenté dans le YAML pour éviter de bloquer le pipeline en l'absence de clé de licence. |
| **Déploiement sur un vrai VPS cloud** | *Optionnel / Simulé* | Simulé via la publication de l'image Docker sur GHCR pour des raisons de coût et d'absence de serveur physique pour l'évaluation. |

---

## 📖 Lexique DevOps Rapide

* **CI (Intégration Continue)** : Pratique qui consiste à automatiser l'intégration, la compilation, le linting et le test du code à chaque modification.
* **CD (Déploiement Continu)** : Pratique qui automatise le déploiement de l'application validée vers un environnement (Staging ou Production).
* **IaC (Infrastructure as Code)** : Gestion et provisionnement de serveurs à l'aide de fichiers de configuration lisibles par machine (ex: Ansible, Terraform).
* **Trivy** : Scanner de sécurité pour conteneurs qui cherche des failles dans les paquets installés au sein de l'image Docker.
* **Idempotence** : Propriété d'une opération qui produit le même résultat qu'elle soit exécutée une ou plusieurs fois (concept central d'Ansible).
