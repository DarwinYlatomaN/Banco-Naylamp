document.addEventListener('DOMContentLoaded', () => {
    // 1. Obtener datos de la URL y del Usuario
    const urlParams = new URLSearchParams(window.location.search);
    const cursoId = urlParams.get('id') || 'intereses'; // Curso por defecto si no hay ID
    
    const userName = localStorage.getItem('naylampUserName') || 'Usuario Invitado';
    const progressKey = `naylamp_progress_${userName}`;
    let userProgress = JSON.parse(localStorage.getItem(progressKey)) || { app: 0, intereses: 0, debito: 0, ahorro: 0, credito: 0 };

    // 2. Base de Datos de Cursos (Temarios Interactivos)
    const dbCursos = {
        app: {
            titulo: 'Cómo usar mi App Naylamp',
            lecciones: [
                { tema: "1. Descarga Segura", texto: "Aprende a identificar la App oficial en tu tienda de aplicaciones y evita enlaces fraudulentos por SMS." },
                { tema: "2. Creación de Clave de Internet", texto: "Genera una clave de 6 dígitos que sea fácil de recordar para ti, pero difícil de adivinar. Nunca uses tu fecha de nacimiento." },
                { tema: "3. Activación del Token Digital", texto: "El Token te permite realizar operaciones seguras generando códigos automáticos desde tu celular." },
                { tema: "4. Tu primera Transferencia", texto: "Selecciona 'Transferir', ingresa el CCI de destino y confirma la operación. ¡Es totalmente gratis y al instante!" }
            ]
        },
        intereses: {
            titulo: 'Entendiendo los Intereses',
            lecciones: [
                { tema: "1. ¿Qué es la Tasa de Interés?", texto: "Es el precio que pagas por usar el dinero del banco, o el dinero que el banco te paga a ti por guardar tus ahorros." },
                { tema: "2. TEA vs TREA", texto: "La TEA (Tasa Efectiva Anual) es lo que te cobran por un préstamo. La TREA es lo que ganas por tus ahorros." },
                { tema: "3. El Poder del Interés Compuesto", texto: "Es el interés generado sobre los intereses acumulados. A largo plazo, hace que tus ahorros crezcan exponencialmente." },
                { tema: "4. Interés Moratorio", texto: "Es la penalidad que pagas por atrasarte en un pago. ¡Activa tus alertas en la app para nunca olvidar tu fecha de pago!" }
            ]
        },
        ahorro: {
            titulo: 'Ahorro Inteligente con Naylamp',
            lecciones: [
                { tema: "1. La Regla 50/30/20", texto: "Destina el 50% de tus ingresos a necesidades básicas, 30% a gustos y 20% directamente a tu cuenta de ahorros." },
                { tema: "2. Automatiza tu Ahorro", texto: "Configura la App Naylamp para que debite automáticamente S/50 cada quincena hacia tu Cuenta Premio." },
                { tema: "3. Fondo de Emergencia", texto: "Tu primer objetivo de ahorro debe ser juntar el equivalente a 3 meses de tus gastos fijos para cualquier imprevisto." },
                { tema: "4. Evita los 'Gastos Hormiga'", texto: "Esos cafés diarios o suscripciones que no usas suman mucho a fin de mes. Identifícalos y elimínalos." }
            ]
        },
        debito: {
            titulo: 'Cómo usar mi Tarjeta de Débito',
            lecciones: [
                { tema: "1. El CVV dinámico", texto: "Para compras por internet, usa el CVV que cambia cada 5 minutos en tu App para evitar clonaciones." },
                { tema: "2. Apagado y Encendido", texto: "¿No encuentras tu tarjeta? Apágala temporalmente desde la App sin necesidad de bloquearla por completo." },
                { tema: "3. Límites Transaccionales", texto: "Configura cuánto es lo máximo que permites gastar al día para proteger tu dinero en caso de pérdida." },
                { tema: "4. Compras en el Extranjero", texto: "Activa o desactiva la opción de compras internacionales con un solo toque antes de viajar." }
            ]
        },
        credito: {
            titulo: 'Crédito Responsable',
            lecciones: [
                { tema: "1. ¿Qué es la Línea de Crédito?", texto: "Es el monto máximo que el banco te presta. Recuerda: ¡La tarjeta de crédito no es una extensión de tu sueldo!" },
                { tema: "2. Fechas Clave", texto: "La Fecha de Cierre es cuando el banco suma lo que gastaste. La Fecha de Pago es tu límite para cancelar la deuda sin moras." },
                { tema: "3. Pagar Directo (A 1 Cuota)", texto: "Si compras a 1 cuota y pagas antes de tu fecha límite, ¡No pagas absolutamente nada de intereses!" },
                { tema: "4. Disposición de Efectivo", texto: "Evita retirar efectivo con tu tarjeta de crédito en cajeros, ya que las tasas de interés son las más altas del mercado." }
            ]
        }
    };

    // 3. Inicializar vista del curso
    const cursoData = dbCursos[cursoId];
    document.getElementById('cursoTitle').innerText = cursoData.titulo;
    
    let currentSlide = 0;
    const totalSlides = cursoData.lecciones.length;
    let currentProgress = userProgress[cursoId]; 

    // Ajustar la diapositiva actual según el progreso previo guardado
    if (currentProgress > 0 && currentProgress < 100) {
        currentSlide = Math.floor((currentProgress / 100) * totalSlides);
    } else if (currentProgress >= 100) {
        currentSlide = totalSlides - 1; // Mostrar la última si ya terminó
    }

    const slideTitle = document.getElementById('slideTitle');
    const slideText = document.getElementById('slideText');
    const cursoBar = document.getElementById('cursoBar');
    const cursoPct = document.getElementById('cursoPct');
    const btnAvanzar = document.getElementById('btnAvanzar');

    // 4. Función para dibujar en pantalla
    const renderSlide = () => {
        // Calcular porcentaje real
        let pct = Math.round(((currentSlide) / totalSlides) * 100);
        if (currentProgress >= 100) pct = 100;

        // Actualizar textos de la lección
        slideTitle.innerText = cursoData.lecciones[currentSlide].tema;
        slideText.innerText = cursoData.lecciones[currentSlide].texto;

        // Actualizar barra
        cursoBar.style.width = `${pct}%`;
        cursoPct.innerText = `${pct}%`;

        // Modificar botón si ya completó todo
        if (pct >= 100 || currentProgress >= 100) {
            btnAvanzar.innerHTML = '¡Módulo Completado! <i class="fa-solid fa-check-double"></i>';
            btnAvanzar.className = 'btn btn-teal';
            cursoBar.className = 'progress-fill fill-teal';
        } else {
            btnAvanzar.innerHTML = 'Siguiente lección <i class="fa-solid fa-arrow-right"></i>';
        }
    };

    // 5. Lógica del Botón Avanzar
    btnAvanzar.addEventListener('click', () => {
        if (currentProgress < 100 && currentSlide < totalSlides - 1) {
            currentSlide++;
            
            // Actualizar progreso
            currentProgress = Math.round(((currentSlide + 1) / totalSlides) * 100);
            if (currentProgress > 100) currentProgress = 100;
            
            // Guardar base de datos local
            userProgress[cursoId] = currentProgress;
            localStorage.setItem(progressKey, JSON.stringify(userProgress));
            
            renderSlide();
        } else if (currentProgress < 100 && currentSlide === totalSlides - 1) {
            // Último clic para llegar a 100
            currentProgress = 100;
            userProgress[cursoId] = currentProgress;
            localStorage.setItem(progressKey, JSON.stringify(userProgress));
            renderSlide();
        } else {
            // Si ya terminó, el botón lo regresa al progreso
            window.location.href = 'progreso.html';
        }
    });

    // 6. Lógica Botón Volver
    document.getElementById('btnVolver').addEventListener('click', () => {
        window.location.href = 'progreso.html';
    });

    // Renderizado Inicial
    setTimeout(renderSlide, 150);
});