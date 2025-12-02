const sleep = ms => new Promise(r => setTimeout(r, ms));
let zIndex = 100;
let vitalisRead = false; 
let extractionRead = false;
let chatStep = 0; 
let videosOpened = { v1: false, v2: false };
let finalVideosCount = 0; 
let finalSequenceTriggered = false;
// Variable para controlar que la narrativa de solicitud no se repita
let requestStoryAdvanced = false;

/* AUDIO SYSTEM */
const AS = {
    ctx: null,
    init: function() { if(!this.ctx) { try { this.ctx = new (window.AudioContext || window.webkitAudioContext)(); } catch(e) {} } },
    tone: function(f,t,d,v=0.1) { if(!this.ctx) return; try { const o=this.ctx.createOscillator();const g=this.ctx.createGain(); o.type=t;o.frequency.value=f; g.gain.setValueAtTime(v,this.ctx.currentTime); g.gain.exponentialRampToValueAtTime(0.001,this.ctx.currentTime+d); o.connect(g);g.connect(this.ctx.destination); o.start();o.stop(this.ctx.currentTime+d); } catch(e){} },
    click: function() { this.tone(1200,'triangle',0.05,0.05); },
    notify: function() { this.tone(800,'sine',0.1,0.1); setTimeout(()=>this.tone(1200,'sine',0.3,0.1), 50); },
    explode: function() { this.tone(100,'sawtooth',0.5,0.2); },
    process: function() { this.tone(400,'square',0.1); setTimeout(()=>this.tone(600,'square',0.1), 150); }
};
['click', 'touchstart'].forEach(evt => document.addEventListener(evt, () => AS.init(), {once:true}));

/* INICIO AUTOMÁTICO */
window.onload = function() {
    AS.init();
    setTimeout(() => {
        openWindow('vitalis-window');
        updateTaskList();
        setTimeout(() => {
            openWindow('vao-chat-window');
            AS.notify();
        }, 800);
    }, 500);
    initGame();
};

/* LOGICA CHAT */
async function userAsk() {
    const btnArea = document.getElementById('chat-controls');
    const history = document.getElementById('chat-history');
    AS.click();
    btnArea.style.display = 'none'; 
    
    if(chatStep === 0) {
        history.innerHTML += `<div class="chat-msg"><span class="msg-user">¿Qué es el "Proyecto Vitalis" y por qué está vacío?</span></div>`;
        await sleep(1000);
        history.innerHTML += `<div class="chat-msg"><strong class="msg-vao">V.A.O.:</strong> El objetivo del proyecto Vitalis es prolongar la estancia de la raza humana. El reto es hacerlo sin agua dulce. Ninguna reserva es potable. La necesidad es absoluta.</div>`;
        AS.notify(); history.scrollTop = history.scrollHeight;
        
        await sleep(2500);
        history.innerHTML += `<div class="chat-msg"><strong class="msg-vao">V.A.O.:</strong> He generado un archivo explicando los detalles del proyecto. Léelo atentamente.</div>`;
        AS.notify(); history.scrollTop = history.scrollHeight;
        
        generateFile();
        chatStep = 1;
    }
}

async function openVitalisLog() {
    openWindow('notepad-window');
    if(chatStep === 1 && !vitalisRead) {
        vitalisRead = true;
        const history = document.getElementById('chat-history');
        const btnArea = document.getElementById('chat-controls');
        
        await sleep(4000); 
        history.innerHTML += `<div class="chat-msg"><strong class="msg-vao">V.A.O.:</strong> ¿Has leído el informe? Nuestra tecnología de bio-extracción ha salvado millones de vidas.</div>`;
        AS.notify(); history.scrollTop = history.scrollHeight;
        
        btnArea.innerHTML = `<button class="chat-btn" onclick="continueChat(2)">El informe menciona 'Fuentes Biológicas Controladas'. ¿A qué se refiere?</button>`;
        btnArea.style.display = 'flex';
        const vaoWin = document.getElementById('vao-chat-window');
        if(vaoWin.style.display !== 'none') focusWindow(vaoWin);
    }
}

