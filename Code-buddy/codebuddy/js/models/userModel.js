
let users = [];

//popup alert  
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

// CARREGAR UTILIZADORES DA LOCALSTORAGE
export function init() {
  if (localStorage.users) {
    const tempUsers = JSON.parse(localStorage.users);
    for (let user of tempUsers) {
      users.push(new User(user.username, user.password, user.isAdmin, user.isBlocked, user.messages));
    }
  } else {
    users = [];
    add('admin', '123', true);
  }
}

// ADICIONAR UTILIZADOR
export function add(username, password, isAdmin = false) {
  if (users.some((user) => user.username === username)) {
    throw Error(`Este utilizador "${username}", já existe!`);
  } else {
    users.push(new User(username, password, isAdmin));
    localStorage.setItem("users", JSON.stringify(users));
  }

  console.log(users);
} 

// APAGAR UTILIZADOR
export function deleteUser(username) {
  users = users.filter(user => user.username !== username);
  localStorage.setItem("users", JSON.stringify(users));
}

// LOGIN DO UTILIZADOR
export function login(username, password) {
  const user = users.find(
    (user) => user.username === username && user.password === password
  );
  if (user) {
    sessionStorage.setItem("loggedUser", JSON.stringify(user)); 
    console.log(user); 
    displayMessages(username);
    return user.isAdmin; 
  } else {
    throw Error("Login invalido!");
  }
}

// LOGOUT DO UTILIZADOR
export function logout() {
  sessionStorage.removeItem("loggedUser");
} 

// MENSAGEM  
export function displayMessages(username) {
  const user = users.find(user => user.username === username);
  if (user && user.messages && user.messages.length > 0) {
    user.messages.forEach(message => {
      showPopupAlert(`Nova mensagem: ${message}`); 
      console.log(`Nova mensagem: ${message}`);
    });
    user.messages = [];
    localStorage.setItem("users", JSON.stringify(users));
  }
}

// VERIFICA EXISTÊNCIA DE ALGUÉM 
export function isLogged() {
  return sessionStorage.getItem("loggedUser") ? true : false;
}

export function getUserLogged() {
  return JSON.parse(sessionStorage.getItem("loggedUser"));
}

export function findUser(userId) {
  return users.find((user) => user.id == userId);
}

export function getUsers() {
  return users;
}

export function sendMessage(username, message) {
  const user = users.find(user => user.username === username);
  if (user) {
    if (!user.messages) {
      user.messages = [];
    }
    user.messages.push(message);
    localStorage.setItem("users", JSON.stringify(users));
    console.log(`Mensagem para ${username}: ${message}`);
    showPopupAlert(`Mensagem para ${username}: ${message}`, 'success');
  } else {
    console.error('Utilizador não encontrado');
    showPopupAlert('Utilizador não encontrado', 'error');
  }
}

export function blockUser(username) {
  const user = users.find(user => user.username === username);
  if (user) {
    user.isBlocked = true;
    localStorage.setItem("users", JSON.stringify(users));
    showPopupAlert(`Utilizador "${username}" foi bloqueado!`, 'success');
  } else {
    console.error('Utilizador não encontrado');
    showPopupAlert('Utilizador não encontrado', 'error');
  }
}

export function unblockUser(username) {
  const user = users.find(user => user.username === username);
  if (user) {
    user.isBlocked = false;
    localStorage.setItem("users", JSON.stringify(users));
    showPopupAlert(`Utilizador "${username}" foi desbloqueado!`, 'success');
  } else {
    console.error('Utilizador não encontrado');
    showPopupAlert('Utilizador não encontrado', 'error');
  }
}

function getNextId() {
  return users.length > 0 ? users.length + 1 : 1;
}

class User {
  id = null;
  username = "";
  password = "";
  isAdmin = false;
  isBlocked = false;
  messages = [];

  constructor(username, password, isAdmin = false, isBlocked = false, messages = []) {
    this.id = getNextId();
    this.username = username;
    this.password = password;
    this.isAdmin = isAdmin;
    this.isBlocked = isBlocked;
    this.messages = messages;
  }
}
