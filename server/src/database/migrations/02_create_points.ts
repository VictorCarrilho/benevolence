import Knex from 'knex';

export async function up(knex: Knex) {
    return knex.schema.createTable('point_item', table => {
        table.increments('ID').primary();
        table.integer('pointID').references('pointID').inTable('points').notNullable();
        table.integer('itemID').references('itemID').inTable('items').notNullable();
    });
}

export async function down(knex: Knex) {
    return knex.schema.dropTable('point_item');
}