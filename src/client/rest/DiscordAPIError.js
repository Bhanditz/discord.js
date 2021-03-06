/**
 * Represents an error from the Discord API.
 */
class DiscordAPIError extends Error {
  constructor(error) {
    super();
    const flattened = error.errors ? `\n${this.constructor.flattenErrors(error.errors).join('\n')}` : '';
    this.name = 'DiscordAPIError';
    this.message = `${error.message}${flattened}`;

    /**
     * HTTP error code returned by Discord
     * @type {number}
     */
    this.code = error.code;
  }

  /**
   * Flattens an errors object returned from the API into an array.
   * @param {Object} obj Discord errors object
   * @param {string} [key] Used internally to determine key names of nested fields
   * @returns {string[]}
   */
  static flattenErrors(obj, key = '') {
    let messages = [];

    for (const [k, v] of Object.entries(obj)) {
      const newKey = key ? isNaN(k) ? `${key}.${k}` : `${key}[${k}]` : k;

      if (v._errors) {
        messages.push(`${newKey}: ${v._errors.map(e => e.message).join(' ')}`);
      } else if (v.code || v.message) {
        messages.push(`${v.code ? `${v.code}: ` : ''}${v.message}`.trim());
      } else {
        messages = messages.concat(this.flattenErrors(v, newKey));
      }
    }

    return messages;
  }
}

module.exports = DiscordAPIError;
