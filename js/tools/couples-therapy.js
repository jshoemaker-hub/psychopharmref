/* ═══════════════════════════════════════════════════════════════════════
   couples-therapy.js — Course module 10
   "Marriage & Couples Therapy: A How-To"
   Audience: clinicians, trainees & advanced students.
   Builds a tabbed module into #mct-root. Uses ToolUtils for clipboard/date.
   Tabs: Learn · Assessment & Safety · Formulation · Session Tools ·
   Plan & Outcomes.
   Prefix: mct-
   ═══════════════════════════════════════════════════════════════════════ */
(function () {
  'use strict';

  var root = document.getElementById('mct-root');
  if (!root || root.dataset.mctBuilt) return;
  root.dataset.mctBuilt = '1';

  var U = window.ToolUtils || {};
  function dateStamp() { return (U.dateStamp ? U.dateStamp() : new Date().toLocaleDateString()); }
  function copyBtn(text, btn) { if (U.copyWithButton) U.copyWithButton(text, btn); else if (navigator.clipboard) navigator.clipboard.writeText(text); }

  function el(tag, attrs, html) {
    var e = document.createElement(tag);
    if (attrs) Object.keys(attrs).forEach(function (k) {
      if (k === 'class') e.className = attrs[k];
      else if (k === 'html') e.innerHTML = attrs[k];
      else e.setAttribute(k, attrs[k]);
    });
    if (html != null) e.innerHTML = html;
    return e;
  }
  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"]/g, function (c) {
    return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
  function val(sel, ctx) { var n = (ctx || root).querySelector(sel); return n ? n.value.trim() : ''; }

  // ═══════════════════════════════════════════════════════════════════════
  //  DIDACTIC CONTENT (Learn tab)
  // ═══════════════════════════════════════════════════════════════════════
  var LEARN_HTML =
    '<div class="mct-learn">' +
      '<p class="mct-lead">This module is a how-to for treating <strong>marriage and other committed couples</strong> in distress, and for using the couple as the unit of treatment when one partner has a disorder that couple-based protocols address. It is written for clinicians and trainees. The task is practical: who to see, when conjoint work is unsafe, which evidence-based model fits the formulation, and how to run the sessions.</p>' +

      '<h3>1. What the outcome evidence supports</h3>' +
      '<p>Couple therapy for relationship distress has a large within-group effect on relationship satisfaction. In a 2020 meta-analysis of 58 studies (40 samples, 2,092 couples), pre-to-post Hedges <em>g</em> was 1.12 (95% CI 0.92&ndash;1.31). Couples assigned to wait lists did not improve (<em>g</em> = 0.12). Gains were generally maintained, and greater baseline distress predicted larger gains. That analysis was limited to opposite-sex couples, and a within-group effect is not the same thing as a controlled effect (Roddy, Walsh, Rothman, Hatch, &amp; Doss, 2020).</p>' +
      '<p>The controlled estimate for traditional behavioral marital therapy versus no treatment is smaller and still favors treatment: across 30 randomized trials, <em>d</em> = 0.585. The same meta-analysis warned that publication bias may inflate the figure (Shadish &amp; Baldwin, 2005). The best long-term comparison of two active treatments is the UCLA/UW trial of traditional behavioral couple therapy (TBCT) versus integrative behavioral couple therapy (IBCT) in 134 chronically distressed married couples. Pre-to-post satisfaction effects were <em>d</em> = 0.90 (IBCT) and <em>d</em> = 0.71 (TBCT). IBCT was superior through two years; by five years the treatments had converged (<em>d</em> = 1.03 and 0.92 versus pretreatment). At five years, 50.0% of IBCT couples and 45.9% of TBCT couples were clinically significantly improved, and 25.7% and 27.9% were separated or divorced (Christensen, Atkins, Baucom, &amp; Yi, 2010).</p>' +
      '<div class="mct-callout mct-tip"><span class="mct-callout-title">How to read these numbers</span>Expect real average benefit, a substantial minority who separate, and no model that reliably outperforms the others over five years. Match the protocol to the formulation and the safety picture. Do not quote a single effect size as what this couple will get.</div>' +

      '<h3>2. Assessment: conjoint session, then each partner alone</h3>' +
      '<p>Start with a conjoint meeting and, before any change-oriented course, see <strong>each partner alone</strong>. The conjoint hour tells you the complaint, whether both people want to work on the relationship, and how they actually talk. The individual hours are where you can ask about fear, affairs, substance use, and psychiatric illness without the other person in the room. Many models do this, including Gottman&rsquo;s clinic and IBCT. State the secrets policy in writing <em>before</em> the individual sessions (see &sect;8).</p>' +
      '<p>In the conjoint hour, get a specific recent conflict and watch it for a few minutes. Note criticism, contempt, defensiveness, stonewalling, and whether either person makes or accepts a repair. Ask each person, in front of the other, only what they can safely answer: what they want from therapy, whether they want to stay, and what a good outcome would look like. Save the safety questions for the individual hour.</p>' +
      '<h4>Intimate partner violence</h4>' +
      '<p>Ask each partner alone. Useful questions: Are you afraid of your partner? Has your partner hit, pushed, choked, or forced sex? Does your partner control your money, phone, or who you see? Has there been a weapon, a threat, or stalking? Do you feel safe going home today? The site&rsquo;s <a href="#" onclick="switchSection(\'dv-tool\');return false;">DV / IPV assessment</a> (HITS plus a danger review) can structure the screen. The U.S. Preventive Services Task Force recommends screening women of reproductive age for intimate partner violence and providing or referring those who screen positive to ongoing support services (USPSTF, 2018). Screening is not only a primary-care task; it is part of deciding whether conjoint therapy is safe.</p>' +
      '<div class="mct-callout mct-warn"><span class="mct-callout-title">When ordinary conjoint therapy is contraindicated</span>Do not proceed with standard marriage therapy when either partner is afraid, when there is coercive control (isolation, monitoring, threats, economic domination), when there has been recent injury, strangulation, or sexual assault, when there are weapons, stalking, or credible threats, or when one partner cannot meet privately or is being coerced to attend. Communication exercises and &ldquo;seeing both sides&rdquo; in that setting can increase danger and teach the abused partner that the violence is a shared communication problem. Stabilize safety, offer individual care, and use the DV pathway on this site. Specialized domestic-violence-focused couple programs exist for carefully screened couples with mild-to-moderate situational violence and no ongoing fear (Stith, Rosen, McCollum, &amp; Thomsen, 2004). That is a different protocol, delivered by clinicians trained in it. It is not a reason to offer ordinary conjoint therapy when fear or coercive control is present.</div>' +
      '<div class="mct-callout"><span class="mct-callout-title">Clinical decision</span>In the conjoint hour both partners deny violence. Alone, one partner says they are afraid, that the other reads their phone and restricts contact with family, and that they were choked last month. Decision: stop conjoint therapy. Do not assign a speaker-listener exercise. Complete a danger review, document the safety plan, and arrange individual follow-up. Do not tell the other partner what was disclosed in a way that identifies the victim&rsquo;s report and increases risk.</div>' +

      '<h4>Substance use</h4>' +
      '<p>Ask both partners about alcohol and drug use, withdrawal, and whether use is tied to aggression. A substance use disorder is not, by itself, a contraindication to couple-based treatment. It is an indication for a specific protocol &mdash; behavioral couples therapy for alcohol and drug problems &mdash; when both partners will participate and the safety criteria above are met (see &sect;5). Intoxication in session, threats, or use that is part of coercive control puts the work back under the safety rule. The <a href="#" onclick="switchSection(\'sud-tool\');return false;">DSM-5-TR SUD tool</a> and the <a href="#" onclick="switchSection(\'alcohol-tool\');return false;">alcohol intake calculator</a> are available on this site; the <a href="/blog/alcohol-use-disorder/">Alcohol Use Disorder</a> chapter covers the individual pharmacology.</p>' +

      '<h4>Individual psychiatric illness</h4>' +
      '<p>Screen for depression, mania, psychosis, PTSD, and acute suicidality. An acute crisis (active suicidality, mania, or psychosis) is stabilized in individual care first; couple work can follow once the person can participate safely. Ongoing depression or PTSD, with relationship distress and no safety contraindication, is a reason to consider a couple-based protocol rather than a reason to exclude the partner (&sect;5). Use the <a href="#" onclick="switchSection(\'phq9-tool\');return false;">PHQ-9</a> and <a href="#" onclick="switchSection(\'pcl5-tool\');return false;">PCL-5</a> when those are the presenting disorders.</p>' +

      '<h4>Affairs</h4>' +
      '<p>Ask about affairs in the individual session, not as a surprise confrontation in the conjoint hour. If an affair is ongoing and still secret, do not start change-oriented conjoint therapy while you are holding that secret. Apply the written secrets policy (&sect;8): help the involved partner disclose, or pause the conjoint work. Do not spend those sessions analyzing communication as if the affair were not happening. If the affair has been disclosed and has stopped, the structured recovery model in &sect;6 applies.</p>' +
      '<div class="mct-callout"><span class="mct-callout-title">Clinical decision</span>In an individual session one spouse describes an ongoing affair and asks you to &ldquo;just work on communication&rdquo; and not tell the other spouse. Decision: do not open a change-oriented conjoint course while colluding with the secret. If the written no-secrets agreement covers this, coach a disclosure or follow the agreed pause rule. If you do not have written permission to reveal that confidence, you do not reveal it (AAMFT, 2015, Standard 2.2); you also do not continue conjoint treatment under a false premise. Say that you cannot keep doing couple sessions while holding information that makes the work dishonest, and pause.</div>' +

      '<h3>3. Choosing a model</h3>' +
      '<p>The models below are the ones with a defined method and a published evidence base. They overlap. Most distressed couples need a formulation of the cycle, a way to reduce contempt and threat, and some mix of acceptance and behavior change. Use one model deliberately rather than a tour of all of them.</p>' +

      '<h4>Gottman Method</h4>' +
      '<p>John Gottman&rsquo;s contribution is a clinical language built from observational research on how couples manage conflict, described for therapists in <em>The Marriage Clinic</em> (Gottman, 1999). The <strong>Four Horsemen</strong> are criticism (attacking character), contempt (disgust, mockery, superiority), defensiveness (counterattack or innocent-victim stance), and stonewalling (shutdown). The antidotes he teaches are a gentle start-up, a culture of appreciation, taking responsibility, and physiological self-soothing. <strong>Repair attempts</strong> are any bid that lowers the heat &mdash; humor, touch, &ldquo;let me start again,&rdquo; &ldquo;I see your point.&rdquo; Distressed couples often make repairs that the other person does not accept. Treatment aims at both making repairs and receiving them.</p>' +
      '<p>The <strong>Sound Relationship House</strong> is the positive counterpart: love maps (knowing the partner&rsquo;s inner world), fondness and admiration, turning toward bids for connection, a positive perspective, managing conflict, honoring life dreams, and shared meaning, with trust and commitment as the walls. Perpetual problems (gridlocked differences of personality, values, or needs) are treated differently from solvable problems. The goal with a perpetual problem is dialogue, not a forced solution.</p>' +
      '<p>Use the Four Horsemen and repair attempts in assessment even if you will treat with another model. The branded Gottman Method has a thinner randomized literature than TBCT, IBCT, and emotionally focused couple therapy. Teach the constructs as well-described clinical tools, and do not imply that a specific Gottman RCT effect size has been established comparable to Christensen et al. (2010).</p>' +

      '<h4>Emotionally focused couple therapy (Johnson)</h4>' +
      '<p>Emotionally focused couple therapy (EFCT), developed by Sue Johnson, treats distress as an attachment injury maintained by a negative cycle. The usual cycle is pursue&ndash;withdraw or criticize&ndash;defend. Secondary emotion (anger, numbness) sits on top of primary attachment emotion (fear, sadness, shame, longing). The therapist slows the cycle, has each partner contact the primary emotion, and helps them ask for the attachment need directly. Johnson organizes the work in three stages: de-escalation (map the cycle and reframe the problem as the cycle), restructuring (withdrawer re-engagement and blamer softening, with new bonding events), and consolidation (Johnson, 2020).</p>' +
      '<p>A 2019 meta-analysis of nine randomized trials reported a large pre-to-post effect on marital satisfaction (Hedges <em>g</em> = 2.09) and found that gains were maintained in the four trials with follow-up. The authors called the support preliminary (Beasley &amp; Ager, 2019). That estimate is much larger than the effects in the broader couple-therapy meta-analyses cited above. Report it as that review&rsquo;s finding, not as the effect a new couple should be promised.</p>' +

      '<h4>Integrative behavioral couple therapy (Christensen &amp; Jacobson)</h4>' +
      '<p>IBCT keeps the change techniques of traditional behavioral couple therapy and adds an acceptance formulation (Jacobson &amp; Christensen, 1998). The formulation has three parts: a <strong>theme</strong> (for example closeness versus independence), a <strong>polarization process</strong> (each person&rsquo;s coping makes the other do more of what they hate), and a <strong>mutual trap</strong> (both are stuck and neither can concede without feeling they will lose something essential). The DEEP analysis organizes the material: Differences, Emotional sensitivities, External stressors, and the Pattern of interaction.</p>' +
      '<p>Acceptance techniques are empathic joining (the hard emotion under the complaint) and unified detachment (the couple looking at the cycle together, often with a non-blaming name for it). Tolerance-building is used when full acceptance is not available. Behavior exchange, communication training, and problem-solving are still used, but they are aimed at the formulation rather than at a generic skill deficit. The five-year trial summarized in &sect;1 is the outcome anchor for IBCT versus TBCT.</p>' +

      '<h4>Traditional behavioral and cognitive-behavioral couple therapy</h4>' +
      '<p>TBCT (Jacobson &amp; Margolin, 1979) assumes that satisfaction falls when punishing exchanges outweigh rewarding ones and when partners lack a way to ask for change without attack. The core techniques are <strong>behavior exchange</strong> (each person increases specific positive behaviors), <strong>communication training</strong> (speaker-listener: one person has the floor, speaks from their own experience, and pauses; the listener paraphrases before responding), and <strong>problem-solving</strong> (define one problem, brainstorm, choose a trial solution, review it). Cognitive-behavioral couple therapy adds the appraisals that keep the cycle going: selective attention, attributions of blame, and rigid standards for what a partner &ldquo;should&rdquo; do (Epstein &amp; Baucom, 2002). These are the techniques inside the Shadish and Baldwin controlled estimate.</p>' +

      '<h4>PREP and other brief or premarital programs</h4>' +
      '<p>The Prevention and Relationship Enhancement Program (PREP; Markman, Stanley, and colleagues) is a brief, skills-based program for premarital and early couples who are not seeking treatment for established distress. The 1993 trial used a five-session program focused on communication and conflict management. At the five-year follow-up, intervention couples showed more positive and less negative communication and lower levels of marital violence than controls (Markman, Renick, Floyd, Stanley, &amp; Clements, 1993). The paper discusses selection effects; this is prevention, not therapy for a chronically distressed marriage. Do not offer a PREP workshop as treatment for contempt, an affair, coercive control, or an active psychiatric crisis. The speaker-listener skill itself travels well into TBCT.</p>' +

      '<h3>4. A reasonable session course</h3>' +
      '<ol>' +
        '<li><strong>Session 1 (conjoint):</strong> alliance, goals, a sample of the conflict, commitment, and the written secrets policy. Give a satisfaction measure to each partner.</li>' +
        '<li><strong>Sessions 2&ndash;3 (individual):</strong> IPV, affairs, substance use, individual illness, and whether each person wants to stay. Decide whether conjoint work is indicated.</li>' +
        '<li><strong>Feedback session:</strong> the cycle in plain language, the model you will use, and what will be measured.</li>' +
        '<li><strong>Middle sessions:</strong> the active techniques of the chosen model. Review homework every time. If homework is not happening, that is the session.</li>' +
        '<li><strong>Ending:</strong> what each person will do at the first sign of the old cycle, and a plan for booster contact.</li>' +
      '</ol>' +
      '<p>Length follows the protocol, not a house average. PREP in the prevention trial was five sessions. Cognitive-behavioral conjoint therapy for PTSD is 15 sessions. The IBCT/TBCT trial delivered approximately eight months of treatment. Shorten or extend by progress and by safety, not by a fixed package.</p>' +

      '<h3>5. Couple-based treatment when one partner has a disorder</h3>' +
      '<p>These protocols treat the disorder and the relationship together. They are not generic marriage therapy with the diagnosis mentioned in passing, and they are not a substitute for individual care when the individual picture requires it.</p>' +
      '<h4>Depression</h4>' +
      '<p>Relationship distress and depression move together often enough that treating only one of them can leave the other in place. Coping-oriented couple therapy was compared with cognitive therapy and interpersonal psychotherapy in 60 couples in which one partner was depressed. Couple therapy improved depressive symptoms about as much as the two individual therapies. It did not produce a better result on self-reported relationship satisfaction, and it did improve partner expressed emotion, which the individual therapies did not (Bodenmann et al., 2008). Use a couple protocol when distress is part of the problem and safety is intact. Severe, psychotic, or acutely suicidal depression still needs individual treatment, including medication when indicated. Track the PHQ-9 and a couple measure, not the couple measure alone.</p>' +
      '<h4>Alcohol and drug use disorders &mdash; behavioral couples therapy</h4>' +
      '<p>Behavioral couples therapy (BCT) for substance use, as manualized by O&rsquo;Farrell and Fals-Stewart (2006), puts the partner in the recovery plan. A core tool is a daily recovery contract: the person with the disorder states an intention not to use that day, the partner notices and supports, and the couple does not turn the check-in into a cross-examination. Communication skills and relapse planning sit around the contract. Across 12 randomized trials (n = 754), BCT outperformed individual-based treatment (Cohen&rsquo;s <em>d</em> = 0.54). At posttreatment the advantage was on relationship satisfaction; at follow-up it was also on frequency of use and consequences of use (Powers, Vedel, &amp; Emmelkamp, 2008). Do not start BCT when the safety contraindications in &sect;2 are present. Do not assign the partner to police the other person.</p>' +
      '<h4>PTSD &mdash; cognitive-behavioral conjoint therapy</h4>' +
      '<p>Cognitive-behavioral conjoint therapy for PTSD (Monson &amp; Fredman, 2012) is a 15-session protocol. Both partners learn what maintains PTSD, practice communication that does not accommodate avoidance, and examine trauma-related beliefs held by either person. In a randomized trial of 40 couples, clinician-rated PTSD severity improved more with immediate couple therapy than with a wait list (mean change difference &minus;23.21 on a 0&ndash;136 scale; 95% CI &minus;37.87 to &minus;8.55). Patients&rsquo; relationship satisfaction also improved more (mean change difference 9.43 on the Dyadic Adjustment Scale). Effects were maintained at an uncontrolled three-month follow-up (Monson et al., 2012). The comparator was a wait list, not individual trauma-focused therapy. Exclude couples with ongoing intimate partner violence. The <a href="/blog/ptsd-cptsd/">PTSD &amp; cPTSD</a> chapter covers individual treatment.</p>' +

      '<h3>6. Common problems</h3>' +
      '<dl class="mct-acr">' +
        '<dt>Communication</dt><dd>Teach one skill and rehearse it with the couple&rsquo;s actual topic. Speaker-listener (floor, &ldquo;I&rdquo; statement, paraphrase before rebuttal) is the shared tool of PREP and TBCT. In EFCT, the target is not a better debate; it is a softer message from the primary emotion.</dd>' +
        '<dt>Conflict</dt><dd>Separate solvable problems from perpetual ones. Solvable problems get a time-limited problem-solving trial. Perpetual problems get a dialogue about the dream or value underneath, using Gottman&rsquo;s distinction or IBCT acceptance, rather than a demand that one person concede their personality.</dd>' +
        '<dt>Infidelity</dt><dd>After the affair has stopped and been disclosed, the recovery sequence described by Gordon, Baucom, and Snyder is: impact and stabilization (damage control, no more contact with the affair partner, room for the injured partner&rsquo;s questions), then context (how the affair happened, without excusing it), then a decision about the future, including forgiveness if the injured partner chooses it. Their 2004 report is a replicated case series of six couples, not a randomized trial (Gordon, Baucom, &amp; Snyder, 2004; Baucom, Snyder, &amp; Gordon, 2009). Do not open the &ldquo;why the marriage was unhappy&rdquo; conversation in the first sessions after discovery.</dd>' +
        '<dt>Sexual problems</dt><dd>Separate desire, arousal, orgasm, and pain, and look for medication, medical illness, an affair, contempt, and untreated trauma before assigning a sex exercise. Sensate focus &mdash; a temporary ban on intercourse and a graded, non-demand touching practice &mdash; comes from Masters and Johnson (1970). Do not prescribe it when there is IPV, an active affair, or pain that has not been medically evaluated. See &sect;7 for antidepressant sexual dysfunction.</dd>' +
        '<dt>Parenting stress</dt><dd>Treat the co-parenting disagreement as a couple problem. Do not send the child to carry messages or to take a side. Agree on what is said to the child, then use problem-solving for the logistics and the cycle formulation for the blame.</dd>' +
        '<dt>Finances</dt><dd>Put the numbers on the table (secrecy about money functions like other secrets) and then look for the meaning under the argument: security, autonomy, fairness, or status. Use the solvable-versus-perpetual distinction. A values conflict about spending is often perpetual; a specific bill is often solvable.</dd>' +
      '</dl>' +

      '<h3>7. Psychopharmacology interface</h3>' +
      '<p>Medication can change the relationship, and the relationship can change how a medication is tolerated. Ask about sex directly. Patients under-report sexual side effects unless asked.</p>' +
      '<p>A meta-analysis of treatment-emergent sexual dysfunction, restricted to studies that inquired directly, found rates from 25.8% to 80.3% for the agents that exceeded placebo, in decreasing order of impact: sertraline, venlafaxine, citalopram, paroxetine, fluoxetine, imipramine, phenelzine, duloxetine, escitalopram, and fluvoxamine. Agomelatine, amineptine, bupropion, moclobemide, mirtazapine, and nefazodone did not differ from placebo in that analysis. The authors noted that open-label studies and differing scales limit the estimate (Serretti &amp; Chiesa, 2009). In the couple session, name the symptom (desire, arousal, orgasm delay) so it is not misread as rejection. Management belongs to the prescriber: waiting through early adaptation when depression is still acute, dose change, or a switch toward an agent with a lower rate when the illness allows. Do not have the couple &ldquo;work on sex&rdquo; as the only response to a drug effect.</p>' +
      '<p>Other psychiatric medicines that commonly affect desire or function include antipsychotics that raise prolactin, and sedating or opioid regimens. Put the observation in the shared plan and route the decision to whoever prescribes.</p>' +
      '<p><strong>When one spouse is ill.</strong> Illness changes roles, money, sleep, and sex, and it loads the other partner with care. Treat that as a couple problem: what each person is carrying, what respite is possible, and which symptoms are the illness or the medicine rather than a withdrawal of love. The well partner&rsquo;s observations of response and side effects are useful data. They are not a license to discuss the patient&rsquo;s treatment outside the confidentiality agreement, and the well partner is not a co-therapist. Coordinate with the prescriber. Keep individual treatment in place when the disorder needs it.</p>' +

      '<h3>8. Ethics: confidentiality, secrets, documentation</h3>' +
      '<p>In couple therapy the client unit is more than one person, and each person is still a client. The AAMFT Code of Ethics (2015) requires therapists to explain the limits of confidentiality at the outset (Standard 2.1). Standard 2.2 is specific: information is not disclosed outside the treatment without written authorization from each competent person, and an individual&rsquo;s confidence is not revealed to the other partner without that person&rsquo;s prior written permission. Standard 2.3 requires written authorization from each person before releasing couple records, and it allows limiting access when there is compelling evidence that access would cause serious harm, with the rationale documented.</p>' +
      '<p>A <strong>no-secrets</strong> policy is compatible with Standard 2.2 only when it is written consent, obtained before the individual sessions, that authorizes defined categories of information to come into the conjoint work. Typical contents: an ongoing affair, a firm decision to leave, and anything that would make continued conjoint sessions dishonest. The usual clinical step is to help the partner disclose, with the therapist disclosing only inside that written authorization. If the consent does not authorize unilateral disclosure, the ethical alternative is to pause conjoint treatment rather than either reveal the secret or pretend the work is honest.</p>' +
      '<p>A <strong>limited-secrets</strong> policy, also written in advance, names what may be held (for example individual history, or a past affair that has ended and that the person chooses not to disclose) and what will not be held (current danger; an ongoing affair, if that is your rule). Do not invent the policy after you have heard the secret.</p>' +
      '<div class="mct-callout mct-warn"><span class="mct-callout-title">Safety overrides a secrets policy when the law says so</span>Threats of violence, and mandated reporting where it applies, are not held because a couple agreed to a secrets rule. What must be reported is set by jurisdiction. This module is not legal advice. Know the rule where you practice, and do not document a disclosure in a shared note that the person who made the threat can read if that increases risk.</div>' +
      '<p><strong>Documentation.</strong> Record who attended, the agreed policy, the formulation, the measures, and the safety decision. Do not paste an individual-session secret into a couple note that both partners, or a records release, will see. Know how your record system releases couple charts before you promise confidentiality you cannot deliver.</p>' +

      '<h3>9. What to measure</h3>' +
      '<p>Give each partner the same satisfaction measure at the start and every few sessions. The Couples Satisfaction Index (CSI-16; range 0&ndash;81) was built to be more precise than older scales. In the development paper, CSI-16 scores under 51.5 corresponded to the distressed side of a Dyadic Adjustment Scale cut-point of 97.5 (Funk &amp; Rogge, 2007). That is a research threshold, not a diagnosis. The Dyadic Adjustment Scale (Spanier, 1976) remains common in the trials cited here, including Monson et al. (2012). Add a symptom measure when you are treating a disorder (PHQ-9, PCL-5, a substance-use outcome). The Plan tab computes nothing magical; it gives you a place to log the scores and the policy.</p>' +

      '<h3>Related on this site</h3>' +
      '<ul>' +
        '<li><a href="#" onclick="switchSection(\'dv-tool\');return false;">DV / IPV assessment</a> and the <a href="/blog/domestic-violence/">domestic violence</a> chapter</li>' +
        '<li><a href="#" onclick="switchSection(\'phq9-tool\');return false;">PHQ-9</a> &middot; <a href="#" onclick="switchSection(\'pcl5-tool\');return false;">PCL-5</a> &middot; <a href="#" onclick="switchSection(\'sud-tool\');return false;">DSM-5-TR SUD tool</a></li>' +
        '<li><a href="/blog/alcohol-use-disorder/">Alcohol use disorder</a> &middot; <a href="/blog/ptsd-cptsd/">PTSD &amp; cPTSD</a></li>' +
      '</ul>' +

      '<h3>Key references</h3>' +
      '<ul class="mct-refs">' +
        '<li>American Association for Marriage and Family Therapy. (2015). <em>AAMFT code of ethics</em>. Standards 2.1&ndash;2.3.</li>' +
        '<li>Baucom, D. H., Snyder, D. K., &amp; Gordon, K. C. (2009). <em>Helping couples get past the affair: A clinician&rsquo;s guide.</em> Guilford Press.</li>' +
        '<li>Beasley, C. C., &amp; Ager, R. (2019). Emotionally focused couples therapy: A systematic review of its effectiveness over the past 19 years. <em>Journal of Evidence-Based Social Work, 16</em>(2), 144&ndash;159. https://doi.org/10.1080/23761407.2018.1563013 PMID 30605013</li>' +
        '<li>Bodenmann, G., Plancherel, B., Beach, S. R. H., Widmer, K., Gabriel, B., Meuwly, N., Charvoz, L., Hautzinger, M., &amp; Schramm, E. (2008). Effects of coping-oriented couples therapy on depression: A randomized clinical trial. <em>Journal of Consulting and Clinical Psychology, 76</em>(6), 944&ndash;954. https://doi.org/10.1037/a0013467 PMID 19045963</li>' +
        '<li>Christensen, A., Atkins, D. C., Baucom, B., &amp; Yi, J. (2010). Marital status and satisfaction five years following a randomized clinical trial comparing traditional versus integrative behavioral couple therapy. <em>Journal of Consulting and Clinical Psychology, 78</em>(2), 225&ndash;235. https://doi.org/10.1037/a0018132 PMID 20350033</li>' +
        '<li>Epstein, N. B., &amp; Baucom, D. H. (2002). <em>Enhanced cognitive-behavioral therapy for couples: A contextual approach.</em> American Psychological Association.</li>' +
        '<li>Funk, J. L., &amp; Rogge, R. D. (2007). Testing the ruler with item response theory: Increasing precision of measurement for relationship satisfaction with the Couples Satisfaction Index. <em>Journal of Family Psychology, 21</em>(4), 572&ndash;583. https://doi.org/10.1037/0893-3200.21.4.572 PMID 18179329</li>' +
        '<li>Gordon, K. C., Baucom, D. H., &amp; Snyder, D. K. (2004). An integrative intervention for promoting recovery from extramarital affairs. <em>Journal of Marital and Family Therapy, 30</em>(2), 213&ndash;231. https://doi.org/10.1111/j.1752-0606.2004.tb01235.x</li>' +
        '<li>Gottman, J. M. (1999). <em>The marriage clinic: A scientifically based marital therapy.</em> W. W. Norton.</li>' +
        '<li>Jacobson, N. S., &amp; Christensen, A. (1998). <em>Acceptance and change in couple therapy: A therapist&rsquo;s guide to transforming relationships.</em> W. W. Norton.</li>' +
        '<li>Jacobson, N. S., &amp; Margolin, G. (1979). <em>Marital therapy: Strategies based on social learning and behavior exchange principles.</em> Brunner/Mazel.</li>' +
        '<li>Johnson, S. M. (2020). <em>The practice of emotionally focused couple therapy: Creating connection</em> (3rd ed.). Routledge.</li>' +
        '<li>Markman, H. J., Renick, M. J., Floyd, F. J., Stanley, S. M., &amp; Clements, M. (1993). Preventing marital distress through communication and conflict management training: A 4- and 5-year follow-up. <em>Journal of Consulting and Clinical Psychology, 61</em>(1), 70&ndash;77. https://doi.org/10.1037/0022-006X.61.1.70</li>' +
        '<li>Masters, W. H., &amp; Johnson, V. E. (1970). <em>Human sexual inadequacy.</em> Little, Brown.</li>' +
        '<li>Monson, C. M., &amp; Fredman, S. J. (2012). <em>Cognitive-behavioral conjoint therapy for PTSD: Harnessing the healing power of relationships.</em> Guilford Press.</li>' +
        '<li>Monson, C. M., Fredman, S. J., Macdonald, A., Pukay-Martin, N. D., Resick, P. A., &amp; Schnurr, P. P. (2012). Effect of cognitive-behavioral couple therapy for PTSD: A randomized controlled trial. <em>JAMA, 308</em>(7), 700&ndash;709. https://doi.org/10.1001/jama.2012.9307 PMID 22893167</li>' +
        '<li>O&rsquo;Farrell, T. J., &amp; Fals-Stewart, W. (2006). <em>Behavioral couples therapy for alcoholism and drug abuse.</em> Guilford Press.</li>' +
        '<li>Powers, M. B., Vedel, E., &amp; Emmelkamp, P. M. G. (2008). Behavioral couples therapy (BCT) for alcohol and drug use disorders: A meta-analysis. <em>Clinical Psychology Review, 28</em>(6), 952&ndash;962. https://doi.org/10.1016/j.cpr.2008.02.002 PMID 18374464</li>' +
        '<li>Roddy, M. K., Walsh, L. M., Rothman, K., Hatch, S. G., &amp; Doss, B. D. (2020). Meta-analysis of couple therapy: Effects across outcomes, designs, timeframes, and other moderators. <em>Journal of Consulting and Clinical Psychology, 88</em>(7), 583&ndash;596. https://doi.org/10.1037/ccp0000514 PMID 32551734</li>' +
        '<li>Serretti, A., &amp; Chiesa, A. (2009). Treatment-emergent sexual dysfunction related to antidepressants: A meta-analysis. <em>Journal of Clinical Psychopharmacology, 29</em>(3), 259&ndash;266. https://doi.org/10.1097/JCP.0b013e3181a5233f PMID 19440080</li>' +
        '<li>Shadish, W. R., &amp; Baldwin, S. A. (2005). Effects of behavioral marital therapy: A meta-analysis of randomized controlled trials. <em>Journal of Consulting and Clinical Psychology, 73</em>(1), 6&ndash;14. https://doi.org/10.1037/0022-006X.73.1.6 PMID 15709827</li>' +
        '<li>Spanier, G. B. (1976). Measuring dyadic adjustment: New scales for assessing the quality of marriage and similar dyads. <em>Journal of Marriage and the Family, 38</em>(1), 15&ndash;28.</li>' +
        '<li>Stith, S. M., Rosen, K. H., McCollum, E. E., &amp; Thomsen, C. J. (2004). Treating intimate partner violence within intact couple relationships: Outcomes of multi-couple versus individual couple therapy. <em>Journal of Marital and Family Therapy, 30</em>(3), 305&ndash;318.</li>' +
        '<li>US Preventive Services Task Force. (2018). Screening for intimate partner violence, elder abuse, and abuse of vulnerable adults: US Preventive Services Task Force final recommendation statement. <em>JAMA, 320</em>(16).</li>' +
      '</ul>' +
    '</div>';

  // ═══════════════════════════════════════════════════════════════════════
  //  Reusable dynamic table
  // ═══════════════════════════════════════════════════════════════════════
  function buildTable(cols, opts) {
    opts = opts || {};
    var wrap = el('div', { class: 'mct-tablewrap' });
    var table = el('table', { class: 'mct-table' });
    var thead = el('thead');
    var htr = el('tr');
    cols.forEach(function (c) { htr.appendChild(el('th', c.width ? { style: 'width:' + c.width } : null, c.label)); });
    htr.appendChild(el('th', { style: 'width:34px' }, ''));
    thead.appendChild(htr);
    table.appendChild(thead);
    var tbody = el('tbody');
    table.appendChild(tbody);
    wrap.appendChild(table);

    function cell(c) {
      var td = el('td');
      var input;
      if (c.type === 'select') {
        input = el('select');
        (c.opts || []).forEach(function (o) { input.appendChild(el('option', { value: o }, esc(o))); });
      } else if (c.type === 'textarea') {
        input = el('textarea', { placeholder: c.ph || '' });
      } else if (c.type === 'int') {
        input = el('input', { type: 'number', min: '0', max: '81', step: '1', class: 'mct-num', placeholder: c.ph || '' });
      } else if (c.type === 'date') {
        input = el('input', { type: 'date' });
      } else {
        input = el('input', { type: 'text', placeholder: c.ph || '' });
      }
      input.setAttribute('data-key', c.key);
      td.appendChild(input);
      return td;
    }
    function addRow(data) {
      var tr = el('tr');
      cols.forEach(function (c) {
        var td = cell(c);
        if (data && data[c.key] != null) td.querySelector('[data-key]').value = data[c.key];
        tr.appendChild(td);
      });
      var delTd = el('td');
      var del = el('button', { class: 'mct-row-del', title: 'Remove row', type: 'button' }, '&times;');
      del.onclick = function () { tr.remove(); };
      delTd.appendChild(del);
      tr.appendChild(delTd);
      tbody.appendChild(tr);
    }
    (opts.starter || [{}]).forEach(addRow);
    var addBtn = el('button', { class: 'mct-btn mct-btn-ghost mct-btn-sm', type: 'button' }, opts.addLabel || '+ Add row');
    addBtn.onclick = function () { addRow(); };
    var actWrap = el('div', { class: 'mct-actions' });
    actWrap.appendChild(addBtn);
    wrap.appendChild(actWrap);
    wrap._readRows = function () {
      return Array.prototype.map.call(tbody.querySelectorAll('tr'), function (tr) {
        var o = {};
        tr.querySelectorAll('[data-key]').forEach(function (inp) { o[inp.getAttribute('data-key')] = inp.value.trim(); });
        return o;
      }).filter(function (o) { return Object.keys(o).some(function (k) { return o[k]; }); });
    };
    return wrap;
  }

  function checklist(items) {
    var list = el('div', { class: 'mct-sc-list' });
    items.forEach(function (item) {
      var row = el('div', { class: 'mct-sc-item' });
      var lab = el('label', { class: 'mct-sc-head' });
      var box = el('input', { type: 'checkbox', 'data-flag': item.id });
      lab.appendChild(box);
      lab.appendChild(el('span', null, item.label));
      row.appendChild(lab);
      list.appendChild(row);
    });
    return list;
  }
  function flagged(panel, id) {
    var n = panel.querySelector('[data-flag="' + id + '"]');
    return !!(n && n.checked);
  }

  // ═══════════════════════════════════════════════════════════════════════
  //  ASSESSMENT tab
  // ═══════════════════════════════════════════════════════════════════════
  var STOP_ITEMS = [
    { id: 'fear', label: 'Either partner is afraid of the other' },
    { id: 'control', label: 'Coercive control: isolation, monitoring, threats, or economic control used to dominate' },
    { id: 'injury', label: 'Recent injury, strangulation, or sexual assault by a partner' },
    { id: 'weapons', label: 'Weapons, stalking, or a credible threat of harm' },
    { id: 'noprivate', label: 'A partner will not allow a private session, or is being coerced to attend' }
  ];
  var HOLD_ITEMS = [
    { id: 'affair', label: 'An ongoing affair is still secret from the other partner' },
    { id: 'crisis', label: 'Acute individual crisis (active suicidality, mania, or psychosis) is not yet stabilized' }
  ];
  var READY_ITEMS = [
    { id: 'inda', label: 'Individual session completed with partner A, alone' },
    { id: 'indb', label: 'Individual session completed with partner B, alone' },
    { id: 'ipv', label: 'IPV questions were asked of each partner alone' },
    { id: 'policy', label: 'A written secrets policy was agreed before the individual sessions' }
  ];
  var CONTEXT_ITEMS = [
    { id: 'sud', label: 'Alcohol or other substance use disorder in one or both partners' },
    { id: 'mdd', label: 'Depressive disorder in one partner, with relationship distress' },
    { id: 'ptsd', label: 'PTSD in one partner' },
    { id: 'disclosed', label: 'An affair was disclosed and has stopped' }
  ];

  function decisionState(panel) {
    var stops = STOP_ITEMS.filter(function (i) { return flagged(panel, i.id); });
    var holds = HOLD_ITEMS.filter(function (i) { return flagged(panel, i.id); });
    var missing = READY_ITEMS.filter(function (i) { return !flagged(panel, i.id); });
    var ctx = CONTEXT_ITEMS.filter(function (i) { return flagged(panel, i.id); });
    if (stops.length) return { level: 'stop', title: 'Ordinary conjoint therapy is contraindicated', detail: 'Safety items are present: ' + stops.map(function (i) { return i.label; }).join('; ') + '. Prioritize safety, individual care, and the DV pathway. Do not assign communication exercises or ask the couple to &ldquo;hear both sides&rdquo; of the abuse.' };
    if (flagged(panel, 'affair')) return { level: 'hold', title: 'Do not start change-oriented conjoint work while holding this secret', detail: 'An ongoing affair is still concealed. Follow the written secrets policy: coach a disclosure, or pause conjoint sessions. Do not reveal the confidence without prior written permission (AAMFT Standard 2.2). Do not treat &ldquo;communication&rdquo; as the problem while the affair continues.' };
    if (flagged(panel, 'crisis')) return { level: 'hold', title: 'Stabilize the individual crisis first', detail: 'Active suicidality, mania, or psychosis needs individual care before a couple course. Couple work can be reconsidered once the person can participate safely.' };
    if (missing.length) return { level: 'hold', title: 'Finish the assessment before a change-oriented course', detail: 'Still needed: ' + missing.map(function (i) { return i.label; }).join('; ') + '.' };
    var extra = [];
    if (flagged(panel, 'sud')) extra.push('Consider behavioral couples therapy for the substance use disorder if both partners will participate.');
    if (flagged(panel, 'mdd')) extra.push('Consider a couple protocol for depression alongside, not instead of, indicated individual care. Track the PHQ-9.');
    if (flagged(panel, 'ptsd')) extra.push('Consider cognitive-behavioral conjoint therapy for PTSD (15 sessions) if violence is not ongoing. Track the PCL-5.');
    if (flagged(panel, 'disclosed')) extra.push('An affair has stopped and been disclosed: use the impact &rarr; context &rarr; decision sequence, and do not open a blame analysis of the marriage in the first sessions.');
    return { level: 'go', title: 'Conjoint work can proceed', detail: 'Individual sessions, a private IPV screen, and a written secrets policy are in place, and no safety contraindication is flagged. ' + (extra.join(' ') || 'Choose a model from the formulation and treat the cycle you actually see.') };
  }

  function buildAssessment() {
    var panel = el('div');
    panel.appendChild(el('p', { class: 'mct-ws-intro' },
      'Teaching aid for the accept/defer/stop decision. It is not a validated risk instrument. Ask the safety items of each partner <strong>alone</strong>. Any safety item overrides a wish to &ldquo;just do couples therapy.&rdquo;'));

    var names = el('div', { class: 'mct-card' });
    names.appendChild(el('h4', null, 'Who is in the room'));
    var g = el('div', { class: 'mct-grid2' });
    [['a', 'Partner A'], ['b', 'Partner B']].forEach(function (p) {
      var d = el('div', { class: 'mct-field' });
      d.innerHTML = '<label>' + p[1] + ' <span class="mct-hint">initials are enough</span></label>';
      d.appendChild(el('input', { type: 'text', 'data-who': p[0], placeholder: p[1] }));
      g.appendChild(d);
    });
    names.appendChild(g);
    var rel = el('div', { class: 'mct-field' });
    rel.innerHTML = '<label>Relationship</label>';
    var relSel = el('select', { 'data-rel': '1' });
    ['Marriage', 'Committed partnership', 'Premarital / engaged', 'Separating — structured decision', 'Other committed couple'].forEach(function (o) {
      relSel.appendChild(el('option', { value: o }, o));
    });
    rel.appendChild(relSel);
    names.appendChild(rel);
    panel.appendChild(names);

    function block(title, items, note) {
      var card = el('div', { class: 'mct-card' });
      card.appendChild(el('h4', null, title));
      if (note) card.appendChild(el('p', { class: 'mct-ws-intro' }, note));
      card.appendChild(checklist(items));
      panel.appendChild(card);
    }
    block('Safety — any one of these contraindicates ordinary conjoint therapy', STOP_ITEMS,
      'Fear, coercive control, recent injury or strangulation, weapons or stalking, or a partner who cannot meet alone.');
    block('Hold — do not start change work yet', HOLD_ITEMS, '');
    block('Assessment complete — all four should be true before you proceed', READY_ITEMS, '');
    block('Context — shapes the protocol, does not by itself stop conjoint work', CONTEXT_ITEMS,
      'Substance use, depression, and PTSD have couple-based protocols when safety is intact.');

    var out = el('div', { class: 'mct-decision mct-hold' });
    panel.appendChild(out);
    function paint() {
      var d = decisionState(panel);
      out.className = 'mct-decision mct-' + d.level;
      out.innerHTML = '<b>' + d.title + '</b>' + d.detail;
    }
    panel.addEventListener('change', paint);
    paint();

    var actions = el('div', { class: 'mct-actions' });
    var copy = el('button', { class: 'mct-btn', type: 'button' }, 'Copy assessment decision');
    copy.onclick = function () {
      var d = decisionState(panel);
      var lines = ['COUPLE ASSESSMENT', 'Date: ' + dateStamp(),
        'Partner A: ' + (val('[data-who="a"]', panel) || '-'),
        'Partner B: ' + (val('[data-who="b"]', panel) || '-'),
        'Relationship: ' + relSel.value, '',
        'DECISION: ' + d.title,
        d.detail.replace(/&ldquo;|&#8220;/g, '"').replace(/&rdquo;|&#8221;/g, '"'),
        '', 'CHECKED'];
      STOP_ITEMS.concat(HOLD_ITEMS, READY_ITEMS, CONTEXT_ITEMS).forEach(function (i) {
        lines.push('  [' + (flagged(panel, i.id) ? 'x' : ' ') + '] ' + i.label);
      });
      copyBtn(lines.join('\n'), copy);
    };
    actions.appendChild(copy);
    panel.appendChild(actions);
    panel._decisionText = function () {
      var d = decisionState(panel);
      return d.title + ' — ' + d.detail.replace(/&[a-z]+;/g, '');
    };
    return panel;
  }

  // ═══════════════════════════════════════════════════════════════════════
  //  FORMULATION tab
  // ═══════════════════════════════════════════════════════════════════════
  function buildFormulation() {
    var panel = el('div');
    panel.appendChild(el('p', { class: 'mct-ws-intro' },
      'Write the cycle in language both partners would recognize. Pick one model to organize treatment. The Four Horsemen are an observation, not a requirement that you deliver Gottman Method therapy.'));

    var card = el('div', { class: 'mct-card' });
    card.appendChild(el('h4', null, 'The cycle'));
    function field(label, hint, key, ph, area) {
      var d = el('div', { class: 'mct-field' });
      d.innerHTML = '<label>' + label + (hint ? ' <span class="mct-hint">' + hint + '</span>' : '') + '</label>';
      var input = area
        ? el('textarea', { 'data-fx': key, placeholder: ph || '' })
        : el('input', { type: 'text', 'data-fx': key, placeholder: ph || '' });
      if (area) input.rows = 2;
      d.appendChild(input);
      return d;
    }
    card.appendChild(field('Presenting problem', 'in the couple&rsquo;s words', 'problem', 'What they say they are here for', true));
    card.appendChild(field('Negative cycle', 'who pursues, who withdraws, what each does next', 'cycle', 'She criticizes the lateness; he goes quiet; she criticizes the silence…', true));
    var model = el('div', { class: 'mct-field' });
    model.innerHTML = '<label>Model you will use</label>';
    var modelSel = el('select', { 'data-fx': 'model' });
    ['Not yet chosen', 'Gottman-informed (Four Horsemen, repair, Sound Relationship House)',
      'Emotionally focused couple therapy (Johnson)', 'Integrative behavioral couple therapy',
      'Traditional / cognitive-behavioral couple therapy', 'PREP (brief / premarital skills)',
      'Behavioral couples therapy for substance use', 'CBCT for PTSD (Monson)',
      'Affair recovery (Gordon, Baucom, Snyder)'].forEach(function (o) {
      modelSel.appendChild(el('option', { value: o }, o));
    });
    model.appendChild(modelSel);
    card.appendChild(model);
    panel.appendChild(card);

    var horses = el('div', { class: 'mct-card' });
    horses.appendChild(el('h4', null, 'Four Horsemen and repair'));
    horses.appendChild(checklist([
      { id: 'crit', label: 'Criticism — attack on character rather than a specific behavior' },
      { id: 'contempt', label: 'Contempt — mockery, disgust, or superiority' },
      { id: 'def', label: 'Defensiveness — counterattack or innocent-victim stance' },
      { id: 'stone', label: 'Stonewalling — shutdown, leaving, or blanking' }
    ]));
    var repair = el('div', { class: 'mct-field' });
    repair.innerHTML = '<label>Repair attempts</label>';
    var repairSel = el('select', { 'data-fx': 'repair' });
    ['Not yet observed', 'Rarely attempted', 'Attempted and usually rejected', 'Sometimes accepted', 'Often accepted'].forEach(function (o) {
      repairSel.appendChild(el('option', { value: o }, o));
    });
    repair.appendChild(repairSel);
    horses.appendChild(repair);
    panel.appendChild(horses);

    var deep = el('div', { class: 'mct-card' });
    deep.appendChild(el('h4', null, 'IBCT formulation (DEEP) — use even if the model is not IBCT'));
    deep.appendChild(field('Theme', 'the difference they are polarized around', 'theme', 'Closeness vs. independence; spend vs. save', false));
    deep.appendChild(field('Differences', '', 'diff', '', true));
    deep.appendChild(field('Emotional sensitivities', 'what this touches from each person&rsquo;s history', 'sens', '', true));
    deep.appendChild(field('External stressors', 'money, illness, children, work, extended family', 'ext', '', true));
    deep.appendChild(field('Pattern', 'the polarization and the mutual trap', 'pattern', '', true));
    panel.appendChild(deep);

    var eft = el('div', { class: 'mct-card' });
    eft.appendChild(el('h4', null, 'Primary emotion under the cycle (EFCT)'));
    eft.appendChild(field('Partner A — secondary emotion, then primary emotion and the attachment need', '', 'emA', 'Anger on top; underneath, fear of being unimportant. Need: reassurance.', true));
    eft.appendChild(field('Partner B — secondary emotion, then primary emotion and the attachment need', '', 'emB', 'Numbness on top; underneath, shame and fear of failing. Need: room without rejection.', true));
    panel.appendChild(eft);

    var actions = el('div', { class: 'mct-actions' });
    var copy = el('button', { class: 'mct-btn', type: 'button' }, 'Copy formulation');
    copy.onclick = function () {
      function fx(k) { return val('[data-fx="' + k + '"]', panel) || '-'; }
      var lines = ['COUPLE FORMULATION', 'Date: ' + dateStamp(), '',
        'Problem: ' + fx('problem'),
        'Cycle: ' + fx('cycle'),
        'Model: ' + fx('model'),
        'Repair: ' + fx('repair'), '', 'FOUR HORSEMEN'];
      [{ id: 'crit', n: 'Criticism' }, { id: 'contempt', n: 'Contempt' }, { id: 'def', n: 'Defensiveness' }, { id: 'stone', n: 'Stonewalling' }].forEach(function (h) {
        lines.push('  [' + (flagged(panel, h.id) ? 'x' : ' ') + '] ' + h.n);
      });
      lines.push('', 'DEEP', '  Theme: ' + fx('theme'), '  Differences: ' + fx('diff'),
        '  Emotional sensitivities: ' + fx('sens'), '  External stressors: ' + fx('ext'), '  Pattern: ' + fx('pattern'),
        '', 'PRIMARY EMOTION', '  Partner A: ' + fx('emA'), '  Partner B: ' + fx('emB'));
      copyBtn(lines.join('\n'), copy);
    };
    actions.appendChild(copy);
    panel.appendChild(actions);
    return panel;
  }

  // ═══════════════════════════════════════════════════════════════════════
  //  SESSION TOOLS tab
  // ═══════════════════════════════════════════════════════════════════════
  function buildSession() {
    var panel = el('div');
    panel.appendChild(el('p', { class: 'mct-ws-intro' },
      'In-session practice. Rehearse with the couple&rsquo;s real topic. Do not assign these if the assessment decision is stop.'));

    var speak = el('div', { class: 'mct-card' });
    speak.appendChild(el('h4', null, 'Speaker&ndash;listener'));
    speak.appendChild(el('p', { class: 'mct-ws-intro' },
      'One person has the floor and speaks from their own experience. The listener paraphrases and checks before answering. Then they switch. Used in PREP and in traditional behavioral couple therapy.'));
    var speakTable = buildTable([
      { key: 'topic', label: 'Topic (one issue)', type: 'text' },
      { key: 'speaker', label: 'Speaker', type: 'text', width: '90px' },
      { key: 'paraphrase', label: 'Listener&rsquo;s paraphrase', type: 'textarea' },
      { key: 'retry', label: 'What to retry', type: 'text' }
    ], { addLabel: '+ Add exchange', starter: [{}] });
    speak.appendChild(speakTable);
    panel.appendChild(speak);

    var repair = el('div', { class: 'mct-card' });
    repair.appendChild(el('h4', null, 'Repair attempt'));
    repair.appendChild(el('p', { class: 'mct-ws-intro' },
      'Name the horseman, pick the antidote (gentle start-up, appreciation, take responsibility, self-soothe), and write the sentence this couple will actually say.'));
    var repairTable = buildTable([
      { key: 'horse', label: 'What happened', type: 'select', opts: ['Criticism', 'Contempt', 'Defensiveness', 'Stonewalling', 'Rejected repair'], width: '140px' },
      { key: 'antidote', label: 'Antidote', type: 'select', opts: ['Gentle start-up', 'Appreciation / respect', 'Take responsibility', 'Physiological self-soothing', 'Accept the repair'], width: '160px' },
      { key: 'script', label: 'Sentence they will try', type: 'textarea' }
    ], { addLabel: '+ Add repair', starter: [{}] });
    repair.appendChild(repairTable);
    panel.appendChild(repair);

    var bx = el('div', { class: 'mct-card' });
    bx.appendChild(el('h4', null, 'Behavior exchange'));
    bx.appendChild(el('p', { class: 'mct-ws-intro' },
      'Each partner increases one specific positive behavior. It is a request for more of something, not a list of the other person&rsquo;s faults. Review whether it happened.'));
    var bxTable = buildTable([
      { key: 'who', label: 'Who', type: 'text', width: '90px' },
      { key: 'do', label: 'Positive behavior to increase', type: 'textarea' },
      { key: 'when', label: 'When', type: 'text', width: '120px' },
      { key: 'notice', label: 'How the other will acknowledge it', type: 'text' }
    ], { addLabel: '+ Add behavior', starter: [{}, {}] });
    bx.appendChild(bxTable);
    panel.appendChild(bx);

    var actions = el('div', { class: 'mct-actions' });
    var copy = el('button', { class: 'mct-btn', type: 'button' }, 'Copy session plan');
    copy.onclick = function () {
      var lines = ['COUPLE SESSION TOOLS', 'Date: ' + dateStamp(), '', 'SPEAKER-LISTENER'];
      speakTable._readRows().forEach(function (r) {
        lines.push('- ' + (r.speaker || '?') + ' on ' + (r.topic || '(topic)') + ': ' + (r.paraphrase || '-') + (r.retry ? ' | retry: ' + r.retry : ''));
      });
      lines.push('', 'REPAIR');
      repairTable._readRows().forEach(function (r) {
        lines.push('- ' + (r.horse || '-') + ' → ' + (r.antidote || '-') + ': ' + (r.script || '-'));
      });
      lines.push('', 'BEHAVIOR EXCHANGE');
      bxTable._readRows().forEach(function (r) {
        lines.push('- ' + (r.who || '?') + ': ' + (r.do || '-') + (r.when ? ' (' + r.when + ')' : '') + (r.notice ? ' | acknowledge: ' + r.notice : ''));
      });
      copyBtn(lines.join('\n'), copy);
    };
    actions.appendChild(copy);
    panel.appendChild(actions);
    return panel;
  }

  // ═══════════════════════════════════════════════════════════════════════
  //  PLAN & OUTCOMES tab
  // ═══════════════════════════════════════════════════════════════════════
  function buildPlan() {
    var panel = el('div');
    panel.appendChild(el('p', { class: 'mct-ws-intro' },
      'Protocol, secrets policy, one functional goal, and a place to log the Couples Satisfaction Index. CSI-16 scores under 51.5 fell on the distressed side of a DAS cut-point of 97.5 in Funk &amp; Rogge (2007). That threshold is a research benchmark, not a diagnosis.'));

    var proto = el('div', { class: 'mct-card' });
    proto.appendChild(el('h4', null, 'Protocol and focus'));
    var pselWrap = el('div', { class: 'mct-field' });
    pselWrap.innerHTML = '<label>Protocol</label>';
    var psel = el('select', { 'data-plan': 'protocol' });
    ['Relationship distress — IBCT', 'Relationship distress — TBCT / cognitive-behavioral',
      'Relationship distress — EFCT', 'Gottman-informed', 'PREP (prevention / early relationship)',
      'BCT for alcohol or drug use', 'Couple therapy for depression', 'CBCT for PTSD',
      'Affair recovery', 'Not conjoint — safety or individual crisis'].forEach(function (o) {
      psel.appendChild(el('option', { value: o }, o));
    });
    pselWrap.appendChild(psel);
    proto.appendChild(pselWrap);
    proto.appendChild(checklist([
      { id: 'f-comm', label: 'Communication' },
      { id: 'f-conf', label: 'Conflict / gridlock' },
      { id: 'f-inf', label: 'Infidelity' },
      { id: 'f-sex', label: 'Sexual problems' },
      { id: 'f-par', label: 'Parenting stress' },
      { id: 'f-fin', label: 'Finances' },
      { id: 'f-ill', label: 'Illness or medication affecting the relationship' }
    ]));
    panel.appendChild(proto);

    var sec = el('div', { class: 'mct-card' });
    sec.appendChild(el('h4', null, 'Secrets policy'));
    var sw = el('div', { class: 'mct-field' });
    sw.innerHTML = '<label>Policy agreed in writing before individual sessions</label>';
    var ssel = el('select', { 'data-plan': 'secrets' });
    ['Not yet agreed',
      'No-secrets — written permission to bring defined material into conjoint work',
      'Limited-secrets — written list of what may be held and what may not'].forEach(function (o) {
      ssel.appendChild(el('option', { value: o }, o));
    });
    sw.appendChild(ssel);
    sec.appendChild(sw);
    var held = el('div', { class: 'mct-field' });
    held.innerHTML = '<label>What this policy does and does not cover <span class="mct-hint">be specific</span></label>';
    held.appendChild(el('textarea', { 'data-plan': 'secretsnote', placeholder: 'e.g. Ongoing affair and a decision to leave come into conjoint work. Past individual trauma may be held. Threats are not held.' }));
    sec.appendChild(held);
    panel.appendChild(sec);

    var smart = el('div', { class: 'mct-card' });
    smart.appendChild(el('h4', null, 'SMART goal'));
    var fields = [
      ['specific', 'Specific', 'What will the couple do?', 'e.g. A 15-minute speaker-listener on one topic'],
      ['measurable', 'Measurable', 'How will you know?', 'e.g. Twice this week, both stayed in role'],
      ['achievable', 'Achievable', 'Small enough for this month?', 'e.g. One topic, not the affair and the budget'],
      ['relevant', 'Relevant', 'Which part of the formulation?', 'e.g. He can stay present; she can soften the start'],
      ['timebound', 'Time-bound', 'By when?', 'e.g. Review next session']
    ];
    fields.forEach(function (f) {
      var d = el('div', { class: 'mct-field' });
      d.innerHTML = '<label>' + f[1] + ' <span class="mct-hint">' + f[2] + '</span></label>';
      d.appendChild(el('input', { type: 'text', 'data-smart': f[0], placeholder: f[3] }));
      smart.appendChild(d);
    });
    var preview = el('div', { class: 'mct-preview' });
    smart.appendChild(preview);
    function updatePreview() {
      var g = {};
      smart.querySelectorAll('[data-smart]').forEach(function (i) { g[i.getAttribute('data-smart')] = i.value.trim(); });
      if (!g.specific && !g.measurable) { preview.innerHTML = ''; return; }
      preview.innerHTML = '<strong>Goal:</strong> ' + esc(g.specific || '…') +
        (g.measurable ? ' — ' + esc(g.measurable) : '') +
        (g.timebound ? ', ' + esc(g.timebound) : '') + '.';
    }
    smart.addEventListener('input', updatePreview);
    panel.appendChild(smart);

    var gas = el('div', { class: 'mct-card' });
    gas.appendChild(el('h4', null, 'Goal Attainment Scaling'));
    var levels = [
      ['-2', 'Much less than expected', 'mct-gas--2'],
      ['-1', 'Somewhat less than expected', 'mct-gas--1'],
      ['0', 'Expected outcome', 'mct-gas-0'],
      ['+1', 'Somewhat more than expected', 'mct-gas-1'],
      ['+2', 'Much more than expected', 'mct-gas-2']
    ];
    levels.forEach(function (lv) {
      var row = el('div', { class: 'mct-gas-level' });
      row.appendChild(el('span', { class: 'mct-gas-tag ' + lv[2] }, lv[0] + '<br>' + lv[1]));
      var inp = el('input', { type: 'text', 'data-gas-level': lv[0], placeholder: 'What this looks like for this couple' });
      inp.style.width = '100%'; inp.style.boxSizing = 'border-box'; inp.style.padding = '8px 10px';
      inp.style.border = '1px solid var(--border)'; inp.style.borderRadius = '6px'; inp.style.background = '#fdfcf9';
      row.appendChild(inp);
      gas.appendChild(row);
    });
    var curField = el('div', { class: 'mct-field' });
    curField.innerHTML = '<label>Current attainment level</label>';
    var curSel = el('select', { 'data-gas': 'current' });
    ['-2', '-1', '0', '+1', '+2'].forEach(function (v) { curSel.appendChild(el('option', { value: v }, v)); });
    curSel.value = '-1';
    curField.appendChild(curSel);
    gas.appendChild(curField);
    panel.appendChild(gas);

    var scores = el('div', { class: 'mct-card' });
    scores.appendChild(el('h4', null, 'Satisfaction log (each partner)'));
    var scoreTable = buildTable([
      { key: 'date', label: 'Date', type: 'date', width: '130px' },
      { key: 'a', label: 'Partner A CSI-16 (0–81)', type: 'int', width: '110px' },
      { key: 'b', label: 'Partner B CSI-16 (0–81)', type: 'int', width: '110px' },
      { key: 'note', label: 'Note', type: 'text' }
    ], { addLabel: '+ Add score', starter: [{}] });
    scores.appendChild(scoreTable);
    panel.appendChild(scores);

    var actions = el('div', { class: 'mct-actions' });
    var copy = el('button', { class: 'mct-btn', type: 'button' }, 'Copy treatment plan');
    copy.onclick = function () {
      var lines = ['COUPLE TREATMENT PLAN', 'Date: ' + dateStamp(), '',
        'Protocol: ' + psel.value,
        'Secrets policy: ' + ssel.value,
        'Policy note: ' + (val('[data-plan="secretsnote"]', panel) || '-'),
        '', 'FOCUS'];
      [{ id: 'f-comm', n: 'Communication' }, { id: 'f-conf', n: 'Conflict' }, { id: 'f-inf', n: 'Infidelity' },
        { id: 'f-sex', n: 'Sexual problems' }, { id: 'f-par', n: 'Parenting' }, { id: 'f-fin', n: 'Finances' },
        { id: 'f-ill', n: 'Illness or medication' }].forEach(function (f) {
        lines.push('  [' + (flagged(panel, f.id) ? 'x' : ' ') + '] ' + f.n);
      });
      lines.push('', 'SMART GOAL');
      fields.forEach(function (f) { lines.push('  ' + f[1] + ': ' + (val('[data-smart="' + f[0] + '"]', panel) || '-')); });
      lines.push('', 'GAS (current ' + curSel.value + ')');
      levels.forEach(function (lv) { lines.push('  ' + lv[0] + ': ' + (val('[data-gas-level="' + lv[0] + '"]', panel) || '-')); });
      lines.push('', 'CSI-16 LOG (distressed range in Funk & Rogge, 2007: under 51.5)');
      scoreTable._readRows().forEach(function (r) {
        lines.push('- ' + (r.date || '?') + '  A ' + (r.a || '-') + '  B ' + (r.b || '-') + (r.note ? '  ' + r.note : ''));
      });
      copyBtn(lines.join('\n'), copy);
    };
    actions.appendChild(copy);
    panel.appendChild(actions);
    return panel;
  }

  // ═══════════════════════════════════════════════════════════════════════
  //  Assemble tabs
  // ═══════════════════════════════════════════════════════════════════════
  var TABS = [
    { id: 'learn', label: 'Learn', build: function () { return el('div', { html: LEARN_HTML }); } },
    { id: 'assessment', label: 'Assessment & Safety', build: buildAssessment },
    { id: 'formulation', label: 'Formulation', build: buildFormulation },
    { id: 'session', label: 'Session Tools', build: buildSession },
    { id: 'plan', label: 'Plan & Outcomes', build: buildPlan }
  ];

  var meta = el('div', { class: 'mct-meta' });
  meta.innerHTML =
    '<span class="mct-chip mct-chip-accent">Module 10</span>' +
    '<span class="mct-chip">Marriage &amp; committed couples</span>' +
    '<span class="mct-chip">EFCT &middot; IBCT &middot; TBCT &middot; Gottman &middot; PREP</span>' +
    '<span class="mct-chip">Clinician / trainee</span>' +
    '<span class="mct-chip">~4&ndash;6 contact hours</span>';
  root.appendChild(meta);

  var printBar = el('div', { class: 'mct-actions' });
  var printBtn = el('button', { class: 'mct-btn mct-btn-ghost mct-btn-sm', type: 'button' }, '');
  printBtn.innerHTML = '&#128424; Print / Save as PDF';
  printBtn.onclick = function () {
    var allTabs = tabBar.querySelectorAll('.mct-tab');
    Array.prototype.forEach.call(allTabs, function (b) { b.click(); });
    if (allTabs[0]) allTabs[0].click();
    window.print();
  };
  printBar.appendChild(printBtn);
  root.appendChild(printBar);

  var tabBar = el('div', { class: 'mct-tabs' });
  var panels = el('div');
  TABS.forEach(function (t, i) {
    var btn = el('button', { class: 'mct-tab' + (i === 0 ? ' mct-active' : ''), type: 'button' }, t.label);
    var panel = el('div', { class: 'mct-panel' + (i === 0 ? ' mct-active' : '') });
    var built = false;
    function activate() {
      tabBar.querySelectorAll('.mct-tab').forEach(function (b) { b.classList.remove('mct-active'); });
      panels.querySelectorAll('.mct-panel').forEach(function (p) { p.classList.remove('mct-active'); });
      btn.classList.add('mct-active');
      panel.classList.add('mct-active');
      if (!built) { panel.appendChild(t.build()); built = true; }
    }
    btn.onclick = activate;
    if (i === 0) { panel.appendChild(t.build()); built = true; }
    tabBar.appendChild(btn);
    panels.appendChild(panel);
  });
  root.appendChild(tabBar);
  root.appendChild(panels);

  var hash = (location.hash || '').split(':')[1];
  if (hash) {
    var idx = TABS.map(function (t) { return t.id; }).indexOf(hash);
    if (idx > -1) tabBar.querySelectorAll('.mct-tab')[idx].click();
  }
})();
