// Inscription depuis le diagnostic v2 « Où passe la ligne » (spec §8.1 et §8.2).
//
// Deux cas :
// - type « resultat » : inscription après le résultat. Champs personnalisés Beehiiv
//   metier_domaine, metier_poste, isco08, categorie_oit, part_potentiel_eleve, statut,
//   date_diagnostic ; tags metier-<domaine> et diagnostic-v2.
// - type « attente » : « Prévenez-moi quand mon métier sera disponible » ; tag attente-<saisie>.
//
// Les tâches cochées ne sont jamais transmises : la fonction ne recopie que les champs listés
// ici, quel que soit le contenu de la requête. Rien n'est stocké en dehors de Beehiiv.
// Le consentement (case non précochée) est obligatoire. Les champs personnalisés doivent
// exister dans Beehiiv (Settings → Custom fields) sous ces noms exacts.
// L'ancien tag interet-conseiller n'est plus attribué (option conseiller supprimée).

interface Env {
  BEEHIIV_API_KEY: string;
  BEEHIIV_PUBLICATION_ID: string;
}

interface PagesContext {
  request: Request;
  env: Env;
}

const BEEHIIV_API_BASE = 'https://api.beehiiv.com/v2';

const CATEGORIES = [
  'Exposed: Gradient 4',
  'Exposed: Gradient 3',
  'Exposed: Gradient 2',
  'Exposed: Gradient 1',
  'Minimal Exposure',
  'Not Exposed',
];
const STATUTS = ['', 'salarie', 'independant', 'activite-a-cote', 'recherche'];
const SLUG = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

function jsonResponse(body: unknown, status: number): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}

function isValidEmail(email: unknown): email is string {
  return typeof email === 'string' && email.length <= 254 && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

/** « Chef de rang » → « chef-de-rang », 40 caractères au plus. */
function slugify(s: string): string {
  return s
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 40)
    .replace(/-+$/g, '');
}

type CustomField = { name: string; value: string | number };

function champsResultat(b: Record<string, unknown>): { fields: CustomField[]; tags: string[] } | string {
  const { domaine, poste, isco08, categorie_oit, part_potentiel_eleve, statut, date_diagnostic } = b;
  if (typeof domaine !== 'string' || !SLUG.test(domaine) || domaine.length > 40) return 'Domaine invalide.';
  if (typeof poste !== 'string' || !SLUG.test(poste) || poste.length > 60) return 'Poste invalide.';
  if (typeof isco08 !== 'string' || !/^\d{4}$/.test(isco08)) return 'Code ISCO invalide.';
  if (typeof categorie_oit !== 'string' || !CATEGORIES.includes(categorie_oit)) return 'Catégorie invalide.';
  const part = part_potentiel_eleve;
  if (part !== null && (typeof part !== 'number' || !Number.isInteger(part) || part < 0 || part > 100 || part % 5 !== 0)) {
    return 'Part à potentiel élevé invalide.';
  }
  const st = typeof statut === 'string' ? statut : '';
  if (!STATUTS.includes(st)) return 'Statut invalide.';
  if (typeof date_diagnostic !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(date_diagnostic)) return 'Date invalide.';

  const fields: CustomField[] = [
    { name: 'metier_domaine', value: domaine },
    { name: 'metier_poste', value: poste },
    { name: 'isco08', value: isco08 },
    { name: 'categorie_oit', value: categorie_oit },
    { name: 'statut', value: st },
    { name: 'date_diagnostic', value: date_diagnostic },
  ];
  // Moins de 2 tâches avec du temps : pas de répartition, donc pas de part transmise.
  if (typeof part === 'number') fields.push({ name: 'part_potentiel_eleve', value: part });
  return { fields, tags: [`metier-${domaine}`, 'diagnostic-v2'] };
}

async function beehiiv(env: Env, pathSuffix: string, body: unknown): Promise<Response> {
  return fetch(`${BEEHIIV_API_BASE}/publications/${env.BEEHIIV_PUBLICATION_ID}${pathSuffix}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${env.BEEHIIV_API_KEY}` },
    body: JSON.stringify(body),
  });
}

export async function onRequestPost({ request, env }: PagesContext): Promise<Response> {
  try {
    const body = (await request.json().catch(() => null)) as Record<string, unknown> | null;
    if (!body || typeof body !== 'object') return jsonResponse({ success: false, error: 'Requête invalide.' }, 400);
    if (!isValidEmail(body.email)) return jsonResponse({ success: false, error: 'Adresse e-mail invalide.' }, 400);
    if (body.consentement !== true) {
      return jsonResponse({ success: false, error: 'Le consentement est nécessaire pour vous inscrire.' }, 400);
    }

    let fields: CustomField[] = [];
    let tags: string[];
    if (body.type === 'resultat') {
      const r = champsResultat(body);
      if (typeof r === 'string') return jsonResponse({ success: false, error: r }, 400);
      ({ fields, tags } = r);
    } else if (body.type === 'attente') {
      const saisie = typeof body.saisie === 'string' ? slugify(body.saisie) : '';
      if (!saisie) return jsonResponse({ success: false, error: 'Indiquez votre métier.' }, 400);
      tags = [`attente-${saisie}`];
    } else {
      return jsonResponse({ success: false, error: 'Type de demande inconnu.' }, 400);
    }

    /* ── Création ou mise à jour de l'abonné ── */
    const createRes = await beehiiv(env, '/subscriptions', {
      email: body.email,
      reactivate_existing: true,
      utm_source: 'diagnostic-exposition-ia',
      ...(fields.length ? { custom_fields: fields } : {}),
    });
    if (!createRes.ok) {
      console.error('[Beehiiv create subscription error]', createRes.status, await createRes.text());
      return jsonResponse({ success: false, error: "Erreur lors de l'inscription." }, 502);
    }
    const created = (await createRes.json()) as { data?: { id?: string } };
    const subscriptionId = created?.data?.id;
    if (!subscriptionId) {
      console.error('[Beehiiv create subscription] réponse sans id', created);
      return jsonResponse({ success: false, error: 'Réponse Beehiiv inattendue.' }, 502);
    }

    /* ── Tags (endpoint distinct, nécessite l'id de l'abonné) ── */
    const tagRes = await beehiiv(env, `/subscriptions/${subscriptionId}/tags`, { tags });
    if (!tagRes.ok) {
      console.error('[Beehiiv tag error]', tagRes.status, await tagRes.text());
      return jsonResponse({ success: false, error: "Inscription faite, mais l'ajout du tag a échoué." }, 502);
    }

    return jsonResponse({ success: true }, 200);
  } catch (err) {
    console.error('[diagnostic-submit error]', err);
    return jsonResponse({ success: false, error: 'Erreur serveur.' }, 500);
  }
}
