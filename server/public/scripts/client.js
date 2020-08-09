$(document).ready(function(){
    getTodoList();
    //populates dom on page load

    $('#submitBtn').on('click', postToList);
    $('#taskList').on('click', '.deleteBtn', deleteFromList);
    $('#taskList').on('click', '.editBtn', editTask);
    $('#taskList').on('change', '.completed', toggleComplete);
    $('#taskList').on('click', '.confirmEdit', putEdit);
    $('#taskList').on('click', '.cancelEdit', getTodoList);
    //cancel changes simply reloads the original info from the DB, using the same get function
    //click listeners!
});

function editTask(){
    let rowElement = $(this).parent().parent()
    let originalText = rowElement.children('.task').text();
    //saves original text and a row reference

    rowElement.children('td').remove();
    rowElement.append(`
    <td colspan="3"><input id=${rowElement.data('task-id')} type="text"/><button class="confirmEdit">Confirm</button><button class="cancelEdit">Cancel</button><td>`)
    $(`#${rowElement.data('task-id')}`).val(originalText);
    //appends new interface to the TR allowing edit
};

function putEdit(){

    let id = $(this).parent().parent().data('task-id')
    let newText = {
        text: $(this).parent().children(`#${id}`).val()
        };
    console.log(`ID of ${id} text to be replaced with ${newText.text}`);
    
    if (newText == '') {
        swal('Please enter some text for the task. Want to get it off of the list? Try the delete button!')
    } else {
        $.ajax({
            method: 'PUT',
            url: `/edittask/${id}`,
            data: newText
        }).then(function(response) {
            console.log('Successfully back to client from edit request');
            getTodoList();
            //runs GET request to redisplay DOM with new information
    
          }).catch(function(error) {
            console.log('Error coming back to client from edit request')
          });
    };
}



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
        let $htmlToAppend = $(`<tr data-task-id="${taskList[i].id}" data-completed="${taskList[i].completed}">`)

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
        
        $htmlToAppend.append(`<td class="task">${taskList[i].task}</td>
        <td><img src="./images/edit-icon.svg" class="editBtn" alt="edit icon"/></td>
        <td><img src="./images/trash-icon.svg" class="deleteBtn" alt="delete icon"/></td>
        </tr>`);
        //this whole section creates one line of html to be appended for each item in the loops

        $('#taskList').append($htmlToAppend);

    }
};//loops through tasklist from DB and appends each item to the dom

function toggleComplete(){
    let idToBeToggled = $( this ).parent().data( 'task-id' );
    let status = false;
    if ($(this).prop('checked')){
        status = true;
    };

    console.log( `in toggleComplete: item with id ${idToBeToggled} is completed: ${status}.`);
    //checks to see what task was clicked on and if the task is completed or not

    $.ajax({
        method: 'PUT',
        url: `/list/${ idToBeToggled }`,
        data: { newStatus: status}
    }).then( function( response ){
        console.log( 'Successfully back to client from put request.');
        //getTodoList();
        //runs GET request to redisplay DOM with new information
        //EDIT 1: I want to leave the checkbox visible while editing text and that brought up issues with reloading while typing another edit
        //I decided to remove the page refresh since the data will be visually correct, and it will be sent to the DB when clicked (realized this page refresh, if working properly, wouldnt show anything different)
        //this way it will continue to toggle completion, even mid text edit
        //EDIT 2: I was wrong, it leaves the checkboxes value the same, so you aren't able to toggle again until DOM reloads.  Will try assigning true value to whether box is checked out not?
        //EDIT 3: I'm in too deep.
        //EDIT 4, final?: Found a solution that just leaves the same button instead of trying to make a new one.  Way cleaner.

    }).catch( function (error){
        alert( 'Error coming back to client from put request.');
    });
};//updates whether task is completed or not

function clearInput(){
    $('#taskIn').val('');
};//clears task input