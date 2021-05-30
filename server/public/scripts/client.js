console.log( 'js')

$( document ).ready( function(){
    console.log( 'JQ' );
    // Establish Click Listeners
  
setupClickListeners()
    // load existing todos on page load

   getToDoList();

    // Ready to Transfer click listener

    //$('#viewToDo').on('click', '.transfer', handleTransferClick)
  }); // end doc ready


function setupClickListeners(){
console.log('shhh! we are listening for clicks.');
$("#viewToDo").on('click', '.deleteBtn', deleteTodoHandler) 
$(".dropdown-toggle" ).dropdown ()  
$( '#addButton' ).on( 'click'),
    console.log( 'in addButton on click' );
    // input validation -- could make required field background to red via jquery toggle class
    // if ($('#taskIn').val() == '' || $('#createdIn').val() == '' || 
    // $('#importanceIn').val() == '' ) {
    //   alert("Please fill in all required information");
    //   return;
    
    let TodoListToSend = {
        task: $('taskIn').val(),
        created: $('#createdIn').val(),
        complete: $('#completeIn').val(),
       dateCompleted: $('#dateCompletedIn').val(),
        notes: $('#notesIn').val(),
        importance_rank: $('#importanceIn').val()
  };    
      // call savetodolist with the new object
      saveTodoList(TodoListToSend);


}

function getToDoList(){
    console.log( 'in get todo list');
//⬇ ajax call to server to get todo
$.ajax({
    method: 'GET',
    url: '/todo'
}).then(function (response) {
  console.log(response);
  renderTodo(response);
}).catch(function(error) {
  console.log('error in GET on client.js', error);
});  
} // end getTodo

function renderTodo(todo){
    $('#viewTodo').empty();

    for(let i = 0; i < todo.length; i++) {
        let todo = todo[i];
        console.log('in render todo', todo);

        //for each Todo list, append a nw row to table
        $('#viewTodo').append(`
    <tr>
      <td>${todo.task}</td>
      <td>${todo.created}</td>
      <td>${todo.complete}</td>
      <td>${todo.dateCompleted}</td>
      <td>${todo.notes}</td>
      <td>${todo.importance_rank}</td>
      <td><button class="deleteBtn btn btn-danger" data-id="${todo.id}">Delete</button></td>
    </tr>
        
        `)

}

}




function saveTodoList(newTodo){
    console.log( ' saveTodoList', newTodo );
    // ajax call to server to get koalas
   
    $.ajax({
      type: 'POST',
      url: '/todo',
      data: newTodo,
  }).then( function (response) {
    $('#taskIn').val('');
    $('#createdIn').val('');
    $('#completedIn').val('');
    $('#notesIn').val('');
    $('#dateCompleted').val('');
    $('#importanceIn').val('');
    getToDoList();
  
  });
}
  
  function deleteTodoHandler(){
      console.log('Begon!')
  }