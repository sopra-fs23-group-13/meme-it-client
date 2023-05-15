class Player {
    constructor(data = {}) {
        this.name = null;
        this.id = null;
        this.score = null;
        Object.assign(this, data);
    }
}
export default Player;
