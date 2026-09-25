export function formatPrice(amount, currency = '₹') {
  if (amount === undefined || amount === null || isNaN(amount)) return null;
  return `${currency}${Number(amount).toLocaleString('en-IN')}`;
}

export function formatDate(dateString) {
  if (!dateString) return '';
  try {
    const d = new Date(dateString);
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  } catch {
    return dateString;
  }
}
