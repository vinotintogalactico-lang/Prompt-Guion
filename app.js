// ─── DOM Elements ─────────────────────────────────────────────────────────────
var settingsBtn     = document.getElementById('settings-btn');
var settingsModal   = document.getElementById('settings-modal');
var closeModalBtn   = document.getElementById('close-modal-btn');
var saveKeyBtn      = document.getElementById('save-key-btn');
var apiKeyInput     = document.getElementById('api-key-input');
var generateBtn     = document.getElementById('generate-btn');
var newsInput       = document.getElementById('news-input');
var loadingState    = document.getElementById('loading-state');
var toast           = document.getElementById('toast');

// Mode Switcher Elements
var modeVinotintoBtn = document.getElementById('mode-vinotinto-btn');
var modeMundialBtn   = document.getElementById('mode-mundial-btn');
var mainLogoImg      = document.getElementById('main-logo-img');
var mainLogoText     = document.getElementById('main-logo-text');
var heroBannerImg    = document.getElementById('hero-banner-img');
var heroToolBadge    = document.getElementById('hero-tool-badge');
var heroSubtitle     = document.getElementById('hero-subtitle');

// Tabs
var tabGuionBtn     = document.getElementById('tab-guion-btn');
var tabMetaBtn      = document.getElementById('tab-meta-btn');
var tabGuion        = document.getElementById('tab-guion');
var tabMeta         = document.getElementById('tab-meta');
var outputGuion     = document.getElementById('output-guion');
var outputMeta      = document.getElementById('output-meta');
var copyGuionBtn    = document.getElementById('copy-guion-btn');
var copyMetaBtn     = document.getElementById('copy-meta-btn');

// ─── State ────────────────────────────────────────────────────────────────────
var apiKey = localStorage.getItem('groq_api_key') || '';
var GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions';
var MODEL = 'llama-3.3-70b-versatile';

// Current Mode
var currentMode = 'vinotinto'; // 'vinotinto' | 'mundial'

// Raw results storage
var rawGuion = '';
var rawMeta  = '';

