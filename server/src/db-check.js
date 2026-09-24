import { sequelize } from './config/database.js';
try {
  await sequelize.authenticate();
  console.log('PostgreSQL connection: OK');
  process.exit(0);
} catch (error) {
  console.error('PostgreSQL connection: FAILED');
  console.error(error.message);
  process.exit(1);
}
