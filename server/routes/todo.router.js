const { Router } = require("express");
const express = require("express");
const toDoRouter = express.Router();

// DB CONNECTION
const pool = require("../modules/pool.js");
// ⬇ GET/POST/PUT/DELETE Routes below:
pool.connect;

// GET⬇

toDoRouter.get("/", (req, res) => {
  console.log("work!");
  let queryText = 'SELECT * FROM "ToDo" ORDER BY "id";';
  pool
    .query(queryText)
    .then((result) => {
      // Sends back the results in an object
      res.send(result.rows);
    })
    .catch((error) => {
      console.log("error getting ToDo List", error);
      res.sendStatus(500);
    });
});

// POST⬇

toDoRouter.post("/", (req, res) => {
  console.log(req.body);
  if (!req.body.task){
    res.status(400).send('task is required!!')
  }
    
  // We want to allow the default non-null value for importance_rank.
  // If importance_rank is not on the body, we don't want to insert with null.
  // The database will only use the default if importance_rank is not defined in our query.
  const hasImportance = req.body.hasOwnProperty('importanceRank');
  const queryText = `INSERT INTO "ToDo" 
    ("task", "complete", "date_completed", "notes"${hasImportance ? ', "importance_rank"' : ''}) 
    VALUES 
    ($1, $2, $3, $4${hasImportance ? ', $5' : ''})`;

  let complete = false;
  let dateCompleted = null;
  if (req.body.complete && req.body.complete !== 'false') {
    complete = true;
    dateCompleted = new Date();
  }

  const values = [
    req.body.task,
    complete, 
    dateCompleted,
    req.body.notes,
  ];

  if (hasImportance) {
    values.push(req.body.importanceRank);
  }

  pool
    .query(queryText, values)
    .then((result) => {
      res.sendStatus(201);
    })
    .catch((err) => {
      console.log(err);

      res.sendStatus(500);
    });
});
// edit task input , complete yes no date completed is timestamp ' 'notes edit notes' adjust important rank, delete row , 
// PUT⬇

toDoRouter.put('/:id', (req, res) => {
  console.log(req.body);

  // ⬇ Get the id of the ToDo we want to update
  const id = req.params.id;

  // ⬇ Prepare our values and value strings arrays
  const values = [];
  const valueStrings = [];
  
  // ⬇ Check whether the user has passed 'complete' on the request body
  const hasComplete = req.body.hasOwnProperty('complete');
  if (hasComplete) {
    // ⬇ If the value was false, clear date completed
    let complete = false;
    let dateCompleted = null;
    if (req.body.complete && req.body.complete !== 'false') {
      // ⬇ If the value was true, set dateCompleted
      complete = true;
      dateCompleted = new Date();
    }

    // ⬇ Add our complete value to the values array
    values.push(complete);
    // ⬇ Add our value string (SET) to the valueStrings array
    // The current length of values after each push will always reflect the appropriate prepared index ($1, $2, $3... etc.)
    valueStrings.push(`complete = $${values.length}`);
    values.push(dateCompleted);
    // ⬇ Add our value string (SET) to the valueStrings array
    valueStrings.push(`date_completed = $${values.length}`);
  }

  const hasNotes = req.body.hasOwnProperty('notes');
  if (hasNotes) {
    // ⬇ Add our complete value to the values array
    values.push(req.body.notes);
    // ⬇ Add our value string (SET) to the valueStrings array
    // If the first case was not met, the length will be 1. If it was met, it will be 3!
    valueStrings.push(`notes = $${values.length}`);
  }

  const hasImportance = req.body.hasOwnProperty('importanceRank');
  if (hasImportance) {
    // ⬇ Add our complete value to the values array
    values.push(req.body.importanceRank);
    // ⬇ Add our value string (SET) to the valueStrings array
    valueStrings.push(`importance_rank = $${values.length}`);
  }

  if (values.length === 0) {
    res.status(400).send('Requires at least one updatable property');
  }

  // Finally, our last value for our prepared statement is the id added here
  values.push(id);
  const queryText = `UPDATE "ToDo" 
    SET ${valueStrings.join(', ')}
    WHERE id = $${values.length}`;

  pool
    .query(queryText, values)
    .then((result) => {
      res.sendStatus(201);
    })
    .catch((err) => {
      console.log('ya done goofed', err);
      res.sendStatus(500);
    });
});

// DELETE⬇
toDoRouter.delete('/:id', (req, res) => {
    const itemToDelete = req.params.id;
    const queryText = `DELETE FROM "ToDo" WHERE "ToDo".id = $1`;
    pool.query(queryText, [itemToDelete])
    .then((response) => {
        console.log(`we deleted the todo with id ${itemToDelete}`);
        res.send(200);
    }).catch((err) => {
        console.log('something went wrong in toDoRouter.delete', err);
        res.sendStatus(500)
    });
});//end toDo/Router.delete

module.exports = toDoRouter;

// ("task","created", "complete", "date_completed", "notes", "importance_rank") 
    // VALUES 
    // ($1, $2, $3, $4, $5 ,$6);`;