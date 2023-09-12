import { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  return knex.schema
    .createTable("titleOnSong", (table) => {
      table.uuid("songId");
      table.string("title");
      table.primary(["songId", "title"]);
    })
    .createTable("author", (table) => {
      table.uuid("authorId").primary();
      table.string("name");
      table.string("surname");
      table.string("pseudonym");
    })
    .createTable("authorOnSong", (table) => {
      table.uuid("authorId").references("authorId").inTable("author");
      table.uuid("songId");
      table.primary(["authorId", "songId"]);
    })
    .createTable("textAuthorOnSong", (table) => {
      table.uuid("authorId").references("authorId").inTable("author");
      table.uuid("songId");
      table.primary(["authorId", "songId"]);
    });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema
    .dropTable("textAuthorOnSong")
    .dropTable("authorOnSong")
    .dropTable("titleOnSong")
    .dropTable("author");
}
