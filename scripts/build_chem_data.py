#!/usr/bin/env python3
"""Author + validate chemical structure data for PsychoPharmRef 'Chem Structure' section.
Every SMILES is parsed by RDKit; MW, molecular formula, and logP (Crippen) are computed
so the reference values are exact rather than hand-entered."""
import json, sys, math, re
from rdkit import Chem
from rdkit.Chem import Descriptors, rdMolDescriptors, AllChem, DataStructs
from rdkit.Chem.Draw import rdMolDraw2D

# ── Ionization: strongest basic-center pKa (approx. literature values) ────────
# All of these psychotropics are weak bases (aliphatic amines); a few also carry
# a weakly acidic phenol. The clinically relevant point is the dominant species
# at physiologic pH 7.4, computed below via Henderson–Hasselbalch.
PKA = {
 "fluoxetine":9.8,"norfluoxetine":9.8,"sertraline":9.5,"paroxetine":9.9,
 "citalopram":9.6,"escitalopram":9.6,"venlafaxine":9.4,"desvenlafaxine":9.4,
 "duloxetine":9.7,"amitriptyline":9.4,"nortriptyline":9.7,"imipramine":9.5,
 "desipramine":10.2,"bupropion":8.0,"hydroxybupropion":8.0,"haloperidol":8.3,
 "risperidone":8.2,"paliperidone":8.2,"aripiprazole":7.6,"dehydroaripiprazole":7.6,
 "olanzapine":7.4,
}

# ── Curated membrane-transport notes (disposition/efflux, not drug target) ────
# Applied in enrich(); rendered as the "Membrane transport" region in the tool.
TRANSPORTER = {
 "risperidone":"A well-characterized P-glycoprotein (ABCB1/MDR1) efflux substrate; the pump at the blood–brain barrier limits and regulates how much reaches the brain, and ABCB1 variants have been studied as modifiers of response and side effects.",
 "paliperidone":"An even stronger P-glycoprotein (ABCB1) substrate than risperidone; brisk efflux at the blood–brain barrier — together with its renal elimination — keeps central exposure in check.",
 "aripiprazole":"A P-glycoprotein (ABCB1) efflux substrate; transport at the blood–brain barrier contributes to its brain-to-plasma partitioning.",
 "olanzapine":"A modest P-glycoprotein (ABCB1) substrate; efflux is one factor shaping its blood–brain-barrier handling.",
 "citalopram":"A P-glycoprotein (ABCB1) efflux substrate; because the pump limits how much SSRI reaches the brain, ABCB1 polymorphisms have been studied as predictors of antidepressant response.",
 "escitalopram":"A P-glycoprotein (ABCB1) efflux substrate; ABCB1 variants at the blood–brain barrier have been examined as pharmacogenetic predictors of SSRI response.",
 "paroxetine":"A P-glycoprotein (ABCB1) substrate; efflux at the blood–brain barrier is among the transporter factors linked to variable SSRI exposure.",
 "venlafaxine":"A P-glycoprotein (ABCB1) efflux substrate; blood–brain-barrier transport is among the mechanisms studied in relation to antidepressant response.",
}

# ── Curated old→new "generation evolution" narratives ────────────────────────
# Shown when the two selected drugs form a known design lineage. Each explains
# the structural change and why it was expected to improve on the predecessor.
EVOLUTION = [
 {"from":"amitriptyline","to":"fluoxetine",
  "change":"The fused three-ring (tricyclic) core is discarded for an open-chain phenylpropylamine.",
  "improvement":"Removing the flat tricyclic scaffold eliminates the incidental H₁, muscarinic, and α₁ blockade behind TCA sedation, dry mouth, orthostasis, and — critically — the cardiotoxicity that makes TCA overdose lethal, while SERT reuptake inhibition is retained."},
 {"from":"imipramine","to":"fluoxetine",
  "change":"The dibenzazepine tricyclic is replaced by a selective aryloxy-propylamine.",
  "improvement":"A cleaner single-target (SERT) design keeps antidepressant efficacy but sheds the antihistaminic/anticholinergic/cardiac liabilities of the first tricyclics, improving tolerability and overdose safety."},
 {"from":"citalopram","to":"escitalopram",
  "change":"The racemate is refined to its single active S-enantiomer, discarding the near-inactive R-enantiomer.",
  "improvement":"The R-enantiomer not only lacks activity but partially opposes the S-form at SERT; removing it gives fuller SERT occupancy per milligram, a cleaner dose–response, and improved tolerability — a classic 'chiral switch.'"},
 {"from":"venlafaxine","to":"desvenlafaxine",
  "change":"The active O-desmethyl metabolite is promoted to a stand-alone drug (methoxy → phenol).",
  "improvement":"Dosing the metabolite directly removes the CYP2D6 O-demethylation step, flattening the wide interpatient exposure differences and drug–drug interactions that CYP2D6 variability causes with venlafaxine."},
 {"from":"amitriptyline","to":"nortriptyline",
  "change":"N-demethylation converts the tertiary amine to a secondary amine (the active metabolite, marketed separately).",
  "improvement":"The secondary amine biases reuptake blockade toward norepinephrine and markedly lowers antihistaminic/anticholinergic load, giving less sedation and orthostasis plus a well-defined therapeutic drug-monitoring window."},
 {"from":"imipramine","to":"desipramine",
  "change":"N-demethylation to a secondary amine (active metabolite turned drug).",
  "improvement":"Yields one of the most NET-selective TCAs with reduced serotonergic and antihistaminic effects — cleaner noradrenergic action and a defined TDM target."},
 {"from":"haloperidol","to":"risperidone",
  "change":"A benzisoxazole head is added, layering potent 5-HT₂A antagonism onto D₂ blockade.",
  "improvement":"Combined 5-HT₂A/D₂ antagonism (the defining 'atypical' mechanism) disinhibits nigrostriatal dopamine, sharply reducing the extrapyramidal side effects and tardive-dyskinesia risk of pure D₂ blockers like haloperidol."},
 {"from":"haloperidol","to":"aripiprazole",
  "change":"Full D₂ antagonism is replaced by D₂/5-HT₁A partial agonism plus 5-HT₂A antagonism.",
  "improvement":"Partial agonism stabilizes dopamine tone — enough blockade where dopamine is high, some agonism where it is low — minimizing extrapyramidal symptoms and preventing the hyperprolactinemia caused by tuberoinfundibular D₂ blockade."},
 {"from":"risperidone","to":"paliperidone",
  "change":"The active 9-hydroxy metabolite is developed as its own drug.",
  "improvement":"Adding the 9-hydroxyl shifts elimination from CYP2D6 hepatic metabolism to renal clearance, removing 2D6-driven variability/interactions and enabling smooth once-daily oral and long-acting injectable formulations."},
 {"from":"bupropion","to":"hydroxybupropion",
  "change":"CYP2B6 hydroxylation and cyclization form the morpholinol metabolite.",
  "improvement":"This metabolite accumulates to severalfold higher plasma levels than the parent and carries much of bupropion's noradrenergic/dopaminergic reuptake activity — the reason CYP2B6 status shapes clinical response."},
]

