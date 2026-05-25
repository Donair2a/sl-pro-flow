const APP_VERSION = "1.4.0";

let sponsors = JSON.parse(localStorage.getItem('SLProSpons_v7')) || {};
let events = JSON.parse(localStorage.getItem('SLProEv_v7')) || {};
let deadlines = JSON.parse(localStorage.getItem('SLProDeadlines_v1')) || [];

const defaultCats = {
    "Outfit": { emo: "👔", en: "Outfit", type: "style" }, "Corps": { emo: "👤", en: "Body", type: "style" }, "Shape": { emo: "📏", en: "Shape", type: "style" },
    "Peau": { emo: "✨", en: "Skin", type: "style" }, "Tête": { emo: "💀", en: "Head", type: "style" }, "Cheveux": { emo: "💇‍♂️", en: "Hair", type: "style" },
    "Yeux": { emo: "👁️", en: "Eyes", type: "style" }, "Barbe": { emo: "🧔", en: "Beard", type: "style" }, "Tatouage": { emo: "💉", en: "Tattoo", type: "style" },
    "Maquillage": { emo: "💄", en: "Makeup", type: "style" }, "Haut": { emo: "👕", en: "Top", type: "style" }, "Bas": { emo: "👖", en: "Bottom", type: "style" },
    "Robe": { emo: "👗", en: "Dress", type: "style" }, "Chaussures": { emo: "👟", en: "Shoes", type: "style" }, "Chapeau": { emo: "👒", en: "Hat", type: "style" },
    "Bijoux": { emo: "💎", en: "Jewelry", type: "style" }, "Accessoire": { emo: "👜", en: "Accessory", type: "style" }, 
    "Backdrop": { emo: "🖼️", en: "Backdrop", type: "decors" }, "Meubles": { emo: "🛋️", en: "Furniture", type: "decors" }, 
    "Végétaux": { emo: "🌳", en: "Plants", type: "decors" }, "Poses": { emo: "🚶", en: "Poses", type: "decors" },
    "Véhicules": { emo: "🚗", en: "Vehicles", type: "decors" }, "Animaux": { emo: "🐾", en: "Animals", type: "decors" }, 
    "Créatures": { emo: "👾", en: "Creatures", type: "decors" }, "Peluches": { emo: "🧸", en: "Plushies", type: "decors" }, 
    "Monstres": { emo: "👹", en: "Monsters", type: "decors" }
};
let appCategories = JSON.parse(localStorage.getItem('SLProCategories_v1')) || defaultCats;

let activeModelKey = localStorage.getItem('SLProActiveModel_v1') || "Modèle Standard (Diamants)";
let lastKey = "";
let primfeedDataCache = "";
let currentLang = localStorage.getItem('SLProLang_v1') || "FR";

