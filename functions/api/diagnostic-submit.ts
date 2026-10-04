interface DiagnosticSubmitBody {
  email: string;
  poste?: string;
  secteur?: string;
  inquietude?: string;
  anciennete: number;
  procedural: number;
  decision: number;
  relationnel: number;
  encadrement: number;
  secteur_modif: number;
  score_total: number;
}

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

function scoreExpositionLabel(total: number): string {
  if (total <= 10) return 'faible';
  if (total <= 22) return 'modérée';
  return 'élevée';
}

export async function onRequestPost({ request, env }: PagesContext): Promise<Response> {
  try {
    const body = (await request.json()) as Partial<DiagnosticSubmitBody>;

    if (!body.email || !isValidEmail(body.email)) {
      return jsonResponse({ success: false, error: 'Adresse email invalide.' }, 400);
    }
    if (typeof body.score_total !== 'number') {
      return jsonResponse({ success: false, error: 'score_total manquant ou invalide.' }, 400);
    }

    const scoreExposition = scoreExpositionLabel(body.score_total);

    /* ── Création / mise à jour de l'abonné Beehiiv ── */
    const createRes = await fetch(
      `${BEEHIIV_API_BASE}/publications/${env.BEEHIIV_PUBLICATION_ID}/subscriptions`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${env.BEEHIIV_API_KEY}`,
        },
        body: JSON.stringify({
          email: body.email,
          reactivate_existing: true,
          custom_fields: [
            { name: 'score_exposition', value: scoreExposition },
            { name: 'score_anciennete', value: body.anciennete ?? 0 },
            { name: 'score_procedural', value: body.procedural ?? 0 },
            { name: 'score_decision', value: body.decision ?? 0 },
            { name: 'score_relationnel', value: body.relationnel ?? 0 },
            { name: 'score_encadrement', value: body.encadrement ?? 0 },
            { name: 'score_secteur', value: body.secteur_modif ?? 0 },
            { name: 'poste', value: body.poste ?? '' },
            { name: 'secteur', value: body.secteur ?? '' },
            { name: 'inquietude', value: body.inquietude ?? '' },
          ],
        }),
      }
    );

    if (!createRes.ok) {
      const detail = await createRes.text();
      console.error('[Beehiiv create subscription error]', createRes.status, detail);
      return jsonResponse({ success: false, error: "Erreur lors de l'inscription." }, 502);
    }

    const created = (await createRes.json()) as { data?: { id?: string } };
    const subscriptionId = created?.data?.id;

    if (!subscriptionId) {
      console.error('[Beehiiv create subscription] réponse sans id', created);
      return jsonResponse({ success: false, error: 'Réponse Beehiiv inattendue.' }, 502);
    }

    /* ── Tag "diagnostic-complete" (endpoint distinct, nécessite l'id de l'abonné) ── */
    const tagRes = await fetch(
      `${BEEHIIV_API_BASE}/publications/${env.BEEHIIV_PUBLICATION_ID}/subscriptions/${subscriptionId}/tags`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${env.BEEHIIV_API_KEY}`,
        },
        body: JSON.stringify({ tags: ['diagnostic-complete'] }),
      }
    );

    if (!tagRes.ok) {
      const detail = await tagRes.text();
      console.error('[Beehiiv tag error]', tagRes.status, detail);
      return jsonResponse({ success: false, error: "Abonné créé mais l'ajout du tag a échoué." }, 502);
    }

    return jsonResponse({ success: true }, 200);
  } catch (err) {
    console.error('[diagnostic-submit error]', err);
    return jsonResponse({ success: false, error: 'Erreur serveur.' }, 500);
  }
}
