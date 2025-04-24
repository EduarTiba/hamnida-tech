const apiBase = 'https://hamnida-tech.onrender.com/api/users';

document.addEventListener('DOMContentLoaded', () => {
  const loginForm = document.getElementById('login-form');
  const registerForm = document.getElementById('register-form');

  const soloLetras = /^[a-zA-ZÀ-ÿ\s]{3,}$/;
  const correoValido = /^[^\s@]+@[^\s@]+\.[a-z]{2,4}$/i;

  if (loginForm) {
    loginForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const email = document.getElementById('email');
      const password = document.getElementById('password');
      const loginMsg = document.getElementById('login-message');
      const emailError = document.getElementById('email-error');
      const passwordError = document.getElementById('password-error');

      let valid = true;

      if (!correoValido.test(email.value.trim())) {
        email.classList.add('input-error');
        emailError.textContent = 'Correo electrónico inválido.';
        valid = false;
      } else {
        email.classList.remove('input-error');
        emailError.textContent = '';
      }

      if (password.value.trim() === '') {
        password.classList.add('input-error');
        passwordError.textContent = 'Ingresa tu contraseña.';
        valid = false;
      } else {
        password.classList.remove('input-error');
        passwordError.textContent = '';
      }

      if (!valid) return;

      try {
        const res = await fetch(`${apiBase}/login`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: email.value, password: password.value })
        });

        let data = {};
        const contentType = res.headers.get('content-type');
        if (contentType && contentType.includes('application/json')) {
          data = await res.json();
        }

        if (res.ok && data.token) {
          localStorage.setItem('token', data.token);
          localStorage.setItem('username', data.user.name);
          window.location.href = 'index.html';
        } else {
          loginMsg.textContent = data.msg || 'Error al iniciar sesión';
        }
      } catch (error) {
        loginMsg.textContent = 'Error de conexión al servidor.';
        console.error(error);
      }
    });
  }

  if (registerForm) {
    registerForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const name = document.getElementById('name');
      const email = document.getElementById('email');
      const password = document.getElementById('password');
      const nameError = document.getElementById('name-error');
      const emailError = document.getElementById('email-error');
      const passwordError = document.getElementById('password-error');
      const registerMsg = document.getElementById('register-message');

      let valid = true;

      if (!soloLetras.test(name.value.trim())) {
        name.classList.add('input-error');
        nameError.textContent = 'El nombre solo puede contener letras y espacios.';
        valid = false;
      } else {
        name.classList.remove('input-error');
        nameError.textContent = '';
      }

      if (!correoValido.test(email.value.trim())) {
        email.classList.add('input-error');
        emailError.textContent = 'Ingresa un correo electrónico válido.';
        valid = false;
      } else {
        email.classList.remove('input-error');
        emailError.textContent = '';
      }

      if (password.value.length < 6) {
        password.classList.add('input-error');
        passwordError.textContent = 'La contraseña debe tener al menos 6 caracteres.';
        valid = false;
      } else {
        password.classList.remove('input-error');
        passwordError.textContent = '';
      }

      if (!valid) return;

      try {
        const res = await fetch(`${apiBase}/register`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: name.value,
            email: email.value,
            password: password.value
          })
        });

        let data = {};
        const contentType = res.headers.get('content-type');
        if (contentType && contentType.includes('application/json')) {
          data = await res.json();
        }

        if (res.ok && data.msg === 'Usuario registrado correctamente') {
          alert('Registro exitoso. Ahora puedes iniciar sesión.');
          window.location.href = 'login.html';
        } else {
          registerMsg.textContent = data.msg || 'Error al registrarte';
        }
      } catch (error) {
        registerMsg.textContent = 'Error de conexión al servidor.';
        console.error(error);
      }
    });
  }
});

