import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export function formatPercent(value) {
  return `${Number(value).toFixed(1)}%`;
}

export function buildApiResponse(data, message = 'Success', meta = {}) {
  return { success: true, data, message, meta };
}

export function buildApiError(code, message, details = []) {
  return { success: false, error: { code, message, details } };
}
