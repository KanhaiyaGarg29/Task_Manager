
window.addEventListener('load', () => {
    // Initialize todos array from localStorage or create an empty array
    todos = JSON.parse(localStorage.getItem('todos')) || [];
    // Get references to various HTML elements
    
    const newTodoForm = document.querySelector('#new-todo-form');
   
    const searchInput = document.querySelector('#search');
    const sortSelect = document.querySelector('#sort-select');

    const filterIcon = document.querySelector('#filter-icon');
    const filterDropdown = document.querySelector('#filter-dropdown');
    const filterSelect = document.querySelector('#filter-select');


// Add event listener for submitting the new to-do form
    newTodoForm.addEventListener('submit', e => {
        e.preventDefault();

        const selectedCategory = document.querySelector('input[name="category"]:checked');
        if (!selectedCategory) {
            alert("No category selected");// No category selected
        }
  // Create a new todo object
        const todo = {
            content: e.target.elements.content.value,

            category: selectedCategory.value,
            done: false,
            createdAt: new Date().getTime(),
            deadline: null,
            isNew: true // Mark as new
        }
        const deadlineInput = e.target.elements.deadline;
        const selectedDeadline = new Date(deadlineInput.value).getTime();

        if(!selectedDeadline){
            alert("Enter the deadline date");
            return;
        }
        
        todo.deadline = selectedDeadline;
            // Add the new todo to the todos array and update localStorage
        todos.push(todo);

        localStorage.setItem('todos', JSON.stringify(todos));

        // Reset the form and display updated todos
        e.target.reset();

        DisplayTodos()
    })
    // Add event listener for search input changes
    searchInput.addEventListener('input', () => {
        DisplayTodos();
    }); 
  // Add event listener for sort select changes
    sortSelect.addEventListener('change', () => {
        DisplayTodos();
    });
 // Add event listener for filter icon click
    filterIcon.addEventListener('click', () => {
        filterDropdown.classList.toggle('show');
    });
 // Add event listener for filter select changes
    filterSelect.addEventListener('change', () => {
        DisplayTodos();
    });
// Display initial todos
    DisplayTodos();
   
    updateClockDisplay();
})


