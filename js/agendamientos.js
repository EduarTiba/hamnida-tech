const lista = document.getElementById('agendamientos-list');
const token = localStorage.getItem('token');

if (!token) {
  alert('Debes iniciar sesión para ver tus agendamientos.');
  window.location.href = 'login.html';
}

fetch('http://localhost:5000/api/agendamientos', {
  headers: {
    'Authorization': 'Bearer ' + token
  }
})
  .then(res => res.json())
  .then(data => {
    if (!Array.isArray(data)) {
      lista.innerHTML = '<li>No se pudieron cargar los agendamientos.</li>';
      return;
    }

    if (data.length === 0) {
      lista.innerHTML = '<li>No tienes agendamientos aún.</li>';
    } else {
      data.forEach((agendamiento) => {
        const div = document.createElement('div');
        div.classList.add('agendamiento-card'); // 🧩 Clase para aplicar estilo
      
        const fecha = new Date(agendamiento.fecha).toLocaleString('es-CO', {
          dateStyle: 'short',
          timeStyle: 'short'
        });
      
        let serviciosHTML = '';
        agendamiento.servicios.forEach(s => {
          serviciosHTML += `<li>${s.name} - $${s.price}</li>`;
        });
      
        div.innerHTML = `
          <h3><strong>Fecha:</strong> ${fecha}</h3>
          <ul>${serviciosHTML}</ul>
          <div class="agendamiento-buttons">
            <button onclick="editarFecha('${agendamiento._id}')">Editar Fecha</button>
            <button onclick="eliminarAgendamiento('${agendamiento._id}')">Eliminar</button>
          </div>
        `;
      
        lista.appendChild(div);
      });
    }
  })
  .catch(err => {
    console.error('Error al obtener agendamientos:', err);
    lista.innerHTML = '<li>Error al cargar.</li>';
  });


  function editarFecha(id) {
    const nuevaFecha = prompt('Ingresa nueva fecha (YYYY-MM-DD HH:mm):');
    if (!nuevaFecha) return;
  
    fetch(`http://localhost:5000/api/agendamientos/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token
      },
      body: JSON.stringify({ fecha: nuevaFecha })
    })
      .then(res => res.json())
      .then(data => {
        alert('Fecha actualizada');
        location.reload();
      })
      .catch(err => {
        alert('Error al editar la fecha.');
        console.error(err);
      });
  }
  
  function eliminarAgendamiento(id) {
    if (!confirm('¿Seguro que deseas eliminar este agendamiento?')) return;
  
    fetch(`http://localhost:5000/api/agendamientos/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': 'Bearer ' + token
      }
    })
      .then(res => res.json())
      .then(data => {
        alert(data.msg || 'Agendamiento eliminado');
        location.reload();
      })
      .catch(err => {
        alert('Error al eliminar el agendamiento.');
        console.error(err);
      });
  }
  