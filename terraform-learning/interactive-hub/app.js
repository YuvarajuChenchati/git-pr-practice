// Terraform Interactive Hub Application Logic

document.addEventListener('DOMContentLoaded', () => {
  const data = window.TF_DATA;

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
      .replace(/#### (.*?)\n/g, '<h4 style="color: var(--tf-purple-light); margin: 1rem 0 0.5rem 0;">$1</h4>')
      .replace(/```text([\s\S]*?)```/g, '<pre><code>$1</code></pre>')
      .replace(/```hcl([\s\S]*?)```/g, '<pre><code class="language-hcl">$1</code></pre>')
      .replace(/```bash([\s\S]*?)```/g, '<pre><code class="language-bash">$1</code></pre>')
      .replace(/```([\s\S]*?)```/g, '<pre><code>$1</code></pre>')
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/`([^`]+)`/g, '<code style="color: #c084fc; background: #130e22; padding: 2px 6px; border-radius: 4px;">$1</code>')
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
  // CLUSTER CANVAS SIMULATOR
  // -------------------------------------------------------------
  let canvasResources = JSON.parse(JSON.stringify(data.canvasResources));
  const cloudResourcesContainer = document.getElementById('cloud-resources-container');
  const tfConsoleOutput = document.getElementById('tf-console-output');
  const btnTfPlan = document.getElementById('btn-tf-plan');
  const btnTfApply = document.getElementById('btn-tf-apply');
  const btnTfDrift = document.getElementById('btn-tf-drift');
  const btnTfDestroy = document.getElementById('btn-tf-destroy');

  function renderCanvas() {
    cloudResourcesContainer.innerHTML = '';
    canvasResources.forEach(res => {
      const box = document.createElement('div');
      const isCreated = res.status === "Active (Created)";
      const isModified = res.status.includes("Drift");

      box.className = `resource-box ${isCreated ? 'created' : ''} ${isModified ? 'modified' : ''}`;
      box.innerHTML = `
        <span class="resource-type-badge">${res.type}</span>
        <div class="resource-name">${res.name}</div>
        <div class="resource-status">Status: <strong style="color: ${isCreated ? 'var(--diff-add)' : (isModified ? 'var(--diff-mod)' : 'var(--text-subtle)')};">${res.status}</strong></div>
      `;
      cloudResourcesContainer.appendChild(box);
    });
  }

  btnTfPlan.addEventListener('click', () => {
    const hasDrift = canvasResources.some(r => r.status.includes("Drift"));
    const allCreated = canvasResources.every(r => r.status === "Active (Created)");

    if (hasDrift) {
      tfConsoleOutput.innerHTML = `
        <span style="color: var(--tf-purple-light);">$ terraform plan</span><br>
        <span style="color: var(--diff-mod);">~ aws_security_group.web (Drift Detected!)</span><br>
        &nbsp;&nbsp;~ ingress {<br>
        <span style="color: var(--diff-del);">&nbsp;&nbsp;&nbsp;&nbsp;- cidr_blocks = ["0.0.0.0/0"] (Unauthorized manual change)</span><br>
        <span style="color: var(--diff-add);">&nbsp;&nbsp;&nbsp;&nbsp;+ cidr_blocks = ["10.0.0.0/8"] (Restoring desired code)</span><br>
        &nbsp;&nbsp;}<br>
        <br>
        <strong style="color: var(--diff-mod);">Plan: 0 to add, 1 to change, 0 to destroy.</strong>
      `;
    } else if (allCreated) {
      tfConsoleOutput.innerHTML = `
        <span style="color: var(--tf-purple-light);">$ terraform plan</span><br>
        Refreshing state... [aws_vpc: ok, aws_subnet: ok, aws_instance: ok]<br>
        <span style="color: var(--diff-add); font-weight: 700;">No changes. Your infrastructure matches the configuration!</span>
      `;
    } else {
      tfConsoleOutput.innerHTML = `
        <span style="color: var(--tf-purple-light);">$ terraform plan</span><br>
        Terraform will perform the following actions:<br>
        <span style="color: var(--diff-add);">+ resource "aws_vpc" "production_vpc" (cidr: "10.0.0.0/16")</span><br>
        <span style="color: var(--diff-add);">+ resource "aws_internet_gateway" "gw"</span><br>
        <span style="color: var(--diff-add);">+ resource "aws_subnet" "public_1" (cidr: "10.0.1.0/24")</span><br>
        <span style="color: var(--diff-add);">+ resource "aws_security_group" "web" (ports: 80, 443)</span><br>
        <span style="color: var(--diff-add);">+ resource "aws_instance" "app_server" (type: "t3.medium")</span><br>
        <span style="color: var(--diff-add);">+ resource "aws_s3_bucket" "assets"</span><br>
        <br>
        <strong style="color: var(--diff-add);">Plan: 6 to add, 0 to change, 0 to destroy.</strong>
      `;
    }
  });

  btnTfApply.addEventListener('click', () => {
    tfConsoleOutput.innerHTML = `
      <span style="color: var(--tf-purple-light);">$ terraform apply -auto-approve</span><br>
      <span style="color: var(--diff-add);">aws_vpc.production_vpc: Creating... [ID: vpc-0a84f]</span><br>
      <span style="color: var(--diff-add);">aws_internet_gateway.gw: Creating... [ID: igw-09f1b]</span><br>
      <span style="color: var(--diff-add);">aws_subnet.public_1: Creating... [ID: subnet-0391a]</span><br>
      <span style="color: var(--diff-add);">aws_security_group.web: Creating... [ID: sg-019aa]</span><br>
      <span style="color: var(--diff-add);">aws_instance.app_server: Creating... [ID: i-091f82741]</span><br>
      <span style="color: var(--diff-add);">aws_s3_bucket.assets: Creating... [ID: my-assets-bucket]</span><br>
      <br>
      <span style="color: var(--diff-add); font-weight: 700;">Apply complete! Resources: 6 added, 0 changed, 0 destroyed.</span>
    `;

    canvasResources.forEach(r => r.status = "Active (Created)");
    renderCanvas();
  });

  btnTfDrift.addEventListener('click', () => {
    const sg = canvasResources.find(r => r.id === "sg");
    if (sg) {
      sg.status = "Drift: Port 22 SSH Exposed!";
      renderCanvas();
      tfConsoleOutput.innerHTML = `
        <span style="color: var(--diff-mod); font-weight: 700;">[Rogue AWS Console Action Detected!]</span><br>
        Someone manually logged into AWS Console and edited 'aws_security_group.web' to open Port 22 SSH to 0.0.0.0/0!<br>
        Now click <strong>'terraform plan'</strong> to see how Terraform detects and fixes this drift!
      `;
    }
  });

  btnTfDestroy.addEventListener('click', () => {
    tfConsoleOutput.innerHTML = `
      <span style="color: var(--diff-del);">$ terraform destroy -auto-approve</span><br>
      <span style="color: var(--diff-del);">aws_instance.app_server: Destroying... [Destroyed]</span><br>
      <span style="color: var(--diff-del);">aws_security_group.web: Destroying... [Destroyed]</span><br>
      <span style="color: var(--diff-del);">aws_subnet.public_1: Destroying... [Destroyed]</span><br>
      <span style="color: var(--diff-del);">aws_internet_gateway.gw: Destroying... [Destroyed]</span><br>
      <span style="color: var(--diff-del);">aws_vpc.production_vpc: Destroying... [Destroyed]</span><br>
      <br>
      <span style="color: var(--diff-del); font-weight: 700;">Destroy complete! Resources: 6 destroyed. Cloud cost is now $0.00!</span>
    `;

    canvasResources.forEach(r => r.status = "Destroyed");
    renderCanvas();
  });

  renderCanvas();

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
      quizTitle.textContent = "🏆 Legendary Cloud Architect Achieved!";
      quizScenario.innerHTML = `You scored <strong>${quizScore} / ${data.quizChallenges.length * 100} points</strong>.<br>You have officially conquered the DevOps Trinity: <strong>Docker (Containers) ➔ Kubernetes (Orchestration) ➔ Terraform (Infrastructure as Code)</strong>!`;
      quizOptionsContainer.innerHTML = '';
      quizFeedbackBox.style.display = 'none';
      return;
    }

    quizProgressText.textContent = `Incident ${currentQuizIndex + 1} of ${data.quizChallenges.length}`;
    quizScoreDisplay.textContent = `IaC Score: ${quizScore} pts`;
    quizTitle.textContent = q.title;
    quizScenario.textContent = q.scenario;
    quizFeedbackBox.style.display = 'none';

    quizOptionsContainer.innerHTML = '';
    q.options.forEach((opt, idx) => {
      const btn = document.createElement('button');
      btn.className = 'quiz-option-btn';
      btn.innerHTML = `<span style="font-family: var(--font-mono); font-weight: 700; color: var(--tf-purple-light);">${String.fromCharCode(65 + idx)}.</span> <span>${opt}</span>`;
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
      quizScoreDisplay.textContent = `IaC Score: ${quizScore} pts`;
      quizMemeImg.src = q.memeCorrect;
      quizFeedbackTitle.innerHTML = `<span style="color: var(--diff-add);">🎉 CORRECT! SENIOR INFRASTRUCTURE ARCHITECT!</span>`;
    } else {
      clickedBtn.classList.add('wrong');
      allBtns[q.correctIndex].classList.add('correct');
      quizMemeImg.src = q.memeWrong;
      quizFeedbackTitle.innerHTML = `<span style="color: var(--diff-del);">💥 BILLING SHOCK! INFRASTRUCTURE BROKEN!</span>`;
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
  // HCL GENERATOR
  // -------------------------------------------------------------
  const genRegion = document.getElementById('gen-region');
  const genCidr = document.getElementById('gen-cidr');
  const genEnv = document.getElementById('gen-env');
  const hclOutputCode = document.getElementById('hcl-output-code');
  const btnCopyHcl = document.getElementById('btn-copy-hcl');
  const hclCopyConfirm = document.getElementById('hcl-copy-confirm');

  function updateHcl() {
    const region = genRegion.value;
    const cidr = genCidr.value.trim() || '10.0.0.0/16';
    const env = genEnv.value.trim() || 'production';

    hclOutputCode.textContent = `terraform {
  required_version = ">= 1.5.0"
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }
}

provider "aws" {
  region = "${region}"
}

resource "aws_vpc" "main" {
  cidr_block           = "${cidr}"
  enable_dns_hostnames = true
  enable_dns_support   = true

  tags = {
    Name        = "${env}-vpc"
    Environment = "${env}"
  }
}

resource "aws_subnet" "public_1" {
  vpc_id                  = aws_vpc.main.id
  cidr_block              = "${cidr.split('/')[0].split('.').slice(0, 2).join('.')}.1.0/24"
  map_public_ip_on_launch = true

  tags = {
    Name = "${env}-public-1"
  }
}`;
  }

  genRegion.addEventListener('change', updateHcl);
  genCidr.addEventListener('input', updateHcl);
  genEnv.addEventListener('input', updateHcl);

  btnCopyHcl.addEventListener('click', () => {
    navigator.clipboard.writeText(hclOutputCode.textContent).then(() => {
      hclCopyConfirm.style.opacity = '1';
      setTimeout(() => {
        hclCopyConfirm.style.opacity = '0';
      }, 1500);
    });
  });

  updateHcl();
});
