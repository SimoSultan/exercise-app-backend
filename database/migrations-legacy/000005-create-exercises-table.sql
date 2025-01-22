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
