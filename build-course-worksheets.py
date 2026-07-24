# -*- coding: utf-8 -*-
"""Generate blank fill-by-hand worksheet PDF packets for the Therapy Courses modules."""
import os
from reportlab.lib.pagesizes import letter
from reportlab.lib.units import inch
from reportlab.lib import colors
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.platypus import (SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle,
                                KeepTogether, PageBreak)

OUT_DIR = os.path.join(os.path.dirname(os.path.abspath(__file__)), "hugo-site", "static", "worksheets")
os.makedirs(OUT_DIR, exist_ok=True)

ACCENT = colors.HexColor("#4a7c35")
ACCENT2 = colors.HexColor("#8b6914")
TEXT = colors.HexColor("#231e14")
BG2 = colors.HexColor("#ece6db")
BORDER = colors.HexColor("#cfc8ba")
LINEGRAY = colors.HexColor("#b9b2a3")

styles = getSampleStyleSheet()
H1 = ParagraphStyle("H1", parent=styles["Title"], textColor=ACCENT, fontSize=20, leading=24, spaceAfter=2, alignment=0)
SUB = ParagraphStyle("SUB", parent=styles["Normal"], textColor=colors.HexColor("#6b6455"), fontSize=10, leading=13, spaceAfter=2)
DISC = ParagraphStyle("DISC", parent=styles["Normal"], textColor=colors.HexColor("#8a8272"), fontSize=8, leading=11, spaceAfter=8)
H2 = ParagraphStyle("H2", parent=styles["Heading2"], textColor=ACCENT, fontSize=14, leading=17, spaceBefore=10, spaceAfter=3)
INSTR = ParagraphStyle("INSTR", parent=styles["Normal"], textColor=colors.HexColor("#4a4436"), fontSize=9.5, leading=13, spaceAfter=6)
LABEL = ParagraphStyle("LABEL", parent=styles["Normal"], textColor=TEXT, fontSize=9.5, leading=12, spaceBefore=4, spaceAfter=2)
TH = ParagraphStyle("TH", parent=styles["Normal"], textColor=TEXT, fontSize=8.6, leading=10.5, fontName="Helvetica-Bold")
CELL = ParagraphStyle("CELL", parent=styles["Normal"], fontSize=9, leading=11)
NOTE = ParagraphStyle("NOTE", parent=styles["Normal"], textColor=colors.HexColor("#7a7364"), fontSize=8.5, leading=11, spaceAfter=4)

PAGE_W, PAGE_H = letter
LMARGIN = RMARGIN = 0.7 * inch
AVAIL = PAGE_W - LMARGIN - RMARGIN  # ~ 6.1in = 439pt

# ── element renderers ──────────────────────────────────────────────────────

def h2(text):
    return Paragraph(text, H2)

def instr(text):
    return Paragraph(text, INSTR)

def note(text):
    return Paragraph(text, NOTE)

def blank_table(headers, ratios, rows, row_h=24):
    total = sum(ratios)
    widths = [AVAIL * r / total for r in ratios]
    data = [[Paragraph(h, TH) for h in headers]]
    for _ in range(rows):
        data.append([""] * len(headers))
    rowHeights = [None] + [row_h] * rows
    t = Table(data, colWidths=widths, rowHeights=rowHeights, repeatRows=1)
    t.setStyle(TableStyle([
        ("GRID", (0, 0), (-1, -1), 0.6, BORDER),
        ("BACKGROUND", (0, 0), (-1, 0), BG2),
        ("VALIGN", (0, 0), (-1, -1), "TOP"),
        ("TOPPADDING", (0, 0), (-1, 0), 4),
        ("BOTTOMPADDING", (0, 0), (-1, 0), 4),
        ("LEFTPADDING", (0, 0), (-1, -1), 5),
        ("RIGHTPADDING", (0, 0), (-1, -1), 5),
    ]))
    return t

