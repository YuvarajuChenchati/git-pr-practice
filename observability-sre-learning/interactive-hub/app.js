// Observability & SRE Interactive Hub Logic

document.addEventListener('DOMContentLoaded', () => {
  const data = window.SRE_DATA;

  // -------------------------------------------------------------
  // TAB NAVIGATION
  // -------------------------------------------------------------
  const navTabs = document.querySelectorAll('.nav-tab');
  const tabViews = document.querySelectorAll('.tab-view');

  navTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const targetId = tab.dataset.tab;

      navTabs.forEach(t => t.classList.remove('active'));
      tabViews.forEach(v => v.classList.remove('active'));

      tab.classList.add('active');
      const targetView = document.getElementById(`view-${targetId}`);
      if (targetView) targetView.classList.add('active');
    });
  });

  // -------------------------------------------------------------
  // STORY MODE
  // -------------------------------------------------------------
  let currentStoryIndex = 0;
  const storyNavList = document.getElementById('story-nav-list');
  const storyTitle = document.getElementById('story-title');
  const storyTagline = document.getElementById('story-tagline');
  const storyMemeImg = document.getElementById('story-meme-img');
  const storyMemeCaption = document.getElementById('story-meme-caption');
  const storyBody = document.getElementById('story-body');
  const storyTakeawaysList = document.getElementById('story-takeaways-list');

  function renderStoryNav() {
    storyNavList.innerHTML = '';
    data.stories.forEach((story, idx) => {
      const btn = document.createElement('button');
      btn.className = `story-btn ${idx === currentStoryIndex ? 'active' : ''}`;
      btn.innerHTML = `<strong>${story.title.split(':')[0]}</strong><br><span style="font-size: 0.8rem; color: var(--text-muted);">${story.title.split(':')[1] || ''}</span>`;
      btn.addEventListener('click', () => {
        currentStoryIndex = idx;
        renderCurrentStory();
        renderStoryNav();
      });
      storyNavList.appendChild(btn);
    });
  }

  function renderCurrentStory() {
    const story = data.stories[currentStoryIndex];
    if (!story) return;

    storyTitle.textContent = story.title;
    storyTagline.textContent = story.tagline;
    storyMemeImg.src = story.memeUrl;
    storyMemeCaption.textContent = `"${story.memeCaption}"`;

    let html = story.content
      .replace(/### (.*?)\n/g, '<h3>$1</h3>')
      .replace(/#### (.*?)\n/g, '<h4 style="color: var(--sre-amber); margin: 1rem 0 0.5rem 0;">$1</h4>')
      .replace(/```text([\s\S]*?)```/g, '<pre><code>$1</code></pre>')
      .replace(/```promql([\s\S]*?)```/g, '<pre><code class="language-promql">$1</code></pre>')
      .replace(/```yaml([\s\S]*?)```/g, '<pre><code class="language-yaml">$1</code></pre>')
      .replace(/```([\s\S]*?)```/g, '<pre><code>$1</code></pre>')
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/`([^`]+)`/g, '<code style="color: #fbbf24; background: #1a1027; padding: 2px 6px; border-radius: 4px;">$1</code>')
      .replace(/\n\n/g, '<p style="margin-bottom: 1rem;"></p>');

    storyBody.innerHTML = html;

    storyTakeawaysList.innerHTML = '';
    story.takeaways.forEach(t => {
      const li = document.createElement('li');
      li.textContent = t;
      storyTakeawaysList.appendChild(li);
    });
  }

  renderStoryNav();
  renderCurrentStory();

  // -------------------------------------------------------------
  // TELEMETRY SIMULATOR LOGIC
  // -------------------------------------------------------------
  const valRps = document.getElementById('val-rps');
  const valErrors = document.getElementById('val-errors');
  const valP99 = document.getElementById('val-p99');
  const valMem = document.getElementById('val-mem');
  const panelErrors = document.getElementById('panel-errors');
  const panelMem = document.getElementById('panel-mem');
  const panelP99 = document.getElementById('panel-p99');
  const telemetryConsoleOutput = document.getElementById('telemetry-console-output');
  const waterfallSpansList = document.getElementById('waterfall-spans-list');

  const btnTrafficSpike = document.getElementById('btn-traffic-spike');
  const btnMemoryLeak = document.getElementById('btn-memory-leak');
  const btnTriggerAlert = document.getElementById('btn-trigger-alert');
  const btnResetTelemetry = document.getElementById('btn-reset-telemetry');

  function renderWaterfall() {
    waterfallSpansList.innerHTML = '';
    data.traceWaterfall.forEach(span => {
      const row = document.createElement('div');
      row.className = 'waterfall-span-row';
      const isSlow = span.status.includes('Slow');

      row.innerHTML = `
        <div class="span-info">
          <span><strong>${span.service}</strong> › ${span.name}</span>
          <span style="color: ${isSlow ? 'var(--danger)' : 'var(--sre-amber)'};">${span.duration} (${span.status})</span>
        </div>
        <div class="span-bar-container">
          <div class="span-bar ${isSlow ? 'slow' : ''}" style="width: ${span.width}; left: ${span.offset};">
            ${span.duration}
          </div>
        </div>
      `;
      waterfallSpansList.appendChild(row);
    });
  }

  renderWaterfall();

  btnTrafficSpike.addEventListener('click', () => {
    valRps.textContent = "10,480";
    valP99.textContent = "840ms";
    valErrors.textContent = "4.82%";
    valErrors.style.color = "var(--danger)";
    panelErrors.classList.add('alerting');
    panelP99.classList.add('alerting');

    telemetryConsoleOutput.innerHTML = `
      <span style="color: var(--sre-orange); font-weight: 700;">&gt; [TRAFFIC SURGE] Inbound requests spiked to 10,480 RPS!</span><br>
      <span style="color: var(--danger);">&gt; [Prometheus Alertmanager] Rule 'HighHttpErrorRate' status: PENDING (4.82% > 2.00%)</span><br>
      <span style="color: var(--danger);">&gt; [Latency Warning] P99 tail latency jumped from 85ms to 840ms!</span><br>
      <span style="color: var(--text-subtle);">Pod auto-scaler (HPA) triggered: scaling replicas 4 ➔ 12...</span>
    `;
  });

  btnMemoryLeak.addEventListener('click', () => {
    valMem.textContent = "492MB";
    valMem.style.color = "var(--danger)";
    panelMem.classList.add('alerting');

    telemetryConsoleOutput.innerHTML = `
      <span style="color: var(--danger); font-weight: 700;">&gt; [OOM WARNING] Container memory at 96.1% (492MB / 512MB limit)!</span><br>
      <span style="color: var(--danger);">&gt; [Alertmanager] Rule 'ContainerMemorySaturation' status: FIRING!</span><br>
      <span style="color: var(--text-subtle);">&gt; Linux kernel cgroups OOMKiller armed: Process risks receiving SIGKILL (Exit 137) in 30s!</span>
    `;
  });

  btnTriggerAlert.addEventListener('click', () => {
    telemetryConsoleOutput.innerHTML = `
      <span style="color: var(--danger); font-weight: 700;">&gt; [ALERTMANAGER POST /api/v2/alerts] Webhook Dispatched to Slack & PagerDuty:</span><br>
      <pre style="color: #fdba74; font-size: 0.8rem; background: #07050d; padding: 10px; border-radius: 4px; margin-top: 6px;">
{
  "status": "firing",
  "alerts": [{
    "labels": {
      "alertname": "HighHttpErrorRate",
      "severity": "critical",
      "service": "checkout-api",
      "tier": "backend"
    },
    "annotations": {
      "summary": "High 5xx error rate (4.82%) on checkout-api",
      "runbook_url": "https://wiki.internal/runbooks/checkout-api-errors"
    },
    "startsAt": "${new Date().toISOString()}"
  }]
}
      </pre>
    `;
  });

  btnResetTelemetry.addEventListener('click', () => {
    valRps.textContent = "420";
    valErrors.textContent = "0.02%";
    valErrors.style.color = "var(--success)";
    valP99.textContent = "85ms";
    valMem.textContent = "210MB";
    valMem.style.color = "#fff";
    panelErrors.classList.remove('alerting');
    panelMem.classList.remove('alerting');
    panelP99.classList.remove('alerting');

    telemetryConsoleOutput.innerHTML = `
      <span style="color: var(--sre-amber);">&gt; [Telemetry Reset] Four Golden Signals healthy. All alert states: RESOLVED.</span>
    `;
  });

  // -------------------------------------------------------------
  // QUIZ ARENA
  // -------------------------------------------------------------
  let currentQuizIndex = 0;
  let quizScore = 0;
  const quizTitle = document.getElementById('quiz-title');
  const quizScenario = document.getElementById('quiz-scenario');
  const quizOptionsContainer = document.getElementById('quiz-options-container');
  const quizProgressText = document.getElementById('quiz-progress-text');
  const quizScoreDisplay = document.getElementById('quiz-score-display');
  const quizFeedbackBox = document.getElementById('quiz-feedback-box');
  const quizMemeImg = document.getElementById('quiz-meme-img');
  const quizFeedbackTitle = document.getElementById('quiz-feedback-title');
  const quizFeedbackDesc = document.getElementById('quiz-feedback-desc');
  const btnNextQuiz = document.getElementById('btn-next-quiz');

  function renderQuiz() {
    const q = data.quizChallenges[currentQuizIndex];
    if (!q) {
      quizTitle.textContent = "🏆 Master of Site Reliability Engineering (SRE)!";
      quizScenario.innerHTML = `You scored <strong>${quizScore} / ${data.quizChallenges.length * 100} points</strong>.<br>You have officially completed the entire Cloud & DevOps Architecture: <strong>Docker ➔ Kubernetes ➔ Terraform ➔ CI/CD & GitOps ➔ Observability & SRE</strong>!`;
      quizOptionsContainer.innerHTML = '';
      quizFeedbackBox.style.display = 'none';
      return;
    }

    quizProgressText.textContent = `Incident ${currentQuizIndex + 1} of ${data.quizChallenges.length}`;
    quizScoreDisplay.textContent = `SRE Score: ${quizScore} pts`;
    quizTitle.textContent = q.title;
    quizScenario.textContent = q.scenario;
    quizFeedbackBox.style.display = 'none';

    quizOptionsContainer.innerHTML = '';
    q.options.forEach((opt, idx) => {
      const btn = document.createElement('button');
      btn.className = 'quiz-option-btn';
      btn.innerHTML = `<span style="font-family: var(--font-mono); font-weight: 700; color: var(--sre-amber);">${String.fromCharCode(65 + idx)}.</span> <span>${opt}</span>`;
      btn.addEventListener('click', () => handleQuizAnswer(idx, q, btn));
      quizOptionsContainer.appendChild(btn);
    });
  }

  function handleQuizAnswer(selectedIdx, q, clickedBtn) {
    const isCorrect = selectedIdx === q.correctIndex;
    const allBtns = quizOptionsContainer.querySelectorAll('.quiz-option-btn');
    allBtns.forEach(b => b.disabled = true);

    if (isCorrect) {
      clickedBtn.classList.add('correct');
      quizScore += 100;
      quizScoreDisplay.textContent = `SRE Score: ${quizScore} pts`;
      quizMemeImg.src = q.memeCorrect;
      quizFeedbackTitle.innerHTML = `<span style="color: var(--success);">🎉 CORRECT! PRINCIPAL SITE RELIABILITY ENGINEER!</span>`;
    } else {
      clickedBtn.classList.add('wrong');
      allBtns[q.correctIndex].classList.add('correct');
      quizMemeImg.src = q.memeWrong;
      quizFeedbackTitle.innerHTML = `<span style="color: var(--danger);">💥 SLA BREACHED! REFUND OWED TO CUSTOMERS!</span>`;
    }

    quizFeedbackDesc.textContent = q.explanation;
    quizFeedbackBox.style.display = 'block';
  }

  btnNextQuiz.addEventListener('click', () => {
    currentQuizIndex++;
    renderQuiz();
  });

  renderQuiz();

  // -------------------------------------------------------------
  // PROMQL BUILDER
  // -------------------------------------------------------------
  const selPromqlType = document.getElementById('sel-promql-type');
  const inputPromqlService = document.getElementById('input-promql-service');
  const selPromqlWindow = document.getElementById('sel-promql-window');
  const promqlOutputCode = document.getElementById('promql-output-code');
  const btnCopyPromql = document.getElementById('btn-copy-promql');
  const promqlCopyConfirm = document.getElementById('promql-copy-confirm');

  function updatePromql() {
    const type = selPromqlType.value;
    const svc = inputPromqlService.value.trim() || 'payment-api';
    const win = selPromqlWindow.value;

    let expr = '';
    if (type === 'rps') {
      expr = `sum(rate(http_requests_total{service="${svc}"}[${win}]))`;
    } else if (type === 'errors') {
      expr = `sum(rate(http_requests_total{service="${svc}", status=~"5.."}[${win}])) / sum(rate(http_requests_total{service="${svc}"}[${win}])) * 100`;
    } else if (type === 'p99') {
      expr = `histogram_quantile(0.99, sum(rate(http_request_duration_seconds_bucket{service="${svc}"}[${win}])) by (le)) * 1000`;
    } else if (type === 'memory') {
      expr = `container_memory_working_set_bytes{container="${svc}"} / 1024 / 1024`;
    }

    promqlOutputCode.textContent = expr;
  }

  selPromqlType.addEventListener('change', updatePromql);
  inputPromqlService.addEventListener('input', updatePromql);
  selPromqlWindow.addEventListener('change', updatePromql);

  btnCopyPromql.addEventListener('click', () => {
    navigator.clipboard.writeText(promqlOutputCode.textContent).then(() => {
      promqlCopyConfirm.style.opacity = '1';
      setTimeout(() => {
        promqlCopyConfirm.style.opacity = '0';
      }, 1500);
    });
  });

  updatePromql();
});
