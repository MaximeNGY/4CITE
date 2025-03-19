# Akkor Hotel - Frontend

Welcome to the Akkor Hotel project! This project is an application for managing hotel reservations with a modern and responsive user interface. This repository contains the **Frontend** part of the application.

## Description

Akkor Hotel allows users to search for hotels, register, book rooms, and manage their reservations. The user management system supports different roles (user, administrator).

### Features:
- User registration and login.
- Hotel management (viewing, booking, cancellation).
- Modern and responsive user interface.
- Display of user reservations.

## Requirements

Before starting, make sure you have the following tools installed:

- [Node.js](https://nodejs.org) version 14.x or higher.
- [npm](https://www.npmjs.com) (usually installed with Node.js).
- [Git](https://git-scm.com) to clone the project.

## Installation

1. Clone this repository to your local machine:
    ```bash
    git clone https://github.com/MaximeNGY/4CITE.git
    ```

2. Navigate to the project directory:
    ```bash
    cd 4CITE
    ```

3. Install the dependencies:
    ```bash
    npm install
    ```

4. Start the application in development mode:
    ```bash
    npm start
    ```

    The application will be available at `http://localhost:3000`.

## Project Structure

- **`src/`** : Contains the source code of the React application.
  - **`__tests__/`** : Contains test files.
  - **`api/`** : API-related logic.
  - **`components/`** : Reusable components (e.g., Navbar, Forms, etc.).
  - **`features/`** : Redux slices and global state logic.
  - **`images/`** : Contains image assets.
  - **`pages/`** : Main pages (Home, Register, Login, Hotels, etc.).
  - **`App.js`** : The main component with routes.
  - **`index.js`** : Application entry point.

## Routes

The application uses **React Router** to manage different pages:

- `/home` : Home page.
- `/login` : Login page.
- `/register` : Registration page.
- `/hotels` : Displays available hotels.
- `/my-bookings` : Displays the user's bookings.
- `/admin` : Administration page (accessible only to administrators).

## Testing

The application uses **Jest** and **React Testing Library** for testing.

1. To run the tests:
    ```bash
    npm test
    ```

2. To run tests in watch mode:
    ```bash
    npm run test:watch
    ```

## Contributing

1. Fork the project.
2. Create a branch for your feature (`git checkout -b feature/my-feature`).
3. Commit your changes (`git commit -am 'Add new feature'`).
4. Push the branch (`git push origin feature/my-feature`).
5. Open a pull request.

## Authors

- **KIBANGU TSIMBA Chrinovic** - Lead Developer
