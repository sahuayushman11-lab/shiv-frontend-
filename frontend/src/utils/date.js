/**
 * Date formatting and range helpers
 */

export function formatDate(dateString, options = {}) {
  if (!dateString) return '';
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return dateString;

  const defaultOptions = {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  };

  return date.toLocaleDateString('en-US', { ...defaultOptions, ...options });
}

export function formatISODate(date) {
  const d = date ? new Date(date) : new Date();
  return d.toISOString().split('T')[0];
}

export function getRelativeTime(dateString) {
  if (!dateString) return '';
  const date = new Date(dateString);
  const now = new Date();
  const diffDays = Math.round((now - date) / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return 'Today';
  if (diffDays === 1) return 'Yesterday';
  if (diffDays < 7) return `${diffDays} days ago`;
  return formatDate(dateString);
}
