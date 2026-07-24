
const montoSlider = document.getElementById('montoSlider');
const montoBadge = document.getElementById('montoBadge');
const cuotasSlider = document.getElementById('cuotasSlider');
const cuotasBadge = document.getElementById('cuotasBadge');
const cuotasGroup = document.getElementById('cuotasGroup');

const cardOptions = document.querySelectorAll('.card-option');
const btnCuotas = document.getElementById('btnCuotas');
const btnMinimo = document.getElementById('btnMinimo');

// Elementos de Resultado
const lblCapital = document.getElementById('lblCapital');
const lblIntereses = document.getElementById('lblIntereses');
const lblTotal = document.getElementById('lblTotal');
const lblDetalle = document.getElementById('lblDetalle');
const legCapital = document.getElementById('legCapital');
const legInteres = document.getElementById('legInteres');
const donutChart = document.getElementById('donutChart');
const adviceBox = document.getElementById('adviceBox');
const adviceText = document.getElementById('adviceText');

// Estado de la aplicación
let isPagoMinimo = false;

// Formateador de moneda (Soles)
const formatter = new Intl.NumberFormat('es-PE', {
    style: 'currency',
    currency: 'PEN',
    minimumFractionDigits: 2
});

// Actualizar colores del track del slider
function updateSliderBackground(slider, color) {
    const value = (slider.value - slider.min) / (slider.max - slider.min) * 100;
    slider.style.background = `linear-gradient(to right, ${color} 0%, ${color} ${value}%, #e2e8f0 ${value}%, #e2e8f0 100%)`;
}

// Lógica Matemática (Sistema Francés)
function calculate() {
    let monto = parseFloat(montoSlider.value);
    
    // Obtener TEA de la tarjeta seleccionada
    const activeCard = document.querySelector('.card-option.active');
    let tea = parseFloat(activeCard.dataset.tea);
    
    // Convertir TEA (Tasa Efectiva Anual) a TEM (Tasa Efectiva Mensual)
    let tem = Math.pow(1 + tea, 1/12) - 1;
    
    let cuotas = parseInt(cuotasSlider.value);
    let cuotaMensual = 0;
    let totalPagar = 0;
    let intereses = 0;

    if (isPagoMinimo) {
        // Simulación básica de Pago Mínimo (Asumimos 36 meses + interés rotativo alto)
        cuotas = 36; 
        cuotaMensual = monto * 0.05; // Pago mínimo aprox 5%
        totalPagar = cuotaMensual * cuotas;
        intereses = totalPagar - monto;
    } else {
        // Fórmula de amortización tradicional
        if (cuotas === 1) {
            cuotaMensual = monto;
            intereses = 0;
            totalPagar = monto;
        } else {
            cuotaMensual = monto * (tem * Math.pow(1 + tem, cuotas)) / (Math.pow(1 + tem, cuotas) - 1);
            totalPagar = cuotaMensual * cuotas;
            intereses = totalPagar - monto;
        }
    }

    // Prevenir NaN o infinitos por seguridad
    if (!totalPagar) { totalPagar = monto; intereses = 0; cuotaMensual = monto; }

    updateUI(monto, intereses, totalPagar, cuotaMensual, cuotas);
    updateAdvice(monto, tem, cuotas, intereses);
}

// Actualizar la interfaz
function updateUI(monto, intereses, totalPagar, cuotaMensual, cuotas) {
    lblCapital.textContent = formatter.format(monto);
    lblIntereses.textContent = formatter.format(intereses);
    lblTotal.textContent = formatter.format(totalPagar);
    
    if (isPagoMinimo) {
        lblDetalle.textContent = `S/ ~${cuotaMensual.toFixed(2)} / mes × Pago Mínimo Prolongado`;
    } else {
        lblDetalle.textContent = `${formatter.format(cuotaMensual)} / mes × ${cuotas} cuotas`;
    }

    legCapital.textContent = formatter.format(monto);
    legInteres.textContent = formatter.format(intereses);

    // Actualizar gráfico de dona
    let percentCapital = (monto / totalPagar) * 100;
    donutChart.style.background = `conic-gradient(var(--navy) 0% ${percentCapital}%, var(--gold) ${percentCapital}% 100%)`;
}

// Actualizar consejo dinámico
function updateAdvice(monto, tem, cuotasActuales, interesesActuales) {
    if (isPagoMinimo) {
        adviceBox.style.display = 'flex';
        adviceText.innerHTML = `Pagar solo el mínimo <strong>maximiza tus intereses</strong> y alarga tu deuda por años. Intenta pagar en cuotas fijas.`;
        return;
    }

    if (cuotasActuales <= 1) {
        adviceBox.style.display = 'none'; // No hay consejo si paga a 1 cuota (sin intereses)
        return;
    }

    adviceBox.style.display = 'flex';
    let cuotasSugeridas = Math.ceil(cuotasActuales / 2);
    
    if (cuotasSugeridas === 1) {
        adviceText.innerHTML = `Si pagas en <strong>1 cuota</strong>, no pagarás intereses. Ahorrarías <strong>${formatter.format(interesesActuales)}</strong>.`;
        return;
    }

    // Recalcular para la mitad de cuotas
    let nuevaCuotaMensual = monto * (tem * Math.pow(1 + tem, cuotasSugeridas)) / (Math.pow(1 + tem, cuotasSugeridas) - 1);
    let nuevosIntereses = (nuevaCuotaMensual * cuotasSugeridas) - monto;
    let ahorro = interesesActuales - nuevosIntereses;

    adviceText.innerHTML = `Reduce de <strong>${cuotasActuales}</strong> a <strong>${cuotasSugeridas}</strong> cuotas y ahorrarías <strong>${formatter.format(ahorro)}</strong> en intereses.`;
}

// ==========================================
// EVENT LISTENERS
// ==========================================

// Slider Monto
montoSlider.addEventListener('input', (e) => {
    let val = parseFloat(e.target.value);
    montoBadge.textContent = formatter.format(val);
    updateSliderBackground(montoSlider, '#0b1526');
    calculate();
});

// Slider Cuotas
cuotasSlider.addEventListener('input', (e) => {
    let val = e.target.value;
    cuotasBadge.textContent = `${val} mes${val > 1 ? 'es' : ''}`;
    updateSliderBackground(cuotasSlider, '#e5a93b');
    calculate();
});

// Selección de Tarjeta
cardOptions.forEach(card => {
    card.addEventListener('click', () => {
        // Remover activo de todas
        cardOptions.forEach(c => {
            c.classList.remove('active');
            c.querySelector('.card-rate').classList.remove('rate-gold');
        });
        
        // Agregar activo a la seleccionada
        card.classList.add('active');
        card.querySelector('.card-rate').classList.add('rate-gold');
        
        calculate();
    });
});

// Tipo de Pago (Toggle)
btnCuotas.addEventListener('click', () => {
    isPagoMinimo = false;
    btnCuotas.classList.add('active');
    btnMinimo.classList.remove('active');
    cuotasGroup.style.opacity = '1';
    cuotasSlider.disabled = false;
    calculate();
});

btnMinimo.addEventListener('click', () => {
    isPagoMinimo = true;
    btnMinimo.classList.add('active');
    btnCuotas.classList.remove('active');
    cuotasGroup.style.opacity = '0.5';
    cuotasSlider.disabled = true;
    calculate();
});

// Inicialización
updateSliderBackground(montoSlider, '#0b1526');
updateSliderBackground(cuotasSlider, '#e5a93b');
calculate();