# ── Curated dataset ─────────────────────────────────────────────────────────
# messenger: signal-transduction entry point (Stahl cascade)
#   1 = first-messenger level (neurotransmitter availability / transporter or receptor)
#   2 = second-messenger systems (e.g., inositol / cAMP)
# regions: curated pharmacophore text (fat/water-attracting, protein-binding, receptor-binding)
DATA = [
 # ── SSRIs ───────────────────────────────────────────────────────────────
 {
  "id":"fluoxetine","name":"Fluoxetine","brand":"Prozac","cls":"SSRI",
  "structClass":"Phenylpropylamine","category":"Antidepressant",
  "smiles":"CNCCC(Oc1ccc(cc1)C(F)(F)F)c1ccccc1",
  "year":1974,"yearRef":"Eli Lilly; Wong et al., first synthesis 1972–74 (Life Sci 1974)",
  "messenger":1,
  "messengerNote":"Blocks the serotonin transporter (SERT) at the presynaptic membrane, raising synaptic 5-HT (first messenger). Receptor occupancy then drives downstream G-protein / second-messenger signaling.",
  "generation":"Second-generation antidepressant — the first blockbuster SSRI, designed to drop the tricyclic ring system that gave TCAs their antihistaminic/anticholinergic burden.",
  "metabolites":["norfluoxetine"],
  "lipoNote":"The para-trifluoromethyl (–CF₃) group and both aromatic rings are strongly lipophilic, giving a high logP and long CNS residence.",
  "proteinNote":"Extensive plasma-protein binding (~94%) is driven by the lipophilic trifluoromethyl-phenoxy moiety.",
  "receptorNote":"The protonatable secondary amine forms the key ionic contact in the SERT central binding site; the phenoxy-trifluoromethyl arm occupies the lipophilic subsite that confers SERT selectivity.",
 },
 {
  "id":"norfluoxetine","name":"Norfluoxetine","brand":"(active metabolite)","cls":"SSRI",
  "structClass":"Phenylpropylamine","category":"Antidepressant",
  "smiles":"NCCC(Oc1ccc(cc1)C(F)(F)F)c1ccccc1",
  "year":1974,"yearRef":"N-desmethyl metabolite of fluoxetine",
  "messenger":1,
  "messengerNote":"Equipotent SERT blocker; its very long half-life (4–16 days) sustains serotonergic tone long after fluoxetine is cleared.",
  "generation":"N-desmethyl active metabolite — demethylation of the amine leaves SERT potency essentially intact.",
  "metaboliteOf":"fluoxetine",
  "lipoNote":"Same trifluoromethyl-phenoxy lipophilic core as the parent.",
  "proteinNote":"Highly protein-bound like the parent.",
  "receptorNote":"Loss of the N-methyl group (now a primary amine) does not disrupt the ionic SERT contact — potency is retained.",
 },
 {
  "id":"sertraline","name":"Sertraline","brand":"Zoloft","cls":"SSRI",
  "structClass":"Tetrahydronaphthalenamine (aminotetralin)","category":"Antidepressant",
  "smiles":"CNC1CCC(c2ccc(Cl)c(Cl)c2)c2ccccc21",
  "year":1977,"yearRef":"Pfizer; Koe et al. (J Pharmacol Exp Ther 1983)",
  "messenger":1,
  "messengerNote":"Potent SERT blockade (with weak DAT activity) raising synaptic 5-HT at the first-messenger level.",
  "generation":"Second-generation SSRI; the rigid cis-aminotetralin scaffold locks the pharmacophore geometry for SERT selectivity.",
  "metabolites":[],
  "lipoNote":"The 3,4-dichlorophenyl group and fused naphthalene ring make sertraline highly lipophilic.",
  "proteinNote":"~98% protein-bound, reflecting the dichlorophenyl lipophilic surface.",
  "receptorNote":"The methylamino group anchors to SERT; the dichlorophenyl ring fills the selectivity pocket that discriminates SERT from NET.",
 },
 {
  "id":"paroxetine","name":"Paroxetine","brand":"Paxil","cls":"SSRI",
  "structClass":"Phenylpiperidine","category":"Antidepressant",
  "smiles":"C1CNCC(C1c1ccc(F)cc1)COc1ccc2OCOc2c1",
  "year":1975,"yearRef":"Ferrosan/GSK; first described mid-1970s",
  "messenger":1,
  "messengerNote":"The most potent SERT blocker of the SSRIs; also has clinically relevant muscarinic antagonism.",
  "generation":"Second-generation SSRI with a constrained piperidine core; potency comes at the cost of anticholinergic and discontinuation effects.",
  "metabolites":[],
  "lipoNote":"The fluorophenyl and benzodioxole rings are lipophilic; the piperidine nitrogen adds a polar, water-facing center.",
  "proteinNote":"~95% protein-bound.",
  "receptorNote":"The piperidine nitrogen provides the ionic SERT contact; the benzodioxol-yloxymethyl arm gives paroxetine its exceptional SERT affinity.",
 },
 {
  "id":"citalopram","name":"Citalopram","brand":"Celexa","cls":"SSRI",
  "structClass":"Phthalane (1,3-dihydroisobenzofuran)","category":"Antidepressant",
  "smiles":"CN(C)CCCC1(c2ccc(F)cc2)OCc2cc(C#N)ccc21",
  "year":1972,"yearRef":"Lundbeck; synthesized 1972 (patented 1977)",
  "messenger":1,
  "messengerNote":"Selective SERT blockade; marketed as the racemate (R + S enantiomers).",
  "generation":"Second-generation SSRI. Racemic — the R-enantiomer is nearly inactive and partially antagonizes the active S form, motivating the escitalopram redesign.",
  "metabolites":[],
  "lipoNote":"Fluorophenyl ring is lipophilic; the nitrile and dimethylaminopropyl chain add polarity, giving a moderate logP.",
  "proteinNote":"~80% protein-bound — lower than the more lipophilic SSRIs.",
  "receptorNote":"The tertiary dimethylamino group is the SERT ionic anchor; the cyano-phthalane head sits in the selectivity pocket.",
 },
 {
  "id":"escitalopram","name":"Escitalopram","brand":"Lexapro","cls":"SSRI",
  "structClass":"Phthalane (S-enantiomer)","category":"Antidepressant",
  "smiles":"CN(C)CCC[C@]1(c2ccc(F)cc2)OCc2cc(C#N)ccc21",
  "year":1997,"yearRef":"Lundbeck/Forest; chiral switch approved 2002",
  "messenger":1,
  "messengerNote":"The pharmacologically active S-enantiomer of citalopram; the isolated eutomer gives cleaner SERT blockade at half the milligram dose.",
  "generation":"Chiral-switch redesign of citalopram — removing the inactive/antagonistic R-enantiomer improves efficacy-to-dose and tolerability. A textbook 'newer generation from older' case.",
  "metabolites":[],
  "lipoNote":"Identical atoms to citalopram; same lipophilic fluorophenyl core.",
  "proteinNote":"~56% protein-bound.",
  "receptorNote":"Single S-configuration at the quaternary-like stereocenter optimizes the fit into the SERT primary site — the R-form would clash and even allosterically dampen binding.",
 },
 # ── SNRIs ───────────────────────────────────────────────────────────────
 {
  "id":"venlafaxine","name":"Venlafaxine","brand":"Effexor","cls":"SNRI",
  "structClass":"Phenylethylamine / cyclohexanol","category":"Antidepressant",
  "smiles":"CN(C)CC(c1ccc(OC)cc1)C1(O)CCCCC1",
  "year":1984,"yearRef":"Wyeth; Yardley et al. (J Med Chem 1990)",
  "messenger":1,
  "messengerNote":"Dose-dependent SERT then NET blockade, raising both 5-HT and NE (first messengers).",
  "generation":"Second-generation SNRI; a deliberately 'clean' bicyclic-free design lacking TCA receptor promiscuity.",
  "metabolites":["desvenlafaxine"],
  "lipoNote":"The methoxyphenyl and cyclohexanol rings are moderately lipophilic; the free hydroxyl is a water-facing group giving a low logP.",
  "proteinNote":"Only ~27% protein-bound — among the lowest of the antidepressants, reflecting its polar hydroxyl.",
  "receptorNote":"The dimethylamino group anchors the transporters; the methoxy substituent influences the SERT-vs-NET balance and is the site of activating metabolism.",
 },
 {
  "id":"desvenlafaxine","name":"Desvenlafaxine","brand":"Pristiq","cls":"SNRI",
  "structClass":"Phenol / cyclohexanol","category":"Antidepressant",
  "smiles":"CN(C)CC(c1ccc(O)cc1)C1(O)CCCCC1",
  "year":2007,"yearRef":"Wyeth; O-desmethylvenlafaxine, approved 2008",
  "messenger":1,
  "messengerNote":"Active O-desmethyl metabolite of venlafaxine; SERT/NET blocker marketed as a stand-alone drug to bypass CYP2D6 metabolic variability.",
  "generation":"Newer-generation redesign: promoting the active metabolite to a drug removes the CYP2D6 O-demethylation step, flattening interpatient exposure differences.",
  "metaboliteOf":"venlafaxine",
  "lipoNote":"The phenol –OH is more water-attracting than venlafaxine's methoxy, lowering logP further.",
  "proteinNote":"~30% protein-bound.",
  "receptorNote":"Replacing –OCH₃ with –OH does not disturb the amine's transporter contact; the free phenol is what earlier CYP2D6 metabolism produced.",
 },
 {
  "id":"duloxetine","name":"Duloxetine","brand":"Cymbalta","cls":"SNRI",
  "structClass":"Aryloxy-thiophene propanamine","category":"Antidepressant",
  "smiles":"CNCCC(Oc1cccc2ccccc12)c1cccs1",
  "year":1988,"yearRef":"Eli Lilly; first reported late 1980s",
  "messenger":1,
  "messengerNote":"Balanced, potent SERT and NET blockade across the dosing range.",
  "generation":"Second-generation SNRI; the naphthyloxy/thiophene design gives tighter dual-transporter potency than venlafaxine.",
  "metabolites":[],
  "lipoNote":"The naphthalene and thiophene rings make duloxetine distinctly lipophilic.",
  "proteinNote":"~90% protein-bound, reflecting the naphthyloxy lipophilic surface.",
  "receptorNote":"Shares fluoxetine/atomoxetine's aryloxy-propylamine pharmacophore — the methylamino anchor plus a bulky aryloxy arm tuned here for dual SERT/NET affinity.",
 },
 # ── TCAs (older generation contrast) ─────────────────────────────────────
 {
  "id":"amitriptyline","name":"Amitriptyline","brand":"Elavil","cls":"TCA",
  "structClass":"Dibenzocycloheptene (tricyclic)","category":"Antidepressant",
  "smiles":"CN(C)CCC=C1c2ccccc2CCc2ccccc21",
  "year":1960,"yearRef":"Merck/Roche; introduced ~1961",
  "messenger":1,
  "messengerNote":"Blocks SERT and NET but also antagonizes H1, muscarinic, and α₁ receptors — the 'dirty' first-messenger profile behind TCA side effects.",
  "generation":"First-generation tricyclic antidepressant. Its fused three-ring core is the very scaffold later SSRIs discarded to shed antihistaminic/anticholinergic effects.",
  "metabolites":["nortriptyline"],
  "lipoNote":"The rigid tricyclic ring system is highly lipophilic — driving CNS penetration but also sedation and cardiac tissue accumulation.",
  "proteinNote":"~95% protein-bound.",
  "receptorNote":"The tertiary dimethylaminopropylidene chain drives monoamine-transporter block; the flat tricyclic ring is what promiscuously fits H1/M1/α₁ pockets.",
 },
 {
  "id":"nortriptyline","name":"Nortriptyline","brand":"Pamelor","cls":"TCA",
  "structClass":"Dibenzocycloheptene (secondary amine)","category":"Antidepressant",
  "smiles":"CNCCC=C1c2ccccc2CCc2ccccc21",
  "year":1963,"yearRef":"Active N-desmethyl metabolite of amitriptyline; marketed separately",
  "messenger":1,
  "messengerNote":"Preferential NET blockade with less antihistaminic load than the parent — the secondary amine shifts selectivity toward noradrenergic reuptake.",
  "generation":"Active demethylated metabolite that became its own drug — a 'cleaner' secondary-amine TCA with more favorable tolerability and therapeutic drug monitoring.",
  "metaboliteOf":"amitriptyline",
  "lipoNote":"Same lipophilic tricyclic core as amitriptyline.",
  "proteinNote":"~92% protein-bound.",
  "receptorNote":"Demethylation to a secondary amine biases transporter selectivity toward NET and reduces muscarinic/H1 affinity.",
 },
 {
  "id":"imipramine","name":"Imipramine","brand":"Tofranil","cls":"TCA",
  "structClass":"Dibenzazepine (tricyclic)","category":"Antidepressant",
  "smiles":"CN(C)CCCN1c2ccccc2CCc2ccccc21",
  "year":1958,"yearRef":"Geigy; Kühn 1957–58 — the first clinically used antidepressant",
  "messenger":1,
  "messengerNote":"Blocks SERT and NET with additional H1/M1/α₁ antagonism; the prototype antidepressant.",
  "generation":"First-generation TCA — the original antidepressant, derived from the antipsychotic phenothiazine scaffold by ring modification.",
  "metabolites":["desipramine"],
  "lipoNote":"Highly lipophilic dibenzazepine ring system.",
  "proteinNote":"~90% protein-bound.",
  "receptorNote":"The dimethylaminopropyl side chain drives reuptake blockade; the central azepine nitrogen distinguishes it from the amitriptyline carbon bridge.",
 },
 {
  "id":"desipramine","name":"Desipramine","brand":"Norpramin","cls":"TCA",
  "structClass":"Dibenzazepine (secondary amine)","category":"Antidepressant",
  "smiles":"CNCCCN1c2ccccc2CCc2ccccc21",
  "year":1962,"yearRef":"Active N-desmethyl metabolite of imipramine; marketed separately",
  "messenger":1,
  "messengerNote":"One of the most NET-selective TCAs, with comparatively little serotonergic or antihistaminic action.",
  "generation":"Demethylated active metabolite turned drug — illustrates how removing one N-methyl converts a mixed TCA into a noradrenergic-selective agent.",
  "metaboliteOf":"imipramine",
  "lipoNote":"Same lipophilic dibenzazepine core.",
  "proteinNote":"~90% protein-bound.",
  "receptorNote":"Secondary-amine side chain shifts selectivity strongly toward NET.",
 },
 # ── Atypical antidepressant ──────────────────────────────────────────────
 {
  "id":"bupropion","name":"Bupropion","brand":"Wellbutrin","cls":"NDRI",
  "structClass":"Aminoketone (cathinone-like)","category":"Antidepressant",
  "smiles":"CC(NC(C)(C)C)C(=O)c1cccc(Cl)c1",
  "year":1969,"yearRef":"Burroughs Wellcome; Mehta patent 1969 (approved 1985)",
  "messenger":1,
  "messengerNote":"Weakly blocks NET and DAT while its metabolites carry much of the activity; raises NE and DA at the first-messenger level.",
  "generation":"Second-generation atypical antidepressant — an aminoketone unrelated to TCAs/SSRIs, giving a noradrenergic-dopaminergic profile without serotonergic sexual side effects.",
  "metabolites":["hydroxybupropion"],
  "lipoNote":"The chlorophenyl group is lipophilic; the ketone and amino groups add polarity for a moderate logP.",
  "proteinNote":"~84% protein-bound.",
  "receptorNote":"The tert-butylamino ketone is the reuptake-active pharmacophore; the meta-chlorine tunes potency and the benzylic carbon is the site of activating hydroxylation.",
 },
 {
  "id":"hydroxybupropion","name":"Hydroxybupropion","brand":"(active metabolite)","cls":"NDRI",
  "structClass":"Morpholinol","category":"Antidepressant",
  "smiles":"OC1(c2cccc(Cl)c2)C(C)NC(C)(C)CO1",
  "year":1985,"yearRef":"Major active metabolite of bupropion (CYP2B6); the S,S form is radafaxine",
  "messenger":1,
  "messengerNote":"Reaches severalfold higher plasma levels than bupropion and contributes much of the clinical NET/DAT effect.",
  "generation":"Active hydroxylated metabolite that cyclizes into a morpholinol ring — the metabolite, not the parent, dominates steady-state exposure.",
  "metaboliteOf":"bupropion",
  "lipoNote":"The new hydroxyl and ring oxygen are water-facing, lowering logP relative to bupropion.",
  "proteinNote":"~50% protein-bound.",
  "receptorNote":"Cyclization to the morpholin-2-ol constrains the aminoketone geometry while preserving reuptake activity.",
 },
 # ── Antipsychotics: typical vs atypical ──────────────────────────────────
 {
  "id":"haloperidol","name":"Haloperidol","brand":"Haldol","cls":"Typical Antipsychotic",
  "structClass":"Butyrophenone","category":"Antipsychotic",
  "smiles":"O=C(CCCN1CCC(O)(c2ccc(Cl)cc2)CC1)c1ccc(F)cc1",
  "year":1958,"yearRef":"Janssen; Paul Janssen synthesized 1958",
  "messenger":1,
  "messengerNote":"High-affinity D2 antagonist. Blocking the D2 receptor (a Gi-coupled GPCR) suppresses second-messenger signaling downstream of dopamine.",
  "generation":"First-generation (typical) antipsychotic. Near-pure D2 blockade gives strong antipsychotic effect but heavy extrapyramidal side effects — the problem atypicals were designed to solve.",
  "metabolites":[],
  "lipoNote":"The fluorophenyl-butyrophenone and chlorophenyl-piperidinol are lipophilic; the tertiary hydroxyl adds a polar center.",
  "proteinNote":"~90% protein-bound.",
  "receptorNote":"The butyrophenone chain plus basic piperidine nitrogen give tight D2 fit; it lacks the 5-HT2A pharmacophore that defines atypicals.",
 },
 {
  "id":"risperidone","name":"Risperidone","brand":"Risperdal","cls":"Atypical Antipsychotic",
  "structClass":"Benzisoxazole piperidine","category":"Antipsychotic",
  "smiles":"CC1=C(CCN2CCC(CC2)c2noc3cc(F)ccc23)C(=O)N2CCCCC2=N1",
  "year":1984,"yearRef":"Janssen; synthesized 1984 (approved 1993)",
  "messenger":1,
  "messengerNote":"Combined D2 and 5-HT2A antagonism. Adding potent 5-HT2A blockade to D2 blockade is the defining atypical mechanism, softening extrapyramidal effects.",
  "generation":"Second-generation (atypical) antipsychotic. The benzisoxazole head confers the 5-HT2A affinity that first-generation butyrophenones lacked.",
  "metabolites":["paliperidone"],
  "lipoNote":"The fluoro-benzisoxazole and pyrimidinone rings are lipophilic; the piperidine nitrogen provides a polar center.",
  "proteinNote":"~90% protein-bound.",
  "receptorNote":"The piperidine nitrogen anchors D2; the fluoro-benzisoxazole arm supplies the 5-HT2A affinity, and the 9-position of the tetrahydropyridopyrimidinone is the site of activating hydroxylation.",
 },
 {
  "id":"paliperidone","name":"Paliperidone","brand":"Invega","cls":"Atypical Antipsychotic",
  "structClass":"Benzisoxazole piperidine (9-OH)","category":"Antipsychotic",
  "smiles":"OC1CCCN2C1=NC(C)=C(CCN1CCC(CC1)c1noc3cc(F)ccc13)C2=O",
  "year":2006,"yearRef":"9-hydroxyrisperidone, active metabolite; approved as a drug 2006",
  "messenger":1,
  "messengerNote":"D2/5-HT2A antagonist essentially equivalent to risperidone in receptor profile, but cleared renally rather than by CYP2D6.",
  "generation":"Newer-generation promotion of risperidone's active 9-hydroxy metabolite to a drug — renal clearance bypasses CYP2D6 variability and enables once-daily/long-acting formulations.",
  "metaboliteOf":"risperidone",
  "lipoNote":"The added 9-hydroxyl is water-facing, lowering logP versus risperidone and favoring renal elimination.",
  "proteinNote":"~74% protein-bound.",
  "receptorNote":"Hydroxylation at the 9-position leaves the D2/5-HT2A pharmacophore intact while changing the elimination route.",
 },
 {
  "id":"aripiprazole","name":"Aripiprazole","brand":"Abilify","cls":"Atypical Antipsychotic",
  "structClass":"Dihydroquinolinone / arylpiperazine","category":"Antipsychotic",
  "smiles":"O=C1CCc2cc(OCCCCN3CCN(c4cccc(Cl)c4Cl)CC3)ccc2N1",
  "year":1988,"yearRef":"Otsuka; Oshiro et al. (J Med Chem 1998); approved 2002",
  "messenger":1,
  "messengerNote":"D2 and 5-HT1A partial agonist plus 5-HT2A antagonist — a 'dopamine system stabilizer' rather than a pure blocker.",
  "generation":"Third-generation antipsychotic. Partial rather than full D2 antagonism reduces both extrapyramidal effects and hyperprolactinemia.",
  "metabolites":["dehydroaripiprazole"],
  "lipoNote":"The dichlorophenyl-piperazine and dihydroquinolinone rings are lipophilic; the butoxy linker and amide add polarity.",
  "proteinNote":"~99% protein-bound.",
  "receptorNote":"The arylpiperazine nitrogen provides the D2 contact; the 2,3-dichlorophenyl group and quinolinone tune partial-agonist intrinsic activity.",
 },
 {
  "id":"dehydroaripiprazole","name":"Dehydroaripiprazole","brand":"(active metabolite)","cls":"Atypical Antipsychotic",
  "structClass":"Quinolinone / arylpiperazine","category":"Antipsychotic",
  "smiles":"O=C1C=Cc2cc(OCCCCN3CCN(c4cccc(Cl)c4Cl)CC3)ccc2N1",
  "year":2002,"yearRef":"Active dehydro metabolite of aripiprazole (CYP3A4/2D6)",
  "messenger":1,
  "messengerNote":"Shares the parent's D2 partial-agonist activity and accounts for ~40% of steady-state exposure, extending the effective half-life.",
  "generation":"Active dehydrogenated metabolite — its long half-life contributes to aripiprazole's once-daily and depot dosing.",
  "metaboliteOf":"aripiprazole",
  "lipoNote":"Dehydrogenation of the dihydroquinolinone to a quinolinone slightly increases planarity/lipophilicity.",
  "proteinNote":"Highly protein-bound like the parent.",
  "receptorNote":"The 3,4-double bond flattens the quinolinone but leaves the arylpiperazine D2 pharmacophore intact.",
 },
 {
  "id":"olanzapine","name":"Olanzapine","brand":"Zyprexa","cls":"Atypical Antipsychotic",
  "structClass":"Thienobenzodiazepine","category":"Antipsychotic",
  "smiles":"CN1CCN(CC1)C1=Nc2cc(C)sc2Nc2ccccc21",
  "year":1990,"yearRef":"Lilly; Chakrabarti/Moore ~1990 (approved 1996)",
  "messenger":1,
  "messengerNote":"Broad multi-receptor antagonist — D2, 5-HT2A, H1, M1, α₁ — a 'pharmacologically rich' clozapine-like profile.",
  "generation":"Second-generation (atypical) antipsychotic modeled on clozapine's tricyclic diazepine scaffold, retaining efficacy with less agranulocytosis risk.",
  "metabolites":[],
  "lipoNote":"The tricyclic thienobenzodiazepine ring is lipophilic, underlying strong H1 antagonism, sedation, and weight gain.",
  "proteinNote":"~93% protein-bound.",
  "receptorNote":"The N-methylpiperazine supplies the basic amine for D2/5-HT2A contact; the flat tricyclic core drives the antihistaminic/antimuscarinic breadth.",
 },
]

