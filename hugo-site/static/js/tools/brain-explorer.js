(function(){
  if(window.__beInit) return; window.__beInit=true;
  var $=function(id){return document.getElementById(id);};

  var STRUCTS=[
   {id:"dlpfc",cat:"Cortical",name:"Dorsolateral Prefrontal Cortex",abbr:"DLPFC",color:"#3b4fa0",system:"Dopamine · stimulant-sensitive",why:"Left DLPFC is the standard rTMS target for depression; hypofrontality here underlies cognitive symptoms of schizophrenia and ADHD.",note:"Anterior + posterior middle frontal gyrus (BA 9/46)."},
   {id:"ofc-vmpfc",cat:"Cortical",name:"Orbitofrontal / Ventromedial PFC",abbr:"OFC/vmPFC",color:"#6d8f3a",system:"Serotonin",why:"Hyperactive OFC–striatal loops in OCD respond to high-dose SSRIs; vmPFC restrains the amygdala.",note:"Lateral orbital gyrus, gyrus rectus, orbital inferior frontal gyrus."},
   {id:"acc",cat:"Cortical",name:"Anterior Cingulate Cortex",abbr:"ACC",color:"#b5892f",system:"Serotonin · dopamine · salience",why:"Rostral ACC activity predicts SSRI response; subgenual ACC (BA 25) is the classic DBS target for treatment-resistant depression.",note:"Rostral + caudal anterior cingulate gyrus."},
   {id:"amygdala",cat:"Limbic",name:"Amygdala",abbr:"AMY",color:"#b0567a",system:"Serotonin · noradrenaline",why:"Hyperreactive across anxiety, PTSD and depression; reactivity normalises with successful SSRI or exposure therapy.",note:"Expert-segmented (bilateral)."},
   {id:"hippocampus",cat:"Limbic",name:"Hippocampus",abbr:"HPC",color:"#3f9b90",system:"Serotonin · glucocorticoid",why:"Chronic antidepressants and ketamine promote hippocampal neurogenesis — a leading account of the delayed onset of SSRI benefit.",note:"Expert-segmented (bilateral)."},
   {id:"nacc",cat:"Dopaminergic",name:"Nucleus Accumbens / Ventral Striatum",abbr:"NAcc",color:"#e0a02e",system:"Dopamine · reward",why:"Final common substrate for reward and addiction; aberrant salience here underlies positive psychotic symptoms.",note:"Nucleus accumbens, expert-segmented (bilateral)."},
   {id:"dstriatum",cat:"Dopaminergic",name:"Dorsal Striatum (Caudate & Putamen)",abbr:"STR",color:"#cf6b3a",system:"Dopamine · antipsychotic",why:"D2 blockade here causes extrapyramidal side-effects and tardive dyskinesia — the site of antipsychotic motor toxicity.",note:"Caudate + putamen, expert-segmented (bilateral)."},
   {id:"lc-thal",cat:"Thalamic",name:"Thalamus (Mediodorsal nucleus)",abbr:"MD",color:"#7a6cae",system:"Glutamatergic relay",why:"MD thalamus is the principal thalamic partner of the PFC; volume loss in schizophrenia.",note:"Real dorsomedial (mediodorsal) nucleus, shown embedded in the full thalamic nuclei complex."},
   {id:"vta-snc",cat:"Brainstem nuclei",name:"VTA & Substantia Nigra pars compacta",abbr:"VTA/SNc",color:"#e2542f",system:"Dopamine source",why:"Origin of all four dopamine pathways — one D2 mechanism, four clinical consequences.",note:"Real substantia nigra mesh + bilateral VTA markers medial to it."},
   {id:"raphe",cat:"Brainstem nuclei",name:"Raphe Nuclei",abbr:"DRN/MRN",color:"#e14f97",system:"Serotonin source",why:"5-HT1A autoreceptor desensitisation here over 2–4 weeks explains the therapeutic lag of SSRIs.",note:"Paired paramedian markers along the midline brainstem."},
   {id:"lc",cat:"Brainstem nuclei",name:"Locus Coeruleus",abbr:"LC",color:"#2f6fb0",system:"Noradrenaline source",why:"Sole source of cortical noradrenaline; hyperactivity maps to hyperarousal and panic. α2 agonists dampen its firing.",note:"Bilateral paired markers, dorsal rostral pons."},
   {id:"broca",cat:"Classic lesion sites",name:"Broca's Area (left inferior frontal gyrus)",abbr:"Broca",color:"#c8791f",system:"Language · speech production",why:"Damage here — patient \"Tan\" (Leborgne), described by Paul Broca in 1861 — produces expressive, non-fluent aphasia: effortful, agrammatic speech with relatively preserved comprehension. The founding demonstration of cortical localization and left-hemisphere language dominance.",note:"Schematic marker on the left inferior frontal gyrus (Broca's area, BA 44/45). Approximate teaching placement, not expert-segmented."},
   {id:"wernicke",cat:"Classic lesion sites",name:"Wernicke's Area (left posterior superior temporal gyrus)",abbr:"Wernicke",color:"#7a3fa0",system:"Language · comprehension",why:"Damage produces fluent aphasia — smooth, effortless speech full of paraphasias with impaired comprehension. Carl Wernicke (1874) used it to show that comprehension and production are anatomically distinct, and to propose the first connectionist model of language.",note:"Schematic marker on the left posterior superior temporal gyrus (Wernicke's area, BA 22). Approximate teaching placement."},
   {id:"callosum",cat:"Classic lesion sites",name:"Corpus Callosum",abbr:"CC",color:"#2f7fb0",system:"Interhemispheric commissure",why:"Surgical section (split-brain surgery; Sperry & Gazzaniga) reveals two semi-independent hemispheres in one skull; congenital absence (Kim Peek) illustrates atypical connectivity. ~200 million axons link the hemispheres.",note:"Midsagittal schematic arch of the corpus callosum. Approximate geometry for teaching."}
  ];
  var cmap={}; STRUCTS.forEach(function(s){cmap[s.id]=s;});

  var LOCBASE={
  lat:`<path d="M20,84 C20,48 48,28 90,24 C134,20 178,26 206,48 C224,62 226,84 214,98 C196,112 150,113 118,112 C84,112 42,108 26,96 C20,90 18,88 20,84 Z" fill="#e7dcc4" stroke="#c3b48f" stroke-width="1.4"/><path d="M150,108 C154,120 156,132 158,140 C150,138 146,126 146,114 C146,108 148,106 150,108 Z" fill="#e0d3b6" stroke="#c3b48f" stroke-width="1"/><path d="M158,104 C176,100 200,104 210,114 C218,122 214,134 198,138 C182,142 162,140 154,130 C158,122 158,112 158,104 Z" fill="#ddd0b2" stroke="#c3b48f" stroke-width="1"/><path d="M40,86 C90,78 150,72 196,70" fill="none" stroke="#c9bb95" stroke-width="1"/><path d="M120,30 C116,54 120,74 130,92" fill="none" stroke="#c9bb95" stroke-width="1"/>`,
  sag:`<path d="M20,84 C20,48 48,28 90,24 C134,20 178,26 206,48 C224,62 226,84 214,98 C196,112 150,113 118,112 C84,112 42,108 26,96 C20,90 18,88 20,84 Z" fill="#e7dcc4" stroke="#c3b48f" stroke-width="1.4"/><path d="M78,70 C74,60 84,54 100,52 C128,48 156,50 174,60 C182,64 184,72 178,78 C170,72 150,62 124,60 C104,58 88,62 82,72 Z" fill="#f0e7d3" stroke="#c9bb95" stroke-width="1"/><path d="M146,108 C150,120 154,132 158,140 C150,138 145,126 144,114 C144,108 144,106 146,108 Z" fill="#e0d3b6" stroke="#c3b48f" stroke-width="1"/><path d="M158,104 C176,100 200,104 210,114 C218,122 214,134 198,138 C182,142 162,140 154,130 C158,122 158,112 158,104 Z" fill="#ddd0b2" stroke="#c3b48f" stroke-width="1"/><ellipse cx="120" cy="82" rx="16" ry="12" fill="#e2d6bb" stroke="#c3b48f" stroke-width="1"/>`,
  axi:`<path d="M120,12 C152,12 182,30 194,66 C202,92 198,122 176,138 C160,150 140,150 120,150 C100,150 80,150 64,138 C42,122 38,92 46,66 C58,30 88,12 120,12 Z" fill="#e7dcc4" stroke="#c3b48f" stroke-width="1.4"/><line x1="120" y1="16" x2="120" y2="146" stroke="#c9bb95" stroke-width="1.2"/><ellipse cx="120" cy="84" rx="40" ry="30" fill="#efe6d2" stroke="#c9bb95" stroke-width="1"/>`
  };
  var LOCLABEL={lat:"Lateral",sag:"Sagittal",axi:"Superior (axial)"};
  var HLMAP={
   dlpfc:{view:"lat",hs:[[74,50,16,11]]}, acc:{view:"sag",hs:[[96,62,13,8]]},
   "ofc-vmpfc":{view:"lat",hs:[[58,92,15,9]]}, amygdala:{view:"sag",hs:[[100,96,9,7]]},
   hippocampus:{view:"sag",hs:[[116,98,11,7]]}, nacc:{view:"sag",hs:[[78,90,8,7]]},
   "vta-snc":{view:"sag",hs:[[150,110,7,6]]}, raphe:{view:"sag",hs:[[151,122,6,7]]},
   lc:{view:"sag",hs:[[157,114,6,6]]}, dstriatum:{view:"axi",hs:[[101,80,11,17],[139,80,11,17]]},
   "lc-thal":{view:"axi",hs:[[112,90,8,12],[128,90,8,12]]},
   broca:{view:"lat",hs:[[66,76,12,9]]}, wernicke:{view:"lat",hs:[[150,86,13,9]]},
   callosum:{view:"sag",hs:[[116,72,23,9]]}
  };
  var LINKS={
   dlpfc:{c:["be-c-dlpfc","DLPFC executive loop"],r:["be-r-pfc","Prefrontal / frontal cortex"]},
   "ofc-vmpfc":{c:["be-c-ofc","Orbitofrontal loop"],r:["be-r-pfc","Prefrontal / frontal cortex"]},
   acc:{c:["be-c-acc","Anterior cingulate loop"],r:["be-r-cingulate","Cingulate cortex"]},
   amygdala:{c:["be-c-limbic","Limbic circuits"],r:["be-r-amygdala","Amygdala"]},
   hippocampus:{c:["be-c-limbic","Limbic circuits (Papez)"],r:["be-r-hippocampus","Hippocampus / MTL"]},
   nacc:{c:["be-c-reward","Mesolimbic reward circuit"],r:["be-r-striatum","Striatum / basal ganglia"]},
   dstriatum:{c:["be-c-motor","Motor circuit"],r:["be-r-striatum","Striatum / basal ganglia"]},
   "lc-thal":{c:["be-c-loops","Thalamic relay of cortical loops"],r:["be-r-thalamus","Thalamus"]},
   "vta-snc":{c:["be-c-reward","Mesolimbic dopamine circuit"],r:["be-r-brainstem","Brainstem / SN"]},
   raphe:{c:null,r:["be-r-brainstem","Brainstem / SN"]},
   lc:{c:null,r:["be-r-brainstem","Brainstem / SN"]}
  };

  // ---- sidebar ----
  var side=$("be-side"); var cats=[];
  STRUCTS.forEach(function(s){if(cats.indexOf(s.cat)<0)cats.push(s.cat);});
  cats.forEach(function(c){
    var h=document.createElement("h4");h.textContent=c;side.appendChild(h);
    STRUCTS.filter(function(s){return s.cat===c;}).forEach(function(s){
      var b=document.createElement("button");b.className="be-item";b.setAttribute("data-id",s.id);
      b.innerHTML='<span class="be-sw" style="background:'+s.color+'"></span><span><span class="be-ab">'+s.abbr+'</span><br><span class="be-nm">'+s.name+'</span></span>';
      b.onclick=function(){select(s.id);};
      side.appendChild(b);
    });
  });

  function renderLocator(id){
    var m=HLMAP[id], card=$("be-loc");
    if(!m){card.className="be-loc empty";return;}
    var hl=m.hs.map(function(c){return '<ellipse class="be-hl" cx="'+c[0]+'" cy="'+c[1]+'" rx="'+c[2]+'" ry="'+c[3]+'" fill="#0d9488" fill-opacity="0.42" stroke="#0d9488" stroke-width="1.6"/>';}).join("");
    $("be-loc-k").textContent="Location · "+LOCLABEL[m.view]+" view";
    $("be-locator").innerHTML='<svg viewBox="0 0 240 150" xmlns="http://www.w3.org/2000/svg">'+LOCBASE[m.view]+hl+'</svg>';
    card.className="be-loc";
  }
  function renderLinks(id){
    var L=LINKS[id]||{}, el=$("be-links"), h="";
    if(L.c) h+='<a class="be-link" onclick="window.ppGoSection(\'neuro-circuits\',\''+L.c[0]+'\')">Neuropsych circuit: '+L.c[1]+' ↗</a>';
    if(L.r) h+='<a class="be-link" onclick="window.ppGoSection(\'brain-regions\',\''+L.r[0]+'\')">Brain region: '+L.r[1]+' ↗</a>';
    el.innerHTML=h;
  }
  var current=null, sceneFocus=null;
  function select(id){
    if(!cmap[id])return; current=id;
    var items=document.querySelectorAll(".be-item");
    for(var i=0;i<items.length;i++) items[i].classList.toggle("active", items[i].getAttribute("data-id")===id);
    var s=cmap[id];
    $("be-name").textContent=s.name; $("be-abbr").textContent=s.abbr;
    $("be-hint").style.display="none"; $("be-detail").style.display="block";
    $("be-system").textContent=s.system; $("be-why").textContent=s.why; $("be-note").textContent=s.note;
    renderLinks(id); renderLocator(id);
    if(sceneFocus) sceneFocus(id);
  }
  window.PPBrainExplorer={focus:select};
  if(window.__brainFocusQueue){ select(window.__brainFocusQueue); window.__brainFocusQueue=null; }

  // ---- 3D scene ----
  (async function(){
    var THREE, OrbitControls, GLTFLoader, DRACOLoader, RoomEnvironment;
    try{
      THREE=await import('three');
      OrbitControls=(await import('three/addons/controls/OrbitControls.js')).OrbitControls;
      GLTFLoader=(await import('three/addons/loaders/GLTFLoader.js')).GLTFLoader;
      DRACOLoader=(await import('three/addons/loaders/DRACOLoader.js')).DRACOLoader;
      RoomEnvironment=(await import('three/addons/environments/RoomEnvironment.js')).RoomEnvironment;
    }catch(e){ $("be-loading").textContent="Could not load 3D engine."; return; }

    var canvas=$("be-canvas");
    var renderer=new THREE.WebGLRenderer({canvas:canvas,antialias:true,alpha:true});
    renderer.setPixelRatio(Math.min(devicePixelRatio,2));
    renderer.outputColorSpace=THREE.SRGBColorSpace; renderer.toneMapping=THREE.ACESFilmicToneMapping; renderer.toneMappingExposure=1.05;
    var scene=new THREE.Scene();
    var cam=new THREE.PerspectiveCamera(38,1,0.1,6000);
    var pmrem=new THREE.PMREMGenerator(renderer); scene.environment=pmrem.fromScene(new RoomEnvironment(),0.04).texture;
    scene.add(new THREE.HemisphereLight(0xffffff,0xb9ad91,0.55));
    var d1=new THREE.DirectionalLight(0xffffff,1.1); d1.position.set(1,1.3,1.2); scene.add(d1);
    var d2=new THREE.DirectionalLight(0xffffff,0.45); d2.position.set(-1.2,-0.4,-0.8); scene.add(d2);
    var controls=new OrbitControls(cam,canvas); controls.enableDamping=true; controls.enablePan=false; controls.autoRotateSpeed=1.3;
    function size(){var w=canvas.clientWidth,h=canvas.clientHeight; if(!w||!h)return; renderer.setSize(w,h,false); cam.aspect=w/h; cam.updateProjectionMatrix();}
    var root=new THREE.Group(); scene.add(root);
    var meshes={},centers={},shellMeshes=[],ctxMeshes=[],selected=null,hover=null,R=100;
    function mat(hex,o){o=o||{}; var m=new THREE.MeshStandardMaterial({color:new THREE.Color(hex),roughness:.5,metalness:0,envMapIntensity:.9}); for(var k in o)m[k]=o[k]; return m;}

    var draco=new DRACOLoader(); draco.setDecoderPath('https://cdn.jsdelivr.net/npm/three@0.160.0/examples/jsm/libs/draco/');
    var loader=new GLTFLoader(); loader.setDRACOLoader(draco);
    loader.load('assets/brain/brain-explorer.glb', function(gltf){
      gltf.scene.traverse(function(o){
        if(!o.isMesh)return; var id=o.name;
        if(id==='cortex-lh'||id==='cortex-rh'){o.material=mat('#e5ddce',{transparent:true,opacity:0.11,depthWrite:false,side:THREE.DoubleSide,roughness:.85,envMapIntensity:.5}); o.renderOrder=20; shellMeshes.push(o); return;}
        if(id.indexOf('ctx-')===0){o.material=mat('#d3ccbe',{transparent:true,opacity:0.5,roughness:.6,depthWrite:false}); o.renderOrder=5; ctxMeshes.push(o); return;}
        var s=cmap[id]; if(s){var dbl=s.cat==='Cortical'; o.material=mat(s.color, dbl?{side:THREE.DoubleSide}:{}); o.userData.base=new THREE.Color(s.color); o.userData.struct=id; meshes[id]=o;}
      });
      root.add(gltf.scene);
      // --- Procedural classic-lesion landmarks not present in the GLB.
      //     GLB coordinate frame: -X = LEFT hemisphere, +Y = anterior, +Z = superior. ---
      (function(){
        function lobe(hex,r){var g=new THREE.SphereGeometry(r,26,20); g.scale(1.25,1.0,0.8); return new THREE.Mesh(g,mat(hex,{roughness:.45}));}
        var add=[];
        var broca=lobe('#c8791f',7.5); broca.position.set(-46,44,6); add.push(['broca',broca]);
        var wern=lobe('#7a3fa0',7.5); wern.position.set(-47,-16,-2); add.push(['wernicke',wern]);
        // Corpus callosum: midsagittal C-arch (X≈0) as a swept tube, genu (anterior) → splenium (posterior).
        var arch=[[36,4],[31,17],[13,24],[-9,24],[-29,17],[-38,3],[-33,-7]].map(function(p){return new THREE.Vector3(0,p[0],p[1]);});
        var curve=new THREE.CatmullRomCurve3(arch,false,'catmullrom',0.5);
        var cc=new THREE.Mesh(new THREE.TubeGeometry(curve,64,4.2,14,false),mat('#2f7fb0',{roughness:.5}));
        add.push(['callosum',cc]);
        add.forEach(function(pr){var id=pr[0],o=pr[1]; o.material.side=THREE.DoubleSide; o.userData.base=new THREE.Color(cmap[id].color); o.userData.struct=id; meshes[id]=o; root.add(o);});
      })();
      root.rotation.x=-Math.PI/2; root.updateMatrixWorld(true);
      var box=new THREE.Box3().setFromObject(root); var ctr=box.getCenter(new THREE.Vector3());
      root.position.sub(ctr); root.updateMatrixWorld(true);
      R=box.getBoundingSphere(new THREE.Sphere()).radius;
      Object.keys(meshes).forEach(function(id){centers[id]=new THREE.Box3().setFromObject(meshes[id]).getCenter(new THREE.Vector3());});
      home=new THREE.Vector3(R*2.0,R*0.5,R*2.2); cam.position.copy(home); controls.target.set(0,0,0);
      $("be-loading").style.display="none"; size();
      sceneFocus=function(id){ selected=id; paint(); var c=centers[id]; if(c){var dir=cam.position.clone().sub(controls.target).normalize(); flyTo(c.clone().add(dir.multiplyScalar(R*1.5)), c.clone());} };
      if(current) sceneFocus(current);
    }, undefined, function(err){ $("be-loading").textContent="Could not load brain model."; });

    var home=new THREE.Vector3(200,60,220), anim=null;
    function flyTo(pos,tgt){anim={p0:cam.position.clone(),p1:pos,t0:controls.target.clone(),t1:tgt,s:0};}
    $("be-reset").onclick=function(){flyTo(home.clone(),new THREE.Vector3(0,0,0));};
    $("be-shell").onchange=function(e){shellMeshes.forEach(function(m){m.visible=e.target.checked;});};
    $("be-ctx").onchange=function(e){ctxMeshes.forEach(function(m){m.visible=e.target.checked;});};
    $("be-spin").onchange=function(e){controls.autoRotate=e.target.checked;};
    function paint(){Object.keys(meshes).forEach(function(k){var m=meshes[k]; if(m.userData.base&&m.userData.struct){var on=(m.userData.struct===selected)||(m.userData.struct===hover); m.material.color.copy(on?new THREE.Color('#0d9488'):m.userData.base); m.material.emissive=new THREE.Color(on?'#0d9488':'#000'); m.material.emissiveIntensity=on?0.4:0; m.scale.setScalar(on?1.05:1.0);}});}
    var ray=new THREE.Raycaster(), ptr=new THREE.Vector2();
    function pick(ev){var r=canvas.getBoundingClientRect(); ptr.x=((ev.clientX-r.left)/r.width)*2-1; ptr.y=-((ev.clientY-r.top)/r.height)*2+1; ray.setFromCamera(ptr,cam); var objs=Object.keys(meshes).map(function(k){return meshes[k];}).filter(function(m){return m.userData.struct;}); var hit=ray.intersectObjects(objs,false); return hit.length?hit[0].object.userData.struct:null;}
    canvas.addEventListener('pointermove',function(ev){var id=pick(ev); if(id!==hover){hover=id; paint(); canvas.style.cursor=id?'pointer':'grab';}});
    canvas.addEventListener('click',function(ev){var id=pick(ev); if(id){selected=id; select(id);}});
    // keep selected synced when select() called externally
    var _sel=select; select=function(id){selected=id; _sel(id);}; window.PPBrainExplorer.focus=select;
    window.addEventListener('resize',size);
    function ease(t){return t<.5?2*t*t:1-Math.pow(-2*t+2,2)/2;}
    (function loop(){requestAnimationFrame(loop); if(anim){anim.s=Math.min(1,anim.s+0.03); var e=ease(anim.s); cam.position.lerpVectors(anim.p0,anim.p1,e); controls.target.lerpVectors(anim.t0,anim.t1,e); if(anim.s>=1)anim=null;} controls.update(); renderer.render(scene,cam);})();
    setTimeout(size,50);
  })();
})();
