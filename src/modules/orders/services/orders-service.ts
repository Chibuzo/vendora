export function formatOrderStatus(status: 'pending' | 'paid' | 'fulfilled') {
  return status.charAt(0).toUpperCase() + status.slice(1);
}
