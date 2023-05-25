
# Meme-It Project
## Introduction
Meme-It is an engaging and entertaining online multiplayer game where players create, share, and vote on memes in real-time. The project's primary motivation is to build an interactive platform where users can showcase their creativity, humor, and quick thinking while enjoying a shared community experience.

## Technologies Used
Meme-It is developed using the following main technologies:

- [React.js](https://reactjs.org/docs/getting-started.html): Used for building the front-end of the application.
- [Springboot](https://spring.io/): Used to develop the backend server. A rest api is used for real-time data transfer between the client and the server.
- [H2](https://www.h2database.com/html/main.html): Used to managed the database. 
- [Bootstrap](https://react-bootstrap.github.io/): Used for designing responsive UI.
- [Github Projects](https://github.com/explore) - Project Management
- [Sonarcube](https://sonarcloud.io/): Used for code quality and test metrics.
- [Google Cloud](https://cloud.google.com/): Used for the online deployment.


## High-Level Components
Meme-It comprises three main components:

### Lobby: 
This is the entry point for users to join or create a game. The Lobby interacts with the Game component, setting up new games and adding players to existing ones. It provides an overview of ongoing games that users can join and the games they're currently part of. This is the component: [Lobby component](https://github.com/sopra-fs23-group-13/meme-it-client/blob/main/src/components/views/Lobby.js)

### Game: 
This is the heart of Meme-It. This component is responsible for the main gameplay where users create memes based on provided templates. It includes the logic for meme creation, timing, and transitions between rounds. It controls the game flow and maintains the state of the current game, including the meme templates and user submissions. Here is a link to the component: [Game component](https://github.com/sopra-fs23-group-13/meme-it-client/blob/main/src/components/views/Game.js)

### Game Voting
This component enables players to vote on the memes created during a round. It receives meme submissions from the Game component and displays them to the players for voting. The votes are then collected and sent back to the Game component to update scores and decide the winner for the round. Here is a link to the component: [Voting component](https://github.com/sopra-fs23-group-13/meme-it-client/blob/main/src/components/views/GameRating.js)

### Leaderboard
The Leaderboard component displays the scores of all players at the end of each round and at the end of the game. The component is also showcasing the best and worst memes of the round. It gets its data from the Game and the Voting component after each round and once the game ends. It plays a vital role in the competitive aspect of Meme-It, giving players insight into their standing in the game. The following is the link to the component: [Leaderboard component](https://github.com/sopra-fs23-group-13/meme-it-client/blob/main/src/components/views/Leaderboard.js).

### Chat
The Chat component facilitates real-time communication between players in a game. It enhances the multiplayer aspect of Meme-It, allowing players to comment, cheer, and react to the ongoing game. It works parallel to the Lobby, Game, Game Voting and the Leaderboard, so that all the players can always be in touch with each other. Here one can find the component: [Proximity Chat](https://github.com/sopra-fs23-group-13/meme-it-client/blob/main/src/components/ui/Chat.js)


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

## Testing

Testing is optional, and you can run the tests with ```npm run test```.
This launches the test runner in an interactive watch mode. See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

> For macOS user running into a 'fsevents' error: https://github.com/jest-community/vscode-jest/issues/423

## Build

Finally, ```npm run build``` builds the app for production to the `build` folder.
It correctly bundles React in production mode and optimizes the build for the best performance: the build is minified, and the filenames include hashes.

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

## Illustrations
The following section will provide screenshots of the application from each view. In Meme-It, users join a game lobby and wait for other players. Once the game begins, players are given a meme template and they must create a meme using their creativity. Once created, memes are shared with all players who then vote on the best ones. At the end of each round, a leaderboard is displayed showing player scores and best/worst memes of the round.

### Landing page
The page which will be seen by every user when the application is openend: 
![Landing page](https://github.com/sopra-fs23-group-13/meme-it-client/assets/10813124/6f769604-da96-4e88-ae3b-74ccfe86ef83)

### Tutorial
If one is curious how the app works, one can either start playing the game or check out the tutorial:
![Tutorial](https://github.com/sopra-fs23-group-13/meme-it-client/assets/10813124/e65489c3-6788-4bf6-b3f1-38dfd56b9cc1)

### Lobby creation
During the lobby creation the admin will be able to change the lobby settings and other users can contact the admin via chat:
![Lobby creation component](https://github.com/sopra-fs23-group-13/meme-it-client/assets/10813124/6b8b77d1-66ac-4354-8c1b-bf4b61b9adba)

### Meme creation
During the meme creation the user can adjust the memes to his/her preferences. This starts with dragging the textboxes around, changing the font color, changing the background color, changing the opacity of the background color. It is important to state that the border of the text box will be gone once the meme is submitted and is only there for readibility for the user:
![Meme Creation component](https://github.com/sopra-fs23-group-13/meme-it-client/assets/10813124/f88eebf3-eab5-40d8-9c30-927878502af3)


### Meme voting
During the voting phase users can judge the different memes and vote for their favourite ones:
![Meme Voting Component](https://github.com/sopra-fs23-group-13/meme-it-client/assets/10813124/164940e0-523d-4d8f-bcda-849600c44784)

### Leaderboard
The leaderboard shows the results at the end of each round and end of the game:
![Final Leaderboard Component](https://github.com/sopra-fs23-group-13/meme-it-client/assets/10813124/a2c22e0b-0854-4236-8d41-a3838c4f62c6)



## Roadmap
For developers wanting to contribute to Meme-It, here are a few potential features to consider:

- Implementing user accounts: So users can have a history of their games and scores.
- Adding a feature for players to upload their own meme templates.
- Improving the mobile views for a better mobile experience. 
- Switching the cloud provider.

## Cloud Issues on cold starts
One of the improvements is to switch the cloud provider. Google Cloud does not seem to function properly with the application. The loading time of the application is rather slow. This is due to cold starts. Once the Cloud VM shuts down, the start up is slow. Users can join a lobby, even though the instance is not yet properly started up. This leads to some crashes right once the game should start. We try to prevent this by having an always on instance, however, this does not properly fix the issue.  

## Authors and Acknowledgment
This project is maintained by
- Daniel Lutziger
- Pablo Tanner
- Henrik Nordgren
- Linda Weber
- Marc Schurr

We would like to thank Mete Polat for his support and guidance during the development of this project.

## License
Meme-It is licensed under the [Apache 2.0 License](https://github.com/sopra-fs23-group-13/meme-it-client/blob/main/LICENSE). A permissive license whose main conditions require preservation of copyright and license notices. Contributors provide an express grant of patent rights. Licensed works, modifications, and larger works may be distributed under different terms and without source code
