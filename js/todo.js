let htmlBody = document.querySelector('body')
let refreshFlag = 0
let todoContent = document.createElement('div')
todoContent.innerText = "Multiple Todos"
htmlBody.appendChild(todoContent)

let breakElement1 = document.createElement('br')
todoContent.appendChild(breakElement1)

let inputTodo = document.createElement('input')
inputTodo.type = "text"
inputTodo.placeholder = "enter todo name here"
inputTodo.value = ""
todoContent.appendChild(inputTodo)

let buttonAddTodos = document.createElement('button')
buttonAddTodos.innerText = "Add Todo"
buttonAddTodos.addEventListener('click', (e) => {
    e.preventDefault()
    refreshFlag=1
    let parID = Date.now().toString(36) + Math.random().toString(36)
    let nameTodo = inputTodo.value.toUpperCase()
    let textConID =  Date.now().toString()
    createNewTodo(parID, nameTodo,textConID)
})
todoContent.appendChild(buttonAddTodos)

if (JSON.parse(localStorage.getItem("Todos.list")) || JSON.parse(localStorage.getItem("Tasks.list"))) {
    let todos = JSON.parse(localStorage.getItem("Todos.list"))
    let tasks = JSON.parse(localStorage.getItem("Tasks.list"))
    todos.data.forEach((item) => {
        let dataTaskID = JSON.parse(localStorage.getItem(item.mainDivID))
        console.log(dataTaskID)
        createNewTodo(item.mainDivID,item.mainDivValue,item.sideDivID)
        if ("id" in dataTaskID) {
            dataTaskID.id.forEach((uniqueID)=>{
                tasks.data.forEach((task)=>{
                    if(uniqueID == task.mainDivID){
                        let taskContainer = document.getElementById(item.sideDivID)
                        let storedTask = createNewTask(task.mainDivValue,task.mainDivID)
                        taskContainer.appendChild(storedTask)
                    }
                })
            })
        }
    })
}

function createNewTodo(parentID, name, taskContainerID) {
    let mainDiv = document.createElement('div')
    mainDiv.id = parentID
    mainDiv.innerText = name
    mainDiv.className = "todo"
    if (mainDiv.innerText === null || mainDiv.innerText === "") {
        return
    }
    let todoID = JSON.parse(localStorage.getItem("Todos.list")) || ""
    if (todoID.data) {
        todoID.data.push({ mainDivID: mainDiv.id, mainDivValue: mainDiv.innerText, sideDivID : taskContainerID, isTodo: true })
    }
    else {
        todoID = { data: [{ mainDivID: mainDiv.id, mainDivValue: mainDiv.innerText,sideDivID : taskContainerID, isTodo : true }] }
    }
    if(refreshFlag){
        addTodoToLocalStorage(todoID)
        addTaskIDToLocalStorage({},mainDiv.id)
    }
    todoContent.appendChild(mainDiv)
    inputTodo.value = ""
    inputTodo.focus()

    let sideDiv = document.createElement('div')
    sideDiv.id = taskContainerID
    sideDiv.className = "task-container"
    mainDiv.appendChild(sideDiv)

    let inputElement = document.createElement('input')
    inputElement.type = "text"
    inputElement.placeholder = "enter task here"
    inputElement.value = ""
    inputElement.className = "input-task"
    mainDiv.appendChild(inputElement)

    let buttonAddTask = document.createElement('button')
    buttonAddTask.innerText = "Add task"
    buttonAddTask.className = "add-task"
    buttonAddTask.addEventListener('click', () => {
        refreshFlag = 1
        let uniqueTaskId = Date.now().toString(36) + Math.random().toString(36)
        let task = createNewTask(inputElement.value,uniqueTaskId)
        sideDiv.appendChild(task)
        let todoIds = sideDiv.parentElement.getAttribute("id")
    
        let taskID = JSON.parse(localStorage.getItem(todoIds)) || ""
        if ("id" in taskID) {
            taskID.id.push(task.id) 
        }
        else {
            taskID = { id: [task.id] }
        }
        if(refreshFlag){
            addTaskIDToLocalStorage(taskID, todoIds)
        }
        inputElement.value = ""
        inputElement.focus()
    })
    mainDiv.appendChild(buttonAddTask)

    let buttonDeleteTodo = document.createElement('button')
    buttonDeleteTodo.innerText = "Delete Todo"
    buttonDeleteTodo.className = "delete-button"
    mainDiv.appendChild(buttonDeleteTodo)
}

