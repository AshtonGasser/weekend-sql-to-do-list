console.log( 'js')
let todos = [];

$( document ).ready( function(){
    console.log( 'JQ' );
    // Establish Click Listeners
  
setupClickListeners()
    // load existing todos on page load

   getToDoList();

    // Ready to Transfer click listener
})
    // $('#viewToDo').on('click')

    // console.log( 'in addButton on click' );
    // //input validation -- could make required field background to red via jquery toggle class
    // if ($('#taskIn').val() == '' ||   $('#importanceIn').val() == '' ) {
    // swal("Please fill in all required information");
    //   return; 

function setupClickListeners(){
  console.log('shhh! we are listening for clicks.');
  $("#viewToDo").on('click', '.saveBtn', updateToDoHandler)
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

function getToDoList() {
  console.log( 'in get todo list');
  //⬇ ajax call to server to get todo
  $.ajax({
      method: 'GET',
      url: '/todo'
  }).then(function (response) {
    console.log(response);
    todos = response;
    renderTodo(todos);
  }).catch(function(error) {
    console.log('error in GET on client.js', error);
  });  
} // end getTodoList

function getToDo(id) {
  console.log( 'in get todo');
  //⬇ ajax call to server to get todo
  $.ajax({
      method: 'GET',
      url: `/todo/${id}`
  }).then(function (response) {
    let index = todos.findIndex((todo) => todo.id === id);
    todos.splice(index, 1, response);
    renderTodo(todos);
    // renderSingleTodo
  }).catch(function(error) {
    console.log('error in GET on client.js', error);
  });  
} // end getTodo


function renderSingleTodo() {
  // find old todo in DOM using jquery
  // create new todo elment
  // replace old DOM element with new element
}

function renderTodo(todo){
    $('#viewToDo').empty();
    console.log(todo);


    console.log(todo.length);
    for(let i = 0; i < todo.length; i++) {
        let notes = todo[i].notes ? todo[i].notes : "";
        //⬇ FIX ME
        console.log(todo[i].importance_rank)
            let importanceClass = "";
            switch (todo[i].importance_rank) {
                case "unimportant": 
                    importanceClass = "bg-secondary text-white";
                        break;
                    case "minor":
                        importanceClass = "bg-info text-white";
                        break;
                    case "neutral":
                        importanceClass = "bg-success text-white"
                        break;
                    case "priority":
                        importanceClass = "bg-primary text-white"
                        break;
                    case "super priority":
                        importanceClass = "bg-warning text-dark"    
                        break;
                    case "threat level midnight":
                        importanceClass = "bg-danger text-dark blink_me "
                        break;
                default:
                    console.log("could not set importance")
            }
            console.log(importanceClass)
            console.log("hello")
        // ⬇ logic for calculation operators  below:
        // ⬇ checking true or false value for complete, then dynamically setting checkbox for complete.
        let completed;
        if (todo[i].complete === true) {
             completed = `<td class="bg-success"><input type="checkbox" id="completed${todo[i].id}" value="${todo[i].complete}" checked></input></td>`
        } else {
             completed = `<td><input type="checkbox" id="completed${todo[i].id}" value="${todo[i].complete}"></input></td>`
        }
        let created = moment(todo[i].created).format(('MMMM Do, YYYY'))
        let completedDate = "";
        if (todo[i].date_completed) {
          completedDate = moment(todo[i].date_completed).format(('MMMM Do, YYYY'));
        }
        let todoHTML = `
        <tr>
          <td>${todo[i].task}</td>
          <td>${created}</td>
          ${completed}
          <td>${completedDate}</td>
          <td><input type="text" id="todoNotes${todo[i].id}" value="${notes}"></td>
          <td class="${importanceClass}">${todo[i].importance_rank}</td>
          <td>
          <button class="saveBtn btn btn-info" data-id="${todo[i].id}">Save</button>
          <button class="deleteBtn btn btn-danger" data-id="${todo[i].id}">Delete</button>
          </td>
        </tr>`
            
        $(`#completed${todo[i].id}`).on('change', function() {
            if ($(this).is(':checked')) {
                  $(this).attr('value', 'true');
            } else {
              $(this).attr('value', 'false');
            }
          });
        //for each Todo list, append a nw row to table
        $('#viewToDo').append(todoHTML)
    }
}




function saveTodoList(){
  // ajax call to server to get todo
  console.log($('#completeIn').val());
  let completed = $('#completeIn').val() ? $('#completeIn').val() : false;
  console.log(completed);
  let newTodo = {
    task: $('#taskIn').val(),
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
    $('#completeIn').val('');
    $('#notesIn').val('');
    $('#dateCompletedIn').val('');
    $('#importanceIn').val('');
    getToDoList();
  
  });
}

function updateToDoHandler(){
    // send your completed value and your notes value
    let id = $(this).data("id");
    let notes = `todoNotes${id}`
    let complete = `completed${id}`
    console.log($(`#${complete}`).prop('checked'), $(`#${notes}`).val())
    updateTodo(id, $(`#${complete}`).prop('checked'), $(`#${notes}`).val()) 
}

function updateTodo(todoId, complete, notes){
    console.log(todoId, complete, notes)
    console.log('ready to update');
        $.ajax({
          method: "PUT",
          url: `/todo/${todoId}`,
          data: {
           complete: complete,
           notes: notes
          }
        })
        .then(response => {
          console.log(response)
          getToDo(todoId);
        })
        .catch(err => {
          console.log(err);
        });
}

  function deleteTodoHandler(){
    deleteTodo($(this).data("id")) 
    console.log('Begon!',$(this).data("id"))
  }
// DELETE function⬇
  function deleteTodo(todoId){
      console.log(todoId);
      $.ajax({
          method: 'DELETE',
          url: `/todo/${todoId}`
      }).then(response =>{
          console.log(`deleted todo with id of ${todoId}`);
          getToDoList();
          swal("no more todo list");
         }).catch(err => {
        alert('there was a problem deleting that todo, try again', err);
         })
        }