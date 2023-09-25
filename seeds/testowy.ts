import { Knex } from "knex";

export async function seed(knex: Knex): Promise<void> {
  // Deletes ALL existing entries
  await knex("author").del();

  // Inserts seed entries
  await knex("author").insert([
    {
      authorId: "-----uuid1-----",
      name: "Zygmunt",
      pseudonym: "Muniek",
      surname: "Staszczyk",
    },
    {
      authorId: "-----uuid2-----",
      name: "Piotr",
      pseudonym: "test",
      surname: "Rogucki",
    },
  ]);

  await knex("titleOnSong").insert([
    {
      songId: "-----uuid1-----",
      title: "Kotki małe dwa",
    },
    {
      songId: "-----uuid1-----",
      title: "Hymn pedofila",
    },
    {
      songId: "-----uuid2-----",
      title: "Piosenka pisana nocą",
    },
  ]);

  await knex("authorOnSong").insert([
    {
      songId: "-----uuid1-----",
      authorId: "-----uuid1-----",
    },
    {
      songId: "-----uuid1-----",
      authorId: "-----uuid2-----",
    },
    {
      songId: "-----uuid2-----",
      authorId: "-----uuid2-----",
    },
  ]);
}
