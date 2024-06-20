import * as User from "./models/userModel.js"; 

document.addEventListener("DOMContentLoaded", function() {
    const openPopupBtn = document.getElementById('openPopup');
    const closePopupBtn = document.querySelectorAll('.close_login');
    const loginPopup = document.getElementById('loginPopup');
    const registarPopup = document.getElementById('popupRegisto'); 
    const userIcon = document.getElementById('userIcon');
    const userPopup = document.getElementById('userPopup'); 
    const greeting = document.getElementById('greeting'); 
    const logoutBtn = document.getElementById('logoutBtn'); 
    const escapeBtn = document.querySelector('.escape_btn'); 

    // Esconder o dash do user 
    userPopup.style.display = 'none'; 

    // Iniciar os users
    User.init(); 

    function showPopupAlert(message, icon = 'success') {
        return Swal.fire({
            text: message,
            icon: icon,
            confirmButtonText: 'OK', 
            customClass: {
                popup: 'my-custom-popup',
                title: 'my-custom-title',
                content: 'my-custom-content',
                confirmButton: 'my-custom-confirm-button',
                cancelButton: 'my-custom-cancel-button'
            }
        });
    }

    function checkLoginStatus() { 
        const loggedIn = User.isLogged();
        if (loggedIn) { 
            openPopupBtn.style.display = 'none'; 
            userIcon.style.display = 'block'; 
            const currentUser = User.getUserLogged();
            if (currentUser) {
                greeting.textContent = `Olá, ${currentUser.username}!`;
                console.log(`Olá, ${currentUser.username}!`);
            }
            escapeBtn.addEventListener('click', function(event) {
                window.location.href = "/codebuddy/html/escaperoom.html"; 
            });
        } else {
            openPopupBtn.style.display = 'block';
            userIcon.style.display = 'none';
            greeting.textContent = ''; // Limpar a saudação
            escapeBtn.addEventListener('click', function (event) {
                event.preventDefault();
                showPopupAlert('Por favor, faça login para ter acesso a escape room.', 'warning');
            });
        }
    } 

    checkLoginStatus();

    checkLoginStatus();

    // Abrir popup de login
    openPopupBtn.addEventListener('click', function() {
        loginPopup.style.display = 'block';
    });

    // Fechar popups ao clicar nos botões de fechar
    closePopupBtn.forEach(btn => {
        btn.addEventListener('click', function() {
            loginPopup.style.display = 'none';
            registarPopup.style.display = 'none';
        });
    });

    // Fechar popups ao clicar fora deles
    window.addEventListener('click', function(event) {
        if (event.target == loginPopup) {
            loginPopup.style.display = 'none';
        }
        if (event.target == registarPopup) {
            registarPopup.style.display = 'none';
        }
    });

    // Abrir popup de registo a partir do popup de login
    document.getElementById('openRegisto').addEventListener('click', function(event) {
        event.preventDefault();
        loginPopup.style.display = 'none';
        registarPopup.style.display = 'block';
    });

    // Login
    document.querySelector('#frmLogin .form').addEventListener('submit', async function(event) {
        event.preventDefault();
        const email = document.getElementById('txtEmailLogin').value;
        const password = document.getElementById('txtPasswordLogin').value;

        try {
            const isAdmin = User.login(email, password);
            if (isAdmin) {
                window.location.href = '/codebuddy/html/admin.html';
            } else {
                await showPopupAlert('Login feito com sucesso!!');
                checkLoginStatus(); 
                loginPopup.style.display = 'none';  
            }
        } catch (error) {
            await showPopupAlert(error.message, 'error');
        }
    });

    // Registo
    document.querySelector('#frmRegisto .form').addEventListener('submit',async function(event) {
        event.preventDefault();
        const username = document.getElementById('txtUsernameReg').value;
        const email = document.getElementById('txtEmailReg').value;
        const password = document.getElementById('txtPasswordReg').value;

        try {
            User.add(username, email, password);
            await showPopupAlert('Registo feito com sucesso! Já pode efetuar o login.');
            registarPopup.style.display = 'none';
            loginPopup.style.display = 'block';
        } catch (error) {
            await showPopupAlert(error.message, 'error');
        }
    }); 

    // Popup do user 
    userIcon.addEventListener('click', function(event) {  
        event.stopPropagation();
        if (User.isLogged()) {
            if (userPopup.style.display === 'block') {
                userPopup.style.display = 'none';
            } else {
                userPopup.style.display = 'block';
                const currentUser = User.getUserLogged();
                if (currentUser) {
                    greeting.textContent = `Olá, ${currentUser.username}!`;
                    console.log(`Olá, ${currentUser.username}!`); 
                }
            }
        }
    });   

    // Fechar popups ao clicar fora deles
    window.addEventListener('click', function(event) {
        if (!userPopup.contains(event.target) && event.target !== userIcon) { 
            userPopup.style.display = 'none';
        }
    });

    // Fazer o logout da conta 
    logoutBtn.addEventListener('click', function(){ 
        User.logout(); 
        checkLoginStatus(); 
        userPopup.style.display = 'none';
    }); 
});
