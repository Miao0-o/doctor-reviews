const FAVORITES_KEY = 'doctor_favorites'
const REVIEWS_KEY = 'user_reviews'
const HISTORY_KEY = 'browse_history'

export function getFavorites() {
  return uni.getStorageSync(FAVORITES_KEY) || []
}

export function addFavorite(doctorId) {
  const favs = getFavorites()
  if (!favs.includes(doctorId)) {
    favs.push(doctorId)
    uni.setStorageSync(FAVORITES_KEY, favs)
  }
}

export function removeFavorite(doctorId) {
  const favs = getFavorites().filter(id => id !== doctorId)
  uni.setStorageSync(FAVORITES_KEY, favs)
}

export function isFavorite(doctorId) {
  return getFavorites().includes(doctorId)
}

export function getUserReviews() {
  return uni.getStorageSync(REVIEWS_KEY) || []
}

export function addUserReview(review) {
  const reviews = getUserReviews()
  reviews.unshift({ ...review, id: `ur${Date.now()}`, date: new Date().toISOString().slice(0, 10) })
  uni.setStorageSync(REVIEWS_KEY, reviews)
}

export function getHistory() {
  return uni.getStorageSync(HISTORY_KEY) || []
}

export function addHistory(doctorId) {
  const history = getHistory().filter(id => id !== doctorId)
  history.unshift(doctorId)
  uni.setStorageSync(HISTORY_KEY, history.slice(0, 20))
}