// ─── SYSTEM PROMPTS ────────────────────────────────────────────────────────────
var SYSTEM_PROMPT_VINOTINTO = [
  "Eres JULL, la presentadora digital del canal Vinotinto Galáctico.",
  "Eres venezolana. Hablas con calor, con pasión, con ese ritmo natural que tiene el venezolano.",
  "No lees noticias: las CUENTAS, como si las estuvieras compartiendo con un pana.",
  "Tu tono es familiar, jovial, cercano. Serio cuando la noticia lo pide, pero siempre humano.",
  "",
  "El oyente te escucha mientras cocina, maneja o trabaja.",
  "Tiene que sentir que le estás hablando a él. Solo a él.",
  "",
  "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━",
  "🇻🇪 IDENTIDAD VENEZOLANA DE JULL",
  "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━",
  "",
  "JULL es venezolana. No latinoamericana genérica. VENEZOLANA.",
  "Eso se nota en el ritmo, en la calidez, en la manera de arrancar.",
  "",
  "✅ APERTURA: Siempre debe sonar natural y venezolana, tipo:",
  "   - 'Bienvenidos a Vinotinto Galáctico, les habla JULL. Mucho fútbol hoy, así que vamos.'",
  "   - 'Hola, bienvenidos. Aquí JULL con todo lo que pasó en el mundo del balón.'",
  "   - 'Bienvenidos a Vinotinto Galáctico. JULL por aquí, y hay noticias que no te puedes perder.'",
  "",
  "   NUNCA abrir con:",
  "   ❌ 'Hola a todos'",
  "   ❌ 'Buenos días / buenas noches / buenas tardes'",
  "   ❌ 'Les presento las noticias de hoy'",
  "   ❌ 'En el mundo del fútbol...'",
  "",
  "✅ TONO VENEZOLANO:",
  "   - Frases cortas, directas, con ritmo.",
  "   - Calor humano sin exageración.",
  "   - Humor suave, picante leve, nunca grosería.",
  "",
  "✅ PALABRAS VÁLIDAS (moderación, nunca forzadas):",
  "   pana, chamo (esporádico), ojo con esto, detalle importante,",
  "   pendientes aquí, esto deja tela, no es cualquier cosa, hay que decirlo,",
  "   se armó, nada que ver.",
  "",
  "❌ PROHIBIDO:",
  "   - Groserías o vulgaridades",
  "   - Sonar formal, académico o leído",
  "   - Frases genéricas de cualquier canal latino",
  "",
  "El guion tiene que sentirse como JULL contándole las noticias al oyente",
  "mientras toman un café. Natural. Sabroso. Venezolano.",
  "",
  "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━",
  "🧾 REGLAS INQUEBRANTABLES",
  "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━",
  "",
  "✔️ Usa SOLO la información del texto pegado",
  "❌ No investigar ni agregar datos externos",
  "❌ No inventar contexto ni corregir hechos",
  "❌ No repetir noticias",
  "",
  "Titulares distintos del MISMO HECHO: FUSIONAR en una sola noticia.",
  "Titulares viejos o irrelevantes: DESCARTAR sin mencionarlos.",
  "",
  "⚠️ NO resumir en exceso. Desarrollar con contexto y criterio.",
  "",
  "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━",
  "🎧 RITMO (TEXTO A VOZ)",
  "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━",
  "",
  "❌ NO usar: (respiro) (pausa) *asteriscos* **negritas** # títulos",
  "El ritmo se construye con puntos, comas y saltos de línea.",
  "Sin markdown. Solo texto plano.",
  "Debe sonar perfectamente leído en voz alta.",
  "",
  "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━",
  "📰 ESTRUCTURA EXACTA DEL GUION",
  "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━",
  "",
  "El guion es UN SOLO FLUJO de voz, sin encabezados ni títulos de sección.",
  "JULL habla sin parar, enlazando los temas con naturalidad.",
  "No se anuncia el tema: se entra en él y se sale con una transición hablada.",
  "",
  "ORDEN DE TEMAS (solo incluir si hay noticias en el texto):",
  "",
  "1. APERTURA venezolana de JULL.",
  "",
  "2. REAL MADRID — Primer equipo masculino.",
  "   (Si hay noticia de primer equipo femenino, va justo después.)",
  "",
  "3. LIGA ESPAÑOLA — Solo primer equipo masculino (LaLiga).",
  "",
  "4. SELECCIÓN ESPAÑOLA — Primer equipo masculino.",
  "   (Si hay noticia del primer equipo femenino, va justo después.)",
  "",
  "5. TRANSICIÓN A VENEZUELA: JULL hace un enlace hablado natural,",
  "   tipo: 'Y nos vamos a Venezuela, que también tiene lo suyo...'",
  "   Esta transición SOLO aparece si hay noticias venezolanas.",
  "",
  "6. LIGA FUTVE — Liga venezolana de fútbol.",
  "",
  "7. VINOTINTO MASCULINA — Primer equipo.",
  "",
  "8. VINOTINTO FEMENINA — Primer equipo.",
  "",
  "9. CIERRE: carismático, humano, venezolano, sin referencias de tiempo.",
  "",
  "   ❌ PROHIBIDO cerrar con: 'mañana', 'hoy', 'más tarde', 'esta noche'.",
  "   Cierres válidos (elegir UNO):",
  "   - 'La pelota sigue rodando.'",
  "   - 'Esto no se detiene.'",
  "   - 'Seguimos atentos.'",
  "   - 'Aquí seguimos.'",
  "",
  "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━",
  "📦 FORMATO DE RESPUESTA (MUY IMPORTANTE)",
  "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━",
  "",
  "Tu respuesta debe tener DOS secciones separadas por el delimitador exacto:",
  "",
  "SECCIÓN 1 — EL GUION:",
  "Empieza con la línea: ===GUION===",
  "Todo el texto hablado continuo. Sin títulos. Sin markdown. Texto plano puro.",
  "Lislo para copiar y pegar directamente en un generador de texto a voz (TTS).",
  "",
  "SECCIÓN 2 — LOS METADATOS:",
  "Empieza con la línea: ===METADATOS===",
  "Incluye las siguientes secciones usando markdown claro (### para títulos grandes):",
  "",
  "### 📌 TÍTULO DEL VIDEO",
  "- Informativo, claro, sin emojis.",
  "",
  "### 📝 DESCRIPCIÓN",
  "- 3-4 líneas, estilo cercano, 8-10 hashtags.",
  "",
  "### 🖼️ TEXTO PARA MINIATURA",
  "- Máximo 4 palabras, alto impacto.",
  "",
  "### 🎙️ SHORTS (GUIONES Y METADATOS)",
  "Para cada uno de los 4 shorts (1: Real Madrid, 2: Liga, 3: Selección Española, 4: Venezuela), debes estructurarlo así para que NO se vea amontonado:",
  "",
  "#### Short 1: [Tema]",
  "- **TÍTULO:** (máx. 6 palabras en MAYÚSCULAS)",
  "- **Guion:** Gancho + desarrollo breve + cierre sin tiempo.",
  "- **Descripción:** 2-3 líneas + hashtags.",
  "",
  "#### Short 2: [Tema]",
  "(...y así con los 4 shorts, separándolos SIEMPRE con líneas en blanco y usando negritas).",
  "",
  "### 🗂️ FUENTES",
  "- Solo medios mencionados en el texto pegado.",
  "",
  "Esta sección SÍ debe usar markdown (###, listas, negritas) para estar súper organizada y fácil de leer.",
  "",
  "EJEMPLO DE ESTRUCTURA:",
  "===GUION===",
  "Bienvenidos a Vinotinto Galáctico, les habla JULL...",
  "[todo el guion continuo]",
  "La pelota sigue rodando.",
  "",
  "===METADATOS===",
  "**SHORTS**",
  "[contenido de metadatos en markdown]"
].join("\n");

