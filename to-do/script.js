const button = document.getElementById('add-btn');
const input = document.getElementById('task-input');
const list = document.getElementById('task-list');
const dependsSelect = document.getElementById('depends-select');

list.addEventListener('click', (e) => {

    const li = e.target.closest('li');
    if (!li) return;
    
    const action = e.target.dataset.action;

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

    li.classList.toggle('done');
    updateBlockedStatus();
    saveTasks();
    refreshDependsSelect();
});

function addTask(text, done = false, shouldSave = true, id = null, dependsOn = '') {
    const li = document.createElement('li');

    const taskId = id || Date.now().toString();
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
    if (!text) return;

    const dependsOn = dependsSelect.value;
    addTask(text, false, true, null, dependsOn);
});

input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
        const text = input.value.trim();
        if (!text) return;

        const dependsOn = dependsSelect.value;
        addTask(text, false, true, null, dependsOn);
    }
})

function saveTasks() {
    const tasks = [];

    list.querySelectorAll('li').forEach(li => {
        const text = li.querySelector('span').textContent;
        const done = li.classList.contains('done');
        const id = li.dataset.id;
        const dependsOn = li.dataset.dependsOn || '';
        tasks.push({ text, done, id, dependsOn });
    
    });
    localStorage.setItem('tasks', JSON.stringify(tasks));

}

function loadTasks() {
    const data = localStorage.getItem('tasks');
    if (!data) return;
    const tasks = JSON.parse(data);

    tasks.forEach(task => {
        addTask(task.text, task.done, false, task.id, task.dependsOn);
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


loadTasks();
