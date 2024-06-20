import * as User from "./models/userModel.js"; 
import { getPosts } from "./views/feed.js";

document.addEventListener("DOMContentLoaded", function() {
    const openSendNotif = document.getElementById('send_message');
    const messagePopup = document.getElementById('message_popup');
    const deleteAccountBtn = document.getElementById('delete_account');
    const blockUserBtn = document.getElementById('block_user');
    const unblockUserBtn = document.getElementById('unblock_user');
    const messageForm = document.getElementById('messageForm');
    const messageContent = document.getElementById('messageContent');

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

    function sendMessage() {
        const selectedUser = document.querySelector('input[name="selectedUser"]:checked');
        if (!selectedUser) {
            showPopupAlert('Por favor, selecione um utilizador para enviar a mensagem.', 'error');
            return;
        }

        const username = selectedUser.value;
        const message = messageContent.value;

        if (message.trim() === '') {
            showPopupAlert('Por favor, escreva uma mensagem.', 'error');
            return;
        }

        // Enviar mensagem
        User.sendMessage(username, message);
        showPopupAlert(`Mensagem enviada para ${username}: ${message}`, 'success');
        messageContent.value = '';
        messagePopup.style.display = 'none';
    }

    function deleteUser() {
        const selectedUser = document.querySelector('input[name="selectedUser"]:checked');
        if (!selectedUser) {
            showPopupAlert('Por favor, selecione um utilizador para apagar.', 'error');
            return;
        }

        const username = selectedUser.value;
        Swal.fire({
            title: `Tem certeza de que deseja apagar o utilizador ${username}?`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Sim, apagar',
            cancelButtonText: 'Cancelar',
            customClass: {
                popup: 'my-custom-popup',
                title: 'my-custom-title',
                content: 'my-custom-content',
                confirmButton: 'my-custom-confirm-button',
                cancelButton: 'my-custom-cancel-button'
            }
        }).then((result) => {
            if (result.isConfirmed) {
                User.deleteUser(username);
                loadUsersToTable();
                showPopupAlert('Utilizador apagado com sucesso!', 'success');
            }
        });
    }

    function blockUser() {
        const selectedUser = document.querySelector('input[name="selectedUser"]:checked');
        if (!selectedUser) {
            showPopupAlert('Por favor, selecione um utilizador para bloquear.', 'error');
            return;
        }

        const username = selectedUser.value;
        Swal.fire({
            title: `Tem certeza de que deseja bloquear o utilizador ${username}?`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Sim, bloquear',
            cancelButtonText: 'Cancelar',
            customClass: {
                popup: 'my-custom-popup',
                title: 'my-custom-title',
                content: 'my-custom-content',
                confirmButton: 'my-custom-confirm-button',
                cancelButton: 'my-custom-cancel-button'
            }
        }).then((result) => {
            if (result.isConfirmed) {
                User.blockUser(username);
                loadUsersToTable();
                showPopupAlert('Utilizador bloqueado com sucesso!', 'success');
            }
        });
    }

    function unblockUser() {
        const selectedUser = document.querySelector('input[name="selectedUser"]:checked');
        if (!selectedUser) {
            showPopupAlert('Por favor, selecione um utilizador para desbloquear.', 'error');
            return;
        }

        const username = selectedUser.value;
        Swal.fire({
            title: `Tem certeza de que deseja desbloquear o utilizador ${username}?`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Sim, desbloquear',
            cancelButtonText: 'Cancelar',
            customClass: {
                popup: 'my-custom-popup',
                title: 'my-custom-title',
                content: 'my-custom-content',
                confirmButton: 'my-custom-confirm-button',
                cancelButton: 'my-custom-cancel-button'
            }
        }).then((result) => {
            if (result.isConfirmed) {
                User.unblockUser(username);
                loadUsersToTable();
                showPopupAlert('Utilizador desbloqueado com sucesso!', 'success');
            }
        });
    }
 
//post tabela 
    function loadPostsToTable() {
        const posts = getPosts();
        const tableBody = document.getElementById('posts_table_body');

        tableBody.innerHTML = '';

        posts.forEach(post => {
            const row = document.createElement('tr');
            row.classList.add('data');

            const caminhoCell = document.createElement('td');
            caminhoCell.textContent = post.caminho;
            row.appendChild(caminhoCell);

            const linkCell = document.createElement('td');
            if (post.link) {
                const link = document.createElement('a');
                link.href = post.link;
                link.textContent = post.link;
                linkCell.appendChild(link);
            } else {
                linkCell.textContent = 'Sem link';
            }
            row.appendChild(linkCell);

            tableBody.appendChild(row);
        });
    }
//caregar tabela dos users
    function loadUsersToTable() {
        const users = User.getUsers();
        const tableBody = document.querySelector('.tabela tbody');

        // Limpar linhas dos users
        tableBody.innerHTML = '';

        // Adicionar users a tabela
        users.forEach(user => {
            const row = document.createElement('tr');
            row.classList.add('data');

            const usernameCell = document.createElement('td');
            const selectRadio = document.createElement('input');
            selectRadio.type = 'radio';
            selectRadio.name = 'selectedUser';
            selectRadio.value = user.username;
            usernameCell.appendChild(selectRadio);
            const usernameText = document.createTextNode(user.username);
            usernameCell.appendChild(usernameText);
            row.appendChild(usernameCell);

            const emailCell = document.createElement('td');
            emailCell.textContent = user.email || 'N/A';
            row.appendChild(emailCell);

            const statusCell = document.createElement('td');
            statusCell.textContent = user.isBlocked ? 'Bloqueado' : 'Ativo';
            row.appendChild(statusCell);

            const pointsCell = document.createElement('td');
            pointsCell.textContent = '0'; 
            row.appendChild(pointsCell);

            tableBody.appendChild(row);
        });
    }

    // Ensure the admin check is before any other user actions
    if (!User.isLogged() || !User.getUserLogged().isAdmin) {
        showPopupAlert('Acesso negado', 'error').then(() => {
            window.location.href = '/codebuddy/index.html';
        });
        return;
    }

    // Iniciar os users
    User.init();
    loadUsersToTable(); 
    loadPostsToTable();

    // Event listeners
    openSendNotif.addEventListener('click', function() {
        messagePopup.style.display = 'block';
    });

    window.addEventListener('click', function(event) {
        if (event.target == messagePopup) {
            messagePopup.style.display = 'none';
        }
    });

    messageForm.addEventListener('submit', function(event) {
        event.preventDefault();
        sendMessage();
    });

    deleteAccountBtn.addEventListener('click', deleteUser);
    blockUserBtn.addEventListener('click', blockUser);
    unblockUserBtn.addEventListener('click', unblockUser);
});