// MULTILINGUAL UI DICTIONARY
const uiDictionary = {
    FR: {
        navEditor: "Credits", navSponsors: "Sponsors & Events", navDl: "Deadlines", navConfig: "Tableau de bord",
        sideIntro: "📸 Titre & Musique", sideStyle: "✨ Style", sideDecors: "🏠 Décors", sidePost: "🎨 Technique", sideTags: "🏷️ Tags", sideClear: "✨ Nouveau",
        titleIntro: "📸 Titre & Musique", titleStyle: "✨ Style", titleDecors: "🏠 Décors", titleTech: "🎨 Technique", titleTags: "🏷️ Tags",
        titleAddDl: "⏳ Deadlines", titleConfigSocial: "💎 Tableau de bord & Réseaux", lblCfgTags: "Tags par défaut (permanents)",
        titleConfigCats: "🎨 Personnalisation des Catégories", lblCatFr: "Nom (Français)", lblCatEn: "Traduction (Anglais)", lblCatEmo: "Émoji", lblCatType: "Rangement / Type",
        optCatDecors: "🏠 Décors", optCatStyle: "✨ Style", btnAddCat: "Ajouter la catégorie",
        titleConfigModels: "📝 Modèles de Rendu", lblSelectModel: "Sélectionner le modèle actif", lblInjectTags: "Insérer une balise au curseur :", lblEditStructure: "Éditer la structure du modèle sélectionné",
        titleConfigMaint: "💾 Maintenance & Backup", btnExpJson: "Exporter JSON", btnImpJson: "Importer JSON", btnCreateModel: "Créer / Modifier",
        btnCopy: "Copier", titleSponsList: "Sponsors", titleEvList: "Events", lblPermTags: "Tags permanents (Tableau de bord)", lblAutoTags: "Auto-tags suggérés",
        btnAddTxt: "＋ Ajouter un élément", btnAddDl: "Ajouter",
        headerViewer: "Viewer", headerSoftware: "Logiciel Retouche", lblViNone: "Aucun", lblSoftNone: "Aucun",
        rowCat: "Catégorie", rowBrand: "Marque", rowArticle: "Article", rowPlcName: "Nom...", rowPlcArt: "Article...",
        rowCheckEvent: "L'article est disponible dans un event ?", rowEvName: "Nom Event", rowEvLink: "Lien Event",
        rowPlcSlurl: "SLURL (Séparez par | si plusieurs)...", rowPlcMgr: "Manager...",
        phTitre: "Titre...", phMood: "Citation...", phMusL: "URL Musique...", phMusT: "Artiste - Titre...",
        phTagsManual: "Tags séparés par virgules...", phPostNote: "Notes techniques...",
        confirmClear: "Créer un nouveau post et réinitialiser tout le masque de saisie ?", confirmImport: "Importer les données ?", confirmDelItem: "Supprimer ?", alertCatRequired: "Le nom français et la traduction anglaise sont obligatoires.", alertModelName: "Veuillez donner un nom à votre nouveau modèle.",
        editTitleSpons: "Editer : ", editTitleEv: "Editer : ", lblEditLink: "Lien / SLURL", lblEditMgr: "Manager", btnEditSubmit: "Enregistrer",
        modalTitleEditCat: "Modifier la Catégorie", lblModalCatFr: "Nom (Français)", lblModalCatEn: "Traduction (Anglais)", lblModalCatEmo: "Émoji", lblModalCatType: "Rangement / Type", btnModalCatSave: "Enregistrer", btnModalCatCancel: "Annuler",
        optModalStyle: "✨ Style", optModalDecors: "🏠 Décors", phCatFr: "Nom de la catégorie...", phCatEn: "Traduction anglaise...", phCatEmo: "Émoji...",
        helpMainTitle: "📖 Manuel d'Utilisation", btnCloseHelp: "Fermer le guide",
        helpContent: `
            <div style="background:rgba(201,160,80,0.1); border:1px solid var(--accent); border-radius:8px; padding:15px; margin-bottom:15px;">
                <h3 style="color:var(--accent); margin-top:0; margin-bottom:8px; font-size:1rem;">👋 À quoi sert SL ProFlow ?</h3>
                <p style="margin:0; font-size:0.85rem;">Cette petite application vise à automatiser et sauvegarder vos paramètres de mise en forme et personnalisation ainsi la génération des crédits pour le blogging SL sur les plateformes Flickr et Primfeed. Les posts seront automatiquement copiés / collés en langue anglaise vous n’avez rien à traduire l’outil s’en occupe tout seul. Un gain de temps, et les crédits sont moins fastidieux voir même intuitifs. L’application est hébergée afin de rendre la maintenance plus facile, plus rapide.</p>
            </div>
            <div class="qa-item" onclick="toggleQA('qa1_fr')">🗺️ Barre de navigation supérieure <span>▼</span></div>
            <div id="qa1_fr" class="qa-ans" style="display:none; font-size:0.85rem;">
                <b>1. Crédits :</b> Ce menu vous donne accès à la mise en forme et la saisie de vos crédits. Vous pourrez y saisir le titre, le mood ainsi que partager vos liens musique. Il fonctionne avec un menu vertical (latéral gauche) qui vous permet de gérer la saisie des différents éléments de votre post.<br>
                <b>2. Sponsors & Events :</b> Cette page est votre base de données d’events et de sponsors. Enregistrez-les directement sur cette page, ou depuis la saisie de votre poste (Style/Décors) via la disquette 💾 qui apparaît pour un ajout automatique.<br>
                <b>3. Deadlines :</b> Gérez vos Deadlines et gardez un suivi visuel à court terme. Saisie manuelle (Sponsor + Date). Code couleur : Vert (+ de 5 jours), Orange (+ de 2 jours), Rouge (- de 48h avec alerte sur le menu).<br>
                <b>4. ? :</b> Guide utilisateur complet.<br>
                <b>5. Langage Fr/En :</b> Permet de basculer instantanément la langue de l'interface.<br>
                <b>6. Tableau de bord :</b> Réseaux sociaux, tags permanents, catégories personnalisées, modèles de structure et module de backup.<br>
                <b>7. Thème :</b> Thème sombre et clair.
            </div>
            <div class="qa-item" onclick="toggleQA('qa2_fr')">📐 Menu latéral gauche (Le Formulateur) <span>▼</span></div>
            <div id="qa2_fr" class="qa-ans" style="display:none; font-size:0.85rem;">
                Ces onglets sont entièrement dédiés à la saisie de votre post. Ils vous permettent d’afficher ou non différents blocs positionnés selon vos envies. L’outil est intelligent : tapez les 3 premiers caractères d’un sponsor enregistré et les champs s’auto-remplissent.<br><br>
                • <b>Style :</b> Principalement lié à ce que porte l’avatar (vêtements, corps, accessoires tenus en main). Entièrement personnalisable dans le tableau de bord.<br>
                • <b>Décors :</b> Centré sur ce qui accompagne l’avatar (backdrop, ami, meubles, végétation, poses). Également personnalisable.<br>
                • <b>Technique :</b> Pour le post-traitement (Logiciel utilisé, Viewer utilisé et champ libre pour précisions).<br>
                • <b>Tags :</b> Divisé en trois parties : Tags permanents (Tableau de bord), Auto-tags suggérés (selon les sponsors saisis) et champ de Saisie manuelle. À copier-coller directement sur Flickr.
            </div>
            <div class="qa-item" onclick="toggleQA('qa3_fr')">🔗 Astuces & Gestion des Liens Multiples <span>▼</span></div>
            <div id="qa3_fr" class="qa-ans" style="display:none; font-size:0.85rem;">
                Vous pouvez saisir plusieurs adresses pour votre sponsor : il suffit de séparer celles-ci par des séparateurs <b>|</b> (barre verticale). L’outil va créer automatiquement les liens sous la référence numérotée en anglais : <i>Store 1, Store 2...</i> dans vos rendus finaux.
            </div>
            <div class="qa-item" onclick="toggleQA('qa4_fr')">🎨 Personnalisation des Catégories & Modèles <span>▼</span></div>
            <div id="qa4_fr" class="qa-ans" style="display:none; font-size:0.85rem;">
                • <b>Catégories :</b> Dans le Tableau de bord, modifiez ou ajoutez des items dans vos menus déroulants Style et Décors pour coller à vos habitudes.<br>
                • <b>Modèles :</b> Organisez votre structure de posts ou utilisez celle par défaut. Utilisez les boutons d'injection de balises pour placer vos blocs où vous le voulez. Pour écraser un modèle existant : faites vos modifications, remettez le nom exact du modèle dans la case Nom, et cliquez sur <b>Créer / Modifier</b>.
            </div>
            <div class="qa-item" onclick="toggleQA('qa5_fr')">💾 Maintenance & Backup (Crucial !) <span>▼</span></div>
            <div id="qa5_fr" class="qa-ans" style="display:none; font-size:0.85rem;">
                Cette fonction est très importante ! Elle vous permet d'enregistrer sur votre PC toutes vos données sous format de fichier JSON (Modèles, Catégories, Sponsors, Tags). Il est très important après chaque modification d'exporter vos données. Si vous perdez vos personnalisations (changement de PC, cache vidé), réimportez ce fichier et la magie opère !
            </div>
            <div class="qa-item" onclick="toggleQA('qa6_fr')">💻 Installer l'application sur son Bureau <span>▼</span></div>
            <div id="qa6_fr" class="qa-ans" style="display:none; font-size:0.85rem;">
                Puisque l'outil est hébergé en ligne, installez-le comme un vrai logiciel :<br><br>
                • <b>Sur Chrome :</b> Cliquez sur le menu (3 points) &rarr; <i>Enregistrer et partager</i> &rarr; <b>Installer la page en tant qu'application...</b><br>
                • <b>Sur Edge :</b> Cliquez sur le menu (3 points) &rarr; <i>Applications</i> &rarr; <b>Installer ce site en tant qu'application</b>.
            </div>`
    },
    EN: {
        navEditor: "Credits", navSponsors: "Sponsors & Events", navDl: "Deadlines", navConfig: "Dashboard",
        sideIntro: "📸 Title & Music", sideStyle: "✨ Style", sideDecors: "🏠 Decors", sidePost: "🎨 Technical", sideTags: "🏷️ Tags", sideClear: "✨ New",
        titleIntro: "📸 Title & Music", titleStyle: "✨ Style", titleDecors: "🏠 Decors", titleTech: "🎨 Technical", titleTags: "🏷️ Tags",
        titleAddDl: "⏳ Deadlines", titleConfigSocial: "💎 Dashboard & Networks", lblCfgTags: "Default tags (permanent)",
        titleConfigCats: "🎨 Categories Customization", lblCatFr: "Name (French)", lblCatEn: "Translation (English)", lblCatEmo: "Emoji", lblCatType: "Section / Type",
        optCatDecors: "🏠 Decors", optCatStyle: "✨ Style", btnAddCat: "Add category",
        titleConfigModels: "📝 Rendering Models", lblSelectModel: "Select active model", lblInjectTags: "Insert a tag at cursor:", lblEditStructure: "Edit selected model structure",
        titleConfigMaint: "💾 Maintenance & Backup", btnExpJson: "Export JSON", btnImpJson: "Import JSON", btnCreateModel: "Create / Update",
        btnCopy: "Copy", titleSponsList: "Sponsors", titleEvList: "Events", lblPermTags: "Permanent tags (Dashboard)", lblAutoTags: "Suggested auto-tags",
        btnAddTxt: "＋ Add an item", btnAddDl: "Add",
        headerViewer: "Viewer", headerSoftware: "Editing Software", lblViNone: "None", lblSoftNone: "None",
        rowCat: "Category", rowBrand: "Brand", rowArticle: "Item", rowPlcName: "Name...", rowPlcArt: "Item name...",
        rowCheckEvent: "Is this item available at an event?", rowEvName: "Event Name", rowEvLink: "Event Link",
        rowPlcSlurl: "SLURL (Separate with | if multiple)...", rowPlcMgr: "Manager...",
        phTitre: "Title...", phMood: "Quote...", phMusL: "Music URL...", phMusT: "Artist - Title...",
        phTagsManual: "Tags separated by commas...", phPostNote: "Technical notes...",
        confirmClear: "Create a new post and completely reset the entry form?", confirmImport: "Import data?", confirmDelItem: "Delete?", alertCatRequired: "French name and English translation are required.", alertModelName: "Please provide a name for your new model.",
        editTitleSpons: "Edit: ", editTitleEv: "Edit: ", lblEditLink: "Link / SLURL", lblEditMgr: "Manager", btnEditSubmit: "Save",
        modalTitleEditCat: "Modify Category", lblModalCatFr: "Name (French)", lblModalCatEn: "Translation (English)", lblModalCatEmo: "Emoji", lblModalCatType: "Section / Type", btnModalCatSave: "Save", btnModalCatCancel: "Cancel",
        optModalStyle: "✨ Style", optModalDecors: "🏠 Decors", phCatFr: "Category name...", phCatEn: "English translation...", phCatEmo: "Emoji...",
        helpMainTitle: "📖 User Manual", btnCloseHelp: "Close guide",
        helpContent: `
            <div style="background:rgba(201,160,80,0.1); border:1px solid var(--accent); border-radius:8px; padding:15px; margin-bottom:15px;">
                <h3 style="color:var(--accent); margin-top:0; margin-bottom:8px; font-size:1rem;">👋 What is SL ProFlow?</h3>
                <p style="margin:0; font-size:0.85rem;">This small application aims to automate and save your formatting and personalization settings as well as the generation of credits for SL blogging on Flickr and Primfeed platforms. Posts will be automatically copied / pasted in English, you do not have to translate anything, the tool handles it all on its own. A real time saver, making credits less tedious and highly intuitive. The application is hosted online to make maintenance faster and easier.</p>
            </div>
            <div class="qa-item" onclick="toggleQA('qa1_en')">🗺️ Top Navigation Bar <span>▼</span></div>
            <div id="qa1_en" class="qa-ans" style="display:none; font-size:0.85rem;">
                <b>1. Credits:</b> Gives access to your main credits form layout. Enter title, quotes/mood, and share your music links. Works with a vertical left sidebar layout to manage input elements.<br>
                <b>2. Sponsors & Events:</b> Your local asset database. Register them here directly or via the disk icon 💾 appearing on the entry forms for automated quick-saves.<br>
                <b>3. Deadlines:</b> Visual short-term tracking for commitments. Manual inputs (Sponsor + Date). Color system: Green (+5 days), Orange (+2 days), Red (<48h with main header badge notification alert).<br>
                <b>4. ?:</b> Comprehensive bilingual user manual.<br>
                <b>5. Language Fr/En:</b> Instantly toggles the working user interface language.<br>
                <b>6. Dashboard:</b> Personal social networks, permanent tags, custom input categories, structural layout models, and full JSON local backup utilities.<br>
                <b>7. Theme:</b> Easily switch between Dark and Light mode.
            </div>
            <div class="qa-item" onclick="toggleQA('qa2_en')">📐 Left Sidebar (The Formulator) <span>▼</span></div>
            <div id="qa2_en" class="qa-ans" style="display:none; font-size:0.85rem;">
                These tabs are completely dedicated to formatting your credits. Toggle input sections according to your layout preferences. Built-in smart autocomplete feature: type the first 3 letters of any saved sponsor to autofill stored SLURLs and managers.<br><br>
                • <b>Style:</b> Tied to your avatar's look (outfit, body, hair, held accessories). Fully customizable via the dashboard setup.<br>
                • <b>Decors:</b> Focused on the surroundings (backdrop, friends, furniture, vegetation, poses). Fully customizable.<br>
                • <b>Technical:</b> Share post-processing specifications (software used, viewer choice, and open notes field).<br>
                • <b>Tags:</b> Split into 3 layers: Permanent tags, smart suggested Auto-tags (based on input brands), and a Manual entries layer. Formatted to paste natively into Flickr.
            </div>
            <div class="qa-item" onclick="toggleQA('qa3_en')">🔗 Multi-Link Routing & Pipes <span>▼</span></div>
            <div id="qa3_en" class="qa-ans" style="display:none; font-size:0.85rem;">
                You can feed multiple URLs into a single sponsor field by simply joining them using a vertical bar separator <b>|</b>. The script compiles them into clean numbered structural English links: <i>Store 1, Store 2...</i> in your compiled publications.
            </div>
            <div class="qa-item" onclick="toggleQA('qa4_en')">🎨 Customizing Categories & Layout Models <span>▼</span></div>
            <div id="qa4_en" class="qa-ans" style="display:none; font-size:0.85rem;">
                • <b>Categories:</b> Delete or add items inside your Style and Decors dropdown menus through the main configuration view.<br>
                • <b>Models:</b> Craft unique presentation designs or run defaults. Use script block injectors to wire tokens anywhere. To overwrite an active template structure: make updates, put the exact model name back inside the Name field, and press <b>Create / Update</b>.
            </div>
            <div class="qa-item" onclick="toggleQA('qa5_en')">💾 Crucial Backup & Maintenance Utilities <span>▼</span></div>
            <div id="qa5_en" class="qa-ans" style="display:none; font-size:0.85rem;">
                This function is extremely important! It lets you download a local JSON backup file to your computer containing everything (templates, custom categories, sponsors, defaults). Always export your profile after modifications. If you clear browser caches or switch devices, reload this file to instantly recover your studio!
            </div>
            <div class="qa-item" onclick="toggleQA('qa6_en')">💻 Running App from Desktop (PWA Install) <span>▼</span></div>
            <div id="qa6_en" class="qa-ans" style="display:none; font-size:0.85rem;">
                Since the tool runs on an online server, install it standalone just like native PC software:<br><br>
                • <b>On Chrome:</b> Open menu (3 dots) &rarr; <i>Save and share</i> &rarr; <b>Install page as app...</b><br>
                • <b>On Edge:</b> Open menu (3 dots) &rarr; <i>Apps</i> &rarr; <b>Install this site as an app</b>.
            </div>`
    }
};

