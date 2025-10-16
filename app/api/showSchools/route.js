import { connectToDb } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET() {
  
  try{
   const db = await connectToDb();
const sql = "SELECT * FROM schools";
const result = await db.query(sql);
const schools = result.rows;
   return NextResponse.json(schools)
  }
  catch(err){
console.log(err)
return NextResponse.json({err: err.message});
  }
}