const moviesService = require("./movies.service");
const asyncErrorBoundary = require("../errors/asyncErrorBoundary");

async function movieExists(req, res, next) {
  const movie = await moviesService.read(req.params.movieId);

  if (movie) {
    res.locals.movie = movie;
    return next();
  }

  next({ status: 404, message: `Movie cannot be found.` });
}

async function list(req, res, next) {
  if (req.query.is_showing) {
    const data = await moviesService.listShowing();
    res.json({ data });
  } else {
    const data = await moviesService.list();
    res.json({ data });
  }
}

function read(req, res, next) {
  const { movie: data } = res.locals;
  res.json({ data });
}

async function readTheater(req, res, next) {
  const data = await moviesService.readTheater(req.params.movieId);

  if (data) res.json({ data });
  else next({ status: 404, message: `Movie cannot be found.` });
}

async function readReviews(req, res, next) {
  const data = await moviesService.readReviews(res.locals.movie.movie_id);

  res.json({ data });
}

module.exports = {
  list: asyncErrorBoundary(list),
  read: [asyncErrorBoundary(movieExists), read],
  readTheater: asyncErrorBoundary(readTheater),
  readReviews: [
    asyncErrorBoundary(movieExists),
    asyncErrorBoundary(readReviews),
  ],
};
