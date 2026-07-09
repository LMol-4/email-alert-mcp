import { timingSafeEqual } from 'crypto';

export function isAuthorized(request: Request): boolean {
  const key = process.env.AUTH_API_KEY;
  if (!key) return false;

  const header = request.headers.get('authorization');
  if (!header) return false;

  const provided = Buffer.from(header);
  const expected = Buffer.from(`Bearer ${key}`);
  // timingSafeEqual requires equal lengths; a length mismatch is already a
  // non-match, so short-circuit rather than leak length via a throw.
  if (provided.length !== expected.length) return false;
  return timingSafeEqual(provided, expected);
}
