/* ── Route-of-administration overlay ─────────────────────────────────────────
   data.js carries no structured route field — route information appears only
   incidentally inside free-text mechanism strings — so availability by route is
   curated here, keyed by medication id.

   Route drives real clinical decisions that mechanism cannot: whether an agent
   is an option for a patient with poor adherence (LAI), for acute agitation on
   the unit (IM), or for someone who cannot take anything by mouth (IV).

   Most agents are oral only, so ORAL is the default and the overrides carry the
   parenteral and alternate-route formulations.

   Two accuracy notes worth preserving, because both are easy to get wrong:
     • Asenapine is SUBLINGUAL, not oral — swallowing it destroys bioavailability
       (first-pass metabolism drops it to roughly 2%). It is deliberately not
       tagged 'oral'.
     • Hydroxyzine hydrochloride is IM only. Intravenous or subcutaneous
       administration causes tissue damage and haemolysis.
   ────────────────────────────────────────────────────────────────────────── */
(function () {

  var ROUTES = {
    oral:        { label: 'Oral', short: 'PO', order: 1 },
    lai:         { label: 'Long-acting injectable', short: 'LAI', order: 2 },
    im:          { label: 'Intramuscular (short-acting)', short: 'IM', order: 3 },
    iv:          { label: 'Intravenous', short: 'IV', order: 4 },
    sublingual:  { label: 'Sublingual', short: 'SL', order: 5 },
    intranasal:  { label: 'Intranasal', short: 'IN', order: 6 },
    inhaled:     { label: 'Inhaled', short: 'INH', order: 7 },
    transdermal: { label: 'Transdermal', short: 'TD', order: 8 },
    rectal:      { label: 'Rectal', short: 'PR', order: 9 }
  };

  var DEFAULT_ROUTES = ['oral'];

  var OVERRIDES = {
    // ── First-generation antipsychotics ───────────────────────────────────
    haloperidol: { routes: ['oral', 'im', 'iv', 'lai'], notes: {
      lai: 'Haloperidol decanoate, every 4 weeks',
      im: 'Haloperidol lactate for acute agitation',
      iv: 'Off-label; QT prolongation and torsades risk — continuous ECG monitoring' } },
    fluphenazine: { routes: ['oral', 'im', 'lai'], notes: {
      lai: 'Fluphenazine decanoate, every 2–4 weeks' } },
    chlorpromazine: { routes: ['oral', 'im'], notes: {
      im: 'Marked hypotension risk — monitor blood pressure' } },
    loxapine: { routes: ['oral', 'inhaled'], notes: {
      inhaled: 'Adasuve — REMS-restricted; bronchospasm risk, requires spirometry access' } },

    // ── Second-generation antipsychotics ──────────────────────────────────
    risperidone: { routes: ['oral', 'lai'], notes: {
      lai: 'Risperdal Consta (q2wk, IM), Perseris (q4wk, SC), Uzedy (q1–2mo, SC)' } },
    paliperidone: { routes: ['oral', 'lai'], notes: {
      lai: 'Invega Sustenna (monthly), Trinza (q3mo), Hafyera (q6mo)' } },
    olanzapine: { routes: ['oral', 'im', 'lai'], notes: {
      im: 'Short-acting IM for agitation — avoid combining with parenteral benzodiazepines',
      lai: 'Zyprexa Relprevv — REMS; post-injection delirium/sedation syndrome requires 3-hour observation' } },
    aripiprazole: { routes: ['oral', 'lai'], notes: {
      lai: 'Abilify Maintena (monthly), Aristada (q4–8wk), Abilify Asimtufii (q2mo)' } },
    ziprasidone: { routes: ['oral', 'im'], notes: {
      im: 'Short-acting IM for agitation; oral absorption requires a 500 kcal meal' } },
    asenapine: { routes: ['sublingual', 'transdermal'], notes: {
      sublingual: 'Sublingual only — swallowing drops bioavailability to ~2%; no food or drink for 10 minutes',
      transdermal: 'Secuado patch, applied daily' } },

    // ── Benzodiazepines ───────────────────────────────────────────────────
    lorazepam: { routes: ['oral', 'im', 'iv'], notes: {
      im: 'Reliable IM absorption — the usual parenteral benzodiazepine for agitation',
      iv: 'Status epilepticus; respiratory depression risk' } },
    diazepam: { routes: ['oral', 'im', 'iv', 'rectal'], notes: {
      im: 'Erratic and painful IM absorption — IM route generally avoided',
      rectal: 'Diastat gel for seizure clusters' } },
    midazolam: { routes: ['im', 'iv', 'intranasal', 'oral'], notes: {
      iv: 'Procedural sedation; short-acting, requires monitoring',
      intranasal: 'Nayzilam for seizure clusters' } },
    chlordiazepoxide: { routes: ['oral', 'im', 'iv'], notes: {
      im: 'Erratic IM absorption' } },

    // ── Mood stabilizers ──────────────────────────────────────────────────
    valproate: { routes: ['oral', 'iv'], notes: {
      iv: 'Depacon — useful when oral route is unavailable; same hepatic and teratogenic cautions' } },

    // ── Antidepressants & related ─────────────────────────────────────────
    esketamine: { routes: ['intranasal'], notes: {
      intranasal: 'Spravato — REMS; administered under observation with 2-hour monitoring' } },
    brexanolone: { routes: ['iv'], notes: {
      iv: 'Zulresso — continuous 60-hour infusion under REMS with continuous pulse oximetry' } },

    // ── Antihistamines / anticholinergics / other ─────────────────────────
    diphenhydramine: { routes: ['oral', 'im', 'iv'] },
    hydroxyzine: { routes: ['oral', 'im'], notes: {
      im: 'Hydroxyzine hydrochloride IM only — IV or subcutaneous administration causes tissue damage and haemolysis' } },
    propranolol: { routes: ['oral', 'iv'], notes: {
      iv: 'Inpatient/cardiac use with continuous monitoring' } },
    clonidine: { routes: ['oral', 'transdermal'], notes: {
      transdermal: 'Catapres-TTS weekly patch' } },
    methylphenidate: { routes: ['oral', 'transdermal'], notes: {
      transdermal: 'Daytrana patch' } },
    zolpidem: { routes: ['oral', 'sublingual'], notes: {
      sublingual: 'Edluar; Intermezzo for middle-of-the-night waking' } }
  };

  // ── API ──────────────────────────────────────────────────────────────────
  function routesFor(medId) {
    var o = OVERRIDES[medId];
    return (o && o.routes) ? o.routes : DEFAULT_ROUTES;
  }
  function noteFor(medId, route) {
    var o = OVERRIDES[medId];
    return (o && o.notes && o.notes[route]) ? o.notes[route] : null;
  }
  function has(medId, route) { return routesFor(medId).indexOf(route) !== -1; }
  // Does this agent offer ANY of the requested routes? Empty request = no filter.
  function hasAny(medId, wanted) {
    if (!wanted || !wanted.length) return true;
    var r = routesFor(medId);
    for (var i = 0; i < wanted.length; i++) { if (r.indexOf(wanted[i]) !== -1) return true; }
    return false;
  }
  function sorted(medId) {
    return routesFor(medId).slice().sort(function (a, b) {
      return (ROUTES[a] ? ROUTES[a].order : 99) - (ROUTES[b] ? ROUTES[b].order : 99);
    });
  }
  function label(route) { return ROUTES[route] ? ROUTES[route].label : route; }
  function short(route) { return ROUTES[route] ? ROUTES[route].short : route; }

  window.Routes = {
    ROUTES: ROUTES, DEFAULT_ROUTES: DEFAULT_ROUTES, OVERRIDES: OVERRIDES,
    routesFor: routesFor, noteFor: noteFor, has: has, hasAny: hasAny,
    sorted: sorted, label: label, short: short
  };
})();
