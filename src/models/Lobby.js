class Lobby {
    constructor(data = {}) {
        this.owner = null;
        this.name = null;
        this.code = null;
        this.lobbySetting = {
            isPublic: null,
            maxPlayers: null,
            maxRounds: null,
            memeChangeLimit: null,
            superLikeLimit: null,
            superDislikeLimit: null,
            roundDuration: null,
            ratingDuration: null,
        }
        this.players = [];
        this.messages = [];
        this.gameId = null;
        this.gameStartedAT = null;
        Object.assign(this, data);
    }
}
export default Lobby;