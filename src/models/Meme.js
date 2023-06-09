class Meme {
    constructor(data = {}) {
        this.id = null;
        this.imageUrl = null;
        this.textBoxes = [];
        this.user = {
            id: null,
            name: null,
            executedSwaps: null
        }
        this.color = null;
        this.fontSize = null;
        this.rating = null;
        Object.assign(this, data);
    }
}
export default Meme;