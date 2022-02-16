const subbtn = document.querySelector('#submit');
const form = document.querySelector('#form');
const itemText = document.querySelector('#newitem');
const div = document.querySelector('#div');

//CREATED EMPTY LIST, TO THEN ADD EACH TODO ITEM TO IT//
let List = [];

//SETTING UP A COUNT THAT WILL CORRESPOND TO THE LIST ITEM ID # AND ITEM POSITION IN THE LIST//
let todoIndex = 0;


form.addEventListener('submit', function(e){
   e.preventDefault();
   addNewTodo(itemText.value)
   itemText.value = ''
})

//UPDATED THIS FUNCTION SO THAT WHEN A NEW TODO LIST ITEM IS CREATED, IT IS ASSIGNED A UNIQUE ID IN HTML//
//THE ITEM INFO IS THEN ADDED TO THE LIST AS AN OBJECT. THE ITEM ID ASSIGNED CORRESPONDS ITS INDEX//
//NUMBER INSIDE THE LIST SO THAT I CAN UPDATE THE OBJECT VALUES LATER USING THE <LI> ID AS THE LIST INDEX//
//THIS FUNCTION ALSO SAVES A CURRENT VERSION OF THE LIST TO THE LOCAL STORAGE//
function addNewTodo(n){
   const newTodo = document.createElement('li');
   newTodo.innerHTML =
   `${n}
   <input id = "check" type="button" value = &#10004;>
   <input id = "trash" type="button" value = &#10008;>`
   //SETTING THE LIST ITEM ID # TO EQUAL THE TODOINDEX CURRENT COUNT #//
   newTodo.setAttribute('id', todoIndex)
   //ADDING THE TODO ITEM ATTRIBUTES (TEXT AND CHECK VALUE) AS AN OBJECT TO MY LIST//
   List.push({
       text: n,
       check: false
   })
   //SAVING THE LIST OF OBJECTS TO THE LOCAL STORAGE//
   localStorage.setItem('savedTodos', JSON.stringify(List));
   //UPDATING THE RUNNING COUNT BY 1//
   todoIndex += 1

   div.appendChild(newTodo)
}

//THIS FUNCTION IS TO UPDATE THE <LI> ID NUMBERS IF USER REMOVED A TODO ITEM//
//IT TAKES IN ONE PARAMETER WHICH IS THE <LI> ID OF THE TODO BEING REMOVED//
//THE FUNCTION SELECTS ALL LIST ITEMS THAT COME AFTER THE ONE BEING REMOVED//
//AND UPDATES THE <LI> ID # BY SUBTRACTING 1 FROM ITS CURRENT VALUE//
function updateIndex (x){

   let litems = document.querySelectorAll("li");
   for (let i = x+1; i < litems.length; i++){
       litems[i].setAttribute('id', i-1)
   }
}

//UPDATED BELOW SO THAT IF CHECK BUTTON IS CLICKED, THE VALUE IS UPDATED IN THE LIST OBJECT//
//IF A TODO ITEM IS REMOVED, <LI> ID NUMBERS ARE UPDATED AND ITEM IS REMOVED FROM LIST//
//LOCAL STORAGE IS THEN OVERWRITTEN WITH THE CURRENT LIST, TO REFLECT THE CHANGES//
div.addEventListener('click', function(e){
   if (e.target.id === 'check'){
       e.target.parentElement.classList.toggle('completedTodo');
       let i = e.target.parentElement.id;
       //THIS ESSENTIALLY TOGGLES THE TRUE/FALSE CHECK VALUE//
       List[i].check = !List[i].check
   }
   if (e.target.id === 'trash'){
       //HAD TO CONVERT TO INT TYPE BECAUSE THE OUTPUT WAS A STRING ORIGINALLY//
       let y = parseInt(e.target.parentElement.id)
       //CALL FUNCTION TO UPDATE <LI> ID NUMBERS//
       updateIndex(y)
       //REMOVE ITEM FROM THE LIST BY USING THE SPLICE FUNCTION AND <LI> ID # AS THE INDEX VALUE//
       List.splice(y, 1)
       //REMOVE THE ITEM FROM THE HTML CODE//
       e.target.parentElement.remove()
       //SUBTRACT ONE FROM THE CURRENT TODO ITEM COUNT, SO THAT IF A NEW ITEM IS ADDED RIGHT AFTER ONE IS DELETED, IT WILL HAVE CORRECT INDEX VALUE//
       todoIndex -= 1
   }
   //SAVE UPDATED LIST TO LOCAL STORAGE//
   localStorage.setItem('savedTodos', JSON.stringify(List));

})

//FUNCTION TO RELOAD TODO ITEMS FROM LOCAL STORAGE IF PAGE IS REFRESHED//
//IT TAKES TWO PARAMETERS: THE TEXT OF THE ITEM, AND THE CHECK BUTTON VALUE (TRUE OR FALSE)//
function loadTodo(n, b){

   const newTodo = document.createElement('li');
   newTodo.innerHTML =
   `${n}
   <input id = "check" type="button" value = &#10004;>
   <input id = "trash" type="button" value = &#10008;>`
   newTodo.setAttribute('id', todoIndex)
   List.push({
       text: n,
       check: b
   })
   localStorage.setItem('savedTodos', JSON.stringify(List));
   todoIndex += 1
  
   ///ADDING COMPLETEDTODO CSS STYLE IF CHECK VALUE IS TRUE//
   if (b === true){
       newTodo.classList.add('completedTodo')
   }

   div.appendChild(newTodo)
}


//IF PAGE IS REFRESHED THIS WILL CHECK IF THERE IS DATA SAVED IN LOCAL STORAGE//
//IF THERE IS A LIST SAVED, IT WILL LOAD ALL THE ITEMS FROM THE LIST AS NEW TODO ITEMS//
if (localStorage.getItem('savedTodos')){
   console.log('SAVED TODOS LOADED');
   //HAVE TO CALL JSON.PARSE IN ORDER TO LOAD THE LIST AS AN OBJECT ARRAY AND NOT A STRING//
   let todoArray = JSON.parse(localStorage.getItem('savedTodos'));

   for (let i of todoArray){
       loadTodo(i.text, i.check);
   }
} else {
   console.log('NO SAVED TODOS IN LOCAL STORAGE');
}
