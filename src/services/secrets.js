export async function getSecrets() {
  try {
    const response = await fetch("/secrets.json");
    const data = await response.json();
    return data.secrets;
  } catch (error) {
    console.error("Error loading secrets:", error);
    return [];
  }
}

export function getSecretById(secrets, id) {
  return secrets.find((secret) => secret.id === id);
}
