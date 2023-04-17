class Lobby {
    constructor(data = {}) {
        this.owner = null;
        this.code = null;
        this.name = null;
        this.isPublic = null;
        this.maxPlayers = null;
        this.maxRounds = null;
        this.memeChangeLimit = null;
        this.superLikeLimit = null;
        this.superDislikeLimit = null;
        this.timeRoundLimit = null;
        this.timeVoteLimit = null;
        Object.assign(this, data);
    }
}
export default Lobby;