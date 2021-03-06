import Knex from 'knex';

export async function up(knex: Knex) {
    return knex.schema.createTable('items', table => {
        table.increments('itemID').primary();
        table.string('itemTitle').notNullable;
        table.string('itemImage').notNullable;
    });
}

export async function down(knex: Knex) {
    return knex.schema.dropTable('items');
}