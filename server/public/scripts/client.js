$(document).ready(function(){
    getTodoList();
    //populates dom on page load

    $('#submitBtn').on('click', postToList)
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


        }).catch(function(error) {
          console.log('Error in POST', error)
          alert('Issue adding item to task list. Please contact a system administrator.');
        });

};//sends ajax to DB to add item to list

function renderList(taskList){
    $('#taskList').empty();
    //clears DOM before appending information

    for (let i = 0; i < taskList.length; i++) {
        $('#taskList').append(`
        <li><input type="checkbox" class="completed">${taskList[i].task}</li>
        `);
    }
}//loops through tasklist from DB and appends each item to the dom