window.onload = () => { 
    let verDisp = document.getElementById('app-version-display'); if(verDisp) verDisp.innerText = "v" + APP_VERSION;
    document.documentElement.setAttribute('data-ui-lang', currentLang);
    let ms = document.getElementById('model-selector'); if(ms) {
        let appModels = JSON.parse(localStorage.getItem('SLProModels_v1')) || {};
        ms.innerHTML = "";
        Object.keys(appModels).forEach(k => {
            ms.innerHTML += `<option value="${k}" ${k === activeModelKey ? 'selected' : ''}>${k}</option>`;
        });
    }
    loadCfg(); renderDB(); renderDeadlines(); checkDeadlinesAlert(); renderCustomCategories(); buildModelSelector(); applyLanguage(); update(); 
    window.addEventListener('keydown', (e) => { lastKey = e.key; }); 
};

function sidebarNavigate(blockId, btn) { showMainTab('tab-editor', document.getElementById('nav-editor')); showBlock(blockId, btn); }

function showMainTab(id, btn) { 
    document.querySelectorAll('.tab-content').forEach(t => t.classList.remove('active')); 
    document.querySelectorAll('nav .nav-link').forEach(l => l.classList.remove('active')); 
    let tab = document.getElementById(id); if(tab) tab.classList.add('active'); 
    if(btn) btn.classList.add('active'); 
    const prevs = document.getElementById('main-previews');
    if(prevs) prevs.style.display = (id === 'tab-config') ? 'none' : 'flex';
    renderDB(); 
}

