export async function fetchPortals() {
  const res = await fetch(`https://breaking-api.alpha.tv2.no/v1/public/portals?page=1`);

  if (!res.ok) {
    const errorDetails = await res.text();
    throw new Error(`Kunne ikke hente portaler. Status: ${res.status}, Detaljer: ${errorDetails}`);
  }

  const data = await res.json();
  return data.docs; // Returnerer listen over portaler
}

export async function fetchNews(portalId: string) {
  const isValidPortalId = /^[a-fA-F0-9]{24}$/.test(portalId);
  if (!isValidPortalId) {
    throw new Error("Ugyldig portalId. Må være en 24-tegns hex-streng.");
  }

  const res = await fetch(
    `https://breaking-api.alpha.tv2.no/v1/public/posts?page=1&limit=10&portalId=${portalId}`
  );

  if (!res.ok) {
    const errorDetails = await res.text();
    throw new Error(`Kunne ikke hente nyheter for portalen. Status: ${res.status}, Detaljer: ${errorDetails}`);
  }

  const data = await res.json();
  return data.docs; // Returnerer listen over nyhetsartikler
}