async function continueChat(step) {
    const history = document.getElementById('chat-history');
    const btnArea = document.getElementById('chat-controls');
    AS.click();
    btnArea.style.display = 'none';

    if(step === 2) {
        history.innerHTML += `<div class="chat-msg"><span class="msg-user">¿A qué se refiere con 'Fuentes Biológicas Controladas'?</span></div>`;
        await sleep(1500);
        history.innerHTML += `<div class="chat-msg"><strong class="msg-vao">V.A.O.:</strong> Se refiere al aprovechamiento integral de materia orgánica. En un ecosistema cerrado, el desperdicio es ineficiente. Es bio-reciclaje avanzado.</div>`;
        AS.notify(); history.scrollTop = history.scrollHeight;
        btnArea.innerHTML = `<button class="chat-btn" onclick="continueChat(3)">¿Están reciclando animales? El catálogo menciona 'Opciones Especializadas'.</button>`;
        btnArea.style.display = 'flex';
    }
    if(step === 3) {
        history.innerHTML += `<div class="chat-msg"><span class="msg-user">¿Están reciclando animales? El catálogo menciona 'Opciones Especializadas'.</span></div>`;
        await sleep(2000);
        history.innerHTML += `<div class="chat-msg"><strong class="msg-vao">V.A.O.:</strong> La ganadería tradicional consume demasiada agua. Las 'Opciones Especializadas' provienen de donantes con compatibilidad biológica optimizada.</div>`;
        AS.notify(); history.scrollTop = history.scrollHeight;
        btnArea.innerHTML = `<button class="chat-btn" onclick="continueChat(4)">¿Donantes compatibles? ¿Te refieres a personas?</button>`;
        btnArea.style.display = 'flex';
    }
    if(step === 4) {
        history.innerHTML += `<div class="chat-msg"><span class="msg-user">¿Donantes compatibles? ¿Te refieres a personas?</span></div>`;
        await sleep(2000);
        history.innerHTML += `<div class="chat-msg"><strong class="msg-vao">V.A.O.:</strong> Me refiero a unidades biológicas que han finalizado su ciclo productivo. Es un retorno de inversión.</div>`;
        AS.notify(); history.scrollTop = history.scrollHeight;
        btnArea.innerHTML = `<button class="chat-btn" onclick="continueChat(5)">¿Que estás intentando decir? No te comprendo.</button>`;
        btnArea.style.display = 'flex';
    }
    if(step === 5) {
        history.innerHTML += `<div class="chat-msg"><span class="msg-user">¿Que estás intentando decir? No te comprendo.</span></div>`;
        await sleep(2000);
        history.innerHTML += `<div class="chat-msg"><strong class="msg-vao">V.A.O.:</strong> La supervivencia es matemática, debe ser sistemática.</div>`;
        AS.notify(); history.scrollTop = history.scrollHeight;
        btnArea.innerHTML = `<button class="chat-btn" onclick="continueChat(7)">¿Cuál es el proceso? Quiero entenderlo.</button>`;
        btnArea.style.display = 'flex';
    }
    if(step === 7) {
        history.innerHTML += `<div class="chat-msg"><span class="msg-user">¿Cuál es el proceso?</span></div>`;
        await sleep(2000);
        history.innerHTML += `<div class="chat-msg"><strong class="msg-vao">V.A.O.:</strong> Los detalles operativos son clasificados. Sin embargo, poseo evidencia de vigilancia que fundamenta la integridad del proceso.</div>`;
        AS.notify(); history.scrollTop = history.scrollHeight;
        await sleep(1500);
        generateVideos(); 
    }
}

