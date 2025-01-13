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
