const knex = require("../db/connection");
const reduceProperties = require("../utils/reduce-properties");

reduceCritic = reduceProperties("critic_id", {
  critic_id: ["critic", null, "critic_id"],
  preferred_name: ["critic", null, "preferred_name"],
  surname: ["critic", null, "surname"],
  organization_name: ["critic", null, "organization_name"],
  created_at: ["critic", null, "created_at"],
  updated_at: ["critic", null, "updated_at"],
});

function list() {
  return knex("movies").select(
    "movie_id as id",
    "title",
    "runtime_in_minutes",
    "rating",
    "description",
    "image_url"
  );
}

function listShowing() {
  return knex("movies as m")
    .join("movies_theaters as mt", "m.movie_id", "mt.movie_id")
    .select(
      "m.movie_id as id",
      "title",
      "runtime_in_minutes",
      "rating",
      "description",
      "image_url"
    )
    .where({ "mt.is_showing": true })
    .groupBy("m.movie_id");
}

// function read(movie_id) {
//   return knex("movies")
//     .select(
//       "movie_id as id",
//       "title",
//       "runtime_in_minutes",
//       "rating",
//       "description",
//       "image_url"
//     )
//     .where({ movie_id: movie_id })
//     .first();
// }

function read(movie_id) {
    return knex("movies")
      .select(
        "movies.*"
      )
      .where({ movie_id: movie_id })
      .first();
  }

function readTheater(movie_id) {
  return knex("movies as m")
    .join("movies_theaters as mt", "m.movie_id", "mt.movie_id")
    .join("theaters as t", "mt.theater_id", "t.theater_id")
    .select("t.*", "mt.is_showing", "m.movie_id")
    .where({ "m.movie_id": movie_id });
}

function readReviews(movie_id) {
  return knex("reviews as r")
    // .join("reviews as r", "m.movie_id", "r.movie_id")
    .join("critics as c", "r.critic_id", "c.critic_id")
    .select("*")
    .where({ "r.movie_id": movie_id })
    .then(reduceCritic)
    .then(reviews => reviews.map(review => ({
        ...review, critic: review.critic[0]
    })))
}

module.exports = {
  list,
  listShowing,
  read,
  readTheater,
  readReviews,
};
