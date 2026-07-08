export function isAuthorized(request: Request): boolean {
  const key = process.env.AUTH_API_KEY;
  if (!key) return false;
  return request.headers.get('authorization') === `Bearer ${key}`;
}
