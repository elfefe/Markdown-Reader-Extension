# Extension Chrome - Markdown Reader

Une extension Chrome qui affiche automatiquement les fichiers Markdown (`.md` ou `.markdown`) dans un format lisible et élégant directement dans le navigateur.

## Fonctionnalités

- ✨ Détection automatique des fichiers Markdown
- 📝 Rendu professionnel avec mise en forme complète
- 🎨 Support du mode sombre avec toggle Material Design
- ⚙️ Page de configuration pour personnaliser l'apparence
- 📱 Design responsive pour tous les écrans
- ⚡ Rapide et léger

## Installation

### Méthode 1 : Installation depuis le code source (Recommandé pour les développeurs)

1. **Télécharger le code source**
   - Cloner ou télécharger ce repository
   - Extraire les fichiers dans un dossier local

2. **Ouvrir Chrome et accéder aux extensions**
   - Ouvrez Chrome et allez à `chrome://extensions/`
   - Ou cliquez sur les trois points (⋮) > **Extensions** > **Gérer les extensions**

3. **Activer le mode développeur**
   - Activez le bouton **Mode développeur** en haut à droite de la page

4. **Charger l'extension**
   - Cliquez sur **Charger l'extension non empaquetée**
   - Sélectionnez le dossier contenant les fichiers de l'extension
   - L'extension devrait maintenant apparaître dans votre liste d'extensions

### Méthode 2 : Installation depuis un fichier .crx (si disponible)

1. Téléchargez le fichier `.crx`
2. Allez à `chrome://extensions/`
3. Activez le **Mode développeur**
4. Glissez-déposez le fichier `.crx` dans la page des extensions

## Utilisation

Une fois installée, l'extension fonctionne automatiquement :

1. Ouvrez un fichier Markdown dans Chrome en utilisant `file://`
   - Par exemple : `file:///C:/Users/votre-nom/README.md`
   
2. L'extension détecte automatiquement le fichier `.md` ou `.markdown`

3. Le contenu est automatiquement formaté et affiché dans un style lisible

## Configuration

Vous pouvez personnaliser l'apparence de vos fichiers Markdown en accédant à la page d'options :

1. **Ouvrir les options** :
   - Cliquez avec le bouton droit sur l'icône de l'extension dans la barre d'outils
   - Sélectionnez "Options"
   - Ou allez dans `chrome://extensions/`, trouvez "Markdown Reader Extension" et cliquez sur "Options"

2. **Paramètres disponibles** :
   - **Famille de police** : Choisissez parmi plusieurs polices (Arial, Georgia, Times New Roman, etc.)
   - **Taille de police** : Ajustez la taille du texte (12-24px)
   - **Hauteur de ligne** : Modifiez l'espacement entre les lignes (1.2-2.5)
   - **Largeur maximale** : Contrôlez la largeur du contenu (600-1400px)
   - **Couleur du texte** : Personnalisez la couleur principale du texte
   - **Couleur des liens** : Définissez la couleur des liens hypertextes
   - **Espacement intérieur** : Ajustez l'espacement autour du contenu (10-80px)

3. **Sauvegarder** : Cliquez sur "Enregistrer les paramètres" pour appliquer vos modifications

## Fonctionnalités du parser Markdown

L'extension supporte les éléments Markdown suivants :

- **Headers** : `# H1`, `## H2`, `### H3`, etc.
- **Gras** : `**texte**` ou `__texte__`
- *Italique* : `*texte*` ou `_texte_`
- `Code inline` : `` `code` ``
- **Blocs de code** : ` ```code``` `
- Listes non ordonnées : `- item` ou `* item`
- Listes ordonnées : `1. item`
- [Liens](url) : `[texte](url)`
- Images : `![alt](url)`
- Lignes horizontales : `---` ou `***`
- Paragraphes

## Structure du projet

```
Markdown Reader Extension/
├── manifest.json      # Configuration de l'extension Chrome
├── content.js         # Script principal qui parse et affiche le markdown
├── styles.css         # Styles CSS pour le rendu élégant
├── options.html       # Page de configuration
├── options.js         # Logique de la page de configuration
├── options.css        # Styles de la page de configuration
└── README.md          # Ce fichier
```

## Personnalisation

L'extension offre deux méthodes de personnalisation :

### Via la page d'options (Recommandé)
Utilisez l'interface graphique accessible depuis les options de l'extension pour personnaliser facilement tous les aspects visuels.

### Via le code
Vous pouvez également modifier directement le fichier `styles.css` pour des personnalisations avancées. Les styles utilisent des variables CSS qui peuvent être modifiées dynamiquement.

## Compatibilité

- Chrome 88+ (Manifest V3)
- Chromium 88+
- Edge 88+ (basé sur Chromium)

## Développement

Pour modifier l'extension :

1. Modifiez les fichiers selon vos besoins
2. Allez à `chrome://extensions/`
3. Cliquez sur le bouton **Recharger** (🔄) sur la carte de l'extension
4. Testez vos modifications en ouvrant un fichier `.md`

## Limitations

- L'extension fonctionne uniquement avec les fichiers locaux (`file://`)
- Les images relatives dans les fichiers Markdown doivent avoir des chemins absolus ou être accessibles
- Les tableaux Markdown ne sont pas encore supportés (à venir dans une future version)

## Contribution

Les contributions sont les bienvenues ! N'hésitez pas à ouvrir une issue ou une pull request.

## Licence

MIT License - Libre d'utilisation pour des projets personnels et commerciaux.

