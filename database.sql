
CREATE TABLE "tasks"(
	"id" SERIAL PRIMARY KEY,
	"task" VARCHAR (250) NOT NULL,
	"completed" BOOLEAN DEFAULT false,
	"created_day" DATE,
    "finished_day" DATE
);