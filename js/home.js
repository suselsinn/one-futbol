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
function validarDNI(dni) {
    const dniLimpio = dni.trim().toUpperCase();
    const regexDNI = /^[0-9]{8}[A-Z]$/;
    
    if (!regexDNI.test(dniLimpio)) return false;

    const letras = "TRWAGMYFPDXBNJZSQVHLCKE";
    const numero = parseInt(dniLimpio.substring(0, 8), 10);
    const letraIngresada = dniLimpio.charAt(8);

    return letras[numero % 23] === letraIngresada;
}

function validarTelefono(telefono) {
    let tfnoLimpio = telefono.trim().replace(/\s+/g, '');
    if (tfnoLimpio.startsWith('+34')) {
        tfnoLimpio = tfnoLimpio.substring(3);
    }
    const regexTfno = /^[6789]\d{8}$/;
    return regexTfno.test(tfnoLimpio);
}

function validarEmail(email) {
    const regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regexEmail.test(email.trim().toLowerCase());
}

function validarEdad(fechaStr) {
    if (!fechaStr) return false;

    const fechaNac = new Date(fechaStr);
    const hoy = new Date();

    if (isNaN(fechaNac.getTime()) || fechaNac > hoy) return false;

    let edad = hoy.getFullYear() - fechaNac.getFullYear();
    const mesDiff = hoy.getMonth() - fechaNac.getMonth();
    const diaDiff = hoy.getDate() - fechaNac.getDate();

    if (mesDiff < 0 || (mesDiff === 0 && diaDiff < 0)) {
        edad--;
    }

    return edad >= 18;
}

function setFieldError(fieldId, isError) {
    const input = document.getElementById(fieldId);
    if (!input) return;

    if (isError) {
        input.classList.add('is-invalid');
        input.classList.remove('is-valid');
    } else {
        input.classList.remove('is-invalid');
        input.classList.add('is-valid');
    }
}

function validarPaso3() {
    let esValido = true;

    const nombre = document.getElementById('nombre').value.trim();
    if (nombre.length === 0) {
        setFieldError('nombre', true);
        esValido = false;
    } else {
        setFieldError('nombre', false);
    }

    const apellidos = document.getElementById('apellidos').value.trim();
    if (apellidos.length === 0) {
        setFieldError('apellidos', true);
        esValido = false;
    } else {
        setFieldError('apellidos', false);
    }

    const dni = document.getElementById('dni').value;
    if (!validarDNI(dni)) {
        setFieldError('dni', true);
        esValido = false;
    } else {
        setFieldError('dni', false);
    }

    const telefono = document.getElementById('telefono').value;
    if (!validarTelefono(telefono)) {
        setFieldError('telefono', true);
        esValido = false;
    } else {
        setFieldError('telefono', false);
    }

    const email = document.getElementById('email').value;
    const emailNormalizado = email.trim().toLowerCase();
    if (!validarEmail(email)) {
        setFieldError('email', true);
        esValido = false;
    } else {
        setFieldError('email', false);
    }

    const confirmarEmail = document.getElementById('confirmar-email').value;
    const confirmarNormalizado = confirmarEmail.trim().toLowerCase();
    if (confirmarNormalizado !== emailNormalizado || confirmarNormalizado === '') {
        setFieldError('confirmar-email', true);
        esValido = false;
    } else {
        setFieldError('confirmar-email', false);
    }

    const fechaNac = document.getElementById('fecha-nacimiento').value;
    if (!validarEdad(fechaNac)) {
        setFieldError('fecha-nacimiento', true);
        esValido = false;
    } else {
        setFieldError('fecha-nacimiento', false);
    }

    return esValido;
}
function validarPasoActual(step) {
    if (step === 1) return validarPaso1();
    if (step === 2) return validarPaso2();
    if (step === 3) return validarPaso3();
    return true;
}
function validarCodigoPostal(cp, provinciaCod) {
    const cpLimpio = cp.trim();
    const regexCP = /^[0-9]{5}$/;

    if (!regexCP.test(cpLimpio)) return false;
    if (!provinciaCod) return false;

    const prefijo = cpLimpio.substring(0, 2);
    return prefijo === provinciaCod;
}

