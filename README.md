# Meme-It Project
## Introduction
Meme-It is an engaging and entertaining online multiplayer game where players create, share, and vote on memes in real-time. The project's primary motivation is to build an interactive platform where users can showcase their creativity, humor, and quick thinking while enjoying a shared community experience.

## Technologies Used
Meme-It is developed using the following main technologies:

- React.js: Used for building the front-end of the application.
- Node.js: Used to develop the backend server.
- Rest: Used for real-time data transfer between the client and the server.
- Bootstrap: Used for designing responsive UI.
## High-Level Components
Meme-It comprises three main components:

### Lobby: This is where users can join or create games. It also displays the list of available games.

### Game: This component manages the game logic and flow. It handles the creation, display, and voting of memes. The main React components involved here are the Lobby component, Game component, and the Chat component.

### Leaderboard: At the end of the game, the leaderboard is displayed showcasing player scores and the best and worst memes of the round.

## Launch & Deployment
If you are a new developer joining the Meme-It team, follow these steps to get started:

1. Clone the project repository.
2. Navigate into the project directory.
3. Run ```npm install``` to install all the necessary dependencies.
4. To start the development server, run ```npm run dev```.
5. The application should now be running on [http://localhost:3000](http://localhost:3000) (or another port specified in the console).

## Illustrations
In Meme-It, users join a game lobby and wait for other players. Once the game begins, players are given a meme template and they must create a meme using their creativity. Once created, memes are shared with all players who then vote on the best ones. At the end of each round, a leaderboard is displayed showing player scores and best/worst memes of the round.

## Roadmap
For developers wanting to contribute to Meme-It, here are a few potential features to consider:

- Implementing user accounts: So users can have a history of their games and scores.
- Adding a feature for players to upload their own meme templates.

## Authors and Acknowledgment
This project is maintained by
- Daniel Lutziger
- Pablo Tanner
- Henrik Nordgren
- Linda Weber
- Marc Schurr

We would like to thank Mete for their support and guidance during the development of this project.

## License
Meme-It is licensed under the MIT License. You are free to use, modify, and distribute the code as per the terms of the license.
