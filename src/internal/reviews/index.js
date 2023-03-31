import { del, post, get } from "../request"

function activateYotpoApiKey(data) {
  return post("yotpo/api", data)
}

function deactivateYotpoApiKey(data) {
  return del("yotpo/api", data)
}

function getYotpoReviews() {
  return get("yotpo/reviews")
}

function createYotpoReview(data) {
  return post("yotpo/reviews", data)
}

function getYotpoReviewsByProductId(productId) {
  return post("yotpo/reviews/product", productId)
}

export {
  activateYotpoApiKey,
  deactivateYotpoApiKey,
  getYotpoReviews,
  getYotpoReviewsByProductId,
  createYotpoReview,
}
