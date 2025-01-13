create table if not exists users (
    id uuid primary key default uuid_generate_v4(),
    created timestamp not null default now(),
    username varchar(64) not null,
    first_name varchar(64) not null,
    last_name varchar(64) not null
);