def field(label, lines=1):
    """Label followed by ruled write-lines. lines<1 => label only (inline blanks)."""
    flow = [Paragraph(label, LABEL)]
    if not lines or lines < 1:
        return flow
    lines = int(lines)
    data = [[""] for _ in range(lines)]
    t = Table(data, colWidths=[AVAIL], rowHeights=[22] * lines)
    t.setStyle(TableStyle([
        ("LINEBELOW", (0, 0), (-1, -1), 0.6, LINEGRAY),
        ("TOPPADDING", (0, 0), (-1, -1), 0),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 0),
    ]))
    flow.append(t)
    return flow

def checklist(items):
    """Empty checkbox square + item text per row."""
    data = []
    for it in items:
        box = Table([[""]], colWidths=[11], rowHeights=[11])
        box.setStyle(TableStyle([("BOX", (0, 0), (-1, -1), 0.7, TEXT)]))
        data.append([box, Paragraph(it, CELL)])
    t = Table(data, colWidths=[20, AVAIL - 20])
    t.setStyle(TableStyle([
        ("VALIGN", (0, 0), (-1, -1), "TOP"),
        ("TOPPADDING", (0, 0), (-1, -1), 3),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 3),
        ("LEFTPADDING", (0, 0), (0, -1), 0),
    ]))
    return t

def ratings(labels):
    """0-100 rating lines: label + scale + blank."""
    flow = []
    for lb in labels:
        flow.append(Paragraph(lb + '  &nbsp;&nbsp;0 &mdash;&mdash;&mdash;&mdash;&mdash;&mdash;&mdash;&mdash;&mdash;&mdash; 100 &nbsp;&nbsp; Rating: ______', LABEL))
    return flow

def smart_block():
    flow = [Paragraph("SMART goal", ParagraphStyle("s", parent=LABEL, textColor=ACCENT2, fontName="Helvetica-Bold", fontSize=10))]
    for lb in ["Specific — what exactly will happen?", "Measurable — how will you know?",
               "Achievable — realistic next step?", "Relevant — why it matters / which value?",
               "Time-bound — by when / how often?"]:
        flow += field(lb, 1)
    return flow

def gas_block():
    flow = [Paragraph("Goal Attainment Scaling (GAS)", ParagraphStyle("g", parent=LABEL, textColor=ACCENT2, fontName="Helvetica-Bold", fontSize=10))]
    flow += field("Goal name", 1)
    levels = [
        ("-2  Much less than expected", ""),
        ("-1  Somewhat less than expected", ""),
        ("0  Expected outcome", ""),
        ("+1  Somewhat more than expected", ""),
        ("+2  Much more than expected", ""),
    ]
    data = [[Paragraph("Level", TH), Paragraph("What this outcome looks like", TH)]]
    for lv, _ in levels:
        data.append([Paragraph(lv, CELL), ""])
    t = Table(data, colWidths=[AVAIL * 0.34, AVAIL * 0.66], rowHeights=[None] + [30] * 5, repeatRows=1)
    t.setStyle(TableStyle([
        ("GRID", (0, 0), (-1, -1), 0.6, BORDER),
        ("BACKGROUND", (0, 0), (-1, 0), BG2),
        ("VALIGN", (0, 0), (-1, -1), "TOP"),
        ("LEFTPADDING", (0, 0), (-1, -1), 5),
        ("TOPPADDING", (0, 0), (-1, -1), 4),
    ]))
    flow.append(t)
    flow.append(Paragraph("Current level (circle one):  &nbsp; -2 &nbsp;&nbsp; -1 &nbsp;&nbsp; 0 &nbsp;&nbsp; +1 &nbsp;&nbsp; +2", LABEL))
    return flow

