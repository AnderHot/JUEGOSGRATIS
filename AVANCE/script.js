
document.addEventListener("DOMContentLoaded", () => {
    const contenido = document.getElementById("contenido");
    const pageNavLinks = document.querySelectorAll("nav a:not(#logoutButton)");
    const logoutButton = document.getElementById("logoutButton");
    let authButton = document.getElementById("authButtonState");
    const authModal = document.getElementById("authModal");
    const closeModalButton = document.querySelector(".modal .close-button");
    const successMessageDiv = document.getElementById("successMessage");

    const registrationFormContainer = document.getElementById("registrationFormContainer");
    const loginFormContainer = document.getElementById("loginFormContainer");
    const showLoginLink = document.getElementById("showLogin");
    const showRegistrationLink = document.getElementById("showRegistration");

    const registrationForm = document.getElementById("registrationForm");
    const loginForm = document.getElementById("loginForm");

    let currentUserLoggedIn = false;
    let currentUsername = '';
    let currentUserEmail = ''; // Variable para el email del usuario

    // --- Código para el menú hamburguesa ---
    const menuIcon = document.getElementById('menu-icon');
    const nav = document.querySelector('header nav');
    const allNavLinks = document.querySelectorAll('header nav a');

    if (menuIcon && nav) {
        menuIcon.addEventListener('click', () => {
            nav.classList.toggle('active');
            if (nav.classList.contains('active')) {
                menuIcon.classList.remove('fa-bars');
                menuIcon.classList.add('fa-times');
            } else {
                menuIcon.classList.remove('fa-times');
                menuIcon.classList.add('fa-bars');
            }
        });

        allNavLinks.forEach(link => {
            link.addEventListener('click', () => {
                if (nav.classList.contains('active')) {
                    nav.classList.remove('active');
                    menuIcon.classList.remove('fa-times');
                    menuIcon.classList.add('fa-bars');
                }
            });
        });

        document.addEventListener('click', (event) => {
            const isClickInsideNav = nav.contains(event.target);
            const isClickOnMenuIcon = menuIcon.contains(event.target);
            if (!isClickInsideNav && !isClickOnMenuIcon && nav.classList.contains('active')) {
                nav.classList.remove('active');
                menuIcon.classList.remove('fa-times');
                menuIcon.classList.add('fa-bars');
            }
        });
    }
    // --- Fin Código para el menú hamburguesa ---

    const inicioHTMLOriginal = `
        <section class="inicio">
            <img src="img/perfil2.jpg" alt="Perfil" class="inicio-img" />
            <div class="inicio-content">
                <h1>Bienvenidos a <span>Game Drop</span></h1>
                <h3 class="typing-text">Una página donde encontrarás juegos gratis</h3>
                <p>
                    Somos una plataforma web confiable donde podrás descargar variedad de juegos que estuviste buscando
                    durante mucho tiempo. Encontrarás juegos que viste en otras páginas pero con precio, en cambio en
                    nuestra plataforma web esos juegos los encontrarás gratis y así podrás disfrutarlos.
                </p>
                <div class="social-icons">
                    <a href="https://pe.linkedin.com/" target="_blank" rel="noopener noreferrer"><i class="fa-brands fa-linkedin"></i></a>
                    <a href="https://github.com/" target="_blank" rel="noopener noreferrer"><i class="fa-brands fa-github"></i></a>
                    <a href="https://x.com/?lang=es" target="_blank" rel="noopener noreferrer"><i class="fa-brands fa-x-twitter"></i></a>
                    <a href="https://www.instagram.com/" target="_blank" rel="noopener noreferrer"><i class="fa-brands fa-instagram"></i></a>
                </div>
                <a href="#" class="btn" id="authButtonState">Registrarse / Iniciar Sesión</a>
            </div>
        </section>`;

    let inicioHTML = inicioHTMLOriginal;

    function showSuccessMessage(message, isError = false) {
        if (!successMessageDiv) return;
        successMessageDiv.textContent = message;
        successMessageDiv.style.backgroundColor = isError ? '#f44336' : '#4CAF50';
        successMessageDiv.style.display = 'block';
        setTimeout(() => {
            successMessageDiv.style.display = 'none';
        }, 3000);
    }

    function openAuthModal(event) {
        if (event) event.preventDefault();
        if (!currentUserLoggedIn && authModal) {
            authModal.style.display = 'flex';
            if (registrationFormContainer && loginFormContainer) {
                registrationFormContainer.style.display = 'block';
                loginFormContainer.style.display = 'none';
            }
        }
    }

    function rebindAuthButton() {
        authButton = document.getElementById("authButtonState");
        if (authButton) {
            const newAuthButton = authButton.cloneNode(true);
            authButton.parentNode.replaceChild(newAuthButton, authButton);
            authButton = newAuthButton;

            if (!currentUserLoggedIn) {
                authButton.addEventListener('click', openAuthModal);
            } else {
                authButton.addEventListener('click', (e) => {
                    e.preventDefault();
                    const pcLink = document.querySelector('nav a[data-page="pc.html"]');
                    if (pcLink) {
                        cargarPagina('pages/pc.html', pcLink);
                    } else {
                        console.error("No se pudo encontrar el enlace de navegación 'PC' para cargar la página.");
                    }
                });
            }
        }
    }

    function updateUIBasedOnLoginState() {
        if (currentUserLoggedIn) {
            if (authButton) authButton.textContent = `¡Hola, ${currentUsername}! Explorar Juegos`;
            inicioHTML = inicioHTMLOriginal.replace(
                '<a href="#" class="btn" id="authButtonState">Registrarse / Iniciar Sesión</a>',
                `<a href="#" class="btn" id="authButtonState">¡Hola, ${currentUsername}! Explorar Juegos</a>`
            );
        } else {
            if (authButton) authButton.textContent = 'Registrarse / Iniciar Sesión';
            inicioHTML = inicioHTMLOriginal;
        }
        if (logoutButton) {
            logoutButton.style.display = currentUserLoggedIn ? 'inline-block' : 'none';
        }
        rebindAuthButton();
    }

    if (closeModalButton) {
        closeModalButton.onclick = function () { if (authModal) authModal.style.display = "none"; }
    }
    window.onclick = function (event) {
        if (event.target == authModal) { if (authModal) authModal.style.display = "none"; }
    }

    if (showLoginLink && registrationFormContainer && loginFormContainer) {
        showLoginLink.addEventListener('click', (e) => {
            e.preventDefault();
            registrationFormContainer.style.display = 'none';
            loginFormContainer.style.display = 'flex';
            loginFormContainer.style.flexDirection = 'column';
        });
    }

    if (showRegistrationLink && registrationFormContainer && loginFormContainer) {
        showRegistrationLink.addEventListener('click', (e) => {
            e.preventDefault();
            loginFormContainer.style.display = 'none';
            registrationFormContainer.style.display = 'block';
        });
    }

    if (registrationForm) {
        registrationForm.addEventListener('submit', (e) => {
            e.preventDefault();
            // ... (validaciones del formulario de registro)
            if (document.getElementById('regPassword').value !== document.getElementById('regConfirmPassword').value) {
                showSuccessMessage('Las contraseñas no coinciden.', true); return;
            }
            if (!document.getElementById('regTerms').checked) {
                showSuccessMessage('Debes aceptar los términos y condiciones.', true); return;
            }
            if (document.getElementById('regPassword').value.length < 6) {
                showSuccessMessage('La contraseña debe tener al menos 6 caracteres.', true); return;
            }

            const formData = new FormData(registrationForm);
            fetch('php/register.php', { method: 'POST', body: formData })
                .then(response => response.json())
                .then(data => {
                    if (data.success) {
                        currentUserLoggedIn = true;
                        currentUsername = formData.get('regUsuario');
                        currentUserEmail = formData.get('regEmail'); // Guardar email
                        showSuccessMessage(data.message || '¡Su registro fue excelente!');
                        if (authModal) authModal.style.display = 'none';
                        updateUIBasedOnLoginState();
                        registrationForm.reset();
                    } else {
                        showSuccessMessage(data.message || 'Error en el registro.', true);
                    }
                })
                .catch(error => {
                    console.error('Error en registro:', error);
                    showSuccessMessage('Error de conexión al registrar.', true);
                });
        });
    }

    if (loginForm) {
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const formData = new FormData(loginForm);
            fetch('php/login.php', { method: 'POST', body: formData })
                .then(response => response.json())
                .then(data => {
                    if (data.success) {
                        currentUserLoggedIn = true;
                        currentUsername = data.username || formData.get('loginEmail').split('@')[0];
                        currentUserEmail = data.email || formData.get('loginEmail'); // Guardar email (usar el de la respuesta PHP si está disponible)
                        showSuccessMessage(data.message || '¡Inicio de sesión exitoso!');
                        if (authModal) authModal.style.display = 'none';
                        updateUIBasedOnLoginState();
                        loginForm.reset();
                    } else {
                        showSuccessMessage(data.message || 'Error en inicio de sesión.', true);
                    }
                })
                .catch(error => {
                    console.error('Error en login:', error);
                    showSuccessMessage('Error de conexión al iniciar sesión.', true);
                });
        });
    }

    function handleLogout(event) {
        if (event) event.preventDefault();
        fetch('php/logout.php', { method: 'POST' })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    currentUserLoggedIn = false;
                    currentUsername = '';
                    currentUserEmail = ''; // Limpiar email
                    showSuccessMessage('Sesión cerrada exitosamente.');
                    contenido.innerHTML = inicioHTMLOriginal;
                    updateUIBasedOnLoginState();
                    actualizarActive(document.getElementById('inicio'));
                } else {
                    showSuccessMessage(data.message || 'Error al cerrar sesión.', true);
                }
            })
            .catch(error => {
                console.error('Error al cerrar sesión:', error);
                showSuccessMessage('Error de conexión al cerrar sesión.', true);
            });
    }

    if (logoutButton) {
        logoutButton.addEventListener('click', handleLogout);
    }

    function checkPHPsession() {
        fetch('php/check_session.php')
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                return response.json();
            })
            .then(data => {
                currentUserLoggedIn = data.isLoggedIn;
                currentUsername = data.isLoggedIn ? data.username : '';
                currentUserEmail = data.isLoggedIn ? data.email : ''; // Obtener email de la sesión
                updateUIBasedOnLoginState();
            })
            .catch(error => {
                console.error('Error verificando sesión PHP:', error);
                currentUserLoggedIn = false;
                currentUsername = '';
                currentUserEmail = ''; // Limpiar en caso de error
                updateUIBasedOnLoginState();
            });
    }

    const cargarPagina = (pageUrl, linkActivo) => {
        fetch(pageUrl)
            .then(response => {
                if (!response.ok) { throw new Error(`Error ${response.status}: No se pudo cargar ${pageUrl}`); }
                return response.text();
            })
            .then(html => {
                contenido.innerHTML = html;
                actualizarActive(linkActivo);

                if (pageUrl.includes('pc.html') || pageUrl.includes('movil.html')) {
                    const carouselId = pageUrl.includes('pc.html') ? 'pcCarousel' : 'movilCarousel';
                    const el = document.getElementById(carouselId);
                    if (el && typeof bootstrap !== 'undefined' && bootstrap.Carousel) {
                        new bootstrap.Carousel(el);
                    }

                    
                    const downloadButtons = contenido.querySelectorAll('.btn-custom-download');
                    downloadButtons.forEach(button => {
                        if (button.tagName.toLowerCase() === 'button' && button.dataset.downloadUrl) {
                            button.addEventListener('click', function() {
                                const downloadUrl = this.dataset.downloadUrl;
                                if (downloadUrl) {
                                    window.open(downloadUrl, '_blank'); // Abrir en nueva pestaña
                                } else {
                                    console.warn('No se encontró data-download-url para este botón.');
                                }
                            });
                        }
                        
                    });
                    
                }
                if (pageUrl.includes('contacto.html')) {
                    const contactForm = document.getElementById('contactForm');
                    const emailInput = document.getElementById('email');
                    const contactFormResponseDiv = document.getElementById('contactFormResponse');

                    if (contactForm && emailInput) {
                        if (currentUserLoggedIn && currentUserEmail) {
                            emailInput.value = currentUserEmail;
                            emailInput.readOnly = true;
                        } else {
                            emailInput.value = '';
                            emailInput.readOnly = false;
                        }

                        contactForm.addEventListener('submit', function(e) {
                            e.preventDefault();
                            const formData = new FormData(contactForm);
                            const submitButton = contactForm.querySelector('button[type="submit"]');

                            if (submitButton) submitButton.disabled = true;
                            if (contactFormResponseDiv) {
                                contactFormResponseDiv.style.color = 'white';
                                contactFormResponseDiv.textContent = 'Enviando consulta...';
                            }

                            fetch('php/guardar_consulta.php', {
                                method: 'POST',
                                body: formData
                            })
                            .then(response => response.json())
                            .then(data => {
                                if (data.success) {
                                    showSuccessMessage(data.message);
                                    contactForm.reset();
                                    if (currentUserLoggedIn && currentUserEmail && emailInput.readOnly) {
                                        emailInput.value = currentUserEmail;
                                    }
                                    if (contactFormResponseDiv) contactFormResponseDiv.textContent = '';
                                } else {
                                    showSuccessMessage(data.message || 'Error al enviar la consulta.', true);
                                    if (contactFormResponseDiv) {
                                        contactFormResponseDiv.style.color = '#f44336';
                                        contactFormResponseDiv.textContent = data.message || 'Ocurrió un error.';
                                    }
                                }
                            })
                            .catch(error => {
                                console.error('Error al enviar formulario de contacto:', error);
                                showSuccessMessage('Error de conexión al enviar tu consulta.', true);
                                if (contactFormResponseDiv) {
                                    contactFormResponseDiv.style.color = '#f44336';
                                    contactFormResponseDiv.textContent = 'Error de conexión. Inténtalo de nuevo.';
                                }
                            })
                            .finally(() => {
                                if (submitButton) submitButton.disabled = false;
                                if (contactFormResponseDiv && contactFormResponseDiv.textContent === 'Enviando consulta...') {
                                    contactFormResponseDiv.textContent = '';
                                }
                            });
                        });
                    }
                }
            })
            .catch(err => {
                contenido.innerHTML = `<p>Error cargando la página: ${err.message}</p>`;
                console.error("Error en cargarPagina:", err);
            });
    };

    pageNavLinks.forEach(link => {
        if (link.id === "inicio") {
            link.addEventListener("click", (e) => {
                e.preventDefault();
                contenido.innerHTML = inicioHTML;
                actualizarActive(link);
                rebindAuthButton();
            });
        } else if (link.dataset.page) {
            link.addEventListener("click", (e) => {
                e.preventDefault();
                if (!currentUserLoggedIn) {
                    showSuccessMessage("Debes iniciar sesión o registrarte para acceder.", true);
                    if (authModal) openAuthModal();
                    return;
                }
                cargarPagina(`pages/${link.dataset.page}`, link);
            });
        }
    });

    function actualizarActive(linkActivo) {
        document.querySelectorAll("nav a").forEach(l => l.classList.remove("active"));
        if (linkActivo) {
            linkActivo.classList.add("active");
        }
    }

    const linkInicioPorDefecto = document.getElementById('inicio');
    if (linkInicioPorDefecto) {
        actualizarActive(linkInicioPorDefecto);
    }
    checkPHPsession();
});