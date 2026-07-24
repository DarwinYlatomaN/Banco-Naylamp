document.addEventListener('DOMContentLoaded', () => {
    const cursoId = 'credito';
    
    const userName = localStorage.getItem('naylampUserName') || 'Usuario Invitado';
    const progressKey = `naylamp_progress_${userName}`;
    let userProgress = JSON.parse(localStorage.getItem(progressKey)) || { app: 0, intereses: 0, debito: 0, ahorro: 0, credito: 0, ciberseguridad: 0, emprendedores: 0 };

    const lecciones = [
        {"tema": "1. El Cronograma de Pagos", "texto": "Aprende a leer tu cronograma para saber exactamente qué parte de tu cuota va al capital y qué parte a los intereses."}, 
        {"tema": "2. Amortización", "texto": "Es el proceso de reducir tu deuda. Cuanto más amortices al inicio, menos intereses pagarás en total."}, 
        {"tema": "3. Pagos Anticipados", "texto": "Si tienes un dinero extra, abónalo directo al capital. El Banco Naylamp no cobra penalidades por pagos adelantados."}, 
        {"tema": "4. Historial Crediticio", "texto": "Paga puntual para construir un buen historial. Esto te abrirá las puertas a mejores tasas para comprar tu casa o auto."}
    ];
    
    let currentProgress = userProgress[cursoId] || 0; 
    let currentSlide = 0;

    if (currentProgress > 0 && currentProgress < 100) {
        currentSlide = Math.floor((currentProgress - 1) / 25);
    } else if (currentProgress === 100) {
        currentSlide = 3;
    }

    const slideTitle = document.getElementById('slideTitle');
    const slideText = document.getElementById('slideText');
    const cursoBar = document.getElementById('cursoBar');
    const cursoPct = document.getElementById('cursoPct');
    const btnAvanzar = document.getElementById('btnAvanzar');
    const btnVolver = document.getElementById('btnVolver');

    const actionsContainer = document.querySelector('.leccion-actions');
    if (actionsContainer && !document.getElementById('btnReiniciar')) {
        const btnReiniciar = document.createElement('button');
        btnReiniciar.id = 'btnReiniciar';
        btnReiniciar.className = 'btn';
        btnReiniciar.style.cssText = 'background-color: white; border: 2px solid #0b1526; color: #0b1526; flex: 1; margin-right: 10px; display: flex; align-items: center; justify-content: center; gap: 5px;';
        btnReiniciar.innerHTML = '<i class="fa-solid fa-rotate-left"></i> Reiniciar';
        actionsContainer.insertBefore(btnReiniciar, btnVolver);
        
        btnReiniciar.addEventListener('click', () => {
            if (confirm('¿Estás seguro que deseas reiniciar este curso desde cero?')) {
                userProgress[cursoId] = 0;
                localStorage.setItem(progressKey, JSON.stringify(userProgress));
                window.location.reload();
            }
        });
    }

    const renderSlide = () => {
        let pct = (currentSlide + 1) * 25; 
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
            currentProgress = 100;
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