import Knex from 'knex';

export async function up(knex: Knex) {
    return knex.schema.createTable('points', table => {
        table.increments('pointID').primary();
        table.string('pointName').notNullable;
        table.string('pointEmail').notNullable;
        table.string('pointWhatsApp').notNullable;
        table.string('pointImage').notNullable;
        table.decimal('pointLatitude').notNullable;
        table.decimal('pointLongitude').notNullable;
        table.string('pointCity').notNullable;
        table.string('pointUF', 2).notNullable;
        table.string('pointNumber').notNullable;
    });
}

export async function down(knex: Knex) {
    return knex.schema.dropTable('points');
}