def dtt_trials():
    flow = [Paragraph("Trial-by-trial data (mark each: + independent · P prompted · &minus; incorrect)", LABEL)]
    nums = [Paragraph(str(i + 1), ParagraphStyle("n", parent=CELL, alignment=1, fontSize=8, textColor=colors.HexColor("#7a7364"))) for i in range(10)]
    blanks = [""] * 10
    t = Table([nums, blanks], colWidths=[AVAIL / 10] * 10, rowHeights=[14, 30])
    t.setStyle(TableStyle([
        ("GRID", (0, 0), (-1, -1), 0.6, BORDER),
        ("BACKGROUND", (0, 0), (-1, 0), BG2),
        ("VALIGN", (0, 0), (-1, -1), "MIDDLE"),
    ]))
    flow.append(t)
    flow.append(Paragraph("Independent (+): ______ &nbsp;&nbsp; Prompted (P): ______ &nbsp;&nbsp; Incorrect (&minus;): ______ &nbsp;&nbsp; % independent: ______", LABEL))
    return flow

# ── build one worksheet (KeepTogether where reasonable) ────────────────────

def render_elements(elems):
    flow = []
    for e in elems:
        kind = e[0]
        if kind == "note":
            flow.append(note(e[1]))
        elif kind == "table":
            _, headers, ratios, rows = e[:4]
            row_h = e[4] if len(e) > 4 else 24
            flow.append(blank_table(headers, ratios, rows, row_h))
            flow.append(Spacer(1, 6))
        elif kind == "fields":
            for lb in e[1]:
                if isinstance(lb, tuple):
                    flow += field(lb[0], lb[1])
                else:
                    flow += field(lb, 1)
            flow.append(Spacer(1, 4))
        elif kind == "checklist":
            flow.append(checklist(e[1]))
            flow.append(Spacer(1, 6))
        elif kind == "ratings":
            flow += ratings(e[1])
            flow.append(Spacer(1, 4))
        elif kind == "smart":
            flow += smart_block()
            flow.append(Spacer(1, 6))
        elif kind == "gas":
            flow += gas_block()
            flow.append(Spacer(1, 6))
        elif kind == "trials":
            flow += dtt_trials()
            flow.append(Spacer(1, 6))
    return flow

def build_pdf(filename, title, subtitle, worksheets):
    path = os.path.join(OUT_DIR, filename)
    doc = SimpleDocTemplate(path, pagesize=letter, leftMargin=LMARGIN, rightMargin=RMARGIN,
                            topMargin=0.6 * inch, bottomMargin=0.6 * inch,
                            title=title + " — Blank Worksheets")
    story = [Paragraph(title, H1), Paragraph(subtitle, SUB),
             Paragraph("Blank worksheets for printing &mdash; a teaching aid for supervised skill practice, not a validated instrument.", DISC)]
    for i, ws in enumerate(worksheets):
        block = [h2(ws["name"])]
        if ws.get("instruction"):
            block.append(instr(ws["instruction"]))
        story.append(KeepTogether(block))
        story += render_elements(ws["elements"])
        story.append(Spacer(1, 10))
    doc.build(story)
    return path

# ══════════════════════════════════════════════════════════════════════════
#  MODULE SPECS
# ══════════════════════════════════════════════════════════════════════════

DAY = "Day"
MODULES = []

