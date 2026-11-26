#!/usr/bin/env python3
"""Réimport du tableau de relecture validé (spec §10, étape 3).

Lit data/metiers/relecture.csv (ou le fichier donné) et reporte dans les JSON de poste les
champs éditoriaux : libelle_fr, retenue, raison_exclusion, adaptation, raison_adaptation,
statut. Pour chaque tâche qui
passe en « valide » ou « rejete », valide_le reçoit la date du jour (ou --date) ; une tâche
déjà validée et inchangée garde sa date.

Garde-fous (le script s'arrête sans rien écrire au moindre problème) :
- ISCO, texte_en, score et bande doivent être identiques au JSON : ces colonnes viennent de
  l'OIT ou du script d'import et ne se corrigent jamais dans le tableau ;
- statut parmi propose, valide, rejete ;
- retenue = oui ou non ; une tâche écartée a une raison, une tâche retenue n'en a pas ;
- adaptation = oui ou non ; une adaptation (libellé qui s'écarte du texte de l'OIT pour
  correspondre au poste en France) a une raison et concerne une tâche retenue ;
- une tâche « valide » a un libellé français ;
- chaque tâche apparaît au plus une fois.

Les lignes absentes du tableau ne sont pas modifiées. Le séparateur (; ou ,) est détecté,
et une virgule décimale dans la colonne score est acceptée (réenregistrement par Excel).

Usage : python3 scripts/import-relecture.py [fichier.csv] [--date AAAA-MM-JJ] [--dry-run]
"""
import argparse
import csv
import datetime
import re
import sys
from pathlib import Path

from metiers_common import (
    CSV_COLUMNS, RELECTURE_CSV, STATUTS, load_postes, poste_path, read_json, write_json,
)


def parse_args():
    ap = argparse.ArgumentParser()
    ap.add_argument("csv", nargs="?", default=str(RELECTURE_CSV))
    ap.add_argument("--date", default=datetime.date.today().isoformat())
    ap.add_argument("--dry-run", action="store_true")
    a = ap.parse_args()
    if not re.fullmatch(r"\d{4}-\d{2}-\d{2}", a.date):
        sys.exit("--date attend AAAA-MM-JJ")
    return a


def read_rows(path):
    with open(path, encoding="utf-8-sig", newline="") as f:
        text = f.read()
    first = text.split("\n", 1)[0]
    delim = ";" if first.count(";") >= first.count(",") else ","
    rows = list(csv.DictReader(text.splitlines(), delimiter=delim))
    if not rows:
        sys.exit("Tableau vide : %s" % path)
    missing = [c for c in CSV_COLUMNS if c not in rows[0]]
    if missing:
        sys.exit("Colonnes absentes du tableau : %s" % ", ".join(missing))
    return rows


def norm(s):
    return (s or "").strip()