def esol_logS(m, clogP, mw):
    """Delaney (2004) ESOL estimate of aqueous solubility, log(mol/L)."""
    rb = rdMolDescriptors.CalcNumRotatableBonds(m)
    heavy = m.GetNumHeavyAtoms()
    arom = sum(1 for a in m.GetAtoms() if a.GetIsAromatic())
    ap = (arom / heavy) if heavy else 0
    return 0.16 - 0.63 * clogP - 0.0062 * mw + 0.066 * rb - 0.74 * ap

def minify_svg(svg):
    svg = re.sub(r"<\?xml[^>]*\?>\s*", "", svg)     # strip XML decl/doctype
    svg = re.sub(r"<!DOCTYPE[^>]*>\s*", "", svg)
    svg = re.sub(r"<!--.*?-->", "", svg, flags=re.S)
    svg = re.sub(r"\s*\n\s*", "", svg)              # drop indentation/newlines
    svg = re.sub(r"-?\d+\.\d+", lambda m: ("%g" % round(float(m.group()), 1)), svg)  # 1-dp coords
    return svg.strip()

def svg2d_depiction(m):
    """Clean 2D skeletal depiction as a compact inline SVG string (RDKit MolDraw2DSVG)."""
    mm = Chem.Mol(m)
    AllChem.Compute2DCoords(mm)
    d = rdMolDraw2D.MolDraw2DSVG(360, 280)
    op = d.drawOptions()
    op.addStereoAnnotation = True          # shows (R)/(S) — matters for escitalopram
    op.bondLineWidth = 1.6
    op.clearBackground = False             # transparent → sits on the panel's white area
    op.padding = 0.07
    d.DrawMolecule(mm)
    d.FinishDrawing()
    return minify_svg(d.GetDrawingText())

