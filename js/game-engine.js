/* =========================================================
   THE LAST CHAPTER — GAME ENGINE (REFACTORED WITH GIFTS & REWARDS)
   ========================================================= */

let selectedAnswer = "";
let hintIndex = 0;
let currentSolved = false;

/* ------------------------- Utilities ------------------------- */

function normalize(value) {
    return String(value ?? "")
        .trim()
        .toLowerCase()
        .replace(/[^a-z0-9]/g, "");
}

function getCurrentPuzzle() {
    if (typeof PUZZLES === "undefined" || !Array.isArray(PUZZLES) || PUZZLES.length === 0) {
        return null;
    }
    return PUZZLES[state.current] || PUZZLES[0];
}

function isCompleted(puzzleId) {
    return Array.isArray(state.completed) && state.completed.includes(puzzleId);
}

function isCollected(puzzleId) {
    return Array.isArray(state.collectibles) && state.collectibles.includes(puzzleId);
}

function getCollectibleCount() {
    return new Set(state.collectibles || []).size;
}

function getAllCollectiblesFound() {
    return typeof PUZZLES !== "undefined" && 
           PUZZLES.length > 0 &&
           PUZZLES.every((puzzle) => isCollected(puzzle.id));
}

function getHintCount(puzzle) {
    return puzzle && Array.isArray(puzzle.hint) ? puzzle.hint.length : 0;
}

/* ------------------------- Board Grid & Progress ------------------------- */

function isPuzzleUnlocked(index) {
    if (index <= 0) return true;
    const previousPuzzle = PUZZLES[index - 1];
    return Boolean(previousPuzzle && isCompleted(previousPuzzle.id));
}

function renderNav() {
    const collectCount = $("collectCount");
    if (collectCount) collectCount.textContent = getCollectibleCount();

    const progressText = $("progressText");
    if (progressText && typeof PUZZLES !== "undefined") {
        progressText.textContent = `${state.completed.length} / ${PUZZLES.length} CASES SOLVED`;
    }

    const progressBar = $("progressBar");
    if (progressBar && typeof PUZZLES !== "undefined") {
        const percentage = (state.completed.length / PUZZLES.length) * 100;
        progressBar.style.width = `${percentage}%`;
    }

    renderCaseGrid();
}

function renderCaseGrid() {
    const grid = $("caseGrid");
    if (!grid || typeof PUZZLES === "undefined") return;

    grid.innerHTML = "";

    PUZZLES.forEach((puzzle, index) => {
        const active = index === state.current;
        const done = isCompleted(puzzle.id);
        const unlocked = isPuzzleUnlocked(index);

        const card = document.createElement("button");
        card.type = "button";
        card.className = `case-card ${active ? "active" : ""} ${done ? "done" : ""}`;
        card.disabled = !unlocked;

        const top = document.createElement("div");
        top.className = "card-top";
        top.innerHTML = `<span>CASE ${String(puzzle.id).padStart(2, "0")}</span><span class="card-lock">${done ? "✓ SOLVED" : unlocked ? "OPEN" : "🔒 LOCKED"}</span>`;

        const title = document.createElement("h3");
        title.textContent = puzzle.title;

        const desc = document.createElement("p");
        desc.textContent = puzzle.type;

        const bottom = document.createElement("div");
        bottom.className = "card-bottom";
        bottom.innerHTML = `<span>FRAG: ${done ? (puzzle.fragment || "RECOVERED") : "LOCKED"}</span><span>INVESTIGATE ↗</span>`;

        card.append(top, title, desc, bottom);

        if (unlocked) {
            card.addEventListener("click", () => {
                state.current = index;
                saveState();
                renderCase();
                if (typeof showScreen === "function") showScreen("view-case");
            });
        }

        grid.appendChild(card);
    });

    const proceedFinalBtn = $("proceedFinalBtn");
    if (proceedFinalBtn) {
        if (state.completed.length === PUZZLES.length) {
            proceedFinalBtn.style.display = "inline-block";
            proceedFinalBtn.onclick = () => {
                if (typeof showScreen === "function") showScreen("view-letter");
            };
        } else {
            proceedFinalBtn.style.display = "none";
        }
    }
}

/* ------------------------- Case View Rendering ------------------------- */

