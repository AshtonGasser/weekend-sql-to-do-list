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
  const hasImportance = req.body.importanceRank;
  const queryText = `INSERT INTO "ToDo" 
    ("task", "complete", "date_completed", "notes"${hasImportance ? ', "importance_rank"' : ''}) 
    VALUES 
    ($1, $2, $3, $4${hasImportance ? ', $5' : ''})`;

  let complete = false;
  let dateCompleted = null;
  if (req.body.complete) {
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

// PUT⬇

// toDoRouter.put('/:id', (req, res) => {
//     let toDoId = req.params.id;//setting Koala id dynamically
//     console.log('toDoId in toDoRouter', toDoId);

//     let transferReady = req.body.ready_to_transfer//sets variable to transferability of koala
//     console.log(req.body);
//     console.log(transferReady);
//     let queryString = '';

//     if (transferReady === 'N'){//SQL statement to update transfer status of Koalas
//         queryString = `UPDATE "ToDo" SET "ready_to_transfer"='Y' WHERE "koalas".id=$1;`;
//     } else {
//         queryString = `UPDATE "ToDo" SET "ready_to_transfer"='N' WHERE "koalas".id=$1;`;

//     }

//     pool.query(queryString, [toDoId])
//         .then(response => {
//             console.log(response.rowCount);
//             res.sendStatus(202);//sends info to SQL DB for update and sends back 202
//         })
//         .catch(err => {
//             console.log(err);
//             res.sendStatus(500);//if it doesn't work get 500
//         });
// });

// DELETE⬇
// toDoRouter.delete('/:id', (req, res) => {
//     const itemToDelete = req.params.id;
//     const queryText = `DELETE FROM "ToDo" WHERE "ToDo".id = $1`;
//     pool.query(queryText, [itemToDelete])
//     .then((response) => {
//         console.log(`we deleted the koala with id ${itemToDelete}`);
//         res.send(200);
//     }).catch((err) => {
//         console.log('something went wrong in toDoRouter.delete', err);
//         res.sendStatus(500)
//     });
// });//end koalaRouter.delete

module.exports = toDoRouter;

// ("task","created", "complete", "date_completed", "notes", "importance_rank") 
    // VALUES 
    // ($1, $2, $3, $4, $5 ,$6);`;