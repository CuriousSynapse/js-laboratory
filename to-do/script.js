const button = document.getElementById('add-btn');
const input = document.getElementById('task-input');
const list = document.getElementById('task-list');
const dependsSelect = document.getElementById('depends-select');
const dueDateInput = document.getElementById('due-date');

list.addEventListener('click', (e) => {

    const li = e.target.closest('li');
    if (!li) return;
    
    const action = e.target.dataset.action;
    
    const subAction = e.target.dataset.subaction;

    if (subAction === 'add-subtask') {
        const li = e.target.closest('li');
        const input = li.querySelector('.subtask-input');
        const text = input.value.trim();
        if (!text) return;
    
        const subList = li.querySelector('.subtasks');
        const subItem = document.createElement('li');
        subItem.classList.add('subtask-item');
        subItem.textContent = text;

        const del = document.createElement('button');
        del.textContent = 'Delete';
        del.dataset.subaction = 'delete-subtask';

        subItem.appendChild(del);
        subList.appendChild(subItem);

        input.value = '';
        saveTasks();
        return;
    }

    if (subAction === 'delete-subtask') {
        const subItem = e.target.closest('.subtask-item');
        if (subItem) subItem.remove();
        saveTasks();
        return;
    }


    if (action === 'delete') {
        li.remove();
        saveTasks();
        refreshDependsSelect();
        updateBlockedStatus();
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
                refreshDependsSelect();
                updateBlockedStatus();

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

    const dependsOn = li.dataset.dependsOn;
    if (dependsOn) {
        const depLi = list.querySelector(`li[data-id="${dependsOn}"]`);
        const  depDone = depLi && depLi.classList.contains('done');
        if (!depDone) {
            const name = depLi ? depLi.querySelector('span').textContent : 'a missing task';
            alert('This task depends on "' + name + '" which is not done yet.');
            return;
        }
    }

    if (e.target.closest('.subtask-input') || e.target.closest('.subtask-add')) {
        return;
    }


    li.classList.toggle('done');
    updateBlockedStatus();
    saveTasks();
    refreshDependsSelect();
});

function addTask(text, done = false, shouldSave = true, id = null, dependsOn = '', dueDate = '', createdAt = null) {
    const li = document.createElement('li');

    const taskId = id || Date.now().toString();

    const created = createdAt || Date.now();
    li.dataset.createdAt = created;
    li.dataset.dueDate = dueDate || '';
    
    if (dependsOn && createsCycle(taskId, dependsOn)) {
        alert('That dependency would create a loop. Please choose a different dependency.');
        dependsOn = '';
    }
    li.dataset.id = taskId;
    li.dataset.dependsOn = dependsOn;

    const span = document.createElement('span');
    span.textContent = text;
    li.appendChild(span);

    // blocked tag
    const blockedTag = document.createElement('span');
    blockedTag.textContent = '(Blocked)';
    blockedTag.classList.add('blocked');
    blockedTag.style.display = 'none';
    li.appendChild(blockedTag);

    // dependency tag
    const dependsTag = document.createElement('span');
    dependsTag.classList.add('depends-label');
    dependsTag.style.display = 'none';
    li.appendChild(dependsTag);

    const barWrap = document.createElement('div');
    barWrap.classList.add('timebar');

    const barFill = document.createElement('div');
    barFill.classList.add('timebar-fill');
    barWrap.appendChild(barFill);
    li.appendChild(barWrap);

    const subList = document.createElement('ul');
    subList.classList.add('subtasks');
    li.appendChild(subList);

    const subInput = document.createElement('input');
    subInput.type = 'text';
    subInput.placeholder = 'Add subtask';
    subInput.classList.add('subtask-input');

    const subBtn = document.createElement('button');
    subBtn.textContent = 'Add subtask';
    subBtn.classList.add('subtask-add');

    li.appendChild(subInput);
    li.appendChild(subBtn);


    // buttons

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
        refreshDependsSelect();
    }
}

button.addEventListener('click', () => {
    const text = input.value.trim();
    const dueDate = dueDateInput.value;
    if (!text) return;

    const dependsOn = dependsSelect.value;
    addTask(text, false, true, null, dependsOn, dueDate);
});

input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
        const text = input.value.trim();
        const dueDate = dueDateInput.value;
        if (!text) return;

        const dependsOn = dependsSelect.value;
        addTask(text, false, true, null, dependsOn, dueDate);
    }
})

