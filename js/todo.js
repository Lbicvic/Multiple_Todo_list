let htmlBody = document.querySelector('body')
let refreshFlag = 0
let titleTodoDiv = document.createElement('div')
titleTodoDiv.innerText= "Multiple Todos"
titleTodoDiv.className = "app-name"
let todoContent = document.createElement('div')
todoContent.className = "multiple-todos"
htmlBody.appendChild(todoContent)
todoContent.appendChild(titleTodoDiv)

let enterTodoDiv = document.createElement('div')
enterTodoDiv.className = "input-btn-todo"

let inputTodo = document.createElement('input')
inputTodo.type = "text"
inputTodo.placeholder = "Enter todo name here"
inputTodo.value = ""
inputTodo.className = "input-todo"
enterTodoDiv.appendChild(inputTodo)

let buttonAddTodos = document.createElement('button')
buttonAddTodos.innerText = "Add Todo"
buttonAddTodos.className = "add-todo"
buttonAddTodos.addEventListener('click', () => {
    refreshFlag=1
    let parID = Date.now().toString(36) + Math.random().toString(36)
    let nameTodo = inputTodo.value.toUpperCase()
    let textConID =  Date.now().toString()
    createNewTodo(parID, nameTodo,textConID)
})
enterTodoDiv.appendChild(buttonAddTodos)
todoContent.appendChild(enterTodoDiv)

if (getParsedDataFromLocalStorage("Todos.list") || getParsedDataFromLocalStorage("Tasks.list")) {
    let todos = getParsedDataFromLocalStorage("Todos.list")
    let tasks = getParsedDataFromLocalStorage("Tasks.list")
    todos.data.forEach((item) => {
        let dataTaskID = getParsedDataFromLocalStorage(item.mainDivID)
        createNewTodo(item.mainDivID,item.mainDivValue,item.sideDivID)
        if ("id" in dataTaskID) {
            dataTaskID.id.forEach((uniqueID)=>{
                tasks.data.forEach((task)=>{
                    if(uniqueID == task.mainDivID){
                        let taskContainer = document.getElementById(item.sideDivID)
                        let storedTask = createNewTask(task.mainDivValue,task.mainDivID,task.isFinished)
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
    if (!mainDiv.innerText) {
        return
    }
    let todoID = getParsedDataFromLocalStorage("Todos.list") || ""
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
    inputElement.placeholder = "Enter task here"
    inputElement.value = ""
    inputElement.className = "input-task"
    mainDiv.appendChild(inputElement)

    let buttonAddTask = document.createElement('button')
    buttonAddTask.innerText = "Add task"
    buttonAddTask.className = "add-task"
    buttonAddTask.addEventListener('click', () => {
        refreshFlag = 1
        let uniqueTaskId = Date.now().toString(36) + Math.random().toString(36)
        let task = createNewTask(inputElement.value,uniqueTaskId,false)
        sideDiv.appendChild(task)
        let todoIds = getParentID(sideDiv)
        let taskID = getParsedDataFromLocalStorage(todoIds) || ""
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
    buttonDeleteTodo.className = "delete-todo"
    mainDiv.appendChild(buttonDeleteTodo)
}

function createNewTask(inputTaskValue, uniqueTaskId, isFinished) {
    let newTask = document.createElement('div')
    newTask.id = uniqueTaskId;
    newTask.className = "task"
    let labelTask = document.createElement('label')
    labelTask.innerText = inputTaskValue
    labelTask.className = "task-label"
    if (!labelTask.innerText) {
        return
    }
    let newTaskID = getParsedDataFromLocalStorage("Tasks.list") || ""
    if (newTaskID.data) {
        newTaskID.data.push({ mainDivID: newTask.id, mainDivValue: labelTask.innerText, isTodo : false , isFinished : false})
    }
    else {
        newTaskID = { data: [{ mainDivID: newTask.id, mainDivValue: labelTask.innerText, isTodo : false ,isFinished : false}] }
    }
    if(refreshFlag){
        storeDataTaskToLocalStorage(newTaskID)
    }
    let checkBoxIsFinished = document.createElement('input')
    checkBoxIsFinished.type = "checkbox"
    checkBoxIsFinished.className = "checkbox-input"
    if(isFinished){
        newTask.classList.add("task-label-finished")
        checkBoxIsFinished.checked = true
    }
    checkBoxIsFinished.addEventListener('click', () => {
        newTask.classList.toggle("task-label-finished")
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

todoContent.addEventListener('click', (e) => {
    if(e.target.className == "checkbox-input"){  
        let tasks = getParsedDataFromLocalStorage("Tasks.list") 
        let elementID = getParentID(e.target)
        tasks.data.forEach((task)=>{
            if(task.mainDivID == elementID){
                task.isFinished = !task.isFinished
            }
        })
        storeDataTaskToLocalStorage(tasks)
     }
    if(e.target.className == "delete-button"){
        let tasks = getParsedDataFromLocalStorage("Tasks.list") 
        let tasklist = {data : []}
        let taskIds = {id : []}
        if (e.target.parentElement.classList.contains('task')) {
            let elementID = getParentID(e.target)
            let parentTodoID = e.target.parentElement.parentElement.parentElement.getAttribute("id")
            const dataID = getParsedDataFromLocalStorage(parentTodoID) 

            for(let i = 0; i< dataID.id.length; i++){

                if(dataID.id[i] != elementID){
                    taskIds.id.push(dataID.id[i])
                    
                }
            }
            addTaskIDToLocalStorage(taskIds,parentTodoID)
           
            tasks.data.forEach((task)=>{
                if(task.mainDivID != elementID){
                    tasklist.data.push(task)
                }
            })     
            storeDataTaskToLocalStorage(tasklist)
            return e.target.parentElement.remove()
            }
    }
    if(e.target.className == "delete-todo"){
        if (e.target.parentElement.classList.contains('todo')) {
            let elementID = getParentID(e.target)
            let todo = getParsedDataFromLocalStorage("Todos.list")
            let todolist = {data : []} 
            if(getParsedDataFromLocalStorage("Tasks.list")){
                let tasks = getParsedDataFromLocalStorage("Tasks.list") 
                let tasklist = {data : []}
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
            else{
                    todo.data.forEach((todo)=>{
                        if(todo.mainDivID != elementID){
                            todolist.data.push(todo)
                        }
                    })
                    addTodoToLocalStorage(todolist)
                    localStorage.removeItem(elementID)
                    return e.target.parentElement.remove()
            }
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
function getParsedDataFromLocalStorage(keyID){
    return JSON.parse(localStorage.getItem(keyID))
}
function getParentID(element){
    return element.parentElement.getAttribute("id")
}