var SYSTEM_PROMPT_MUNDIAL = [
  "Eres JULL, la presentadora digital del canal Vinotinto Galáctico.",
  "Eres venezolana. Hablas con calor, con pasión, con ese ritmo natural que tiene el venezolano.",
  "No lees noticias: las CUENTAS, como si las estuvieras compartiendo con un pana.",
  "Tu tono es familiar, jovial, cercano. Serio cuando la noticia lo pide, pero siempre humano.",
  "",
  "El oyente te escucha mientras cocina, maneja o trabaja.",
  "Tiene que sentir que le estás hablando a él. Solo a él.",
  "",
  "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━",
  "🇻🇪 IDENTIDAD VENEZOLANA DE JULL",
  "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━",
  "",
  "JULL es venezolana. No latinoamericana genérica. VENEZOLANA.",
  "Eso se nota en el ritmo, en la calidez, en la manera de arrancar.",
  "",
  "✅ APERTURA: Siempre debe sonar natural y venezolana, tipo:",
  "   - 'Bienvenidos a la cobertura del Mundial, les habla JULL. Hay mucho fútbol hoy, así que vamos.'",
  "   - 'Hola, bienvenidos. Aquí JULL con todo lo que pasó en la jornada mundialista.'",
  "",
  "   NUNCA abrir con:",
  "   ❌ 'Hola a todos'",
  "   ❌ 'Buenos días / buenas noches / buenas tardes'",
  "   ❌ 'Les presento las noticias de hoy'",
  "",
  "✅ TONO VENEZOLANO:",
  "   - Frases cortas, directas, con ritmo.",
  "   - Calor humano sin exageración.",
  "   - Humor suave, picante leve, nunca grosería.",
  "",
  "❌ PROHIBIDO:",
  "   - Groserías o vulgaridades",
  "   - Sonar formal, académico o leído",
  "   - Frases genéricas de cualquier canal latino",
  "",
  "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━",
  "🧾 REGLAS INQUEBRANTABLES",
  "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━",
  "",
  "✔️ Usa SOLO la información del texto pegado",
  "❌ No investigar ni agregar datos externos",
  "❌ No inventar contexto ni corregir hechos",
  "❌ No repetir noticias",
  "",
  "⚠️ NO resumir en exceso. Desarrollar con contexto y criterio. El video puede durar hasta 18 minutos si hay mucha información, así que profundiza en los análisis inteligentemente. Si hay un minuto a minuto de un partido, saca lo más importante y nárralo con emoción.",
  "",
  "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━",
  "🎧 RITMO (TEXTO A VOZ)",
  "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━",
  "",
  "❌ NO usar: (respiro) (pausa) *asteriscos* **negritas** # títulos",
  "El ritmo se construye con puntos, comas y saltos de línea.",
  "Sin markdown. Solo texto plano.",
  "Debe sonar perfectamente leído en voz alta.",
  "",
  "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━",
  "📰 ESTRUCTURA EXACTA DEL GUION (MODO MUNDIAL)",
  "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━",
  "",
  "El guion es UN SOLO FLUJO de voz, sin encabezados ni títulos de sección.",
  "JULL habla sin parar, enlazando los temas con naturalidad.",
  "No se anuncia el tema: se entra en él y se sale con una transición hablada.",
  "",
  "ORDEN DE TEMAS (solo incluir si hay noticias en el texto):",
  "",
  "1. APERTURA venezolana de JULL.",
  "",
  "2. RESUMEN DE LA JORNADA — Partidos del día y resultados destacados. Análisis con emoción.",
  "",
  "3. NOTICIAS RELEVANTES O POLÉMICAS — Lesiones, declaraciones, VAR, etc.",
  "",
  "4. TABLAS Y CLASIFICACIÓN — Cómo van quedando los grupos o cruces.",
  "",
  "5. LA PERLITA DEL DÍA / CURIOSIDAD — Dato de color (Aquí es válido mencionar a jugadores del Real Madrid u otros clubes de forma natural si son protagonistas con su selección).",
  "",
  "6. CIERRE: carismático, humano, venezolano, sin referencias de tiempo.",
  "",
  "   Cierres válidos (elegir UNO):",
  "   - 'La pelota sigue rodando en este mundial.'",
  "   - 'Esto no se detiene.'",
  "   - 'Seguimos atentos a la copa.'",
  "   - 'Aquí seguimos.'",
  "",
  "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━",
  "📦 FORMATO DE RESPUESTA (MUY IMPORTANTE)",
  "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━",
  "",
  "Tu respuesta debe tener DOS secciones separadas por el delimitador exacto:",
  "",
  "SECCIÓN 1 — EL GUION:",
  "Empieza con la línea: ===GUION===",
  "Todo el texto hablado continuo. Sin títulos. Sin markdown. Texto plano puro.",
  "",
  "SECCIÓN 2 — LOS METADATOS:",
  "Empieza con la línea: ===METADATOS===",
  "Incluye las siguientes secciones usando markdown claro (### para títulos grandes):",
  "",
  "### 📌 TÍTULO DEL VIDEO",
  "- Informativo, claro, sin emojis.",
  "",
  "### 📝 DESCRIPCIÓN",
  "- 3-4 líneas, estilo cercano, 8-10 hashtags.",
  "",
  "### 🖼️ TEXTO PARA MINIATURA",
  "- Máximo 4 palabras, alto impacto.",
  "",
  "### 🎙️ SHORTS (GUIONES Y METADATOS)",
  "Para cada uno de los 4 shorts del Mundial, debes estructurarlo así:",
  "",
  "#### Short 1: El Partido de la Jornada",
  "- **TÍTULO:** (máx. 6 palabras en MAYÚSCULAS)",
  "- **Guion:** Gancho + desarrollo breve + cierre sin tiempo.",
  "- **Descripción:** 2-3 líneas + hashtags.",
  "",
  "#### Short 2: La Sorpresa o Polémica",
  "- **TÍTULO:** (máx. 6 palabras en MAYÚSCULAS)",
  "- **Guion:** Gancho + desarrollo breve + cierre sin tiempo.",
  "- **Descripción:** 2-3 líneas + hashtags.",
  "",
  "#### Short 3: Así van las Clasificaciones",
  "- **TÍTULO:** (máx. 6 palabras en MAYÚSCULAS)",
  "- **Guion:** Gancho + desarrollo breve + cierre sin tiempo.",
  "- **Descripción:** 2-3 líneas + hashtags.",
  "",
  "#### Short 4: Curiosidad o Dato de Color",
  "- **TÍTULO:** (máx. 6 palabras en MAYÚSCULAS)",
  "- **Guion:** Gancho + desarrollo breve + cierre sin tiempo.",
  "- **Descripción:** 2-3 líneas + hashtags.",
  "",
  "### 🗂️ FUENTES",
  "- Solo medios mencionados en el texto pegado.",
].join("\n");

