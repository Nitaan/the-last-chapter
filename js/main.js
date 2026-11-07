// Helper fungsi pembantu untuk memilih elemen berdasarkan ID
const $ = (id) => document.getElementById(id);

/**
 * Helper Fungsi Transisi Audio Smooth (Fade In & Fade Out)
 */
function fadeAudioOut(audioElement, duration = 1500) {
    return new Promise((resolve) => {
        if (!audioElement || audioElement.paused) {
            resolve();
            return;
        }
        
        const initialVolume = audioElement.volume;
        const step = initialVolume / (duration / 50);

        const fadeInterval = setInterval(() => {
            if (audioElement.volume > step) {
                audioElement.volume -= step;
            } else {
                audioElement.volume = 0;
                audioElement.pause();
                audioElement.volume = initialVolume;
                clearInterval(fadeInterval);
                resolve();
            }
        }, 50);
    });
}

function fadeAudioIn(audioElement, maxVolume = 0.7, duration = 2000) {
    return new Promise((resolve) => {
        if (!audioElement) {
            resolve();
            return;
        }

        audioElement.volume = 0;
        audioElement.play().then(() => {
            const step = maxVolume / (duration / 50);
            const fadeInterval = setInterval(() => {
                if (audioElement.volume + step < maxVolume) {
                    audioElement.volume += step;
                } else {
                    audioElement.volume = maxVolume;
                    clearInterval(fadeInterval);
                    resolve();
                }
            }, 50);
        }).catch((err) => {
            console.warn("Autoplay audio terhalang browser:", err);
            resolve();
        });
    });
}

/**
 * Universal View Switcher dengan Transisi Audio
 */
function showScreen(targetId) {
    const screens = document.querySelectorAll(".view");
    screens.forEach((screen) => screen.classList.remove("active"));

    let target = $(targetId) || $(`view-${targetId}`);
    if (!target && (targetId === "game" || targetId === "board")) {
        target = $("view-board");
    } else if (!target && targetId === "letter") {
        target = $("view-letter");
    } else if (!target && targetId === "secret") {
        target = $("view-secret");
    } else if (!target && targetId === "behind-story") {
        target = $("view-behind-story");
    }

    if (target) {
        target.classList.add("active");
        window.scrollTo({ top: 0, behavior: "smooth" });

        // Audio Handler Transisi saat masuk Surat
        const bgMusic = $("backgroundMusic");
        const letterMusic = $("letterMusic");

        const normalizedId = String(targetId);
        if (normalizedId.includes("letter") || normalizedId.includes("secret") || normalizedId.includes("behind-story")) {
            if (bgMusic && !bgMusic.paused) {
                fadeAudioOut(bgMusic, 1200).then(() => {
                    if (letterMusic && letterMusic.paused) {
                        fadeAudioIn(letterMusic, 0.6, 2000);
                    }
                });
            } else if (letterMusic && letterMusic.paused) {
                fadeAudioIn(letterMusic, 0.6, 2000);
            }
        }
    }
}

document.addEventListener("DOMContentLoaded", () => {
    // 1. Navigation Event: OPEN THE CASE
    const beginBtn = $("beginBtn");
    if (beginBtn) {
        beginBtn.addEventListener("click", (e) => {
            e.preventDefault();
            showScreen("view-board");
            if (typeof renderNav === "function") renderNav();
            if (typeof renderCase === "function") renderCase();
        });
    }

    // 2. Audio Setup & Volume Control
    const audio = $("backgroundMusic");
    const soundButton = $("soundBtn");
    const volume = $("volumeControl");

    if (volume && audio) {
        audio.volume = Number(volume.value);
        volume.addEventListener("input", () => { 
            audio.volume = Number(volume.value); 
        });
    }

    if (soundButton && audio) {
        soundButton.onclick = async () => {
            try {
                if (audio.paused) { 
                    await audio.play(); 
                    soundButton.textContent = "SOUND: ON"; 
                    soundButton.setAttribute("aria-pressed", "true"); 
                } else { 
                    audio.pause(); 
                    soundButton.textContent = "SOUND: OFF"; 
                    soundButton.setAttribute("aria-pressed", "false"); 
                }
            } catch (error) {
                soundButton.textContent = "AUDIO UNAVAILABLE";
                console.warn("Audio could not be played:", error);
            }
        };

        audio.addEventListener("pause", () => { 
            soundButton.textContent = "SOUND: OFF"; 
            soundButton.setAttribute("aria-pressed", "false"); 
        });

        audio.addEventListener("error", () => { 
            soundButton.textContent = "AUDIO UNAVAILABLE"; 
        });
    }

    // 3. Tombol In-Game Navigation
    if ($("hintBtn") && typeof showHint === "function") {
        $("hintBtn").onclick = showHint;
    }

    if ($("evidenceBtn") && typeof showInventory === "function") {
        $("evidenceBtn").onclick = showInventory;
    }

    if ($("closeModal") && $("modal")) {
        $("closeModal").onclick = () => $("modal").classList.add("hidden");
    }

    if ($("modal")) {
        $("modal").onclick = (event) => {
            if (event.target === $("modal")) $("modal").classList.add("hidden");
        };
    }

    // 4. Navigasi Surat Utama, Surat Kedua, & Story Behind the Story
    const secretCheckBtn = $("secretCheckBtn");
    if (secretCheckBtn) {
        secretCheckBtn.onclick = () => {
            showScreen("view-secret");
            if (typeof checkBehindStoryButton === "function") {
                checkBehindStoryButton();
            }
        };
    }

    const backLetterBtn = $("backLetterBtn");
    if (backLetterBtn) {
        backLetterBtn.onclick = () => showScreen("view-letter");
    }

    const storyBehindBtn = $("storyBehindBtn");
    if (storyBehindBtn) {
        storyBehindBtn.onclick = () => showScreen("view-behind-story");
    }

    const backToSecondLetterBtn = $("backToSecondLetterBtn");
    if (backToSecondLetterBtn) {
        backToSecondLetterBtn.onclick = () => showScreen("view-secret");
    }

    const unlockLetterBtn = $("unlockLetterBtn");
    if (unlockLetterBtn) {
        unlockLetterBtn.onclick = () => showScreen("view-letter");
    }

    const backToBoardBtn = $("backToBoardBtn");
    if (backToBoardBtn) {
        backToBoardBtn.onclick = () => showScreen("view-board");
    }

    // 5. Initializations
    if (typeof renderRecommendations === "function") renderRecommendations();
    if (typeof restoreDeskInvestigation === "function") restoreDeskInvestigation();

    if (typeof state !== "undefined" && typeof PUZZLES !== "undefined" && state.completed) {
        if (state.completed.length === PUZZLES.length && beginBtn) {
            beginBtn.textContent = "CONTINUE THE ARCHIVE ↗";
        }
    }
});