# Module 1 — Foundations
MODULES.append(dict(file="foundations-worksheets.pdf",
    title="Module 1 — Foundations of Behavioral & Cognitive-Behavioral Therapy",
    subtitle="Functional analysis · case formulation · session structure · measurement · Socratic method",
    worksheets=[
        dict(name="Functional Analysis (ABC)",
             instruction="Gather ABC data on a target behavior, then hypothesize its function.",
             elements=[("table", ["Antecedent (before)", "Behavior (observable)", "Consequence (after)"], [1, 1, 1], 6),
                       ("fields", ["Most likely function  (escape/avoidance · attention · tangible/activity · automatic/sensory)",
                                   ('Working hypothesis:  "When ___, the behavior ___, which results in ___ (function)."', 2)])]),
        dict(name="Case Formulation",
             instruction="Map a recent situation through the cognitive model, then list problems and treatment targets.",
             elements=[("fields", [("Situation / trigger", 1), ("Automatic thought", 1), ("Emotion (and intensity 0-100)", 1),
                                   ("Behavior / response", 1), ("Consequence (short- and long-term)", 1)]),
                       ("table", ["Problem", "Hypothesized mechanism", "Treatment target / technique"], [1, 1, 1], 5)]),
        dict(name="Session Structure Checklist",
             instruction="Self-supervision check — tick each component delivered.",
             elements=[("checklist", ["Set a collaborative agenda", "Brief mood/symptom check (rating)", "Bridge from previous session",
                                      "Review previous homework", "Teach / practice the session skill",
                                      "Assign new homework collaboratively", "Summarize key points", "Elicit client feedback on the session"])]),
        dict(name="Measurement (Goals & Outcomes)",
             instruction="Set an individualized goal and track a repeated measure across sessions.",
             elements=[("smart",), ("gas",),
                       ("table", ["Date", "Measure", "Score"], [1, 1, 0.6], 6)]),
        dict(name="Collaborative Empiricism — Self-Check",
             instruction="Reflect after a session using guided discovery.",
             elements=[("checklist", ["I treated thoughts as hypotheses to test, not facts", "I used the client's own words and examples",
                                      "I asked more than I told", "We reached conclusions together (guided discovery)",
                                      "I stayed curious and non-judgmental", "I checked the client's reaction and understanding"])]),
    ]))

# Module 2 — ABA / Autism
MODULES.append(dict(file="aba-autism-worksheets.pdf",
    title="Module 2 — ABA & Naturalistic Approaches for Autism Spectrum Disorder",
    subtitle="Assessment · Discrete Trial Training · PRT/ESDM · function-based support · progress",
    worksheets=[
        dict(name="Assessment",
             instruction="Identify reinforcers, sample baseline skills, and gather ABC data before teaching.",
             elements=[("note", "Preference assessment"),
                       ("table", ["Item / activity", "How assessed", "Preference 0-10"], [1.4, 1, 0.7], 6),
                       ("note", "Skill probe / baseline"),
                       ("table", ["Target skill", "Domain", "Baseline % correct"], [1.4, 1, 0.7], 5),
                       ("note", "ABC data log (interfering behavior)"),
                       ("table", ["Antecedent", "Behavior", "Consequence"], [1, 1, 1], 5)]),
        dict(name="Discrete Trial Training (DTT)",
             instruction="Plan the program, then record trial-by-trial data.",
             elements=[("fields", ["Target skill", "Antecedent / S-D (instruction)", "Target response", "Prompt & fading plan",
                                   "Reinforcer", "Error-correction procedure", "Mastery criterion"]),
                       ("trials",)]),
        dict(name="Naturalistic Teaching (PRT / ESDM)",
             instruction="Plan pivotal targets, natural reinforcers, and embedded opportunities.",
             elements=[("table", ["Pivotal area", "Specific target behavior", "Natural / direct reinforcer"], [1, 1.3, 1], 5),
                       ("note", "Naturalistic strategy checklist"),
                       ("checklist", ["Follow the child's lead and use child choice", "Use natural/direct reinforcers",
                                      "Reinforce reasonable attempts", "Intersperse maintenance and acquisition tasks",
                                      "Share control / take turns", "Embed targets in daily routines", "Prioritize engagement and positive affect"]),
                       ("table", ["Routine / activity", "Embedded learning opportunity"], [1, 1.6], 5)]),
        dict(name="Function-Based Behavior Support Plan (FBA)",
             instruction="Match a communicative replacement (FCT) to the behavior's function.",
             elements=[("fields", [("Target behavior (observable, measurable)", 1), ("Hypothesized function", 1),
                                   ("Antecedent / prevention strategies", 2), ("Replacement behavior (FCT) — same function", 2),
                                   ("Consequence strategies", 2), ("How the replacement is reinforced", 1)])]),
        dict(name="Goals & Progress",
             instruction="Write a measurable skill goal, scale it, and track percent-independent.",
             elements=[("smart",), ("gas",),
                       ("table", ["Session date", "Target skill", "% independent"], [1, 1.4, 0.8], 6)]),
    ]))

