/* eslint-disable prettier/prettier */
//prettier-ignore

/* eslint-disable @typescript-eslint/no-var-requires */
// import { drizzle } from 'drizzle-orm/postgres-js';
// import { migrate } from 'drizzle-orm/postgres-js/migrator';
// import

const { drizzle } = require('drizzle-orm/postgres-js');
const { migrate } = require('drizzle-orm/postgres-js/migrator');
// eslint-disable-next-line @typescript-eslint/no-var-requires
const postgres = require('postgres');
// dotenv.config({
//   path: '../.env.development',
// });

// const migrationClient = postgres(
//   'postgres://postgres:hridoy09@localhost:5432/BS-Nest',
//   {
//     max: 1,
//   },
// );

// (async () => {
//   await migrate(drizzle(migrationClient), {
//     migrationsFolder: './src/migrations',

//     migrationsTable: 'db_migrations',
//   });

//   console.log('Migrations applied');
// })();

const migrationsClient = postgres(
  'postgres://postgres:hridoy09@localhost:5432/BS-Nest',
  {
    max: 1,
  },
);
const db = drizzle(migrationsClient);
migrate(db, { migrationsFolder: './src/migrations' })
  .then(() => console.log('Migrations applied'))
  .catch((e) => console.error(e));
