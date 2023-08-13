import "bootstrap/dist/css/bootstrap.min.css";
import "./styles/style.css";
import taskFieldTemplate from "./templates/taskField.html";
import noAccessTemplate from "./templates/noAccess.html";
import {User} from "./models/User";
import {Admin} from "./models/Admin";
import {
    generateTestUser,
    recordTask,
    displayTask,
    deleteTaskLocalStorage,
    drop,
    disabled,
    getCookie,
    setCookie,
    deleteCookie,
    moveTask,
    getFromStorage,
    adminIn,
    cookieIn
} from "./utils";
import {State} from "./state";
import {authUser} from "./services/auth";

export const appState = new State();

const loginForm = document.querySelector("#app-login-form");
let loginTask
let fieldHTMLContent

const logout = document.querySelector("#app-logout-btn")
const loginUser = document.querySelector("#app-login-form")
const logoutId = document.querySelector("#logout")
generateTestUser(User, Admin);

if (getCookie('user')) {
    loginTask = getCookie('user')
    cookieIn(loginTask)

    fieldHTMLContent = taskFieldTemplate

    logoutId
        .classList
        .remove('none')
    loginUser
        .classList
        .add('none')
    loginUser
        .classList
        .remove('d-flex')
    logout.addEventListener('click', function (e) {
        logoutId
            .classList
            .add('none')
        loginUser
            .classList
            .remove('none')
        loginUser
            .classList
            .add('d-flex')

        document
            .querySelector("#content")
            .innerHTML = '<p>Please Sign In to see your tasks!</p>'
        deleteCookie('user')

    })
    document
        .querySelector("#content")
        .innerHTML = fieldHTMLContent;
    if (appState.currentUser.storageKey == 'admin') {
        adminIn()
    }
    content(loginTask);

}

loginForm.addEventListener("submit", function (e) {
    e.preventDefault();
    const formData = new FormData(loginForm);
    const login = formData.get("login");
    const password = formData.get("password");

    if (authUser(login, password)) {
        setCookie('user', login)

        fieldHTMLContent = taskFieldTemplate

        loginTask = login
        logoutId
            .classList
            .remove('none')
        loginUser
            .classList
            .add('none')
        loginUser
            .classList
            .remove('d-flex')
        logout.addEventListener('click', function (e) {
            logoutId
                .classList
                .add('none')
            loginUser
                .classList
                .remove('none')
            loginUser
                .classList
                .add('d-flex')

            document
                .querySelector("#content")
                .innerHTML = '<p>Please Sign In to see your tasks!</p>'
            deleteCookie('user')

        })

    } else {
        alert("Доступ запрещен");
        fieldHTMLContent = noAccessTemplate
    }

    document
        .querySelector("#content")
        .innerHTML = fieldHTMLContent;

    if (appState.currentUser.storageKey == 'admin') {
        adminIn()
    }
    content(loginTask);

})

