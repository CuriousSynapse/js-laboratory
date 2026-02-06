const button = document.getElementById('add-btn');
const input = document.getElementById('task-input');
const list = document.getElementById('task-list');

list.addEventListener('click', (e) => {

    console.log('list click', e.target, e.target.nodeType, e.target.tagName);

    const li = e.target.closest('li');
    if (!li) return;
    
    const action = e.target.dataset.action;

    if (action === 'delete') {
        li.remove();
        saveTasks();
        return;
    } 
    
    if (action === 'edit') {
        const span = li.querySelector('span');
        const editInput = document.createElement('input');
        editInput.value = span.textContent;
        li.replaceChild(editInput, span);
        editInput.focus();
        
        function finishEdit() {
            const newText = editInput.value.trim();
            if (newText) {
                const newSpan = document.createElement('span');
                newSpan.textContent = newText;
                li.replaceChild(newSpan, editInput);
                saveTasks();
            } else {
                li.replaceChild(span, editInput);
            }
        }

        editInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                finishEdit();
            } else if (e.key === 'Escape') {
                li.replaceChild(span, editInput);
                editInput.removeEventListener('blur', finishEdit);
                return;
            }
        });

        editInput.addEventListener('blur', finishEdit);
        return;
    }

    console.log('toggling', li);

    li.classList.toggle('done');
    saveTasks();
});

function addTask(text, done = false, shouldSave = true) {
    const li = document.createElement('li');

    const span = document.createElement('span');
    span.textContent = text;
    li.appendChild(span);

    const delBtn = document.createElement('button');
    delBtn.textContent = 'Delete';
    delBtn.dataset.action = 'delete';
    li.appendChild(delBtn);

    const editBtn = document.createElement('button');
    editBtn.textContent = 'Edit';
    editBtn.dataset.action = 'edit';
    li.appendChild(editBtn);

    if (done) {
        li.classList.add('done');
    }

    list.appendChild(li);

    if (shouldSave) {
        input.value = '';
        saveTasks();
    }
}

button.addEventListener('click', () => {
    const text = input.value.trim();
    if (!text) return;
    addTask(text);
});

input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
        const text = input.value.trim();
        if (!text) return;
        addTask(text);
    }
})

function saveTasks() {
    const tasks = [];
    list.querySelectorAll('li').forEach(li => {
        const text = li.querySelector('span').textContent;
        const done = li.classList.contains('done');
        tasks.push({ text, done });
    });
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

function loadTasks() {
    const data = localStorage.getItem('tasks');
    if (!data) return;
    const tasks = JSON.parse(data);

    tasks.forEach(task => {
        addTask(task.text, task.done, false);
    });
    
}

loadTasks();
