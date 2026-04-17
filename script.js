/**
 * TS1-TRANSLATER - Moteur de l'application
 * Développé par : tech-stone one
 */

const languages = {
    // --- AFRIQUE ---
    "sw-TZ": "Swahili",
    "yo-NG": "Yoruba (Nigeria)",
    "ig-NG": "Igbo (Nigeria)",
    "ha-NE": "Haoussa",
    "zu-ZA": "Zulu (Afrique du Sud)",
    "xh-ZA": "Xhosa (Afrique du Sud)",
    "ln-CD": "Lingala (Congo)",
    "kg-CD": "Kikongo",
    "wo-SN": "Wolof (Sénégal)",
    "bm-ML": "Bambara (Mali)",
    "mo-BF": "Mooré (Burkina)",
    "fon-BJ": "Fon (Bénin)",
    "am-ET": "Amharique (Éthiopie)",
    "om-ET": "Oromo",
    "ti-ET": "Tigrinya",
    "so-SO": "Somali",
    "rw-RW": "Kinyarwanda",
    "rn-BI": "Kirundi",
    "sn-ZW": "Shona (Zimbabwe)",
    "mg-MG": "Malgache",
    "af-ZA": "Afrikaans",
    "st-LS": "Sotho",
    "tw-GH": "Twi (Ghana)",
    "ak-GH": "Akan",

    // --- EUROPE ---
    "fr-FR": "Français",
    "en-GB": "Anglais",
    "de-DE": "Allemand",
    "es-ES": "Espagnol",
    "it-IT": "Italien",
    "pt-PT": "Portugais",
    "nl-NL": "Néerlandais",
    "ru-RU": "Russe",
    "uk-UA": "Ukrainien",
    "pl-PL": "Polonais",
    "tr-TR": "Turc",
    "el-GR": "Grec",
    "sv-SE": "Suédois",
    "no-NO": "Norvégien",
    "da-DK": "Danois",
    "fi-FI": "Finnois",
    "hu-HU": "Hongrois",
    "cs-CZ": "Tchèque",
    "ro-RO": "Roumain",

    // --- ASIE & MONDE ---
    "ar-SA": "Arabe",
    "zh-CN": "Chinois (Simplifié)",
    "ja-JP": "Japonais",
    "ko-KR": "Coréen",
    "hi-IN": "Hindi",
    "bn-BD": "Bengali",
    "pa-PK": "Pendjabi",
    "vi-VN": "Vietnamien",
    "th-TH": "Thaï",
    "id-ID": "Indonésien",
    "fa-IR": "Persan",
    "he-IL": "Hébreu"
};