# ── Qualitative ionization (structure-based; used when no curated pKa) ────────
_BASE = Chem.MolFromSmarts("[NX3;!$(N=*);!$(N-[#6]=[O,S,N]);!$(N-a);!$(N-S=O);!$([N+])]")  # aliphatic amine
_AMIDINE = Chem.MolFromSmarts("[NX3][CX3]=[NX2]")     # amidine / guanidine (strongly basic)
_GUANID = Chem.MolFromSmarts("[NX3][CX3](=[NX2])[NX3]")
_ACID = Chem.MolFromSmarts("[CX3](=O)[OX2H1]")        # carboxylic acid
_SULFONIC = Chem.MolFromSmarts("[SX4](=O)(=O)[OX2H1]")
_TETRAZOLE = Chem.MolFromSmarts("c1nnn[nH]1")

# ── Auto-generated region/cascade text for computed-only entries ─────────────
# Data-driven (not hand-curated): fat/water from computed logP+TPSA, protein
# binding from the site's proteinBinding field, receptor targets from receptorKi.
CLASS_MECH = {
 'MAOI': 'Irreversibly inhibits monoamine oxidase (MAO-A/B), raising synaptic serotonin, norepinephrine, and dopamine — an enzyme target, so no receptor Ki profile.',
 'Benzodiazepine': 'Positive allosteric modulator at the GABAₐ receptor benzodiazepine site, enhancing chloride conductance.',
 'Z-Drug': 'Positive allosteric modulator at the GABAₐ receptor (α₁-preferring benzodiazepine site).',
 'Gabapentinoid': 'Binds the α₂δ auxiliary subunit of voltage-gated calcium channels, reducing excitatory neurotransmitter release.',
 'Mood Stabilizer': 'Acts on intracellular signaling / ion flux rather than a single membrane receptor (mechanism is class-specific).',
 'Beta Blocker': 'Antagonist at β-adrenergic receptors; blunts peripheral autonomic symptoms of anxiety.',
 'Alpha-2 Agonist': 'Agonist at pre-synaptic α₂-adrenergic receptors, reducing central noradrenergic outflow.',
 'Melatonin Agonist': 'Agonist at MT₁/MT₂ melatonin receptors, entraining sleep onset.',
 'Orexin Antagonist': 'Dual orexin (OX₁/OX₂) receptor antagonist, dampening wake drive.',
 'Antihistamine': 'Antagonist at the histamine H₁ receptor (sedating), with variable anticholinergic action.',
 'Anticholinergic': 'Antagonist at muscarinic acetylcholine receptors; used for drug-induced parkinsonism.',
 'Stimulant': 'Blocks/reverses dopamine and norepinephrine transporters, raising synaptic catecholamines.',
 'Wake-Promoting Agent': 'Promotes wakefulness largely via dopamine-transporter inhibition and downstream arousal pathways.',
 'NMDA Antagonist': 'Antagonist at the NMDA glutamate receptor, triggering downstream synaptogenic signaling.',
 'Neuroactive Steroid': 'Positive allosteric modulator at synaptic and extrasynaptic GABAₐ receptors.',
}
_SECOND_MSG = {'lithium', 'valproate'}   # act on intracellular second-messenger systems

