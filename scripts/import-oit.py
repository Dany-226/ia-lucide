#!/usr/bin/env python3
"""Import des données de l'OIT pour le diagnostic v2 (spec §4).

Lit data/source/Final_Scores_ISCO08_Gmyrek_et_al_2025.xlsx et data/metiers/postes.json,
puis écrit un JSON par poste dans data/metiers/<domaine>/<poste>.json et le tableau
data/metiers/relecture.csv.

- score_2025, oit.* et bande sont recopiés ou calculés ici, jamais saisis à la main.
- Pour chaque poste, le script vérifie que μ, σ et la catégorie du fichier correspondent au
  tableau de la spec (valeurs « attendu » de postes.json), que μ et σ recalculés à partir
  des tâches redonnent les valeurs publiées, et que les seuils de l'OIT redonnent la
  catégorie publiée. Au moindre écart, il s'arrête sans rien écrire.
- Les codes ISCO associés à un poste (isco_associes dans postes.json) passent les mêmes
  vérifications ; seules leurs valeurs OIT sont recopiées. note_methode vient de postes.json.
- Les champs éditoriaux d'un JSON existant (libelle_fr, retenue, raison_exclusion,
  adaptation, raison_adaptation, statut, valide_le, rome, publie) sont conservés. Si le texte anglais d'une tâche a changé dans une
  nouvelle version des données, la tâche repasse en statut « propose ».

Usage : python3 scripts/import-oit.py [--check]
  --check : vérifie seulement, n'écrit rien.
Dépendance : openpyxl (pip3 install openpyxl).
"""
import datetime
import statistics
import sys

from openpyxl import load_workbook

from metiers_common import (
    EXCEL, SOURCE, bande, categorie_oit, export_relecture, load_postes, poste_path,
    read_json, repair_text, round2, round_score, write_json,
)

COLS = ("ISCO_08", "Title", "taskID", "Task_ISCO", "score_2025",
        "mean_score_2025", "SD_2025", "potential25")
TOL = 0.005 + 1e-9  # μ et σ publiés sont arrondis à 2 décimales


def read_excel():
    wb = load_workbook(EXCEL, read_only=True, data_only=True)
    ws = wb.worksheets[0]
    rows = ws.iter_rows(values_only=True)
    header = list(next(rows))
    missing = [c for c in COLS if c not in header]
    if missing:
        sys.exit("Colonnes absentes du fichier de l'OIT : %s" % ", ".join(missing))
    idx = {c: header.index(c) for c in COLS}
    occ = {}
    for r in rows:
        if r[idx["ISCO_08"]] is None:
            continue
        code = str(r[idx["ISCO_08"]]).strip()
        occ.setdefault(code, []).append({c: r[i] for c, i in idx.items()})
    return occ


def check_poste(p, rows):
    """Renvoie (erreurs, bloc oit, taches) pour un poste."""
    errs = []
    code = p["isco08"]
    tag = "%s/%s (ISCO %s)" % (p["domaine"], p["poste"], code)
    if not rows:
        return ["%s : code absent du fichier" % tag], None, None
    first = rows[0]
    for c in ("Title", "mean_score_2025", "SD_2025", "potential25"):
        if len({str(r[c]) for r in rows}) != 1:
            errs.append("%s : %s n'est pas constant sur les tâches" % (tag, c))
    mu, sd, cat = round2(first["mean_score_2025"]), round2(first["SD_2025"]), str(first["potential25"]).strip()
    att = p["attendu"]
    if mu != round2(att["mu"]):
        errs.append("%s : μ du fichier %.2f, spec %.2f" % (tag, mu, att["mu"]))
    if sd != round2(att["sd"]):
        errs.append("%s : σ du fichier %.2f, spec %.2f" % (tag, sd, att["sd"]))
    if cat != att["categorie"]:
        errs.append("%s : catégorie du fichier « %s », spec « %s »" % (tag, cat, att["categorie"]))
    if categorie_oit(mu, sd) != cat:
        errs.append("%s : les seuils du tableau 5 donnent « %s », le fichier « %s »"
                    % (tag, categorie_oit(mu, sd), cat))

    taches = []
    ids = set()
    for r in sorted(rows, key=lambda r: int(r["taskID"])):
        tid = int(r["taskID"])
        if tid in ids:
            errs.append("%s : taskID %d en double" % (tag, tid))
        ids.add(tid)
        s = round_score(r["score_2025"])
        if not 0 <= s <= 1:
            errs.append("%s : score hors de [0, 1] pour la tâche %d" % (tag, tid))
        taches.append({"task_id": tid, "texte_en": repair_text(r["Task_ISCO"]), "score_2025": s, "bande": bande(s)})
    scores = [t["score_2025"] for t in taches]
    if len(scores) >= 2:
        mu_calc, sd_calc = statistics.mean(scores), statistics.stdev(scores)
        if abs(mu_calc - mu) > TOL:
            errs.append("%s : μ recalculé %.4f, publié %.2f" % (tag, mu_calc, mu))
        if abs(sd_calc - sd) > TOL:
            errs.append("%s : σ recalculé %.4f (écart-type d'échantillon), publié %.2f" % (tag, sd_calc, sd))
    oit = {"mu": mu, "sd": sd, "categorie": cat}
    return errs, {"titre": repair_text(first["Title"]), "oit": oit}, taches


