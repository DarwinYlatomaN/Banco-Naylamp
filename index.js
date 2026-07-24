document.addEventListener('DOMContentLoaded', () => {
    
    // ==========================================
    // 1. LÓGICA DEL MODAL (INGRESO)
    // ==========================================
    const modal = document.getElementById('loginModal');
    const btnEmpezar = document.getElementById('btnEmpezar');
    const userBtn = document.querySelector('.user-btn'); 
    const closeModal = document.getElementById('closeModal');
    const saveUserBtn = document.getElementById('saveUserBtn');
    const userNameInput = document.getElementById('userNameInput');
    const userPasswordInput = document.getElementById('userPasswordInput'); 

    // Función para abrir el modal
    const openModal = () => {
        if (modal) {
            modal.style.display = 'flex';
            if (userNameInput) userNameInput.focus(); // Pone el cursor en el input
        }
    };

    // Eventos para abrir el modal
    if (btnEmpezar) btnEmpezar.addEventListener('click', openModal);
    if (userBtn) userBtn.addEventListener('click', openModal);

    // Eventos para cerrar el modal
    if (closeModal) {
        closeModal.addEventListener('click', () => modal.style.display = 'none');
    }
    window.addEventListener('click', (e) => {
        if (e.target === modal) modal.style.display = 'none';
    });

    // Guardar usuario y redirigir
    const loginUser = () => {
        const name = userNameInput.value.trim();
        const password = userPasswordInput.value.trim();
        let isValid = true;
        
        // Validar Nombre
        if (!name) {
            userNameInput.style.border = '1px solid red';
            setTimeout(() => userNameInput.style.border = '1px solid #e2e8f0', 1000);
            isValid = false;
        }

        // Validar Contraseña
        if (!password) {
            userPasswordInput.style.border = '1px solid red';
            setTimeout(() => userPasswordInput.style.border = '1px solid #e2e8f0', 1000);
            isValid = false;
        }

        // Si ambos están llenos, simulamos el ingreso exitoso
        if (isValid) {
            // Guardamos el nombre COMPLETO (para el certificado)
            localStorage.setItem('naylampUserName', name);
            
            // Cambiamos el texto del botón para simular carga
            saveUserBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Validando...';
            saveUserBtn.style.opacity = '0.8';
            
            // Pausa de 0.8 segundos para el efecto de validación
            setTimeout(() => {
                window.location.href = 'progreso.html';
            }, 800);
        }
    };

    // Ejecutar al dar clic en ingresar
    if (saveUserBtn) saveUserBtn.addEventListener('click', loginUser);
    
    // Ejecutar al presionar "Enter" en los campos
    if (userNameInput) {
        userNameInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') userPasswordInput.focus(); // Pasa a la contraseña
        });
    }
    if (userPasswordInput) {
        userPasswordInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') loginUser(); // Intenta ingresar
        });
    }

    // ==========================================
    // 2. LÓGICA DEL BUSCADOR DEL INICIO
    // ==========================================
    const searchBox = document.querySelector('.search-box input');
    
    if (searchBox) {
        searchBox.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                const termino = searchBox.value.trim();
                if (termino !== '') {
                    // Manda la palabra clave a la página de módulos a través de la URL
                    window.location.href = `modulo.html?buscar=${encodeURIComponent(termino)}`;
                }
            }
        });
    }
});