document.addEventListener('DOMContentLoaded', () => {
    // --- SÉLECTEURS ---
    const sourceSelect = document.getElementById('sourceLang');
    const targetSelect = document.getElementById('targetLang');
    const sourceText = document.getElementById('sourceText');
    const targetText = document.getElementById('targetText');
    const translateBtn = document.getElementById('translateBtn');
    const clearBtn = document.getElementById('clearText');
    const copyBtn = document.getElementById('copyBtn');
    const favBtn = document.getElementById('favBtn');
    const charCount = document.querySelector('.char-count');

    // --- INITIALISATION ---
    const initLangs = () => {
        // Ajouter l'option auto-détection en premier
        sourceSelect.innerHTML = `<option value="auto">🌐 Détecter la langue</option>`;
        
        // Trier les langues par ordre alphabétique
        const sortedLangs = Object.entries(languages).sort((a, b) => a[1].localeCompare(b[1]));

        sortedLangs.forEach(([code, name]) => {
            const option = `<option value="${code}">${name}</option>`;
            sourceSelect.insertAdjacentHTML('beforeend', option);
            targetSelect.insertAdjacentHTML('beforeend', option);
        });

        // Défauts
        sourceSelect.value = "auto";
        targetSelect.value = "en-GB";
    };

    // --- FONCTION TRADUCTION ---
    const handleTranslate = async () => {
        const text = sourceText.value.trim();
        if (!text) return;

        // Effet visuel de chargement
        translateBtn.disabled = true;
        translateBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Traduction...';

        const from = sourceSelect.value === "auto" ? "" : sourceSelect.value.split('-')[0];
        const to = targetSelect.value.split('-')[0];
        
        const url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=${from}|${to}`;

        try {
            const response = await fetch(url);
            const data = await response.json();
            
            if (data.responseData) {
                const result = data.responseData.translatedText;
                targetText.value = result;
                saveToHistory(text, result);
            } else {
                targetText.value = "Erreur : Limite de l'API atteinte.";
            }
        } catch (error) {
            targetText.value = "Désolé, une erreur réseau est survenue.";
            console.error(error);
        } finally {
            translateBtn.disabled = false;
            translateBtn.innerHTML = '<span>Traduire</span> <i class="fas fa-arrow-right"></i>';
        }
    };

    // --- AUDIO (SYNTHÈSE VOCALE) ---
    const speak = (text, langCode) => {
        if (!text) return;
        const speech = new SpeechSynthesisUtterance(text);
        speech.lang = langCode;
        speech.rate = 0.9; // Vitesse légèrement réduite pour la clarté
        window.speechSynthesis.speak(speech);
    };

    // --- HISTORIQUE & FAVORIS (LOCALSTORAGE) ---
    const saveToHistory = (s, t) => {
        let history = JSON.parse(localStorage.getItem('ts1_history') || '[]');
        // Éviter les doublons consécutifs
        if (history.length > 0 && history[0].s === s) return;
        
        history.unshift({ s, t, date: new Date().toLocaleTimeString() });
        localStorage.setItem('ts1_history', JSON.stringify(history.slice(0, 10)));
        renderLists();
    };

    const toggleFavorite = () => {
        if (!targetText.value) return;
        let favs = JSON.parse(localStorage.getItem('ts1_favs') || '[]');
        favs.push({ s: sourceText.value, t: targetText.value });
        localStorage.setItem('ts1_favs', JSON.stringify(favs));
        alert("Ajouté aux favoris !");
        renderLists();
    };

    const renderLists = () => {
        const hList = document.getElementById('historyList');
        const fList = document.getElementById('favList');
        const history = JSON.parse(localStorage.getItem('ts1_history') || '[]');
        const favs = JSON.parse(localStorage.getItem('ts1_favs') || '[]');

        hList.innerHTML = history.map(item => `<li><strong>${item.s}</strong> <br> <small>${item.t}</small></li>`).join('');
        fList.innerHTML = favs.map(item => `<li>⭐ ${item.t}</li>`).join('');
    };

    // --- GESTION DES ÉVÉNEMENTS ---
    translateBtn.onclick = handleTranslate;

    clearBtn.onclick = () => {
        sourceText.value = "";
        targetText.value = "";
        charCount.innerText = "0 / 5000";
    };

    copyBtn.onclick = () => {
        if (!targetText.value) return;
        navigator.clipboard.writeText(targetText.value);
        copyBtn.innerHTML = '<i class="fas fa-check"></i>';
        setTimeout(() => copyBtn.innerHTML = '<i class="fas fa-copy"></i>', 2000);
    };

    favBtn.onclick = toggleFavorite;

    sourceText.oninput = () => {
        const len = sourceText.value.length;
        charCount.innerText = `${len} / 5000`;
        if (len > 5000) charCount.style.color = "red";
        else charCount.style.color = "var(--text-dim)";
    };

    document.getElementById('speakSource').onclick = () => speak(sourceText.value, sourceSelect.value);
    document.getElementById('speakTarget').onclick = () => speak(targetText.value, targetSelect.value);

    // Modal À Propos
    const modal = document.getElementById("aboutModal");
    document.getElementById("aboutBtn").onclick = () => modal.style.display = "block";
    document.querySelector(".close").onclick = () => modal.style.display = "none";
    window.onclick = (e) => { if (e.target == modal) modal.style.display = "none"; };

    // Initialisation au démarrage
    initLangs();
    renderLists();
});

// Enregistrement du Service Worker (PWA)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('sw.js').catch(err => console.log("SW non enregistré", err));
    });
}