let transferedData = null
let transfered = false
let transferElement = null
let afterElement = null
let tasksElement = null
let transferedIndex = null


const deleteFromArray = (arr, ele) =>{
    let id = arr.indexOf(ele)
    arr.splice(id, 1)
}


const addTaskInBoard = (data, taskNode, board, boardDiv, index, save)=>{
    const dltNode = ()=>{
        taskNode.remove()
        // board.tasks = board.tasks.filter((item)=> item!==data)
        deleteFromArray(board.tasks, data)
        boardDiv.querySelector('.task-count').innerText = board.tasks.length
        if(board.tasks.length===0){
            boardDiv.querySelector('.tasks .no-task').removeAttribute('hidden')
        }
        saveToLocalStorage()
    }
    
    taskNode.querySelector('.task-delete').addEventListener('click', dltNode)
    taskNode.addEventListener('dragstart',(event)=>{
        transferedData = data
        // console.log(transferedData)
        transfered=false
        transferElement = taskNode
        tasksElement = taskNode.parentElement
        afterElement = taskNode.nextElementSibling
        taskNode.classList.add('dragging')
    })
    taskNode.addEventListener('dragend',()=>{
        taskNode.classList.remove('dragging')
        afterElement = null
        tasksElement = null
        if(transfered){
            dltNode()
        }
        // console.log("Dragend")
    })
    if(index!==null){
        if(save)
            board.tasks.splice(index, 0, data)
        boardDiv.querySelector('.tasks').insertBefore(taskNode, boardDiv.querySelectorAll('.task')[index])
    }else{
        if(save)
            board.tasks.push(data)
        boardDiv.querySelector('.tasks').appendChild(taskNode)
    }
    saveToLocalStorage()
    boardDiv.querySelector('.tasks .no-task').setAttribute('hidden', true)
    boardDiv.querySelector('.task-count').innerText = board.tasks.length
}





const createTask = (data, board, boardDiv, index, save)=>{
    const dateClass = (new Date(data.date) - new Date(new Date().toDateString()))>0 ? '': 'late'
    const task = document.createElement('div')
    task.classList.add('task')
    task.setAttribute('draggable', true)
    task.innerHTML =  `
    <button class="task-delete"></button>
    <input type="text" class="heading-edit-input changable-input" value="${data.heading}"/>
    <input type="date" value=${data.date} class="date-edit-input changable-input ${dateClass}">
    <textarea class="description-edit-input changable-input" placeholder="Add Description">${data.description}</textarea>
    `
    task.querySelector('.heading-edit-input').addEventListener('input', (event)=>{
        data.heading = event.target.value
        saveToLocalStorage()
    })
    const dateInput = task.querySelector('.date-edit-input')
    dateInput.addEventListener('input', (event)=>{
        data.date = event.target.value
        if((new Date(data.date) - new Date(new Date().toDateString()))<0){
            dateInput.classList.add('late')
        }else{
            dateInput.classList.remove('late')
        }
        saveToLocalStorage()
    })
    addTaskInBoard(data, task, board, boardDiv, index, save)
}




const getDragAfterElement = (continer, y) =>{
    const childs = [...continer.querySelectorAll('.task:not(.dragging)')]
    // console.log(childs)
    return childs.reduce((closest, child, index)=>{
        const box = child.getBoundingClientRect()
        const diff = box.top + box.height/2 - y
        if(diff>0 && diff<closest.diff){
            return {diff, element: child,index}
        }else{
            return closest
        }
    },{diff:Number.POSITIVE_INFINITY, index: null})
}




