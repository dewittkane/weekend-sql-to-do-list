$(document).ready(function(){
    getTodoList();
    //populates dom on page load

    $('#submitBtn').on('click', postToList);
    $('#taskList').on('click', '.deleteBtn', deleteFromList);
    $('#taskList').on('change', '.completed', toggleComplete)
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
    let idToBeDeleted = $(this).parent().data('task-id');
    console.log('ID of task to be deleted:', idToBeDeleted);
    //grabs id from data attribute of clicked element

    let status = $(this).parent().data('completed');
    let text;

    if (status) {
        text = "Looks like you've wrapped this up, want to remove it from the list?"
    } else {
        text = "Are you sure you want to remove this from the list? You haven't checked it off yet!"
    };//creates different alert text based on status

    swal({
        title: "For real?",
        text: text,
        icon: "warning",
        buttons: true,
        dangerMode: true,
      })
      .then((willDelete) => {
        if (willDelete) {
          swal("Woosh! Consider that task DONE.", {
            icon: "success"});

            $.ajax({
                method: 'DELETE',
                url: `/list/${idToBeDeleted}`
            }).then(function(response) {
                console.log('Successfully back to client from delete request');
                getTodoList();
                //runs GET request to redisplay DOM with new information
        
              }).catch(function(error) {
                console.log('Error coming back to client from delete request')
              });

        } else {
          swal("Got it, keep working on it!");
        }
      });
    
};//sends ajax to DB to delete the item clicked on

function renderList(taskList){
    $('#taskList').empty();
    //clears DOM before appending information

    for (let i = 0; i < taskList.length; i++) {
        let $htmlToAppend = $(`<li data-task-id="${taskList[i].id}" data-completed="${taskList[i].completed}">`)

        if (taskList[i].completed) {
            $('<input>', {
                type:"checkbox",
                "checked":"checked",
                class:"completed"
        }).appendTo($htmlToAppend)} else {
            $('<input>', {
                type:"checkbox",
                class:"completed"
        }).appendTo($htmlToAppend)};
        //displays checkbox as checked on page load if task is already completed
        //this line feels messy but I couldn't think of a better way to do it.
        //jquery seems to be particular about spawning checkboxes already checked.
        
        $htmlToAppend.append(`${taskList[i].task}
        <img src="./images/edit-icon.svg" class="editBtn" alt="edit icon"/>
        <img src="./images/trash-icon.svg" class="deleteBtn" alt="delete icon"/>
        </li>`);
        //this whole section creates one line of html to be appended for each item in the loops

        $('#taskList').append($htmlToAppend);

    }
};//loops through tasklist from DB and appends each item to the dom

function toggleComplete(){
    let idToBeToggled = $( this ).parent().data( 'task-id' );
    let status = $( this ).parent().data( 'completed' );
    console.log( `in toggleComplete: item with id ${idToBeToggled} is completed: ${!status}.`);
    //checks to see what task was clicked on and if the task is completed or not

    $.ajax({
        method: 'PUT',
        url: `/list/${ idToBeToggled }`,
        data: { newStatus: !status}
    }).then( function( response ){
        console.log( 'Successfully back to client from put request.');
        getTodoList();
        //runs GET request to redisplay DOM with new information

    }).catch( function (error){
        alert( 'Error coming back to client from put request.');
    });
};//updates whether task is completed or not

function clearInput(){
    $('#taskIn').val('');
};//clears task input