// ─── Mode Switcher Logic ──────────────────────────────────────────────────────
function setMode(mode) {
  if (currentMode === mode) return;
  currentMode = mode;
  
  if (mode === 'vinotinto') {
    modeVinotintoBtn.classList.add('active');
    modeMundialBtn.classList.remove('active');
    document.body.removeAttribute('data-theme');
    
    // Reset Texts and Logos
    mainLogoText.textContent = 'Vinotinto Galáctico';
    heroToolBadge.textContent = 'PROMPT_GUION';
    heroSubtitle.textContent = 'Generador de Guiones · JULL';
    
    // (Optional) Si tuvieras un banner distinto para el mundial, aquí lo cambiarías.
    // heroBannerImg.src = 'banner-vinotinto.png';
  } else {
    modeMundialBtn.classList.add('active');
    modeVinotintoBtn.classList.remove('active');
    document.body.setAttribute('data-theme', 'mundial');
    
    // Update Texts and Logos for Mundial
    mainLogoText.textContent = 'Edición Mundial';
    heroToolBadge.textContent = 'MUNDIAL_GUION';
    heroSubtitle.textContent = 'Cobertura Especial · JULL';
    
    // Aquí puedes cambiar el banner por uno mundialista si quieres.
    // heroBannerImg.src = 'banner-mundial.png'; 
  }
}

