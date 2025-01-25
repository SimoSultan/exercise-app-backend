exports.up = async function (knex) {
  await knex.raw('CREATE EXTENSION IF NOT EXISTS "uuid-ossp"'); // Create extension

  await knex.schema.createTable('users', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('uuid_generate_v4()'));
    table.timestamp('created').notNullable().defaultTo(knex.fn.now());
    table.string('username', 64).notNullable();
    table.string('first_name', 64).notNullable();
    table.string('last_name', 64).notNullable();
    table.text('picture'); // Added picture column directly here
  });

  await knex.schema.createTable('routines', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('uuid_generate_v4()'));
    table.timestamp('created_at').notNullable().defaultTo(knex.fn.now());
    table.uuid('owner_user_id').notNullable().references('id').inTable('users');
    table.string('name', 64);
  });

  await knex.schema.createTable('exercises', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('uuid_generate_v4()'));
    table
      .uuid('routine_id')
      .notNullable()
      .references('id')
      .inTable('routines')
      .onDelete('CASCADE'); // CASCADE here
    table.string('name', 64).notNullable();
    table.integer('amount').notNullable();
    table.string('unit', 64).notNullable().defaultTo('reps');
    table.integer('order').notNullable();
    table.timestamp('created_at').notNullable().defaultTo(knex.fn.now());
  });

  await knex.schema.createTable('entries', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('uuid_generate_v4()'));
    table
      .uuid('exercise_id')
      .notNullable()
      .references('id')
      .inTable('exercises')
      .onDelete('CASCADE'); // CASCADE here
    table.integer('amount').notNullable();
    table.timestamp('created_at').notNullable().defaultTo(knex.fn.now());
    table.timestamp('completed_at').notNullable().defaultTo(knex.fn.now());
  });
};

exports.down = async function (knex) {
  await knex.schema.dropTable('entries');
  await knex.schema.dropTable('exercises');
  await knex.schema.dropTable('routines');
  await knex.schema.dropTable('users');
  await knex.raw('DROP EXTENSION IF EXISTS "uuid-ossp"');
};
