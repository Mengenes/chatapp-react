import {Pool} from 'pg'


const DATABASE_URL=process.env.DATABASE_URL as string;
if(!DATABASE_URL){
  throw new Error("DATABASE_URL is not defined in environment variables")
}

export const pool=new Pool({
connectionString:DATABASE_URL

})