function validarPaso4() {
    let esValido = true;

    const direccion = document.getElementById('direccion').value.trim();
    if (direccion.length === 0) {
        setFieldError('direccion', true);
        esValido = false;
    } else {
        setFieldError('direccion', false);
    }

    const numero = document.getElementById('numero').value.trim();
    if (numero.length === 0) {
        setFieldError('numero', true);
        esValido = false;
    } else {
        setFieldError('numero', false);
    }

    const localidad = document.getElementById('localidad').value.trim();
    if (localidad.length === 0) {
        setFieldError('localidad', true);
        esValido = false;
    } else {
        setFieldError('localidad', false);
    }

    const provincia = document.getElementById('provincia').value;
    if (provincia === '') {
        setFieldError('provincia', true);
        esValido = false;
    } else {
        setFieldError('provincia', false);
    }

    const cp = document.getElementById('codigo-postal').value;
    if (!validarCodigoPostal(cp, provincia)) {
        setFieldError('codigo-postal', true);
        esValido = false;
    } else {
        setFieldError('codigo-postal', false);
    }

    return esValido;
}
function validarPasoActual(step) {
    if (step === 1) return validarPaso1();
    if (step === 2) return validarPaso2();
    if (step === 3) return validarPaso3();
    if (step === 4) return validarPaso4();
    return true;
}
function validarLuhn(numero) {
    const numLimpio = numero.replace(/\s+/g, '');
    if (!/^\d{16}$/.test(numLimpio)) return false;

    let suma = 0;
    let duplicar = false;

    for (let i = numLimpio.length - 1; i >= 0; i--) {
        let digito = parseInt(numLimpio.charAt(i), 10);
        if (duplicar) {
            digito *= 2;
            if (digito > 9) digito -= 9;
        }
        suma += digito;
        duplicar = !duplicar;
    }

    return (suma % 10) === 0;
}

function validarIBAN(iban) {
    const ibanLimpio = iban.replace(/\s+/g, '').toUpperCase();
    if (!/^ES\d{22}$/.test(ibanLimpio)) return false;

    const reordenado = ibanLimpio.substring(4) + "1428" + ibanLimpio.substring(2, 4);

    let resto = 0;
    for (let i = 0; i < reordenado.length; i++) {
        resto = (resto * 10 + parseInt(reordenado.charAt(i), 10)) % 97;
    }

    return resto === 1;
}

function validarCaducidad(caducidad) {
    const cadLimpia = caducidad.trim();
    if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(cadLimpia)) return false;

    const partes = cadLimpia.split('/');
    const mes = parseInt(partes[0], 10);
    const ano = 2000 + parseInt(partes[1], 10);

    const hoy = new Date();
    const anoActual = hoy.getFullYear();
    const mesActual = hoy.getMonth() + 1;

    if (ano < anoActual) return false;
    if (ano === anoActual && mes < mesActual) return false;

    return true;
}

function initPaso5() {
    const radioTarjeta = document.getElementById('pago-tarjeta');
    const radioIBAN = document.getElementById('pago-iban');
    const bloqueTarjeta = document.getElementById('bloque-tarjeta');
    const bloqueIBAN = document.getElementById('bloque-iban');

    function alternarMetodos() {
        if (radioTarjeta.checked) {
            bloqueTarjeta.classList.remove('d-none');
            bloqueIBAN.classList.add('d-none');
            setFieldError('titular-iban', false);
            setFieldError('numero-iban', false);
        } else {
            bloqueIBAN.classList.remove('d-none');
            bloqueTarjeta.classList.add('d-none');
            setFieldError('titular-tarjeta', false);
            setFieldError('numero-tarjeta', false);
            setFieldError('caducidad-tarjeta', false);
            setFieldError('cvv-tarjeta', false);
        }
    }

    radioTarjeta.addEventListener('change', alternarMetodos);
    radioIBAN.addEventListener('change', alternarMetodos);
}