function showBlock(id, btn) { 
    document.querySelectorAll('.editor-block').forEach(b => b.classList.remove('active')); 
    document.querySelectorAll('.sidebar-btn').forEach(b => b.classList.remove('active')); 
    let b = document.getElementById(id); if(b) b.classList.add('active'); 
    if(btn) btn.classList.add('active'); 
}

function toggleAppLanguage() {
    currentLang = (currentLang === "FR") ? "EN" : "FR";
    localStorage.setItem('SLProLang_v1', currentLang);
    document.documentElement.setAttribute('data-ui-lang', currentLang);
    applyLanguage();
    renderCustomCategories();
    update();
}

function applyLanguage() {
    const dict = uiDictionary[currentLang];
    const applyText = (id, txt) => { let el = document.getElementById(id); if(el) el.innerText = txt; };
    const applyPlc = (id, txt) => { let el = document.getElementById(id); if(el) el.placeholder = txt; };
    const applyHtml = (id, txt) => { let el = document.getElementById(id); if(el) el.innerHTML = txt; };

    applyText('nav-editor', dict.navEditor); applyText('nav-sponsors', dict.navSponsors); applyText('nav-dl', dict.navDl); applyText('nav-config', dict.navConfig);
    applyText('side-btn-intro', dict.sideIntro); applyText('side-btn-style', dict.sideStyle); applyText('side-btn-decors', dict.sideDecors); applyText('side-btn-post', dict.sidePost); applyText('side-btn-tags', dict.sideTags); applyText('side-btn-clear', dict.sideClear);
    applyText('title-intro', dict.titleIntro); applyText('title-style', dict.titleStyle); applyText('title-decors', dict.titleDecors); applyText('title-tech', dict.titleTech); applyText('title-tags', dict.titleTags); applyText('title-add-dl', dict.titleAddDl); applyText('title-config-social', dict.titleConfigSocial); applyText('title-config-cats', dict.titleConfigCats); applyText('title-config-models', dict.titleConfigModels); applyText('title-config-maint', dict.titleConfigMaint);
    applyText('header-viewer', dict.headerViewer); applyText('header-software', dict.headerSoftware); applyText('lbl-vi-none', dict.lblViNone); applyText('lbl-soft-none', dict.lblSoftNone); applyText('lbl-cfg-tags', dict.lblCfgTags); applyText('lbl-cat-fr', dict.lblCatFr); applyText('lbl-cat-en', dict.lblCatEn); applyText('lbl-cat-emo', dict.lblCatEmo); applyText('lbl-cat-type', dict.lblCatType); applyText('opt-cat-decors', dict.optCatDecors); applyText('opt-cat-style', dict.optCatStyle); applyText('lbl-select-model', dict.lblSelectModel); applyText('lbl-inject-tags', dict.lblInjectTags); applyText('lbl-edit-structure', dict.lblEditStructure); applyText('title-spons-list', dict.titleSponsList); applyText('title-ev-list', dict.titleEvList); applyText('lbl-perm-tags', dict.lblPermTags); applyText('lbl-auto-tags', dict.lblAutoTags);
    applyText('btn-add-cat', dict.btnAddCat); applyText('btn-copy-flickr', dict.btnCopy); applyText('btn-copy-primfeed', dict.btnCopy); applyText('btn-add-dl', dict.btnAddDl); applyText('btn-create-model', dict.btnCreateModel);
    document.querySelectorAll('.btn-add-txt').forEach(el => el.innerText = dict.btnAddTxt);
    
    // Apply placeholders robustly
    applyPlc('titre', dict.phTitre); applyPlc('mood', dict.phMood); applyPlc('mus-l', dict.phMusL); applyPlc('mus-t', dict.phMusT); applyPlc('tags-manual', dict.phTagsManual); applyPlc('post-note', dict.phPostNote);
    
    // Dynamic rows placeholders
    document.querySelectorAll('.row-b').forEach(el => el.placeholder = dict.rowPlcName);
    document.querySelectorAll('.row-n').forEach(el => el.placeholder = dict.rowPlcArt);
    document.querySelectorAll('.row-sl').forEach(el => el.placeholder = dict.rowPlcSlurl);
    document.querySelectorAll('.row-mgr').forEach(el => el.placeholder = dict.rowPlcMgr);
    document.querySelectorAll('.row-ev-n').forEach(el => el.placeholder = dict.rowPlcName);
    
    applyText('help-modal-main-title', dict.helpMainTitle); applyHtml('guide-container', dict.helpContent); applyText('btn-close-help', dict.btnCloseHelp);
}

function handleSmartInput(input, type) {
    const val = input.value.trim(); const row = input.closest('.dynamic-row'); if(!row) return;
    const saveBtn = input.closest('div').querySelector('.btn-save-express');
    if (lastKey === "Backspace" || lastKey === "Delete") return;
    const data = (type === 'spons') ? sponsors : events;
    const matchKey = Object.keys(data).find(k => k.startsWith(val.toLowerCase()));
    if (val.length >= 3 && matchKey) {
        const entry = data[matchKey]; input.value = entry.name;
        if (type === 'spons') { 
            let slEl = row.querySelector('.row-sl'); if(slEl) { slEl.value = entry.slurl || ""; slEl.dataset.isFromDB = "true"; }
            let mgEl = row.querySelector('.row-mgr'); if(mgEl) mgEl.value = entry.mgr || "";
        } else if (type === 'ev') { 
            let evEl = row.querySelector('.row-ev-l'); if(evEl) { evEl.value = entry.url || ""; evEl.dataset.isFromDB = "true"; }
        }
        if(saveBtn) saveBtn.style.display = 'none'; update();
    } else if (val.length >= 2) { if(saveBtn) saveBtn.style.display = 'inline-block'; }
}

function saveExpress(btn, type) {
    const row = btn.closest('.dynamic-row'); if(!row) return;
    if (type === 'spons') {
        const name = row.querySelector('.row-b').value.trim(); if (!name) return;
        sponsors[name.toLowerCase()] = { name, slurl: row.querySelector('.row-sl').value.trim(), mgr: row.querySelector('.row-mgr').value.trim() };
        localStorage.setItem('SLProSpons_v7', JSON.stringify(sponsors));
        row.querySelector('.row-sl').dataset.isFromDB = "true";
    } else {
        const name = row.querySelector('.row-ev-n').value.trim(); if (!name) return;
        events[name.toLowerCase()] = { name, url: row.querySelector('.row-ev-l').value.trim() };
        localStorage.setItem('SLProEv_v7', JSON.stringify(events));
        row.querySelector('.row-ev-l').dataset.isFromDB = "true";
    }
    btn.style.display = 'none'; update();
}

function addDynamicRowFromStorage(target, defaultValue) {
    const allKeys = Object.keys(appCategories);
    let filteredKeys = allKeys.filter(k => (appCategories[k].type || "decors") === target);
    addDynamicRow(target, defaultValue, filteredKeys);
}

