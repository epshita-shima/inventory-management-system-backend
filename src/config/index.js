const dotenv = require('dotenv')
const path=require('path')
dotenv.config({ path: path.join(process.cwd(), '.env') });

module.exports = {
  env: process.env.NODE_ENV,
  port: process.env.PORT,
  database_url: process.env.DATABASE_URL,
}