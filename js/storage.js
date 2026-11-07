const STORE_KEY = "the_last_chapter_extended_v2";

const defaultState = () => ({
    completed: [],
    collectibles: [],
    hints: {},
    current: 0
});

function loadState() {
    try {
        const saved = JSON.parse(localStorage.getItem(STORE_KEY) || "null");
        if (!saved || typeof saved !== "object") return defaultState();

        const validIds = new Set(PUZZLES.map((puzzle) => puzzle.id));
        const completed = Array.isArray(saved.completed)
            ? [...new Set(saved.completed)].filter((id) => validIds.has(id))
            : [];
        const collectibles = Array.isArray(saved.collectibles)
            ? [...new Set(saved.collectibles)].filter((id) => validIds.has(id))
            : [];

        const hints = saved.hints && typeof saved.hints === "object"
            ? saved.hints
            : {};

        const requestedCurrent = Number.isInteger(saved.current)
            ? saved.current
            : 0;

        let current = Math.max(0, Math.min(requestedCurrent, PUZZLES.length - 1));
        while (current > 0 && !completed.includes(PUZZLES[current - 1].id)) {
            current -= 1;
        }

        return { completed, collectibles, hints, current };
    } catch (error) {
        console.warn("Could not load saved progress. Starting a fresh archive.", error);
        return defaultState();
    }
}

function saveState() {
    try {
        localStorage.setItem(STORE_KEY, JSON.stringify(state));
    } catch (error) {
        console.warn("Progress could not be saved in this browser.", error);
    }
}

let state = loadState();