# Module 3 — BA / Depression
LIFE_AREAS = ["Relationships & family", "Work / education", "Health & body", "Recreation & hobbies",
              "Community & friends", "Spirituality / meaning", "Daily responsibilities"]

def values_table():
    ratios = [1.1, 1.4, 0.7, 1.6]
    widths = [AVAIL * r / sum(ratios) for r in ratios]
    data = [[Paragraph(h, TH) for h in ["Life area", "What matters (value)", "Importance 0-10", "Activities that express it"]]]
    for a in LIFE_AREAS:
        data.append([Paragraph(a, CELL), "", "", ""])
    t = Table(data, colWidths=widths, rowHeights=[None] + [34] * len(LIFE_AREAS), repeatRows=1)
    t.setStyle(TableStyle([("GRID", (0, 0), (-1, -1), 0.6, BORDER), ("BACKGROUND", (0, 0), (-1, 0), BG2),
                           ("VALIGN", (0, 0), (-1, -1), "TOP"), ("LEFTPADDING", (0, 0), (-1, -1), 5), ("TOPPADDING", (0, 0), (-1, -1), 4)]))
    return t

MODULES.append(dict(file="ba-depression-worksheets.pdf",
    title="Module 3 — Behavioral Activation & CBT for Depression",
    subtitle="Activity & mood monitoring · values · activity scheduling · goals · fidelity & outcomes",
    worksheets=[
        dict(name="Activity & Mood Log",
             instruction="Log real activities across the week; rate mood, mastery (accomplishment), and pleasure (enjoyment) 0-10.",
             elements=[("table", ["Day", "Time", "Activity (what you actually did)", "Mood 0-10", "Mastery 0-10", "Pleasure 0-10"],
                        [0.6, 0.7, 2, 0.7, 0.8, 0.8], 8)]),
        dict(name="Values Compass",
             instruction="For each life area, name what matters, rate importance now (0-10), and list activities that express it.",
             elements=[("__values__",)]),
        dict(name="Weekly Activity Schedule (homework)",
             instruction="Schedule specific, values-based activities; grade difficulty and predict mastery/pleasure.",
             elements=[("table", ["Planned activity", "Linked value", "Day", "Time", "Difficulty", "Pred. mastery", "Pred. pleasure"],
                        [1.6, 1.1, 0.5, 0.6, 0.7, 0.7, 0.7], 8)]),
        dict(name="Goals",
             instruction="",
             elements=[("smart",), ("gas",)]),
        dict(name="Fidelity & Outcomes",
             instruction="Rate BA session adherence and track the PHQ-9 across sessions.",
             elements=[("note", "BA session adherence checklist"),
                       ("checklist", ["Set a collaborative agenda", "Completed a mood check (e.g., PHQ-9)",
                                      "Reviewed self-monitoring / previous homework", "Explicitly linked activity to mood",
                                      "Taught or practiced a BA skill", "Identified avoidance (TRAP) and alternative coping (TRAC)",
                                      "Problem-solved barriers to activation", "Collaboratively assigned homework",
                                      "Graded task difficulty to an achievable level", "Summarized and elicited feedback"]),
                       ("note", "PHQ-9 progress tracker"),
                       ("table", ["Session date", "Session #", "PHQ-9 (0-27)", "Note"], [1, 0.6, 0.9, 1.6], 6)]),
    ]))

# Module 4 — Exposure / Anxiety
def repeat_blocks(title_line, field_specs, count):
    """Return element list of `count` blank blocks, each a set of fields with a divider note."""
    elems = []
    for i in range(count):
        elems.append(("note", f"{title_line} #{i+1}"))
        elems.append(("fields", field_specs))
    return elems

