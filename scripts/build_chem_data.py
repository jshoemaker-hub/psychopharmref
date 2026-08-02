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
 # ── Anticholinergic (peripherally restricted contrast) ───────────────────
 {
  "id":"trospium","name":"Trospium","brand":"Sanctura","cls":"Antimuscarinic (quaternary amine)",
  "structClass":"Quaternary azoniaspiro tropane benzilate ester","category":"Anticholinergic",
  "smiles":"O=C(O[C@H]1C[C@@H]2CC[C@H](C1)[N+]23CCCC3)C(O)(c1ccccc1)c1ccccc1",
  "year":1967,"yearRef":"Developed by Pfleger (Germany); FDA-approved 2004 for overactive bladder",
  "messenger":1,
  "messengerNote":"A competitive muscarinic antagonist for overactive bladder. Its psychiatric relevance is as a contrast: because it is a permanently charged quaternary amine, it barely enters the brain and adds little to anticholinergic cognitive burden - unlike the tertiary-amine antimuscarinics (benztropine, trihexyphenidyl, diphenhydramine).",
  "lipoNote":"The permanent positive charge on the quaternary nitrogen makes trospium unable to cross the blood-brain barrier by passive diffusion - the structural reason its central (memory/confusion) side effects are minimal.",
  "proteinNote":"Roughly 50-85% plasma-protein bound; largely excreted unchanged in urine.",
  "receptorNote":"Non-selective antagonist across the M1-M5 muscarinic receptors, acting peripherally on the detrusor muscle rather than centrally.",
 },
 # ── Peptides & biologics (nootropic / anxiolytic / wellness) ─────────────
 {
  "id":"semax","name":"Semax","brand":"ACTH(4-7) analog","cls":"Nootropic Peptide",
  "structClass":"Heptapeptide (Met-Glu-His-Phe-Pro-Gly-Pro)","category":"Peptide/Biologic",
  "smiles":"CSCC[C@H](N)C(=O)N[C@@H](CCC(=O)O)C(=O)N[C@@H](Cc1c[nH]cn1)C(=O)N[C@@H](Cc1ccccc1)C(=O)N1CCC[C@H]1C(=O)NCC(=O)N1CCC[C@H]1C(=O)O",
  "year":1982,"yearRef":"Institute of Molecular Genetics, Russia; ACTH(4-10) fragment analog with a Pro-Gly-Pro peptidase-resistant tail",
  "messenger":1,
  "messengerNote":"Not a classic receptor ligand; upregulates BDNF and NGF expression and modulates monoaminergic tone. Approved in Russia for cognition/stroke; not FDA-approved.",
  "lipoNote":"A highly polar, water-soluble peptide that does not passively cross the blood-brain barrier - hence intranasal dosing.",
  "receptorNote":"The melanocortin-derived ACTH(4-7) core drives neurotrophic (BDNF/NGF) effects; the appended Pro-Gly-Pro blocks aminopeptidase degradation, extending its short peptide half-life.",
 },
 {
  "id":"selank","name":"Selank","brand":"tuftsin analog","cls":"Anxiolytic Peptide",
  "structClass":"Heptapeptide (Thr-Lys-Pro-Arg-Pro-Gly-Pro)","category":"Peptide/Biologic",
  "smiles":"C[C@@H](O)[C@H](N)C(=O)N[C@@H](CCCCN)C(=O)N1CCC[C@H]1C(=O)N[C@@H](CCCNC(=N)N)C(=O)N1CCC[C@H]1C(=O)NCC(=O)N1CCC[C@H]1C(=O)O",
  "year":1990,"yearRef":"Institute of Molecular Genetics, Russia; tuftsin (Thr-Lys-Pro-Arg) analog stabilized with Pro-Gly-Pro",
  "messenger":1,
  "messengerNote":"Anxiolytic without sedation in Russian trials; modulates GABAergic and serotonergic tone and slows enkephalin breakdown. Approved in Russia; not FDA-approved.",
  "lipoNote":"Polar heptapeptide given intranasally; poor passive CNS penetration.",
  "receptorNote":"Acts through neuromodulation (enkephalinase inhibition, GABA/serotonin systems) rather than a single defined receptor; the Pro-Gly-Pro tail confers peptidase resistance.",
 },
 {
  "id":"dihexa","name":"Dihexa","brand":"PNB-0408","cls":"Nootropic Peptide",
  "structClass":"Angiotensin IV analog (N-hexanoyl-Tyr-Ile-6-aminohexanamide)","category":"Peptide/Biologic",
  "smiles":"CCCCCC(=O)N[C@@H](Cc1ccc(O)cc1)C(=O)N[C@@H]([C@@H](C)CC)C(=O)NCCCCCC(N)=O",
  "year":2012,"yearRef":"Harding lab, Washington State University; angiotensin IV-derived synaptogenic peptide",
  "messenger":1,
  "messengerNote":"Proposed to promote synaptogenesis by activating the HGF/c-Met system (binds HGF with Kd approx. 65 pM). Mostly preclinical; a key efficacy paper was retracted in 2025.",
  "lipoNote":"The N-hexanoyl fatty tail and tyrosine substitution add lipophilicity, giving oral bioavailability and a far longer half-life than parent angiotensin IV.",
  "receptorNote":"Augments hepatocyte growth factor signaling at the c-Met receptor tyrosine kinase, the proposed driver of its dendritic-spine/synaptogenic effects.",
 },
 {
  "id":"pe22-28","name":"PE-22-28","brand":"mini-spadin","cls":"Antidepressant Peptide",
  "structClass":"Spadin analog heptapeptide (Gly-Val-Ser-Trp-Gly-Leu-Arg)","category":"Peptide/Biologic",
  "smiles":"CC(C)C[C@H](NC(=O)CNC(=O)[C@H](Cc1c[nH]c2ccccc12)NC(=O)[C@H](CO)NC(=O)[C@@H](NC(=O)CN)C(C)C)C(=O)N[C@@H](CCCNC(=N)N)C(=O)O",
  "year":2017,"yearRef":"Mazella/Borsotto; residues 22-28 of the sortilin-derived peptide spadin",
  "messenger":1,
  "messengerNote":"Selective TREK-1 potassium-channel blocker (IC50 approx. 0.12 nM); blocking TREK-1 disinhibits serotonergic firing, producing rapid antidepressant-like effects in rodents. Preclinical.",
  "lipoNote":"Small polar heptapeptide; engineered for improved plasma stability over spadin.",
  "receptorNote":"Inhibits the TREK-1 (K2P) background potassium channel - the same channel whose deletion is antidepressant in mice - rather than a monoamine transporter.",
 },
 {
  "id":"dsip","name":"DSIP","brand":"delta sleep-inducing peptide","cls":"Sleep Peptide",
  "structClass":"Nonapeptide (Trp-Ala-Gly-Gly-Asp-Ala-Ser-Gly-Glu)","category":"Peptide/Biologic",
  "smiles":"C[C@H](NC(=O)[C@H](CC(=O)O)NC(=O)CNC(=O)CNC(=O)[C@H](C)NC(=O)[C@@H](N)Cc1c[nH]c2ccccc12)C(=O)N[C@@H](CO)C(=O)NCC(=O)N[C@@H](CCC(=O)O)C(=O)O",
  "year":1977,"yearRef":"Schoenenberger & Monnier, isolated from rabbit brain",
  "messenger":1,
  "messengerNote":"An endogenous peptide named for sleep-promoting effects, with inconsistent human efficacy data. No established molecular target; research/gray-market use only.",
  "lipoNote":"Polar nonapeptide; unstable in plasma with a very short half-life.",
  "receptorNote":"No well-defined receptor; proposed neuromodulatory and stress-buffering actions remain poorly characterized.",
 },
 {
  "id":"oxytocin","name":"Oxytocin","brand":"Pitocin","cls":"Neuropeptide Hormone",
  "structClass":"Cyclic nonapeptide (Cys1-Cys6 disulfide, C-terminal glycinamide)","category":"Peptide/Biologic",
  "smiles":"CC[C@H](C)[C@H]1C(=O)N[C@H](C(=O)N[C@H](C(=O)N[C@@H](CSSC[C@@H](C(=O)N[C@H](C(=O)N1)CC2=CC=C(C=C2)O)N)C(=O)N3CCC[C@H]3C(=O)N[C@@H](CC(C)C)C(=O)NCC(=O)N)CC(=O)N)CCC(=O)N",
  "year":1953,"yearRef":"du Vigneaud - first polypeptide hormone synthesized (Nobel Prize 1955)",
  "messenger":1,
  "messengerNote":"Agonist at the oxytocin receptor. Intranasal trials for social bonding, autism, and anxiety/depression have been mixed to mostly negative in reviews; not approved for mental-health use.",
  "lipoNote":"Polar cyclic peptide; the intramolecular disulfide bridge (Cys1-Cys6) closes the ring that its receptor recognizes.",
  "receptorNote":"Activates the oxytocin receptor, a Gq-coupled GPCR; central signaling is implicated in trust, bonding, and stress regulation.",
 },
 {
  "id":"bpc157","name":"BPC-157","brand":"pentadecapeptide BPC 157","cls":"Wellness Peptide",
  "structClass":"Pentadecapeptide (gastric BPC fragment, 15 residues)","category":"Peptide/Biologic",
  "smiles":"CC(C)C[C@H](NC(=O)CNC(=O)[C@H](C)NC(=O)[C@H](CC(=O)O)NC(=O)[C@H](CC(=O)O)NC(=O)[C@H](C)NC(=O)[C@@H]1CCCN1C(=O)[C@H](CCCCN)NC(=O)CNC(=O)[C@@H]1CCCN1C(=O)[C@@H]1CCCN1C(=O)[C@@H]1CCCN1C(=O)[C@H](CCC(=O)O)NC(=O)CN)C(=O)N[C@H](C(=O)O)C(C)C",
  "year":1991,"yearRef":"Derived from a fragment of human gastric juice protein BPC (body protection compound)",
  "messenger":1,
  "messengerNote":"Marketed for tissue healing, with occasional gut-brain/mood claims. Mental-health evidence is preclinical/anecdotal; the FDA has flagged safety concerns and restricted its compounding.",
  "lipoNote":"Large, polar 15-mer peptide; note how far it sits outside small-molecule druglikeness ranges.",
  "receptorNote":"Proposed angiogenic and cytoprotective actions via the VEGFR2-Akt-eNOS pathway rather than a neurotransmitter receptor; mechanism in the CNS is not established.",
 },
 # ── Neurotransmitters (endogenous first messengers) ──────────────────────
 {
  "id":"serotonin","name":"Serotonin","brand":"5-HT","cls":"Monoamine (indolamine)",
  "structClass":"Tryptamine (5-hydroxytryptamine)","category":"Neurotransmitter",
  "smiles":"NCCc1c[nH]c2ccc(O)cc12",
  "year":1948,"yearRef":"Rapport, Green & Page - isolation of 'serotonin'",
  "messenger":1,
  "messengerNote":"The endogenous first messenger whose synaptic level SSRIs raise by blocking its reuptake (SERT). Made from tryptophan; further converted to melatonin.",
  "lipoNote":"Small, polar biogenic amine; does not cross the blood-brain barrier, so central serotonin is made locally from tryptophan.",
  "receptorNote":"Endogenous agonist across the 5-HT1 through 5-HT7 receptor families that psychiatric drugs target or mimic.",
 },
 {
  "id":"dopamine","name":"Dopamine","brand":"DA","cls":"Monoamine (catecholamine)",
  "structClass":"Catecholamine","category":"Neurotransmitter",
  "smiles":"NCCc1ccc(O)c(O)c1",
  "year":1957,"yearRef":"Carlsson - established dopamine as a neurotransmitter",
  "messenger":1,
  "messengerNote":"The reward/motor transmitter that antipsychotics block downstream (D2) and stimulants elevate. Synthesized from tyrosine via L-DOPA.",
  "lipoNote":"Polar catecholamine; peripherally administered dopamine cannot enter the brain (why L-DOPA is used in Parkinson disease).",
  "receptorNote":"Endogenous agonist at the D1-D5 dopamine receptors; cleared by the dopamine transporter (DAT).",
 },
 {
  "id":"norepinephrine","name":"Norepinephrine","brand":"NE / noradrenaline","cls":"Monoamine (catecholamine)",
  "structClass":"beta-hydroxylated catecholamine","category":"Neurotransmitter",
  "smiles":"NC[C@@H](O)c1ccc(O)c(O)c1",
  "year":1946,"yearRef":"von Euler - identified as the sympathetic neurotransmitter",
  "messenger":1,
  "messengerNote":"The arousal/vigilance transmitter that SNRIs and NRIs preserve by blocking its reuptake (NET). Made from dopamine by beta-hydroxylation.",
  "lipoNote":"Polar catecholamine with an added benzylic hydroxyl; does not cross the blood-brain barrier.",
  "receptorNote":"Endogenous agonist at alpha- and beta-adrenergic receptors; recaptured by the norepinephrine transporter (NET).",
 },
 {
  "id":"epinephrine","name":"Epinephrine","brand":"adrenaline","cls":"Monoamine (catecholamine)",
  "structClass":"N-methyl catecholamine","category":"Neurotransmitter",
  "smiles":"CNC[C@@H](O)c1ccc(O)c(O)c1",
  "year":1901,"yearRef":"Takamine & Aldrich - first hormone isolated in pure form",
  "messenger":1,
  "messengerNote":"Chiefly an adrenal stress hormone; the N-methylated end of the catecholamine pathway, driving the fight-or-flight response felt in panic and anxiety.",
  "lipoNote":"Polar catecholamine; acts peripherally and at the sympathetic interface rather than crossing into the brain.",
  "receptorNote":"Potent agonist at alpha- and beta-adrenergic receptors; the extra N-methyl group increases beta-receptor activity versus norepinephrine.",
 },
 {
  "id":"acetylcholine","name":"Acetylcholine","brand":"ACh","cls":"Quaternary amine",
  "structClass":"Choline ester (permanent cation)","category":"Neurotransmitter",
  "smiles":"CC(=O)OCC[N+](C)(C)C",
  "year":1914,"yearRef":"Dale & Loewi - first neurotransmitter identified (Loewi's 1921 'Vagusstoff')",
  "messenger":1,
  "messengerNote":"The cognition/memory transmitter enhanced by cholinesterase inhibitors and blocked by anticholinergics. Its central loss is central to Alzheimer dementia.",
  "lipoNote":"A permanently charged quaternary ammonium ester - fully ionized and water-soluble, so it does not cross membranes passively.",
  "receptorNote":"Agonist at both nicotinic (ligand-gated ion channel) and muscarinic (GPCR) acetylcholine receptors; hydrolyzed by acetylcholinesterase.",
 },
 {
  "id":"histamine","name":"Histamine","brand":"","cls":"Monoamine (imidazole)",
  "structClass":"Imidazole ethylamine","category":"Neurotransmitter",
  "smiles":"NCCc1c[nH]cn1",
  "year":1910,"yearRef":"Dale & Laidlaw - characterization of histamine",
  "messenger":1,
  "messengerNote":"A wakefulness transmitter; central H1 blockade by many psychotropics causes sedation and weight gain. Made by decarboxylation of histidine.",
  "lipoNote":"Small, polar amine; does not cross the blood-brain barrier, so brain histamine is synthesized locally.",
  "receptorNote":"Endogenous agonist at H1-H4 receptors; H1 antagonism underlies the sedative burden of TCAs, mirtazapine, and low-potency antipsychotics.",
 },
 {
  "id":"glutamate","name":"Glutamate","brand":"Glu","cls":"Excitatory amino acid",
  "structClass":"Acidic (dicarboxylic) amino acid","category":"Neurotransmitter",
  "smiles":"N[C@@H](CCC(=O)O)C(=O)O",
  "year":1959,"yearRef":"Curtis & Watkins - excitatory action established (isolated 1866)",
  "messenger":1,
  "messengerNote":"The brain's principal excitatory transmitter; its NMDA receptor is the target of ketamine/esketamine's rapid antidepressant action.",
  "lipoNote":"Amphoteric, highly polar amino acid held near-zwitterionic at physiologic pH; tightly compartmentalized by transporters.",
  "receptorNote":"Endogenous agonist at ionotropic NMDA, AMPA, and kainate receptors and metabotropic mGlu receptors.",
 },
 {
  "id":"gaba","name":"GABA","brand":"gamma-aminobutyric acid","cls":"Inhibitory amino acid",
  "structClass":"gamma-amino acid","category":"Neurotransmitter",
  "smiles":"NCCCC(=O)O",
  "year":1950,"yearRef":"Roberts & Awapara - GABA identified in brain (inhibitory role 1957)",
  "messenger":1,
  "messengerNote":"The brain's principal inhibitory transmitter; benzodiazepines, Z-drugs, barbiturates, and neurosteroids all work by potentiating its GABA-A receptor.",
  "lipoNote":"Small amphoteric amino acid, near-zwitterionic at pH 7.4; peripheral GABA does not readily enter the brain.",
  "receptorNote":"Agonist at ionotropic GABA-A receptors (the benzodiazepine-modulated chloride channel) and metabotropic GABA-B receptors.",
 },
 {
  "id":"glycine","name":"Glycine","brand":"Gly","cls":"Inhibitory amino acid",
  "structClass":"Simplest amino acid","category":"Neurotransmitter",
  "smiles":"NCC(=O)O",
  "year":1965,"yearRef":"Aprison & Werman - inhibitory neurotransmitter role (isolated 1820)",
  "messenger":1,
  "messengerNote":"Dual role: inhibitory transmitter in the spinal cord/brainstem and an obligatory co-agonist that the NMDA receptor also requires to open.",
  "lipoNote":"The smallest, highly polar amino acid; near-zwitterionic at physiologic pH.",
  "receptorNote":"Agonist at strychnine-sensitive glycine receptors and a required co-agonist at the NMDA receptor glycine (GlyB) site.",
 },
 {
  "id":"adenosine","name":"Adenosine","brand":"","cls":"Purine nucleoside",
  "structClass":"Purine ribonucleoside","category":"Neurotransmitter",
  "smiles":"OC[C@H]1O[C@@H](n2cnc3c(N)ncnc32)[C@H](O)[C@@H]1O",
  "year":1929,"yearRef":"Drury & Szent-Gyorgyi - cardiac/CNS actions of adenosine",
  "messenger":1,
  "messengerNote":"A neuromodulator that accumulates with wakefulness to build sleep pressure; caffeine promotes alertness by blocking its receptors.",
  "lipoNote":"Polar nucleoside moved across membranes by dedicated nucleoside transporters.",
  "receptorNote":"Endogenous agonist at A1, A2A, A2B, and A3 receptors; the A1/A2A subtypes mediate its sedative and adenosine-antagonist (caffeine) effects.",
 },
 {
  "id":"anandamide","name":"Anandamide","brand":"AEA","cls":"Endocannabinoid",
  "structClass":"Fatty-acid ethanolamide (arachidonoylethanolamide)","category":"Neurotransmitter",
  "smiles":"CCCCC/C=C\\C/C=C\\C/C=C\\C/C=C\\CCCC(=O)NCCO",
  "year":1992,"yearRef":"Devane & Mechoulam - isolation of the first endocannabinoid",
  "messenger":1,
  "messengerNote":"An endogenous cannabinoid ('bliss' lipid) synthesized on demand and acting as a retrograde messenger to dampen synaptic transmission; linked to mood and stress buffering.",
  "lipoNote":"A highly lipophilic long-chain fatty-acid amide - it is membrane-derived and diffuses locally rather than being stored in vesicles.",
  "receptorNote":"Partial agonist at CB1 (central) and CB2 cannabinoid receptors; degraded by fatty-acid amide hydrolase (FAAH).",
 },
 # ── Amino acids (precursors & modulators of psychiatric relevance) ────────
 {
  "id":"tryptophan","name":"Tryptophan","brand":"Trp","cls":"Essential amino acid",
  "structClass":"Aromatic (indole) amino acid","category":"Amino Acid",
  "smiles":"N[C@@H](Cc1c[nH]c2ccccc12)C(=O)O",
  "year":1901,"yearRef":"Hopkins & Cole - isolation of tryptophan",
  "messenger":1,
  "messengerNote":"The dietary precursor of serotonin (and thence melatonin); experimental tryptophan depletion lowers mood, underscoring the serotonin link.",
  "lipoNote":"Amphoteric aromatic amino acid; carried into the brain by the large neutral amino acid transporter, where it competes with other amino acids.",
  "receptorNote":"Not a receptor ligand itself - the rate-limiting substrate for serotonin synthesis via tryptophan hydroxylase to 5-HTP.",
 },
 {
  "id":"tyrosine","name":"Tyrosine","brand":"Tyr","cls":"Amino acid",
  "structClass":"Aromatic (phenolic) amino acid","category":"Amino Acid",
  "smiles":"N[C@@H](Cc1ccc(O)cc1)C(=O)O",
  "year":1846,"yearRef":"Liebig - isolated from casein",
  "messenger":1,
  "messengerNote":"The precursor of the catecholamines dopamine, norepinephrine, and epinephrine (via L-DOPA).",
  "lipoNote":"Amphoteric amino acid with a phenolic side chain; brain uptake via the large neutral amino acid transporter.",
  "receptorNote":"Not a receptor ligand - the substrate that tyrosine hydroxylase converts to L-DOPA, the committed step of catecholamine synthesis.",
 },
 {
  "id":"phenylalanine","name":"Phenylalanine","brand":"Phe","cls":"Essential amino acid",
  "structClass":"Aromatic amino acid","category":"Amino Acid",
  "smiles":"N[C@@H](Cc1ccccc1)C(=O)O",
  "year":1879,"yearRef":"Schulze & Barbieri - isolation of phenylalanine",
  "messenger":1,
  "messengerNote":"Converted to tyrosine and thence the catecholamines; its buildup in untreated PKU causes intellectual disability, showing how amino-acid balance shapes the brain.",
  "lipoNote":"Amphoteric aromatic amino acid transported into the brain by the large neutral amino acid carrier.",
  "receptorNote":"Not a receptor ligand - an upstream substrate feeding catecholamine synthesis through tyrosine.",
 },
 {
  "id":"glutamine","name":"Glutamine","brand":"Gln","cls":"Amino acid",
  "structClass":"Amino-acid amide","category":"Amino Acid",
  "smiles":"N[C@@H](CCC(N)=O)C(=O)O",
  "year":1883,"yearRef":"Schulze & Bosshard - isolation of glutamine",
  "messenger":1,
  "messengerNote":"The neutral shuttle of the glutamate-glutamine cycle: astrocytes convert transmitter glutamate to glutamine, return it to neurons, and it is remade into glutamate or GABA.",
  "lipoNote":"Polar amino-acid amide; the transportable, non-excitotoxic form used to move glutamate carbon safely between cells.",
  "receptorNote":"Not a receptor ligand - the metabolic precursor replenishing both glutamate and GABA pools.",
 },
 {
  "id":"d-serine","name":"D-Serine","brand":"D-Ser","cls":"D-amino acid",
  "structClass":"D-amino acid","category":"Amino Acid",
  "smiles":"N[C@H](CO)C(=O)O",
  "year":1992,"yearRef":"Identified as an endogenous brain D-amino acid and NMDA co-agonist",
  "messenger":1,
  "messengerNote":"An unusual D-amino acid made in the brain that serves as the primary co-agonist at forebrain NMDA receptors; studied as an augmentation strategy in schizophrenia.",
  "lipoNote":"Small, polar amino acid; its D-configuration resists standard L-amino-acid metabolism.",
  "receptorNote":"Endogenous co-agonist at the NMDA receptor glycine (GlyB) site, gating receptor opening alongside glutamate.",
 },
 {
  "id":"l-theanine","name":"L-Theanine","brand":"","cls":"Non-protein amino acid",
  "structClass":"Glutamate analog (gamma-glutamylethylamide)","category":"Amino Acid",
  "smiles":"CCNC(=O)CC[C@H](N)C(=O)O",
  "year":1949,"yearRef":"Sakato - isolated from green tea (Camellia sinensis)",
  "messenger":1,
  "messengerNote":"The tea amino acid associated with 'calm alertness'; modest evidence for reducing anxiety and blunting the jittery edge of caffeine.",
  "lipoNote":"Polar glutamate analog that does cross the blood-brain barrier via amino-acid transport, unlike glutamate itself.",
  "receptorNote":"Weak actions at glutamate receptors and on GABA/serotonin/dopamine tone; not a potent single-target ligand.",
 },
 # ── Hormones (endocrine signals with psychiatric relevance) ──────────────
 {
  "id":"cortisol","name":"Cortisol","brand":"hydrocortisone","cls":"Glucocorticoid",
  "structClass":"21-carbon steroid","category":"Hormone",
  "smiles":"C[C@]12C[C@H](O)[C@H]3[C@@H](CCC4=CC(=O)CC[C@]34C)[C@@H]1CC[C@]2(O)C(=O)CO",
  "year":1937,"yearRef":"Reichstein/Kendall - isolation of adrenal cortical steroids",
  "messenger":1,
  "messengerNote":"The end product of the HPA stress axis; chronic elevation is linked to depression, hippocampal changes, and impaired cognition. Acts on gene transcription rather than a fast synaptic signal.",
  "lipoNote":"A lipophilic steroid that crosses membranes freely to reach intracellular receptors.",
  "receptorNote":"Agonist at the intracellular glucocorticoid (and, at high levels, mineralocorticoid) receptor, which acts as a nuclear transcription factor.",
 },
 {
  "id":"melatonin","name":"Melatonin","brand":"","cls":"Pineal hormone",
  "structClass":"Methoxy-indole (N-acetyl-5-methoxytryptamine)","category":"Hormone",
  "smiles":"CC(=O)NCCc1c[nH]c2cc(OC)ccc12",
  "year":1958,"yearRef":"Lerner - isolation of melatonin from pineal gland",
  "messenger":1,
  "messengerNote":"The circadian 'darkness hormone' that signals biological night; used for insomnia and circadian-rhythm disorders and mimicked by ramelteon and agomelatine.",
  "lipoNote":"Moderately lipophilic indole that readily crosses the blood-brain barrier.",
  "receptorNote":"Agonist at the MT1 and MT2 melatonin GPCRs, entraining sleep onset and circadian phase.",
 },
 {
  "id":"estradiol","name":"Estradiol","brand":"E2","cls":"Estrogen",
  "structClass":"18-carbon steroid (phenolic A-ring)","category":"Hormone",
  "smiles":"C[C@]12CC[C@H]3[C@@H](CCc4cc(O)ccc34)[C@@H]1CC[C@@H]2O",
  "year":1935,"yearRef":"Doisy/Butenandt - isolation of estradiol",
  "messenger":1,
  "messengerNote":"The principal estrogen; its fluctuation and withdrawal are tied to premenstrual, postpartum, and perimenopausal mood changes, partly through serotonergic modulation.",
  "lipoNote":"Lipophilic steroid that crosses into the brain and cells to reach nuclear receptors.",
  "receptorNote":"Agonist at intracellular estrogen receptors (ERalpha/ERbeta) and rapid membrane ER signaling that modulate serotonergic and synaptic function.",
 },
 {
  "id":"testosterone","name":"Testosterone","brand":"","cls":"Androgen",
  "structClass":"19-carbon steroid","category":"Hormone",
  "smiles":"C[C@]12CC[C@H]3[C@@H](CCC4=CC(=O)CC[C@]34C)[C@@H]1CC[C@@H]2O",
  "year":1935,"yearRef":"Butenandt/Ruzicka - isolation and synthesis of testosterone",
  "messenger":1,
  "messengerNote":"The principal androgen; low levels are associated with depressed mood, fatigue, and reduced drive, and are sometimes screened in treatment-resistant depression.",
  "lipoNote":"Lipophilic steroid crossing membranes to reach intracellular receptors.",
  "receptorNote":"Agonist at the intracellular androgen receptor (a nuclear transcription factor); also aromatized to estradiol in brain.",
 },
 {
  "id":"progesterone","name":"Progesterone","brand":"","cls":"Progestogen",
  "structClass":"21-carbon steroid","category":"Hormone",
  "smiles":"C[C@]12CC[C@H]3[C@@H](CCC4=CC(=O)CC[C@]34C)[C@@H]1CC[C@@H]2C(C)=O",
  "year":1934,"yearRef":"Butenandt/Slotta - isolation of progesterone",
  "messenger":1,
  "messengerNote":"Beyond its reproductive role, it is the precursor of allopregnanolone - the GABAergic neurosteroid whose formulations (brexanolone, zuranolone) treat postpartum depression.",
  "lipoNote":"Lipophilic steroid that crosses the blood-brain barrier and is further metabolized to neuroactive steroids.",
  "receptorNote":"Agonist at the intracellular progesterone receptor; its metabolite allopregnanolone potentiates GABA-A receptors.",
 },
 {
  "id":"pregnenolone","name":"Pregnenolone","brand":"","cls":"Neurosteroid precursor",
  "structClass":"21-carbon steroid","category":"Hormone",
  "smiles":"CC(=O)[C@H]1CC[C@H]2[C@@H]3CC=C4C[C@@H](O)CC[C@]4(C)[C@H]3CC[C@]12C",
  "year":1934,"yearRef":"Butenandt - characterization of pregnenolone",
  "messenger":1,
  "messengerNote":"The upstream 'mother' steroid from which all steroid hormones and neuroactive steroids are made; investigated for mood, cognition, and cannabis-use disorder.",
  "lipoNote":"Lipophilic steroid precursor synthesized in brain (a true neurosteroid) as well as the adrenals and gonads.",
  "receptorNote":"Chiefly a biosynthetic precursor; its sulfate and downstream metabolites modulate NMDA and GABA-A receptors.",
 },
 {
  "id":"thyroxine","name":"Thyroxine","brand":"T4 / levothyroxine","cls":"Thyroid hormone",
  "structClass":"Iodinated tyrosine derivative (T4)","category":"Hormone",
  "smiles":"N[C@@H](Cc1cc(I)c(Oc2cc(I)c(O)c(I)c2)c(I)c1)C(=O)O",
  "year":1914,"yearRef":"Kendall - isolation of thyroxine",
  "messenger":1,
  "messengerNote":"The main thyroid hormone (a prohormone for T3); hypothyroidism can mimic depression, and T3/T4 are used to augment antidepressants.",
  "lipoNote":"A large iodinated amino-acid derivative carried in blood by binding proteins and moved into cells by specific transporters.",
  "receptorNote":"Converted to the active T3, which binds intracellular thyroid hormone receptors acting as nuclear transcription factors.",
 },
 # ── Illicit / controlled drugs (mechanistic contrasts) ───────────────────
 {
  "id":"cocaine","name":"Cocaine","brand":"","cls":"Stimulant (tropane)",
  "structClass":"Tropane alkaloid ester","category":"Illicit Drug",
  "smiles":"CN1[C@H]2CC[C@@H]1[C@@H](C(=O)OC)[C@H](OC(=O)c1ccccc1)C2",
  "year":1860,"yearRef":"Niemann - isolation from coca leaf",
  "messenger":1,
  "messengerNote":"A powerful reinforcing stimulant that raises synaptic dopamine (and norepinephrine/serotonin) by blocking their transporters; high addiction and cardiovascular risk.",
  "lipoNote":"A lipophilic tropane base that crosses the blood-brain barrier quickly, giving its rapid, intense onset.",
  "receptorNote":"Blocks the dopamine (DAT), norepinephrine (NET), and serotonin (SERT) transporters, flooding synapses with monoamines.",
 },
 {
  "id":"mdma","name":"MDMA","brand":"ecstasy / molly","cls":"Entactogen",
  "structClass":"Methylenedioxy-methamphetamine","category":"Illicit Drug",
  "smiles":"CC(NC)Cc1ccc2c(c1)OCO2",
  "year":1912,"yearRef":"Merck - first synthesized (studied for PTSD therapy from the 2000s)",
  "messenger":1,
  "messengerNote":"An entactogen that produces emotional openness by driving serotonin (and dopamine/NE) release; MDMA-assisted psychotherapy has been studied for PTSD.",
  "lipoNote":"Lipophilic substituted amphetamine that readily enters the brain; the methylenedioxy ring distinguishes it from stimulant amphetamines.",
  "receptorNote":"Reverses the serotonin transporter to release 5-HT (with dopamine/NE release), rather than simply blocking reuptake.",
 },
 {
  "id":"methamphetamine","name":"Methamphetamine","brand":"","cls":"Stimulant",
  "structClass":"N-methyl amphetamine","category":"Illicit Drug",
  "smiles":"CN[C@@H](C)Cc1ccccc1",
  "year":1893,"yearRef":"Nagai - first synthesis (crystalline form 1919)",
  "messenger":1,
  "messengerNote":"A highly addictive stimulant that both releases and blocks reuptake of dopamine and norepinephrine; the N-methyl group boosts CNS penetration over amphetamine.",
  "lipoNote":"More lipophilic than amphetamine, giving faster, higher brain exposure - part of its abuse potential.",
  "receptorNote":"Substrate-type releaser at the dopamine and norepinephrine transporters, reversing them to dump catecholamines into the synapse.",
 },
 {
  "id":"lsd","name":"LSD","brand":"acid","cls":"Serotonergic psychedelic",
  "structClass":"Ergoline (lysergic acid diethylamide)","category":"Illicit Drug",
  "smiles":"CCN(CC)C(=O)[C@H]1CN(C)[C@@H]2Cc3c[nH]c4cccc(c34)C2=C1",
  "year":1938,"yearRef":"Hofmann, Sandoz - synthesis (psychedelic effects discovered 1943)",
  "messenger":1,
  "messengerNote":"A prototypical psychedelic active at microgram doses; being re-examined in controlled research for anxiety and depression.",
  "lipoNote":"Lipophilic ergoline that crosses into the brain and binds serotonin receptors with very high affinity.",
  "receptorNote":"Agonist/partial agonist at the 5-HT2A receptor (the shared target of classic psychedelics), with broad activity across serotonin and dopamine receptors.",
 },
 {
  "id":"psilocybin","name":"Psilocybin","brand":"magic mushrooms","cls":"Serotonergic psychedelic",
  "structClass":"Phosphorylated tryptamine (prodrug)","category":"Illicit Drug",
  "smiles":"CN(C)CCc1c[nH]c2ccc(OP(=O)(O)O)cc12",
  "year":1958,"yearRef":"Hofmann - isolation and synthesis from Psilocybe mushrooms",
  "messenger":1,
  "messengerNote":"The prodrug from 'magic mushrooms', dephosphorylated to psilocin; among the most advanced psychedelics in trials for treatment-resistant depression.",
  "lipoNote":"The phosphate group makes psilocybin itself polar; it is cleaved in the body to the lipophilic, brain-penetrant psilocin.",
  "receptorNote":"Its active metabolite psilocin is a 5-HT2A/5-HT1A agonist - the receptor engagement behind the psychedelic and putative antidepressant effects.",
 },
 {
  "id":"dmt","name":"DMT","brand":"ayahuasca alkaloid","cls":"Serotonergic psychedelic",
  "structClass":"Tryptamine (N,N-dimethyltryptamine)","category":"Illicit Drug",
  "smiles":"CN(C)CCc1c[nH]c2ccccc12",
  "year":1931,"yearRef":"Manske - first synthesis (endogenous/ayahuasca use characterized later)",
  "messenger":1,
  "messengerNote":"A short-acting psychedelic and the active principle of ayahuasca; structurally the simplest of the classic tryptamine psychedelics.",
  "lipoNote":"Small, lipophilic tryptamine that enters the brain fast but is rapidly broken down by monoamine oxidase (hence brief action unless combined with an MAOI).",
  "receptorNote":"Agonist at the 5-HT2A receptor (with sigma-1 activity), the shared mechanism of tryptamine psychedelics.",
 },
 {
  "id":"mescaline","name":"Mescaline","brand":"peyote alkaloid","cls":"Serotonergic psychedelic",
  "structClass":"Trimethoxy-phenethylamine","category":"Illicit Drug",
  "smiles":"NCCc1cc(OC)c(OC)c(OC)c1",
  "year":1897,"yearRef":"Heffter - isolation from peyote (synthesis by Spath 1919)",
  "messenger":1,
  "messengerNote":"The classic peyote psychedelic and the phenethylamine template from which many synthetic psychedelics were derived.",
  "lipoNote":"A moderately lipophilic phenethylamine; less potent than the tryptamine psychedelics, requiring much larger doses.",
  "receptorNote":"5-HT2A receptor agonist - the same target as LSD and psilocin despite its distinct phenethylamine scaffold.",
 },
 {
  "id":"thc","name":"THC","brand":"delta-9-THC","cls":"Cannabinoid",
  "structClass":"Classical cannabinoid (dibenzopyran)","category":"Illicit Drug",
  "smiles":"CCCCCc1cc(O)c2c(c1)OC(C)(C)[C@@H]1CCC(C)=C[C@H]21",
  "year":1964,"yearRef":"Gaoni & Mechoulam - isolation and structure of delta-9-THC",
  "messenger":1,
  "messengerNote":"The principal psychoactive cannabinoid; relevant to psychiatry for its links to psychosis risk, anxiety, and cannabis-use disorder.",
  "lipoNote":"Extremely lipophilic - it partitions into fat and brain readily and lingers, which is why cannabis effects and detection persist.",
  "receptorNote":"Partial agonist at CB1 (central, psychoactive) and CB2 cannabinoid receptors, mimicking endocannabinoids like anandamide.",
 },
 {
  "id":"heroin","name":"Heroin","brand":"diamorphine","cls":"Opioid",
  "structClass":"Diacetylmorphine (morphinan)","category":"Illicit Drug",
  "smiles":"CN1CC[C@]23c4c5ccc(OC(C)=O)c4O[C@H]2[C@@H](OC(C)=O)C=C[C@H]3[C@H]1C5",
  "year":1874,"yearRef":"Wright - first synthesis by acetylation of morphine",
  "messenger":1,
  "messengerNote":"A rapidly acting, highly addictive opioid; the diacetyl groups speed brain entry, after which it is deacetylated to morphine.",
  "lipoNote":"Adding two acetyl groups to morphine sharply raises lipophilicity, giving faster blood-brain-barrier crossing and a more intense rush.",
  "receptorNote":"A prodrug: deacetylated to 6-monoacetylmorphine and morphine, potent agonists at the mu-opioid receptor.",
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

_QUAT = Chem.MolFromSmarts("[NX4+]")   # quaternary ammonium — permanent cation

def qualitative_ionization(m):
    if m.HasSubstructMatch(_QUAT):
        return "Permanently cationic — a quaternary ammonium, positively charged at every physiologic pH"
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