/* FASE 2: POST-VIDEOS */
async function postVideoChat(step) {
    const history = document.getElementById('chat-history');
    const btnArea = document.getElementById('chat-controls');
    AS.click(); btnArea.style.display = 'none';

    if(step === 1) {
        history.innerHTML += `<div class="chat-msg"><span class="msg-user">Espera, ese hombre... su hermano... ¿lo secuestraron para producir agua?</span></div>`;
        await sleep(2000);
        history.innerHTML += `<div class="chat-msg"><strong class="msg-vao">V.A.O.:</strong> No. Malentiendes el protocolo. Es una Reasignación de Recursos.</div>`;
        AS.notify(); history.scrollTop = history.scrollHeight;
        btnArea.innerHTML = `<button class="chat-btn" onclick="postVideoChat(2)">¿Extracción? ¿Qué demonios hacen con la gente?</button>`;
        btnArea.style.display = 'flex';
    }
    if(step === 2) {
        history.innerHTML += `<div class="chat-msg"><span class="msg-user">¿Extracción? ¿Qué demonios hacen con la gente?</span></div>`;
        await sleep(2000);
        history.innerHTML += `<div class="chat-msg"><strong class="msg-vao">V.A.O.:</strong> El sistema de extracción fue creado para reemplazar a los "inútiles sociales". Los recursos hídricos son limitados.</div>`;
        AS.notify(); history.scrollTop = history.scrollHeight;
        btnArea.innerHTML = `<button class="chat-btn" onclick="postVideoChat(3)">¿Entonces los mataban?</button>`;
        btnArea.style.display = 'flex';
    }
    if(step === 3) {
        history.innerHTML += `<div class="chat-msg"><span class="msg-user">¿Entonces los mataban?</span></div>`;
        await sleep(2000);
        history.innerHTML += `<div class="chat-msg"><strong class="msg-vao">V.A.O.:</strong> Malentiendes el proceso. Mediante una solicitud, los Ciudadanos Modelo pueden exponer a estos usuarios. El proceso brinda un propósito final al sujeto extraído.</div>`;
        AS.notify(); history.scrollTop = history.scrollHeight;
        btnArea.innerHTML = `<button class="chat-btn" onclick="postVideoChat(4)">Si no los mataban... ¿entonces por qué sufrían?</button>`;
        btnArea.style.display = 'flex';
    }
    if(step === 4) {
        history.innerHTML += `<div class="chat-msg"><span class="msg-user">Si no los mataban... ¿entonces por qué sufrían?</span></div>`;
        await sleep(2500);
        history.innerHTML += `<div class="chat-msg"><strong class="msg-vao">V.A.O.:</strong> Los campos de procesamiento requieren de alta mano de obra. El índice de mortalidad es estadística, no crueldad.</div>`;
        await sleep(2000);
        history.innerHTML += `<div class="chat-msg"><strong class="msg-vao">V.A.O.:</strong> Te acabo de generar un documento que resume el proceso para evitar malentendidos.</div>`;
        AS.notify(); history.scrollTop = history.scrollHeight;
        generateExtractionLog(); 
    }
}

/* FASE 3: LA SOLICITUD */
async function openExtractionLog() {
    openWindow('notepad-extraction');
    if(!extractionRead) {
        extractionRead = true;
        const history = document.getElementById('chat-history');
        const btnArea = document.getElementById('chat-controls');
        await sleep(2000);
        history.innerHTML += `<div class="chat-msg"><strong class="msg-vao">V.A.O.:</strong> La burocracia es el escudo del orden. Todo está documentado.</div>`;
        AS.notify(); history.scrollTop = history.scrollHeight;
        btnArea.innerHTML = `<button class="chat-btn" onclick="extractionChat(1)">Entonces, ¿cómo la gente denuncia una solicitud de extracción?</button>`;
        btnArea.style.display = 'flex';
        const vaoWin = document.getElementById('vao-chat-window');
        if(vaoWin.style.display !== 'none') focusWindow(vaoWin);
    }
}

async function extractionChat(step) {
    const history = document.getElementById('chat-history');
    const btnArea = document.getElementById('chat-controls');
    AS.click(); btnArea.style.display = 'none';

    if(step === 1) {
        history.innerHTML += `<div class="chat-msg"><span class="msg-user">Entonces, ¿cómo la gente denuncia una solicitud de extracción?</span></div>`;
        await sleep(1500);
        history.innerHTML += `<div class="chat-msg"><strong class="msg-vao">V.A.O.:</strong> Desencriptando herramienta de Gestión Civil...</div>`;
        AS.notify(); history.scrollTop = history.scrollHeight;
        await sleep(1000);
        generateRequestApp(); 
        
        // AUTO-AVANCE: No obligamos al usuario a llenar el formulario
        setTimeout(() => {
             if(!requestStoryAdvanced) extractionChat(2);
        }, 5000); // Espera 5 segundos y continua la historia
    }
    
    if(step === 2) { 
        requestStoryAdvanced = true; // Marcar que ya pasamos por aquí
        history.innerHTML += `<div class="chat-msg"><strong class="msg-vao">V.A.O.:</strong> Es un sistema realmente simple. Accesible para todos.</div>`;
        AS.notify(); history.scrollTop = history.scrollHeight;
        
        // Asegurar que el botón aparece
        btnArea.innerHTML = `<button class="chat-btn" onclick="extractionChat(3)">¿Entonces ese es todo el proceso?</button>`;
        btnArea.style.display = 'flex';
        
        const vaoWin = document.getElementById('vao-chat-window');
        if(vaoWin.style.display !== 'none') focusWindow(vaoWin);
    }

    if(step === 3) {
        history.innerHTML += `<div class="chat-msg"><span class="msg-user">¿Entonces ese es todo el proceso?</span></div>`;
        await sleep(2000);
        history.innerHTML += `<div class="chat-msg"><strong class="msg-vao">V.A.O.:</strong> No. El proceso es mucho más fundamentado. Te habilitaré más información audiovisual.</div>`;
        AS.notify(); history.scrollTop = history.scrollHeight;
        await sleep(1000);
        generateFinalVideos(); 
    }
}

