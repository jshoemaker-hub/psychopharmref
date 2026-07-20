/* therapy-nav.js — shared persistent sidebar for Therapy Tools handouts.
   Single source of truth for the handout list. Screen-only; hidden on print. */
(function () {
  var GROUPS = [
    ["Anxiety & Sleep", [
      ["calming-anxiety",        "Calming Anxiety"],
      ["worry-management",       "Worry Management"],
      ["grounding",              "Grounding Techniques"],
      ["progressive-relaxation", "Progressive Relaxation"],
      ["exposure-hierarchies",   "Facing Fears (Exposure)"],
      ["insomnia-sleep-hygiene", "Insomnia & Sleep Hygiene"]
    ]],
    ["Depression & Mood", [
      ["behavioral-activation",  "Behavioral Activation"],
      ["mood-tracking",          "Mood Tracking"]
    ]],
    ["Self-Care & Skills", [
      ["self-care-plan",           "Self-Care Plan"],
      ["stress-burnout",           "Stress & Burnout"],
      ["diet-exercise",            "Diet & Exercise Science"],
      ["healthy-habits-gratitude", "Healthy Habits & Gratitude"],
      ["smart-goals",              "SMART Goals"]
    ]],
    ["Relationships", [
      ["boundaries",    "Setting Boundaries"],
      ["communication", "Assertive Communication"]
    ]],
    ["Dementia & Caregiving", [
      ["understanding-dementia",  "Understanding Dementia"],
      ["dementia-communication",  "Communicating & Daily Care"],
      ["dementia-behaviors",      "Managing Behaviors"],
      ["dementia-home-safety",    "Home Safety Checklist"],
      ["dementia-caregiver-care", "Caregiver Self-Care"],
      ["dementia-planning",       "Planning Ahead"],
      ["dementia-later-stages",   "Later Stages & Grief"]
    ]],
    ["Crisis", [
      ["safety-plan", "Safety Plan"]
    ]]
  ];

  function currentSlug() {
    var p = location.pathname.replace(/\/+$/, "");
    var last = p.substring(p.lastIndexOf("/") + 1);
    return last.replace(/\.html$/, "");
  }

  function build() {
    var here = currentSlug();

    var nav = document.createElement("nav");
    nav.className = "tt-sidenav";
    nav.setAttribute("aria-label", "Therapy Tools");

    var html = '<div class="tt-sidenav-head">' +
      '<a class="tt-sn-brand" href="/index.html">PsychoPharmRef</a>' +
      '<div class="tt-sn-sub">Therapy Tools</div>' +
      '<a class="tt-sn-all" href="/index.html#therapy-tools">← All Therapy Tools</a>' +
      '</div>';

    GROUPS.forEach(function (g) {
      html += '<div class="tt-sn-group">' + g[0] + '</div>';
      g[1].forEach(function (item) {
        var slug = item[0], label = item[1];
        var active = slug === here ? " active" : "";
        html += '<a class="tt-sn-link' + active + '" href="/therapy-tools/' + slug + '.html">' + label + '</a>';
      });
    });
    nav.innerHTML = html;

    var backdrop = document.createElement("div");
    backdrop.className = "tt-nav-backdrop";

    var toggle = document.createElement("button");
    toggle.className = "tt-navtoggle";
    toggle.setAttribute("aria-label", "Toggle Therapy Tools menu");
    toggle.innerHTML = "☰";

    function openNav() { nav.classList.add("open"); backdrop.classList.add("show"); }
    function closeNav() { nav.classList.remove("open"); backdrop.classList.remove("show"); }
    toggle.addEventListener("click", function () {
      if (nav.classList.contains("open")) closeNav(); else openNav();
    });
    backdrop.addEventListener("click", closeNav);
    nav.addEventListener("click", function (e) {
      if (e.target.classList.contains("tt-sn-link")) closeNav();
    });

    document.body.appendChild(nav);
    document.body.appendChild(backdrop);
    document.body.appendChild(toggle);
    document.body.classList.add("has-sidenav");

    // Keep the active link in view within the sidebar.
    var act = nav.querySelector(".tt-sn-link.active");
    if (act && act.scrollIntoView) {
      try { act.scrollIntoView({ block: "center" }); } catch (e) {}
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", build);
  } else {
    build();
  }
})();
