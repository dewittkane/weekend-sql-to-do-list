$(document).ready( function() {
    getTodoList();
    //populates dom on page load

    $( '#submitBtn' ).on( 'click', postToList );
    $( '#taskList' ).on( 'click', '.deleteBtn', deleteFromList );
    $( '#taskList' ).on( 'click', '.editBtn', editTask );
    $( '#taskList' ).on( 'change', '.completed', toggleComplete );
    $( '#taskList' ).on( 'click', '.confirmEdit', putEdit );
    $( '#taskList' ).on( 'click', '.cancelEdit', getTodoList );
    //click listeners!
});

function editTask() {
    let rowElement = $( this ).parent().parent()
    let originalText = rowElement.children( '.task' ).text();
    //saves original text and a row reference

    rowElement.children( '.notBox' ).remove();
    rowElement.append( `
    <td><input class="editIn" type="text"/></td>
    <td><button class="confirmEdit">Confirm</button></td>
    <td><button class="cancelEdit">Cancel</button></td>` )
    rowElement.find( '.editIn' ).val( originalText );
    //appends new interface to the TR allowing edit
};

function putEdit() {

    let id = $( this ).parent().parent().data( 'task-id' );
    let newText = {
        text: $( this ).parent().parent().find( `.editIn` ).val()
        };
    console.log( `ID of ${id} text to be replaced with ${newText.text}` );
    //collects updated info from DOM
    
    if (newText == '') {
        swal('Please enter some text for the task. Want to get it off of the list? Try the delete button!')
    } else {
        $.ajax({
            method: 'PUT',
            url: `/edittask/${id}`,
            data: newText
        }).then(function( response ) {
            console.log( 'Successfully back to client from edit request' );
            getTodoList();
            //runs GET request to redisplay DOM with new information
    
          }).catch(function( error ) {
            console.log( 'Error coming back to client from edit request' )
          });
    };//if text field isn't blank, sends updated info to DB
};



function getTodoList(){
    console.log( 'Getting Todo List from DB!' );

    $.ajax({
        method: 'GET',
        url: '/list'
    }).then(function( response ) {
        console.log( response );
        renderList( response );
        //runs function to display list on DOM

      }).catch(function( error ) {
        console.log( 'error in GET', error );
        alert( 'Issue getting task list. Please contact a system administrator.' );
      });

};//sends ajax to DB to collect values

function postToList() {
    let taskToAdd = {
        task: $( '#taskIn' ).val()
    };
    console.log( 'Task to add:', taskToAdd );
    //extracts value from the input and sets it value as an object

    if ( taskToAdd.task === '' ) {
        swal( 'Putting empty tasks on your to do list seems like cheating... Try putting some TASK in your task!' )
    } else {
    $.ajax({
        type: 'POST',
        url: '/list',
        data: taskToAdd,
        }).then(function( response ) {
            console.log( 'Response from server.', response );

            getTodoList();
            //runs GET request to redisplay DOM with new information

            clearInput();
            //clears input to add a new task

        }).catch(function( error ) {
          console.log( 'Error in POST', error )
          alert( 'Issue adding item to task list. Please contact a system administrator.' );
        });
    };
};//sends ajax to DB to add item to list

