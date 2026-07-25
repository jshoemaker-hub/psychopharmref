/* Cellular Neuroscience for Psychiatry — nc- prefix
   Lazy-loaded tool: js/tools/cell-types.js
   Data + SVG figures + procedural three.js models. */
(function(){
  if(window.__ncInit) return; window.__ncInit=true;
  var $=function(id){return document.getElementById(id);};

  /* ---------------------------------------------------------------
     FIGURE LIBRARY — compact schematic SVGs, one per cell type
     viewBox 0 0 300 170, drawn against the site's warm palette
  ----------------------------------------------------------------*/
  function figWrap(inner){
    return '<svg viewBox="0 0 300 170" xmlns="http://www.w3.org/2000/svg" role="img">'+
      '<rect width="300" height="170" fill="#fbf7ee"/>'+inner+'</svg>';
  }
  var FIG={};

  FIG.da=figWrap(
    '<circle cx="60" cy="118" r="17" fill="#e2542f" stroke="#a63a1d" stroke-width="1.4"/>'+
    '<path d="M46,108 L24,92 M46,128 L22,140 M74,110 L96,96 M60,101 L58,80" stroke="#a63a1d" stroke-width="2" fill="none" stroke-linecap="round"/>'+
    '<path d="M77,118 C120,110 150,86 176,60 C196,40 220,32 250,30" stroke="#e2542f" stroke-width="3.4" fill="none" stroke-linecap="round"/>'+
    '<path d="M176,60 C190,78 214,92 248,96" stroke="#e2542f" stroke-width="2.6" fill="none" stroke-linecap="round" stroke-dasharray="1 0"/>'+
    '<path d="M150,86 C160,112 190,132 246,140" stroke="#e2542f" stroke-width="2.2" fill="none" stroke-linecap="round"/>'+
    '<circle cx="252" cy="30" r="4.5" fill="#8b6914"/><circle cx="250" cy="96" r="4.5" fill="#8b6914"/><circle cx="248" cy="140" r="4.5" fill="#8b6914"/>'+
    '<text x="258" y="34" font-size="9" fill="#5c5340">Cortex</text>'+
    '<text x="258" y="100" font-size="9" fill="#5c5340">Striatum</text>'+
    '<text x="256" y="144" font-size="9" fill="#5c5340">NAcc</text>'+
    '<text x="30" y="152" font-size="9" fill="#5c5340">SNc / VTA soma</text>'+
    '<text x="20" y="22" font-size="8.5" fill="#8a8065">tonic pacemaker 1–5 Hz</text>'+
    '<text x="20" y="34" font-size="8.5" fill="#8a8065">phasic bursts 15–30 Hz</text>');

  FIG.sert=figWrap(
    '<rect x="128" y="16" width="16" height="138" rx="7" fill="#e14f97" opacity=".2"/>'+
    '<circle cx="136" cy="52" r="10" fill="#e14f97" stroke="#a82e6c" stroke-width="1.2"/>'+
    '<circle cx="136" cy="86" r="10" fill="#e14f97" stroke="#a82e6c" stroke-width="1.2"/>'+
    '<circle cx="136" cy="120" r="10" fill="#e14f97" stroke="#a82e6c" stroke-width="1.2"/>'+
    '<path d="M146,52 C186,44 214,34 262,30 M146,86 C190,86 220,80 262,74 M146,120 C186,128 216,134 262,140" stroke="#e14f97" stroke-width="2.4" fill="none" stroke-linecap="round"/>'+
    '<path d="M126,52 C104,40 92,30 78,22 M126,120 C104,132 96,142 84,150" stroke="#e14f97" stroke-width="1.8" fill="none" stroke-linecap="round"/>'+
    '<text x="150" y="14" font-size="9" fill="#5c5340">Dorsal &amp; median raphe (midline)</text>'+
    '<text x="266" y="34" font-size="8.5" fill="#5c5340">PFC</text>'+
    '<text x="266" y="78" font-size="8.5" fill="#5c5340">Amyg</text>'+
    '<text x="266" y="144" font-size="8.5" fill="#5c5340">Hipp</text>'+
    '<circle cx="112" cy="86" r="14" fill="none" stroke="#0d9488" stroke-width="1.6" stroke-dasharray="3 2"/>'+
    '<text x="18" y="90" font-size="8.5" fill="#0d9488">5-HT1A auto&#8209;R</text>'+
    '<text x="18" y="104" font-size="8" fill="#8a8065">desensitises over 2–4 wk</text>');

  FIG.ne=figWrap(
    '<ellipse cx="52" cy="86" rx="26" ry="18" fill="#2f6fb0" opacity=".18" stroke="#2f6fb0" stroke-width="1"/>'+
    '<circle cx="44" cy="82" r="7" fill="#2f6fb0"/><circle cx="60" cy="90" r="7" fill="#2f6fb0"/><circle cx="52" cy="72" r="6" fill="#2f6fb0"/>'+
    '<text x="24" y="118" font-size="9" fill="#5c5340">Locus coeruleus</text>'+
    '<text x="20" y="130" font-size="8" fill="#8a8065">~50,000 neurons, bilateral</text>'+
    '<path d="M76,78 C120,52 170,34 264,26 M78,86 C130,86 190,84 264,80 M76,96 C120,116 170,134 250,146" stroke="#2f6fb0" stroke-width="2.6" fill="none" stroke-linecap="round"/>'+
    '<text x="200" y="18" font-size="8.5" fill="#5c5340">Entire cortex</text>'+
    '<text x="176" y="72" font-size="8.5" fill="#5c5340">Hippocampus, amygdala</text>'+
    '<text x="196" y="150" font-size="8.5" fill="#5c5340">Cerebellum, cord</text>'+
    '<path d="M92,140 C112,140 112,152 132,152" stroke="#8b6914" stroke-width="1.4" fill="none"/>'+
    '<text x="30" y="165" font-size="8" fill="#8a8065">inverted-U: too little = drowsy, too much = anxious</text>');

  FIG.ach=figWrap(
    '<circle cx="52" cy="46" r="12" fill="#6d8f3a" stroke="#4a6626" stroke-width="1.2"/>'+
    '<text x="14" y="30" font-size="8.5" fill="#5c5340">nbM (Ch4)</text>'+
    '<path d="M64,44 C120,30 190,26 262,26" stroke="#6d8f3a" stroke-width="2.8" fill="none" stroke-linecap="round"/>'+
    '<text x="200" y="18" font-size="8.5" fill="#5c5340">Neocortex</text>'+
    '<circle cx="52" cy="92" r="12" fill="#6d8f3a" stroke="#4a6626" stroke-width="1.2"/>'+
    '<text x="10" y="112" font-size="8.5" fill="#5c5340">Medial septum</text>'+
    '<path d="M64,90 C120,80 180,74 258,72" stroke="#6d8f3a" stroke-width="2.4" fill="none" stroke-linecap="round"/>'+
    '<text x="196" y="66" font-size="8.5" fill="#5c5340">Hippocampus</text>'+
    '<circle cx="52" cy="140" r="12" fill="#6d8f3a" stroke="#4a6626" stroke-width="1.2"/>'+
    '<text x="12" y="162" font-size="8.5" fill="#5c5340">PPT / LDT</text>'+
    '<path d="M64,138 C120,132 176,124 236,116" stroke="#6d8f3a" stroke-width="2.2" fill="none" stroke-linecap="round"/>'+
    '<text x="176" y="132" font-size="8.5" fill="#5c5340">Thalamus, VTA</text>'+
    '<text x="98" y="152" font-size="8" fill="#8a8065">striatal TANs are local, not projection</text>');

  FIG.ha=figWrap(
    '<ellipse cx="56" cy="118" rx="24" ry="15" fill="#b5892f" opacity=".22" stroke="#8b6914" stroke-width="1"/>'+
    '<circle cx="48" cy="116" r="6" fill="#b5892f"/><circle cx="64" cy="120" r="6" fill="#b5892f"/>'+
    '<text x="20" y="146" font-size="9" fill="#5c5340">Tuberomammillary n.</text>'+
    '<path d="M78,112 C130,86 190,50 266,32 M80,120 C140,120 200,116 264,110" stroke="#b5892f" stroke-width="2.6" fill="none" stroke-linecap="round"/>'+
    '<text x="196" y="24" font-size="8.5" fill="#5c5340">Whole cortex</text>'+
    '<text x="200" y="104" font-size="8.5" fill="#5c5340">Thalamus, BF</text>'+
    '<rect x="98" y="24" width="72" height="30" rx="8" fill="#fff" stroke="#cfc8ba"/>'+
    '<text x="106" y="38" font-size="8.5" fill="#5c5340">VLPO (GABA)</text>'+
    '<text x="106" y="49" font-size="8" fill="#8a8065">sleep switch</text>'+
    '<path d="M134,56 L120,100" stroke="#cfc8ba" stroke-width="2"/><circle cx="119" cy="104" r="4" fill="#cfc8ba"/>'+
    '<text x="104" y="162" font-size="8" fill="#8a8065">H1 blockade &#8594; sedation + weight gain</text>');

  FIG.orx=figWrap(
    '<ellipse cx="150" cy="34" rx="34" ry="16" fill="#7a6cae" opacity=".22" stroke="#5f52a0" stroke-width="1"/>'+
    '<circle cx="138" cy="32" r="6" fill="#7a6cae"/><circle cx="156" cy="36" r="6" fill="#7a6cae"/><circle cx="150" cy="26" r="5" fill="#7a6cae"/>'+
    '<text x="106" y="18" font-size="9" fill="#5c5340">Lateral hypothalamus</text>'+
    '<path d="M124,46 C90,70 62,96 44,124 M144,50 C132,80 122,110 112,140 M162,50 C176,80 190,110 200,140 M180,46 C214,70 240,96 258,122" stroke="#7a6cae" stroke-width="2.4" fill="none" stroke-linecap="round"/>'+
    '<circle cx="40" cy="130" r="9" fill="#2f6fb0" opacity=".8"/><text x="16" y="152" font-size="8.5" fill="#5c5340">LC (NE)</text>'+
    '<circle cx="110" cy="146" r="9" fill="#b5892f" opacity=".8"/><text x="92" y="166" font-size="8.5" fill="#5c5340">TMN (HA)</text>'+
    '<circle cx="202" cy="146" r="9" fill="#e14f97" opacity=".8"/><text x="184" y="166" font-size="8.5" fill="#5c5340">Raphe</text>'+
    '<circle cx="262" cy="128" r="9" fill="#e2542f" opacity=".8"/><text x="248" y="150" font-size="8.5" fill="#5c5340">VTA</text>'+
    '<text x="196" y="34" font-size="8" fill="#8a8065">~50–80k neurons</text>');

  FIG.pyr=figWrap(
    '<line x1="24" y1="22" x2="284" y2="22" stroke="#cfc8ba" stroke-dasharray="3 3"/>'+
    '<text x="26" y="18" font-size="8" fill="#8a8065">Layer I</text>'+
    '<line x1="24" y1="148" x2="284" y2="148" stroke="#cfc8ba" stroke-dasharray="3 3"/>'+
    '<text x="26" y="160" font-size="8" fill="#8a8065">White matter</text>'+
    '<path d="M150,26 L150,96" stroke="#3b4fa0" stroke-width="3"/>'+
    '<path d="M150,34 L128,22 M150,34 L172,22 M150,46 L124,30 M150,46 L176,30 M150,60 L132,42 M150,60 L168,42" stroke="#3b4fa0" stroke-width="1.6" fill="none" stroke-linecap="round"/>'+
    '<path d="M138,104 L112,88 M138,110 L108,110 M162,104 L188,88 M162,110 L192,110 M144,116 L124,132 M156,116 L176,132" stroke="#3b4fa0" stroke-width="1.8" fill="none" stroke-linecap="round"/>'+
    '<path d="M138,96 L150,84 L162,96 L158,116 L142,116 Z" fill="#3b4fa0" stroke="#25316b" stroke-width="1.2"/>'+
    '<path d="M150,116 L150,164" stroke="#3b4fa0" stroke-width="2.4"/>'+
    '<text x="196" y="66" font-size="8.5" fill="#5c5340">apical tuft</text>'+
    '<text x="196" y="112" font-size="8.5" fill="#5c5340">basal dendrites</text>'+
    '<text x="160" y="160" font-size="8.5" fill="#5c5340">axon &#8594; subcortical</text>'+
    '<text x="24" y="42" font-size="8" fill="#8a8065">10,000–30,000 spines</text>'+
    '<text x="24" y="54" font-size="8" fill="#8a8065">~80% of cortical neurons</text>');

  FIG.pv=figWrap(
    '<circle cx="96" cy="86" r="42" fill="none" stroke="#0d9488" stroke-width="1" stroke-dasharray="2 3"/>'+
    '<text x="46" y="40" font-size="8" fill="#0d9488">perineuronal net</text>'+
    '<circle cx="96" cy="86" r="15" fill="#0d9488" stroke="#08635c" stroke-width="1.4"/>'+
    '<path d="M84,74 L64,58 M108,74 L128,58 M82,98 L62,114 M110,98 L130,114 M96,71 L96,50" stroke="#0d9488" stroke-width="1.8" fill="none" stroke-linecap="round"/>'+
    '<path d="M111,86 C150,86 170,80 196,74" stroke="#0d9488" stroke-width="2.4" fill="none"/>'+
    '<path d="M196,60 L208,50 L220,60 L216,80 L200,80 Z" fill="#3b4fa0" stroke="#25316b" stroke-width="1.1"/>'+
    '<path d="M208,50 L208,32" stroke="#3b4fa0" stroke-width="2"/><path d="M208,80 L208,110" stroke="#3b4fa0" stroke-width="1.8"/>'+
    '<ellipse cx="208" cy="70" rx="20" ry="16" fill="none" stroke="#0d9488" stroke-width="2"/>'+
    '<text x="182" y="34" font-size="8.5" fill="#5c5340">basket terminals</text>'+
    '<text x="182" y="45" font-size="8" fill="#8a8065">on soma &amp; proximal dendrite</text>'+
    '<path d="M40,140 l8,-16 l8,16 l8,-16 l8,16 l8,-16 l8,16 l8,-16 l8,16" stroke="#0d9488" stroke-width="1.6" fill="none"/>'+
    '<text x="118" y="144" font-size="8.5" fill="#5c5340">30–80 Hz gamma &#183; Kv3.1 fast-spiking</text>'+
    '<text x="40" y="160" font-size="8" fill="#8a8065">highest mitochondrial density of any cortical neuron</text>');

  FIG.sst=figWrap(
    '<path d="M60,132 L60,54" stroke="#8b6914" stroke-width="2.6"/>'+
    '<circle cx="60" cy="140" r="12" fill="#8b6914" stroke="#5f470c" stroke-width="1.2"/>'+
    '<path d="M60,54 C60,44 76,40 92,40 M60,54 C60,44 44,40 28,40" stroke="#8b6914" stroke-width="2" fill="none"/>'+
    '<text x="16" y="30" font-size="8.5" fill="#5c5340">SST (Martinotti) &#8594; distal apical dendrite</text>'+
    '<path d="M164,44 L176,32 L188,44 L184,66 L168,66 Z" fill="#3b4fa0" stroke="#25316b" stroke-width="1.1"/>'+
    '<path d="M176,32 L176,40 M176,66 L176,120" stroke="#3b4fa0" stroke-width="2"/>'+
    '<path d="M92,40 C120,36 148,34 172,34" stroke="#8b6914" stroke-width="1.8" fill="none" stroke-dasharray="3 2"/>'+
    '<circle cx="240" cy="112" r="12" fill="#b0567a" stroke="#7d3352" stroke-width="1.2"/>'+
    '<text x="212" y="146" font-size="8.5" fill="#5c5340">VIP interneuron</text>'+
    '<path d="M229,108 C180,124 110,140 72,140" stroke="#b0567a" stroke-width="2" fill="none"/>'+
    '<path d="M84,138 l-6,-4 l0,8 z" fill="#b0567a"/>'+
    '<text x="104" y="152" font-size="8.5" fill="#5c5340">VIP &#8867; SST &#8594; disinhibition</text>'+
    '<text x="104" y="163" font-size="8" fill="#8a8065">opens a dendritic plasticity window</text>');

  FIG.msn=figWrap(
    '<circle cx="70" cy="60" r="15" fill="#e0a02e" stroke="#a97609" stroke-width="1.3"/>'+
    '<circle cx="70" cy="122" r="15" fill="#cf6b3a" stroke="#94441c" stroke-width="1.3"/>'+
    '<text x="18" y="40" font-size="8.5" fill="#5c5340">D1 &#183; direct</text>'+
    '<text x="14" y="152" font-size="8.5" fill="#5c5340">D2 &#183; indirect</text>'+
    '<path d="M56,50 L38,36 M58,72 L38,86 M84,50 L102,36" stroke="#a97609" stroke-width="1.6" fill="none" stroke-linecap="round"/>'+
    '<path d="M56,112 L38,98 M58,134 L38,148 M84,112 L102,98" stroke="#94441c" stroke-width="1.6" fill="none" stroke-linecap="round"/>'+
    '<path d="M85,60 C130,58 168,56 214,52" stroke="#e0a02e" stroke-width="2.6" fill="none" stroke-linecap="round"/>'+
    '<path d="M85,122 C130,120 160,116 194,110" stroke="#cf6b3a" stroke-width="2.6" fill="none" stroke-linecap="round"/>'+
    '<rect x="214" y="38" width="66" height="28" rx="7" fill="#fff" stroke="#cfc8ba"/>'+
    '<text x="220" y="50" font-size="8.5" fill="#5c5340">GPi / SNr</text>'+
    '<text x="220" y="61" font-size="8" fill="#8a8065">&#8595; inhibition = GO</text>'+
    '<rect x="194" y="96" width="86" height="28" rx="7" fill="#fff" stroke="#cfc8ba"/>'+
    '<text x="200" y="108" font-size="8.5" fill="#5c5340">GPe &#8594; STN &#8594; GPi</text>'+
    '<text x="200" y="119" font-size="8" fill="#8a8065">&#8593; inhibition = NO-GO</text>'+
    '<text x="70" y="90" font-size="8" fill="#8a8065">Kir2 holds a &#8722;80 mV down-state until cortex fires</text>');

  FIG.ast=figWrap(
    '<circle cx="128" cy="84" r="14" fill="#3f9b90" stroke="#276c64" stroke-width="1.3"/>'+
    '<path d="M116,74 L92,54 M118,94 L94,116 M142,76 L168,58 M142,92 L168,110 M128,70 L126,44 M128,98 L130,126" stroke="#3f9b90" stroke-width="2.2" fill="none" stroke-linecap="round"/>'+
    '<circle cx="90" cy="50" r="4" fill="#3f9b90"/><circle cx="92" cy="120" r="4" fill="#3f9b90"/><circle cx="170" cy="54" r="4" fill="#3f9b90"/><circle cx="126" cy="40" r="4" fill="#3f9b90"/><circle cx="131" cy="130" r="4" fill="#3f9b90"/>'+
    '<path d="M212,20 C204,60 210,110 216,156" stroke="#b0567a" stroke-width="7" fill="none" opacity=".45"/>'+
    '<text x="224" y="34" font-size="8.5" fill="#5c5340">capillary</text>'+
    '<path d="M168,110 C186,116 198,120 206,124" stroke="#3f9b90" stroke-width="3" fill="none"/>'+
    '<ellipse cx="207" cy="124" rx="9" ry="7" fill="#3f9b90" opacity=".7"/>'+
    '<text x="196" y="150" font-size="8" fill="#5c5340">endfoot &#183; AQP4</text>'+
    '<rect x="20" y="24" width="66" height="24" rx="6" fill="#fff" stroke="#cfc8ba"/>'+
    '<text x="26" y="34" font-size="8" fill="#5c5340">EAAT2 (GLT-1)</text>'+
    '<text x="26" y="44" font-size="7.5" fill="#8a8065">~90% Glu uptake</text>'+
    '<rect x="20" y="126" width="66" height="24" rx="6" fill="#fff" stroke="#cfc8ba"/>'+
    '<text x="26" y="136" font-size="8" fill="#5c5340">Kir4.1</text>'+
    '<text x="26" y="146" font-size="7.5" fill="#8a8065">K&#8314; spatial buffer</text>'+
    '<text x="86" y="164" font-size="8" fill="#8a8065">one astrocyte domain &#8776; 100,000 synapses</text>');

  FIG.olig=figWrap(
    '<circle cx="46" cy="84" r="14" fill="#5f52a0" stroke="#3d327a" stroke-width="1.3"/>'+
    '<path d="M58,76 C82,58 100,50 118,48 M60,84 C88,84 100,84 118,84 M58,94 C82,112 100,120 118,122" stroke="#5f52a0" stroke-width="2" fill="none"/>'+
    '<line x1="118" y1="48" x2="284" y2="48" stroke="#cfc8ba" stroke-width="8"/>'+
    '<line x1="118" y1="84" x2="284" y2="84" stroke="#cfc8ba" stroke-width="8"/>'+
    '<line x1="118" y1="122" x2="284" y2="122" stroke="#cfc8ba" stroke-width="8"/>'+
    '<g fill="#5f52a0">'+
    '<rect x="118" y="40" width="42" height="16" rx="7"/><rect x="172" y="40" width="42" height="16" rx="7"/><rect x="226" y="40" width="42" height="16" rx="7"/>'+
    '<rect x="118" y="76" width="42" height="16" rx="7"/><rect x="172" y="76" width="42" height="16" rx="7"/><rect x="226" y="76" width="42" height="16" rx="7"/>'+
    '<rect x="118" y="114" width="42" height="16" rx="7"/><rect x="172" y="114" width="42" height="16" rx="7"/><rect x="226" y="114" width="42" height="16" rx="7"/></g>'+
    '<circle cx="166" cy="84" r="3.6" fill="#e2542f"/><circle cx="220" cy="84" r="3.6" fill="#e2542f"/>'+
    '<text x="150" y="106" font-size="8" fill="#e2542f">node &#183; Na&#7515;1.6</text>'+
    '<text x="16" y="118" font-size="8.5" fill="#5c5340">1 cell,</text>'+
    '<text x="16" y="130" font-size="8.5" fill="#5c5340">up to ~50</text>'+
    '<text x="16" y="142" font-size="8.5" fill="#5c5340">internodes</text>'+
    '<text x="76" y="152" font-size="8" fill="#8a8065">saltatory conduction: 10–100&#215; faster, far cheaper</text>'+
    '<text x="76" y="163" font-size="8" fill="#8a8065">MCT1 also feeds lactate to the axon</text>');

  FIG.mgl=figWrap(
    '<circle cx="150" cy="86" r="13" fill="#b5892f" stroke="#7a5a08" stroke-width="1.3"/>'+
    '<path d="M139,77 L118,58 M139,95 L118,114 M161,77 L182,58 M161,95 L182,114 M150,73 L150,48 M150,99 L150,124 M137,86 L112,86 M163,86 L188,86" stroke="#b5892f" stroke-width="1.6" fill="none" stroke-linecap="round"/>'+
    '<path d="M118,58 l-8,-6 M118,58 l-2,-10 M182,58 l8,-6 M182,58 l2,-10 M118,114 l-8,6 M182,114 l8,6 M150,48 l-7,-6 M150,48 l7,-6 M150,124 l-7,6 M112,86 l-8,-5 M188,86 l8,-5" stroke="#b5892f" stroke-width="1.3" fill="none" stroke-linecap="round"/>'+
    '<path d="M36,40 L48,28 L60,40 L56,62 L40,62 Z" fill="#3b4fa0" stroke="#25316b" stroke-width="1"/>'+
    '<path d="M48,62 L48,110" stroke="#3b4fa0" stroke-width="1.8"/>'+
    '<circle cx="48" cy="90" r="5" fill="#0d9488"/><circle cx="60" cy="102" r="5" fill="#cfc8ba"/>'+
    '<text x="20" y="128" font-size="8" fill="#0d9488">C1q/C3-tagged</text>'+
    '<text x="20" y="139" font-size="8" fill="#8a8065">synapse &#8594; engulfed</text>'+
    '<path d="M112,86 C92,92 74,96 62,100" stroke="#b5892f" stroke-width="1.6" fill="none" stroke-dasharray="3 2"/>'+
    '<rect x="206" y="34" width="82" height="46" rx="8" fill="#fff" stroke="#cfc8ba"/>'+
    '<text x="212" y="46" font-size="8" fill="#5c5340">Kynurenine split</text>'+
    '<text x="212" y="58" font-size="7.5" fill="#8a8065">microglia &#8594; quinolinic</text>'+
    '<text x="212" y="68" font-size="7.5" fill="#8a8065">(NMDA agonist)</text>'+
    '<text x="212" y="78" font-size="7.5" fill="#8a8065">astro &#8594; kynurenic</text>'+
    '<text x="20" y="160" font-size="8" fill="#8a8065">yolk-sac derived &#183; self-renewing &#183; 5–10% of CNS cells</text>');

  FIG.epn=figWrap(
    '<path d="M40,30 C90,20 150,20 200,32 C230,40 250,60 250,84 C250,116 210,140 150,142 C90,144 44,124 34,96 C28,76 30,48 40,30 Z" fill="#e7f2f0" stroke="#3f9b90" stroke-width="1.4"/>'+
    '<text x="106" y="86" font-size="9" fill="#276c64">Lateral ventricle (CSF)</text>'+
    '<g stroke="#8b6914" stroke-width="1.4" fill="none">'+
    '<path d="M60,36 l0,-9 M76,32 l0,-9 M92,29 l0,-9 M108,27 l0,-9 M124,26 l0,-9 M140,25 l0,-9 M156,25 l0,-9 M172,26 l0,-9"/></g>'+
    '<text x="56" y="14" font-size="8" fill="#8b6914">ependymal cilia</text>'+
    '<path d="M186,110 C204,100 222,104 232,118 C240,130 230,140 214,138 C198,136 184,124 186,110 Z" fill="#b0567a" opacity=".5" stroke="#7d3352"/>'+
    '<text x="146" y="158" font-size="8.5" fill="#5c5340">choroid plexus &#183; ~500 mL/day</text>'+
    '<rect x="16" y="106" width="86" height="40" rx="7" fill="#fff" stroke="#cfc8ba"/>'+
    '<text x="22" y="118" font-size="8" fill="#5c5340">NKCC1 + AQP1</text>'+
    '<text x="22" y="129" font-size="7.5" fill="#8a8065">carbonic anhydrase</text>'+
    '<text x="22" y="140" font-size="7.5" fill="#8a8065">&#8592; acetazolamide</text>'+
    '<text x="104" y="102" font-size="8" fill="#8a8065">blood–CSF barrier is epithelial,</text>'+
    '<text x="104" y="113" font-size="8" fill="#8a8065">not endothelial</text>');

  FIG.ent=figWrap(
    '<path d="M20,40 C80,26 200,26 280,40" stroke="#cf6b3a" stroke-width="6" fill="none" opacity=".35"/>'+
    '<path d="M20,132 C80,146 200,146 280,132" stroke="#cf6b3a" stroke-width="6" fill="none" opacity=".35"/>'+
    '<text x="22" y="30" font-size="8" fill="#5c5340">longitudinal muscle</text>'+
    '<text x="22" y="160" font-size="8" fill="#5c5340">mucosa &#183; enterochromaffin cells (90% of body 5-HT)</text>'+
    '<g fill="#6d8f3a" stroke="#4a6626" stroke-width="1.1">'+
    '<circle cx="70" cy="62" r="8"/><circle cx="120" cy="58" r="8"/><circle cx="176" cy="58" r="8"/><circle cx="226" cy="62" r="8"/></g>'+
    '<path d="M78,62 C96,62 104,58 112,58 M128,58 C146,56 160,56 168,58 M184,58 C200,58 210,60 218,62" stroke="#6d8f3a" stroke-width="1.8" fill="none"/>'+
    '<text x="60" y="46" font-size="8" fill="#5c5340">myenteric (Auerbach) plexus</text>'+
    '<g fill="#e14f97" stroke="#a82e6c" stroke-width="1.1">'+
    '<circle cx="96" cy="112" r="7"/><circle cx="150" cy="114" r="7"/><circle cx="204" cy="112" r="7"/></g>'+
    '<text x="70" y="132" font-size="8" fill="#5c5340">submucosal (Meissner) plexus</text>'+
    '<path d="M96,105 L96,74 M150,107 L150,68 M204,105 L204,72" stroke="#8a8065" stroke-width="1" stroke-dasharray="2 2"/>'+
    '<text x="214" y="86" font-size="8" fill="#8a8065">400–600M neurons</text>'+
    '<text x="206" y="96" font-size="8" fill="#8a8065">— more than the cord</text>');

  FIG.pkj=figWrap(
    '<line x1="20" y1="118" x2="284" y2="118" stroke="#cfc8ba" stroke-dasharray="3 3"/>'+
    '<text x="22" y="132" font-size="8" fill="#8a8065">granular layer</text>'+
    '<text x="22" y="24" font-size="8" fill="#8a8065">molecular layer</text>'+
    '<circle cx="140" cy="112" r="13" fill="#7a6cae" stroke="#4d4082" stroke-width="1.3"/>'+
    '<path d="M140,99 L140,74" stroke="#7a6cae" stroke-width="3.2"/>'+
    '<g stroke="#7a6cae" stroke-width="1.9" fill="none" stroke-linecap="round">'+
    '<path d="M140,74 L112,50 M140,74 L168,50 M140,74 L140,42"/>'+
    '<path d="M112,50 L92,32 M112,50 L108,26 M168,50 L188,32 M168,50 L172,26 M140,42 L126,22 M140,42 L154,22"/></g>'+
    '<g stroke="#7a6cae" stroke-width="1.2" fill="none" stroke-linecap="round">'+
    '<path d="M92,32 l-8,-9 M92,32 l-1,-11 M188,32 l8,-9 M188,32 l1,-11 M108,26 l-5,-9 M172,26 l5,-9 M126,22 l-4,-9 M154,22 l4,-9"/></g>'+
    '<g stroke="#8b6914" stroke-width="0.9" opacity=".75">'+
    '<line x1="30" y1="34" x2="270" y2="34"/><line x1="30" y1="48" x2="270" y2="48"/><line x1="30" y1="62" x2="270" y2="62"/></g>'+
    '<text x="196" y="46" font-size="8" fill="#8b6914">parallel fibres (~175,000)</text>'+
    '<path d="M180,150 C168,130 150,110 142,84" stroke="#e2542f" stroke-width="2.2" fill="none"/>'+
    '<text x="176" y="164" font-size="8" fill="#e2542f">climbing fibre (1 only)</text>'+
    '<path d="M140,125 L140,158" stroke="#7a6cae" stroke-width="2.2"/>'+
    '<text x="26" y="104" font-size="8" fill="#5c5340">50–100 Hz simple spikes</text>'+
    '<text x="26" y="94" font-size="8" fill="#5c5340">GABAergic sole output</text>');

  FIG.dgc=figWrap(
    '<path d="M40,120 C60,60 120,34 172,40 C214,44 240,64 248,92" stroke="#3f9b90" stroke-width="9" fill="none" opacity=".3"/>'+
    '<text x="88" y="30" font-size="8.5" fill="#5c5340">Dentate gyrus granule cell layer</text>'+
    '<g fill="#3f9b90" stroke="#276c64" stroke-width="1">'+
    '<circle cx="74" cy="96" r="6"/><circle cx="92" cy="76" r="6"/><circle cx="116" cy="60" r="6"/><circle cx="146" cy="50" r="6"/><circle cx="178" cy="48" r="6"/><circle cx="208" cy="58" r="6"/></g>'+
    '<circle cx="132" cy="110" r="8" fill="#0d9488" stroke="#08635c" stroke-width="1.3"/>'+
    '<path d="M132,102 L128,86 M132,102 L140,88" stroke="#0d9488" stroke-width="1.6" fill="none"/>'+
    '<text x="96" y="132" font-size="8" fill="#0d9488">adult-born, 2–4 wk hyperplastic window</text>'+
    '<path d="M24,44 C48,44 62,52 70,62" stroke="#8b6914" stroke-width="2" fill="none"/>'+
    '<text x="14" y="38" font-size="8" fill="#8b6914">perforant path</text>'+
    '<path d="M214,60 C240,72 262,92 268,116" stroke="#3b4fa0" stroke-width="2.2" fill="none"/>'+
    '<text x="212" y="146" font-size="8" fill="#3b4fa0">mossy fibres &#8594; CA3</text>'+
    '<text x="26" y="152" font-size="8" fill="#8a8065">sparse firing = pattern separation</text>'+
    '<text x="26" y="163" font-size="8" fill="#8a8065">suppressed by cortisol, raised by exercise / AD / ECT / ketamine</text>');

  FIG.bbb=figWrap(
    '<rect x="30" y="60" width="240" height="46" rx="12" fill="#f6e9ec" stroke="#b0567a" stroke-width="1.4"/>'+
    '<text x="122" y="88" font-size="9.5" fill="#7d3352">capillary lumen</text>'+
    '<g stroke="#7d3352" stroke-width="2.4">'+
    '<line x1="96" y1="60" x2="96" y2="50"/><line x1="176" y1="60" x2="176" y2="50"/>'+
    '<line x1="96" y1="106" x2="96" y2="116"/><line x1="176" y1="106" x2="176" y2="116"/></g>'+
    '<text x="72" y="44" font-size="8" fill="#7d3352">tight junctions (claudin-5)</text>'+
    '<ellipse cx="216" cy="120" rx="20" ry="11" fill="#cf6b3a" opacity=".55" stroke="#94441c"/>'+
    '<text x="196" y="144" font-size="8" fill="#5c5340">pericyte</text>'+
    '<circle cx="58" cy="136" r="11" fill="#3f9b90" stroke="#276c64" stroke-width="1.2"/>'+
    '<path d="M66,128 C80,120 88,114 96,110" stroke="#3f9b90" stroke-width="3" fill="none"/>'+
    '<ellipse cx="98" cy="109" rx="9" ry="6" fill="#3f9b90" opacity=".75"/>'+
    '<text x="20" y="160" font-size="8" fill="#5c5340">astrocyte endfoot (&gt;95% coverage, AQP4)</text>'+
    '<g><rect x="34" y="14" width="60" height="22" rx="6" fill="#fff" stroke="#cfc8ba"/>'+
    '<text x="40" y="28" font-size="8" fill="#5c5340">P-gp efflux</text></g>'+
    '<path d="M64,36 L64,58" stroke="#cfc8ba" stroke-width="1.6"/><path d="M64,58 l-4,-6 l8,0 z" fill="#cfc8ba"/>'+
    '<g><rect x="188" y="14" width="98" height="22" rx="6" fill="#fff" stroke="#cfc8ba"/>'+
    '<text x="194" y="28" font-size="8" fill="#5c5340">GLUT1 &#183; LAT1 (L-DOPA)</text></g>'+
    '<path d="M238,36 L238,58" stroke="#cfc8ba" stroke-width="1.6"/><path d="M238,58 l-4,-6 l8,0 z" fill="#cfc8ba"/>');

  /* ---------------------------------------------------------------
     CELL ATLAS
  ----------------------------------------------------------------*/
  var CELLS=[

  /* ============ NEUROMODULATORY PROJECTION NEURONS ============ */
  {id:"da",cat:"Neuromodulatory projection neurons",name:"Dopaminergic neuron",sub:"SNc (A9) &middot; VTA (A10) &middot; arcuate (A12)",color:"#e2542f",fig:FIG.da,model:"morph",
   why:"Every antipsychotic ever marketed acts on the receptors these cells talk to. There is one drug mechanism &mdash; D<sub>2</sub> blockade &mdash; and four clinical consequences, because there are four anatomically separate dopamine pathways from three cell groups. If you understand this one cell you understand why the same tablet treats hallucinations, causes parkinsonism, raises prolactin, and blunts motivation.",
   loc:"<b>Substantia nigra pars compacta (A9)</b> &rarr; dorsal striatum (nigrostriatal; motor). <b>Ventral tegmental area (A10)</b> &rarr; nucleus accumbens and amygdala (mesolimbic; salience and reward) and &rarr; prefrontal cortex (mesocortical; motivation, working memory). <b>Arcuate nucleus (A12)</b> &rarr; median eminence (tuberoinfundibular; tonically suppresses prolactin). A smaller <b>A11</b> diencephalospinal group projects to the cord and is implicated in restless legs syndrome. Together these are perhaps 400,000&ndash;600,000 neurons in the human brain &mdash; a vanishingly small population with outsized reach.",
   phys:[
    {h:"Two firing modes",t:"Dopamine neurons are autonomous pacemakers: they fire 1&ndash;5 Hz in the absence of any synaptic input, driven by L-type Ca<sub>v</sub>1.3 calcium channels and HCN. This tonic mode sets background extracellular dopamine and thus baseline receptor occupancy. Superimposed <b>burst firing</b> at 15&ndash;30 Hz &mdash; triggered by glutamatergic and cholinergic input from the pedunculopontine nucleus &mdash; produces brief, high-concentration phasic transients. Tonic and phasic dopamine are functionally different signals: tonic sets tone, phasic encodes reward-prediction error."},
    {h:"Synthesis",t:"Tyrosine &rarr; L-DOPA by <b>tyrosine hydroxylase</b> (rate-limiting, requires tetrahydrobiopterin and iron) &rarr; dopamine by aromatic L-amino acid decarboxylase (requires pyridoxal phosphate). Because AADC is abundant and non-limiting in the periphery, exogenous levodopa must be given with carbidopa."},
    {h:"Packaging and clearance",t:"VMAT2 loads dopamine into vesicles against a steep gradient using the proton gradient generated by the vesicular H<sup>+</sup>-ATPase (intravesicular pH &asymp;5.5). Released dopamine is cleared by <b>DAT</b> in the striatum. In the prefrontal cortex DAT is sparse, so cortical dopamine is cleared instead by the noradrenaline transporter and degraded by COMT &mdash; which is why NET-selective drugs (atomoxetine, reboxetine) raise prefrontal dopamine, and why the COMT Val158Met polymorphism affects prefrontal but not striatal function."},
    {h:"Autoreceptor brake",t:"The short D<sub>2S</sub> isoform sits on the soma and terminals. Activation opens GIRK channels, hyperpolarises the cell, and inhibits tyrosine hydroxylase &mdash; a fast negative feedback loop. Partial agonists (aripiprazole, brexpiprazole, cariprazine) exploit it: they behave as functional antagonists where dopamine is high and as agonists where it is low."}],
   rt:[
    {n:"D<sub>1</sub> / D<sub>5</sub>",c:"GPCR &middot; G<sub>s</sub>",d:"Postsynaptic, direct-pathway MSNs and cortex. &uarr; cAMP &rarr; PKA &rarr; DARPP-32."},
    {n:"D<sub>2</sub> / D<sub>3</sub> / D<sub>4</sub>",c:"GPCR &middot; G<sub>i/o</sub>",d:"D<sub>2</sub> is the antipsychotic receptor (60&ndash;80% striatal occupancy is the therapeutic window; &gt;80% predicts EPS). D<sub>3</sub> is limbic-enriched (cariprazine is D<sub>3</sub>-preferring). D<sub>4</sub> is cortical (clozapine's highest dopamine affinity)."},
    {n:"DAT (SLC6A3)",c:"Na<sup>+</sup>/Cl<sup>&minus;</sup> symporter",d:"Cotransports 2 Na<sup>+</sup> + 1 Cl<sup>&minus;</sup> per dopamine. Cocaine and methylphenidate block it; amphetamine is a substrate that <i>reverses</i> it, driving efflux."},
    {n:"VMAT2 (SLC18A2)",c:"H<sup>+</sup> antiporter",d:"Target of tetrabenazine, valbenazine, deutetrabenazine for tardive dyskinesia and Huntington chorea. Amphetamine also collapses the vesicular pH gradient, dumping dopamine into the cytosol."},
    {n:"TH, AADC, MAO-A/B, COMT",c:"Enzymes",d:"MAO-B inhibitors (selegiline, rasagiline) spare tyramine metabolism at low dose; the transdermal selegiline patch avoids gut MAO-A and needs no diet at 6 mg/24 h."},
    {n:"Ca<sub>v</sub>1.3, HCN, GIRK",c:"Ion channels",d:"Pacemaking machinery. The chronic calcium load is the leading account of why SNc neurons die selectively."}],
   dz:[
    {n:"Parkinson disease",d:"Motor signs appear only after roughly 60&ndash;80% of SNc neurons and &gt;80% of striatal dopamine terminals are lost &mdash; the system has enormous reserve, which is why the prodrome (REM sleep behaviour disorder, hyposmia, constipation, depression) precedes tremor by a decade. Pathology is &alpha;-synuclein Lewy bodies. Selective vulnerability is attributed to the pacemaking calcium load, a long unmyelinated axon with immense bioenergetic demand, and cytosolic dopamine auto-oxidation."},
    {n:"Schizophrenia",d:"The most robust molecular imaging finding in the field is elevated <i>presynaptic</i> striatal dopamine synthesis capacity (FDOPA PET), largest in the associative striatum &mdash; not increased D<sub>2</sub> density. The aberrant salience model follows directly: excess phasic dopamine attaches significance to irrelevant stimuli, and delusion is the patient's explanatory response."},
    {n:"Hyperprolactinaemia",d:"Tuberoinfundibular dopamine tonically inhibits lactotrophs. D<sub>2</sub> blockade there &mdash; note this occurs <i>outside</i> the blood&ndash;brain barrier at the median eminence &mdash; releases prolactin: galactorrhoea, amenorrhoea, sexual dysfunction, and long-term bone loss. Risperidone and paliperidone are the worst offenders; aripiprazole lowers prolactin."},
    {n:"Stimulant use disorder",d:"Cocaine blocks DAT; amphetamine reverses DAT and empties vesicles via VMAT2. The speed of the phasic rise, not its magnitude alone, drives reinforcement &mdash; which is the pharmacokinetic argument for long-acting formulations in ADHD."},
    {n:"Tardive dyskinesia",d:"Chronic postsynaptic D<sub>2</sub> blockade in the striatum with compensatory supersensitivity. Treated by depleting the presynaptic side (VMAT2 inhibitors), not by adding more blockade."}],
   pert:[
    {k:"pH",t:"VMAT2 depends entirely on the vesicular proton gradient. Anything that collapses it &mdash; amphetamine, cytosolic acidification, reserpine at the transporter &mdash; leaves dopamine in the cytosol, where it auto-oxidises to reactive quinones. This is one proposed link between metabolic stress and nigral degeneration."},
    {k:"Fever &amp; temperature",t:"Hyperthermia increases dopamine release and promotes reverse transport through DAT &mdash; a central mechanism in methamphetamine and MDMA toxicity, where hyperthermia and neurotoxicity are tightly coupled. Conversely, D<sub>2</sub> blockade in the preoptic hypothalamus impairs thermoregulation and is the initiating lesion of <b>neuroleptic malignant syndrome</b>: rigidity generates heat while the hypothalamus fails to dissipate it."},
    {k:"Seizures",t:"Dopamine is broadly anticonvulsant through D<sub>2</sub> receptors in limbic forebrain and proconvulsant through D<sub>1</sub>. Clinically, dopamine antagonists lower seizure threshold modestly &mdash; clozapine and chlorpromazine most, haloperidol and fluphenazine least, which matters when choosing an antipsychotic in a patient with epilepsy."},
    {k:"Electrolytes",t:"DAT is driven by the transmembrane sodium gradient: hyponatraemia reduces reuptake capacity. Hypocalcaemia impairs vesicle fusion at synaptotagmin. Hypomagnesaemia removes the Mg<sup>2+</sup> block from NMDA receptors on dopamine neurons, favouring burst firing. Iron deficiency reduces tyrosine hydroxylase activity (iron is a cofactor) &mdash; the accepted mechanism of restless legs syndrome and a reason to check ferritin before treating it."}],
   pearls:["Four pathways, one receptor: mesolimbic (psychosis), nigrostriatal (EPS), tuberoinfundibular (prolactin), mesocortical (negative and cognitive symptoms).",
    "D<sub>2</sub> occupancy 60&ndash;80% = therapeutic; &gt;80% = extrapyramidal symptoms. Clozapine and quetiapine work at 20&ndash;60%, which is why they rarely cause EPS.",
    "Elevated presynaptic dopamine <i>synthesis</i>, not receptor number, is the reproducible imaging abnormality in schizophrenia."],
   chapters:[["schizophrenia","Schizophrenia"],["antipsychotic-review","Antipsychotic Review"],["parkinsons-disease","Parkinson Disease"],["antipsychotic-movement-disorders","Antipsychotic Movement Disorders"]]},

  {id:"sert",cat:"Neuromodulatory projection neurons",name:"Serotonergic neuron",sub:"Dorsal (B7) &amp; median (B8) raphe",color:"#e14f97",fig:FIG.sert,model:"synapse",
   why:"The two-to-four week lag before an SSRI works is not a pharmacokinetic fact &mdash; steady state is reached in about five days. It is a property of this cell. Explaining the lag mechanistically is the single most useful thing you can do for a patient starting an antidepressant.",
   loc:"A midline column through the brainstem. The <b>dorsal raphe</b> (B7) projects to cortex, striatum, and amygdala with fine, highly branched, varicose axons; the <b>median raphe</b> (B8) supplies hippocampus and septum with thicker, basket-like terminals. Caudal groups (raphe magnus, obscurus, pallidus) descend to the dorsal horn and are the substrate of descending pain modulation &mdash; the reason SNRIs and TCAs treat neuropathic pain at doses below their antidepressant range. Perhaps 300,000 neurons in total, innervating essentially every region of the CNS.",
   phys:[
    {h:"Clock-like firing",t:"Slow, remarkably regular 1&ndash;5 Hz discharge that tracks arousal state: highest in active waking, lower in quiet waking, minimal in NREM, and <b>silent in REM sleep</b>. Raphe, locus coeruleus, and tuberomammillary neurons are all REM-off; the cholinergic PPT/LDT neurons are REM-on. That reciprocity is the classic account of REM generation and is why serotonergic drugs suppress REM and their withdrawal produces REM rebound and vivid dreams."},
    {h:"Synthesis is substrate-limited",t:"Tryptophan &rarr; 5-HTP by <b>tryptophan hydroxylase 2</b> (the brain isoform; TPH1 is peripheral) &rarr; serotonin by AADC. Unlike tyrosine hydroxylase, TPH2 is <i>not</i> saturated at physiological substrate concentrations, so brain serotonin synthesis depends directly on plasma tryptophan. This is why acute tryptophan depletion transiently returns depressive symptoms in remitted, SSRI-treated patients but does nothing in never-depressed controls &mdash; a real experimental result worth knowing, and one of the better arguments that serotonin matters in some people rather than everyone."},
    {h:"The autoreceptor account of the therapeutic lag",t:"An SSRI blocks SERT everywhere, including on the raphe soma and dendrites. Serotonin accumulates there first, activates somatodendritic <b>5-HT<sub>1A</sub> autoreceptors</b>, opens GIRK channels, and <i>silences the cell</i>. Net terminal serotonin therefore changes little in week one. Over two to four weeks the 5-HT<sub>1A</sub> autoreceptor desensitises and downregulates, firing recovers against a background of blocked reuptake, and terminal serotonin finally rises. Pindolol augmentation, vilazodone, vortioxetine, and gepirone all target this node."},
    {h:"Clearance",t:"SERT (SLC6A4) cotransports Na<sup>+</sup> and Cl<sup>&minus;</sup> inward and counter-transports K<sup>+</sup>. Degradation is by MAO-A to 5-HIAA. Low CSF 5-HIAA is one of the older and more replicated biological correlates of impulsive aggression and violent suicide attempt."}],
   rt:[
    {n:"5-HT<sub>1A</sub>",c:"GPCR &middot; G<sub>i/o</sub>",d:"Somatodendritic autoreceptor (raphe) and postsynaptic (hippocampus, cortex). Buspirone is a partial agonist; desensitisation is the lag mechanism."},
    {n:"5-HT<sub>1B/1D</sub>",c:"GPCR &middot; G<sub>i/o</sub>",d:"Terminal autoreceptor. Triptans are 1B/1D agonists &mdash; hence the (much overstated) triptan&ndash;SSRI serotonin syndrome warning."},
    {n:"5-HT<sub>2A</sub>",c:"GPCR &middot; G<sub>q</sub>",d:"Cortical layer V pyramidal dendrites. Agonism = psychedelics (LSD, psilocybin). Antagonism = the defining second-generation antipsychotic property, and the receptor whose blockade by cyproheptadine treats serotonin syndrome."},
    {n:"5-HT<sub>2C</sub>",c:"GPCR &middot; G<sub>q</sub>",d:"Appetite suppression, and the receptor whose blockade (with H<sub>1</sub>) drives antipsychotic weight gain. Constitutively active; also RNA-edited."},
    {n:"5-HT<sub>3</sub>",c:"Ligand-gated cation channel",d:"The only ionotropic serotonin receptor. Area postrema and vagal afferents: nausea. Ondansetron blocks it; it also explains first-week SSRI nausea and why the nausea abates as the receptor desensitises."},
    {n:"5-HT<sub>4</sub> / <sub>6</sub> / <sub>7</sub>",c:"GPCR &middot; G<sub>s</sub>",d:"5-HT<sub>4</sub>: gut motility (prucalopride) and an emerging fast-antidepressant target. 5-HT<sub>7</sub>: circadian rhythm; blocked by vortioxetine, lurasidone, amisulpride."},
    {n:"SERT (SLC6A4)",c:"Na<sup>+</sup>/Cl<sup>&minus;</sup> symporter",d:"The SSRI target. The 5-HTTLPR short allele stress-interaction literature is now regarded as largely non-replicated &mdash; teach it as a cautionary tale in candidate-gene research."},
    {n:"TPH2, MAO-A, VMAT2",c:"Enzymes / transporter",d:"MAO-A inhibition plus SERT blockade is the classic serotonin syndrome combination (the 14-day washout, 5 weeks for fluoxetine)."}],
   dz:[
    {n:"Major depression and anxiety disorders",d:"SSRIs, SNRIs, and TCAs all converge on this system, but the honest teaching point is that serotonin deficiency has never been demonstrated as a cause of depression; what is demonstrated is that manipulating this system changes symptoms in many patients. Hold both facts at once."},
    {n:"Serotonin syndrome",d:"A clinical triad of mental status change, autonomic instability, and <b>neuromuscular hyperactivity &mdash; inducible clonus, ocular clonus, hyperreflexia, greater in the legs than arms</b>. Onset within 24 hours of a dose change (contrast NMS: days to weeks, rigidity is lead-pipe and <i>hyporeflexic</i>). Mediated principally by 5-HT<sub>2A</sub> with 5-HT<sub>1A</sub> contribution. Treatment is withdrawal of the agent, benzodiazepines, active cooling, and cyproheptadine."},
    {n:"OCD",d:"Requires higher SSRI doses and a longer trial (10&ndash;12 weeks) than depression &mdash; a dose&ndash;response relationship that is genuinely different from the flat dose&ndash;response curve seen in major depression."},
    {n:"SSRI-associated hyponatraemia / SIADH",d:"Highest risk in the first two to four weeks, in older adults, in women, in low body weight, and with concurrent thiazides. Serotonin stimulates vasopressin release via 5-HT<sub>2C</sub> and 5-HT<sub>1A</sub>. Check a sodium at two weeks in anyone over 65 starting an SSRI."},
    {n:"Sexual dysfunction",d:"5-HT<sub>2A</sub> stimulation inhibits dopaminergic and nitrergic pathways for arousal and orgasm. It is the commonest reason patients quietly stop an SSRI, and it should be asked about directly rather than waited for."}],
   pert:[
    {k:"pH",t:"5-HT<sub>3</sub> is a cation channel whose conductance is proton-sensitive. More clinically: respiratory alkalosis from hyperventilation during a panic attack shifts calcium binding and membrane excitability generally, and the resulting paraesthesiae and carpopedal spasm are frequently misread as a serotonin-syndrome sign in an anxious patient on an SSRI. Look for clonus, not tingling."},
    {k:"Fever &amp; temperature",t:"Serotonin-syndrome hyperthermia is generated by <b>muscle activity</b> &mdash; tremor, clonus, rigidity &mdash; not by a raised hypothalamic set-point. This is why antipyretics are useless and why active external cooling, benzodiazepines, and (in severe cases) paralysis with intubation are the correct interventions. Temperature above 41.1&nbsp;&deg;C is the threshold for neuromuscular paralysis."},
    {k:"Seizures",t:"At therapeutic doses SSRIs do not meaningfully lower seizure threshold and may raise it; in overdose they do lower it. 5-HT<sub>2C</sub> knockout animals are spontaneously epileptic. Practical corollary: an SSRI is a reasonable antidepressant in epilepsy; bupropion (dose-dependent, contraindicated in bulimia and in eating disorders with electrolyte derangement) and clomipramine are not first choices."},
    {k:"Electrolytes",t:"SERT is sodium- and chloride-coupled and potassium-counter-transporting, so its turnover falls with hyponatraemia &mdash; a self-reinforcing loop in SSRI-associated SIADH. Hypomagnesaemia and hypokalaemia matter separately because citalopram, escitalopram, and to a lesser degree other agents prolong QT, and the QT risk is realised only when potassium and magnesium are low."}],
   pearls:["The lag is autoreceptor desensitisation, not pharmacokinetics. Say so to the patient at the first visit.",
    "Serotonin syndrome = clonus and hyperreflexia within 24 h. NMS = lead-pipe rigidity and hyporeflexia over days.",
    "Check sodium two weeks after starting an SSRI in an older adult.",
    "Fluoxetine's washout before an MAOI is five weeks, not two, because of norfluoxetine's 7&ndash;15 day half-life."],
   chapters:[["antidepressant-review","Antidepressant Review"],["serotonin-syndrome-nms","Serotonin Syndrome &amp; NMS"],["major-depressive-disorder","Major Depressive Disorder"],["obsessive-compulsive-disorder","OCD"]]},

  {id:"ne",cat:"Neuromodulatory projection neurons",name:"Noradrenergic neuron",sub:"Locus coeruleus (A6) &middot; lateral tegmental A1/A2/A5/A7",color:"#2f6fb0",fig:FIG.ne,model:"morph",
   why:"About 50,000 neurons on each side of the pons supply every noradrenaline molecule in the cortex, hippocampus, and cerebellum. They set arousal on an inverted-U curve, and almost every drug used for hyperarousal, panic, nightmares, and inattention is titrating that curve.",
   loc:"The <b>locus coeruleus</b> sits in the dorsal rostral pons at the floor of the fourth ventricle &mdash; pigmented, tiny, and the sole source of cortical, hippocampal, and cerebellar noradrenaline. Its axons are unmyelinated, enormously divergent, and largely non-synaptic (volume transmission). Lateral tegmental groups (A1, A2 in the nucleus tractus solitarius, A5, A7) supply hypothalamus, amygdala, and spinal cord and mediate autonomic and cardiovascular reflexes.",
   phys:[
    {h:"Inverted-U arousal",t:"Tonic firing at 1&ndash;3 Hz produces optimal alert focus. Too little (0&ndash;1 Hz) is drowsiness and inattention; too much (&gt;3 Hz) produces distractible, scanning, anxious hypervigilance. Phasic bursts are locked to salient or unexpected stimuli and reset attention. Like raphe and TMN neurons, LC cells are REM-off and silent during REM."},
    {h:"Synthesis",t:"Tyrosine &rarr; L-DOPA &rarr; dopamine &rarr; noradrenaline by <b>dopamine &beta;-hydroxylase</b>, which is unusual in being located <i>inside</i> the vesicle and requiring ascorbate and copper. Adrenaline is made only where PNMT is present (adrenal medulla, C1&ndash;C3 medullary groups)."},
    {h:"Clearance and the prefrontal quirk",t:"NET (SLC6A2) takes noradrenaline back up. In prefrontal cortex NET also clears <b>dopamine</b>, because DAT density there is low. Consequently atomoxetine, a pure NET inhibitor, raises prefrontal dopamine as well as noradrenaline &mdash; the pharmacological basis for a non-stimulant working in ADHD. COMT and MAO-A degrade the transmitter to MHPG."},
    {h:"&alpha;<sub>2A</sub> and prefrontal network strength",t:"Postsynaptic &alpha;<sub>2A</sub> receptors on prefrontal pyramidal dendritic spines close HCN channels, which increases the effective coupling of recurrent networks that hold information across a delay. This is the specific mechanism of guanfacine in ADHD, and it is a rare instance where a receptor-level action maps cleanly onto a cognitive operation."}],
   rt:[
    {n:"&alpha;<sub>1</sub>",c:"GPCR &middot; G<sub>q</sub>",d:"Vascular tone and cortical arousal. Blockade &rarr; orthostatic hypotension and sedation (prazosin, doxazosin; also quetiapine, clozapine, chlorpromazine, and trazodone). Prazosin for PTSD nightmares works here."},
    {n:"&alpha;<sub>2A</sub>",c:"GPCR &middot; G<sub>i/o</sub>",d:"Presynaptic autoreceptor <i>and</i> postsynaptic prefrontal receptor. Agonists: clonidine, guanfacine, dexmedetomidine, lofexidine. Antagonism by yohimbine provokes panic and by mirtazapine increases noradrenaline and serotonin release."},
    {n:"&beta;<sub>1</sub> / &beta;<sub>2</sub>",c:"GPCR &middot; G<sub>s</sub>",d:"&beta;<sub>1</sub> cardiac (propranolol for performance anxiety and for akathisia); &beta;<sub>2</sub> drives potassium into cells &mdash; relevant to hypokalaemia during panic, salbutamol use, or catecholamine surge."},
    {n:"NET (SLC6A2)",c:"Na<sup>+</sup>/Cl<sup>&minus;</sup> symporter",d:"Target of atomoxetine, viloxazine, reboxetine, and the noradrenergic half of every SNRI and TCA."},
    {n:"DBH, MAO-A, COMT",c:"Enzymes",d:"DBH deficiency is a rare congenital cause of profound orthostatic hypotension, treated with droxidopa, which bypasses the missing enzyme."},
    {n:"HCN1",c:"Ion channel",d:"The dendritic channel &alpha;<sub>2A</sub> signalling closes; also the target of the &alpha;<sub>1</sub>-mediated opposite effect during stress."}],
   dz:[
    {n:"Panic disorder",d:"Yohimbine (&alpha;<sub>2</sub> antagonist, disinhibiting the LC) reliably provokes panic in patients and not in controls. The LC hyperexcitability model sits alongside the CO<sub>2</sub>/suffocation-alarm model &mdash; both are supported, and the orexin neuron is where they meet."},
    {n:"PTSD",d:"Elevated CSF noradrenaline correlates with symptom severity; prazosin reduces nightmares in several trials though the large VA cooperative study was negative &mdash; a good example of why a mechanism can be right and a trial still fail on population selection."},
    {n:"ADHD",d:"Prefrontal &alpha;<sub>2A</sub> and dopaminergic D<sub>1</sub> signalling both follow inverted-U functions; stimulants and guanfacine move a patient toward the peak rather than simply 'increasing' anything."},
    {n:"Opioid and alcohol withdrawal",d:"Opioids tonically inhibit LC firing through &mu;-receptor coupled GIRK. Withdrawal removes that brake and the LC fires furiously &mdash; producing the autonomic storm. &alpha;<sub>2</sub> agonists (clonidine, lofexidine) substitute for the missing inhibition, which is why they work and why they cause hypotension."},
    {n:"Late-life LC degeneration",d:"The locus coeruleus is one of the earliest sites of tau pathology in Alzheimer disease &mdash; arguably the very first &mdash; which reframes the anxiety, sleep fragmentation, and irritability of the AD prodrome as noradrenergic rather than merely reactive."}],
   pert:[
    {k:"pH",t:"Catecholamines lose vasopressor potency in severe acidosis (pH &lt;7.1) and are chemically unstable in alkaline solution. In an agitated, acidotic patient &mdash; excited delirium, stimulant toxicity, prolonged restraint &mdash; correcting acidosis and volume is a higher priority than escalating sedation, and restraint-associated acidosis is itself a recognised cause of sudden death."},
    {k:"Fever &amp; temperature",t:"Noradrenaline drives non-shivering thermogenesis via &beta;<sub>3</sub> receptors on brown adipose tissue and contributes to the autonomic instability of NMS. &alpha;<sub>1</sub> blockade impairs cutaneous vasoconstriction and predisposes to hypothermia in older adults on antipsychotics &mdash; a hazard that is underappreciated relative to hyperthermia."},
    {k:"Seizures",t:"Noradrenaline is broadly <b>anticonvulsant</b>: lesioning the LC lowers seizure threshold, and vagus nerve stimulation raises LC firing, which is one of its proposed antiseizure mechanisms. This is a rare case where a monoamine's effect on excitability is consistent across models."},
    {k:"Electrolytes",t:"&beta;<sub>2</sub> stimulation shifts potassium intracellularly; a catecholamine surge can drop serum potassium by 0.5&ndash;1.0 mmol/L within minutes, which matters in a patient on a QT-prolonging antipsychotic during acute agitation. Hypomagnesaemia potentiates catecholamine release and is common in alcohol withdrawal &mdash; replete magnesium before chasing the tachycardia."}],
   pearls:["50,000 cells per side supply the entire cortical noradrenaline supply.",
    "In prefrontal cortex, NET clears dopamine &mdash; the reason atomoxetine works in ADHD.",
    "Opioid withdrawal is LC disinhibition; clonidine substitutes for the missing &mu;-receptor brake.",
    "Yohimbine provokes panic; that experiment is the cleanest evidence for a noradrenergic contribution to panic disorder."],
   chapters:[["ptsd-cptsd","PTSD &amp; C-PTSD"],["panic-attacks-gad","Panic Attacks &amp; GAD"],["adult-adhd","Adult ADHD"],["opioid-use-disorder","Opioid Use Disorder"]]},

  {id:"ach",cat:"Neuromodulatory projection neurons",name:"Cholinergic neuron",sub:"Basal forebrain (Ch1&ndash;Ch4) &middot; PPT/LDT &middot; striatal interneurons",color:"#6d8f3a",fig:FIG.ach,model:"receptor",
   why:"Anticholinergic burden is probably the most common iatrogenic cause of cognitive impairment and delirium in the patients we see, and it is entirely preventable. Meanwhile muscarinic agonism has become the first genuinely new antipsychotic mechanism in seventy years.",
   loc:"Three functionally distinct systems. <b>(1) Basal forebrain:</b> the nucleus basalis of Meynert (Ch4) supplies the entire neocortex and amygdala; the medial septum and vertical limb of the diagonal band (Ch1/Ch2) supply the hippocampus and generate the theta rhythm. <b>(2) Brainstem:</b> pedunculopontine and laterodorsal tegmental nuclei (Ch5/Ch6) project to thalamus and VTA and are the REM-on cells. <b>(3) Striatal tonically active interneurons:</b> only 1&ndash;2% of striatal neurons but with vast local arbors, and the other half of the classic dopamine&ndash;acetylcholine balance.",
   phys:[
    {h:"Synthesis is uptake-limited",t:"The rate-limiting step is not the enzyme but <b>choline uptake</b> by the high-affinity, sodium-dependent transporter ChT1 (SLC5A7). Choline + acetyl-CoA &rarr; acetylcholine by choline acetyltransferase; VAChT packages it."},
    {h:"The fastest enzyme in the body",t:"Acetylcholinesterase hydrolyses acetylcholine at close to the diffusion limit &mdash; transmission at the neuromuscular junction is over in about a millisecond. Choline is recycled. As AChE activity falls in advanced Alzheimer disease, butyrylcholinesterase takes over a larger share, which is the rationale offered for rivastigmine's dual inhibition."},
    {h:"Cortical activation",t:"Basal forebrain cholinergic firing accompanies cortical desynchronisation &mdash; the shift from slow waves to the low-voltage fast activity of alert wakefulness. Lesioning the nucleus basalis produces cortical slowing, and diffuse slowing with loss of the posterior dominant rhythm is exactly the EEG of delirium."},
    {h:"The striatal pause",t:"Tonically active interneurons fire steadily at 3&ndash;10 Hz and <b>pause</b> in response to reward-predicting cues, in coordination with the dopamine burst. Falling dopamine (Parkinson disease, or D<sub>2</sub> blockade) removes M<sub>4</sub>-mediated inhibition of these interneurons, acetylcholine rises, and the imbalance produces parkinsonism and dystonia &mdash; the reason benztropine and trihexyphenidyl relieve acute drug-induced EPS."}],
   rt:[
    {n:"Nicotinic &alpha;<sub>4</sub>&beta;<sub>2</sub>",c:"Ligand-gated cation channel",d:"High-affinity, upregulates with chronic nicotine exposure. Varenicline is a partial agonist; the upregulation-and-desensitisation cycle is the pharmacology of craving between cigarettes."},
    {n:"Nicotinic &alpha;<sub>7</sub>",c:"Ligand-gated, high Ca<sup>2+</sup> permeability",d:"Fast-desensitising; implicated in sensory gating (the P50 deficit in schizophrenia maps to CHRNA7 at 15q14) and in the vagal cholinergic anti-inflammatory reflex."},
    {n:"M<sub>1</sub>",c:"GPCR &middot; G<sub>q</sub>",d:"Cortical and hippocampal; cognition. Xanomeline is an M<sub>1</sub>/M<sub>4</sub> agonist &mdash; combined with peripherally restricted trospium it became the first antipsychotic with no direct dopamine receptor action."},
    {n:"M<sub>2</sub>",c:"GPCR &middot; G<sub>i/o</sub>",d:"Autoreceptor and cardiac: blockade causes tachycardia (the tachycardia of anticholinergic toxicity and of clozapine)."},
    {n:"M<sub>3</sub>",c:"GPCR &middot; G<sub>q</sub>",d:"Smooth muscle, salivary and sweat glands, bladder, ciliary muscle. All the peripheral anticholinergic side effects live here &mdash; dry mouth, constipation, urinary retention, blurred vision, impaired sweating."},
    {n:"M<sub>4</sub>",c:"GPCR &middot; G<sub>i/o</sub>",d:"Striatal cholinergic interneurons and D<sub>1</sub> MSNs; the receptor through which xanomeline and emraclidine dampen striatal dopamine release presynaptically rather than blocking D<sub>2</sub>."},
    {n:"ChT1, ChAT, VAChT, AChE, BuChE",c:"Transporters / enzymes",d:"AChE inhibitors: donepezil (long half-life, once daily), rivastigmine (also BuChE; patch reduces GI effects), galantamine (also an allosteric nicotinic modulator)."}],
   dz:[
    {n:"Alzheimer disease",d:"Nucleus basalis degeneration is among the earliest changes and gave rise to the cholinergic hypothesis. AChE inhibitors produce modest, real, symptomatic benefit &mdash; roughly a six-to-twelve month delay in decline &mdash; and no disease modification. Be honest with families about that distinction."},
    {n:"Delirium",d:"The reduced-acetylcholine, excess-dopamine model is the most widely used framework. Practically: every anticholinergic in the list &mdash; diphenhydramine, hydroxyzine, oxybutynin, TCAs, paroxetine, olanzapine, quetiapine, benztropine, cyclobenzaprine, promethazine &mdash; adds burden, and the burden is cumulative and dose-dependent."},
    {n:"Dementia with Lewy bodies",d:"Cholinergic loss is <i>greater</i> than in Alzheimer disease, which is why rivastigmine can produce a striking response, and why antipsychotic sensitivity is severe &mdash; up to half of DLB patients have a serious reaction to a typical antipsychotic. Quetiapine or pimavanserin, at low dose, if anything at all."},
    {n:"Myasthenia gravis",d:"Antibodies to the postsynaptic muscle nicotinic receptor (or MuSK). Relevant to psychiatry because fatigable weakness is misdiagnosed as depression or conversion disorder, and because some psychotropics (lithium, some antibiotics, magnesium) worsen it."},
    {n:"Organophosphate and nerve agent poisoning",d:"Irreversible AChE inhibition: SLUDGE plus bronchorrhoea, bradycardia, fasciculations, and seizures. Atropine treats the muscarinic effects, pralidoxime reactivates the enzyme before ageing, and benzodiazepines must be given early and generously."},
    {n:"Tobacco use disorder",d:"Smoking prevalence in schizophrenia remains 60&ndash;80%. Varenicline is effective and, after the EAGLES trial, no longer carries a neuropsychiatric black box &mdash; a correction worth teaching, since many clinicians still avoid it in psychiatric patients on the basis of a withdrawn warning."}],
   pert:[
    {k:"pH",t:"Acetylcholinesterase has an alkaline pH optimum; acidosis slows hydrolysis and prolongs acetylcholine action at the synapse. In organophosphate poisoning, the accompanying respiratory acidosis therefore compounds the cholinergic crisis."},
    {k:"Fever &amp; temperature",t:"The anticholinergic toxidrome causes hyperthermia by <b>abolishing sweating</b> &mdash; 'hot as a hare, dry as a bone, red as a beet, blind as a bat, mad as a hatter'. The dry skin is the discriminating sign: serotonin syndrome and NMS are both diaphoretic. Physostigmine reverses central antimuscarinic delirium but is contraindicated with TCA overdose because of asystole risk."},
    {k:"Seizures",t:"Organophosphate seizures begin as muscarinic events (atropine-responsive) but transition within roughly 20&ndash;30 minutes to a self-sustaining glutamatergic state with internalisation of synaptic GABA<sub>A</sub> receptors &mdash; which is why benzodiazepines lose efficacy the longer status epilepticus runs. Early, adequately dosed benzodiazepine is the single highest-yield intervention in status of any cause."},
    {k:"Electrolytes",t:"Hypomagnesaemia increases acetylcholine release at the neuromuscular junction; hypermagnesaemia blocks presynaptic calcium channels and causes weakness and areflexia &mdash; the reason magnesium infusions in eclampsia are monitored by deep tendon reflexes. Because ChT1 is sodium-driven, hyponatraemia reduces choline uptake and acetylcholine synthesis, a plausible contributor to the confusion of hyponatraemia at levels that seem too mild to explain it."}],
   pearls:["Rate-limiting step is choline uptake (ChT1), not the enzyme.",
    "Dementia with Lewy bodies: greater cholinergic loss than Alzheimer, severe antipsychotic sensitivity.",
    "Dry skin distinguishes anticholinergic hyperthermia from serotonin syndrome and NMS.",
    "Xanomeline&ndash;trospium: M<sub>1</sub>/M<sub>4</sub> agonism with peripheral blockade &mdash; antipsychotic efficacy without D<sub>2</sub> occupancy."],
   chapters:[["alzheimers-disease","Alzheimer Disease"],["delirium","Delirium"],["antipsychotic-review","Antipsychotic Review"],["smoking-cessation","Smoking Cessation"]]},

  {id:"ha",cat:"Neuromodulatory projection neurons",name:"Histaminergic neuron",sub:"Tuberomammillary nucleus, posterior hypothalamus",color:"#b5892f",fig:FIG.ha,model:"receptor",
   why:"Sedation and weight gain are the two side effects that most often end a medication trial, and both run through this cell. It is also the final common effector of nearly every hypnotic we prescribe.",
   loc:"The <b>tuberomammillary nucleus</b> in the posterior hypothalamus is the sole source of neuronal histamine in the brain &mdash; roughly 64,000 neurons in humans. Projections are diffuse and reach the entire cortex, thalamus, basal forebrain, and brainstem. Its immediate neighbours, the mammillary bodies, are the structures destroyed in Wernicke encephalopathy.",
   phys:[
    {h:"No reuptake transporter",t:"Uniquely among the monoamines, brain histamine has <b>no plasma-membrane reuptake transporter</b>. It is inactivated by uptake into astrocytes and methylation by histamine N-methyltransferase to tele-methylhistamine, then MAO-B. Histidine &rarr; histamine by histidine decarboxylase, a pyridoxal-phosphate enzyme; VMAT2 packages it."},
    {h:"Wake-on, REM-off",t:"TMN neurons fire during waking, slow in NREM, and stop entirely in REM. They are the most strictly wake-selective of the aminergic groups &mdash; which is why H<sub>1</sub> antagonism produces such reliable sedation."},
    {h:"The sleep switch",t:"The GABAergic and galaninergic <b>ventrolateral preoptic nucleus</b> inhibits TMN, LC, and raphe; those nuclei inhibit VLPO in return. This mutually inhibitory flip-flop produces rapid, complete state transitions and, when it is destabilised (as in orexin loss), produces the state intrusions of narcolepsy. Benzodiazepines, Z-drugs, and propofol enhance GABA<sub>A</sub> signalling in this circuit; sedation is largely histaminergic silencing."}],
   rt:[
    {n:"H<sub>1</sub>",c:"GPCR &middot; G<sub>q</sub>",d:"Wakefulness and appetite suppression. Blockade &rarr; sedation plus, with 5-HT<sub>2C</sub> blockade, substantial weight gain. Highest H<sub>1</sub> affinity: doxepin, mirtazapine, quetiapine, olanzapine, chlorpromazine, hydroxyzine, diphenhydramine."},
    {n:"H<sub>2</sub>",c:"GPCR &middot; G<sub>s</sub>",d:"Gastric parietal cells. Cimetidine is a broad CYP inhibitor (1A2, 2C19, 2D6, 3A4) and raises clozapine and TCA levels &mdash; famotidine is the safer choice in a patient on psychotropics."},
    {n:"H<sub>3</sub>",c:"GPCR &middot; G<sub>i/o</sub>",d:"Presynaptic auto- and heteroreceptor. Pitolisant, an inverse agonist, increases histamine release and treats narcolepsy without being a controlled substance."},
    {n:"H<sub>4</sub>",c:"GPCR &middot; G<sub>i/o</sub>",d:"Predominantly immune cells; a target in inflammatory disease rather than psychiatry."},
    {n:"HDC, HNMT, MAO-B",c:"Enzymes",d:"HNMT polymorphisms alter brain histamine clearance; HDC requires vitamin B<sub>6</sub>."}],
   dz:[
    {n:"Sedation and metabolic side effects",d:"H<sub>1</sub> affinity predicts sedation almost linearly across antipsychotics and antidepressants. Weight gain is better predicted by combined H<sub>1</sub> + 5-HT<sub>2C</sub> antagonism, with olanzapine and clozapine at the top of the ranking and aripiprazole, lurasidone, and ziprasidone at the bottom."},
    {n:"Antihistamine delirium in older adults",d:"Diphenhydramine and hydroxyzine are potent antimuscarinics as well as H<sub>1</sub> blockers; they appear on the Beers list for exactly this reason. 'Just Benadryl for sleep' is one of the most common avoidable causes of delirium on a medical ward."},
    {n:"Narcolepsy",d:"The histamine system is downstream of orexin loss rather than primarily affected, which is why H<sub>3</sub> inverse agonism (pitolisant) restores wakefulness by amplifying a system that is intact but under-driven."},
    {n:"Wernicke encephalopathy",d:"Not a histaminergic disease, but the mammillary bodies sit immediately adjacent and the anatomy is worth fixing in memory: confusion, ophthalmoplegia, and ataxia; give thiamine <i>before</i> glucose; and treat any malnourished, alcohol-dependent, hyperemetic, or post-bariatric patient empirically."}],
   pert:[
    {k:"pH",t:"Histamine release from mast cells increases with acidosis; central histaminergic tone is less directly pH-sensitive, but the H<sub>1</sub>-blocked patient loses an important arousal drive during metabolic derangement, which is one reason sedating psychotropics deepen the confusion of any medical illness."},
    {k:"Fever &amp; temperature",t:"Histamine acts in the preoptic area as a mediator of the febrile response and of thermoregulatory heat loss. H<sub>1</sub> blockade blunts sweating and vasodilation and therefore <b>raises heat-stroke risk</b> &mdash; a real hazard for patients on olanzapine or quetiapine during a heat wave, alongside the anticholinergic and &alpha;<sub>1</sub> contributions. Counsel about this every summer."},
    {k:"Seizures",t:"Central histamine is <b>anticonvulsant</b>: H<sub>1</sub> antagonists lower seizure threshold (most clearly in young children and in overdose), and H<sub>3</sub> antagonists, which raise histamine release, are anticonvulsant in models. Diphenhydramine overdose seizures are a classic emergency-department presentation."},
    {k:"Electrolytes and cofactors",t:"Histidine decarboxylase requires pyridoxal-5&prime;-phosphate, as does glutamic acid decarboxylase. Isoniazid, hydralazine, and pyridoxine deficiency deplete PLP &mdash; and while histamine synthesis suffers, the clinically decisive failure is GABA synthesis, producing refractory seizures that respond only to intravenous pyridoxine, gram for gram of isoniazid ingested."}],
   pearls:["H<sub>1</sub> affinity predicts sedation; H<sub>1</sub> + 5-HT<sub>2C</sub> predicts weight gain.",
    "There is no histamine reuptake transporter &mdash; clearance is methylation by HNMT.",
    "H<sub>1</sub> blockade impairs heat dissipation: warn patients on sedating antipsychotics before summer.",
    "Famotidine, not cimetidine, in anyone on clozapine or a TCA."],
   chapters:[["antipsychotic-weight-management","Antipsychotic Weight Management"],["sleep-medications-review","Sleep Medications Review"],["insomnia","Insomnia"],["geriatric-psychiatry","Geriatric Psychiatry"]]},

  {id:"orx",cat:"Neuromodulatory projection neurons",name:"Orexin / hypocretin neuron",sub:"Lateral hypothalamus &amp; perifornical area",color:"#7a6cae",fig:FIG.orx,model:"morph",
   why:"Fewer than 80,000 cells stabilise the entire sleep&ndash;wake switch. Lose them and you get narcolepsy; block them pharmacologically and you get a hypnotic that does not act on GABA at all. They are also a genuine meeting point between the panic literature and respiratory physiology.",
   loc:"Scattered through the <b>lateral hypothalamus and perifornical area</b>, roughly 50,000&ndash;80,000 neurons in humans. Projections are brain-wide but densest onto the arousal nuclei they stabilise: locus coeruleus, tuberomammillary nucleus, raphe, basal forebrain, and VTA. They co-release glutamate and dynorphin.",
   phys:[
    {h:"Stabiliser, not switch",t:"Orexin neurons fire during active, motivated wakefulness and are silent in sleep. They do not themselves flip the sleep&ndash;wake switch; they hold it in position. Without them the switch becomes unstable and state boundaries dissolve &mdash; producing sleep intruding into wake (sleep attacks) and REM phenomena intruding into wake (cataplexy, sleep paralysis, hypnagogic hallucinations)."},
    {h:"Metabolic and interoceptive sensor",t:"These neurons are inhibited by glucose and excited by ghrelin and by fasting &mdash; a mechanism that keeps a hungry animal awake and searching. They are also directly excited by <b>CO<sub>2</sub> and acidosis</b>, contributing to the arousal response to hypercapnia."},
    {h:"Two peptides, two receptors",t:"Prepro-orexin is cleaved to orexin-A (33 amino acids, two disulfide bonds, stable and BBB-permeant &mdash; hence measurable in CSF) and orexin-B. OX<sub>1</sub>R prefers orexin-A and is dense in the locus coeruleus; OX<sub>2</sub>R binds both equally and dominates in the TMN, making it the receptor most tightly tied to wakefulness."}],
   rt:[
    {n:"OX<sub>1</sub>R",c:"GPCR &middot; G<sub>q</sub>",d:"Locus coeruleus, VTA. More associated with reward, stress, and panic responses than with sleep per se."},
    {n:"OX<sub>2</sub>R",c:"GPCR &middot; G<sub>q</sub>",d:"Tuberomammillary nucleus. The wakefulness receptor; seltorexant is 2R-selective, under study for insomnia in depression."},
    {n:"DORAs",c:"Dual antagonists",d:"Suvorexant, lemborexant, daridorexant. Not scheduled as high-risk hypnotics in the way benzodiazepines are, no GABAergic amnesia or respiratory depression profile, but they can produce sleep paralysis and cataplexy-like events &mdash; because they pharmacologically reproduce narcolepsy."},
    {n:"Dynorphin, glutamate",c:"Co-transmitters",d:"Co-released; the dynorphin component is one reason orexin manipulation affects mood and stress reactivity, not just arousal."}],
   dz:[
    {n:"Narcolepsy type 1",d:"Loss of &gt;90% of orexin neurons, almost certainly autoimmune: near-complete association with HLA-DQB1*06:02, a T-cell receptor locus association, and a well-documented incidence spike after the 2009 H1N1 pandemic and the Pandemrix vaccine. <b>CSF orexin-A below 110 pg/mL is diagnostic</b> and is more reliable than the MSLT in a patient already on psychotropics. Cataplexy &mdash; sudden bilateral loss of tone triggered by laughter or surprise &mdash; is pathognomonic and is frequently misdiagnosed as syncope, seizure, or a functional disorder for years."},
    {n:"Insomnia",d:"DORAs reduce sleep latency and wake after sleep onset without the tolerance, rebound, falls, and cognitive burden of benzodiazepine receptor agonists. They are a reasonable choice in older adults where Z-drugs are hazardous."},
    {n:"Panic disorder",d:"Orexin neurons are chemosensitive and drive the arousal response to CO<sub>2</sub>. Orexin antagonism blunts CO<sub>2</sub>-induced panic-like behaviour in animals, and elevated CSF orexin has been reported in panic disorder. This is the most concrete cellular bridge yet between Klein's false-suffocation-alarm hypothesis and a druggable target."},
    {n:"Substance use and relapse",d:"OX<sub>1</sub>R signalling in the VTA supports cue-induced reinstatement across drug classes; orexin antagonists are in trials for opioid and alcohol use disorder."}],
   pert:[
    {k:"pH and CO<sub>2</sub>",t:"This is the cell type where acid&ndash;base status is not a footnote but the core physiology. Orexin neurons are directly excited by extracellular acidification and hypercapnia and contribute to arousal from sleep during obstructive apnoea. Chronic CO<sub>2</sub> retention, hyperventilation, lactate infusion, and 35% CO<sub>2</sub> challenge all engage this system &mdash; and all reliably provoke panic in susceptible individuals."},
    {k:"Fever &amp; inflammation",t:"IL-1&beta; and prostaglandin E<sub>2</sub> suppress orexin neuron activity. This is a principal mechanism of the hypersomnia and withdrawal of sickness behaviour, and it is why an acutely febrile patient looks depressed."},
    {k:"Seizures",t:"Orexin has modest proconvulsant effects in models and orexin antagonism is anticonvulsant, but the clinically relevant point is different: cataplexy is routinely mistaken for atonic seizure. Preserved consciousness during the attack and an emotional trigger distinguish it."},
    {k:"Metabolic state",t:"Hypoglycaemia excites orexin neurons and produces the anxious, wakeful, sympathetically driven state that patients describe. Leptin inhibits them. The overlap of narcolepsy with obesity and with a raised body mass index despite reduced caloric intake reflects the loss of this metabolic&ndash;arousal coupling."}],
   pearls:["CSF orexin-A &lt;110 pg/mL diagnoses narcolepsy type 1 &mdash; and is unaffected by psychotropics that invalidate the MSLT.",
    "Cataplexy is triggered by laughter and preserves consciousness; that is how you separate it from seizure and syncope.",
    "DORAs can cause sleep paralysis and cataplexy-like events because they reproduce a narcoleptic state pharmacologically.",
    "Orexin neurons are CO<sub>2</sub>-sensitive &mdash; the cellular link to the suffocation-alarm model of panic."],
   chapters:[["orexin-sleep-wake-system","Orexin &amp; the Sleep-Wake System"],["insomnia","Insomnia"],["panic-attacks-gad","Panic Attacks &amp; GAD"],["sleep-medications-review","Sleep Medications Review"]]},

  /* ============ GLUTAMATE & GABA — THE E/I BACKBONE ============ */
  {id:"pyr",cat:"Glutamate &amp; GABA — the E/I backbone",name:"Cortical pyramidal neuron",sub:"Layers II/III, V, VI &middot; hippocampal CA1/CA3",color:"#3b4fa0",fig:FIG.pyr,model:"synapse",
   why:"This is the cell that computes and the cell that projects &mdash; roughly 80% of cortical neurons. Its dendritic spines are the physical substrate that is lost in schizophrenia and in chronic stress, and rapidly restored by ketamine and psilocybin. If you want one cell to explain the last fifteen years of psychiatric neuroscience, this is it.",
   loc:"Layer II/III pyramidal cells project corticocortically and carry association and interhemispheric traffic. Layer V thick-tufted cells project subcortically to striatum, thalamus, brainstem, and cord. Layer VI cells project back to thalamus, closing the corticothalamic loop. In hippocampus, CA3 pyramidal cells are recurrently connected (pattern completion) and CA1 cells are the principal output. Each cortical pyramidal neuron carries 10,000&ndash;30,000 dendritic spines.",
   phys:[
    {h:"Two dendritic compartments",t:"A single apical dendrite ascends to layer I, where it receives long-range and neuromodulatory input onto a tuft; basal dendrites near the soma receive local and thalamic input. The apical tuft can generate its own calcium spike, and coincidence between basal (feedforward) and apical (feedback) input produces burst firing. This is a plausible cellular implementation of predictive coding &mdash; and NMDA hypofunction and psychedelic 5-HT<sub>2A</sub> agonism both act preferentially on the apical compartment."},
    {h:"Glutamate release and clearance",t:"VGLUT1/2 load vesicles using the proton gradient. Released glutamate is cleared within milliseconds, ~90% of it by astrocytic EAAT2. Extracellular glutamate is held near 1&ndash;3 &micro;M; failure of clearance is excitotoxic within minutes."},
    {h:"NMDA as coincidence detector",t:"At rest the NMDA channel is plugged by Mg<sup>2+</sup>. It opens only when glutamate binds <b>and</b> the membrane is already depolarised enough to expel the magnesium <b>and</b> a co-agonist (glycine or D-serine, supplied largely by astrocytes) occupies its site. Three conditions must coincide &mdash; which is precisely what a Hebbian learning rule requires. The resulting calcium influx triggers CaMKII, AMPA receptor insertion, and long-term potentiation."},
    {h:"Spines are dynamic",t:"Spine turnover continues throughout life. Chronic stress and elevated glucocorticoids retract apical spines in medial prefrontal cortex and hippocampus while <i>expanding</i> them in the basolateral amygdala &mdash; a structural correlate of the clinical picture of impaired regulation with intact or heightened threat response. A single ketamine dose restores mPFC spine density within 24 hours through BDNF&ndash;TrkB&ndash;mTORC1 signalling, and blocking that cascade abolishes the behavioural effect."}],
   rt:[
    {n:"AMPA (GluA1&ndash;4)",c:"Ionotropic",d:"Fast excitation. GluA2 Q/R editing renders the channel calcium-impermeable; unedited or GluA2-lacking receptors are calcium-permeable and appear during plasticity and injury. AMPA potentiation is the proposed final common path of ketamine's antidepressant action &mdash; NBQX blocks it."},
    {n:"NMDA (GluN1 + GluN2A/2B)",c:"Ionotropic, Ca<sup>2+</sup>-permeable",d:"Open-channel blockers: ketamine, memantine, dextromethorphan, phencyclidine, nitrous oxide. GluN2B-selective agents (rislenemdaz) target the extrasynaptic pool. Requires glycine/D-serine co-agonist &mdash; the rationale for sarcosine and D-serine trials in schizophrenia."},
    {n:"mGluR1/5",c:"GPCR &middot; G<sub>q</sub>",d:"Postsynaptic; mGluR5 negative modulators were trialled in fragile X. mGluR5&ndash;NMDA coupling through Homer is a schizophrenia risk pathway."},
    {n:"mGluR2/3",c:"GPCR &middot; G<sub>i/o</sub>",d:"Presynaptic autoreceptor limiting glutamate release. Pomaglumetad failed in phase III, but the node remains live &mdash; and psychedelic 5-HT<sub>2A</sub> effects are gated by mGluR2 heteromers."},
    {n:"VGLUT1/2, EAAT1&ndash;5",c:"Transporters",d:"EAAT2 (astrocytic) does the bulk of clearance; riluzole and ceftriaxone upregulate it."},
    {n:"HCN1, Ca<sub>v</sub>, Na<sub>v</sub>1.2/1.6",c:"Ion channels",d:"HCN1 in the apical dendrite is the channel &alpha;<sub>2A</sub> agonists close; Na<sub>v</sub>1.2 is a high-confidence autism and epilepsy gene."}],
   dz:[
    {n:"Schizophrenia",d:"Reduced dendritic spine density in layer III of dorsolateral prefrontal cortex is one of the most consistent postmortem findings, with normal neuron number &mdash; the deficit is synaptic, not a loss of cells. The C4A complement risk locus provides a mechanism (excessive microglial pruning during adolescence) that matches the age of onset. The NMDA hypofunction model comes from ketamine and PCP reproducing positive, negative, and cognitive symptoms in healthy volunteers, which no dopaminergic drug does."},
    {n:"Depression",d:"Stress-induced spine loss in mPFC and hippocampus, reduced synaptic gene expression in postmortem tissue, and rapid restoration by ketamine, esketamine, and psilocybin. The 'synaptic plasticity' framing has largely replaced monoamine deficiency as the working model of what an antidepressant ultimately does."},
    {n:"Anti-NMDA receptor encephalitis",d:"IgG antibodies against GluN1 cause receptor internalisation. Presents in a young woman (often with ovarian teratoma) as a prodrome, then psychosis, catatonia, dyskinesias &mdash; especially orofacial &mdash; seizures, autonomic instability, and hypoventilation. <b>Any first-episode psychosis with seizures, catatonia, movement disorder, autonomic instability, or a poor response to antipsychotics warrants CSF antibody testing</b>; serum alone misses cases. Immunotherapy and tumour removal, not antipsychotics, are the treatment."},
    {n:"Excitotoxicity",d:"In ischaemia or status epilepticus, ATP failure collapses ion gradients, EAAT2 reverses and releases glutamate, NMDA receptors flood the cell with calcium, and calpain and mitochondrial permeability transition follow. CA1 pyramidal cells are the most vulnerable neurons in the brain to this sequence."},
    {n:"Alzheimer disease",d:"Entorhinal layer II and CA1 pyramidal cells are lost earliest. Memantine's low-affinity, fast-off open-channel block preferentially dampens the extrasynaptic tonic NMDA current while sparing phasic synaptic transmission &mdash; the pharmacological reason it is tolerated when higher-affinity blockers are not."}],
   pert:[
    {k:"pH",t:"NMDA receptors are <b>tonically inhibited by protons at physiological pH</b> &mdash; the proton IC<sub>50</sub> sits near pH 7.3, so roughly half the receptor population is already suppressed at rest. Acidosis suppresses them further (an endogenous brake during ischaemia); <b>alkalosis relieves the block and is proconvulsant</b>. This is the mechanism behind hyperventilation activating absence seizures on EEG, and it is why a panicking, hyperventilating patient can look neurologically alarming."},
    {k:"Fever &amp; temperature",t:"Channel gating kinetics accelerate roughly two- to three-fold per 10&nbsp;&deg;C, and metabolic demand rises with them. Every 1&nbsp;&deg;C above normal increases cerebral metabolic rate by about 6&ndash;7%, which is why fever is poorly tolerated in an already-compromised brain and why therapeutic hypothermia is protective after cardiac arrest."},
    {k:"Seizures",t:"Pyramidal cells are the generators of the seizure and the victims of it. Sodium channel blockers (phenytoin, carbamazepine, lamotrigine, lacosamide) act by use-dependent stabilisation of the inactivated state of Na<sub>v</sub> &mdash; they preferentially suppress high-frequency firing, which is why they work on seizures without abolishing normal transmission."},
    {k:"Electrolytes",t:"<b>Hypomagnesaemia</b> removes the Mg<sup>2+</sup> plug from the NMDA channel and is a direct, mechanistic cause of seizure &mdash; and the reason magnesium is the anticonvulsant of choice in eclampsia. <b>Hypocalcaemia</b> reduces surface-charge screening on the membrane, increasing sodium channel open probability, producing tetany, Chvostek and Trousseau signs, and seizures. <b>Hyponatraemia</b> causes seizures largely through osmotic cell swelling rather than a transmitter mechanism; the rate of fall matters far more than the absolute number. <b>Hyperglycaemia</b> in a non-ketotic hyperosmolar state characteristically produces focal seizures that are resistant to anticonvulsants until glucose is corrected."}],
   pearls:["The spine, not the cell, is what is lost in schizophrenia and in chronic stress.",
    "NMDA needs glutamate + depolarisation + co-agonist &mdash; a built-in Hebbian coincidence detector.",
    "Alkalosis relieves the proton block on NMDA: that is why hyperventilation provokes absence seizures.",
    "First-episode psychosis with catatonia, dyskinesia, seizures, or autonomic instability: send CSF NMDAR antibodies."],
   chapters:[["neuroscience-foundations","Neuroscience Foundations"],["ketamine-esketamine","Ketamine &amp; Esketamine"],["schizophrenia","Schizophrenia"],["major-depressive-disorder","Major Depressive Disorder"]]},

  {id:"pv",cat:"Glutamate &amp; GABA — the E/I backbone",name:"Parvalbumin fast-spiking interneuron",sub:"Basket &amp; chandelier (axo-axonic) cells",color:"#0d9488",fig:FIG.pv,model:"morph",
   why:"The single most metabolically extreme neuron in the cortex, and the cell at the centre of both the NMDA-hypofunction model of schizophrenia and the physiology of gamma oscillations. Its selective vulnerability is the reason so many different insults converge on the same cognitive phenotype.",
   loc:"Cortex and hippocampus; roughly 40% of GABAergic interneurons, which are themselves about 20% of cortical neurons. <b>Basket cells</b> wrap the soma and proximal dendrites of pyramidal neurons. <b>Chandelier (axo-axonic) cells</b> synapse exclusively on the axon initial segment &mdash; the site of action potential initiation &mdash; giving them uniquely decisive control over output. Chandelier cartridges are visibly reduced in schizophrenia postmortem tissue.",
   phys:[
    {h:"Fast-spiking machinery",t:"Sustained firing to 200 Hz without adaptation, made possible by <b>Kv3.1/3.2</b> potassium channels with unusually fast activation and deactivation, which shorten the action potential and the refractory period. The metabolic cost is extraordinary: PV cells have the highest mitochondrial density and cytochrome oxidase content of any cortical neuron."},
    {h:"Gamma generation",t:"Reciprocal connections between PV cells and pyramidal neurons generate 30&ndash;80 Hz gamma by the PING mechanism &mdash; pyramidal firing recruits inhibition, inhibition silences the population, and the population is released synchronously. Gamma synchrony is the physiological substrate of working memory and perceptual binding, and gamma deficits are among the most replicated electrophysiological findings in schizophrenia (reduced 40 Hz auditory steady-state response)."},
    {h:"Perineuronal nets",t:"A lattice of aggrecan, brevican, and chondroitin sulfate proteoglycans encases mature PV cells, stabilising their synapses, buffering them against oxidative stress, and closing developmental critical periods. Degrading these nets in adult animals reopens juvenile plasticity &mdash; a fact with obvious implications for how we think about the timing of psychiatric intervention. Nets are reduced in schizophrenia."},
    {h:"Preferential NMDA dependence",t:"PV cells depend on NMDA receptor input to maintain their tonic drive. Subanaesthetic ketamine blocks NMDA receptors on these interneurons preferentially, <b>disinhibiting</b> pyramidal cells and producing a cortical glutamate surge &mdash; measurable by MRS. The same event is invoked to explain both ketamine's psychotomimetic effects and its antidepressant action; whether these are the same phenomenon at different doses remains genuinely unsettled."}],
   rt:[
    {n:"GABA<sub>A</sub> &alpha;<sub>1</sub>",c:"Ionotropic Cl<sup>&minus;</sup>",d:"Predominant at somatic synapses. Mediates benzodiazepine <b>sedation, amnesia, and ataxia</b>; zolpidem is &alpha;<sub>1</sub>-selective, which is exactly why it sedates without much anxiolysis."},
    {n:"GABA<sub>A</sub> &alpha;<sub>2</sub>/&alpha;<sub>3</sub>",c:"Ionotropic Cl<sup>&minus;</sup>",d:"Mediate <b>anxiolysis and muscle relaxation</b>. The long-sought &alpha;<sub>2</sub>/&alpha;<sub>3</sub>-selective anxiolytic without sedation has repeatedly failed in development, but the pharmacology is sound."},
    {n:"GABA<sub>A</sub> &alpha;<sub>5</sub>",c:"Extrasynaptic",d:"Hippocampal, mediates tonic inhibition and constrains memory. &alpha;<sub>5</sub> negative modulators are pro-cognitive; &alpha;<sub>5</sub> positive modulators are being pursued for depression."},
    {n:"GABA<sub>A</sub> &delta;-subunit",c:"Extrasynaptic",d:"Neurosteroid-sensitive, benzodiazepine-<i>insensitive</i>. This is the receptor allopregnanolone acts on &mdash; and the target of brexanolone and zuranolone in postpartum depression. It is also where ethanol has some of its low-dose effects."},
    {n:"GABA<sub>B</sub>",c:"GPCR &middot; G<sub>i/o</sub>",d:"Slow inhibition via GIRK and presynaptic Ca<sup>2+</sup> channel inhibition. Baclofen; and &gamma;-hydroxybutyrate acts here, producing the characteristic abrupt-onset, abrupt-offset coma."},
    {n:"GAT-1 (SLC6A1)",c:"Transporter",d:"Reuptake; tiagabine blocks it. SLC6A1 mutations cause myoclonic-atonic epilepsy with intellectual disability."},
    {n:"GAD67 / GAD65",c:"Enzymes (need PLP)",d:"GAD67 makes the constitutive cytosolic pool; its mRNA reduction in cortex is among the most reproducible molecular findings in schizophrenia. GAD65 supplies activity-dependent vesicular GABA and is the antigen in stiff person syndrome."},
    {n:"Kv3.1/3.2, Na<sub>v</sub>1.1",c:"Ion channels",d:"Na<sub>v</sub>1.1 is expressed preferentially in interneurons &mdash; a fact with dramatic clinical consequences (see Dravet, below)."}],
   dz:[
    {n:"Schizophrenia",d:"Reduced GAD67 and parvalbumin mRNA, reduced chandelier cartridges, reduced perineuronal nets, and reduced gamma synchrony, all converging on impaired inhibitory control of pyramidal output. Oxidative stress is a plausible common cause given these cells' metabolic load &mdash; the basis for N-acetylcysteine trials."},
    {n:"Dravet syndrome and SCN1A epilepsies",d:"A textbook lesson in why cell type matters. SCN1A <i>loss-of-function</i> mutations reduce Na<sub>v</sub>1.1 current &mdash; and because Na<sub>v</sub>1.1 is concentrated in interneurons, the net effect is <b>failure of inhibition</b> and severe epilepsy. It also means <b>sodium channel blockers (phenytoin, carbamazepine, lamotrigine) make Dravet worse</b>, which is a genuine and avoidable iatrogenic harm."},
    {n:"Autism spectrum disorder",d:"The excitation/inhibition imbalance hypothesis rests substantially on PV interneuron findings; reduced PV cell counts appear in several genetic models and in some postmortem samples."},
    {n:"Stiff person syndrome",d:"High-titre anti-GAD65 antibodies; axial rigidity, painful spasms, and a striking comorbidity with anxiety and task-specific phobia &mdash; patients are often misdiagnosed with a primary anxiety disorder for years before the diagnosis is made."},
    {n:"Benzodiazepine tolerance and withdrawal",d:"Chronic GABA<sub>A</sub> potentiation produces receptor subunit reconfiguration and reduced sensitivity. Withdrawal is a state of unopposed excitation: tremor, seizure, delirium, and a genuine mortality risk &mdash; and it is why alcohol and benzodiazepine withdrawal, not opioid withdrawal, are the dangerous ones."}],
   pert:[
    {k:"pH",t:"GABA<sub>A</sub> is a chloride channel, so its effect depends on the chloride gradient set by KCC2 and NKCC1 &mdash; and bicarbonate also permeates the channel. Intense GABA<sub>A</sub> activation causes bicarbonate efflux and local extracellular acidification, and in immature neurons (where NKCC1 dominates and internal chloride is high) GABA is <b>depolarising</b>. That developmental switch is why benzodiazepines can be less effective, and occasionally paradoxical, in neonatal seizures, and it is the rationale behind bumetanide trials."},
    {k:"Fever &amp; temperature",t:"Na<sub>v</sub>1.1 function is temperature-sensitive, and in SCN1A-mutant interneurons a modest rise in temperature tips inhibition into failure. This is the accepted cellular explanation of <b>febrile seizures</b> in GEFS+ and Dravet, and one of the clearest examples in medicine of a systemic physiological variable acting on a specific channel in a specific cell type."},
    {k:"Seizures",t:"During prolonged status epilepticus, synaptic GABA<sub>A</sub> receptors are internalised within 20&ndash;30 minutes while NMDA receptors move <i>to</i> the membrane. This is the molecular reason benzodiazepines lose efficacy as status continues &mdash; and the argument for giving a full weight-based dose immediately rather than incrementally."},
    {k:"Electrolytes and cofactors",t:"Both GAD isoforms require pyridoxal-5&prime;-phosphate. <b>Isoniazid overdose</b> depletes PLP and causes seizures that are refractory to benzodiazepines and reversed by intravenous pyridoxine given gram-for-gram with the ingested isoniazid &mdash; an antidote worth knowing. Pyridoxine-dependent epilepsy (ALDH7A1) presents in neonates. Hypoglycaemia and hypoxia damage PV cells before other neurons because of their metabolic demand."}],
   pearls:["Kv3.1 makes fast spiking possible; the metabolic cost makes PV cells the first to fail under oxidative or metabolic stress.",
    "Na<sub>v</sub>1.1 lives in interneurons &mdash; so a sodium channel <i>loss</i> of function causes epilepsy, and sodium channel blockers worsen Dravet.",
    "&alpha;<sub>1</sub> = sedation; &alpha;<sub>2</sub>/&alpha;<sub>3</sub> = anxiolysis; &alpha;<sub>5</sub> = memory; &delta; = neurosteroid.",
    "Benzodiazepines fail in prolonged status because GABA<sub>A</sub> receptors are internalised. Give the full dose early."],
   chapters:[["schizophrenia","Schizophrenia"],["benzodiazepine-pharmacology","Benzodiazepine Pharmacology"],["neuroscience-foundations","Neuroscience Foundations"],["autism-spectrum-disorder","Autism Spectrum Disorder"]]},

  {id:"sst",cat:"Glutamate &amp; GABA — the E/I backbone",name:"SST &amp; VIP interneurons",sub:"Martinotti cells &middot; the disinhibitory motif",color:"#8b6914",fig:FIG.sst,model:"morph",
   why:"Reduced somatostatin expression is one of the most consistent molecular findings in postmortem depression across the prefrontal cortex, cingulate, and amygdala &mdash; and unlike most such findings it has generated a specific, testable drug strategy.",
   loc:"Cortex and hippocampus. <b>SST (Martinotti) cells</b> have ascending axons that arborise in layer I and inhibit the distal apical dendrites of pyramidal neurons &mdash; controlling the input a cell receives rather than the output it produces. <b>VIP cells</b> (many co-expressing calretinin) are concentrated in superficial layers and inhibit SST and PV cells rather than pyramidal cells. Together with PV cells these three populations account for nearly all cortical interneurons.",
   phys:[
    {h:"Dendritic versus somatic inhibition",t:"PV cells veto the output; SST cells shape the input. By targeting the apical tuft, SST cells suppress dendritic calcium spikes and therefore gate whether plasticity can be induced at all. They are low-threshold spiking with <b>facilitating</b> synapses &mdash; they are recruited by sustained pyramidal activity, acting as a delayed brake rather than a fast one."},
    {h:"The disinhibitory motif",t:"Acetylcholine and noradrenaline excite VIP cells during arousal, attention, reward, and punishment. VIP cells inhibit SST cells, SST cells stop inhibiting pyramidal dendrites, and a plasticity window opens in the apical tuft precisely when something salient has happened. This three-cell circuit is one of the cleanest accounts available of how a diffuse neuromodulator signal produces a specific, local learning event."},
    {h:"Somatostatin as a peptide",t:"Co-released with GABA, acting on SSTR1&ndash;5 with slow, prolonged inhibitory effects. Somatostatin also regulates neprilysin, an amyloid-degrading protease &mdash; connecting SST loss to amyloid accumulation in ageing."}],
   rt:[
    {n:"SSTR1&ndash;5",c:"GPCR &middot; G<sub>i/o</sub>",d:"Slow inhibition. SSTR2/4 agonism is anxiolytic and antidepressant in animal models."},
    {n:"GABA<sub>A</sub> &alpha;<sub>5</sub>",c:"Extrasynaptic Cl<sup>&minus;</sup>",d:"Mediates much of SST-driven dendritic tonic inhibition. <b>&alpha;<sub>5</sub>-positive allosteric modulators</b> (GL-II-73 and relatives) reverse chronic-stress deficits in models &mdash; a direct translation of the postmortem finding into a candidate drug. &alpha;<sub>5</sub>-negative modulators, conversely, are pro-cognitive candidates in Down syndrome and post-anaesthetic cognitive dysfunction."},
    {n:"5-HT<sub>3A</sub>",c:"Ionotropic",d:"VIP interneurons are the principal 5-HT<sub>3A</sub>-expressing cortical cells &mdash; giving serotonin a fast, direct route to cortical disinhibition, distinct from its slow GPCR actions."},
    {n:"nAChR &alpha;<sub>7</sub>, &alpha;<sub>4</sub>&beta;<sub>2</sub>",c:"Ionotropic",d:"The cholinergic input that drives the disinhibitory motif during attention."},
    {n:"CB<sub>1</sub>",c:"GPCR &middot; G<sub>i/o</sub>",d:"Densely expressed on CCK-positive interneurons (a fourth population); retrograde endocannabinoid signalling suppresses their GABA release &mdash; the cellular basis of much of cannabis's cognitive effect."}],
   dz:[
    {n:"Major depressive disorder",d:"Reduced SST mRNA in dorsolateral prefrontal cortex, subgenual ACC, and amygdala across independent postmortem cohorts, with a female preponderance, and reproduced by chronic stress in animals. The interpretation &mdash; that depression involves a deficit of dendritic inhibition and consequent inability to filter input &mdash; is one of the more mechanistically satisfying accounts of ruminative, over-inclusive cognition."},
    {n:"Schizophrenia",d:"SST reductions accompany the PV findings, indicating that the inhibitory deficit is not confined to one interneuron class."},
    {n:"Alzheimer disease",d:"Somatostatin is one of the earliest and most severely depleted neuropeptides in AD cortex. Because SST upregulates neprilysin, its loss reduces amyloid-&beta; clearance &mdash; a feed-forward loop linking interneuron pathology to plaque accumulation."},
    {n:"Cannabis and cognition",d:"CB<sub>1</sub> agonism on interneuron terminals suppresses GABA release and desynchronises hippocampal gamma and theta &mdash; the cellular account of acute cannabis-induced working memory and encoding failure, and of why adolescent exposure, during the period of interneuron maturation, carries disproportionate risk."}],
   pert:[
    {k:"pH",t:"Peptide co-transmission is unusually sensitive to the vesicular proton gradient because dense-core vesicles require a steeper gradient than small clear vesicles; conditions that acidify the cytosol preferentially reduce peptide release relative to fast transmitter release."},
    {k:"Fever &amp; temperature",t:"Interneuron populations differ in their temperature sensitivity, and the differential is one proposed explanation for why febrile illness produces disproportionate cognitive change in a vulnerable brain &mdash; the elderly patient with mild baseline cognitive impairment who becomes floridly delirious with a urinary tract infection."},
    {k:"Seizures",t:"Loss of dendritic inhibition permits runaway dendritic calcium spikes and burst firing. In temporal lobe epilepsy, hilar SST-positive interneurons are among the most vulnerable neurons and their loss ('dormant basket cell' and hilar interneuron loss hypotheses) is a proposed mechanism of epileptogenesis after status."},
    {k:"Glucocorticoids",t:"SST cells are exquisitely sensitive to chronic corticosterone exposure &mdash; the most likely proximate mediator of the postmortem findings in depression, and the mechanistic link between chronic stress and the cortical phenotype."}],
   pearls:["PV cells control output at the soma; SST cells control input at the dendrite; VIP cells control the SST cells.",
    "Reduced cortical somatostatin is among the most reproducible postmortem findings in depression.",
    "&alpha;<sub>5</sub>-PAMs are the drug strategy that came directly out of that finding.",
    "VIP cells carry 5-HT<sub>3A</sub> &mdash; a fast ionotropic route from serotonin to cortical disinhibition."],
   chapters:[["major-depressive-disorder","Major Depressive Disorder"],["cannabis-psychiatry","Cannabis &amp; Psychiatry"],["neuroscience-foundations","Neuroscience Foundations"],["alzheimers-disease","Alzheimer Disease"]]},

  {id:"msn",cat:"Glutamate &amp; GABA — the E/I backbone",name:"Medium spiny neuron",sub:"Striatal projection neuron &middot; D<sub>1</sub> direct / D<sub>2</sub> indirect",color:"#cf6b3a",fig:FIG.msn,model:"synapse",
   why:"Dopamine neurons get the attention, but the medium spiny neuron is where antipsychotics actually produce their clinical effects. Extrapyramidal symptoms, tardive dyskinesia, chorea in Huntington disease, and the reinforcement of addiction are all events in this cell.",
   loc:"About 95% of all neurons in the caudate, putamen, and nucleus accumbens. GABAergic <i>projection</i> neurons &mdash; unusual, since most GABAergic cells are local. Two intermingled but molecularly distinct populations: <b>D<sub>1</sub>-expressing direct pathway</b> cells (striatonigral, co-expressing substance P and dynorphin) project straight to GPi/SNr; <b>D<sub>2</sub>-expressing indirect pathway</b> cells (striatopallidal, co-expressing enkephalin and adenosine A<sub>2A</sub>) route through GPe and the subthalamic nucleus.",
   phys:[
    {h:"The down state",t:"MSNs rest near &minus;80 mV, clamped there by Kir2 inward-rectifier potassium channels, and require convergent, temporally coincident cortical and thalamic glutamatergic input to reach the depolarised 'up state' from which they can fire. They are therefore <b>coincidence detectors for cortical activity</b> rather than passive relays &mdash; a design that makes the striatum a filter for behaviourally coherent cortical patterns."},
    {h:"The three-element synapse",t:"On each dendritic spine, a cortical glutamatergic terminal contacts the head while a dopaminergic varicosity contacts the neck. Dopamine does not itself excite the MSN; it <b>gates whether the corticostriatal synapse strengthens or weakens</b>. D<sub>1</sub> activation (G<sub>s</sub>&rarr;PKA&rarr;DARPP-32 phosphorylation&rarr;inhibition of protein phosphatase-1) amplifies; D<sub>2</sub> activation does the reverse. Corticostriatal LTD additionally requires retrograde 2-arachidonoylglycerol acting on presynaptic CB<sub>1</sub>."},
    {h:"Go and no-go",t:"Direct-pathway activation inhibits GPi/SNr, releasing thalamus and facilitating movement. Indirect-pathway activation ultimately increases GPi/SNr output and suppresses movement. Dopamine excites the direct pathway through D<sub>1</sub> and inhibits the indirect pathway through D<sub>2</sub> &mdash; so it favours action. Losing dopamine (Parkinson) tips toward no-go; losing indirect-pathway cells (Huntington) tips toward uncontrollable go."}],
   rt:[
    {n:"D<sub>1</sub> / D<sub>2</sub>",c:"GPCR",d:"Segregated by pathway. Antipsychotic D<sub>2</sub> blockade disinhibits indirect-pathway MSNs &mdash; the direct cause of drug-induced parkinsonism."},
    {n:"Adenosine A<sub>2A</sub>",c:"GPCR &middot; G<sub>s</sub>",d:"Co-localised with D<sub>2</sub> on indirect-pathway MSNs and forming A<sub>2A</sub>&ndash;D<sub>2</sub> heteromers. Caffeine antagonises it (hence the modest inverse association between coffee intake and Parkinson disease); istradefylline is an approved A<sub>2A</sub> antagonist adjunct for 'off' episodes."},
    {n:"M<sub>1</sub> / M<sub>4</sub>",c:"GPCR",d:"The cholinergic half of the dopamine&ndash;acetylcholine balance. Anticholinergics relieve acute dystonia and drug-induced parkinsonism; they do <b>not</b> help tardive dyskinesia and can worsen it."},
    {n:"CB<sub>1</sub>",c:"GPCR &middot; G<sub>i/o</sub>",d:"Presynaptic on corticostriatal terminals; required for LTD."},
    {n:"NMDA / AMPA / mGluR5",c:"Ionotropic + GPCR",d:"The corticostriatal drive. Amantadine's antidyskinetic effect in levodopa-induced dyskinesia is attributed to NMDA antagonism here."},
    {n:"Kir2, Ca<sub>v</sub>1.3",c:"Ion channels",d:"Kir2 sets the down state; Ca<sub>v</sub>1.3 contributes to the up-state calcium signal driving plasticity."}],
   dz:[
    {n:"Parkinson disease",d:"Loss of nigrostriatal dopamine removes D<sub>1</sub> facilitation and D<sub>2</sub> inhibition simultaneously: the indirect pathway dominates and movement is suppressed. Deep brain stimulation of the subthalamic nucleus or GPi corrects the downstream imbalance without restoring dopamine &mdash; and STN stimulation can precipitate impulsivity, hypomania, and, in a minority, suicidality, which makes psychiatric screening part of DBS candidacy."},
    {n:"Huntington disease",d:"CAG expansion in <i>HTT</i>; <b>indirect-pathway (D<sub>2</sub>/enkephalin) MSNs degenerate first</b>, removing the brake on movement and producing chorea. As disease progresses and direct-pathway cells are lost too, the phenotype shifts to rigidity and akinesia. Psychiatric symptoms &mdash; irritability, apathy, depression, and a suicide rate several times the general population, with two peaks (around diagnosis and at loss of independence) &mdash; frequently precede the movement disorder by years."},
    {n:"Tardive dyskinesia",d:"Chronic D<sub>2</sub> blockade produces postsynaptic supersensitivity. Prevalence is roughly 3% per year with second-generation and 5% per year with first-generation antipsychotics, higher in older adults and in women. Treatment is a VMAT2 inhibitor (valbenazine, deutetrabenazine) to reduce presynaptic dopamine &mdash; not anticholinergics, and not simply raising the antipsychotic dose, which masks it temporarily and worsens it eventually."},
    {n:"Substance use disorders",d:"Repeated drug exposure drives &Delta;FosB accumulation and dendritic remodelling in accumbens MSNs, shifting behaviour from goal-directed (ventral striatum) to habitual (dorsolateral striatum). That dorsal shift is a reasonable cellular description of what compulsion is."},
    {n:"OCD and Tourette syndrome",d:"Both are disorders of cortico-striato-thalamo-cortical loops; the striatal node is where the deep brain stimulation targets sit, and where the failure to terminate a motor or cognitive programme is presumed to arise."}],
   pert:[
    {k:"pH and hypoxia",t:"MSNs are among the most metabolically vulnerable neurons in the brain. <b>Bilateral striatal necrosis</b> is a characteristic outcome of carbon monoxide poisoning, methanol toxicity, profound hypoglycaemia, and severe hypoxic&ndash;ischaemic injury &mdash; and it presents psychiatrically, weeks later, as parkinsonism, dystonia, apathy, or an amotivational syndrome rather than as a focal deficit."},
    {k:"Fever &amp; temperature",t:"The striatum participates directly in NMS: D<sub>2</sub> blockade here produces the lead-pipe rigidity that generates heat, while hypothalamic blockade prevents its dissipation. Creatine kinase rises from the muscle, and rhabdomyolysis with acute kidney injury is the proximate cause of death."},
    {k:"Seizures",t:"The striatum is relatively resistant to seizure generation but is a major modulator of propagation; the nigral control-of-epilepsy network gates seizure spread through the SNr."},
    {k:"Electrolytes",t:"Two lessons worth remembering. First, <b>extrapontine myelinolysis</b> after rapid correction of chronic hyponatraemia targets the striatum and thalamus and produces parkinsonism, dystonia, or mutism appearing days to weeks after the sodium has normalised. Second, <b>manganese</b> accumulates in the globus pallidus in chronic liver failure and in parenteral nutrition, producing T1 hyperintensity on MRI and a parkinsonian syndrome that does not respond to levodopa. Kernicterus targets the same structure in neonates."}],
   pearls:["Dopamine does not fire the MSN; it decides whether the corticostriatal synapse strengthens or weakens.",
    "Huntington kills indirect-pathway D<sub>2</sub> cells first &mdash; chorea is the loss of a brake.",
    "Tardive dyskinesia is treated by depleting the presynaptic terminal (VMAT2 inhibitors), not by more blockade or anticholinergics.",
    "New parkinsonism or dystonia weeks after a hyponatraemia admission: think extrapontine myelinolysis."],
   chapters:[["antipsychotic-movement-disorders","Antipsychotic Movement Disorders"],["parkinsons-disease","Parkinson Disease"],["antipsychotic-review","Antipsychotic Review"],["obsessive-compulsive-disorder","OCD"]]},

  /* ============ GLIA ============ */
  {id:"ast",cat:"Glia",name:"Astrocyte",sub:"Protoplasmic (grey) &amp; fibrous (white matter)",color:"#3f9b90",fig:FIG.ast,model:"synapse",
   why:"Astrocytes clear the glutamate, buffer the potassium, supply the NMDA co-agonist, form half the blood&ndash;brain barrier, and dispose of the brain's ammonia. Nearly every electrolyte emergency in psychiatry &mdash; hyponatraemia, its overcorrection, hepatic encephalopathy &mdash; is an astrocyte problem before it is a neuron problem.",
   loc:"Everywhere. Protoplasmic astrocytes in grey matter tile the parenchyma into <b>non-overlapping domains</b>, each enclosing on the order of 100,000 synapses and contacting at least one blood vessel. Human astrocytes are roughly 2.5 times larger and far more branched than rodent astrocytes &mdash; one of the few cellular features that is conspicuously more elaborate in our species. Fibrous astrocytes occupy white matter.",
   phys:[
    {h:"Glutamate clearance",t:"<b>EAAT2 (GLT-1)</b> performs roughly 90% of brain glutamate uptake. It cotransports 3 Na<sup>+</sup> and 1 H<sup>+</sup> inward while counter-transporting 1 K<sup>+</sup> &mdash; electrogenic, and entirely dependent on the sodium gradient maintained by the Na<sup>+</sup>/K<sup>+</sup>-ATPase. When ATP fails, the transporter runs backwards and becomes a glutamate <i>source</i>."},
    {h:"The glutamate&ndash;glutamine cycle and ammonia",t:"Glutamine synthetase is exclusively astrocytic. It condenses glutamate with NH<sub>4</sub><sup>+</sup> to make glutamine, which returns to neurons for reconversion by glutaminase. This is simultaneously the transmitter recycling route and <b>the brain's only meaningful ammonia sink</b> &mdash; which is precisely why hyperammonaemia is an astrocyte disease."},
    {h:"Potassium and water",t:"Kir4.1 channels and the Na<sup>+</sup>/K<sup>+</sup>-ATPase take up the K<sup>+</sup> released by firing neurons; connexin-43/30 gap junctions distribute it through a syncytium to perivascular endfeet (spatial buffering). AQP4 water channels are polarised to those endfeet &mdash; the basis of the glymphatic system, of cytotoxic oedema, and the antigen in neuromyelitis optica."},
    {h:"Gliotransmission and metabolic support",t:"Astrocytes supply <b>D-serine</b> via serine racemase &mdash; the principal co-agonist at synaptic NMDA receptors, meaning a glial cell holds a veto over neuronal plasticity. They also store the brain's only glycogen, shuttle lactate to neurons through MCT transporters, supply glutathione precursors, and mediate neurovascular coupling &mdash; the astrocytic calcium wave that dilates the arteriole is a substantial part of what the BOLD signal measures."}],
   rt:[
    {n:"EAAT1 (GLAST) / EAAT2 (GLT-1)",c:"Na<sup>+</sup>-coupled symporters",d:"Riluzole and ceftriaxone upregulate EAAT2 &mdash; the basis of riluzole trials in depression and OCD."},
    {n:"Kir4.1",c:"Inward-rectifier K<sup>+</sup> channel",d:"Spatial K<sup>+</sup> buffering. Loss is proconvulsant; it has also been reported as an autoantibody target in multiple sclerosis."},
    {n:"AQP4",c:"Water channel",d:"Perivascular polarised. Anti-AQP4 IgG defines neuromyelitis optica spectrum disorder &mdash; which can present with intractable hiccups and vomiting (area postrema syndrome) or with psychiatric symptoms."},
    {n:"Glutamine synthetase",c:"Enzyme",d:"Astrocyte-exclusive; the ammonia sink."},
    {n:"Serine racemase",c:"Enzyme",d:"Makes D-serine, the NMDA co-agonist. <i>SRR</i> is a schizophrenia candidate gene."},
    {n:"System x<sub>c</sub><sup>&minus;</sup> (SLC7A11)",c:"Cystine/glutamate antiporter",d:"Supplies cysteine for glutathione and sets extrasynaptic glutamate tone. This is <b>N-acetylcysteine's target</b> &mdash; the mechanistic rationale for NAC trials in trichotillomania, excoriation, and substance use disorders."},
    {n:"GAT-3, MCT1/4, Cx43/30",c:"Transporters / junctions",d:"GABA uptake, lactate shuttle, and the syncytial coupling that makes spatial buffering possible."}],
   dz:[
    {n:"Hepatic encephalopathy",d:"A purely astrocytic pathology. Ammonia is detoxified to glutamine inside the astrocyte; glutamine is an osmolyte, so the cell swells. Histology shows <b>Alzheimer type II astrocytes</b> &mdash; enlarged, pale, vesicular nuclei &mdash; with essentially normal neurons. Lactulose and rifaximin work by reducing gut ammonia production. This is the cleanest example in medicine of a psychiatric syndrome caused by glial rather than neuronal dysfunction."},
    {n:"Osmotic demyelination syndrome",d:"See the perturbation notes below &mdash; the astrocyte's osmotic adaptation to chronic hyponatraemia is exactly what makes rapid correction dangerous."},
    {n:"Depression",d:"Reduced astrocyte density and GFAP expression in prefrontal cortex, anterior cingulate, and amygdala is among the most consistently replicated postmortem findings in mood disorder &mdash; arguably more consistent than any neuronal finding. Whether this is cause, consequence, or shared vulnerability is unresolved."},
    {n:"Neuromyelitis optica spectrum disorder",d:"Anti-AQP4 antibodies destroy astrocytes, with secondary demyelination. Distinguished from multiple sclerosis by longitudinally extensive transverse myelitis, severe optic neuritis, area postrema syndrome, and a very different treatment (eculizumab, satralizumab, inebilizumab; and interferon-&beta; makes it <i>worse</i>)."},
    {n:"Addiction",d:"Reduced GLT-1 in the nucleus accumbens after chronic cocaine, with restored expression by N-acetylcysteine or ceftriaxone reducing reinstatement in animals. The human trials have been mixed, which is itself instructive."}],
   pert:[
    {k:"pH",t:"Astrocytes are the brain's principal pH regulators, using electrogenic sodium&ndash;bicarbonate cotransport (NBCe1) and carbonic anhydrase, and they set extracellular pH &mdash; which in turn gates NMDA receptors and pH-sensitive ion channels (ASICs). In ischaemia, ATP failure collapses the sodium gradient, EAAT2 reverses, and the astrocyte releases the glutamate it normally removes: the protective cell becomes the injuring one."},
    {k:"Fever &amp; inflammation",t:"Reactive astrogliosis with IL-1&beta; and TNF-&alpha; downregulates GLT-1 and increases glial glutamate release, raising extracellular glutamate at exactly the moment metabolic reserve is lowest."},
    {k:"Seizures",t:"Astrocytes limit seizure spread through K<sup>+</sup> and glutamate clearance; loss of Kir4.1 or of gap junctional coupling is proconvulsant. Extracellular K<sup>+</sup> rises from ~3 mM to a ceiling of 10&ndash;12 mM during a seizure, and that ceiling is set by astrocytic uptake."},
    {k:"Electrolytes &mdash; the central teaching case",t:"In chronic hyponatraemia the astrocyte swells within minutes, then over 24&ndash;48 hours extrudes organic osmolytes (myo-inositol, taurine, glutamate, creatine) to restore its volume. That adaptation is what allows a patient to walk around with a sodium of 118. But those osmolytes cannot be re-accumulated quickly: <b>correct the sodium faster than the astrocyte can rebuild them and the cell dehydrates, and the oligodendrocyte dies</b> &mdash; osmotic demyelination syndrome, appearing 2&ndash;6 days later as dysarthria, dysphagia, quadriparesis, or locked-in syndrome, often after apparent initial improvement. Limits: <b>4&ndash;6 mmol/L per 24 h in high-risk patients, never more than 8</b> (alcohol use, malnutrition, hypokalaemia, liver disease, sodium &lt;105). If overcorrected, re-lower with desmopressin and 5% dextrose. Note also that <b>correcting hypokalaemia raises serum sodium</b> &mdash; a common cause of unintentional overcorrection in the malnourished patient we are often the ones admitting."}],
   pearls:["Hepatic encephalopathy is an astrocyte disease: ammonia &rarr; glutamine &rarr; osmotic swelling &rarr; Alzheimer type II astrocytes.",
    "D-serine comes from astrocytes &mdash; a glial cell supplies the NMDA co-agonist.",
    "Correct chronic hyponatraemia at 4&ndash;6 mmol/L/24 h, absolute ceiling 8. Repleting potassium raises sodium too.",
    "Reduced astrocyte density in prefrontal cortex is one of the most reproducible postmortem findings in depression."],
   chapters:[["organ-dysfunction-psychiatry","Organ Dysfunction in Psychiatry"],["delirium","Delirium"],["neuroscience-foundations","Neuroscience Foundations"],["major-depressive-disorder","Major Depressive Disorder"]]},

  {id:"olig",cat:"Glia",name:"Oligodendrocyte &amp; OPC",sub:"Myelinating glia &middot; NG2 progenitors",color:"#5f52a0",fig:FIG.olig,model:"axon",
   why:"Prefrontal myelination is not complete until the mid-twenties, which is the single most concrete neurobiological fact underlying how we think about adolescent judgement, the age of onset of psychosis, and the timing of substance exposure. And several leukodystrophies present first to a psychiatrist.",
   loc:"White matter and myelinated grey matter tracts. One oligodendrocyte myelinates up to about 50 separate axonal segments &mdash; unlike a Schwann cell, which makes a single internode. <b>Oligodendrocyte precursor cells</b> (NG2 cells) constitute roughly 5% of all CNS cells and remain proliferative throughout adult life, making them the largest cycling population in the brain.",
   phys:[
    {h:"Myelin and the node",t:"Myelin is about 70% lipid, compacted by myelin basic protein and proteolipid protein. At the <b>node of Ranvier</b>, Na<sub>v</sub>1.6 is clustered at 1,000&ndash;2,000 channels per &micro;m<sup>2</sup> and anchored by ankyrin-G, with Kv7.2/7.3 (KCNQ) at the node and Kv1 sequestered in the juxtaparanode beneath the myelin. Saltatory conduction increases velocity 10&ndash;100 fold at a small fraction of the metabolic cost of an equivalent unmyelinated axon."},
    {h:"Metabolic partnership",t:"Oligodendrocytes deliver lactate to the axon through MCT1 in the periaxonal space. A demyelinated axon is not merely slower &mdash; it is metabolically starved, which is why axonal loss follows demyelination and why disability in multiple sclerosis correlates better with axonal loss than with lesion count."},
    {h:"Activity-dependent myelination",t:"OPCs receive genuine glutamatergic synapses from axons and proliferate and differentiate in response to activity. Learning a motor skill produces measurable white matter change in weeks, and blocking oligodendrogenesis blocks the learning. Myelin is a plastic substrate, not fixed wiring &mdash; a comparatively recent reframing worth teaching."},
    {h:"Developmental timetable",t:"Myelination proceeds caudorostrally and from primary sensorimotor to association cortex, with dorsolateral prefrontal cortex completing last, into the mid-twenties. This is the neurobiology behind adolescent risk-taking, and it aligns with the typical onset window of schizophrenia and bipolar disorder."}],
   rt:[
    {n:"AMPA / kainate, NMDA (GluN3A)",c:"Ionotropic",d:"Present on OPCs and on oligodendrocyte processes &mdash; making these cells directly susceptible to glutamate excitotoxicity, unusually for glia."},
    {n:"M<sub>1</sub> / M<sub>3</sub> muscarinic",c:"GPCR",d:"Muscarinic signalling <i>blocks</i> OPC differentiation. Clemastine, an antimuscarinic antihistamine, promoted remyelination in the ReBUILD trial &mdash; the first positive remyelination signal in humans, and a striking example of drug repurposing from a receptor screen."},
    {n:"GPR17",c:"GPCR",d:"A differentiation brake; a target of several remyelination programmes."},
    {n:"MCT1",c:"Lactate transporter",d:"Axonal metabolic support; loss causes axonal degeneration without demyelination."},
    {n:"Na<sub>v</sub>1.6, Kv7.2/7.3, Kv1.1/1.2",c:"Axonal channels",d:"Kv7 (KCNQ) is the retigabine target and the gene mutated in benign familial neonatal epilepsy; Kv1.1 mutations cause episodic ataxia type 1."}],
   dz:[
    {n:"Multiple sclerosis",d:"Psychiatrically, MS is a high-burden disease: lifetime depression prevalence around 50%, suicide risk roughly twice the population rate, pseudobulbar affect (dextromethorphan&ndash;quinidine), cognitive slowing in more than half, and a well-recognised euphoria in advanced disease. Interferon-&beta;'s depressive association is weaker than commonly claimed, but steroid pulses reliably cause mood and psychotic symptoms."},
    {n:"Osmotic demyelination syndrome",d:"Oligodendrocytes are the cells that actually die when chronic hyponatraemia is corrected too quickly &mdash; central pontine myelinolysis (dysarthria, dysphagia, quadriparesis, locked-in syndrome) and its extrapontine form (parkinsonism, dystonia, mutism). Onset is <i>delayed</i> 2&ndash;6 days, characteristically after the patient seemed to be improving."},
    {n:"Leukodystrophies presenting as psychiatric illness",d:"The high-yield fact for a psychiatrist. <b>Metachromatic leukodystrophy</b> (arylsulfatase A deficiency) in its juvenile and adult forms presents in adolescence or the twenties as psychosis, disorganisation, or personality change &mdash; frequently diagnosed as schizophrenia for years before the white matter disease is recognised. <b>Adrenoleukodystrophy</b> similarly presents with behavioural change and can be missed. Consider MRI in first-episode psychosis with cognitive decline, a family history of neurological disease, atypical features, or poor treatment response."},
    {n:"Schizophrenia",d:"Reduced oligodendrocyte number, downregulated myelin gene expression, and widespread reductions in fractional anisotropy on DTI &mdash; especially in the cingulum, uncinate, and arcuate fasciculus. The dysconnectivity model treats schizophrenia as a disorder of coordination between regions rather than damage to any one of them."},
    {n:"Vascular depression",d:"Deep and periventricular white matter hyperintensities in late-life depression predict poorer antidepressant response, greater executive dysfunction, and higher conversion to dementia &mdash; the 'depression&ndash;executive dysfunction syndrome'."},
    {n:"B<sub>12</sub> deficiency",d:"Subacute combined degeneration is a myelin disease of the dorsal columns and corticospinal tracts, and it can produce psychiatric symptoms &mdash; irritability, depression, psychosis &mdash; <b>before anaemia or macrocytosis appear</b>. Check methylmalonic acid and homocysteine when B<sub>12</sub> is borderline, and remember nitrous oxide abuse as a cause in young patients."}],
   pert:[
    {k:"pH and metabolic stress",t:"Oligodendrocytes carry the highest iron content of any CNS cell (iron is required for myelin lipid synthesis) and comparatively low glutathione, which makes them the <b>most vulnerable CNS cell to oxidative stress</b>. They are also uniquely susceptible to hypoxia, excitotoxicity, and osmotic stress &mdash; a convergence that explains why so many different systemic insults produce white matter injury."},
    {k:"Fever &amp; temperature &mdash; Uhthoff phenomenon",t:"A demyelinated axon conducts with almost no safety factor. Raising body temperature by as little as 0.5&nbsp;&deg;C &mdash; a hot bath, exercise, a fever &mdash; speeds sodium channel inactivation enough to cause <b>conduction block</b>, transiently reproducing old MS symptoms. It resolves with cooling. This is one of the most elegant demonstrations in clinical neuroscience that temperature is not a background variable but an operating parameter of the nervous system."},
    {k:"Seizures",t:"Kv7.2/7.3 channels at the node set the M-current, a subthreshold potassium conductance that dampens repetitive firing; KCNQ2 mutations cause neonatal epilepsy and retigabine was designed to open these channels (withdrawn for retinal pigmentation, but the target remains valid)."},
    {k:"Electrolytes",t:"The osmotic demyelination story belongs here as much as to the astrocyte: the astrocyte adapts, and the oligodendrocyte dies. The high-risk groups &mdash; chronic alcohol use, malnutrition, liver disease, hypokalaemia, sodium below 105 &mdash; overlap almost entirely with the population psychiatrists admit, which is why sodium correction rates are a psychiatric competency, not just an internal medicine one."}],
   pearls:["Prefrontal myelination finishes in the mid-twenties &mdash; the substrate of adolescent judgement.",
    "Uhthoff: 0.5 &deg;C is enough to block conduction in a demyelinated axon.",
    "Metachromatic leukodystrophy and adrenoleukodystrophy can present as first-episode psychosis in a young adult.",
    "B<sub>12</sub> deficiency can cause psychiatric symptoms before any haematological change &mdash; check MMA and homocysteine."],
   chapters:[["brain-imaging","Brain Imaging"],["folate-b12-mma","Folate, B12 &amp; MMA"],["schizophrenia","Schizophrenia"],["organ-dysfunction-psychiatry","Organ Dysfunction in Psychiatry"]]},

  {id:"mgl",cat:"Glia",name:"Microglia",sub:"Resident immune cell &middot; yolk-sac derived",color:"#b5892f",fig:FIG.mgl,model:"synapse",
   why:"The strongest common genetic signal in schizophrenia &mdash; the MHC locus &mdash; turns out to be complement C4A, and it acts through this cell. Microglia are also the most plausible cellular bridge between systemic inflammation and depressive symptoms, and between a urinary tract infection and delirium.",
   loc:"Distributed throughout the parenchyma at 5&ndash;10% of CNS cells, with regional variation (denser in hippocampus, basal ganglia, and substantia nigra). Uniquely, they are <b>yolk-sac derived</b> and colonise the brain before birth, then self-renew locally &mdash; they are not replenished from bone marrow under normal conditions, which is why they carry a lifetime of local history.",
   phys:[
    {h:"Surveillance",t:"In the resting state the soma is stationary but the processes are the most motile structures in the healthy brain, extending and retracting continuously and sampling the entire parenchymal volume every few hours. 'Resting' is a misnomer; 'surveillant' is the better term."},
    {h:"Synaptic pruning",t:"Neurons release fractalkine (CX3CL1) as a 'find-me' signal to CX3CR1 on microglia. Weak or inactive synapses are tagged by complement C1q and C3 and engulfed through complement receptor 3; CD47&ndash;SIRP&alpha; signalling protects active synapses. This is normal, essential developmental sculpting &mdash; and adolescence is when the cortex undergoes its largest wave of it."},
    {h:"The kynurenine branch point",t:"Inflammation shunts tryptophan away from serotonin synthesis down the kynurenine pathway via IDO. The branch that follows is cell-type specific and clinically important: <b>microglia</b> express kynurenine 3-monooxygenase and generate <b>quinolinic acid</b>, an NMDA receptor agonist and neurotoxin, while <b>astrocytes</b> generate <b>kynurenic acid</b>, an NMDA and &alpha;<sub>7</sub> antagonist. Elevated CSF quinolinic acid appears in suicidality and in interferon-&alpha;-induced depression; elevated kynurenic acid appears in schizophrenia. The same inflammatory input therefore produces different syndromes depending on which glial cell dominates."},
    {h:"Cytokine source",t:"Microglia are the brain's principal source of IL-1&beta;, IL-6, and TNF-&alpha;, and respond to peripheral inflammation through vagal afferents, circumventricular organs, and endothelial prostaglandin E<sub>2</sub> signalling."}],
   rt:[
    {n:"CX3CR1",c:"Chemokine receptor",d:"The neuronal 'find-me' receptor; knockout impairs pruning and produces behavioural phenotypes."},
    {n:"CR3 (CD11b/CD18)",c:"Complement receptor",d:"Mediates C3-tagged synapse engulfment &mdash; the effector arm of the C4A schizophrenia mechanism."},
    {n:"TREM2",c:"Immune receptor",d:"Rare variants (R47H) roughly triple Alzheimer risk. TREM2 drives the shift to a disease-associated microglial state around plaques; whether that state is protective or harmful appears to depend on disease stage."},
    {n:"P2Y12",c:"Purinergic GPCR",d:"The injury sensor that directs processes toward ATP released by damaged tissue, and the most reliable marker of homeostatic (non-activated) microglia."},
    {n:"TSPO (18 kDa)",c:"Mitochondrial protein",d:"The PET ligand target used to image 'neuroinflammation' &mdash; with the important caveats that TSPO is not microglia-specific, that binding is confounded by the rs6971 polymorphism requiring genotyping, and that increased signal does not equal activation."},
    {n:"TLR4, CB<sub>2</sub>, GR",c:"Receptors",d:"TLR4 responds to LPS and to danger signals; CB<sub>2</sub> is anti-inflammatory; glucocorticoid receptors can <i>prime</i> rather than suppress microglia after chronic stress."}],
   dz:[
    {n:"Schizophrenia",d:"The genome-wide association signal at the MHC locus is driven substantially by structural variation in <b>complement C4A</b>: more copies, more expression, more complement-mediated synaptic pruning. This aligns three previously separate observations &mdash; the GWAS hit, the postmortem spine loss, and the adolescent age of onset &mdash; into one mechanism. It is the most satisfying story in psychiatric genetics to date, and it should still be taught as a leading hypothesis rather than settled fact."},
    {n:"Depression and inflammation",d:"A subgroup of depressed patients has elevated CRP and IL-6. The anti-inflammatory trials are instructive: infliximab failed overall but benefited patients with CRP &gt;5 mg/L and <i>worsened</i> those with low CRP &mdash; one of the few replicated stratification findings in psychiatry, and an argument that 'inflammatory depression' is a real subtype rather than a slogan."},
    {n:"Delirium and microglial priming",d:"In an aged or neurodegenerating brain, microglia are primed &mdash; they sit closer to an activated phenotype and respond to a peripheral insult (urinary tract infection, hip fracture, surgery) with an exaggerated central cytokine response. This is the best available cellular account of why the same infection that causes mild malaise in a young adult causes florid delirium in an 85-year-old with early dementia."},
    {n:"Sickness behaviour",d:"IL-1&beta; and prostaglandin E<sub>2</sub> acting centrally produce anhedonia, psychomotor slowing, social withdrawal, anorexia, hypersomnia, and impaired concentration. Phenomenologically this is close to indistinguishable from a depressive episode, and it can be induced experimentally in healthy volunteers with endotoxin or typhoid vaccine &mdash; the strongest evidence that inflammation can <i>produce</i> depressive symptoms rather than merely accompany them."},
    {n:"Alzheimer disease",d:"TREM2 and other microglial genes dominate the AD polygenic risk landscape, shifting the field from a purely amyloid-centric to a substantially immune-centric model."}],
   pert:[
    {k:"pH",t:"Microglial function is proton-dependent. The voltage-gated proton channel Hv1 extrudes the protons generated by the NADPH oxidase respiratory burst; without it the burst self-limits. In acidotic ischaemic tissue, Hv1 activity is sustained and contributes to oxidative injury &mdash; making Hv1 a stroke target."},
    {k:"Fever &amp; systemic inflammation",t:"This is the defining perturbation for this cell. Peripheral cytokines reach the brain through the circumventricular organs, vagal afferents, active transport, and endothelial PGE<sub>2</sub> production. The result is fever plus sickness behaviour, and in a primed brain, delirium. Practical implication: in a delirious patient, the cause is more often systemic than neurological &mdash; look for infection, medication, retention, constipation, and pain before ordering imaging."},
    {k:"Seizures",t:"Seizures activate microglia within hours, and the resulting IL-1&beta; enhances NMDA receptor function through Src-family kinase phosphorylation of GluN2B &mdash; a feed-forward inflammatory loop that contributes to epileptogenesis. Anakinra (IL-1 receptor antagonist) and tocilizumab have been used with some success in febrile infection-related epilepsy syndrome (FIRES)."},
    {k:"Electrolytes and metabolic state",t:"Hyperglycaemia and insulin resistance promote a pro-inflammatory microglial phenotype; this is one proposed pathway from metabolic syndrome &mdash; which our antipsychotics cause &mdash; to accelerated cognitive ageing. Ketone bodies appear to be anti-inflammatory at microglial NLRP3, which is part of the mechanistic case being made for ketogenic diets in psychiatry, though the clinical evidence remains early."}],
   pearls:["Yolk-sac derived, self-renewing, and never replaced &mdash; microglia carry a lifetime of local history.",
    "C4A &rarr; complement tagging &rarr; excess synaptic pruning: the leading mechanism linking the strongest schizophrenia GWAS hit to the postmortem spine loss.",
    "Microglia make quinolinic acid (NMDA agonist); astrocytes make kynurenic acid (NMDA antagonist).",
    "Infliximab helped depression only when CRP &gt;5 and harmed patients with low CRP &mdash; inflammation is a subtype, not a universal."],
   chapters:[["psychoneuroimmunology","Psychoneuroimmunology"],["delirium","Delirium"],["schizophrenia","Schizophrenia"],["alzheimers-disease","Alzheimer Disease"]]},

  {id:"epn",cat:"Glia",name:"Ependymal cell &amp; choroid plexus",sub:"Ventricular lining &middot; blood&ndash;CSF barrier",color:"#276c64",fig:FIG.epn,model:"axon",
   why:"These cells make the fluid you sample when a psychiatric presentation might be autoimmune encephalitis, narcolepsy, neurosyphilis, or paraneoplastic. They also clear the brain overnight &mdash; which is where sleep, amyloid, and dementia risk intersect.",
   loc:"Ciliated ependyma lines all four ventricles and the central canal. The <b>choroid plexus</b> &mdash; a highly vascular villous epithelium &mdash; sits in the lateral, third, and fourth ventricles. Beneath the lateral ventricle ependyma lies the subventricular zone, one of the two adult neurogenic niches.",
   phys:[
    {h:"CSF production",t:"About 500 mL per day against a total volume of roughly 150 mL &mdash; the entire CSF compartment is replaced three to four times daily. Secretion is driven by basolateral NKCC1 and apical Na<sup>+</sup>/K<sup>+</sup>-ATPase and AQP1, with carbonic anhydrase supplying bicarbonate. Acetazolamide and topiramate inhibit carbonic anhydrase and reduce production &mdash; the basis of their use in idiopathic intracranial hypertension."},
    {h:"The blood&ndash;CSF barrier",t:"An important distinction: at the choroid plexus the capillaries are <i>fenestrated</i>, and the barrier is formed by tight junctions between <b>epithelial</b> cells &mdash; unlike the blood&ndash;brain barrier, where the endothelium itself is the barrier. This is why the choroid plexus is a preferential site of immune cell trafficking into the CNS and a route by which autoantibodies gain access."},
    {h:"Glymphatic clearance",t:"CSF enters along periarterial spaces, exchanges with interstitial fluid through astrocytic AQP4, and exits along perivenous routes and meningeal lymphatics. This clearance increases markedly during slow-wave sleep, when the interstitial space expands. A single night of sleep deprivation raises CSF amyloid-&beta; and tau in humans &mdash; the most direct evidence available that chronic insomnia is not merely a symptom of neurodegenerative risk but plausibly a contributor to it."},
    {h:"Gateway functions",t:"The choroid plexus is the brain's main source of transthyretin (thyroid hormone delivery), expresses folate receptor &alpha; (the antigen in cerebral folate deficiency), and carries efflux transporters that shape CNS drug exposure. It also carries the densest 5-HT<sub>2C</sub> receptor expression in the brain."}],
   rt:[
    {n:"NKCC1, AQP1, Na<sup>+</sup>/K<sup>+</sup>-ATPase",c:"Transporters",d:"The secretory machinery. Bumetanide inhibits NKCC1 and reduces CSF production."},
    {n:"Carbonic anhydrase II",c:"Enzyme",d:"Acetazolamide and topiramate inhibit it &mdash; producing reduced CSF formation, a non-anion-gap metabolic acidosis, paraesthesiae, kidney stones, and (with topiramate) the characteristic word-finding difficulty."},
    {n:"Folate receptor &alpha; (FOLR1)",c:"Receptor",d:"Transports 5-MTHF into CSF. Blocking autoantibodies cause cerebral folate deficiency &mdash; a treatable cause of developmental regression and, occasionally, of psychiatric presentation, responsive to folinic acid (not folic acid)."},
    {n:"Transthyretin",c:"Carrier protein",d:"Choroid plexus is the CNS source; relevant to thyroid hormone entry and to familial amyloid polyneuropathy."},
    {n:"P-glycoprotein, OATP, BCRP",c:"Efflux transporters",d:"Determine which drugs reach and stay in CSF."},
    {n:"5-HT<sub>2C</sub>",c:"GPCR &middot; G<sub>q</sub>",d:"Highest density in the brain here; may modulate CSF production."}],
   dz:[
    {n:"Normal pressure hydrocephalus",d:"The classic potentially reversible dementia: <b>gait apraxia (magnetic, wide-based, first), urinary incontinence, and cognitive slowing</b> &mdash; 'wet, wobbly, wacky', though the mnemonic understates how much the gait leads. Ventriculomegaly out of proportion to atrophy; a high-volume lumbar tap with pre- and post-gait testing is the practical bedside test. Shunting helps gait most and cognition least."},
    {n:"Idiopathic intracranial hypertension",d:"Headache, pulsatile tinnitus, papilloedema, visual obscurations; strongly associated with obesity and weight gain, which makes it relevant to patients gaining weight on antipsychotics. Lithium, tetracyclines, retinoids, and steroid withdrawal are recognised precipitants. Treatment is weight loss and acetazolamide."},
    {n:"CSF diagnosis of psychiatric mimics",d:"The practical point of this card. CSF is how you find <b>anti-NMDA receptor and other autoimmune encephalitides</b> (serum alone misses roughly 15% of NMDAR cases), <b>narcolepsy type 1</b> (orexin-A &lt;110 pg/mL), <b>neurosyphilis</b>, <b>CNS Whipple disease</b>, <b>paraneoplastic syndromes</b>, and <b>Creutzfeldt&ndash;Jakob disease</b> (RT-QuIC, now far superior to 14-3-3). Knowing when to send the fluid is a genuine psychiatric skill."},
    {n:"Ventriculitis and shunt infection",d:"Consider in any patient with a shunt and new confusion; the presentation is frequently behavioural before it is febrile."}],
   pert:[
    {k:"pH",t:"Carbonic anhydrase links CSF formation directly to acid&ndash;base status; inhibitors produce a predictable non-anion-gap metabolic acidosis. CSF pH is tightly regulated and, through central chemoreceptors on the ventral medullary surface, is the principal determinant of respiratory drive &mdash; which is why CSF acid&ndash;base status, not arterial, governs ventilation."},
    {k:"Fever &amp; temperature",t:"CSF production rises with fever and falls with hypothermia (roughly 10&ndash;20% per degree), one of several reasons therapeutic hypothermia lowers intracranial pressure."},
    {k:"Seizures",t:"Prolonged seizures can produce a mild CSF pleocytosis (usually &lt;10&ndash;20 cells) and transient protein elevation &mdash; a real finding, but never assume it: post-ictal pleocytosis is a diagnosis of exclusion after infection has been ruled out."},
    {k:"Electrolytes and osmolality",t:"CSF composition is actively regulated and is <i>not</i> simply an ultrafiltrate: CSF potassium (~2.9 mmol/L) is held below plasma and CSF calcium and glucose are lower, while chloride is higher. This active regulation is why neurological symptoms of electrolyte disturbance depend far more on the <b>rate of change</b> than on the absolute value &mdash; the brain can compensate slowly and cannot compensate quickly."}],
   pearls:["The blood&ndash;CSF barrier is epithelial (choroid plexus), not endothelial &mdash; the capillaries there are fenestrated.",
    "Glymphatic clearance peaks in slow-wave sleep; one night of deprivation raises CSF amyloid-&beta; and tau.",
    "NPH: gait goes first and responds best to shunting.",
    "Send CSF, not just serum, for NMDAR antibodies &mdash; serum alone misses cases."],
   chapters:[["delirium","Delirium"],["insomnia","Insomnia"],["capacity-evaluation","Capacity Evaluation"],["infectious-disease-psychiatry","Infectious Disease &amp; Psychiatry"]]},

  /* ============ PERIPHERAL & SPECIALISED ============ */
  {id:"ent",cat:"Peripheral &amp; specialised",name:"Enteric neuron",sub:"Myenteric &amp; submucosal plexuses &middot; enterochromaffin cells",color:"#94441c",fig:FIG.ent,model:"receptor",
   why:"Four hundred million neurons that will run the gut with the vagus cut. Every serotonergic drug we prescribe passes through here first, and clozapine's most lethal complication is a disorder of this system that is far less monitored than the one we count neutrophils for.",
   loc:"The <b>myenteric (Auerbach) plexus</b> sits between the longitudinal and circular muscle layers and controls motility; the <b>submucosal (Meissner) plexus</b> controls secretion and local blood flow. Together, 400&ndash;600 million neurons &mdash; more than the entire spinal cord. In the mucosa, <b>enterochromaffin cells</b> (not neurons, but the relevant chemical source) hold roughly 90% of the body's serotonin.",
   phys:[
    {h:"Genuine autonomy",t:"The enteric nervous system is the only division of the peripheral nervous system that executes complete reflex arcs without CNS input. Intrinsic primary afferent neurons sense stretch and luminal chemistry; ascending excitatory interneurons release acetylcholine and substance P above the bolus; descending inhibitory neurons release nitric oxide and VIP below it. Interstitial cells of Cajal generate the slow-wave pacemaker rhythm."},
    {h:"Serotonin's other 90%",t:"Enterochromaffin cells release serotonin in response to mechanical and chemical luminal stimuli. It acts on <b>5-HT<sub>3</sub></b> receptors on vagal afferents (nausea and the emetic reflex, via the area postrema, which lies outside the blood&ndash;brain barrier) and on <b>5-HT<sub>4</sub></b> receptors on enteric neurons (peristalsis). Peripheral serotonin is synthesised by TPH1 and cleared by SERT on enterocytes &mdash; which is exactly why an SSRI causes gastrointestinal symptoms before it causes anything else."},
    {h:"Bidirectional signalling",t:"Vagal afferents outnumber efferents roughly nine to one; the gut is mostly talking, not listening. Microbiota-derived short-chain fatty acids, bile acids, and bacterially produced neurotransmitters modulate enteric and vagal signalling. The microbiome literature in psychiatry is presently long on mechanism and short on replicated clinical outcomes &mdash; teach it as a promising and immature field."}],
   rt:[
    {n:"5-HT<sub>3</sub>",c:"Ionotropic",d:"Vagal afferents and area postrema. Explains first-week SSRI nausea and its resolution by desensitisation; ondansetron blocks it (and prolongs QT, which matters alongside citalopram)."},
    {n:"5-HT<sub>4</sub>",c:"GPCR &middot; G<sub>s</sub>",d:"Prokinetic. Prucalopride is selective; older agents (cisapride) were withdrawn for QT prolongation."},
    {n:"D<sub>2</sub>",c:"GPCR &middot; G<sub>i/o</sub>",d:"<b>Metoclopramide is a D<sub>2</sub> antagonist that crosses the blood&ndash;brain barrier</b> &mdash; it causes akathisia, acute dystonia, and tardive dyskinesia, and carries a black-box warning limiting use to 12 weeks. It is one of the commonest causes of drug-induced movement disorder referred to psychiatry. Domperidone does not cross but prolongs QT."},
    {n:"&mu;-opioid",c:"GPCR &middot; G<sub>i/o</sub>",d:"Opioid-induced constipation is a peripheral effect that does not develop tolerance the way analgesia does. Peripherally restricted antagonists &mdash; methylnaltrexone, naloxegol, naldemedine &mdash; treat it without reversing analgesia or precipitating withdrawal."},
    {n:"M<sub>3</sub> muscarinic",c:"GPCR &middot; G<sub>q</sub>",d:"Where anticholinergic constipation happens. The burden from a TCA plus quetiapine plus benztropine plus oxybutynin is additive and, in the case of clozapine, potentially fatal."},
    {n:"GLP-1 receptor",c:"GPCR &middot; G<sub>s</sub>",d:"Delayed gastric emptying underlies both semaglutide's satiety effect and its nausea; also the reason anaesthetic guidance now addresses GLP-1 agonists and aspiration risk."},
    {n:"nAChR (ganglionic), CB<sub>1</sub>",c:"Ionotropic / GPCR",d:"Ganglionic transmission; CB<sub>1</sub> slows transit, and cannabinoid hyperemesis syndrome &mdash; relieved by hot showers and by topical capsaicin &mdash; is an increasingly common emergency presentation."}],
   dz:[
    {n:"Clozapine-induced gastrointestinal hypomotility",d:"The point every trainee should take from this card. Clozapine's potent antimuscarinic and antiserotonergic action slows the gut in most patients; severe cases progress to ileus, bowel obstruction, ischaemia, and perforation, with a <b>mortality several times higher than that of clozapine-induced agranulocytosis</b> &mdash; the complication we monitor obsessively. Ask about bowel habit at every visit, start prophylactic laxatives (macrogol, senna) early, and take abdominal pain or absent bowel movements seriously. Avoid stacking anticholinergics."},
    {n:"Disorders of gut&ndash;brain interaction (IBS)",d:"Low-dose TCAs (amitriptyline 10&ndash;30 mg) have among the best evidence of any intervention in IBS, and gut-directed hypnotherapy and CBT perform comparably &mdash; a genuinely bidirectional illness where psychiatric tools are first-line gastroenterology."},
    {n:"Parkinson disease",d:"&alpha;-synuclein aggregates appear in the enteric plexus years to decades before motor symptoms. Braak's staging proposes an ascending route from gut to brainstem via the vagus, and vagotomy is associated with reduced Parkinson risk in Danish registry data. <b>Constipation is one of the earliest prodromal features</b>, alongside REM sleep behaviour disorder, hyposmia, and depression."},
    {n:"Eating disorders",d:"Delayed gastric emptying in anorexia nervosa produces early satiety and bloating that reinforce restriction; it improves with refeeding. Superior mesenteric artery syndrome is a rare complication of severe weight loss."},
    {n:"Opioid-induced bowel dysfunction",d:"Prophylaxis, not treatment, is the standard: start a stimulant laxative with the opioid."}],
   pert:[
    {k:"pH",t:"Systemic acidosis reduces smooth muscle contractility and gastrointestinal motility. Gastric pH also determines the absorption of weak bases &mdash; proton pump inhibitors meaningfully reduce absorption of some psychotropics and, importantly, of iron and B<sub>12</sub>, contributing to deficiencies that present as fatigue or cognitive complaints."},
    {k:"Fever &amp; temperature",t:"Splanchnic vasoconstriction during hyperthermia and exertional heat stress compromises the gut barrier, permitting endotoxin translocation &mdash; a mechanism implicated in the systemic inflammatory response of heat stroke and, at the extreme, of NMS."},
    {k:"Seizures",t:"The gut&ndash;brain axis runs the other way too: the ketogenic diet's antiseizure effect is partly microbiome-mediated in animal models (transferable by faecal transplant), and abdominal epilepsy, though rare, is a genuine cause of paroxysmal abdominal pain with altered awareness."},
    {k:"Electrolytes",t:"<b>Hypokalaemia and hypomagnesaemia cause ileus</b> &mdash; a routinely missed contributor when a patient on psychotropics 'stops eating'. <b>Hypercalcaemia causes constipation</b>, and its classic teaching phrase ends in 'psychiatric overtones' precisely because hyperparathyroidism and malignancy present with depression, apathy, and confusion. In eating disorders and laxative or diuretic misuse, correcting the electrolyte disturbance often does more for the presentation than anything psychotropic."}],
   pearls:["Clozapine's gut hypomotility kills more patients than its agranulocytosis. Ask about bowels every visit; prescribe laxatives prophylactically.",
    "Metoclopramide is a brain-penetrant D<sub>2</sub> antagonist &mdash; a common cause of drug-induced movement disorder.",
    "SSRI nausea is 5-HT<sub>3</sub>-mediated and self-limiting as the receptor desensitises. Tell patients that in advance.",
    "Constipation is one of the earliest prodromal signs of Parkinson disease."],
   chapters:[["clozapine-clinical-guide","Clozapine Clinical Guide"],["psychosomatic-conditions","Psychosomatic Conditions"],["parkinsons-disease","Parkinson Disease"],["eating-disorders","Eating Disorders"]]},

  {id:"pkj",cat:"Peripheral &amp; specialised",name:"Cerebellar Purkinje cell",sub:"Sole output of the cerebellar cortex",color:"#7a6cae",fig:FIG.pkj,model:"morph",
   why:"Lithium toxicity kills these cells, and the deficit is permanent. Any patient on lithium with new tremor, ataxia, dysarthria, or confusion needs a level today &mdash; not at the next routine visit.",
   loc:"A single-cell-thick layer between the molecular and granular layers of the cerebellar cortex. GABAergic, and the <b>only</b> output of the cerebellar cortex, projecting to the deep cerebellar nuclei. Functional topography matters clinically: the vermis handles gait and posture and is the region damaged by alcohol and thiamine deficiency; the lateral hemispheres connect with prefrontal and parietal cortex and underlie the cerebellar cognitive affective syndrome.",
   phys:[
    {h:"The most elaborate dendrite in the brain",t:"A flat, fan-shaped arbor confined to the parasagittal plane, receiving roughly 175,000 parallel fibre synapses &mdash; each individually weak and modifiable &mdash; from granule cells, whose axons run perpendicular through the arbor like telegraph wires through a row of trees."},
    {h:"One climbing fibre",t:"Each Purkinje cell receives exactly <b>one</b> climbing fibre from the inferior olive, which wraps the proximal dendrites and produces an overwhelming, all-or-none <b>complex spike</b> at about 1 Hz. This is a teaching signal: coincident climbing fibre and parallel fibre activity produces long-term depression at the parallel fibre synapse &mdash; the classic cellular model of supervised motor learning, and the origin of the idea that the cerebellum computes and corrects prediction error."},
    {h:"Firing and calcium load",t:"Simple spikes fire tonically at 50&ndash;100 Hz. The dendritic calcium load handled by P/Q-type Ca<sub>v</sub>2.1 channels is enormous, and it is a substantial part of why these cells are so vulnerable."},
    {h:"Beyond motor control",t:"The cerebellum contains more neurons than the rest of the brain combined and is reciprocally connected with prefrontal and parietal association cortex. Schmahmann's <b>cerebellar cognitive affective syndrome</b> &mdash; executive dysfunction, impaired visuospatial cognition, language deficits, and blunted or disinhibited affect after cerebellar injury &mdash; established that this is not solely a motor structure."}],
   rt:[
    {n:"mGluR1",c:"GPCR &middot; G<sub>q</sub>",d:"Essential for cerebellar LTD; the antigen in some paraneoplastic cerebellar degenerations."},
    {n:"GluD2 (delta receptor)",c:"Orphan ionotropic",d:"Required for parallel fibre synapse formation; the <i>lurcher</i> mutation kills Purkinje cells."},
    {n:"Ca<sub>v</sub>2.1 (P/Q type)",c:"Ca<sup>2+</sup> channel",d:"Mutations cause episodic ataxia type 2, familial hemiplegic migraine, and SCA6; it is the antigen in Lambert&ndash;Eaton myasthenic syndrome."},
    {n:"GABA<sub>A</sub> &alpha;<sub>6</sub>&delta;",c:"Extrasynaptic",d:"On granule cells, and among the most ethanol-sensitive receptors known &mdash; a substantial part of why alcohol produces ataxia at low doses."},
    {n:"AMPA GluA2, GABA<sub>A</sub> &alpha;<sub>1</sub>",c:"Ionotropic",d:"Parallel fibre transmission and molecular layer interneuron inhibition respectively."}],
   dz:[
    {n:"SILENT &mdash; syndrome of irreversible lithium-effectuated neurotoxicity",d:"Persistent cerebellar dysfunction &mdash; ataxia, dysarthria, nystagmus, intention tremor &mdash; lasting beyond two months after an episode of lithium toxicity, with Purkinje cell loss as the pathology. It is preventable and frequently is not prevented. <b>Risk rises with concurrent dehydration, NSAIDs, ACE inhibitors and ARBs, thiazides, low sodium intake, renal impairment, febrile illness, and age.</b> Coarse tremor, ataxia, confusion, or vomiting in a lithium patient is a level and a fluid status assessment today. Note that toxicity can occur at 'therapeutic' serum levels because brain and serum lithium equilibrate slowly."},
    {n:"Alcohol-related cerebellar degeneration",d:"Anterior superior vermis; gait and stance ataxia markedly out of proportion to arm findings and to dysarthria. Related to thiamine deficiency as much as to ethanol itself, and partially arrestable with abstinence and thiamine."},
    {n:"Paraneoplastic cerebellar degeneration",d:"Anti-Yo (gynaecological and breast cancer), anti-Hu, anti-Tr. Subacute pancerebellar syndrome, often preceding the cancer diagnosis; the deficit is usually permanent, which makes early recognition worth something."},
    {n:"Phenytoin toxicity",d:"Acute toxicity causes reversible ataxia and nystagmus; chronic exposure causes permanent cerebellar atrophy with Purkinje cell loss."},
    {n:"Spinocerebellar ataxias and Friedreich ataxia",d:"Several present with prominent depression, and SCA17 in particular can mimic Huntington disease including its psychiatric prodrome."},
    {n:"The cerebellum in schizophrenia",d:"'Cognitive dysmetria' proposes that the cortico&ndash;cerebellar&ndash;thalamo&ndash;cortical circuit fails to coordinate mental activity in the way it coordinates movement. Cerebellar vermis rTMS has been trialled for negative symptoms with promising but preliminary results."}],
   pert:[
    {k:"pH",t:"Purkinje cells sit at the extreme end of metabolic demand and have limited tolerance for the ATP failure that accompanies severe acidosis; their vulnerability is comparable to that of hippocampal CA1 neurons."},
    {k:"Fever &amp; temperature",t:"<b>Heat stroke produces selective Purkinje cell loss</b> &mdash; persistent cerebellar ataxia is one of the recognised long-term sequelae. The same holds after severe NMS, serotonin syndrome, and malignant hyperthermia. When a patient who survived a hyperthermic crisis has residual ataxia and dysarthria months later, this is why."},
    {k:"Seizures",t:"Purkinje cells are damaged by prolonged status epilepticus, and chronic phenytoin adds to the injury &mdash; making the cerebellar signs seen in long-standing epilepsy a combination of disease and treatment."},
    {k:"Electrolytes",t:"Lithium is the dominant concern: it is handled by the kidney like sodium, so <b>anything that causes sodium avidity &mdash; dehydration, vomiting, diarrhoea, a low-sodium diet, thiazides, NSAIDs, ACE inhibitors, ARBs &mdash; raises lithium concentration</b>. A febrile illness with poor oral intake is the classic scenario in which a stable patient becomes toxic within days. Counsel every lithium patient about sick-day rules; this single conversation prevents more permanent neurological injury than most things we do."}],
   pearls:["One climbing fibre per Purkinje cell, ~175,000 parallel fibres &mdash; teaching signal versus modifiable input.",
    "SILENT: cerebellar damage from lithium toxicity is permanent. Sick-day rules prevent it.",
    "Heat stroke, NMS, and serotonin syndrome can all leave permanent cerebellar signs.",
    "Alcohol-related degeneration hits the anterior vermis: gait ataxia far exceeds arm ataxia."],
   chapters:[["mood-stabilizer-medications","Mood Stabilizers"],["bipolar-disorder","Bipolar Disorder"],["alcohol-use-disorder","Alcohol Use Disorder"],["serotonin-syndrome-nms","Serotonin Syndrome &amp; NMS"]]},

  {id:"dgc",cat:"Peripheral &amp; specialised",name:"Dentate granule cell",sub:"Pattern separation &amp; adult neurogenesis",color:"#3f9b90",fig:FIG.dgc,model:"morph",
   why:"Two of the most useful things we can say to patients &mdash; why an antidepressant takes weeks, and why a trauma memory generalises to safe situations &mdash; are best explained at this cell.",
   loc:"The granule cell layer of the dentate gyrus. The <b>subgranular zone</b> beneath it is one of two adult neurogenic niches. The dentate is the entry point of the hippocampal trisynaptic circuit: entorhinal perforant path &rarr; dentate granule cells &rarr; mossy fibres &rarr; CA3 &rarr; Schaffer collaterals &rarr; CA1 &rarr; subiculum and back to entorhinal cortex.",
   phys:[
    {h:"Sparse coding and pattern separation",t:"Granule cells sit at a very negative resting potential under heavy feedforward inhibition and fire rarely and selectively. Because there are far more granule cells than entorhinal inputs, similar input patterns are mapped onto <b>non-overlapping</b> granule cell populations &mdash; <i>pattern separation</i>. This is what allows you to store today's parking spot without overwriting yesterday's. CA3, with its recurrent collaterals, does the opposite job: <i>pattern completion</i>, retrieving a whole memory from a fragment."},
    {h:"Adult-born neurons",t:"New granule cells pass through a transient window of a few weeks during which they have lower excitation thresholds, enhanced LTP, and preferential recruitment into new memories. Neurogenesis is suppressed by chronic stress and glucocorticoids and increased by exercise, enriched environment, antidepressants, ECT, and ketamine &mdash; with a two-to-four week time course that parallels the therapeutic lag. Ablating neurogenesis in rodents blocks the behavioural effects of SSRIs. <b>An important caveat to teach honestly:</b> whether meaningful adult hippocampal neurogenesis occurs in humans is contested &mdash; Sorrells and colleagues found essentially none beyond childhood, Boldrini and colleagues found it into the eighth decade, and the discrepancy is largely methodological. Present it as an open question."},
    {h:"HPA axis feedback",t:"The hippocampus carries the brain's densest expression of both mineralocorticoid receptors (high affinity, occupied at basal cortisol) and glucocorticoid receptors (low affinity, recruited at stress peaks), and it provides inhibitory feedback onto the paraventricular nucleus. Chronic cortisol elevation damages the very structure that shuts the axis off &mdash; a feed-forward loop invoked in melancholic depression and in Cushing syndrome."}],
   rt:[
    {n:"Glucocorticoid &amp; mineralocorticoid receptors",c:"Nuclear receptors",d:"The MR:GR occupancy ratio determines whether cortisol is trophic or toxic. Mifepristone (GR antagonist) has been trialled in psychotic depression."},
    {n:"BDNF&ndash;TrkB",c:"Receptor tyrosine kinase",d:"Downstream of ketamine via mTORC1; the Val66Met polymorphism affects activity-dependent BDNF secretion and hippocampal volume. There is now evidence that classical antidepressants bind TrkB directly &mdash; a genuinely surprising finding that would reframe their mechanism."},
    {n:"5-HT<sub>1A</sub>, 5-HT<sub>4</sub>",c:"GPCR",d:"Postsynaptic 5-HT<sub>1A</sub> supports neurogenesis; 5-HT<sub>4</sub> agonism accelerates antidepressant-like effects in models and is an active fast-acting target."},
    {n:"GABA<sub>A</sub> &delta; and &alpha;<sub>5</sub>",c:"Extrasynaptic",d:"Tonic inhibition maintaining sparse firing; neurosteroid-sensitive &mdash; the site where allopregnanolone (brexanolone, zuranolone) acts, and where falling neurosteroid levels postpartum are implicated."},
    {n:"NMDA / AMPA",c:"Ionotropic",d:"Perforant path plasticity; mossy fibre synapses onto CA3 are unusually large 'detonator' synapses with presynaptic, NMDA-independent LTP."}],
   dz:[
    {n:"Major depression",d:"Hippocampal volume reduction correlates with cumulative duration of <i>untreated</i> episodes, and at least partially reverses with treatment &mdash; one of the better arguments for early and adequate treatment rather than watchful waiting."},
    {n:"PTSD",d:"Impaired pattern separation offers a mechanistically precise account of overgeneralised fear: a context similar to the traumatic one is not stored as distinct, so the safe context retrieves the traumatic memory. Prolonged exposure and other trauma therapies can be framed to patients as retraining exactly this discrimination. Note the twin studies (Gilbertson and colleagues) showing that smaller hippocampal volume is partly a <i>pre-existing risk factor</i> rather than only a consequence."},
    {n:"Temporal lobe epilepsy",d:"Hippocampal sclerosis with granule cell dispersion and mossy fibre sprouting creates recurrent excitatory circuits. The psychiatric comorbidity is high &mdash; interictal dysphoric disorder, postictal psychosis (with its characteristic lucid interval of 12&ndash;72 hours), and elevated suicide risk &mdash; and epilepsy surgery has its own psychiatric outcome literature."},
    {n:"Cushing syndrome and steroid psychiatry",d:"Exogenous corticosteroids produce mood elevation, irritability, insomnia, and occasionally frank psychosis, usually within the first two weeks and dose-dependently above about 40 mg prednisone equivalent. Endogenous Cushing more often produces depression. Both are associated with hippocampal atrophy that improves with correction."},
    {n:"Alzheimer disease",d:"Entorhinal cortex and hippocampus are affected earliest &mdash; the anatomical reason episodic memory fails first while procedural and semantic memory persist."}],
   pert:[
    {k:"pH",t:"Hippocampal neurons express acid-sensing ion channels (ASIC1a) densely; acidosis activates them and contributes to calcium loading in ischaemia. ASIC1a has also been implicated in fear behaviour in response to CO<sub>2</sub> inhalation &mdash; a second, amygdala-focused route by which acid&ndash;base status connects to panic."},
    {k:"Fever &amp; temperature",t:"Prolonged febrile seizures in early childhood are associated with subsequent mesial temporal sclerosis, though whether the seizure causes the sclerosis or an existing abnormality causes both remains debated &mdash; a good illustration of the limits of observational inference in neurology."},
    {k:"Seizures &amp; selective vulnerability",t:"Different insults injure different hippocampal subfields, which is worth committing to memory: <b>global ischaemia damages CA1</b> (the Sommer sector &mdash; the most vulnerable neurons in the brain, and the reason anoxic brain injury presents as amnesia); <b>status epilepticus damages CA3 and the hilus</b>; <b>hypoglycaemia damages the dentate gyrus</b>. Transient global amnesia and transient epileptic amnesia both localise here and are frequently referred to psychiatry as dissociative amnesia."},
    {k:"Electrolytes &amp; metabolic state",t:"Hyponatraemia, hyperammonaemia, hypoglycaemia, and thiamine deficiency all present with anterograde amnesia and confusion partly through this circuit. Korsakoff syndrome principally damages the mammillary bodies and anterior thalamus rather than the hippocampus itself, but the clinical picture &mdash; dense anterograde amnesia with confabulation and preserved procedural learning &mdash; is a circuit-level failure of the same memory system."}],
   pearls:["Pattern separation (dentate) versus pattern completion (CA3) &mdash; and PTSD overgeneralisation as a failure of the former.",
    "CA1 dies in ischaemia, CA3 and hilus in status, dentate in hypoglycaemia.",
    "Hippocampal volume loss tracks untreated episode duration &mdash; an argument for treating early.",
    "Human adult neurogenesis is genuinely contested. Teach it as an open question, not as fact."],
   chapters:[["ptsd-cptsd","PTSD &amp; C-PTSD"],["major-depressive-disorder","Major Depressive Disorder"],["electroconvulsive-therapy","Electroconvulsive Therapy"],["ketamine-esketamine","Ketamine &amp; Esketamine"]]},

  {id:"bbb",cat:"Peripheral &amp; specialised",name:"Neurovascular unit",sub:"Endothelium &middot; pericyte &middot; astrocyte endfoot &middot; CVOs",color:"#b0567a",fig:FIG.bbb,model:"receptor",
   why:"This is the structure that decides whether a drug you prescribe reaches its target at all &mdash; and the places where it is deliberately absent are how the brain senses the body, why antipsychotics raise prolactin, and why dopamine antagonists are antiemetics.",
   loc:"Roughly 600 km of capillaries, with brain tissue never more than about 25 &micro;m from one. The <b>circumventricular organs</b> deliberately lack a barrier: area postrema, organum vasculosum of the lamina terminalis, subfornical organ, median eminence, pineal gland, and neurohypophysis &mdash; each a sensory or secretory window between blood and brain.",
   phys:[
    {h:"Three cells, one barrier",t:"Continuous non-fenestrated endothelium with continuous tight junctions (claudin-5, occludin, ZO-1) and almost no pinocytosis; <b>pericytes</b> at a ratio approaching 1:1 with endothelial cells &mdash; the highest in the body &mdash; regulating capillary diameter and barrier tightness; and <b>astrocyte endfeet</b> covering more than 95% of the abluminal surface with polarised AQP4."},
    {h:"What crosses passively",t:"Small (under roughly 400&ndash;500 Da), lipophilic, uncharged, with few hydrogen bond donors. But lipophilicity is not the whole story: <b>P-glycoprotein (ABCB1)</b> and BCRP actively pump many lipophilic drugs straight back out, and efflux is often the decisive factor. Loperamide is the teaching example &mdash; a potent opioid with no central effects because P-gp excludes it. Second-generation antihistamines are non-sedating for the same reason. Risperidone and 9-OH-risperidone are P-gp substrates, and ABCB1 variation has been proposed to affect response."},
    {h:"Carrier-mediated entry",t:"<b>GLUT1</b> for glucose (haploinsufficiency causes a ketogenic-diet-responsive epilepsy with movement disorder); <b>LAT1</b> for large neutral amino acids &mdash; the transporter levodopa uses, which is why a protein-rich meal competitively blunts a levodopa dose and why timing matters in Parkinson disease; transferrin receptor-mediated transcytosis, now exploited by engineered 'brain shuttle' antibody constructs."},
    {h:"Circumventricular organs &mdash; deliberate gaps",t:"The <b>area postrema</b> is the chemoreceptor trigger zone: outside the barrier, densely D<sub>2</sub> and 5-HT<sub>3</sub>. That is why dopamine antagonists and ondansetron are antiemetics, why apomorphine causes vomiting, and why GLP-1 agonists cause nausea. The <b>OVLT and subfornical organ</b> sense plasma osmolality and angiotensin and drive thirst and vasopressin. The <b>median eminence</b> is where tuberoinfundibular dopamine reaches the pituitary portal system &mdash; so an antipsychotic raises prolactin through a site that is functionally outside the brain."}],
   rt:[
    {n:"P-glycoprotein (ABCB1)",c:"ATP-binding efflux pump",d:"The dominant determinant of CNS exposure for many drugs. Inhibited by verapamil, ketoconazole, quinidine, ritonavir; induced by rifampicin, St John's wort, carbamazepine."},
    {n:"BCRP (ABCG2), MRPs",c:"Efflux transporters",d:"Overlapping substrate specificity with P-gp; jointly responsible for much unexplained CNS pharmacokinetics."},
    {n:"GLUT1 (SLC2A1)",c:"Glucose transporter",d:"Deficiency: infantile epilepsy, movement disorder, low CSF glucose with normal serum &mdash; and it responds to a ketogenic diet, which supplies an alternative fuel."},
    {n:"LAT1 (SLC7A5)",c:"Amino acid transporter",d:"Levodopa, thyroid hormone, gabapentin, and baclofen use it; dietary protein competes."},
    {n:"Claudin-5, occludin, ZO-1",c:"Tight junction proteins",d:"Claudin-5 is downregulated by chronic stress in animal models, and depression-associated barrier leakiness in the nucleus accumbens has been demonstrated &mdash; a provocative and still-early finding."},
    {n:"Transferrin receptor",c:"Receptor-mediated transcytosis",d:"The route being engineered for antibody delivery in Alzheimer disease and in enzyme replacement therapy."}],
   dz:[
    {n:"Delirium and sepsis-associated encephalopathy",d:"Systemic inflammation increases barrier permeability and downregulates tight junction proteins, admitting cytokines and immune cells. This is the vascular half of the microglial priming story, and it is why the delirious septic patient has a genuinely different brain, not merely a distracted one."},
    {n:"Posterior reversible encephalopathy syndrome (PRES)",d:"Acute hypertension, eclampsia, calcineurin inhibitors (tacrolimus, ciclosporin), and chemotherapy overwhelm autoregulation, producing posterior-predominant vasogenic oedema. Presents with headache, confusion, visual disturbance, and seizures &mdash; and is regularly misdiagnosed as a primary psychiatric presentation before imaging. Usually reversible if the cause is corrected."},
    {n:"Autoimmune encephalitis",d:"Barrier and blood&ndash;CSF barrier integrity determines antibody access; intrathecal synthesis is why CSF testing outperforms serum."},
    {n:"Cerebral small vessel disease and vascular depression",d:"Endothelial dysfunction, blood&ndash;brain barrier leakage, and white matter hyperintensities underlie the late-life depression&ndash;executive dysfunction syndrome, with its poorer antidepressant response and higher dementia conversion."},
    {n:"Pharmacological consequences",d:"Practical examples worth knowing: domperidone treats gastroparesis without EPS because it does not cross; methylnaltrexone treats opioid constipation without reversing analgesia; trospium is paired with xanomeline precisely because it does not cross; and second-generation antihistamines are non-sedating because P-gp excludes them."}],
   pert:[
    {k:"pH",t:"Cerebral arterioles are exquisitely CO<sub>2</sub>-responsive: hypercapnia and acidosis dilate them and increase cerebral blood flow; hypocapnia constricts them. Hyperventilation reduces cerebral blood flow by roughly 3% per mmHg fall in PaCO<sub>2</sub> &mdash; which is why hyperventilation lowers intracranial pressure acutely, why it is now used only as a brief bridge (the vasoconstriction risks ischaemia), and why the dizziness and visual changes of a panic attack have a real haemodynamic basis you can explain to the patient."},
    {k:"Fever &amp; inflammation",t:"Fever, sepsis, and systemic inflammation open the barrier. Hyperthermia above about 40 &deg;C directly damages endothelial tight junctions &mdash; part of why heat stroke produces encephalopathy out of proportion to any single mechanism."},
    {k:"Seizures",t:"Seizures transiently open the barrier, and barrier disruption is itself <b>epileptogenic</b>: extravasated albumin is taken up by astrocytes through TGF-&beta; receptor signalling, downregulating Kir4.1 and glutamate transporters and producing a hyperexcitable focus. This is one of the better-supported mechanisms of post-traumatic epilepsy, and losartan &mdash; which blocks TGF-&beta; signalling &mdash; is being investigated as an antiepileptogenic agent."},
    {k:"Electrolytes and osmolality",t:"Osmotic agents (mannitol, hypertonic saline) reduce brain water by establishing an osmotic gradient across an intact barrier &mdash; and become ineffective or harmful where the barrier is disrupted. Rapid osmotic shifts transiently open tight junctions, which has been exploited deliberately (intra-arterial mannitol for chemotherapy delivery) and occurs accidentally during aggressive sodium correction."}],
   pearls:["Efflux by P-glycoprotein, not lipophilicity alone, decides what reaches the brain.",
    "Area postrema sits outside the barrier &mdash; that is why D<sub>2</sub> and 5-HT<sub>3</sub> antagonists are antiemetics.",
    "Antipsychotics raise prolactin at the median eminence, a site functionally outside the blood&ndash;brain barrier.",
    "Barrier breakdown is epileptogenic through albumin and TGF-&beta; signalling in astrocytes."],
   chapters:[["pharmacokinetics","Pharmacokinetics"],["brain-imaging","Brain Imaging"],["delirium","Delirium"],["medicinal-chemistry","Medicinal Chemistry"]]}

  ];

  /* ---------------------------------------------------------------
     PERTURBATION TABLES — systemic physiology acting on cells
  ----------------------------------------------------------------*/
  var TABLES=[
   {id:"lyte",title:"Electrolyte disturbance &rarr; molecular target &rarr; bedside",
    lead:"Electrolytes act on named channels and transporters. Knowing which one turns a memorised list into a mechanism you can reason from &mdash; and, more practically, tells you which derangement to correct before adjusting a psychotropic.",
    head:["Disturbance","Molecular target","Cellular consequence","Clinical picture","Where it bites in psychiatry"],
    rows:[
     ["<b>Hyponatraemia</b> (acute)","Osmotic gradient; astrocytic AQP4","Astrocyte swelling within minutes, then whole-brain oedema","Headache, nausea, confusion, seizures, herniation. <b>Rate of fall matters far more than the number</b>","SSRIs and SNRIs (SIADH, first 2&ndash;4 weeks, elderly), carbamazepine and oxcarbazepine, psychogenic polydipsia, MDMA"],
     ["<b>Hyponatraemia</b> (chronic)","Organic osmolyte extrusion (myo-inositol, taurine, glutamate, creatine)","Astrocyte volume normalises over 24&ndash;48 h &mdash; the cell is adapted, and depleted","Often minimally symptomatic at Na 118&ndash;125; subtle gait instability, falls, attention deficits","A 'stable' low sodium is a <i>vulnerable</i> low sodium. Check before adding a thiazide, an SSRI, or desmopressin"],
     ["<b>Over-rapid correction</b>","Osmolytes cannot be re-accumulated fast enough","Oligodendrocyte death; astrocyte dehydration","<b>Osmotic demyelination</b> 2&ndash;6 days later, after apparent improvement: dysarthria, dysphagia, quadriparesis, locked-in; extrapontine form &rarr; parkinsonism, dystonia, mutism","Limit to <b>4&ndash;6 mmol/L per 24 h</b> in high risk, never &gt;8. High risk: alcohol use, malnutrition, hypokalaemia, liver disease, Na &lt;105. Repleting K<sup>+</sup> also raises Na<sup>+</sup>"],
     ["<b>Hypernatraemia</b>","Cellular dehydration; osmotic shift","Neuronal shrinkage, vessel tearing","Lethargy, irritability, weakness, seizures on correction","Lithium-induced nephrogenic diabetes insipidus; dementia patients who cannot access water"],
     ["<b>Hypokalaemia</b>","Hyperpolarised resting membrane; delayed cardiac repolarisation (I<sub>Kr</sub>)","Reduced excitability in muscle; prolonged QT interval","Weakness, ileus, arrhythmia. <b>Turns a borderline QTc into torsades</b>","Eating disorders (purging, laxative, diuretic misuse), alcohol use disorder, &beta;<sub>2</sub> agonists and catecholamine surge. Correct before prescribing citalopram, ziprasidone, IV haloperidol, or methadone"],
     ["<b>Hyperkalaemia</b>","Depolarised resting potential &rarr; Na<sub>v</sub> inactivation","Initial hyperexcitability, then inexcitability","Weakness, paraesthesiae, peaked T waves, arrest","Rhabdomyolysis in NMS, catatonia with immobility, restraint, and severe agitation"],
     ["<b>Hypocalcaemia</b>","Reduced surface-charge screening &rarr; &uarr; Na<sub>v</sub> open probability","Membrane destabilisation; increased neuronal excitability","Perioral and acral paraesthesiae, carpopedal spasm, Chvostek and Trousseau signs, <b>seizures</b>, prolonged QT","Anxiety and panic are common misdiagnoses; also post-thyroidectomy, hypoparathyroidism, and severe vitamin D deficiency"],
     ["<b>Hypercalcaemia</b>","Increased charge screening &rarr; &darr; Na<sub>v</sub> open probability","Reduced neuronal and smooth muscle excitability","<b>'Stones, bones, groans, and psychiatric overtones'</b> &mdash; depression, apathy, cognitive slowing, at higher levels psychosis and coma; short QT","Hyperparathyroidism and malignancy present to psychiatry as treatment-resistant depression. Also lithium-associated hyperparathyroidism &mdash; check calcium on lithium at least annually"],
     ["<b>Hypomagnesaemia</b>","Loss of the Mg<sup>2+</sup> block from the NMDA channel pore","Unopposed NMDA current; also potentiates catecholamine release","Tremor, tetany, <b>seizures</b>, arrhythmia, refractory hypokalaemia and hypocalcaemia","Alcohol use disorder, PPI use, diuretics, malnutrition. <b>Replete magnesium before chasing a refractory potassium</b>, and consider it in unexplained tremor or seizure"],
     ["<b>Hypermagnesaemia</b>","Blocks presynaptic Ca<sub>v</sub> &rarr; reduced ACh release","Neuromuscular blockade","Areflexia (first sign), weakness, respiratory depression, hypotension","Magnesium infusions in eclampsia are monitored by deep tendon reflexes; also a hazard with renal impairment and magnesium-containing laxatives"],
     ["<b>Hypophosphataemia</b>","ATP and 2,3-DPG depletion","Global energy failure; the metabolically extreme cells (PV interneurons) fail first","Weakness, rhabdomyolysis, confusion, seizures, cardiac failure","<b>Refeeding syndrome</b> in anorexia nervosa and severe malnutrition &mdash; monitor phosphate, potassium, and magnesium daily during refeeding and give thiamine first"],
     ["<b>Hypoglycaemia</b>","Substrate failure; Na<sup>+</sup>/K<sup>+</sup>-ATPase cannot maintain gradients","Dentate gyrus and striatum injured preferentially; excitotoxic amino acid release","Anxiety, tremor, sweating, then confusion, focal deficits, seizure, coma","Insulin and sulfonylureas; alcohol; a common mimic of panic disorder. In any acutely confused patient, glucose before anything else"]
    ]},

   {id:"acid",title:"Acid&ndash;base status &rarr; receptor and channel function",
    lead:"pH is not a background variable. Protons directly gate NMDA receptors, ASICs, and connexin hemichannels, and cerebral blood flow tracks PaCO<sub>2</sub> almost linearly. This is why hyperventilation activates seizures on EEG and why a panic attack produces genuinely abnormal cerebral physiology.",
    head:["State","Direct molecular effect","Vascular effect","Clinical consequence"],
    rows:[
     ["<b>Respiratory alkalosis</b><br><span class='nc-dim'>hyperventilation, panic, high altitude, salicylate</span>","<b>Relieves proton inhibition of NMDA receptors</b> (proton IC<sub>50</sub> &asymp; pH 7.3, so receptors are ~50% suppressed at rest); increases neuronal excitability; reduces ionised calcium by increasing albumin binding","Cerebral vasoconstriction, ~3% fall in CBF per mmHg drop in PaCO<sub>2</sub>","<b>Activates absence and other seizures &mdash; the basis of hyperventilation on EEG.</b> In panic: dizziness, visual dimming, derealisation, perioral and acral paraesthesiae, carpopedal spasm. All explicable to the patient, and explaining it is therapeutic"],
     ["<b>Respiratory acidosis</b><br><span class='nc-dim'>hypoventilation, opioids, COPD, obesity hypoventilation</span>","Protons inhibit NMDA receptors; activates ASICs; <b>directly excites orexin neurons and central chemoreceptors</b>","Marked cerebral vasodilation, raised intracranial pressure","CO<sub>2</sub> narcosis: headache, somnolence, asterixis, confusion. Also the substrate of the CO<sub>2</sub>-provocation model of panic &mdash; and a reason to be careful with sedatives in obesity hypoventilation and untreated sleep apnoea"],
     ["<b>Metabolic acidosis</b><br><span class='nc-dim'>DKA, lactate, toxic alcohols, topiramate, restraint</span>","Suppresses NMDA current; impairs catecholamine efficacy below pH 7.1; sustains microglial NADPH oxidase via Hv1","Vasodilation; compensatory hyperventilation (Kussmaul)","Confusion and reduced consciousness. In agitated delirium and prolonged restraint, acidosis is a recognised contributor to sudden death &mdash; correct volume and acidosis rather than escalating sedation. Topiramate, acetazolamide, and zonisamide cause a non-anion-gap acidosis"],
     ["<b>Metabolic alkalosis</b><br><span class='nc-dim'>vomiting, diuretics, laxative misuse</span>","Increases excitability; lowers ionised calcium; usually accompanied by hypokalaemia","Mild vasoconstriction","Confusion, tetany, seizures, arrhythmia. The classic pattern in bulimia nervosa and diuretic misuse: hypochloraemic, hypokalaemic metabolic alkalosis with a raised bicarbonate &mdash; a useful objective marker when purging is denied"],
     ["<b>Intracellular / vesicular pH</b>","VMAT2 and VGLUT depend on the vesicular H<sup>+</sup> gradient generated by the v-ATPase (intravesicular pH &asymp; 5.5)","&mdash;","Collapse of the gradient empties vesicles into the cytosol &mdash; the mechanism of amphetamine's releasing action and of reserpine's depletion, and a proposed route to dopamine auto-oxidation and nigral injury"]
    ]},

   {id:"temp",title:"Temperature &rarr; channel kinetics &rarr; syndrome",
    lead:"Every 1&nbsp;&deg;C rise increases cerebral metabolic rate by about 6&ndash;7% and accelerates channel gating. In a healthy brain that is trivial; in a demyelinated axon, a mutant sodium channel, or a compromised metabolic state, it is decisive.",
    head:["State","Cellular mechanism","Presentation","Management point"],
    rows:[
     ["<b>Fever (systemic)</b>","IL-1&beta; and PGE<sub>2</sub> at the OVLT raise the hypothalamic set-point; microglia activate; barrier permeability rises; orexin neurons are suppressed","Sickness behaviour &mdash; anhedonia, withdrawal, hypersomnia, psychomotor slowing &mdash; phenomenologically near-identical to depression. Delirium in the primed (aged, demented) brain","Antipyretics work because the set-point is raised. In a delirious patient, look for the systemic cause before imaging"],
     ["<b>Febrile seizure / SCN1A</b>","<b>Na<sub>v</sub>1.1 is expressed preferentially in interneurons and is temperature-sensitive</b>; a modest rise tips inhibition into failure","Generalised seizure with fever in a young child; in Dravet, prolonged and recurrent","<b>Avoid sodium channel blockers in Dravet</b> &mdash; phenytoin, carbamazepine, and lamotrigine make it worse. Use valproate, clobazam, stiripentol, fenfluramine, cannabidiol"],
     ["<b>Neuroleptic malignant syndrome</b>","D<sub>2</sub> blockade: striatal blockade &rarr; lead-pipe rigidity generating heat; preoptic hypothalamic blockade &rarr; failure to dissipate it","Days to weeks after starting or increasing a dopamine antagonist (or stopping a dopamine agonist). <b>Lead-pipe rigidity, hyporeflexia</b>, hyperthermia, autonomic instability, raised CK, leucocytosis, altered consciousness","Stop the agent, cool actively, fluids for rhabdomyolysis. Dantrolene, bromocriptine, amantadine; ECT for refractory cases. Restart an antipsychotic no sooner than 2 weeks after resolution, preferably a low-potency or partial agonist"],
     ["<b>Serotonin syndrome</b>","5-HT<sub>2A</sub> (with 5-HT<sub>1A</sub>) hyperstimulation; heat is generated by <b>muscle activity</b>, not by a raised set-point","Within 24 h of a dose change. <b>Inducible and ocular clonus, hyperreflexia, greater in legs than arms</b>, tremor, agitation, diarrhoea, diaphoresis","Antipyretics do <b>not</b> work. Benzodiazepines, active external cooling, cyproheptadine. Above 41.1 &deg;C: paralysis and intubation"],
     ["<b>Anticholinergic hyperthermia</b>","M<sub>3</sub> blockade abolishes sweating","<b>Dry, flushed skin</b> &mdash; the discriminating sign. Mydriasis, urinary retention, absent bowel sounds, tachycardia, agitated delirium with mumbling and picking","Cooling, benzodiazepines, fluids. Physostigmine reverses central effects but is <b>contraindicated in TCA overdose</b> (asystole risk)"],
     ["<b>Heat stroke</b>","Direct endothelial and tight junction damage above ~40 &deg;C; gut barrier failure with endotoxin translocation; <b>selective Purkinje cell loss</b>","Encephalopathy, coagulopathy, multi-organ failure","Psychiatric patients are at elevated risk: antipsychotics impair thermoregulation through D<sub>2</sub>, H<sub>1</sub>, M<sub>3</sub>, and &alpha;<sub>1</sub> actions simultaneously. <b>Counsel every summer.</b> Residual ataxia months later reflects Purkinje loss"],
     ["<b>Uhthoff phenomenon</b>","A demyelinated axon has almost no conduction safety factor; a 0.5 &deg;C rise speeds Na<sub>v</sub> inactivation enough to cause <b>conduction block</b>","Transient recurrence of old MS symptoms with exercise, a hot bath, or fever; resolves on cooling","Not a relapse. Reassure and cool; distinguishing pseudo-relapse from true relapse avoids unnecessary steroids"],
     ["<b>Hypothermia</b>","Slowed channel kinetics; reduced CSF production; reduced cerebral metabolic rate (protective after arrest)","Confusion, then obtundation. Paradoxical undressing","&alpha;<sub>1</sub> blockade impairs cutaneous vasoconstriction &mdash; older adults on antipsychotics are at real risk of hypothermia, which is underappreciated relative to hyperthermia"]
    ]},

   {id:"sz",title:"Seizures &rarr; what changes, and when",
    lead:"Status epilepticus is not a static state. Receptors move in and out of the membrane on a timescale of minutes to hours, which is why the same drug that aborts a seizure at five minutes fails at forty.",
    head:["Time / event","What happens at the membrane","Clinical implication"],
    rows:[
     ["<b>0&ndash;5 min</b>","Synaptic GABA<sub>A</sub> receptors intact and benzodiazepine-responsive","Give a <b>full weight-based benzodiazepine dose immediately</b>. Under-dosing is the commonest error in status management"],
     ["<b>20&ndash;40 min</b>","Synaptic GABA<sub>A</sub> receptors are internalised by clathrin-mediated endocytosis; NMDA receptors traffic <i>to</i> the membrane","<b>Benzodiazepine efficacy falls with time</b> &mdash; this is pharmacodynamic, not a dosing failure. Move to a second-line agent (levetiracetam, fosphenytoin, valproate) without delay; consider ketamine in refractory status"],
     ["<b>&gt;60 min</b>","Excitotoxic calcium loading; extracellular K<sup>+</sup> at ceiling (10&ndash;12 mM); EAAT2 reverses; microglia activate and IL-1&beta; potentiates GluN2B","Anaesthetic-level treatment. Neuronal injury is now accruing: CA3 and hilar neurons, Purkinje cells, and dentate hilus are the vulnerable populations"],
     ["<b>Selective vulnerability</b>","<b>CA1</b> &rarr; global ischaemia (Sommer sector). <b>CA3 + hilus</b> &rarr; status epilepticus. <b>Dentate gyrus</b> &rarr; hypoglycaemia. <b>Purkinje cells</b> &rarr; hyperthermia, lithium, phenytoin, hypoxia. <b>Striatum and globus pallidus</b> &rarr; carbon monoxide, methanol, manganese, kernicterus. <b>PV interneurons</b> &rarr; oxidative stress, hypoxia, hypoglycaemia","Different insults leave different fingerprints. This is why a post-arrest patient presents with amnesia, a heat-stroke survivor with ataxia, and a carbon monoxide survivor with parkinsonism and apathy weeks later"],
     ["<b>Post-ictal state</b>","Transient blood&ndash;brain barrier opening; mild CSF pleocytosis possible; adenosine surge","Postictal psychosis characteristically follows a <b>lucid interval of 12&ndash;72 hours</b> after a seizure cluster and is often pleomorphic and self-limiting. Never attribute CSF pleocytosis to seizure until infection is excluded"],
     ["<b>Barrier disruption is epileptogenic</b>","Extravasated albumin is taken up by astrocytes via TGF-&beta; receptor signalling, downregulating Kir4.1 and glutamate transporters","A mechanism of post-traumatic epilepsy; losartan is under investigation as an antiepileptogenic agent"],
     ["<b>Cofactor-dependent seizures</b>","GAD requires pyridoxal-5&prime;-phosphate. Isoniazid, hydralazine, and gyromitra depletion of PLP collapses GABA synthesis","Benzodiazepine-refractory seizures reversed by <b>IV pyridoxine, gram-for-gram with the ingested isoniazid</b> (5 g empirically if the amount is unknown). Worth knowing before you need it"]
    ]}
  ];

  /* ---------------------------------------------------------------
     RENDER — atlas
  ----------------------------------------------------------------*/
  var cmap={}; CELLS.forEach(function(c){cmap[c.id]=c;});
  var cats=[]; CELLS.forEach(function(c){if(cats.indexOf(c.cat)<0)cats.push(c.cat);});

  function buildRail(){
    var rail=$("nc-rail"); var h="";
    cats.forEach(function(cat){
      h+='<h4>'+cat+'</h4>';
      CELLS.filter(function(c){return c.cat===cat;}).forEach(function(c){
        h+='<button class="nc-item" data-id="'+c.id+'">'+
           '<span class="nc-sw" style="background:'+c.color+'"></span>'+
           '<span><span class="nc-nm">'+c.name+'</span><br><span class="nc-sb">'+c.sub+'</span></span></button>';
      });
    });
    rail.innerHTML=h;
    rail.addEventListener("click",function(e){
      var b=e.target.closest(".nc-item"); if(b) select(b.getAttribute("data-id"));
    });
  }

  function list(items,cls){
    return '<ul class="'+cls+'">'+items.map(function(i){return '<li>'+i+'</li>';}).join("")+'</ul>';
  }

  function renderDetail(c){
    var h='';
    h+='<div class="nc-dhead" style="border-left-color:'+c.color+'">'+
       '<p class="nc-dcat">'+c.cat+'</p>'+
       '<h3>'+c.name+'</h3>'+
       '<p class="nc-dsub">'+c.sub+'</p></div>';

    h+='<div class="nc-figrow"><div class="nc-fig">'+c.fig+'</div>'+
       '<div class="nc-why"><p class="nc-k">Why this cell matters</p><p>'+c.why+'</p>'+
       '<button class="nc-3dbtn" data-model="'+c.model+'">Open the 3D model &#8599;</button></div></div>';

    h+='<div class="nc-block"><p class="nc-k">Where it lives</p><p class="nc-p">'+c.loc+'</p></div>';

    h+='<div class="nc-block"><p class="nc-k">Normal physiology</p>';
    c.phys.forEach(function(p){ h+='<div class="nc-phys"><h5>'+p.h+'</h5><p>'+p.t+'</p></div>'; });
    h+='</div>';

    h+='<div class="nc-block"><p class="nc-k">Receptors, transporters &amp; enzymes</p>'+
       '<table class="nc-rt"><thead><tr><th>Target</th><th>Class</th><th>Why you care</th></tr></thead><tbody>';
    c.rt.forEach(function(r){ h+='<tr><td class="nc-rt-n">'+r.n+'</td><td class="nc-rt-c">'+r.c+'</td><td>'+r.d+'</td></tr>'; });
    h+='</tbody></table></div>';

    h+='<div class="nc-block"><p class="nc-k">When it goes wrong</p>';
    c.dz.forEach(function(d){ h+='<div class="nc-dz"><h5>'+d.n+'</h5><p>'+d.d+'</p></div>'; });
    h+='</div>';

    h+='<div class="nc-block nc-pertblock"><p class="nc-k">Under systemic stress</p>';
    c.pert.forEach(function(p){ h+='<div class="nc-pert"><span class="nc-pk">'+p.k+'</span><p>'+p.t+'</p></div>'; });
    h+='</div>';

    h+='<div class="nc-block nc-pearlblock"><p class="nc-k">Carry these</p>'+list(c.pearls,"nc-pearls")+'</div>';

    if(c.chapters&&c.chapters.length){
      h+='<div class="nc-block"><p class="nc-k">Go deeper</p><div class="nc-chaps">';
      c.chapters.forEach(function(ch){ h+='<a class="nc-chap" href="/blog/'+ch[0]+'/">'+ch[1]+' &#8599;</a>'; });
      h+='</div></div>';
    }
    return h;
  }

  var current=null;
  function select(id){
    var c=cmap[id]; if(!c) return; current=id;
    var items=document.querySelectorAll("#nc-rail .nc-item");
    for(var i=0;i<items.length;i++) items[i].classList.toggle("active", items[i].getAttribute("data-id")===id);
    var d=$("nc-detail"); d.innerHTML=renderDetail(c); d.scrollTop=0;
    var btn=d.querySelector(".nc-3dbtn");
    if(btn) btn.onclick=function(){ goTab("models"); setModel(btn.getAttribute("data-model")); };
    if(window.innerWidth<=900) d.scrollIntoView({behavior:"smooth",block:"start"});
  }
  window.PPCellTypes={focus:select};

  /* ---------------------------------------------------------------
     RENDER — perturbation tables + quick reference
  ----------------------------------------------------------------*/
  function buildTables(){
    var h="";
    TABLES.forEach(function(t){
      h+='<div class="nc-tblwrap" id="nc-tbl-'+t.id+'">'+
         '<h3 class="nc-tbl-title">'+t.title+'</h3>'+
         '<p class="nc-tbl-lead">'+t.lead+'</p>'+
         '<div class="nc-scroll"><table class="nc-table"><thead><tr>'+
         t.head.map(function(x){return '<th>'+x+'</th>';}).join("")+
         '</tr></thead><tbody>'+
         t.rows.map(function(r){return '<tr>'+r.map(function(cell,i){return '<td'+(i===0?' class="nc-td1"':'')+'>'+cell+'</td>';}).join("")+'</tr>';}).join("")+
         '</tbody></table></div></div>';
    });
    $("nc-tables").innerHTML=h;
  }

  function buildQuick(){
    var h='<div class="nc-scroll"><table class="nc-table nc-qtable"><thead><tr>'+
      '<th>Cell</th><th>Principal location</th><th>Signature molecule</th><th>Firing / function</th><th>Headline disease</th><th>Most sensitive to</th></tr></thead><tbody>';
    var Q={
     da:["Tyrosine hydroxylase &middot; DAT &middot; D<sub>2</sub>","Pacemaker 1&ndash;5 Hz; bursts encode reward-prediction error","Parkinson disease; psychosis","Ca<sup>2+</sup> load, hyperthermia, iron deficiency"],
     sert:["TPH2 &middot; SERT &middot; 5-HT<sub>1A</sub>","Clock-like 1&ndash;5 Hz, silent in REM","Depression; serotonin syndrome","Tryptophan supply, hyponatraemia"],
     ne:["DBH &middot; NET &middot; &alpha;<sub>2A</sub>","Tonic arousal on an inverted-U; REM-off","Panic, PTSD, ADHD; opioid withdrawal","Acidosis (pressor failure), K<sup>+</sup> shifts"],
     ach:["ChAT &middot; ChT1 &middot; AChE","Cortical activation; striatal tonic 3&ndash;10 Hz with pauses","Alzheimer disease; delirium","Anticholinergic burden, Mg<sup>2+</sup>, hyponatraemia"],
     ha:["Histidine decarboxylase &middot; H<sub>1</sub>","Wake-on, REM-off; sole histamine source","Sedation and weight gain; narcolepsy (downstream)","Heat (impaired dissipation when blocked)"],
     orx:["Prepro-orexin &middot; OX<sub>2</sub>R","Active-wake firing; stabilises the sleep switch","Narcolepsy type 1","CO<sub>2</sub> / acidosis, IL-1&beta;, glucose"],
     pyr:["VGLUT1 &middot; NMDA &middot; AMPA","Regular spiking; 10,000&ndash;30,000 spines","Schizophrenia (spine loss); NMDAR encephalitis","pH (proton block), Mg<sup>2+</sup>, Ca<sup>2+</sup>, osmolality"],
     pv:["Parvalbumin &middot; GAD67 &middot; Kv3.1","Fast-spiking to 200 Hz; generates gamma","Schizophrenia; Dravet (SCN1A)","Temperature, oxidative stress, hypoglycaemia, B<sub>6</sub>"],
     sst:["Somatostatin &middot; GABA<sub>A</sub> &alpha;<sub>5</sub>","Low-threshold, facilitating; dendritic inhibition","Depression (reduced SST)","Chronic glucocorticoids"],
     msn:["DARPP-32 &middot; D<sub>1</sub>/D<sub>2</sub> &middot; Kir2","Down-state at &minus;80 mV; coincidence detector","Parkinson, Huntington, tardive dyskinesia","Hypoxia, CO, hypoglycaemia, osmotic shift"],
     ast:["GLT-1 &middot; GS &middot; AQP4 &middot; Kir4.1","Non-firing; clearance, buffering, D-serine supply","Hepatic encephalopathy; NMOSD","Ammonia, osmolality, Na<sup>+</sup> correction rate"],
     olig:["MBP &middot; PLP &middot; MCT1","Non-firing; myelination, axonal metabolic support","MS; osmotic demyelination; leukodystrophies","Temperature (Uhthoff), oxidative stress, osmotic shift"],
     mgl:["C1q/C3 &middot; TREM2 &middot; P2Y12","Surveillance; pruning; cytokine release","Schizophrenia (C4A); delirium; inflammatory depression","Systemic inflammation, fever, hyperglycaemia"],
     epn:["NKCC1 &middot; AQP1 &middot; carbonic anhydrase","Ciliary CSF flow; ~500 mL/day secretion","Normal pressure hydrocephalus; IIH","Carbonic anhydrase inhibitors, temperature"],
     ent:["ChAT / nNOS &middot; 5-HT<sub>3</sub> / 5-HT<sub>4</sub>","Autonomous peristaltic reflex","Clozapine hypomotility; IBS; Parkinson prodrome","K<sup>+</sup>, Mg<sup>2+</sup>, Ca<sup>2+</sup>, anticholinergics"],
     pkj:["Ca<sub>v</sub>2.1 &middot; mGluR1 &middot; GluD2","50&ndash;100 Hz simple spikes; 1 Hz complex spikes","SILENT (lithium); alcohol-related degeneration","Lithium, hyperthermia, hypoxia, phenytoin"],
     dgc:["GR / MR &middot; BDNF-TrkB &middot; GABA<sub>A</sub> &delta;","Sparse firing; pattern separation","Depression; PTSD; temporal lobe epilepsy","Cortisol, hypoglycaemia, ammonia, thiamine"],
     bbb:["Claudin-5 &middot; P-gp &middot; GLUT1 &middot; LAT1","Selective permeability; neurovascular coupling","PRES; vascular depression; delirium","PaCO<sub>2</sub>, inflammation, osmolality, hypertension"]
    };
    CELLS.forEach(function(c){
      var q=Q[c.id]||["","","",""];
      var locShort=c.sub;
      h+='<tr><td class="nc-td1"><span class="nc-sw" style="background:'+c.color+'"></span> <a class="nc-qlink" data-id="'+c.id+'">'+c.name+'</a></td>'+
         '<td>'+locShort+'</td><td>'+q[0]+'</td><td>'+q[1]+'</td><td>'+q[2]+'</td><td>'+q[3]+'</td></tr>';
    });
    h+='</tbody></table></div>';
    var el=$("nc-quick"); el.innerHTML=h;
    el.addEventListener("click",function(e){
      var a=e.target.closest(".nc-qlink"); if(a){ goTab("atlas"); select(a.getAttribute("data-id")); }
    });
  }

  /* ---------------------------------------------------------------
     TABS
  ----------------------------------------------------------------*/
  function goTab(t){
    ["atlas","models","perturb","quick"].forEach(function(k){
      var p=$("nc-tab-"+k), b=document.querySelector('.nc-tabbtn[data-tab="'+k+'"]');
      if(p) p.style.display=(k===t)?"":"none";
      if(b) b.classList.toggle("active",k===t);
    });
    if(t==="models") setTimeout(function(){ if(window.__ncResize) window.__ncResize(); },30);
  }

  /* ---------------------------------------------------------------
     3D MODELS — procedural geometry, no external assets
  ----------------------------------------------------------------*/
  var MODEL_META={
   morph:{name:"Neuron morphology comparison",
     hint:"Five neurons at the same scale. Drag to rotate, scroll to zoom, click any cell for its notes. Morphology is not decoration &mdash; the shape of the dendritic tree <i>is</i> the computation the cell performs."},
   synapse:{name:"The tripartite synapse",
     hint:"A glutamatergic synapse with its astrocytic partner. Click the presynaptic terminal, the cleft, the spine, or the astrocyte process."},
   receptor:{name:"Receptor &amp; transporter architecture",
     hint:"Four archetypes in a lipid bilayer, drawn as membrane topology rather than atomic structure. Click each to see what it does and which drugs act on it."},
   axon:{name:"Myelinated axon &amp; node of Ranvier",
     hint:"One oligodendrocyte, three internodes, and the nodes between them. Click the myelin, a node, or the oligodendrocyte soma."}
  };

  var INFO={
   /* morph */
   "m-pyr":{t:"Cortical pyramidal neuron",d:"Apical dendrite to layer I, basal skirt near the soma, single descending axon. Two dendritic compartments that can be driven independently &mdash; feedforward input below, feedback and neuromodulatory input above &mdash; with burst firing when the two coincide. 10,000&ndash;30,000 spines. This is the cell that loses spines in schizophrenia and in chronic stress."},
   "m-pv":{t:"PV fast-spiking interneuron",d:"Compact, radially symmetric, aspiny dendrites and a dense local axonal plexus. No long-range projection: everything it does is local and fast. Kv3.1 channels permit 200 Hz firing; the perineuronal net (not drawn) encases it. Generates gamma."},
   "m-msn":{t:"Medium spiny neuron",d:"Radiating, densely spiny dendrites in a roughly spherical field &mdash; built to integrate convergent cortical input. Held at &minus;80 mV by Kir2 until enough cortical axons fire together. GABAergic, but a projection neuron."},
   "m-pkj":{t:"Purkinje cell",d:"Note the arbor is <b>flat</b> &mdash; confined to the parasagittal plane, so that granule cell parallel fibres can run perpendicular through thousands of them like wires through a row of trees. ~175,000 parallel fibre inputs, exactly one climbing fibre."},
   "m-da":{t:"Dopaminergic neuron",d:"A modest dendritic tree and an extraordinarily long, thin, unmyelinated, massively branched axon &mdash; a single human SNc neuron may support over a million synaptic varicosities and more than a metre of total axonal length. That bioenergetic burden, plus pacemaking calcium, is the leading account of its selective vulnerability."},
   /* synapse */
   "s-pre":{t:"Presynaptic terminal",d:"Glutamate is loaded into small clear vesicles by VGLUT1/2 using the vesicular proton gradient. Arrival of an action potential opens Ca<sub>v</sub>2.1/2.2; calcium binds synaptotagmin-1; SNARE proteins (syntaxin, SNAP-25, VAMP) drive fusion within a fraction of a millisecond. Botulinum toxin cleaves SNAREs; &alpha;<sub>2</sub>&delta; ligands (gabapentin, pregabalin) act on the calcium channel subunit."},
   "s-cleft":{t:"The synaptic cleft",d:"About 20 nm across. Glutamate peaks near 1 mM for under a millisecond, then falls by diffusion and astrocytic uptake. Resting extracellular glutamate is held near 1&ndash;3 &micro;M &mdash; a four-hundred-fold dynamic range maintained entirely by transporters, which is why transporter failure is catastrophic within minutes."},
   "s-post":{t:"Postsynaptic spine",d:"The postsynaptic density is a protein lattice (PSD-95, Shank, Homer) anchoring AMPA and NMDA receptors. LTP inserts AMPA receptors and enlarges the spine head; LTD removes them and shrinks it. Spine head volume tracks synaptic strength almost linearly &mdash; structure and function are the same variable here."},
   "s-nmda":{t:"NMDA receptor",d:"Requires glutamate, membrane depolarisation to expel the Mg<sup>2+</sup> plug, and a co-agonist (glycine or astrocytic D-serine). Three coincident conditions &mdash; a Hebbian detector built into a single protein. Ketamine, memantine, PCP, dextromethorphan, and nitrous oxide are open-channel blockers; protons inhibit it with an IC<sub>50</sub> near pH 7.3."},
   "s-ast":{t:"Astrocytic process",d:"The third element. EAAT2 clears ~90% of released glutamate using the sodium gradient; glutamine synthetase recycles it and disposes of ammonia; serine racemase supplies D-serine. In ischaemia the gradient collapses, EAAT2 reverses, and this process becomes a glutamate source instead of a sink."},
   /* receptor */
   "r-gpcr":{t:"G protein-coupled receptor (7TM)",d:"Seven transmembrane helices with an intracellular G protein interface. D<sub>2</sub>, 5-HT<sub>1A</sub>, 5-HT<sub>2A</sub>, &alpha;<sub>2A</sub>, H<sub>1</sub>, M<sub>1</sub>&ndash;M<sub>5</sub>, OX<sub>1/2</sub>R, CB<sub>1</sub>, and &mu;-opioid are all built this way. Slow (tens of milliseconds to seconds), amplifying, and capable of biased signalling &mdash; G protein versus &beta;-arrestin &mdash; which is how a partial agonist like aripiprazole can behave differently at the same receptor in different tissues."},
   "r-lgic":{t:"Pentameric ligand-gated ion channel",d:"Five subunits around a central pore &mdash; GABA<sub>A</sub>, nicotinic ACh, 5-HT<sub>3</sub>, and glycine receptors. Fast (sub-millisecond). Subunit composition determines pharmacology: GABA<sub>A</sub> &alpha;<sub>1</sub> gives sedation, &alpha;<sub>2</sub>/&alpha;<sub>3</sub> anxiolysis, &alpha;<sub>5</sub> memory effects, and &delta;-containing extrasynaptic receptors are neurosteroid-sensitive and benzodiazepine-insensitive."},
   "r-iglur":{t:"Ionotropic glutamate receptor (tetramer)",d:"Four subunits, each with three transmembrane segments and a re-entrant pore loop &mdash; architecturally unrelated to the pentameric family. AMPA (GluA1&ndash;4), NMDA (GluN1 + GluN2), and kainate receptors. GluA2 RNA editing sets calcium permeability; GluN2B-containing receptors are enriched extrasynaptically."},
   "r-slc6":{t:"SLC6 monoamine transporter (12TM)",d:"Twelve transmembrane helices alternating between outward-open and inward-open conformations. SERT, DAT, NET, GAT-1, and the choline transporter all belong to this family, and all use the inward sodium gradient as the energy source. Cocaine and SSRIs lock the transporter; amphetamine is a substrate that reverses it. Because they are sodium-coupled, <b>every one of them slows when serum sodium falls</b>."},
   /* axon */
   "a-myelin":{t:"Myelin internode",d:"Up to 50 of these per oligodendrocyte, each a spiral of compacted membrane about 70% lipid, held together by myelin basic protein and PLP. It raises conduction velocity 10&ndash;100 fold and reduces the energetic cost enormously, because only the nodes need to pump ions back."},
   "a-node":{t:"Node of Ranvier",d:"Na<sub>v</sub>1.6 clustered at 1,000&ndash;2,000 channels per &micro;m<sup>2</sup>, anchored by ankyrin-G, with Kv7.2/7.3 (KCNQ, the M-current) at the node and Kv1 hidden in the juxtaparanode. A demyelinated segment has almost no conduction safety factor &mdash; the reason a 0.5 &deg;C rise in temperature can block conduction outright (Uhthoff phenomenon)."},
   "a-olig":{t:"Oligodendrocyte soma",d:"One cell body, many processes, each ending in an internode on a different axon. It also feeds the axon lactate through MCT1 in the periaxonal space, which is why demyelination causes axonal degeneration and why disability in MS tracks axonal loss rather than lesion count. Highest iron content and low glutathione make this the most oxidatively vulnerable cell in the CNS."},
   "a-axon":{t:"Axon",d:"The conducting core. Beneath the myelin the membrane carries almost no sodium channels; current flows passively from node to node and regenerates only at the gaps. Sodium channel blockers (phenytoin, carbamazepine, lamotrigine, lacosamide) stabilise the inactivated state use-dependently &mdash; suppressing high-frequency firing while leaving normal traffic intact."}
  };

  (function init3D(){
    var wrap=$("nc-stage"); if(!wrap) return;
    var loadEl=$("nc-loading");

    (async function(){
      var THREE,OrbitControls,RoomEnvironment;
      try{
        THREE=await import('three');
        OrbitControls=(await import('three/addons/controls/OrbitControls.js')).OrbitControls;
        RoomEnvironment=(await import('three/addons/environments/RoomEnvironment.js')).RoomEnvironment;
      }catch(e){ if(loadEl) loadEl.textContent="Could not load the 3D engine. The rest of this section works normally."; return; }

      var canvas=$("nc-canvas");
      var renderer=new THREE.WebGLRenderer({canvas:canvas,antialias:true,alpha:true});
      renderer.setPixelRatio(Math.min(devicePixelRatio,2));
      renderer.outputColorSpace=THREE.SRGBColorSpace;
      renderer.toneMapping=THREE.ACESFilmicToneMapping; renderer.toneMappingExposure=1.05;
      var scene=new THREE.Scene();
      var cam=new THREE.PerspectiveCamera(40,1,0.1,4000);
      var pmrem=new THREE.PMREMGenerator(renderer);
      scene.environment=pmrem.fromScene(new RoomEnvironment(),0.04).texture;
      scene.add(new THREE.HemisphereLight(0xffffff,0xb9ad91,0.6));
      var d1=new THREE.DirectionalLight(0xffffff,1.05); d1.position.set(1,1.4,1.1); scene.add(d1);
      var d2=new THREE.DirectionalLight(0xffffff,0.4); d2.position.set(-1.2,-0.5,-0.9); scene.add(d2);
      var controls=new OrbitControls(cam,canvas);
      controls.enableDamping=true; controls.autoRotateSpeed=1.1;
      var root=new THREE.Group(); scene.add(root);

      function size(){var w=canvas.clientWidth,h=canvas.clientHeight; if(!w||!h)return;
        renderer.setSize(w,h,false); cam.aspect=w/h; cam.updateProjectionMatrix();}
      window.__ncResize=size;
      window.addEventListener("resize",size);

      /* ---- helpers ---- */
      function mat(hex,o){o=o||{};
        var m=new THREE.MeshStandardMaterial({color:new THREE.Color(hex),roughness:.45,metalness:0,envMapIntensity:.9});
        for(var k in o) m[k]=o[k]; return m;}
      var UP=new THREE.Vector3(0,1,0);
      function tube(a,b,r,material){
        var d=new THREE.Vector3().subVectors(b,a), len=d.length();
        if(len<1e-6) return null;
        var m=new THREE.Mesh(new THREE.CylinderGeometry(r,r*0.82,len,10),material);
        m.position.copy(a).addScaledVector(d,0.5);
        m.quaternion.setFromUnitVectors(UP,d.clone().normalize());
        return m;}
      var seed=1;
      function rnd(){ seed=(seed*16807)%2147483647; return seed/2147483647; }
      function label(text,color){
        var c=document.createElement("canvas"), pad=16, f=44;
        var ctx=c.getContext("2d"); ctx.font="600 "+f+"px system-ui, sans-serif";
        var w=Math.ceil(ctx.measureText(text).width)+pad*2;
        c.width=w; c.height=f+pad*2;
        ctx=c.getContext("2d"); ctx.font="600 "+f+"px system-ui, sans-serif";
        ctx.fillStyle="rgba(251,247,238,0.92)";
        ctx.strokeStyle="rgba(207,200,186,1)"; ctx.lineWidth=3;
        var r=14;
        ctx.beginPath();
        ctx.moveTo(r,0); ctx.lineTo(c.width-r,0); ctx.quadraticCurveTo(c.width,0,c.width,r);
        ctx.lineTo(c.width,c.height-r); ctx.quadraticCurveTo(c.width,c.height,c.width-r,c.height);
        ctx.lineTo(r,c.height); ctx.quadraticCurveTo(0,c.height,0,c.height-r);
        ctx.lineTo(0,r); ctx.quadraticCurveTo(0,0,r,0); ctx.closePath();
        ctx.fill(); ctx.stroke();
        ctx.fillStyle=color||"#231e14"; ctx.textBaseline="middle";
        ctx.fillText(text,pad,c.height/2+2);
        var tex=new THREE.CanvasTexture(c); tex.colorSpace=THREE.SRGBColorSpace;
        var sp=new THREE.Sprite(new THREE.SpriteMaterial({map:tex,depthTest:false,transparent:true}));
        sp.scale.set(c.width/c.height*3.2,3.2,1);
        sp.renderOrder=999; sp.userData.isLabel=true;
        return sp;}

      /* recursive dendritic tree */
      function tree(group,material,origin,dir,len,rad,depth,spread,flat){
        if(depth<=0||rad<0.05) return;
        var end=origin.clone().addScaledVector(dir,len);
        var t=tube(origin,end,rad,material); if(t) group.add(t);
        if(depth===1) return;
        var n=(rnd()<0.22)?3:2;
        for(var i=0;i<n;i++){
          var nd=dir.clone();
          var ax=new THREE.Vector3(rnd()-0.5, rnd()-0.5, flat?(rnd()-0.5)*0.12:(rnd()-0.5)).normalize();
          nd.applyAxisAngle(ax, (rnd()*0.55+0.25)*spread).normalize();
          if(flat) { nd.z*=0.16; nd.normalize(); }
          tree(group,material,end,nd,len*(0.68+rnd()*0.16),rad*0.68,depth-1,spread,flat);
        }
      }

      /* ---- pickables ---- */
      var picks=[], current3D=null, spin=false;
      function clearRoot(){
        while(root.children.length){
          var o=root.children.pop();
          o.traverse(function(x){
            if(x.geometry) x.geometry.dispose();
            if(x.material){ if(x.material.map) x.material.map.dispose(); x.material.dispose(); }
          });
        }
        picks=[];
      }
      function tag(mesh,key){
        if(!mesh) return mesh;
        mesh.userData.key=key;
        mesh.userData.base=mesh.material.color.clone();
        mesh.userData.baseEmi=mesh.material.emissiveIntensity||0;
        mesh.userData.baseEmiC=(mesh.material.emissive?mesh.material.emissive.clone():new THREE.Color("#000"));
        picks.push(mesh); return mesh; }

      /* ================= MODEL: morphology ================= */
      function buildMorph(){
        seed=7;
        var xs=[-46,-24,-4,17,42];
        // 1 pyramidal
        (function(){
          var g=new THREE.Group(); g.position.x=xs[0];
          var m=mat("#3b4fa0");
          var soma=new THREE.Mesh(new THREE.ConeGeometry(2.6,6,14),m);
          soma.position.y=0; g.add(tag(soma,"m-pyr"));
          tree(g,m,new THREE.Vector3(0,3,0),new THREE.Vector3(0,1,0),9,0.85,5,0.55,false);
          for(var i=0;i<6;i++){
            var a=(i/6)*Math.PI*2;
            tree(g,m,new THREE.Vector3(0,-2.4,0),new THREE.Vector3(Math.cos(a)*0.9,-0.45,Math.sin(a)*0.9).normalize(),5.5,0.6,4,0.6,false);
          }
          var ax=tube(new THREE.Vector3(0,-3,0),new THREE.Vector3(0,-20,0),0.42,mat("#25316b")); g.add(tag(ax,"m-pyr"));
          var l=label("Pyramidal","#25316b"); l.position.set(0,26,0); g.add(l);
          root.add(g);
        })();
        // 2 PV interneuron
        (function(){
          var g=new THREE.Group(); g.position.x=xs[1];
          var m=mat("#0d9488");
          var soma=new THREE.Mesh(new THREE.SphereGeometry(2.5,20,16),m); g.add(tag(soma,"m-pv"));
          for(var i=0;i<7;i++){
            var a=(i/7)*Math.PI*2, e=(rnd()-0.5)*1.4;
            tree(g,m,new THREE.Vector3(0,0,0),new THREE.Vector3(Math.cos(a),e,Math.sin(a)).normalize(),5,0.55,4,0.7,false);
          }
          var plex=new THREE.Mesh(new THREE.SphereGeometry(7.6,20,16),mat("#0d9488",{transparent:true,opacity:0.13,depthWrite:false}));
          plex.position.y=-1; g.add(plex);
          var l=label("PV interneuron","#08635c"); l.position.set(0,26,0); g.add(l);
          root.add(g);
        })();
        // 3 medium spiny neuron
        (function(){
          var g=new THREE.Group(); g.position.x=xs[2];
          var m=mat("#cf6b3a");
          var soma=new THREE.Mesh(new THREE.SphereGeometry(2.3,20,16),m); g.add(tag(soma,"m-msn"));
          for(var i=0;i<8;i++){
            var a=(i/8)*Math.PI*2, e=(i%2?0.75:-0.5);
            tree(g,m,new THREE.Vector3(0,0,0),new THREE.Vector3(Math.cos(a),e,Math.sin(a)).normalize(),5.6,0.55,4,0.5,false);
          }
          var ax=tube(new THREE.Vector3(0,-2,0),new THREE.Vector3(-3,-19,1),0.36,mat("#94441c")); g.add(tag(ax,"m-msn"));
          var l=label("Medium spiny","#94441c"); l.position.set(0,26,0); g.add(l);
          root.add(g);
        })();
        // 4 Purkinje
        (function(){
          var g=new THREE.Group(); g.position.x=xs[3];
          var m=mat("#7a6cae");
          var soma=new THREE.Mesh(new THREE.SphereGeometry(2.7,20,16),m); soma.scale.set(1,1.15,0.85); g.add(tag(soma,"m-pkj"));
          tree(g,m,new THREE.Vector3(0,2.4,0),new THREE.Vector3(0,1,0),6.5,1.05,6,0.75,true);
          var ax=tube(new THREE.Vector3(0,-2.6,0),new THREE.Vector3(0,-18,0),0.36,mat("#4d4082")); g.add(tag(ax,"m-pkj"));
          // parallel fibres
          var pf=mat("#b5892f",{transparent:true,opacity:0.55});
          for(var i=0;i<7;i++){
            var y=8+i*3.1;
            var f=new THREE.Mesh(new THREE.CylinderGeometry(0.12,0.12,26,6),pf);
            f.rotation.x=Math.PI/2; f.position.set((rnd()-0.5)*8,y,0); g.add(f);
          }
          var l=label("Purkinje","#4d4082"); l.position.set(0,32,0); g.add(l);
          root.add(g);
        })();
        // 5 dopaminergic
        (function(){
          var g=new THREE.Group(); g.position.x=xs[4];
          var m=mat("#e2542f");
          var soma=new THREE.Mesh(new THREE.SphereGeometry(2.4,20,16),m); soma.scale.set(1.35,1,0.9); g.add(tag(soma,"m-da"));
          for(var i=0;i<4;i++){
            var a=(i/4)*Math.PI*2;
            tree(g,m,new THREE.Vector3(0,0,0),new THREE.Vector3(Math.cos(a),(i%2?0.5:-0.4),Math.sin(a)).normalize(),6,0.5,3,0.5,false);
          }
          // long branching axon
          var am=mat("#a63a1d");
          var pts=[new THREE.Vector3(0,2.2,0)];
          var p=new THREE.Vector3(0,2.2,0);
          for(var s=0;s<9;s++){ p=p.clone().add(new THREE.Vector3((rnd()-0.5)*2.2,2.6,(rnd()-0.5)*2.2)); pts.push(p); }
          for(var s=0;s<pts.length-1;s++){ var t2=tube(pts[s],pts[s+1],0.3,am); g.add(tag(t2,"m-da")); }
          // varicosities + terminal arbor
          var vm=mat("#e2542f",{emissive:new THREE.Color("#e2542f"),emissiveIntensity:0.25});
          for(var v=0;v<5;v++){
            var base=pts[pts.length-1].clone();
            var dir=new THREE.Vector3((rnd()-0.5)*1.6,0.9,(rnd()-0.5)*1.6).normalize();
            tree(g,am,base,dir,4.2,0.22,4,0.9,false);
          }
          for(var v=0;v<46;v++){
            var b=new THREE.Mesh(new THREE.SphereGeometry(0.42,8,6),vm);
            b.position.copy(pts[pts.length-1]).add(new THREE.Vector3((rnd()-0.5)*13,rnd()*9,(rnd()-0.5)*13));
            g.add(b);
          }
          var l=label("Dopaminergic","#a63a1d"); l.position.set(0,42,0); g.add(l);
          root.add(g);
        })();
        return {dist:118, target:new THREE.Vector3(0,6,0)};
      }

      /* ================= MODEL: synapse ================= */
      function buildSynapse(){
        seed=31;
        var g=new THREE.Group(); root.add(g);
        // presynaptic bouton
        var pre=new THREE.Mesh(new THREE.SphereGeometry(11,32,24),mat("#3b4fa0",{transparent:true,opacity:0.34,depthWrite:false,side:THREE.DoubleSide}));
        pre.position.set(0,13,0); pre.scale.set(1.15,0.95,1.15); g.add(tag(pre,"s-pre"));
        var axin=tube(new THREE.Vector3(0,34,0),new THREE.Vector3(0,20,0),2.6,mat("#3b4fa0",{transparent:true,opacity:0.34,depthWrite:false}));
        g.add(axin);
        // vesicles
        var vm=mat("#e2542f",{emissive:new THREE.Color("#e2542f"),emissiveIntensity:0.18});
        for(var i=0;i<34;i++){
          var v=new THREE.Mesh(new THREE.SphereGeometry(1.05,12,10),vm);
          var a=rnd()*Math.PI*2, r=rnd()*7.4, y=13+(rnd()-0.4)*8;
          v.position.set(Math.cos(a)*r,y,Math.sin(a)*r); g.add(v);
        }
        // docked vesicles + fusing
        for(var i=0;i<5;i++){
          var v=new THREE.Mesh(new THREE.SphereGeometry(1.05,12,10),vm);
          v.position.set((i-2)*2.6,4.3,(rnd()-0.5)*3); g.add(v);
        }
        // cleft
        var cleft=new THREE.Mesh(new THREE.CylinderGeometry(10,10,2.4,40,1,true),
          mat("#8b6914",{transparent:true,opacity:0.16,side:THREE.DoubleSide,depthWrite:false}));
        cleft.position.set(0,2.1,0); g.add(tag(cleft,"s-cleft"));
        // glutamate in cleft
        var gm=mat("#0d9488",{emissive:new THREE.Color("#0d9488"),emissiveIntensity:0.3});
        for(var i=0;i<26;i++){
          var v=new THREE.Mesh(new THREE.SphereGeometry(0.42,8,6),gm);
          var a=rnd()*Math.PI*2, r=rnd()*8.6;
          v.position.set(Math.cos(a)*r,1.4+rnd()*1.6,Math.sin(a)*r); g.add(v);
        }
        // postsynaptic spine
        var head=new THREE.Mesh(new THREE.SphereGeometry(9,32,24),mat("#b0567a",{transparent:true,opacity:0.36,depthWrite:false,side:THREE.DoubleSide}));
        head.position.set(0,-7.5,0); head.scale.set(1.15,0.9,1.15); g.add(tag(head,"s-post"));
        var neck=tube(new THREE.Vector3(0,-13,0),new THREE.Vector3(0,-24,0),2.1,mat("#b0567a",{transparent:true,opacity:0.36,depthWrite:false})); g.add(neck);
        var dend=new THREE.Mesh(new THREE.CylinderGeometry(4.6,4.6,34,20),mat("#b0567a",{transparent:true,opacity:0.3,depthWrite:false}));
        dend.rotation.z=Math.PI/2; dend.position.set(0,-28,0); g.add(dend);
        // PSD + receptors
        var psd=new THREE.Mesh(new THREE.CylinderGeometry(7.4,7.4,0.8,36),mat("#7d3352"));
        psd.position.set(0,0.6,0); g.add(tag(psd,"s-post"));
        var ampaM=mat("#e0a02e"), nmdaM=mat("#0d9488",{emissive:new THREE.Color("#0d9488"),emissiveIntensity:0.2});
        for(var i=0;i<9;i++){
          var a=(i/9)*Math.PI*2, r=5.4;
          var rec=new THREE.Mesh(new THREE.CylinderGeometry(1.05,1.4,3.2,10),ampaM);
          rec.position.set(Math.cos(a)*r,1.7,Math.sin(a)*r); g.add(rec);
        }
        for(var i=0;i<4;i++){
          var a=(i/4)*Math.PI*2+0.4, r=2.4;
          var rec=new THREE.Mesh(new THREE.CylinderGeometry(1.25,1.6,3.8,12),nmdaM);
          rec.position.set(Math.cos(a)*r,1.9,Math.sin(a)*r); g.add(tag(rec,"s-nmda"));
        }
        // astrocyte process
        var astM=mat("#3f9b90",{transparent:true,opacity:0.5,side:THREE.DoubleSide,depthWrite:false});
        var ast=new THREE.Mesh(new THREE.CylinderGeometry(15.5,15.5,17,40,1,true),astM);
        ast.position.set(0,3.5,0); g.add(tag(ast,"s-ast"));
        for(var i=0;i<7;i++){
          var a=(i/7)*Math.PI*2;
          var f=tube(new THREE.Vector3(Math.cos(a)*15.4,4,Math.sin(a)*15.4),
                     new THREE.Vector3(Math.cos(a)*23,8+rnd()*5,Math.sin(a)*23),1.5,astM);
          g.add(tag(f,"s-ast"));
        }
        // EAAT2 markers on astro
        var em=mat("#276c64");
        for(var i=0;i<10;i++){
          var a=(i/10)*Math.PI*2;
          var e=new THREE.Mesh(new THREE.BoxGeometry(1.5,3.4,1.5),em);
          e.position.set(Math.cos(a)*15.5,2+rnd()*6,Math.sin(a)*15.5); g.add(tag(e,"s-ast"));
        }
        var l1=label("Presynaptic terminal","#25316b"); l1.position.set(0,30,0); g.add(l1);
        var l2=label("Astrocyte (EAAT2)","#276c64"); l2.position.set(24,16,0); g.add(l2);
        var l3=label("Postsynaptic spine","#7d3352"); l3.position.set(0,-32,0); g.add(l3);
        var l4=label("Cleft ~20 nm","#8b6914"); l4.position.set(-20,2,0); g.add(l4);
        return {dist:108, target:new THREE.Vector3(0,0,0)};
      }

      /* ================= MODEL: receptors ================= */
      function buildReceptor(){
        seed=99;
        var g=new THREE.Group(); root.add(g);
        var lip=mat("#e0d3b6",{transparent:true,opacity:0.42,side:THREE.DoubleSide,depthWrite:false});
        var slab=new THREE.Mesh(new THREE.BoxGeometry(150,12,44),lip); g.add(slab);
        var headM=mat("#cfc8ba",{transparent:true,opacity:0.5,depthWrite:false});
        [6.6,-6.6].forEach(function(y){
          var p=new THREE.Mesh(new THREE.BoxGeometry(150,1.4,44),headM); p.position.y=y; g.add(p);
        });
        function helix(x,z,tilt,h,r,m){
          var c=new THREE.Mesh(new THREE.CylinderGeometry(r,r,h,14),m);
          c.position.set(x,0,z); c.rotation.z=tilt; c.rotation.x=tilt*0.4; return c;
        }
        // GPCR — 7TM
        (function(){
          var m=mat("#e2542f"), X=-56;
          for(var i=0;i<7;i++){
            var a=(i/7)*Math.PI*2;
            g.add(tag(helix(X+Math.cos(a)*3.4,Math.sin(a)*3.4,(rnd()-0.5)*0.22,17,1.5,m),"r-gpcr"));
          }
          var lig=new THREE.Mesh(new THREE.SphereGeometry(1.9,14,12),mat("#0d9488",{emissive:new THREE.Color("#0d9488"),emissiveIntensity:0.3}));
          lig.position.set(X,4.5,0); g.add(tag(lig,"r-gpcr"));
          var gp=new THREE.Mesh(new THREE.SphereGeometry(4.4,18,14),mat("#a63a1d",{transparent:true,opacity:0.75}));
          gp.position.set(X,-12.5,0); gp.scale.set(1.5,0.8,1); g.add(tag(gp,"r-gpcr"));
          var l=label("GPCR (7TM)","#a63a1d"); l.position.set(X,22,0); g.add(l);
        })();
        // pentameric LGIC
        (function(){
          var m=mat("#0d9488"), X=-16;
          for(var s=0;s<5;s++){
            var a=(s/5)*Math.PI*2;
            for(var i=0;i<4;i++){
              var b=a+(i-1.5)*0.16;
              var rr=5.2+ (i===1?0.5:0);
              g.add(tag(helix(X+Math.cos(b)*rr,Math.sin(b)*rr,0,18,1.15,m),"r-lgic"));
            }
            var ecd=new THREE.Mesh(new THREE.CylinderGeometry(2.2,2.6,11,10),mat("#08635c",{transparent:true,opacity:0.85}));
            ecd.position.set(X+Math.cos(a)*5.0,14.5,Math.sin(a)*5.0); g.add(tag(ecd,"r-lgic"));
          }
          var pore=new THREE.Mesh(new THREE.CylinderGeometry(1.5,1.5,20,14),mat("#fbf7ee",{transparent:true,opacity:0.55}));
          pore.position.set(X,1,0); g.add(pore);
          var l=label("Pentameric LGIC","#08635c"); l.position.set(X,26,0); g.add(l);
        })();
        // ionotropic glutamate receptor — tetramer
        (function(){
          var m=mat("#3b4fa0"), X=22;
          for(var s=0;s<4;s++){
            var a=(s/4)*Math.PI*2+0.4;
            for(var i=0;i<3;i++){
              var b=a+(i-1)*0.22;
              g.add(tag(helix(X+Math.cos(b)*4.6,Math.sin(b)*4.6,0,17,1.25,m),"r-iglur"));
            }
            var lbd=new THREE.Mesh(new THREE.SphereGeometry(3.1,16,12),mat("#25316b",{transparent:true,opacity:0.85}));
            lbd.position.set(X+Math.cos(a)*4.2,13,Math.sin(a)*4.2); g.add(tag(lbd,"r-iglur"));
            var atd=new THREE.Mesh(new THREE.SphereGeometry(2.6,14,10),mat("#3b4fa0",{transparent:true,opacity:0.6}));
            atd.position.set(X+Math.cos(a)*3.2,20,Math.sin(a)*3.2); g.add(tag(atd,"r-iglur"));
          }
          var mg=new THREE.Mesh(new THREE.SphereGeometry(1.5,12,10),mat("#8b6914",{emissive:new THREE.Color("#8b6914"),emissiveIntensity:0.35}));
          mg.position.set(X,1.5,0); g.add(tag(mg,"r-iglur"));
          var l=label("Ionotropic GluR (Mg²⁺ block)","#25316b"); l.position.set(X,28,0); g.add(l);
        })();
        // SLC6 transporter — 12 TM
        (function(){
          var m=mat("#e14f97"), X=62;
          for(var i=0;i<12;i++){
            var a=(i/12)*Math.PI*2, rr=(i%2)?4.6:3.2;
            g.add(tag(helix(X+Math.cos(a)*rr,Math.sin(a)*rr,(rnd()-0.5)*0.3,17,1.15,m),"r-slc6"));
          }
          var sub=new THREE.Mesh(new THREE.SphereGeometry(1.7,14,12),mat("#0d9488",{emissive:new THREE.Color("#0d9488"),emissiveIntensity:0.3}));
          sub.position.set(X,3,0); g.add(tag(sub,"r-slc6"));
          [[-2.4,6.2],[2.4,6.2]].forEach(function(p){
            var na=new THREE.Mesh(new THREE.SphereGeometry(1.1,12,10),mat("#e0a02e",{emissive:new THREE.Color("#e0a02e"),emissiveIntensity:0.3}));
            na.position.set(X+p[0],p[1],1.6); g.add(tag(na,"r-slc6"));
          });
          var l=label("SLC6 transporter (12TM)","#a82e6c"); l.position.set(X,22,0); g.add(l);
        })();
        var lo=label("extracellular","#8a8065"); lo.position.set(-84,9,0); g.add(lo);
        var li=label("cytoplasm","#8a8065"); li.position.set(-84,-11,0); g.add(li);
        return {dist:180, target:new THREE.Vector3(0,3,0)};
      }

      /* ================= MODEL: myelinated axon ================= */
      function buildAxon(){
        seed=5;
        var g=new THREE.Group(); root.add(g);
        var axM=mat("#cfc8ba");
        var axon=new THREE.Mesh(new THREE.CylinderGeometry(2.4,2.4,150,24),axM);
        axon.rotation.z=Math.PI/2; g.add(tag(axon,"a-axon"));
        var myM=mat("#5f52a0",{roughness:.4});
        var nodeM=mat("#e2542f",{emissive:new THREE.Color("#e2542f"),emissiveIntensity:0.28});
        var xs=[-52,-16,20,56];
        xs.forEach(function(x){
          var seg=new THREE.Mesh(new THREE.CylinderGeometry(5.6,5.6,30,26,1,false),myM);
          seg.rotation.z=Math.PI/2; seg.position.x=x; g.add(tag(seg,"a-myelin"));
          // paranodal taper
          [-1,1].forEach(function(s){
            var t=new THREE.Mesh(new THREE.CylinderGeometry(5.6,2.9,4,22),myM);
            t.rotation.z=s*Math.PI/2; t.position.x=x+s*17; g.add(tag(t,"a-myelin"));
          });
        });
        // nodes
        [-34,2,38].forEach(function(x){
          var nd=new THREE.Mesh(new THREE.CylinderGeometry(2.9,2.9,5,20),nodeM);
          nd.rotation.z=Math.PI/2; nd.position.x=x; g.add(tag(nd,"a-node"));
          for(var i=0;i<16;i++){
            var a=(i/16)*Math.PI*2;
            var ch=new THREE.Mesh(new THREE.CylinderGeometry(0.42,0.42,1.6,8),mat("#a63a1d"));
            ch.position.set(x+(rnd()-0.5)*3.4,Math.cos(a)*3.1,Math.sin(a)*3.1);
            ch.quaternion.setFromUnitVectors(UP,new THREE.Vector3(0,Math.cos(a),Math.sin(a)));
            g.add(tag(ch,"a-node"));
          }
        });
        // oligodendrocyte
        var oM=mat("#4d4082");
        var soma=new THREE.Mesh(new THREE.SphereGeometry(6.4,24,18),oM);
        soma.position.set(-2,36,-8); g.add(tag(soma,"a-olig"));
        var nuc=new THREE.Mesh(new THREE.SphereGeometry(3.2,18,14),mat("#7a6cae"));
        nuc.position.copy(soma.position); g.add(nuc);
        xs.forEach(function(x){
          var p=tube(soma.position.clone(),new THREE.Vector3(x,6.4,-1),1.5,oM); g.add(tag(p,"a-olig"));
        });
        // a second, unmyelinated axon for contrast
        var un=new THREE.Mesh(new THREE.CylinderGeometry(2.2,2.2,150,18),mat("#b0567a",{transparent:true,opacity:0.7}));
        un.rotation.z=Math.PI/2; un.position.set(0,-22,6); g.add(un);
        var l1=label("Oligodendrocyte","#4d4082"); l1.position.set(-2,50,-8); g.add(l1);
        var l2=label("Node of Ranvier · Na∨1.6","#a63a1d"); l2.position.set(2,-9,0); g.add(l2);
        var l3=label("Myelin internode","#4d4082"); l3.position.set(-52,14,0); g.add(l3);
        var l4=label("Unmyelinated axon — continuous, slow, costly","#7d3352"); l4.position.set(0,-30,6); g.add(l4);
        return {dist:160, target:new THREE.Vector3(0,6,0)};
      }

      var BUILD={morph:buildMorph,synapse:buildSynapse,receptor:buildReceptor,axon:buildAxon};

      function setModel(key){
        if(!BUILD[key]) key="morph";
        current3D=key;
        clearRoot();
        var meta=MODEL_META[key];
        $("nc-mname").innerHTML=meta.name;
        $("nc-mhint").innerHTML=meta.hint;
        $("nc-minfo").innerHTML='<p class="nc-mplaceholder">Click a labelled part of the model.</p>';
        var btns=document.querySelectorAll(".nc-mbtn");
        for(var i=0;i<btns.length;i++) btns[i].classList.toggle("active",btns[i].getAttribute("data-model")===key);
        var cfg=BUILD[key]();
        controls.target.copy(cfg.target);
        cam.position.set(cfg.dist*0.62,cfg.dist*0.34,cfg.dist*0.78);
        controls.update();
        if(loadEl) loadEl.style.display="none";
        size();
      }
      window.__ncSetModel=setModel;

      /* picking */
      var ray=new THREE.Raycaster(), ptr=new THREE.Vector2(), hoverKey=null, selKey=null;
      function pick(ev){
        var r=canvas.getBoundingClientRect();
        ptr.x=((ev.clientX-r.left)/r.width)*2-1; ptr.y=-((ev.clientY-r.top)/r.height)*2+1;
        ray.setFromCamera(ptr,cam);
        var hit=ray.intersectObjects(picks,false);
        return hit.length?hit[0].object.userData.key:null;
      }
      function paint(){
        picks.forEach(function(m){
          if(!m.userData.base) return;
          var on=(m.userData.key===selKey)||(m.userData.key===hoverKey);
          m.material.color.copy(on?new THREE.Color("#0d9488"):m.userData.base);
          m.material.emissive.copy(on?new THREE.Color("#0d9488"):m.userData.baseEmiC);
          m.material.emissiveIntensity=on?0.34:m.userData.baseEmi;
        });
      }
      canvas.addEventListener("pointermove",function(ev){
        var k=pick(ev); if(k!==hoverKey){hoverKey=k; paint(); canvas.style.cursor=k?"pointer":"grab";}
      });
      canvas.addEventListener("click",function(ev){
        var k=pick(ev); if(!k) return; selKey=k; paint();
        var info=INFO[k]; if(!info) return;
        $("nc-minfo").innerHTML='<h4>'+info.t+'</h4><p>'+info.d+'</p>';
      });

      $("nc-reset").onclick=function(){ setModel(current3D); };
      var spinBox=$("nc-spin");
      if(spinBox) spinBox.onchange=function(e){ controls.autoRotate=e.target.checked; };
      var mbtns=document.querySelectorAll(".nc-mbtn");
      for(var i=0;i<mbtns.length;i++){
        (function(b){ b.onclick=function(){ setModel(b.getAttribute("data-model")); }; })(mbtns[i]);
      }

      setModel("morph");
      (function loop(){ requestAnimationFrame(loop); controls.update(); renderer.render(scene,cam); })();
      setTimeout(size,60);
    })();
  })();

  function setModel(k){ if(window.__ncSetModel) window.__ncSetModel(k); }

  /* ---------------------------------------------------------------
     BOOT
  ----------------------------------------------------------------*/
  buildRail();
  buildTables();
  buildQuick();
  select("da");
  var tb=document.querySelectorAll(".nc-tabbtn");
  for(var i=0;i<tb.length;i++){
    (function(b){ b.onclick=function(){ goTab(b.getAttribute("data-tab")); }; })(tb[i]);
  }
  goTab("atlas");
})();
