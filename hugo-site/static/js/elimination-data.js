/* Elimination route (urine vs feces) for medication cards.
   Keyed by MEDICATIONS id and copied onto each entry as `elimination`.

   Field contract for every current and future card:
     summary      string shown on the card. Use the label's figures.
                  If the label gives no urine/feces split, say what it does say.
                  Do not invent a percentage.
     sourceUrl    DailyMed drugInfo link, or the FDA label PDF if DailyMed
                  no longer hosts the product.
     sourceLabel  short link text
     split        true only when the label gives a figure for both urine and feces
     note         optional one-line impairment clause. Omit it when the card
                  already states that adjustment under Renal or Hepatic impairment.

   Sources are the current FDA prescribing information, Clinical Pharmacology /
   Excretion (or the equivalent mass-balance sentence). Half-life is unchanged. */
(function () {
  if (typeof MEDICATIONS === 'undefined') return;

  function E(summary, sourceUrl, sourceLabel, split) {
    return {
      summary: summary,
      sourceUrl: sourceUrl,
      sourceLabel: sourceLabel,
      split: split
    };
  }

  var map = {
    "fluoxetine": E("Hepatic metabolism to inactive metabolites excreted by the kidney (no urine/feces split on the label).", "https://dailymed.nlm.nih.gov/dailymed/drugInfo.cfm?setid=c88f33ed-6dfb-4c5e-bc01-d8e36dd97299", "DailyMed \u2014 Prozac", false),
    "sertraline": E("Urine 40\u201345% (unchanged drug not detected); feces 40\u201345% (12\u201314% unchanged).", "https://dailymed.nlm.nih.gov/dailymed/drugInfo.cfm?setid=fda754f6-d0f3-4dce-a17a-927d64f912f7", "DailyMed \u2014 Zoloft", true),
    "escitalopram": E("Urine about 8% as escitalopram and about 10% as S-demethylcitalopram. Unchanged drug is a minor route. Feces not stated.", "https://dailymed.nlm.nih.gov/dailymed/drugInfo.cfm?setid=13bb8267-1cab-43e5-acae-55a4d957630a", "DailyMed \u2014 Lexapro", false),
    "paroxetine": E("Urine about 64% (2% unchanged, 62% metabolites); feces about 36% (less than 1% unchanged).", "https://dailymed.nlm.nih.gov/dailymed/drugInfo.cfm?setid=483bd97f-c4d0-4e23-aaa8-6334f4471e0c", "DailyMed \u2014 Paxil CR", true),
    "citalopram": E("After intravenous dosing, urine recovery was about 10% as citalopram and about 5% as desmethylcitalopram. No oral urine/feces split on the label.", "https://dailymed.nlm.nih.gov/dailymed/drugInfo.cfm?setid=4259d9b1-de34-43a4-85a8-41dd214e9177", "DailyMed \u2014 Celexa", false),
    "fluvoxamine": E("Urine: about 94% of drug-related products (about 2% unchanged). Feces not stated.", "https://dailymed.nlm.nih.gov/dailymed/drugInfo.cfm?setid=0a6836ab-bd0e-410b-82af-07720e386532", "DailyMed \u2014 fluvoxamine", false),
    "venlafaxine": E("Urine about 87% within 48 hours (5% unchanged venlafaxine, 29% unconjugated ODV, 26% conjugated ODV, 27% other metabolites). Feces not stated.", "https://dailymed.nlm.nih.gov/dailymed/drugInfo.cfm?setid=c848a5d8-ba94-4c84-80e3-0bf35fb8e32e", "DailyMed \u2014 Effexor XR", false),
    "duloxetine": E("Urine about 70% as metabolites (less than 1% unchanged); feces about 20%.", "https://dailymed.nlm.nih.gov/dailymed/drugInfo.cfm?setid=00628e5e-4c5b-2573-e063-6294a90a0e3b", "DailyMed \u2014 duloxetine delayed-release", true),
    "desvenlafaxine": E("Urine: about 45% unchanged, about 19% as the glucuronide, and less than 5% as N,O-didesmethylvenlafaxine. Feces not stated.", "https://dailymed.nlm.nih.gov/dailymed/drugInfo.cfm?setid=0f43610c-f290-46ea-d186-4f998ed99fce", "DailyMed \u2014 Pristiq", false),
    "amitriptyline": E("Route of excretion is not stated on the current FDA label.", "https://dailymed.nlm.nih.gov/dailymed/drugInfo.cfm?setid=00d11130-c9ae-4258-9746-9763bc5deb84", "DailyMed \u2014 amitriptyline", false),
    "nortriptyline": E("Route of excretion is not stated on the current FDA label.", "https://dailymed.nlm.nih.gov/dailymed/drugInfo.cfm?setid=e17dc299-f52d-414d-ab6e-e809bd6f8acb", "DailyMed \u2014 Pamelor", false),
    "imipramine": E("Route of excretion is not stated on the current FDA label.", "https://dailymed.nlm.nih.gov/dailymed/drugInfo.cfm?setid=20af582f-08ba-4281-a2df-0bcf68c58594", "DailyMed \u2014 imipramine", false),
    "phenelzine": E("Urine: 73% recovered as phenylacetic acid and parahydroxyphenylacetic acid within 96 hours. Feces not stated.", "https://dailymed.nlm.nih.gov/dailymed/drugInfo.cfm?setid=513a41d0-37d4-4355-8a6d-a2c643bce6fa", "DailyMed \u2014 Nardil", false),
    "tranylcypromine": E("Route of excretion is not stated on the current FDA label.", "https://dailymed.nlm.nih.gov/dailymed/drugInfo.cfm?setid=b72d8187-dfcc-4ea0-b5e9-c0be95b69a27", "DailyMed \u2014 Parnate", false),
    "bupropion": E("Urine 87%; feces 10% (0.5% excreted as unchanged bupropion).", "https://dailymed.nlm.nih.gov/dailymed/drugInfo.cfm?setid=a435da9d-f6e8-4ddc-897d-8cd2bf777b21", "DailyMed \u2014 Wellbutrin XL", true),
    "mirtazapine": E("Urine 75%; feces 15%.", "https://dailymed.nlm.nih.gov/dailymed/drugInfo.cfm?setid=98ad1917-a094-44f5-a28f-a64a8cfcd887", "DailyMed \u2014 Remeron SolTab", true),
    "trazodone": E("Extensively metabolized; less than 1% of an oral dose is excreted unchanged in urine. Feces not stated.", "https://dailymed.nlm.nih.gov/dailymed/drugInfo.cfm?setid=094ca37b-3ae2-4889-9536-e7e5f20e3105", "DailyMed \u2014 trazodone", false),
    "vilazodone": E("Unchanged vilazodone only: urine 1%, feces 2%. Total urine/feces recovery is not stated.", "https://dailymed.nlm.nih.gov/dailymed/drugInfo.cfm?setid=4c55ccfb-c4cf-11df-851a-0800200c9a66", "DailyMed \u2014 Viibryd", false),
    "haloperidol": E("Urine: less than 3% unchanged (current haloperidol decanoate label). Total urine/feces split is not stated. Oral tablet labels do not give a route.", "https://dailymed.nlm.nih.gov/dailymed/drugInfo.cfm?setid=3d011250-a517-4c27-8ce3-d59d441ea61c", "DailyMed \u2014 haloperidol decanoate", false),
    "chlorpromazine": E("Route of excretion is not stated on the current FDA label.", "https://dailymed.nlm.nih.gov/dailymed/drugInfo.cfm?setid=41b86f9d-d7e2-4296-8d88-e8257c7cbed2", "DailyMed \u2014 chlorpromazine tablets", false),
    "fluphenazine": E("Route of excretion is not stated on the current FDA label.", "https://dailymed.nlm.nih.gov/dailymed/drugInfo.cfm?setid=c69f07b1-660c-db03-e053-2995a90a5464", "DailyMed \u2014 fluphenazine hydrochloride tablets", false),
    "risperidone": E("Urine 70%; feces 14% (84% of a radiolabeled dose recovered at 1 week).", "https://dailymed.nlm.nih.gov/dailymed/drugInfo.cfm?setid=7e117c7e-02fc-4343-92a1-230061dfc5e0", "DailyMed \u2014 Risperdal", true),
    "olanzapine": E("Urine about 57% (7% unchanged); feces about 30%.", "https://dailymed.nlm.nih.gov/dailymed/drugInfo.cfm?setid=b418946a-1ab4-4d89-a012-d94fc361a3c4", "DailyMed \u2014 Zyprexa", true),
    "quetiapine": E("Urine about 73% (less than 1% unchanged); feces about 20%.", "https://dailymed.nlm.nih.gov/dailymed/drugInfo.cfm?setid=ab959a35-d0ba-4f18-8f2e-6619d88b16e3", "DailyMed \u2014 Seroquel XR", true),
    "aripiprazole": E("Urine about 25% (less than 1% unchanged); feces about 55% (about 18% unchanged).", "https://dailymed.nlm.nih.gov/dailymed/drugInfo.cfm?setid=c040bd1d-45b7-49f2-93ea-aed7220b30ac", "DailyMed \u2014 Abilify", true),
    "clozapine": E("Urine about 50%; feces about 30%. Only trace unchanged drug in urine and feces.", "https://dailymed.nlm.nih.gov/dailymed/drugInfo.cfm?setid=90876802-0e3a-44c9-9ff7-1754dfbe736a", "DailyMed \u2014 Clozaril", true),
    "ziprasidone": E("Urine about 20% (less than 1% unchanged); feces about 66% (less than 4% unchanged).", "https://dailymed.nlm.nih.gov/dailymed/drugInfo.cfm?setid=a2b4cc65-6a6d-49c4-adfc-a4458562a167", "DailyMed \u2014 Geodon", true),
    "lurasidone": E("Feces about 80%; urine about 9%.", "https://dailymed.nlm.nih.gov/dailymed/drugInfo.cfm?setid=afad3051-9df2-4c54-9684-e8262a133af8", "DailyMed \u2014 Latuda", true),
    "asenapine": E("Urine about 50%; feces about 40% (about 90% of the dose recovered).", "https://dailymed.nlm.nih.gov/dailymed/drugInfo.cfm?setid=5429f134-839f-4ffc-9944-55f51238def8", "DailyMed \u2014 Saphris", true),
    "lithium": E("Primarily excreted in urine, in proportion to the serum concentration. Fecal excretion is insignificant (no percent split).", "https://dailymed.nlm.nih.gov/dailymed/drugInfo.cfm?setid=04518b80-7563-4544-bf05-04f286223faa", "DailyMed \u2014 lithium carbonate", false),
    "valproate": E("Urine: 30\u201350% of the dose as a glucuronide conjugate (less than 3% unchanged). Feces not stated.", "https://dailymed.nlm.nih.gov/dailymed/drugInfo.cfm?setid=08a65cf4-7749-4ceb-6895-8f4805e2b01f", "DailyMed \u2014 Depakote", false),
    "lamotrigine": E("Urine 94% (10% unchanged); feces 2%.", "https://dailymed.nlm.nih.gov/dailymed/drugInfo.cfm?setid=3e2c9a35-6a39-41d7-ad84-3c0bb8894b09", "DailyMed \u2014 Lamictal XR", true),
    "carbamazepine": E("Urine 72%; feces 28% of a radiolabeled dose.", "https://dailymed.nlm.nih.gov/dailymed/drugInfo.cfm?setid=8d409411-aa9f-4f3a-a52c-fbcb0c3ec053", "DailyMed \u2014 Tegretol", true),
    "zolpidem": E("Inactive metabolites are eliminated primarily by renal excretion (no urine/feces split).", "https://dailymed.nlm.nih.gov/dailymed/drugInfo.cfm?setid=2d934da3-bd77-4470-e063-6294a90a64f5", "DailyMed \u2014 Ambien CR", false),
    "eszopiclone": E("Urine: up to 75% of an oral racemic zopiclone dose, mainly as metabolites (a similar profile is expected); less than 10% of the eszopiclone dose as parent drug. Feces not stated.", "https://dailymed.nlm.nih.gov/dailymed/drugInfo.cfm?setid=3821f4b7-a3c8-4920-ba80-18aa96532c09", "DailyMed \u2014 Lunesta", false),
    "temazepam": E("Urine: 80\u201390% of the dose, after complete conjugation. Feces not stated.", "https://dailymed.nlm.nih.gov/dailymed/drugInfo.cfm?setid=bc56f7fd-1aaf-48ff-8aa7-d467e59e1015", "DailyMed \u2014 Restoril", false),
    "ramelteon": E("Urine 84%; feces about 4% (less than 0.1% as parent drug in urine and feces).", "https://dailymed.nlm.nih.gov/dailymed/drugInfo.cfm?setid=9de82310-70e8-47b9-b1fc-6c6848b99455", "DailyMed \u2014 Rozerem", true),
    "suvorexant": E("Feces about 66%; urine about 23%.", "https://dailymed.nlm.nih.gov/dailymed/drugInfo.cfm?setid=e5b72731-1acb-45b7-9c13-290ad12d3951", "DailyMed \u2014 Belsomra", true),
    "milnacipran": E("Urine: about 55% unchanged, about 17% as the l-carbamoyl-O-glucuronide, about 2% as the d-glucuronide, and about 8% as N-desethyl milnacipran. Feces not stated.", "https://dailymed.nlm.nih.gov/dailymed/drugInfo.cfm?setid=16a4a314-f97e-4e91-95e9-576a3773d284", "DailyMed \u2014 Savella", false),
    "levomilnacipran": E("Primarily renal. Urine: about 58% unchanged and about 18% as N-desethyl levomilnacipran, plus glucuronides (about 4%, 3%, 1%, and 1%). Feces not stated.", "https://dailymed.nlm.nih.gov/dailymed/drugInfo.cfm?setid=f371258d-91b3-4b6a-ac99-434a1964c3af", "DailyMed \u2014 Fetzima", false),
    "vortioxetine": E("Urine about 59% as metabolites; feces about 26% as metabolites. Negligible unchanged vortioxetine in urine.", "https://dailymed.nlm.nih.gov/dailymed/drugInfo.cfm?setid=1a5b68e2-14d0-419d-9ec6-1ca97145e838", "DailyMed \u2014 Trintellix", true),
    "gepirone": E("Urine about 81% as metabolites; feces about 13% as metabolites.", "https://dailymed.nlm.nih.gov/dailymed/drugInfo.cfm?setid=0c78edd8-6acb-433c-9d34-2527da8d64e1", "DailyMed \u2014 Exxua", true),
    "esketamine": E("Nasal dose: less than 1% unchanged in urine. After intravenous or oral radiolabeled dosing, metabolites were recovered in urine (\u226578%) and feces (\u22642%).", "https://dailymed.nlm.nih.gov/dailymed/drugInfo.cfm?setid=d81a6a79-a74a-44b7-822c-0dfa3036eaed", "DailyMed \u2014 Spravato", true),
    "brexanolone": E("Feces 47% (primarily metabolites); urine 42% (less than 1% unchanged). Zulresso is no longer listed on DailyMed; figures are from the last FDA labeling supplement.", "https://www.accessdata.fda.gov/drugsatfda_docs/label/2022/211371s007lbl.pdf", "FDA label \u2014 Zulresso (2022)", true),
    "zuranolone": E("Urine 45% as metabolites (negligible unchanged); feces 41% as metabolites (less than 2% unchanged).", "https://dailymed.nlm.nih.gov/dailymed/drugInfo.cfm?setid=f18e53b0-d0bb-422d-8de7-ab64b7292b29", "DailyMed \u2014 Zurzuvae", true),
    "dextromethorphan-bupropion": E("Dextromethorphan urine: about 37\u201352% in CYP2D6 extensive metabolizers (less than 2% unchanged) or about 45\u201383% in poor metabolizers (about 26% unchanged); feces not stated. Bupropion: urine 87%, feces 10% (0.5% unchanged).", "https://dailymed.nlm.nih.gov/dailymed/drugInfo.cfm?setid=dcefda7c-9a68-278e-e053-2995a90aec79", "DailyMed \u2014 Auvelity", false),
    "doxepin": E("Urine, mainly as glucuronide conjugates (less than 3% as doxepin or nordoxepin). Feces not stated.", "https://dailymed.nlm.nih.gov/dailymed/drugInfo.cfm?setid=1bec1223-5239-4eb6-a9e8-62444106d2c0", "DailyMed \u2014 Silenor", false),
    "trifluoperazine": E("Route of excretion is not stated on the current FDA label.", "https://dailymed.nlm.nih.gov/dailymed/drugInfo.cfm?setid=069d3469-138b-4e4f-a7bb-6acac5f86abb", "DailyMed \u2014 trifluoperazine", false),
    "perphenazine": E("Extensively metabolized in the liver (sulfoxidation, hydroxylation, dealkylation, and glucuronidation). Excretion route is not stated.", "https://dailymed.nlm.nih.gov/dailymed/drugInfo.cfm?setid=003fe32c-a55d-4191-99fa-1013522b1b2e", "DailyMed \u2014 perphenazine", false),
    "thiothixene": E("Route of excretion is not stated on the current FDA label.", "https://dailymed.nlm.nih.gov/dailymed/drugInfo.cfm?setid=b067b400-66cd-422d-a631-9ce0c935d2b2", "DailyMed \u2014 thiothixene", false),
    "pimozide": E("Pimozide and its metabolites are eliminated through the kidney. No urine/feces percent split.", "https://dailymed.nlm.nih.gov/dailymed/drugInfo.cfm?setid=70b079e2-a1f7-4a93-8685-d60a4d7c1280", "DailyMed \u2014 pimozide", false),
    "thioridazine": E("Route of excretion is not stated on the current FDA label.", "https://dailymed.nlm.nih.gov/dailymed/drugInfo.cfm?setid=56b3f4c2-52af-4947-b225-6808ae9f26f5", "DailyMed \u2014 thioridazine", false),
    "loxapine": E("Extensively metabolized. Metabolites are excreted in the urine as conjugates and in the feces unconjugated (no percent split).", "https://dailymed.nlm.nih.gov/dailymed/drugInfo.cfm?setid=3e412c36-66b0-444b-833b-cea79976844e", "DailyMed \u2014 loxapine", false),
    "molindone": E("Less than 2\u20133% unmetabolized drug is excreted in urine and feces together (the label does not split the routes).", "https://dailymed.nlm.nih.gov/dailymed/drugInfo.cfm?setid=1275e92f-9573-4d0c-8e77-1c9ac47696d2", "DailyMed \u2014 molindone", false),
    "paliperidone": E("Urine about 80% (59% unchanged; range 51\u201367%); feces 11%.", "https://dailymed.nlm.nih.gov/dailymed/drugInfo.cfm?setid=7b8e5b26-b9e4-4704-921b-3c3c0d159916", "DailyMed \u2014 Invega", true),
    "iloperidone": E("Urine 58.2% in extensive metabolizers or 45.1% in poor metabolizers; feces 19.9% (extensive) or 22.1% (poor).", "https://dailymed.nlm.nih.gov/dailymed/drugInfo.cfm?setid=33f60b40-3fca-11de-8f56-0002a5d5c51b", "DailyMed \u2014 Fanapt", true),
    "brexpiprazole": E("Urine about 25% (less than 1% unchanged); feces about 46% (about 14% unchanged).", "https://dailymed.nlm.nih.gov/dailymed/drugInfo.cfm?setid=2d301358-6291-4ec1-bd87-37b4ad9bd850", "DailyMed \u2014 Rexulti", true),
    "cariprazine": E("Urine about 21% of the daily dose (about 1.2% unchanged). Feces not stated.", "https://dailymed.nlm.nih.gov/dailymed/drugInfo.cfm?setid=4b5f7c65-aa2d-452a-b3db-bc85c06ff12f", "DailyMed \u2014 Vraylar", false),
    "lumateperone": E("Urine 58% (less than 1% unchanged); feces 29%.", "https://dailymed.nlm.nih.gov/dailymed/drugInfo.cfm?setid=db730b06-6351-47fd-8183-e61e61bbead5", "DailyMed \u2014 Caplyta", true),
    "pimavanserin": E("Unchanged drug: urine 0.55%, feces 1.53%. Less than 1% of pimavanserin plus its active metabolite was recovered in urine. Total recovery is not stated.", "https://dailymed.nlm.nih.gov/dailymed/drugInfo.cfm?setid=1e6bea44-57d6-4bac-9328-46e1ee59f83b", "DailyMed \u2014 Nuplazid", false),
    "oxcarbazepine": E("Urine more than 95% (less than 1% unchanged oxcarbazepine); feces less than 4%.", "https://dailymed.nlm.nih.gov/dailymed/drugInfo.cfm?setid=4c5c86c8-ab7f-4fcf-bc1b-5a0b1fd0691b", "DailyMed \u2014 Trileptal", true),
    "topiramate": E("Primarily eliminated unchanged in urine (about 70% of the dose). Feces not stated.", "https://dailymed.nlm.nih.gov/dailymed/drugInfo.cfm?setid=21628112-0c47-11df-95b3-498d55d89593", "DailyMed \u2014 Topamax", false),
    "gabapentin": E("Eliminated by renal excretion as unchanged drug. No urine/feces percent split on the label.", "https://dailymed.nlm.nih.gov/dailymed/drugInfo.cfm?setid=97935fd9-1d4a-43b6-a5d9-de994591187b", "DailyMed \u2014 Neurontin", false),
    "alprazolam": E("Alprazolam and its metabolites are excreted primarily in the urine. No percent split.", "https://dailymed.nlm.nih.gov/dailymed/drugInfo.cfm?setid=c8990714-c2f5-4b0c-9f1c-91d77156d962", "DailyMed \u2014 Xanax XR", false),
    "clonazepam": E("Highly metabolized; less than 2% unchanged clonazepam is excreted in urine. Feces not stated.", "https://dailymed.nlm.nih.gov/dailymed/drugInfo.cfm?setid=cfa0d79a-843c-4b88-95a1-e9511d649ca1", "DailyMed \u2014 Klonopin", false),
    "diazepam": E("Excreted mainly in the urine, predominantly as glucuronide conjugates. Feces not stated.", "https://dailymed.nlm.nih.gov/dailymed/drugInfo.cfm?setid=260e2041-2bb3-482f-850e-b5d47a7bdbe6", "DailyMed \u2014 Valium", false),
    "lorazepam": E("Urine 88% \u00b1 4% (74% \u00b1 4% as lorazepam glucuronide); feces 7% \u00b1 2%.", "https://dailymed.nlm.nih.gov/dailymed/drugInfo.cfm?setid=5fc0e987-61c9-40c4-b0d5-fcea07c8733e", "DailyMed \u2014 Ativan", true),
    "oxazepam": E("The major inactive metabolite is a glucuronide excreted in the urine. No percent split.", "https://dailymed.nlm.nih.gov/dailymed/drugInfo.cfm?setid=bb6d9142-3647-4591-8f84-31b61b755634", "DailyMed \u2014 oxazepam", false),
    "chlordiazepoxide": E("Urine: 1\u20132% unchanged and 3\u20136% as a conjugate. Total recovery and feces are not stated.", "https://dailymed.nlm.nih.gov/dailymed/drugInfo.cfm?setid=3cbd7cee-c4d7-4c95-93d8-09428169b937", "DailyMed \u2014 chlordiazepoxide", false),
    "clorazepate": E("Urine 62\u201367%; feces 15\u201319% of a radiolabeled dose within 10 days.", "https://dailymed.nlm.nih.gov/dailymed/drugInfo.cfm?setid=499a6989-8912-44b7-b1eb-ee8f85ae378f", "DailyMed \u2014 clorazepate", true),
    "midazolam": E("After a single intravenous dose, urine recovery was less than 0.5% unchanged and 45\u201357% as the 1-hydroxymethyl midazolam conjugate. Feces not stated.", "https://dailymed.nlm.nih.gov/dailymed/drugInfo.cfm?setid=06e4f754-72df-4eb4-aaed-b538524f5277", "DailyMed \u2014 midazolam", false),
    "triazolam": E("Excreted primarily in the urine as conjugated glucuronides; only small amounts of unchanged triazolam appear in urine. Feces not stated.", "https://dailymed.nlm.nih.gov/dailymed/drugInfo.cfm?setid=5add318e-11b9-42f8-b052-0d8cebb32fcf", "DailyMed \u2014 triazolam", false),
    "estazolam": E("Urine: greater than 70% as metabolites (less than 5% unchanged); feces 4%.", "https://dailymed.nlm.nih.gov/dailymed/drugInfo.cfm?setid=2f349a44-6d04-01d1-c8b7-12254aead77d", "DailyMed \u2014 estazolam", true),
    "flurazepam": E("Excreted primarily in the urine. Conjugated N1-hydroxyethyl-flurazepam accounts for 22\u201355% of the dose; less than 1% is excreted in urine as N1-desalkyl-flurazepam. Feces not stated.", "https://dailymed.nlm.nih.gov/dailymed/drugInfo.cfm?setid=8f476891-1346-4e8c-ac1b-f8cbdc64f5a1", "DailyMed \u2014 flurazepam", false),
    "buspirone": E("Within 24 hours, urine 29\u201363% (primarily metabolites); feces 18\u201338%.", "https://dailymed.nlm.nih.gov/dailymed/drugInfo.cfm?setid=07a789a9-c9e8-4737-a56d-7d5405fe8100", "DailyMed \u2014 buspirone", true),
    "pregabalin": E("Urine about 90% as unchanged pregabalin. Feces not stated.", "https://dailymed.nlm.nih.gov/dailymed/drugInfo.cfm?setid=d4734e7d-5079-455e-8ff5-8f4539c998a9", "DailyMed \u2014 Lyrica", false),
    "propranolol": E("Extensively metabolized, with most metabolites appearing in the urine. No percent split.", "https://dailymed.nlm.nih.gov/dailymed/drugInfo.cfm?setid=ac196ff5-9215-402b-bc57-69aa87f8bade", "DailyMed \u2014 Inderal XL", false),
    "clonidine": E("After an oral dose, about 40\u201360% of the absorbed dose is recovered in urine as unchanged drug within 24 hours. Feces not stated.", "https://dailymed.nlm.nih.gov/dailymed/drugInfo.cfm?setid=d4a55825-7041-42f4-b3b2-dd7a25dbe793", "DailyMed \u2014 Catapres-TTS", false),
    "guanfacine": E("Cleared by the liver and the kidney; about 50% of clearance is hepatic. No urine/feces recovery split.", "https://dailymed.nlm.nih.gov/dailymed/drugInfo.cfm?setid=b972af81-3a37-40be-9fe1-3ddf59852528", "DailyMed \u2014 Intuniv", false),
    "doxylamine": E("The principal metabolites, N-desmethyl-doxylamine and N,N-didesmethyldoxylamine, are excreted by the kidney. No percent split.", "https://dailymed.nlm.nih.gov/dailymed/drugInfo.cfm?setid=8bde08f6-e8bd-4e90-baa7-82e01876a86a", "DailyMed \u2014 Diclegis", false),
    "methylphenidate": E("Urine 78\u201397%; feces 1\u20133%, as metabolites within 48\u201396 hours (less than 1% unchanged in urine).", "https://dailymed.nlm.nih.gov/dailymed/drugInfo.cfm?setid=d6fb2750-cdab-4749-ba0d-7534840a5892", "DailyMed \u2014 Ritalin", true),
    "dexmethylphenidate": E("Urine: about 90% of a radiolabeled racemic methylphenidate dose. Unchanged drug accounted for 0.5% of an intravenous dose. Feces not stated.", "https://dailymed.nlm.nih.gov/dailymed/drugInfo.cfm?setid=1a1da905-42a0-4748-9c39-67eca45deccc", "DailyMed \u2014 Focalin XR", false),
    "amphetamine-mixed-salts": E("At a normal urine pH, about half of the dose is recovered in urine as alpha-hydroxy-amphetamine derivatives and another 30\u201340% as amphetamine. Recovery depends on urine pH and flow. Feces not stated.", "https://dailymed.nlm.nih.gov/dailymed/drugInfo.cfm?setid=aff45863-ffe1-4d4f-8acf-c7081512a6c0", "DailyMed \u2014 Adderall XR", false),
    "dextroamphetamine": E("Urinary excretion rises with acidifying agents and falls with alkalinizing agents. No urine/feces percent split on the current Dexedrine or dextroamphetamine tablet label.", "https://dailymed.nlm.nih.gov/dailymed/drugInfo.cfm?setid=cc717b9b-22ea-4c60-a1d4-ee38a40bce78", "DailyMed \u2014 Dexedrine Spansule", false),
    "lisdexamfetamine": E("Urine about 96%; feces 0.3%. Of the urinary radioactivity, 42% was amphetamine, 25% hippuric acid, and 2% intact lisdexamfetamine.", "https://dailymed.nlm.nih.gov/dailymed/drugInfo.cfm?setid=704e4378-ca83-445c-8b45-3cfa51c1ecad", "DailyMed \u2014 Vyvanse", true),
    "modafinil": E("Urine 80%; feces 1% (81% of radioactivity recovered over 11 days; less than 10% as parent drug).", "https://dailymed.nlm.nih.gov/dailymed/drugInfo.cfm?setid=0391f182-1958-9fef-a944-53b229ce99e7", "DailyMed \u2014 Provigil", true),
    "armodafinil": E("No disposition data specific to armodafinil. The label cites the modafinil mass balance: urine 80%, feces 1%, with less than 10% of parent drug in urine.", "https://dailymed.nlm.nih.gov/dailymed/drugInfo.cfm?setid=a69631d0-1263-769e-b232-4ab9160e0fa3", "DailyMed \u2014 Nuvigil", true),
    "solriamfetol": E("Urine about 95% as unchanged solriamfetol, and 1% or less as N-acetyl solriamfetol. Feces not stated.", "https://dailymed.nlm.nih.gov/dailymed/drugInfo.cfm?setid=362f206b-73e7-4009-8c34-5a9df55679ab", "DailyMed \u2014 Sunosi", false),
    "hydroxyzine": E("The extent of renal excretion has not been determined.", "https://dailymed.nlm.nih.gov/dailymed/drugInfo.cfm?setid=083e3545-8fa9-418c-ad42-5b2186c26816", "DailyMed \u2014 hydroxyzine hydrochloride", false),
    "diphenhydramine": E("A portion is excreted unchanged in urine; the rest is metabolized by the liver (injection label; no percent split). Oral diphenhydramine labels do not give a route.", "https://dailymed.nlm.nih.gov/dailymed/drugInfo.cfm?setid=00f862aa-6917-45c7-b6aa-1bebb0a45e14", "DailyMed \u2014 diphenhydramine injection", false),
    "trihexyphenidyl": E("Route of excretion is not stated on the current FDA label.", "https://dailymed.nlm.nih.gov/dailymed/drugInfo.cfm?setid=b60ef86c-b8b6-4530-baaf-d4671ce961af", "DailyMed \u2014 trihexyphenidyl tablets", false),
    "xanomeline-trospium": E("Xanomeline: urine 78% (less than 0.01% unchanged); feces 12%. Trospium: 85\u201390% unchanged in urine (total urine and feces not stated); eliminated in part by active tubular secretion.", "https://dailymed.nlm.nih.gov/dailymed/drugInfo.cfm?setid=8f0e73bf-6025-44f6-ab64-0983322de0df", "DailyMed \u2014 Cobenfy", false),
    "olanzapine-samidorphan": E("Olanzapine: urine 57% (7% unchanged), feces 30%. Samidorphan: urine 67% (18% unchanged), feces 16%.", "https://dailymed.nlm.nih.gov/dailymed/drugInfo.cfm?setid=32ffddd1-4e2b-45d9-9b36-bb730167ec80", "DailyMed \u2014 Lybalvi", true),
    "lemborexant": E("Feces 57.4%; urine 29.1% (less than 1% unchanged).", "https://dailymed.nlm.nih.gov/dailymed/drugInfo.cfm?setid=7074cb65-77b3-45d2-8e8d-da8dc0f70bfd", "DailyMed \u2014 Dayvigo", true),
    "daridorexant": E("Feces about 57%; urine about 28%, primarily as metabolites. Trace parent drug in feces and urine.", "https://dailymed.nlm.nih.gov/dailymed/drugInfo.cfm?setid=3a2d1503-b816-40c9-9fac-7e03c5a3bcef", "DailyMed \u2014 Quviviq", true),
    "atomoxetine": E("Urine: greater than 80% as 4-hydroxyatomoxetine-O-glucuronide (less than 3% unchanged); feces less than 17%.", "https://dailymed.nlm.nih.gov/dailymed/drugInfo.cfm?setid=309de576-c318-404a-bc15-660c2b1876fb", "DailyMed \u2014 Strattera", true),
    "viloxazine": E("Urine 90% within 24 hours; feces less than 1%.", "https://dailymed.nlm.nih.gov/dailymed/drugInfo.cfm?setid=aedf408d-0f84-418d-9416-7c39ddb0d29a", "DailyMed \u2014 Qelbree", true),
    "valbenazine": E("Urine about 60%; feces about 30%. Less than 2% was excreted as unchanged valbenazine or [+]-\u03b1-HTBZ in either urine or feces.", "https://dailymed.nlm.nih.gov/dailymed/drugInfo.cfm?setid=4c970164-cafb-421f-9eb5-c226ef0a3417", "DailyMed \u2014 Ingrezza", true),
    "deutetrabenazine": E("Urine 75\u201386%; feces 8\u201311%.", "https://dailymed.nlm.nih.gov/dailymed/drugInfo.cfm?setid=7ea3c60a-45c7-44cc-afc2-d87fa53993c0", "DailyMed \u2014 Austedo", true),
    "naltrexone": E("Urine 53\u201379% of an oral dose (less than 2% unchanged); fecal excretion is a minor pathway (oral tablet label). The intramuscular label says elimination is primarily via urine, with minimal unchanged drug, and does not give percentages.", "https://dailymed.nlm.nih.gov/dailymed/drugInfo.cfm?setid=e71de213-5250-4a63-9ef7-9ef2f9954d8b", "DailyMed \u2014 naltrexone tablets", false),
    "buprenorphine": E("Urine 30%; feces 69%. In feces, buprenorphine and norbuprenorphine are mostly unconjugated (33% and 21% of the dose).", "https://dailymed.nlm.nih.gov/dailymed/drugInfo.cfm?setid=8a5edcf9-828c-4f97-b671-268ab13a8ecd", "DailyMed \u2014 Suboxone", true)
  };

  var missing = [];
  MEDICATIONS.forEach(function (med) {
    if (map[med.id]) med.elimination = map[med.id];
    else missing.push(med.id);
  });
  if (missing.length && typeof console !== 'undefined') {
    console.warn('Medication cards missing an elimination route:', missing.join(', '));
  }
})();

