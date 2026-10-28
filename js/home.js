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