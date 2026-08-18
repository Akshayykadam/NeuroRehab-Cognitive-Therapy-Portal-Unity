/**
 * NeuroRehab Localization (i18n) Engine
 * Supports CSV-based multi-language translations (e.g., Google Sheet format: Key,English,Arabic...)
 * Provides t(key, fallback, params) and automatic DOM updates for data-i18n elements.
 */
(function (window) {
    'use strict';

    // Built-in fallback English dictionary (works 100% offline out of the box)
    const DEFAULT_DICTIONARY = {
        // 1. Overlays & Screen Blockers
        "T1": "Rotate Your Screen",
        "T2": "This therapy application is designed for landscape screens. Please rotate your device to begin.",
        "T3": "Tablet or Desktop Required",
        "T4": "This cognitive rehabilitation portal is designed for clinical use on tablet (iPad/Android Tablet) or desktop screens only. Mobile phone screens are too small to support these exercises.",

        // 2. Header & Patient Info & HUD
        "T11": "WIZIO NEUROREHAB",
        "T12": "Patient",
        "T13": "ID: --",
        "T14": "Exercises",
        "T15": "Progress Dashboard",
        "T16": "Practiced",
        "T17": "Progress",
        "T18": "Accuracy",
        "T19": "Exercises Practiced",
        "T20": "Overall Progress",
        "T21": "Average Accuracy",
        "T22": "Reset History",
        "T23": "Toggle Sound",
        "T24": "Exit",
        "T25": "Exit to Unity Menu",
        "T26": "Return to Lobby",
        "T27": "Patient: {name}",
        "T28": "ID: {id}",

        // 3. Lobby Welcome & Cards
        "T36": "Your Supportive Mind Gym",
        "T37": "Every single exercise you play helps nourish, build, and strengthen neural connections. Take your time, focus gently, and remember: consistency is your superpower!",
        "T38": "Max Level: L{level}",
        "T39": "Practiced",
        "T40": "Not Practiced",

        // 4. Instructions Modal & Stepper
        "T51": "Objective",
        "T52": "Therapy Difficulty Level",
        "T53": "START EXERCISE",
        "T54": "Close modal",
        "T55": "Decrease level",
        "T56": "Increase level",
        "T57": "Reset exercise history and scores?",

        // 5. Game Screen Top HUD
        "T66": "Level {level}",
        "T67": "ACCURACY",
        "T68": "TIME",
        "T69": "CHANCES",
        "T70": "Exercise Title",
        "T71": "Exercise",

        // 6. Result & Feedback Modal
        "T76": "EXERCISE COMPLETE",
        "T77": "Great job! You completed this exercise level.",
        "T78": "FABULOUS WORK!",
        "T79": "Congratulations on completing Level {level}! Every exercise you do nourishes and strengthens your mind. You are doing amazing!",
        "T80": "GREAT TRY & PRACTICE!",
        "T81": "Every minute spent practicing is a wonderful step forward for your brain. Be proud of your dedication today!",
        "T82": "SESSION ACCURACY",
        "T83": "PROGRESS",
        "T84": "Level Cleared!",
        "T85": "Practice Completed",
        "T86": "LOBBY",
        "T87": "PRACTICE AGAIN",
        "T88": "NEXT LEVEL",
        "T89": "NEXT LEVEL ({level})",

        // 7. 16 Game Definitions (Titles, Skills, Descriptions)
        // Game 1: Trace the Shape
        "T96": "Trace the Shape",
        "T97": "Motor Control",
        "T98": "Slowly trace pathways and shapes with your pointer. Focuses on motor planning, hand-eye tracking, and precise spatial movement control.",

        // Game 2: Colour Fill
        "T99": "Colour Fill exercise",
        "T100": "Spatial Logic",
        "T101": "Color connected circles so that no two connected items share the same color. Encourages logical planning, visual inspection, and puzzle sorting.",

        // Game 3: Selective Focus
        "T102": "Selective Focus",
        "T103": "Visual Attention",
        "T104": "Identify and tap moving shapes that match the active target description (e.g., 'Green Star'). Exercises visual search and selective attention.",

        // Game 4: Memory Cards
        "T105": "Memory Cards",
        "T106": "Working Memory",
        "T107": "Flip cards to find matching shapes. Levels scale to support associative memory by matching math equations to their solutions.",

        // Game 5: Recall Practice
        "T108": "Recall Practice",
        "T109": "Delayed Recall",
        "T110": "Study a group of symbols, then spot which new object is added after they shuffle. Supports short-term visual retention and recall speed.",

        // Game 6: Spot the Difference
        "T111": "Spot the Difference",
        "T112": "Visual Logic",
        "T113": "Find the single shape that has a rotational, color-shade, or edge count discrepancy. Exercises fine visual detail comparison.",

        // Game 7: Cognitive Flex
        "T114": "Cognitive Flex",
        "T115": "Cognitive Shifting",
        "T116": "Match objects by shifting your focus between Shape, Color, or Number. Supports mental agility and cognitive switching capacity.",

        // Game 8: Sorting Practice
        "T117": "Sorting Practice",
        "T118": "Categorisation",
        "T119": "Sort incoming cards into left and right bins according to categories (Even/Odd, Living/Non-living). Trains categorization and quick sorting.",

        // Game 9: Catching Exercise
        "T120": "Catching Exercise",
        "T121": "Coordination",
        "T122": "Move a slider at the bottom to catch positive green gems while avoiding red obstacles. Promotes hand-eye reaction and spatial forecasting.",

        // Game 10: Word Association
        "T123": "Word Association",
        "T124": "Semantic Memory",
        "T125": "Tap the floating words that belong to the active core topic. Strengthens vocabulary connection speed and semantic recall.",

        // Game 11: Color Confusion
        "T126": "Color Confusion",
        "T127": "Inhibition",
        "T128": "Tap the correct button based on font color or word meaning. Exercises mental focus, cognitive inhibition, and Stroop processing.",

        // Game 12: Quick Switch
        "T129": "Quick Switch",
        "T130": "Cognitive Shifting",
        "T131": "Connect numbers and letters in alternating sequence (1-A-2-B-3-C...). Promotes cognitive flexibility, sequencing speed, and executive control.",

        // Game 13: Eagle Eye
        "T132": "Eagle Eye",
        "T133": "Visual Attention",
        "T134": "Quickly locate and select numbers in ascending order (1, 2, 3...). Enhances rapid visual scanning, attention span, and field of view.",

        // Game 14: Turnabout
        "T135": "Turnabout",
        "T136": "Mental Rotation",
        "T137": "Identify the correctly rotated version of a shape grid. Strengthens mental rotation capabilities, spatial awareness, and visual reasoning.",

        // Game 15: Turning Tables
        "T138": "Turning Tables",
        "T139": "Spatial Memory",
        "T140": "Memorize target slots on a round table, track them as the table spins, and identify their new positions. Exercises dynamic spatial tracking and recall.",

        // Game 16: Quick Count
        "T141": "Quick Count",
        "T142": "Visual Attention",
        "T143": "Instantly subitize or count blocks of a specific color in a randomized grid against a swift countdown. Strengthens scanning speed and visual quantity estimation.",

        // 8. Progress Dashboard & Domain Hierarchy
        "T146": "Average Accuracy",
        "T147": "Target precision metric",
        "T148": "Daily Training Streak",
        "T149": "Day",
        "T150": "Days",
        "T151": "Consistency builds connections",
        "T152": "Exercises Completed",
        "T153": "Total active rehab units",
        "T154": "Rehab Progress",
        "T155": "Overall progression index",
        "T156": "Cognitive Performance Index (Total Sessions: {sessions})",
        "T157": "Accuracy Progression (Total Sessions: {sessions})",
        "T158": "Cognitive Performance Index (CPI)",
        "T159": "What is it:",
        "T160": "A clinical metric (0 - 1000) measuring overall performance across memory, attention, and logic domains.",
        "T161": "How calculated:",
        "T162": "Combines execution accuracy, level difficulty multipliers, and speed bonuses from cleared rounds.",
        "T163": "Accuracy Progression",
        "T164": "Tracks performance precision, correct selections, and mistake margins across your last 7 active sessions.",
        "T165": "The average accuracy percentage (50% - 100%) recorded across all cleared training units.",
        "T166": "Practice exercises to start tracking {title}",
        "T167": "Memory & Recall",
        "T168": "Working memory, association, and retrieval speed",
        "T169": "Focus & Attention",
        "T170": "Visual search, selection speed, and task switching",
        "T171": "Motor & Logic",
        "T172": "Spatial tracking, coordination, and deductive logic",
        "T173": "Lvl {level} / 50",
        "T174": "Explorer",
        "T175": "Proficient",
        "T176": "Expert Trainer",
        "T177": "Best Accuracy",
        "T178": "Practice",
        "T179": "Exercise module [{id}] loaded incorrectly. Please contact administrator.",

        // 9. Game 1: Trace Shape In-Game Content
        "T201": "Trace L shape starting from top-left",
        "T202": "Trace U shape starting from top-left",
        "T203": "Trace A shape starting bottom-left",
        "T204": "Trace S curve starting from top-right",
        "T205": "Trace Infinity Loop starting from center node",
        "T206": "Trace Triangle starting from top apex",
        "T207": "Trace Square starting top-left",
        "T208": "Trace Pentagon starting top apex",
        "T209": "Trace Hexagon starting top-left",
        "T210": "Trace Diamond starting top apex",
        "T211": "Trace Cross starting top center",
        "T212": "Trace Heart starting from top center notch",
        "T213": "Trace Crescent Moon starting from top tip",
        "T214": "Trace Wave Pattern from left to right",
        "T215": "Trace Spiral from outer start node inward",
        "T216": "Please start at the green circular target.",
        "T217": "Stay closer to the guided pathway! Try tracing smoothly.",

        // 10. Game 2: Colour Fill In-Game Content
        "T221": "Progress:",
        "T222": "Goal: 96%",
        "T223": "Select Paint Color:",
        "T224": "Blue",
        "T225": "Teal",
        "T226": "Green",
        "T227": "Yellow",
        "T228": "Orange",
        "T229": "Red",
        "T230": "Purple",
        "T231": "Pink",
        "T232": "Eraser",

        // 11. Game 3: Selective Focus In-Game Content
        "T236": "TAP ONLY:",
        "T237": "BLUE",
        "T238": "TEAL",
        "T239": "GREEN",
        "T240": "ORANGE",
        "T241": "CIRCLES",
        "T242": "SQUARES",
        "T243": "TRIANGLES",
        "T244": "STARS",

        // 12. Game 5: Object Recall In-Game Content
        "T251": "MEMORIZE THESE SYMBOLS",
        "T252": "WHICH OBJECT WAS ADDED?",
        "T253": "Round {round}/{max}",

        // 13. Game 6: Spot the Difference In-Game Content
        "T261": "Round {round}/{max} - Select the Odd Item",

        // 14. Game 7: Task Switching In-Game Content
        "T271": "Match Criterion",
        "T272": "MATCH COLOR",
        "T273": "MATCH SHAPE",
        "T274": "MATCH NUMBER",
        "T275": "COLOR",
        "T276": "SHAPE",
        "T277": "NUMBER",

        // 15. Game 8: Sorting Game In-Game Content
        "T281": "Even / Odd Numbers",
        "T282": "Vowels / Consonants",
        "T283": "Living / Non-Living",
        "T284": "Prime / Composite",
        "T285": "Thermal: Hot / Cold Items",
        "T286": "EVEN",
        "T287": "ODD",
        "T288": "VOWEL",
        "T289": "CONSONANT",
        "T290": "LIVING",
        "T291": "NON-LIVING",
        "T292": "PRIME",
        "T293": "COMPOSITE",
        "T294": "HOT",
        "T295": "COLD",
        "T296": "[Press Left Arrow]",
        "T297": "[Press Right Arrow]",

        // 16. Game 9: Falling Catcher In-Game Content
        "T311": "WIND: CALM",
        "T312": "WIND: BREEZY",
        "T313": "WIND: GUSTY",

        // 17. Game 10: Word Association In-Game Content
        "T316": "Core Theme Topic",
        "T317": "DOG",
        "T318": "TREE",
        "T319": "FIRE",
        "T320": "SPACE",
        "T321": "DESERT",
        "T322": "MUSIC",
        "T323": "ANCIENT",
        "T324": "STORM",
        "T325": "KITCHEN",
        "T326": "JUSTICE",
        "T327": "GENIUS",
        "T328": "THEATRE",
        "T329": "TIME",
        "T330": "ENERGY",
        "T331": "MIND",

        // 18. Game 11: Color Confusion In-Game Content
        "T332": "IDENTIFY THE WORD MEANING",
        "T333": "TAP THE WORD MEANING",
        "T334": "TAP THE FONT COLOR",
        "T335": "RED",
        "T336": "BLUE",
        "T337": "GREEN",
        "T338": "YELLOW",

        // 19. Game 12: Quick Switch In-Game Content
        "T341": "Tap elements in sequence: 1 → A → 2 → B...",
        "T342": "Connect:",

        // 20. Game 13: Eagle Eye In-Game Content
        "T346": "Find and tap in ascending order:",

        // 21. Game 14: Turnabout In-Game Content
        "T351": "90° Clockwise",
        "T352": "90° Counter-Clockwise",
        "T353": "180° Rotation",
        "T354": "Select the matching rotation",

        // 22. Game 15: Turning Tables In-Game Content
        "T356": "Memorize active dots",
        "T357": "Table spins: {rotation}",
        "T358": "Find the {count} Rotated Dots!",
        "T359": "90° CW",
        "T360": "90° CCW",
        "T361": "180°",

        // 23. Game 16: Quick Count In-Game Content
        "T366": "PINK BLOCKS",
        "T367": "BLUE BLOCKS",
        "T368": "YELLOW BLOCKS",
        "T369": "Count the {color} blocks"
    };

    /**
     * CSV Parser - RFC 4180 compliant
     * Parses CSV text into an array of rows, correctly handling quoted values, commas, and newlines.
     */
    function parseCSV(text) {
        if (!text || typeof text !== 'string') return [];
        const rows = [];
        let currentRow = [];
        let currentField = '';
        let insideQuotes = false;

        // Normalize newlines
        const cleanText = text.replace(/\r\n/g, '\n').replace(/\r/g, '\n');

        for (let i = 0; i < cleanText.length; i++) {
            const char = cleanText[i];
            const nextChar = cleanText[i + 1];

            if (insideQuotes) {
                if (char === '"') {
                    if (nextChar === '"') {
                        currentField += '"';
                        i++; // skip escaped quote
                    } else {
                        insideQuotes = false;
                    }
                } else {
                    currentField += char;
                }
            } else {
                if (char === '"') {
                    insideQuotes = true;
                } else if (char === ',') {
                    currentRow.push(currentField.trim());
                    currentField = '';
                } else if (char === '\n') {
                    currentRow.push(currentField.trim());
                    if (currentRow.some(field => field.length > 0)) {
                        rows.push(currentRow);
                    }
                    currentRow = [];
                    currentField = '';
                } else {
                    currentField += char;
                }
            }
        }

        if (currentField.length > 0 || currentRow.length > 0) {
            currentRow.push(currentField.trim());
            if (currentRow.some(field => field.length > 0)) {
                rows.push(currentRow);
            }
        }

        return rows;
    }

    class I18nManager {
        constructor() {
            this.currentLanguage = 'English';
            this.availableLanguages = ['English'];
            // translations structure: { [lang]: { [key]: translationString } }
            this.translations = {
                'English': Object.assign({}, DEFAULT_DICTIONARY)
            };
            this.listeners = [];
            this.initialized = false;
        }

        init() {
            if (this.initialized) return;
            this.initialized = true;

            // Check URL query parameter ?lang=...
            const urlParams = new URLSearchParams(window.location.search);
            const queryLang = urlParams.get('lang') || urlParams.get('language');
            if (queryLang) {
                this.currentLanguage = queryLang;
            }

            // Attempt to load bundled CSV asynchronously
            this.loadCSVFromUrl('Cognitive games localization CSV.csv')
                .catch(() => {
                    // Try fallback path if running inside nested directories
                    return this.loadCSVFromUrl('./Cognitive games localization CSV.csv');
                })
                .catch(() => {})
                .finally(() => {
                    this.applyLanguageSettings();
                    this.applyTranslations();
                });
        }

        /**
         * Load CSV string into memory
         */
        loadCSV(csvString) {
            if (!csvString || typeof csvString !== 'string') return;
            const rows = parseCSV(csvString);
            if (rows.length < 2) return;

            const header = rows[0]; // e.g. ["Key", "English", "Arabic", ...]
            const keyColIndex = header.findIndex(h => h.toLowerCase() === 'key');
            if (keyColIndex === -1) return;

            // Register all language columns
            for (let c = 0; c < header.length; c++) {
                if (c !== keyColIndex && header[c]) {
                    const langName = header[c].trim();
                    if (!this.translations[langName]) {
                        this.translations[langName] = {};
                    }
                    if (!this.availableLanguages.includes(langName)) {
                        this.availableLanguages.push(langName);
                    }
                }
            }

            // Fill translations for each key
            for (let r = 1; r < rows.length; r++) {
                const row = rows[r];
                const key = row[keyColIndex];
                if (!key) continue;

                for (let c = 0; c < header.length; c++) {
                    if (c !== keyColIndex && header[c]) {
                        const langName = header[c].trim();
                        const val = row[c];
                        if (val && val.length > 0) {
                            this.translations[langName][key] = val;
                        }
                    }
                }
            }

            console.log(`[i18n] Loaded CSV with ${rows.length - 1} keys across languages:`, this.availableLanguages);
            this.applyLanguageSettings();
            this.applyTranslations();
            this.notifyListeners();
        }

        /**
         * Load CSV from a URL / local file path
         */
        loadCSVFromUrl(url) {
            return fetch(url)
                .then(response => {
                    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
                    return response.text();
                })
                .then(csvText => {
                    this.loadCSV(csvText);
                });
        }

        /**
         * Set current active language (e.g. 'English', 'Arabic')
         */
        setLanguage(lang) {
            if (!lang) return;
            this.currentLanguage = lang;
            this.applyLanguageSettings();
            this.applyTranslations();
            this.notifyListeners();
        }

        getLanguage() {
            return this.currentLanguage;
        }

        getAvailableLanguages() {
            return this.availableLanguages;
        }

        /**
         * Configure RTL/LTR and language attributes on HTML document
         */
        applyLanguageSettings() {
            const isRTL = this.currentLanguage.toLowerCase() === 'arabic' || 
                          this.currentLanguage.toLowerCase() === 'hebrew' || 
                          this.currentLanguage.toLowerCase() === 'urdu';
            
            document.documentElement.dir = isRTL ? 'rtl' : 'ltr';
            document.documentElement.lang = isRTL ? 'ar' : 'en';

            if (isRTL) {
                document.body.classList.add('rtl-mode');
            } else {
                document.body.classList.remove('rtl-mode');
            }
        }

        /**
         * Translate a key with optional fallback and parameter interpolation
         * Example: t('T79', 'Congratulations {name}', { name: 'Sarah' })
         */
        get(key, fallback = '', params = null) {
            if (!key) return fallback || '';

            let text = null;
            // 1. Try active language
            if (this.translations[this.currentLanguage] && this.translations[this.currentLanguage][key]) {
                text = this.translations[this.currentLanguage][key];
            }
            // 2. Fallback to English
            if (!text && this.translations['English'] && this.translations['English'][key]) {
                text = this.translations['English'][key];
            }
            // 3. Fallback to default embedded dictionary
            if (!text && DEFAULT_DICTIONARY[key]) {
                text = DEFAULT_DICTIONARY[key];
            }
            // 4. Fallback to passed fallback string or key itself
            if (!text) {
                text = fallback || key;
            }

            // Interpolate parameters {param}
            if (params && typeof params === 'object') {
                Object.keys(params).forEach(p => {
                    const regex = new RegExp(`\\{${p}\\}`, 'g');
                    text = text.replace(regex, params[p]);
                });
            }

            return text;
        }

        /**
         * Translate all DOM elements with data-i18n attribute
         */
        applyTranslations(rootElement = document) {
            const elements = rootElement.querySelectorAll('[data-i18n]');
            elements.forEach(el => {
                const key = el.getAttribute('data-i18n');
                if (key) {
                    const translation = this.get(key);
                    if (el.tagName === 'INPUT' && (el.type === 'button' || el.type === 'submit')) {
                        el.value = translation;
                    } else {
                        el.innerText = translation;
                    }
                }
            });

            // Handle title tooltips
            const titleEls = rootElement.querySelectorAll('[data-i18n-title]');
            titleEls.forEach(el => {
                const key = el.getAttribute('data-i18n-title');
                if (key) {
                    el.title = this.get(key);
                }
            });

            // Handle aria-labels
            const ariaEls = rootElement.querySelectorAll('[data-i18n-aria]');
            ariaEls.forEach(el => {
                const key = el.getAttribute('data-i18n-aria');
                if (key) {
                    el.setAttribute('aria-label', this.get(key));
                }
            });

            // Handle placeholder
            const placeholderEls = rootElement.querySelectorAll('[data-i18n-placeholder]');
            placeholderEls.forEach(el => {
                const key = el.getAttribute('data-i18n-placeholder');
                if (key) {
                    el.placeholder = this.get(key);
                }
            });
        }

        /**
         * Subscribe to language change events
         */
        onLanguageChanged(callback) {
            if (typeof callback === 'function') {
                this.listeners.push(callback);
            }
        }

        notifyListeners() {
            this.listeners.forEach(cb => {
                try { cb(this.currentLanguage); } catch(e) { console.error(e); }
            });
        }
    }

    // Initialize singleton instance
    const i18n = new I18nManager();
    window.i18n = i18n;
    window.t = (key, fallback, params) => i18n.get(key, fallback, params);
    window.getText = (key, fallback, params) => i18n.get(key, fallback, params);

    // Auto initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => i18n.init());
    } else {
        i18n.init();
    }

})(window);
