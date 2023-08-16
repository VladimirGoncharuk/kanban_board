import {Task} from "./models/Task";
import {appState, content} from "./app";
import {User} from "./models/User";
import {Admin} from "./models/Admin";

export const getFromStorage = function (key) {
    return JSON.parse(localStorage.getItem(key) || "[]");
};

export const addToStorage = function (obj, key) {
    const storageData = getFromStorage(key);
    storageData.push(obj);
    localStorage.setItem(key, JSON.stringify(storageData));
};

export const generateTestUser = function (User, Admin) {
    localStorage.clear();
    const testUser = new User("test", "qwerty123");
    const testUser1 = new User("test1", "qwerty123");
    const testUser2 = new User("test2", "qwerty123");
    const testUser3 = new Admin("Admin", "qwerty123");
    User.save(testUser);
    User.save(testUser1);
    User.save(testUser2);
    Admin.save(testUser3);
};

export const recordTask = function (nameTask, contentTask, loginTask) {
    const taskAdd = document.querySelector(".taskAdd");
    const addCard = document.querySelector(".addCard");
    const inputText = document.querySelector(".inputText");

    const task = new Task(nameTask, contentTask);
    Task.save(task, loginTask);
    addCard.innerHTML = "+ Add Card"
    taskAdd.value = ""
    taskAdd
        .classList
        .remove("d-block")
    inputText
        .classList
        .remove("d-block")
    addCard
        .classList
        .remove("dropbtn")

}
export const displayTask = function (loginTask, nameTask, tasksContent) {

    let tasks = getFromStorage(loginTask);
    const result = document.querySelector(tasksContent);
    let onetask = ""
    let i = 0
    for (let task of tasks) {

        if (task.nameTask == nameTask) {
            const taskList = `<li class="dropdownProgresslist" id=${task.id}> ${task.contentTask} </li>`
            onetask = onetask + taskList
            i = i + 1

        }

    }
    result.innerHTML = onetask
    return i;

}

export const deleteTaskLocalStorage = function (
    nameTasks,
    loginTask,
    idProgress,
    nameTaskAfter
) {
    let taskProgress = getFromStorage(loginTask);
    let nameTask = nameTasks
    if (taskProgress.length != 0) {
        for (let task of taskProgress) {

            if ((task.nameTask == nameTask) && task.id === idProgress) {
                task.nameTask = nameTaskAfter
                let task2;
                task2 = task
                taskProgress.splice(taskProgress.indexOf(task), 1)
                taskProgress.push(task2)
                localStorage.setItem(loginTask, JSON.stringify(taskProgress));

            }

        }

    }

}
export const drop = function (nameClassButton, nameIdDropdown) {
    const addCardProgress = document.querySelector(`.${nameClassButton}`);

    addCardProgress.addEventListener("click", function () {
        const addCard = document.querySelector(".addCard")
        const inputText = document.querySelector(".inputText");
        const taskAdd = document.querySelector(".taskAdd");
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
        addCardProgress
            .classList
            .add("indexIn")

        addCardProgress
            .classList
            .add("dropbtn")

        addCardProgress.innerHTML = "Submit"
        const nameDropdown = document.querySelector(`#${nameIdDropdown}`)

        nameDropdown
            .classList
            .add("show");
        const show = document.querySelector('.show');
        if (!show.querySelector('.bird')) {
            const bird = document.createElement('div')
            bird
                .classList
                .add("bird")
            bird.innerHTML = '<img src="../src/image/vector.svg" alt="vector">'
            show.prepend(bird);
        }

        window.onclick = function (event) {

            if (!event.target.matches('.indexIn')) {
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
            }
        }
    })
}
export const disabled = function (loginTask, nameButton, nameTask) {
    let tasks = getFromStorage(loginTask)
    function check() {

        for (let task of tasks) {

            if (task.nameTask == nameTask) 
                return true;

            }
        return false
    }
    if (!check()) {
        nameButton.setAttribute('disabled', true)
    } else if (nameButton.hasAttribute('disabled')) {
        nameButton.removeAttribute('disabled')
    }

}