MODULES.append(dict(file="exposure-anxiety-worksheets.pdf",
    title="Module 4 — Exposure-Based CBT for Anxiety (incl. ERP for OCD)",
    subtitle="Functional assessment · SUDS hierarchy · expectancy exposure log · ERP · outcomes",
    worksheets=[
        dict(name="Functional Assessment",
             instruction="Map feared situations, predictions, avoidance, and safety behaviors. SUDS = 0-100.",
             elements=[("note", "Feared situations & predictions"),
                       ("table", ["Feared situation / stimulus / thought", "Feared outcome (specific prediction)", "SUDS 0-100"], [1.6, 1.6, 0.7], 6),
                       ("note", "Avoidance & safety behaviors"),
                       ("table", ["What the client avoids", "Safety behavior / crutch used"], [1, 1], 5),
                       ("note", "Feared body sensations (interoceptive)"),
                       ("table", ["Feared sensation", "How it could be induced", "SUDS 0-100"], [1.3, 1.3, 0.7], 4)]),
        dict(name="Exposure Hierarchy",
             instruction="List exposure tasks with anticipated SUDS (0-100) and the safety behaviors to drop.",
             elements=[("table", ["Exposure task", "Type (in vivo/imaginal/interoceptive/VR)", "SUDS 0-100", "Safety behavior to drop"],
                        [1.7, 1.3, 0.7, 1.3], 10)]),
        dict(name="Exposure Practice Record (inhibitory learning)",
             instruction="Set each exposure up as a test of a prediction; complete before and after.",
             elements=repeat_blocks("Exposure", [("Date ____________   Exposure task", 1), ("Prediction (what you feared)", 1),
                                                  ("Expected likelihood ______%     Peak SUDS ______", 0),
                                                  ("What actually happened", 1), ("What I learned", 1)], 4)),
        dict(name="ERP Plan (OCD)",
             instruction="Map trigger → obsession → compulsion → response-prevention plan. Watch for covert mental rituals.",
             elements=repeat_blocks("ERP target", [("Trigger ________________________   SUDS ______", 0),
                                                    ("Obsession & feared outcome", 1), ("Compulsion (incl. mental rituals)", 1),
                                                    ("Response-prevention plan", 1)], 4)),
        dict(name="Goals & Outcomes",
             instruction="Set a functional goal, scale it, and track a repeated severity measure.",
             elements=[("smart",), ("gas",),
                       ("table", ["Session date", "Measure", "Total score", "Note"], [1, 1, 0.8, 1.4], 6)]),
    ]))

# Module 5 — Anger / PMT
MODULES.append(dict(file="anger-pmt-worksheets.pdf",
    title="Module 5 — CBT for Anger Management & Parent Management Training",
    subtitle="Anger log · anger skills · PMT plan · goals · outcomes",
    worksheets=[
        dict(name="Anger Episode Log",
             instruction="Capture triggers, hot thoughts (watch for hostile appraisals), arousal, behavior, and consequences.",
             elements=[("table", ["Trigger / situation", "Hot thought (hostile appraisal?)", "Anger 0-100", "Body signs", "What I did", "Consequence"],
                        [1.1, 1.5, 0.7, 0.9, 1, 1], 6)]),
        dict(name="Anger Skills",
             instruction="Restructure hot thoughts, lower arousal, and rehearse stress-inoculation self-statements.",
             elements=[("note", "Cognitive restructuring"),
                       ("table", ["Hot thought (hostile appraisal / 'should')", "Evidence & other explanations", "Balanced / coping thought"], [1, 1, 1], 5),
                       ("note", "Arousal-reduction practice"),
                       ("checklist", ["Paced / diaphragmatic breathing", "Progressive muscle relaxation", "Cued relaxation word",
                                      "Brief time-away / walk", "Physical exercise routine"]),
                       ("note", "Stress-inoculation plan (coping self-statements)"),
                       ("fields", [("Prepare (before)", 1), ("Confront (during)", 1), ("Cope with arousal (peak)", 1), ("Reflect (after)", 1)])]),
        dict(name="Parent Management Training Plan",
             instruction="Reverse the coercive cycle: increase positive attention, give effective commands, apply consistent consequences.",
             elements=[("fields", [("Coercive cycle to interrupt  (demand -> escalation -> giving in)", 2)]),
                       ("note", "Positive attending & reinforcement"),
                       ("table", ["Desired behavior to reinforce", "How (labeled praise / reward)"], [1, 1.2], 5),
                       ("fields", [("Daily special (child-led) play time — when & how long", 1)]),
                       ("note", "Effective-command checklist"),
                       ("checklist", ["Get the child's attention first", "State it as a command, not a question", "One instruction at a time",
                                      "Specific and concrete", "Calm, neutral tone", "Allow wait time (~5s) to comply", "Praise compliance immediately"]),
                       ("note", "Consequence system"),
                       ("fields", [("Behaviors to planned-ignore", 1), ("Reward system", 1), ("Time-out plan (which behaviors, where, how long, how ended)", 2),
                                   ("Privilege removal", 1)])]),
        dict(name="Goals", instruction="", elements=[("smart",), ("gas",)]),
        dict(name="Outcomes",
             instruction="Track anger episodes (adult) or target-behavior frequency (child) across sessions.",
             elements=[("table", ["Date", "What is counted", "Count / rating"], [1, 1.6, 0.9], 6)]),
    ]))

