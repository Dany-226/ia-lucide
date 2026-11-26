"""Fonctions communes aux scripts du diagnostic v2 (« Où passe la ligne »).

Utilisé par scripts/import-oit.py et scripts/import-relecture.py.
Spécification : docs/spec-diagnostic-exposition-v2.md (§2 à §4).
"""
import csv
import io
import json
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
EXCEL = ROOT / "data" / "source" / "Final_Scores_ISCO08_Gmyrek_et_al_2025.xlsx"
POSTES = ROOT / "data" / "metiers" / "postes.json"
METIERS_DIR = ROOT / "data" / "metiers"
RELECTURE_CSV = METIERS_DIR / "relecture.csv"

SOURCE = "Gmyrek et al. 2025, ILO WP 140, CC BY 4.0"
STATUTS = ("propose", "valide", "rejete")
BANDES = ("eleve", "partiel", "faible")

# Le fichier de l'OIT contient des apostrophes mal encodées (UTF-8 relu en Mac Roman) :
# « ‚Äô » pour « ’ » (62 tâches), « ¬¥ » pour « ´ » (1 tâche). On répare uniquement ces
# séquences ; le reste du texte est recopié tel quel. La même table est dans
# scripts/check-metiers.js : les deux doivent rester identiques.
MOJIBAKE = (("‚Äô", "’"), ("¬¥", "´"))

CSV_COLUMNS = [
    "domaine", "poste", "ISCO", "task_id", "texte_en", "libelle_fr",
    "score", "bande", "retenue", "raison_exclusion", "adaptation", "raison_adaptation", "statut",
]


def repair_text(s):
    s = str(s).strip()
    for bad, good in MOJIBAKE:
        s = s.replace(bad, good)
    return s


def round_score(x):
    """Scores de tâche à 4 décimales (le fichier en a au plus 4, plus le bruit flottant)."""
    return round(float(x) + 0.0, 4)


def round2(x):
    return round(float(x) + 0.0, 2)


def bande(score):
    """Adaptation ialucide (spec §2.3) : mêmes bornes 0,4 et 0,6 que l'OIT, appliquées aux tâches."""
    if score >= 0.6:
        return "eleve"
    if score >= 0.4:
        return "partiel"
    return "faible"


def categorie_oit(mu, sd):
    """Seuils du tableau 5 de l'OIT (spec §2.2), appliqués aux μ et σ publiés (2 décimales)."""
    if mu >= 0.6 and mu - sd >= 0.5:
        return "Exposed: Gradient 4"
    if 0.5 <= mu < 0.6 and mu + sd >= 0.5:
        return "Exposed: Gradient 3"
    if 0.4 <= mu < 0.5 and mu + sd >= 0.5:
        return "Exposed: Gradient 2"
    if mu < 0.4 and mu + sd >= 0.5:
        return "Exposed: Gradient 1"
    if mu < 0.5 and mu + sd > 0.4:
        return "Minimal Exposure"
    return "Not Exposed"


def load_postes():
    with open(POSTES, encoding="utf-8") as f:
        return json.load(f)


def poste_path(domaine, poste):
    return METIERS_DIR / domaine / (poste + ".json")


def read_json(path):
    with open(path, encoding="utf-8") as f:
        return json.load(f)


def write_json(path, data):
    path.parent.mkdir(parents=True, exist_ok=True)
    with open(path, "w", encoding="utf-8") as f:
        json.dump(data, f, ensure_ascii=False, indent=2)
        f.write("\n")


def fmt_score(x):
    return ("%.4f" % x).rstrip("0").rstrip(".")


def export_relecture(postes_cfg, path=RELECTURE_CSV):
    """Tableau de relecture : une ligne par tâche, dans l'ordre de postes.json.

    Point-virgule et BOM UTF-8 pour s'ouvrir correctement dans Excel et Numbers en français.
    """
    buf = io.StringIO()
    w = csv.writer(buf, delimiter=";", lineterminator="\n")
    w.writerow(CSV_COLUMNS)
    n = 0
    for p in postes_cfg["postes"]:
        doc = read_json(poste_path(p["domaine"], p["poste"]))
        for t in doc["taches"]:
            w.writerow([
                doc["domaine"], doc["poste"], doc["isco08"], t["task_id"], t["texte_en"],
                t["libelle_fr"] or "", fmt_score(t["score_2025"]), t["bande"],
                "oui" if t["retenue"] else "non", t["raison_exclusion"] or "",
                "oui" if t["adaptation"] else "non", t["raison_adaptation"] or "", t["statut"],
            ])
            n += 1
    with open(path, "w", encoding="utf-8-sig", newline="") as f:
        f.write(buf.getvalue())
    return n
