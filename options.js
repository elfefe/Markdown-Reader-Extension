// Valeurs par défaut
const defaultSettings = {
  fontFamily: 'system',
  fontSize: 16,
  lineHeight: 1.6,
  maxWidth: 900,
  textColor: '#333333',
  linkColor: '#0366d6',
  padding: 40
};

// Charger les paramètres sauvegardés
function loadSettings() {
  function applySettings(settings) {
    // Famille de police
    document.getElementById('font-family').value = settings.fontFamily || defaultSettings.fontFamily;
    
    // Taille de police
    document.getElementById('font-size').value = settings.fontSize || defaultSettings.fontSize;
    document.getElementById('font-size-value').textContent = settings.fontSize || defaultSettings.fontSize;
    
    // Hauteur de ligne
    document.getElementById('line-height').value = settings.lineHeight || defaultSettings.lineHeight;
    document.getElementById('line-height-value').textContent = settings.lineHeight || defaultSettings.lineHeight;
    
    // Largeur maximale
    document.getElementById('max-width').value = settings.maxWidth || defaultSettings.maxWidth;
    document.getElementById('max-width-value').textContent = settings.maxWidth || defaultSettings.maxWidth;
    
    // Couleur du texte
    document.getElementById('text-color').value = settings.textColor || defaultSettings.textColor;
    document.getElementById('text-color-hex').value = settings.textColor || defaultSettings.textColor;
    
    // Couleur des liens
    document.getElementById('link-color').value = settings.linkColor || defaultSettings.linkColor;
    document.getElementById('link-color-hex').value = settings.linkColor || defaultSettings.linkColor;
    
    // Padding
    document.getElementById('padding').value = settings.padding || defaultSettings.padding;
    document.getElementById('padding-value').textContent = settings.padding || defaultSettings.padding;
  }

  if (typeof chrome !== 'undefined' && chrome.storage && chrome.storage.sync) {
    chrome.storage.sync.get(defaultSettings, (settings) => {
      applySettings(settings);
    });
  } else {
    // Fallback vers localStorage
    const settings = { ...defaultSettings };
    Object.keys(defaultSettings).forEach(key => {
      const saved = localStorage.getItem(`md-setting-${key}`);
      if (saved !== null) {
        if (typeof defaultSettings[key] === 'number') {
          settings[key] = parseFloat(saved);
        } else {
          settings[key] = saved;
        }
      }
    });
    applySettings(settings);
  }
}

// Sauvegarder les paramètres
function saveSettings() {
  const settings = {
    fontFamily: document.getElementById('font-family').value,
    fontSize: parseInt(document.getElementById('font-size').value),
    lineHeight: parseFloat(document.getElementById('line-height').value),
    maxWidth: parseInt(document.getElementById('max-width').value),
    textColor: document.getElementById('text-color').value,
    linkColor: document.getElementById('link-color').value,
    padding: parseInt(document.getElementById('padding').value)
  };

  if (typeof chrome !== 'undefined' && chrome.storage && chrome.storage.sync) {
    chrome.storage.sync.set(settings, () => {
      showMessage('✅ Paramètres enregistrés avec succès !', 'success');
    });
  } else {
    // Fallback vers localStorage
    Object.keys(settings).forEach(key => {
      localStorage.setItem(`md-setting-${key}`, settings[key]);
    });
    showMessage('✅ Paramètres enregistrés avec succès !', 'success');
  }
}

// Réinitialiser les paramètres
function resetSettings() {
  if (confirm('Êtes-vous sûr de vouloir réinitialiser tous les paramètres aux valeurs par défaut ?')) {
    if (typeof chrome !== 'undefined' && chrome.storage && chrome.storage.sync) {
      chrome.storage.sync.set(defaultSettings, () => {
        loadSettings();
        showMessage('↩️ Paramètres réinitialisés', 'info');
      });
    } else {
      // Fallback vers localStorage
      Object.keys(defaultSettings).forEach(key => {
        localStorage.setItem(`md-setting-${key}`, defaultSettings[key]);
      });
      loadSettings();
      showMessage('↩️ Paramètres réinitialisés', 'info');
    }
  }
}

// Afficher un message
function showMessage(text, type = 'success') {
  const messageEl = document.getElementById('message');
  messageEl.textContent = text;
  messageEl.className = `message ${type}`;
  messageEl.style.display = 'block';
  
  setTimeout(() => {
    messageEl.style.display = 'none';
  }, 3000);
}

// Événements
document.addEventListener('DOMContentLoaded', () => {
  loadSettings();

  // Mise à jour des valeurs affichées pour les sliders
  document.getElementById('font-size').addEventListener('input', (e) => {
    document.getElementById('font-size-value').textContent = e.target.value;
  });

  document.getElementById('line-height').addEventListener('input', (e) => {
    document.getElementById('line-height-value').textContent = e.target.value;
  });

  document.getElementById('max-width').addEventListener('input', (e) => {
    document.getElementById('max-width-value').textContent = e.target.value;
  });

  document.getElementById('padding').addEventListener('input', (e) => {
    document.getElementById('padding-value').textContent = e.target.value;
  });

  // Synchronisation des couleurs
  document.getElementById('text-color').addEventListener('input', (e) => {
    document.getElementById('text-color-hex').value = e.target.value.toUpperCase();
  });

  document.getElementById('text-color-hex').addEventListener('input', (e) => {
    const value = e.target.value;
    if (/^#[0-9A-F]{6}$/i.test(value)) {
      document.getElementById('text-color').value = value;
    }
  });

  document.getElementById('link-color').addEventListener('input', (e) => {
    document.getElementById('link-color-hex').value = e.target.value.toUpperCase();
  });

  document.getElementById('link-color-hex').addEventListener('input', (e) => {
    const value = e.target.value;
    if (/^#[0-9A-F]{6}$/i.test(value)) {
      document.getElementById('link-color').value = value;
    }
  });

  // Boutons
  document.getElementById('save-btn').addEventListener('click', saveSettings);
  document.getElementById('reset-btn').addEventListener('click', resetSettings);
});

