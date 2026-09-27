# 🤖 AI Internship & Interview Agent

An intelligent, privacy-focused AI platform powered by **Ollama (Local LLM)** designed to bridge the gap between students and industry standards. It provides personalized resume analysis, targeted interview preparation, internship guidance, and skill development tailored specifically for students (including Diploma & Technical streams).

---

## 💡 The Problem & Solution

* **The Problem:** Many students lack clarity on what skills to learn for specific target roles or company placements. Furthermore, they often don't realize that their resumes need to be customized according to specific company requirements.
* **The Solution:** This AI Agent acts as a personal career counselor. By evaluating a student's current resume against their target role, it delivers a Match Percentage, provides structured domain-specific dashboards, and offers interactive AI guidance.

---

## ✨ Key Features

### 🚀 Core Navigation
* **Start Agent:** Launches a new workflow tailored to the user's current objective.
* **Continue Agent:** Restores the exact previous session state if the user closed or navigated away from the application.
* **Agent Memory:** Stores complete historical interaction data, past analysis reports, and previous chat sessions.

---

### 🎯 Primary Workflows

#### 1. 🎙️ Interview Preparation
* **Input:** Target Role & Resume Upload.
* **Dashboard Features:**
  * **Resume Match Percentage:** AI evaluates resume alignment with the desired target role.
  * **Interview Subsystems:** Customized interview preparation modules, mock Q&A, and technical domain breakdowns.
  * **Ask Anything (AI Chatbot):** Instant assistance for clearing domain-specific doubts.

#### 2. 💼 Internship Guidance
* **Input:** Target Role & Resume Upload.
* **Dashboard Features:**
  * **Match Score:** Analyzes eligibility and readiness for specific internship roles.
  * **Internship Subsystems:** Specialized modules focused on internship acquisition, company-wise preparation, and practical application strategies.

#### 3. 🧠 Skill Development
* **Input:** Target Skill & Resume Upload.
* **Dashboard Features:**
  * **Gap Analysis:** Identifies missing core skills based on current resume content.
  * **Skill Subsystems:** Structured learning paths, resource recommendations, and actionable upskilling steps.

---

## 🛠️ Tech Stack & Architecture

* **AI & LLM Engine:** Ollama (Local LLM for fast, private, and offline processing)
* **Core Agent Logic:** Context Preservation & Session State Management (Stateful Agent Loop)
* **Frontend/UI:** Interactive GUI / Dashboard Framework
* **Subsystem Architecture:** Modular AI agents customized per workflow (Interview / Internship / Skill Building)

---

## ⚙️ How It Works

```text
[User] ──► [Select Mode: Interview / Internship / Skill]
             │
             ├──► [Provide Target Role/Skill & Upload Resume]
             │
             └──► [Ollama LLM Processing]
                    │
                    ├──► Calculates Resume Match %
                    ├──► Loads Workflow-Specific Dashboard
                    ├──► Triggers Tailored AI Subsystems
                    └──► Enables "Ask Anything" Contextual Assistant