def main():
    a = parse_args()
    rows = read_rows(Path(a.csv))
    known = {(p["domaine"], p["poste"]) for p in load_postes()["postes"]}
    docs, errs, seen = {}, [], set()
    changes = {"valide": 0, "rejete": 0, "propose": 0, "modifiees": 0}

    for n, r in enumerate(rows, start=2):
        where = "ligne %d" % n
        key = (norm(r["domaine"]), norm(r["poste"]))
        if key not in known:
            errs.append("%s : poste inconnu %s/%s" % (where, key[0], key[1]))
            continue
        if key not in docs:
            docs[key] = read_json(poste_path(*key))
        doc = docs[key]
        try:
            tid = int(norm(r["task_id"]))
        except ValueError:
            errs.append("%s : task_id invalide « %s »" % (where, r["task_id"]))
            continue
        if (key, tid) in seen:
            errs.append("%s : tâche %s/%d en double" % (where, key[1], tid))
            continue
        seen.add((key, tid))
        t = next((x for x in doc["taches"] if x["task_id"] == tid), None)
        if t is None:
            errs.append("%s : tâche %d absente de %s" % (where, tid, key[1]))
            continue

        # Colonnes de la source : lecture seule.
        if norm(r["ISCO"]) != doc["isco08"]:
            errs.append("%s : ISCO modifié (%s au lieu de %s)" % (where, r["ISCO"], doc["isco08"]))
        if norm(r["texte_en"]) != t["texte_en"]:
            errs.append("%s : texte_en modifié, il doit rester celui de l'OIT" % where)
        try:
            score = float(norm(r["score"]).replace(",", "."))
        except ValueError:
            score = None
        if score is None or abs(score - t["score_2025"]) > 1e-9:
            errs.append("%s : score modifié (%s au lieu de %s)" % (where, r["score"], t["score_2025"]))
        if norm(r["bande"]) != t["bande"]:
            errs.append("%s : bande modifiée (%s au lieu de %s)" % (where, r["bande"], t["bande"]))

        # Colonnes éditoriales.
        statut = norm(r["statut"]).lower().replace("é", "e")
        if statut not in STATUTS:
            errs.append("%s : statut « %s » (attendu : propose, valide ou rejete)" % (where, r["statut"]))
            continue
        ret = norm(r["retenue"]).lower()
        if ret not in ("oui", "non", "true", "false"):
            errs.append("%s : retenue « %s » (attendu : oui ou non)" % (where, r["retenue"]))
            continue
        retenue = ret in ("oui", "true")
        ad = norm(r["adaptation"]).lower()
        if ad not in ("oui", "non", "true", "false"):
            errs.append("%s : adaptation « %s » (attendu : oui ou non)" % (where, r["adaptation"]))
            continue
        adaptation = ad in ("oui", "true")
        raison_ad = norm(r["raison_adaptation"]) or None
        if adaptation and not raison_ad:
            errs.append("%s : adaptation sans raison" % where)
        if not adaptation and raison_ad:
            errs.append("%s : raison d'adaptation sans adaptation (vider la colonne ou passer adaptation à oui)" % where)
        if adaptation and not retenue:
            errs.append("%s : une tâche écartée ne peut pas être marquée comme adaptation" % where)
        raison = norm(r["raison_exclusion"]) or None
        libelle = norm(r["libelle_fr"]) or None
        if not retenue and not raison:
            errs.append("%s : tâche écartée sans raison" % where)
        if retenue and raison:
            errs.append("%s : tâche retenue avec une raison d'exclusion (vider la colonne ou passer retenue à non)" % where)
        if statut == "valide" and not libelle:
            errs.append("%s : tâche validée sans libellé français" % where)

        new = {"libelle_fr": libelle, "retenue": retenue, "raison_exclusion": raison,
               "adaptation": adaptation, "raison_adaptation": raison_ad, "statut": statut}
        edited = any(t[k] != v for k, v in new.items())
        if statut == "propose":
            new["valide_le"] = None
        elif edited or not t.get("valide_le"):
            new["valide_le"] = a.date
        else:
            new["valide_le"] = t["valide_le"]
        if any(t[k] != v for k, v in new.items()):
            changes["modifiees"] += 1
        t.update(new)
        changes[statut] += 1

    if errs:
        print("Tableau refusé, aucun JSON modifié :", file=sys.stderr)
        for e in errs:
            print("  - " + e, file=sys.stderr)
        sys.exit(1)

    print("%d lignes lues : %d valide, %d rejete, %d propose ; %d tâches modifiées."
          % (len(rows), changes["valide"], changes["rejete"], changes["propose"], changes["modifiees"]))
    if a.dry_run:
        print("--dry-run : rien n'est écrit.")
        return
    for key, doc in docs.items():
        path = poste_path(*key)
        if read_json(path) != doc:
            doc["maj"] = a.date
            write_json(path, doc)
    print("JSON mis à jour. Lancer ensuite : node scripts/check-metiers.js")


if __name__ == "__main__":
    main()
