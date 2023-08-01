var task = [
    //name,Due date, Task importance, is begun, task began from date,is finished, finished date
]
var taskImportance = [//tasks sorted by importance
    //---weight of importance---
    //0:optional
    //1: should be done but isn't necessary
    //2: average
    //3: important
    //4: very important
    //5:urgent/must be done without delay
    //--------------------------
    //task name, Task importance, task index corresponding to task array
]
var importance = [
    "Optional",
    "Should be done but isn't necessary",
    "Average",
    "Important",
    "Very important",
    "Urgent/Must be done without delay"
]
const todoList = document.querySelector(".todo");
const inProgressList = document.querySelector(".inProgress");
function sortByImportance() {
    taskImportance.sort((a, b) => b[1] - a[1]);
}
function addTask() {//adds the task to to arrays! DOES NOT ADD IN VIEWPORT
    const taskNameInput = document.getElementById("taskName");
    const taskDueDateInput = document.getElementById("taskDueDate");
    const taskWeightInput = document.getElementById("taskWeight");

    // Check if the form inputs are filled out
    if (taskNameInput.value.trim() === "" || taskDueDateInput.value.trim() === "" || taskWeightInput.value.trim() === "") {
        alert("Please fill out all the fields.");
        return;
    }

    const taskName = taskNameInput.value;
    const dueDate = taskDueDateInput.value;
    const taskWeight = parseInt(taskWeightInput.value);

    // Add the task to the task array
    task.push([taskName, dueDate, taskWeight, false, "", false, ""]);

    // Add the task to the taskImportance array
    taskImportance.push([taskName, taskWeight, task.length - 1]);

    // Clear the form inputs
    taskNameInput.value = "";
    taskDueDateInput.value = "";
    taskWeightInput.value = "";
    sortByImportance()
    saveTasks();
    return 0; //success
}
function removeTask(taskIndex) {
    task.splice(taskIndex, 1); // Remove task from the task array
    // Update taskImportance array after removing the task
    taskImportance = taskImportance.filter((item) => item[2] !== taskIndex);
    renderTasks();
    saveTasks();
}
function clearAll() {//removes all tasks from the arrays
    task = [];
    taskImportance = [];
    renderTasks();
}
function clearFinished() {//removes all finished tasks from the arrays
    for (var i=0;i<task.length;i++) {
        if (task[i][5] === true) {
            task.splice(i, 1); // Remove task from the task array
            // Update taskImportance array after removing the task
            taskImportance = taskImportance.filter((item) => item[2] !== i);
            i--;
        }
    }
    renderTasks();
    
}
function showConfirmClear(button) {
    confirmClear = document.getElementById("confirmClear");
    if(!confirmClear.classList.contains("show")) {
        confirmClear.classList.add("show");
    } else {
        confirmClear.classList.remove("show");
    }
}
function beginTask(taskIndex) {
    task[taskIndex][3] = true; // Set is begun to true
    task[taskIndex][4] = new Date().toLocaleDateString(); // Set task began from date to current date
    renderTasks();
    saveTasks();
}
function endTask(taskIndex) {
    task[taskIndex][3] = false; // Set is begun to false
    task[taskIndex][5] = true; // Set is finished to true
    task[taskIndex][6] = new Date().toLocaleDateString(); // Set finished date to current date
    renderTasks();
    saveTasks();
}
function renderTasks() {
    sortByImportance();
    todoList.innerHTML = "<h1>ToDo</h1>";
    inProgressList.innerHTML = "<h1>In Progress/Completed</h1>";
    for (var i = 0; i < taskImportance.length; i++) {
        const taskIndex = taskImportance[i][2];
        if (task[taskIndex][3] === false) {
            if (task[taskIndex][5] === false) {
                todoList.innerHTML += `
                    <div class="task">
                        <p class="taskTitle">${task[taskIndex][0]}</p> <br>
                        Due Date:${task[taskIndex][1]} <br>
                        Importance lvl${task[taskIndex][2]}: ${importance[task[taskIndex][2]]} <br>
                        <button class="taskButton" onclick="beginTask(${taskIndex})">Begin</button>
                        <button class="taskButton removeButton" onclick="removeTask(${taskIndex})">Remove</button>
                    </div>`;//render not started task
            } else {
                inProgressList.innerHTML += `
                <div class="task_finish">
                <!-- this is a placeholder later to be in js -->
                <p class="taskTitle">${task[taskIndex][0]}</p> <br>
                Due Date:${task[taskIndex][1]} <br>
                Started Date:${task[taskIndex][4]} <br>
                Finished Date:${task[taskIndex][6]} <br>
                Took days:${Math.floor((new Date(task[taskIndex][6]) - new Date(task[taskIndex][4])) / (1000 * 60 * 60 * 24))} <br>
                </div>`; // Render ended task
            }
        } else {
            inProgressList.innerHTML += `
            <div class="task">
                <p class="taskTitle">${task[taskIndex][0]}</p> <br>
                Due Date:${task[taskIndex][1]} <br>
                Started Date:${task[taskIndex][4]} <br>
                Importance lvl${task[taskIndex][2]}: ${importance[task[taskIndex][2]]} <br>
                <button class="taskButton" onclick="endTask(${taskIndex})">Finish</button>
                <button class="taskButton removeButton" onclick="removeTask(${taskIndex})">Remove</button>
            </div>`;; // Render started task
        }
    }
}
const cookieVal = document.cookie;
function saveTasks() {
    const taskArrayString = JSON.stringify(task);
    const taskImportanceString = JSON.stringify(taskImportance);
    localStorage.setItem('task', taskArrayString);
    localStorage.setItem('taskImportance', taskImportanceString);
    console.log("Saved tasks to localStorage.");
}

function loadTasks() {
    const taskArrayString = localStorage.getItem('task');
    const taskImportanceString = localStorage.getItem('taskImportance');

    if (taskArrayString && taskImportanceString) {
        task = JSON.parse(taskArrayString);
        taskImportance = JSON.parse(taskImportanceString);
        console.log("Loaded tasks from localStorage.");
    } else {
        console.log("No tasks found in localStorage.");
    }
}
document.addEventListener("click", (e) => {
    const addTaskForm = document.querySelector(".addTask");
    //-----------------add task-----------------
    if (e.target.id === "add") {
        if (!addTaskForm.classList.contains("show")) {
            document.getElementById("add").innerHTML = "Cancel";
            addTaskForm.classList.add("show");
        } else {
            document.getElementById("add").innerHTML = "Add Task";
            addTaskForm.classList.remove("show");
        }
    }
    if (e.target.id === "addTaskButton") {
        try {
            const result = addTask();
            if (result === 0) {
                // Task added successfully
                addTaskForm.classList.remove("show");
                document.getElementById("add").innerHTML = "Add Task";
                renderTasks();
            }
        } catch (error) {
            document.getElementById("add").innerHTML = "Add Task";
            // Handle any errors that occurred during task addition
            alert("An error occurred while adding the task.");
            console.error(error);
        }
    }
    //-------------------------------------------
    //-----------------clear-----------------
    if(e.target.id === "clear") {//all
        clearAll();
        showConfirmClear();
    }
    if(e.target.id == "clearFinished") {
        clearFinished();
        showConfirmClear(e);
    }
    if(e.target.id == "confirmClear") {
        saveTasks();
    }
    //-------------------------------------------
});
window.onload = () => {loadTasks(); renderTasks();};