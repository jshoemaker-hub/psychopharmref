#!/usr/bin/env python3
"""
qbank-audit.py — audit and repair js/qbank-data.js

Fixes three validity problems found in the 1000-item bank:
  1. Answer-position bias (correct_index was 63% "B"). Options are shuffled so
     the correct answer distributes ~evenly across A/B/C/D.
  2. Length cueing (correct option was the longest in ~90% of items). This
     script does NOT rewrite distractors — it emits a prioritized flag list so
     the author can lengthen/tighten distractors by hand.
  3. Inconsistent frame_used (~150 items had free-text topic strings instead of
     the controlled Bloom-style vocabulary). Those strings are moved to a new
     `topic` field and frame_used is set to a controlled value.

Usage:
  python3 question-bank/qbank-audit.py            # report only, writes nothing to qbank-data.js
  python3 question-bank/qbank-audit.py --apply     # rewrite qbank-data.js (backs up original)

Outputs (always) under question-bank/qbank-audit/:
  longest-answer-flags.csv   items where the correct option is the longest
  frame-normalization.csv     every frame_used value that was changed
  audit-summary.txt           before/after distributions

Deterministic: uses a fixed RNG seed so re-runs are reproducible.
"""
import json, re, csv, os, sys, random, shutil, datetime

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DATA = os.path.join(ROOT, "js", "qbank-data.js")
OUTDIR = os.path.join(ROOT, "question-bank", "qbank-audit")
SEED = 20260723
APPLY = "--apply" in sys.argv

# Controlled vocabulary for frame_used (values already dominant in the bank)
CONTROLLED = {
    "Application", "Factual Recall", "Key Detail", "Cause & Effect",
    "Comparison", "Common Misconception", "Best Practice", "Main Idea",
    "Inference", "Summary Insight", "Historical Context", "Mechanism-Focused",
}
VIGNETTE_RE = re.compile(r"year-old|y/o|\bpatient\b|presents|admitted|is prescribed|is diagnosed", re.I)


def load():
    raw = open(DATA, encoding="utf-8").read()
    head = raw[: raw.index("[")]
    tail = raw[raw.rindex("]") + 1 :]
    arr = json.loads(raw[raw.index("[") : raw.rindex("]") + 1])
    return head, arr, tail


def dist(arr):
    d = {0: 0, 1: 0, 2: 0, 3: 0}
    for q in arr:
        d[q["correct_index"]] += 1
    return d


def rebalance(arr, rng):
    """Shuffle each question's options; update correct_index. Balances positions
    by assigning target slots round-robin over a shuffled question order."""
    order = list(range(len(arr)))
    rng.shuffle(order)
    for n, idx in enumerate(order):
        q = arr[idx]
        opts = q["options"]
        correct_text = opts[q["correct_index"]]
        target = n % len(opts)                     # even spread A/B/C/D
        others = [o for o in opts if o != correct_text]
        rng.shuffle(others)
        new_opts = others[:]
        new_opts.insert(target, correct_text)
        q["options"] = new_opts
        q["correct_index"] = new_opts.index(correct_text)
    return arr


def flag_longest(arr):
    rows = []
    for q in arr:
        lens = [len(o) for o in q["options"]]
        ci = q["correct_index"]
        if len(set(lens)) > 1 and lens[ci] == max(lens):
            distractor_max = max(l for i, l in enumerate(lens) if i != ci)
            rows.append({
                "id": q["id"],
                "usmle_category": q["usmle_category"],
                "correct_len": lens[ci],
                "max_distractor_len": distractor_max,
                "len_gap": lens[ci] - distractor_max,
                "correct_answer": q["options"][ci],
            })
    rows.sort(key=lambda r: r["len_gap"], reverse=True)
    return rows


def normalize_frames(arr):
    changes = []
    for q in arr:
        f = q.get("frame_used", "")
        if f in CONTROLLED:
            continue
        topic = f
        new_frame = "Application" if VIGNETTE_RE.search(q["question"]) else "Factual Recall"
        q["topic"] = topic
        q["frame_used"] = new_frame
        changes.append({"id": q["id"], "old_frame_used": topic, "new_frame_used": new_frame})
    return changes


def main():
    os.makedirs(OUTDIR, exist_ok=True)
    head, arr, tail = load()
    rng = random.Random(SEED)

    before = dist(arr)
    flags = flag_longest(arr)                 # flag BEFORE shuffle (positions irrelevant to length)
    rebalance(arr, rng)
    after = dist(arr)
    frame_changes = normalize_frames(arr)

    # --- write reports ---
    with open(os.path.join(OUTDIR, "longest-answer-flags.csv"), "w", newline="", encoding="utf-8") as fh:
        w = csv.DictWriter(fh, fieldnames=["id", "usmle_category", "correct_len", "max_distractor_len", "len_gap", "correct_answer"])
        w.writeheader(); w.writerows(flags)

    with open(os.path.join(OUTDIR, "frame-normalization.csv"), "w", newline="", encoding="utf-8") as fh:
        w = csv.DictWriter(fh, fieldnames=["id", "old_frame_used", "new_frame_used"])
        w.writeheader(); w.writerows(frame_changes)

    lab = lambda d: "A=%d B=%d C=%d D=%d" % (d[0], d[1], d[2], d[3])
    summary = (
        "PsychoPharmRef Question Bank audit — %s\n"
        "Total items: %d\n\n"
        "correct_index BEFORE: %s\n"
        "correct_index AFTER:  %s\n\n"
        "Longest-option-is-answer items flagged: %d (see longest-answer-flags.csv)\n"
        "frame_used values normalized: %d (see frame-normalization.csv)\n"
        "Mode: %s\n"
    ) % (datetime.date.today().isoformat(), len(arr), lab(before), lab(after),
         len(flags), len(frame_changes), "APPLIED (qbank-data.js rewritten)" if APPLY else "REPORT ONLY")
    open(os.path.join(OUTDIR, "audit-summary.txt"), "w", encoding="utf-8").write(summary)
    print(summary)

    if APPLY:
        stamp = datetime.datetime.now().strftime("%Y%m%d-%H%M%S")
        shutil.copy2(DATA, DATA + ".bak-" + stamp)
        body = json.dumps(arr, ensure_ascii=False, separators=(",", ":"))
        open(DATA, "w", encoding="utf-8").write(head + body + tail)
        print("Wrote %s (backup: qbank-data.js.bak-%s)" % (DATA, stamp))
    else:
        print("Report-only run. Re-run with --apply to rewrite qbank-data.js.")


if __name__ == "__main__":
    main()
