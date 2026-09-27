document.addEventListener("DOMContentLoaded", () => {
  // All View Elements
  const views = {
    mainMenu: document.getElementById("view-main-menu"),
    selectTrack: document.getElementById("view-select-track"),
    internshipDetails: document.getElementById("view-internship-details"),
    interviewDetails: document.getElementById("view-interview-details"),
    skillDetails: document.getElementById("view-skill-details"),
    hub: document.getElementById("view-hub"),
    memoryVault: document.getElementById("view-memory-vault")
  };

  let activeTrackData = {
    type: "",
    targetRole: "",
    resumeText: ""
  };

  // Helper Function: Switch Active View
  function showView(targetView) {
    Object.values(views).forEach(v => {
      if (v) v.classList.add("hidden");
    });
    if (targetView) targetView.classList.remove("hidden");
  }

  // NAVIGATION: Main Menu Buttons
  document.getElementById("btn-start-track")?.addEventListener("click", () => showView(views.selectTrack));

  document.getElementById("btn-continue-ws")?.addEventListener("click", () => {
    chrome.storage.local.get(["activeTrack"], (res) => {
      if (res.activeTrack && res.activeTrack.targetRole) {
        activeTrackData = res.activeTrack;
        setupHubView(activeTrackData);
        showView(views.hub);
      } else {
        alert("No previous workspace session found.");
      }
    });
  });

  document.getElementById("btn-memory-vault")?.addEventListener("click", () => {
    loadVaultData();
    showView(views.memoryVault);
  });

  // NAVIGATION: Select Track -> Forms
  document.getElementById("btn-next-step")?.addEventListener("click", () => {
    const selected = document.querySelector('input[name="track"]:checked')?.value;
    if (selected === "internship") showView(views.internshipDetails);
    else if (selected === "interview") showView(views.interviewDetails);
    else if (selected === "skill") showView(views.skillDetails);
  });

  // Back Navigation Buttons
  document.querySelectorAll(".btn-back-main").forEach(btn => {
    btn.addEventListener("click", () => showView(views.mainMenu));
  });
  document.querySelectorAll(".btn-back-select").forEach(btn => {
    btn.addEventListener("click", () => showView(views.selectTrack));
  });

  // Safe File Reading
  async function readFileAsText(fileInput) {
    if (!fileInput || !fileInput.files || fileInput.files.length === 0) {
      return "";
    }
    const file = fileInput.files[0];
    
    if (!file.name.endsWith('.txt')) {
      return `Uploaded File Reference: ${file.name} (Non-TXT format)`;
    }

    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (e) => resolve(e.target.result || "");
      reader.onerror = () => resolve(`Uploaded File Reference: ${file.name}`);
      reader.readAsText(file);
    });
  }

  // Handle Initialize Button Clicks
  async function handleInitialize(type, roleInputId, fileInputId) {
    const roleVal = document.getElementById(roleInputId)?.value?.trim();
    if (!roleVal) {
      alert("Please enter Target Role / Goal!");
      return;
    }

    const fileInput = document.getElementById(fileInputId);
    let resumeTxt = "";
    try {
      resumeTxt = await readFileAsText(fileInput);
    } catch (e) {
      resumeTxt = "No resume text attached.";
    }

    activeTrackData = {
      type: type,
      targetRole: roleVal,
      resumeText: resumeTxt || "No resume text attached."
    };

    // Save Active Session to Chrome Storage
    chrome.storage.local.set({ activeTrack: activeTrackData });

    // Save Log to Memory Vault History
    chrome.storage.local.get(["vaultHistory"], (res) => {
      const history = res.vaultHistory || [];
      history.unshift({
        type: type,
        role: roleVal,
        timestamp: new Date().toLocaleString()
      });
      chrome.storage.local.set({ vaultHistory: history });
    });

    // Render Hub & Transition View
    setupHubView(activeTrackData);
    showView(views.hub);
  }

  document.getElementById("init-internship")?.addEventListener("click", () => {
    handleInitialize("Internship", "internship-role", "internship-resume");
  });

  document.getElementById("init-interview")?.addEventListener("click", () => {
    handleInitialize("Interview", "interview-role", "interview-resume");
  });

  document.getElementById("init-skill")?.addEventListener("click", () => {
    handleInitialize("Skill", "skill-name", "skill-resume");
  });

  // Render Subsystem Grid Buttons dynamically based on diagram & track choice
  function setupHubView(data) {
    const hubTitle = document.getElementById("hub-title");
    if (hubTitle) hubTitle.innerText = `${data.targetRole} Hub`;

    const grid = document.getElementById("subsystems-grid");
    if (!grid) return;

    let subsystems = [];
    const trackType = (data.type || "").toLowerCase();

    // 1. INTERNSHIP TRACK (As per Diagram 5A)
    if (trackType.includes("internship")) {
      subsystems = [
        { name: "Resume Optimizer", icon: "📝" },
        { name: "Target Topics", icon: "📚" },
        { name: "Cold Mail", icon: "🎯" },
        { name: "HR & Aptitude", icon: "🗣️" },
        { name: "Aptitude Drills", icon: "🧮" },
        { name: "Applications Tracker", icon: "📊" },
        { name: "Resources", icon: "📄" }
      ];
    } 
    // 2. SKILL DEVELOPMENT TRACK (Generic for all domains)
    else if (trackType.includes("skill")) {
      subsystems = [
        { name: "Learning Roadmap", icon: "🗺️" },
        { name: "Project Ideas", icon: "🛠️" },
        { name: "Concept Explainer", icon: "💡" },
        { name: "Practice Quizzes", icon: "🧩" },
        { name: "Skill Assessment", icon: "🔍" },
        { name: "Resources & Docs", icon: "📄" }
      ];
    } 
    // 3. INTERVIEW PREP TRACK (As per Diagram 5B)
    else {
      subsystems = [
        { name: "HR Round", icon: "🗣️" },
        { name: "Behavioral Round", icon: "🧠" },
        { name: "Domain Knowledge", icon: "📚" },
        { name: "Case Study / Technical", icon: "💼" },
        { name: "Mock Interview", icon: "🎙️" },
        { name: "Performance Analytics", icon: "📊" },
        { name: "Resources & Cheatsheet", icon: "📄" }
      ];
    }

    grid.innerHTML = subsystems.map(s => `
      <button class="sub-btn" data-sub="${s.name}">
        <span class="icon">${s.icon}</span>
        <span class="btn-text">${s.name}</span>
      </button>
    `).join("");

    grid.querySelectorAll(".sub-btn").forEach(btn => {
      btn.addEventListener("click", () => triggerSubsystem(btn.getAttribute("data-sub")));
    });
  }

  // 1. Subsystem API Call
  async function triggerSubsystem(subName) {
    const card = document.getElementById("subsystem-output-card");
    const nameDisp = document.getElementById("subsystem-name-display");
    const bodyDisp = document.getElementById("subsystem-response-body");

    if (card) card.classList.remove("hidden");
    if (nameDisp) nameDisp.innerText = subName;
    if (bodyDisp) bodyDisp.innerHTML = "<em>Analyzing profile with Ollama LLM...</em>";

    try {
      const res = await fetch("http://localhost:5000/api/analyze-subsystem", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          subsystem: subName,
          target_role: activeTrackData.targetRole,
          resume_text: activeTrackData.resumeText
        })
      });
      const result = await res.json();
      if (result.success) {
        bodyDisp.innerText = result.response;
      } else {
        bodyDisp.innerText = "Error: " + (result.error || "Failed to analyze.");
      }
    } catch (err) {
      bodyDisp.innerText = "Error: Backend server (app.py) is not running.";
    }
  }

  // 2. Ask Anything Chat API Call
  const btnSend = document.getElementById("btn-fast-send");
  const quickInput = document.getElementById("quick-input");

  async function sendQuestion() {
    const q = quickInput?.value?.trim();
    if (!q) return;

    const card = document.getElementById("qa-output-card");
    const qDisp = document.getElementById("qa-question-display");
    const aDisp = document.getElementById("qa-response-body");

    if (card) card.classList.remove("hidden");
    if (qDisp) qDisp.innerText = q;
    if (aDisp) aDisp.innerHTML = "<em>Agent thinking...</em>";
    if (quickInput) quickInput.value = "";

    try {
      const res = await fetch("http://localhost:5000/api/ask-question", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          question: q,
          target_role: activeTrackData.targetRole,
          resume_text: activeTrackData.resumeText
        })
      });
      const result = await res.json();
      if (result.success) {
        aDisp.innerText = result.response;
      } else {
        aDisp.innerText = "Error: " + (result.error || "Failed to respond.");
      }
    } catch (err) {
      aDisp.innerText = "Error: Backend server (app.py) is not running.";
    }
  }

  btnSend?.addEventListener("click", sendQuestion);
  quickInput?.addEventListener("keydown", (e) => {
    if (e.key === "Enter") sendQuestion();
  });

  // Memory Vault Data Renderer
  function loadVaultData() {
    const vaultContainer = document.getElementById("vault-content");
    if (!vaultContainer) return;

    chrome.storage.local.get(["vaultHistory"], (res) => {
      const history = res.vaultHistory || [];
      if (history.length === 0) {
        vaultContainer.innerHTML = '<p class="empty-text">No saved sessions found in memory.</p>';
        return;
      }

      vaultContainer.innerHTML = history.map(item => `
        <div class="vault-card">
          <div class="vault-card-header">
            <span class="vault-badge">${item.type}</span>
            <span class="vault-time">${item.timestamp}</span>
          </div>
          <div class="vault-card-body">
            <strong>Role:</strong> ${item.role}
          </div>
        </div>
      `).join("");
    });
  }
});