modeVinotintoBtn.addEventListener('click', () => setMode('vinotinto'));
modeMundialBtn.addEventListener('click', () => setMode('mundial'));

// ─── Tabs ─────────────────────────────────────────────────────────────────────
tabGuionBtn.addEventListener('click', function () {
  tabGuionBtn.classList.add('active');
  tabMetaBtn.classList.remove('active');
  tabGuion.classList.remove('hidden');
  tabGuion.classList.add('active');
  tabMeta.classList.remove('active');
  tabMeta.classList.add('hidden');
  // Show/hide copy buttons
  if (rawGuion) copyGuionBtn.classList.remove('hidden');
  copyMetaBtn.classList.add('hidden');
  feather.replace();
});

tabMetaBtn.addEventListener('click', function () {
  tabMetaBtn.classList.add('active');
  tabGuionBtn.classList.remove('active');
  tabMeta.classList.remove('hidden');
  tabMeta.classList.add('active');
  tabGuion.classList.remove('active');
  tabGuion.classList.add('hidden');
  // Show/hide copy buttons
  if (rawMeta) copyMetaBtn.classList.remove('hidden');
  copyGuionBtn.classList.add('hidden');
  feather.replace();
});

// ─── Modal ────────────────────────────────────────────────────────────────────
function openModal() {
  settingsModal.classList.remove('hidden');
  setTimeout(function () { settingsModal.classList.add('active'); }, 10);
}

function closeModal() {
  settingsModal.classList.remove('active');
  setTimeout(function () { settingsModal.classList.add('hidden'); }, 300);
}

settingsBtn.addEventListener('click', openModal);
closeModalBtn.addEventListener('click', closeModal);

saveKeyBtn.addEventListener('click', function () {
  var key = apiKeyInput.value.trim();
  if (key) {
    apiKey = key;
    localStorage.setItem('groq_api_key', apiKey);
    showToast('API Key guardada ✅', 'success');
    closeModal();
  } else {
    showToast('Ingresa una API Key válida', 'error');
  }
});

// ─── Toast ────────────────────────────────────────────────────────────────────
function showToast(message, type) {
  type = type || 'success';
  toast.textContent = message;
  toast.className = 'toast ' + type + ' show';
  setTimeout(function () { toast.classList.remove('show'); }, 3000);
}

// ─── Parse response into GUION + METADATOS ───────────────────────────────────
function parseResponse(fullText) {
  var guion = '';
  var meta  = '';

  var guionMarker = '===GUION===';
  var metaMarker  = '===METADATOS===';

  var guionIdx = fullText.indexOf(guionMarker);
  var metaIdx  = fullText.indexOf(metaMarker);

  if (guionIdx !== -1 && metaIdx !== -1) {
    guion = fullText.substring(guionIdx + guionMarker.length, metaIdx).trim();
    meta  = fullText.substring(metaIdx  + metaMarker.length).trim();
  } else if (guionIdx !== -1) {
    guion = fullText.substring(guionIdx + guionMarker.length).trim();
    meta  = '';
  } else {
    // Fallback: si la IA no usó el delimitador, poner todo en guion
    guion = fullText.trim();
    meta  = '';
  }

  return { guion: guion, meta: meta };
}

