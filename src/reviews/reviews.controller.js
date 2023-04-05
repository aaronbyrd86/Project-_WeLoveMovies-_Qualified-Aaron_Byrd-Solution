const reviewsService = require("./reviews.service");
const asyncErrorBoundary = require("../errors/asyncErrorBoundary");

async function reviewExists(req, res, next) {
  const review = await reviewsService.read(req.params.reviewId);

  if (review) {
    res.locals.review = review;
    return next();
  }

  next({ status: 404, message: `Review cannot be found.` });
}

async function read(req, res, next) {
  const data = res.locals.review;

  res.json({ data });
}

async function destroy(req, res, next) {
  const { review } = res.locals;

  await reviewsService.delete(review.review_id);

  res.sendStatus(204);
}

async function update(req, res, next) {
    console.log(req.body)
  const updatedReview = {
    ...req.body.data,
    review_id: res.locals.review.review_id,
  };

  const data = await reviewsService.update(updatedReview);

  res.json({ data });
}

module.exports = {
  read: [asyncErrorBoundary(reviewExists), read],
  delete: [asyncErrorBoundary(reviewExists), asyncErrorBoundary(destroy)],
  update: [asyncErrorBoundary(reviewExists), asyncErrorBoundary(update)],
};
