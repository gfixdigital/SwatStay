// apps/web/data/reviews.ts
//
// Approved, post-trip reviews will be moderated in the Admin panel and
// only published reviews should ever appear here. This list stays empty
// until that connection exists — do not add placeholder or sample
// reviews, per the design rule against fake reviews.

export type ApprovedReview = {
  id: string;
  authorName: string;
  tripLabel: string;
  destination: string;
  rating: 1 | 2 | 3 | 4 | 5;
  quote: string;
  travelMonthLabel: string;
};

export const approvedReviews: ApprovedReview[] = [];