function addDynamicRow(t, d, cats) {
    const id = Math.random().toString(36).substr(2, 5); const div = document.createElement('div'); div.className = 'dynamic-row';
    const dict = uiDictionary[currentLang];
    div.innerHTML = `<button class="btn-del-row" onclick="this.parentElement.remove();update()">×</button>
        <div style="display:flex; gap:10px; margin-bottom:10px;">
            <div style="flex:0.5"><label>${dict.rowCat}</label><select class="row-cat" onchange="update()">${cats.map(c => `<option value="${c}" ${c===d?'selected':''}>${c}</option>`).join('')}</select></div>
            <div style="flex:1"><label>${dict.rowBrand} <button class="btn-save-express" onclick="saveExpress(this, 'spons')">💾</button></label><input type="text" class="row-b" placeholder="${dict.rowPlcName}" oninput="handleSmartInput(this, 'spons')"></div>
            <div style="flex:1"><label>${dict.rowArticle}</label><input type="text" class="row-n" placeholder="${dict.rowPlcArt}" oninput="update()"></div>
        </div>
        <div style="display:flex; gap:10px;">
            <div style="flex:1"><input type="text" class="row-sl" placeholder="${dict.rowPlcSlurl}" oninput="this.dataset.isFromDB='false';update()"></div>
            <div style="flex:0.8"><input type="text" class="row-mgr" placeholder="${dict.rowPlcMgr}" oninput="update()"></div>
        </div>
        <div style="margin-top:10px;">
            <label style="display:inline-flex; align-items:center; gap:8px; font-size:0.75rem; color:var(--accent); cursor:pointer;">
                <input type="checkbox" class="row-ev-check" onchange="toggleEv('${id}')" style="width:auto; margin:0;"> ${dict.rowCheckEvent}
            </label>
        </div>
        <div id="ev-box-${id}" style="display:none; margin-top:10px; gap:10px;">
            <div style="flex:1"><label>${dict.rowEvName} <button class="btn-save-express btn-save-ev" onclick="saveExpress(this, 'ev')">💾</button></label><input type="text" class="row-ev-n" placeholder="${dict.rowPlcName}" oninput="handleSmartInput(this, 'ev')"></div>
            <div style="flex:1"><label>${dict.rowEvLink}</label><input type="text" class="row-ev-l" placeholder="${dict.rowEvLink}..." oninput="this.dataset.isFromDB='false';update()"></div>
        </div>`;
    let container = document.getElementById(t + '-container');
    if(container) { container.appendChild(div); }
}

function toggleEv(id) { let el = document.getElementById(`ev-box-${id}`); if(el) { el.style.display = el.style.display==='none'?'flex':'none'; update(); } }

function buildModelSelector() {
    const sel = document.getElementById('model-selector'); if(!sel) return;
    let appModels = JSON.parse(localStorage.getItem('SLProModels_v1')) || {};
    sel.innerHTML = "";
    Object.keys(appModels).forEach(k => {
        sel.innerHTML += `<option value="${k}" ${k === activeModelKey ? 'selected' : ''}>${k}</option>`;
    });
    const mb = document.getElementById('model-body');
    if(mb) mb.value = appModels[activeModelKey] || "";
}

