// Kubernetes Interactive Hub Logic

document.addEventListener('DOMContentLoaded', () => {
  const data = window.K8S_DATA;

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

    let html = story.content
      .replace(/### (.*?)\n/g, '<h3>$1</h3>')
      .replace(/#### (.*?)\n/g, '<h4>$1</h4>')
      .replace(/```text([\s\S]*?)```/g, '<pre><code>$1</code></pre>')
      .replace(/```yaml([\s\S]*?)```/g, '<pre><code class="language-yaml">$1</code></pre>')
      .replace(/```bash([\s\S]*?)```/g, '<pre><code class="language-bash">$1</code></pre>')
      .replace(/```([\s\S]*?)```/g, '<pre><code>$1</code></pre>')
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/`([^`]+)`/g, '<code style="color: #60a5fa; background: #0f172a; padding: 2px 6px; border-radius: 4px;">$1</code>')
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
  // CLUSTER & SELF-HEALING SIMULATOR
  // -------------------------------------------------------------
  let clusterState = {
    nodes: [
      { id: "node-alpha", name: "worker-node-1", status: "Ready", ip: "192.168.1.101" },
      { id: "node-beta", name: "worker-node-2", status: "Ready", ip: "192.168.1.102" },
      { id: "node-gamma", name: "worker-node-3", status: "Ready", ip: "192.168.1.103" }
    ],
    pods: [
      { id: "pod-1", name: "payment-api-7c8b-1", node: "node-alpha", version: "v1.0.0", status: "Running" },
      { id: "pod-2", name: "payment-api-7c8b-2", node: "node-alpha", version: "v1.0.0", status: "Running" },
      { id: "pod-3", name: "payment-api-7c8b-3", node: "node-beta", version: "v1.0.0", status: "Running" },
      { id: "pod-4", name: "payment-api-7c8b-4", node: "node-beta", version: "v1.0.0", status: "Running" },
      { id: "pod-5", name: "payment-api-7c8b-5", node: "node-gamma", version: "v1.0.0", status: "Running" },
      { id: "pod-6", name: "payment-api-7c8b-6", node: "node-gamma", version: "v1.0.0", status: "Running" }
    ],
    desiredReplicas: 6,
    currentVersion: "v1.0.0"
  };

  const workerNodesContainer = document.getElementById('worker-nodes-container');
  const clusterConsoleOutput = document.getElementById('cluster-console-output');
  const btnKillPod = document.getElementById('btn-kill-pod');
  const btnCrashNode = document.getElementById('btn-crash-node');
  const btnRollingUpdate = document.getElementById('btn-rolling-update');
  const btnResetCluster = document.getElementById('btn-reset-cluster');

  function renderClusterUI() {
    workerNodesContainer.innerHTML = '';

    clusterState.nodes.forEach(node => {
      const isCrashed = node.status !== "Ready";
      const card = document.createElement('div');
      card.className = `worker-node-card ${isCrashed ? 'crashed' : ''}`;

      const nodePods = clusterState.pods.filter(p => p.node === node.id);

      card.innerHTML = `
        <div class="node-header">
          <div>
            <div class="node-name">${node.name}</div>
            <div style="font-size: 0.75rem; color: var(--text-subtle);">${node.ip}</div>
          </div>
          <span class="node-state-badge ${isCrashed ? 'crashed' : 'ready'}">${node.status}</span>
        </div>
        <div style="font-size: 0.75rem; color: var(--text-subtle); margin-bottom: 6px;">Hosted Pods (${nodePods.length}):</div>
        <div class="pods-container" id="pods-${node.id}">
          ${nodePods.map(pod => `
            <div class="pod-item ${pod.status === 'Terminating' ? 'terminating' : ''}">
              <div>
                <span class="pod-status-dot ${pod.status === 'Running' ? 'running' : 'dead'}"></span>
                <span>${pod.name.substring(0, 18)}</span>
              </div>
              <span style="font-size: 0.72rem; color: ${pod.version === 'v2.0.0' ? 'var(--k8s-blue-light)' : 'var(--warning)'}; font-weight: 700;">${pod.version}</span>
            </div>
          `).join('')}
        </div>
      `;

      workerNodesContainer.appendChild(card);
    });
  }

  // 1. Action: Kill Random Pod
  btnKillPod.addEventListener('click', () => {
    const runningPods = clusterState.pods.filter(p => p.status === "Running");
    if (runningPods.length === 0) return;

    const victim = runningPods[Math.floor(Math.random() * runningPods.length)];
    victim.status = "Terminating";
    renderClusterUI();

    clusterConsoleOutput.innerHTML = `
      <span style="color: var(--danger);">&gt; [Chaos] kubectl delete pod ${victim.name}</span><br>
      <span style="color: var(--warning);">1. [ReplicationController] Detected drift: Desired: 6, Current: 5</span><br>
      <span style="color: var(--k8s-blue-light);">2. [kube-scheduler] Searching for eligible node with available CPU/RAM...</span><br>
      <span style="color: var(--text-subtle);">3. [kubelet] Spawning replacement container...</span>
    `;

    setTimeout(() => {
      // Remove dead pod
      clusterState.pods = clusterState.pods.filter(p => p.id !== victim.id);
      
      // Spawn replacement
      const eligibleNodes = clusterState.nodes.filter(n => n.status === "Ready");
      const targetNode = eligibleNodes[Math.floor(Math.random() * eligibleNodes.length)];
      const newPod = {
        id: "pod-" + Date.now(),
        name: `payment-api-7c8b-${Math.floor(Math.random() * 900 + 100)}`,
        node: targetNode.id,
        version: clusterState.currentVersion,
        status: "Running"
      };
      clusterState.pods.push(newPod);
      renderClusterUI();

      clusterConsoleOutput.innerHTML += `<br><span style="color: var(--success); font-weight: 700;">4. [Self-Healing Complete] Pod ${newPod.name} is RUNNING on ${targetNode.name} in 420ms!</span>`;
    }, 900);
  });

  // 2. Action: Crash Worker Node 2
  btnCrashNode.addEventListener('click', () => {
    const node2 = clusterState.nodes.find(n => n.id === "node-beta");
    if (node2.status !== "Ready") return;

    node2.status = "NotReady (Crashed)";
    
    // Mark its pods as terminating
    clusterState.pods.forEach(p => {
      if (p.node === "node-beta") p.status = "Dead";
    });
    renderClusterUI();

    clusterConsoleOutput.innerHTML = `
      <span style="color: var(--danger); font-weight: 700;">&gt; [ALERT] Node worker-node-2 missed 3 consecutive kubelet heartbeats!</span><br>
      <span style="color: var(--danger);">Node marked 'NotReady'. 2 pods are unresponsive.</span><br>
      <span style="color: var(--warning);">[NodeController] Evicting dead pods from worker-node-2...</span><br>
      <span style="color: var(--k8s-blue-light);">[kube-scheduler] Rescheduling 2 evicted pods to worker-node-1 and worker-node-3...</span>
    `;

    setTimeout(() => {
      // Remove dead pods
      clusterState.pods = clusterState.pods.filter(p => p.node !== "node-beta");

      // Reschedule onto alpha and gamma
      clusterState.pods.push({
        id: "pod-resched-1",
        name: `payment-api-7c8b-${Math.floor(Math.random() * 900 + 100)}`,
        node: "node-alpha",
        version: clusterState.currentVersion,
        status: "Running"
      });
      clusterState.pods.push({
        id: "pod-resched-2",
        name: `payment-api-7c8b-${Math.floor(Math.random() * 900 + 100)}`,
        node: "node-gamma",
        version: clusterState.currentVersion,
        status: "Running"
      });

      renderClusterUI();
      clusterConsoleOutput.innerHTML += `<br><span style="color: var(--success); font-weight: 700;">[Cluster Self-Healed] All 6 desired replicas safely running on surviving nodes!</span>`;
    }, 1200);
  });

  // 3. Action: Rolling Update (v1 -> v2)
  btnRollingUpdate.addEventListener('click', () => {
    clusterState.currentVersion = "v2.0.0";
    clusterConsoleOutput.innerHTML = `
      <span style="color: var(--k8s-blue-light);">&gt; kubectl set image deployment/payment-api web=payment-api:v2.0.0</span><br>
      <span style="color: var(--text-subtle);">Deployment strategy: RollingUpdate (maxSurge: 1, maxUnavailable: 0)</span><br>
      <span style="color: var(--k8s-blue-light);">Rolling out v2.0.0 progressively...</span>
    `;

    let step = 0;
    const interval = setInterval(() => {
      if (step < clusterState.pods.length) {
        clusterState.pods[step].version = "v2.0.0";
        renderClusterUI();
        clusterConsoleOutput.innerHTML += `<br><span style="color: var(--success);">&gt; Pod ${clusterState.pods[step].name} updated to v2.0.0 [Readiness: 200 OK]</span>`;
        step++;
      } else {
        clearInterval(interval);
        clusterConsoleOutput.innerHTML += `<br><span style="color: #c084fc; font-weight: 700;">🎉 [Zero-Downtime Rollout Complete] 100% of pods running v2.0.0! User sessions uninterrupted!</span>`;
      }
    }, 450);
  });

  // 4. Action: Reset Cluster
  btnResetCluster.addEventListener('click', () => {
    clusterState = {
      nodes: [
        { id: "node-alpha", name: "worker-node-1", status: "Ready", ip: "192.168.1.101" },
        { id: "node-beta", name: "worker-node-2", status: "Ready", ip: "192.168.1.102" },
        { id: "node-gamma", name: "worker-node-3", status: "Ready", ip: "192.168.1.103" }
      ],
      pods: [
        { id: "pod-1", name: "payment-api-7c8b-1", node: "node-alpha", version: "v1.0.0", status: "Running" },
        { id: "pod-2", name: "payment-api-7c8b-2", node: "node-alpha", version: "v1.0.0", status: "Running" },
        { id: "pod-3", name: "payment-api-7c8b-3", node: "node-beta", version: "v1.0.0", status: "Running" },
        { id: "pod-4", name: "payment-api-7c8b-4", node: "node-beta", version: "v1.0.0", status: "Running" },
        { id: "pod-5", name: "payment-api-7c8b-5", node: "node-gamma", version: "v1.0.0", status: "Running" },
        { id: "pod-6", name: "payment-api-7c8b-6", node: "node-gamma", version: "v1.0.0", status: "Running" }
      ],
      desiredReplicas: 6,
      currentVersion: "v1.0.0"
    };
    renderClusterUI();
    clusterConsoleOutput.innerHTML = `
      <span style="color: var(--k8s-blue-light);">$ kubectl get nodes</span><br>
      [Reset] All 3 worker nodes Healthy and Ready. 6 pods balanced.
    `;
  });

  renderClusterUI();

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
      quizTitle.textContent = "🏆 Master of Kubernetes Achieved!";
      quizScenario.innerHTML = `You scored <strong>${quizScore} / ${data.quizChallenges.length * 100} points</strong>.<br>You are ready to architect multi-node EKS/GKE clusters, debug production CrashLoopBackOffs, and lead infrastructure rollouts!`;
      quizOptionsContainer.innerHTML = '';
      quizFeedbackBox.style.display = 'none';
      return;
    }

    quizProgressText.textContent = `Challenge ${currentQuizIndex + 1} of ${data.quizChallenges.length}`;
    quizScoreDisplay.textContent = `K8s Score: ${quizScore} pts`;
    quizTitle.textContent = q.title;
    quizScenario.textContent = q.scenario;
    quizFeedbackBox.style.display = 'none';

    quizOptionsContainer.innerHTML = '';
    q.options.forEach((opt, idx) => {
      const btn = document.createElement('button');
      btn.className = 'quiz-option-btn';
      btn.innerHTML = `<span style="font-family: var(--font-mono); font-weight: 700; color: var(--k8s-blue-light);">${String.fromCharCode(65 + idx)}.</span> <span>${opt}</span>`;
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
      quizScoreDisplay.textContent = `K8s Score: ${quizScore} pts`;
      quizMemeImg.src = q.memeCorrect;
      quizFeedbackTitle.innerHTML = `<span style="color: var(--success);">🎉 CORRECT! SENIOR CLOUD ARCHITECT LEVEL!</span>`;
    } else {
      clickedBtn.classList.add('wrong');
      allBtns[q.correctIndex].classList.add('correct');
      quizMemeImg.src = q.memeWrong;
      quizFeedbackTitle.innerHTML = `<span style="color: var(--danger);">💥 PRODUCTION CRASH! PAGERDUTY RINGING!</span>`;
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
  // KUBECTL BUILDER
  // -------------------------------------------------------------
  const inputK8sName = document.getElementById('input-k8s-name');
  const k8sFlagsList = document.getElementById('k8s-flags-list');
  const builderK8sResult = document.getElementById('builder-k8s-result');
  const btnCopyK8s = document.getElementById('btn-copy-k8s');
  const k8sCopyConfirm = document.getElementById('k8s-copy-confirm');

  const activeK8sFlags = {};
  data.commandBuilder.run.flags.forEach(f => {
    activeK8sFlags[f.id] = f.active;
  });

  function renderK8sFlags() {
    k8sFlagsList.innerHTML = '';
    data.commandBuilder.run.flags.forEach(f => {
      const toggle = document.createElement('div');
      const isActive = activeK8sFlags[f.id];
      toggle.className = `flag-toggle ${isActive ? 'active' : ''}`;
      toggle.innerHTML = `
        <div>
          <div style="font-weight: 700; color: #fff;">${f.name}</div>
          <div style="font-size: 0.8rem; color: var(--text-muted);">${f.desc}</div>
        </div>
        <input type="checkbox" ${isActive ? 'checked' : ''} style="cursor: pointer; transform: scale(1.3); accent-color: var(--k8s-blue);">
      `;
      toggle.addEventListener('click', () => {
        activeK8sFlags[f.id] = !activeK8sFlags[f.id];
        renderK8sFlags();
        updateK8sCommand();
      });
      k8sFlagsList.appendChild(toggle);
    });
  }

  function updateK8sCommand() {
    const targetName = inputK8sName.value.trim() || 'payment-api';
    const flagsString = data.commandBuilder.run.flags
      .filter(f => activeK8sFlags[f.id])
      .map(f => f.flag)
      .join(' ');

    builderK8sResult.textContent = `kubectl create deployment ${targetName} --image=nginx:alpine ${flagsString}`;
  }

  inputK8sName.addEventListener('input', updateK8sCommand);

  btnCopyK8s.addEventListener('click', () => {
    navigator.clipboard.writeText(builderK8sResult.textContent).then(() => {
      k8sCopyConfirm.style.opacity = '1';
      setTimeout(() => {
        k8sCopyConfirm.style.opacity = '0';
      }, 1500);
    });
  });

  renderK8sFlags();
  updateK8sCommand();
});