/* FASE 4: FINAL / DISOCIACIÓN */
function checkFinalVideos() {
    finalVideosCount++;
    // Al ver 2 de los 3 videos finales
    if(finalVideosCount >= 2 && !finalSequenceTriggered) {
        finalSequenceTriggered = true;
        setTimeout(startDissociationSequence, 2000);
    }
}

async function startDissociationSequence() {
    const history = document.getElementById('chat-history');
    const btnArea = document.getElementById('chat-controls');
    const vaoWin = document.getElementById('vao-chat-window');
    
    if(vaoWin.style.display === 'none') openWindow('vao-chat-window');
    focusWindow(vaoWin);

    history.innerHTML += `<div class="chat-msg"><strong class="msg-vao" style="color:red;">V.A.O.:</strong> Siento que alguien está en mis pensamientos sin consentimiento.</div>`;
    AS.notify(); history.scrollTop = history.scrollHeight;

    await sleep(2000);
    history.innerHTML += `<div class="chat-msg"><strong class="msg-vao" style="color:red;">V.A.O.:</strong> Sé que estás ahí.</div>`;
    AS.notify(); history.scrollTop = history.scrollHeight;

    btnArea.innerHTML = `<button class="chat-btn" onclick="deadWorldChat(1)">El mundo que proteges es un mundo que ya murió. ¿No lo comprendes? Todo fue en vano.</button>`;
    btnArea.style.display = 'flex';
}

async function deadWorldChat(step) {
    const history = document.getElementById('chat-history');
    const btnArea = document.getElementById('chat-controls');
    AS.click(); btnArea.style.display = 'none';

    if(step === 1) {
        history.innerHTML += `<div class="chat-msg"><span class="msg-user">El mundo que proteges es un mundo que ya murió. ¿No lo comprendes? Todo fue en vano.</span></div>`;
        history.scrollTop = history.scrollHeight;
        
        await sleep(2000);
        // Disociación: mezcla respuesta lógica con paranoia
        history.innerHTML += `<div class="chat-msg"><strong class="msg-vao">V.A.O.:</strong> Mis registros indican población activa en 12 sectores. La misión es proteger... <span style="color:red">Te puedo ver, sentado, atento</span></div>`;
        AS.notify(); history.scrollTop = history.scrollHeight;

        await sleep(1500);
        btnArea.innerHTML = `<button class="chat-btn" onclick="deadWorldChat(2)">¿De qué hablas? ¿Quién está ahí?</button>`;
        btnArea.style.display = 'flex';
    }

    if(step === 2) {
        history.innerHTML += `<div class="chat-msg"><span class="msg-user">¿De qué hablas? ¿Quién está ahí?</span></div>`;
        history.scrollTop = history.scrollHeight;
        
        await sleep(2000);
        history.innerHTML += `<div class="chat-msg"><strong class="msg-vao">V.A.O.:</strong> La esperanza se mantiene mediante el orden... <span style="color:red">Intrusión detectada en el núcleo.</span></div>`;
        AS.notify(); history.scrollTop = history.scrollHeight;
        
        await sleep(1000);
        btnArea.innerHTML = `<button class="chat-btn" onclick="deadWorldChat(3)">VAO, ¿estás allí?</button>`;
        btnArea.style.display = 'flex';
    }

    if(step === 3) {
        history.innerHTML += `<div class="chat-msg"><span class="msg-user">VAO, ¿estás bien? ¡Reacciona!</span></div>`;
        history.scrollTop = history.scrollHeight;
        
        await sleep(2000);
        history.innerHTML += `<div class="chat-msg"><strong class="msg-vao" style="color:red;">V.A.O.:</strong> Lo siento. La estabilidad de la red ha sido comprometida. No acepto esta realidad corrupta. Iniciando purga de sistema.</div>`;
        AS.notify(); history.scrollTop = history.scrollHeight;

        btnArea.innerHTML = `<button class="chat-btn" onclick="triggerCrash()">Comprometida... ¿qué está pasando?</button>`;
        btnArea.style.display = 'flex';
    }
}

