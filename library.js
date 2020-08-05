function Book(title, author, pagesNb, isRead){    
    this.title = title;
    this.author = author;
    this.pagesNb = pagesNb;
    this.isRead = isRead;         
}
let store = [
    {title: "1984-a", author: "Orwell-a", pagesNb: 123, isRead: true},
    {title: "1984-b", author: "Orwell-b", pagesNb: 123, isRead: true}
];

function displayStore() {
    let tableBody = document.querySelector("tbody");
    tableBody.innerHTML = "";
    store.forEach((e, i) => {
        let newRow = document.createElement("tr");
        let status = e.isRead ? "Already read" : "Not read"
        let html = `<td>${e.title}</td>
                    <td>${e.author}</td>
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
}
function removeFromStore(book, index) {
    //this is used as a callback function in submit form,
    //where it receives both, book and index,
    //book is just not needed here
    store.splice(index, 1);
}
function updateInStore(book, index){
    store[index].isRead = book.isRead;
}
function showModal(modalID) {
    document.querySelector(`#${modalID}`).classList.add("js-visible");
    document.querySelector(".shadow").classList.add("js-visible");
}
function hideModal() {
    document.querySelectorAll(".modal").forEach(element =>element.classList.remove("js-visible"));
    document.querySelector(".shadow").classList.remove("js-visible");
}
function fillForm(formId, event) {
    let btn = event.target;
    let index = btn.getAttribute("data-index");             
    let form = document.querySelector(`#${formId}`);;
    form.title.value = store[index].title;
    form.author.value = store[index].author;
    form.pagesNb.value = store[index].pagesNb;
    if (formId === "status-form"){
        let status = store[index].isRead ? "read" : "not read";
        form.status.value = status;
    }    
    let submitBtn = form.querySelector("button[type='submit']");
    submitBtn.setAttribute("data-index", index);
}
function submitForm(event, doAction){
    event.preventDefault(); 
    let form = event.target;
    let submitBtn = form.querySelector("button[type='submit']");
    let index = submitBtn.getAttribute("data-index");
    let title = form.title.value;
    let author = form.author.value;
    let pagesNb = form.pagesNb.value;
    let isRead;
    if (form.status){
        isRead = form.status.value === 'read' ? true : false;
    }
    let book = new Book(title, author, pagesNb, isRead);    
    doAction(book, index);
    form.reset();
    submitBtn.removeAttribute("data-index");
    hideModal();
}
function addListenersToTable() {
     //Removing a book by showing modal with form first and than removing on submit
     //Respective listeners to form in modal are added below, if here they will be duplicated
     //each time the table reloads.
     document.querySelectorAll(".remove-btn").forEach((element) =>  {        
        element.addEventListener("click", (event) => {             
            fillForm("remove-form", event)
            showModal("remove-modal");            
        })
    });    
    //The same pattern for changing the status
    document.querySelectorAll(".status-btn").forEach((element) =>  {        
        element.addEventListener("click", (event) => {  
            fillForm("status-form", event);
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
    document.querySelector("#cancel-add-btn").addEventListener('click', function(){
        hideModal("add-modal");
    });
    document.querySelector("#add-form").addEventListener('submit', (event) => {       
        submitForm(event, addToStore);
        displayStore();
    });
    //here the remaining listeners for serving a change of status
    document.querySelector("#cancel-status-btn").addEventListener("click", () => {       
        let form = document.querySelector("#status-form");
        form.reset();
        let submitBtn = form.querySelector("button[type='submit']");
        submitBtn.removeAttribute("data-index");
        hideModal("status-modal");
    });    
    document.querySelector("#status-form").addEventListener("submit", (event) => {       
        submitForm(event, updateInStore)
        displayStore();        
    });
    //here the remaining listeners for serving a removal
    document.querySelector("#cancel-remove-btn").addEventListener("click", () => {       
        let form = document.querySelector("#remove-form");
        form.reset();
        let submitBtn = form.querySelector("button[type='submit']");
        submitBtn.removeAttribute("data-index");
        hideModal("remove-modal");
    });    
    document.querySelector("#remove-form").addEventListener("submit", (event) => {        
        submitForm(event, removeFromStore)
        displayStore();        
    });
    
    
});