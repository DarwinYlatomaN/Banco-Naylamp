document.addEventListener('DOMContentLoaded', () => {
    // ¡AQUÍ ESTABA EL ERROR! Ahora está forzado a guardar en "ahorro"
    const cursoId = 'ahorro'; 
    
    const userName = localStorage.getItem('naylampUserName') || 'Usuario Invitado';
    const progressKey = `naylamp_progress_${userName}`;
    let userProgress = JSON.parse(localStorage.getItem(progressKey)) || { app: 0, intereses: 0, debito: 0, ahorro: 0, credito: 0, ciberseguridad: 0, emprendedores: 0 };

    const lecciones = [
        {"tema": "1. La Regla 50/30/20", "texto": "Destina el 50% de tus ingresos a necesidades básicas, 30% a gustos y 20% directamente a tu cuenta de ahorros."}, 
        {"tema": "2. Automatiza tu Ahorro", "texto": "Configura la App Naylamp para que debite automáticamente S/50 cada quincena hacia tu Cuenta Premio."}, 
        {"tema": "3. Fondo de Emergencia", "texto": "Tu primer objetivo de ahorro debe ser juntar el equivalente a 3 meses de tus gastos fijos para cualquier imprevisto."}, 
        {"tema": "4. Evita los 'Gastos Hormiga'", "texto": "Esos cafés diarios o suscripciones que no usas suman mucho a fin de mes. Identifícalos y elimínalos."}
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
            
            // Aquí se asegura de guardar el 100% en AHORRO
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
            window.location.href = 'progreso.html'; // Al terminar, te regresa a ver tu avance general
        }
    });

    btnVolver.addEventListener('click', () => {
        window.location.href = 'modulo.html';
    });

    setTimeout(renderSlide, 150);
});