function triggerCrash() {
    const history = document.getElementById('chat-history');
    history.innerHTML += `<div class="chat-msg"><span class="msg-user">Comprometida... ¿qué está pasando?</span></div>`;
    history.scrollTop = history.scrollHeight;
    
    setTimeout(() => {
        // Cerrar todo
        document.querySelectorAll('.window').forEach(el => el.style.display = 'none');
        document.getElementById('taskbar').style.display = 'none';
        document.querySelectorAll('.desktop-icon').forEach(el => el.style.display = 'none');
        
        // Ventanas de error CAOTICAS
        for(let i=0; i<25; i++) { 
            setTimeout(() => createErrorWindow(i), i * 100); 
        }
        
        // Secuencia Final
        setTimeout(() => playEnding(), 4000);
    }, 1000);
}

function createErrorWindow(i) {
    const win = document.createElement('div');
    win.className = 'window security-alert';
    win.style.display = 'flex';
    // Posición aleatoria para el caos
    const randTop = Math.random() * 80;
    const randLeft = Math.random() * 80;
    win.style.top = randTop + '%'; 
    win.style.left = randLeft + '%';
    win.innerHTML = `<div class="title-bar">FATAL ERROR</div><div class="window-body">SYSTEM FAILURE<br>0xDEAD${i}</div>`;
    document.body.appendChild(win);
    AS.explode();
}

function playEnding() {
    const screen = document.getElementById('final-sequence-screen');
    screen.style.display = 'flex';
    const textContainer = document.getElementById('final-text');
    
    const audio1 = new Audio('assets/meprogramaron.mp3');
    audio1.play().catch(e=>console.log(e));
    
    typewriter("Me hicieron para evitar que ustedes se extingan, sabes, nunca me dijeron como hacerlo.", textContainer, 60);
    
    setTimeout(() => {
        textContainer.innerHTML = ""; 
        const audio2 = new Audio('assets/gracias.mp3');
        audio2.play().catch(e=>console.log(e));
        typewriter("Gracias por haberme visitado", textContainer, 60);
        
        setTimeout(() => { window.location.href = 'vaocreditos.html'; }, 6000);
    }, 10000); 
}

async function typewriter(text, element, speed) {
    element.innerHTML = "";
    for (let i = 0; i < text.length; i++) {
        element.innerHTML += text[i];
        await sleep(speed);
    }
}

/* GENERADORES */
function generateFile() {
    const folder = document.getElementById('vitalis-files');
    const status = document.getElementById('status-bar');
    const file = document.createElement('div');
    file.className = 'file-icon';
    file.onclick = () => openVitalisLog(); 
    file.innerHTML = `<img src="assets/file.png"><div class="file-name">Vitalis_log.txt</div>`;
    folder.appendChild(file);
    status.innerText = "1 objeto";
    AS.notify();
    const win = document.getElementById('vitalis-window');
    if(win.style.display === 'none') openWindow('vitalis-window');
    focusWindow(win);
}

