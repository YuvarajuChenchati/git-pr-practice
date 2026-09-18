// CI/CD & GitOps Interactive Hub Application Logic

document.addEventListener('DOMContentLoaded', () => {
  const data = window.CICD_DATA;

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
      .replace(/#### (.*?)\n/g, '<h4 style="color: var(--pipeline-cyan-light); margin: 1rem 0 0.5rem 0;">$1</h4>')
      .replace(/```text([\s\S]*?)```/g, '<pre><code>$1</code></pre>')
      .replace(/```yaml([\s\S]*?)```/g, '<pre><code class="language-yaml">$1</code></pre>')
      .replace(/```bash([\s\S]*?)```/g, '<pre><code class="language-bash">$1</code></pre>')
      .replace(/```([\s\S]*?)```/g, '<pre><code>$1</code></pre>')
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/`([^`]+)`/g, '<code style="color: #7dd3fc; background: #0b1424; padding: 2px 6px; border-radius: 4px;">$1</code>')
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
  // PIPELINE SIMULATOR LOGIC
  // -------------------------------------------------------------
  let pipelineStages = JSON.parse(JSON.stringify(data.pipelineStages));
  const pipelineTrackContainer = document.getElementById('pipeline-track-container');
  const pipelineConsoleOutput = document.getElementById('pipeline-console-output');
  const btnRunPipeline = document.getElementById('btn-run-pipeline');
  const btnFailTest = document.getElementById('btn-fail-test');
  const btnDriftHeal = document.getElementById('btn-drift-heal');
  const btnResetPipeline = document.getElementById('btn-reset-pipeline');

  function renderPipelineTrack() {
    pipelineTrackContainer.innerHTML = '';
    pipelineStages.forEach((stage, idx) => {
      const box = document.createElement('div');
      const isRunning = stage.status === "Running";
      const isPassed = stage.status === "Passed";
      const isFailed = stage.status === "Failed";

      box.className = `pipeline-stage-box ${isRunning ? 'running' : ''} ${isPassed ? 'passed' : ''} ${isFailed ? 'failed' : ''}`;
      box.innerHTML = `
        <div class="stage-icon">${stage.icon}</div>
        <div class="stage-title">${stage.name}</div>
        <div style="font-size: 0.72rem; color: var(--text-subtle); margin-top: 2px;">${stage.desc}</div>
        <div class="stage-status ${stage.status.toLowerCase()}">${stage.status}</div>
      `;
      pipelineTrackContainer.appendChild(box);

      if (idx < pipelineStages.length - 1) {
        const conn = document.createElement('div');
        conn.className = 'pipeline-connector';
        conn.textContent = '➔';
        pipelineTrackContainer.appendChild(conn);
      }
    });
  }

  btnRunPipeline.addEventListener('click', () => {
    btnRunPipeline.disabled = true;
    pipelineConsoleOutput.innerHTML = `
      <span style="color: var(--pipeline-cyan);">&gt; [Event: git.push] Commit 8f9b2c1 pushed to 'main' branch by developer.</span><br>
      <span style="color: var(--text-subtle);">Booting ephemeral runner: ubuntu-latest (2-core, 8GB RAM)...</span><br>
    `;

    executeStage(0, false);
  });

  btnFailTest.addEventListener('click', () => {
    btnRunPipeline.disabled = true;
    pipelineConsoleOutput.innerHTML = `
      <span style="color: var(--pipeline-cyan);">&gt; [Event: pull_request] PR #42 opened: 'Feature: payment discount code'</span><br>
      <span style="color: var(--text-subtle);">Booting ephemeral runner: ubuntu-latest...</span><br>
    `;

    executeStage(0, true);
  });

  function executeStage(index, shouldFailAtTest) {
    if (index >= pipelineStages.length) {
      pipelineConsoleOutput.innerHTML += `<br><span style="color: #34d399; font-weight: 700;">🎉 [PIPELINE SUCCESS] Docker image 'v1.4.0-sha-8f9b2c1' synced to Kubernetes cluster with zero downtime!</span>`;
      btnRunPipeline.disabled = false;
      return;
    }

    const currentStage = pipelineStages[index];
    currentStage.status = "Running";
    renderPipelineTrack();

    setTimeout(() => {
      if (shouldFailAtTest && index === 1) {
        // Fail at tests!
        currentStage.status = "Failed";
        renderPipelineTrack();
        pipelineConsoleOutput.innerHTML += `
          <br><span style="color: var(--danger); font-weight: 700;">&gt; [FAIL] Jest Suite: 4 passed, 1 FAILED!</span><br>
          <span style="color: var(--danger);">&nbsp;&nbsp;● PaymentService › should validate discount code</span><br>
          <span style="color: var(--danger);">&nbsp;&nbsp;&nbsp;&nbsp;TypeError: Cannot read properties of undefined (reading 'discountPercent')</span><br>
          <br>
          <span style="color: var(--warning); font-weight: 700;">🛡️ [CIRCUIT BREAKER TRIGGERED] Pipeline terminated! Broken code blocked from production!</span>
        `;
        btnRunPipeline.disabled = false;
        return;
      }

      currentStage.status = "Passed";
      renderPipelineTrack();

      // Output logs based on stage
      if (index === 0) {
        pipelineConsoleOutput.innerHTML += `<span style="color: var(--success);">&gt; [1/5 Git] Code checked out cleanly (commit: 8f9b2c1).</span><br>`;
      } else if (index === 1) {
        pipelineConsoleOutput.innerHTML += `<span style="color: var(--success);">&gt; [2/5 Tests] ESLint: 0 errors. Jest: 142 tests PASSED (0.8s).</span><br>`;
      } else if (index === 2) {
        pipelineConsoleOutput.innerHTML += `<span style="color: var(--success);">&gt; [3/5 Trivy] OS & Library CVE scan: 0 CRITICAL, 0 HIGH vulnerabilities found!</span><br>`;
      } else if (index === 3) {
        pipelineConsoleOutput.innerHTML += `<span style="color: var(--success);">&gt; [4/5 Docker] Buildx multi-arch (amd64/arm64) built & pushed to ECR with sha-8f9b2c1!</span><br>`;
      } else if (index === 4) {
        pipelineConsoleOutput.innerHTML += `<span style="color: var(--success);">&gt; [5/5 ArgoCD] GitOps Controller synced manifest: Healthy & InSync!</span><br>`;
      }

      executeStage(index + 1, shouldFailAtTest);
    }, 700);
  }

  btnDriftHeal.addEventListener('click', () => {
    const gitopsStage = pipelineStages[4];
    gitopsStage.status = "Running";
    renderPipelineTrack();

    pipelineConsoleOutput.innerHTML = `
      <span style="color: var(--warning); font-weight: 700;">&gt; [ALERT] Manual drift detected in production cluster!</span><br>
      <span style="color: var(--text-subtle);">Someone ran 'kubectl edit deployment payment-api' at 2:14 AM and modified replicas from 4 to 1.</span><br>
      <span style="color: var(--pipeline-cyan);">&gt; [ArgoCD Controller] App status marked 'OutOfSync'.</span><br>
      <span style="color: var(--success); font-weight: 700;">&gt; [Automated Self-Healing] ArgoCD auto-sync triggered! Reverting cluster back to Git desired state (replicas: 4)...</span>
    `;

    setTimeout(() => {
      gitopsStage.status = "Passed";
      renderPipelineTrack();
      pipelineConsoleOutput.innerHTML += `<br><span style="color: var(--success); font-weight: 700;">🛡️ Cluster restored to 100% InSync with Git! Rogue change eradicated!</span>`;
    }, 1000);
  });

  btnResetPipeline.addEventListener('click', () => {
    pipelineStages = JSON.parse(JSON.stringify(data.pipelineStages));
    renderPipelineTrack();
    pipelineConsoleOutput.innerHTML = `
      <span style="color: var(--pipeline-cyan-light);">&gt; Pipeline reset to Ready state.</span><br>
      Click 'Simulate Git Push' to test the full pipeline.
    `;
    btnRunPipeline.disabled = false;
  });

  renderPipelineTrack();

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
      quizTitle.textContent = "🏆 Complete DevOps Master Achieved!";
      quizScenario.innerHTML = `You scored <strong>${quizScore} / ${data.quizChallenges.length * 100} points</strong>.<br>You have officially mastered the complete modern cloud lifecycle: <strong>Docker ➔ Kubernetes ➔ Terraform ➔ CI/CD & GitOps</strong>!`;
      quizOptionsContainer.innerHTML = '';
      quizFeedbackBox.style.display = 'none';
      return;
    }

    quizProgressText.textContent = `Incident ${currentQuizIndex + 1} of ${data.quizChallenges.length}`;
    quizScoreDisplay.textContent = `DevSecOps Score: ${quizScore} pts`;
    quizTitle.textContent = q.title;
    quizScenario.textContent = q.scenario;
    quizFeedbackBox.style.display = 'none';

    quizOptionsContainer.innerHTML = '';
    q.options.forEach((opt, idx) => {
      const btn = document.createElement('button');
      btn.className = 'quiz-option-btn';
      btn.innerHTML = `<span style="font-family: var(--font-mono); font-weight: 700; color: var(--pipeline-cyan-light);">${String.fromCharCode(65 + idx)}.</span> <span>${opt}</span>`;
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
      quizScoreDisplay.textContent = `DevSecOps Score: ${quizScore} pts`;
      quizMemeImg.src = q.memeCorrect;
      quizFeedbackTitle.innerHTML = `<span style="color: var(--success);">🎉 CORRECT! SENIOR GITOPS ARCHITECT!</span>`;
    } else {
      clickedBtn.classList.add('wrong');
      allBtns[q.correctIndex].classList.add('correct');
      quizMemeImg.src = q.memeWrong;
      quizFeedbackTitle.innerHTML = `<span style="color: var(--danger);">💥 PRODUCTION INCIDENT! HOTFIX REQUIRED!</span>`;
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
  // WORKFLOW GENERATOR
  // -------------------------------------------------------------
  const genNode = document.getElementById('gen-node');
  const genRegistry = document.getElementById('gen-registry');
  const genTrivy = document.getElementById('gen-trivy');
  const workflowOutputCode = document.getElementById('workflow-output-code');
  const btnCopyWorkflow = document.getElementById('btn-copy-workflow');
  const workflowCopyConfirm = document.getElementById('workflow-copy-confirm');

  function updateWorkflowYaml() {
    const nodeVer = genNode.value;
    const registry = genRegistry.value;
    const hasTrivy = genTrivy.checked;

    let yaml = `name: Production CI/CD Pipeline

on:
  push:
    branches: [ main ]

jobs:
  test-and-build:
    runs-on: ubuntu-latest
    steps:
      - name: 1. Checkout Source Code
        uses: actions/checkout@v4

      - name: 2. Setup Node.js ${nodeVer}
        uses: actions/setup-node@v4
        with:
          node-version: '${nodeVer}'
          cache: 'npm'

      - name: 3. Install Dependencies Cleanly
        run: npm ci

      - name: 4. Execute Test Suite
        run: npm test --if-present
`;

    if (hasTrivy) {
      yaml += `
      - name: 5. Run Aqua Trivy CVE Security Scan
        uses: aquasecurity/trivy-action@master
        with:
          scan-type: 'fs'
          severity: 'CRITICAL,HIGH'
          exit-code: '1'
`;
    }

    yaml += `
      - name: 6. Setup Docker Buildx
        uses: docker/setup-buildx-action@v3

      - name: 7. Build and Push to ${registry.toUpperCase()}
        uses: docker/build-push-action@v5
        with:
          context: .
          push: true
          tags: my-org/app:sha-\${{ github.sha }}
          cache-from: type=gha
          cache-to: type=gha,mode=max
`;

    workflowOutputCode.textContent = yaml;
  }

  genNode.addEventListener('change', updateWorkflowYaml);
  genRegistry.addEventListener('change', updateWorkflowYaml);
  genTrivy.addEventListener('change', updateWorkflowYaml);

  btnCopyWorkflow.addEventListener('click', () => {
    navigator.clipboard.writeText(workflowOutputCode.textContent).then(() => {
      workflowCopyConfirm.style.opacity = '1';
      setTimeout(() => {
        workflowCopyConfirm.style.opacity = '0';
      }, 1500);
    });
  });

  updateWorkflowYaml();
});
