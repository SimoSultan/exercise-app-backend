create table if not exists routines (
    id uuid primary key default uuid_generate_v4(),
    created_at timestamp not null default now(),
    owner_user_id uuid not null,
    name varchar(64),
    constraint fk_owner_user_id
        foreign key(owner_user_id)
            references users(id)
);
