document.addEventListener('DOMContentLoaded', () => {
    const modal = document.getElementById('loginModal');
    const btnEmpezar = document.getElementById('btnEmpezar');
    const userBtn = document.querySelector('.user-btn'); // El icono del usuario en el menú
    const closeModal = document.getElementById('closeModal');
    const saveUserBtn = document.getElementById('saveUserBtn');
    const userNameInput = document.getElementById('userNameInput');

    // Función para abrir el modal
    const openModal = () => {
        modal.style.display = 'flex';
        userNameInput.focus();
    };

    // Eventos para abrir el modal
    if (btnEmpezar) btnEmpezar.addEventListener('click', openModal);
    if (userBtn) userBtn.addEventListener('click', openModal);

    // Eventos para cerrar el modal
    closeModal.addEventListener('click', () => modal.style.display = 'none');
    window.addEventListener('click', (e) => {
        if (e.target === modal) modal.style.display = 'none';
    });

    
});

const userPasswordInput = document.getElementById('userPasswordInput'); // <-- Nuevo campo capturado

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
            // Guardamos el nombre
            localStorage.setItem('naylampUserName', name);
            
            // Cambiamos el texto del botón para simular carga
            saveUserBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Validando...';
            saveUserBtn.style.opacity = '0.8';
            
            // Pequeña pausa de 1 segundo para que parezca que está "cargando" el sistema
            setTimeout(() => {
                window.location.href = 'progreso.html';
            }, 800);
        }
    };

    // Ejecutar al dar clic en ingresar
    saveUserBtn.addEventListener('click', loginUser);
    
    // Ejecutar al presionar "Enter" en cualquier campo
    userNameInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') userPasswordInput.focus(); // Pasa a la contraseña
    });
    userPasswordInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') loginUser(); // Intenta ingresar
    });