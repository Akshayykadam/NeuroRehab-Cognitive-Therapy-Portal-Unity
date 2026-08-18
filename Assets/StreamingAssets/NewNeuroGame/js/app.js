/**
 * NeuroRehab Core Application Manager
 */

// Define Therapy Exercises Metadata
// Define Therapy Exercises Metadata
// Define Therapy Exercises Metadata with Localization Keys
const GAME_DEFS = [
    {
        id: "trace_letter",
        nameKey: "T96",
        skillKey: "T97",
        descKey: "T98",
        get name() { return window.t ? window.t(this.nameKey, "Trace the Shape") : "Trace the Shape"; },
        get skill() { return window.t ? window.t(this.skillKey, "Motor Control") : "Motor Control"; },
        get desc() { return window.t ? window.t(this.descKey, "Slowly trace pathways and shapes with your pointer. Focuses on motor planning, hand-eye tracking, and precise spatial movement control.") : "Slowly trace pathways and shapes with your pointer. Focuses on motor planning, hand-eye tracking, and precise spatial movement control."; },
        theme: "theme-blue",
        icon: "fa-solid fa-bezier-curve",
        svg: `<svg viewBox="0 0 100 60" class="card-illustration"><path d="M15,30 Q35,10 50,30 T85,30" fill="none" stroke="rgba(255,255,255,0.4)" stroke-width="4" stroke-dasharray="4 4" /><path d="M15,30 Q35,10 50,30" fill="none" stroke="rgba(255,255,255,0.9)" stroke-width="4" stroke-linecap="round" /><circle cx="50" cy="30" r="6" fill="#fff" /><path d="M50,30 L55,42 L45,38 Z" fill="#fff" /></svg>`
    },
    {
        id: "colour_fill",
        nameKey: "T99",
        skillKey: "T100",
        descKey: "T101",
        get name() { return window.t ? window.t(this.nameKey, "Colour Fill exercise") : "Colour Fill exercise"; },
        get skill() { return window.t ? window.t(this.skillKey, "Spatial Logic") : "Spatial Logic"; },
        get desc() { return window.t ? window.t(this.descKey, "Color connected circles so that no two connected items share the same color. Encourages logical planning, visual inspection, and puzzle sorting.") : "Color connected circles so that no two connected items share the same color. Encourages logical planning, visual inspection, and puzzle sorting."; },
        theme: "theme-green",
        icon: "fa-solid fa-fill-drip",
        svg: `<svg viewBox="0 0 100 60" class="card-illustration"><line x1="25" y1="30" x2="50" y2="15" stroke="rgba(255,255,255,0.5)" stroke-width="2" /><line x1="25" y1="30" x2="50" y2="45" stroke="rgba(255,255,255,0.5)" stroke-width="2" /><line x1="50" y1="15" x2="75" y2="30" stroke="rgba(255,255,255,0.5)" stroke-width="2" /><line x1="50" y1="45" x2="75" y2="30" stroke="rgba(255,255,255,0.5)" stroke-width="2" /><line x1="50" y1="15" x2="50" y2="45" stroke="rgba(255,255,255,0.5)" stroke-width="2" /><circle cx="25" cy="30" r="7" fill="#fff" /><circle cx="50" cy="15" r="7" fill="rgba(255,255,255,0.7)" /><circle cx="50" cy="45" r="7" fill="rgba(255,255,255,0.7)" /><circle cx="75" cy="30" r="7" fill="#fff" /></svg>`
    },
    {
        id: "tap_object",
        nameKey: "T102",
        skillKey: "T103",
        descKey: "T104",
        get name() { return window.t ? window.t(this.nameKey, "Selective Focus") : "Selective Focus"; },
        get skill() { return window.t ? window.t(this.skillKey, "Visual Attention") : "Visual Attention"; },
        get desc() { return window.t ? window.t(this.descKey, "Identify and tap moving shapes that match the active target description (e.g., 'Green Star'). Exercises visual search and selective attention.") : "Identify and tap moving shapes that match the active target description (e.g., 'Green Star'). Exercises visual search and selective attention."; },
        theme: "theme-gold",
        icon: "fa-solid fa-bullseye",
        svg: `<svg viewBox="0 0 100 60" class="card-illustration"><circle cx="50" cy="30" r="20" fill="none" stroke="rgba(255,255,255,0.3)" stroke-width="2" /><circle cx="50" cy="30" r="10" fill="none" stroke="rgba(255,255,255,0.3)" stroke-width="1.5" /><line x1="50" y1="5" x2="50" y2="55" stroke="rgba(255,255,255,0.4)" stroke-width="1.5" /><line x1="20" y1="30" x2="80" y2="30" stroke="rgba(255,255,255,0.4)" stroke-width="1.5" /><polygon points="50,22 53,28 59,29 55,33 56,39 50,36 44,39 45,33 41,29 47,28" fill="#fff" /></svg>`
    },
    {
        id: "memory",
        nameKey: "T105",
        skillKey: "T106",
        descKey: "T107",
        get name() { return window.t ? window.t(this.nameKey, "Memory Cards") : "Memory Cards"; },
        get skill() { return window.t ? window.t(this.skillKey, "Working Memory") : "Working Memory"; },
        get desc() { return window.t ? window.t(this.descKey, "Flip cards to find matching shapes. Levels scale to support associative memory by matching math equations to their solutions.") : "Flip cards to find matching shapes. Levels scale to support associative memory by matching math equations to their solutions."; },
        theme: "theme-purple",
        icon: "fa-solid fa-clone",
        svg: `<svg viewBox="0 0 100 60" class="card-illustration"><rect x="18" y="14" width="22" height="32" rx="4" fill="rgba(255,255,255,0.5)" stroke="rgba(255,255,255,0.8)" stroke-width="1.5" transform="rotate(-8, 29, 30)" /><rect x="60" y="14" width="22" height="32" rx="4" fill="rgba(255,255,255,0.5)" stroke="rgba(255,255,255,0.8)" stroke-width="1.5" transform="rotate(8, 71, 30)" /><rect x="38" y="12" width="24" height="36" rx="4" fill="#fff" stroke="rgba(255,255,255,0.9)" stroke-width="1.5" /><circle cx="50" cy="30" r="5" fill="var(--clinical-blue)" /></svg>`
    },
    {
        id: "object_recall",
        nameKey: "T108",
        skillKey: "T109",
        descKey: "T110",
        get name() { return window.t ? window.t(this.nameKey, "Recall Practice") : "Recall Practice"; },
        get skill() { return window.t ? window.t(this.skillKey, "Delayed Recall") : "Delayed Recall"; },
        get desc() { return window.t ? window.t(this.descKey, "Study a group of symbols, then spot which new object is added after they shuffle. Supports short-term visual retention and recall speed.") : "Study a group of symbols, then spot which new object is added after they shuffle. Supports short-term visual retention and recall speed."; },
        theme: "theme-magenta",
        icon: "fa-solid fa-clock-rotate-left",
        svg: `<svg viewBox="0 0 100 60" class="card-illustration"><circle cx="28" cy="22" r="6" fill="rgba(255,255,255,0.6)" /><rect x="60" y="16" width="12" height="12" rx="2" fill="rgba(255,255,255,0.6)" /><polygon points="48,42 53,50 43,50" fill="rgba(255,255,255,0.6)" /><path d="M50,15 A15,15 0 0,1 65,30 A15,15 0 0,1 50,45 A15,15 0 0,1 35,30 A15,15 0 0,1 50,15 Z" fill="none" stroke="#fff" stroke-width="2" /><circle cx="50" cy="30" r="5" fill="#fff" /></svg>`
    },
    {
        id: "odd_one_out",
        nameKey: "T111",
        skillKey: "T112",
        descKey: "T113",
        get name() { return window.t ? window.t(this.nameKey, "Spot the Difference") : "Spot the Difference"; },
        get skill() { return window.t ? window.t(this.skillKey, "Visual Logic") : "Visual Logic"; },
        get desc() { return window.t ? window.t(this.descKey, "Find the single shape that has a rotational, color-shade, or edge count discrepancy. Exercises fine visual detail comparison.") : "Find the single shape that has a rotational, color-shade, or edge count discrepancy. Exercises fine visual detail comparison."; },
        theme: "theme-orange",
        icon: "fa-solid fa-binoculars",
        svg: `<svg viewBox="0 0 100 60" class="card-illustration"><circle cx="25" cy="30" r="8" fill="rgba(255,255,255,0.7)" /><circle cx="50" cy="30" r="8" fill="rgba(255,255,255,0.7)" /><rect x="71" y="26" width="8" height="8" fill="#fff" rx="1" transform="rotate(45, 75, 30)" /></svg>`
    },
    {
        id: "task_switching",
        nameKey: "T114",
        skillKey: "T115",
        descKey: "T116",
        get name() { return window.t ? window.t(this.nameKey, "Cognitive Flex") : "Cognitive Flex"; },
        get skill() { return window.t ? window.t(this.skillKey, "Cognitive Shifting") : "Cognitive Shifting"; },
        get desc() { return window.t ? window.t(this.descKey, "Match objects by shifting your focus between Shape, Color, or Number. Supports mental agility and cognitive switching capacity.") : "Match objects by shifting your focus between Shape, Color, or Number. Supports mental agility and cognitive switching capacity."; },
        theme: "theme-teal",
        icon: "fa-solid fa-arrows-spin",
        svg: `<svg viewBox="0 0 100 60" class="card-illustration"><path d="M30,30 A15,15 0 1,1 70,30" fill="none" stroke="rgba(255,255,255,0.4)" stroke-width="3" /><path d="M70,30 A15,15 0 1,1 30,30" fill="none" stroke="#fff" stroke-width="3" stroke-dasharray="25 10" /><polygon points="70,25 78,30 70,35" fill="#fff" /><polygon points="30,35 22,30 30,25" fill="rgba(255,255,255,0.4)" /><circle cx="50" cy="30" r="6" fill="#fff" /></svg>`
    },
    {
        id: "sorting",
        nameKey: "T117",
        skillKey: "T118",
        descKey: "T119",
        get name() { return window.t ? window.t(this.nameKey, "Sorting Practice") : "Sorting Practice"; },
        get skill() { return window.t ? window.t(this.skillKey, "Categorisation") : "Categorisation"; },
        get desc() { return window.t ? window.t(this.descKey, "Sort incoming cards into left and right bins according to categories (Even/Odd, Living/Non-living). Trains categorization and quick sorting.") : "Sort incoming cards into left and right bins according to categories (Even/Odd, Living/Non-living). Trains categorization and quick sorting."; },
        theme: "theme-indigo",
        icon: "fa-solid fa-filter",
        svg: `<svg viewBox="0 0 100 60" class="card-illustration"><path d="M50,12 L30,45 L15,45" fill="none" stroke="rgba(255,255,255,0.4)" stroke-width="3" /><path d="M50,12 L70,45 L85,45" fill="none" stroke="#fff" stroke-width="3" /><circle cx="50" cy="17" r="5" fill="#fff" /><rect x="20" y="40" width="10" height="10" fill="rgba(255,255,255,0.5)" rx="1" /><circle cx="78" cy="45" r="5" fill="#fff" /></svg>`
    },
    {
        id: "falling_catcher",
        nameKey: "T120",
        skillKey: "T121",
        descKey: "T122",
        get name() { return window.t ? window.t(this.nameKey, "Catching Exercise") : "Catching Exercise"; },
        get skill() { return window.t ? window.t(this.skillKey, "Coordination") : "Coordination"; },
        get desc() { return window.t ? window.t(this.descKey, "Move a slider at the bottom to catch positive green gems while avoiding red obstacles. Promotes hand-eye reaction and spatial forecasting.") : "Move a slider at the bottom to catch positive green gems while avoiding red obstacles. Promotes hand-eye reaction and spatial forecasting."; },
        theme: "theme-red",
        icon: "fa-solid fa-basket-shopping",
        svg: `<svg viewBox="0 0 100 60" class="card-illustration"><rect x="35" y="45" width="30" height="8" rx="4" fill="#fff" /><polygon points="50,15 53,21 60,21 55,25 57,31 50,27 43,31 45,25 40,21 47,21" fill="rgba(255,255,255,0.8)" /><polygon points="25,20 27,25 33,25 29,29 31,34 25,30 19,34 21,29 17,25 23,25" fill="rgba(255,255,255,0.4)" /><polygon points="75,25 77,30 83,30 79,34 81,39 75,35 69,39 71,34 67,30 73,30" fill="rgba(255,255,255,0.4)" /></svg>`
    },
    {
        id: "word_association",
        nameKey: "T123",
        skillKey: "T124",
        descKey: "T125",
        get name() { return window.t ? window.t(this.nameKey, "Word Association") : "Word Association"; },
        get skill() { return window.t ? window.t(this.skillKey, "Semantic Memory") : "Semantic Memory"; },
        get desc() { return window.t ? window.t(this.descKey, "Tap the floating words that belong to the active core topic. Strengthens vocabulary connection speed and semantic recall.") : "Tap the floating words that belong to the active core topic. Strengthens vocabulary connection speed and semantic recall."; },
        theme: "theme-violet",
        icon: "fa-solid fa-network-wired",
        svg: `<svg viewBox="0 0 100 60" class="card-illustration"><circle cx="50" cy="30" r="12" fill="#fff" opacity="0.9" /><circle cx="26" cy="20" r="8" fill="rgba(255,255,255,0.5)" /><circle cx="74" cy="24" r="8" fill="rgba(255,255,255,0.5)" /><circle cx="36" cy="44" r="7" fill="rgba(255,255,255,0.5)" /><line x1="50" y1="30" x2="26" y2="20" stroke="rgba(255,255,255,0.6)" stroke-width="2" /><line x1="50" y1="30" x2="74" y2="24" stroke="rgba(255,255,255,0.6)" stroke-width="2" /><line x1="50" y1="30" x2="36" y2="44" stroke="rgba(255,255,255,0.6)" stroke-width="2" /></svg>`
    },
    {
        id: "color_confusion",
        nameKey: "T126",
        skillKey: "T127",
        descKey: "T128",
        get name() { return window.t ? window.t(this.nameKey, "Color Confusion") : "Color Confusion"; },
        get skill() { return window.t ? window.t(this.skillKey, "Inhibition") : "Inhibition"; },
        get desc() { return window.t ? window.t(this.descKey, "Tap the correct button based on font color or word meaning. Exercises mental focus, cognitive inhibition, and Stroop processing.") : "Tap the correct button based on font color or word meaning. Exercises mental focus, cognitive inhibition, and Stroop processing."; },
        theme: "theme-orange",
        icon: "fa-solid fa-palette",
        svg: `<svg viewBox="0 0 100 60" class="card-illustration"><rect x="25" y="10" width="50" height="22" rx="4" fill="rgba(255,255,255,0.9)" /><text x="50" y="25" font-family="'Outfit', sans-serif" font-weight="800" font-size="10" fill="#f97316" text-anchor="middle">GREEN</text><rect x="20" y="38" width="16" height="10" rx="2" fill="#ef4444" /><rect x="42" y="38" width="16" height="10" rx="2" fill="#3b82f6" /><rect x="64" y="38" width="16" height="10" rx="2" fill="#10b981" /></svg>`
    },
    {
        id: "quick_switch",
        nameKey: "T129",
        skillKey: "T130",
        descKey: "T131",
        get name() { return window.t ? window.t(this.nameKey, "Quick Switch") : "Quick Switch"; },
        get skill() { return window.t ? window.t(this.skillKey, "Cognitive Shifting") : "Cognitive Shifting"; },
        get desc() { return window.t ? window.t(this.descKey, "Connect numbers and letters in alternating sequence (1-A-2-B-3-C...). Promotes cognitive flexibility, sequencing speed, and executive control.") : "Connect numbers and letters in alternating sequence (1-A-2-B-3-C...). Promotes cognitive flexibility, sequencing speed, and executive control."; },
        theme: "theme-teal",
        icon: "fa-solid fa-shuffle",
        svg: `<svg viewBox="0 0 100 60" class="card-illustration"><circle cx="22" cy="18" r="7" fill="#fff" /><text x="22" y="22" font-family="'Outfit', sans-serif" font-weight="800" font-size="10" fill="#0d9488" text-anchor="middle">1</text><circle cx="50" cy="40" r="7" fill="#fff" /><text x="50" y="44" font-family="'Outfit', sans-serif" font-weight="800" font-size="10" fill="#0d9488" text-anchor="middle">A</text><circle cx="78" cy="18" r="7" fill="rgba(255,255,255,0.5)" /><text x="78" y="22" font-family="'Outfit', sans-serif" font-weight="800" font-size="10" fill="#fff" text-anchor="middle">2</text><line x1="28" y1="21" x2="44" y2="35" stroke="#fff" stroke-width="2" /><line x1="56" y1="35" x2="72" y2="21" stroke="rgba(255,255,255,0.4)" stroke-width="2" stroke-dasharray="2 2" /></svg>`
    },
    {
        id: "eagle_eye",
        nameKey: "T132",
        skillKey: "T133",
        descKey: "T134",
        get name() { return window.t ? window.t(this.nameKey, "Eagle Eye") : "Eagle Eye"; },
        get skill() { return window.t ? window.t(this.skillKey, "Visual Attention") : "Visual Attention"; },
        get desc() { return window.t ? window.t(this.descKey, "Quickly locate and select numbers in ascending order (1, 2, 3...). Enhances rapid visual scanning, attention span, and field of view.") : "Quickly locate and select numbers in ascending order (1, 2, 3...). Enhances rapid visual scanning, attention span, and field of view."; },
        theme: "theme-blue",
        icon: "fa-solid fa-eye",
        svg: `<svg viewBox="0 0 100 60" class="card-illustration"><circle cx="30" cy="18" r="8" fill="#fff" /><text x="30" y="22" font-family="'Outfit', sans-serif" font-weight="800" font-size="10" fill="#1b52a4" text-anchor="middle">1</text><circle cx="70" cy="22" r="7" fill="rgba(255,255,255,0.7)" /><text x="70" y="26" font-family="'Outfit', sans-serif" font-weight="800" font-size="8" fill="#1b52a4" text-anchor="middle">2</text><circle cx="45" cy="44" r="9" fill="rgba(255,255,255,0.5)" /><text x="45" y="48" font-family="'Outfit', sans-serif" font-weight="800" font-size="11" fill="#fff" text-anchor="middle">3</text><circle cx="15" cy="42" r="5" fill="rgba(255,255,255,0.2)" /><circle cx="85" cy="45" r="4" fill="rgba(255,255,255,0.1)" /></svg>`
    },
    {
        id: "turnabout",
        nameKey: "T135",
        skillKey: "T136",
        descKey: "T137",
        get name() { return window.t ? window.t(this.nameKey, "Turnabout") : "Turnabout"; },
        get skill() { return window.t ? window.t(this.skillKey, "Mental Rotation") : "Mental Rotation"; },
        get desc() { return window.t ? window.t(this.descKey, "Identify the correctly rotated version of a shape grid. Strengthens mental rotation capabilities, spatial awareness, and visual reasoning.") : "Identify the correctly rotated version of a shape grid. Strengthens mental rotation capabilities, spatial awareness, and visual reasoning."; },
        theme: "theme-indigo",
        icon: "fa-solid fa-arrows-turn-to-dots",
        svg: `<svg viewBox="0 0 100 60" class="card-illustration"><rect x="20" y="10" width="36" height="36" rx="6" fill="rgba(255,255,255,0.85)" /><path d="M 75,22 A 16,16 0 1,1 72,36" fill="none" stroke="#fff" stroke-width="4" stroke-linecap="round" /><path d="M 72,36 L 66,32 M 72,36 L 77,31" stroke="#fff" stroke-width="4" stroke-linecap="round" /><circle cx="28" cy="18" r="4" fill="#6366f1" /><circle cx="48" cy="38" r="4" fill="#6366f1" /><circle cx="44" cy="24" r="4" fill="#ef4444" /></svg>`
    },
    {
        id: "turning_tables",
        nameKey: "T138",
        skillKey: "T139",
        descKey: "T140",
        get name() { return window.t ? window.t(this.nameKey, "Turning Tables") : "Turning Tables"; },
        get skill() { return window.t ? window.t(this.skillKey, "Spatial Memory") : "Spatial Memory"; },
        get desc() { return window.t ? window.t(this.descKey, "Memorize target slots on a round table, track them as the table spins, and identify their new positions. Exercises dynamic spatial tracking and recall.") : "Memorize target slots on a round table, track them as the table spins, and identify their new positions. Exercises dynamic spatial tracking and recall."; },
        theme: "theme-green",
        icon: "fa-solid fa-arrows-spin",
        svg: `<svg viewBox="0 0 100 60" class="card-illustration"><circle cx="50" cy="30" r="22" fill="rgba(255,255,255,0.3)" stroke="#fff" stroke-width="2" /><circle cx="50" cy="30" r="10" fill="rgba(255,255,255,0.5)" /><circle cx="50" cy="14" r="4.5" fill="#fff" /><circle cx="50" cy="46" r="4.5" fill="#10b981" /><circle cx="34" cy="30" r="4.5" fill="#fff" opacity="0.6" /><circle cx="66" cy="30" r="4.5" fill="#10b981" /><path d="M 78,22 A 28,28 0 0,0 72,12" fill="none" stroke="#fff" stroke-width="2.5" stroke-linecap="round" /><path d="M 72,12 L 67,16 M 72,12 L 75,7" stroke="#fff" stroke-width="2.5" stroke-linecap="round" /></svg>`
    },
    {
        id: "quick_count",
        nameKey: "T141",
        skillKey: "T142",
        descKey: "T143",
        get name() { return window.t ? window.t(this.nameKey, "Quick Count") : "Quick Count"; },
        get skill() { return window.t ? window.t(this.skillKey, "Visual Attention") : "Visual Attention"; },
        get desc() { return window.t ? window.t(this.descKey, "Instantly subitize or count blocks of a specific color in a randomized grid against a swift countdown. Strengthens scanning speed and visual quantity estimation.") : "Instantly subitize or count blocks of a specific color in a randomized grid against a swift countdown. Strengthens scanning speed and visual quantity estimation."; },
        theme: "theme-magenta",
        icon: "fa-solid fa-table-cells-large",
        svg: `<svg viewBox="0 0 100 60" class="card-illustration"><rect x="24" y="10" width="10" height="10" rx="2" fill="#ec4899" /><rect x="38" y="10" width="10" height="10" rx="2" fill="rgba(255,255,255,0.4)" /><rect x="52" y="10" width="10" height="10" rx="2" fill="#ec4899" /><rect x="66" y="10" width="10" height="10" rx="2" fill="rgba(255,255,255,0.4)" /><rect x="24" y="24" width="10" height="10" rx="2" fill="rgba(255,255,255,0.4)" /><rect x="38" y="24" width="10" height="10" rx="2" fill="#ec4899" /><rect x="52" y="24" width="10" height="10" rx="2" fill="rgba(255,255,255,0.4)" /><rect x="66" y="24" width="10" height="10" rx="2" fill="#ec4899" /><rect x="24" y="38" width="10" height="10" rx="2" fill="#ec4899" /><rect x="38" y="38" width="10" height="10" rx="2" fill="rgba(255,255,255,0.4)" /><rect x="52" y="38" width="10" height="10" rx="2" fill="#ec4899" /><rect x="66" y="38" width="10" height="10" rx="2" fill="rgba(255,255,255,0.4)" /></svg>`
    }
];