def receptor_label_note(rki):
    if not rki:
        return None
    items = sorted(rki.items(), key=lambda kv: kv[1])          # lowest Ki = highest affinity
    top = [f"{r} {('%g' % v)} nM" for r, v in items if v < 1000][:4]
    if not top:
        top = [f"{items[0][0]} {('%g' % items[0][1])} nM"]
    return "Highest-affinity targets (Ki): " + ", ".join(top) + "."

def gen_region_notes(d):
    lp, tp = d.get("logP"), d.get("tpsa")
    # fat vs water-attracting
    if lp is not None:
        if lp >= 3:
            d["lipoNote"] = (f"cLogP {lp} with only {tp} Å² polar surface — lipophilic; "
                             "crosses the blood–brain barrier readily and distributes into tissues.")
        elif lp >= 1:
            d["lipoNote"] = (f"cLogP {lp} ({tp} Å² polar surface) — moderately lipophilic, "
                             "with balanced membrane permeability.")
        else:
            d["lipoNote"] = (f"cLogP {lp} with {tp} Å² polar surface — relatively hydrophilic; "
                             "more water-soluble with less tissue accumulation.")
    # protein-binding
    pb = d.pop("_proteinBinding", None)
    if pb is not None:
        band = "high" if pb >= 90 else ("moderate" if pb >= 50 else "low")
        d["proteinNote"] = f"~{pb}% bound to plasma proteins ({band})."
    # receptor-binding: prefer Ki data, else a class-based mechanism statement
    rki = d.pop("_receptorKi", None)
    rn = receptor_label_note(rki)
    if rn:
        d["receptorNote"] = rn
    elif d.get("cls") in CLASS_MECH:
        d["receptorNote"] = CLASS_MECH[d["cls"]]
    # signal-cascade level
    if d["id"] in _SECOND_MSG:
        d["messenger"] = 2
        d["messengerNote"] = ("Acts intracellularly on second-messenger systems rather than at a single "
                              "membrane receptor.")
    else:
        d["messenger"] = 1
        d["messengerNote"] = ("Acts at the neurotransmitter / receptor level (first messenger); binding then "
                              "drives downstream second-messenger cascades.")