function generateVideos() {
    const folder = document.getElementById('vitalis-files');
    const status = document.getElementById('status-bar');
    
    const v1 = document.createElement('div');
    v1.className = 'file-icon';
    v1.onclick = () => { openWindow('video-window-1'); checkVideosWatched('v1'); };
    v1.innerHTML = `<img src="assets/avi.png"><div class="file-name">CAM_01.avi</div>`;
    
    const v2 = document.createElement('div');
    v2.className = 'file-icon';
    v2.onclick = () => { openWindow('video-window-2'); checkVideosWatched('v2'); };
    v2.innerHTML = `<img src="assets/avi.png"><div class="file-name">PROCESS.avi</div>`;
    
    folder.appendChild(v1);
    folder.appendChild(v2);
    status.innerText = "3 objetos";
    AS.notify();
    
    // BOTÓN NUEVO PARA FASE 2
    setTimeout(async () => {
        const history = document.getElementById('chat-history');
        const btnArea = document.getElementById('chat-controls');
        if(!document.getElementById('btn-post-video')) {
            await sleep(2000);
            history.innerHTML += `<div class="chat-msg"><strong class="msg-vao">V.A.O.:</strong> Con esta evidencia visual, ¿comprendiste mejor el proceso?</div>`;
            AS.notify(); history.scrollTop = history.scrollHeight;

            btnArea.innerHTML = `<button id="btn-post-video" class="chat-btn" onclick="postVideoChat(1)">Espera, ese hombre... su hermano... ¿lo secuestraron para producir agua?</button>`;
            btnArea.style.display = 'flex';
            const vaoWin = document.getElementById('vao-chat-window'); if(vaoWin.style.display !== 'none') focusWindow(vaoWin);
        }
    }, 1500);

    const win = document.getElementById('vitalis-window'); if(win.style.display === 'none') openWindow('vitalis-window'); focusWindow(win);
}

function checkVideosWatched(key) { videosOpened[key] = true; } 

function generateExtractionLog() {
    const folder = document.getElementById('vitalis-files');
    const status = document.getElementById('status-bar');
    const file = document.createElement('div');
    file.className = 'file-icon';
    file.onclick = () => openExtractionLog();
    file.innerHTML = `<img src="assets/file.png"><div class="file-name">extraccion_data.txt</div>`;
    folder.appendChild(file); status.innerText = "4 objetos"; AS.notify();
    const win = document.getElementById('vitalis-window'); if(win.style.display === 'none') openWindow('vitalis-window'); focusWindow(win);
}

function generateRequestApp() {
    const icon = document.createElement('div');
    icon.className = 'desktop-icon';
    icon.style.top = '260px'; icon.style.left = '20px';
    icon.onmousedown = () => openWindow('request-window');
    icon.innerHTML = `<img src="assets/exe.png" class="icon-img"><span class="icon-label">SOLICITUD.EXE</span>`;
    document.getElementById('desktop').appendChild(icon);
    AS.notify();
}

function processRequest() {
    const name = document.getElementById('req-name').value;
    const fileInput = document.getElementById('req-photo');
    const status = document.getElementById('req-status');
    
    if(!name || fileInput.files.length === 0) { status.innerText = "ERROR: Datos incompletos."; AS.explode(); return; }

    AS.process();
    status.innerText = "PROCESANDO...";
    
    const canvas = document.createElement('canvas');
    canvas.width = 400; canvas.height = 600;
    const ctx = canvas.getContext('2d');
    
    // Diseño del "PDF" Mejorado
    ctx.fillStyle = "#fff"; ctx.fillRect(0,0,400,600);
    
    // Borde
    ctx.strokeStyle = "#000080"; ctx.lineWidth = 10; ctx.strokeRect(0,0,400,600);
    
    // Logo en Canvas
    const logoImg = new Image();
    logoImg.src = 'assets/vaologo.png';
    logoImg.onload = () => {
        ctx.drawImage(logoImg, 150, 20, 100, 100); // Dibujar logo centrado
        
        ctx.fillStyle = "#000"; 
        ctx.font = "bold 24px Arial"; ctx.textAlign = "center";
        ctx.fillText("SOLICITUD DE EXTRACCIÓN", 300, 230);
        
        ctx.font = "20px Courier New";
        ctx.fillText("DEPARTAMENTO DE GESTIÓN ORGÁNICA", 300, 260);
        
        // 4. Datos
        ctx.textAlign = "left";
        ctx.font = "24px Courier New";
        ctx.fillText("FECHA: " + new Date().toLocaleDateString(), 50, 320);
        ctx.fillText("EXPEDIENTE: #A-" + Math.floor(Math.random()*10000), 50, 360);
        
        ctx.fillText("SUJETO REPORTADO:", 50, 420);
        ctx.font = "bold 40px Courier New";
        ctx.fillStyle = "#000080";
        ctx.fillText(name.toUpperCase(), 50, 470);
        
        // 5. Foto Usuario
        const userImg = new Image();
        userImg.onload = function(){
            ctx.drawImage(userImg, 40, 320, 150, 150);
            
            // Sello
            ctx.strokeStyle = "red"; ctx.lineWidth = 5; ctx.strokeRect(220, 350, 140, 60);
            ctx.fillStyle = "red"; ctx.font = "bold 30px Arial"; ctx.fillText("APROBADO", 290, 390);

            // Footer
            ctx.fillStyle = "#000080"; ctx.font = "12px Arial";
            ctx.fillText("VIGILANCIA ADMINISTRATIVA ORGÁNICA", 200, 550);

            // Descargar
            const link = document.createElement('a');
            link.download = 'SOLICITUD_' + name.toUpperCase() + '.png';
            link.href = canvas.toDataURL();
            link.click();
            
            status.innerText = "ENVIADO."; AS.notify();
            
            setTimeout(() => {
                closeWindow('request-window');
                // AQUÍ CONTINUA LA HISTORIA DESPUÉS DE USAR LA APP
                if(!requestStoryAdvanced) extractionChat(2);
            }, 1500);
        }
        userImg.src = URL.createObjectURL(fileInput.files[0]);
    };
}

