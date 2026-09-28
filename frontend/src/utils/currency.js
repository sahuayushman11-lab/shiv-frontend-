/**
 * Currency formatting utilities supporting multiple currencies with INR default
 */

export const CURRENCY_SYMBOLS = {
  INR: '₹',
  USD: '$',
  EUR: '€',
  GBP: '£'
};

/**
 * Format a number as currency
 * @param {number|string} amount
 * @param {string} currencyCode ('INR', 'USD', etc.)
 * @returns {string} e.g. "₹1,250.00"
 */
export function formatCurrency(amount, currencyCode = 'INR') {
  const num = Number(amount);
  if (isNaN(num)) return `${CURRENCY_SYMBOLS[currencyCode] || '₹'}0.00`;

  const symbol = CURRENCY_SYMBOLS[currencyCode] || '₹';

  // Format with commas and 2 decimals
  const formatted = Math.abs(num).toLocaleString('en-IN', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });

  return `${num < 0 ? '-' : ''}${symbol}${formatted}`;
}

export function getCurrencySymbol(currencyCode = 'INR') {
  return CURRENCY_SYMBOLS[currencyCode] || '₹';
}
