/* PsychoPharmRef — Psychiatry Glossary Data
 * ~400 curated terms unique to or particularly important in psychiatry.
 * Each entry: { term, aliases, category, def, seeAlso, link }
 *   - term: canonical term (case as commonly written, e.g., "Capgras syndrome")
 *   - aliases: array of alternate spellings/synonyms used in search (lowercase OK)
 *   - category: one of the CATEGORIES below
 *   - def: 1-3 sentence clinical definition (plain text, no HTML)
 *   - seeAlso: array of OTHER `term` strings in this file (cross-references)
 *   - link: optional { section, blogSlug, label } - section is a switchSection() id; blogSlug is a /blog/<slug>/ filename without extension; label is human text
 */
window.GLOSSARY_TERMS = [
  {
    term: "Abulia",
    aliases: ["aboulia"],
    category: "Phenomenology",
    def: "Severe reduction in motivation, initiative, and self-generated action; lies on a spectrum with apathy and akinetic mutism. Common in frontal lobe lesions, advanced Parkinson disease, and depression with psychomotor retardation.",
    seeAlso: ["Apathy", "Akinetic mutism", "Avolition"]
  },
  {
    term: "Alogia",
    aliases: ["poverty of speech"],
    category: "Phenomenology",
    def: "Marked reduction in the quantity and content of speech. A negative symptom of schizophrenia; words produced are often sparse, empty, or tangential.",
    seeAlso: ["Negative symptoms", "Poverty of speech", "Schizophrenia"]
  },
  {
    term: "Avolition",
    aliases: ["loss of goal-directed activity"],
    category: "Phenomenology",
    def: "Loss of motivation to initiate and persist in goal-directed activity; may manifest as neglect of grooming, hygiene, or work. A negative symptom.",
    seeAlso: ["Apathy", "Abulia", "Negative symptoms"]
  },
  {
    term: "Blocking",
    aliases: ["thought blocking"],
    category: "Phenomenology",
    def: "Sudden interruption in the stream of speech or thought, experienced as an abrupt emptying of mind. The speaker may pause mid-sentence and then resume without completion of the original thought.",
    seeAlso: ["Formal thought disorder", "Loose associations"]
  },
  {
    term: "Circumstantiality",
    aliases: ["circumstantial speech"],
    category: "Phenomenology",
    def: "Speech that is detailed, circuitous, and digressive but eventually reaches the point; excessive inclusion of irrelevant details. Differs from looseness of associations in that the goal is ultimately reached.",
    seeAlso: ["Tangentiality", "Looseness of associations", "Formal thought disorder"]
  },
  {
    term: "Clang associations",
    aliases: ["clang association"],
    category: "Phenomenology",
    def: "Choice of words based on sound (rhyming, alliteration) rather than meaning. A form of formal thought disorder; characteristic of mania and acute psychosis.",
    seeAlso: ["Formal thought disorder", "Looseness of associations", "Mania"]
  },
  {
    term: "Derailment",
    aliases: ["looseness of association", "flight of ideas variant"],
    category: "Phenomenology",
    def: "Abrupt shift from one topic to a completely unrelated topic without bridging thought or obvious connection. Results in incoherent or tangential discourse.",
    seeAlso: ["Looseness of associations", "Flight of ideas", "Formal thought disorder"]
  },
  {
    term: "Echolalia",
    aliases: ["echokinesis variant"],
    category: "Phenomenology",
    def: "Automatic repetition of words, phrases, or sentences spoken by another person. Common in autism, severe schizophrenia, and catatonia.",
    seeAlso: ["Catatonia", "Palilalia", "Stereotypy"]
  },
  {
    term: "Flight of ideas",
    aliases: ["racing thoughts"],
    category: "Phenomenology",
    def: "Rapid succession of thoughts with apparent connections between them; speech is fast, difficult to interrupt, and may include rhyming or punning. Hallmark of mania.",
    seeAlso: ["Pressured speech", "Tangentiality", "Mania", "Clang associations"]
  },
  {
    term: "Formal thought disorder",
    aliases: ["FTD"],
    category: "Phenomenology",
    def: "Disturbance in the form and organization of thought (as opposed to content), manifested in speech as incoherence, looseness, tangentiality, or derailment. Core feature of schizophrenia and acute psychosis.",
    seeAlso: ["Looseness of associations", "Incoherence", "Blocking", "Derailment"]
  },
  {
    term: "Incoherence",
    aliases: ["word salad"],
    category: "Phenomenology",
    def: "Speech that is completely unintelligible due to grammatical disorganization and disconnected words or phrases; grammar and content are not simply distorted but become nonsensical.",
    seeAlso: ["Formal thought disorder", "Looseness of associations"]
  },
  {
    term: "Looseness of associations",
    aliases: ["loose associations"],
    category: "Phenomenology",
    def: "Thought that jumps from topic to topic without clear connection; responses may be oblique or only tangentially related to questions. Characteristic of schizophrenia.",
    seeAlso: ["Formal thought disorder", "Tangentiality", "Derailment"]
  },
  {
    term: "Mutism",
    aliases: ["selective mutism", "elective mutism"],
    category: "Phenomenology",
    def: "Failure or refusal to speak despite the ability to do so. May be motor (inability), psychogenic (selective mutism), or psychiatric (catatonic mutism).",
    seeAlso: ["Catatonia", "Selective mutism", "Alogia"]
  },
  {
    term: "Neologism",
    aliases: ["neologistic speech"],
    category: "Phenomenology",
    def: "Invention of new words or phrases, or use of old words in new combinations with private meaning. Characteristic of schizophrenia and acute psychosis.",
    seeAlso: ["Formal thought disorder", "Schizophrenia"]
  },
  {
    term: "Perseveration",
    aliases: ["verbal perseveration"],
    category: "Phenomenology",
    def: "Repetition of words, ideas, or motor acts despite changed context or instructions; the person cannot easily shift from one focus to another. Seen in executive dysfunction and frontal lobe pathology.",
    seeAlso: ["Catatonia", "Stereotypy", "Frontal lobe dysfunction"]
  },
  {
    term: "Poverty of speech",
    aliases: ["alogia"],
    category: "Phenomenology",
    def: "Reduction in the quantity of speech and, often, a corresponding lack of thought content. A primary negative symptom of schizophrenia.",
    seeAlso: ["Alogia", "Negative symptoms"]
  },
  {
    term: "Pressured speech",
    aliases: ["pressure of speech"],
    category: "Phenomenology",
    def: "Rapid, loud, difficult-to-interrupt speech, often with increased rate and volume. Hallmark of mania and manic episodes; reflects racing thoughts.",
    seeAlso: ["Flight of ideas", "Mania", "Tangentiality"]
  },
  {
    term: "Tangentiality",
    aliases: ["tangential speech"],
    category: "Phenomenology",
    def: "Response to a question that is related but does not address the original inquiry; the speaker never returns to the main point. Differs from circumstantiality in that the original point is never reached.",
    seeAlso: ["Circumstantiality", "Looseness of associations"]
  },
  {
    term: "Thought blocking",
    aliases: ["blocking"],
    category: "Phenomenology",
    def: "Sudden interruption in thought or speech, often described as the mind going blank; the person stops mid-sentence unable to continue.",
    seeAlso: ["Blocking", "Formal thought disorder"]
  },
  {
    term: "Verbigeration",
    aliases: ["palilalia variant"],
    category: "Phenomenology",
    def: "Repetitive, purposeless utterance of words or phrases; meaningless recitation. Seen in catatonia and late-stage dementia.",
    seeAlso: ["Catatonia", "Palilalia", "Perseveration"]
  },
  {
    term: "Anhedonia",
    aliases: ["loss of pleasure"],
    category: "Mood & Affect",
    def: "Loss of pleasure in activities that normally bring enjoyment; a core symptom of depression and negative symptoms of schizophrenia.",
    seeAlso: ["Depression", "Negative symptoms", "Major depressive disorder"]
  },
  {
    term: "Anergia",
    aliases: ["lack of energy", "apathy variant"],
    category: "Mood & Affect",
    def: "Lack of energy, motivation, or drive; manifests as fatigue and difficulty initiating or sustaining activity.",
    seeAlso: ["Apathy", "Abulia", "Major depressive disorder"]
  },
  {
    term: "Apathy",
    aliases: ["apatheia"],
    category: "Mood & Affect",
    def: "Lack of interest, concern, or motivation; reduced ability to initiate or persist in goal-directed activity. Distinguished from depression by the absence of dysphoria.",
    seeAlso: ["Abulia", "Avolition", "Anergia"]
  },
  {
    term: "Blunted affect",
    aliases: ["flattened affect variant"],
    category: "Mood & Affect",
    def: "Marked reduction in emotional expression and responsiveness; facial expressions, voice tone, and gestures are diminished but not entirely absent.",
    seeAlso: ["Flat affect", "Restricted affect", "Negative symptoms"]
  },
  {
    term: "Constricted affect",
    aliases: ["restricted affect variant"],
    category: "Mood & Affect",
    def: "Mild to moderate reduction in emotional expression; narrower range of emotional response than normal but not as severe as blunted or flat affect.",
    seeAlso: ["Blunted affect", "Flat affect", "Restricted affect"]
  },
  {
    term: "Dysphoria",
    aliases: ["depressed mood"],
    category: "Mood & Affect",
    def: "Intense, uncomfortable emotional state characterized by sadness, unhappiness, or unease. Core mood symptom of depression and anxiety disorders.",
    seeAlso: ["Euthymia", "Major depressive disorder", "Dysthymia"]
  },
  {
    term: "Dysthymia",
    aliases: ["persistent depressive disorder"],
    category: "Mood & Affect",
    def: "Chronically depressed mood lasting at least 2 years in adults (1 year in children) with symptoms less severe than major depressive episodes.",
    seeAlso: ["Major depressive disorder", "Dysphoria"],
    link: { blogSlug: "major-depressive-disorder" }
  },
  {
    term: "Euthymia",
    aliases: ["euthymic"],
    category: "Mood & Affect",
    def: "Normal mood; the state of being neither depressed nor elevated. A clinical goal in mood disorder treatment.",
    seeAlso: ["Dysphoria", "Mood"]
  },
  {
    term: "Flat affect",
    aliases: ["flattened affect"],
    category: "Mood & Affect",
    def: "Severe reduction or absence of emotional expression; facial, vocal, and gestural expressions are markedly diminished or absent. A negative symptom of schizophrenia.",
    seeAlso: ["Blunted affect", "Restricted affect", "Negative symptoms"]
  },
  {
    term: "Inappropriate affect",
    aliases: ["incongruent affect"],
    category: "Mood & Affect",
    def: "Emotional expression that is incongruent with the content of thought or speech (e.g., laughing while discussing tragedy). Seen in schizophrenia and some personality disorders.",
    seeAlso: ["Lability", "Schizophrenia"]
  },
  {
    term: "Irritability",
    aliases: ["irritable mood"],
    category: "Mood & Affect",
    def: "Tendency to become easily annoyed, angered, or impatient; heightened sensitivity to perceived slights. Common in mania, borderline personality disorder, and disruptive behavior disorders.",
    seeAlso: ["Lability", "Anger", "Borderline personality disorder"]
  },
  {
    term: "Lability",
    aliases: ["emotional lability", "mood lability"],
    category: "Mood & Affect",
    def: "Rapid, unpredictable shifts in emotional state; frequent changes in mood from one moment to the next. Seen in bipolar disorder, borderline personality disorder, and organic brain syndromes.",
    seeAlso: ["Irritability", "Inappropriate affect", "Bipolar disorder"]
  },
  {
    term: "Mood-congruent psychosis",
    aliases: ["mood-congruent delusions"],
    category: "Mood & Affect",
    def: "Psychotic symptoms (delusions or hallucinations) with content that is consistent with the current mood (e.g., grandiose delusions in mania, nihilistic delusions in depression).",
    seeAlso: ["Mood-incongruent psychosis", "Psychosis", "Bipolar disorder"]
  },
  {
    term: "Restricted affect",
    aliases: ["constricted affect variant"],
    category: "Mood & Affect",
    def: "Narrowing of the range of emotional expression; less variability in emotional response than normal. Can occur in depression, anxiety, and schizophrenia.",
    seeAlso: ["Blunted affect", "Constricted affect", "Flat affect"]
  },
  {
    term: "Autoscopy",
    aliases: ["heautoscopy"],
    category: "Psychosis",
    def: "Visual hallucination of one's own body; the person sees themselves from outside their body. A rare form of hallucination seen in psychosis and dissociative states.",
    seeAlso: ["Hallucination", "Out-of-body experience", "Psychosis"]
  },
  {
    term: "Command auditory hallucinations",
    aliases: ["command hallucinations", "command voices"],
    category: "Psychosis",
    def: "Auditory hallucinations in the form of voices commanding the person to perform specific actions. Often associated with increased risk for violence or self-harm if commands are obeyed.",
    seeAlso: ["Hallucination", "Auditory hallucination", "Schizophrenia"]
  },
  {
    term: "Delusion",
    aliases: ["false belief"],
    category: "Psychosis",
    def: "False belief held with conviction despite contradictory evidence; not culturally accepted or developmentally appropriate. Core feature of psychotic disorders.",
    seeAlso: ["Overvalued idea", "Magical thinking", "Psychosis"]
  },
  {
    term: "Delusion of grandeur",
    aliases: ["grandiose delusion"],
    category: "Psychosis",
    def: "False belief in possessing special powers, importance, or identity (e.g., believing oneself to be a famous person or possessing superhuman abilities). Common in mania and schizophrenia.",
    seeAlso: ["Delusion", "Mania"]
  },
  {
    term: "Delusion of reference",
    aliases: ["ideas of reference", "referential delusion"],
    category: "Psychosis",
    def: "False belief that unrelated events, comments, or objects have special, usually negative, personal significance. The person believes strangers are mocking or following them.",
    seeAlso: ["Ideas of reference", "Delusion", "Schizophrenia"]
  },
  {
    term: "Delusional jealousy",
    aliases: ["jealous delusion", "othello syndrome"],
    category: "Psychosis",
    def: "False belief, held with conviction, that a spouse or partner is unfaithful without reasonable cause. Can escalate to violence.",
    seeAlso: ["Delusion", "Othello syndrome"]
  },
  {
    term: "Erotomanic delusion",
    aliases: ["erotomania", "De Clérambault syndrome"],
    category: "Psychosis",
    def: "False belief that another person (often of higher status) is in love with oneself. Typically seen in delusional disorder, erotomania subtype.",
    seeAlso: ["Delusion", "De Clérambault syndrome", "Delusional disorder"]
  },
  {
    term: "First-rank symptoms",
    aliases: ["Schneiderian first-rank symptoms"],
    category: "Psychosis",
    def: "Specific psychotic symptoms considered highly suggestive of schizophrenia: thought broadcasting, insertion, withdrawal; auditory hallucinations (e.g., commenting voices); somatic delusions.",
    seeAlso: ["Thought broadcasting", "Schizophrenia", "Psychosis"]
  },
  {
    term: "Hallucination",
    aliases: ["false perception"],
    category: "Psychosis",
    def: "Perception occurring in the absence of external sensory stimulus; experienced with the same quality as a real perception. Can be auditory, visual, tactile, olfactory, or gustatory.",
    seeAlso: ["Illusion", "Delusion", "Psychosis"]
  },
  {
    term: "Hallucination, auditory",
    aliases: ["auditory hallucination", "voices"],
    category: "Psychosis",
    def: "Hallucination of sound, most commonly voices but also music, laughing, or other noises. Most frequent hallucination in schizophrenia.",
    seeAlso: ["Hallucination", "Command auditory hallucinations", "Schizophrenia"]
  },
  {
    term: "Hallucination, visual",
    aliases: ["visual hallucination"],
    category: "Psychosis",
    def: "Hallucination of sight; seeing images, people, objects, or patterns in the absence of external visual stimulus. Common in delirium and substance intoxication.",
    seeAlso: ["Hallucination", "Delirium"]
  },
  {
    term: "Hypnagogic hallucination",
    aliases: ["hypnagogic"],
    category: "Psychosis",
    def: "Hallucination occurring while falling asleep; normal phenomenon, not necessarily indicative of psychosis.",
    seeAlso: ["Hypnopompic hallucination", "Hallucination"]
  },
  {
    term: "Hypnopompic hallucination",
    aliases: ["hypnopompic"],
    category: "Psychosis",
    def: "Hallucination occurring while awakening from sleep; normal phenomenon, not necessarily indicative of psychosis.",
    seeAlso: ["Hypnagogic hallucination", "Hallucination"]
  },
  {
    term: "Ideas of reference",
    aliases: ["ideas of persecution variant"],
    category: "Psychosis",
    def: "Belief (not delusional intensity) that casual events or unrelated comments have special personal significance. Less firmly held than delusion of reference.",
    seeAlso: ["Delusion of reference", "Delusion"]
  },
  {
    term: "Illusion",
    aliases: ["misperception"],
    category: "Psychosis",
    def: "Misinterpretation of an actual external sensory stimulus (e.g., mistaking a shadow for a person). Differs from hallucination, which has no external stimulus.",
    seeAlso: ["Hallucination", "Delusion"]
  },
  {
    term: "Magical thinking",
    aliases: ["magical ideation"],
    category: "Psychosis",
    def: "Belief that thoughts, words, or actions have causal influence over unrelated events in ways that defy natural laws (e.g., believing thoughts can harm others). Seen in schizotypal personality disorder and psychosis.",
    seeAlso: ["Delusion", "Schizotypal personality disorder"]
  },
  {
    term: "Nihilistic delusion",
    aliases: ["nihilism"],
    category: "Psychosis",
    def: "False belief that parts of oneself or external reality do not exist (e.g., believing an organ is missing or that nothing is real). Extreme form seen in Cotard syndrome.",
    seeAlso: ["Cotard syndrome", "Delusion", "Mood-congruent psychosis"]
  },
  {
    term: "Overvalued idea",
    aliases: ["overvaluation"],
    category: "Psychosis",
    def: "Unreasonable belief or preoccupation held with intense conviction but not to delusional intensity; some insight may be retained. Seen in OCD, body dysmorphia, and eating disorders.",
    seeAlso: ["Delusion", "Obsession", "OCD"]
  },
  {
    term: "Persecutory delusion",
    aliases: ["delusion of persecution"],
    category: "Psychosis",
    def: "False belief that one is being conspired against, spied upon, followed, or plotted against by others. Most common type of delusion.",
    seeAlso: ["Delusion", "Paranoia", "Schizophrenia"]
  },
  {
    term: "Religiosity",
    aliases: ["religious delusions variant"],
    category: "Psychosis",
    def: "Excessive preoccupation with religion or religious beliefs; may escalate to religious delusions (e.g., believing oneself to be a divine being) in psychotic disorders.",
    seeAlso: ["Delusion", "Psychosis"]
  },
  {
    term: "Somatic delusion",
    aliases: ["somatic preoccupation"],
    category: "Psychosis",
    def: "False belief concerning bodily functions or sensations (e.g., believing parasites are infesting the skin, believing internal organs are rotting). Seen in psychotic depression and schizophrenia.",
    seeAlso: ["Delusion", "Illness anxiety disorder"]
  },
  {
    term: "Thought broadcasting",
    aliases: ["broadcast of thought"],
    category: "Psychosis",
    def: "False belief that one's thoughts are audible to others or are being broadcast to the world. A first-rank symptom of schizophrenia.",
    seeAlso: ["Thought insertion", "Thought withdrawal", "First-rank symptoms"]
  },
  {
    term: "Thought insertion",
    aliases: ["insertion of thought"],
    category: "Psychosis",
    def: "False belief that thoughts are being placed into one's mind by an external force. A first-rank symptom of schizophrenia.",
    seeAlso: ["Thought withdrawal", "Thought broadcasting", "First-rank symptoms"]
  },
  {
    term: "Thought withdrawal",
    aliases: ["withdrawal of thought"],
    category: "Psychosis",
    def: "False belief that thoughts are being removed from one's mind by an external force, resulting in sudden loss of thoughts. A first-rank symptom of schizophrenia.",
    seeAlso: ["Thought insertion", "Thought broadcasting", "First-rank symptoms"]
  },
  {
    term: "Akathisia",
    aliases: ["acathisia", "restlessness"],
    category: "Catatonia & Movement",
    def: "Subjective sense of inner restlessness and urge to move, often with difficulty sitting still. An extrapyramidal side effect of antipsychotics; can be distressing and mistaken for anxiety.",
    seeAlso: ["Extrapyramidal symptoms", "Antipsychotic side effects"]
  },
  {
    term: "Akinesia",
    aliases: ["akkinesia"],
    category: "Catatonia & Movement",
    def: "Loss or absence of voluntary movement; the person appears immobile or 'frozen.' Seen in severe Parkinson disease and catatonia.",
    seeAlso: ["Bradykinesia", "Catatonia", "Parkinson disease"]
  },
  {
    term: "Athetosis",
    aliases: ["athetoid movement"],
    category: "Catatonia & Movement",
    def: "Slow, writhing, involuntary movements, typically of the hands and feet. Seen in cerebral palsy, hypoxic brain injury, and tardive dyskinesia.",
    seeAlso: ["Choreiform movement", "Tardive dyskinesia"]
  },
  {
    term: "Automatic obedience",
    aliases: ["command automatism"],
    category: "Catatonia & Movement",
    def: "Automatic compliance with commands or instructions despite resistance or danger; a feature of catatonia.",
    seeAlso: ["Catatonia", "Waxy flexibility"]
  },
  {
    term: "Bradykinesia",
    aliases: ["hypokinesia", "slow movement"],
    category: "Catatonia & Movement",
    def: "Slowness of voluntary movement and reduced speed of motor activity. A cardinal feature of Parkinson disease and extrapyramidal side effects of antipsychotics.",
    seeAlso: ["Akinesia", "Extrapyramidal symptoms", "Parkinson disease"]
  },
  {
    term: "Catalepsy",
    aliases: ["cerea flexibilitas variant"],
    category: "Catatonia & Movement",
    def: "Waxy flexibility; the person maintains limbs in the position placed by the examiner. A sign of catatonia.",
    seeAlso: ["Catatonia", "Waxy flexibility", "Gegenhalten"]
  },
  {
    term: "Catatonia",
    aliases: ["catatonic state"],
    category: "Catatonia & Movement",
    def: "Psychomotor immobility and behavioral abnormality; manifests as mutism, negativism, posturing, waxy flexibility, or stupor. Can occur in schizophrenia, mood disorders, medical conditions, and as a psychiatric emergency.",
    seeAlso: ["Waxy flexibility", "Negativism", "Posturing"],
    link: { blogSlug: "catatonia" }
  },
  {
    term: "Chorea",
    aliases: ["choreiform movement"],
    category: "Catatonia & Movement",
    def: "Involuntary, rapid, irregular, non-rhythmic movements; jerky and purposeless. Seen in Huntington disease, Sydenham chorea, and other movement disorders.",
    seeAlso: ["Athetosis", "Dystonia"]
  },
  {
    term: "Dyskinesia",
    aliases: ["abnormal movement"],
    category: "Catatonia & Movement",
    def: "Abnormal involuntary movement; a broad category including tardive dyskinesia, choreiform movements, and athetosis. Often an adverse effect of antipsychotics.",
    seeAlso: ["Tardive dyskinesia", "Extrapyramidal symptoms", "AIMS"]
  },
  {
    term: "Dystonia",
    aliases: ["dystonic reaction"],
    category: "Catatonia & Movement",
    def: "Involuntary, sustained muscle contraction causing abnormal postures or repetitive movements (e.g., oculogyric crisis, torticollis). An acute extrapyramidal side effect of antipsychotics.",
    seeAlso: ["Extrapyramidal symptoms", "Antipsychotic side effects"]
  },
  {
    term: "Extrapyramidal symptoms",
    aliases: ["EPS", "extrapyramidal side effects"],
    category: "Catatonia & Movement",
    def: "Movement abnormalities arising from antipsychotic effect on extrapyramidal motor pathways; include akathisia, akinesia, dystonia, and parkinsonism.",
    seeAlso: ["Tardive dyskinesia", "Antipsychotic side effects", "Parkinsonism"],
    link: { blogSlug: "antipsychotic-movement-disorders" }
  },
  {
    term: "Festinating gait",
    aliases: ["festination"],
    category: "Catatonia & Movement",
    def: "Gait that progressively accelerates as the person walks, becoming involuntary and quickened; typical of Parkinson disease.",
    seeAlso: ["Gait disturbance", "Parkinson disease"]
  },
  {
    term: "Gegenhalten",
    aliases: ["paratonia"],
    category: "Catatonia & Movement",
    def: "Involuntary resistance to passive movement; the person's limbs resist manipulation in a way that increases with applied force. Seen in catatonia and dementia.",
    seeAlso: ["Catatonia", "Waxy flexibility"]
  },
  {
    term: "Mannerism",
    aliases: ["stylized movement"],
    category: "Catatonia & Movement",
    def: "Habitual, purposeful, goal-directed movement that appears odd or exaggerated; unlike tics, mannerisms are sustained and coordinated.",
    seeAlso: ["Stereotypy", "Tic", "Catatonia"]
  },
  {
    term: "Mitgehen",
    aliases: ["mitmachen variant"],
    category: "Catatonia & Movement",
    def: "Automatic, unresisting compliance with passive movement by examiner; also called mitmachen when the person also initiates movement.",
    seeAlso: ["Mitmachen", "Catatonia", "Automatic obedience"]
  },
  {
    term: "Mitmachen",
    aliases: ["mitgehen variant"],
    category: "Catatonia & Movement",
    def: "Excessive compliance with the examiner's suggestions; the person takes the position or movement suggested or implied even without explicit command.",
    seeAlso: ["Mitgehen", "Catatonia"]
  },
  {
    term: "Myoclonus",
    aliases: ["myoclonic jerks"],
    category: "Catatonia & Movement",
    def: "Brief, involuntary jerks of muscles or groups of muscles; can be seen in sleep, seizure disorders, metabolic encephalopathy, and medication effects.",
    seeAlso: ["Tic", "Seizure"]
  },
  {
    term: "Negativism",
    aliases: ["oppositional behavior"],
    category: "Catatonia & Movement",
    def: "Motiveless opposition to suggestions or instructions; the person does the opposite of what is requested. Seen in catatonia and oppositional defiant disorder.",
    seeAlso: ["Catatonia", "Oppositional defiant disorder"]
  },
  {
    term: "Parkinsonism",
    aliases: ["parkinsonian syndrome"],
    category: "Catatonia & Movement",
    def: "Triad of rigidity, bradykinesia, and resting tremor; common extrapyramidal side effect of antipsychotics and seen in Parkinson disease.",
    seeAlso: ["Extrapyramidal symptoms", "Tremor", "Bradykinesia"]
  },
  {
    term: "Posturing",
    aliases: ["bizarre posture"],
    category: "Catatonia & Movement",
    def: "Assumption and maintenance of odd, unusual, or uncomfortable body positions; a sign of catatonia.",
    seeAlso: ["Catatonia", "Catalepsy"]
  },
  {
    term: "Rabbit syndrome",
    aliases: ["fine perioral tremor"],
    category: "Catatonia & Movement",
    def: "Fine, rapid tremor of lips resembling a rabbit's chewing; an extrapyramidal side effect of antipsychotics.",
    seeAlso: ["Extrapyramidal symptoms", "Tremor"]
  },
  {
    term: "Rigidity",
    aliases: ["muscular rigidity"],
    category: "Catatonia & Movement",
    def: "Increased muscle tone with resistance to movement throughout the range of motion; lead-pipe or cog-wheel quality. Seen in Parkinson disease and as an extrapyramidal side effect.",
    seeAlso: ["Bradykinesia", "Parkinsonism"]
  },
  {
    term: "Stereotypy",
    aliases: ["stereotyped behavior"],
    category: "Catatonia & Movement",
    def: "Repetitive, purposeless motor movement or vocalization; characteristic of autism, developmental disorders, and psychosis.",
    seeAlso: ["Mannerism", "Perseveration", "Catatonia"]
  },
  {
    term: "Tardive dyskinesia",
    aliases: ["TD"],
    category: "Catatonia & Movement",
    def: "Involuntary choreiform or athetoid movements of the face, tongue, lips, or extremities developing after prolonged antipsychotic exposure. Risk increases with duration of use, dose, and age.",
    seeAlso: ["Dyskinesia", "Extrapyramidal symptoms", "Antipsychotic side effects"]
  },
  {
    term: "Tic",
    aliases: ["involuntary tic"],
    category: "Catatonia & Movement",
    def: "Brief, repetitive, involuntary motor movement or vocalization; typically experienced as irresistible but can be suppressed briefly. Seen in Tourette syndrome, ADHD, and OCD.",
    seeAlso: ["Stereotypy", "Mannerism", "Gilles de la Tourette"]
  },
  {
    term: "Tremor, intention",
    aliases: ["intention tremor"],
    category: "Catatonia & Movement",
    def: "Tremor that appears during purposeful, directed movement (e.g., reaching for an object). Characteristic of cerebellar disease.",
    seeAlso: ["Tremor", "Tremor, resting", "Cerebellar disease"]
  },
  {
    term: "Tremor, postural",
    aliases: ["postural tremor"],
    category: "Catatonia & Movement",
    def: "Tremor that appears when the limb is held in position against gravity. Seen in essential tremor and hyperthyroidism.",
    seeAlso: ["Tremor", "Essential tremor"]
  },
  {
    term: "Tremor, resting",
    aliases: ["resting tremor", "pill-rolling tremor"],
    category: "Catatonia & Movement",
    def: "Tremor that occurs when the limb is at rest and diminishes with intentional movement. Characteristic of Parkinson disease.",
    seeAlso: ["Tremor", "Parkinson disease", "Parkinsonism"]
  },
  {
    term: "Waxy flexibility",
    aliases: ["cerea flexibilitas"],
    category: "Catatonia & Movement",
    def: "Condition in which the patient's limbs can be moved into positions that they maintain against gravity; the limbs feel like they have the consistency of warm wax. A hallmark of catatonia.",
    seeAlso: ["Catatonia", "Catalepsy", "Gegenhalten"]
  },
  {
    term: "Denial",
    aliases: ["psychotic denial"],
    category: "Defense Mechanisms",
    def: "Refusal to acknowledge external reality, consciously or unconsciously. At psychotic level, the person rejects objective facts despite evidence.",
    seeAlso: ["Splitting", "Projective identification"]
  },
  {
    term: "Distortion",
    aliases: ["delusional distortion"],
    category: "Defense Mechanisms",
    def: "Reshaping of external reality to fit internal needs or fantasies; the psychotic person grossly misinterprets reality.",
    seeAlso: ["Denial", "Projective identification"]
  },
  {
    term: "Projective identification",
    aliases: ["projection variant"],
    category: "Defense Mechanisms",
    def: "Unconscious attribution of one's own impulses or feelings to another person, followed by identification with that person's reaction. Can escalate to psychotic levels.",
    seeAlso: ["Projection", "Splitting"]
  },
  {
    term: "Acting out",
    aliases: ["behavioral acting"],
    category: "Defense Mechanisms",
    def: "Expression of emotional conflict or unconscious wishes through action rather than words; avoids conscious awareness of the underlying impulse.",
    seeAlso: ["Avoidance", "Repression"]
  },
  {
    term: "Projection",
    aliases: ["psychological projection"],
    category: "Defense Mechanisms",
    def: "Attribution of one's own unacceptable thoughts or feelings to another person; seeing in others what one unconsciously possesses.",
    seeAlso: ["Projective identification", "Paranoia"]
  },
  {
    term: "Splitting",
    aliases: ["black-and-white thinking"],
    category: "Defense Mechanisms",
    def: "Viewing people or situations as all good or all bad without integration of positive and negative qualities. Common in personality disorders.",
    seeAlso: ["Projective identification", "Borderline personality disorder"]
  },
  {
    term: "Somatization",
    aliases: ["somatic symptom expression"],
    category: "Defense Mechanisms",
    def: "Expression of psychological conflict through physical symptoms; unconscious conversion of emotional distress into bodily complaints.",
    seeAlso: ["Somatic symptom disorder", "Conversion disorder"]
  },
  {
    term: "Passive aggression",
    aliases: ["passive-aggressive behavior"],
    category: "Defense Mechanisms",
    def: "Indirect expression of anger or hostility through passivity, procrastination, or non-compliance rather than direct confrontation.",
    seeAlso: ["Aggression", "Acting out"]
  },
  {
    term: "Intellectualization",
    aliases: ["isolation of affect"],
    category: "Defense Mechanisms",
    def: "Excessive use of abstract thinking or logic to avoid emotional experience; separation of thought from feeling.",
    seeAlso: ["Isolation of affect", "Rationalization"]
  },
  {
    term: "Reaction formation",
    aliases: ["reversal"],
    category: "Defense Mechanisms",
    def: "Expression of an unconscious impulse as its opposite in conscious behavior or speech (e.g., expressing love while feeling hatred).",
    seeAlso: ["Repression", "Undoing"]
  },
  {
    term: "Repression",
    aliases: ["psychological repression"],
    category: "Defense Mechanisms",
    def: "Unconscious exclusion of thoughts, feelings, or impulses from conscious awareness; the prototype defense mechanism in psychoanalytic theory.",
    seeAlso: ["Suppression", "Dissociation"]
  },
  {
    term: "Displacement",
    aliases: ["emotional displacement"],
    category: "Defense Mechanisms",
    def: "Redirection of emotion from the original source to a substitute person or object (e.g., anger at boss redirected as anger at family).",
    seeAlso: ["Rationalization", "Sublimation"]
  },
  {
    term: "Rationalization",
    aliases: ["making excuses"],
    category: "Defense Mechanisms",
    def: "Unconscious justification of behavior or belief with rational explanations that mask the true (often unconscious) motivations.",
    seeAlso: ["Intellectualization", "Displacement"]
  },
  {
    term: "Undoing",
    aliases: ["magical undoing"],
    category: "Defense Mechanisms",
    def: "Attempting to reverse, negate, or erase an unconscious wish or deed through compensatory behavior (e.g., OCD rituals).",
    seeAlso: ["Isolation of affect", "OCD"]
  },
  {
    term: "Dissociation",
    aliases: ["dissociative response"],
    category: "Defense Mechanisms",
    def: "Unconscious separation of thoughts, feelings, memories, or identity from conscious awareness; a spectrum from normal daydreaming to pathological dissociative disorders.",
    seeAlso: ["Depersonalization", "Derealization", "Dissociative identity disorder"]
  },
  {
    term: "Isolation of affect",
    aliases: ["isolation"],
    category: "Defense Mechanisms",
    def: "Conscious separation of feeling from thought or memory; the person can discuss a traumatic event without emotion.",
    seeAlso: ["Intellectualization", "Undoing"]
  },
  {
    term: "Identification",
    aliases: ["psychological identification"],
    category: "Defense Mechanisms",
    def: "Unconscious adoption of characteristics of another person, often a parent or admired figure; an aspect of normal development and defense.",
    seeAlso: ["Introjection", "Idealization"]
  },
  {
    term: "Introjection",
    aliases: ["internalization"],
    category: "Defense Mechanisms",
    def: "Unconscious incorporation of external figures' values, standards, or traits into the self (e.g., superego formation); internalization of perceived others.",
    seeAlso: ["Identification", "Projective identification"]
  },
  {
    term: "Altruism",
    aliases: ["mature altruism"],
    category: "Defense Mechanisms",
    def: "Helping others as a mature defense; derived satisfaction from being helpful while managing one's own emotions appropriately.",
    seeAlso: ["Sublimation", "Humor"]
  },
  {
    term: "Anticipation",
    aliases: ["planning"],
    category: "Defense Mechanisms",
    def: "Realistic planning for future discomfort or challenges; a mature defense involving conscious foresight and preparation.",
    seeAlso: ["Suppression", "Sublimation"]
  },
  {
    term: "Humor",
    aliases: ["appropriate humor"],
    category: "Defense Mechanisms",
    def: "Use of humor to manage difficult emotions while maintaining the ability to feel; differs from gallows humor or mockery.",
    seeAlso: ["Sublimation", "Altruism"]
  },
  {
    term: "Sublimation",
    aliases: ["channeling"],
    category: "Defense Mechanisms",
    def: "Channeling unconscious emotional impulses into socially acceptable or productive activities (e.g., aggression into sports, conflict into art).",
    seeAlso: ["Displacement", "Altruism"]
  },
  {
    term: "Suppression",
    aliases: ["conscious suppression"],
    category: "Defense Mechanisms",
    def: "Conscious, voluntary postponement or inhibition of impulses, conflicts, or desires. Unlike repression, it is conscious.",
    seeAlso: ["Repression", "Anticipation"]
  },
  {
    term: "Capgras syndrome",
    aliases: ["Capgras delusion"],
    category: "Eponyms & Syndromes",
    def: "Delusional belief that a close friend or family member has been replaced by an identical-looking impostor. May occur in schizophrenia, mood disorders, and neurological conditions.",
    seeAlso: ["Delusion", "Fregoli syndrome", "Psychosis"]
  },
  {
    term: "Cotard syndrome",
    aliases: ["Cotard delusion"],
    category: "Eponyms & Syndromes",
    def: "Delusional belief that one is dead, does not exist, is putrefying, or has become a zombie. Rare, often associated with severe depression, schizophrenia, or brain injury.",
    seeAlso: ["Nihilistic delusion", "Delusion"]
  },
  {
    term: "De Clérambault syndrome",
    aliases: ["erotomania"],
    category: "Eponyms & Syndromes",
    def: "Delusional disorder in which the person believes another (typically of higher status) is in love with them, despite evidence to the contrary.",
    seeAlso: ["Erotomanic delusion", "Delusional disorder"]
  },
  {
    term: "Fregoli syndrome",
    aliases: ["Fregoli delusion"],
    category: "Eponyms & Syndromes",
    def: "Delusional belief that different people are actually the same person in disguise or taking on different identities. Opposite of Capgras syndrome.",
    seeAlso: ["Capgras syndrome", "Delusion"]
  },
  {
    term: "Ganser syndrome",
    aliases: ["pseudodementia"],
    category: "Eponyms & Syndromes",
    def: "Condition characterized by vague, approximate answers ('talking past the point') to simple questions, often in a context of extreme stress or legal proceedings. May represent factitious or malingered behavior.",
    seeAlso: ["Factitious disorder", "Malingering"]
  },
  {
    term: "Geschwind syndrome",
    aliases: ["temporal lobe epilepsy syndrome"],
    category: "Eponyms & Syndromes",
    def: "Proposed behavioral syndrome associated with temporal lobe epilepsy: hypergraphia, heightened emotionality, intensified cognitive and emotional concerns, religiosity, and altered sexuality.",
    seeAlso: ["Religiosity", "Seizure disorder"]
  },
  {
    term: "Gilles de la Tourette syndrome",
    aliases: ["Tourette syndrome"],
    category: "Eponyms & Syndromes",
    def: "Neurodevelopmental disorder with multiple motor and vocal tics lasting >1 year, onset before age 18. Often associated with ADHD and OCD.",
    seeAlso: ["Tic", "ADHD", "OCD"]
  },
  {
    term: "Kleine-Levin syndrome",
    aliases: ["sleeping beauty syndrome"],
    category: "Eponyms & Syndromes",
    def: "Rare disorder of recurrent hypersomnia with behavioral changes; episodes of excessive sleep lasting days to weeks separated by normal periods.",
    seeAlso: ["Hypersomnia", "Sleep disorder"]
  },
  {
    term: "Klüver-Bucy syndrome",
    aliases: ["Kluver-Bucy"],
    category: "Eponyms & Syndromes",
    def: "Behavioral syndrome from bilateral temporal lobe lesions characterized by hypersexuality, hyperorality, hyperphagia, placidity, and visual agnosia.",
    seeAlso: ["Agnosia", "Neurological disorder"]
  },
  {
    term: "Korsakoff syndrome",
    aliases: ["Wernicke-Korsakoff", "alcoholic amnestic disorder"],
    category: "Eponyms & Syndromes",
    def: "Amnestic disorder caused by severe thiamine deficiency, often from chronic alcohol use; characterized by anterograde and retrograde amnesia with confabulation.",
    seeAlso: ["Wernicke encephalopathy", "Amnesia", "Alcohol use disorder"]
  },
  {
    term: "Munchausen syndrome",
    aliases: ["factitious disorder imposed on self"],
    category: "Eponyms & Syndromes",
    def: "Factitious disorder in which the person deliberately produces, feigns, or exaggerates physical or psychological symptoms; motivated by assumption of the sick role.",
    seeAlso: ["Factitious disorder", "Malingering"]
  },
  {
    term: "Othello syndrome",
    aliases: ["delusional jealousy"],
    category: "Eponyms & Syndromes",
    def: "False belief that a partner is unfaithful, held with conviction and potentially escalating to violence. Related to morbid jealousy.",
    seeAlso: ["Delusional jealousy", "Delusion"]
  },
  {
    term: "Pick disease",
    aliases: ["Pick's disease"],
    category: "Eponyms & Syndromes",
    def: "Progressive neurodegenerative disorder within frontotemporal dementia; characterized by tau-positive inclusions and early behavioral/personality changes.",
    seeAlso: ["Frontotemporal dementia", "Dementia"],
    link: { blogSlug: "frontotemporal-dementia" }
  },
  {
    term: "Rett syndrome",
    aliases: ["Rett disorder"],
    category: "Eponyms & Syndromes",
    def: "Neurodevelopmental disorder affecting primarily females; normal development followed by loss of purposeful hand skills, autism spectrum features, and loss of language.",
    seeAlso: ["Autism spectrum disorder", "Developmental disorder"]
  },
  {
    term: "Stockholm syndrome",
    aliases: ["trauma bonding"],
    category: "Eponyms & Syndromes",
    def: "Psychological response in which hostages develop positive feelings or identification with their captors as a survival mechanism.",
    seeAlso: ["Trauma", "Bonding"]
  },
  {
    term: "Wernicke encephalopathy",
    aliases: ["acute thiamine deficiency"],
    category: "Eponyms & Syndromes",
    def: "Acute neuropsychiatric emergency from severe thiamine deficiency; triad of ophthalmoplegia, ataxia, and confusion. Requires immediate treatment to prevent permanent Korsakoff syndrome.",
    seeAlso: ["Korsakoff syndrome", "Thiamine deficiency", "Alcohol use disorder"]
  },
  {
    term: "Charles Bonnet syndrome",
    aliases: ["visual release phenomenon"],
    category: "Eponyms & Syndromes",
    def: "Visual hallucinations in persons with significant visual loss but preserved cognitive function; hallucinations are typically non-threatening and the person retains insight.",
    seeAlso: ["Hallucination", "Visual loss"]
  },
  {
    term: "Diogenes syndrome",
    aliases: ["senile squalor"],
    category: "Eponyms & Syndromes",
    def: "Condition in older adults characterized by extreme self-neglect, compulsive hoarding, and social withdrawal, often without psychiatric diagnosis.",
    seeAlso: ["Hoarding disorder", "Self-neglect"]
  },
  {
    term: "Folie à deux",
    aliases: ["shared psychotic disorder"],
    category: "Eponyms & Syndromes",
    def: "Transmission of delusional belief from one individual to another in a close relationship. When the individuals separate, the secondary person may recover.",
    seeAlso: ["Psychosis", "Delusional disorder"]
  },
  {
    term: "Asperger syndrome",
    aliases: ["Asperger's disorder"],
    category: "Eponyms & Syndromes",
    def: "Neurodevelopmental condition (now subsumed in autism spectrum disorder in DSM-5) characterized by social difficulties, restricted interests, and often average or above-average intelligence.",
    seeAlso: ["Autism spectrum disorder"],
    link: { blogSlug: "autism-spectrum-disorder" }
  },
  {
    term: "Briquet syndrome",
    aliases: ["somatization disorder"],
    category: "Eponyms & Syndromes",
    def: "Historical term for somatic symptom disorder; polysymptomatic presentation of pain and non-pain physical complaints across multiple organ systems.",
    seeAlso: ["Somatic symptom disorder", "Somatization"]
  },
  {
    term: "Lesch-Nyhan syndrome",
    aliases: ["HGPRT deficiency"],
    category: "Eponyms & Syndromes",
    def: "Rare X-linked genetic disorder causing severe intellectual disability, gout, and characteristic self-injurious behavior (self-biting, self-hitting).",
    seeAlso: ["Intellectual disability", "Self-injury"]
  },
  {
    term: "Smith-Magenis syndrome",
    aliases: ["SMS"],
    category: "Eponyms & Syndromes",
    def: "Developmental disorder from 17p11.2 deletion; features intellectual disability, behavioral problems, speech delay, and distinctive facial features.",
    seeAlso: ["Developmental disorder", "Intellectual disability"]
  },
  {
    term: "Adjustment disorder",
    aliases: ["situational disorder"],
    category: "Diagnoses (DSM-5-TR)",
    def: "Development of emotional or behavioral symptoms in response to an identifiable stressor, within 3 months of onset, and with distress exceeding expected response.",
    seeAlso: ["Stressor", "Grief", "Trauma"],
    link: { blogSlug: "adjustment-disorder" }
  },
  {
    term: "ARFID",
    aliases: ["avoidant/restrictive food intake disorder"],
    category: "Diagnoses (DSM-5-TR)",
    def: "Persistent restriction of food intake leading to nutritional deficiency or functional impairment; not due to food unavailability or cultural norms, but to sensory or anxiety-related avoidance.",
    seeAlso: ["Anorexia nervosa", "Eating disorder"]
  },
  {
    term: "Autism spectrum disorder",
    aliases: ["ASD"],
    category: "Diagnoses (DSM-5-TR)",
    def: "Neurodevelopmental disorder with persistent deficits in social communication and restricted, repetitive behaviors; onset in early childhood but may not manifest until social demands exceed capabilities.",
    seeAlso: ["Asperger syndrome", "ADHD"],
    link: { blogSlug: "autism-spectrum-disorder" }
  },
  {
    term: "Bipolar I disorder",
    aliases: ["bipolar type I"],
    category: "Diagnoses (DSM-5-TR)",
    def: "Mood disorder characterized by at least one manic episode (and usually depressive episodes). Manic episodes cause severe impairment and may include psychotic features.",
    seeAlso: ["Bipolar II disorder", "Manic episode", "Cyclothymia"],
    link: { blogSlug: "bipolar-disorder" }
  },
  {
    term: "Bipolar II disorder",
    aliases: ["bipolar type II"],
    category: "Diagnoses (DSM-5-TR)",
    def: "Mood disorder with pattern of hypomanic and depressive episodes, but no full manic episodes. Hypomanic episodes are shorter and less impairing than manic episodes.",
    seeAlso: ["Bipolar I disorder", "Hypomanic episode", "Cyclothymia"],
    link: { blogSlug: "bipolar-disorder" }
  },
  {
    term: "Borderline personality disorder",
    aliases: ["BPD"],
    category: "Diagnoses (DSM-5-TR)",
    def: "Pervasive pattern of unstable relationships, self-image, affect, and impulsive behavior; characterized by fear of abandonment, identity disturbance, chronic emptiness, and suicidal behavior.",
    seeAlso: ["Personality disorder", "Splitting", "Self-harm"],
    link: { blogSlug: "personality-disorders" }
  },
  {
    term: "Brief psychotic disorder",
    aliases: ["brief psychosis"],
    category: "Diagnoses (DSM-5-TR)",
    def: "Psychotic episode lasting 1 day to 1 month, followed by complete remission. Often precipitated by stressor; good prognosis but may precede schizophrenia.",
    seeAlso: ["Schizophreniform disorder", "Psychosis"],
    link: { blogSlug: "first-break-psychosis" }
  },
  {
    term: "Conversion disorder",
    aliases: ["functional neurological symptom disorder"],
    category: "Diagnoses (DSM-5-TR)",
    def: "Presence of motor or sensory neurological symptoms without medical explanation; symptoms are incompatible with known neurological disease. Psychological stressor often precedes onset.",
    seeAlso: ["Somatic symptom disorder", "Illness anxiety disorder"]
  },
  {
    term: "Cyclothymia",
    aliases: ["cyclothymic disorder"],
    category: "Diagnoses (DSM-5-TR)",
    def: "Chronic mood disorder with alternating periods of subsyndromal hypomanic and depressive symptoms for at least 2 years (1 year in children); symptoms do not meet criteria for bipolar disorder.",
    seeAlso: ["Bipolar I disorder", "Bipolar II disorder", "Dysthymia"]
  },
  {
    term: "Delirium",
    aliases: ["acute confusion"],
    category: "Diagnoses (DSM-5-TR)",
    def: "Acute disturbance of attention and awareness with reduced ability to direct/focus/sustain/shift attention, accompanied by altered consciousness; develops rapidly with fluctuating course.",
    seeAlso: ["Dementia", "Hallucination"],
    link: { blogSlug: "delirium" }
  },
  {
    term: "Delusional disorder",
    aliases: ["monosymptomatic delusion"],
    category: "Diagnoses (DSM-5-TR)",
    def: "Non-bizarre delusions present for at least 1 month in the absence of prominent hallucinations, negative symptoms, or cognitive decline. Functioning typically preserved outside the delusion.",
    seeAlso: ["Delusion", "Schizophrenia", "Psychosis"],
    link: { blogSlug: "first-break-psychosis" }
  },
  {
    term: "Depersonalization-derealization disorder",
    aliases: ["depersonalization disorder"],
    category: "Diagnoses (DSM-5-TR)",
    def: "Recurrent episodes of depersonalization (feeling detached from self) or derealization (feeling world is unreal) that cause significant distress and impairment.",
    seeAlso: ["Dissociation", "PTSD", "Anxiety"]
  },
  {
    term: "Disorganized attachment",
    aliases: ["disordered attachment"],
    category: "Diagnoses (DSM-5-TR)",
    def: "Incoherent responses to caregiver; mixing approach and avoidance, fearfulness, or freeze responses. Results from frightened or frightening caregiver.",
    seeAlso: ["Attachment disorder", "Reactive attachment disorder", "Childhood trauma"]
  },
  {
    term: "Dissociative identity disorder",
    aliases: ["DID", "multiple personality disorder"],
    category: "Diagnoses (DSM-5-TR)",
    def: "Presence of two or more distinct personality states with recurrent gaps in recall of important personal information, events, or skills; typically preceded by severe childhood trauma.",
    seeAlso: ["Dissociation", "Trauma", "Other specified dissociative disorder"],
    link: { blogSlug: "dissociative-disorders" }
  },
  {
    term: "Factitious disorder",
    aliases: ["factitious disorder imposed on self"],
    category: "Diagnoses (DSM-5-TR)",
    def: "Deliberate production or exaggeration of physical or psychological symptoms, with deception as a central feature; motivated by assumption of the sick role rather than external gain.",
    seeAlso: ["Malingering", "Munchausen syndrome", "Somatization"]
  },
  {
    term: "Generalized anxiety disorder",
    aliases: ["GAD"],
    category: "Diagnoses (DSM-5-TR)",
    def: "Persistent excessive worry about multiple aspects of daily life (≥6 months), accompanied by physical symptoms; causing significant distress or impairment.",
    seeAlso: ["Anxiety", "Panic disorder", "OCD"]
  },
  {
    term: "Hoarding disorder",
    aliases: ["compulsive hoarding"],
    category: "Diagnoses (DSM-5-TR)",
    def: "Persistent difficulty parting with possessions regardless of actual value; results in clutter that prevents normal use of living space and causes distress.",
    seeAlso: ["OCD", "Diogenes syndrome"]
  },
  {
    term: "Illness anxiety disorder",
    aliases: ["hypochondriasis"],
    category: "Diagnoses (DSM-5-TR)",
    def: "Preoccupation with having or acquiring a serious illness (despite minimal symptoms), high anxiety about health, and excessive health-checking behaviors.",
    seeAlso: ["Somatic symptom disorder", "Health anxiety"]
  },
  {
    term: "Intermittent explosive disorder",
    aliases: ["IED"],
    category: "Diagnoses (DSM-5-TR)",
    def: "Recurrent behavioral outbursts with verbal or physical aggression out of proportion to the situation; person experiences remorse afterward.",
    seeAlso: ["Anger", "Impulse control disorder"]
  },
  {
    term: "Kleptomania",
    aliases: ["compulsive stealing"],
    category: "Diagnoses (DSM-5-TR)",
    def: "Recurrent failure to resist the urge to steal; items taken are not needed or wanted; theft produces tension and relief or gratification.",
    seeAlso: ["Pyromania", "Impulse control disorder"]
  },
  {
    term: "Major depressive disorder",
    aliases: ["MDD", "major depression"],
    category: "Diagnoses (DSM-5-TR)",
    def: "Presence of depressed mood or loss of interest/pleasure for ≥2 weeks with ≥5 symptoms (sleep, appetite, guilt, concentration, fatigue, psychomotor change, suicidal ideation); causing significant distress.",
    seeAlso: ["Depression", "Dysthymia", "Bipolar disorder"],
    link: { blogSlug: "major-depressive-disorder" }
  },
  {
    term: "Narcissistic personality disorder",
    aliases: ["NPD"],
    category: "Diagnoses (DSM-5-TR)",
    def: "Pervasive pattern of grandiosity, need for excessive admiration, and lack of empathy; preoccupation with fantasies of power or achievement.",
    seeAlso: ["Personality disorder", "Grandiosity"],
    link: { blogSlug: "personality-disorders" }
  },
  {
    term: "OCD",
    aliases: ["obsessive-compulsive disorder"],
    category: "Diagnoses (DSM-5-TR)",
    def: "Presence of obsessions (intrusive thoughts, images, or urges) and/or compulsions (repetitive behaviors or mental acts); person recognizes obsessions as irrational and compulsions as time-consuming.",
    seeAlso: ["Obsession", "Compulsion", "OCPD"],
    link: { blogSlug: "obsessive-compulsive-disorder" }
  },
  {
    term: "Oppositional defiant disorder",
    aliases: ["ODD"],
    category: "Diagnoses (DSM-5-TR)",
    def: "Pattern of defiance, hostility, and disobedience toward authority figures lasting ≥6 months, often with irritability and arguing.",
    seeAlso: ["Conduct disorder", "ADHD", "Negativism"]
  },
  {
    term: "Panic disorder",
    aliases: ["panic attack disorder"],
    category: "Diagnoses (DSM-5-TR)",
    def: "Recurrent unexpected panic attacks with persistent worry about future attacks and/or avoidance of situations following attacks.",
    seeAlso: ["Panic attack", "Agoraphobia", "Anxiety disorder"],
    link: { blogSlug: "panic-attacks-gad" }
  },
  {
    term: "Paranoid personality disorder",
    aliases: ["paranoid PD"],
    category: "Diagnoses (DSM-5-TR)",
    def: "Pervasive pattern of distrust and suspicion; interpreting motives of others as malevolent; holding grudges; suspicious of fidelity of partner.",
    seeAlso: ["Personality disorder", "Paranoia"]
  },
  {
    term: "Persistent depressive disorder",
    aliases: ["dysthymia"],
    category: "Diagnoses (DSM-5-TR)",
    def: "Chronic depressed mood for ≥2 years in adults; symptoms meet criteria for mild depression but are more enduring.",
    seeAlso: ["Dysthymia", "Major depressive disorder"]
  },
  {
    term: "Premenstrual dysphoric disorder",
    aliases: ["PMDD"],
    category: "Diagnoses (DSM-5-TR)",
    def: "Severe cyclic mood changes, irritability, and anxiety occurring in the luteal phase of the menstrual cycle for most cycles over a year; causing marked distress.",
    seeAlso: ["Mood disorder", "Premenstrual tension"]
  },
  {
    term: "Prolonged grief disorder",
    aliases: ["complicated grief"],
    category: "Diagnoses (DSM-5-TR)",
    def: "Intense yearning and/or preoccupation with the deceased for ≥12 months after death (≥6 months in children), causing clinically significant impairment.",
    seeAlso: ["Grief", "Bereavement"],
    link: { blogSlug: "grief-bereavement" }
  },
  {
    term: "Pyromania",
    aliases: ["compulsive fire-setting"],
    category: "Diagnoses (DSM-5-TR)",
    def: "Recurrent failure to resist urge to set fires; person feels tension before the fire-setting and experiences pleasure or relief afterward.",
    seeAlso: ["Kleptomania", "Impulse control disorder"]
  },
  {
    term: "Schizoaffective disorder",
    aliases: ["schizoaffective"],
    category: "Diagnoses (DSM-5-TR)",
    def: "Concurrent presence of schizophrenia symptoms and a mood episode; psychotic symptoms also occur without mood symptoms.",
    seeAlso: ["Schizophrenia", "Bipolar disorder", "Psychosis"],
    link: { blogSlug: "schizophrenia" }
  },
  {
    term: "Schizoid personality disorder",
    aliases: ["schizoid PD"],
    category: "Diagnoses (DSM-5-TR)",
    def: "Pervasive pattern of detachment from social relationships and restricted emotional expression; preference for solitary activities.",
    seeAlso: ["Personality disorder", "Schizotypal personality disorder"]
  },
  {
    term: "Schizophrenia",
    aliases: ["schizophrenic disorder"],
    category: "Diagnoses (DSM-5-TR)",
    def: "Psychotic disorder with ≥2 of the following for ≥1 month (at least one must be delusions, hallucinations, or disorganized speech): delusions, hallucinations, disorganized speech, disorganized/catatonic behavior, negative symptoms.",
    seeAlso: ["Psychosis", "Schizophreniform", "Schizoaffective disorder"],
    link: { blogSlug: "schizophrenia" }
  },
  {
    term: "Schizophreniform disorder",
    aliases: ["schizophreniform"],
    category: "Diagnoses (DSM-5-TR)",
    def: "Schizophrenia-like presentation lasting 1-6 months; episodes may progress to schizophrenia or resolve completely.",
    seeAlso: ["Schizophrenia", "Brief psychotic disorder"]
  },
  {
    term: "Schizotypal personality disorder",
    aliases: ["schizotypal PD"],
    category: "Diagnoses (DSM-5-TR)",
    def: "Pervasive pattern of social withdrawal, cognitive/perceptual distortions, and eccentric behavior; magical thinking, ideas of reference, and unusual perceptual experiences.",
    seeAlso: ["Personality disorder", "Schizoid personality disorder", "Magical thinking"]
  },
  {
    term: "Selective mutism",
    aliases: ["elective mutism"],
    category: "Diagnoses (DSM-5-TR)",
    def: "Persistent failure to speak in specific social situations despite speaking in other settings; causes functional impairment; onset before age 5.",
    seeAlso: ["Mutism", "Anxiety disorder", "Communication disorder"]
  },
  {
    term: "Social anxiety disorder",
    aliases: ["social phobia"],
    category: "Diagnoses (DSM-5-TR)",
    def: "Marked fear or anxiety in social situations where scrutiny is possible; fear of embarrassment or negative evaluation; avoidance or endurance with distress.",
    seeAlso: ["Anxiety", "Phobia", "Panic disorder"],
    link: { blogSlug: "social-anxiety-phobias" }
  },
  {
    term: "Somatic symptom disorder",
    aliases: ["SSD"],
    category: "Diagnoses (DSM-5-TR)",
    def: "Excessive thoughts, feelings, or behaviors related to somatic symptoms; must include ≥1 somatic symptom and be present for ≥6 months.",
    seeAlso: ["Illness anxiety disorder", "Conversion disorder", "Somatization"]
  },
  {
    term: "Specific phobia",
    aliases: ["simple phobia"],
    category: "Diagnoses (DSM-5-TR)",
    def: "Marked fear or anxiety toward a specific object or situation; person avoids phobic stimulus; fear is disproportionate to actual danger.",
    seeAlso: ["Phobia", "Anxiety disorder", "Social anxiety disorder"]
  },
  {
    term: "Trichotillomania",
    aliases: ["hair-pulling disorder"],
    category: "Diagnoses (DSM-5-TR)",
    def: "Recurrent hair-pulling resulting in noticeable hair loss; repeated attempts to resist or decrease the behavior.",
    seeAlso: ["NSSI", "OCD", "Body-focused repetitive behavior"]
  },
  {
    term: "Amygdala",
    aliases: ["amygdalae"],
    category: "Neuroanatomy",
    def: "Almond-shaped limbic structure involved in emotion processing, fear conditioning, and memory consolidation; critical for emotional responses.",
    seeAlso: ["Limbic system", "Fear conditioning", "PTSD"]
  },
  {
    term: "Anterior cingulate cortex",
    aliases: ["ACC"],
    category: "Neuroanatomy",
    def: "Region in the medial frontal cortex involved in emotion regulation, error detection, and conflict monitoring; implicated in mood disorders and anxiety.",
    seeAlso: ["Cingulate gyrus", "Emotion regulation"]
  },
  {
    term: "Basal ganglia",
    aliases: ["striatum complex"],
    category: "Neuroanatomy",
    def: "Cluster of nuclei involved in motor control, habit formation, reward processing, and motivation; dysfunction implicated in movement disorders and addiction.",
    seeAlso: ["Caudate", "Putamen", "Nucleus accumbens", "Motor control"]
  },
  {
    term: "Caudate",
    aliases: ["caudate nucleus"],
    category: "Neuroanatomy",
    def: "Part of the basal ganglia involved in motor planning and reward processing; implicated in OCD and addiction.",
    seeAlso: ["Basal ganglia", "Putamen", "OCD"]
  },
  {
    term: "Cingulate gyrus",
    aliases: ["cingulum"],
    category: "Neuroanatomy",
    def: "Cortical region surrounding the corpus callosum; involved in emotion regulation, pain processing, and decision-making.",
    seeAlso: ["Anterior cingulate cortex", "Limbic system"]
  },
  {
    term: "Corpus callosum",
    aliases: ["CC"],
    category: "Neuroanatomy",
    def: "Large white matter tract connecting the left and right cerebral hemispheres; allows interhemispheric communication.",
    seeAlso: ["Commissure", "White matter"]
  },
  {
    term: "Default mode network",
    aliases: ["DMN"],
    category: "Neuroanatomy",
    def: "Large-scale brain network active at rest; includes medial prefrontal cortex, posterior cingulate, and angular gyrus; implicated in self-referential thinking and mind-wandering.",
    seeAlso: ["Salience network", "Resting state"]
  },
  {
    term: "Dorsolateral prefrontal cortex",
    aliases: ["dlPFC"],
    category: "Neuroanatomy",
    def: "Brain region involved in executive function, working memory, and cognitive control; implicated in depression, ADHD, and schizophrenia.",
    seeAlso: ["Prefrontal cortex", "Executive function"]
  },
  {
    term: "Entorhinal cortex",
    aliases: ["entorhinal"],
    category: "Neuroanatomy",
    def: "Cortical region serving as gateway between hippocampus and neocortex; critical for memory formation and spatial navigation.",
    seeAlso: ["Hippocampus", "Memory"]
  },
  {
    term: "Hippocampus",
    aliases: ["hippocampi"],
    category: "Neuroanatomy",
    def: "Medial temporal lobe structure critical for explicit memory formation and consolidation; also involved in emotional memory and contextual fear.",
    seeAlso: ["Memory", "PTSD", "Temporal lobe"]
  },
  {
    term: "Hypothalamus",
    aliases: ["hypothalamic"],
    category: "Neuroanatomy",
    def: "Small region below the thalamus controlling autonomic nervous system, hormone release, temperature, and homeostasis; key in stress response.",
    seeAlso: ["Neuroendocrine", "HPA axis", "Stress response"]
  },
  {
    term: "Insula",
    aliases: ["insular cortex"],
    category: "Neuroanatomy",
    def: "Cortical region involved in interoception, emotional awareness, and salience detection; implicated in anxiety and addiction.",
    seeAlso: ["Salience network", "Interoception", "Anxiety"]
  },
  {
    term: "Locus coeruleus",
    aliases: ["LC"],
    category: "Neuroanatomy",
    def: "Small brainstem nucleus containing most of the brain's norepinephrine-producing neurons; critical for arousal, attention, and stress response.",
    seeAlso: ["Norepinephrine", "Stress response", "Attention"]
  },
  {
    term: "Nucleus accumbens",
    aliases: ["NAcc"],
    category: "Neuroanatomy",
    def: "Key reward center in the striatum involved in pleasure, motivation, and reinforcement; target of addictive drugs.",
    seeAlso: ["Reward circuit", "Dopamine", "Addiction"]
  },
  {
    term: "Orbitofrontal cortex",
    aliases: ["OFC"],
    category: "Neuroanatomy",
    def: "Prefrontal region involved in reward evaluation, decision-making, and impulse control; implicated in addiction and OCD.",
    seeAlso: ["Prefrontal cortex", "Decision-making", "Reward"]
  },
  {
    term: "Raphe nuclei",
    aliases: ["median raphe", "dorsal raphe"],
    category: "Neuroanatomy",
    def: "Brainstem structures containing most serotonin-producing neurons; projects widely throughout brain; implicated in mood regulation.",
    seeAlso: ["Serotonin", "Mood regulation"]
  },
  {
    term: "Salience network",
    aliases: ["SN"],
    category: "Neuroanatomy",
    def: "Brain network including anterior insula and anterior cingulate cortex; responsible for detecting behaviorally significant events.",
    seeAlso: ["Default mode network", "Insula", "Executive control"]
  },
  {
    term: "Substantia nigra",
    aliases: ["SNc"],
    category: "Neuroanatomy",
    def: "Midbrain structure containing dopamine neurons in nigrostriatal pathway; degeneration occurs in Parkinson disease.",
    seeAlso: ["Dopamine", "Parkinson disease", "Motor control"]
  },
  {
    term: "Thalamus",
    aliases: ["thalami"],
    category: "Neuroanatomy",
    def: "Large relay nucleus receiving sensory information and projecting to cortex; also involved in consciousness and attention.",
    seeAlso: ["Sensory relay", "Consciousness"]
  },
  {
    term: "Ventral tegmental area",
    aliases: ["VTA"],
    category: "Neuroanatomy",
    def: "Midbrain dopamine nucleus in mesolimbic/mesocortical pathways; central to reward, motivation, and addiction.",
    seeAlso: ["Dopamine", "Reward circuit", "Addiction"]
  },
  {
    term: "Ventromedial prefrontal cortex",
    aliases: ["vmPFC"],
    category: "Neuroanatomy",
    def: "Region involved in emotion regulation, decision-making, and fear extinction; implicated in anxiety and PTSD.",
    seeAlso: ["Prefrontal cortex", "Emotion regulation", "PTSD"]
  },
  {
    term: "5-HT1A receptor",
    aliases: ["serotonin 1A"],
    category: "Neurochemistry",
    def: "Serotonin receptor subtype; postsynaptic locations involved in anxiety and depression; presynaptic autoreceptors regulate serotonin release.",
    seeAlso: ["Serotonin", "SSRI", "Buspirone"]
  },
  {
    term: "5-HT2A receptor",
    aliases: ["serotonin 2A"],
    category: "Neurochemistry",
    def: "Serotonin receptor subtype involved in visual processing and mood; target of hallucinogenic drugs and atypical antipsychotics.",
    seeAlso: ["Serotonin", "Antipsychotic", "Hallucination"]
  },
  {
    term: "5-HT2C receptor",
    aliases: ["serotonin 2C"],
    category: "Neurochemistry",
    def: "Serotonin receptor involved in appetite regulation and mood; blockade associated with weight gain in antipsychotics.",
    seeAlso: ["Serotonin", "Weight gain", "Antipsychotic side effects"]
  },
  {
    term: "Alpha-1 adrenergic receptor",
    aliases: ["alpha-1 receptor"],
    category: "Neurochemistry",
    def: "Norepinephrine receptor involved in arousal and vascular function; blockade causes orthostatic hypotension and sedation.",
    seeAlso: ["Norepinephrine", "Orthostatic hypotension", "Antipsychotic side effects"]
  },
  {
    term: "Alpha-2 adrenergic receptor",
    aliases: ["alpha-2 receptor"],
    category: "Neurochemistry",
    def: "Norepinephrine receptor involved in arousal and blood pressure regulation; agonists used for ADHD (guanfacine, clonidine).",
    seeAlso: ["Norepinephrine", "ADHD", "Blood pressure"]
  },
  {
    term: "D1 dopamine receptor",
    aliases: ["D1 receptor"],
    category: "Neurochemistry",
    def: "Dopamine receptor subtype; primarily excitatory; involved in motor control and reward.",
    seeAlso: ["Dopamine", "Antipsychotic", "Motor control"]
  },
  {
    term: "D2 dopamine receptor",
    aliases: ["D2 receptor"],
    category: "Neurochemistry",
    def: "Primary dopamine receptor blocked by antipsychotics; located in mesolimbic and nigrostriatal pathways; blockade produces antipsychotic effect and extrapyramidal symptoms.",
    seeAlso: ["Dopamine", "Antipsychotic", "Extrapyramidal symptoms"]
  },
  {
    term: "D3 dopamine receptor",
    aliases: ["D3 receptor"],
    category: "Neurochemistry",
    def: "Dopamine receptor involved in reward and motivation; potential target for addiction treatment.",
    seeAlso: ["Dopamine", "Reward", "Addiction"]
  },
  {
    term: "D4 dopamine receptor",
    aliases: ["D4 receptor"],
    category: "Neurochemistry",
    def: "Dopamine receptor involved in prefrontal cortex; associated with ADHD (DRD4 gene polymorphism).",
    seeAlso: ["Dopamine", "ADHD"]
  },
  {
    term: "Dopamine",
    aliases: ["DA"],
    category: "Neurochemistry",
    def: "Neurotransmitter involved in reward, motivation, motor control, and cognition; dysregulation implicated in schizophrenia, ADHD, and addiction.",
    seeAlso: ["D1 receptor", "D2 receptor", "Reward circuit"]
  },
  {
    term: "GABA",
    aliases: ["gamma-aminobutyric acid"],
    category: "Neurochemistry",
    def: "Primary inhibitory neurotransmitter in the CNS; reduced function implicated in anxiety; enhanced by benzodiazepines.",
    seeAlso: ["GABA-A receptor", "Benzodiazepine", "Anxiety"]
  },
  {
    term: "GABA-A receptor",
    aliases: ["GABAR"],
    category: "Neurochemistry",
    def: "Ionotropic receptor for GABA; target of benzodiazepines, barbiturates, and alcohol; enhances chloride influx.",
    seeAlso: ["GABA", "Benzodiazepine", "Alcohol"]
  },
  {
    term: "Glutamate",
    aliases: ["L-glutamate"],
    category: "Neurochemistry",
    def: "Primary excitatory neurotransmitter in the CNS; excessive glutamate implicated in excitotoxicity, neurodegenerative diseases, and schizophrenia.",
    seeAlso: ["NMDA receptor", "Ketamine", "Schizophrenia"]
  },
  {
    term: "H1 histamine receptor",
    aliases: ["H1 receptor"],
    category: "Neurochemistry",
    def: "Histamine receptor blocked by first-generation antipsychotics and antihistamines; blockade causes sedation and weight gain.",
    seeAlso: ["Histamine", "Sedation", "Weight gain"]
  },
  {
    term: "M1 muscarinic receptor",
    aliases: ["M1 receptor"],
    category: "Neurochemistry",
    def: "Acetylcholine receptor involved in cognition and memory; some antipsychotics block M1 receptors, causing anticholinergic effects.",
    seeAlso: ["Acetylcholine", "Anticholinergic effects", "Memory"]
  },
  {
    term: "NMDA receptor",
    aliases: ["N-methyl-D-aspartate receptor"],
    category: "Neurochemistry",
    def: "Ionotropic glutamate receptor; blocked by ketamine and memantine; implicated in memory and learning.",
    seeAlso: ["Glutamate", "Ketamine", "Memory"]
  },
  {
    term: "Norepinephrine",
    aliases: ["NE", "noradrenaline"],
    category: "Neurochemistry",
    def: "Neurotransmitter involved in arousal, attention, and mood; depleted in depression; target of SNRIs and tricyclic antidepressants.",
    seeAlso: ["Locus coeruleus", "SNRI", "Antidepressant"]
  },
  {
    term: "Serotonin",
    aliases: ["5-hydroxytryptamine", "5-HT"],
    category: "Neurochemistry",
    def: "Neurotransmitter involved in mood, anxiety, sleep, and aggression; dysregulation implicated in depression, anxiety, and OCD; target of SSRIs.",
    seeAlso: ["SSRI", "Mood disorder", "Raphe nuclei"]
  },
  {
    term: "Sigma-1 receptor",
    aliases: ["sigma receptor"],
    category: "Neurochemistry",
    def: "Intracellular receptor involved in neuroprotection and inflammation; target of fluvoxamine, an SSRI with sigma-1 agonist activity.",
    seeAlso: ["Fluvoxamine", "Neuroprotection"]
  },
  {
    term: "Acetylcholine",
    aliases: ["ACh"],
    category: "Neurochemistry",
    def: "Neurotransmitter involved in memory, attention, and motor control; reduced in Alzheimer disease; blocked by anticholinergic drugs.",
    seeAlso: ["Anticholinergic", "Memory", "M1 receptor"]
  },
  {
    term: "Mesocortical pathway",
    aliases: ["mesocortical dopamine"],
    category: "Neurochemistry",
    def: "Dopamine pathway from VTA to prefrontal cortex; involved in cognition, motivation, and emotion; dysregulation implicated in schizophrenia.",
    seeAlso: ["Dopamine", "Prefrontal cortex", "Schizophrenia"]
  },
  {
    term: "Mesolimbic pathway",
    aliases: ["mesolimbic dopamine"],
    category: "Neurochemistry",
    def: "Dopamine pathway from VTA to limbic structures; involved in reward and motivation; hyperactivity implicated in psychosis.",
    seeAlso: ["Dopamine", "Reward", "Psychosis"]
  },
  {
    term: "Nigrostriatal pathway",
    aliases: ["nigrostriatal dopamine"],
    category: "Neurochemistry",
    def: "Dopamine pathway from substantia nigra to striatum; critical for motor control; degenerates in Parkinson disease; blocked by antipsychotics, causing EPS.",
    seeAlso: ["Dopamine", "Motor control", "Extrapyramidal symptoms"]
  },
  {
    term: "Tuberoinfundibular pathway",
    aliases: ["hypothalamic-pituitary axis"],
    category: "Neurochemistry",
    def: "Dopamine pathway from hypothalamus to pituitary; dopamine inhibits prolactin release; blocking this pathway causes hyperprolactinemia.",
    seeAlso: ["Dopamine", "Hyperprolactinemia", "Antipsychotic side effects"]
  },
  {
    term: "Agonist",
    aliases: ["receptor agonist"],
    category: "Pharmacology",
    def: "Drug that binds to a receptor and activates it, producing a pharmacological response; can be full agonist (maximal response) or partial agonist (submaximal response).",
    seeAlso: ["Partial agonist", "Antagonist"]
  },
  {
    term: "Allosteric modulator",
    aliases: ["allosteric agent"],
    category: "Pharmacology",
    def: "Drug that binds to a receptor at a site distinct from the orthosteric (main) binding site, modulating the effect of the natural ligand.",
    seeAlso: ["Receptor binding", "Agonist", "Antagonist"]
  },
  {
    term: "Antagonist",
    aliases: ["receptor antagonist"],
    category: "Pharmacology",
    def: "Drug that binds to a receptor without activating it, preventing the natural ligand or other agonists from producing a response.",
    seeAlso: ["Agonist", "Inverse agonist"]
  },
  {
    term: "Anticholinergic effects",
    aliases: ["anticholinergic side effects"],
    category: "Pharmacology",
    def: "Side effects from blockade of muscarinic acetylcholine receptors: dry mouth, constipation, urinary retention, mydriasis, tachycardia, impaired cognition.",
    seeAlso: ["Anticholinergic burden", "M1 receptor"]
  },
  {
    term: "Anticholinergic burden",
    aliases: ["anticholinergic load"],
    category: "Pharmacology",
    def: "Cumulative anticholinergic effect from medications; associated with cognitive decline, delirium, and adverse outcomes in older adults.",
    seeAlso: ["Anticholinergic effects", "Polypharmacy"]
  },
  {
    term: "AUC",
    aliases: ["area under the curve"],
    category: "Pharmacology",
    def: "The integral of plasma concentration over time; used to calculate total drug exposure and bioavailability.",
    seeAlso: ["Pharmacokinetics", "Steady state", "Cmax"]
  },
  {
    term: "Bioavailability",
    aliases: ["oral bioavailability"],
    category: "Pharmacology",
    def: "Fraction of an administered dose that reaches systemic circulation; for oral drugs, reduced by first-pass metabolism.",
    seeAlso: ["First-pass metabolism", "Pharmacokinetics"]
  },
  {
    term: "CYP1A2",
    aliases: ["cytochrome P450 1A2"],
    category: "Pharmacology",
    def: "Enzyme that metabolizes theophylline, caffeine, and some antipsychotics; induced by smoking.",
    seeAlso: ["P450 system", "Drug interaction", "Metabolism"]
  },
  {
    term: "CYP2C19",
    aliases: ["cytochrome P450 2C19"],
    category: "Pharmacology",
    def: "Enzyme that metabolizes SSRIs, citalopram, escitalopram, and some antipsychotics; subject to pharmacogenetic variation.",
    seeAlso: ["P450 system", "SSRI", "Pharmacogenomics"]
  },
  {
    term: "CYP2D6",
    aliases: ["cytochrome P450 2D6"],
    category: "Pharmacology",
    def: "Enzyme that metabolizes tricyclic antidepressants, antipsychotics, beta-blockers, and opioids; most variable P450 enzyme; subject to pharmacogenetic variation.",
    seeAlso: ["P450 system", "Pharmacogenomics", "Drug interaction"]
  },
  {
    term: "CYP3A4",
    aliases: ["cytochrome P450 3A4"],
    category: "Pharmacology",
    def: "Most abundant P450 enzyme; metabolizes many drugs; subject to induction and inhibition; major source of drug interactions.",
    seeAlso: ["P450 system", "Drug interaction", "CYP3A4 inhibitor"]
  },
  {
    term: "Discontinuation syndrome",
    aliases: ["withdrawal syndrome"],
    category: "Pharmacology",
    def: "Constellation of symptoms occurring after abrupt discontinuation of a medication; most common with SSRIs and SNRIs. Symptoms may include dizziness, paresthesias, mood disturbance.",
    seeAlso: ["SSRI", "Antidepressant", "Withdrawal"]
  },
  {
    term: "Downregulation",
    aliases: ["receptor downregulation"],
    category: "Pharmacology",
    def: "Decrease in number of available receptors in response to chronic excess ligand; occurs with long-term agonist use.",
    seeAlso: ["Upregulation", "Tolerance", "Receptor"]
  },
  {
    term: "Drug holiday",
    aliases: ["medication holiday"],
    category: "Pharmacology",
    def: "Planned discontinuation of a medication for a period; sometimes used for antipsychotics to reduce tardive dyskinesia risk, but evidence is limited.",
    seeAlso: ["Tardive dyskinesia", "Antipsychotic"]
  },
  {
    term: "First-pass metabolism",
    aliases: ["first-pass effect"],
    category: "Pharmacology",
    def: "Hepatic metabolism of orally administered drugs before reaching systemic circulation; reduces bioavailability of some drugs.",
    seeAlso: ["Bioavailability", "Metabolism", "CYP system"]
  },
  {
    term: "Half-life",
    aliases: ["t1/2"],
    category: "Pharmacology",
    def: "Time required for plasma concentration of a drug to decrease by 50%; used to predict accumulation and clearance time.",
    seeAlso: ["Steady state", "Clearance", "Pharmacokinetics"]
  },
  {
    term: "Hyperprolactinemia",
    aliases: ["elevated prolactin"],
    category: "Pharmacology",
    def: "Elevated prolactin level from dopamine D2 blockade; causes amenorrhea, sexual dysfunction, and galactorrhea; common with antipsychotics.",
    seeAlso: ["Antipsychotic side effects", "Dopamine", "Tuberoinfundibular pathway"]
  },
  {
    term: "Inverse agonist",
    aliases: ["inverse agonist drug"],
    category: "Pharmacology",
    def: "Drug that reduces receptor activity below baseline (resting) levels; stronger effect than antagonist.",
    seeAlso: ["Antagonist", "Agonist"]
  },
  {
    term: "Kindling",
    aliases: ["behavioral kindling"],
    category: "Pharmacology",
    def: "Progressive sensitization to repeated doses of a drug or repeated stimulation; seen in substance withdrawal and mood cycling.",
    seeAlso: ["Tolerance", "Sensitization", "Substance use"]
  },
  {
    term: "Neuroleptic malignant syndrome",
    aliases: ["NMS"],
    category: "Pharmacology",
    def: "Medical emergency from antipsychotic use: fever, rigidity, altered consciousness, autonomic instability, elevated CK. Requires immediate discontinuation and supportive care.",
    seeAlso: ["Antipsychotic side effects", "Antipsychotic", "Medical emergency"],
    link: { blogSlug: "serotonin-syndrome-nms" }
  },
  {
    term: "P450 system",
    aliases: ["cytochrome P450"],
    category: "Pharmacology",
    def: "Family of hepatic enzymes responsible for metabolism of most medications; subject to induction and inhibition, causing drug interactions.",
    seeAlso: ["CYP2D6", "CYP3A4", "CYP2C19", "Drug interaction"]
  },
  {
    term: "Partial agonist",
    aliases: ["partial agonism"],
    category: "Pharmacology",
    def: "Drug that binds to a receptor and produces a submaximal response; may act as antagonist in presence of full agonist.",
    seeAlso: ["Agonist", "Antipsychotic", "Aripiprazole"]
  },
  {
    term: "Pharmacogenomics",
    aliases: ["pharmacogenetics"],
    category: "Pharmacology",
    def: "Study of how genetic variation affects medication response and metabolism; guides personalized dosing and drug selection.",
    seeAlso: ["CYP2D6", "Pharmacokinetics"],
    link: { blogSlug: "pharmacogenomics-psychiatry" }
  },
  {
    term: "Pharmacokinetics",
    aliases: ["PK"],
    category: "Pharmacology",
    def: "Study of how the body processes drugs: absorption, distribution, metabolism, and elimination.",
    seeAlso: ["Half-life", "Steady state", "Metabolism"],
    link: { blogSlug: "pharmacokinetics" }
  },
  {
    term: "Prodrug",
    aliases: ["inactive drug"],
    category: "Pharmacology",
    def: "Medication that is inactive until metabolized by the body into an active form; used to improve absorption or prolong action.",
    seeAlso: ["Metabolism", "Active metabolite"]
  },
  {
    term: "QTc prolongation",
    aliases: ["QT interval prolongation"],
    category: "Pharmacology",
    def: "Prolongation of the QT interval on EKG from antiarrhythmics, antipsychotics, or other drugs; increases risk of torsades de pointes.",
    seeAlso: ["Antipsychotic side effects", "Torsades de pointes", "EKG"],
    link: { section: "qt-risk", label: "Open QT Risk Tool" }
  },
  {
    term: "Sensitization",
    aliases: ["reverse tolerance"],
    category: "Pharmacology",
    def: "Increased response to repeated doses of a drug; opposite of tolerance; seen with stimulants and some hallucinogens.",
    seeAlso: ["Tolerance", "Kindling"]
  },
  {
    term: "Serotonin syndrome",
    aliases: ["serotonin toxicity"],
    category: "Pharmacology",
    def: "Medical emergency from excessive serotonergic activity; presents with agitation, confusion, rapid heart rate, muscle rigidity, and hyperthermia. Caused by SSRI/MAOI interaction or serotonergic overdose.",
    seeAlso: ["SSRI", "MAOI", "Antidepressant"],
    link: { blogSlug: "serotonin-syndrome-nms" }
  },
  {
    term: "Steady state",
    aliases: ["steady-state concentration"],
    category: "Pharmacology",
    def: "Point at which drug intake equals drug elimination; reached after approximately 5 half-lives of a medication.",
    seeAlso: ["Half-life", "Accumulation", "Pharmacokinetics"]
  },
  {
    term: "Tachyphylaxis",
    aliases: ["acute tolerance"],
    category: "Pharmacology",
    def: "Rapid development of tolerance to a drug with continued or repeated use; occurs hours to days rather than weeks.",
    seeAlso: ["Tolerance", "Kindling"]
  },
  {
    term: "Tolerance",
    aliases: ["drug tolerance"],
    category: "Pharmacology",
    def: "Decreased response to a drug with repeated exposure; requires higher doses to achieve the same effect.",
    seeAlso: ["Tachyphylaxis", "Sensitization", "Downregulation"]
  },
  {
    term: "Upregulation",
    aliases: ["receptor upregulation"],
    category: "Pharmacology",
    def: "Increase in number of available receptors in response to chronic deficit of ligand; occurs with chronic antagonist use.",
    seeAlso: ["Downregulation", "Receptor"]
  },
  {
    term: "Washout",
    aliases: ["wash-out period"],
    category: "Pharmacology",
    def: "Time required for plasma concentration of a drug to become negligible (typically 5-7 half-lives); important before starting a new medication to avoid interactions.",
    seeAlso: ["Half-life", "Cross-taper", "Drug interaction"]
  },
  {
    term: "Agnosia",
    aliases: ["inability to recognize"],
    category: "Cognition & Dementia",
    def: "Inability to recognize or identify sensory stimuli despite intact sensation; can be visual (faces, objects), auditory, or tactile.",
    seeAlso: ["Prosopagnosia", "Aphasia", "Apraxia"]
  },
  {
    term: "Alexia",
    aliases: ["word blindness"],
    category: "Cognition & Dementia",
    def: "Inability to read despite intact vision and language; usually results from brain damage in regions involved in reading.",
    seeAlso: ["Dyslexia", "Aphasia"]
  },
  {
    term: "Amnesia, anterograde",
    aliases: ["anterograde amnesia"],
    category: "Cognition & Dementia",
    def: "Inability to form new memories after the brain damage or insult; affected persons may remember the past but not new information.",
    seeAlso: ["Amnesia", "Korsakoff syndrome", "Memory"]
  },
  {
    term: "Amnesia, retrograde",
    aliases: ["retrograde amnesia"],
    category: "Cognition & Dementia",
    def: "Loss of memory for events that occurred before the brain damage or insult; typically affects remote memories more than recent.",
    seeAlso: ["Amnesia", "Memory loss"]
  },
  {
    term: "Aphasia, Broca",
    aliases: ["expressive aphasia"],
    category: "Cognition & Dementia",
    def: "Language deficit with preserved comprehension but impaired speech production; speech is slow, effortful, and agrammatical.",
    seeAlso: ["Aphasia", "Wernicke aphasia"]
  },
  {
    term: "Aphasia, Wernicke",
    aliases: ["receptive aphasia"],
    category: "Cognition & Dementia",
    def: "Language deficit with impaired comprehension but relatively preserved fluent speech; patient produces fluent but meaningless speech and cannot understand spoken language.",
    seeAlso: ["Aphasia", "Broca aphasia"]
  },
  {
    term: "Apraxia, constructional",
    aliases: ["constructional apraxia"],
    category: "Cognition & Dementia",
    def: "Difficulty copying, drawing, or assembling objects despite intact motor and sensory function; associated with right parietal lobe lesions.",
    seeAlso: ["Apraxia", "Neglect"]
  },
  {
    term: "Apraxia, ideational",
    aliases: ["ideational apraxia"],
    category: "Cognition & Dementia",
    def: "Inability to perform purposeful motor sequences despite intact motor function; patient understands the task but cannot execute it correctly.",
    seeAlso: ["Apraxia", "Ideomotor apraxia"]
  },
  {
    term: "Apraxia, ideomotor",
    aliases: ["ideomotor apraxia"],
    category: "Cognition & Dementia",
    def: "Difficulty performing purposeful movements to command despite understanding the command and having intact motor function.",
    seeAlso: ["Apraxia", "Ideational apraxia"]
  },
  {
    term: "CDR",
    aliases: ["clinical dementia rating"],
    category: "Cognition & Dementia",
    def: "Rating scale assessing severity of cognitive and functional decline across six domains; produces global score from 0 (normal) to 3 (severe dementia).",
    seeAlso: ["Dementia", "Cognition"],
    link: { section: "cdr-tool", label: "Open CDR Tool" }
  },
  {
    term: "Confabulation",
    aliases: ["false memory"],
    category: "Cognition & Dementia",
    def: "Unconscious filling in of memory gaps with fabricated or distorted information; characteristic of Korsakoff syndrome.",
    seeAlso: ["Korsakoff syndrome", "Memory", "Amnesia"]
  },
  {
    term: "Executive dysfunction",
    aliases: ["frontal lobe dysfunction"],
    category: "Cognition & Dementia",
    def: "Impairment in planning, organization, initiation, and cognitive flexibility; affects problem-solving and decision-making.",
    seeAlso: ["Prefrontal cortex", "Planning", "Cognition"]
  },
  {
    term: "FAST",
    aliases: ["functional assessment staging tool"],
    category: "Cognition & Dementia",
    def: "Seven-stage scale rating functional decline in dementia from normal cognition to advanced dementia with minimal verbal output.",
    seeAlso: ["Dementia", "Functional decline"]
  },
  {
    term: "Grasp reflex",
    aliases: ["palmar grasp"],
    category: "Cognition & Dementia",
    def: "Automatic grasping of objects placed in the palm; a frontal release sign indicating frontal lobe dysfunction.",
    seeAlso: ["Frontal lobe signs", "Palmar-mental reflex"]
  },
  {
    term: "MMSE",
    aliases: ["mini-mental state examination"],
    category: "Cognition & Dementia",
    def: "Brief (5-10 min) cognitive screening test; 30 items covering orientation, memory, attention, language. Cutoffs: 24-30 normal, 18-23 mild impairment, <18 severe impairment.",
    seeAlso: ["Cognition", "Dementia screening"]
  },
  {
    term: "MoCA",
    aliases: ["Montreal Cognitive Assessment"],
    category: "Cognition & Dementia",
    def: "10-minute cognitive screening tool more sensitive for mild cognitive impairment than MMSE; covers executive function, visuospatial skills, memory, language.",
    seeAlso: ["Cognition", "MMSE", "Mild cognitive impairment"]
  },
  {
    term: "Neglect",
    aliases: ["unilateral neglect"],
    category: "Cognition & Dementia",
    def: "Failure to attend to or respond to stimuli on one side of space, typically the left side; results from right parietal lobe lesion.",
    seeAlso: ["Parietal lobe", "Apraxia"]
  },
  {
    term: "Prosopagnosia",
    aliases: ["face blindness"],
    category: "Cognition & Dementia",
    def: "Inability to recognize faces despite intact vision; can be congenital or acquired from brain injury to fusiform gyrus.",
    seeAlso: ["Agnosia", "Capgras syndrome"]
  },
  {
    term: "SLUMS",
    aliases: ["St. Louis University Mental Status"],
    category: "Cognition & Dementia",
    def: "11-item cognitive screening test more sensitive for mild cognitive impairment and dementia in educated older adults; takes 5-7 minutes.",
    seeAlso: ["Cognition", "MMSE", "MoCA"],
    link: { section: "slums-tool", label: "Open SLUMS Tool" }
  },
  {
    term: "Sundowning",
    aliases: ["sundown syndrome"],
    category: "Cognition & Dementia",
    def: "Increase in confusion, agitation, and behavioral problems in late afternoon/evening in dementia; mechanism unknown but may relate to reduced light.",
    seeAlso: ["Dementia", "Delirium", "Confusion"]
  },
  {
    term: "REM sleep behavior disorder",
    aliases: ["RBD"],
    category: "Sleep",
    def: "Parasomnia with acting out of dreams during REM sleep; person may strike bed partner; associated with Parkinson disease and other neurodegenerative conditions.",
    seeAlso: ["Sleep disorder", "Parasomnia", "Parkinson disease"]
  },
  {
    term: "Restless legs syndrome",
    aliases: ["RLS"],
    category: "Sleep",
    def: "Urge to move legs at night, often with uncomfortable sensations; sleep onset and maintenance insomnia; associated with anemia, renal disease, and pregnancy.",
    seeAlso: ["Sleep disorder", "Insomnia"]
  },
  {
    term: "Narcolepsy type 1",
    aliases: ["narcolepsy with cataplexy"],
    category: "Sleep",
    def: "Sleep disorder with excessive daytime sleepiness and cataplexy (sudden loss of muscle tone); caused by loss of orexin (hypocretin) neurons.",
    seeAlso: ["Narcolepsy", "Cataplexy", "Sleep paralysis"]
  },
  {
    term: "Narcolepsy type 2",
    aliases: ["narcolepsy without cataplexy"],
    category: "Sleep",
    def: "Sleep disorder with excessive daytime sleepiness but without cataplexy; may have sleep paralysis and hypnagogic hallucinations.",
    seeAlso: ["Narcolepsy type 1", "Sleep disorder"]
  },
  {
    term: "Cataplexy",
    aliases: ["attack of weakness"],
    category: "Sleep",
    def: "Sudden loss of voluntary muscle tone triggered by emotion (especially laughter); characteristic of narcolepsy type 1.",
    seeAlso: ["Narcolepsy type 1", "Sleep disorder"]
  },
  {
    term: "Sleep paralysis",
    aliases: ["REM atonia"],
    category: "Sleep",
    def: "Temporary inability to move or speak occurring while falling asleep or awakening; person is conscious but cannot move; associated with narcolepsy.",
    seeAlso: ["Narcolepsy", "Sleep disorder"]
  },
  {
    term: "Sleep architecture",
    aliases: ["sleep structure"],
    category: "Sleep",
    def: "Pattern of sleep stages throughout the night; normal architecture includes cycling through NREM stages and REM sleep.",
    seeAlso: ["REM sleep", "NREM sleep", "Polysomnography"]
  },
  {
    term: "Polysomnography",
    aliases: ["PSG", "sleep study"],
    category: "Sleep",
    def: "Overnight test measuring brain activity, eye movement, muscle activity, breathing, and heart rate to diagnose sleep disorders.",
    seeAlso: ["Sleep disorder", "Sleep architecture"]
  },
  {
    term: "Multiple sleep latency test",
    aliases: ["MSLT"],
    category: "Sleep",
    def: "Daytime test measuring how quickly a person falls asleep; used to diagnose narcolepsy and hypersomnias.",
    seeAlso: ["Narcolepsy", "Hypersomnolence"]
  },
  {
    term: "Sleep efficiency",
    aliases: ["sleep efficiency percentage"],
    category: "Sleep",
    def: "Ratio of time actually asleep to time in bed; normal is >85%; low efficiency indicates insomnia or fragmented sleep.",
    seeAlso: ["Insomnia", "Sleep architecture"]
  },
  {
    term: "Sleep onset latency",
    aliases: ["latency to sleep"],
    category: "Sleep",
    def: "Time from when person gets into bed to onset of sleep; normal is <10 minutes; prolonged latency seen in insomnia.",
    seeAlso: ["Insomnia", "Sleep initiation"]
  },
  {
    term: "Insomnia",
    aliases: ["sleeplessness"],
    category: "Sleep",
    def: "Difficulty initiating or maintaining sleep, or early morning awakening, with daytime impairment; persistent and causing significant distress.",
    seeAlso: ["Sleep disorder", "Sleep maintenance"],
    link: { blogSlug: "insomnia" }
  },
  {
    term: "Hypersomnia",
    aliases: ["excessive daytime sleepiness"],
    category: "Sleep",
    def: "Excessive daytime sleepiness; may involve long sleep duration or difficulty awakening; seen in narcolepsy, depression, and sleep apnea.",
    seeAlso: ["Sleep disorder", "Narcolepsy"]
  },
  {
    term: "Obstructive sleep apnea",
    aliases: ["OSA"],
    category: "Sleep",
    def: "Repeated complete or partial collapse of the airway during sleep causing apneas or hypopneas; results in sleep fragmentation and hypoxia.",
    seeAlso: ["Sleep apnea", "Hypersomnia"]
  },
  {
    term: "Circadian rhythm sleep-wake disorder",
    aliases: ["CRSD"],
    category: "Sleep",
    def: "Misalignment between internal circadian rhythm and external light-dark cycle; includes advanced sleep phase, delayed sleep phase, and non-24-hour sleep-wake rhythm.",
    seeAlso: ["Sleep disorder", "Circadian rhythm"]
  },
  {
    term: "Advanced sleep phase",
    aliases: ["ASPS"],
    category: "Sleep",
    def: "Sleep timing disorder with early sleep onset and early morning awakening; circadian rhythm phase-advanced relative to social schedule.",
    seeAlso: ["Circadian rhythm sleep-wake disorder", "Sleep timing"]
  },
  {
    term: "Delayed sleep phase",
    aliases: ["DSPS"],
    category: "Sleep",
    def: "Sleep timing disorder with delayed sleep onset and late morning awakening; person cannot fall asleep until late despite trying.",
    seeAlso: ["Circadian rhythm sleep-wake disorder", "Insomnia"]
  },
  {
    term: "Active ideation",
    aliases: ["active suicidal ideation"],
    category: "Suicide & Self-Injury",
    def: "Thoughts of suicide with plan and intent; imminent risk; requires emergency intervention.",
    seeAlso: ["Suicidal ideation", "Passive ideation", "Suicide risk"]
  },
  {
    term: "Passive ideation",
    aliases: ["passive suicidal ideation"],
    category: "Suicide & Self-Injury",
    def: "Thoughts of death or wishing to be dead without specific plan or intent to act; lower immediate risk but still concerning.",
    seeAlso: ["Suicidal ideation", "Active ideation"]
  },
  {
    term: "Aborted attempt",
    aliases: ["aborted suicide attempt"],
    category: "Suicide & Self-Injury",
    def: "Person begins suicide attempt but stops before contact with method; indicates significant intent despite last-minute change.",
    seeAlso: ["Suicide attempt", "Interrupted attempt"]
  },
  {
    term: "Interrupted attempt",
    aliases: ["interrupted suicide attempt"],
    category: "Suicide & Self-Injury",
    def: "Suicide attempt interrupted by external circumstance (e.g., discovered by someone); may indicate lower lethality intent than completed attempt.",
    seeAlso: ["Suicide attempt", "Aborted attempt"]
  },
  {
    term: "Suicidal gesture",
    aliases: ["parasuicide variant"],
    category: "Suicide & Self-Injury",
    def: "Non-lethal self-injurious behavior without intent to die; sometimes used to communicate distress or manipulate others, though intent may be ambiguous.",
    seeAlso: ["NSSI", "Parasuicide"]
  },
  {
    term: "Lethality",
    aliases: ["method lethality"],
    category: "Suicide & Self-Injury",
    def: "Degree of danger of a method used in suicide attempt; firearms and hanging have high lethality, whereas overdose varies.",
    seeAlso: ["Suicide risk", "Means restriction"]
  },
  {
    term: "Ambivalence",
    aliases: ["suicidal ambivalence"],
    category: "Suicide & Self-Injury",
    def: "Mixed feelings about death and living; person may simultaneously experience suicidal intent and desire to live.",
    seeAlso: ["Suicidal ideation", "Suicide risk"]
  },
  {
    term: "Hopelessness",
    aliases: ["sense of hopelessness"],
    category: "Suicide & Self-Injury",
    def: "Belief that the future is bleak and nothing will improve; core cognitive factor in suicide risk independent of depression severity.",
    seeAlso: ["Depression", "Suicide risk"]
  },
  {
    term: "Perceived burdensomeness",
    aliases: ["thwarted belongingness"],
    category: "Suicide & Self-Injury",
    def: "Belief that one is a burden to loved ones; component of interpersonal theory of suicide (Joiner).",
    seeAlso: ["Suicide risk", "Joiner theory"]
  },
  {
    term: "Thwarted belongingness",
    aliases: ["disconnection"],
    category: "Suicide & Self-Injury",
    def: "Lack of connectedness and feeling of isolation; component of interpersonal theory of suicide (Joiner).",
    seeAlso: ["Suicide risk", "Joiner theory"]
  },
  {
    term: "C-SSRS",
    aliases: ["Columbia Suicide Severity Rating Scale"],
    category: "Suicide & Self-Injury",
    def: "Gold-standard suicide risk assessment tool with sections on ideation (frequency, intensity, control) and behavior (attempts, preparatory acts, non-suicidal self-injury).",
    seeAlso: ["Suicide risk", "Assessment"],
    link: { section: "suicide-risk-tools", label: "Open Suicide Risk Tools" }
  },
  {
    term: "SBQ-R",
    aliases: ["Suicidal Behaviors Questionnaire-Revised"],
    category: "Suicide & Self-Injury",
    def: "Brief 4-item screening tool for suicide risk; focuses on frequency of ideation, intent, planning, and communication of intent.",
    seeAlso: ["Suicide risk", "Screening"]
  },
  {
    term: "P4 screener",
    aliases: ["P4 suicide screener"],
    category: "Suicide & Self-Injury",
    def: "Brief four-question screening tool: previous attempt, prescription drug access, previous psychiatric episode, and psychiatric problems.",
    seeAlso: ["Suicide risk", "Screening"]
  },
  {
    term: "Safety plan",
    aliases: ["suicide safety plan"],
    category: "Suicide & Self-Injury",
    def: "Collaborative document between clinician and patient listing warning signs, internal coping strategies, people to contact, and places to go during suicidal crisis.",
    seeAlso: ["Suicide risk", "Crisis intervention"]
  },
  {
    term: "ACE",
    aliases: ["adverse childhood experiences"],
    category: "Pediatric & Developmental",
    def: "Traumatic events experienced in childhood (abuse, neglect, household dysfunction); each ACE increases risk for physical and mental health problems.",
    seeAlso: ["Trauma", "Childhood trauma"]
  },
  {
    term: "Attachment, secure",
    aliases: ["secure attachment"],
    category: "Pediatric & Developmental",
    def: "Child's confidence in caregiver's availability and responsiveness; allows exploration and independence; protective for mental health.",
    seeAlso: ["Attachment", "Parental bonding"]
  },
  {
    term: "Attachment, avoidant",
    aliases: ["avoidant attachment"],
    category: "Pediatric & Developmental",
    def: "Child avoids and ignores caregiver upon reunion after separation; learns caregiver is unresponsive to distress.",
    seeAlso: ["Attachment", "Disorganized attachment"]
  },
  {
    term: "Attachment, ambivalent",
    aliases: ["resistant attachment"],
    category: "Pediatric & Developmental",
    def: "Child shows mixed response to caregiver: simultaneously seeking and resisting comfort; results from inconsistent caregiving.",
    seeAlso: ["Attachment", "Disorganized attachment"]
  },
  {
    term: "Enuresis",
    aliases: ["bedwetting"],
    category: "Pediatric & Developmental",
    def: "Involuntary urination during sleep in children >5 years; can be primary (never achieved dryness) or secondary (after period of dryness).",
    seeAlso: ["Encopresis"]
  },
  {
    term: "Encopresis",
    aliases: ["fecal incontinence"],
    category: "Pediatric & Developmental",
    def: "Involuntary defecation in children >4 years; can be primary or secondary; often associated with constipation and overflow.",
    seeAlso: ["Enuresis"]
  },
  {
    term: "Failure to thrive",
    aliases: ["FTT", "growth failure"],
    category: "Pediatric & Developmental",
    def: "Inadequate weight gain and growth in infants/young children; can be organic (medical) or inorganic (due to neglect/inadequate nutrition).",
    seeAlso: ["Neglect", "Attachment disorder"]
  },
  {
    term: "Reactive attachment disorder",
    aliases: ["RAD"],
    category: "Pediatric & Developmental",
    def: "Disorder of children with history of inadequate care (neglect, deprivation); minimal attachment behaviors and limited emotional responsiveness.",
    seeAlso: ["Attachment", "Neglect"]
  },
  {
    term: "Theory of mind",
    aliases: ["mentalizing", "ToM"],
    category: "Pediatric & Developmental",
    def: "Ability to understand that others have beliefs, desires, and mental states different from one's own; develops by age 4; impaired in autism.",
    seeAlso: ["Autism spectrum disorder", "Cognitive development"]
  },
  {
    term: "Temperament",
    aliases: ["behavioral disposition"],
    category: "Pediatric & Developmental",
    def: "Inborn behavioral tendencies (activity level, distractibility, emotionality); relatively stable across situations and time.",
    seeAlso: ["Personality", "Developmental psychology"]
  },
  {
    term: "Conduct disorder",
    aliases: ["CD"],
    category: "Pediatric & Developmental",
    def: "Repetitive and persistent pattern of violating rights of others or major social norms; includes aggression, destruction, theft, and rule-breaking.",
    seeAlso: ["Oppositional defiant disorder", "Antisocial personality disorder"]
  },
  {
    term: "Separation anxiety disorder",
    aliases: ["SAD"],
    category: "Pediatric & Developmental",
    def: "Intense anxiety upon separation from attachment figures; child may refuse school or be fearful when separated.",
    seeAlso: ["Anxiety disorder", "School refusal"]
  },
  {
    term: "Stranger anxiety",
    aliases: ["stranger wariness"],
    category: "Pediatric & Developmental",
    def: "Normal developmental fear of unfamiliar people in infants around 6-12 months; indicates secure attachment.",
    seeAlso: ["Attachment", "Developmental milestone"]
  }
];

// Total entries: 403
