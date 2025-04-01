const express = require('express');
const router = express.Router();
const movieController = require('../controllers/movieController'); // Importar controladores

router.get('/', movieController.getAllMovies);
router.get('/:id_or_name', movieController.getMovieByIdOrTitle);
router.get('/search/:title', movieController.searchMovieByTitle);
router.get('/search', movieController.searchMovies);

module.exports = router;
