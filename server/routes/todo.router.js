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

// GET BY ID ⬇

toDoRouter.get("/:id", (req, res) => {
  let queryText = 'SELECT * FROM "ToDo" WHERE id = $1;';
  pool
    .query(queryText, [req.params.id])
    .then((result) => {
      // Sends back the results in an object
      if (result.rows) {
        res.send(result.rows[0]);
      } else {
        res.send(result.rows);
      }
    })
    .catch((error) => {
      console.log("error getting ToDo List id " + req.param.id, error);
      res.sendStatus(500);
    });
});

// POST⬇

toDoRouter.post("/", (req, res) => {
  console.log(req.body);
  if (!req.body.task) {
    res.status(400).send("task is required!!");
  }

  // We want to allow the default non-null value for importance_rank.
  // If importance_rank is not on the body, we don't want to insert with null.
  // The database will only use the default if importance_rank is not defined in our query.
  const hasImportance = req.body.hasOwnProperty("importance_rank");
  const queryText = `INSERT INTO "ToDo" 
    ("task", "complete", "date_completed", "notes"${
      hasImportance ? ', "importance_rank"' : ""
    }) 
    VALUES 
    ($1, $2, $3, $4${hasImportance ? ", $5" : ""})`;

  let complete = false;
  let dateCompleted = null;
  if (req.body.complete && req.body.complete !== "false") {
    complete = true;
    dateCompleted = req.body.dateCompleted ? req.body.dateCompleted : new Date();
  }

  const values = [req.body.task, complete, dateCompleted, req.body.notes];

  if (hasImportance) {
    values.push(req.body.importance_rank);
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

/**
 * Update each of our value arrays needed for the PUT request
 *
 * @param prop the property to check for and update in each array
 * @param body the request body
 * @param values the array of values to update
 * @param valueStrings the array of SQL strings to update
 */
function updateValues(prop, body, values, valueStrings) {
  // ⬇ Confirm property exists
  const hasProp = body.hasOwnProperty(prop);
  if (hasProp) {
    // ⬇ Add our value to the values array
    values.push(body[prop]);
    // ⬇ Add our value string (SET) to the valueStrings array
    // The current length of values after each push will always reflect the appropriate prepared index ($1, $2, $3... etc.)
    valueStrings.push(`${prop} = $${values.length}`);
  }
}

toDoRouter.put("/:id", (req, res) => {
  console.log(req.body);

  // ⬇ Get the id of the ToDo we want to update
  const id = req.params.id;
  const values = [];
  const valueStrings = [];

  updateValues("notes", req.body, values, valueStrings);
  updateValues("task", req.body, values, valueStrings);
  updateValues("importance_rank", req.body, values, valueStrings);

  // ⬇ Special case, to modify date if complete status changes
  const hasComplete = req.body.hasOwnProperty("complete");
  console.log("hasComplete: " + hasComplete);
  if (hasComplete) {
    // ⬇ If the value was false, clear date completed
    let complete = false;
    let dateCompleted = null;
    if (req.body.complete && req.body.complete !== "false") {
      // ⬇ If the value was true, set dateCompleted
      console.log("complete is true");
      complete = true;
      dateCompleted = new Date();
    }

    console.log("adding values");
    values.push(complete);
    valueStrings.push(`complete = $${values.length}`);
    values.push(dateCompleted);
    valueStrings.push(`date_completed = $${values.length}`);
  }

  // Make sure we have something to update!
  if (values.length === 0) {
    res.status(400).send("Requires at least one updatable property");
  }

  values.push(id);
  const queryText = `UPDATE "ToDo" 
    SET ${valueStrings.join(", ")}
    WHERE id = $${values.length}`;

  console.log("final query: " + queryText);
  console.log(values);

  pool
    .query(queryText, values)
    .then((result) => {
      res.sendStatus(201);
    })
    .catch((err) => {
      console.log("ya done goofed", err);
      res.sendStatus(500);
    });
});

// DELETE⬇
toDoRouter.delete("/:id", (req, res) => {
  const itemToDelete = req.params.id;
  const queryText = `DELETE FROM "ToDo" WHERE "ToDo".id = $1`;
  pool
    .query(queryText, [itemToDelete])
    .then((response) => {
      console.log(`we deleted the todo with id ${itemToDelete}`);
      res.send(200);
    })
    .catch((err) => {
      console.log("something went wrong in toDoRouter.delete", err);
      res.sendStatus(500);
    });
}); //end toDo/Router.delete

module.exports = toDoRouter;
