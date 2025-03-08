let projectTitle=null
let bodyBgColor=null

const projectTitleInput = document.querySelector('#project-title-input')
const bodyBgColorInput = document.querySelector('#body-bg-color')
const addTaskContainer = document.querySelector('.add-task-container')
const addTaskForm = document.querySelector('.add-task-form')
const taskHeading = addTaskContainer.querySelector('#heading-input')
const date = addTaskContainer.querySelector('#date-input')
const description = addTaskContainer.querySelector('#description-input')
const submitBtn = addTaskContainer.querySelector('#submit')
const cancelBtn = addTaskContainer.querySelector('#cancel')

const changeProjectTitle = ()=>{
    if(!projectTitleInput.value)
        projectTitleInput.value = projectTitle
    projectTitle = projectTitleInput.value
    localStorage.setItem('ProjectTitle', projectTitle)
}
const changeBG = () =>{
    bodyBgColorInput.value = bodyBgColor
    document.body.style.backgroundColor = bodyBgColor
    localStorage.setItem('bodyBgColor', bodyBgColor)
}

projectTitleInput.addEventListener('focusout', changeProjectTitle)
bodyBgColorInput.addEventListener('input', ()=>{
    bodyBgColor = bodyBgColorInput.value
    changeBG()
})


let boards = [
    {
        name : "Todo",
        color : "#ffffff",
        tasks : [
            // {
            //     heading,
            //     date,
            //     description,
            // }
        ]
    },
    {
        name : "Doing",
        color : "#ffffff",
        tasks : [
            // {
            //     heading,
            //     date,
            //     description,
            // }
        ]
    },
    {
        name : "Done",
        color : "#ffffff",
        tasks : [
            // {
            //     heading,
            //     date,
            //     description,
            // }
        ]
    },
]


const saveToLocalStorage = () => {
    localStorage.setItem('boards', JSON.stringify(boards));
    // console.log("Saving boards to localStorage...");
};

const getFromLocalStorage = ()=>{
    // console.log("hello")
    projectTitle = localStorage.getItem('ProjectTitle') || 'Untitled'
    bodyBgColor = localStorage.getItem('bodyBgColor') || '#ffffff'
    // console.log(projectTitle, bodyBgColor)
    let boardsJSON = localStorage.getItem('boards')
    // console.log(boardsJSON)
    if(boardsJSON)
        boards = JSON.parse(boardsJSON)
    // console.log(boards)
    changeProjectTitle()
    changeBG()
}
getFromLocalStorage()
saveToLocalStorage()






function resetAtMidnight() {
    let now = new Date();
    let night = new Date(
        now.getFullYear(),
        now.getMonth(),
        now.getDate()+1, 
        0,0,0 // ...at 00:00:00 hours
    );
    let msToMidnight = night.getTime() - now.getTime();
    // console.log(msToMidnight)
    setTimeout(function() {
        location.reload();      //      <-- This is the function being called at midnight.
        resetAtMidnight();    //      Then, reset again next midnight.
    }, msToMidnight);
}
resetAtMidnight()