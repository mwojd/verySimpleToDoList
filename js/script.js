var task = [
    //order of array:
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
    //importance number to string for nicer view
    "Optional",
    "Should be done but isn't necessary",
    "Average",
    "Important",
    "Very important",
    "Urgent/Must be done without delay"
]
//selects all elements with class todo
const todoList = document.querySelector(".todo");
//selects all elements with class inProgress
const inProgressList = document.querySelector(".inProgress");
//sorts the taskImportance array by importance
function sortByImportance() {
    taskImportance.sort((a, b) => b[1] - a[1]);
}
//adds the task to to arrays! DOES NOT ADD IN VIEWPORT
function addTask() {
    const taskNameInput = document.getElementById("taskName");
    const taskDueDateInput = document.getElementById("taskDueDate");
    const taskWeightInput = document.getElementById("taskWeight");

    // Check if the form inputs are filled out
    if (taskNameInput.value.trim() === "" || taskDueDateInput.value.trim() === "" || taskWeightInput.value.trim() === "") {
        alert("Please fill out all the fields.");
        return;
    }

    //get the taskName, taskDueDate and taskWeight from the form
    const taskName = taskNameInput.value;
    const dueDate = taskDueDateInput.value;
    const taskWeight = parseInt(taskWeightInput.value);

    // Add the task to the task array
    task.push([taskName, dueDate, taskWeight, false, "", false, ""]);

    // Add the task to the taskImportance array
    taskImportance.push([taskName, taskWeight, task.length - 1]);

    // Clear the form inputs, sort by value and save tasks
    taskNameInput.value = "";
    taskDueDateInput.value = "";
    taskWeightInput.value = "";
    sortByImportance()
    saveTasks();
    return 0; //success
}
//removes a specific task from arrays by index
function removeTask(taskIndex) {
    task.splice(taskIndex, 1); // Remove task from the task array
    // Update taskImportance array after removing the task
    taskImportance = taskImportance.filter((item) => item[2] !== taskIndex);
    renderTasks();
    saveTasks();
}
//removes all tasks from the arrays
function clearAll() {
    task = [];
    taskImportance = [];
    renderTasks();
}
//removes all finished tasks from the arrays
function clearFinished() {
    for (var i=0;i<task.length;i++) {
        if (task[i][5] === true) {//if task is finished
            task.splice(i, 1); // Remove task from the task array
            // Update taskImportance array after removing the task
            taskImportance = taskImportance.filter((item) => item[2] !== i);
            i--;
        }
    }
    renderTasks();
    
}
//when either of clear buttons are clicked ask for confirmation
function showConfirmClear() {
    confirmClear = document.getElementById("confirmClear");
    if(!confirmClear.classList.contains("show")) {
        confirmClear.classList.add("show");
    } else {
        confirmClear.classList.remove("show");
    }
}
//sets the todo task to task in progress
function beginTask(taskIndex) {
    task[taskIndex][3] = true; // Set is begun to true
    task[taskIndex][4] = new Date().toLocaleDateString(); // Set task began from date to current date
    renderTasks();
    saveTasks();
}
//ends a task
function endTask(taskIndex) {
    task[taskIndex][3] = false; // Set is begun to false
    task[taskIndex][5] = true; // Set is finished to true
    task[taskIndex][6] = new Date().toLocaleDateString(); // Set finished date to current date
    renderTasks();
    saveTasks();
}
//renders the task on the website
function renderTasks() {
    sortByImportance();//update importance array
    todoList.innerHTML = '<span class="catTitle">ToDo</span>';//clear the todo list
    inProgressList.innerHTML = '<span class="catTitle">In Progress/Completed</span>'; //clear the in progress/compleated list
    for (var i = 0; i < taskImportance.length; i++) {//for each task
        const taskIndex = taskImportance[i][2];//get the task index
        if (task[taskIndex][3] === false) { //if task is not started
            if (task[taskIndex][5] === false) { //if task is not finished
                todoList.innerHTML += `
                    <div class="task">
                        <p class="taskTitle">${task[taskIndex][0]}</p> <br>
                        Due Date:${task[taskIndex][1]} <br>
                        Importance lvl${task[taskIndex][2]}: ${importance[task[taskIndex][2]]} <br>
                        <button class="taskButton" onclick="beginTask(${taskIndex})">Begin</button>
                        <button class="taskButton removeButton" onclick="removeTask(${taskIndex})">Remove</button>
                    </div>`;//render not started task
            } else { //if task is finished
                inProgressList.innerHTML += `
                <div class="task_finish">
                <p class="taskTitle">${task[taskIndex][0]}</p> <br>
                Due Date:${task[taskIndex][1]} <br>
                Started Date:${task[taskIndex][4]} <br>
                Finished Date:${task[taskIndex][6]} <br>
                Took days:${Math.floor((new Date(task[taskIndex][6]) - new Date(task[taskIndex][4])) / (1000 * 60 * 60 * 24))} <br>
                </div>`; // Render ended task
            }
        } else {//if task is started
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
//saves all tasks to local storage
function saveTasks() {
    const taskArrayString = JSON.stringify(task); // Convert task array to string
    const taskImportanceString = JSON.stringify(taskImportance); // Convert taskImportance array to string
    localStorage.setItem('task', taskArrayString);// Save task array to localStorage
    localStorage.setItem('taskImportance', taskImportanceString);// Save taskImportance array to localStorage
    console.log("Saved tasks to localStorage.");//log confirmation
}
//loads task from storage
function loadTasks() {
    const taskArrayString = localStorage.getItem('task');// Get task array from localStorage
    const taskImportanceString = localStorage.getItem('taskImportance');// Get taskImportance array from localStorage

    if (taskArrayString && taskImportanceString) {//if tasks are found
        task = JSON.parse(taskArrayString);// Convert task array string to array
        taskImportance = JSON.parse(taskImportanceString);// Convert taskImportance array string to array
        console.log("Loaded tasks from localStorage.");//log confirmation
    } else {//if no tasks are found
        console.log("No tasks found in localStorage.");//log no tasks found
    }
}
//when a button is clicked
document.addEventListener("click", (e) => {
    const addTaskForm = document.querySelector(".addTask");
    //-----------------add task-----------------
    if (e.target.id === "add") {//if the task button is clicked then show the add task form
        if (!addTaskForm.classList.contains("show")) {
            document.getElementById("add").innerHTML = "Cancel";
            addTaskForm.classList.add("show");
        } else {
            document.getElementById("add").innerHTML = "Add Task";
            addTaskForm.classList.remove("show");
        }
    }
    if (e.target.id === "addTaskButton") {//if the add task button is clicked then add the task
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
    if(e.target.id === "clear") {//clear all tasks
        clearAll();
        showConfirmClear();
    }
    if(e.target.id == "clearFinished") {//clear all finished tasks
        clearFinished();
        showConfirmClear();
    }
    if(e.target.id == "confirmClear") {// confirm the clear
        saveTasks();
        location.reload();
    }
    //-------------------------------------------
});
//when the page loads load tasks and render tasks
window.onload = () => {loadTasks(); renderTasks();};