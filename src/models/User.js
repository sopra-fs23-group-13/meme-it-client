/**
 * User model.
 */
class User {
  constructor(data = {}) {
    this.name = null;
    Object.assign(this, data);
  }
}
export default User;