function DisplayTodos() {
    const todoList = document.querySelector('#todo-list');
    const searchInput = document.querySelector('#search');
    const searchQuery = searchInput.value.toLowerCase();
    const sortSelect = document.querySelector('#sort-select');
    const selectedSort = sortSelect.value;
    const filterSelect = document.querySelector('#filter-select');
    const selectedFilter = filterSelect.value;

     // Clear the existing todo list
    todoList.innerHTML = "";
    // Apply sorting based on user selection
    if (selectedSort === 'created-newest') {
        todos.sort((a, b) => b.createdAt - a.createdAt); // Sort by creation time, newest first
    } else if (selectedSort === 'created-oldest') {
        todos.sort((a, b) => a.createdAt - b.createdAt); // Sort by creation time, oldest first
    }  
    else if (selectedSort === 'alphabetical-asc') {
        todos.sort((a, b) => a.content.localeCompare(b.content)); // Sort alphabetically, ascending order
    } else if (selectedSort === 'alphabetical-desc') {
        todos.sort((a, b) => b.content.localeCompare(a.content)); // Sort alphabetically, descending order
    }

// Apply filtering based on user selection
    const filteredTodos = todos.filter(todo => {
        if (selectedFilter === 'completed') {
            return todo.done;
        } else if (selectedFilter === 'incomplete') {
            return !todo.done;
        } else if (selectedFilter === 'personal') {
            return todo.category === 'personal';
        } else if (selectedFilter === 'work') {
            return todo.category === 'work';
        } else {
            return true; // Show all todos
        }
    });

    const currentTime = new Date().getTime();
    const twetnyFourHours = 24 * 60 * 60 * 1000; // 24 hours in milliseconds
    const twelveHoursInMilliseconds = 12 * 60 * 60 * 1000; // 12 hours in milliseconds

    filteredTodos.forEach(todo => {
        if (todo.content.toLowerCase().includes(searchQuery)) {
            const todoItem = document.createElement('div');
            todoItem.classList.add('todo-item');

            const label = document.createElement('label');
            const input = document.createElement('input');
            const span = document.createElement('span');
            const content = document.createElement('div');
            const actions = document.createElement('div');
            const edit = document.createElement('button');
            const deleteButton = document.createElement('button');
            //avatar
            const avatarImageUrl = 'image.png';
            const avatarImage = document.createElement('img');
            avatarImage.src = avatarImageUrl;
            avatarImage.classList.add('avatar-image');
            //date
            const createdAt = new Date(todo.createdAt);
            const formattedDate = createdAt.toLocaleDateString(undefined, { timeZone: 'Asia/Kolkata' });
            const formattedTime = createdAt.toLocaleTimeString(undefined, { timeZone: 'Asia/Kolkata' });

           //deadline
            todoItem.classList.remove('red-todo-item');
            const remainingTimeP = document.createElement('p');
            remainingTimeP.classList.add('remaining-time');
            if (todo.deadline) {
                const deadlineDate = new Date(todo.deadline);
                const timeRemaining = deadlineDate - currentTime;
                const daysRemaining = Math.floor(timeRemaining / (24 * 60 * 60 * 1000));
             
                const hoursRemaining = Math.floor((timeRemaining % (24 * 60 * 60 * 1000)) / (60 * 60 * 1000));
                const minutesRemaining = Math.floor((timeRemaining % (60 * 60 * 1000)) / (60 * 1000));



                if (daysRemaining > 0) {
                    remainingTimeP.textContent = `Deadline: ${daysRemaining}days ${hoursRemaining}h ${minutesRemaining}m`
                }
                else if (daysRemaining == 1) {
                    remainingTimeP.textContent = `Deadline: ${daysRemaining}day ${hoursRemaining}h ${minutesRemaining}m`
                }
                else {
                    remainingTimeP.textContent = `Deadline: ${hoursRemaining}h ${minutesRemaining}m`;
                }

                if (timeRemaining > twelveHoursInMilliseconds && timeRemaining < twetnyFourHours) {
                    todoItem.classList.add('yellow-todo-item');
                }
                else if (timeRemaining < twelveHoursInMilliseconds) {
                    todoItem.classList.remove('yellow-todo-item');
                    todoItem.classList.add('red-todo-item');
                }
                if (timeRemaining < 0) {
                    remainingTimeP.textContent = `Task Due`;
                }
            }
            todoItem.appendChild(remainingTimeP);


            input.type = 'checkbox';
            input.checked = todo.done;
            span.classList.add('bubble');

            if (todo.category == 'personal') {
                span.classList.add('personal');
            }
            else {
                span.classList.add('work');
            }
            content.classList.add('todo-content');
            actions.classList.add('actions');
            edit.classList.add('edit');
            deleteButton.classList.add('delete');

         
            content.innerHTML = `<div class="editable-content" contenteditable="false">${todo.content}</div> `
            edit.innerHTML = '<i class="fa-regular fa-pen-to-square"></i>';
            deleteButton.innerHTML = '<i class="fa-solid fa-trash"></i>';

            const createdAtP = document.createElement('p');
            createdAtP.classList.add('created-at');
            createdAtP.textContent = ` ${formattedDate} ${formattedTime}`;

           
            content.appendChild(createdAtP);
            content.appendChild(avatarImage);
            label.appendChild(input);
            label.appendChild(span);
            actions.appendChild(edit);
            actions.appendChild(deleteButton);
            todoItem.appendChild(label);
            todoItem.appendChild(content);
            todoItem.appendChild(actions);

            todoList.appendChild(todoItem);

            if (todo.isNew) {
                todoItem.classList.add('animate__animated', 'animate__fadeInUp'); // Add animation classes
                todo.isNew = false;
            }

            if (todo.done) {
                todoItem.classList.add('done');
                todoItem.classList.remove('red-todo-item');
                todoItem.classList.remove('yellow-todo-item');
                remainingTimeP.textContent = `Task Completed`;

            }

            input.addEventListener('change', (e) => {
                todo.done = e.target.checked;
                localStorage.setItem('todos', JSON.stringify(todos));

                if (todo.done) {
                    todoItem.classList.add('done');

                } else {
                    todoItem.classList.remove('done');
                }

                DisplayTodos();
            });

            edit.addEventListener('click', () => {
                const input = content.querySelector('.editable-content');
              
                input.contentEditable = true;
                // input.focus();
                input.classList.add('animate__animated', 'animate__flipInX');
                input.addEventListener('blur', (e) => {
                    
                    input.contentEditable = false;
                    // todo.content = e.target.value;
                    const editedContent = e.target.textContent;
                    todo.content = editedContent.trim(); // Update the todo content
                    localStorage.setItem('todos', JSON.stringify(todos));
                    DisplayTodos();
                });
            });

            deleteButton.addEventListener('click', () => {
                const todoItem = deleteButton.closest('.todo-item');

                // Add animate.css classes
                todoItem.classList.add('animate__animated', 'animate__fadeOutLeft');

                setTimeout(() => {
                    todos = todos.filter(t => t !== todo);
                    localStorage.setItem('todos', JSON.stringify(todos));
                    DisplayTodos();
                }, 800);
            });
            todoItem.addEventListener('animationend', () => {
                todoItem.classList.remove('animate__animated', 'animate__fadeOutLeft');
            });
        }
    });
}


// Function to update the clock display
function updateClockDisplay() {
    const now = new Date();
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');
    const timeString = `${hours}:${minutes}:${seconds}`;
    
    document.getElementById('clockDisplay').textContent = timeString;
}
setInterval(updateClockDisplay,1000);