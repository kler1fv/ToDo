let tasks = [];
let taskId = 1;

let taskInput = document.getElementById('taskInput');
let addTask = document.getElementById('addTask');
let taskList = document.getElementById('taskList');
let deleteTask = document.getElementById('deleteС');
let prevPage = document.getElementById('pageStr');
let nextPage = document.getElementById('nextPage');
let currentFilter = 'all';
let tabAll = document.getElementById('tabAll');
let tabActive = document.getElementById('tabActive');
let tabCompleted = document.getElementById('tabCompleted');
let page = 0;
let pageSize = 5;


addTask.addEventListener('click', function () {
    let text = taskInput.value;
    if (text === '') return;

    tasks.unshift({
        id: taskId++,
        text: text,
        completed: false
    });

    taskInput.value = '';
    page = 0;
    renderTasks();
});


function renderTasks() {
    taskList.innerHTML = '';

    let start = page * pageSize;
    let end = start + pageSize;

    for (let i = start; i < end && i < tasks.length; i++) {
        let task = tasks[i];

        let li = document.createElement('li');

        // чекбокс
        let checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.checked = task.completed;
        checkbox.addEventListener('change', function () {
            task.completed = checkbox.checked;
        });

        // текст
        let span = document.createElement('span');
span.innerHTML = task.text;
span.style.marginLeft = '8px';
span.contentEditable = true;

// переменная для хранения старого текста
let oldText = task.text;

// при фокусе сохраняем текущее значение
span.addEventListener('focus', function () {
    oldText = task.text;
});

// при потере фокуса сохраняем новое значение
span.addEventListener('blur', function () {
    task.text = span.innerHTML;
});

// отмена редактирования по Esc
span.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') {
        span.innerHTML = oldText; // возвращаем старое значение
        span.blur();               // убираем фокус
    }
});
        // кнопка удаления
        let deleteButton = document.createElement('button');
        deleteButton.textContent = 'Удалить';
        // дизайн
        deleteButton.style.backgroundColor = '#333';
        deleteButton.style.color = 'white';
        deleteButton.style.border = 'none';
        deleteButton.style.borderRadius = '4px';
        deleteButton.style.padding = '3px 8px';
        deleteButton.style.marginLeft = '8px';
        deleteButton.style.cursor = 'pointer';

        deleteButton.addEventListener('click', function () {
            tasks = tasks.filter(t => t.id !== task.id);
            renderTasks();
        });

        li.appendChild(checkbox);
        li.appendChild(span);
        li.appendChild(deleteButton);

        taskList.appendChild(li);
    }
}

deleteTask.addEventListener('click', function () {
    tasks = tasks.filter(function(task){
        return task.completed === false;
    });
    taskList.innerHTML = '';
    renderTasks();
});

prevPage.addEventListener('click', function () {
    if (page > 0) {
        page--;
        renderTasks();
    }
});

nextPage.addEventListener('click', function () {
    if ((page + 1) * pageSize < tasks.length) {
        page++;
        renderTasks();
    }
});
