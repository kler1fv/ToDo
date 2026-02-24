let tasks = [];
let taskId = 1;

let taskInput = document.getElementById('taskInput');
let addTaskButton = document.getElementById('addTask');
let taskList = document.getElementById('taskList');
let deleteCompletedButton = document.getElementById('deleteCompleted');
let toggleAllCheckbox = document.getElementById('toggleAll');

let tabAll = document.getElementById('tabAll');
let tabActive = document.getElementById('tabActive');
let tabCompleted = document.getElementById('tabCompleted');

let countAll = document.getElementById('countAll');
let countActive = document.getElementById('countActive');
let countCompleted = document.getElementById('countCompleted');

let previousPageButton = document.getElementById('previousPage');
let nextPageButton = document.getElementById('nextPage');

let currentFilter = 'all';
let currentPage = 0;
let pageSize = 5;



// ДОБАВЛЕНИЕ ЗАДАЧИ
function addTask() {
    let text = taskInput.value;

    if (text === '') {
        return;
    }

    let task = {
        id: taskId++,
        text: text,
        completed: false
    };

    tasks.unshift(task);

    taskInput.value = '';
    currentPage = 0;

    renderTasks();

    taskInput.focus();
}

addTaskButton.addEventListener('click', addTask);

taskInput.addEventListener('keydown', function(event) {
    if (event.key === 'Enter') {
        addTask();
    }

    if (event.key === 'Escape') {
        taskInput.value = '';
    }
});



// РЕНДЕР
function renderTasks() {

    taskList.innerHTML = '';

    let filteredTasks = tasks.filter(function(task) {
        if (currentFilter === 'active') {
            return task.completed === false;
        }
        if (currentFilter === 'completed') {
            return task.completed === true;
        }
        return true;
    });

    countAll.innerHTML = tasks.length;
    countActive.innerHTML = tasks.filter(t => t.completed === false).length;
    countCompleted.innerHTML = tasks.filter(t => t.completed === true).length;

    let totalPages = Math.ceil(filteredTasks.length / pageSize);
    if (currentPage >= totalPages && totalPages > 0) {
        currentPage = totalPages - 1;
    }

    let start = currentPage * pageSize;
    let end = start + pageSize;

    for (let i = start; i < end && i < filteredTasks.length; i++) {

        let task = filteredTasks[i];

        let li = document.createElement('li');
        li.className = 'task-item';
        if (task.completed === true) {
            li.className += ' completed';
        }

        li.innerHTML = `
            <input type="checkbox" ${task.completed ? 'checked' : ''}>
            <span class="task-text">${task.text}</span>
            <button class="delete-button">Удалить</button>
        `;

        let checkbox = li.querySelector('input');
        let span = li.querySelector('span');
        let deleteButton = li.querySelector('button');

        checkbox.addEventListener('change', function() {
            task.completed = checkbox.checked;
            renderTasks();
        });

        let oldText = task.text;

        span.addEventListener('click', function() {
            span.contentEditable = true;
            span.focus();
        });

        span.addEventListener('focus', function() {
            oldText = task.text;
        });

        span.addEventListener('blur', function() {
            task.text = span.innerHTML;
            span.contentEditable = false;
        });

        span.addEventListener('keydown', function(event) {
            if (event.key === 'Escape') {
                span.innerHTML = oldText;
                span.contentEditable = false;
                span.blur();
            }
        });

        deleteButton.addEventListener('click', function() {
            tasks = tasks.filter(function(t) {
                return t.id !== task.id;
            });
            renderTasks();
        });

        taskList.appendChild(li);
    }
}



// УДАЛЕНИЕ ВЫПОЛНЕННЫХ
deleteCompletedButton.addEventListener('click', function() {
    tasks = tasks.filter(function(task) {
        return task.completed === false;
    });
    currentPage = 0;
    renderTasks();
});



// ВЫБРАТЬ ВСЕ
toggleAllCheckbox.addEventListener('change', function() {
    tasks.forEach(function(task) {
        task.completed = toggleAllCheckbox.checked;
    });
    renderTasks();
});



// ВКЛАДКИ
tabAll.addEventListener('click', function() {
    currentFilter = 'all';
    currentPage = 0;
    setActiveTab(tabAll);
    renderTasks();
});

tabActive.addEventListener('click', function() {
    currentFilter = 'active';
    currentPage = 0;
    setActiveTab(tabActive);
    renderTasks();
});

tabCompleted.addEventListener('click', function() {
    currentFilter = 'completed';
    currentPage = 0;
    setActiveTab(tabCompleted);
    renderTasks();
});

function setActiveTab(activeTab) {
    tabAll.classList.remove('active');
    tabActive.classList.remove('active');
    tabCompleted.classList.remove('active');
    activeTab.classList.add('active');
}



// ПАГИНАЦИЯ
previousPageButton.addEventListener('click', function() {
    if (currentPage > 0) {
        currentPage--;
        renderTasks();
    }
});

nextPageButton.addEventListener('click', function() {
    let filteredTasks = tasks.filter(function(task) {
        if (currentFilter === 'active') return task.completed === false;
        if (currentFilter === 'completed') return task.completed === true;
        return true;
    });

    if ((currentPage + 1) * pageSize < filteredTasks.length) {
        currentPage++;
        renderTasks();
    }
});


renderTasks();
taskInput.focus();