function createNewTask(inputTaskValue, uniqueTaskId) {
    let newTask = document.createElement('div')
    newTask.id = uniqueTaskId;
    newTask.className = "task"
    let labelTask = document.createElement('label')
    labelTask.innerText = inputTaskValue
    labelTask.className = "task-label"
    if (!labelTask.innerText) {
        return
    }
    let newTaskID = JSON.parse(localStorage.getItem("Tasks.list")) || ""
    if (newTaskID.data) {
        newTaskID.data.push({ mainDivID: newTask.id, mainDivValue: labelTask.innerText, isTodo : false })
    }
    else {
        newTaskID = { data: [{ mainDivID: newTask.id, mainDivValue: labelTask.innerText, isTodo : false }] }
    }
    if(refreshFlag){
        storeDataTaskToLocalStorage(newTaskID)
    }
    let checkBoxIsFinished = document.createElement('input')
    checkBoxIsFinished.type = "checkbox"
    checkBoxIsFinished.className = "checkbox-input"

    checkBoxIsFinished.addEventListener('click', () => {
        labelTask.classList.toggle("task-label-finished")
    })

    let buttonDelete = document.createElement('button')
    buttonDelete.innerText = "Delete"
    buttonDelete.className = "delete-button"

    let breakElement = document.createElement('br')

    newTask.appendChild(labelTask)
    newTask.appendChild(checkBoxIsFinished)
    newTask.appendChild(buttonDelete)
    newTask.appendChild(breakElement)
    return newTask
}

document.addEventListener('click', (e) => {
    if(e.target.className == "delete-button"){
        let tasks = JSON.parse(localStorage.getItem("Tasks.list"))
        let tasklist = {data : []}
        if (e.target.parentElement.classList.contains('task')) {
            let elementID = e.target.parentElement.getAttribute("id")
               
                tasks.data.forEach((task)=>{
                    if(task.mainDivID != elementID){
                        tasklist.data.push(task)
                    }
                })
                storeDataTaskToLocalStorage(tasklist)
                return e.target.parentElement.remove()
            }
            if (e.target.parentElement.classList.contains('todo')) {
                let elementID = e.target.parentElement.getAttribute("id")
                
                    let todolist = {data : []}
                  
                    let todo = JSON.parse(localStorage.getItem("Todos.list"))
                
                    todo.data.forEach((todo)=>{
                        if(todo.mainDivID != elementID){
                            todolist.data.push(todo)
                        }
                        else{
                            const dataID = localStorage.getItem(elementID)
                                tasks.data.forEach((task)=>{
                                    if(!dataID.includes(task.mainDivID)){
                                        tasklist.data.push(task)
                                    }
                                    
                                })
                            
                            localStorage.removeItem(elementID)
                        }
                    })
                    storeDataTaskToLocalStorage(tasklist)
                    addTodoToLocalStorage(todolist)
                    return e.target.parentElement.remove()
                }
    }
    
})
function addTodoToLocalStorage(todosContent) {
    localStorage.setItem("Todos.list", JSON.stringify(todosContent))
}
function addTaskIDToLocalStorage(inputTask, inputTaskID) {
    localStorage.setItem(inputTaskID, JSON.stringify(inputTask))
}
function storeDataTaskToLocalStorage(newTaskID){
    localStorage.setItem("Tasks.list", JSON.stringify(newTaskID))
}