function validarPaso5() {
    let esValido = true;
    const esTarjeta = document.getElementById('pago-tarjeta').checked;

    if (esTarjeta) {
        const titular = document.getElementById('titular-tarjeta').value.trim();
        if (titular.length === 0) {
            setFieldError('titular-tarjeta', true);
            esValido = false;
        } else {
            setFieldError('titular-tarjeta', false);
        }

        const numero = document.getElementById('numero-tarjeta').value;
        if (!validarLuhn(numero)) {
            setFieldError('numero-tarjeta', true);
            esValido = false;
        } else {
            setFieldError('numero-tarjeta', false);
        }

        const caducidad = document.getElementById('caducidad-tarjeta').value;
        if (!validarCaducidad(caducidad)) {
            setFieldError('caducidad-tarjeta', true);
            esValido = false;
        } else {
            setFieldError('caducidad-tarjeta', false);
        }

        const cvv = document.getElementById('cvv-tarjeta').value.trim();
        if (!/^\d{3}$/.test(cvv)) {
            setFieldError('cvv-tarjeta', true);
            esValido = false;
        } else {
            setFieldError('cvv-tarjeta', false);
        }
    } else {
        const titular = document.getElementById('titular-iban').value.trim();
        if (titular.length === 0) {
            setFieldError('titular-iban', true);
            esValido = false;
        } else {
            setFieldError('titular-iban', false);
        }

        const iban = document.getElementById('numero-iban').value;
        if (!validarIBAN(iban)) {
            setFieldError('numero-iban', true);
            esValido = false;
        } else {
            setFieldError('numero-iban', false);
        }
    }

    return esValido;
}

document.addEventListener('DOMContentLoaded', () => {
    initPaso5();
});
function setFieldError(fieldId, isError) {
    const input = document.getElementById(fieldId);
    if (!input) return;

    const feedbackId = `error-${fieldId}`;
    const feedbackEl = document.getElementById(feedbackId);

    if (isError) {
        input.classList.add('is-invalid');
        input.classList.remove('is-valid');
        input.setAttribute('aria-invalid', 'true');
        if (feedbackEl) {
            input.setAttribute('aria-describedby', feedbackId);
        }
    } else {
        input.classList.remove('is-invalid');
        input.classList.add('is-valid');
        input.setAttribute('aria-invalid', 'false');
        input.removeAttribute('aria-describedby');
    }
}

