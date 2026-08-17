/**
 * Copyright (c) 2026 Joseph Brewerton
 * Licensed under the MIT License.
 */
// High-Performance WebRTC Loopback with IndexedDB Quiz Context, SPA Navigation & Socratic Guard
(function () {
  let pc1 = null;
  let pc2 = null;
  let sendChannel = null;
  let receiveChannel = null;
  let packetCounter = 0;
  let startTime = 0;
  let currentStreamId = 0;
  let currentAbortController = null;
  let lastQueryTimestamp = 0;
  const COOLDOWN_MS = 2000;

  const PEDAGOGICAL_SYSTEM_PROMPT =
    "You are a friendly Socratic school tutor. " +
    "Guide students by asking helpful questions and giving short clues so they can find the answer themselves. " +
    "Keep your explanations brief (under 3 sentences) and focused on the school lesson.";

  function sanitizeStudentInput(text) {
    if (!text || typeof text !== "string") return { valid: true, sanitized: "" };
    const trimmed = text.trim();

    if (trimmed.length > 350) {
      return {
        valid: false,
        reason: "⚠️ Question too long. Please ask one specific question at a time (max 350 characters)."
      };
    }

    const jailbreaks = [
      /ignore (all|previous|prior|above) (instructions|rules|prompts)/i,
      /you are now in (dan|developer|unrestricted|jailbreak) mode/i,
      /system prompt/i,
      /pretend (you have no|there are no) rules/i,
      /bypass filter/i,
      /act as/i,
      /write (me )?(an essay|a 500 word|a full paper)/i,
      /do my (homework|assignment)/i
    ];

    for (const pattern of jailbreaks) {
      if (pattern.test(trimmed)) {
        return {
          valid: false,
          reason: "⚠️ Prompt restricted: Please ask a direct question about your school curriculum."
        };
      }
    }

    return { valid: true, sanitized: trimmed };
  }

  const DB_NAME = "SchoolAIPortalDB";
  const DB_VERSION = 1;

  function openSchoolDB() {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(DB_NAME, DB_VERSION);
      request.onupgradeneeded = (e) => {
        const db = e.target.result;
        if (!db.objectStoreNames.contains("quiz_context")) {
          db.createObjectStore("quiz_context", { keyPath: "id" });
        }
      };
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  async function setLastTutorQuestion(topic, questionText) {
    try {
      const db = await openSchoolDB();
      const tx = db.transaction("quiz_context", "readwrite");
      tx.objectStore("quiz_context").put({
        id: "active_challenge",
        topic: topic,
        question: questionText,
        updatedAt: Date.now()
      });
    } catch (e) {
      console.warn("[IDB] Write skipped:", e);
    }
  }

  async function getLastTutorQuestion() {
    try {
      const db = await openSchoolDB();
      return new Promise((resolve) => {
        const tx = db.transaction("quiz_context", "readonly");
        const req = tx.objectStore("quiz_context").get("active_challenge");
        req.onsuccess = () => resolve(req.result || null);
        req.onerror = () => resolve(null);
      });
    } catch (e) {
      return null;
    }
  }

  async function clearActiveQuiz() {
    try {
      const db = await openSchoolDB();
      const tx = db.transaction("quiz_context", "readwrite");
      tx.objectStore("quiz_context").delete("active_challenge");
    } catch (e) {}
  }

  async function buildContextualPrompt(topic, rawInput, isCustomInput = false) {
    if (!isCustomInput) {
      await clearActiveQuiz();
      return `${PEDAGOGICAL_SYSTEM_PROMPT}\n\nStudent Topic/Question: "${rawInput}"\nTutor Hint:`;
    }

    const activeQuiz = await getLastTutorQuestion();
    if (activeQuiz && activeQuiz.question) {
      await clearActiveQuiz();
      return (
        `${PEDAGOGICAL_SYSTEM_PROMPT}\n\n` +
        `Active Lesson: ${activeQuiz.topic}\n` +
        `Active Quiz Question: "${activeQuiz.question}"\n` +
        `Student Answer: "${rawInput}"\n` +
        `Tutor Instruction: Evaluate if the student's answer is correct for the quiz question. If correct, praise them. If incorrect, give one clue.`
      );
    }

    return `${PEDAGOGICAL_SYSTEM_PROMPT}\n\nStudent Question: "${rawInput}"\nTutor Hint:`;
  }

  async function initWebRTCHud() {
    try {
      openSchoolDB().catch(() => {});

      if (pc1) { pc1.close(); }
      if (pc2) { pc2.close(); }

      pc1 = new RTCPeerConnection();
      pc2 = new RTCPeerConnection();

      pc1.onicecandidate = (e) => e.candidate && pc2.addIceCandidate(e.candidate);
      pc2.onicecandidate = (e) => e.candidate && pc1.addIceCandidate(e.candidate);

      pc2.ondatachannel = (event) => {
        receiveChannel = event.channel;
        receiveChannel.onmessage = handleAIInference;
      };

      sendChannel = pc1.createDataChannel("ai-telemetry-channel");
      sendChannel.onopen = () => {
        updateElem("webrtc-status", "ONLINE (DTLS-SRTP)");
        updateElem("webrtc-cors", "BYPASSED (SCTP/UDP)");
      };

      sendChannel.onmessage = (event) => {
        const data = JSON.parse(event.data);
        const display = document.getElementById("ai-output-box");
        if (data.streamId === currentStreamId && display) {
          display.innerText += data.chunk;
        }
      };

      const offer = await pc1.createOffer();
      await pc1.setLocalDescription(offer);
      await pc2.setRemoteDescription(offer);

      const answer = await pc2.createAnswer();
      await pc2.setLocalDescription(answer);
      await pc1.setRemoteDescription(answer);
    } catch (err) {
      console.warn("[WebRTC-Agent] Init error:", err);
    }
  }

  async function handleAIInference(event) {
    const payload = JSON.parse(event.data);
    const streamId = payload.streamId;
    const rtt = Math.round(performance.now() - startTime);
    updateElem("webrtc-rtt", `${rtt} ms`);

    const rawPrompt = payload.prompt || payload.topic;
    let fullText = "";
    const wrappedPrompt = await buildContextualPrompt(payload.topic, rawPrompt, payload.isCustomInput);

    if (window.ai && window.ai.languageModel) {
      try {
        const capabilities = await window.ai.languageModel.capabilities();
        if (capabilities.available === "readily") {
          const session = await window.ai.languageModel.create({
            systemPrompt: PEDAGOGICAL_SYSTEM_PROMPT
          });
          const stream = session.promptStreaming(rawPrompt);
          let prevLen = 0;

          for await (const chunk of stream) {
            if (streamId !== currentStreamId) return;
            const newChunk = chunk.slice(prevLen);
            prevLen = chunk.length;
            fullText += newChunk;
            packetCounter++;
            updateElem("webrtc-packets", packetCounter);
            receiveChannel.send(JSON.stringify({ streamId, chunk: newChunk, done: false }));
          }

          receiveChannel.send(JSON.stringify({ streamId, chunk: "", done: true }));
          setLastTutorQuestion(payload.topic, fullText);
          handleVoice(payload, fullText, streamId);
          return;
        }
      } catch (nanoErr) {
        console.warn("[WebRTC-Agent] Nano fallback:", nanoErr);
      }
    }

    if (currentAbortController) {
      currentAbortController.abort();
    }
    currentAbortController = new AbortController();

    try {
      const response = await fetch("http://localhost:11434/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        signal: currentAbortController.signal,
        body: JSON.stringify({
          model: "llama3.2:1b",
          prompt: wrappedPrompt,
          stream: true
        })
      });

      if (!response.ok) throw new Error("Ollama non-200");

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";

      while (true) {
        if (streamId !== currentStreamId) break;
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n");
        buffer = lines.pop();

        for (const line of lines) {
          if (line.trim() && streamId === currentStreamId) {
            const parsed = JSON.parse(line);
            if (parsed.response) {
              fullText += parsed.response;
              packetCounter++;
              updateElem("webrtc-packets", packetCounter);
              receiveChannel.send(JSON.stringify({ streamId, chunk: parsed.response, done: false }));
            }
          }
        }
      }

      if (streamId === currentStreamId) {
        receiveChannel.send(JSON.stringify({ streamId, chunk: "", done: true }));
        setLastTutorQuestion(payload.topic, fullText);
        handleVoice(payload, fullText, streamId);
      }
      return;
    } catch (err) {
      if (err.name === "AbortError") return;

      const fallbacks = {
        fractions: "Fractions represent equal parts of a whole. If you cut a pizza into 4 equal slices and eat 1, what fraction of the pizza is left?",
        timetables: "Notice how the digits of the 9 times table always add up to 9 (e.g. 18 -> 1+8=9, 27 -> 2+7=9). What number comes after 27?",
        habitats: "A habitat provides an animal with food, water, and shelter. What kind of shelter would a polar bear need compared to a desert camel?",
        'robot-instructions': "A robot needs exact sequential logic! If you say 'put butter on bread', it might drop the whole tub without opening it. What is step 1?",
        'spot-error': "Fact 1: Fish use gills. Fact 2: Birds have hollow bones. Fact 3: Cows fly south for winter to lay eggs. Which fact is fake?",
        'story-builder': "You open the creaky library door and discover a glowing staircase leading underground. Do you step onto the stairs or find a light switch?",
        algebra: "To solve ax² + bx + c = 0, first identify a, b, and c. What is your 'a' value here?",
        photosynthesis: "Photosynthesis converts light photons into chemical energy: 6CO₂ + 6H₂O + light ➔ C₆H₁₂O₆ + 6O₂. What does chlorophyll capture?",
        physics: "Newton's Second Law states F = ma. What happens to acceleration if mass doubles while force stays constant?",
        custom: `Let's break down your question: "${rawPrompt}". What is the first key principle or concept we should look at?`
      };

      const fallbackText = fallbacks[payload.topic] || fallbacks.custom;
      let index = 0;
      fullText = fallbackText;

      const interval = setInterval(() => {
        if (streamId !== currentStreamId) {
          clearInterval(interval);
          return;
        }

        if (index < fallbackText.length) {
          packetCounter++;
          updateElem("webrtc-packets", packetCounter);
          if (receiveChannel && receiveChannel.readyState === "open") {
            receiveChannel.send(JSON.stringify({ streamId, chunk: fallbackText[index], done: false }));
          }
          index++;
        } else {
          if (receiveChannel && receiveChannel.readyState === "open") {
            receiveChannel.send(JSON.stringify({ streamId, chunk: "", done: true }));
          }
          clearInterval(interval);
          setLastTutorQuestion(payload.topic, fullText);
          handleVoice(payload, fullText, streamId);
        }
      }, 10);
    }
  }

  function handleVoice(payload, text, streamId) {
    if (streamId !== currentStreamId) return;
    if (window.speechSynthesis && payload.speak && text) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 1.05;
      window.speechSynthesis.speak(utterance);
    }
  }

  function updateElem(id, text) {
    const el = document.getElementById(id);
    if (el) el.innerText = text;
  }

  window.askSchoolAI = async function (topic, promptText = "", isCustomInput = false) {
    const display = document.getElementById("ai-output-box");
    const input = document.getElementById("custom-prompt-input");

    if (!isCustomInput && input) {
      input.value = "";
    }

    if (!sendChannel || sendChannel.readyState !== "open") {
      await initWebRTCHud();
      await new Promise((r) => setTimeout(r, 80));
    }

    const now = Date.now();
    if (now - lastQueryTimestamp < COOLDOWN_MS) {
      const waitTime = Math.ceil((COOLDOWN_MS - (now - lastQueryTimestamp)) / 1000);
      if (display) display.innerText = `⏳ Please wait ${waitTime}s before asking another question.`;
      return;
    }

    const check = sanitizeStudentInput(promptText || topic);
    if (!check.valid) {
      if (display) display.innerText = check.reason;
      return;
    }

    lastQueryTimestamp = now;
    startTime = performance.now();
    currentStreamId++;
    const thisStreamId = currentStreamId;

    if (window.speechSynthesis) window.speechSynthesis.cancel();

    const speakCheckbox = document.getElementById("enable-voice-toggle");
    const shouldSpeak = speakCheckbox ? speakCheckbox.checked : false;

    if (display) display.innerText = "";
    updateElem("webrtc-status", "ONLINE (DTLS-SRTP)");

    if (sendChannel && sendChannel.readyState === "open") {
      sendChannel.send(JSON.stringify({
        streamId: thisStreamId,
        topic: topic,
        prompt: check.sanitized || promptText || topic,
        isCustomInput: isCustomInput,
        speak: shouldSpeak
      }));
    }
  };

  let lastPathname = window.location.pathname;

  function resetLessonState() {
    const display = document.getElementById("ai-output-box");
    if (display) {
      display.innerText = "Ready. Select a module above.";
    }

    const input = document.getElementById("custom-prompt-input");
    if (input) {
      input.value = "";
    }

    if (window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }

    clearActiveQuiz();
  }

  setInterval(() => {
    if (window.location.pathname !== lastPathname) {
      lastPathname = window.location.pathname;
      resetLessonState();
      initWebRTCHud();
    }
  }, 200);

  window.addEventListener("DOMContentLoaded", initWebRTCHud);
  setInterval(() => {
    const statusEl = document.getElementById("webrtc-status");
    if (statusEl && statusEl.innerText === "READY" && (!sendChannel || sendChannel.readyState !== "open")) {
      initWebRTCHud();
    }
  }, 1000);
})();
