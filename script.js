document.addEventListener("DOMContentLoaded", function() {
    // Função de abrir modal de edição
    function openEditModal(taskElement) {
        document.getElementById("edit-task-modal").style.display = "block";
        
        // Preenche o formulário com os dados da tarefa
        document.getElementById("edit-title").value = taskElement.querySelector("h4").textContent;
        document.getElementById("edit-description").value = taskElement.querySelector("p").textContent;
        document.getElementById("edit-priority").value = taskElement.dataset.priority;
        document.getElementById("edit-due-date").value = taskElement.dataset.dueDate;
        document.getElementById("edit-responsible").value = taskElement.dataset.responsible;
        document.getElementById("edit-status").value = taskElement.dataset.status;
        
        // Função para salvar as alterações
        document.getElementById("edit-task-form").onsubmit = function(event) {
            event.preventDefault();
            taskElement.querySelector("h4").textContent = document.getElementById("edit-title").value;
            taskElement.querySelector("p").textContent = document.getElementById("edit-description").value;
            taskElement.dataset.priority = document.getElementById("edit-priority").value;
            taskElement.dataset.dueDate = document.getElementById("edit-due-date").value;
            taskElement.dataset.responsible = document.getElementById("edit-responsible").value;
            taskElement.dataset.status = document.getElementById("edit-status").value;
            closeModal();
        };
    }

    // Fechar o modal
    function closeModal() {
        document.getElementById("edit-task-modal").style.display = "none";
    }

    // Registra o evento de clique no lápis
    document.querySelectorAll('.kanban-task h4::after').forEach(function(icon) {
        icon.addEventListener('click', function(event) {
            const taskElement = event.target.closest('.kanban-task');
            openEditModal(taskElement);
        });
    });

    // Fecha o modal quando clicar no "X"
    document.querySelector(".close").addEventListener("click", closeModal);
});