function update() {
    const tEl = document.getElementById('titre'); const titre = tEl ? tEl.value.trim() : "";
    const mEl = document.getElementById('mood'); const mood = mEl ? mEl.value.trim() : "";
    const mlEl = document.getElementById('mus-l'); const musL = mlEl ? mlEl.value.trim() : "";
    const mtEl = document.getElementById('mus-t'); const musT = mtEl ? mtEl.value.trim() : "";
    
    const cfg = JSON.parse(localStorage.getItem('SLProCfg_v7')) || {};
    let tagsArr = []; let has = false;

    let resTitreH = "", resTitreP = "";
    if(titre) { resTitreH += `📷 ${titre}\n`; resTitreP += `📷 ${titre}\n`; has = true; }
    if(mood) { resTitreH += `<i>"${mood}"</i>\n`; resTitreP += `"${mood}"\n`; has = true; }

    let resMusicH = "", resMusicP = "";
    if(musL) {
        resMusicH += `🎵 <b>Music</b> : <a href="${musL}">${musT || 'Listen'}</a>\n`;
        resMusicP += `🎵 Music : ${musT || 'Listen'} (${musL})\n`;
        has = true;
    }

    let compiledBlocks = { style: { h: "", p: "" }, decors: { h: "", p: "" } };
    let hasElements = { style: false, decors: false };
    
    [['style','STYLE'],['decors','DECORS']].forEach(b => {
        let directItems = []; let eventGroups = {}; 
        document.querySelectorAll(`#${b[0]}-container .dynamic-row`).forEach(r => {
            const brEl = r.querySelector('.row-b'); const br = brEl ? brEl.value.trim() : ""; 
            const artEl = r.querySelector('.row-n'); const art = artEl ? artEl.value.trim() : "";
            const catEl = r.querySelector('.row-cat'); const cat = catEl ? catEl.value : ""; 
            const slEl = r.querySelector('.row-sl'); const sl = slEl ? slEl.value.trim() : "";
            const isDB = slEl ? (slEl.dataset.isFromDB === "true") : false;
            
            const evCheckEl = r.querySelector('.row-ev-check'); const evCheck = evCheckEl ? evCheckEl.checked : false;
            const evNEl = r.querySelector('.row-ev-n'); const evN = evNEl ? evNEl.value.trim() : "";
            const evLEl = r.querySelector('.row-ev-l'); const evL = evLEl ? evLEl.value.trim() : "";

            if(br || art) { 
                has = true; hasElements[b[0]] = true; if(br) tagsArr.push(br.toLowerCase().replace(/\s+/g,'')); 
                const currentEmo = appCategories[cat] ? appCategories[cat].emo : "🔹";
                const currentTranslation = appCategories[cat] ? appCategories[cat].en : cat;

                let itemData = { cat: cat, emo: currentEmo, trans: currentTranslation, brand: br, article: art, slurl: sl, isDB: isDB };

                if(evCheck && evN) {
                    tagsArr.push(evN.toLowerCase().replace(/\s+/g,''));
                    if (!eventGroups[evN]) { eventGroups[evN] = { url: evL || "", items: [] }; }
                    eventGroups[evN].items.push(itemData);
                } else { directItems.push(itemData); }
            }
        });

        function formatSlurls(slurlStr, isFromDB) {
            if(!slurlStr) return { h: "", p: "" };
            const urls = slurlStr.split('|').map(u => u.trim()).filter(u => u);
            if(urls.length === 0) return { h: "", p: "" };
            let htmlParts = []; let plainParts = [];
            const baseLabel = isFromDB ? "Store" : "Link";
            urls.forEach((url, index) => {
                const label = urls.length > 1 ? `${baseLabel} ${index + 1}` : baseLabel;
                htmlParts.push(`<a href="${url}">${label}</a>`);
                plainParts.push(`${label}: ${url}`);
            });
            return { h: ` (${htmlParts.join(' | ')})`, p: ` (${plainParts.join(' | ')})` };
        }

        directItems.forEach(item => {
            let lineH = `${item.emo} <b>${item.trans}</b> : ${item.brand}${item.article ? ` | ${item.article}` : ""}`;
            let lineP = `${item.emo} ${item.trans} : ${item.brand}${item.article ? ` | ${item.article}` : ""}`;
            const links = formatSlurls(item.slurl, item.isDB);
            lineH += links.h; lineP += links.p;
            compiledBlocks[b[0]].h += lineH + "\n"; compiledBlocks[b[0]].p += lineP + "\n";
        });

        Object.keys(eventGroups).sort().forEach(evN => {
            const group = eventGroups[evN];
            group.items.forEach(item => {
                let lineH = `${item.emo} <b>${item.trans}</b> : ${item.brand}${item.article ? ` | ${item.article}` : ""}`;
                let lineP = `${item.emo} ${item.trans} : ${item.brand}${item.article ? ` | ${item.article}` : ""}`;
                const links = formatSlurls(item.slurl, item.isDB);
                lineH += links.h; lineP += links.p;
                compiledBlocks[b[0]].h += lineH + "\n"; compiledBlocks[b[0]].p += lineP + "\n";
            });

            if(group.url) {
                compiledBlocks[b[0]].h += `🛍️ <i>You can find these items at</i> <a href="${group.url}"><b>${evN}</b></a>\n`;
                compiledBlocks[b[0]].p += `🛍️ You can find these items at ${evN} (${group.url})\n`;
            } else {
                compiledBlocks[b[0]].h += `🛍️ <i>You can find these items at</i> <b>${evN}</b>\n`;
                compiledBlocks[b[0]].p += `🛍️ You can find these items at ${evN}\n`;
            }
        });
    });

    let resSettingsH = "", resSettingsP = ""; let hasSettings = false;
    const viEl = document.querySelector('input[name="vi"]:checked'); const vi = viEl ? viEl.value : ""; 
    const softEl = document.querySelector('input[name="soft"]:checked'); const soft = softEl ? softEl.value : ""; 
    const noteEl = document.getElementById('post-note'); const note = noteEl ? noteEl.value.trim() : "";
    
    if(vi || soft || note) { 
        has = true; hasSettings = true;
        if(vi) { resSettingsH += `💻 <b>Viewer</b> : ${vi}\n`; resSettingsP += `💻 Viewer : ${vi}\n`; }
        if(soft) { resSettingsH += `🎨 <b>Processing</b> : ${soft}\n`; resSettingsP += `🎨 Processing : ${soft}\n`; }
        if(note) { resSettingsH += `📝 <b>Notes</b> : ${note}\n`; resSettingsP += `📝 Notes : ${note}\n`; }
    }

    const socialKeys = [{id:'f',label:'Flickr'},{id:'p',label:'Primfeed'},{id:'i',label:'Instagram'},{id:'fb',label:'Facebook'},{id:'x',label:'X'},{id:'tk',label:'Tiktok'},{id:'rm',label:'ReezMe'},{id:'sp',label:'SecondPix'}];
    let hLinks = []; let pLinks = [];
    socialKeys.forEach(s => { if(cfg[s.id]) { hLinks.push(`<a href="${cfg[s.id]}">${s.label}</a>`); pLinks.push(`${s.label} (${cfg[s.id]})`); } });

    let resSocialH = hLinks.join(' | '); let resSocialP = pLinks.join('\n');

    const tmEl = document.getElementById('tags-manual');
    const mt = tmEl ? tmEl.value.split(',').map(t=>t.trim().toLowerCase().replace(/\s+/g,'')).filter(t=>t) : [];
    const pt = (cfg.tags || "").split(',').map(t=>t.trim().toLowerCase().replace(/\s+/g,'')).filter(t=>t);
    
    const textNone = (currentLang === "EN") ? "None." : "Aucun.";
    let permTagsDisp = document.getElementById('tags-permanent-display'); if(permTagsDisp) permTagsDisp.innerText = pt.join(' ') || textNone;
    let autoTagsDisp = document.getElementById('auto-tags-display'); if(autoTagsDisp) autoTagsDisp.innerText = [...new Set(tagsArr)].join(' ') || textNone;
    
    const tags = [...new Set([...tagsArr, ...mt, ...pt])].join(' ');

    let appModels = JSON.parse(localStorage.getItem('SLProModels_v1')) || {};
    let templateRaw = appModels[activeModelKey] || "{TITRE}\n{MUSIC}\n[STYLE]━━━━━━━━━━━ ✦ ━━━━━━━━━━━\n<b>STYLE</b>\n{STYLE}\n[/STYLE][DECORS]━━━━━━━━━━━ ✦ ━━━━━━━━━━━\n<b>DECORS</b>\n{DECORS}\n[/DECORS][SETTINGS]━━━━━━━━━━━ ✦ ━━━━━━━━━━━\n<b>⚙️ SETTINGS</b>\n{SETTINGS}\n[/SETTINGS][SOCIAL]━━━━━━━━━━━ ✦ ━━━━━━━━━━━\nFollow me on social media\n{SOCIAL}\n[/SOCIAL]\n[TAGS]━━━━━━━━━━━ ✦ ━━━━━━━━━━━\n<b>TAGS</b>\n{TAGS}[/TAGS]";
    templateRaw = templateRaw.replace(/[^\n]*{SOCIAL}/g, '\n{SOCIAL}');

    function renderSectionWithStructure(templateStr, startTag, endTag, isPresent, fallbackKeyword) {
        let regex = new RegExp(startTag.replace('[','\\[').replace(']','\\]') + '([\\s\\S]*?)' + endTag.replace('[','\\[').replace(']','\\]'), 'g');
        if (templateStr.match(regex)) { return templateStr.replace(regex, isPresent ? `$1` : ''); } 
        else {
            let lines = templateStr.split('\n'); let output = [];
            for(let i=0; i<lines.length; i++) {
                if (lines[i].includes(fallbackKeyword)) {
                    if(!isPresent) {
                        if(output.length > 0 && (output[output.length-1].toLowerCase().includes(fallbackKeyword.toLowerCase().replace('{','').replace('}','')) || output[output.length-1].includes('━') || output[output.length-1].includes('---'))) { output.pop(); }
                        continue;
                    }
                }
                output.push(lines[i]);
            }
            return output.join('\n');
        }
    }

    let templateH = templateRaw;
    templateH = renderSectionWithStructure(templateH, '[STYLE]', '[/STYLE]', hasElements.style, '{STYLE}');
    templateH = renderSectionWithStructure(templateH, '[DECORS]', '[/DECORS]', hasElements.decors, '{DECORS}');
    templateH = renderSectionWithStructure(templateH, '[SETTINGS]', '[/SETTINGS]', hasSettings, '{SETTINGS}');
    templateH = renderSectionWithStructure(templateH, '[SOCIAL]', '[/SOCIAL]', hLinks.length > 0, '{SOCIAL}');
    templateH = renderSectionWithStructure(templateH, '[TAGS]', '[/TAGS]', tags.trim().length > 0, '{TAGS}');

    let templateP = templateRaw.replace(/<b>/g, '').replace(/<\/b>/g, '').replace(/<i>/g, '').replace(/<\/i>/g, '');
    templateP = renderSectionWithStructure(templateP, '[STYLE]', '[/STYLE]', hasElements.style, '{STYLE}');
    templateP = renderSectionWithStructure(templateP, '[DECORS]', '[/DECORS]', hasElements.decors, '{DECORS}');
    templateP = renderSectionWithStructure(templateP, '[SETTINGS]', '[/SETTINGS]', hasSettings, '{SETTINGS}');
    templateP = renderSectionWithStructure(templateP, '[SOCIAL]', '[/SOCIAL]', pLinks.length > 0, '{SOCIAL}');
    templateP = renderSectionWithStructure(templateP, '[TAGS]', '[/TAGS]', tags.trim().length > 0, '{TAGS}');

    let finalH = templateH
        .replace(/{TITRE}/g, resTitreH.trim()).replace(/{MUSIC}/g, resMusicH.trim())
        .replace(/{STYLE}/g, compiledBlocks.style.h.trim()).replace(/{DECORS}/g, compiledBlocks.decors.h.trim())
        .replace(/{SETTINGS}/g, resSettingsH.trim()).replace(/{SOCIAL}/g, resSocialH.trim()).replace(/{TAGS}/g, tags.trim());

    let cleanTitreP = resTitreP.trim().replace(/<[^>]*>/g, ''); let cleanMusicP = resMusicP.trim().replace(/<[^>]*>/g, '');
    let cleanStyleP = compiledBlocks.style.p.trim().replace(/<[^>]*>/g, ''); let cleanDecorsP = compiledBlocks.decors.p.trim().replace(/<[^>]*>/g, '');
    let cleanSettingsP = resSettingsP.trim().replace(/<[^>]*>/g, ''); let cleanSocialP = resSocialP.trim().replace(/<[^>]*>/g, '');

    let finalP = templateP
        .replace(/{TITRE}/g, cleanTitreP).replace(/{MUSIC}/g, cleanMusicP)
        .replace(/{STYLE}/g, cleanStyleP).replace(/{DECORS}/g, cleanDecorsP)
        .replace(/{SETTINGS}/g, cleanSettingsP).replace(/{SOCIAL}/g, cleanSocialP).replace(/{TAGS}/g, "");

    finalH = finalH.replace(/\n{3,}/g, '\n\n'); finalP = finalP.replace(/\r\n/g, '\n').replace(/\r/g, '\n');
    const structuralTagsRegex = /\[\/?(STYLE|DECORS|SETTINGS|SOCIAL|TAGS)\]/g;
    finalH = finalH.replace(structuralTagsRegex, ''); finalP = finalP.replace(structuralTagsRegex, '');
    finalP = finalP.replace(/\n{3,}/g, '\n\n').trim();

    const rf = document.getElementById('render-f'); if(rf) rf.innerHTML = has ? finalH.replace(/\n/g, '<br>') : "";
    primfeedDataCache = has ? finalP : "";
    const rp = document.getElementById('render-p'); if(rp) rp.innerHTML = has ? finalP.replace(/\n/g, '<br>') : "";
}

