-- This migration will drop some existing foreign key constraints and
-- re-create them with the CASCADE option. This allows us to delete
-- all related records constrained by the foreign key.
ALTER TABLE exercises
    DROP CONSTRAINT fk_routine_id,
    ADD CONSTRAINT fk_routine_id
        FOREIGN KEY (routine_id) REFERENCES routines(id)
            ON DELETE CASCADE;

ALTER TABLE entries
    DROP CONSTRAINT fk_exercise_id,
    ADD CONSTRAINT fk_exercise_id
        FOREIGN KEY (exercise_id) REFERENCES exercises(id)
            ON DELETE CASCADE;
