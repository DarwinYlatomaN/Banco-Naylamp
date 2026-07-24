document.addEventListener('DOMContentLoaded', () => {
    
    // ==========================================
    // 1. OBTENER Y FORMATEAR EL NOMBRE COMPLETO
    // ==========================================
    const userName = localStorage.getItem('naylampUserName') || 'Usuario Invitado';
    const greetingElement = document.getElementById('greetingName'); 
    
    if (greetingElement) {
        const nombreCompletoFormateado = userName.split(' ').map(palabra => 
            palabra.charAt(0).toUpperCase() + palabra.slice(1).toLowerCase()
        ).join(' ');
        greetingElement.innerHTML = `¡Hola, ${nombreCompletoFormateado}! 👋`;
    }

    // ==========================================
    // 2. RECUPERAR PROGRESO CON ESCUDO ANTI-ERRORES
    // ==========================================
    const progressKey = `naylamp_progress_${userName}`;
    const defaultProgress = { app: 0, ahorro: 0, debito: 0, credito: 0, intereses: 0, ciberseguridad: 0, emprendedores: 0 };
    let userProgress = {};

    try {
        const storedData = localStorage.getItem(progressKey);
        if (storedData) {
            userProgress = JSON.parse(storedData); // Intenta leer los datos
        }
    } catch (error) {
        console.warn("Se encontraron datos antiguos/corruptos. Reiniciando formato...");
        userProgress = {}; // Si hay error, lo limpia para que no se rompa la página
    }

    // Fusionar el progreso guardado con la base por defecto (evita valores nulos)
    userProgress = { ...defaultProgress, ...userProgress };

    // Base de datos visual de los cursos
    const courseData = {
        app: { title: "Uso de la App Naylamp", tag: "Banca Básica", icon: "fa-mobile-screen", time: "45 min", color: "#0284c7" },
        ahorro: { title: "Ahorro Inteligente con Naylamp", tag: "Banca Básica", icon: "fa-money-bill-transfer", time: "30 min", color: "#0284c7" },
        debito: { title: "Cómo usar mi Tarjeta de Débito", tag: "Crédito Inteligente", icon: "fa-credit-card", time: "55 min", color: "#e5a93b" },
        credito: { title: "Crédito Responsable", tag: "Crédito Inteligente", icon: "fa-calendar-check", time: "60 min", color: "#e5a93b" },
        intereses: { title: "Entendiendo los Intereses", tag: "Crédito Inteligente", icon: "fa-percent", time: "40 min", color: "#e5a93b" },
        ciberseguridad: { title: "Cómo evitar estafas y phishing", tag: "Ciberseguridad", icon: "fa-user-shield", time: "40 min", color: "#db2777" },
        emprendedores: { title: "Finanzas para Pequeños Negocios", tag: "Emprendedores", icon: "fa-store", time: "75 min", color: "#16a34a" }
    };

    const courseKeys = Object.keys(courseData);
    let totalProgress = 0;
    let all100 = true; 

    const courseListContainer = document.getElementById('courseList');
    if (courseListContainer) courseListContainer.innerHTML = ''; 

    // ==========================================
    // 3. GENERAR LISTA DINÁMICA DE CURSOS
    // ==========================================
    courseKeys.forEach(id => {
        const course = courseData[id];
        // Asegurarnos de que sea un número válido, sino asume 0
        const pct = typeof userProgress[id] === 'number' ? userProgress[id] : 0; 
        totalProgress += pct;

        if (pct < 100) all100 = false;

        // Estilos fijos para los botones para asegurar que se vean bien
        const btnStyleBase = "width: 100%; padding: 1rem; border-radius: 50px; font-weight: 700; font-size: 1rem; cursor: pointer; transition: all 0.2s; border: none;";
        let btnHtml = '';
        
        if (pct === 0) {
            btnHtml = `<button class="action-btn" data-id="${id}" style="${btnStyleBase} background-color: #0b1526; color: white;">Empezar módulo &rarr;</button>`;
        } else if (pct > 0 && pct < 100) {
            btnHtml = `<button class="action-btn" data-id="${id}" style="${btnStyleBase} background-color: #0b1526; color: white;">Continuar lección &rarr;</button>`;
        } else {
            btnHtml = `<button class="action-btn" data-id="${id}" style="${btnStyleBase} background-color: ${course.color}; color: white;">Módulo completado <i class="fa-solid fa-check"></i></button>`;
        }

        if (courseListContainer) {
            const cardHtml = `
                <div style="border-left: 4px solid ${course.color}; background: white; padding: 1.5rem; border-radius: 12px; margin-bottom: 1.5rem; box-shadow: 0 4px 15px rgba(0,0,0,0.03);">
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.5rem;">
                        <h4 style="color: #0b1526; font-size: 1.15rem; margin: 0; display: flex; align-items: center; gap: 8px;">
                            <i class="fa-solid ${course.icon}" style="color: ${course.color};"></i> ${course.title}
                        </h4>
                        <strong style="font-size: 1.2rem; color: #0b1526;">${pct}%</strong>
                    </div>
                    <p style="font-size: 0.9rem; color: #64748b; margin-bottom: 1.5rem;">
                        <i class="fa-regular fa-clock"></i> ${course.time} &nbsp;|&nbsp; <span style="color: ${course.color}; font-weight: bold;">${course.tag}</span>
                    </p>
                    <div style="width: 100%; height: 8px; background-color: #e2e8f0; border-radius: 50px; overflow: hidden; margin-bottom: 1.5rem;">
                        <div style="height: 100%; background-color: ${course.color}; width: ${pct}%; transition: width 0.8s ease;"></div>
                    </div>
                    ${btnHtml}
                </div>
            `;
            courseListContainer.innerHTML += cardHtml;
        }
    });

    // ==========================================
    // 4. ACTUALIZAR BARRA GENERAL
    // ==========================================
    const averageProgress = Math.round(totalProgress / courseKeys.length);
    const generalBar = document.getElementById('bar-general'); 
    const generalText = document.getElementById('pct-general'); 
    
    if (generalBar) generalBar.style.width = `${averageProgress}%`;
    if (generalText) generalText.innerText = `${averageProgress}%`;

    // ==========================================
    // 5. ENRUTAMIENTO A CADA MÓDULO
    // ==========================================
    const actionBtns = document.querySelectorAll('.action-btn');
    actionBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            const courseId = e.currentTarget.getAttribute('data-id');
            e.currentTarget.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Cargando...';
            setTimeout(() => {
                window.location.href = `curso-${courseId}.html`;
            }, 300);
        });
    });

    // ==========================================
    // 6. LÓGICA DEL CERTIFICADO (REQUISITO: 100%)
    // ==========================================
    const btnCertificado = document.getElementById('btnCertificado');
    if (btnCertificado) {
        if (!all100) {
            btnCertificado.style.opacity = '0.5';
            btnCertificado.style.cursor = 'not-allowed';
            btnCertificado.addEventListener('click', (e) => {
                e.preventDefault();
                alert('⚠️ Para descargar tu certificado, TODOS los 7 módulos deben estar al 100% de avance.');
            });
        } else {
            btnCertificado.style.opacity = '1';
            btnCertificado.style.cursor = 'pointer';
            btnCertificado.addEventListener('click', (e) => {
                e.preventDefault();
                const originalText = btnCertificado.innerHTML;
                btnCertificado.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Generando...';
                
                setTimeout(() => {
                    generarYDescargarCertificado(userName);
                    btnCertificado.innerHTML = originalText;
                }, 800);
            });
        }
    }
});
// ==========================================
// FUNCIÓN DEL CERTIFICADO (CORREGIDA PARA NOMBRES LARGOS)
// ==========================================
function generarYDescargarCertificado(nombreUsuario) {
    const canvas = document.createElement('canvas');
    canvas.width = 1100;
    canvas.height = 780;
    const ctx = canvas.getContext('2d');

    // Fondo
    ctx.fillStyle = '#f8fafc';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Bordes
    ctx.strokeStyle = '#0b1526';
    ctx.lineWidth = 12;
    ctx.strokeRect(20, 20, canvas.width - 40, canvas.height - 40);

    ctx.strokeStyle = '#e5a93b';
    ctx.lineWidth = 3;
    ctx.strokeRect(38, 38, canvas.width - 76, canvas.height - 76);

    ctx.textAlign = 'center';

    // Logo / Cabecera
    ctx.fillStyle = '#0b1526';
    ctx.font = 'bold 22px "Plus Jakarta Sans", Arial, sans-serif';
    ctx.fillText('BANCO NAYLAMP', canvas.width / 2, 140);
    
    ctx.fillStyle = '#1cd3b6';
    ctx.font = 'bold 14px "Plus Jakarta Sans", Arial, sans-serif';
    ctx.fillText('A U L A   F I N A N C I E R A', canvas.width / 2, 165);

    // Título Principal
    ctx.fillStyle = '#e5a93b';
    ctx.font = 'bold 55px "Playfair Display", Times, serif';
    ctx.fillText('Certificado de Excelencia', canvas.width / 2, 260);

    // Subtítulo
    ctx.fillStyle = '#64748b';
    ctx.font = '20px "Plus Jakarta Sans", Arial, sans-serif';
    ctx.fillText('Otorgado orgullosamente a:', canvas.width / 2, 340);

    // ==========================================
    // AJUSTE DINÁMICO DE TAMAÑO DE LETRA
    // ==========================================
    ctx.fillStyle = '#0b1526';
    let fontSize = 65; // Tamaño ideal original
    let nombre = nombreUsuario.toUpperCase();
    
    ctx.font = `bold ${fontSize}px "Playfair Display", Times, serif`;
    
    // Mientras el nombre mida más de 850px de ancho, reducimos la fuente
    while (ctx.measureText(nombre).width > 850 && fontSize > 20) {
        fontSize -= 2;
        ctx.font = `bold ${fontSize}px "Playfair Display", Times, serif`;
    }
    
    // Dibujamos el nombre ya con el tamaño ajustado
    ctx.fillText(nombre, canvas.width / 2, 430);
    // ==========================================

    // Cuerpo del texto
    ctx.fillStyle = '#334155';
    ctx.font = '18px "Plus Jakarta Sans", Arial, sans-serif';
    ctx.fillText('Por haber completado satisfactoriamente todos los módulos de educación financiera,', canvas.width / 2, 510);
    ctx.fillText('demostrando un alto compromiso con su desarrollo y futuro económico.', canvas.width / 2, 540);

    // Fecha
    const today = new Date();
    const opciones = { year: 'numeric', month: 'long', day: 'numeric' };
    ctx.fillStyle = '#64748b';
    ctx.font = 'italic 18px "Playfair Display", Times, serif';
    ctx.fillText(`Emitido en Chiclayo, Perú - ${today.toLocaleDateString('es-PE', opciones)}`, canvas.width / 2, 600);

    // Firma
    ctx.strokeStyle = '#0b1526';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(canvas.width / 2 - 130, 680);
    ctx.lineTo(canvas.width / 2 + 130, 680);
    ctx.stroke();

    ctx.fillStyle = '#0b1526';
    ctx.font = 'bold 16px "Plus Jakarta Sans", Arial, sans-serif';
    ctx.fillText('Gerencia de Inclusión Financiera', canvas.width / 2, 710);
    ctx.fillStyle = '#e5a93b';
    ctx.font = 'bold 14px "Plus Jakarta Sans", Arial, sans-serif';
    ctx.fillText('Banco Naylamp', canvas.width / 2, 735);

    // Descarga automática
    const enlaceDescarga = document.createElement('a');
    enlaceDescarga.download = `Certificado_Naylamp_${nombreUsuario.replace(/\s+/g, '_')}.png`;
    enlaceDescarga.href = canvas.toDataURL('image/png');
    enlaceDescarga.click();
}