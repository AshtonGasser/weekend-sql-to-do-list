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
    //console.log( 'in addButton on click' );
    // input validation -- could make required field background to red via jquery toggle class
    // if ($('#taskIn').val() == '' || $('#createdIn').val() == '' || 
    // $('#importanceIn').val() == '' ) {
    //   swal("Please fill in all required information");
      //return; 

function setupClickListeners(){
console.log('shhh! we are listening for clicks.');
$("#viewToDo").on('click', '.deleteBtn', deleteTodoHandler) 
$(".dropdown-toggle" ).dropdown ()  
$( '#addButton' ).on( 'click', saveTodoList)

   
$("#completeIn").on('change', function() {
  if ($(this).is(':checked')) {
        $(this).attr('value', 'true');
  } else {
    $(this).attr('value', 'false');
  }
});

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
    $('#viewToDo').empty();
    console.log(todo);
    console.log(todo.length);
    for(let i = 0; i < todo.length; i++) {
        let notes = todo[i].notes ? todo[i].notes : "";
        // ⬇ checking true or false value for complete, then dynamically setting checkbox for complete.
        let completed;
        if (todo[i].complete === true) {
             completed = `<td class="bg-success"><input type="checkbox" id="completed${todo[i].id}" value="${todo[i].complete}" checked></input></td>`
        } else {
             completed = `<td><input type="checkbox" id="completed${todo[i].id}" value="${todo[i].complete}"></input></td>`
        }
        let todoHTML = `
        <tr>
          <td>${todo[i].task}</td>
          <td>${todo[i].created}</td>
          ${completed}
          <td>${todo[i].dateCompleted}</td>
          <td><input type="text" id="todoNotes${todo[i].id}" value="${notes}"></td>
          <td>${todo[i].importance_rank}</td>
          <td><button class="deleteBtn btn btn-danger" data-id="${todo[i].id}">Delete</button></td>
        </tr>`
        //for each Todo list, append a nw row to table
        $('#viewToDo').append(todoHTML)
    }
}




function saveTodoList(){
    // ajax call to server to get todo
    let completed = $('#completeIn').val() ? $('#completeIn').val() : false;
    let newTodo = {
        task: $('#taskIn').val(),
        created: $('#createdIn').val(),
        complete: completed,
       dateCompleted: $('#dateCompletedIn').val(),
        notes: $('#notesIn').val(),
        importance_rank: $('#importanceIn').val()

  }; 
  console.log( ' saveTodoList', newTodo );   
    $.ajax({
      type: 'POST',
      url: '/todo',
      data: newTodo,
  }).then( function (response) {
    $('#taskIn').val('');
    $('#createdIn').val('');
    $('#completeIn').val('');
    $('#notesIn').val('');
    $('#dateCompleted').val('');
    $('#importanceIn').val('');
    getToDoList();
  
  });
}
  
  function deleteTodoHandler(){
    deleteTodo($(this).data("id")) 
    console.log('Begon!',$(this).data("id"))
  }

  function deleteTodo(todoId){
      console.log(todoId);
      $.ajax({
          method: 'DELETE',
          url: `/todo/${todoId}`
      }).then(response =>{
          console.log(`deleted todo with id of ${todoId}`);
          getToDoList();
          getToDoList()
          swal("no more todo list");
         }).catch(err => {
        alert('there was a problem deleting that todo, try again', err);
         })
        }