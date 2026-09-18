// Docker Interactive Mastery Hub Application Logic

document.addEventListener('DOMContentLoaded', () => {
  const data = window.DOCKER_DATA;

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
  // STORY MODE LOGIC
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
      btn.innerHTML = `<strong>${story.title.split(':')[0]}</strong><br><span style="font-size: 0.8rem; color: var(--text-subtle);">${story.title.split(':')[1] || ''}</span>`;
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

    // Simple markdown-to-html converter for headlines, bold, tables, and code blocks
    let html = story.content
      .replace(/### (.*?)\n/g, '<h3>$1</h3>')
      .replace(/#### (.*?)\n/g, '<h4>$1</h4>')
      .replace(/```dockerfile([\s\S]*?)```/g, '<pre><code class="language-dockerfile">$1</code></pre>')
      .replace(/```yaml([\s\S]*?)```/g, '<pre><code class="language-yaml">$1</code></pre>')
      .replace(/```bash([\s\S]*?)```/g, '<pre><code class="language-bash">$1</code></pre>')
      .replace(/```([\s\S]*?)```/g, '<pre><code>$1</code></pre>')
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/`([^`]+)`/g, '<code style="color: #38bdf8; background: #0f172a; padding: 2px 6px; border-radius: 4px;">$1</code>')
      .replace(/\n\n/g, '<p style="margin-bottom: 1rem;"></p>')
      .replace(/> \*(.*?)\*/g, '<blockquote style="border-left: 4px solid var(--docker-blue); padding-left: 1rem; color: #93c5fd; font-style: italic; margin: 1rem 0;">"$1"</blockquote>');

    storyBody.innerHTML = html;

    storyTakeawaysList.innerHTML = '';
    story.takeaways.forEach(point => {
      const li = document.createElement('li');
      li.textContent = point;
      storyTakeawaysList.appendChild(li);
    });
  }

  renderStoryNav();
  renderCurrentStory();

  // -------------------------------------------------------------
  // DOCKERFILE LAYER SIMULATOR
  // -------------------------------------------------------------
  let currentPresetKey = 'bad-node';
  let isCodeChanged = false;

  const presetBtns = document.querySelectorAll('.sim-preset-btn[data-preset]');
  const presetTitle = document.getElementById('sim-preset-title');
  const presetFeedback = document.getElementById('sim-preset-feedback');
  const layerStack = document.getElementById('sim-layer-stack');
  const metricSize = document.getElementById('metric-size');
  const metricTime = document.getElementById('metric-time');
  const metricGrade = document.getElementById('metric-grade');
  const simTerminalOutput = document.getElementById('sim-terminal-output');
  const btnTriggerBuild = document.getElementById('btn-trigger-build');
  const btnToggleCodeChange = document.getElementById('btn-toggle-code-change');

  function loadPreset(key) {
    currentPresetKey = key;
    presetBtns.forEach(btn => btn.classList.toggle('active', btn.dataset.preset === key));
    const preset = data.simulatorPresets[key];

    presetTitle.textContent = preset.title;
    presetFeedback.textContent = preset.feedback;
    metricSize.textContent = preset.totalSize;
    metricTime.textContent = preset.buildTime;
    metricGrade.textContent = preset.rating;

    renderLayers(preset.instructions);
    generateBuildLog(preset, isCodeChanged);
  }

  function renderLayers(instructions) {
    layerStack.innerHTML = '';
    instructions.forEach((layer, i) => {
      const item = document.createElement('div');
      
      // Determine if cached based on whether code changed
      let cached = layer.cached;
      if (isCodeChanged) {
        if (currentPresetKey === 'bad-node' && (layer.cmd === 'COPY' || layer.cmd === 'RUN' || layer.cmd === 'CMD')) {
          cached = false; // Busted cache!
        }
      }

      item.className = `layer-item ${cached ? 'cached' : 'busted'}`;
      item.innerHTML = `
        <div>
          <span class="layer-cmd">${layer.cmd}</span>
          <span style="color: #e2e8f0;">${layer.arg}</span>
          <div style="font-size: 0.75rem; color: var(--text-muted); margin-top: 2px;">${layer.note}</div>
        </div>
        <div style="text-align: right;">
          <span class="layer-badge ${cached ? 'cached' : 'busted'}">${cached ? 'CACHED' : 'REBUILT'}</span>
          <div style="font-size: 0.75rem; color: var(--text-subtle); margin-top: 3px;">${layer.size}</div>
        </div>
      `;
      layerStack.appendChild(item);
    });
  }

  function generateBuildLog(preset, codeEdited) {
    let logHtml = `<span class="term-prompt">$</span> docker build -t my-app:latest .<br>`;
    logHtml += `<span style="color: var(--docker-accent);">[+] Building 0.0s (Load build definition from Dockerfile)</span><br>`;
    
    preset.instructions.forEach((inst, idx) => {
      const stepNum = idx + 1;
      let isCached = inst.cached;
      if (codeEdited && currentPresetKey === 'bad-node' && (inst.cmd === 'COPY' || inst.cmd === 'RUN')) {
        isCached = false;
      }

      if (isCached) {
        logHtml += `<span style="color: var(--success);">=&gt; CACHED [${stepNum}/${preset.instructions.length}] ${inst.cmd} ${inst.arg.substring(0, 30)}</span><br>`;
      } else {
        logHtml += `<span style="color: var(--warning);">=&gt; [${stepNum}/${preset.instructions.length}] RUNNING ${inst.cmd} ${inst.arg.substring(0, 30)}...</span><br>`;
        if (inst.cmd === 'RUN' && inst.arg.includes('npm install')) {
          logHtml += `<span style="color: var(--danger); font-size: 0.8rem;">   [fetch] downloading 842 npm packages from registry... (takes 42s)</span><br>`;
        }
      }
    });

    logHtml += `<span style="color: var(--docker-blue);">=&gt; exporting to image: FINISHED (${codeEdited && currentPresetKey === 'bad-node' ? '58.4s' : preset.buildTime})</span>`;
    simTerminalOutput.innerHTML = logHtml;
  }

  presetBtns.forEach(btn => {
    btn.addEventListener('click', () => loadPreset(btn.dataset.preset));
  });

  btnTriggerBuild.addEventListener('click', () => {
    simTerminalOutput.innerHTML = `<span class="term-prompt">$</span> docker build -t my-app:latest .<br><span style="color: var(--docker-blue);">Rebuilding image layers...</span>`;
    setTimeout(() => {
      loadPreset(currentPresetKey);
    }, 400);
  });

  btnToggleCodeChange.addEventListener('click', () => {
    isCodeChanged = !isCodeChanged;
    btnToggleCodeChange.style.borderColor = isCodeChanged ? 'var(--warning)' : 'var(--border-color)';
    btnToggleCodeChange.textContent = isCodeChanged ? '✏️ Code Edited! (Hit Re-Build)' : '✏️ Simulate Code Edit (styles.css)';
    loadPreset(currentPresetKey);
  });

  loadPreset('bad-node');

  // -------------------------------------------------------------
  // NETWORK & VOLUMES SANDBOX
  // -------------------------------------------------------------
  const btnPingDns = document.getElementById('btn-ping-dns');
  const btnTogglePortForward = document.getElementById('btn-toggle-port-forward');
  const btnSimulateDbRestart = document.getElementById('btn-simulate-db-restart');
  const networkConsoleLogs = document.getElementById('network-console-logs');
  const hostBrowserPort = document.getElementById('host-browser-port');
  const boxApi = document.getElementById('box-api');
  const boxDb = document.getElementById('box-db');

  let isPortForwardActive = true;

  btnPingDns.addEventListener('click', () => {
    boxApi.style.borderColor = 'var(--warning)';
    boxDb.style.borderColor = 'var(--docker-blue)';
    
    networkConsoleLogs.innerHTML = `
      <span style="color: var(--docker-blue);">&gt; [Container node-api (172.20.0.3)] curl http://postgres-db:5432</span><br>
      <span style="color: var(--text-subtle);">1. Asking Docker DNS (127.0.0.11:53): "What IP is 'postgres-db'?"</span><br>
      <span style="color: var(--success);">2. Docker DNS reply: 'postgres-db' ➔ 172.20.0.4 (A record)</span><br>
      <span style="color: var(--docker-accent);">3. TCP SYN packet sent to 172.20.0.4:5432 via docker0 virtual bridge</span><br>
      <span style="color: var(--success); font-weight: 700;">4. Connection ACCEPTED! Zero hardcoded host IPs required!</span>
    `;

    setTimeout(() => {
      boxApi.style.borderColor = 'var(--border-color)';
      boxDb.style.borderColor = 'var(--border-color)';
    }, 2000);
  });

  btnTogglePortForward.addEventListener('click', () => {
    isPortForwardActive = !isPortForwardActive;
    if (isPortForwardActive) {
      hostBrowserPort.innerHTML = 'Browser: http://localhost:8080 ➔ 🟢 Active (Forwarded)';
      networkConsoleLogs.innerHTML = `
        <span style="color: var(--success); font-weight: 700;">[iptables NAT] Port forwarding 8080:80 ENABLED.</span><br>
        Request from Chrome to 127.0.0.1:8080 is routed to container 172.20.0.2:80.
      `;
    } else {
      hostBrowserPort.innerHTML = 'Browser: http://localhost:8080 ➔ 🔴 ERR_CONNECTION_REFUSED';
      networkConsoleLogs.innerHTML = `
        <span style="color: var(--danger); font-weight: 700;">[iptables NAT] Port forwarding 8080:80 DISABLED!</span><br>
        Warning: Container is still running on port 80 internally, but host OS has NO routing rule to reach it!
      `;
    }
  });

  btnSimulateDbRestart.addEventListener('click', () => {
    networkConsoleLogs.innerHTML = `
      <span style="color: var(--warning);">&gt; docker stop postgres-db && docker rm postgres-db</span><br>
      <span style="color: var(--danger);">Container destroyed! Write-layer wiped clean.</span><br>
      <span style="color: var(--docker-blue);">&gt; docker run -d --name postgres-db -v pgdata:/var/lib/postgresql/data postgres:16</span><br>
      <span style="color: var(--success); font-weight: 700;">⚓ Re-mounted named volume 'pgdata'. All 25,000 user rows recovered instantly!</span>
    `;
  });

  // -------------------------------------------------------------
  // QUIZ ARENA LOGIC
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

  function renderQuizChallenge() {
    const challenge = data.quizChallenges[currentQuizIndex];
    if (!challenge) {
      // Quiz complete!
      quizTitle.textContent = "🏆 Quiz Complete! You are a Docker Legend!";
      quizScenario.innerHTML = `You scored <strong>${quizScore} / ${data.quizChallenges.length * 100} points</strong>.<br>You are ready to architect multi-container microservices and solve production 3 AM incidents with confidence!`;
      quizOptionsContainer.innerHTML = '';
      quizFeedbackBox.style.display = 'none';
      return;
    }

    quizProgressText.textContent = `Challenge ${currentQuizIndex + 1} of ${data.quizChallenges.length}`;
    quizScoreDisplay.textContent = `DevOps Score: ${quizScore} pts`;
    quizTitle.textContent = challenge.title;
    quizScenario.textContent = challenge.scenario;
    quizFeedbackBox.style.display = 'none';

    quizOptionsContainer.innerHTML = '';
    challenge.options.forEach((opt, idx) => {
      const btn = document.createElement('button');
      btn.className = 'quiz-option-btn';
      btn.innerHTML = `<span style="font-family: var(--font-mono); font-weight: 700; color: var(--docker-accent);">${String.fromCharCode(65 + idx)}.</span> <span>${opt}</span>`;
      btn.addEventListener('click', () => handleQuizAnswer(idx, challenge, btn));
      quizOptionsContainer.appendChild(btn);
    });
  }

  function handleQuizAnswer(selectedIndex, challenge, clickedBtn) {
    const isCorrect = selectedIndex === challenge.correctIndex;
    const allOptionBtns = quizOptionsContainer.querySelectorAll('.quiz-option-btn');
    allOptionBtns.forEach(btn => btn.disabled = true);

    if (isCorrect) {
      clickedBtn.classList.add('correct');
      quizScore += 100;
      quizScoreDisplay.textContent = `DevOps Score: ${quizScore} pts`;
      quizMemeImg.src = challenge.memeCorrect;
      quizFeedbackTitle.innerHTML = `<span style="color: var(--success);">🎉 CORRECT! GIGACHAD DEVOPS MOMENT!</span>`;
    } else {
      clickedBtn.classList.add('wrong');
      allOptionBtns[challenge.correctIndex].classList.add('correct');
      quizMemeImg.src = challenge.memeWrong;
      quizFeedbackTitle.innerHTML = `<span style="color: var(--danger);">💥 OUCH! PRODUCTION INCIDENT TRIGGERED!</span>`;
    }

    quizFeedbackDesc.textContent = challenge.explanation;
    quizFeedbackBox.style.display = 'block';
  }

  btnNextQuiz.addEventListener('click', () => {
    currentQuizIndex++;
    renderQuizChallenge();
  });

  renderQuizChallenge();

  // -------------------------------------------------------------
  // COMMAND BUILDER
  // -------------------------------------------------------------
  const builderFlagsList = document.getElementById('builder-flags-list');
  const inputBuilderImage = document.getElementById('input-builder-image');
  const builderCommandResult = document.getElementById('builder-command-result');
  const btnCopyCommand = document.getElementById('btn-copy-command');
  const copyConfirmText = document.getElementById('copy-confirm-text');

  const activeFlags = {};
  data.commandBuilder.run.flags.forEach(f => {
    activeFlags[f.id] = f.active;
  });

  function renderBuilderFlags() {
    builderFlagsList.innerHTML = '';
    data.commandBuilder.run.flags.forEach(f => {
      const toggle = document.createElement('div');
      const isActive = activeFlags[f.id];
      toggle.className = `flag-toggle ${isActive ? 'active' : ''}`;
      toggle.innerHTML = `
        <div class="flag-info">
          <span class="flag-title">${f.name}</span>
          <span class="flag-desc">${f.desc}</span>
        </div>
        <input type="checkbox" ${isActive ? 'checked' : ''} style="cursor: pointer; transform: scale(1.3); accent-color: var(--docker-blue);">
      `;

      toggle.addEventListener('click', (e) => {
        activeFlags[f.id] = !activeFlags[f.id];
        renderBuilderFlags();
        updateBuilderCommand();
      });

      builderFlagsList.appendChild(toggle);
    });
  }

  function updateBuilderCommand() {
    const imageName = inputBuilderImage.value.trim() || 'nginx:alpine';
    const flagsString = data.commandBuilder.run.flags
      .filter(f => activeFlags[f.id])
      .map(f => f.flag)
      .join(' ');

    builderCommandResult.textContent = `docker run ${flagsString} ${imageName}`;
  }

  inputBuilderImage.addEventListener('input', updateBuilderCommand);

  btnCopyCommand.addEventListener('click', () => {
    navigator.clipboard.writeText(builderCommandResult.textContent).then(() => {
      copyConfirmText.style.opacity = '1';
      setTimeout(() => {
        copyConfirmText.style.opacity = '0';
      }, 1500);
    });
  });

  renderBuilderFlags();
  updateBuilderCommand();
});
