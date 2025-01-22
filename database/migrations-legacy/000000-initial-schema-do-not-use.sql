-- ! DO NOT USE. THIS IS TO CREATE THE KNEX FILE

create database "exercise-app";
create extension if not exists "uuid-ossp";
create table if not exists users (
    id uuid primary key default uuid_generate_v4(),
    created timestamp not null default now(),
    username varchar(64) not null,
    first_name varchar(64) not null,
    last_name varchar(64) not null
);
create table if not exists routines (
    id uuid primary key default uuid_generate_v4(),
    created_at timestamp not null default now(),
    owner_user_id uuid not null,
    name varchar(64),
    constraint fk_owner_user_id
        foreign key(owner_user_id)
            references users(id)
);
create table if not exists exercises (
    id uuid primary key default uuid_generate_v4(),
    routine_id uuid not null,
    name varchar(64) not null,
    amount integer not null,
    unit varchar(64) not null default 'reps',
    "order" integer not null,
    created_at timestamp not null default now(),
    constraint fk_routine_id
        foreign key(routine_id)
            references routines(id)
);
create table if not exists entries (
    id uuid primary key default uuid_generate_v4(),
    exercise_id uuid not null,
    amount integer not null,
    created_at timestamp not null default now(),
    completed_at timestamp not null default now(),
    constraint fk_exercise_id
        foreign key(exercise_id)
            references exercises(id)
);
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
-- This migration adds picture columnd to user table.
ALTER TABLE users
    ADD COLUMN IF NOT EXISTS picture TEXT