# SMILES for all 91 psychotropics, keyed by MEDICATIONS id.
# KNOWN_MW = average MW from literature, for automated cross-check against RDKit.
# For salts/mixtures/combinations, SMILES depicts the principal active moiety
# (noted in NOTE) and KNOWN_MW matches that moiety.

SMILES = {
 # ── SSRIs ────────────────────────────────────────────────────────────────
 'fluoxetine':      'CNCCC(Oc1ccc(cc1)C(F)(F)F)c1ccccc1',
 'sertraline':      'CNC1CCC(c2ccc(Cl)c(Cl)c2)c2ccccc21',
 'escitalopram':    'CN(C)CCC[C@]1(c2ccc(F)cc2)OCc2cc(C#N)ccc21',
 'paroxetine':      'C1CNCC(C1c1ccc(F)cc1)COc1ccc2OCOc2c1',
 'citalopram':      'CN(C)CCCC1(c2ccc(F)cc2)OCc2cc(C#N)ccc21',
 'fluvoxamine':     'COCCCCC(=NOCCN)c1ccc(C(F)(F)F)cc1',
 # ── SNRIs ────────────────────────────────────────────────────────────────
 'venlafaxine':     'CN(C)CC(c1ccc(OC)cc1)C1(O)CCCCC1',
 'duloxetine':      'CNCCC(Oc1cccc2ccccc12)c1cccs1',
 'desvenlafaxine':  'CN(C)CC(c1ccc(O)cc1)C1(O)CCCCC1',
 'milnacipran':     'CCN(CC)C(=O)C1(c2ccccc2)CC1CN',
 'levomilnacipran': 'CCN(CC)C(=O)[C@]1(c2ccccc2)C[C@@H]1CN',
 # ── TCAs ─────────────────────────────────────────────────────────────────
 'amitriptyline':   'CN(C)CCC=C1c2ccccc2CCc2ccccc21',
 'nortriptyline':   'CNCCC=C1c2ccccc2CCc2ccccc21',
 'imipramine':      'CN(C)CCCN1c2ccccc2CCc2ccccc21',
 'doxepin':         'CN(C)CCC=C1c2ccccc2COc2ccccc21',
 # ── MAOIs ────────────────────────────────────────────────────────────────
 'phenelzine':      'NNCCc1ccccc1',
 'tranylcypromine': 'NC1CC1c1ccccc1',
 # ── Other antidepressants ────────────────────────────────────────────────
 'bupropion':       'CC(NC(C)(C)C)C(=O)c1cccc(Cl)c1',
 'mirtazapine':     'CN1CCN2C(C1)c1ccccc1Cc1cccnc12',
 'trazodone':       'O=c1n(CCCN2CCN(c3cccc(Cl)c3)CC2)nc2ccccn12',
 'vilazodone':      'NC(=O)c1cc2cc(N3CCN(CCCCc4c[nH]c5ccc(C#N)cc45)CC3)ccc2o1',
 'vortioxetine':    'Cc1ccc(Sc2ccccc2N2CCNCC2)c(C)c1',
 'gepirone':        'O=C1CC(C)(C)CC(=O)N1CCCCN1CCN(c2ncccn2)CC1',
 'esketamine':      'CN[C@]1(c2ccccc2Cl)CCCCC1=O',
 'brexanolone':     'CC(=O)[C@H]1CC[C@H]2[C@@H]3CC[C@H]4C[C@H](O)CC[C@]4(C)[C@H]3CC[C@]12C',
 'zuranolone':      'CC1(CCC2C(C1)CCC3C2CCC4(C3CCC4C(=O)CN5C=C(C=N5)C#N)C)O',  # PubChem CID 86294073
 'dextromethorphan-bupropion': 'COc1ccc2C[C@@H]3[C@@H]4CCCC[C@]4(CCN3C)c2c1',  # NOTE: combo; depicts dextromethorphan
 # ── Antipsychotics: FGA ──────────────────────────────────────────────────
 'haloperidol':     'O=C(CCCN1CCC(O)(c2ccc(Cl)cc2)CC1)c1ccc(F)cc1',
 'chlorpromazine':  'CN(C)CCCN1c2ccccc2Sc2ccc(Cl)cc21',
 'fluphenazine':    'OCCN1CCN(CCCN2c3ccccc3Sc3ccc(C(F)(F)F)cc32)CC1',
 'trifluoperazine': 'CN1CCN(CCCN2c3ccccc3Sc3ccc(C(F)(F)F)cc32)CC1',
 'perphenazine':    'OCCN1CCN(CCCN2c3ccccc3Sc3ccc(Cl)cc32)CC1',
 'thioridazine':    'CN1CCCCC1CCN1c2ccccc2Sc2ccc(SC)cc21',
 'thiothixene':     'CN(C)S(=O)(=O)c1ccc2Sc3ccccc3C(=CCCN3CCN(C)CC3)c2c1',
 'pimozide':        'O=C1Nc2ccccc2N1C1CCN(CCCC(c2ccc(F)cc2)c2ccc(F)cc2)CC1',
 'loxapine':        'CN1CCN(C2=Nc3ccccc3Oc3ccc(Cl)cc32)CC1',
 'molindone':       'CCc1c(C)[nH]c2c1C(=O)C(CN1CCOCC1)CC2',
 # ── Antipsychotics: SGA ──────────────────────────────────────────────────
 'risperidone':     'CC1=C(CCN2CCC(CC2)c2noc3cc(F)ccc23)C(=O)N2CCCCC2=N1',
 'olanzapine':      'CN1CCN(CC1)C1=Nc2cc(C)sc2Nc2ccccc21',
 'quetiapine':      'OCCOCCN1CCN(C2=Nc3ccccc3Sc3ccccc32)CC1',
 'aripiprazole':    'O=C1CCc2cc(OCCCCN3CCN(c4cccc(Cl)c4Cl)CC3)ccc2N1',
 'clozapine':       'CN1CCN(C2=Nc3cc(Cl)ccc3Nc3ccccc32)CC1',
 'ziprasidone':     'O=C1Cc2cc(CCN3CCN(c4nsc5ccccc45)CC3)c(Cl)cc2N1',
 'lurasidone':      'O=C1N(C[C@@H]2CCCC[C@@H]2CN2CCN(c3nsc4ccccc34)CC2)C(=O)[C@H]2[C@@H]3CC[C@H](C3)[C@@H]12',
 'asenapine':       'CN1C[C@@H]2c3ccccc3Oc3ccc(Cl)cc3[C@@H]2C1',
 'paliperidone':    'OC1CCCN2C1=NC(C)=C(CCN1CCC(CC1)c1noc3cc(F)ccc13)C2=O',
 'iloperidone':     'COc1cc(C(C)=O)ccc1OCCCN1CCC(c2noc3cc(F)ccc23)CC1',
 'brexpiprazole':   'O=c1ccc2ccc(OCCCCN3CCN(c4cccc5sccc45)CC3)cc2[nH]1',
 'cariprazine':     'CN(C)C(=O)NC1CCC(CCN2CCN(c3cccc(Cl)c3Cl)CC2)CC1',
 'lumateperone':    'CN1CCN2C3CCN(CC3C4=C2C1=CC=C4)CCCC(=O)C5=CC=C(C=C5)F',  # PubChem CID 21302490
 'pimavanserin':    'CC(C)COc1ccc(CNC(=O)N(Cc2ccc(F)cc2)C2CCN(C)CC2)cc1',
 # ── Mood stabilizers ─────────────────────────────────────────────────────
 'lithium':         '[Li+].[Li+].[O-]C([O-])=O',   # NOTE: active species Li+; shown as carbonate
 'valproate':       'CCCC(CCC)C(=O)O',
 'lamotrigine':     'Nc1nnc(-c2cccc(Cl)c2Cl)c(N)n1',
 'carbamazepine':   'NC(=O)N1c2ccccc2C=Cc2ccccc21',
 'oxcarbazepine':   'NC(=O)N1c2ccccc2CC(=O)c2ccccc21',
 'topiramate':      'CC1(C)OC2COC3(COS(N)(=O)=O)OC(C)(C)OC3C2O1',
 'gabapentin':      'NCC1(CC(=O)O)CCCCC1',
 # ── Sleep ────────────────────────────────────────────────────────────────
 'zolpidem':        'Cc1ccc(-c2nc3ccc(C)cn3c2CC(=O)N(C)C)cc1',
 'eszopiclone':     'CN1CCN(C(=O)O[C@H]2c3nccnc3C(=O)N2c2ccc(Cl)cn2)CC1',
 'temazepam':       'CN1C(=O)C(O)N=C(c2ccccc2)c2cc(Cl)ccc21',
 'ramelteon':       'CCC(=O)NCC[C@H]1CCc2c1ccc1c2CCO1',
 'suvorexant':      'C[C@H]1CCN(C(=O)c2cc(C)ccc2-n2nccn2)CCN1c1nc2cc(Cl)ccc2o1',
 'doxylamine':      'CN(C)CCOC(C)(c1ccccc1)c1ccccn1',
 # ── Benzodiazepines ──────────────────────────────────────────────────────
 'temazepam_dup':   None,
 'alprazolam':      'Cc1nnc2CN=C(c3ccccc3)c3cc(Cl)ccc3-n12',
 'clonazepam':      'O=C1CN=C(c2ccccc2Cl)c2cc([N+](=O)[O-])ccc2N1',
 'diazepam':        'CN1C(=O)CN=C(c2ccccc2)c2cc(Cl)ccc21',
 'lorazepam':       'OC1N=C(c2ccccc2Cl)c2cc(Cl)ccc2NC1=O',
 'oxazepam':        'OC1N=C(c2ccccc2)c2cc(Cl)ccc2NC1=O',
 'chlordiazepoxide':'CNC1=[N+]([O-])c2ccc(Cl)cc2C(c2ccccc2)=NC1',
 'clorazepate':     'O=C(O)C1N=C(c2ccccc2)c2cc(Cl)ccc2NC1=O',
 'midazolam':       'Cc1ncc2CN=C(c3ccccc3F)c3cc(Cl)ccc3-n12',
 'triazolam':       'Cc1nnc2CN=C(c3ccccc3Cl)c3cc(Cl)ccc3-n12',
 'estazolam':       'C1(c2ccccc2)=NCc2nncn2-c2ccc(Cl)cc21',
 'flurazepam':      'CCN(CC)CCN1C(=O)CN=C(c2ccccc2F)c2cc(Cl)ccc21',
 # ── Anxiolytics: other ───────────────────────────────────────────────────
 'buspirone':       'O=C1CC2(CCCC2)CC(=O)N1CCCCN1CCN(c2ncccn2)CC1',
 'pregabalin':      'CC(C)C[C@@H](CN)CC(=O)O',
 'propranolol':     'CC(C)NCC(O)COc1cccc2ccccc12',
 'clonidine':       'Clc1cccc(Cl)c1NC1=NCCN1',
 'guanfacine':      'NC(=N)NC(=O)Cc1c(Cl)cccc1Cl',
 'hydroxyzine':     'OCCOCCN1CCN(C(c2ccccc2)c2ccc(Cl)cc2)CC1',
 # ── Stimulants / wake-promoting ──────────────────────────────────────────
 'methylphenidate':    'COC(=O)C(c1ccccc1)C1CCCCN1',
 'dexmethylphenidate': 'COC(=O)[C@@H](c1ccccc1)[C@H]1CCCCN1',
 'amphetamine-mixed-salts': 'CC(N)Cc1ccccc1',   # NOTE: racemic + dextro salt mixture; depicts amphetamine base
 'dextroamphetamine':  'C[C@@H](N)Cc1ccccc1',
 'lisdexamfetamine':   'C[C@H](Cc1ccccc1)NC(=O)[C@@H](N)CCCCN',
 'modafinil':          'NC(=O)CS(=O)C(c1ccccc1)c1ccccc1',
 'armodafinil':        'NC(=O)C[S@](=O)C(c1ccccc1)c1ccccc1',
 'solriamfetol':       'NC(=O)OC[C@H](N)Cc1ccccc1',
 # ── Other ────────────────────────────────────────────────────────────────
 'diphenhydramine':    'CN(C)CCOC(c1ccccc1)c1ccccc1',
 'trihexyphenidyl':    'OC(CCN1CCCCC1)(c1ccccc1)C1CCCCC1',
}
SMILES.pop('temazepam_dup', None)

