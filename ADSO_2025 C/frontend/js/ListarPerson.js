document.addEventListener("DOMContentLoaded", () => {
    const tbody = document.querySelector(".tablaPerson tbody");

    fetch("https://localhost:7205/api/User")
      .then(res => res.json())
      .then(data => {
        tbody.innerHTML = ""; // Limpiamos las filas anteriores
        

        data.forEach((persona, index) => {
          const fila = `
            <tr>
              <td>${index + 1}</td>
              <td>${persona.firstName}</td>
              <td>${persona.lastName}</td>
              <td>${persona.phonenumber}</td>
              <td>${persona.active}</td>
              <td class="text-end">
                <button class="btn btn-sm btn-outline-primary me-1">Editar</button>
                <button class="btn btn-sm btn-outline-danger">Eliminar</button>
              </td>
            </tr>
            
          `;
          
          tbody.innerHTML += fila;
        });
        console.log(data);
      })
      .catch(error => {
        console.error("Error al obtener personas:", error);
        tbody.innerHTML = `<tr><td colspan="7" class="text-center text-danger">Error al cargar datos</td></tr>`;
      });
      
  });
  