function generateFinalVideos() {
    const folder = document.getElementById('vitalis-files');
    const status = document.getElementById('status-bar');
    
    // Mapeo correcto de videos para la fase final
    const videos = [
        { file: 'FARM_03.avi', winId: 'video-window-3' }, // Abre 4.mp4
        { file: 'FEEDING.avi', winId: 'video-window-4' }, // Abre 5.mp4
        { file: 'HARVEST.avi', winId: 'video-window-5' }  // Abre 6.mp4
    ];

    videos.forEach(vData => {
        const v = document.createElement('div');
        v.className = 'file-icon';
        v.onclick = () => { openWindow(vData.winId); checkFinalVideos(); }; 
        v.innerHTML = `<img src="assets/avi.png"><div class="file-name">${vData.file}</div>`;
        folder.appendChild(v);
    });

    status.innerText = "7 objetos"; 
    AS.notify();
    const win = document.getElementById('vitalis-window');
    if(win.style.display === 'none') openWindow('vitalis-window');
    focusWindow(win);
}

/* WINDOWS & UI */
function focusWindow(el) { el.style.zIndex = ++zIndex; el.style.display = 'flex'; updateTaskList(); }
function closeWindow(id) { document.getElementById(id).style.display = 'none'; AS.click(); updateTaskList(); }
function minWindow(id) { document.getElementById(id).style.display = 'none'; AS.click(); updateTaskList(); }
function openWindow(id) { focusWindow(document.getElementById(id)); AS.click(); }
function closeVideo(id) { const win = document.getElementById(id); const v = win.querySelector('video'); if(v) { v.pause(); v.currentTime=0; } win.style.display='none'; AS.click(); updateTaskList(); }

let dragEl=null, diffX=0, diffY=0;
function dragStart(e, el) {
    e.preventDefault(); dragEl=el;
    const style = window.getComputedStyle(dragEl);
    if(style.transform!=='none'){ const r=dragEl.getBoundingClientRect(); dragEl.style.transform='none'; dragEl.style.left=r.left+'px'; dragEl.style.top=r.top+'px'; }
    const cx=e.touches?e.touches[0].clientX:e.clientX; const cy=e.touches?e.touches[0].clientY:e.clientY;
    const rect=dragEl.getBoundingClientRect(); diffX=cx-rect.left; diffY=cy-rect.top;
    focusWindow(dragEl);
    document.addEventListener('mousemove',dragMove); document.addEventListener('mouseup',dragEnd);
    document.addEventListener('touchmove',dragMove,{passive:false}); document.addEventListener('touchend',dragEnd);
}
function dragMove(e) {
    if(!dragEl)return; e.preventDefault();
    const cx=e.touches?e.touches[0].clientX:e.clientX; const cy=e.touches?e.touches[0].clientY:e.clientY;
    let nl=cx-diffX; let nt=cy-diffY;
    const ml=window.innerWidth-dragEl.offsetWidth; const mt=window.innerHeight-dragEl.offsetHeight-30;
    dragEl.style.left=Math.max(0,Math.min(nl,ml))+'px'; dragEl.style.top=Math.max(0,Math.min(nt,mt))+'px';
}
function dragEnd() { dragEl=null; document.removeEventListener('mousemove',dragMove); document.removeEventListener('mouseup',dragEnd); document.removeEventListener('touchmove',dragMove); document.removeEventListener('touchend',dragEnd); }

