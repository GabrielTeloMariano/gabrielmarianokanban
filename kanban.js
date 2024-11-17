document.getElementById("add-task-btn").addEventListener("click", function () {
    document.getElementById("task-form-modal").style.display = "block";
});


document.querySelectorAll('.kanban-task').forEach(task => {
    task.addEventListener('dragstart', (e) => {
        e.target.classList.add('dragging');
    });

    task.addEventListener('dragend', (e) => {
        e.target.classList.remove('dragging');
    });
});

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

        // Obtém a tarefa arrastada
        const draggedTask = document.querySelector('.dragging');
        if (draggedTask) {
            taskContainer.appendChild(draggedTask);
        }
    });
});


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
    newTask.innerHTML = `
        <h4>${title}</h4>
        <p>${description}</p>
        <p><strong>Prioridade:</strong> ${priority}</p>
        <p><strong>Data de Vencimento:</strong> ${dueDate}</p>
        <p><strong>Responsáveis:</strong> ${responsible}</p>
        <p><strong>Status:</strong> ${status}</p>
        <div class="button-container">
            <button class="edit-task-btn">Editar</button>
            <button class="delete-task-btn">Excluir</button>
        </div>
    `;

    newTask.addEventListener('dragstart', (e) => {
        e.target.classList.add('dragging');
    });

    newTask.addEventListener('dragend', (e) => {
        e.target.classList.remove('dragging');
    });


    const statusColumn = document.getElementById(status);
    if (statusColumn) {
        statusColumn.appendChild(newTask);
    } else {
        console.error(`Coluna com ID "${status}" não encontrada!`);
    }

    newTask.querySelector(".edit-task-btn").addEventListener("click", function () {
        openEditModal(newTask, {
            title,
            description,
            priority,
            dueDate,
            responsible,
            status,
        });
    });

    newTask.querySelector(".delete-task-btn").addEventListener("click", function () {

        newTask.remove();
    });

    closeModal();
});

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
        taskElement.querySelectorAll("p")[0].innerText = updatedDescription;
        taskElement.querySelectorAll("p")[1].innerHTML = `<strong>Prioridade:</strong> ${updatedPriority}`;
        taskElement.querySelectorAll("p")[2].innerHTML = `<strong>Data de Vencimento:</strong> ${updatedDueDate}`;
        taskElement.querySelectorAll("p")[3].innerHTML = `<strong>Responsáveis:</strong> ${updatedResponsible}`;


        taskData.status = updatedStatus;
        taskElement.dataset.status = updatedStatus;


        const currentStatusColumn = taskElement.parentElement;
        currentStatusColumn.removeChild(taskElement);

        taskElement.querySelector(".edit-task-btn").addEventListener("click", function () {
            openEditModal(taskElement, taskData);
        });

        taskElement.querySelector(".delete-task-btn").addEventListener("click", function () {
            taskElement.remove();
        });

        const newStatusColumn = document.getElementById(updatedStatus);
        if (newStatusColumn) {
            newStatusColumn.appendChild(taskElement);
        } else {
            console.error(`Coluna com ID "${updatedStatus}" não encontrada!`);
        }

        closeModal();
    };
}

function closeModal() {
    document.getElementById("task-form-modal").style.display = "none";
}