function saveCfg() { 
    let d = {}; ["f","p","i","fb","x","tk","rm","sp"].forEach(k => { let el = document.getElementById('cfg-'+k); d[k] = el ? el.value : ""; }); 
    let tEl = document.getElementById('cfg-tags'); d.tags = tEl ? tEl.value : ""; 
    localStorage.setItem('SLProCfg_v7', JSON.stringify(d)); update(); 
}

function loadCfg() { 
    const d = JSON.parse(localStorage.getItem('SLProCfg_v7')); 
    if(d) { ["f","p","i","fb","x","tk","rm","sp"].forEach(k => { let el = document.getElementById('cfg-'+k); if(el) el.value = d[k] || ''; }); 
    let tEl = document.getElementById('cfg-tags'); if(tEl) tEl.value = d.tags || ''; update(); } 
}

function clearForm() { 
    if(confirm(uiDictionary[currentLang].confirmClear)) { 
        ['titre','mood','mus-l','mus-t','tags-manual','post-note'].forEach(id => { let el = document.getElementById(id); if(el) el.value = ''; }); 
        let scEl = document.getElementById('style-container'); if(scEl) scEl.innerHTML = ''; 
        let dcEl = document.getElementById('decors-container'); if(dcEl) dcEl.innerHTML = ''; 
        const radioViNone = document.querySelector('input[name="vi"][value=""]'); if(radioViNone) radioViNone.checked = true;
        const radioSoftNone = document.querySelector('input[name="soft"][value=""]'); if(radioSoftNone) radioSoftNone.checked = true;
        ["f","p","i","fb","x","tk","rm","sp"].forEach(k => { let el = document.getElementById('cfg-'+k); if(el) el.value = ''; });
        let ctEl = document.getElementById('cfg-tags'); if(ctEl) ctEl.value = '';
        saveCfg(); update(); 
    } 
}

function toggleOverlay(id) { let el = document.getElementById(id); if(el) el.style.display = (el.style.display === 'flex') ? 'none' : 'flex'; }
function toggleQA(id) { let el = document.getElementById(id); if(el) el.style.display = (el.style.display==='none')?'block':'none'; }
function renderDB() { 
    const sL = document.getElementById('list-sponsors'); if(sL) { sL.innerHTML = ""; Object.keys(sponsors).sort().forEach(k => { sL.innerHTML += `<div class="db-tag"><b>${sponsors[k].name}</b><div class="db-tag-actions"><span onclick="openEdit('s','${k}')" style="cursor:pointer">✏️</span><span onclick="delItem('spons','${k}')" style="cursor:pointer;color:var(--danger)">×</span></div></div>`; }); } 
    const eL = document.getElementById('list-events'); if(eL) { eL.innerHTML = ""; Object.keys(events).sort().forEach(k => { eL.innerHTML += `<div class="db-tag"><b>${events[k].name}</b><div class="db-tag-actions"><span onclick="openEdit('e','${k}')" style="cursor:pointer">✏️</span><span onclick="delItem('ev','${k}')" style="cursor:pointer;color:var(--danger)">×</span></div></div>`; }); } 
}

function renderDeadlines() { 
    const list = document.getElementById('list-deadlines'); if(!list) return; list.innerHTML = ''; deadlines.sort((a,b) => new Date(a.date) - new Date(b.date)); deadlines.forEach(dl => { const diff = Math.ceil((new Date(dl.date) - new Date()) / 86400000); list.innerHTML += `<div class="card" style="padding:15px; display:flex; justify-content:space-between; align-items:center;"><div><span class="dl-status ${diff<=2?'status-crit':diff<=5?'status-warn':'status-ok'}"></span><b>${dl.name}</b> - ${dl.date}</div><span style="cursor:pointer; color:var(--danger);" onclick="deleteDeadline(${dl.id})">×</span></div>`; }); 
}

function renderCustomCategories() { 
    const list = document.getElementById('list-custom-cats'); if(!list) return; list.innerHTML = ""; Object.keys(appCategories).forEach(k => { const currentType = appCategories[k].type === 'style' ? '✨ Style' : ((currentLang === "EN") ? '🏠 Decors' : '🏠 Décors'); list.innerHTML += `<div class="db-tag"><span>${appCategories[k].emo}</span> <b>${k} (${appCategories[k].en})</b> <small style="color:var(--accent); margin-left:5px;">[${currentType}]</small><div class="db-tag-actions"><span onclick="openCatEdit('${k}')" style="cursor:pointer">✏️</span><span onclick="deleteCategory('${k}')" style="cursor:pointer;color:var(--danger)">×</span></div></div>`; }); 
}

function checkDeadlinesAlert() { 
    const navDl = document.getElementById('nav-dl'); if(!navDl) return; const urgent = deadlines.some(dl => (new Date(dl.date) - new Date()) / 86400000 <= 2); urgent ? navDl.classList.add('badge-alert') : navDl.classList.remove('badge-alert'); 
}

function deleteDeadline(id) { deadlines = deadlines.filter(d => d.id !== id); localStorage.setItem('SLProDeadlines_v1', JSON.stringify(deadlines)); renderDeadlines(); checkDeadlinesAlert(); }

function delItem(type, k) { 
    if(!confirm(uiDictionary[currentLang].confirmDelItem)) return; 
    if(type==='spons') { delete sponsors[k]; } else { delete events[k]; }
    localStorage.setItem('SLProSpons_v7', JSON.stringify(sponsors)); localStorage.setItem('SLProEv_v7', JSON.stringify(events)); renderDB(); 
}

