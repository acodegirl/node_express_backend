const asyncMiddleware = require('../middleware/async');
const Joi = require('@hapi/joi');
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');
const _ = require('lodash');
const { Genre, validate } = require('../model/genres');
const express = require('express');
const router = express.Router();

const films = [
  { id: 1, name: 'name1', genre: 'action' },
  { id: 2, name: 'name2', genre: 'drama' },
  { id: 3, name: 'name3', genre: 'science fiction' }
];

router.get(
  '/',
  asyncMiddleware(async (req, res) => {
    console.log('Inside handler function');
    try {
      console.log(Genre);
      const genres = await Genre.find().sort('name');
      console.log(`After db find ${genres}`);
    } catch (ex) {
      return res.status(500).send('Something happened');
    }
    res.send(genres);
  })
);

router.get('/:id', (req, res) => {
  const film = films.find(f => f.id === parseInt(req.params.id));
  if (!film) return res.status(404).send('Given genre id is not found');
  res.send(film);
});

router.post(
  '/',
  auth,
  asyncMiddleware(async (req, res) => {
    const { error } = validate(req.body);
    if (error) {
      console.log('Error is here *****', error.details[0].message);
      return res.status(400).send(error.details[0].message);
    }

    let genre = await Genre.findOne({ name: req.body.name });
    console.log('genre is', genre, req.body);
    if (genre) {
      return res.status(400).send('Genre already registered');
    }

    genre = new Genre(_.pick(req.body, ['name']));
    await genre.save();

    // const film = {
    //   id: films.length + 1,
    //   name: req.body.name,
    //   genre: req.body.genre
    // };
    // films.push(film);
    // console.log('films are,', films);
    res.send(genre);
  })
);

router.put('/:id', (req, res) => {
  const film = films.find(f => f.id === parseInt(req.params.id));
  console.log('film is', req.params.id);
  if (!film) return res.status(404).send('Genre Id is not found');
  console.log('Inside put');
  const { error } = validateFilm(req.body);
  if (error) {
    return res.status(400).send(error.details[0].message);
  }

  film.name = req.body.name;
  film.genre = req.body.genre;
  res.send(film);
});

router.delete(
  '/:id',
  [auth, admin],
  asyncMiddleware(async (req, res) => {
    const genre = await Genre.findByIdAndRemove(req.params.id);

    if (!genre)
      return res.status(404).send('The Genre with given id is not found');

    res.send(genre);
  })
);

function validateFilm(film) {
  console.log('Inside validate function');
  const schema = Joi.object({
    name: Joi.string()
      .min(4)
      .required(),
    genre: Joi.string()
      .max(10)
      .required()
  });

  return schema.validate(film);
}

module.exports = router;
