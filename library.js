function Book(title, author, pagesNb, isRead){    
    this.title = title;
    this.author = author;
    this.pagesNb = pagesNb;
    this.isRead = isRead;         
}
let store = [
    {title: "1984", author: "George Orwell", pagesNb: 360, isRead: true},
    {title: "Adventures of Huckleberry Finn", author: "Mark Twain", pagesNb: 366, isRead: true}
];

function displayStore() {
    //localStorage.clear();
    if (storageAvailable) {
        loadFromLocalStore();
    }
    let tableBody = document.querySelector("tbody");
    tableBody.innerHTML = "";
    store.forEach((e, i) => {
        let newRow = document.createElement("tr");
        let status = e.isRead ? "Already read" : "Not read"
        let html = `<td class="title-cell">${e.title}</td>
                    <td class="author-cell">${e.author}</td>
                    <td>${e.pagesNb}</td>
                    <td><button class="status-btn" data-index=${i} type="button">${status}</button></td>
                    <td><button class="remove-btn" data-index=${i} type="button">Remove</button></td>`;
        newRow.innerHTML = html;
        tableBody.append(newRow);
    });
    addListenersToTable();
}
function addToStore(book) {
    store.push(book);
    if (storageAvailable){
        loadToLocalStore();
    }
}
function removeFromStore(book, index) {
    //this is used as a callback function in submit form,
    //where it receives both, book and index,
    //book is just not needed here
    store.splice(index, 1);
    if (storageAvailable) {
        loadToLocalStore();
    }
}
function updateInStore(book, index){
    store[index].isRead = book.isRead;
    if (storageAvailable) {
        loadToLocalStore();
    }
}
function loadFromLocalStore() {
    
    if(localStorage.getItem("books")){
        store = JSON.parse(localStorage.getItem("books"));
    }
}
function loadToLocalStore() {
    localStorage.setItem("books", JSON.stringify(store));
}
function storageAvailable(type) {
    var storage;
    try {
        storage = window[type];
        var x = '__storage_test__';
        storage.setItem(x, x);
        storage.removeItem(x);
        return true;
    }
    catch(e) {
        return e instanceof DOMException && (
            // everything except Firefox
            e.code === 22 ||
            // Firefox
            e.code === 1014 ||
            // test name field too, because code might not be present
            // everything except Firefox
            e.name === 'QuotaExceededError' ||
            // Firefox
            e.name === 'NS_ERROR_DOM_QUOTA_REACHED') &&
            // acknowledge QuotaExceededError only if there's something already stored
            (storage && storage.length !== 0);
    }
}
function showModal(purpose) {    
    let modal = document.querySelector(".modal");
    modal.classList.add("js-visible");
    let form = modal.querySelector("form");
    let action;
    let modalMessage;
    switch (purpose){
        case "add-modal":
            action = "addToStore";
            modalMessage = "Fill up the form and add the new book."
            break;
        case "remove-modal":
            action = "removeFromStore";
            modalMessage = "You are going to remove following book."
            break;
        case "status-modal":
            action = "updateInStore"
            modalMessage = "You will change actual status of the book."
            break;
    };
    let messageDiv = modal.querySelector(".modal-message");
    messageDiv.textContent = modalMessage;
    form.setAttribute("action", action);
    document.querySelector(".shadow").classList.add("js-visible");
}
function hideModal() {
    let modal = document.querySelector(".modal");
    let form = modal.querySelector("form");
    let submitBtn = form.querySelector("button[type='submit']");
    form.reset();
    submitBtn.removeAttribute("data-index");
    modal.classList.remove("js-visible");
    document.querySelector(".shadow").classList.remove("js-visible");
}
function fillForm(event) {
    let btn = event.target;
    let index = btn.getAttribute("data-index");             
    let form = document.querySelector("form");
    form.title.value = store[index].title;
    form.author.value = store[index].author;
    form.pagesNb.value = store[index].pagesNb;    
    let status = store[index].isRead ? "read" : "not read";
    form.status.value = status; 
    form.index.value = index; 
}
function submitForm(event){
    event.preventDefault(); 
    let form = event.target;
    let index = form.index.value;
    let title = form.title.value;
    let author = form.author.value;
    let pagesNb = form.pagesNb.value;
    let action = form.getAttribute("action");
    let doAction;
    switch (action){
        case "addToStore":
            doAction = addToStore;
            break;
        case "removeFromStore":
            doAction = removeFromStore;
            break;
        case "updateInStore":
            doAction = updateInStore;
            break;
    }
    console.log(action);
    console.log(doAction);
    let isRead;
    if (form.status){
        isRead = form.status.value === 'read' ? true : false;
    }
    let book = new Book(title, author, pagesNb, isRead);    
    doAction(book, index);
    form.reset();    
    hideModal();
}
function addListenersToTable() {
     //Removing a book by showing modal with form first and than removing on submit
     //Respective listeners to form in modal are added below, if here they will be duplicated
     //each time the table reloads.
     document.querySelectorAll(".remove-btn").forEach((element) =>  {        
        element.addEventListener("click", (event) => {             
            fillForm(event)
            showModal("remove-modal");            
        })
    });    
    //The same pattern for changing the status
    document.querySelectorAll(".status-btn").forEach((element) =>  {        
        element.addEventListener("click", (event) => {  
            fillForm(event);
            showModal("status-modal");            
        })
    });   
}
document.addEventListener("DOMContentLoaded", () => {
    displayStore();
    //Adding a book by showing modal with form first and than adding on submit
    document.querySelector("#add-btn").addEventListener('click', function(){
        showModal("add-modal");
    });
    document.querySelector("#cancel-btn").addEventListener('click', function(){
        hideModal();
    });
    document.querySelector("form").addEventListener('submit', (event) => {       
        submitForm(event);
        displayStore();
    });  
    
});