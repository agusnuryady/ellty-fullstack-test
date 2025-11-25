export function saveAuth(token: string) {
  if (typeof window !== 'undefined') {
    localStorage.setItem('token', token);
  }
}

export function getToken(): string | null {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('token');
  }
  return null; // fallback for server
}

export function logout() {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('token');
  }
}