def qualitative_ionization(m):
    base = m.HasSubstructMatch(_BASE) or m.HasSubstructMatch(_AMIDINE) or m.HasSubstructMatch(_GUANID)
    acid = m.HasSubstructMatch(_ACID) or m.HasSubstructMatch(_SULFONIC) or m.HasSubstructMatch(_TETRAZOLE)
    if base and acid:
        return "Amphoteric — carries both a basic amine and an acidic group; near-zwitterionic around pH 7.4"
    if base:
        return "Weak base — predominantly cationic (protonated) at physiologic pH 7.4"
    if acid:
        return "Weak acid — predominantly anionic (deprotonated) at physiologic pH 7.4"
    return "Essentially non-ionizable — largely neutral at physiologic pH 7.4"

def mol3d_block(m):
    """Generate a single 3D conformer (ETKDG + light MMFF) as a MOL block for 3Dmol.js.
    Embedding is bounded (maxIterations) so hard molecules can't loop forever; on
    failure it falls back to flat 2D coordinates so something still renders."""
    mh = Chem.AddHs(m)
    params = AllChem.ETKDGv3()
    params.randomSeed = 42
    params.maxIterations = 200          # bound the embedding search (prevents runaway)
    params.useRandomCoords = False
    if AllChem.EmbedMolecule(mh, params) != 0:
        p2 = AllChem.ETKDGv3(); p2.randomSeed = 7; p2.useRandomCoords = True; p2.maxIterations = 200
        if AllChem.EmbedMolecule(mh, p2) != 0:
            mh2 = Chem.AddHs(m); AllChem.Compute2DCoords(mh2)
            return Chem.MolToMolBlock(mh2)
    try: AllChem.MMFFOptimizeMolecule(mh, maxIters=100)
    except Exception:
        try: AllChem.UFFOptimizeMolecule(mh, maxIters=100)
        except Exception: pass
    return Chem.MolToMolBlock(mh)

