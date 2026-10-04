interface Env {
  BEEHIIV_API_KEY: string;
  BEEHIIV_PUBLICATION_ID: string;
}

interface PagesContext {
  request: Request;
  env: Env;
}

const BEEHIIV_API_BASE = 'https://api.beehiiv.com/v2';

function jsonResponse(body: unknown, status: number): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export async function onRequestPost({ request, env }: PagesContext): Promise<Response> {
  try {
    const body = (await request.json()) as { email?: string };

    if (!body.email || !isValidEmail(body.email)) {
      return jsonResponse({ success: false, error: 'Adresse email invalide.' }, 400);
    }

    /* ── Récupération de l'abonné existant (créé par diagnostic-submit) ── */
    const getRes = await fetch(
      `${BEEHIIV_API_BASE}/publications/${env.BEEHIIV_PUBLICATION_ID}/subscriptions/by_email/${encodeURIComponent(body.email)}`,
      {
        headers: { Authorization: `Bearer ${env.BEEHIIV_API_KEY}` },
      }
    );

    if (!getRes.ok) {
      const detail = await getRes.text();
      console.error('[Beehiiv get subscription error]', getRes.status, detail);
      return jsonResponse({ success: false, error: 'Abonné introuvable.' }, 502);
    }

    const found = (await getRes.json()) as { data?: { id?: string } };
    const subscriptionId = found?.data?.id;

    if (!subscriptionId) {
      console.error('[Beehiiv get subscription] réponse sans id', found);
      return jsonResponse({ success: false, error: 'Réponse Beehiiv inattendue.' }, 502);
    }

    /* ── Tag "interet-conseiller" ── */
    const tagRes = await fetch(
      `${BEEHIIV_API_BASE}/publications/${env.BEEHIIV_PUBLICATION_ID}/subscriptions/${subscriptionId}/tags`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${env.BEEHIIV_API_KEY}`,
        },
        body: JSON.stringify({ tags: ['interet-conseiller'] }),
      }
    );

    if (!tagRes.ok) {
      const detail = await tagRes.text();
      console.error('[Beehiiv tag error]', tagRes.status, detail);
      return jsonResponse({ success: false, error: "Erreur lors de l'ajout du tag." }, 502);
    }

    return jsonResponse({ success: true }, 200);
  } catch (err) {
    console.error('[diagnostic-interet-conseiller error]', err);
    return jsonResponse({ success: false, error: 'Erreur serveur.' }, 500);
  }
}
