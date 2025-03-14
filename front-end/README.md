# Akkor Hotel - Frontend

Bienvenue dans le projet Akkor Hotel ! Ce projet est une application permettant de gérer la réservation d'hôtels avec une interface utilisateur moderne et réactive. Ce dépôt contient la partie **Frontend** de l'application.

## Description

Akkor Hotel permet aux utilisateurs de rechercher des hôtels, de s'enregistrer, de réserver des chambres, et de gérer leurs réservations. Le système de gestion des utilisateurs est intégré avec différentes rôles (utilisateur, administrateur).

### Fonctionnalités :
- Inscription et connexion des utilisateurs.
- Gestion des hôtels (affichage, réservation, annulation).
- Interface utilisateur réactive et moderne.
- Affichage des réservations de l'utilisateur.

## Prérequis

Avant de commencer, assurez-vous d'avoir installé ces outils :

- [Node.js](https://nodejs.org) version 14.x ou supérieure.
- [npm](https://www.npmjs.com) (généralement installé avec Node.js).
- [Git](https://git-scm.com) pour cloner le projet.

## Installation

1. Clonez ce dépôt sur votre machine locale :
    ```bash
    git clone https://github.com/yourusername/akkor-hotel-frontend.git
    ```

2. Allez dans le répertoire du projet :
    ```bash
    cd akka-hotel-frontend
    ```

3. Installez les dépendances :
    ```bash
    npm install
    ```

4. Lancez l'application en mode développement :
    ```bash
    npm start
    ```

    L'application sera accessible sur `http://localhost:3000`.

## Structure du projet

- **`src/`** : Contient le code source de l'application React.
  - **`components/`** : Composants réutilisables (ex. Navbar, Formulaires, etc.).
  - **`pages/`** : Pages principales (Home, Register, Login, Hotels, etc.).
  - **`features/`** : Réductions Redux et logique d'état global.
  - **`App.js`** : Le composant principal avec les routes.
  - **`index.js`** : Point d'entrée de l'application.

## Routes

L'application utilise **React Router** pour gérer les différentes pages :

- `/login` : Page de connexion.
- `/register` : Page d'inscription.
- `/hotels` : Affichage des hôtels disponibles.
- `/my-bookings` : Affichage des réservations de l'utilisateur.
- `/admin` : Page d'administration (accessible uniquement par un administrateur).

## Tests

L'application utilise **Jest** et **React Testing Library** pour les tests.

1. Pour exécuter les tests :
    ```bash
    npm test
    ```

2. Pour lancer les tests de manière continue en mode surveillance :
    ```bash
    npm run test:watch
    ```

## Lien vers la documentation

La documentation complète de l'API est disponible ici :  
[Documentation de l'API Akkor Hotel](https://linkversladocumentation.com)

## Contribuer

1. Forkez le projet.
2. Créez une branche pour votre fonctionnalité (`git checkout -b feature/ma-fonctionnalite`).
3. Commitez vos changements (`git commit -am 'Ajout d'une nouvelle fonctionnalité'`).
4. Poussez la branche (`git push origin feature/ma-fonctionnalite`).
5. Ouvrez une pull request.

## Auteurs

- **Votre Nom** - Développeur principal
- **Nom du co-développeur (si applicable)** - Co-développeur

## License

Ce projet est sous la licence MIT - voir le fichier [LICENSE](LICENSE) pour plus de détails.
