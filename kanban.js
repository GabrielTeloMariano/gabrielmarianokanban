// Função para abrir o modal de criação de tarefa
document.getElementById("add-task-btn").addEventListener("click", function () {
    document.getElementById("task-form-modal").style.display = "block";
});

// Função para salvar as tarefas no localStorage
function saveTasks() {
    const tasks = [];
    document.querySelectorAll('.kanban-task').forEach(task => {
        const taskData = {
            title: task.querySelector("h4").innerText,
            description: task.querySelector("p").innerText,
            priority: task.querySelectorAll("p")[1].innerText.replace('Prioridade: ', ''),
            dueDate: task.querySelectorAll("p")[2].innerText.replace('Data de Vencimento: ', ''),
            responsible: task.querySelectorAll("p")[3].innerText.replace('Responsáveis: ', ''),
            status: task.dataset.status
        };
        tasks.push(taskData);
    });
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

// Função para carregar as tarefas do localStorage
function loadTasks() {
    const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    tasks.forEach(taskData => {
        const newTask = document.createElement("div");
        newTask.classList.add("kanban-task");
        newTask.setAttribute('draggable', 'true');
        newTask.dataset.status = taskData.status;

        newTask.innerHTML = `
            <h4>${taskData.title}</h4>
            <p>${taskData.description}</p>
            <p><strong>Prioridade:</strong> ${taskData.priority}</p>
            <p><strong>Data de Vencimento:</strong> ${taskData.dueDate}</p>
            <p><strong>Responsáveis:</strong> ${taskData.responsible}</p>
            <p><strong>Status:</strong> ${taskData.status}</p>
            <div class="button-container">
                <button class="edit-task-btn">Editar</button>
                <button class="delete-task-btn">Excluir</button>
            </div>
        `;

        const statusColumn = document.getElementById(taskData.status);
        if (statusColumn) {
            statusColumn.appendChild(newTask);
        }

        addTaskEvents(newTask, taskData);
    });
}

// Adiciona eventos a uma tarefa
function addTaskEvents(taskElement, taskData) {
    taskElement.addEventListener('dragstart', (e) => {
        e.target.classList.add('dragging');
    });

    taskElement.addEventListener('dragend', (e) => {
        e.target.classList.remove('dragging');
    });

    taskElement.querySelector(".edit-task-btn").addEventListener("click", function () {
        openEditModal(taskElement, taskData);
    });

    taskElement.querySelector(".delete-task-btn").addEventListener("click", function () {
        taskElement.remove();
        saveTasks();
    });
}

// Função para criar uma nova tarefa
document.getElementById("task-form").addEventListener("submit", function (event) {
    event.preventDefault();

    const title = document.getElementById("title").value;
    const description = document.getElementById("description").value;
    const priority = document.getElementById("priority").value;
    const dueDate = document.getElementById("due-date").value;
    const responsible = document.getElementById("responsible").value;
    const status = document.getElementById("status").value;

    const newTask = document.createElement("div");
    newTask.classList.add("kanban-task");
    newTask.setAttribute('draggable', 'true');
    newTask.dataset.status = status;

    const statusColumn = document.getElementById(status);
    if (statusColumn) {
        statusColumn.appendChild(newTask);
    }

    addTaskEvents(newTask, {
        title,
        description,
        priority,
        dueDate,
        responsible,
        status
    });

    saveTasks();
    closeModal();
});

// Função para editar uma tarefa
function openEditModal(taskElement, taskData) {
    document.getElementById("title").value = taskData.title;
    document.getElementById("description").value = taskData.description;
    document.getElementById("priority").value = taskData.priority;
    document.getElementById("due-date").value = taskData.dueDate;
    document.getElementById("responsible").value = taskData.responsible;
    document.getElementById("status").value = taskData.status;

    document.getElementById("task-form-modal").style.display = "block";

    const form = document.getElementById("task-form");
    form.onsubmit = function (event) {
        event.preventDefault();

        const updatedTitle = document.getElementById("title").value;
        const updatedDescription = document.getElementById("description").value;
        const updatedPriority = document.getElementById("priority").value;
        const updatedDueDate = document.getElementById("due-date").value;
        const updatedResponsible = document.getElementById("responsible").value;
        const updatedStatus = document.getElementById("status").value;

        taskElement.querySelector("h4").innerText = updatedTitle;
        taskElement.querySelector("p").innerText = updatedDescription;
        taskElement.querySelectorAll("p")[1].innerHTML = `<strong>Prioridade:</strong> ${updatedPriority}`;
        taskElement.querySelectorAll("p")[2].innerHTML = `<strong>Data de Vencimento:</strong> ${updatedDueDate}`;
        taskElement.querySelectorAll("p")[3].innerHTML = `<strong>Responsáveis:</strong> ${updatedResponsible}`;
        taskElement.dataset.status = updatedStatus;

        const currentStatusColumn = taskElement.parentElement;
        currentStatusColumn.removeChild(taskElement);

        const newStatusColumn = document.getElementById(updatedStatus);
        if (newStatusColumn) {
            newStatusColumn.appendChild(taskElement);
        }

        saveTasks();
        closeModal();
    };
}

// Fecha o modal
function closeModal() {
    document.getElementById("task-form-modal").style.display = "none";
}

// Funções de drag-and-drop para o Kanban
document.querySelectorAll('.kanban-tasks').forEach(taskContainer => {
    taskContainer.addEventListener('dragover', (e) => {
        e.preventDefault();
        taskContainer.classList.add('dragging-over');
    });

    taskContainer.addEventListener('dragleave', () => {
        taskContainer.classList.remove('dragging-over');
    });

    taskContainer.addEventListener('drop', (e) => {
        e.preventDefault();
        taskContainer.classList.remove('dragging-over');

        const draggedTask = document.querySelector('.dragging');
        if (draggedTask) {
            taskContainer.appendChild(draggedTask);
            saveTasks();
        }
    });
});

// Carregar tarefas ao carregar a página
window.addEventListener('load', loadTasks);