def enrich(d):
    m = Chem.MolFromSmiles(d["smiles"])
    if m is None:
        raise ValueError(f"INVALID SMILES for {d['id']}: {d['smiles']}")
    d["mw"] = round(Descriptors.MolWt(m), 2)
    d["formula"] = rdMolDescriptors.CalcMolFormula(m)
    d["logP"] = round(Descriptors.MolLogP(m), 2)
    d["tpsa"] = round(Descriptors.TPSA(m), 1)
    # Lipinski / Veber H-bond and flexibility descriptors (drive the range bars)
    d["hbd"] = Descriptors.NumHDonors(m)
    d["hba"] = Descriptors.NumHAcceptors(m)
    d["rotatableBonds"] = Descriptors.NumRotatableBonds(m)
    if d["id"] in TRANSPORTER:
        d.setdefault("transporterNote", TRANSPORTER[d["id"]])
    d["canonicalSmiles"] = Chem.MolToSmiles(m)
    # lipophilicity descriptor from computed logP
    lp = d["logP"]
    if lp >= 3:   d["lipophilicity"] = "Highly lipophilic"
    elif lp >= 1: d["lipophilicity"] = "Moderately lipophilic"
    elif lp >= 0: d["lipophilicity"] = "Slightly lipophilic"
    else:         d["lipophilicity"] = "Hydrophilic"

    # ── Aqueous solubility (ESOL, estimated) ─────────────────────────────────
    logS = esol_logS(m, d["logP"], d["mw"])
    d["logS"] = round(logS, 2)
    mgml = (10 ** logS) * d["mw"]                        # mol/L * g/mol = g/L = mg/mL
    d["solubility_mgml"] = round(mgml, 3) if mgml >= 0.001 else round(mgml, 5)
    if   logS >= 0:  d["solubilityClass"] = "Very soluble"
    elif logS >= -2: d["solubilityClass"] = "Soluble"
    elif logS >= -4: d["solubilityClass"] = "Slightly soluble"
    else:            d["solubilityClass"] = "Poorly water-soluble"

    # ── Ionization at physiologic pH ─────────────────────────────────────────
    pka = PKA.get(d["id"])
    if pka is not None:                                 # curated numeric pKa (Henderson–Hasselbalch)
        frac_ion = 100.0 / (1.0 + 10 ** (7.4 - pka))
        d["pKa"] = pka
        d["pctIonized"] = round(frac_ion, 1)
        d["ionization"] = ("Weak base &middot; pKₐ ≈ " + str(pka) +
                           " → ~" + str(int(round(frac_ion))) + "% cationic at pH 7.4")
    else:                                               # structure-based qualitative fallback
        d["ionization"] = qualitative_ionization(m)

    # ── Auto-generated region/cascade text for computed-only entries ─────────
    if d.get("computedOnly"):
        gen_region_notes(d)

    # ── Pre-rendered 2D depiction (SVG) and 3D conformer (MOL block) ──────────
    d["svg2d"] = svg2d_depiction(m)
    d["mol3d"] = mol3d_block(m)
    return d

