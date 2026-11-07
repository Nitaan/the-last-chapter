window.PUZZLES = [
    {
        id: 1,
        title: "The Missing Page",
        type: "LITERATURE / DEDUCTION",
        story: "A page has been torn from the library catalogue. Three book labels remain, but their order has been disturbed. The Archivist left three notes: The Glass Garden was read before A Map of Quiet Rooms. The Clockmaker's Alibi was read after A Map of Quiet Rooms. Restore the only possible order.",
        prompt: "ARRANGE THE THREE BOOKS FROM FIRST TO LAST:",
        mode: "ordering",
        items: [
            "A Map of Quiet Rooms",
            "The Clockmaker's Alibi",
            "The Glass Garden"
        ],
        answer: [
            "The Glass Garden",
            "A Map of Quiet Rooms",
            "The Clockmaker's Alibi"
        ],
        hint: [
            "There are three positions: first, middle, and last.",
            "The Glass Garden must come before A Map of Quiet Rooms. The Clockmaker's Alibi comes after A Map of Quiet Rooms.",
            "The order is: The Glass Garden → A Map of Quiet Rooms → The Clockmaker's Alibi."
        ],
        fragment: "LOGIC I",
        collectible: "Torn Catalogue Page",
        collectibleDesc: "A small detail hiding in plain sight, restored from the library catalogue."
    },
    {
    id: 2,
    title: "The Unfinished Chorus",
    type: "MUSIC ARCHIVE",
    story: "A damaged music archive contains a recording with incomplete metadata. Three possible titles remain in the catalog. Identify the missing track using the clues.",
    prompt: "Which Avenged Sevenfold track is the final song on their 2016 album, The Stage?",
    mode: "choice",
    choices: ["God Damn", "Simulation", "Exist"],
    answer: "Exist",
    hint: [
        "Look at the tracklist of Avenged Sevenfold's 2016 album, The Stage.",
        "It is the album's closing track."
    ],
    fragment: "SOUND II",
    collectible: "A Broken Guitar Pick",
    collectibleDesc: "A worn guitar pick tucked inside the cassette case."
},
    {
        id: 3,
        title: "The Hidden Message",
        type: "CRYPTography",
        story: "A coded note was found behind the archive clock. The note uses a Caesar shift: every letter has been moved one place forward in the alphabet. Reverse the shift to reveal the answer.",
        prompt: "Decode this word: T F D S F U  (move each letter one place BACK).",
        mode: "text",
        answer: "SECRET",
        hint: [
            "T becomes S. F becomes E. Move every letter one place backward.",
            "The decoded word describes something kept from view."
        ],
        fragment: "CODE III",
        collectible: "An Old Cassette",
        collectibleDesc: "A cassette labelled only with the number 03."
    },
    {
        id: 4,
        title: "The Witness Files",
        type: "DEDUCTION",
        story: "Three witnesses described when the archive door was opened. Only one statement is consistent with the log: the door opened after the rain started, but before the clock struck nine.",
        prompt: "Which witness could be telling the truth?",
        mode: "choice",
        choices: [
            "Mira: I entered at 8:40, before the rain began at 8:50.",
            "Rowan: I heard the door at 8:55; the clock struck nine at 9:00.",
            "Eli: I entered at 9:05, just before the clock struck nine."
        ],
        answer: "Rowan: I heard the door at 8:55; the clock struck nine at 9:00.",
        hint: [
            "The opening must be between 8:50 and 9:00.",
            "Only one statement gives a time inside that window."
        ],
        fragment: "WITNESS IV",
        collectible: "A Sealed Photograph",
        collectibleDesc: "A photograph sealed in an envelope, with no date."
    },
    {
    id: 5,
    title: "The Ciphered Record",
    type: "CODE BREAKING",
    story: "A record was found inside a locked drawer. Its catalogue number has been replaced with a sequence of numbers. The Archivist left an example: BOOK is encoded as 2-15-15-11. Each number represents a letter's position in the alphabet.",
    prompt: "If BOOK is encoded as 2-15-15-11, how would you encode PAGE?",
    mode: "choice",
    choices: [
        "16-1-7-5",
        "15-1-7-5",
        "16-2-7-5",
        "16-1-8-5"
    ],
    answer: "16-1-7-5",
    hint: [
        "Each letter corresponds to its position in the alphabet.",
        "A = 1, B = 2, C = 3, and so on.",
        "P = 16, A = 1, G = 7, E = 5."
    ],
    fragment: "CATALOGUE V",
    collectible: "A Ciphered Index Card",
    collectibleDesc: "An index card covered in numerical markings, recovered from the locked drawer."
},
    {
        id: 6,
        title: "The Broken Photograph",
        type: "PATTERN",
        story: "A photograph was cut into four strips. The back of each strip carries a symbol. Restore the sequence by following the pattern: moon, star, moon, star...",
        prompt: "Which symbol appears in the 11th position?",
        mode: "choice",
        choices: ["Moon", "Star", "Sun", "Key"],
        answer: "Moon",
        hint: [
            "The pattern alternates between two symbols.",
            "After star, the sequence returns to moon."
        ],
        fragment: "PATTERN VI",
        collectible: "A Torn Diary Page",
        collectibleDesc: "A diary page with its final sentence torn away."
    },
    {
        id: 7,
        title: "The Last Sequence",
        type: "NUMBER LOCK",
        story: "A small lock protects the final archive. Its code follows a simple sequence. Each number is the previous number plus an increasing amount.",
        prompt: "Complete the sequence: 2, 3, 5, 8, 12, ?",
        mode: "choice",
        choices: ["15", "16", "17", "18"],
        answer: "17",
        hint: [
            "The gaps are +1, +2, +3, +4.",
            "The next gap is +5."
        ],
        fragment: "SEQUENCE VII",
        collectible: "A Silver Key",
        collectibleDesc: "A tiny silver key hidden beneath the lock."
    },
    {
        id: 8,
        title: "The Final Archive",
        type: "FINAL DEDUCTION",
        story: "The investigation has led to one final instruction. The archive will open only when its key word is entered.",
        prompt: "Enter the word that names the place where all eight case files have been kept.",
        mode: "text",
        answer: "ARCHIVE",
        hint: [
            "It is the name of the collection you have been investigating.",
            "The word appears throughout the case interface."
        ],
        fragment: "FINAL RECORD",
        collectible: "A Handwritten Note",
        collectibleDesc: "A folded note, written in familiar handwriting."
    }
];