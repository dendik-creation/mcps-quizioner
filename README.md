# MCPS (Mathematic Creative Problem Solving)

MCPS is a web-based mathematical reasoning quiz application. Participants are asked to work on and answer questions correctly within a specified time limit. The available answer types are checkboxes and fill-in-the-blank.

## Features

-   Quiz App
-   Scoring

## Getting Started

1. Clone the repository:
    ```bash
    git clone https://github.com/dendik-creation/mcps-quizioner.git
    ```
2. Install PHP dependencies:
    ```bash
    cd mcps-quizioner
    composer install
    ```
3. Copy the example environment file and set your configuration:
    ```bash
    cp .env.example .env
    ```
4. Generate the application key:
    ```bash
    php artisan key:generate
    ```
5. Set up your database in the `.env` file, then run migrations:
    ```bash
    php artisan migrate
    ```
6. Install frontend dependencies:
    ```bash
    npm install
    ```
7. Start the development server:
    ```bash
    php artisan serve && npm run dev
    ```
