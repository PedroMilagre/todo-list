const themeBtn = document.getElementById("theme-toggle");
const taskList = document.getElementById("task-list");

// Atualiza o ícone do tema
function updateThemeIcon() {
  themeBtn.textContent = document.body.classList.contains("dark") ? "🌙" : "🌞";
}

// Alternar entre modo escuro e claro
themeBtn.addEventListener("click", () => {
  document.body.classList.toggle("dark");
  const theme = document.body.classList.contains("dark") ? "dark" : "light";
  localStorage.setItem("theme", theme);
  updateThemeIcon();
});

// Adicionar nova tarefa
function addTask() {
  const taskInput = document.getElementById("new-task");
  const dateInput = document.getElementById("task-date");
  const timeInput = document.getElementById("task-time");

  const taskText = taskInput.value.trim();
  const taskDate = dateInput.value;
  const taskTime = timeInput.value;

  if (!taskText) {
    alert("Por favor, digite uma tarefa.");
    return;
  }

  if (!taskDate || !taskTime) {
    alert("Por favor, selecione uma data e hora.");
    return;
  }

  const selectedDateTime = new Date(`${taskDate}T${taskTime}`);
  const now = new Date();

  if (selectedDateTime < now) {
    alert("Você não pode selecionar uma data/hora no passado.");
    return;
  }

  const li = document.createElement("li");

  const taskName = document.createElement("span");
  taskName.textContent = taskText;
  taskName.classList.add("task-name");

  const taskSchedule = document.createElement("span");
  taskSchedule.textContent = `${taskDate} ${taskTime}`;
  taskSchedule.classList.add("task-schedule");

  // Marcar como concluída
  li.addEventListener("click", () => {
    li.classList.toggle("completed");
  });

  // Editar nome com duplo clique
  taskName.addEventListener("dblclick", () => {
    const input = document.createElement("input");
    input.type = "text";
    input.value = taskName.textContent;
    input.classList.add("edit-input");

    input.addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        if (input.value.trim()) {
          taskName.textContent = input.value.trim();
        }
        input.replaceWith(taskName);
      }
    });

    input.addEventListener("blur", () => {
      input.replaceWith(taskName);
    });

    taskName.replaceWith(input);
    input.focus();
  });

  // Botão para editar data/hora
  const editBtn = document.createElement("button");
  editBtn.textContent = "Editar horário";
  editBtn.classList.add("edit-btn");

  editBtn.addEventListener("click", () => {
    if (li.querySelector(".date-edit") || li.querySelector(".time-edit")) {
      return; // Evita múltiplos inputs
    }

    editBtn.disabled = true;

    const currentDate = taskSchedule.textContent.split(" ")[0];
    const currentTime = taskSchedule.textContent.split(" ")[1];

    const dateEdit = document.createElement("input");
    dateEdit.type = "date";
    dateEdit.value = currentDate;
    dateEdit.min = new Date().toISOString().split("T")[0];
    dateEdit.classList.add("date-edit");

    const timeEdit = document.createElement("input");
    timeEdit.type = "time";
    timeEdit.value = currentTime;
    timeEdit.classList.add("time-edit");

    const saveBtn = document.createElement("button");
    saveBtn.textContent = "Salvar";
    saveBtn.classList.add("save-btn");

    saveBtn.addEventListener("click", () => {
      const newDate = dateEdit.value;
      const newTime = timeEdit.value;

      if (!newDate || !newTime) {
        alert("Preencha a nova data e hora.");
        return;
      }

      const newDateTime = new Date(`${newDate}T${newTime}`);
      if (newDateTime < new Date()) {
        alert("Você não pode escolher um horário no passado.");
        return;
      }

      taskSchedule.textContent = `${newDate} ${newTime}`;

      dateEdit.remove();
      timeEdit.remove();
      saveBtn.remove();
      editBtn.disabled = false;
    });

    li.appendChild(dateEdit);
    li.appendChild(timeEdit);
    li.appendChild(saveBtn);
  });

  // Botão de exclusão
  const deleteBtn = document.createElement("button");
  deleteBtn.textContent = "Excluir";
  deleteBtn.classList.add("delete-btn");

  deleteBtn.addEventListener("click", () => {
    taskList.removeChild(li);
  });

  li.appendChild(taskName);
  li.appendChild(document.createTextNode(" — "));
  li.appendChild(taskSchedule);
  li.appendChild(editBtn);
  li.appendChild(deleteBtn);

  taskList.appendChild(li);

  taskInput.value = "";
  dateInput.value = "";
  timeInput.value = "";
}

// Ao carregar a página
window.addEventListener("DOMContentLoaded", () => {
  const savedTheme = localStorage.getItem("theme");
  if (savedTheme === "dark") {
    document.body.classList.add("dark");
  }
  updateThemeIcon();

  // Definir a data mínima como hoje
  const today = new Date().toISOString().split("T")[0];
  document.getElementById("task-date").setAttribute("min", today);
});
