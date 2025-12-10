// Fonction pour parser le markdown en HTML
function parseMarkdown(markdown) {
  let html = markdown;
  
  // Stocker temporairement les code blocks pour ne pas les modifier
  const codeBlocks = [];
  html = html.replace(/```[\s\S]*?```/g, (match) => {
    const placeholder = `__CODE_BLOCK_${codeBlocks.length}__`;
    codeBlocks.push(match);
    return placeholder;
  });
  
  // Traiter les headers avant l'échappement
  html = html.replace(/^###### (.+)$/gm, '<h6>$1</h6>');
  html = html.replace(/^##### (.+)$/gm, '<h5>$1</h5>');
  html = html.replace(/^#### (.+)$/gm, '<h4>$1</h4>');
  html = html.replace(/^### (.+)$/gm, '<h3>$1</h3>');
  html = html.replace(/^## (.+)$/gm, '<h2>$1</h2>');
  html = html.replace(/^# (.+)$/gm, '<h1>$1</h1>');
  
  // Horizontal rules
  html = html.replace(/^---$/gm, '<hr>');
  html = html.replace(/^\*\*\*$/gm, '<hr>');
  
  // Fonction helper pour formater le texte inline
  function formatInline(text) {
    let formatted = text;
    formatted = formatted.replace(/!\[([^\]]*)\]\(([^)]+)\)/g, '<img src="$2" alt="$1" />');
    formatted = formatted.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>');
    formatted = formatted.replace(/\*\*([^*]+?)\*\*/g, '<strong>$1</strong>');
    formatted = formatted.replace(/__(.+?)__/g, '<strong>$1</strong>');
    formatted = formatted.replace(/(?<![*_])\*([^*]+?)\*(?![*_])/g, '<em>$1</em>');
    formatted = formatted.replace(/(?<!_)_([^_]+?)_(?!_)/g, '<em>$1</em>');
    formatted = formatted.replace(/`([^`]+)`/g, '<code>$1</code>');
    return formatted;
  }
  
  // Traiter les listes AVANT le formatage inline
  const lines = html.split('\n');
  const result = [];
  let currentListItems = [];
  let currentListType = null;
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const trimmed = line.trim();
    
    // Détecter les listes sur le texte brut (avant formatage)
    const unorderedMatch = trimmed.match(/^[\*\-\+] (.+)$/);
    const orderedMatch = trimmed.match(/^\d+\. (.+)$/);
    
    if (unorderedMatch || orderedMatch) {
      const listType = unorderedMatch ? 'ul' : 'ol';
      const rawContent = (unorderedMatch ? unorderedMatch[1] : orderedMatch[1]).trim();
      
      // Si nouvelle liste ou changement de type
      if (currentListType !== listType) {
        // Fermer la liste précédente
        if (currentListItems.length > 0) {
          const listTag = currentListType === 'ul' ? 'ul' : 'ol';
          result.push(`<${listTag}>${currentListItems.join('')}</${listTag}>`);
          currentListItems = [];
        }
        currentListType = listType;
      }
      
      // Formater le contenu de l'item et l'ajouter
      const formattedContent = formatInline(rawContent);
      currentListItems.push(`<li>${formattedContent}</li>`);
    } else {
      // Fin de liste - fermer la liste actuelle
      if (currentListItems.length > 0) {
        const listTag = currentListType === 'ul' ? 'ul' : 'ol';
        result.push(`<${listTag}>${currentListItems.join('')}</${listTag}>`);
        currentListItems = [];
        currentListType = null;
      }
      result.push(line);
    }
  }
  
  // Fermer la dernière liste si nécessaire
  if (currentListItems.length > 0) {
    const listTag = currentListType === 'ul' ? 'ul' : 'ol';
    result.push(`<${listTag}>${currentListItems.join('')}</${listTag}>`);
  }
  
  html = result.join('\n');
  
  // Appliquer le formatage inline au reste du contenu (pas dans les listes)
  html = html.replace(/!\[([^\]]*)\]\(([^)]+)\)/g, '<img src="$2" alt="$1" />');
  html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>');
  html = html.replace(/\*\*([^*]+?)\*\*/g, '<strong>$1</strong>');
  html = html.replace(/__(.+?)__/g, '<strong>$1</strong>');
  html = html.replace(/(?<![*_])\*([^*]+?)\*(?![*_])/g, '<em>$1</em>');
  html = html.replace(/(?<!_)_([^_]+?)_(?!_)/g, '<em>$1</em>');
  html = html.replace(/`([^`]+)`/g, '<code>$1</code>');
  
  // Restaurer les code blocks et les traiter
  codeBlocks.forEach((block, index) => {
    const placeholder = `__CODE_BLOCK_${index}__`;
    let processedBlock = block;
    
    // Extraire le langage si présent
    const langMatch = processedBlock.match(/^```(\w+)?\n?/);
    if (langMatch) {
      const lang = langMatch[1] || '';
      const code = processedBlock.replace(/^```\w*\n?/, '').replace(/```$/, '').trim();
      processedBlock = `<pre><code class="language-${lang}">${escapeHtml(code)}</code></pre>`;
    } else {
      const code = processedBlock.replace(/```/g, '').trim();
      processedBlock = `<pre><code>${escapeHtml(code)}</code></pre>`;
    }
    
    html = html.replace(placeholder, processedBlock);
  });
  
  // Traiter les paragraphes (lignes qui ne sont pas déjà des éléments HTML)
  const paraLines = html.split('\n');
  const processedLines = [];
  let currentParagraph = [];
  
  for (let i = 0; i < paraLines.length; i++) {
    const line = paraLines[i].trim();
    
    if (!line) {
      // Ligne vide - fin du paragraphe actuel
      if (currentParagraph.length > 0) {
        const para = currentParagraph.join(' ').trim();
        if (para && !para.match(/^<(h[1-6]|ul|ol|pre|hr|li|p|img)/)) {
          processedLines.push('<p>' + para + '</p>');
        } else {
          processedLines.push(para);
        }
        currentParagraph = [];
      }
      processedLines.push('');
    } else if (line.match(/^<(h[1-6]|ul|ol|pre|hr|li|p|img|a)/)) {
      // Élément HTML déjà formé
      if (currentParagraph.length > 0) {
        const para = currentParagraph.join(' ').trim();
        if (para && !para.match(/^<(h[1-6]|ul|ol|pre|hr|li|p)/)) {
          processedLines.push('<p>' + para + '</p>');
        } else {
          processedLines.push(para);
        }
        currentParagraph = [];
      }
      processedLines.push(line);
    } else {
      currentParagraph.push(line);
    }
  }
  
  // Traiter le dernier paragraphe
  if (currentParagraph.length > 0) {
    const para = currentParagraph.join(' ').trim();
    if (para && !para.match(/^<(h[1-6]|ul|ol|pre|hr|li|p)/)) {
      processedLines.push('<p>' + para + '</p>');
    } else {
      processedLines.push(para);
    }
  }
  
  html = processedLines.join('\n');
  
  // Nettoyer les listes (supprimer les <p> dans les <li>)
  html = html.replace(/(<li>)<p>(.*?)<\/p>(<\/li>)/g, '$1$2$3');
  
  return html;
}

function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

// Fonction pour obtenir le contenu markdown de la page
function getMarkdownContent() {
  // Pour les fichiers file://, le contenu markdown est généralement dans le body ou pre
  // Chrome affiche souvent les fichiers texte dans un <pre> ou directement dans le body
  
  // Vérifier si le contenu est dans un élément <pre>
  const preElement = document.querySelector('pre');
  if (preElement) {
    return preElement.textContent;
  }
  
  // Si le body contient du contenu textuel brut
  if (document.body) {
    // Si le body ne contient qu'un seul enfant de type texte, c'est probablement le markdown
    if (document.body.childNodes.length === 1 && 
        document.body.childNodes[0].nodeType === Node.TEXT_NODE) {
      return document.body.textContent;
    }
    
    // Sinon, récupérer tout le texte
    return document.body.textContent || document.body.innerText || '';
  }
  
  // Dernier recours
  return document.documentElement.innerText || document.documentElement.textContent || '';
}

// Variable globale pour stocker le contenu précédent et l'intervalle de surveillance
let previousMarkdownContent = '';
let watchInterval = null;
let currentUrl = '';

// Fonction pour obtenir le contenu markdown depuis le fichier
async function fetchMarkdownContent(url) {
  try {
    const response = await fetch(url, {
      cache: 'no-cache',
      headers: {
        'Cache-Control': 'no-cache'
      }
    });
    if (response.ok) {
      const content = await response.text();
      return content;
    }
  } catch (error) {
    // Fetch peut échouer pour les fichiers file:// à cause des restrictions CORS
    // On retourne null pour utiliser la méthode DOM en fallback
    console.debug('Fetch failed, using DOM method:', error);
  }
  return null;
}

// Fonction principale
async function renderMarkdown(forceUpdate = false) {
  // Vérifier si on est sur un fichier markdown
  const url = window.location.href;
  if (!url.match(/\.(md|markdown)$/i) && !url.startsWith('file://')) {
    return;
  }

  // Obtenir le contenu markdown
  let markdownContent;
  if (url.startsWith('file://')) {
    // Pour les fichiers locaux, essayer fetch d'abord, puis fallback vers DOM
    markdownContent = await fetchMarkdownContent(url);
    if (!markdownContent || markdownContent.trim().length === 0) {
      markdownContent = getMarkdownContent();
    }
  } else {
    markdownContent = getMarkdownContent();
  }
  
  if (!markdownContent || markdownContent.trim().length === 0) {
    return;
  }

  // Vérifier si le contenu a changé
  if (!forceUpdate && markdownContent === previousMarkdownContent) {
    return; // Pas de changement, ne pas re-render
  }

  // Sauvegarder le nouveau contenu
  previousMarkdownContent = markdownContent;
  currentUrl = url;

  // Sauvegarder l'état du toggle de thème avant de réinitialiser le DOM
  const themeToggleElement = document.querySelector('.theme-toggle');
  const isDarkMode = themeToggleElement ? themeToggleElement.checked : 
                     (localStorage.getItem('markdown-reader-theme') || 'light') === 'dark';

  // Parser le markdown en HTML
  const htmlContent = parseMarkdown(markdownContent);

  // Créer la structure HTML
  const container = document.createElement('div');
  container.className = 'markdown-container';
  container.innerHTML = htmlContent;

  // Récupérer le thème sauvegardé
  const savedTheme = localStorage.getItem('markdown-reader-theme') || 'light';
  const isDark = savedTheme === 'dark';

  // Remplacer le contenu de la page
  document.documentElement.innerHTML = `
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>${document.title || 'Markdown Reader'}</title>
    </head>
    <body ${isDark ? 'class="dark-mode"' : ''}>
      <div class="theme-toggle-wrapper">
        <span class="theme-toggle-label">Mode sombre</span>
        <input type="checkbox" class="theme-toggle" id="theme-toggle" ${isDark ? 'checked' : ''} aria-label="Toggle dark mode">
      </div>
      ${container.outerHTML}
    </body>
  `;

  // Réappliquer les styles CSS (ils sont injectés automatiquement via manifest.json)
  document.body.style.margin = '0';
  document.body.style.padding = '0';
  
  // Charger et appliquer les paramètres personnalisés
  applyCustomSettings();
  
  // Attacher l'événement de bascule de thème
  const themeToggle = document.querySelector('.theme-toggle');
  if (themeToggle) {
    themeToggle.addEventListener('change', function() {
      const isChecked = this.checked;
      if (isChecked) {
        document.body.classList.add('dark-mode');
        localStorage.setItem('markdown-reader-theme', 'dark');
      } else {
        document.body.classList.remove('dark-mode');
        localStorage.setItem('markdown-reader-theme', 'light');
      }
    });
  }
}

// Fonction pour démarrer la surveillance du fichier
function startFileWatcher() {
  // Arrêter l'intervalle précédent s'il existe
  if (watchInterval) {
    clearInterval(watchInterval);
  }

  // Vérifier les modifications toutes les 100ms
  watchInterval = setInterval(async () => {
    const url = window.location.href;
    if (!url.match(/\.(md|markdown)$/i) && !url.startsWith('file://')) {
      // Plus un fichier markdown, arrêter la surveillance
      if (watchInterval) {
        clearInterval(watchInterval);
        watchInterval = null;
      }
      return;
    }

    // Si l'URL a changé, mettre à jour
    if (url !== currentUrl) {
      previousMarkdownContent = '';
      currentUrl = url;
      await renderMarkdown(true);
      return;
    }

    // Vérifier les modifications du contenu
    try {
      await renderMarkdown(false);
    } catch (error) {
      // Ignorer les erreurs silencieusement pour ne pas polluer la console
      console.debug('Error during file watch:', error);
    }
  }, 100);
}

// Fonction pour appliquer les paramètres personnalisés
function applyCustomSettings() {
  // Valeurs par défaut
  const defaults = {
    fontFamily: 'system',
    fontSize: 16,
    lineHeight: 1.6,
    maxWidth: 900,
    textColor: '#333333',
    linkColor: '#0366d6',
    padding: 40
  };

  // Fonction pour appliquer les settings
  function applySettings(settings) {
    const root = document.documentElement;
    
    // Mapper la famille de police
    let fontFamily = settings.fontFamily;
    if (fontFamily === 'system') {
      fontFamily = '-apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", "Oxygen", "Ubuntu", "Cantarell", "Fira Sans", "Droid Sans", "Helvetica Neue", sans-serif';
    }
    
    // Appliquer les variables CSS
    root.style.setProperty('--md-font-family', fontFamily);
    root.style.setProperty('--md-font-size', `${settings.fontSize}px`);
    root.style.setProperty('--md-line-height', settings.lineHeight);
    root.style.setProperty('--md-max-width', `${settings.maxWidth}px`);
    root.style.setProperty('--md-text-color', settings.textColor);
    root.style.setProperty('--md-link-color', settings.linkColor);
    root.style.setProperty('--md-padding', `${settings.padding}px`);
  }

  // Charger les paramètres depuis chrome.storage (priorité) ou localStorage (fallback)
  if (typeof chrome !== 'undefined' && chrome.storage && chrome.storage.sync) {
    chrome.storage.sync.get(defaults, (settings) => {
      applySettings(settings);
    });
  } else {
    // Fallback vers localStorage
    const settings = { ...defaults };
    Object.keys(defaults).forEach(key => {
      const saved = localStorage.getItem(`md-setting-${key}`);
      if (saved !== null) {
        if (typeof defaults[key] === 'number') {
          settings[key] = parseFloat(saved);
        } else {
          settings[key] = saved;
        }
      }
    });
    applySettings(settings);
  }
}

// Attendre que le DOM soit prêt, puis démarrer le rendu et la surveillance
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', async () => {
    await renderMarkdown(true);
    startFileWatcher();
  });
} else {
  renderMarkdown(true).then(() => {
    startFileWatcher();
  });
}

