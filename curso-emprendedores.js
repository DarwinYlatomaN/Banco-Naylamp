document.addEventListener('DOMContentLoaded', () => {
    const cursoId = 'emprendedores';
    
    // Obtener datos del usuario
    const userName = localStorage.getItem('naylampUserName') || 'Usuario Invitado';
    const progressKey = `naylamp_progress_${userName}`;
    let userProgress = JSON.parse(localStorage.getItem(progressKey)) || { app: 0, intereses: 0, debito: 0, ahorro: 0, credito: 0, ciberseguridad: 0, emprendedores: 0 };

    // Temario específico de ESTE módulo
    const lecciones = [{"tema": "1. Separa tus finanzas", "texto": "Nunca mezcles el dinero de tu negocio con tus gastos personales. Esta es la regla de oro para saber tu rentabilidad real."}, {"tema": "2. Cobros con POS", "texto": "Acepta tarjetas de crédito y débito. Aumentarás tus ventas, darás facilidades a tus clientes y reducirás el riesgo del efectivo."}, {"tema": "3. Yape Empresa", "texto": "Agiliza tus cobros diarios, recibe notificaciones de pago al instante, crea perfiles para tus ayudantes y maneja montos mayores."}, {"tema": "4. Fondo de Capital", "texto": "Guarda un porcentaje fijo de tus ganancias mensuales exclusivamente para reinvertir en mercadería o mejorar tu local."}];
    
    let currentSlide = 0;
    const totalSlides = lecciones.length;
    let currentProgress = userProgress[cursoId] || 0; 

    // Ajustar slide según el progreso
    if (currentProgress > 0 && currentProgress < 100) {
        currentSlide = Math.floor((currentProgress / 100) * totalSlides);
    } else if (currentProgress >= 100) {
        currentSlide = totalSlides - 1;
    }

    const slideTitle = document.getElementById('slideTitle');
    const slideText = document.getElementById('slideText');
    const cursoBar = document.getElementById('cursoBar');
    const cursoPct = document.getElementById('cursoPct');
    const btnAvanzar = document.getElementById('btnAvanzar');

    const renderSlide = () => {
        let pct = Math.round(((currentSlide) / totalSlides) * 100);
        if (currentProgress >= 100) pct = 100;

        slideTitle.innerText = lecciones[currentSlide].tema;
        slideText.innerText = lecciones[currentSlide].texto;

        cursoBar.style.width = `${pct}%`;
        cursoPct.innerText = `${pct}%`;

        if (pct >= 100 || currentProgress >= 100) {
            btnAvanzar.innerHTML = '¡Módulo Completado! <i class="fa-solid fa-check-double"></i>';
            btnAvanzar.classList.add('completado');
        } else {
            btnAvanzar.innerHTML = 'Siguiente lección <i class="fa-solid fa-arrow-right"></i>';
        }
    };

    btnAvanzar.addEventListener('click', () => {
        if (currentProgress < 100 && currentSlide < totalSlides - 1) {
            currentSlide++;
            currentProgress = Math.round(((currentSlide + 1) / totalSlides) * 100);
            if (currentProgress > 100) currentProgress = 100;
            
            userProgress[cursoId] = currentProgress;
            localStorage.setItem(progressKey, JSON.stringify(userProgress));
            renderSlide();
        } else if (currentProgress < 100 && currentSlide === totalSlides - 1) {
            currentProgress = 100;
            userProgress[cursoId] = currentProgress;
            localStorage.setItem(progressKey, JSON.stringify(userProgress));
            renderSlide();
        } else {
            window.location.href = 'modulo.html';
        }
    });

    document.getElementById('btnVolver').addEventListener('click', () => {
        window.location.href = 'modulo.html';
    });

    setTimeout(renderSlide, 150);
});