function obtenerTodosLosErrores() {
    const listaErrores = [];

    if (!validarPaso1()) {
        listaErrores.push({
            step: 1,
            fieldId: 'plan-basico',
            label: 'Plan Principal',
            mensaje: 'Debes seleccionar un plan principal'
        });
    }

    if (!validarPaso3()) {
        if (document.getElementById('nombre').classList.contains('is-invalid')) {
            listaErrores.push({ step: 3, fieldId: 'nombre', label: 'Nombre', mensaje: 'Nombre obligatorio o inválido' });
        }
        if (document.getElementById('apellidos').classList.contains('is-invalid')) {
            listaErrores.push({ step: 3, fieldId: 'apellidos', label: 'Apellidos', mensaje: 'Apellidos obligatorios' });
        }
        if (document.getElementById('dni').classList.contains('is-invalid')) {
            listaErrores.push({ step: 3, fieldId: 'dni', label: 'DNI/NIE', mensaje: 'Letra de control de DNI no válida' });
        }
        if (document.getElementById('telefono').classList.contains('is-invalid')) {
            listaErrores.push({ step: 3, fieldId: 'telefono', label: 'Teléfono', mensaje: 'Formato de teléfono español no válido' });
        }
        if (document.getElementById('email').classList.contains('is-invalid')) {
            listaErrores.push({ step: 3, fieldId: 'email', label: 'Correo electrónico', mensaje: 'Formato de email no válido' });
        }
        if (document.getElementById('confirmar-email').classList.contains('is-invalid')) {
            listaErrores.push({ step: 3, fieldId: 'confirmar-email', label: 'Confirmar correo', mensaje: 'Los correos no coinciden' });
        }
        if (document.getElementById('fecha-nacimiento').classList.contains('is-invalid')) {
            listaErrores.push({ step: 3, fieldId: 'fecha-nacimiento', label: 'Fecha de nacimiento', mensaje: 'Debes ser mayor de 18 años' });
        }
    }

    if (!validarPaso4()) {
        if (document.getElementById('direccion').classList.contains('is-invalid')) {
            listaErrores.push({ step: 4, fieldId: 'direccion', label: 'Dirección', mensaje: 'Vía requerida' });
        }
        if (document.getElementById('numero').classList.contains('is-invalid')) {
            listaErrores.push({ step: 4, fieldId: 'numero', label: 'Número', mensaje: 'Número requerido' });
        }
        if (document.getElementById('localidad').classList.contains('is-invalid')) {
            listaErrores.push({ step: 4, fieldId: 'localidad', label: 'Localidad', mensaje: 'Localidad requerida' });
        }
        if (document.getElementById('provincia').classList.contains('is-invalid')) {
            listaErrores.push({ step: 4, fieldId: 'provincia', label: 'Provincia', mensaje: 'Selecciona una provincia' });
        }
        if (document.getElementById('codigo-postal').classList.contains('is-invalid')) {
            listaErrores.push({ step: 4, fieldId: 'codigo-postal', label: 'Código Postal', mensaje: 'CP de 5 cifras no coincidente con provincia' });
        }
    }

    if (!validarPaso5()) {
        const esTarjeta = document.getElementById('pago-tarjeta').checked;
        if (esTarjeta) {
            if (document.getElementById('titular-tarjeta').classList.contains('is-invalid')) {
                listaErrores.push({ step: 5, fieldId: 'titular-tarjeta', label: 'Titular Tarjeta', mensaje: 'Titular requerido' });
            }
            if (document.getElementById('numero-tarjeta').classList.contains('is-invalid')) {
                listaErrores.push({ step: 5, fieldId: 'numero-tarjeta', label: 'Número Tarjeta', mensaje: 'Número no superó la prueba de Luhn' });
            }
            if (document.getElementById('caducidad-tarjeta').classList.contains('is-invalid')) {
                listaErrores.push({ step: 5, fieldId: 'caducidad-tarjeta', label: 'Caducidad Tarjeta', mensaje: 'Fecha de caducidad caducada o incorrecta' });
            }
            if (document.getElementById('cvv-tarjeta').classList.contains('is-invalid')) {
                listaErrores.push({ step: 5, fieldId: 'cvv-tarjeta', label: 'CVV', mensaje: 'Código CVV de 3 dígitos requerido' });
            }
        } else {
            if (document.getElementById('titular-iban').classList.contains('is-invalid')) {
                listaErrores.push({ step: 5, fieldId: 'titular-iban', label: 'Titular Cuenta', mensaje: 'Titular de cuenta requerido' });
            }
            if (document.getElementById('numero-iban').classList.contains('is-invalid')) {
                listaErrores.push({ step: 5, fieldId: 'numero-iban', label: 'IBAN', mensaje: 'IBAN no superó Módulo 97' });
            }
        }
    }

    return listaErrores;
}

function procesarFormularioKO(listaErrores) {
    const errorSummary = document.getElementById('error-summary');
    const errorList = document.getElementById('error-list');

    errorList.innerHTML = '';

    listaErrores.forEach(err => {
        const li = document.createElement('li');
        const link = document.createElement('a');
        link.href = `#${err.fieldId}`;
        link.className = 'text-danger fw-bold text-decoration-underline';
        link.textContent = `${err.label}: ${err.mensaje}`;
        
        link.addEventListener('click', (e) => {
            e.preventDefault();
            irAlCampoConError(err.step, err.fieldId);
        });

        li.appendChild(link);
        errorList.appendChild(li);
    });

    errorSummary.classList.remove('d-none');

    const primerError = listaErrores[0];
    irAlCampoConError(primerError.step, primerError.fieldId);
}

function irAlCampoConError(stepNumber, fieldId) {
    if (typeof currentStep !== 'undefined') {
        currentStep = stepNumber;
        if (typeof updateStepVisibility === 'function') {
            updateStepVisibility();
        }
    }

    setTimeout(() => {
        const elemento = document.getElementById(fieldId);
        if (elemento) {
            elemento.scrollIntoView({ behavior: 'smooth', block: 'center' });
            elemento.focus();
        }
    }, 100);
}

function ocultarResumenErrores() {
    const errorSummary = document.getElementById('error-summary');
    if (errorSummary) {
        errorSummary.classList.add('d-none');
    }
}