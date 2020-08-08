$(document).ready(function(){
    getTodoList();
    //populates dom on page load

    $('#submitBtn').on('click', postToList);
    $('#taskList').on('click', '.deleteBtn', deleteFromList);
    //click listeners!

});


function getTodoList(){
    console.log('Getting Todo List from DB!');

    $.ajax({
        method: 'GET',
        url: '/list'
    }).then(function(response) {
        console.log(response);
        renderList(response);
        //runs function to display list on DOM

      }).catch(function(error){
        console.log('error in GET', error);
        alert('Issue getting task list. Please contact a system administrator.');
      });

};//sends ajax to DB to collect values

function postToList(){
    let taskToAdd = {
        task:$('#taskIn').val()
    };
    console.log('Task to add:', taskToAdd);
    //extracts value from the input and sets it value as an object

    $.ajax({
        type: 'POST',
        url: '/list',
        data: taskToAdd,
        }).then(function(response) {
            console.log('Response from server.', response);

            getTodoList();
            //runs GET request to redisplay DOM with new information

            clearInput();
            //clears input to add a new task

        }).catch(function(error) {
          console.log('Error in POST', error)
          alert('Issue adding item to task list. Please contact a system administrator.');
        });

};//sends ajax to DB to add item to list

function deleteFromList(){
    idToBeDeleted = $(this).parent().data('task-id');
    console.log('ID of task to be deleted:', idToBeDeleted);
    //grabs id from data attribute of clicked element

    $.ajax({
        method: 'DELETE',
        url: `/list/${idToBeDeleted}`
    }).then(function(response) {
        console.log('back to client from delete request. Response:', response);
        getTodoList();
        //runs GET request to redisplay DOM with new information

      }).catch(function(error) {
        console.log('error coming back to client from delete.  Error:', error)
      });
    
};//sends ajax to DB to delete the item clicked on

function renderList(taskList){
    $('#taskList').empty();
    //clears DOM before appending information

    for (let i = 0; i < taskList.length; i++) {
        $('#taskList').append(`
        <li data-task-id="${taskList[i].id}">
        <input type="checkbox" class="completed">
        ${taskList[i].task}
        <img src="./images/edit-icon.svg" class="editBtn" alt="edit icon"/>
        <img src="./images/trash-icon.svg" class="deleteBtn" alt="delete icon"/>
        </li>
        `);
    }
};//loops through tasklist from DB and appends each item to the dom

function clearInput(){
    $('#taskIn').val('');
}//clears task input