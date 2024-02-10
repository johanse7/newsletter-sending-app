const { db } = require('@vercel/postgres');
const { revenue, users } = require('../app/lib/placeholder-data.js');
const bcrypt = require('bcrypt');

async function seedUsers(client) {
  try {
    await client.sql`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`;
    // Create the "users" table if it doesn't exist
    const createTable = await client.sql`
      CREATE TABLE IF NOT EXISTS users (
        id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        isAdmin BOOLEAN NOT NULL,
        email TEXT NOT NULL UNIQUE,
        password TEXT NOT NULL
      );
    `;

    console.log(`Created "users" table`);

    // Insert data into the "users" table
    const insertedUsers = await Promise.all(
      users.map(async (user) => {
        const hashedPassword = await bcrypt.hash(user.password, 10);
        return client.sql`
        INSERT INTO users ( name, isAdmin, email, password)
        VALUES ( ${user.name}, ${user.isAdmin}, ${user.email}, ${hashedPassword})
        ON CONFLICT (id) DO NOTHING;
      `;
      }),
    );

    console.log(`Seeded ${insertedUsers.length} users`);

    return {
      createTable,
      users: insertedUsers,
    };
  } catch (error) {
    console.error('Error seeding users:', error);
    throw error;
  }
}

async function seeNewsletter(client) {
  try {
    await client.sql`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`;

    await client.sql`
        CREATE TABLE IF NOT EXISTS Newsletter (
            id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
            title VARCHAR(255) NOT NULL,
            fileNewsletter BYTEA NOT NULL,
            createdBy UUID NOT NULL
          );
        );
`;

    console.log(`Created "Newsletter" table`);
  } catch (error) {
    console.error('Error seeding Newsletter:', error);
    throw error;
  }
}

async function seedUserNewsletter(client) {
  try {
    await client.sql`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`;

    await client.sql`
          CREATE TABLE User_Newsletter (
      userId UUID NOT NULL,
      NewsletterId UUID NOT NULL,
      PRIMARY KEY (userId, NewsletterId),
       CONSTRAINT fk_user FOREIGN KEY(userId) REFERENCES users(id),
       CONSTRAINT fk_Newsletter FOREIGN KEY(NewsletterId) REFERENCES newsletter(id)
     );
    `;

    console.log(`Created "User_Newsletter" table`);
  } catch (error) {
    console.error('Error seeding User_Newsletter:', error);
    throw error;
  }
}

async function main() {
  const client = await db.connect();

  await seedUsers(client);
  await seeNewsletter(client);
  await seedUserNewsletter(client);

  await client.end();
}

main().catch((err) => {
  console.error(
    'An error occurred while attempting to seed the database:',
    err,
  );
});
