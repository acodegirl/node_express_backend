const mongoose = require('mongoose');
const Joi = require('@hapi/joi');

const genreSchema = mongoose.Schema({
  name: { type: String, minLength: 4, maxLength: 255, required: true },
  genre: { type: String, maxLength: 10 }
});

const Genre = new mongoose.model('Genre', genreSchema);

function validateGenre(genre) {
  const schema = Joi.object({
    name: Joi.string()
      .min(4)
      .required(),
    genre: Joi.string().max(10)
  });
  return schema.validate(genre);
}

module.exports.Genre = Genre;
module.exports.validate = validateGenre;
