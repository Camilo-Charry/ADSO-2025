document.addEventListener("DOMContentLoaded", () => {
  const tbody = document.querySelector(".tablaPerson tbody");
  const addBtn = document.createElement("button");
  addBtn.className = "btn btn-primary mb-3";
  addBtn.innerHTML = '<i class="fas fa-plus"></i> Nuevo Registro';
  
  // Insertar el botón antes de la tabla
  const container = document.querySelector(".tablaPerson .container");
  container.insertBefore(addBtn, container.firstChild);
  
  // Modal para el formulario
  const modal = document.createElement("div");
  modal.className = "modal";
  modal.style.display = "none";
  modal.innerHTML = `
    <div class="modal-content">
      <div class="modal-header">
        <h2 id="person-form-title">Añadir Persona</h2>
        <span class="close-modal">&times;</span>
      </div>
      <div class="modal-body">
        <form id="person-form">
          <input type="hidden" id="person-id">
          <div class="form-group">
            <label for="firstName">Nombre</label>
            <input type="text" id="firstName" required>
          </div>
          <div class="form-group">
            <label for="lastName">Apellido</label>
            <input type="text" id="lastName" required>
          </div>
          <div class="form-group">
            <label for="phonenumber">Teléfono</label>
            <input type="text" id="phonenumber" required>
          </div>
          <div class="form-group">
            <label for="active">Activo</label>
            <select id="active">
              <option value="true">Sí</option>
              <option value="false">No</option>
            </select>
          </div>
          <div class="form-group">
            <label for="isdeleted">Eliminado</label>
            <select id="isdeleted">
              <option value="false">No</option>
              <option value="true">Sí</option>
            </select>
          </div>
        </form>
      </div>
      <div class="modal-footer">
        <button type="button" class="btn-secondary close-btn">Cancelar</button>
        <button type="button" class="btn-primary save-btn">Guardar</button>
      </div>
    </div>
  `;
  
  // Overlay para el modal
  const overlay = document.createElement("div");
  overlay.id = "person-overlay";
  overlay.style.display = "none";
  
  // Agregar modal y overlay al body
  document.body.appendChild(modal);
  document.body.appendChild(overlay);
  
  // Cargar los datos
  loadPersonData();
  
  // Event listeners
  addBtn.addEventListener("click", () => showPersonForm());
  
  modal.querySelector(".close-modal").addEventListener("click", hidePersonForm);
  modal.querySelector(".close-btn").addEventListener("click", hidePersonForm);
  overlay.addEventListener("click", hidePersonForm);
  
  modal.querySelector(".save-btn").addEventListener("click", savePersonData);
  
  // Función para cargar los datos
  function loadPersonData() {
    // Cambiado el endpoint de API para obtener personas en lugar de módulos
    fetch("https://localhost:7205/api/Person")
      .then(res => {
        if (!res.ok) {
          throw new Error("Error al obtener datos: " + res.status);
        }
        return res.json();
      })
      .then(data => {
        tbody.innerHTML = ""; // Limpiamos las filas anteriores
        
        if (data.length === 0) {
          tbody.innerHTML = `<tr><td colspan="7" class="text-center">No hay registros disponibles</td></tr>`;
          return;
        }
        
        data.forEach((persona, index) => {
          // Convertir valores booleanos a texto para mejor visualización
          const activeText = persona.active ? "Sí" : "No";
          const deletedText = persona.isdeleted ? "Sí" : "No";
          
          const fila = `
            <tr data-id="${persona.id}">
              <td>${index + 1}</td>
              <td>${persona.firstName || 'N/A'}</td>
              <td>${persona.lastName || 'N/A'}</td>
              <td>${persona.phonenumber || ''}</td>
              <td>${activeText}</td>
              <td>${deletedText}</td>
              <td class="text-end">
                <button class="btn btn-sm btn-outline-primary me-1 edit-btn">
                  <i class="fas fa-edit"></i> Editar
                </button>
                <button class="btn btn-sm btn-outline-danger delete-btn">
                  <i class="fas fa-trash"></i> Eliminar
                </button>
              </td>
            </tr>
          `;
          
          tbody.innerHTML += fila;
        });
        
        // Agregar event listeners a los botones de editar y eliminar
        document.querySelectorAll(".edit-btn").forEach(btn => {
          btn.addEventListener("click", editPerson);
        });
        
        document.querySelectorAll(".delete-btn").forEach(btn => {
          btn.addEventListener("click", deletePerson);
        });
        
        console.log("Datos cargados:", data);
      })
      .catch(error => {
        console.error("Error al obtener personas:", error);
        tbody.innerHTML = `<tr><td colspan="7" class="text-center text-danger">Error al cargar datos: ${error.message}</td></tr>`;
      });
  }
  
  // Función para mostrar el formulario (agregar/editar)
  function showPersonForm(personData = null) {
    const formTitle = document.getElementById("person-form-title");
    const personId = document.getElementById("person-id");
    const firstName = document.getElementById("firstName");
    const lastName = document.getElementById("lastName");
    const phonenumber = document.getElementById("phonenumber");
    const active = document.getElementById("active");
    const isdeleted = document.getElementById("isdeleted");
    
    // Limpiar el formulario
    document.getElementById("person-form").reset();
    
    if (personData) {
      // Modo edición
      formTitle.textContent = "Editar Persona";
      personId.value = personData.id;
      firstName.value = personData.firstName || '';
      lastName.value = personData.lastName || '';
      phonenumber.value = personData.phonenumber || '';
      active.value = personData.active.toString();
      isdeleted.value = (personData.isdeleted || false).toString();
      
      console.log("Datos cargados en el formulario:", personData);
    } else {
      // Modo agregar
      formTitle.textContent = "Añadir Persona";
      personId.value = "";
      // Valores predeterminados para nuevo registro
      active.value = "true";
      isdeleted.value = "false";
    }
    
    // Mostrar modal y overlay
    modal.style.display = "block";
    overlay.style.display = "block";
  }
  
  // Función para ocultar el formulario
  function hidePersonForm() {
    modal.style.display = "none";
    overlay.style.display = "none";
  }
  
  // Función para editar persona
  function editPerson(event) {
    // Asegurarnos de obtener el elemento TR sin importar si se hizo clic en el botón o el ícono
    const row = event.target.closest("tr");
    const personId = row.dataset.id;
    
    console.log("Editando persona con ID:", personId);
    
    // Corregido: Añadida la barra diagonal entre 'Person' y el ID
    fetch(`https://localhost:7205/api/Person/${personId}`)
      .then(res => {
        if (!res.ok) {
          throw new Error("Error al obtener datos de la persona: " + res.status);
        }
        return res.json();
      })
      .then(data => {
        console.log("Datos obtenidos para edición:", data);
        showPersonForm(data);
      })
      .catch(error => {
        console.error("Error al obtener detalles de la persona:", error);
        alert("Error al cargar datos de la persona. Por favor, intente nuevamente.");
      });
  }
  
  // Función para guardar/actualizar persona
  function savePersonData() {
    const personId = document.getElementById("person-id").value;
    const firstName = document.getElementById("firstName").value;
    const lastName = document.getElementById("lastName").value;
    const phonenumber = document.getElementById("phonenumber").value;
    const active = document.getElementById("active").value === "true";
    const isdeleted = document.getElementById("isdeleted").value === "true";
    
    // Validar datos básicos
    if (!firstName || !lastName) {
      alert("Por favor complete todos los campos obligatorios");
      return;
    }
    
    // Crear el objeto con los datos para enviar a la API
    const personData = {
      firstName,
      lastName,
      phonenumber,
      active,
      isdeleted
    };
    
    // Si es actualización, agregar el ID al objeto
    if (personId) {
      personData.id = personId;
    }
    
    // Determinar si es una actualización o creación
    // Cambiado para usar el endpoint de Person
    const url = personId 
      ? `https://localhost:7205/api/Person/${personId}` 
      : "https://localhost:7205/api/Person";
    
    const method = personId ? "PUT" : "POST";
    
    console.log(`${method} a ${url} con datos:`, personData);
    
    // Mostrar indicador de carga
    const saveBtn = modal.querySelector(".save-btn");
    const originalText = saveBtn.textContent;
    saveBtn.textContent = "Guardando...";
    saveBtn.disabled = true;
    
    fetch(url, {
      method: method,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(personData),
    })
      .then(res => {
        // Restaurar el botón
        saveBtn.textContent = originalText;
        saveBtn.disabled = false;
        
        if (!res.ok) {
          // Intentar obtener el mensaje de error del cuerpo de la respuesta
          return res.text().then(text => {
            throw new Error(`Error (${res.status}): ${text || 'Sin detalles del error'}`);
          });
        }
        
        // Intentar parsear la respuesta como JSON, pero si falla, continuar de todos modos
        return res.text().then(text => {
          try {
            return text ? JSON.parse(text) : {};
          } catch (e) {
            console.warn("La respuesta no es un JSON válido:", text);
            return {};
          }
        });
      })
      .then(data => {
        console.log(`Persona ${personId ? 'actualizada' : 'creada'} con éxito:`, data);
        
        // Mostrar mensaje de éxito
        alert(`Persona ${personId ? 'actualizada' : 'creada'} con éxito.`);
        
        hidePersonForm();
        loadPersonData(); // Recargar la tabla
      })
      .catch(error => {
        // Restaurar el botón en caso de error
        saveBtn.textContent = originalText;
        saveBtn.disabled = false;
        
        console.error(`Error al ${personId ? 'actualizar' : 'crear'} persona:`, error);
        alert(`Error al ${personId ? 'actualizar' : 'crear'} la persona: ${error.message}`);
      });
  }
  
  // Función para eliminar persona
  function deletePerson(event) {
    if (!confirm("¿Está seguro de que desea eliminar este registro?")) {
      return;
    }
    
    const row = event.target.closest("tr");
    const personId = row.dataset.id;
    
    // Cambiado para usar el endpoint de Person
    fetch(`https://localhost:7205/api/Person/${personId}`, {
      method: "DELETE",
    })
      .then(res => {
        if (!res.ok) {
          return res.text().then(text => {
            throw new Error(`Error al eliminar (${res.status}): ${text || 'Sin detalles'}`);
          });
        }
        return res.text();
      })
      .then(() => {
        console.log("Persona eliminada con éxito");
        alert("Registro eliminado con éxito.");
        loadPersonData(); // Recargar la tabla
      })
      .catch(error => {
        console.error("Error al eliminar persona:", error);
        alert(`Error al eliminar la persona: ${error.message}`);
      });
  }
});