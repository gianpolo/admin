export function getTokenPayload(token) {
  if (!token) return null;
  try {
    return JSON.parse(atob(token.split(".")[1]));
  } catch {
    return null;
  }
}

export function isTokenExpired(token) {
  const payload = getTokenPayload(token);
  if (!payload || !payload.exp) return false;
  return payload.exp * 1000 < Date.now();
}

export function getUserName() {
  const token = localStorage.getItem("token");
  const payload = getTokenPayload(token);
  if (!payload) return "";
  return (
    payload.name ||
    payload.unique_name ||
    payload.given_name ||
    payload.sub ||
    ""
  );
}

export function getInitials(name) {
  if (!name) return "";
  return name
    .split(/\s+/)
    .map((n) => n[0])
    .join("")
    .toUpperCase();
}