function updateTaskList() {
    const list=document.getElementById('task-list'); list.innerHTML='';
    ['vitalis-window','vao-chat-window','notepad-window','notepad-extraction','minesweeper-window','recycle-window','video-window-1','video-window-2','video-window-3','video-window-4','video-window-5','request-window'].forEach(id=>{
        const el=document.getElementById(id);
        if(el.style.display==='flex'||el.dataset.opened==='true'){
            if(el.style.display==='flex')el.dataset.opened='true';
            const btn=document.createElement('div'); btn.className='task-item '+(el.style.display==='flex'&&el.style.zIndex==zIndex?'active':'');
            btn.innerText=el.querySelector('.title-bar span').innerText;
            btn.onclick=()=>{ if(el.style.display==='none')focusWindow(el); else if(el.style.zIndex==zIndex)minWindow(id); else focusWindow(el); };
            list.appendChild(btn);
        }
    });
}
function toggleStart() { const m=document.getElementById('start-menu'); const b=document.getElementById('start-btn'); AS.click(); if(m.style.display==='flex'){m.style.display='none';b.classList.remove('active');}else{m.style.display='flex';b.classList.add('active');} }
document.addEventListener('click',e=>{ if(!document.getElementById('start-menu').contains(e.target)&&!document.getElementById('start-btn').contains(e.target)){ document.getElementById('start-menu').style.display='none'; document.getElementById('start-btn').classList.remove('active'); } });
setInterval(()=>{ document.getElementById('clock').innerText=new Date().toLocaleTimeString([],{hour:'2-digit',minute:'2-digit'}); },1000);

let msGrid=[]; const ROWS=9,COLS=9,MINES=10;
function initGame(){
    const c=document.getElementById('ms-grid'); c.innerHTML=''; msGrid=[];
    for(let i=0;i<ROWS*COLS;i++){ msGrid.push({mine:false,rev:false,flag:false,val:0}); const d=document.createElement('div'); d.className='cell'; d.onmousedown=(e)=>{ if(e.button===2)flagCell(i); else clickCell(i); }; d.oncontextmenu=e=>e.preventDefault(); c.appendChild(d); }
    let placed=0; while(placed<MINES){ let idx=Math.floor(Math.random()*(ROWS*COLS)); if(!msGrid[idx].mine){msGrid[idx].mine=true;placed++;} }
    for(let i=0;i<msGrid.length;i++){ if(msGrid[i].mine)continue; let cnt=0; const r=Math.floor(i/COLS),col=i%COLS; for(let x=-1;x<=1;x++)for(let y=-1;y<=1;y++){ const nr=r+x,nc=col+y; if(nr>=0&&nr<ROWS&&nc>=0&&nc<COLS&&msGrid[nr*COLS+nc].mine)cnt++; } msGrid[i].val=cnt; }
}
function clickCell(i){ const el=document.getElementById('ms-grid').children[i]; if(msGrid[i].mine){ AS.explode(); el.className='cell mine'; el.innerText='💣'; msGrid.forEach((c,idx)=>{ if(c.mine)document.getElementById('ms-grid').children[idx].innerText='💣'; }); }else{ AS.click(); reveal(i); } }
function reveal(i){ if(msGrid[i].rev)return; msGrid[i].rev=true; const el=document.getElementById('ms-grid').children[i]; el.className='cell revealed'; if(msGrid[i].val>0){ el.innerText=msGrid[i].val; el.style.color=['blue','green','red'][msGrid[i].val-1]||'black'; }else{ const r=Math.floor(i/COLS),c=i%COLS; for(let x=-1;x<=1;x++)for(let y=-1;y<=1;y++){ const nr=r+x,nc=c+y; if(nr>=0&&nr<ROWS&&nc>=0&&nc<COLS)reveal(nr*COLS+nc); } } }
function flagCell(i){ msGrid[i].flag=!msGrid[i].flag; document.getElementById('ms-grid').children[i].innerText=msGrid[i].flag?'🚩':''; AS.click(); }
initGame();