# Module 6 — CBTp / Psychosis
MODULES.append(dict(file="cbtp-psychosis-worksheets.pdf",
    title="Module 6 — CBT for Psychosis (CBTp)",
    subtitle="Formulation · working with voices · working with beliefs · goals · outcomes & staying well",
    worksheets=[
        dict(name="Collaborative Formulation",
             instruction="Build a shared, individualized understanding in the person's own words.",
             elements=[("note", "ABC formulation"),
                       ("fields", [("A — Activating event / trigger", 1), ("B — Belief / appraisal (the meaning)", 1), ("C — Consequences (emotion & behavior)", 1)]),
                       ("note", "Longitudinal formulation — the 4 Ps"),
                       ("fields", [("Predisposing (vulnerabilities)", 1), ("Precipitating (triggers)", 1),
                                   ("Perpetuating (maintaining factors)", 1), ("Protective (strengths & supports)", 1)])]),
        dict(name="Working with Voices",
             instruction="Distress is driven mostly by beliefs about the voice (power, control, intent), not content.",
             elements=[("fields", [("Content / what the voice says", 1), ("Triggers & timing", 1)]),
                       ("ratings", ["Belief: how powerful is the voice?", "Perceived control over the voice", "Pressure to comply"]),
                       ("note", "Coping-strategy enhancement"),
                       ("checklist", ["Engage in an absorbing activity", "Refocus / shift attention", "Listen to music or a podcast",
                                      "Subvocalization task (humming, counting, reading aloud)", "Physical exercise / walk",
                                      "Relaxation or paced breathing", "Connect with a trusted person", "Talk back / set limits with the voice",
                                      "Reduce isolation & structure the day"]),
                       ("fields", [("Belief-testing plan (e.g., safely resist a low-risk command to test 'the voice is all-powerful')", 2)])]),
        dict(name="Working with a Belief",
             instruction="Collaborative and curious — never a debate. Rate conviction, examine evidence, generate alternatives, test.",
             elements=[("fields", [("Belief (in the person's words)", 1)]),
                       ("ratings", ["Conviction", "Distress it causes"]),
                       ("note", "Examine the evidence"),
                       ("table", ["Evidence FOR the belief", "Evidence AGAINST / other explanations"], [1, 1], 4),
                       ("fields", [("Possible alternative explanation", 1), ("Experiment: prediction to test", 1),
                                   ("What we will do", 1), ("Result & what it suggests", 1)])]),
        dict(name="Goals (functioning)",
             instruction="Set valued, achievable goals; watch for defeatist beliefs that maintain withdrawal.",
             elements=[("fields", [("Defeatist belief to address -> more helpful alternative", 1)]), ("smart",), ("gas",)]),
        dict(name="Outcomes & Staying Well",
             instruction="Track distress/conviction over time and build a written staying-well / crisis plan.",
             elements=[("table", ["Session date", "What is rated", "Rating 0-100"], [1, 1.4, 0.8], 6),
                       ("note", "Staying-well / crisis plan"),
                       ("fields", [("Early warning signs", 1), ("Coping strategies that help", 1), ("Supports & contacts", 1),
                                   ("Medication plan / shared decisions", 1), ("If things worsen, then...", 1)])]),
    ]))

