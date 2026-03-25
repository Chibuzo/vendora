export function getTrustScoreTone(score: number) {
  if (score >= 92) {
    return 'excellent';
  }

  if (score >= 80) {
    return 'strong';
  }

  return 'watch';
}

export function formatPayoutStatus(status: 'healthy' | 'review' | 'delayed') {
  switch (status) {
    case 'healthy':
      return 'Paystack payouts are clearing on schedule with no holds.';
    case 'review':
      return 'Settlement review required before the next payout run.';
    case 'delayed':
      return 'Payout delays detected. Escalate to platform operations.';
    default:
      return 'Unknown status';
  }
}
