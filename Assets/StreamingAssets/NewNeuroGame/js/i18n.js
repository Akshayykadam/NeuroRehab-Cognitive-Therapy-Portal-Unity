/**
 * NeuroRehab Dynamic Localization (i18n) Engine
 * - Fully modular: Add any language by adding a column in the CSV or an entry in BUILTIN_TRANSLATIONS.
 * - Dynamic RTL support for Arabic, Hebrew, Urdu, Farsi, and other RTL scripts.
 * - Works 100% offline out-of-the-box, with live CSV download & Unity Bridge updates.
 */
(function (window) {
    'use strict';

    // Built-in dictionaries for instant offline loading (dynamically populated from CSV)
    const BUILTIN_TRANSLATIONS = {
        "English": {
                "T1": "Rotate Your Screen",
                "T2": "This therapy application is designed for landscape screens. Please rotate your device to begin.",
                "T3": "Tablet or Desktop Required",
                "T4": "This cognitive rehabilitation portal is designed for clinical use on tablet (iPad/Android Tablet) or desktop screens only. Mobile phone screens are too small to support these exercises.",
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
                "T36": "Your Supportive Mind Gym",
                "T37": "Every single exercise you play helps nourish, build, and strengthen neural connections. Take your time, focus gently, and remember: consistency is your superpower!",
                "T38": "Max Level: L{level}",
                "T39": "Practiced",
                "T40": "Not Practiced",
                "T51": "Objective",
                "T52": "Therapy Difficulty Level",
                "T53": "START EXERCISE",
                "T54": "Close modal",
                "T55": "Decrease level",
                "T56": "Increase level",
                "T57": "Reset exercise history and scores?",
                "T66": "Level {level}",
                "T67": "ACCURACY",
                "T68": "TIME",
                "T69": "CHANCES",
                "T70": "Exercise Title",
                "T71": "Exercise",
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
                "T96": "Trace the Shape",
                "T97": "Motor Control",
                "T98": "Slowly trace pathways and shapes with your pointer. Focuses on motor planning, hand-eye tracking, and precise spatial movement control.",
                "T99": "Colour Fill exercise",
                "T100": "Spatial Logic",
                "T101": "Color connected circles so that no two connected items share the same color. Encourages logical planning, visual inspection, and puzzle sorting.",
                "T102": "Selective Focus",
                "T103": "Visual Attention",
                "T104": "Identify and tap moving shapes that match the active target description (e.g., 'Green Star'). Exercises visual search and selective attention.",
                "T105": "Memory Cards",
                "T106": "Working Memory",
                "T107": "Flip cards to find matching shapes. Levels scale to support associative memory by matching math equations to their solutions.",
                "T108": "Recall Practice",
                "T109": "Delayed Recall",
                "T110": "Study a group of symbols, then spot which new object is added after they shuffle. Supports short-term visual retention and recall speed.",
                "T111": "Spot the Difference",
                "T112": "Visual Logic",
                "T113": "Find the single shape that has a rotational, color-shade, or edge count discrepancy. Exercises fine visual detail comparison.",
                "T114": "Cognitive Flex",
                "T115": "Cognitive Shifting",
                "T116": "Match objects by shifting your focus between Shape, Color, or Number. Supports mental agility and cognitive switching capacity.",
                "T117": "Sorting Practice",
                "T118": "Categorisation",
                "T119": "Sort incoming cards into left and right bins according to categories (Even/Odd, Living/Non-living). Trains categorization and quick sorting.",
                "T120": "Catching Exercise",
                "T121": "Coordination",
                "T122": "Move a slider at the bottom to catch positive green gems while avoiding red obstacles. Promotes hand-eye reaction and spatial forecasting.",
                "T123": "Word Association",
                "T124": "Semantic Memory",
                "T125": "Tap the floating words that belong to the active core topic. Strengthens vocabulary connection speed and semantic recall.",
                "T126": "Color Confusion",
                "T127": "Inhibition",
                "T128": "Tap the correct button based on font color or word meaning. Exercises mental focus, cognitive inhibition, and Stroop processing.",
                "T129": "Quick Switch",
                "T130": "Cognitive Shifting",
                "T131": "Connect numbers and letters in alternating sequence (1-A-2-B-3-C...). Promotes cognitive flexibility, sequencing speed, and executive control.",
                "T132": "Eagle Eye",
                "T133": "Visual Attention",
                "T134": "Quickly locate and select numbers in ascending order (1, 2, 3...). Enhances rapid visual scanning, attention span, and field of view.",
                "T135": "Turnabout",
                "T136": "Mental Rotation",
                "T137": "Identify the correctly rotated version of a shape grid. Strengthens mental rotation capabilities, spatial awareness, and visual reasoning.",
                "T138": "Turning Tables",
                "T139": "Spatial Memory",
                "T140": "Memorize target slots on a round table, track them as the table spins, and identify their new positions. Exercises dynamic spatial tracking and recall.",
                "T141": "Quick Count",
                "T142": "Visual Attention",
                "T143": "Instantly subitize or count blocks of a specific color in a randomized grid against a swift countdown. Strengthens scanning speed and visual quantity estimation.",
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
                "T180": "Trace L shape starting from top-left",
                "T181": "Trace U shape starting from top-left",
                "T182": "Trace A shape starting bottom-left",
                "T183": "Trace S curve starting from top-right",
                "T184": "Trace Infinity Loop starting from center",
                "T185": "Trace this Triangle",
                "T186": "Trace this Square",
                "T187": "Trace this Pentagon",
                "T188": "Trace this Hexagon",
                "T189": "Trace this Heptagon",
                "T190": "Trace this Octagon",
                "T191": "Trace the Heart shape starting from top center",
                "T192": "Trace this 4-Point Sparkle Star",
                "T193": "Trace this 5-Point Star",
                "T194": "Trace this 6-Point Star",
                "T195": "Trace the Crescent Moon",
                "T196": "Trace the Diamond Gem",
                "T197": "Trace this clinical Cross",
                "T198": "Trace this House outline starting from bottom-left",
                "T199": "Trace the letter M starting bottom-left",
                "T200": "Trace the Raindrop outline",
                "T201": "Trace the Bowtie curve",
                "T202": "Trace this Envelope starting from top-left",
                "T203": "Trace the horizontal Sine Wave",
                "T204": "Trace the spiral clockwise outward",
                "T205": "Trace this 3-Petal Rose outline",
                "T206": "Trace this 4-Petal Rose outline",
                "T207": "Trace the fish outline starting from tail",
                "T208": "Trace this right-pointing Arrow",
                "T209": "Trace this upward-pointing Arrow",
                "T210": "Trace the Crown outline starting bottom-left",
                "T211": "Trace this Lightning Bolt",
                "T212": "Trace the Shield outline starting top-left",
                "T213": "Trace the letter W starting top-left",
                "T214": "Trace this 8-point Star outline",
                "T215": "Trace the vertical Wave curve",
                "T216": "Trace the Hourglass outline",
                "T217": "Trace this Cloud shape outline",
                "T218": "Trace the Double Diamond path",
                "T219": "Trace the 3-Leaf Clover outline",
                "T220": "Trace this mirrored Crescent Moon",
                "T221": "Trace the counter-clockwise spiral outward",
                "T222": "Trace this 5-Petal Flower shape",
                "T223": "Trace this Quatrefoil shape",
                "T224": "Trace this S-like Yin Yang border",
                "T225": "Trace this Key outline",
                "T226": "Trace the Bell outline starting from top",
                "T227": "Trace this Octagram Star outline",
                "T228": "Trace this Star outline path",
                "T229": "Trace this Double Infinity Rose outline",
                "T230": "Please start at the green circular target.",
                "T231": "Keep your pointer inside the guide lines.",
                "T232": "Try to trace in one continuous movement.",
                "T233": "START HERE",
                "T234": "Blue",
                "T235": "Teal",
                "T236": "Green",
                "T237": "Yellow",
                "T238": "Orange",
                "T239": "Red",
                "T240": "Purple",
                "T241": "Pink",
                "T242": "Eraser",
                "T243": "Progress: {val}% | Goal: 96%",
                "T244": "Select Paint Color:",
                "T245": "TAP ONLY:",
                "T246": "CIRCLES",
                "T247": "SQUARES",
                "T248": "TRIANGLES",
                "T249": "STARS",
                "T250": "{color} {type}",
                "T251": "MEMORIZE THESE SYMBOLS",
                "T252": "WHICH OBJECT WAS ADDED?",
                "T253": "Round {round}/{max}",
                "T254": "Round {round}/{max} - Select the Odd Item",
                "T255": "Match Criterion",
                "T256": "COLOR",
                "T257": "SHAPE",
                "T258": "NUMBER",
                "T259": "MATCH {rule}",
                "T260": "Even / Odd Numbers",
                "T261": "EVEN",
                "T262": "ODD",
                "T263": "Vowels / Consonants",
                "T264": "VOWEL",
                "T265": "CONSONANT",
                "T266": "Living / Non-Living",
                "T267": "LIVING",
                "T268": "NON-LIVING",
                "T269": "Prime / Composite",
                "T270": "PRIME",
                "T271": "COMPOSITE",
                "T272": "Thermal: Hot / Cold Items",
                "T273": "HOT",
                "T274": "COLD",
                "T275": "[Press Left Arrow]",
                "T276": "[Press Right Arrow]",
                "T277": "{cat} ({current}/{total})",
                "T278": "Core Theme Topic",
                "T279": "DOG",
                "T280": "BARK",
                "T281": "PUPPY",
                "T282": "BONE",
                "T283": "PEN",
                "T284": "CLOCK",
                "T285": "TRAIN",
                "T286": "TREE",
                "T287": "LEAF",
                "T288": "BRANCH",
                "T289": "FOREST",
                "T290": "PHONE",
                "T291": "MILK",
                "T292": "SHOE",
                "T293": "FIRE",
                "T294": "HOT",
                "T295": "FLAME",
                "T296": "SMOKE",
                "T297": "ICE",
                "T298": "SHOWER",
                "T299": "GLASS",
                "T300": "SPACE",
                "T301": "ORBIT",
                "T302": "GRAVITY",
                "T303": "COMET",
                "T304": "BREAD",
                "T305": "TABLE",
                "T306": "CAR",
                "T307": "DESERT",
                "T308": "SAND",
                "T309": "CACTUS",
                "T310": "OASIS",
                "T311": "SNOW",
                "T312": "OCEAN",
                "T313": "METRO",
                "T314": "MUSIC",
                "T315": "RHYTHM",
                "T316": "MELODY",
                "T317": "CHORD",
                "T318": "STEEL",
                "T319": "STONE",
                "T320": "FRUIT",
                "T321": "ANCIENT",
                "T322": "RUINS",
                "T323": "FOSSIL",
                "T324": "DYNASTY",
                "T325": "CYBER",
                "T326": "MODERN",
                "T327": "LASER",
                "T328": "STORM",
                "T329": "THUNDER",
                "T330": "LIGHTNING",
                "T331": "TEMPEST",
                "T332": "CALM",
                "T333": "DESERT",
                "T334": "SUNNY",
                "T335": "KITCHEN",
                "T336": "PANTRY",
                "T337": "UTENSIL",
                "T338": "RECIPE",
                "T339": "ORBIT",
                "T340": "SADDLE",
                "T341": "ANCHOR",
                "T342": "JUSTICE",
                "T343": "COURT",
                "T344": "SCALES",
                "T345": "VERDICT",
                "T346": "RIVER",
                "T347": "CLOUD",
                "T348": "PIANO",
                "T349": "GENIUS",
                "T350": "INTELLECT",
                "T351": "CREATIVE",
                "T352": "TALENT",
                "T353": "DULL",
                "T354": "SLOW",
                "T355": "CLAY",
                "T356": "THEATRE",
                "T357": "DRAMA",
                "T358": "ACTOR",
                "T359": "STAGE",
                "T360": "CAR",
                "T361": "SAND",
                "T362": "RIVER",
                "T363": "TIME",
                "T364": "CHRONOLOGY",
                "T365": "DECADE",
                "T366": "DIMENSION",
                "T367": "FORK",
                "T368": "BRICK",
                "T369": "SHIRT",
                "T370": "ENERGY",
                "T371": "KINETIC",
                "T372": "THERMAL",
                "T373": "ELECTRON",
                "T374": "STONE",
                "T375": "PAPER",
                "T376": "WOOD",
                "T377": "MIND",
                "T378": "SYNAPSE",
                "T379": "THOUGHT",
                "T380": "NEURON",
                "T381": "VALVE",
                "T382": "METAL",
                "T383": "PLASTIC",
                "T384": "IDENTIFY THE WORD MEANING",
                "T385": "TAP THE WORD MEANING",
                "T386": "TAP THE FONT COLOR",
                "T387": "RED",
                "T388": "BLUE",
                "T389": "GREEN",
                "T390": "YELLOW",
                "T391": "WIND: CALM",
                "T392": "WIND: << GENTLE LEFT",
                "T393": "WIND: GENTLE RIGHT >>",
                "T394": "Tap elements in sequence: 1 → A → 2 → B...",
                "T395": "Connect: {target}",
                "T396": "Find and tap in ascending order: {target}",
                "T397": "90° Clockwise",
                "T398": "90° Counter-Clockwise",
                "T399": "180° Rotation",
                "T400": "Rotate: {arrow} {label}",
                "T401": "Select Correct Rotation:",
                "T402": "90° CW",
                "T403": "90° CCW",
                "T404": "180°",
                "T405": "Memorize the {count} Target Dots",
                "T406": "Table spins: {label}",
                "T407": "Find the {count} Rotated Dots!",
                "T408": "PINK BLOCKS",
                "T409": "BLUE BLOCKS",
                "T410": "YELLOW BLOCKS",
                "T411": "Count: {label}",
                "T412": "Time: {time}s"
        },
        "Arabic": {
                "T1": "يرجى تدوير الشاشة",
                "T2": "تم تصميم هذا التطبيق للشاشات العرضية (أفقي). يرجى تدوير جهازك للبدء.",
                "T3": "يلزم جهاز لوحي أو كمبيوتر",
                "T4": "تم تصميم هذه البوابة لإعادة التأهيل المعرفي للاستخدام السريري على الأجهزة اللوحية أو شاشات الكمبيوتر فقط. شاشات الهواتف صغيرة جدًا.",
                "T11": "ويزيو لإعادة التأهيل المعرفي",
                "T12": "المريض",
                "T13": "المعرف: --",
                "T14": "التمارين",
                "T15": "لوحة المتابعة",
                "T16": "تمت ممارسته",
                "T17": "التقدم",
                "T18": "الدقة",
                "T19": "التمارين المنجزة",
                "T20": "التقدم العام",
                "T21": "متوسط الدقة",
                "T22": "إعادة تعيين السجل",
                "T23": "كتم / تشغيل الصوت",
                "T24": "خروج",
                "T25": "الخروج إلى القائمة الرئيسية",
                "T26": "العودة إلى صالة التمارين",
                "T27": "المريض: {name}",
                "T28": "المعرف: {id}",
                "T36": "صالتك الذهنية الداعمة",
                "T37": "كل تمرين تمارسه يساعد في تقوية وبناء الروابط العصبية. خذ وقتك وركز بهدوء: الاستمرارية هي قوتك الحقيقية!",
                "T38": "أعلى مستوى: م{level}",
                "T39": "تمت ممارسته",
                "T40": "لم يمارس بعد",
                "T51": "الهدف العلاجي",
                "T52": "مستوى صعوبة التمرين",
                "T53": "ابدأ التمرين",
                "T54": "إغلاق النافذة",
                "T55": "تقليل المستوى",
                "T56": "زيادة المستوى",
                "T57": "هل تريد إعادة تعيين سجل التمارين والنتائج؟",
                "T66": "المستوى {level}",
                "T67": "الدقة",
                "T68": "الوقت",
                "T69": "المحاولات",
                "T70": "عنوان التمرين",
                "T71": "التمرين",
                "T76": "اكتمل التمرين",
                "T77": "عمل رائع! لقد أكملت هذا المستوى بنجاح.",
                "T78": "عمل رائع ومميز!",
                "T79": "تهانينا على إكمال المستوى {level}! كل تمرين تقوم به يغذي ويقوي عقلك. أنت تبلي بلاءً رائعاً!",
                "T80": "محاولة رائعة وممارسة جيدة!",
                "T81": "كل دقيقة تقضيها في الممارسة هي خطوة رائعة للأمام لعقلك. كن فخوراً بالتزامك اليوم!",
                "T82": "دقة الجلسة",
                "T83": "التقدم",
                "T84": "تم اجتياز المستوى!",
                "T85": "اكتملت الممارسة",
                "T86": "القائمة",
                "T87": "إعادة التمرين",
                "T88": "المستوى التالي",
                "T89": "المستوى التالي ({level})",
                "T96": "تتبع المسار",
                "T97": "التحكم الحركي",
                "T98": "تتبع المسارات والأشكال ببطء باستخدام المؤشر. يركز على التخطيط الحركي والتنسيق الدقيق بين اليد والعين.",
                "T99": "تلوين المساحات",
                "T100": "المنطق المكاني",
                "T101": "لوّن الدوائر المتصلة بحيث لا تتشارك أي دائرتين متصلتين بنفس اللون. يحفز التخطيط المنطقي والفرز البصري.",
                "T102": "التركيز الانتقائي",
                "T103": "الانتباه البصري",
                "T104": "حدد واضغط على الأشكال المتحركة التي تطابق الوصف المطلوب (مثل 'نجمة خضراء'). يمرن البحث البصري والانتباه الانتقائي.",
                "T105": "بطاقات الذاكرة",
                "T106": "الذاكرة العاملة",
                "T107": "اقلب البطاقات للعثور على الأشكال المتطابقة، وتتدرج المستويات لمطابقة المعادلات الرياضية بحلولها.",
                "T108": "ممارسة الاسترجاع",
                "T109": "الاسترجاع المؤجل",
                "T110": "احفظ مجموعة من الرموز، ثم حدد الرمز الجديد الذي تمت إضافته بعد إعادة الترتيب. يدعم الذاكرة البصرية قصيرة المدى.",
                "T111": "اكتشف العنصر المختلف",
                "T112": "المنطق البصري",
                "T113": "اعثر على الشكل الفردي الذي يحتوي على اختلاف في التدوير أو تدرج اللون أو عدد الحواف.",
                "T114": "المرونة المعرفية",
                "T115": "التحول الإدراكي",
                "T116": "طابق العناصر بالتبديل السريع لتركيزك بين الشكل أو اللون أو الرقم. يدعم خفة الحركة العقلية والقدرة على التبديل الإدراكي.",
                "T117": "ممارسة التصنيف",
                "T118": "التصنيف والفرز",
                "T119": "صنّف البطاقات الواردة إلى الصناديق المناسبة حسب الفئات (زوجي/فردي، كائن حي/جماد). يدرب على سرعة الفرز والتصنيف.",
                "T120": "تمرين الالتقاط",
                "T121": "التناسق الحركي",
                "T122": "حرّك الشريط في الأسفل لالتقاط الجواهر الخضراء مع تجنب العقبات الحمراء. يعزز رد الفعل الحركي والتوقع المكاني.",
                "T123": "ربط الكلمات",
                "T124": "الذاكرة الدلالية",
                "T125": "اضغط على الكلمات العائمة التي تنتمي إلى موضوع الفكرة الرئيسي. يقوي سرعة الربط المعجمي والاسترجاع الدلالي.",
                "T126": "تشويش الألوان",
                "T127": "كبح الاستجابة (ستروب)",
                "T128": "اضغط على الزر الصحيح بناءً على لون الخط أو معنى الكلمة. يمرن التركيز الذهني وكبح الاستجابة التلقائية.",
                "T129": "التبديل السريع",
                "T130": "التحول الإدراكي",
                "T131": "اربط الأرقام والحروف بالتسلسل المتناوب (١-أ-٢-ب-٣-ج...). يعزز المرونة المعرفية وسرعة التسلسل والتحكم التنفيذي.",
                "T132": "عين الصقر",
                "T133": "الانتباه البصري",
                "T134": "حدد واختر الأرقام بسرعة بترتيب تصاعدي (١، ٢، ٣...). يعزز المسح البصري السريع ومدى الانتباه ومجال الرؤية.",
                "T135": "التدوير المكاني",
                "T136": "التدوير الذهني",
                "T137": "حدد النسخة المدورة بشكل صحيح لشبكة الأشكال. يقوي قدرات التدوير الذهني والوعي المكاني والتفكير البصري.",
                "T138": "الطاولة الدوارة",
                "T139": "الذاكرة المكانية",
                "T140": "احفظ مواقع الأهداف على طاولة مستديرة، وتتبعها أثناء دوران الطاولة، ثم حدد مواقعها الجديدة.",
                "T141": "العد السريع",
                "T142": "الانتباه البصري",
                "T143": "احسب أو قدر عدد المربعات ذات اللون المحدد في شبكة عشوائية في وقت سريع. يقوي سرعة المسح وتقدير الكميات.",
                "T146": "متوسط الدقة",
                "T147": "مقياس دقة الإصابة للأهداف",
                "T148": "أيام التمرين المتتالية",
                "T149": "يوم",
                "T150": "أيام",
                "T151": "الاستمرارية تبني روابط عصبية قوية",
                "T152": "التمارين المنجزة",
                "T153": "إجمالي وحدات إعادة التأهيل",
                "T154": "تقدم إعادة التأهيل",
                "T155": "مؤشر التقدم الشامل",
                "T156": "مؤشر الأداء المعرفي (إجمالي الجلسات: {sessions})",
                "T157": "تطور الدقة (إجمالي الجلسات: {sessions})",
                "T158": "مؤشر الأداء المعرفي (CPI)",
                "T159": "ما هو:",
                "T160": "مقياس سريري (٠ - ١٠٠٠) يقيس الأداء العام عبر مجالات الذاكرة والانتباه والمنطق.",
                "T161": "كيف يُحسب:",
                "T162": "يجمع بين دقة التنفيذ ومضاعفات صعوبة المستوى ومكافآت السرعة من الجولات المنجزة.",
                "T163": "تطور الدقة",
                "T164": "يتتبع دقة الأداء والاختيارات الصحيحة وهوامش الأخطاء عبر آخر ٧ جلسات تدريبية نشطة.",
                "T165": "متوسط نسبة الدقة المئوية (٥٠٪ - ١٠٠٪) المسجلة عبر جميع وحدات التدريب المكتملة.",
                "T166": "مارس التمارين لبدء تتبع {title}",
                "T167": "الذاكرة والاسترجاع",
                "T168": "الذاكرة العاملة والربط وسرعة الاسترجاع",
                "T169": "التركيز والانتباه",
                "T170": "البحث البصري وسرعة الاختيار وتبديل المهام",
                "T171": "الحركة والمنطق",
                "T172": "التتبع المكاني والتناسق والمنطق الاستنتاجي",
                "T173": "مستوى {level} / 50",
                "T174": "مستكشف",
                "T175": "متمكن",
                "T176": "مدرب خبير",
                "T177": "أفضل دقة",
                "T178": "تمرين",
                "T179": "حدث خطأ في تحميل وحدة التمرين [{id}]. يرجى مراجعة المسؤول.",
                "T180": "تتبع شكل L بدءاً من أعلى اليسار",
                "T181": "تتبع شكل U بدءاً من أعلى اليسار",
                "T182": "تتبع شكل A بدءاً من أسفل اليسار",
                "T183": "تتبع منحنى S بدءاً من أعلى اليمين",
                "T184": "تتبع رمز اللانهاية بدءاً من المركز",
                "T185": "تتبع هذا المثلث",
                "T186": "تتبع هذا المربع",
                "T187": "تتبع هذا الشكل الخماسي",
                "T188": "تتبع هذا الشكل السداسي",
                "T189": "تتبع هذا الشكل السباعي",
                "T190": "تتبع هذا الشكل الثماني",
                "T191": "تتبع شكل القلب بدءاً من أعلى الوسط",
                "T192": "تتبع هذه النجمة الرباعية",
                "T193": "تتبع هذه النجمة الخماسية",
                "T194": "تتبع هذه النجمة السداسية",
                "T195": "تتبع شكل الهلال",
                "T196": "تتبع شكل الجوهرة الماسية",
                "T197": "تتبع شكل الصليب السريري",
                "T198": "تتبع مخطط المنزل بدءاً من أسفل اليسار",
                "T199": "تتبع حرف M بدءاً من أسفل اليسار",
                "T200": "تتبع شكل قطرة المطر",
                "T201": "تتبع شكل ربطة القوس",
                "T202": "تتبع شكل الظرف بدءاً من أعلى اليسار",
                "T203": "تتبع الموجة الأفقية",
                "T204": "تتبع الحلزون باتجاه عقارب الساعة للخارج",
                "T205": "تتبع بتلات الوردة الثلاثية",
                "T206": "تتبع بتلات الوردة الرباعية",
                "T207": "تتبع شكل السمكة بدءاً من الذيل",
                "T208": "تتبع السهم المتجه لليمين",
                "T209": "تتبع السهم المتجه للأعلى",
                "T210": "تتبع شكل التاج بدءاً من أسفل اليسار",
                "T211": "تتبع شكل وميض البرق",
                "T212": "تتبع شكل الدرع بدءاً من أعلى اليسار",
                "T213": "تتبع حرف W بدءاً من أعلى اليسار",
                "T214": "تتبع النجمة ثمانية الأطراف",
                "T215": "تتبع الموجة العمودية",
                "T216": "تتبع شكل الساعة الرملية",
                "T217": "تتبع شكل السحابة",
                "T218": "تتبع مسار الماسة المزدوجة",
                "T219": "تتبع نبات البرسيم ثلاثي الأوراق",
                "T220": "تتبع الهلال المعكوس",
                "T221": "تتبع الحلزون عكس عقارب الساعة للخارج",
                "T222": "تتبع الزهرة خماسية البتلات",
                "T223": "تتبع الشكل رباعي الفصوص",
                "T224": "تتبع الحدود المنحنية",
                "T225": "تتبع شكل المفتاح",
                "T226": "تتبع شكل الجرس بدءاً من الأعلى",
                "T227": "تتبع النجمة الثمانية النجمية",
                "T228": "تتبع مسار النجمة",
                "T229": "تتبع وردة اللانهاية المزدوجة",
                "T230": "يرجى البدء من النقطة الخضراء الدائرية.",
                "T231": "حافظ على مؤشرك داخل خطوط التوجيه.",
                "T232": "حاول التتبع بحركة واحدة مستمرة.",
                "T233": "ابدأ من هنا",
                "T234": "أزرق",
                "T235": "تركواز",
                "T236": "أخضر",
                "T237": "أصفر",
                "T238": "برتقالي",
                "T239": "أحمر",
                "T240": "بنفسجي",
                "T241": "وردي",
                "T242": "ممحاة",
                "T243": "التقدم: {val}% | الهدف: 96%",
                "T244": "اختر لون الطلاء:",
                "T245": "اضغط فقط على:",
                "T246": "الدوائر",
                "T247": "المربعات",
                "T248": "المثلثات",
                "T249": "النجوم",
                "T250": "{type} {color}",
                "T251": "احفظ هذه الرموز جيداً",
                "T252": "ما هو العنصر الجديد الذي تمت إضافته؟",
                "T253": "الجولة {round}/{max}",
                "T254": "الجولة {round}/{max} - اختر العنصر المختلف",
                "T255": "معيار المطابقة",
                "T256": "اللون",
                "T257": "الشكل",
                "T258": "العدد",
                "T259": "طابق {rule}",
                "T260": "الأرقام الزوجية / الفردية",
                "T261": "زوجي",
                "T262": "فردي",
                "T263": "حروف العلة / الحروف الساكنة",
                "T264": "حرف علة",
                "T265": "حرف ساكن",
                "T266": "كائن حي / جماد",
                "T267": "كائن حي",
                "T268": "جماد",
                "T269": "أعداد أولية / غير أولية",
                "T270": "أولي",
                "T271": "غير أولي",
                "T272": "عناصر ساخنة / باردة",
                "T273": "ساخن",
                "T274": "بارد",
                "T275": "[اضغط السهم الأيسر]",
                "T276": "[اضغط السهم الأيمن]",
                "T277": "{cat} ({current}/{total})",
                "T278": "الموضوع الرئيسي",
                "T279": "كلب",
                "T280": "نباح",
                "T281": "جرو",
                "T282": "عظم",
                "T283": "قلم",
                "T284": "ساعة",
                "T285": "قطار",
                "T286": "شجرة",
                "T287": "ورقة",
                "T288": "غصن",
                "T289": "غابة",
                "T290": "هاتف",
                "T291": "حليب",
                "T292": "حذاء",
                "T293": "نار",
                "T294": "حار",
                "T295": "لهب",
                "T296": "دخان",
                "T297": "ثلج",
                "T298": "دش",
                "T299": "زجاج",
                "T300": "فضاء",
                "T301": "مدار",
                "T302": "جاذبية",
                "T303": "مذنب",
                "T304": "خبز",
                "T305": "طاولة",
                "T306": "سيارة",
                "T307": "صحراء",
                "T308": "رمل",
                "T309": "صبار",
                "T310": "واحة",
                "T311": "جليد",
                "T312": "محيط",
                "T313": "مترو",
                "T314": "موسيقى",
                "T315": "إيقاع",
                "T316": "لحن",
                "T317": "وتر",
                "T318": "فولاذ",
                "T319": "حجر",
                "T320": "فاكهة",
                "T321": "قديم",
                "T322": "آثار",
                "T323": "أحفورة",
                "T324": "سلالة",
                "T325": "إلكتروني",
                "T326": "حديث",
                "T327": "ليزر",
                "T328": "عاصفة",
                "T329": "رعد",
                "T330": "برق",
                "T331": "إعصار",
                "T332": "هدوء",
                "T333": "صحراء",
                "T334": "مشمس",
                "T335": "مطبخ",
                "T336": "مؤن",
                "T337": "أداة",
                "T338": "وصفة",
                "T339": "مدار",
                "T340": "سرج",
                "T341": "مرساة",
                "T342": "عدالة",
                "T343": "محكمة",
                "T344": "ميزان",
                "T345": "حكم",
                "T346": "نهر",
                "T347": "سحابة",
                "T348": "بيانو",
                "T349": "عبقري",
                "T350": "ذكاء",
                "T351": "مبدع",
                "T352": "موهبة",
                "T353": "باهت",
                "T354": "بطيء",
                "T355": "صلصال",
                "T356": "مسرح",
                "T357": "دراما",
                "T358": "ممثل",
                "T359": "خشبة",
                "T360": "سيارة",
                "T361": "رمل",
                "T362": "نهر",
                "T363": "وقت",
                "T364": "تسلسل زمني",
                "T365": "عقد",
                "T366": "بُعد",
                "T367": "شوكة",
                "T368": "طوب",
                "T369": "قميص",
                "T370": "طاقة",
                "T371": "حركي",
                "T372": "حراري",
                "T373": "إلكترون",
                "T374": "حجر",
                "T375": "ورق",
                "T376": "خشب",
                "T377": "عقل",
                "T378": "تشابك عصبي",
                "T379": "فكرة",
                "T380": "عصبون",
                "T381": "صمام",
                "T382": "معدن",
                "T383": "بلاستيك",
                "T384": "حدد معنى الكلمة",
                "T385": "اضغط على معنى الكلمة",
                "T386": "اضغط على لون الخط",
                "T387": "أحمر",
                "T388": "أزرق",
                "T389": "أخضر",
                "T390": "أصفر",
                "T391": "الرياح: هادئة",
                "T392": "الرياح: << خفيفة يساراً",
                "T393": "الرياح: خفيفة يميناً >>",
                "T394": "المس العناصر بالتسلسل: 1 ← A ← 2 ← B...",
                "T395": "المس: {target}",
                "T396": "ابحث والمس بترتيب تصاعدي: {target}",
                "T397": "90° مع عقارب الساعة",
                "T398": "90° عكس عقارب الساعة",
                "T399": "تدوير 180°",
                "T400": "دوّر: {arrow} {label}",
                "T401": "اختر التدوير الصحيح:",
                "T402": "90° يمين",
                "T403": "90° يسار",
                "T404": "180°",
                "T405": "احفظ مواقع {count} نقاط مستهدفة",
                "T406": "دوران الطاولة: {label}",
                "T407": "ابحث عن الـ {count} نقاط المدورة!",
                "T408": "المربعات الوردية",
                "T409": "المربعات الزرقاء",
                "T410": "المربعات الصفراء",
                "T411": "العدد: {label}",
                "T412": "الوقت: {time} ث"
        }
};

    // Recognized Right-to-Left (RTL) language identifiers
    const RTL_LANGUAGES = ['arabic', 'ar', 'hebrew', 'he', 'urdu', 'ur', 'farsi', 'persian', 'fa', 'pashto', 'ps', 'yiddish', 'yi', 'sindhi', 'sd', 'uyghur', 'ug'];

    function parseCSV(text) {
        if (!text || typeof text !== 'string') return [];
        const rows = [];
        let currentRow = [];
        let currentField = '';
        let inQuotes = false;

        for (let i = 0; i < text.length; i++) {
            const char = text[i];
            const nextChar = text[i + 1];

            if (char === '"') {
                if (inQuotes && nextChar === '"') {
                    currentField += '"';
                    i++;
                } else {
                    inQuotes = !inQuotes;
                }
            } else if (char === ',' && !inQuotes) {
                currentRow.push(currentField.trim());
                currentField = '';
            } else if ((char === '\r' || char === '\n') && !inQuotes) {
                if (char === '\r' && nextChar === '\n') i++;
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
            // Load all available languages dynamically
            this.translations = {};
            Object.keys(BUILTIN_TRANSLATIONS).forEach(lang => {
                this.translations[lang] = Object.assign({}, BUILTIN_TRANSLATIONS[lang]);
            });

            this.availableLanguages = Object.keys(this.translations);

            // Read language passed via URL query parameter ?lang=...
            let selectedLang = '';
            if (typeof window !== 'undefined' && window.location && window.location.search) {
                const urlParams = new URLSearchParams(window.location.search);
                selectedLang = urlParams.get('lang') || urlParams.get('language') || '';
            }

            // If no URL parameter, use the first available language
            this.currentLanguage = selectedLang || (this.availableLanguages.length > 0 ? this.availableLanguages[0] : '');

            this.listeners = [];
            this.initialized = false;

            if (typeof document !== 'undefined') {
                this.applyLanguageSettings();
            }
        }

        init() {
            if (this.initialized) return;
            this.initialized = true;

            // Check URL query parameter ?lang=...
            if (typeof window !== 'undefined' && window.location && window.location.search) {
                const urlParams = new URLSearchParams(window.location.search);
                const queryLang = urlParams.get('lang') || urlParams.get('language');
                if (queryLang) {
                    this.currentLanguage = queryLang;
                }
            }

            this.applyLanguageSettings();
            this.applyTranslations();

            // Attempt to load external / updated CSV asynchronously (non-blocking)
            this.loadCSVFromUrl('Cognitive games localization CSV.csv')
                .catch(() => {
                    return this.loadCSVFromUrl('./Cognitive games localization CSV.csv');
                })
                .catch(() => {})
                .finally(() => {
                    this.applyLanguageSettings();
                    this.applyTranslations();
                });
        }

        /**
         * Dynamically ingest any CSV string (from Google Sheets or local storage).
         * Every new column header automatically registers as a new language.
         */
        loadCSV(csvString) {
            if (!csvString || typeof csvString !== 'string') return;
            const rows = parseCSV(csvString);
            if (rows.length < 2) return;

            const header = rows[0];
            const keyColIndex = header.findIndex(h => h.toLowerCase() === 'key');
            if (keyColIndex === -1) return;

            // Register every column dynamically
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

            // Populate translations for each key
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

            console.log('[i18n] Languages available:', this.availableLanguages, 'Active language:', this.currentLanguage);
            this.applyLanguageSettings();
            this.applyTranslations();
            this.notifyListeners();
        }

        loadCSVFromUrl(url) {
            return fetch(url)
                .then(response => {
                    if (!response.ok) throw new Error(`HTTP error ${response.status}`);
                    return response.text();
                })
                .then(csvText => {
                    this.loadCSV(csvText);
                });
        }

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

        applyLanguageSettings() {
            if (typeof document === 'undefined' || !document.documentElement) return;

            const langLower = (this.currentLanguage || '').toLowerCase().trim();
            const isRTL = RTL_LANGUAGES.includes(langLower);
            
            document.documentElement.dir = isRTL ? 'rtl' : 'ltr';
            document.documentElement.lang = isRTL ? (langLower.slice(0, 2) || 'ar') : (langLower.slice(0, 2) || 'en');

            if (document.body) {
                if (isRTL) {
                    document.body.classList.add('rtl-mode');
                } else {
                    document.body.classList.remove('rtl-mode');
                }
            }
        }

        get(key, fallback = '', params = null) {
            if (!key) return fallback || '';

            let text = null;
            // 1. Try active language
            if (this.translations[this.currentLanguage] && this.translations[this.currentLanguage][key]) {
                text = this.translations[this.currentLanguage][key];
            }
            
            // 2. Try English or any other language as fallback
            if (!text) {
                for (let i = 0; i < this.availableLanguages.length; i++) {
                    const l = this.availableLanguages[i];
                    if (this.translations[l] && this.translations[l][key]) {
                        text = this.translations[l][key];
                        break;
                    }
                }
            }

            // 3. Fallback to passed fallback string or key itself
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

        applyTranslations(rootElement = (typeof document !== 'undefined' ? document : null)) {
            if (!rootElement) return;

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

            const titleEls = rootElement.querySelectorAll('[data-i18n-title]');
            titleEls.forEach(el => {
                const key = el.getAttribute('data-i18n-title');
                if (key) el.title = this.get(key);
            });

            const ariaEls = rootElement.querySelectorAll('[data-i18n-aria]');
            ariaEls.forEach(el => {
                const key = el.getAttribute('data-i18n-aria');
                if (key) el.setAttribute('aria-label', this.get(key));
            });

            const placeholderEls = rootElement.querySelectorAll('[data-i18n-placeholder]');
            placeholderEls.forEach(el => {
                const key = el.getAttribute('data-i18n-placeholder');
                if (key) el.placeholder = this.get(key);
            });
        }

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

    const i18n = new I18nManager();
    window.i18n = i18n;
    window.t = (key, fallback, params) => i18n.get(key, fallback, params);
    window.getText = (key, fallback, params) => i18n.get(key, fallback, params);

    if (typeof document !== 'undefined') {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => i18n.init());
        } else {
            i18n.init();
        }
    }

})(window);