function deleteFromList() {
    let idToBeDeleted = $( this ).parent().parent().data( 'task-id' );
    console.log( 'ID of task to be deleted:', idToBeDeleted );
    //grabs id from data attribute of clicked element

    let status = $( this ).parent().parent().data( 'completed' );
    let text;

    if ( status ) {
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
      .then(( willDelete ) => {
        if ( willDelete ) {

            $.ajax({
                method: 'DELETE',
                url: `/list/${idToBeDeleted}`
            }).then(function( response ) {
                console.log( 'Successfully back to client from delete request' );

                getTodoList();
                //runs GET request to redisplay DOM with new information
        
              }).catch(function( error ) {
                console.log( 'Error coming back to client from delete request' );
              });

        };
      });
    
};//sends ajax to DB to delete the item clicked on

function renderList( taskList ) {
    $( '#taskList' ).empty();
    //clears DOM before appending information
    
    displayMotivation( taskList );
    //dynamic motivation!

    for ( let i = 0; i < taskList.length; i++ ) {
        $( '#taskList' ).append( `<tr id="${taskList[i].id}" data-task-id="${taskList[i].id}" data-completed="${taskList[i].completed}">
        <td class="box"></td>
        <td class="task notBox">${taskList[i].task}</td>
        <td class="notBox"><img src="./images/edit-icon.svg" class="editBtn" alt="edit icon"/></td>
        <td class="notBox"><img src="./images/trash-icon.svg" class="deleteBtn" alt="delete icon"/></td>
        </tr>` );
        //this whole section creates one line of html to be appended for each item in the loops

        if ( taskList[i].completed ) {
            $('<input>', {
                type:"checkbox",
                "checked":"checked",
                class:"completed"
        }).appendTo( $( `#${taskList[i].id}` ).children( ".box" ) )
        //applies a checked box

        $( '#taskList' ).find( `#${taskList[i].id}` ).children( '.task' ).addClass( 'strikethrough' )
        //gives task strikethrough class

        } else {
            $( '<input>', {
                type:"checkbox",
                class:"completed"
        }).appendTo( $( `#${taskList[i].id}` ).children( ".box" ))};
        // //displays checkbox as checked on page load if task is already completed
        // //this line feels messy but I couldn't think of a better way to do it.
        // //jquery seems to be particular about spawning checkboxes already checked.

    }
};//loops through tasklist from DB and appends each item to the dom

function toggleComplete() {
    let idToBeToggled = $( this ).parent().parent().data( 'task-id' );
    let status = false;
    if ( $( this ).prop( 'checked' ) ) {
        status = true;
    };

    $( this ).parent().parent().children( '.task' ).toggleClass( 'strikethrough' )
    //toggles visual element by adding class

    console.log( `in toggleComplete: item with id ${idToBeToggled} is completed: ${status}.` );
    //checks to see what task was clicked on and if the task is completed or not

    $.ajax({
        method: 'PUT',
        url: `/list/${ idToBeToggled }`,
        data: {newStatus: status}
    }).then( function( response ) {
        console.log( 'Successfully back to client from put request.');

        getTodoList();
        //runs GET request to redisplay DOM with new information
        //EDIT 1: I want to leave the checkbox visible while editing text and that brought up issues with reloading while typing another edit
        //I decided to remove the page refresh since the data will be visually correct, and it will be sent to the DB when clicked (realized this page refresh, if working properly, wouldnt show anything different)
        //this way it will continue to toggle completion, even mid text edit
        //EDIT 2: I was wrong, it leaves the checkboxes value the same, so you aren't able to toggle again until DOM reloads.  Will try assigning true value to whether box is checked out not?
        //EDIT 3: I'm in too deep.
        //EDIT 4, final?: Found a solution that just leaves the same button instead of trying to make a new one.  Way cleaner.
        //EDIT 5: I want the quote to refresh when task is completed, going to sacrifice a refresh mid edit at this point.


    }).catch( function ( error ) {
        alert( 'Error coming back to client from put request.' );
    });
};//updates whether task is completed or not

function clearInput() {
    $( '#taskIn' ).val('');
};//clears task input

function displayMotivation( taskList ) {
    let area = $( '#motivationalArea' )
    area.empty()
    console.log(taskList.length);
    let completeTasks = [];
    let incompleteTasks = [];
    for ( const task of taskList ) {
        if ( task.completed ) {
            completeTasks.push( task )
        } else {
            incompleteTasks.push( task )
        };
    };
    //clears area and sorts all tasks into completed or not


    let randomIncompleteTaskNumber = Math.ceil( Math.random() * incompleteTasks.length )
    let randomIncompleteTask;
    let randomCompleteTaskNumber = Math.ceil( Math.random() * completeTasks.length )
    let randomCompleteTask;
    if ( completeTasks.length ) {
        randomCompleteTask = completeTasks[randomCompleteTaskNumber - 1].task
    };
    if ( incompleteTasks.length ) {
        randomIncompleteTask = incompleteTasks[randomIncompleteTaskNumber - 1].task
    };
    //chooses a random complete task and incomplete task, if there is one

    let quotes = [
        `Wondering where to start? I bet you could knock out "${randomIncompleteTask}" easy!`,
        `"${randomIncompleteTask}" looks tough, I'd do that last... Try starting with something smaller?`,
        `Hmm... I bet "${randomIncompleteTask}" could wait till tomorrow.. or the day after.. No! It's best to get it done sooner.`,
        `Not much left on your list! Maybe do "${randomIncompleteTask}" real quick, then take a break?`,
        `This list might seem overwhelming - Dane always suggests taking a break.  Try that, then tackle "${randomIncompleteTask}"!`,
        `You showed "${randomCompleteTask}" who is boss! What are you gonna do next? You can do anything!`,
        `No need to worry about "${randomCompleteTask}" anymore! Great Job!`,
        `Knocking out tasks like nobody's business.  Remember when you were worried about doing "${randomCompleteTask}"? Done now!`,
        `If you can handle "${randomCompleteTask}", I bet "${randomIncompleteTask}" will be no problem at all!`
        ];
    
    let randomQuoteNum = Math.ceil( Math.random() * quotes.length );
    //chooses a random quote and fills it in with user tasks

    if ( incompleteTasks.length === 0 ) {
        let finishedQuote ="Looks like you've got nothing else to do! Crack open a cold one, put your feet up, and rest. You deserve it!";
        area.text( finishedQuote );
    } else if ( completeTasks.length === 0 ) {
        let finishedQuote =`Looks like you haven't finished anything on your list yet, try starting with "${randomIncompleteTask}".`;
        area.text( finishedQuote );
    } else {
        area.text( `${quotes[randomQuoteNum - 1]}` )
    };
    //appends quote depending on what the current list looks like
};