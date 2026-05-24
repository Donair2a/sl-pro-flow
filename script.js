const APP_VERSION = "1.3.18";

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

    const staticStyleKeys = ["Outfit","Corps","Shape","Peau","Tête","Cheveux","Yeux","Barbe","Tatouage","Maquillage","Haut","Bas","Robe","Chaussures","Chapeau","Bijoux","Accessoire"];
    Object.keys(appCategories).forEach(k => {
        if (staticStyleKeys.includes(k)) {
            appCategories[k].type = "style";
        } else if (!appCategories[k].type) {
            appCategories[k].type = "decors";
        }
    });
    localStorage.setItem('SLProCategories_v1', JSON.stringify(appCategories));

    const defaultModels = {
        "Modèle Standard (Diamants)": "{TITRE}\n{MUSIC}\n[STYLE]━━━━━━━━━━━ ✦ ━━━━━━━━━━━\n<b>STYLE</b>\n{STYLE}\n[/STYLE][DECORS]━━━━━━━━━━━ ✦ ━━━━━━━━━━━\n<b>DECORS</b>\n{DECORS}\n[/DECORS][SETTINGS]━━━━━━━━━━━ ✦ ━━━━━━━━━━━\n<b>⚙️ SETTINGS</b>\n{SETTINGS}\n[/SETTINGS][SOCIAL]━━━━━━━━━━━ ✦ ━━━━━━━━━━━\nFollow me on social media\n{SOCIAL}\n[/SOCIAL]\n[TAGS]━━━━━━━━━━━ ✦ ━━━━━━━━━━━\n<b>TAGS</b>\n{TAGS}[/TAGS]",
        "Modèle Compact": "{TITRE} {MUSIC}\n[STYLE]🔹 STYLE\n{STYLE}\n[/STYLE][DECORS]🔹 DECORS\n{DECORS}\n[/DECORS][SETTINGS]🔹 SETTINGS\n{SETTINGS}\n[/SETTINGS][SOCIAL]🌐\n{SOCIAL}\n[/SOCIAL][TAGS]🏷️ {TAGS}[/TAGS]",
        "Modèle Épuré (Lignes Simples)": "{TITRE}\n{MUSIC}\n[STYLE]-----------------------\n{STYLE}\n[/STYLE][DECORS]-----------------------\n{DECORS}\n[/DECORS][SETTINGS]-----------------------\n{SETTINGS}\n[/SETTINGS][SOCIAL]-----------------------\n{SOCIAL}\n[/SOCIAL]\n[TAGS]{TAGS}[/TAGS]"
    };
    let appModels = JSON.parse(localStorage.getItem('SLProModels_v1')) || defaultModels;
    
    if (!appModels["Modèle Standard (Diamants)"]) {
        appModels["Modèle Standard (Diamants)"] = defaultModels["Modèle Standard (Diamants)"];
    }
    
    let activeModelKey = localStorage.getItem('SLProActiveModel_v1') || "Modèle Standard (Diamants)";
    if (!appModels[activeModelKey]) {
        activeModelKey = "Modèle Standard (Diamants)";
    }
    
    let lastKey = "";
    let primfeedDataCache = "";

    window.onload = () => { 
        document.getElementById('app-version-display').innerText = "v" + APP_VERSION;
        loadCfg(); renderDB(); renderDeadlines(); checkDeadlinesAlert(); renderCustomCategories(); buildModelSelector(); update(); 
        window.addEventListener('keydown', (e) => { lastKey = e.key; }); 
    };

    function sidebarNavigate(blockId, btn) { showMainTab('tab-editor', document.getElementById('nav-editor')); showBlock(blockId, btn); }
    
    function showMainTab(id, btn) { 
        document.querySelectorAll('.tab-content').forEach(t => t.classList.remove('active')); 
        document.querySelectorAll('nav .nav-link').forEach(l => l.classList.remove('active')); 
        document.getElementById(id).classList.add('active'); 
        btn.classList.add('active'); 
        
        const previewBox = document.getElementById('main-previews');
        if (id === 'tab-config') {
            previewBox.style.display = 'none';
        } else {
            previewBox.style.display = 'flex';
        }
        renderDB(); 
    }
    
    function showBlock(id, btn) { document.querySelectorAll('.editor-block').forEach(b => b.classList.remove('active')); document.querySelectorAll('.sidebar-btn').forEach(b => b.classList.remove('active')); document.getElementById(id).classList.add('active'); btn.classList.add('active'); }

    function handleSmartInput(input, type) {
        const val = input.value.trim(); const row = input.closest('.dynamic-row'); const saveBtn = row.querySelector(type === 'spons' ? '.btn-save-express' : '.btn-save-ev');
        if (lastKey === "Backspace" || lastKey === "Delete") return;
        const data = (type === 'spons') ? sponsors : events;
        const matchKey = Object.keys(data).find(k => k.startsWith(val.toLowerCase()));
        if (val.length >= 3 && matchKey) {
            const entry = data[matchKey]; input.value = entry.name;
            if (type === 'spons') { row.querySelector('.row-sl').value = entry.slurl || ""; row.querySelector('.row-sl').dataset.isFromDB = "true"; row.querySelector('.row-mgr').value = entry.mgr || ""; }
            else if (type === 'ev') { row.querySelector('.row-ev-l').value = entry.url || ""; row.querySelector('.row-ev-l').dataset.isFromDB = "true"; }
            if(saveBtn) saveBtn.style.display = 'none'; update();
        } else if (val.length >= 2) { if(saveBtn) saveBtn.style.display = 'inline-block'; }
    }

    function saveExpress(btn, type) {
        const row = btn.closest('.dynamic-row'); 
        if (type === 'spons') {
            const name = row.querySelector('.row-b').value.trim();
            if (!name) return;
            sponsors[name.toLowerCase()] = { name, slurl: row.querySelector('.row-sl').value.trim(), mgr: row.querySelector('.row-mgr').value.trim() };
            localStorage.setItem('SLProSpons_v7', JSON.stringify(sponsors));
            row.querySelector('.row-sl').dataset.isFromDB = "true";
        } else {
            const name = row.querySelector('.row-ev-n').value.trim();
            if (!name) return;
            events[name.toLowerCase()] = { name, url: row.querySelector('.row-ev-l').value.trim() };
            localStorage.setItem('SLProEv_v7', JSON.stringify(events));
            row.querySelector('.row-ev-l').dataset.isFromDB = "true";
        }
        btn.style.display = 'none';
        update();
    }

    function addDynamicRowFromStorage(target, defaultValue) {
        const allKeys = Object.keys(appCategories);
        let filteredKeys = allKeys.filter(k => {
            const catInfo = appCategories[k];
            const catType = (catInfo && catInfo.type) ? catInfo.type : "decors";
            return catType === target;
        });
        addDynamicRow(target, defaultValue, filteredKeys);
    }

    function addDynamicRow(t, d, cats) {
        const id = Math.random().toString(36).substr(2, 5); const div = document.createElement('div'); div.className = 'dynamic-row';
        div.innerHTML = `<button class="btn-del-row" onclick="this.parentElement.remove();update()">×</button>
            <div style="display:flex; gap:10px; margin-bottom:10px;">
                <div style="flex:0.5"><label>Catégorie</label><select class="row-cat" onchange="update()">${cats.map(c => `<option value="${c}" ${c===d?'selected':''}>${c}</option>`).join('')}</select></div>
                <div style="flex:1"><label>Marque <button class="btn-save-express" onclick="saveExpress(this, 'spons')">💾</button></label><input type="text" class="row-b" placeholder="Nom..." oninput="handleSmartInput(this, 'spons')"></div>
                <div style="flex:1"><label>Article</label><input type="text" class="row-n" placeholder="Article..." oninput="update()"></div>
            </div>
            <div style="display:flex; gap:10px;">
                <div style="flex:1"><input type="text" class="row-sl" placeholder="SLURL (Séparez par | si plusieurs)..." oninput="this.dataset.isFromDB='false';update()"></div>
                <div style="flex:0.8"><input type="text" class="row-mgr" placeholder="Manager..." oninput="update()"></div>
            </div>
            <div style="margin-top:10px;">
                <label style="display:inline-flex; align-items:center; gap:8px; font-size:0.75rem; color:var(--accent); cursor:pointer;">
                    <input type="checkbox" class="row-ev-check" onchange="toggleEv('${id}')" style="width:auto; margin:0;"> L'article est disponible dans un event ?
                </label>
            </div>
            <div id="ev-box-${id}" style="display:none; margin-top:10px; gap:10px;">
                <div style="flex:1"><label>Nom Event <button class="btn-save-express btn-save-ev" onclick="saveExpress(this, 'ev')">💾</button></label><input type="text" class="row-ev-n" placeholder="Nom Event..." oninput="handleSmartInput(this, 'ev')"></div>
                <div style="flex:1"><label>Lien Event</label><input type="text" class="row-ev-l" placeholder="Lien Event..." oninput="this.dataset.isFromDB='false';update()"></div>
            </div>`;
        document.getElementById(t + '-container').appendChild(div);
    }

    function toggleEv(id) { let el = document.getElementById(`ev-box-${id}`); el.style.display = el.style.display==='none'?'flex':'none'; update(); }

    function buildModelSelector() {
        const sel = document.getElementById('model-selector'); sel.innerHTML = "";
        Object.keys(appModels).forEach(k => {
            sel.innerHTML += `<option value="${k}" ${k === activeModelKey ? 'selected' : ''}>${k}</option>`;
        });
        document.getElementById('model-body').value = appModels[activeModelKey] || "";
    }

    function switchModel(k) {
        activeModelKey = k;
        localStorage.setItem('SLProActiveModel_v1', k);
        document.getElementById('model-body').value = appModels[k] || "";
        update();
    }

    function saveCurrentModelText() {
        appModels[activeModelKey] = document.getElementById('model-body').value;
        localStorage.setItem('SLProModels_v1', JSON.stringify(appModels));
        update();
    }

    function injectTagAtCursor(tag) {
        const txtArea = document.getElementById('model-body');
        const startPos = txtArea.selectionStart;
        const endPos = txtArea.selectionEnd;
        const currentText = txtArea.value;
        
        txtArea.value = currentText.substring(0, startPos) + tag + currentText.substring(endPos, currentText.length);
        
        txtArea.focus();
        txtArea.selectionStart = startPos + tag.length;
        txtArea.selectionEnd = startPos + tag.length;
        
        saveCurrentModelText();
    }

    function createNewModel() {
        const nameInput = document.getElementById('new-model-name');
        const name = nameInput.value.trim();
        if(!name) {
            alert("Veuillez donner un nom à votre nouveau modèle.");
            return;
        }
        const currentStructure = document.getElementById('model-body').value;
        appModels[name] = currentStructure;
        localStorage.setItem('SLProModels_v1', JSON.stringify(appModels));
        nameInput.value = "";
        buildModelSelector();
        switchModel(name);
    }

    function update() {
        const titre = document.getElementById('titre').value.trim(); const mood = document.getElementById('mood').value.trim();
        const musL = document.getElementById('mus-l').value.trim(); const musT = document.getElementById('mus-t').value.trim();
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
            let directItems = [];
            let eventGroups = {}; 

            document.querySelectorAll(`#${b[0]}-container .dynamic-row`).forEach(r => {
                const br = r.querySelector('.row-b').value.trim(); const art = r.querySelector('.row-n').value.trim();
                const cat = r.querySelector('.row-cat').value; const sl = r.querySelector('.row-sl').value.trim();
                const isDB = r.querySelector('.row-sl').dataset.isFromDB === "true";
                const evCheck = r.querySelector('.row-ev-check')?.checked;
                const evN = r.querySelector('.row-ev-n')?.value.trim();
                const evL = r.querySelector('.row-ev-l')?.value.trim();

                if(br || art) { 
                    has = true; hasElements[b[0]] = true; if(br) tagsArr.push(br.toLowerCase().replace(/\s+/g,'')); 
                    const currentEmo = appCategories[cat] ? appCategories[cat].emo : "🔹";
                    const currentTranslation = appCategories[cat] ? appCategories[cat].en : cat;

                    let itemData = {
                        cat: cat,
                        emo: currentEmo,
                        trans: currentTranslation,
                        brand: br,
                        article: art,
                        slurl: sl,
                        isDB: isDB
                    };

                    if(evCheck && evN) {
                        tagsArr.push(evN.toLowerCase().replace(/\s+/g,''));
                        if (!eventGroups[evN]) {
                            eventGroups[evN] = { url: evL || "", items: [] };
                        }
                        eventGroups[evN].items.push(itemData);
                    } else {
                        directItems.push(itemData);
                    }
                }
            });

            function formatSlurls(slurlStr, isFromDB) {
                if(!slurlStr) return { h: "", p: "" };
                const urls = slurlStr.split('|').map(u => u.trim()).filter(u => u);
                if(urls.length === 0) return { h: "", p: "" };
                
                let htmlParts = [];
                let plainParts = [];
                const baseLabel = isFromDB ? "Store" : "Link";
                
                urls.forEach((url, index) => {
                    const label = urls.length > 1 ? `${baseLabel} ${index + 1}` : baseLabel;
                    htmlParts.push(`<a href="${url}">${label}</a>`);
                    plainParts.push(`${label}: ${url}`);
                });
                
                return {
                    h: ` (${htmlParts.join(' | ')})`,
                    p: ` (${plainParts.join(' | ')})`
                };
            }

            directItems.forEach(item => {
                let lineH = `${item.emo} <b>${item.trans}</b> : ${item.brand}${item.article ? ` | ${item.article}` : ""}`;
                let lineP = `${item.emo} ${item.trans} : ${item.brand}${item.article ? ` | ${item.article}` : ""}`;
                
                const links = formatSlurls(item.slurl, item.isDB);
                lineH += links.h; 
                lineP += links.p;
                
                compiledBlocks[b[0]].h += lineH + "\n"; compiledBlocks[b[0]].p += lineP + "\n";
            });

            Object.keys(eventGroups).sort().forEach(evN => {
                const group = eventGroups[evN];
                
                group.items.forEach(item => {
                    let lineH = `${item.emo} <b>${item.trans}</b> : ${item.brand}${item.article ? ` | ${item.article}` : ""}`;
                    let lineP = `${item.emo} ${item.trans} : ${item.brand}${item.article ? ` | ${item.article}` : ""}`;
                    
                    const links = formatSlurls(item.slurl, item.isDB);
                    lineH += links.h; 
                    lineP += links.p;
                    
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

        let resSettingsH = "", resSettingsP = "";
        let hasSettings = false;
        const vi = document.querySelector('input[name="vi"]:checked')?.value; const soft = document.querySelector('input[name="soft"]:checked')?.value; const note = document.getElementById('post-note').value.trim();
        if(vi || soft || note) { 
            has = true; hasSettings = true;
            if(vi) { resSettingsH += `💻 <b>Viewer</b> : ${vi}\n`; resSettingsP += `💻 Viewer : ${vi}\n`; }
            if(soft) { resSettingsH += `🎨 <b>Processing</b> : ${soft}\n`; resSettingsP += `🎨 Processing : ${soft}\n`; }
            if(note) { resSettingsH += `📝 <b>Notes</b> : ${note}\n`; resSettingsP += `📝 Notes : ${note}\n`; }
        }

        const socialKeys = [{id:'f',label:'Flickr'},{id:'p',label:'Primfeed'},{id:'i',label:'Instagram'},{id:'fb',label:'Facebook'},{id:'x',label:'X'},{id:'tk',label:'Tiktok'}];
        let hLinks = []; let pLinks = [];
        socialKeys.forEach(s => { 
            if(cfg[s.id]) { 
                hLinks.push(`<a href="${cfg[s.id]}">${s.label}</a>`); 
                pLinks.push(`${s.label} (${cfg[s.id]})`); 
            } 
        });

        let resSocialH = hLinks.join('\n');
        let resSocialP = pLinks.join('\n');

        const mt = document.getElementById('tags-manual').value.split(',').map(t=>t.trim().toLowerCase().replace(/\s+/g,'')).filter(t=>t);
        const pt = (cfg.tags || "").split(',').map(t=>t.trim().toLowerCase().replace(/\s+/g,'')).filter(t=>t);
        document.getElementById('tags-permanent-display').innerText = pt.join(' ') || "Aucun.";
        document.getElementById('auto-tags-display').innerText = [...new Set(tagsArr)].join(' ') || "Aucun.";
        const tags = [...new Set([...tagsArr, ...mt, ...pt])].join(' ');

        let templateRaw = appModels[activeModelKey] || defaultModels["Modèle Standard (Diamants)"];
        
        templateRaw = templateRaw.replace(/[^\n]*{SOCIAL}/g, '\n{SOCIAL}');

        function renderSectionWithStructure(templateStr, startTag, endTag, isPresent, fallbackKeyword) {
            let regex = new RegExp(startTag.replace('[','\\[').replace(']','\\]') + '([\\s\\S]*?)' + endTag.replace('[','\\[').replace(']','\\]'), 'g');
            
            if (templateStr.match(regex)) {
                return templateStr.replace(regex, isPresent ? `$1` : '');
            } else {
                let lines = templateStr.split('\n');
                let output = [];
                for(let i=0; i<lines.length; i++) {
                    if (lines[i].includes(fallbackKeyword)) {
                        if(!isPresent) {
                            if(output.length > 0 && (output[output.length-1].toLowerCase().includes(fallbackKeyword.toLowerCase().replace('{','').replace('}','')) || output[output.length-1].includes('━') || output[output.length-1].includes('---'))) {
                                output.pop();
                            }
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
            .replace(/{TITRE}/g, resTitreH.trim())
            .replace(/{MUSIC}/g, resMusicH.trim())
            .replace(/{STYLE}/g, compiledBlocks.style.h.trim())
            .replace(/{DECORS}/g, compiledBlocks.decors.h.trim())
            .replace(/{SETTINGS}/g, resSettingsH.trim())
            .replace(/{SOCIAL}/g, resSocialH.trim())
            .replace(/{TAGS}/g, tags.trim());

        let cleanTitreP = resTitreP.trim().replace(/<[^>]*>/g, '');
        let cleanMusicP = resMusicP.trim().replace(/<[^>]*>/g, '');
        let cleanStyleP = compiledBlocks.style.p.trim().replace(/<[^>]*>/g, '');
        let cleanDecorsP = compiledBlocks.decors.p.trim().replace(/<[^>]*>/g, '');
        let cleanSettingsP = resSettingsP.trim().replace(/<[^>]*>/g, '');
        let cleanSocialP = resSocialP.trim().replace(/<[^>]*>/g, '');

        let finalP = templateP
            .replace(/{TITRE}/g, cleanTitreP)
            .replace(/{MUSIC}/g, cleanMusicP)
            .replace(/{STYLE}/g, cleanStyleP)
            .replace(/{DECORS}/g, cleanDecorsP)
            .replace(/{SETTINGS}/g, cleanSettingsP)
            .replace(/{SOCIAL}/g, cleanSocialP)
            .replace(/{TAGS}/g, "");

        finalH = finalH.replace(/\n{3,}/g, '\n\n');
        finalP = finalP.replace(/\r\n/g, '\n').replace(/\r/g, '\n');

        const structuralTagsRegex = /\[\/?(STYLE|DECORS|SETTINGS|SOCIAL|TAGS)\]/g;
        finalH = finalH.replace(structuralTagsRegex, '');
        finalP = finalP.replace(structuralTagsRegex, '');

        // NETTOYAGE PROFOND : Suppression des lignes blanches résiduelles excessives dans Primfeed
        finalP = finalP.replace(/\n{3,}/g, '\n\n').trim();

        document.getElementById('render-f').innerHTML = has ? finalH.replace(/\n/g, '<br>') : "";
        
        // Stockage de la chaîne BRUTE (avec \n) pour la copie fidéle
        primfeedDataCache = has ? finalP : "";
        
        // Affichage visuel (HTML) avec <br> pour garder la mise en page de l'aperçu
        document.getElementById('render-p').innerHTML = has ? finalP.replace(/\n/g, '<br>') : "";
    }

    function renderDB() {
        const sL = document.getElementById('list-sponsors'); sL.innerHTML = "";
        Object.keys(sponsors).sort().forEach(k => { sL.innerHTML += `<div class="db-tag"><b>${sponsors[k].name}</b><div class="db-tag-actions"><span onclick="openEdit('s','${k}')" style="cursor:pointer">✏️</span><span onclick="delItem('spons','${k}')" style="cursor:pointer;color:var(--danger)">×</span></div></div>`; });
        const eL = document.getElementById('list-events'); eL.innerHTML = "";
        Object.keys(events).sort().forEach(k => { eL.innerHTML += `<div class="db-tag"><b>${events[k].name}</b><div class="db-tag-actions"><span onclick="openEdit('e','${k}')" style="cursor:pointer">✏️</span><span onclick="delItem('ev','${k}')" style="cursor:pointer;color:var(--danger)">×</span></div></div>`; });
    }
    
    function renderCustomCategories() {
        const list = document.getElementById('list-custom-cats'); list.innerHTML = "";
        Object.keys(appCategories).forEach(k => {
            const currentType = appCategories[k].type === 'style' ? '✨ Style' : '🏠 Décors';
            list.innerHTML += `<div class="db-tag"><span>${appCategories[k].emo}</span> <b>${k} (${appCategories[k].en})</b> <small style="color:var(--accent); margin-left:5px;">[${currentType}]</small><div class="db-tag-actions"><span onclick="openCatEdit('${k}')" style="cursor:pointer">✏️</span><span onclick="deleteCategory('${k}')" style="cursor:pointer;color:var(--danger)">×</span></div></div>`;
        });
    }

    function openCatEdit(k) {
        const catData = appCategories[k];
        if (!catData) return;
        
        document.getElementById('cat-edit-old-key').value = k;
        document.getElementById('cat-edit-id').value = k;
        document.getElementById('cat-edit-en').value = catData.en || k;
        document.getElementById('cat-edit-emo').value = catData.emo || "🔹";
        document.getElementById('cat-edit-type').value = catData.type || "decors";
        
        document.getElementById('cat-edit-overlay').style.display = 'flex';
    }

    function closeCatEdit() {
        document.getElementById('cat-edit-overlay').style.display = 'none';
    }

    function saveCatEdit() {
        const oldKey = document.getElementById('cat-edit-old-key').value;
        const newKey = document.getElementById('cat-edit-id').value.trim();
        const newEn = document.getElementById('cat-edit-en').value.trim();
        const newEmo = document.getElementById('cat-edit-emo').value.trim();
        const newType = document.getElementById('cat-edit-type').value;

        if (!newKey || !newEn) {
            alert("Le nom français et la traduction anglaise sont obligatoires.");
            return;
        }

        if (newKey !== oldKey) {
            delete appCategories[oldKey];
        }

        appCategories[newKey] = {
            emo: newEmo || "🔹",
            en: newEn,
            type: newType
        };

        localStorage.setItem('SLProCategories_v1', JSON.stringify(appCategories));
        closeCatEdit();
        renderCustomCategories();
        update();
    }

    function addCustomCategory() {
        const fName = document.getElementById('new-cat-id').value.trim();
        const eName = document.getElementById('new-cat-en').value.trim();
        const emo = document.getElementById('new-cat-emo').value.trim();
        const type = document.getElementById('new-cat-type').value; 
        
        if(!fName || !eName) return;
        
        appCategories[fName] = { emo: emo || "🔹", en: eName, type: type };
        localStorage.setItem('SLProCategories_v1', JSON.stringify(appCategories));
        
        document.getElementById('new-cat-id').value = ''; document.getElementById('new-cat-en').value = ''; document.getElementById('new-cat-emo').value = '';
        renderCustomCategories(); update();
    }

    function deleteCategory(k) {
        if(!confirm(`Supprimer la catégorie "${k}" ?`)) return;
        delete appCategories[k];
        localStorage.setItem('SLProCategories_v1', JSON.stringify(appCategories));
        renderCustomCategories(); update();
    }

    function saveQuick(type) {
        if(type==='spons') { let n = document.getElementById('qs-n').value.trim(); if(!n) return; sponsors[n.toLowerCase()] = { name: n, mgr: document.getElementById('qs-m').value.trim(), slurl: document.getElementById('qs-l').value.trim() }; localStorage.setItem('SLProSpons_v7', JSON.stringify(sponsors)); }
        else { let n = document.getElementById('qe-n').value.trim(); if(!n) return; events[n.toLowerCase()] = { name: n, url: document.getElementById('qe-l').value.trim() }; localStorage.setItem('SLProEv_v7', JSON.stringify(events)); }
        renderDB();
    }
    function addDeadline() { const n = document.getElementById('dl-name').value; const d = document.getElementById('dl-date').value; if(n && d) { deadlines.push({ id: Date.now(), name: n, date: d }); localStorage.setItem('SLProDeadlines_v1', JSON.stringify(deadlines)); renderDeadlines(); checkDeadlinesAlert(); } }
    function renderDeadlines() {
        const list = document.getElementById('list-deadlines'); list.innerHTML = ''; deadlines.sort((a,b) => new Date(a.date) - new Date(b.date));
        deadlines.forEach(dl => { const diff = Math.ceil((new Date(dl.date) - new Date()) / 86400000); list.innerHTML += `<div class="card" style="padding:15px; display:flex; justify-content:space-between; align-items:center;"><div><span class="dl-status ${diff<=2?'status-crit':diff<=5?'status-warn':'status-ok'}"></span><b>${dl.name}</b> - ${dl.date}</div><span style="cursor:pointer; color:var(--danger);" onclick="deleteDeadline(${dl.id})">×</span></div>`; });
    }
    function checkDeadlinesAlert() { const navDl = document.getElementById('nav-dl'); const urgent = deadlines.some(dl => (new Date(dl.date) - new Date()) / 86400000 <= 2); urgent ? navDl.classList.add('badge-alert') : navDl.classList.remove('badge-alert'); }
    function deleteDeadline(id) { deadlines = deadlines.filter(d => d.id !== id); localStorage.setItem('SLProDeadlines_v1', JSON.stringify(deadlines)); renderDeadlines(); checkDeadlinesAlert(); }
    function openEdit(type, k) {
        document.getElementById('edit-overlay').style.display = 'flex'; document.getElementById('edit-id').value = k; document.getElementById('edit-type').value = type;
        if(type === 's') { document.getElementById('edit-title').innerText = "Editer : " + sponsors[k].name; document.getElementById('edit-val-1').value = sponsors[k].slurl || ""; document.getElementById('edit-lbl-2').style.display = 'block'; document.getElementById('edit-val-2').style.display = 'block'; document.getElementById('edit-val-2').value = sponsors[k].mgr || ""; }
        else { document.getElementById('edit-title').innerText = "Editer : " + events[k].name; document.getElementById('edit-val-1').value = events[k].url || ""; document.getElementById('edit-lbl-2').style.display = 'none'; document.getElementById('edit-val-2').style.display = 'none'; }
    }
    function closeEdit() { document.getElementById('edit-overlay').style.display = 'none'; }
    function saveEdit() {
        const k = document.getElementById('edit-id').value; const type = document.getElementById('edit-type').value;
        if(type === 's') { sponsors[k].slurl = document.getElementById('edit-val-1').value; sponsors[k].mgr = document.getElementById('edit-val-2').value; localStorage.setItem('SLProSpons_v7', JSON.stringify(sponsors)); }
        else { events[k].url = document.getElementById('edit-val-1').value; localStorage.setItem('SLProEv_v7', JSON.stringify(events)); }
        renderDB(); closeEdit();
    }
    function saveCfg() { let d = {}; ["f","p","i","fb","x","tk"].forEach(k => { d[k] = document.getElementById('cfg-'+k).value; }); d.tags = document.getElementById('cfg-tags').value; localStorage.setItem('SLProCfg_v7', JSON.stringify(d)); update(); }
    function loadCfg() { const d = JSON.parse(localStorage.getItem('SLProCfg_v7')); if(d) { ["f","p","i","fb","x","tk"].forEach(k => { if(document.getElementById('cfg-'+k)) document.getElementById('cfg-'+k).value = d[k] || ''; }); document.getElementById('cfg-tags').value = d.tags || ''; update(); } }
    
    function clearForm() { if(confirm("Vider ?")) { document.getElementById('titre').value=''; document.getElementById('mood').value=''; document.getElementById('mus-l').value=''; document.getElementById('mus-t').value=''; document.getElementById('tags-manual').value=''; document.getElementById('post-note').value=''; document.getElementById('style-container').innerHTML = ''; document.getElementById('decors-container').innerHTML = ''; update(); } }
    function toggleOverlay(id) { let el = document.getElementById(id); el.style.display = (el.style.display === 'flex') ? 'none' : 'flex'; }
    function toggleQA(id) { let el = document.getElementById(id); el.style.display = (el.style.display==='none')?'block':'none';}
    function delItem(type, k) { if(!confirm("Supprimer ?")) return; delete (type==='spons' ? sponsors[k] : events[k]); localStorage.setItem('SLProSpons_v7', JSON.stringify(sponsors)); localStorage.setItem('SLProEv_v7', JSON.stringify(events)); renderDB(); }
    
    function copyFlickr() {
        const cleanHTML = document.getElementById('render-f').innerHTML.replace(/<br>/g, '\n');
        navigator.clipboard.writeText(cleanHTML);
    }
    
    async function copyText() {
        if (!primfeedDataCache) return;
        
        const plainContent = primfeedDataCache;
        
        // Transform plain text lines into clean HTML paragraphs so rich text editors (Tiptap/ProseMirror) preserve breaks
        const htmlContent = primfeedDataCache
            .split('\n')
            .map(line => {
                if (line.trim() === '') return '<p><br></p>';
                const safeLine = line
                    .replace(/&/g, '&amp;')
                    .replace(/</g, '&lt;')
                    .replace(/>/g, '&gt;');
                return `<p>${safeLine}</p>`;
            })
            .join('');

        try {
            // Modern API method (works flawlessly on HTTPS / GitHub Pages)
            const clipboardItem = new ClipboardItem({
                'text/plain': new Blob([plainContent], { type: 'text/plain' }),
                'text/html': new Blob([htmlContent], { type: 'text/html' })
            });
            await navigator.clipboard.write([clipboardItem]);
        } catch (err) {
            // ULTRA-ROBUST FALLBACK FOR LOCAL TESTING (file://)
            // Intercepts the copy event to inject rich HTML even when browser permissions block the modern API locally
            const listener = function(e) {
                e.clipboardData.setData('text/html', htmlContent);
                e.clipboardData.setData('text/plain', plainContent);
                e.preventDefault();
            };
            document.addEventListener('copy', listener);
            document.execCommand('copy');
            document.removeEventListener('copy', listener);
        }
    }
    function toggleTheme() { document.body.classList.toggle('light-theme'); }
    
    function exportData() { 
        const blob = new Blob([JSON.stringify({
            sponsors, 
            events, 
            deadlines, 
            categories: appCategories, 
            models: appModels,
            activeModel: activeModelKey,
            config: JSON.parse(localStorage.getItem('SLProCfg_v7'))
        }, null, 2)], {type: 'application/json'}); 
        const a = document.createElement('a'); 
        a.href = URL.createObjectURL(blob); 
        a.download = `backup_proflow.json`; 
        a.click(); 
    }
    
    function importData(event) {
        const file = event.target.files[0]; if (!file) return;
        const reader = new FileReader(); reader.onload = (e) => {
            const data = JSON.parse(e.target.result);
            if(confirm("Importer les données ?")) {
                localStorage.setItem('SLProSpons_v7', JSON.stringify(data.sponsors || {}));
                localStorage.setItem('SLProEv_v7', JSON.stringify(data.events || {}));
                localStorage.setItem('SLProDeadlines_v1', JSON.stringify(data.deadlines || []));
                localStorage.setItem('SLProCategories_v1', JSON.stringify(data.categories || defaultCats));
                localStorage.setItem('SLProModels_v1', JSON.stringify(data.models || defaultModels));
                localStorage.setItem('SLProActiveModel_v1', data.activeModel || "Modèle Standard (Diamants)");
                localStorage.setItem('SLProCfg_v7', JSON.stringify(data.config || {}));
                location.reload();
            }
        }; reader.readAsText(file);
    }