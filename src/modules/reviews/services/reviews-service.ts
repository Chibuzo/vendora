export function getAverageRating(reviews: Array<{ rating: number }>) {
  if (!reviews.length) {
    return 0;
  }

  return reviews.reduce((total, review) => total + review.rating, 0) / reviews.length;
}