def similarity_matrix(mols):
    """Pairwise Morgan (ECFP4, r=2, 2048-bit) Tanimoto similarity, upper triangle."""
    fps = {i: AllChem.GetMorganFingerprintAsBitVect(m, 2, nBits=2048) for i, m in mols.items()}
    ids = list(mols.keys())
    sim = {}
    for a in range(len(ids)):
        for b in range(a + 1, len(ids)):
            t = DataStructs.TanimotoSimilarity(fps[ids[a]], fps[ids[b]])
            sim[f"{ids[a]}|{ids[b]}"] = round(t, 3)
    return sim

def build_full_dataset():
    """Merge the 21 richly-curated entries with computed-only entries for the
    rest of the 91-medication database. Curated entries keep their region /
    evolution / messenger prose and numeric pKa; the rest get full computed
    chemistry (structure, properties, 2D SVG, 3D conformer, qualitative
    ionization) plus name/brand/class metadata pulled from the site's data."""
    import os
    here = os.path.dirname(os.path.abspath(__file__))
    med_list = json.load(open(os.path.join(here, "med_list.json")))
    import importlib.util
    spec = importlib.util.spec_from_file_location("smiles_map", os.path.join(here, "smiles_map.py"))
    sm = importlib.util.module_from_spec(spec); spec.loader.exec_module(sm)

    curated = {d["id"]: d for d in DATA}
    full = []
    for med in med_list:                                 # preserve the site's ordering
        mid = med["id"]
        if mid in curated:
            full.append(curated[mid])                    # rich curated entry (has smiles)
            continue
        smiles = sm.SMILES.get(mid)
        if not smiles:
            print(f"  !! no SMILES for {mid} — skipped"); continue
        entry = {
            "id": mid, "name": med["name"], "brand": med.get("brand") or "",
            "cls": med.get("cls") or "", "structClass": med.get("cls") or "",
            "category": med.get("category") or "Other",
            "smiles": smiles,
            "year": med.get("year") or "—",
            "computedOnly": True,
            "_proteinBinding": med.get("proteinBinding"),
            "_receptorKi": med.get("receptorKi"),
        }
        note = sm.MOIETY_NOTE.get(mid)
        if note:
            entry["moietyNote"] = note
        full.append(entry)
    # append curated entries that aren't in the main med list (active metabolites
    # such as norfluoxetine / desipramine / hydroxybupropion / dehydroaripiprazole
    # — needed for the metabolite buttons and evolution pairs)
    seen = {d["id"] for d in full}
    for d in DATA:
        if d["id"] not in seen:
            full.append(d)
    return full

def main():
    global DATA
    DATA = build_full_dataset()
    mols = {}
    import time
    for n, d in enumerate(DATA, 1):
        t0 = time.time()
        m = Chem.MolFromSmiles(d["smiles"])
        if m is None:
            raise ValueError(f"INVALID SMILES for {d['id']}")
        mols[d["id"]] = m
        enrich(d)
        print(f"[{n:>2}/{len(DATA)}] {d['id']:<26} {time.time()-t0:5.1f}s", flush=True)
    sim = similarity_matrix(mols)
    # sanity report
    curated_n = sum(1 for d in DATA if not d.get("computedOnly"))
    print(f"{'id':<26}{'MW':>8}{'logP':>7}{'sol mg/mL':>11}  ionization")
    for d in DATA:
        tag = "" if d.get("computedOnly") else " *curated"
        print(f"{d['id']:<26}{d['mw']:>8}{d['logP']:>7}{d['solubility_mgml']:>11}  {d['ionization'][:38]}{tag}")
    print(f"\n{len(DATA)} structures ({curated_n} curated, {len(DATA)-curated_n} computed-only); "
          f"{len(sim)} similarity pairs.")
    # write JS
    js = "/* Chemical structure data for the Chem Structure section.\n"
    js += "   AUTO-GENERATED by build_chem_data.py — MW, formula, logP computed with RDKit;\n"
    js += "   structuralSimilarity is Morgan/ECFP4 Tanimoto. Re-run the builder to regenerate. */\n"
    js += "const CHEM_STRUCTURES = " + json.dumps(DATA, indent=2, ensure_ascii=False) + ";\n"
    js += "const CHEM_EVOLUTION = " + json.dumps(EVOLUTION, indent=2, ensure_ascii=False) + ";\n"
    js += "const CHEM_SIMILARITY = " + json.dumps(sim, ensure_ascii=False) + ";\n"
    js += "if (typeof module !== 'undefined') { module.exports = { CHEM_STRUCTURES, CHEM_EVOLUTION, CHEM_SIMILARITY }; }\n"
    out = sys.argv[1] if len(sys.argv) > 1 else "chem-structure-data.js"
    with open(out, "w") as f:
        f.write(js)
    print(f"\nWrote {out} with {len(DATA)} structures.")

if __name__ == "__main__":
    main()
