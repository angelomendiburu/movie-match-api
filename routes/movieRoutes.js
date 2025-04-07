const express = require('express');
const router = express.Router();
const movieController = require('../controllers/movieController'); // Import controllers

router.get('/', movieController.getAllMovies); // Route to get all movies
router.get('/:id_or_name', movieController.getMovieByIdOrTitle);
router.get('/search/:title', movieController.searchMovieByTitle);
router.get('/search', movieController.searchMoviesByCriteria);

module.exports = router;