export function getCookie(name) {
    let matches = document
        .cookie
        .match(new RegExp(
            "(?:^|; )" + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') +
            "=([^;]*)"
        ));
    return matches
        ? decodeURIComponent(matches[1])
        : undefined;
}
export function setCookie(name, value, options = {}) {

    options = {
        path: '/'
    };

    if (options.expires instanceof Date) {
        options.expires = options
            .expires
            .toUTCString();
    }

    let updatedCookie = encodeURIComponent(name) + "=" +
            encodeURIComponent(value);

    for (let optionKey in options) {
        updatedCookie += "; " + optionKey;
        let optionValue = options[optionKey];
        if (optionValue !== true) {
            updatedCookie += "=" + optionValue;
        }
    }

    document.cookie = updatedCookie;
}
export function deleteCookie(name) {
    setCookie(name, "", {'max-age': -1})
}

export function moveTask(
    moveTaskReady,
    loginTask,
    taskTargets,
    addCardProgress,
    addCardFinished
) {
    let mousemove
    let moveAthas
    moveTaskReady.addEventListener('mousedown', (e) => {
        mousemove = false
        moveAthas = false
        const taskTarget = taskTargets
        if (event.target && event.target.matches(".dropdownProgresslist")) {

            let idProgress = event
                .target
                .getAttribute("id")

            const square = event.target;

            square.ondragstart = () => false;

            const getCoords = (elem) => {
                const box = elem.getBoundingClientRect();
                return {
                    top: box.top + pageYOffset,
                    left: box.left + pageXOffset
                };
            }
            const coords = getCoords(square);

            const shiftX = event.pageX - coords.left;

            const shiftY = event.pageY - coords.top;

            const moveAt = (e) => {

                square.style.left = e.pageX - shiftX + 'px';
                square.style.top = e.pageY - shiftY + 'px';
                moveAthas = true

            }

            square.style.position = 'absolute';

            square.style.zIndex = 1000;

            document.addEventListener('mousemove', moveAt);
            document.addEventListener('mouseup', function aftermouseup() {
                document.removeEventListener('mousemove', moveAt);
                document.removeEventListener('mouseup', aftermouseup);
                displayTask(loginTask, "taskReady", ".tasks__content")
                displayTask(loginTask, "tasksProgress", ".tasks__contentProgress")

                displayTask(loginTask, "tasksFinished", ".tasks__contentFinished")

                let dispersX = (square.style.left).substring(0, (square.style.left).length - 2) - coords.left
                let dispersY = (square.style.top).substring(0, (square.style.top).length - 2) - coords.top

                if (moveAthas && Math.abs(dispersX) > 200 || moveAthas && Math.abs(dispersY) > 60) {
                    mousemove = true
                }

                if (mousemove) {
                    document
                        .querySelector(`${taskTarget}`)
                        .addEventListener('mouseover', function changeTask(e) {

                            let taskName
                            let taskNameAim

                            if (event.currentTarget.matches(`${taskTarget}`)) {

                                if (moveTaskReady === document.querySelector(".tasks__content")) {
                                    taskName = "taskReady"
                                } else if (moveTaskReady === document.querySelector(".tasks__contentProgress")) {
                                    taskName = "tasksProgress"
                                } else if (moveTaskReady === document.querySelector(".tasks__contentFinished")) {
                                    taskName = "tasksFinished"
                                }

                                if (taskTarget === ".tasks__progress") {
                                    taskNameAim = 'tasksProgress'
                                } else if (taskTarget === ".tasks__finished") {
                                    taskNameAim = 'tasksFinished'
                                } else if (taskTarget === ".tasks__ready") {
                                    taskNameAim = 'taskReady'
                                }
                                deleteTaskLocalStorage(taskName, loginTask, idProgress, taskNameAim)
                                document
                                    .querySelector(".countFinished")
                                    .innerHTML = displayTask(loginTask, "tasksFinished", ".tasks__contentFinished")
                                document
                                    .querySelector(".countReady")
                                    .innerHTML = displayTask(loginTask, "taskReady", ".tasks__content") +
                                            displayTask(loginTask, "tasksProgress", ".tasks__contentProgress")

                                displayTask(loginTask, "taskReady", "#myDropdown")
                                displayTask(loginTask, "tasksProgress", ".tasks__contentProgress")
                                displayTask(loginTask, "tasksProgress", "#myDropdownFinished")
                                disabled(loginTask, addCardProgress, "taskReady")
                                disabled(loginTask, addCardFinished, "tasksProgress")

                                document
                                    .querySelector(`${taskTarget}`)
                                    .removeEventListener('mouseover', changeTask);

                            }

                        });
                }
                mousemove = false
            })

        }
    })
}

