CREATE TABLE "ToDo" (
"id" SERIAL PRIMARY KEY,
"task" VARCHAR(255) NOT NULL,
"created" DATE,
"complete" VARCHAR(3) NOT NULL,
"date_completed" DATE NOT NULL DEFAULT NOW(),
"notes" VARCHAR(255), 
"importance_rank" INT
