export function setAuthToken(token) {
  if (typeof window === 'undefined') return;
  localStorage.setItem('dealflow_token', token);
  document.cookie = `token=${token}; path=/; max-age=${60 * 60 * 24 * 7}`;
}

export function getAuthToken() {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('dealflow_token');
}

export function clearAuthToken() {
  if (typeof window === 'undefined') return;
  localStorage.removeItem('dealflow_token');
  document.cookie = 'token=; path=/; max-age=0';
}
