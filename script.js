document.addEventListener('DOMContentLoaded', () => {
  const inputWrapper = document.getElementById('input-wrapper');
  const taskInput = document.getElementById('task-input');
  const taskInputLabel = document.getElementById('task-input-label');
  const addTaskButton = document.getElementById('addTaskButton');
  const taskList = document.getElementById('task-list-container');
  const summaryElement = document.getElementById("summary-container");
  const emptyElement = document.getElementById("empty-container");
  
  // Elemento para mensagens de erro
  const errorMessage = document.createElement('div');
  errorMessage.style.color = '#e25858';
  errorMessage.style.fontSize = '1.4rem';
  errorMessage.style.marginTop = '0.8rem';
  errorMessage.style.position = 'absolute';
  errorMessage.style.bottom = '-2.1rem';
  errorMessage.style.left = '1.8rem';
  
  taskInputLabel.insertAdjacentElement('afterbegin', errorMessage);
  
  let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
  console.log(tasks)
  
  // Atualiza o resumo
  function updateSummary() {
    const total = tasks.length;
    const done = tasks.filter(task => task.isChecked).length;
    renderSummary(total, done);
  }
  
  // Renderiza o componente de resumo
  function renderSummary(total, done) {
    summaryElement.innerHTML = `
      <div class="summary-label">
        Tarefas criadas <span>${total}</span>
      </div>
      <div class="summary-label purple">
        Concluídas <span>${done} de ${total}</span>
      </div>
      <button class="button clear-completed" id="clearCompleted" >Limpar Concluídas</button >
    `;
  }
  
  // Empty Component
  function renderEmpty() {
    emptyElement.innerHTML = `
      <img src="clipboard.svg" alt="Clipboard Icon">
      <p>
        <span>Você ainda não tem tarefas cadastradas</span>
        Crie tarefas e organize seus itens a fazer
      </p>
    `;
    emptyElement.style.display = 'grid';
  }
  
  // Controla a exibição do estado vazio
  function toggleEmptyState() {
    if (tasks.length === 0) {
      taskList.style.display = 'none';
      renderEmpty()
    } else {
      emptyElement.style.display = 'none';
      taskList.style.display = 'block';
    }
  }
  
  // Renderiza a lista de tarefas
  function renderTaskList() {
    taskList.innerHTML = '';
    tasks.forEach(task => {
      const taskItem = document.createElement('div');
      taskItem.className = `task-item ${task.isChecked ? 'checked' : ''}`;
      
      taskItem.innerHTML = `
        <label >
        <input class="checkbox" type="checkbox" ${task.isChecked ? 'checked' : ''}>
        <span class="task-title">${task.title}</span>
        </label>
        <button class="button only-icon">
        <svg viewBox="0 0 28 28" height="48" width="48" focusable="false" role="img" fill="currentColor" xmlns="http://www.w3.org/2000/svg" class="StyledIconBase-sc-ea9ulj-0 hRnJPC"><title>DeleteDismiss icon</title><path d="M19.5 16a5.5 5.5 0 1 1 0 11 5.5 5.5 0 0 1 0-11zM14 2.25c2 0 3.64 1.57 3.74 3.55l.01.2h5.5a.75.75 0 0 1 .1 1.5H22.2l-.63 7.83a6.47 6.47 0 0 0-1.48-.3l.6-7.53H7.32l1.21 14.93a2.25 2.25 0 0 0 2.25 2.07h2.96c.29.55.65 1.06 1.08 1.5h-4.04a3.75 3.75 0 0 1-3.74-3.45L5.8 7.5H4.75a.75.75 0 0 1-.74-.65L4 6.75c0-.38.28-.7.65-.74l.1-.01h5.5A3.75 3.75 0 0 1 14 2.25zm3.02 16.77a.5.5 0 0 0 0 .71l1.77 1.77-1.76 1.77a.5.5 0 1 0 .7.7l1.77-1.76 1.77 1.77a.5.5 0 1 0 .7-.71l-1.76-1.77 1.77-1.77a.5.5 0 0 0-.7-.7l-1.78 1.76-1.77-1.77a.5.5 0 0 0-.7 0zM14 3.75c-1.2 0-2.17.93-2.24 2.1l-.01.15h4.5v-.15A2.25 2.25 0 0 0 14 3.75z"></path></svg>
        </button>
      `;
      
      // Marcar/desmarcar tarefa
      taskItem.querySelector('input').addEventListener('change', (e) => {
        task.isChecked = e.target.checked;
        localStorage.setItem('tasks', JSON.stringify(tasks));
        updateSummary();
        renderTaskList();
      });
      
      // Editar título
      const taskTitle = taskItem.querySelector('.task-title');
      taskTitle.addEventListener('click', () => {
        const newTitle = prompt('Edite a tarefa:', task.title);
        if (newTitle && !tasks.some(t => t.title === newTitle)) {
          task.title = newTitle.trim();
          localStorage.setItem('tasks', JSON.stringify(tasks));
          renderTaskList();
          updateSummary();
        } else if (newTitle) {
          alert('Essa tarefa já existe ou o título é inválido!');
        }
      });
      
      // Remover tarefa
      taskItem.querySelector('button').addEventListener('click', () => {
        taskItem.classList.add('removed');
        setTimeout(() => {
          tasks = tasks.filter(t => t.title !== task.title);
          localStorage.setItem('tasks', JSON.stringify(tasks));
          renderTaskList();
          updateSummary();
          toggleEmptyState();
        }, 300);
      });
      
      // Botão para remover tarefas concluídas
      const clearCompletedButton = document.getElementById('clearCompleted');
      
      if (clearCompletedButton) {
        clearCompletedButton.addEventListener('click', () => {
          const initialLength = tasks.length;
          
          // Filtra as tarefas não concluídas
          tasks = tasks.filter(task => !task.isChecked);
          
          // Atualiza o localStorage
          localStorage.setItem('tasks', JSON.stringify(tasks));
          
          // Renderiza novamente a lista e atualiza o resumo
          renderTaskList();
          updateSummary();
          toggleEmptyState();
          
          if (tasks.length < initialLength) {
            console.log('Tarefas concluídas removidas.');
          } else {
            console.log('Nenhuma tarefa concluída encontrada.');
          }
        });
      }
      
      taskList.appendChild(taskItem);
    });
  }
  
  // Adiciona nova tarefa
  addTaskButton.addEventListener('click', (e) => {
    e.preventDefault();
    
    const title = taskInput.value.trim();
    errorMessage.textContent = '';
    
    if (!title) {
      errorMessage.textContent = 'A tarefa não pode estar vazia!';
      return;
    }
    
    if (tasks.some(task => task.title === title)) {
      errorMessage.textContent = 'Essa tarefa já existe!';
      return;
    }
    if (title) {
      const timestamp = new Date().toISOString();
      tasks.push({title, isChecked: false, timestamp});
      tasks.sort((a, b) => a.isChecked - b.isChecked || new Date(b.timestamp) - new Date(a.timestamp));
      localStorage.setItem('tasks', JSON.stringify(tasks));
      renderTaskList();
      updateSummary();
      toggleEmptyState(); // Atualiza o estado vazio
      
      const newTaskElement = taskList.querySelector('.task-item:first-child');
      if (newTaskElement) {
        newTaskElement.classList.add('added');
        setTimeout(() => newTaskElement.classList.remove('added'), 300);
      }
      taskInput.value = '';
    }
  });
  
  taskInput.addEventListener('input', () => {
    errorMessage.textContent = '';
  });
  
  // Inicializa a aplicação
  toggleEmptyState(); // Define o estado inicial
  renderTaskList();
  updateSummary();
});