function openEdit(type, k) { 
    let eOvl = document.getElementById('edit-overlay'); if(eOvl) eOvl.style.display = 'flex'; 
    let eId = document.getElementById('edit-id'); if(eId) eId.value = k; 
    let eType = document.getElementById('edit-type'); if(eType) eType.value = type;
    const dict = uiDictionary[currentLang];
    if(type === 's') { 
        let eTitle = document.getElementById('edit-title'); if(eTitle) eTitle.innerText = dict.editTitleSpons + sponsors[k].name; 
        let eVal1 = document.getElementById('edit-val-1'); if(eVal1) eVal1.value = sponsors[k].slurl || ""; 
        let eLbl2 = document.getElementById('edit-lbl-2'); if(eLbl2) eLbl2.style.display = 'block'; 
        let eVal2 = document.getElementById('edit-val-2'); if(eVal2) { eVal2.style.display = 'block'; eVal2.value = sponsors[k].mgr || ""; }
    } else { 
        let eTitle = document.getElementById('edit-title'); if(eTitle) eTitle.innerText = dict.editTitleEv + events[k].name; 
        let eVal1 = document.getElementById('edit-val-1'); if(eVal1) eVal1.value = events[k].url || ""; 
        let eLbl2 = document.getElementById('edit-lbl-2'); if(eLbl2) eLbl2.style.display = 'none'; 
        let eVal2 = document.getElementById('edit-val-2'); if(eVal2) eVal2.style.display = 'none'; 
    }
}

function closeEdit() { let eOvl = document.getElementById('edit-overlay'); if(eOvl) eOvl.style.display = 'none'; }

function saveEdit() { 
    const kEl = document.getElementById('edit-id'); const k = kEl ? kEl.value : ""; 
    const tEl = document.getElementById('edit-type'); const type = tEl ? tEl.value : "";
    if(!k) return;
    if(type === 's') { 
        let v1El = document.getElementById('edit-val-1'); if(v1El) sponsors[k].slurl = v1El.value; 
        let v2El = document.getElementById('edit-val-2'); if(v2El) sponsors[k].mgr = v2El.value; 
        localStorage.setItem('SLProSpons_v7', JSON.stringify(sponsors)); 
    } else { 
        let v1El = document.getElementById('edit-val-1'); if(v1El) events[k].url = v1El.value; 
        localStorage.setItem('SLProEv_v7', JSON.stringify(events)); 
    }
    renderDB(); closeEdit();
}

function copyFlickr() { let rf = document.getElementById('render-f'); if(!rf) return; const cleanHTML = rf.innerHTML.replace(/<br>/g, '\n'); navigator.clipboard.writeText(cleanHTML); }

async function copyText() {
    if (!primfeedDataCache) return;
    const plainContent = primfeedDataCache;
    const htmlContent = primfeedDataCache.split('\n').map(line => {
        if (line.trim() === '') return '<p><br></p>';
        return `<p>${line.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')}</p>`;
    }).join('');

    const listener = function(e) {
        e.clipboardData.setData('text/html', htmlContent);
        e.clipboardData.setData('text/plain', plainContent);
        e.preventDefault();
    };
    document.addEventListener('copy', listener); document.execCommand('copy'); document.removeEventListener('copy', listener);
}

function toggleTheme() { document.body.classList.toggle('light-theme'); }

function openCatEdit(k) {
    const catData = appCategories[k]; if (!catData) return;
    let cOk = document.getElementById('cat-edit-old-key'); if(cOk) cOk.value = k;
    let cId = document.getElementById('cat-edit-id'); if(cId) cId.value = k;
    let cEn = document.getElementById('cat-edit-en'); if(cEn) cEn.value = catData.en || k;
    let cEmo = document.getElementById('cat-edit-emo'); if(cEmo) cEmo.value = catData.emo || "🔹";
    let cType = document.getElementById('cat-edit-type'); if(cType) cType.value = catData.type || "decors";
    let cOvl = document.getElementById('cat-edit-overlay'); if(cOvl) cOvl.style.display = 'flex';
}

function closeCatEdit() { let cOvl = document.getElementById('cat-edit-overlay'); if(cOvl) cOvl.style.display = 'none'; }

function saveCatEdit() {
    const oldKeyEl = document.getElementById('cat-edit-old-key'); const oldKey = oldKeyEl ? oldKeyEl.value : "";
    const newKeyEl = document.getElementById('cat-edit-id'); const newKey = newKeyEl ? newKeyEl.value.trim() : "";
    const newEnEl = document.getElementById('cat-edit-en'); const newEn = newEnEl ? newEnEl.value.trim() : "";
    const newEmoEl = document.getElementById('cat-edit-emo'); const newEmo = newEmoEl ? newEmoEl.value.trim() : "";
    const newTypeEl = document.getElementById('cat-edit-type'); const newType = newTypeEl ? newTypeEl.value : "";

    if (!newKey || !newEn) { alert(uiDictionary[currentLang].alertCatRequired); return; }
    if (newKey !== oldKey) { delete appCategories[oldKey]; }
    appCategories[newKey] = { emo: newEmo || "🔹", en: newEn, type: newType };
    localStorage.setItem('SLProCategories_v1', JSON.stringify(appCategories));
    closeCatEdit(); renderCustomCategories(); update();
}

function addCustomCategory() {
    const fNameEl = document.getElementById('new-cat-id'); const fName = fNameEl ? fNameEl.value.trim() : "";
    const eNameEl = document.getElementById('new-cat-en'); const eName = eNameEl ? eNameEl.value.trim() : "";
    const emoEl = document.getElementById('new-cat-emo'); const emo = emoEl ? emoEl.value.trim() : "";
    const typeEl = document.getElementById('new-cat-type'); const type = typeEl ? typeEl.value : "";
    
    if(!fName || !eName) return;
    appCategories[fName] = { emo: emo || "🔹", en: eName, type: type };
    localStorage.setItem('SLProCategories_v1', JSON.stringify(appCategories));
    
    if(fNameEl) fNameEl.value = ''; if(eNameEl) eNameEl.value = ''; if(emoEl) emoEl.value = '';
    renderCustomCategories(); update();
}

function deleteCategory(k) {
    const msg = uiDictionary[currentLang].confirmDelCat ? uiDictionary[currentLang].confirmDelCat.replace('{k}', k) : "Delete?";
    if(!confirm(msg)) return;
    delete appCategories[k];
    localStorage.setItem('SLProCategories_v1', JSON.stringify(appCategories));
    renderCustomCategories(); update();
}

function exportData() { 
    let appModels = JSON.parse(localStorage.getItem('SLProModels_v1')) || {};
    const blob = new Blob([JSON.stringify({ sponsors, events, deadlines, categories: appCategories, models: appModels, activeModel: activeModelKey, config: JSON.parse(localStorage.getItem('SLProCfg_v7')) }, null, 2)], {type: 'application/json'}); 
    const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = `backup_proflow.json`; a.click(); 
}

function importData(event) {
    const file = event.target.files[0]; if (!file) return;
    const reader = new FileReader(); reader.onload = (e) => {
        const data = JSON.parse(e.target.result);
        if(confirm(uiDictionary[currentLang].confirmImport)) {
            localStorage.setItem('SLProSpons_v7', JSON.stringify(data.sponsors || {}));
            localStorage.setItem('SLProEv_v7', JSON.stringify(data.events || {}));
            localStorage.setItem('SLProDeadlines_v1', JSON.stringify(data.deadlines || []));
            localStorage.setItem('SLProCategories_v1', JSON.stringify(data.categories || defaultCats));
            localStorage.setItem('SLProModels_v1', JSON.stringify(data.models || {}));
            localStorage.setItem('SLProActiveModel_v1', data.activeModel || "Modèle Standard (Diamants)");
            localStorage.setItem('SLProCfg_v7', JSON.stringify(data.config || {}));
            location.reload();
        }
    }; reader.readAsText(file);
}
