
# Meme-It Project
## Introduction
Meme-It is an engaging and entertaining online multiplayer game where players create, share, and vote on memes in real-time. The project's primary motivation is to build an interactive platform where users can showcase their creativity, humor, and quick thinking while enjoying a shared community experience.

## Technologies Used
Meme-It is developed using the following main technologies:

- [React.js](https://reactjs.org/docs/getting-started.html): Used for building the front-end of the application.
- [Springboot](https://spring.io/): Used to develop the backend server.
- [H2](https://www.h2database.com/html/main.html): Used to managed the database. 
- Rest: Used for real-time data transfer between the client and the server.
- [Bootstrap](https://react-bootstrap.github.io/): Used for designing responsive UI.
- [Github Projects](https://github.com/explore) - Project Management
- [Sonarcube](https://sonarcloud.io/): Used for code quality and test metrics.
- [Google Cloud](https://cloud.google.com/): Used for the online deployment.


## High-Level Components
Meme-It comprises three main components:

### Lobby: 
This is where users can join or create games. It also displays the list of available games.

### Game: 
This component manages the game logic and flow. It handles the creation, display, and voting of memes. The main React components involved here are the Lobby component, Game component, and the Chat component.

### Leaderboard: 
At the end of the game, the leaderboard is displayed showcasing player scores and the best and worst memes of the round.

## Low-Level Components
In a more low level overview the components and dependencies are structured in the following way. For every major component the individual component extensions are provided. On first mention of an individual component a brief explanation of it is given. 

**Helpers**: During the project we have created few helper functions which we were able to reuse to have less redundant code:
- formField: A selfmade text box component where different flags can be set. The logic is separated and the component is reusable.
- endpoints: all our endpoints listed as constants. Like this if an endpoint changes it is only required to be changed in one file.
- api: the helper function to call the rest endpoint
- getDomain: differenciates the backend calls based on the testing environment
- functions: a specific filter function used.

**Context**: Used to pass data along the different components when using the react history:
- index: stores the game data so that we prevent reloading unneccessairy components, making unneccessary calls and preventing from filling the local storage. 

**Home component** extends the following individual components:
- AnimatedBackground: Animated SVG from the background. 
- Notification: Notification component used to display alert messages as popup to the user.
- UsernameModal: The modal to enter the username before joining a game.
- Tutorial: The tutorial slides as a modal, showing how the game works.
- formField
- api

![Home Component](https://github.com/sopra-fs23-group-13/meme-it-client/assets/10813124/c063436b-6758-4ca9-87c5-3cf809509593)


**Lobby component** extends the following individual components: 
- LobbyCodeContainer: The element to display the lobby code. 
- LobbySettings: Adjustable settings for the game. 
- ActivePlayerList: All the players which joined the current game.
- Chat: The chat component which allows the user to get in touch with other players.
- LoadingButton: The loading button showing that the button is not ready to be clicked again. 
- Notification
- api

![Lobby Component](https://github.com/sopra-fs23-group-13/meme-it-client/assets/10813124/9fb1b75d-1911-4623-a2ad-2a9df43ebac1)


**Meme creation component** extends the following components: 
- BaseContainer: A layout container to display the content
- Spinner: The indicator that the page is still loading
- DraggableInput: The specific text input to resize, drag around and color. The text where the meme text gets into. 
- TimerProgressBar: The progressbar showing the remaining time until the next view appears.
- Chat
- index
- api

![Meme Creation Component](https://github.com/sopra-fs23-group-13/meme-it-client/assets/10813124/f27a7d6f-892e-4411-a8be-00a65361045d)


**Meme voting component** extends the following components: 
- CarouselItemContent: A special component which layouts the carousel items in the voting phase so that the sizing is done correctly. 
- BaseContainer
- Spinner
- DraggableInput
- TimerProgressBar
- Chat
- index
- api

![Meme Rating Component](https://github.com/sopra-fs23-group-13/meme-it-client/assets/10813124/6c93c50a-3b02-47c5-8be0-736ce8d213a9)

**Leaderboard component** extends the following components:
- AnimatedBarChart: The final leaderboard shows an animated barchart where the winner is shown
- ClickableMeme: A minimized meme, which can be enlargend. 
- CarouselItemContent
- Spinner
- DraggableInput
- TimerProgressBar
- Chat
- index
- api

![Leaderboard Component](https://github.com/sopra-fs23-group-13/meme-it-client/assets/10813124/1ce56138-b5b5-4fc5-b57e-e67531f0b2c1)


## Launch & Deployment
If you are a new developer joining the Meme-It team, follow these steps to get started:

0. Get your own deskop up to speed and install the required technology stack. For your local development environment, you will need Node.js. You can download it [here](https://nodejs.org). All other dependencies, including React, get installed with:
1. Clone the project repository.
2. Navigate into the project directory.
3. Run ```npm install``` to install all the necessary dependencies.
4. To start the development server, run ```npm run dev```.
5. The application should now be running on [http://localhost:3000](http://localhost:3000) (or another port specified in the console).

## Illustrations
The following section will provide screenshots of the application from each view. In Meme-It, users join a game lobby and wait for other players. Once the game begins, players are given a meme template and they must create a meme using their creativity. Once created, memes are shared with all players who then vote on the best ones. At the end of each round, a leaderboard is displayed showing player scores and best/worst memes of the round.

### Landing page

### Tutorial

### Lobby creation

### Meme creation

### Meme voting

### Leaderboard



## Roadmap
For developers wanting to contribute to Meme-It, here are a few potential features to consider:

- Implementing user accounts: So users can have a history of their games and scores.
- Adding a feature for players to upload their own meme templates.
- Improving the mobile views for a better mobile experience. 

## Authors and Acknowledgment
This project is maintained by
- Daniel Lutziger
- Pablo Tanner
- Henrik Nordgren
- Linda Weber
- Marc Schurr

We would like to thank Mete Polat for his support and guidance during the development of this project.

## License
Meme-It is licensed under the MIT License. You are free to use, modify, and distribute the code as per the terms of the license.