export function adminIn() {

    let usersStorage = getFromStorage("users")

    const resultUser = document.querySelector('.usersContent');
    let oneUsers = ""
    for (let userStorage of usersStorage) {
        const userList = `<button class="userStorage__button id='${ (userStorage.login)}'" >${ (
            userStorage.login
        )}</button>`
        oneUsers = oneUsers + userList
    }
    resultUser.innerHTML = oneUsers

    const adminButtun = document.createElement('button')
    adminButtun
        .classList
        .add('userStorage__button')
    adminButtun.innerHTML = "Admin"
    resultUser.prepend(adminButtun)

    const addRemUsers = document.createElement('button')
    addRemUsers
        .classList
        .add('adminUsersButton')
    addRemUsers.innerHTML = "Add &  Remove Users"
    resultUser.prepend(addRemUsers)

    document.addEventListener('click', function buttonUser(e) {

        if (event.target && event.target.matches('.userStorage__button')) {

            let buttuns = document.querySelectorAll('.userStorage__button')
            if (buttuns) {
                for (let buttun of buttuns) {
                    buttun
                        .classList
                        .remove('btnUsers')
                }

            }

            event
                .target
                .classList
                .toggle('btnUsers')

            content(event.target.innerHTML);

        }

    })
    
    addRemUsers.addEventListener('click', (e) => {
        document
            .querySelector('.tasks')
            .style
            .filter = 'brightness(10%)'

        const adminUsers = document.querySelector('.adminUsersadd')

        adminUsers
            .classList
            .remove('none')
        adminUsers.style.position = 'absolute'
        adminUsers.style.top = (document.body.clientHeight) / 2 + "px"
        adminUsers.style.left = (document.body.clientWidth) / 2 - 140 + "px"
        const listUsers = document.querySelector('.listUsers');
        render()
        function render() {
            usersStorage = getFromStorage("users")
            let oneUsers = ""
            for (let userStorage of usersStorage) {
                const userList = `<li class="userStorage__button id='${ (userStorage.login)}'" >${ (
                    userStorage.login
                )}</li>`
                oneUsers = oneUsers + userList
            }
            listUsers.innerHTML = oneUsers
        }

        const removeUser = document.querySelector(".removeUserButton");
        const addUser = document.querySelector(".addUserButton");
        removeUser.addEventListener('click', (e) => {
            let listUsers = getFromStorage("users");

            let loginTask = document.querySelector('.btnUsers')
                ? document
                    .querySelector('.btnUsers')
                    .innerHTML
                : alert("Для удаления выберите пользователя!")

            console.log(document.querySelector('.btnUsers'))

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

            render()
            displayTask(loginTask, "tasksProgress", ".tasks__contentProgress")
            displayTask(loginTask, "taskReady", "#myDropdown")
            displayTask(loginTask, "tasksProgress", ".tasks__contentProgress")
            displayTask(loginTask, "tasksProgress", "#myDropdownFinished")

            adminIn()

        })

        addUser.addEventListener('click', (e) => {
            let loginInput = document.querySelector(".addUserLogin")
            let passwordInput = document.querySelector(".addUserPassword")
            let buttonInput = document.querySelector(".addUser__button")

            loginInput
                .classList
                .remove('none')
            passwordInput
                .classList
                .remove('none')
            buttonInput
                .classList
                .remove('none')
            buttonInput.addEventListener('click', (e) => {
                if (loginInput.value && passwordInput.value) {

                    const addUser = new User(loginInput.value, passwordInput.value);
                    function hasLogin() {
                        let users = getFromStorage('users');
                        if (users.length == 0) 
                            return false;
                        for (let user of users) {
                            if (user.login == loginInput.value) 
                                return true;
                            }
                        return false;
                    }
                    if (!hasLogin()) {
                        User.save(addUser);
                        loginInput.value = null
                        passwordInput.value = null
                        render()
                        adminIn()
                    } else {
                        alert(`Пользователь с именем ${loginInput.value} уже существует`)
                    }

                }

            })

        })


window.onclick = function (event) {
 if(!event.target.matches('.adminUsersButton') && !event.target.parentNode.classList.contains("ls") ){
    
adminUsers.classList.add('none')
document
            .querySelector('.tasks')
            .style
            .filter = 'none'
 }  
    

}




    })

}

export function cookieIn(loginTask) {
    if (loginTask != "Admin") {
        const user = new User(loginTask, "qwerty123");
        appState.currentUser = user
    } else {
        const admin = new Admin(loginTask, "qwerty123")
        appState.currentUser = admin;
    }
}