# Average MW (literature) for automated cross-check (parent/free-base/depicted moiety).
KNOWN_MW = {
 'fluoxetine':309.33,'sertraline':306.23,'escitalopram':324.39,'paroxetine':329.37,
 'citalopram':324.39,'fluvoxamine':318.33,'venlafaxine':277.40,'duloxetine':297.42,
 'desvenlafaxine':263.38,'milnacipran':246.35,'levomilnacipran':246.35,'amitriptyline':277.40,
 'nortriptyline':263.38,'imipramine':280.41,'doxepin':279.38,'phenelzine':136.19,
 'tranylcypromine':133.19,'bupropion':239.74,'mirtazapine':265.35,'trazodone':371.86,
 'vilazodone':441.53,'vortioxetine':298.45,'gepirone':359.47,'esketamine':237.73,
 'brexanolone':318.49,'zuranolone':409.53,'haloperidol':375.86,'chlorpromazine':318.86,
 'fluphenazine':437.52,'trifluoperazine':407.50,'perphenazine':403.97,'thioridazine':370.58,
 'thiothixene':443.63,'pimozide':461.55,'loxapine':327.81,'molindone':276.37,
 'risperidone':410.48,'olanzapine':312.43,'quetiapine':383.51,'aripiprazole':448.38,
 'clozapine':326.82,'ziprasidone':412.94,'lurasidone':492.68,'asenapine':285.77,
 'paliperidone':426.48,'iloperidone':426.48,'brexpiprazole':433.56,'cariprazine':427.41,
 'lumateperone':393.50,'pimavanserin':427.56,'valproate':144.21,
 'lamotrigine':256.09,'carbamazepine':236.27,'oxcarbazepine':252.27,'topiramate':339.36,
 'gabapentin':171.24,'zolpidem':307.39,'eszopiclone':388.81,'temazepam':300.74,
 'ramelteon':259.34,'suvorexant':450.92,'doxylamine':270.37,'alprazolam':308.76,
 'clonazepam':315.71,'diazepam':284.74,'lorazepam':321.16,'oxazepam':286.71,
 'chlordiazepoxide':299.75,'clorazepate':314.72,'midazolam':325.77,'triazolam':343.21,
 'estazolam':294.74,'flurazepam':387.88,'buspirone':385.50,'pregabalin':159.23,
 'propranolol':259.34,'clonidine':230.09,'guanfacine':246.09,'hydroxyzine':374.90,
 'methylphenidate':233.31,'dexmethylphenidate':233.31,'amphetamine-mixed-salts':135.21,
 'dextroamphetamine':135.21,'lisdexamfetamine':263.38,'modafinil':273.35,'armodafinil':273.35,
 'solriamfetol':194.23,'diphenhydramine':255.35,'trihexyphenidyl':301.47,
 # zolpidem 307.39 ; note zolpidem MW is 307.39
}

# principal-moiety / salt / mixture notes shown in the UI
MOIETY_NOTE = {
 'lithium':'Active species is the lithium ion (Li⁺); depicted as lithium carbonate, the common salt.',
 'amphetamine-mixed-salts':'A fixed mixture of racemic and dextro amphetamine salts; the amphetamine base is depicted.',
 'dextromethorphan-bupropion':'A combination product (dextromethorphan + bupropion); dextromethorphan, the NMDA-antagonist component, is depicted.',
 'valproate':'Marketed as divalproex/valproate salts; valproic acid (the active moiety) is depicted.',
}
