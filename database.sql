
CREATE TABLE "tasks"(
	"id" SERIAL PRIMARY KEY,
	"task" VARCHAR (250) NOT NULL,
	"completed" BOOLEAN DEFAULT false,
);

INSERT INTO "tasks"("task", "completed")
VALUES ('Wake up early', true),
('Drink some coffee', true),
('Go for a run', false),
('Give DeWitt an Exceeds Expectations!', false);