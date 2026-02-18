export function getOAuthCallbackURL(): string {
  return `${window.location.origin}/auth/callback`;
}