export function content(loginTask) {

    const addCardProgress = document.querySelector(".addCardProgress")
    const addCardFinished = document.querySelector(".addCardFinished")
    const addCard = document.querySelector(".addCard");
    const taskAdd = document.querySelector(".taskAdd");
    const dropdowns = document.querySelector("#myDropdown");
    const dropdownsFinished = document.querySelector("#myDropdownFinished");
    const countReady = document.querySelector(".countReady");
    const countFinished = document.querySelector(".countFinished");
    const userName = document.querySelectorAll(".userName");
    const currentData = document.querySelector(".current-data");
    const inputText = document.querySelector(".inputText");
    const userMenu = document.querySelector(`.user-menu`);
    const userMenudropdown = document.querySelector(`.user-menu__dropdown`)
    const arrowDown = document.querySelector(`.arrow-down`)
    const arrowUp = document.querySelector(`.arrow-up`)
    const moveTaskReady = document.querySelector(".tasks__content");
    const moveTaskProgress = document.querySelector(".tasks__contentProgress");
    const moveTaskFinished = document.querySelector(".tasks__contentFinished");
    const contextMenu = document.querySelector(".context");
    const contextMenuChange = document.querySelector(".contextMenu__change");
    const contextMenuRemove = document.querySelector(".contextMenu__remove");
    const contextMenuChangeInput = document.querySelector(".contextCorrectTask");
    const contextMenuChangeButton = document.querySelector(".textCorrect__button");
    const contextMenuTextCorrect = document.querySelector(".textCorrect");
    const removeUser = document.querySelector(".contextMenu__blockRemoveUser");
    for (let user of userName) {
        user.innerHTML = loginTask;
    }

    currentData.innerHTML = new Date().getFullYear()

    countReady.innerHTML = displayTask(loginTask, "taskReady", ".tasks__content")
    displayTask(loginTask, "tasksProgress", ".tasks__contentProgress")
    displayTask(loginTask, "taskReady", "#myDropdown")
    displayTask(loginTask, "tasksProgress", ".tasks__contentProgress")
    displayTask(loginTask, "tasksProgress", "#myDropdownFinished")
    countFinished.innerHTML = displayTask(
        loginTask,
        "tasksFinished",
        ".tasks__contentFinished"
    )
    disabled(loginTask, addCardProgress, "taskReady")
    disabled(loginTask, addCardFinished, "tasksProgress")

    addCard.addEventListener("click", function () {
        let dropdowns = document.getElementsByClassName("dropdown-content");
        let i;
        for (i = 0; i < dropdowns.length; i++) {
            let openDropdown = dropdowns[i];
            if (openDropdown.classList.contains('show')) {
                openDropdown
                    .classList
                    .remove('show');
            }
        }
        inputText
            .classList
            .add("d-block")
        taskAdd
            .classList
            .add("d-block")
        taskAdd.focus()

        addCard
            .classList
            .add("dropbtn")
        addCard.innerHTML = "Submit"

        window.onclick = () => {
            if (taskAdd.value == "" && !event.target.matches('.addCard')) {
                addCard.innerHTML = "+ Add Card"

                taskAdd
                    .classList
                    .remove("d-block")
                inputText
                    .classList
                    .remove("d-block")
                addCard
                    .classList
                    .remove("dropbtn")
            } else if (taskAdd.value != "") {

                let contentTask = taskAdd.value

                recordTask("taskReady", contentTask, loginTask)
                countReady.innerHTML = displayTask(loginTask, "taskReady", ".tasks__content")
                displayTask(loginTask, "taskReady", "#myDropdown")
                disabled(loginTask, addCardProgress, "taskReady")
            }
        }

    })

    drop('addCardProgress', 'myDropdown')

    dropdowns.addEventListener('click', (event) => {

        if (event.target && event.target.matches('.dropdownProgresslist')) {

            let idProgress = event
                .target
                .getAttribute("id")

            deleteTaskLocalStorage("taskReady", loginTask, idProgress, 'tasksProgress')
            disabled(loginTask, addCardProgress, "taskReady")
            disabled(loginTask, addCardFinished, "tasksProgress")

            addCardProgress.innerHTML = "+ Add Card"
            addCardProgress
                .classList
                .remove('dropbtn')

            countReady.innerHTML = displayTask(loginTask, "taskReady", ".tasks__content")
            displayTask(loginTask, "taskReady", "#myDropdown")
            displayTask(loginTask, "tasksProgress", ".tasks__contentProgress")

        }

        displayTask(loginTask, "tasksProgress", "#myDropdownFinished")

    })
    drop("addCardFinished", "myDropdownFinished")

    dropdownsFinished.addEventListener('click', (event) => {

        if (event.target && event.target.matches('.dropdownProgresslist')) {

            let idProgress = event
                .target
                .getAttribute("id")

            deleteTaskLocalStorage("tasksProgress", loginTask, idProgress, "tasksFinished")
            disabled(loginTask, addCardFinished, "tasksProgress")
            addCardFinished.innerHTML = "+ Add Card"
            addCardFinished
                .classList
                .remove('dropbtn')

            displayTask(loginTask, "taskReady", "#myDropdown")
            displayTask(loginTask, "tasksProgress", ".tasks__contentProgress")
            displayTask(loginTask, "tasksProgress", "#myDropdownFinished")
            countFinished.innerHTML = displayTask(
                loginTask,
                "tasksFinished",
                ".tasks__contentFinished"
            )
        }

    })

    userMenu.addEventListener('click', () => {

        arrowDown
            .classList
            .remove('none')
        arrowUp
            .classList
            .add('none')
        userMenudropdown
            .classList
            .remove('none')

        window.onclick = function (event) {
            if (!event.target.matches('.avatarImg')) {
                userMenudropdown
                    .classList
                    .add('none')
                arrowDown
                    .classList
                    .add('none')
                arrowUp
                    .classList
                    .remove('none')

            }

        }

    })
    moveTask(
        moveTaskReady,
        loginTask,
        ".tasks__progress",
        addCardProgress,
        addCardFinished
    )
    moveTask(
        moveTaskProgress,
        loginTask,
        ".tasks__finished",
        addCardProgress,
        addCardFinished
    )
    moveTask(
        moveTaskFinished,
        loginTask,
        ".tasks__progress",
        addCardProgress,
        addCardFinished
    )
    moveTask(
        moveTaskProgress,
        loginTask,
        ".tasks__ready",
        addCardProgress,
        addCardFinished
    )
    let idProgress

    document.addEventListener('contextmenu', function contextMenuCorrect(e) {
        e.preventDefault();

        if (event.target.matches(".dropdownProgresslist") && (event.target.parentNode !== dropdowns && event.target.parentNode !== dropdownsFinished)) {
            let taskChange = event
                .target
                contextMenu
                .classList
                .remove('none')
            contextMenu.style.position = "absolute"
            contextMenu.style.top = event.pageY + "px"
            contextMenu.style.left = event.pageX + "px"
            contextMenu.style.zIndex = 1000;
            e.preventDefault();

            idProgress = taskChange.getAttribute("id")

            contextMenuRemove.addEventListener('click', function menuRemove(e) {

                contextMenu
                    .classList
                    .add('none')
                let taskProgress = getFromStorage(loginTask);

                if (taskProgress.length != 0) {
                    for (let task of taskProgress) {

                        if (task.id === idProgress) {

                            taskProgress.splice(taskProgress.indexOf(task), 1)
                            localStorage.setItem(loginTask, JSON.stringify(taskProgress));

                        }

                    }

                }
                displayTask(loginTask, "taskReady", ".tasks__content")
                displayTask(loginTask, "tasksProgress", ".tasks__contentProgress")
                displayTask(loginTask, "taskReady", "#myDropdown")
                displayTask(loginTask, "tasksProgress", ".tasks__contentProgress")
                displayTask(loginTask, "tasksProgress", "#myDropdownFinished")
                displayTask(loginTask, "tasksFinished", ".tasks__contentFinished")
                disabled(loginTask, addCardProgress, "taskReady")
                disabled(loginTask, addCardFinished, "tasksProgress")

                document.removeEventListener('click', menuRemove)
            })

            contextMenuChange.addEventListener('click', (e) => {
                contextMenu
                    .classList
                    .add('none')

                contextMenuChangeInput
                    .classList
                    .remove('none')
                window.onclick = function (event) {

                    if (!event.target.matches('.contextMenu__change')) {
                        contextMenuChangeInput
                            .classList
                            .add("none")
                    }
                }

                contextMenuChangeInput.style.position = "absolute"
                contextMenuChangeInput.style.top = event.pageY + "px"
                contextMenuChangeInput.style.left = event.pageX + "px"
                contextMenuChangeInput.style.zIndex = 1000;

                contextMenuTextCorrect.focus()

                contextMenuTextCorrect.value = taskChange.innerHTML

                contextMenuChangeButton.onclick = () => {

                    contextMenuChangeInput
                        .classList
                        .add("none")
                    let taskProgress = getFromStorage(loginTask);

                    if (taskProgress.length != 0) {
                        for (let task of taskProgress) {

                            if (task.id === idProgress) {
                                task.contentTask = document
                                    .querySelector(".textCorrect")
                                    .value

                                    localStorage
                                    .setItem(loginTask, JSON.stringify(taskProgress));

                            }

                        }

                    }
                    displayTask(loginTask, "taskReady", ".tasks__content")
                    displayTask(loginTask, "tasksProgress", ".tasks__contentProgress")
                    displayTask(loginTask, "taskReady", "#myDropdown")
                    displayTask(loginTask, "tasksProgress", ".tasks__contentProgress")
                    displayTask(loginTask, "tasksProgress", "#myDropdownFinished")
                    displayTask(loginTask, "tasksFinished", ".tasks__contentFinished")
                    disabled(loginTask, addCardProgress, "taskReady")
                    disabled(loginTask, addCardFinished, "tasksProgress")
                }

            })

            ///////////////

            if (appState.currentUser.storageKey == 'admin') {
                removeUser
                    .classList
                    .remove('none')

                removeUser.addEventListener('click', (e) => {
                    let listUsers = getFromStorage("users");
                    loginTask = document
                        .querySelector('.btnUsers')
                        .innerHTML

                    if (loginTask != 'Admin') {
                        localStorage.removeItem(`${loginTask}`)
                    }

                    if (listUsers != 0) {
                        for (let listUser of listUsers) {

                            if (listUser.login === loginTask) {

                                listUsers.splice(listUsers.indexOf(listUser), 1)
                                localStorage.setItem("users", JSON.stringify(listUsers));

                            }

                        }

                    }
                    loginTask = document
                        .querySelector('.userStorage__button')
                        .innerHTML

                    for (let user of userName) {
                        user.innerHTML = loginTask;
                    }

                    countReady.innerHTML = displayTask(loginTask, "taskReady", ".tasks__content")
                    displayTask(loginTask, "tasksProgress", ".tasks__contentProgress")
                    displayTask(loginTask, "taskReady", "#myDropdown")
                    displayTask(loginTask, "tasksProgress", ".tasks__contentProgress")
                    displayTask(loginTask, "tasksProgress", "#myDropdownFinished")
                    countFinished.innerHTML = displayTask(
                        loginTask,
                        "tasksFinished",
                        ".tasks__contentFinished"
                    )
                    disabled(loginTask, addCardProgress, "taskReady")
                    disabled(loginTask, addCardFinished, "tasksProgress")
                    adminIn()

                })

            }

            /////////////////////////

            window.onclick = function (event) {

                contextMenu
                    .classList
                    .add('none')

            }

        }

    })

}