function renderCase() {
    const puzzle = getCurrentPuzzle();
    if (!puzzle) return;

    selectedAnswer = "";
    hintIndex = (state.hints && state.hints[puzzle.id]) || 0;
    currentSolved = isCompleted(puzzle.id);

    if ($("caseCounter")) {
        $("caseCounter").textContent = `CASE ${String(puzzle.id).padStart(2, "0")} / ${String(PUZZLES.length).padStart(2, "0")}`;
    }
    if ($("caseNumberLabel")) {
        $("caseNumberLabel").textContent = `CASE ${String(puzzle.id).padStart(2, "0")} / ${String(PUZZLES.length).padStart(2, "0")}`;
    }
    if ($("caseType")) $("caseType").textContent = `CASE FILE · ${puzzle.type}`;
    if ($("caseTitle")) $("caseTitle").textContent = puzzle.title;
    if ($("caseStory")) $("caseStory").textContent = puzzle.story;

    if ($("caseObjective")) {
        $("caseObjective").textContent = puzzle.prompt || "Analyze the clue and solve the case.";
    }

    if ($("fragmentStatus")) {
        $("fragmentStatus").textContent = currentSolved
            ? `EVIDENCE FRAGMENT: ${puzzle.fragment || "RECOVERED"}`
            : "EVIDENCE FRAGMENT: LOCKED";
    }

    if ($("hintLeft")) {
        $("hintLeft").textContent = `(${Math.max(0, getHintCount(puzzle) - hintIndex)} LEFT)`;
    }

    if ($("hintBox")) {
        $("hintBox").textContent = "";
        $("hintBox").classList.add("hidden");
    }

    if ($("feedback")) {
        $("feedback").textContent = "";
        $("feedback").className = "feedback";
    }

    const area = $("puzzleArea");
    if (area) {
        area.innerHTML = "";

        const prompt = document.createElement("p");
        prompt.className = "puzzle-instruction";
        prompt.textContent = puzzle.prompt;
        area.appendChild(prompt);

        if (puzzle.mode === "ordering") {
            renderOrderingInput(puzzle, area);
        } else if (puzzle.mode === "choice") {
            renderChoices(puzzle, area);
        } else {
            renderTextInput(area);
        }

        renderCollectibleButton(puzzle, area);
    }

    configureSubmitButton();
    renderNav();
}

/* ------------------------- Puzzle Input Modes ------------------------- */

function renderOrderingInput(puzzle, container) {
    const list = document.createElement("div");
    list.className = "order-list";
    list.id = "orderingList";

    const currentOrder = Array.isArray(puzzle.items) ? [...puzzle.items] : [];

    function updateOrderArray() {
        const items = list.querySelectorAll(".order-item span.title");
        selectedAnswer = Array.from(items).map((el) => el.textContent.trim());
    }

    currentOrder.forEach((itemText) => {
        const row = document.createElement("div");
        row.className = "order-item";

        const title = document.createElement("span");
        title.className = "title";
        title.textContent = itemText;

        const upBtn = document.createElement("button");
        upBtn.type = "button";
        upBtn.textContent = "▲";
        upBtn.disabled = currentSolved;
        upBtn.onclick = () => {
            if (row.previousElementSibling) {
                list.insertBefore(row, row.previousElementSibling);
                updateOrderArray();
            }
        };

        const downBtn = document.createElement("button");
        downBtn.type = "button";
        downBtn.textContent = "▼";
        downBtn.disabled = currentSolved;
        downBtn.onclick = () => {
            if (row.nextElementSibling) {
                list.insertBefore(row.nextElementSibling, row);
                updateOrderArray();
            }
        };

        row.append(title, upBtn, downBtn);
        list.appendChild(row);
    });

    container.appendChild(list);
    updateOrderArray();
}

function renderChoices(puzzle, container) {
    const list = document.createElement("div");
    list.className = "choice-list";

    (puzzle.choices || []).forEach((choice, index) => {
        const button = document.createElement("button");
        button.type = "button";
        button.className = "choice-option";
        button.disabled = currentSolved;

        const letter = document.createElement("span");
        letter.className = "option-index";
        letter.textContent = String.fromCharCode(65 + index);

        const label = document.createElement("span");
        label.textContent = choice;

        button.append(letter, label);
        button.addEventListener("click", () => {
            if (currentSolved) return;

            selectedAnswer = choice;
            list.querySelectorAll(".choice-option").forEach((option) => {
                option.classList.remove("selected");
            });
            button.classList.add("selected");
        });

        list.appendChild(button);
    });

    container.appendChild(list);
}

function renderTextInput(container) {
    const input = document.createElement("input");
    input.type = "text";
    input.className = "answer-input";
    input.id = "answerInput";
    input.placeholder = "TYPE YOUR ANSWER...";
    input.autocomplete = "off";
    input.spellcheck = false;
    input.disabled = currentSolved;

    input.addEventListener("input", () => {
        selectedAnswer = input.value;
    });

    input.addEventListener("keydown", (event) => {
        if (event.key === "Enter" && !currentSolved) submitAnswer();
    });

    container.appendChild(input);
}

/* ------------------------- Submit & Progression ------------------------- */

function configureSubmitButton() {
    const button = $("submitBtn");
    if (!button) return;

    if (currentSolved) {
        button.textContent = state.current === PUZZLES.length - 1
            ? "OPEN FINAL ARCHIVE ↗"
            : "NEXT CASE FILE ↗";
        button.onclick = advance;
    } else {
        button.textContent = "SUBMIT EVIDENCE ↗";
        button.onclick = submitAnswer;
    }
}

