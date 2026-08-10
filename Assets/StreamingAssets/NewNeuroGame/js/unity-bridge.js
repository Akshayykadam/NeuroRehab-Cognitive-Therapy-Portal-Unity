/**
 * UnityBridge
 * Handles communication between the Web application and a hosting Unity 3D Scene / WebView.
 */
const UnityBridge = {
    // Check if we are running in Unity
    isUnity: function() {
        const urlParams = new URLSearchParams(window.location.search);
        return urlParams.get('unity') === 'true' || 
               !!window.vuplex || 
               !!window.Unity || 
               !!window.uniwebview ||
               (window.webkit && window.webkit.messageHandlers && window.webkit.messageHandlers.unityBridge) ||
               (window.parent && window.parent !== window && urlParams.get('iframe_unity') === 'true');
    },

    // Initialize integration
    init: function() {
        if (this.isUnity()) {
            document.body.classList.add('unity-mode');
            console.log("Unity Mode Enabled: Bypassing mobile/orientation overlays & establishing bridges.");
            
            // Listen for messages from Unity if needed
            if (window.vuplex) {
                window.vuplex.addEventListener('message', this.handleUnityMessage);
            } else {
                window.addEventListener('vuplexready', () => {
                    if (window.vuplex) {
                        window.vuplex.addEventListener('message', this.handleUnityMessage);
                    }
                });
            }
            window.addEventListener('message', this.handleWindowMessage);

            // Send initial registration event
            this.sendEvent("portal_loaded", {
                platform: "UnityWebView",
                userAgent: navigator.userAgent
            });
        }
    },

    // Send an event message to Unity
    sendEvent: function(action, data = {}) {
        if (!this.isUnity()) return;

        const payload = {
            action: action,
            timestamp: Date.now(),
            ...data
        };

        const jsonString = JSON.stringify(payload);
        console.log("Sending event to Unity:", action, payload);

        // Build query parameters for UniWebView URL scheme
        const queryParams = new URLSearchParams();
        queryParams.set("action", action);
        Object.keys(data).forEach(key => {
            if (data[key] !== null && data[key] !== undefined) {
                queryParams.set(key, typeof data[key] === 'object' ? JSON.stringify(data[key]) : String(data[key]));
            }
        });

        const schemeUrl = "uniwebview://" + action + "?" + queryParams.toString();

        // 1. Vuplex 3D WebView
        if (window.vuplex) {
            window.vuplex.postMessage(payload);
        }
        
        // 2. UniWebView (using schemeUrl so UniWebView parses message.Path & message.Args)
        if (window.Unity && typeof window.Unity.call === 'function') {
            window.Unity.call(schemeUrl);
        }

        // 3. Unity WebGL (using SendMessage to a target object)
        if (window.unityInstance && typeof window.unityInstance.SendMessage === 'function') {
            window.unityInstance.SendMessage('UnityBridgeReceiver', 'OnWebEvent', jsonString);
        }

        // 4. Parent window postMessage (for iframe/WebGL embedding scenarios)
        if (window.parent && window.parent !== window) {
            window.parent.postMessage({ type: 'unity-bridge', ...payload }, '*');
        }

        // 5. Native iOS WKWebView (postMessage to WKScriptMessageHandler)
        if (window.webkit && window.webkit.messageHandlers && window.webkit.messageHandlers.unityBridge) {
            window.webkit.messageHandlers.unityBridge.postMessage(jsonString);
        }

        // 6. Direct UniWebView navigation scheme fallback
        try {
            window.location.href = schemeUrl;
        } catch(e) {}
    },

    // Handle messages received FROM Unity
    handleUnityMessage: function(event) {
        let message = event.data;
        if (typeof message === 'string') {
            try { message = JSON.parse(message); } catch(e) {}
        }
        console.log("Received message from Unity:", message);
        UnityBridge.dispatchEvent(message);
    },

    handleWindowMessage: function(event) {
        if (event.data && event.data.type === 'unity-control') {
            console.log("Received control message from window parent:", event.data);
            UnityBridge.dispatchEvent(event.data);
        }
    },

    // Dispatch incoming Unity message to AppManager
    dispatchEvent: function(message) {
        if (!message || !message.action) return;
        
        const app = window.appManagerInstance;
        if (!app) {
            console.warn("UnityBridge: AppManager instance is not initialized yet.");
            return;
        }

        console.log("UnityBridge: Dispatching command:", message.action, message);

        switch (message.action) {
            case "reset_progress":
                localStorage.removeItem(app.stateKey);
                app.gameState = { xp: 0, progress: {}, highScores: {} };
                app.loadState();
                app.renderLobby();
                app.renderSessionCard();
                app.renderDashboard();
                app.updatePlayerHUD();
                if (document.getElementById("tab-exercises")) {
                    document.getElementById("tab-exercises").click();
                }
                break;
            case "start_game":
                if (message.gameId) {
                    app.closeModal("instructions-modal");
                    app.closeModal("result-modal");
                    app.setupGame(message.gameId, message.level || 1);
                }
                break;
            case "toggle_sound":
                Sound.toggleMute();
                app.updateSoundIcon();
                app.saveState();
                break;
            case "get_stats":
                this.sendEvent("stats_report", {
                    xp: app.gameState.xp,
                    progress: app.gameState.progress,
                    highScores: app.gameState.highScores
                });
                break;
        }
    }
};

// Export to window
window.UnityBridge = UnityBridge;
