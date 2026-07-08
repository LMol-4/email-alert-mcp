export function isAuthorized(request: Request): boolean {
  const authHeader = request.headers.get('authorization');
  return authHeader === `Bearer ${process.env.AUTH_API_KEY}`;
}