def merge(p, info, taches, today):
    path = poste_path(p["domaine"], p["poste"])
    old = read_json(path) if path.exists() else None
    old_t = {t["task_id"]: t for t in (old or {}).get("taches", [])}
    warnings = []
    out_t = []
    for t in taches:
        prev = old_t.pop(t["task_id"], None)
        ed = {"libelle_fr": None, "retenue": True, "raison_exclusion": None, "adaptation": False,
              "raison_adaptation": None, "statut": "propose", "valide_le": None}
        if prev:
            for k in ed:
                ed[k] = prev.get(k, ed[k])
            if prev.get("texte_en") != t["texte_en"]:
                warnings.append("%s tâche %d : texte anglais modifié, statut remis à « propose »"
                                % (p["poste"], t["task_id"]))
                ed["statut"], ed["valide_le"] = "propose", None
        out_t.append({
            "task_id": t["task_id"], "texte_en": t["texte_en"], "libelle_fr": ed["libelle_fr"],
            "score_2025": t["score_2025"], "bande": t["bande"], "retenue": ed["retenue"],
            "raison_exclusion": ed["raison_exclusion"], "adaptation": ed["adaptation"],
            "raison_adaptation": ed["raison_adaptation"], "statut": ed["statut"], "valide_le": ed["valide_le"],
        })
    for tid in old_t:
        warnings.append("%s tâche %s : absente de la nouvelle version des données, supprimée" % (p["poste"], tid))
    doc = {
        "domaine": p["domaine"],
        "poste": p["poste"],
        "libelle": p["libelle"],
        "isco08": p["isco08"],
        "isco_titre": info["titre"],
        "oit": info["oit"],
        "note_methode": p.get("note_methode"),
        "isco_associes": info["isco_associes"],
        "rome": (old or {}).get("rome") or {"code": "À RELEVER", "libelle": "À RELEVER"},
        "publie": bool((old or {}).get("publie", False)),
        "taches": out_t,
        "source": SOURCE,
        "maj": (old or {}).get("maj") or today,
    }
    # maj ne bouge que si le contenu change : une réexécution à l'identique ne crée pas de diff.
    if old is not None and {**old, "maj": None} != {**doc, "maj": None}:
        doc["maj"] = today
    return path, doc, warnings


def main():
    check_only = "--check" in sys.argv[1:]
    cfg = load_postes()
    occ = read_excel()
    today = datetime.date.today().isoformat()

    errs, results = [], []
    seen = set()
    for p in cfg["postes"]:
        key = (p["domaine"], p["poste"])
        if key in seen:
            errs.append("postes.json : %s/%s en double" % key)
        seen.add(key)
        e, info, taches = check_poste(p, occ.get(p["isco08"], []))
        errs += e
        # Codes associés (ex. 2619 pour « Avocat·e ou juriste ») : mêmes vérifications, seules
        # leurs valeurs OIT sont recopiées, pas leurs tâches.
        assoc = []
        for a in p.get("isco_associes", []):
            pa = {"domaine": p["domaine"], "poste": p["poste"] + ", code associé",
                  "isco08": a["isco08"], "attendu": a["attendu"]}
            ea, ia, _ = check_poste(pa, occ.get(a["isco08"], []))
            errs += ea
            if ia:
                assoc.append({"isco08": a["isco08"], "isco_titre": ia["titre"], "oit": ia["oit"]})
        if info:
            info["isco_associes"] = assoc
        results.append((p, info, taches))
    if errs:
        print("Écarts entre le fichier de l'OIT et la spec, aucun fichier écrit :", file=sys.stderr)
        for e in errs:
            print("  - " + e, file=sys.stderr)
        sys.exit(1)

    total = 0
    for p, info, taches in results:
        total += len(taches)
        print("%-24s %-32s ISCO %s  μ %.2f  σ %.2f  %-20s %2d tâches" % (
            p["domaine"], p["poste"], p["isco08"], info["oit"]["mu"], info["oit"]["sd"],
            info["oit"]["categorie"], len(taches)))
    print("%d postes, %d tâches : μ, σ et catégories conformes à la spec." % (len(results), total))
    if check_only:
        return

    for p, info, taches in results:
        path, doc, warnings = merge(p, info, taches, today)
        for w in warnings:
            print("  ! " + w)
        write_json(path, doc)
    n = export_relecture(cfg)
    print("JSON écrits dans data/metiers/, relecture.csv : %d lignes." % n)


if __name__ == "__main__":
    main()
