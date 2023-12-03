class NotFoundError extends Error {
  constructor({ message }) {
    super();
    this.statusCode = 404;
    this.name = 'NotFoundError';
    this.message = message;
  }
}

module.exports = { NotFoundError };
