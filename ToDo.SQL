CREATE TYPE importance AS ENUM ('unimportant', 'minor', 'neutral','priority', 'super priority', 'threat level midnight' );
CREATE TABLE "ToDo" (
"id" SERIAL PRIMARY KEY,
"task" VARCHAR(255) NOT NULL,
"created" DATE NOT NULL DEFAULT NOW(),
"complete" BOOLEAN DEFAULT FALSE,
"date_completed" DATE,
"notes" VARCHAR(255), 
"importance_rank" importance NOT NULL DEFAULT 'neutral'


);