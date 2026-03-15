const formElement = document.querySelector('.to-do__form');
const inputElement = document.querySelector('.to-do__input');
const listElement = document.querySelector('.to-do__list');
const template = document.querySelector('#to-do__item-template');

const DEFAULT_TASKS = [
    'Покормить кота',
    'Сделать зарядку',
    'Выучить JavaScript',
    'Сходить в магазин',
    'Полить цветы',
    'Позвонить родителям'
];

function getTasksFromDOM() {
    const itemsNamesElements = document.querySelectorAll('.to-do__item-text');
    const tasks = [];
    
    itemsNamesElements.forEach((element) => {
        tasks.push(element.textContent);
    });
    
    return tasks;
}

function saveTasks(tasksArray) {
    localStorage.setItem('tasks', JSON.stringify(tasksArray));
}

function loadTasks() {
    const savedTasks = localStorage.getItem('tasks');
    
    if (savedTasks) {
        return JSON.parse(savedTasks);
    }

    return [...DEFAULT_TASKS];
}

function updateLocalStorage() {
    const items = getTasksFromDOM();
    saveTasks(items);
}

function createItem(text) {
    const clone = template.content.cloneNode(true);

    const textElement = clone.querySelector('.to-do__item-text');
    const deleteButton = clone.querySelector('.to-do__item-button_type_delete');
    const duplicateButton = clone.querySelector('.to-do__item-button_type_duplicate');
    const editButton = clone.querySelector('.to-do__item-button_type_edit');

    textElement.textContent = text;

    const taskItem = clone.querySelector('.to-do__item');

    deleteButton.addEventListener('click', () => {
        taskItem.remove();
        updateLocalStorage();
    });

    duplicateButton.addEventListener('click', () => {
        const itemName = textElement.textContent;
        const newItem = createItem(itemName);
        listElement.prepend(newItem);
        updateLocalStorage();
    });

    editButton.addEventListener('click', () => {
        textElement.setAttribute('contenteditable', 'true');
        textElement.focus();
    });

    textElement.addEventListener('blur', () => {
        textElement.setAttribute('contenteditable', 'false');
        updateLocalStorage();
    });
    
    return clone;
}

formElement.addEventListener('submit', (event) => {
    event.preventDefault();
    
    const taskText = inputElement.value.trim();

    if (!taskText) {
        return;
    }
    
    const newTask = createItem(taskText);
    listElement.prepend(newTask);
    inputElement.value = '';
    updateLocalStorage();
});

const items = loadTasks();
items.forEach((item) => {
    const taskElement = createItem(item);
    listElement.append(taskElement);
});
