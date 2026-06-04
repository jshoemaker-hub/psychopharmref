/* Question Bank Tool — IIFE */
(function () {
  'use strict';

  /* ── Supabase config ── */
  var SUPABASE_URL = 'https://rqvulyfzyyvzxekuxgyu.supabase.co';
  var SUPABASE_ANON = 'sb_publishable_ix1r79mKjH9R7V8MC2M6dg_ANx5-uXE';
  var supabase = null;
  var currentUser = null;

  /* ── Quiz state ── */
  var SET_SIZE = 15;
  var questions = [];
  var currentIdx = 0;
  var answers = [];
  var revealed = [];
  var lastSelectedCats = [];
  var usedQuestionIds = [];

  /* ── DOM refs (all from static HTML) ── */
  var root = document.getElementById('question-bank');
  var authOverlay = document.getElementById('qb-auth-overlay');
  var resetPanel = document.getElementById('qb-reset-panel');
  var userBar = document.getElementById('qb-user-bar');
  var quizView = document.getElementById('qb-quiz-view');
  var setupView = document.getElementById('qb-setup');
  var resultsView = document.getElementById('qb-results');

  /* ── Init ── */
  function init() {
    if (!root) { console.error('QBank: #question-bank not found'); return; }
    console.log('QBank init — QBANK_DATA:', window.QBANK_DATA ? window.QBANK_DATA.length + ' questions' : 'NOT LOADED');
    wireAuthUI();
    wireSignOut();
    loadSupabase();
  }

  /* ══════════════════════════════
     AUTH
  ══════════════════════════════ */
  function loadSupabase() {
    if (window.supabase && window.supabase.createClient) {
      initSupabase();
      return;
    }
    var s = document.createElement('script');
    s.src = 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/dist/umd/supabase.min.js';
    s.onload = initSupabase;
    document.head.appendChild(s);
  }

  function initSupabase() {
    supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON);
    supabase.auth.getSession().then(function (res) {
      if (res.data.session) {
        onLogin(res.data.session.user);
      }
    });
    supabase.auth.onAuthStateChange(function (event, session) {
      if (event === 'PASSWORD_RECOVERY') {
        switchSection('question-bank');
        authOverlay.style.display = 'none';
        resetPanel.style.display = '';
        return;
      }
      // Ignore token refreshes and initial session — already handled by getSession
      if (event === 'TOKEN_REFRESHED' || event === 'INITIAL_SESSION') return;
      if (event === 'SIGNED_IN' && currentUser) return; // already logged in
      if (session) onLogin(session.user);
      else onLogout();
    });
  }

  function onLogin(user) {
    currentUser = user;
    authOverlay.style.display = 'none';
    quizView.style.display = '';
    userBar.style.display = '';
    userBar.querySelector('.qb-user-email').textContent = user.email || 'Signed in';
    // Only show setup if no quiz is in progress
    if (questions.length === 0) {
      showSetup();
    }
    var sfAuth = document.getElementById('sf-auth-link');
    if (sfAuth) { sfAuth.textContent = user.email || 'Signed in'; sfAuth.onclick = function(e){ e.preventDefault(); switchSection('question-bank'); }; }
  }

  function onLogout() {
    currentUser = null;
    authOverlay.style.display = '';
    quizView.style.display = 'none';
    userBar.style.display = 'none';
    var sfAuth = document.getElementById('sf-auth-link');
    if (sfAuth) { sfAuth.textContent = 'Sign In / Sign Up'; sfAuth.onclick = function(e){ e.preventDefault(); switchSection('question-bank'); }; }
  }

  function signInEmail(email, password) {
    return supabase.auth.signInWithPassword({ email: email, password: password });
  }

  function signUpEmail(email, password) {
    return supabase.auth.signUp({ email: email, password: password });
  }

  function signInGoogle() {
    return supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: window.location.origin + window.location.pathname }
    });
  }

  function signOut() {
    supabase.auth.signOut();
  }

  /* ══════════════════════════════
     WIRE AUTH UI (elements already in HTML)
  ══════════════════════════════ */
  function wireAuthUI() {
    // Tab switching
    var tabs = authOverlay.querySelectorAll('.qb-auth-tab');
    var submitBtn = document.getElementById('qb-auth-submit');
    var isLogin = true;

    tabs.forEach(function (tab) {
      tab.addEventListener('click', function () {
        tabs.forEach(function (t) { t.classList.remove('qb-active'); });
        tab.classList.add('qb-active');
        isLogin = tab.dataset.tab === 'login';
        submitBtn.textContent = isLogin ? 'Sign In' : 'Create Account';
        document.getElementById('qb-auth-err').textContent = '';
      });
    });

    // Form submit
    document.getElementById('qb-auth-form').addEventListener('submit', function (e) {
      e.preventDefault();
      var email = document.getElementById('qb-email').value.trim();
      var pass = document.getElementById('qb-pass').value;
      var errEl = document.getElementById('qb-auth-err');
      errEl.textContent = '';
      errEl.style.color = '';
      submitBtn.disabled = true;
      submitBtn.textContent = 'Please wait...';

      var promise = isLogin ? signInEmail(email, pass) : signUpEmail(email, pass);
      promise.then(function (res) {
        submitBtn.disabled = false;
        submitBtn.textContent = isLogin ? 'Sign In' : 'Create Account';
        if (res.error) {
          errEl.textContent = res.error.message;
        } else if (!isLogin && !res.data.session) {
          errEl.style.color = 'var(--accent)';
          errEl.textContent = 'Check your email to confirm your account.';
        }
      });
    });

    // Password visibility toggle
    document.getElementById('qb-pass-toggle').addEventListener('click', function () {
      var passInput = document.getElementById('qb-pass');
      var eyeOpen = this.querySelector('.qb-eye-open');
      var eyeClosed = this.querySelector('.qb-eye-closed');
      if (passInput.type === 'password') {
        passInput.type = 'text';
        eyeOpen.style.display = 'none';
        eyeClosed.style.display = '';
        this.setAttribute('aria-label', 'Hide password');
      } else {
        passInput.type = 'password';
        eyeOpen.style.display = '';
        eyeClosed.style.display = 'none';
        this.setAttribute('aria-label', 'Show password');
      }
      passInput.focus();
    });

    // Forgot password
    document.getElementById('qb-forgot-link').addEventListener('click', function (e) {
      e.preventDefault();
      var email = document.getElementById('qb-email').value.trim();
      var errEl = document.getElementById('qb-auth-err');
      if (!email) {
        errEl.style.color = '';
        errEl.textContent = 'Enter your email address above, then click Forgot password.';
        return;
      }
      this.textContent = 'Sending...';
      var self = this;
      supabase.auth.resetPasswordForEmail(email, {
        redirectTo: window.location.origin + window.location.pathname + '#question-bank'
      }).then(function (res) {
        self.textContent = 'Forgot password?';
        if (res.error) {
          errEl.style.color = '';
          errEl.textContent = res.error.message;
        } else {
          errEl.style.color = 'var(--accent)';
          errEl.textContent = 'Password reset email sent! Check your inbox.';
        }
      });
    });

    // Google
    document.getElementById('qb-google-btn').addEventListener('click', function () {
      signInGoogle();
    });

    // Reset panel eye toggle
    document.getElementById('qb-reset-pass-toggle').addEventListener('click', function () {
      var inp = document.getElementById('qb-new-pass');
      var open = this.querySelector('.qb-eye-open');
      var closed = this.querySelector('.qb-eye-closed');
      if (inp.type === 'password') {
        inp.type = 'text'; open.style.display = 'none'; closed.style.display = '';
      } else {
        inp.type = 'password'; open.style.display = ''; closed.style.display = 'none';
      }
      inp.focus();
    });

    // Reset form submit
    document.getElementById('qb-reset-form').addEventListener('submit', function (e) {
      e.preventDefault();
      var newPass = document.getElementById('qb-new-pass').value;
      var errEl = document.getElementById('qb-reset-err');
      errEl.textContent = '';
      supabase.auth.updateUser({ password: newPass }).then(function (res) {
        if (res.error) {
          errEl.style.color = '';
          errEl.textContent = res.error.message;
        } else {
          errEl.style.color = 'var(--accent)';
          errEl.textContent = 'Password updated! Redirecting...';
          setTimeout(function () {
            resetPanel.style.display = 'none';
            onLogin(res.data.user);
          }, 1500);
        }
      });
    });
  }

  function wireSignOut() {
    document.getElementById('qb-signout').addEventListener('click', signOut);
  }

  /* ══════════════════════════════
     SETUP (CATEGORY SELECTION)
  ══════════════════════════════ */
  function showSetup() {
    setupView.style.display = '';
    document.getElementById('qb-quiz-area').style.display = 'none';
    resultsView.style.display = 'none';

    var data = window.QBANK_DATA;
    if (!data || data.length === 0) {
      setupView.innerHTML = '<p style="text-align:center;padding:40px;color:var(--text-muted)">Loading questions...</p>';
      setTimeout(showSetup, 1000);
      return;
    }

    // Get categories
    var catCounts = {};
    data.forEach(function (q) {
      var c = q.usmle_category || 'Uncategorized';
      catCounts[c] = (catCounts[c] || 0) + 1;
    });
    var cats = Object.keys(catCounts).sort();

    var html = '<h3>Select Topics</h3><div class="qb-cat-grid">';
    cats.forEach(function (c) {
      html += '<label class="qb-cat-item">' +
        '<input type="checkbox" class="qb-cat-cb" value="' + c.replace(/"/g, '&quot;') + '" checked>' +
        '<span>' + c + '</span>' +
        '<span class="qb-cat-count">' + catCounts[c] + '</span>' +
        '</label>';
    });
    html += '</div>';
    html += '<div class="qb-setup-actions">' +
      '<button class="qb-select-all" id="qb-toggle-all">Deselect All</button>' +
      '<span class="qb-question-count" id="qb-avail-count">' + data.length + ' questions available</span>' +
      '<button class="qb-btn-primary" id="qb-start-btn">Start Quiz (' + SET_SIZE + ' Questions)</button>' +
      '</div>';
    setupView.innerHTML = html;

    // Toggle all
    setupView.querySelector('#qb-toggle-all').addEventListener('click', function () {
      var cbs = setupView.querySelectorAll('.qb-cat-cb');
      var allChecked = Array.from(cbs).every(function (cb) { return cb.checked; });
      cbs.forEach(function (cb) { cb.checked = !allChecked; });
      this.textContent = allChecked ? 'Select All' : 'Deselect All';
      updateCount();
    });

    // Update count on change
    setupView.querySelectorAll('.qb-cat-cb').forEach(function (cb) {
      cb.addEventListener('change', updateCount);
    });

    function updateCount() {
      var selected = getSelectedCats();
      var count = data.filter(function (q) { return selected.indexOf(q.usmle_category) !== -1; }).length;
      setupView.querySelector('#qb-avail-count').textContent = count + ' questions available';
    }

    // Start
    setupView.querySelector('#qb-start-btn').addEventListener('click', function () {
      startQuiz();
    });

    console.log('QBank showSetup rendered —', cats.length, 'categories,', data.length, 'questions');
  }

  function getSelectedCats() {
    var cbs = setupView.querySelectorAll('.qb-cat-cb:checked');
    return Array.from(cbs).map(function (cb) { return cb.value; });
  }

  /* ══════════════════════════════
     QUIZ ENGINE
  ══════════════════════════════ */
  function startQuiz(continueMode) {
    var data = window.QBANK_DATA || [];
    var selectedCats = continueMode ? lastSelectedCats : getSelectedCats();
    if (!continueMode) {
      lastSelectedCats = selectedCats;
      usedQuestionIds = [];
    }
    var pool = data.filter(function (q) {
      return selectedCats.indexOf(q.usmle_category) !== -1 && usedQuestionIds.indexOf(q.id) === -1;
    });

    if (pool.length === 0) return;

    shuffle(pool);
    questions = pool.slice(0, Math.min(SET_SIZE, pool.length));
    currentIdx = 0;
    answers = questions.map(function () { return -1; });
    revealed = questions.map(function () { return false; });

    // Track used questions so "15 more" doesn't repeat
    questions.forEach(function (q) { usedQuestionIds.push(q.id); });

    setupView.style.display = 'none';
    resultsView.style.display = 'none';
    var quizArea = document.getElementById('qb-quiz-area');
    quizArea.style.display = 'block';
    renderQuestion();
  }

  function renderQuestion() {
    var quizArea = document.getElementById('qb-quiz-area');
    var q = questions[currentIdx];
    var letters = ['A', 'B', 'C', 'D'];
    var progress = ((currentIdx + 1) / questions.length * 100).toFixed(0);

    var html = '<div class="qb-progress-bar"><div class="qb-progress-fill" style="width:' + progress + '%"></div></div>';
    html += '<div class="qb-progress-text">Question ' + (currentIdx + 1) + ' of ' + questions.length + '</div>';
    html += '<div class="qb-question-card">';
    html += '<div class="qb-q-meta-row">';
    html += '<span class="qb-q-frame">' + (q.frame_used || '') + '</span>';
    html += '<span class="qb-q-id">ID: ' + q.id + '</span>';
    html += '</div>';
    html += '<div class="qb-q-stem">' + q.question + '</div>';
    html += '<div class="qb-options">';
    q.options.forEach(function (opt, i) {
      var cls = 'qb-opt';
      if (revealed[currentIdx]) {
        cls += ' qb-revealed';
        if (i === q.correct_index) cls += ' qb-correct';
        else if (i === answers[currentIdx]) cls += ' qb-incorrect';
      } else if (answers[currentIdx] === i) {
        cls += ' qb-selected';
      }
      html += '<div class="' + cls + '" data-idx="' + i + '">' +
        '<span class="qb-opt-letter">' + letters[i] + '</span>' +
        '<span class="qb-opt-text">' + opt + '</span>' +
        '</div>';
    });
    html += '</div></div>';

    // Explanation
    html += '<div class="qb-explanation' + (revealed[currentIdx] ? ' qb-show' : '') + '" id="qb-explanation">';
    html += q.explanation || '';
    if (q.source_blog_title) {
      html += '<span class="qb-source">Source: ' + q.source_blog_title + '</span>';
    }
    if (revealed[currentIdx]) {
      html += '<button class="qb-comment-btn" id="qb-comment-btn" title="Submit feedback on this question">Comment on Question</button>';
    }
    html += '</div>';

    // Nav buttons
    html += '<div class="qb-nav-btns">';
    html += '<button class="qb-btn-secondary" id="qb-prev"' + (currentIdx === 0 ? ' disabled' : '') + '>Previous</button>';
    if (!revealed[currentIdx]) {
      html += '<button class="qb-btn-primary" id="qb-submit-ans" ' + (answers[currentIdx] === -1 ? 'disabled' : '') + '>Submit Answer</button>';
    } else if (currentIdx < questions.length - 1) {
      html += '<button class="qb-btn-primary" id="qb-next">Next Question</button>';
    } else {
      html += '<button class="qb-btn-primary" id="qb-finish">See Results</button>';
    }
    html += '</div>';

    quizArea.innerHTML = html;

    // Option click handlers
    if (!revealed[currentIdx]) {
      quizArea.querySelectorAll('.qb-opt').forEach(function (el) {
        el.addEventListener('click', function () {
          answers[currentIdx] = parseInt(this.dataset.idx);
          renderQuestion();
        });
      });
    }

    // Submit answer
    var submitBtn = quizArea.querySelector('#qb-submit-ans');
    if (submitBtn) {
      submitBtn.addEventListener('click', function () {
        revealed[currentIdx] = true;
        renderQuestion();
      });
    }

    // Next
    var nextBtn = quizArea.querySelector('#qb-next');
    if (nextBtn) {
      nextBtn.addEventListener('click', function () {
        currentIdx++;
        renderQuestion();
      });
    }

    // Prev
    var prevBtn = quizArea.querySelector('#qb-prev');
    if (prevBtn) {
      prevBtn.addEventListener('click', function () {
        if (currentIdx > 0) { currentIdx--; renderQuestion(); }
      });
    }

    // Finish
    var finishBtn = quizArea.querySelector('#qb-finish');
    if (finishBtn) {
      finishBtn.addEventListener('click', showResults);
    }

    // Comment button
    var commentBtn = quizArea.querySelector('#qb-comment-btn');
    if (commentBtn) {
      commentBtn.addEventListener('click', function () {
        showCommentModal(q);
      });
    }
  }

  function showResults() {
    document.getElementById('qb-quiz-area').style.display = 'none';
    resultsView.style.display = 'block';

    var correct = 0;
    questions.forEach(function (q, i) {
      if (answers[i] === q.correct_index) correct++;
    });
    var pct = Math.round(correct / questions.length * 100);

    // Check if more questions are available in the same categories
    var data = window.QBANK_DATA || [];
    var remaining = data.filter(function (q) {
      return lastSelectedCats.indexOf(q.usmle_category) !== -1 && usedQuestionIds.indexOf(q.id) === -1;
    }).length;

    var moreBtn = '';
    if (remaining > 0) {
      moreBtn = '<button class="qb-btn-primary" id="qb-more-quiz">Next ' + Math.min(SET_SIZE, remaining) + ' Questions</button>';
    }

    resultsView.innerHTML =
      '<h3>Quiz Complete</h3>' +
      '<div class="qb-score-big">' + pct + '%</div>' +
      '<div class="qb-score-label">' + correct + ' of ' + questions.length + ' correct</div>' +
      '<div class="qb-results-actions">' +
        moreBtn +
        '<button class="qb-btn-primary" id="qb-new-quiz">New Quiz</button>' +
        '<button class="qb-btn-secondary" id="qb-review">Review Answers</button>' +
      '</div>';

    var moreQuizBtn = resultsView.querySelector('#qb-more-quiz');
    if (moreQuizBtn) {
      moreQuizBtn.addEventListener('click', function () {
        startQuiz(true);
      });
    }

    resultsView.querySelector('#qb-new-quiz').addEventListener('click', function () {
      usedQuestionIds = [];
      showSetup();
    });

    resultsView.querySelector('#qb-review').addEventListener('click', function () {
      currentIdx = 0;
      resultsView.style.display = 'none';
      document.getElementById('qb-quiz-area').style.display = 'block';
      renderQuestion();
    });
  }

  /* ══════════════════════════════
     COMMENT MODAL
  ══════════════════════════════ */
  function showCommentModal(q) {
    // Remove existing modal if any
    var existing = document.getElementById('qb-comment-modal');
    if (existing) existing.remove();

    var overlay = document.createElement('div');
    overlay.id = 'qb-comment-modal';
    overlay.className = 'qb-modal-overlay';
    overlay.innerHTML =
      '<div class="qb-modal">' +
        '<div class="qb-modal-header">' +
          '<h4>Comment on Question #' + q.id + '</h4>' +
          '<button class="qb-modal-close" id="qb-modal-close">&times;</button>' +
        '</div>' +
        '<div class="qb-modal-body">' +
          '<p class="qb-modal-q-preview">' + q.question.substring(0, 120) + (q.question.length > 120 ? '...' : '') + '</p>' +
          '<textarea id="qb-comment-text" class="qb-comment-textarea" placeholder="Share your feedback, report an error, or suggest an improvement..." rows="4"></textarea>' +
          '<div class="qb-modal-footer">' +
            '<span class="qb-comment-status" id="qb-comment-status"></span>' +
            '<button class="qb-btn-primary" id="qb-comment-submit">Submit Comment</button>' +
          '</div>' +
        '</div>' +
      '</div>';

    document.body.appendChild(overlay);

    // Close modal
    overlay.querySelector('#qb-modal-close').addEventListener('click', function () {
      overlay.remove();
    });
    overlay.addEventListener('click', function (e) {
      if (e.target === overlay) overlay.remove();
    });

    // Submit comment
    overlay.querySelector('#qb-comment-submit').addEventListener('click', function () {
      var text = document.getElementById('qb-comment-text').value.trim();
      var statusEl = document.getElementById('qb-comment-status');
      if (!text) {
        statusEl.textContent = 'Please enter a comment.';
        statusEl.style.color = 'var(--red, #c04030)';
        return;
      }
      submitComment(q, text, statusEl, overlay);
    });
  }

  function submitComment(q, commentText, statusEl, overlay) {
    statusEl.textContent = 'Submitting...';
    statusEl.style.color = 'var(--text-muted)';
    var submitBtn = overlay.querySelector('#qb-comment-submit');
    submitBtn.disabled = true;

    // ── Supabase insert ──
    // Table: question_comments
    // Columns: question_id (int), question_text (text), comment (text), user_email (text), created_at (timestamptz)
    if (!supabase) {
      statusEl.textContent = 'Error: not connected. Please try again.';
      statusEl.style.color = 'var(--red, #c04030)';
      submitBtn.disabled = false;
      return;
    }

    var payload = {
      question_id: q.id,
      question_text: q.question,
      comment: commentText,
      user_email: currentUser ? currentUser.email : 'anonymous'
    };

    supabase.from('question_comments').insert([payload]).then(function (res) {
      if (res.error) {
        console.error('Comment insert error:', res.error);
        statusEl.textContent = 'Error saving comment. Please try again.';
        statusEl.style.color = 'var(--red, #c04030)';
        submitBtn.disabled = false;
        return;
      }
      // Send email notification via Supabase Edge Function
      sendCommentEmail(q, commentText);
      statusEl.textContent = 'Comment submitted — thank you!';
      statusEl.style.color = 'var(--accent, #4a7c35)';
      setTimeout(function () { overlay.remove(); }, 1500);
    });
  }

  function sendCommentEmail(q, commentText) {
    // Calls a Supabase Edge Function to email admin
    // Edge Function name: send-comment-email
    // Admin email: jshoemakercb@yahoo.com
    if (!supabase) return;
    supabase.functions.invoke('send-comment-email', {
      body: {
        question_id: q.id,
        question_text: q.question,
        comment: commentText,
        user_email: currentUser ? currentUser.email : 'anonymous',
        admin_email: 'jshoemakercb@yahoo.com'
      }
    }).then(function (res) {
      if (res.error) console.warn('Email notification failed:', res.error);
    });
  }

  /* ── Helpers ── */
  function shuffle(arr) {
    for (var i = arr.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var tmp = arr[i]; arr[i] = arr[j]; arr[j] = tmp;
    }
    return arr;
  }

  /* ── Start ── */
  init();
})();
