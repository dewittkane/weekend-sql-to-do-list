$(document).ready(function(){
    getTodoList();
    //populates dom on page load

    $('#submitBtn').on('click', postToList)
    //click listeners!

});

function getTodoList(){
    console.log('Getting Todo List from DB!');

    $.ajax({
        method: 'get',
        url: '/list'
    }).then(function(response) {
        console.log(response);
        renderList(response);
      }).catch(function(error){
        console.log('error in GET', error);
      });

};//sends ajax to DB to collect values

function postToList(){
    console.log('Task to add:', $('#taskIn').val());
    

    getTodoList();
    //runs get function to redisplay DOM with new information

};//sends ajax to DB to add item to list

function renderList(taskList){
    for (let i = 0; i < taskList.length; i++) {
        $('#taskList').append(`
        <li><input type="checkbox" class="completed">${taskList.task}</li>
        `);
        
    }
}