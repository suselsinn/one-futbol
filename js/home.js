document.addEventListener('DOMContentLoaded', () => {
    const solicitudExito = sessionStorage.getItem('solicitudExito');

    if (solicitudExito === 'true') {
        const modalElement = document.getElementById('modalExito');
        if (modalElement) {
            const modalBootstrap = new bootstrap.Modal(modalElement);
            modalBootstrap.show();
        }

        sessionStorage.removeItem('solicitudExito');
    }
});
function finalizarContratacion() {
    sessionStorage.setItem('solicitudExito', 'true');
    
    window.location.href = 'index.html';
}
document.addEventListener('DOMContentLoaded', () => {
    let currentStep = 1;
    const totalSteps = 6;

    const titles = [
        "1. Selección de Producto",
        "2. Complementos Opcionales",
        "3. Datos Personales",
        "4. Dirección de Envío",
        "5. Método de Pago",
        "6. Revisión y Confirmación"
    ];

    const btnAnterior = document.getElementById('btn-anterior');
    const btnSiguiente = document.getElementById('btn-siguiente');
    const btnConfirmar = document.getElementById('btn-confirmar');
    const stepIndicator = document.getElementById('step-indicator');
    const stepTitle = document.getElementById('step-title');
    const progressBar = document.getElementById('progress-bar');
    const form = document.getElementById('form-contratacion');

  
    function updateStepVisibility() {
     
        document.querySelectorAll('.step-step').forEach((fieldset, idx) => {
            if (idx + 1 === currentStep) {
                fieldset.classList.remove('d-none');
            } else {
                fieldset.classList.add('d-none');
            }
        });

       
        stepIndicator.textContent = `Paso ${currentStep} de ${totalSteps}`;
        stepTitle.textContent = titles[currentStep - 1];
        const progressPercentage = (currentStep / totalSteps) * 100;
        progressBar.style.width = `${progressPercentage}%`;

        
        if (currentStep === 1) {
            btnAnterior.classList.add('d-none');
        } else {
            btnAnterior.classList.remove('d-none');
        }

        if (currentStep === totalSteps) {
            btnSiguiente.classList.add('d-none');
            btnConfirmar.classList.remove('d-none');
        } else {
            btnSiguiente.classList.remove('d-none');
            btnConfirmar.classList.add('d-none');
        }

     
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    btnSiguiente.addEventListener('click', () => {
        if (validarPasoActual(currentStep)) {
            if (currentStep < totalSteps) {
                currentStep++;
                updateStepVisibility();
            }
        }
    });


    btnAnterior.addEventListener('click', () => {
        if (currentStep > 1) {
            currentStep--;
            updateStepVisibility();
        }
    });

   
    function validarPasoActual(step) {
  
        return true;
    }

    
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        
   
        sessionStorage.setItem('solicitudExito', 'true');
        window.location.href = 'index.html';
    });

  
    updateStepVisibility();
});
const estadoContratacion = {
    plan: null,
    complementos: []
};

function initPaso1() {
    const cardsPlan = document.querySelectorAll('.card-plan');
    
    cardsPlan.forEach(card => {
        card.addEventListener('click', () => {
            const radio = card.querySelector('input[type="radio"]');
            radio.checked = true;

            cardsPlan.forEach(c => {
                c.classList.remove('border-success', 'bg-black');
                c.classList.add('border-secondary', 'bg-dark');
            });
            card.classList.remove('border-secondary', 'bg-dark');
            card.classList.add('border-success', 'bg-black');

            estadoContratacion.plan = {
                id: card.dataset.plan,
                precio: parseFloat(card.dataset.precio),
                nombre: card.querySelector('h5').textContent
            };

            document.getElementById('error-plan').classList.add('d-none');

            verificarIncompatibilidad4K();
            actualizarTotalCalculado();
        });
    });
}

function initPaso2() {
    const checkboxes = document.querySelectorAll('.check-complemento');
    
    checkboxes.forEach(chk => {
        chk.addEventListener('change', () => {
            actualizarComplementosSeleccionados();
            actualizarTotalCalculado();
        });
    });
}

function actualizarComplementosSeleccionados() {
    estadoContratacion.complementos = [];
    const checkboxes = document.querySelectorAll('.check-complemento:checked:not(:disabled)');
    
    checkboxes.forEach(chk => {
        estadoContratacion.complementos.push({
            id: chk.value,
            nombre: chk.dataset.nombre,
            precio: parseFloat(chk.dataset.precio)
        });
    });
}

function verificarIncompatibilidad4K() {
    const check4K = document.getElementById('comp-4k');
    const card4K = document.getElementById('card-comp-4k');

    if (!estadoContratacion.plan || estadoContratacion.plan.id === 'basico') {
        check4K.checked = false;
        check4K.disabled = true;
        card4K.classList.add('opacity-50');
        card4K.title = "No compatible con el Plan Básico";
    } else {
        check4K.disabled = false;
        card4K.classList.remove('opacity-50');
        card4K.title = "";
    }
    actualizarComplementosSeleccionados();
}

function actualizarTotalCalculado() {
    let totalMensual = 0;

    if (estadoContratacion.plan) {
        totalMensual += estadoContratacion.plan.precio;
    }

    estadoContratacion.complementos.forEach(c => {
        totalMensual += c.precio;
    });

    const display = document.getElementById('precio-total-display');
    if (display) {
        display.textContent = `${totalMensual.toFixed(2).replace('.', ',')} € / mes`;
    }
}

function validarPaso1() {
    if (!estadoContratacion.plan) {
        document.getElementById('error-plan').classList.remove('d-none');
        return false;
    }
    document.getElementById('error-plan').classList.add('d-none');
    return true;
}

function validarPaso2() {
    verificarIncompatibilidad4K();
    return true;
}

document.addEventListener('DOMContentLoaded', () => {
    initPaso1();
    initPaso2();
});