/*
 * BhoomiShakti multi-language switcher.
 * Reads window.BHOOMI_I18N (see js/i18n-data.js) and applies the selected
 * language to every element tagged with data-i18n / data-i18n-placeholder /
 * data-i18n-title. Works standalone (no jQuery dependency) so it keeps
 * working even if jQuery fails to load. Persists the choice in
 * localStorage so it carries across page navigations.
 */
(function () {
    "use strict";

    var STORAGE_KEY = "bhoomi-lang";
    var FALLBACK = "en";
    var LANG_NAMES = {
        en: "English",
        hi: "हिन्दी",
        mr: "मराठी",
        kn: "ಕನ್ನಡ",
        ta: "தமிழ்",
        te: "తెలుగు"
    };

    function getDict(lang) {
        return (window.BHOOMI_I18N && window.BHOOMI_I18N[lang]) || {};
    }

    function translate(key, lang) {
        var dict = getDict(lang);
        if (Object.prototype.hasOwnProperty.call(dict, key)) {
            return dict[key];
        }
        var fallbackDict = getDict(FALLBACK);
        if (Object.prototype.hasOwnProperty.call(fallbackDict, key)) {
            return fallbackDict[key];
        }
        return null;
    }

    function forEach(selector, fn) {
        var nodes = document.querySelectorAll(selector);
        for (var i = 0; i < nodes.length; i++) {
            fn(nodes[i]);
        }
    }

    function applyLanguage(lang) {
        if (!LANG_NAMES[lang]) {
            lang = FALLBACK;
        }

        document.documentElement.setAttribute("lang", lang);

        forEach("[data-i18n]", function (el) {
            var text = translate(el.getAttribute("data-i18n"), lang);
            if (text !== null) {
                el.textContent = text;
            }
        });

        forEach("[data-i18n-placeholder]", function (el) {
            var text = translate(el.getAttribute("data-i18n-placeholder"), lang);
            if (text !== null) {
                el.setAttribute("placeholder", text);
            }
        });

        forEach("[data-i18n-title]", function (el) {
            var text = translate(el.getAttribute("data-i18n-title"), lang);
            if (text !== null) {
                el.setAttribute("title", text);
                if (el.hasAttribute("aria-label")) {
                    el.setAttribute("aria-label", text);
                }
            }
        });

        forEach(".bhoomi-lang-switch [data-lang]", function (el) {
            if (el.getAttribute("data-lang") === lang) {
                el.classList.add("active");
            } else {
                el.classList.remove("active");
            }
        });

        forEach(".bhoomi-lang-label", function (el) {
            el.textContent = LANG_NAMES[lang];
        });

        try {
            localStorage.setItem(STORAGE_KEY, lang);
        } catch (e) {
            /* localStorage unavailable (private mode, etc.) - ignore */
        }

        window.bhoomiCurrentLang = lang;
    }

    function initLanguage() {
        var saved = FALLBACK;
        try {
            saved = localStorage.getItem(STORAGE_KEY) || FALLBACK;
        } catch (e) {
            saved = FALLBACK;
        }
        applyLanguage(saved);
    }

    document.addEventListener("DOMContentLoaded", function () {
        initLanguage();

        forEach(".bhoomi-lang-switch [data-lang]", function (el) {
            el.addEventListener("click", function (e) {
                e.preventDefault();
                e.stopPropagation();
                applyLanguage(el.getAttribute("data-lang"));
            });
        });
    });

    // Exposed in case another script needs to trigger a language switch.
    window.bhoomiApplyLanguage = applyLanguage;
})();