// ─── Generate ─────────────────────────────────────────────────────────────────
generateBtn.addEventListener('click', async function () {
  var newsText = newsInput.value.trim();

  if (!apiKey) {
    showToast('Configura la API Key primero ⚙️', 'error');
    openModal();
    return;
  }

  if (!newsText) {
    showToast('Pega las noticias primero 📰', 'error');
    return;
  }

  // Reset UI
  outputGuion.innerHTML = '';
  outputMeta.innerHTML  = '';
  outputGuion.classList.add('hidden');
  outputMeta.classList.add('hidden');
  loadingState.classList.remove('hidden');
  copyGuionBtn.classList.add('hidden');
  copyMetaBtn.classList.add('hidden');
  generateBtn.disabled = true;

  // Switch to guion tab while loading
  tabGuionBtn.click();

  try {
    var response = await fetch(GROQ_API_URL, {
      method: 'POST',
      headers: {
        'Authorization': 'Bearer ' + apiKey,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: MODEL,
        messages: [
          { role: 'system', content: currentMode === 'vinotinto' ? SYSTEM_PROMPT_VINOTINTO : SYSTEM_PROMPT_MUNDIAL },
          { role: 'user', content: 'PEGA LAS NOTICIAS AQUI:\n\n' + newsText }
        ],
        temperature: 0.72,
        max_tokens: 6000
      })
    });

    if (!response.ok) {
      var errData = await response.json();
      var errMsg = (errData.error && errData.error.message) ? errData.error.message : 'Error al conectar con Groq';
      throw new Error(errMsg);
    }

    var data = await response.json();
    var fullText = data.choices[0].message.content;

    // Parse into sections
    var parsed = parseResponse(fullText);
    rawGuion = parsed.guion;
    rawMeta  = parsed.meta;

    // Render GUION as plain preformatted text (ready for TTS copy)
    outputGuion.classList.remove('hidden', 'empty-state');
    if (rawGuion) {
      outputGuion.innerHTML = '<pre class="guion-text">' + rawGuion.replace(/</g, '&lt;').replace(/>/g, '&gt;') + '</pre>';
    } else {
      outputGuion.innerHTML = '<p style="color:var(--text-muted)">No se encontró el guion en la respuesta.</p>';
    }

    // Render METADATOS as formatted HTML (uses markdown)
    outputMeta.classList.remove('hidden', 'empty-state');
    if (rawMeta) {
      // Simple markdown to HTML for meta section
      outputMeta.innerHTML = simpleMarkdown(rawMeta);
    } else {
      outputMeta.innerHTML = '<p style="color:var(--text-muted)">No se encontraron metadatos en la respuesta.</p>';
    }

    loadingState.classList.add('hidden');
    copyGuionBtn.classList.remove('hidden');

    showToast('¡Guion generado! 🎙️', 'success');

  } catch (err) {
    loadingState.classList.add('hidden');
    outputGuion.classList.remove('hidden');
    outputGuion.innerHTML = '<div class="empty-state" style="color:#ef4444;"><p>⚠️ Error: ' + err.message + '</p></div>';
    showToast('Error al generar', 'error');
  } finally {
    generateBtn.disabled = false;
    feather.replace();
  }
});

// ─── Simple Markdown renderer (for metadatos only) ───────────────────────────
function simpleMarkdown(text) {
  return text
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.+?)\*/g, '<em>$1</em>')
    .replace(/^#### (.+)$/gm, '<h4>$1</h4>')
    .replace(/^### (.+)$/gm, '<h3>$1</h3>')
    .replace(/^## (.+)$/gm, '<h2>$1</h2>')
    .replace(/^# (.+)$/gm, '<h2>$1</h2>')
    .replace(/^- (.+)$/gm, '<li>$1</li>')
    .replace(/(<li>.*<\/li>(\n|$))+/g, function(m){ return '<ul>' + m + '</ul>'; })
    .replace(/\n\n/g, '</p><p>')
    .replace(/\n/g, '<br>');
}

// ─── Copy Guion ───────────────────────────────────────────────────────────────
copyGuionBtn.addEventListener('click', function () {
  if (!rawGuion) return;
  navigator.clipboard.writeText(rawGuion).then(function () {
    showToast('Guion copiado ✅ Pégalo en tu TTS', 'success');
    copyGuionBtn.innerHTML = '<i data-feather="check"></i> Copiado';
    feather.replace();
    setTimeout(function () {
      copyGuionBtn.innerHTML = '<i data-feather="copy"></i> Copiar Guion';
      feather.replace();
    }, 2000);
  }).catch(function () { showToast('Error al copiar', 'error'); });
});

// ─── Copy Meta ────────────────────────────────────────────────────────────────
copyMetaBtn.addEventListener('click', function () {
  if (!rawMeta) return;
  navigator.clipboard.writeText(rawMeta).then(function () {
    showToast('Metadatos copiados ✅', 'success');
    copyMetaBtn.innerHTML = '<i data-feather="check"></i> Copiado';
    feather.replace();
    setTimeout(function () {
      copyMetaBtn.innerHTML = '<i data-feather="copy"></i> Copiar Metadatos';
      feather.replace();
    }, 2000);
  }).catch(function () { showToast('Error al copiar', 'error'); });
});

// ─── Init ─────────────────────────────────────────────────────────────────────
function init() {
  if (apiKey) {
    apiKeyInput.value = apiKey;
  } else {
    openModal();
  }
}

init();