# Module 7 — Integration
MODULES.append(dict(file="integration-worksheets.pdf",
    title="Module 7 — Integration, Advanced Topics & Implementation",
    subtitle="Formulation & sequencing · therapy + medication · fidelity & supervision · stepped care · capstone",
    worksheets=[
        dict(name="Transdiagnostic Formulation & Sequencing",
             instruction="List problems and shared maintaining mechanisms, then set a treatment sequence.",
             elements=[("table", ["Problem / diagnosis", "Impairment 0-100", "Maintaining mechanism"], [1.4, 0.8, 1.4], 5),
                       ("fields", [("Treat first (risk / stabilization / foundational)", 1), ("Then", 1), ("Later", 1),
                                   ("Shared mechanism to target across problems", 1)])]),
        dict(name="Therapy + Medication Integration",
             instruction="Define each treatment's role, coordination, and shared monitoring.",
             elements=[("fields", [("Target symptoms / problems", 1), ("Medication role", 1), ("Therapy role", 1),
                                   ("Coordination with prescriber", 1), ("Shared message to client", 1), ("Shared monitoring (measures & cadence)", 1)])]),
        dict(name="Fidelity & Supervision",
             instruction="List the protocol's core components, then check those delivered; plan supervision and self-care.",
             elements=[("table", ["Core component of the protocol", "Delivered? (Y / N)"], [2.2, 0.8], 8),
                       ("fields", [("Supervision plan", 1), ("Specific skills to practice", 1), ("Self-care & burnout monitoring", 1)])]),
        dict(name="Stepped Care & Telehealth",
             instruction="Match intensity to need and confirm readiness for remote/digital delivery.",
             elements=[("fields", [("Presentation severity / complexity", 1),
                                   ("Matched step (guided self-help -> low-intensity -> high-intensity -> specialist)", 1),
                                   ("Step-up / step-down criteria", 1)]),
                       ("note", "Telehealth / digital readiness checklist"),
                       ("checklist", ["Private, confidential setting for both parties", "Informed consent for telehealth",
                                      "Local emergency contacts & address on file", "Safety plan adapted for remote delivery",
                                      "Worksheets/materials shareable on-screen or sent ahead", "Exposures/role-plays adapted for remote format",
                                      "Chosen digital tools are evidence-informed & integrated", "Backup plan for tech failure"])]),
        dict(name="Capstone Action Plan",
             instruction="Commit to techniques to practice, measures to adopt, supervision to seek, and next steps.",
             elements=[("table", ["Technique to practice", "From module", "How I will practice it"], [1.4, 0.9, 1.6], 6),
                       ("fields", [("Outcome measures I will adopt", 1), ("Supervision / consultation I will seek", 1), ("Next concrete steps (this month)", 1)]),
                       ("gas",)]),
    ]))

# Patch the special values worksheet element
for m in MODULES:
    for ws in m["worksheets"]:
        ws["elements"] = [e for e in ws["elements"]]

# custom render hook for __values__
_orig_render = render_elements
def render_elements(elems):  # noqa
    flow = []
    for e in elems:
        if e[0] == "__values__":
            flow.append(values_table()); flow.append(Spacer(1, 6))
        else:
            flow += _orig_render([e])
    return flow

built = []
for m in MODULES:
    p = build_pdf(m["file"], m["title"], m["subtitle"], m["worksheets"])
    built.append(p)
    print("built", os.path.basename(p))

print("TOTAL", len(built))
