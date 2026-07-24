document.addEventListener('DOMContentLoaded', () => {
    const cursoId = 'credito';
    
    // Obtener datos del usuario
    const userName = localStorage.getItem('naylampUserName') || 'Usuario Invitado';
    const progressKey = `naylamp_progress_${userName}`;
    let userProgress = JSON.parse(localStorage.getItem(progressKey)) || { app: 0, intereses: 0, debito: 0, ahorro: 0, credito: 0, ciberseguridad: 0, emprendedores: 0 };

    // Temario específico
    const lecciones = [{"tema": "1. ¿Qué es la Línea de Crédito?", "texto": "Es el monto máximo que el banco te presta. Recuerda: ¡La tarjeta de crédito no es una extensión de tu sueldo!"}, {"tema": "2. Fechas Clave", "texto": "La Fecha de Cierre es cuando el banco suma lo que gastaste. La Fecha de Pago es tu límite para cancelar la deuda sin moras."}, {"tema": "3. Pagar Directo (A 1 Cuota)", "texto": "Si compras a 1 cuota y pagas antes de tu fecha límite, ¡No pagas absolutamente nada de intereses!"}, {"tema": "4. Disposición de Efectivo", "texto": "Evita retirar efectivo con tu tarjeta de crédito en cajeros, ya que las tasas de interés son las más altas del mercado."}];
    
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