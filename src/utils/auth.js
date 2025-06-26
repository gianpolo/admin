export function getUserName() {
  const token = localStorage.getItem("token");
  if (!token) return "";
  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    return (
      payload.name ||
      payload.unique_name ||
      payload.given_name ||
      payload.sub ||
      ""
    );
  } catch {
    return "";
  }
}

export function getInitials(name) {
  if (!name) return "";
  return name
    .split(/\s+/)
    .map((n) => n[0])
    .join("")
    .toUpperCase();
}
