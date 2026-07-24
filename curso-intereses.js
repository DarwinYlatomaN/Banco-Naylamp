document.addEventListener('DOMContentLoaded', () => {
    const cursoId = 'intereses';
    
    // Obtener datos del usuario
    const userName = localStorage.getItem('naylampUserName') || 'Usuario Invitado';
    const progressKey = `naylamp_progress_${userName}`;
    let userProgress = JSON.parse(localStorage.getItem(progressKey)) || { app: 0, intereses: 0, debito: 0, ahorro: 0, credito: 0, ciberseguridad: 0, emprendedores: 0 };

    // Temario específico
    const lecciones = [{"tema": "1. ¿Qué es la Tasa de Interés?", "texto": "Es el precio que pagas por usar el dinero del banco, o el dinero que el banco te paga a ti por guardar tus ahorros."}, {"tema": "2. TEA vs TREA", "texto": "La TEA (Tasa Efectiva Anual) es lo que te cobran por un préstamo. La TREA es lo que ganas por tus ahorros."}, {"tema": "3. El Poder del Interés Compuesto", "texto": "Es el interés generado sobre los intereses acumulados. A largo plazo, hace que tus ahorros crezcan exponencialmente."}, {"tema": "4. Interés Moratorio", "texto": "Es la penalidad que pagas por atrasarte en un pago. ¡Activa tus alertas en la app para nunca olvidar tu fecha de pago!"}];
    
    let currentSlide = 0;
    const totalSlides = lecciones.length;
    let currentProgress = userProgress[cursoId] || 0; 

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