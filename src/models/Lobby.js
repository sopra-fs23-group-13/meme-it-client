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
            timeRoundLimit: null,
            timeVoteLimit: null,
        }
        Object.assign(this, data);
    }
}
export default Lobby;