function getFormattedDate(d = new Date()) {
    try {
        const year = d.getFullYear();
        const month = String(d.getMonth() + 1).padStart(2, '0');
        const day = String(d.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    } catch (e) {
        return "2026-08-10";
    }
}

class AppManager {
    constructor() {
        this.gameState = {
            xp: 0,
            progress: {}, // kept for tracking cleared stats
            highScores: {} // { gameId: { level: score } }
        };
        
        this.activeGameId = null;
        this.activeLevel = 1;
        this.activeGameInstance = null;
        this.patientName = '';
        this.userId = '';
        this.stateKey = 'neurorehab_state';

        window.Games = window.Games || {};
        window.appManagerInstance = this;
        this.initialized = false;
    }

    init() {
        this.initialized = true;
        const urlParams = new URLSearchParams(window.location.search);
        this.patientName = urlParams.get('patient') || 'Patient';
        this.userId = urlParams.get('userId') || '1001';
        this.stateKey = "neurorehab_state_" + this.patientName;

        // Clear any old local storage state to guarantee pure JSON data flow
        try { localStorage.removeItem(this.stateKey); } catch(e) {}

        const patientEl = document.getElementById("patient-name-display");
        if (patientEl) {
            patientEl.innerText = window.t ? window.t('T27', `Patient: ${this.patientName}`, { name: this.patientName }) : `Patient: ${this.patientName}`;
        }
        const userIdEl = document.getElementById("patient-id-display");
        if (userIdEl) {
            userIdEl.innerText = window.t ? window.t('T28', `ID: ${this.userId}`, { id: this.userId }) : `ID: ${this.userId}`;
        }

        if (window.i18n) {
            window.i18n.onLanguageChanged(() => {
                if (patientEl) {
                    patientEl.innerText = window.t ? window.t('T27', `Patient: ${this.patientName}`, { name: this.patientName }) : `Patient: ${this.patientName}`;
                }
                if (userIdEl) {
                    userIdEl.innerText = window.t ? window.t('T28', `ID: ${this.userId}`, { id: this.userId }) : `ID: ${this.userId}`;
                }
                this.renderLobby();
                this.renderDashboard();
                this.updatePlayerHUD();
            });
        }

        if (window.UnityBridge) {
            window.UnityBridge.init();
        }
        this.loadState();

        const parseJsonParam = (raw) => {
            if (!raw) return null;
            try { return JSON.parse(raw); } catch(e) {}
            try { return JSON.parse(decodeURIComponent(raw)); } catch(e) {}
            return null;
        };

        // Parse initial XP passed from Unity
        const xpParam = urlParams.get('xp');
        if (xpParam !== null && xpParam !== undefined) {
            const parsedXp = parseInt(xpParam);
            if (!isNaN(parsedXp)) {
                this.gameState.xp = parsedXp;
            }
        }

        // Parse saved highScores passed from Unity via URL query parameters
        const hs = parseJsonParam(urlParams.get('highScores'));
        if (hs && typeof hs === 'object') {
            Object.keys(hs).forEach(gId => {
                this.gameState.highScores[gId] = hs[gId];
            });
        }

        // Parse saved progress passed from Unity via URL query parameters
        const prog = parseJsonParam(urlParams.get('progressData'));
        if (prog && typeof prog === 'object') {
            Object.keys(prog).forEach(gId => {
                this.gameState.progress[gId] = prog[gId];
            });
        }

        // Parse saved highAccuracies passed from Unity via URL query parameters
        const ha = parseJsonParam(urlParams.get('highAccuracies'));
        if (ha && typeof ha === 'object') {
            Object.keys(ha).forEach(gId => {
                this.gameState.highAccuracies[gId] = ha[gId];
            });
        }

        // Ensure defaults for any missing game structures
        this.ensureGameStateDefaults();

        // If query parameters were not provided (standalone desktop browser load), fetch JSON from Unity HTTP Bridge
        if (!urlParams.get('highScores') && !urlParams.get('progressData') && window.location && (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')) {
            try {
                fetch("http://localhost:8080/get_patient_data?userId=" + encodeURIComponent(this.userId))
                    .then(res => res.json())
                    .then(data => {
                        if (data && typeof data === 'object') {
                            if (typeof data.totalXP === 'number') this.gameState.xp = data.totalXP;
                            if (data.highScoresJson) {
                                const parsedHs = parseJsonParam(data.highScoresJson);
                                if (parsedHs) Object.keys(parsedHs).forEach(gId => { this.gameState.highScores[gId] = parsedHs[gId]; });
                            }
                            if (data.progressJson) {
                                const parsedProg = parseJsonParam(data.progressJson);
                                if (parsedProg) Object.keys(parsedProg).forEach(gId => { this.gameState.progress[gId] = parsedProg[gId]; });
                            }
                            if (data.highAccuraciesJson) {
                                const parsedHa = parseJsonParam(data.highAccuraciesJson);
                                if (parsedHa) Object.keys(parsedHa).forEach(gId => { this.gameState.highAccuracies[gId] = parsedHa[gId]; });
                            }
                            this.ensureGameStateDefaults();
                            this.renderLobby();
                            this.updatePlayerHUD();
                        }
                    })
                    .catch(() => {});
            } catch(e) {}
        }

        this.renderLobby();
        this.renderSessionCard();
        this.renderDashboard();
        this.bindEvents();
        this.updatePlayerHUD();
        this.setupTabs();

        // Expose global callback for Unity JS evaluation
        if (window.UnityBridge) {
            window.UnityBridge.setPatientData = (data) => {
                if (data && typeof data === 'object') {
                    if (data.xp !== undefined && typeof data.xp === 'number') {
                        this.gameState.xp = Math.max(this.gameState.xp, data.xp);
                    }
                    if (data.userId) this.userId = data.userId;
                    if (data.patientName) this.patientName = data.patientName;
                    if (data.highScores) this.gameState.highScores = Object.assign({}, this.gameState.highScores, data.highScores);
                    if (data.progress) this.gameState.progress = Object.assign({}, this.gameState.progress, data.progress);
                    this.saveState();
                    this.renderLobby();
                    this.renderDashboard();
                }
            };
        }
    }

    ensureGameStateDefaults() {
        if (!this.gameState || typeof this.gameState !== "object") {
            this.gameState = {};
        }
        if (!this.gameState.progress || typeof this.gameState.progress !== "object") {
            this.gameState.progress = {};
        }
        if (!this.gameState.highScores || typeof this.gameState.highScores !== "object") {
            this.gameState.highScores = {};
        }
        if (!this.gameState.highAccuracies || typeof this.gameState.highAccuracies !== "object") {
            this.gameState.highAccuracies = {};
        }
        if (!this.gameState.accuracies || typeof this.gameState.accuracies !== "object") {
            this.gameState.accuracies = {};
        }

        GAME_DEFS.forEach(g => {
            if (!this.gameState.progress[g.id] || typeof this.gameState.progress[g.id] !== "number") {
                this.gameState.progress[g.id] = 1;
            }
            if (!this.gameState.highScores[g.id] || typeof this.gameState.highScores[g.id] !== "object") {
                this.gameState.highScores[g.id] = {};
            }
            if (!this.gameState.highAccuracies[g.id] || typeof this.gameState.highAccuracies[g.id] !== "object") {
                this.gameState.highAccuracies[g.id] = {};
            }
            if (!this.gameState.accuracies[g.id] || typeof this.gameState.accuracies[g.id] !== "object") {
                this.gameState.accuracies[g.id] = {};
            }
        });
        
        if (typeof this.gameState.xp !== "number") {
            this.gameState.xp = 0;
        }
    }

    loadState() {
        // Do NOT load state from localStorage - all state is initialized strictly from Unity JSON profile
        try { localStorage.removeItem(this.stateKey); } catch(e) {}

        this.ensureGameStateDefaults();

        if (!this.gameState.sessionHistory) {
            this.gameState.sessionHistory = [];
            let tempSessions = [];
            GAME_DEFS.forEach(g => {
                const accs = this.gameState.highAccuracies[g.id] || {};
                const scores = this.gameState.highScores[g.id] || {};
                Object.keys(accs).forEach(lvl => {
                    const acc = accs[lvl] || 0;
                    if (acc > 0) {
                        tempSessions.push({
                            accuracy: acc,
                            xp: scores[lvl] || 200
                        });
                    }
                });
            });

            // Reconstruct up to last 7 real entries
            let accumulatedXp = 0;
            tempSessions.slice(-7).forEach((rec, idx) => {
                accumulatedXp += rec.xp;
                const cpiVal = Math.min(1000, 100 + Math.round(accumulatedXp * 0.4));
                this.gameState.sessionHistory.push({
                    session: "S" + (idx + 1),
                    accuracy: rec.accuracy,
                    cpi: cpiVal
                });
            });

            this.gameState.totalSessions = tempSessions.length;
        }

        // Migration: If sessionHistory has xp instead of cpi, convert it
        if (this.gameState.sessionHistory) {
            this.gameState.sessionHistory.forEach(h => {
                if (h.xp !== undefined && h.cpi === undefined) {
                    h.cpi = Math.min(1000, 100 + Math.round(h.xp * 0.4));
                    delete h.xp;
                }
            });
        }

        if (typeof this.gameState.totalSessions !== "number") {
            this.gameState.totalSessions = this.gameState.sessionHistory.length;
        }

        // Initialize Daily & Streak Tracking
        const todayStr = getFormattedDate();
        if (!this.gameState.daily) {
            this.gameState.daily = {
                date: todayStr,
                played: [],
                streak: 0,
                lastPlayed: ""
            };
        }
        
        if (this.gameState.daily.date !== todayStr) {
            const lastPlayed = this.gameState.daily.lastPlayed;
            
            // Check if streak was continued yesterday
            const yesterday = new Date();
            yesterday.setDate(yesterday.getDate() - 1);
            const yesterdayStr = getFormattedDate(yesterday);
            
            let newStreak = this.gameState.daily.streak || 0;
            if (lastPlayed !== yesterdayStr && lastPlayed !== todayStr) {
                // Streak broken because they skipped a day
                newStreak = 0;
            }
            
            this.gameState.daily = {
                date: todayStr,
                played: [],
                streak: newStreak,
                lastPlayed: lastPlayed
            };
        }

        const soundMuted = localStorage.getItem("neurorehab_muted") === "true";
        if (soundMuted) {
            Sound.muted = true;
            this.updateSoundIcon();
        }
    }

    saveState() {
        try { localStorage.removeItem(this.stateKey); } catch(e) {}
        localStorage.setItem("neurorehab_muted", Sound.muted ? "true" : "false");
        this.updatePlayerHUD();
        this.syncScoreToUnity();
    }

    syncScoreToUnity() {
        const avgAcc = this.getAverageAccuracy ? this.getAverageAccuracy() : 100;
        const payload = {
            userId: this.userId,
            patientName: this.patientName,
            xp: this.gameState.xp,
            accuracy: avgAcc,
            highScores: JSON.stringify(this.gameState.highScores || {}),
            progress: JSON.stringify(this.gameState.progress || {}),
            highAccuracies: JSON.stringify(this.gameState.highAccuracies || {}),
            totalSessions: this.gameState.totalSessions || 0,
            completedCount: this.getCompletedCount ? this.getCompletedCount() : 0
        };

        if (window.UnityBridge) {
            window.UnityBridge.sendEvent("score_sync", payload);
        }

        // Fallback for Mac Browser testing outside native UniWebView overlay
        if (location.protocol.startsWith('http') || location.protocol.startsWith('file')) {
            try {
                const query = new URLSearchParams(payload).toString();
                fetch("http://localhost:8080/score_sync?" + query, { mode: 'no-cors' }).catch(e => {});
            } catch(e) {}
        }
    }

    getCompletedCount() {
        let count = 0;
        GAME_DEFS.forEach(g => {
            if (this.isGamePracticed(g.id)) count++;
        });
        return count;
    }

    getAverageAccuracy() {
        let totalAcc = 0;
        let countAcc = 0;
        GAME_DEFS.forEach(g => {
            const accs = (this.gameState.highAccuracies && this.gameState.highAccuracies[g.id]) || {};
            let maxAcc = 0;
            Object.keys(accs).forEach(lvl => {
                if (accs[lvl] > 0) maxAcc = Math.max(maxAcc, accs[lvl]);
            });
            if (maxAcc > 0) {
                totalAcc += maxAcc;
                countAcc++;
            }
        });
        return countAcc > 0 ? Math.round(totalAcc / countAcc) : 100;
    }

    isGamePracticed(gameId) {
        // 1. Check if they have reached a level higher than 1
        const progress = this.gameState.progress[gameId] || 1;
        if (progress > 1) return true;
        
        // 2. Check if they have any high score
        const scores = this.gameState.highScores[gameId] || {};
        for (const lvl in scores) {
            if (scores[lvl] > 0) return true;
        }
        
        // 3. Check if they have any accuracy stats
        const accs = this.gameState.highAccuracies[gameId] || {};
        for (const lvl in accs) {
            if (accs[lvl] > 0) return true;
        }
        
        // 4. Check if played today
        if (this.gameState.daily && this.gameState.daily.played && this.gameState.daily.played.includes(gameId)) {
            return true;
        }
        
        return false;
    }

    updatePlayerHUD() {
        // 1. Exercises Completed Count
        let completedCount = 0;
        GAME_DEFS.forEach(g => {
            if (this.isGamePracticed(g.id)) completedCount++;
        });

        // 2. Overall Progress Percentage
        let totalLevelsCleared = 0;
        GAME_DEFS.forEach(g => {
            let maxCleared = 0;
            const scores = this.gameState.highScores[g.id] || {};
            Object.keys(scores).forEach(lvl => {
                if (scores[lvl] > 0) {
                    maxCleared = Math.max(maxCleared, parseInt(lvl));
                }
            });
            
            // Fallback checking progress or accuracy
            if (maxCleared === 0) {
                const currentProg = this.gameState.progress[g.id] || 1;
                if (currentProg > 1) {
                    maxCleared = currentProg - 1;
                } else {
                    const accs = this.gameState.highAccuracies[g.id] || {};
                    Object.keys(accs).forEach(lvl => {
                        if (accs[lvl] > 0) {
                            maxCleared = Math.max(maxCleared, parseInt(lvl));
                        }
                    });
                }
            }
            totalLevelsCleared += maxCleared;
        });
        const avgLevel = GAME_DEFS.length > 0 ? (totalLevelsCleared / GAME_DEFS.length) : 0;
        const progressPercentage = Math.round((avgLevel / 50) * 100);

        // 3. Average Accuracy Percentage
        let totalAcc = 0;
        let countAcc = 0;
        GAME_DEFS.forEach(g => {
            const accs = this.gameState.highAccuracies[g.id] || {};
            Object.keys(accs).forEach(lvl => {
                if (accs[lvl] > 0) {
                    totalAcc += accs[lvl];
                    countAcc++;
                }
            });
        });
        const avgAccuracy = countAcc > 0 ? Math.round(totalAcc / countAcc) : 100;

        // Render to header HUD elements
        const completedEl = document.getElementById("player-completed");
        const progressEl = document.getElementById("player-progress");
        const accuracyEl = document.getElementById("player-accuracy");

        if (completedEl) completedEl.innerText = `${completedCount} / ${GAME_DEFS.length}`;
        if (progressEl) progressEl.innerText = `${progressPercentage}%`;
        if (accuracyEl) accuracyEl.innerText = `${avgAccuracy}%`;
    }

    renderLobby() {
        const grid = document.getElementById("game-grid");
        if (!grid) return;
        grid.innerHTML = "";

        GAME_DEFS.forEach(game => {
            // Find highest level played/cleared
            let highestLevel = 0;
            const levels = Object.keys(this.gameState.highScores[game.id] || {});
            levels.forEach(lvl => {
                if (this.gameState.highScores[game.id][lvl] > 0) {
                    highestLevel = Math.max(highestLevel, parseInt(lvl));
                }
            });
            
            // Fallback checking progress or accuracy
            if (highestLevel === 0) {
                const currentProg = this.gameState.progress[game.id] || 1;
                if (currentProg > 1) {
                    highestLevel = currentProg - 1;
                } else {
                    const accs = this.gameState.highAccuracies[game.id] || {};
                    Object.keys(accs).forEach(lvl => {
                        if (accs[lvl] > 0) {
                            highestLevel = Math.max(highestLevel, parseInt(lvl));
                        }
                    });
                }
            }

            const isPracticed = highestLevel > 0 || this.isGamePracticed(game.id);
            const displayLevelText = isPracticed ? (highestLevel > 0 ? (window.t ? window.t('T38', `Max Level: L${highestLevel}`, { level: highestLevel }) : `Max Level: L${highestLevel}`) : (window.t ? window.t('T39', "Practiced") : "Practiced")) : (window.t ? window.t('T40', "Not Practiced") : "Not Practiced");
            const progressPercent = highestLevel > 0 ? Math.min(100, (highestLevel / 50) * 100) : (isPracticed ? 2 : 0);

            const card = document.createElement("div");
            card.className = `game-card ${game.theme}`;
            card.dataset.id = game.id;
            
            card.innerHTML = `
                <div class="game-card-thumbnail">
                    ${game.svg || ''}
                    <div class="game-card-icon-wrapper">
                        <i class="${game.icon}"></i>
                    </div>
                </div>
                <div class="game-card-body">
                    <div>
                        <span class="game-card-title">${game.name}</span>
                        <div class="game-card-skill">${game.skill}</div>
                    </div>
                    <div class="game-card-progress">
                        <div class="game-progress-bar">
                            <div class="game-progress-fill" style="width: ${progressPercent}%"></div>
                        </div>
                        <span class="game-level-text">${displayLevelText}</span>
                    </div>
                </div>
            `;
            
            card.addEventListener("click", () => {
                Sound.playClick();
                this.showInstructions(game.id);
            });

            grid.appendChild(card);
        });
    }

    bindEvents() {
        // Sound toggle
        document.getElementById("sound-toggle-btn").addEventListener("click", (e) => {
            e.stopPropagation();
            Sound.playClick();
            Sound.toggleMute();
            this.updateSoundIcon();
            this.saveState();
            if (window.UnityBridge) {
                window.UnityBridge.sendEvent("sound_toggled", { muted: Sound.muted });
            }
        });

        // Exit App button
        const exitBtn = document.getElementById("exit-app-btn");
        if (exitBtn) {
            exitBtn.addEventListener("click", (e) => {
                e.stopPropagation();
                Sound.playClick();
                this.syncScoreToUnity();
                if (window.UnityBridge) {
                    window.UnityBridge.sendEvent("close");
                }
                setTimeout(() => {
                    try {
                        window.location.href = "uniwebview://close";
                    } catch(err) {}
                }, 50);
            });
        }

        // Reset Data
        document.getElementById("reset-progress-btn").addEventListener("click", (e) => {
            e.stopPropagation();
            Sound.playClick();
            const resetMsg = window.t ? window.t('T57', "Reset exercise history and scores?") : "Reset exercise history and scores?";
            if (confirm(resetMsg)) {
                localStorage.removeItem(this.stateKey);
                this.gameState = { xp: 0, progress: {}, highScores: {} };
                this.loadState();
                this.renderLobby();
                this.renderSessionCard();
                this.renderDashboard();
                this.updatePlayerHUD();
                
                // Show exercises tab by default
                const exTab = document.getElementById("tab-exercises");
                if (exTab) exTab.click();
            }
        });

        // Back to Lobby
        document.getElementById("game-back-btn").addEventListener("click", () => {
            Sound.playClick();
            this.exitToLobby();
        });

        // Start button
        document.getElementById("modal-start-btn").addEventListener("click", () => {
            Sound.playClick();
            this.startActiveGame();
        });

        // Result controls
        document.getElementById("result-lobby-btn").addEventListener("click", () => {
            Sound.playClick();
            this.closeModal("result-modal");
            this.exitToLobby();
        });

        document.getElementById("result-retry-btn").addEventListener("click", () => {
            Sound.playClick();
            this.closeModal("result-modal");
            this.setupGame(this.activeGameId, this.activeLevel);
        });

        document.getElementById("result-next-btn").addEventListener("click", () => {
            Sound.playClick();
            this.closeModal("result-modal");
            this.setupGame(this.activeGameId, Math.min(50, this.activeLevel + 1));
        });

        // Close modal triggers
        document.getElementById("modal-close-btn").addEventListener("click", () => {
            Sound.playClick();
            this.closeModal("instructions-modal");
        });

        // Stepper adjusters
        document.getElementById("level-dec-btn").addEventListener("click", () => {
            Sound.playClick();
            this.activeLevel = Math.max(1, this.activeLevel - 1);
            document.getElementById("level-display-val").innerText = this.activeLevel;
        });

        document.getElementById("level-inc-btn").addEventListener("click", () => {
            Sound.playClick();
            this.activeLevel = Math.min(50, this.activeLevel + 1);
            document.getElementById("level-display-val").innerText = this.activeLevel;
        });

        document.getElementById("instructions-modal").addEventListener("click", (e) => {
            if (e.target.id === "instructions-modal") {
                this.closeModal("instructions-modal");
            }
        });

        // Tab selection events
        const exTab = document.getElementById("tab-exercises");
        const dbTab = document.getElementById("tab-dashboard");
        if (exTab && dbTab) {
            exTab.addEventListener("click", () => {
                Sound.playClick();
                this.switchTab("exercises");
            });
            dbTab.addEventListener("click", () => {
                Sound.playClick();
                this.switchTab("dashboard");
            });
        }
    }

    updateSoundIcon() {
        const icon = document.getElementById("sound-icon");
        if (Sound.muted) {
            icon.className = "fa-solid fa-volume-xmark";
        } else {
            icon.className = "fa-solid fa-volume-high";
        }
    }

    showInstructions(gameId) {
        const game = GAME_DEFS.find(g => g.id === gameId);
        if (!game) return;

        this.activeGameId = gameId;

        document.getElementById("modal-game-title").innerText = game.name;
        document.getElementById("modal-game-cognitive").innerText = game.skill;
        document.getElementById("modal-game-desc").innerText = game.desc;

        // Start on current progress level, default to 1
        this.activeLevel = this.gameState.progress[gameId] || 1;
        document.getElementById("level-display-val").innerText = this.activeLevel;

        this.openModal("instructions-modal");

        if (window.UnityBridge) {
            window.UnityBridge.sendEvent("exercise_instructions_opened", {
                gameId: gameId,
                name: game.name,
                level: this.activeLevel
            });
        }
    }

    openModal(modalId) {
        document.getElementById(modalId).classList.add("active");
    }

    closeModal(modalId) {
        document.getElementById(modalId).classList.remove("active");
    }

    startActiveGame() {
        this.closeModal("instructions-modal");
        this.setupGame(this.activeGameId, this.activeLevel);
    }

    setupGame(gameId, level) {
        this.activeGameId = gameId;
        this.activeLevel = level;
        this.activeGameScore = 0;
        this.activeGameLives = 3;

        document.getElementById("lobby-view").classList.remove("active");
        document.getElementById("game-view").classList.add("active");

        const game = GAME_DEFS.find(g => g.id === gameId);
        const fallbackExercise = window.t ? window.t('T71', "Exercise") : "Exercise";
        const levelLabel = window.t ? window.t('T66', `Level ${level}`, { level: level }) : `Level ${level}`;
        document.getElementById("game-current-name").innerText = game ? game.name : fallbackExercise;
        document.getElementById("game-current-level").innerText = levelLabel;

        if (window.UnityBridge) {
            window.UnityBridge.sendEvent("exercise_started", {
                gameId: gameId,
                name: game ? game.name : "",
                level: level
            });
        }

        document.getElementById("hud-score").innerText = "100%";
        document.getElementById("hud-timer").innerText = "00:00";
        // Call it 'Chances' instead of 'Lives' for friendly clinical guidance
        document.getElementById("hud-lives").innerText = "3";

        const arena = document.getElementById("game-arena");
        arena.innerHTML = "";
        
        this.cleanupActiveGame();

        const impl = window.Games[gameId];
        if (!impl) {
            const errText = window.t ? window.t('T179', `Exercise module [${gameId}] loaded incorrectly. Please contact administrator.`, { id: gameId }) : `Exercise module [${gameId}] loaded incorrectly. Please contact administrator.`;
            arena.innerHTML = `<div style="padding:2rem; text-align:center;">${errText}</div>`;
            return;
        }

        const gameCtx = {
            level: level,
            setScore: (score) => {
                this.activeGameScore = score;
                let liveAccuracy = 100;
                if (typeof this.activeGameLives === "number") {
                    const mistakes = 3 - this.activeGameLives;
                    liveAccuracy = Math.max(50, 100 - mistakes * 15);
                }
                document.getElementById("hud-score").innerText = `${liveAccuracy}%`;
            },
            setTimer: (txt) => {
                document.getElementById("hud-timer").innerText = txt;
            },
            setLives: (lives) => {
                this.activeGameLives = lives;
                let liveAccuracy = 100;
                if (typeof lives === "number") {
                    const mistakes = 3 - lives;
                    liveAccuracy = Math.max(50, 100 - mistakes * 15);
                }
                document.getElementById("hud-score").innerText = `${liveAccuracy}%`;
                document.getElementById("hud-lives").innerText = lives;
            },
            playSound: (name) => {
                if (name === 'success') Sound.playSuccess();
                else if (name === 'error') Sound.playError();
                else if (name === 'match') Sound.playMatch();
                else if (name === 'click') Sound.playClick();
                else if (name === 'tick') Sound.playTick();
            },
            onWin: (score, xp) => {
                this.handleGameComplete(true, score, xp);
            },
            onLose: (score) => {
                this.handleGameComplete(false, score, 0);
            }
        };

        this.activeGameInstance = impl;
        impl.init(arena, gameCtx);
    }

    cleanupActiveGame() {
        if (this.activeGameInstance && typeof this.activeGameInstance.destroy === "function") {
            try {
                this.activeGameInstance.destroy();
            } catch (e) {
                console.error("Error destroying game instance:", e);
            }
        }
        this.activeGameInstance = null;
    }

    exitToLobby() {
        this.cleanupActiveGame();
        document.getElementById("game-view").classList.remove("active");
        document.getElementById("lobby-view").classList.add("active");
        this.renderLobby();
        this.renderSessionCard();
        this.renderDashboard();
        if (window.UnityBridge) {
            window.UnityBridge.sendEvent("lobby_returned", {});
        }
    }

    handleGameComplete(success, score, xp) {
        const getFormattedDate = (d = new Date()) => d.toISOString().split('T')[0];
        this.cleanupActiveGame();
        
        // Record Daily Progress
        const todayStr = getFormattedDate();
        if (!this.gameState.daily.played.includes(this.activeGameId)) {
            this.gameState.daily.played.push(this.activeGameId);
        }
        
        if (this.gameState.daily.lastPlayed !== todayStr) {
            const yesterday = new Date();
            yesterday.setDate(yesterday.getDate() - 1);
            const yesterdayStr = getFormattedDate(yesterday);
            
            if (this.gameState.daily.lastPlayed === yesterdayStr) {
                this.gameState.daily.streak = (this.gameState.daily.streak || 0) + 1;
            } else {
                this.gameState.daily.streak = 1;
            }
            this.gameState.daily.lastPlayed = todayStr;
        }

        const resultIcon = document.getElementById("result-header-icon");
        const resultTitle = document.getElementById("result-title");
        const resultMessage = document.getElementById("result-message");
        const nextBtn = document.getElementById("result-next-btn");

        // Calculate session accuracy
        let sessionAccuracy = 100;
        if (this.activeGameLives !== "---" && typeof this.activeGameLives === "number") {
            const mistakes = 3 - this.activeGameLives;
            sessionAccuracy = Math.max(50, 100 - mistakes * 15);
        } else {
            sessionAccuracy = success ? 95 : 60;
        }

        // Persist accuracy stats
        this.gameState.accuracies = this.gameState.accuracies || {};
        this.gameState.accuracies[this.activeGameId] = this.gameState.accuracies[this.activeGameId] || {};
        this.gameState.accuracies[this.activeGameId][this.activeLevel] = sessionAccuracy;

        this.gameState.highAccuracies = this.gameState.highAccuracies || {};
        this.gameState.highAccuracies[this.activeGameId] = this.gameState.highAccuracies[this.activeGameId] || {};
        const oldHighAccuracy = this.gameState.highAccuracies[this.activeGameId][this.activeLevel] || 0;
        if (sessionAccuracy > oldHighAccuracy) {
            this.gameState.highAccuracies[this.activeGameId][this.activeLevel] = sessionAccuracy;
        }

        // Render result stats
        document.getElementById("result-score").innerText = `${sessionAccuracy}%`;
        const clearedText = window.t ? window.t('T84', "Level Cleared!") : "Level Cleared!";
        const practiceText = window.t ? window.t('T85', "Practice Completed") : "Practice Completed";
        document.getElementById("result-xp").innerText = success ? clearedText : practiceText;

        this.updateSessionHistory(sessionAccuracy, success ? xp : 20);

        if (success) {
            Sound.playWin();
            resultIcon.className = "result-icon-success";
            resultIcon.innerHTML = `<i class="fa-solid fa-heart" style="color: var(--clinical-red)"></i>`;
            resultTitle.innerText = window.t ? window.t('T78', "FABULOUS WORK!") : "FABULOUS WORK!";
            const successMsg = window.t ? window.t('T79', `Congratulations on completing Level ${this.activeLevel}! Every exercise you do nourishes and strengthens your mind. You are doing amazing!`, { level: this.activeLevel }) : `Congratulations on completing Level ${this.activeLevel}! Every exercise you do nourishes and strengthens your mind. You are doing amazing!`;
            resultMessage.innerText = successMsg;
            
            // Record High Score for progression checking
            const oldHighScore = this.gameState.highScores[this.activeGameId][this.activeLevel] || 0;
            if (score > oldHighScore) {
                this.gameState.highScores[this.activeGameId][this.activeLevel] = score;
            }
            
            this.gameState.xp += xp;
            this.saveState();

            const currentProg = this.gameState.progress[this.activeGameId] || 1;
            if (this.activeLevel === currentProg) {
                this.gameState.progress[this.activeGameId] = Math.min(50, this.activeLevel + 1);
            }

            if (this.activeLevel < 50) {
                nextBtn.style.display = "block";
                nextBtn.innerText = window.t ? window.t('T89', `NEXT LEVEL (${this.activeLevel + 1})`, { level: this.activeLevel + 1 }) : `NEXT LEVEL (${this.activeLevel + 1})`;
            } else {
                nextBtn.style.display = "none";
            }
        } else {
            Sound.playError();
            resultIcon.className = "result-icon-fail";
            resultIcon.innerHTML = `<i class="fa-solid fa-circle-check" style="color: var(--clinical-teal)"></i>`;
            resultTitle.innerText = window.t ? window.t('T80', "GREAT TRY & PRACTICE!") : "GREAT TRY & PRACTICE!";
            resultMessage.innerText = window.t ? window.t('T81', "Every minute spent practicing is a wonderful step forward for your brain. Be proud of your dedication today!") : "Every minute spent practicing is a wonderful step forward for your brain. Be proud of your dedication today!";
            nextBtn.style.display = "none";
            
            // Supportive progression entry
            const oldHighScore = this.gameState.highScores[this.activeGameId][this.activeLevel] || 0;
            if (score > oldHighScore) {
                this.gameState.highScores[this.activeGameId][this.activeLevel] = score;
            }
            this.gameState.xp += 20;
            this.saveState();
        }

        if (window.UnityBridge) {
            const game = GAME_DEFS.find(g => g.id === this.activeGameId);
            window.UnityBridge.sendEvent("exercise_completed", {
                gameId: this.activeGameId,
                name: game ? game.name : "",
                level: this.activeLevel,
                success: success,
                score: score,
                accuracy: sessionAccuracy,
                xp: success ? xp : 20
            });
        }

        this.openModal("result-modal");
    }

    setupTabs() {
        // Render initial view
        this.switchTab("exercises");
    }

    switchTab(tabName) {
        const exTab = document.getElementById("tab-exercises");
        const dbTab = document.getElementById("tab-dashboard");
        const exContent = document.getElementById("tab-content-exercises");
        const dbContent = document.getElementById("tab-content-dashboard");
        const sessionContainer = document.getElementById("session-card-container");
        
        if (tabName === "exercises") {
            if (exTab) exTab.classList.add("active");
            if (dbTab) dbTab.classList.remove("active");
            if (exContent) exContent.style.display = "block";
            if (dbContent) dbContent.style.display = "none";
            if (sessionContainer) sessionContainer.style.display = "block";
            this.renderLobby();
            this.renderSessionCard();
        } else {
            if (exTab) exTab.classList.remove("active");
            if (dbTab) dbTab.classList.add("active");
            if (exContent) exContent.style.display = "none";
            if (dbContent) dbContent.style.display = "block";
            if (sessionContainer) sessionContainer.style.display = "none";
            this.renderDashboard();
        }
    }

    getRecommendedGame() {
        const todayPlayed = this.gameState.daily.played || [];
        // Candidate list: games not played today
        let candidates = GAME_DEFS.filter(g => !todayPlayed.includes(g.id));
        if (candidates.length === 0) {
            candidates = GAME_DEFS; // Fallback to all if all played
        }
        
        // Find candidate with lowest level cleared (or lowest progression)
        let recommended = null;
        let minLevel = 999;
        
        candidates.forEach(g => {
            const currentProg = this.gameState.progress[g.id] || 1;
            if (currentProg < minLevel) {
                minLevel = currentProg;
                recommended = g;
            }
        });
        
        return recommended || GAME_DEFS[0];
    }

    renderSessionCard() {
        const container = document.getElementById("session-card-container");
        if (container) {
            container.style.display = "none";
            container.innerHTML = "";
        }
    }

    updateSessionHistory(sessionAccuracy, earnedXp) {
        this.gameState.sessionHistory = this.gameState.sessionHistory || [];
        this.gameState.totalSessions = (this.gameState.totalSessions || 0) + 1;

        const sessionLabel = "S" + this.gameState.totalSessions;
        const cpiVal = Math.min(1000, 100 + Math.round(this.gameState.xp * 0.4));
        
        this.gameState.sessionHistory.push({
            session: sessionLabel,
            accuracy: sessionAccuracy,
            cpi: cpiVal
        });

        if (this.gameState.sessionHistory.length > 7) {
            this.gameState.sessionHistory.shift();
        }
    }

    renderDashboard() {
        const container = document.getElementById("tab-content-dashboard");
        if (!container) return;
        
        // Calculate summary metrics
        const streak = (this.gameState.daily && this.gameState.daily.streak) || 0;
        
        // Sum up completed levels and count games practiced
        let practicedGamesCount = 0;
        let totalLevelsCleared = 0;
        
        GAME_DEFS.forEach(g => {
            let maxCleared = 0;
            const scores = this.gameState.highScores[g.id] || {};
            Object.keys(scores).forEach(lvl => {
                if (scores[lvl] > 0) {
                    maxCleared = Math.max(maxCleared, parseInt(lvl));
                }
            });
            
            // Fallback checking progress or accuracy
            if (maxCleared === 0) {
                const currentProg = this.gameState.progress[g.id] || 1;
                if (currentProg > 1) {
                    maxCleared = currentProg - 1;
                } else {
                    const accs = this.gameState.highAccuracies[g.id] || {};
                    Object.keys(accs).forEach(lvl => {
                        if (accs[lvl] > 0) {
                            maxCleared = Math.max(maxCleared, parseInt(lvl));
                        }
                    });
                }
            }

            if (maxCleared > 0 || this.isGamePracticed(g.id)) {
                practicedGamesCount++;
                totalLevelsCleared += maxCleared;
            }
        });
        
        // Progress: average level cleared across all games as a percentage of 50
        const avgLevel = GAME_DEFS.length > 0 ? (totalLevelsCleared / GAME_DEFS.length) : 0;
        const masteryPercentage = Math.round((avgLevel / 50) * 100);

        // Accuracy: average accuracy percentage
        let totalAcc = 0;
        let countAcc = 0;
        GAME_DEFS.forEach(g => {
            const accs = this.gameState.highAccuracies[g.id] || {};
            Object.keys(accs).forEach(lvl => {
                if (accs[lvl] > 0) {
                    totalAcc += accs[lvl];
                    countAcc++;
                }
            });
        });
        const avgAccuracy = countAcc > 0 ? Math.round(totalAcc / countAcc) : 100;
        
        // Render SVG Line Charts from History (Real Data Only)
        const history = this.gameState.sessionHistory || [];
        const totalSessions = this.gameState.totalSessions || 0;

        const svgW = 500;
        const svgH = 150;
        const padLeft = 40;
        const padRight = 20;
        const padTop = 20;
        const padBottom = 30;
        const chartW = svgW - padLeft - padRight;
        const chartH = svgH - padTop - padBottom;

        let cpiChartSvg = "";
        let accChartSvg = "";

        if (history.length === 0) {
            const noDataTemplate = (titleKey, defaultTitle) => {
                const title = window.t ? window.t(titleKey, defaultTitle) : defaultTitle;
                const msg = window.t ? window.t('T166', `Practice exercises to start tracking ${title}`, { title: title }) : `Practice exercises to start tracking ${title}`;
                return `
                <svg viewBox="0 0 ${svgW} ${svgH}" class="db-chart-svg">
                    <!-- Grids -->
                    <line x1="${padLeft}" y1="${padTop}" x2="${svgW - padRight}" y2="${padTop}" stroke="rgba(226, 232, 240, 0.4)" stroke-dasharray="4 4" />
                    <line x1="${padLeft}" y1="${padTop + chartH / 2}" x2="${svgW - padRight}" y2="${padTop + chartH / 2}" stroke="rgba(226, 232, 240, 0.4)" stroke-dasharray="4 4" />
                    <line x1="${padLeft}" y1="${padTop + chartH}" x2="${svgW - padRight}" y2="${padTop + chartH}" stroke="rgba(226, 232, 240, 0.8)" />
                    
                    <!-- Centered Message -->
                    <text x="${padLeft + chartW / 2}" y="${padTop + chartH / 2 + 4}" font-family="'Outfit', sans-serif" font-size="10" font-weight="600" fill="var(--text-muted)" text-anchor="middle">
                        ${msg}
                    </text>
                </svg>
            `;};
            cpiChartSvg = noDataTemplate('T158', "Cognitive Index (CPI)");
            accChartSvg = noDataTemplate('T163', "accuracy progression");
        } else {
            const accPoints = [];
            const cpiPoints = [];
            
            const maxCPI = 1000;

            history.forEach((h, idx) => {
                let x;
                if (history.length === 1) {
                    x = padLeft + chartW / 2;
                } else {
                    x = padLeft + (idx * chartW) / (history.length - 1);
                }
                
                // Accuracy y-coord
                const yAcc = padTop + chartH - (h.accuracy / 100) * chartH;
                accPoints.push({ x, y: yAcc, val: h.accuracy, label: h.session });

                // CPI y-coord
                const yCpi = padTop + chartH - (h.cpi / maxCPI) * chartH;
                cpiPoints.push({ x, y: yCpi, val: h.cpi, label: h.session });
            });

            const buildPath = (pts) => pts.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(" ");
            const buildAreaPath = (pts) => {
                if (pts.length === 0) return "";
                const linePath = buildPath(pts);
                return `${linePath} L ${pts[pts.length - 1].x} ${padTop + chartH} L ${pts[0].x} ${padTop + chartH} Z`;
            };

            const accPathStr = buildPath(accPoints);
            const accAreaStr = buildAreaPath(accPoints);
            const cpiPathStr = buildPath(cpiPoints);
            const cpiAreaStr = buildAreaPath(cpiPoints);

            accChartSvg = `
                <svg viewBox="0 0 ${svgW} ${svgH}" class="db-chart-svg">
                    <!-- Grids -->
                    <line x1="${padLeft}" y1="${padTop}" x2="${svgW - padRight}" y2="${padTop}" stroke="rgba(226, 232, 240, 0.4)" stroke-dasharray="4 4" />
                    <line x1="${padLeft}" y1="${padTop + chartH / 2}" x2="${svgW - padRight}" y2="${padTop + chartH / 2}" stroke="rgba(226, 232, 240, 0.4)" stroke-dasharray="4 4" />
                    <line x1="${padLeft}" y1="${padTop + chartH}" x2="${svgW - padRight}" y2="${padTop + chartH}" stroke="rgba(226, 232, 240, 0.8)" />
                    
                    <!-- Y-Axis Labels -->
                    <text x="${padLeft - 8}" y="${padTop + 3}" font-family="'Outfit', sans-serif" font-size="8" fill="var(--text-muted)" text-anchor="end">100%</text>
                    <text x="${padLeft - 8}" y="${padTop + chartH / 2 + 3}" font-family="'Outfit', sans-serif" font-size="8" fill="var(--text-muted)" text-anchor="end">50%</text>
                    <text x="${padLeft - 8}" y="${padTop + chartH + 3}" font-family="'Outfit', sans-serif" font-size="8" fill="var(--text-muted)" text-anchor="end">0%</text>

                    <!-- Area Gradient Fill -->
                    ${history.length > 1 ? `<path d="${accAreaStr}" fill="url(#accGrad)" class="db-chart-area" />` : ""}

                    <!-- Line Path -->
                    ${history.length > 1 ? `<path d="${accPathStr}" stroke="#0d9488" class="db-chart-line" />` : ""}

                    <!-- Dots -->
                    ${accPoints.map(p => `
                        <circle cx="${p.x}" cy="${p.y}" r="4.5" fill="#0d9488" stroke="#fff" stroke-width="1.5" class="chart-dot">
                            <title>Session: ${p.label}\nAccuracy: ${p.val}%</title>
                        </circle>
                        <text x="${p.x}" y="${padTop + chartH + 15}" font-family="'Outfit', sans-serif" font-weight="700" font-size="8" fill="var(--text-muted)" text-anchor="middle">${p.label}</text>
                    `).join("")}

                    <!-- Gradients Definition -->
                    <defs>
                        <linearGradient id="accGrad" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stop-color="#0d9488" stop-opacity="0.25"/>
                            <stop offset="100%" stop-color="#0d9488" stop-opacity="0.0"/>
                        </linearGradient>
                    </defs>
                </svg>
            `;

            cpiChartSvg = `
                <svg viewBox="0 0 ${svgW} ${svgH}" class="db-chart-svg">
                    <!-- Grids -->
                    <line x1="${padLeft}" y1="${padTop}" x2="${svgW - padRight}" y2="${padTop}" stroke="rgba(226, 232, 240, 0.4)" stroke-dasharray="4 4" />
                    <line x1="${padLeft}" y1="${padTop + chartH / 2}" x2="${svgW - padRight}" y2="${padTop + chartH / 2}" stroke="rgba(226, 232, 240, 0.4)" stroke-dasharray="4 4" />
                    <line x1="${padLeft}" y1="${padTop + chartH}" x2="${svgW - padRight}" y2="${padTop + chartH}" stroke="rgba(226, 232, 240, 0.8)" />
                    
                    <!-- Y-Axis Labels -->
                    <text x="${padLeft - 8}" y="${padTop + 3}" font-family="'Outfit', sans-serif" font-size="8" fill="var(--text-muted)" text-anchor="end">1000 CPI</text>
                    <text x="${padLeft - 8}" y="${padTop + chartH / 2 + 3}" font-family="'Outfit', sans-serif" font-size="8" fill="var(--text-muted)" text-anchor="end">500 CPI</text>
                    <text x="${padLeft - 8}" y="${padTop + chartH + 3}" font-family="'Outfit', sans-serif" font-size="8" fill="var(--text-muted)" text-anchor="end">0 CPI</text>

                    <!-- Area Gradient Fill -->
                    ${history.length > 1 ? `<path d="${cpiAreaStr}" fill="url(#cpiGrad)" class="db-chart-area" />` : ""}

                    <!-- Line Path -->
                    ${history.length > 1 ? `<path d="${cpiPathStr}" stroke="#2563eb" class="db-chart-line" />` : ""}

                    <!-- Dots -->
                    ${cpiPoints.map(p => `
                        <circle cx="${p.x}" cy="${p.y}" r="4.5" fill="#2563eb" stroke="#fff" stroke-width="1.5" class="chart-dot">
                            <title>Session: ${p.label}\nCognitive Index: ${p.val} CPI</title>
                        </circle>
                        <text x="${p.x}" y="${padTop + chartH + 15}" font-family="'Outfit', sans-serif" font-weight="700" font-size="8" fill="var(--text-muted)" text-anchor="middle">${p.label}</text>
                    `).join("")}

                    <!-- Gradients Definition -->
                    <defs>
                        <linearGradient id="cpiGrad" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stop-color="#2563eb" stop-opacity="0.25"/>
                            <stop offset="100%" stop-color="#2563eb" stop-opacity="0.0"/>
                        </linearGradient>
                    </defs>
                </svg>
            `;
        }

        // Define cognitive domains structure including all 16 games with localization
        const domains = [
            {
                name: window.t ? window.t('T167', "Memory & Recall") : "Memory & Recall",
                desc: window.t ? window.t('T168', "Working memory, association, and retrieval speed") : "Working memory, association, and retrieval speed",
                icon: "fa-solid fa-brain",
                color: "domain-memory",
                games: ["memory", "object_recall", "word_association", "turning_tables"]
            },
            {
                name: window.t ? window.t('T169', "Focus & Attention") : "Focus & Attention",
                desc: window.t ? window.t('T170', "Visual search, selection speed, and task switching") : "Visual search, selection speed, and task switching",
                icon: "fa-solid fa-crosshairs",
                color: "domain-focus",
                games: ["tap_object", "task_switching", "sorting", "color_confusion", "quick_switch", "eagle_eye", "quick_count"]
            },
            {
                name: window.t ? window.t('T171', "Motor & Logic") : "Motor & Logic",
                desc: window.t ? window.t('T172', "Spatial tracking, coordination, and deductive logic") : "Spatial tracking, coordination, and deductive logic",
                icon: "fa-solid fa-puzzle-piece",
                color: "domain-motor",
                games: ["trace_letter", "colour_fill", "odd_one_out", "falling_catcher", "turnabout"]
            }
        ];
        
        // Build Domain HTML
        let domainsHtml = "";
        domains.forEach(domain => {
            let gamesInDomainHtml = "";
            
            domain.games.forEach(gameId => {
                const game = GAME_DEFS.find(g => g.id === gameId);
                if (!game) return;
                
                // Get highest level cleared and accuracies
                let highestLevel = 0;
                let highestAccuracy = 0;
                const levels = Object.keys(this.gameState.highAccuracies[game.id] || {});
                levels.forEach(lvl => {
                    const acc = this.gameState.highAccuracies[game.id][lvl] || 0;
                    if (acc > 0) {
                        highestLevel = Math.max(highestLevel, parseInt(lvl));
                        highestAccuracy = Math.max(highestAccuracy, acc);
                    }
                });

                // Fallback for transition
                if (highestLevel === 0) {
                    const scores = Object.keys(this.gameState.highScores[game.id] || {});
                    scores.forEach(lvl => {
                        if (this.gameState.highScores[game.id][lvl] > 0) {
                            highestLevel = Math.max(highestLevel, parseInt(lvl));
                            highestAccuracy = 100;
                        }
                    });
                }
                
                const percent = Math.min(100, Math.round((highestLevel / 50) * 100));
                
                // Determine proficiency badge
                let proficiency = window.t ? window.t('T40', "Not Practiced") : "Not Practiced";
                let proficiencyClass = "badge-muted";
                if (highestLevel > 30) {
                    proficiency = window.t ? window.t('T176', "Expert Trainer") : "Expert Trainer";
                    proficiencyClass = "badge-expert";
                } else if (highestLevel > 15) {
                    proficiency = window.t ? window.t('T175', "Proficient") : "Proficient";
                    proficiencyClass = "badge-proficient";
                } else if (highestLevel > 0) {
                    proficiency = window.t ? window.t('T174', "Explorer") : "Explorer";
                    proficiencyClass = "badge-explorer";
                }
                
                const lvlLabel = window.t ? window.t('T173', `Lvl ${highestLevel || 0} / 50`, { level: highestLevel || 0 }) : `Lvl ${highestLevel || 0} / 50`;
                const bestAccLabel = window.t ? window.t('T177', "Best Accuracy") : "Best Accuracy";
                const practiceBtnText = window.t ? window.t('T178', "Practice") : "Practice";

                gamesInDomainHtml += `
                    <div class="dashboard-game-row">
                        <div class="dash-game-info">
                            <div class="dash-game-icon-circle ${game.theme}">
                                <i class="${game.icon}"></i>
                            </div>
                            <div>
                                <div class="dash-game-name">${game.name}</div>
                                <div class="dash-game-skill">${game.skill}</div>
                            </div>
                        </div>
                        <div class="dash-game-progress-section">
                            <div class="dash-game-progress-meta">
                                <span class="dash-level-label">${lvlLabel}</span>
                                <span class="dash-badge ${proficiencyClass}">${proficiency}</span>
                            </div>
                            <div class="dash-progress-bar">
                                <div class="dash-progress-fill ${game.theme}" style="width: ${percent}%"></div>
                            </div>
                        </div>
                        <div class="dash-game-stats">
                            <span class="dash-stat-label">${bestAccLabel}</span>
                            <span class="dash-stat-val">${highestAccuracy}%</span>
                        </div>
                        <button class="secondary-btn dash-play-btn" data-id="${game.id}">
                            ${practiceBtnText}
                        </button>
                    </div>
                `;
            });
            
            domainsHtml += `
                <div class="dashboard-domain-card glassmorphism">
                    <div class="domain-header ${domain.color}">
                        <div class="domain-header-left">
                            <div class="domain-icon-wrapper">
                                <i class="${domain.icon}"></i>
                            </div>
                            <div>
                                <h3>${domain.name}</h3>
                                <p class="domain-desc">${domain.desc}</p>
                            </div>
                        </div>
                    </div>
                    <div class="domain-games-list">
                        ${gamesInDomainHtml}
                    </div>
                </div>
            `;
        });
        
        const avgAccTitle = window.t ? window.t('T146', "Average Accuracy") : "Average Accuracy";
        const avgAccSub = window.t ? window.t('T147', "Target precision metric") : "Target precision metric";
        const streakTitle = window.t ? window.t('T148', "Daily Training Streak") : "Daily Training Streak";
        const dayUnit = streak !== 1 ? (window.t ? window.t('T150', "Days") : "Days") : (window.t ? window.t('T149', "Day") : "Day");
        const streakSub = window.t ? window.t('T151', "Consistency builds connections") : "Consistency builds connections";
        const exCompletedTitle = window.t ? window.t('T152', "Exercises Completed") : "Exercises Completed";
        const exCompletedSub = window.t ? window.t('T153', "Total active rehab units") : "Total active rehab units";
        const rehabProgTitle = window.t ? window.t('T154', "Rehab Progress") : "Rehab Progress";
        const rehabProgSub = window.t ? window.t('T155', "Overall progression index") : "Overall progression index";
        const cpiTitle = window.t ? window.t('T156', `Cognitive Performance Index (Total Sessions: ${totalSessions})`, { sessions: totalSessions }) : `Cognitive Performance Index (Total Sessions: ${totalSessions})`;
        const accProgTitle = window.t ? window.t('T157', `Accuracy Progression (Total Sessions: ${totalSessions})`, { sessions: totalSessions }) : `Accuracy Progression (Total Sessions: ${totalSessions})`;

        container.innerHTML = `
            <div class="dashboard-grid">
                <!-- Summary Widgets Row (Chips) -->
                <div class="dashboard-widgets-row">
                    <div class="dashboard-widget glassmorphism">
                        <div class="widget-icon-bg bg-blue">
                            <i class="fa-solid fa-bullseye"></i>
                        </div>
                        <div class="widget-content">
                            <span class="widget-label">${avgAccTitle}</span>
                            <span class="widget-val">${avgAccuracy}%</span>
                            <span class="widget-sub">${avgAccSub}</span>
                        </div>
                    </div>
                    <div class="dashboard-widget glassmorphism">
                        <div class="widget-icon-bg bg-orange">
                            <i class="fa-solid fa-fire"></i>
                        </div>
                        <div class="widget-content">
                            <span class="widget-label">${streakTitle}</span>
                            <span class="widget-val">${streak} ${dayUnit}</span>
                            <span class="widget-sub">${streakSub}</span>
                        </div>
                    </div>
                    <div class="dashboard-widget glassmorphism">
                        <div class="widget-icon-bg bg-green">
                            <i class="fa-solid fa-circle-check"></i>
                        </div>
                        <div class="widget-content">
                            <span class="widget-label">${exCompletedTitle}</span>
                            <span class="widget-val">${practicedGamesCount} / ${GAME_DEFS.length}</span>
                            <span class="widget-sub">${exCompletedSub}</span>
                        </div>
                    </div>
                    <div class="dashboard-widget glassmorphism">
                        <div class="widget-icon-bg bg-purple">
                            <i class="fa-solid fa-chart-line"></i>
                        </div>
                        <div class="widget-content">
                            <span class="widget-label">${rehabProgTitle}</span>
                            <span class="widget-val">${masteryPercentage}%</span>
                            <span class="widget-sub">${rehabProgSub}</span>
                        </div>
                    </div>
                </div>

                <!-- Two Line Graphs at the Top -->
                <div class="dashboard-charts-row">
                    <div class="dashboard-chart-card glassmorphism">
                        <div class="chart-header">
                            <div class="chart-title">${cpiTitle}</div>
                            <div class="chart-info-trigger">
                                <i class="fa-solid fa-circle-info"></i>
                                <div class="chart-info-tooltip glassmorphism">
                                    <h4>${window.t ? window.t('T158', "Cognitive Performance Index (CPI)") : "Cognitive Performance Index (CPI)"}</h4>
                                    <p><strong>${window.t ? window.t('T159', "What is it:") : "What is it:"}</strong> ${window.t ? window.t('T160', "A clinical metric (0 - 1000) measuring overall performance across memory, attention, and logic domains.") : "A clinical metric (0 - 1000) measuring overall performance across memory, attention, and logic domains."}</p>
                                    <p><strong>${window.t ? window.t('T161', "How calculated:") : "How calculated:"}</strong> ${window.t ? window.t('T162', "Combines execution accuracy, level difficulty multipliers, and speed bonuses from cleared rounds.") : "Combines execution accuracy, level difficulty multipliers, and speed bonuses from cleared rounds."}</p>
                                </div>
                            </div>
                        </div>
                        ${cpiChartSvg}
                    </div>
                    <div class="dashboard-chart-card glassmorphism">
                        <div class="chart-header">
                            <div class="chart-title">${accProgTitle}</div>
                            <div class="chart-info-trigger">
                                <i class="fa-solid fa-circle-info"></i>
                                <div class="chart-info-tooltip glassmorphism">
                                    <h4>${window.t ? window.t('T163', "Accuracy Progression") : "Accuracy Progression"}</h4>
                                    <p><strong>${window.t ? window.t('T159', "What is it:") : "What is it:"}</strong> ${window.t ? window.t('T164', "Tracks performance precision, correct selections, and mistake margins across your last 7 active sessions.") : "Tracks performance precision, correct selections, and mistake margins across your last 7 active sessions."}</p>
                                    <p><strong>${window.t ? window.t('T161', "How calculated:") : "How calculated:"}</strong> ${window.t ? window.t('T165', "The average accuracy percentage (50% - 100%) recorded across all cleared training units.") : "The average accuracy percentage (50% - 100%) recorded across all cleared training units."}</p>
                                </div>
                            </div>
                        </div>
                        ${accChartSvg}
                    </div>
                </div>
                
                <!-- Domains List Layout -->
                <div class="dashboard-domains-section">
                    ${domainsHtml}
                </div>
            </div>
        `;
        
        // Add event listeners to dash play buttons
        const playBtns = container.querySelectorAll(".dash-play-btn");
        playBtns.forEach(btn => {
            btn.addEventListener("click", () => {
                const id = btn.getAttribute("data-id");
                Sound.playClick();
                this.showInstructions(id);
            });
        });
    }
}

function initApp() {
    if (window.appManagerInstance && window.appManagerInstance.initialized) return;
    const app = new AppManager();
    app.init();
    window.app = app;
}

if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initApp);
} else {
    initApp();
}
