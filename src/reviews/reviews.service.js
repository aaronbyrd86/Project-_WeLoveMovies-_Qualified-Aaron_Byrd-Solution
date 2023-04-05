const knex = require("../db/connection");
const mapProperties = require("../utils/map-properties");
const reduceProperties = require("../utils/reduce-properties");

reduceCritic = reduceProperties("critic_id", {
    // critic_id: ["critic", null, "critic_id"],
    preferred_name: ["critic", null, "preferred_name"],
    surname: ["critic", null, "surname"],
    organization_name: ["critic", null, "organization_name"],
    // created_at: ["critic", null, "created_at"],
    // updated_at: ["critic", null, "updated_at"]
})

// reduceCritc = mapProperties()

function read (review_id) {
    return knex("reviews").where({ review_id}).first();
}

function destroy (review_id) {
    return knex("reviews").where({ "review_id": review_id}).del();
}

function update (updatedReview) {
    console.log(updatedReview)
    return knex("reviews")
    .where({ review_id: updatedReview.review_id })
    .update(updatedReview, "*")
    .then(()=>read(updatedReview.review_id))
    .then(async review => {
        const critic = await knex("critics").select("*").where({"critic_id": review.critic_id}).first()
        review.critic = critic
        return review;
    })
    
   
}

module.exports = {
    read,
    delete: destroy,
    update
}