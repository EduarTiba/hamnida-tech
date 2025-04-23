const apiUrl = 'http://localhost:5000/api/services';
const serviceList = document.getElementById('service-list');
const cartItems = document.getElementById('cart-items');
const userStatus = document.getElementById('user-status');
const userActions = document.getElementById('user-actions');
const username = localStorage.getItem('username') || 'usuario';

let cart = [];

function renderUserStatus() {
  const token = localStorage.getItem('token');
  if (token) {
    userStatus.innerHTML = `
        <div class="user-bar">
         <span>Bienvenido/a, <strong>${username}</strong></span>
         <button onclick="logout()">Cerrar sesión</button>
        </div>
    `;
  } else {
    userStatus.innerHTML = `
      <a href="login.html">Iniciar sesión</a> | <a href="register.html">Registrarse</a>
    `;
  }
}

function renderUserActions() {
  const token = localStorage.getItem('token');
  const actions = document.getElementById('user-actions');

  if (!token) {
    actions.innerHTML = '';
    return;
  }

  // Detectar si estamos en la página principal
  const isMainPage = window.location.pathname.includes('index.html');

  actions.innerHTML = `
    <button onclick="location.href='agendamientos.html'">Mis agendamientos</button>
  `;
}

function logout() {
  localStorage.removeItem('token');
  alert('Has cerrado sesión.');
  window.location.reload();
}

function fetchServices() {
  fetch(apiUrl)
    .then(res => res.json())
    .then(data => {
      serviceList.innerHTML = '';
      data.forEach(service => {
        const div = document.createElement('div');
        div.classList.add('service');
        div.innerHTML = `
          <h3>${service.name}</h3>
          <p>${service.description}</p>
          <p><strong>$${service.price}</strong></p>
          <button onclick="addToCart(${JSON.stringify(service).replace(/"/g, '&quot;')})">Agregar</button>
        `;
        serviceList.appendChild(div);
      });
    });
}

function addToCart(service) {
  cart.push(service);
  renderCart();
}

function removeFromCart(index) {
  cart.splice(index, 1);
  renderCart();
}

function renderCart() {
  cartItems.innerHTML = '';
  cart.forEach((item, index) => {
    const li = document.createElement('li');
    li.innerHTML = `
      ${item.name} - $${item.price}
      <button onclick="removeFromCart(${index})">Eliminar</button>
    `;
    cartItems.appendChild(li);
  });
}

function submitOrder() {
  const token = localStorage.getItem('token');

  if (!token) {
    alert('Debes iniciar sesión para agendar tus servicios.');
    return;
  }

  if (cart.length === 0) {
    alert('No hay servicios en el carrito.');
    return;
  }

  fetch('http://localhost:5000/api/agendamientos', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + token
    },
    body: JSON.stringify({ servicios: cart })
  })
  .then(res => res.json())
  .then(data => {
    if (data.msg) {
      alert(data.msg);
      cart = [];
      renderCart();
    } else {
      alert('Error al agendar servicios.');
    }
  })
  .catch(err => {
    alert('Hubo un error al enviar la solicitud.');
    console.error(err);
  });
}

renderUserStatus();
renderUserActions();
fetchServices();