const boardsContainer = document.querySelector('.boards')
const renderBoard = (board) =>{
    const boardDiv = document.createElement('div')
    boardDiv.classList.add('board')
    boardDiv.innerHTML= `
        <div class="board-heading">
            <input type="text" class="board-title-input changable-input" value="${board.name}"/>
            <span class="task-count">${board.tasks.length}</span>
            <input type="color" name="boardBGColor" class="board-bg-color" value="${board.color}">
        </div>
        <div class="tasks">
            <h3 class="no-task">~No Task Added~</h3>
        </div>
        <button class="add-task-btn">+ Add Task</button>
        <button class="board-delete"></button>
    `
    boardDiv.style.backgroundColor = 'white'
    boardsContainer.appendChild(boardDiv)
    boardDiv.querySelector('.board-title-input').addEventListener('focusout',(event)=>{
        if(event.target.value!=="")
            board.name = event.target.value
        else{
            alert("Can't set Empty Title")
            event.target.value = board.name
        }
        saveToLocalStorage()
    })
    boardDiv.querySelector('.board-bg-color').addEventListener('input',(event)=>{
        board.color = event.target.value
        boardDiv.style.backgroundColor = board.color
        saveToLocalStorage()
    })
    boardDiv.style.backgroundColor = board.color
    boardDiv.querySelector('.add-task-btn').addEventListener('click',()=>{    
        addTaskContainer.style.display = ""
        new Promise((resolve, reject)=>{
            cancelBtn.addEventListener('click', ()=>{
                reject("cancel Btn Pressed")
            })
            addTaskContainer.addEventListener('click',(event)=>{
                if(!addTaskForm.contains(event.target)){
                    reject("click on document")
                }
            })
            submitBtn.addEventListener('click', ()=>{
                if(taskHeading.value==="")
                    return alert("Heading Can't be Empty")
                if(date.value==="")
                    return alert("Date should be picked")
                resolve({heading: taskHeading.value, date: date.value, description: description.value})
            })
        }).then(data =>{
            createTask(data, board, boardDiv, null, true)
        })
        .catch((reason)=>{
            // console.log(reason)
        })
        .finally(()=>{
            removeEventListener('click', cancelBtn)
            removeEventListener('click', addTaskContainer)
            removeEventListener('click', submitBtn)
            taskHeading.value = ""
            date.value = ""
            description.value =""
            addTaskContainer.style.display = "none"
        })
    })
    boardDiv.querySelector('.board-delete').addEventListener('click', ()=>{
        if(confirm(`Are you sure to delete board "${board.name}"`)){
            boardDiv.remove()
            // boards = boards.filter(item => item!=board)
            deleteFromArray(boards, board)
            if(boards.length === 0){
                boardsContainer.querySelector('.no-task').removeAttribute('hidden')
            }
        }
        saveToLocalStorage()
    })
    const tasks = boardDiv.querySelector('.tasks')
    tasks.addEventListener('dragover',(event)=>{
        event.preventDefault()
        const dragging = transferElement
        const {element:afterElement, index} = getDragAfterElement(tasks, event.clientY)
        transferedIndex = index
        if(!afterElement)
            tasks.appendChild(dragging)
        else
            tasks.insertBefore(dragging, afterElement)
    })
    tasks.addEventListener('drop',(event)=>{
        event.preventDefault();
        const dragging = transferElement
        if(!afterElement)
            tasksElement.appendChild(dragging)
        else
            tasksElement.insertBefore(dragging, afterElement)
        // console.log(transferedData, boardDiv)
        transfered=true
        // console.log(transferedData, transferedIndex)
        setTimeout(()=>{
            // console.log("drop")
            createTask(transferedData, board, boardDiv, transferedIndex, true)
        }, 1)
    })
    boardsContainer.querySelector('.no-task').setAttribute('hidden', true)
    return boardDiv
}





for(let board of boards){
    const boardDiv = renderBoard(board)
    // console.log(board)
    for(let data of board.tasks){
        // console.log(data, board, boardDiv)
        createTask(data, board, boardDiv)
        // break;
    }
}


const addBoardBtn = document.querySelector('#add-board-btn')
addBoardBtn.addEventListener('click',()=>{
    boards.push({name: 'Untitled', color : '#ffffff', tasks: []})
    renderBoard(boards[boards.length-1])
})


