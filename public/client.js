// Function to fetch tasks from the server and update the todo list
function fetchTasksAndUpdateList() {
    fetch("/tasks")
    .then(response => {
        if (!response.ok) {
            throw new Error("Failed to fetch tasks");
        }
        return response.json();
    })
    .then(tasks => {
        // Call a function to update the DOM with the fetched tasks
        updateTodoList(tasks);
    })
    .catch(error => {
        console.error("Error fetching tasks:", error);
        alert("Failed to fetch tasks. Please try again.");
    });
}

// Function to delete a task
function deleteTask(taskId) {
    if (confirm("Are you sure you want to delete this task?")) {
        fetch(`/delete-task/${encodeURIComponent(taskId)}`, {
            method: "DELETE"
        })
        .then(response => {
            if (response.ok) {
                // If the delete operation was successful, reload the tasks
                fetchTasksAndUpdateList();
            } else {
                throw new Error("Failed to delete task");
            }
        })
        .catch(error => {
            console.error("Error deleting task:", error);
            alert("Failed to delete task. Please try again.");
        });
    }
}

// Function to update a task
function updateTask(taskId, newDescription) {
    fetch(`/update-task/${encodeURIComponent(taskId)}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ description: newDescription })
    })
    .then(response => {
        console.log(newDescription+" new");
        if (response.ok) {
            // If the update operation was successful, fetch and update the task list
            fetchTasksAndUpdateList();
        } else {
            throw new Error("Failed to update task");
        }
    })
    .catch(error => {
        console.error("Error updating task:", error);
        alert("Failed to update task. Please try again.");
    });
}

function deleteAllTasks() {
    if (confirm("Are you sure you want to delete all tasks?")) {
        fetch(`/delete-all-tasks`, {
            method: "DELETE"
        })
        .then(response => {
            if (response.ok) {
                // If the delete operation was successful, reload the tasks
                fetchTasksAndUpdateList();
            } else {
                throw new Error("Failed to delete all tasks");
            }
        })
        .catch(error => {
            console.error("Error deleting all tasks:", error);
            alert("Failed to delete all tasks. Please try again.");
        });
    }
}
document.getElementById("delete-all-btn").addEventListener("click", deleteAllTasks);

// Function to create task elements
function createTaskElement(task) {
    const li = document.createElement("li");
    const span = document.createElement("span");
    span.textContent = task.description;
    const deleteBtn = document.createElement("button");
    deleteBtn.textContent = "Delete";
    deleteBtn.classList.add("delete-btn");
    deleteBtn.onclick = () => deleteTask(task._id);
    const updateBtn = document.createElement("button");
    updateBtn.textContent = "Update";
    updateBtn.classList.add("update-btn");
    updateBtn.onclick = () => {
        const newDescription = prompt("Enter the new description:", task.description);
        if (newDescription !== null) {
            updateTask(task._id, newDescription);
        }
    };
    li.appendChild(span);
    li.appendChild(deleteBtn);
    li.appendChild(updateBtn);
    return li;
}

// Function to update the todo list
function updateTodoList(tasks) {
    const ul = document.querySelector("ul");
    ul.innerHTML = ""; // Clear the existing list
    tasks.forEach(task => {
        const li = createTaskElement(task);
        ul.appendChild(li);
    });
}


// Fetch tasks when the page loads
window.addEventListener("load", fetchTasksAndUpdateList);
