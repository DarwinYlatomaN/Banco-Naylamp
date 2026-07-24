document.addEventListener('DOMContentLoaded', () => {
    const cursoId = 'app'; // Ojo: Cambia esto en tus otros archivos (ahorro, debito, etc.)
    
    // Obtener datos del usuario
    const userName = localStorage.getItem('naylampUserName') || 'Usuario Invitado';
    const progressKey = `naylamp_progress_${userName}`;
    let userProgress = JSON.parse(localStorage.getItem(progressKey)) || { app: 0, intereses: 0, debito: 0, ahorro: 0, credito: 0, ciberseguridad: 0, emprendedores: 0 };

    // Temario específico
    const lecciones = [
        {"tema": "1. Descarga Segura", "texto": "Aprende a identificar la App oficial en tu tienda de aplicaciones y evita enlaces fraudulentos por SMS."}, 
        {"tema": "2. Creación de Clave de Internet", "texto": "Genera una clave de 6 dígitos que sea fácil de recordar para ti, pero difícil de adivinar."}, 
        {"tema": "3. Activación del Token Digital", "texto": "El Token te permite realizar operaciones seguras generando códigos automáticos desde tu celular."}, 
        {"tema": "4. Tu primera Transferencia", "texto": "Selecciona 'Transferir', ingresa el CCI de destino y confirma la operación. ¡Es totalmente gratis y al instante!"}
    ];
    
    // ==========================================
    // LÓGICA DE PROGRESO (MANTIENE EL AVANCE)
    // ==========================================
    let currentProgress = userProgress[cursoId] || 0; 
    let currentSlide = 0;

    // Si ya avanzó, lo dejamos en la pantalla que le toca (o en la última si ya terminó)
    if (currentProgress > 0 && currentProgress < 100) {
        currentSlide = Math.floor((currentProgress - 1) / 25);
    } else if (currentProgress === 100) {
        currentSlide = 3;
    }

    const totalSlides = lecciones.length;
    const slideTitle = document.getElementById('slideTitle');
    const slideText = document.getElementById('slideText');
    const cursoBar = document.getElementById('cursoBar');
    const cursoPct = document.getElementById('cursoPct');
    const btnAvanzar = document.getElementById('btnAvanzar');
    const btnVolver = document.getElementById('btnVolver');

    // ==========================================
    // CREAR BOTÓN DE REINICIAR AUTOMÁTICAMENTE
    // ==========================================
    const actionsContainer = document.querySelector('.leccion-actions');
    
    if (actionsContainer && !document.getElementById('btnReiniciar')) {
        const btnReiniciar = document.createElement('button');
        btnReiniciar.id = 'btnReiniciar';
        btnReiniciar.className = 'btn';
        // Le damos un diseño blanco con bordes para que destaque pero no compita con los otros botones
        btnReiniciar.style.cssText = 'background-color: white; border: 2px solid #0b1526; color: #0b1526; flex: 1; margin-right: 10px; display: flex; align-items: center; justify-content: center; gap: 5px;';
        btnReiniciar.innerHTML = '<i class="fa-solid fa-rotate-left"></i> Reiniciar';
        
        // Lo inyectamos antes del botón "Volver"
        actionsContainer.insertBefore(btnReiniciar, btnVolver);
        
        // Función al hacer clic en reiniciar
        btnReiniciar.addEventListener('click', () => {
            if (confirm('¿Estás seguro que deseas reiniciar este curso desde cero? Perderás el progreso de este módulo.')) {
                userProgress[cursoId] = 0;
                localStorage.setItem(progressKey, JSON.stringify(userProgress));
                window.location.reload(); // Recarga la página y empieza en 0%
            }
        });
    }

    // ==========================================
    // RENDERIZAR LA PANTALLA
    // ==========================================
    const renderSlide = () => {
        let pct = (currentSlide + 1) * 25; 
        
        // Forzamos el visual a 100% si el usuario ya lo había terminado antes
        if (currentProgress === 100) pct = 100;

        slideTitle.innerText = lecciones[currentSlide].tema;
        slideText.innerText = lecciones[currentSlide].texto;
        cursoBar.style.width = `${pct}%`;
        cursoPct.innerText = `${pct}%`;

        if (pct === 100) {
            btnAvanzar.innerHTML = '¡Módulo Completado! <i class="fa-solid fa-check-double"></i>';
            btnAvanzar.classList.add('completado');
            
            userProgress[cursoId] = 100;
            localStorage.setItem(progressKey, JSON.stringify(userProgress));
            currentProgress = 100; // Actualizar variable local
        } else {
            btnAvanzar.innerHTML = 'Siguiente lección <i class="fa-solid fa-arrow-right"></i>';
            btnAvanzar.classList.remove('completado');
            
            if (pct > (userProgress[cursoId] || 0)) {
                userProgress[cursoId] = pct;
                localStorage.setItem(progressKey, JSON.stringify(userProgress));
            }
        }
    };

    btnAvanzar.addEventListener('click', () => {
        if (currentSlide < 3) {
            currentSlide++; 
            renderSlide();
        } else {
            window.location.href = 'modulo.html';
        }
    });

    btnVolver.addEventListener('click', () => {
        window.location.href = 'modulo.html';
    });

    setTimeout(renderSlide, 150);
});