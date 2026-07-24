document.addEventListener('DOMContentLoaded', () => {
    const cursoId = 'debito';
    
    // Obtener datos del usuario
    const userName = localStorage.getItem('naylampUserName') || 'Usuario Invitado';
    const progressKey = `naylamp_progress_${userName}`;
    let userProgress = JSON.parse(localStorage.getItem(progressKey)) || { app: 0, intereses: 0, debito: 0, ahorro: 0, credito: 0, ciberseguridad: 0, emprendedores: 0 };

    // Temario específico
    const lecciones = [
        {"tema": "1. El CVV dinámico", "texto": "Para compras por internet, usa el CVV que cambia cada 5 minutos en tu App para evitar clonaciones."}, 
        {"tema": "2. Apagado y Encendido", "texto": "¿No encuentras tu tarjeta? Apágala temporalmente desde la App sin necesidad de bloquearla por completo."}, 
        {"tema": "3. Límites Transaccionales", "texto": "Configura cuánto es lo máximo que permites gastar al día para proteger tu dinero en caso de pérdida."}, 
        {"tema": "4. Compras en el Extranjero", "texto": "Activa o desactiva la opción de compras internacionales con un solo toque antes de viajar."}
    ];
    
    // ==========================================
    // LÓGICA: SIEMPRE INICIA EN TEMA 1 Y AVANZA EN 4 PASOS
    // ==========================================
    
    let currentSlide = 0; // Cero representa el Tema 1
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