document.addEventListener('DOMContentLoaded', () => {
    const cursoId = 'app';
    
    // Obtener datos del usuario
    const userName = localStorage.getItem('naylampUserName') || 'Usuario Invitado';
    const progressKey = `naylamp_progress_${userName}`;
    let userProgress = JSON.parse(localStorage.getItem(progressKey)) || { app: 0, intereses: 0, debito: 0, ahorro: 0, credito: 0, ciberseguridad: 0, emprendedores: 0 };

    // Temario específico
    const lecciones = [{"tema": "1. Descarga Segura", "texto": "Aprende a identificar la App oficial en tu tienda de aplicaciones y evita enlaces fraudulentos por SMS."}, {"tema": "2. Creación de Clave de Internet", "texto": "Genera una clave de 6 dígitos que sea fácil de recordar para ti, pero difícil de adivinar."}, {"tema": "3. Activación del Token Digital", "texto": "El Token te permite realizar operaciones seguras generando códigos automáticos desde tu celular."}, {"tema": "4. Tu primera Transferencia", "texto": "Selecciona 'Transferir', ingresa el CCI de destino y confirma la operación. ¡Es totalmente gratis y al instante!"}];
    
    // LÓGICA: SIEMPRE INICIA EN TEMA 1 Y AVANZA EN 4 PASOS
    let currentSlide = 0; 
    const totalSlides = lecciones.length;

    const slideTitle = document.getElementById('slideTitle');
    const slideText = document.getElementById('slideText');
    const cursoBar = document.getElementById('cursoBar');
    const cursoPct = document.getElementById('cursoPct');
    const btnAvanzar = document.getElementById('btnAvanzar');

    const renderSlide = () => {
        // La fórmula exacta para 4 pasos: 25%, 50%, 75%, 100%
        let pct = (currentSlide + 1) * 25; 

        // Mostrar texto de la lección actual
        slideTitle.innerText = lecciones[currentSlide].tema;
        slideText.innerText = lecciones[currentSlide].texto;

        // Animar barra
        cursoBar.style.width = `${pct}%`;
        cursoPct.innerText = `${pct}%`;

        // Si llegamos al 100% (Paso 4)
        if (pct === 100) {
            btnAvanzar.innerHTML = '¡Módulo Completado! <i class="fa-solid fa-check-double"></i>';
            btnAvanzar.classList.add('completado');
            
            // Guardar automáticamente el 100% en el perfil del usuario
            userProgress[cursoId] = 100;
            localStorage.setItem(progressKey, JSON.stringify(userProgress));
        } else {
            btnAvanzar.innerHTML = 'Siguiente lección <i class="fa-solid fa-arrow-right"></i>';
            btnAvanzar.classList.remove('completado');
            
            // Guardar el progreso actual SOLAMENTE si es mayor al que ya tenía antes
            let savedProgress = userProgress[cursoId] || 0;
            if (pct > savedProgress) {
                userProgress[cursoId] = pct;
                localStorage.setItem(progressKey, JSON.stringify(userProgress));
            }
        }
    };

    btnAvanzar.addEventListener('click', () => {
        // Si aún no llegamos a la última diapositiva
        if (currentSlide < 3) {
            currentSlide++; // Avanzar al siguiente tema
            renderSlide();
        } else {
            // Si ya estamos en el 100% y hacemos clic, nos regresa al catálogo
            window.location.href = 'modulo.html';
        }
    });

    document.getElementById('btnVolver').addEventListener('click', () => {
        window.location.href = 'modulo.html';
    });

    // Iniciar renderizado con una pequeña pausa para la animación de la barra
    setTimeout(renderSlide, 150);
});