function submitAnswer() {
    const puzzle = getCurrentPuzzle();
    if (!puzzle || currentSolved) return;

    let isCorrect = false;

    if (puzzle.mode === "ordering") {
        if (!Array.isArray(selectedAnswer)) {
            const items = $("puzzleArea").querySelectorAll(".order-item span.title");
            selectedAnswer = Array.from(items).map((el) => el.textContent.trim());
        }
        const targetOrder = puzzle.answer;
        isCorrect = Array.isArray(selectedAnswer) &&
            selectedAnswer.length === targetOrder.length &&
            selectedAnswer.every((val, idx) => normalize(val) === normalize(targetOrder[idx]));
    } else {
        if (!String(selectedAnswer).trim()) {
            const feedback = $("feedback");
            if (feedback) feedback.textContent = "Select or enter an answer first.";
            return;
        }
        isCorrect = normalize(selectedAnswer) === normalize(puzzle.answer);
    }

    const feedback = $("feedback");

    if (!isCorrect) {
        if (feedback) {
            feedback.textContent = "That doesn't fit the evidence. Try again, detective.";
            feedback.className = "feedback";
        }
        return;
    }

    if (!isCompleted(puzzle.id)) {
        state.completed.push(puzzle.id);
    }

    currentSolved = true;
    saveState();

    if (feedback) {
        feedback.textContent = "Evidence accepted. File unsealed.";
        feedback.className = "feedback success";
    }

    if ($("fragmentStatus")) {
        $("fragmentStatus").textContent = `EVIDENCE FRAGMENT: ${puzzle.fragment || "RECOVERED"}`;
    }

    const area = $("puzzleArea");
    if (area) {
        area.querySelectorAll("button, input, select").forEach((el) => {
            el.disabled = true;
        });
    }

    configureSubmitButton();
    renderNav();
}

function advance() {
    if (!currentSolved) return;

    // Jika Case 8 (Case Terakhir) selesai -> Langsung Buka Surat Utama!
    if (state.current === PUZZLES.length - 1) {
        if (typeof showScreen === "function") {
            showScreen("view-letter");
        }
        return;
    }

    if (!isCompleted(getCurrentPuzzle().id)) return;

    state.current = Math.min(state.current + 1, PUZZLES.length - 1);
    saveState();
    renderCase();
}

/* ------------------------- Hints System ------------------------- */

function showHint() {
    const puzzle = getCurrentPuzzle();
    if (!puzzle) return;

    const hints = Array.isArray(puzzle.hint) ? puzzle.hint: [];
    hintIndex = (state.hints && state.hints[puzzle.id]) || 0;

    const hintBox = $("hintBox");
    const hintLeft = $("hintLeft");

    if (hintIndex >= hints.length) {
        if (hintBox) {
            hintBox.textContent = "No more hints in this file. Trust the evidence you have.";
            hintBox.classList.remove("hidden");
        }
        return;
    }

    if (hintBox) {
        hintBox.textContent = hints[hintIndex];
        hintBox.classList.remove("hidden");
    }

    hintIndex += 1;
    state.hints[puzzle.id] = hintIndex;
    saveState();

    if (hintLeft) {
        hintLeft.textContent = `(${Math.max(0, hints.length - hintIndex)} LEFT)`;
    }
}

/* ------------------------- Collectibles & Hadiah System ------------------------- */

function renderCollectibleButton(puzzle, container) {
    if (!puzzle || !puzzle.collectible) return;

    const button = document.createElement("button");
    button.type = "button";
    button.className = "text-button secret-check";
    button.style.marginTop = "18px";
    button.style.display = "block";
    button.textContent = isCollected(puzzle.id)
        ? "✦ EVIDENCE OBJECT RECOVERED"
        : "✦ INSPECT EVIDENCE DESK";

    button.addEventListener("click", () => collect(puzzle));
    container.appendChild(button);
}

function collect(puzzle) {
    if (!puzzle || !puzzle.collectible) return;
    const feedback = $("feedback");

    if (isCollected(puzzle.id)) {
        if (feedback) feedback.textContent = "This object has already been collected.";
        return;
    }

    state.collectibles.push(puzzle.id);
    saveState();
    renderNav();

    // 1. In-game feedback
    if (feedback) {
        feedback.textContent = `FOUND EVIDENCE HADIAH: ${puzzle.collectible} ✦`;
        feedback.className = "feedback success";
    }

    // 2. Pop-up Toast Notification
    const toast = $("toast");
    if (toast) {
        toast.textContent = `✦ Unlocked Special Evidence: ${puzzle.collectible}!`;
        toast.classList.add("show");
        setTimeout(() => toast.classList.remove("show"), 3500);
    }

    // 3. Ubah Teks Tombol
    const button = $("puzzleArea")?.querySelector(".secret-check");
    if (button) button.textContent = "✦ EVIDENCE OBJECT RECOVERED";
}

/* ------------------------- Check Secret Ending Button ------------------------- */

function checkBehindStoryButton() {
    const btn = $("storyBehindBtn");
    if (!btn) return;

    btn.classList.remove("hidden");
    const count = getCollectibleCount();

    if (count > 0) {
        btn.textContent = `UNCOVER THE STORY BEHIND THE STORY ✧ (${count}/8 Evidence Found) ↗`;
    } else {
        btn.textContent = `UNCOVER THE STORY BEHIND THE STORY ✧ ↗`;
    }
}