function saveTasks() {
    const tasks = [];

    list.querySelectorAll('li').forEach(li => {
        const dueDate = li.dataset.dueDate || '';
        const createdAt = li.dataset.createdAt || '';
        const text = li.querySelector('span').textContent;
        const done = li.classList.contains('done');
        const id = li.dataset.id;
        const dependsOn = li.dataset.dependsOn || '';
        tasks.push({ text, done, id, dependsOn, dueDate, createdAt });
    
    });
    localStorage.setItem('tasks', JSON.stringify(tasks));

}

function loadTasks() {
    const data = localStorage.getItem('tasks');
    if (!data) return;
    const tasks = JSON.parse(data);

    tasks.forEach(task => {
        addTask(task.text, task.done, false, task.id, task.dependsOn, task.dueDate, task.createdAt);
    });
    refreshDependsSelect(); 
    updateBlockedStatus();
}

function refreshDependsSelect() {
    dependsSelect.innerHTML = '<option value="">No dependency</option>';
    list.querySelectorAll('li').forEach(li => {
        const id = li.dataset.id;
        const text = li.querySelector('span').textContent;
        const option = document.createElement('option');
        option.value = id;
        option.textContent = text;
        dependsSelect.appendChild(option);
    });

    updateBlockedStatus();
    updateIndent();
    updateTimeBars();
}

function updateBlockedStatus() {
    list.querySelectorAll('li').forEach(li => {
        const dependsOn = li.dataset.dependsOn;
        const blockedTag = li.querySelector('.blocked');
        if (!dependsOn) {
            li.classList.remove('blocked');
            if (blockedTag) blockedTag.style.display = 'none';
            const dependsTag = li.querySelector('.depends-label');
            if (dependsTag) dependsTag.style.display = 'none';
            return;
        }


        const depLi = list.querySelector(`li[data-id="${dependsOn}"]`);
        const dependsTag = li.querySelector('.depends-label');

        if (dependsTag) {
            if (depLi) {
                dependsTag.textContent = '- Depends on: ' + depLi.querySelector('span').textContent;
            } else {
                dependsTag.textContent = '- Depends on: [Missing Task]';
            }
             dependsTag.style.display = 'inline';
    
        }

        const depDone = depLi && depLi.classList.contains('done');

        if (depDone) {
            li.classList.remove('blocked');
            if (blockedTag) blockedTag.style.display = 'none'; 
        } else {
            li.classList.add('blocked');
            if (blockedTag) blockedTag.style.display = 'inline'; 
        }
    });

}

function updateIndent() {
  list.querySelectorAll('li').forEach(li => {
    let level = 0;
    let current = li;

    while (true) {
      const dependsOn = current.dataset.dependsOn;
      if (!dependsOn) break;

      const parent = list.querySelector(`li[data-id="${dependsOn}"]`);
      if (!parent) break;

      level++;
      current = parent;
    }

    li.style.setProperty('--indent', level);
  });
}

function createsCycle(taskId, dependsOn) {
    let currentId = dependsOn;

    while (currentId) {
        if (currentId === taskId) {
            return true;
        }
        const parent = list.querySelector(`li[data-id="${currentId}"]`);
        if (!parent) break;
        currentId = parent.dataset.dependsOn || '';
    
    }
    return false;
}

function updateTimeBars() {
    const now = Date.now();
    const monthMs = 30 * 24 * 60 * 60 * 1000;

    list.querySelectorAll('li').forEach(li => {
        const due = li.dataset.dueDate;
        const bar = li.querySelector('.timebar-fill');

        if (!bar) return;

        if (!due) {
            bar.style.width = '0%';
            bar.style.background = '#ccc';
            return;
        }

        const dueTime = new Date(due + 'T23:59:59').getTime();
        
        const remaining = dueTime - now;
        const ratio = Math.max(0, Math.min(1, remaining / monthMs));

        const percent = Math.round((1-ratio) * 100);

        bar.style.width = percent + '%';
        if (ratio > 0.5) {
            bar.style.background = 'green';
        } else if (ratio > 0.2) {
            bar.style.background = 'orange';
        } else {
            bar.style.background = 'red';
        }
    });
}

setInterval(updateTimeBars, 60 * 1000);

loadTasks();
