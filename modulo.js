document.addEventListener('DOMContentLoaded', () => {

    // 1. LÓGICA DE BÚSQUEDA Y FILTRADO
    const searchInput = document.getElementById('searchInput');
    const filterBtns = document.querySelectorAll('.filter-btn');
    const courseCards = document.querySelectorAll('.catalog-card');
    const noResultsMsg = document.getElementById('noResultsMsg');

    const filterCourses = () => {
        const searchTerm = searchInput.value.toLowerCase().trim();
        const activeCategory = document.querySelector('.filter-btn.active').getAttribute('data-filter');
        let visibleCount = 0;

        courseCards.forEach(card => {
            const cardCategory = card.getAttribute('data-category');
            const cardTitle = card.querySelector('h3').innerText.toLowerCase();
            const cardDesc = card.querySelector('p').innerText.toLowerCase();

            const matchCategory = (activeCategory === 'todos' || activeCategory === cardCategory);
            const matchSearch = (cardTitle.includes(searchTerm) || cardDesc.includes(searchTerm));

            if (matchCategory && matchSearch) {
                card.style.display = 'flex';
                visibleCount++;
            } else {
                card.style.display = 'none';
            }
        });

        if (visibleCount === 0) {
            noResultsMsg.style.display = 'block';
        } else {
            noResultsMsg.style.display = 'none';
        }
    };

    if (searchInput) searchInput.addEventListener('input', filterCourses);

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            filterCourses();
        });
    });

    // 2. LÓGICA DEL ACORDEÓN (GLOSARIO)
    const accordions = document.querySelectorAll('.accordion-btn');
    accordions.forEach(acc => {
        acc.addEventListener('click', function() {
            this.classList.toggle('active');
            const panel = this.nextElementSibling;
            if (panel.style.maxHeight) {
                panel.style.maxHeight = null;
            } else {
                panel.style.maxHeight = panel.scrollHeight + "px";
            } 
        });
    });

    // 3. RUTEO DE BOTONES "VER MÓDULO" (CORREGIDO)
    const viewCourseBtns = document.querySelectorAll('.btn-outline-navy');
    
    viewCourseBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            // Lee el data-id que le pusimos al botón en el HTML (ej: "app", "ahorro", "ciberseguridad")
            const courseId = e.currentTarget.getAttribute('data-id');
            
            // Animación de carga visual
            e.currentTarget.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Cargando...';
            
            // Redirigir al curso exacto después de medio segundo
            setTimeout(() => {
                if (courseId) {
                    window.location.href = `curso-${courseId}.html`;
                }
            }, 500);
        });
    });

    // ==========================================
    // 4. CAPTURAR BÚSQUEDA DESDE EL INICIO (AGREGADO QUIRÚRGICO)
    // ==========================================
    const urlParams = new URLSearchParams(window.location.search);
    const buscarTermino = urlParams.get('buscar');
    
    if (buscarTermino && searchInput) {
        // Escribimos el término en la barra de búsqueda visualmente
        searchInput.value = buscarTermino;
        
        // Llamamos directamente a tu propia función de filtrado
        filterCourses();
    }
});