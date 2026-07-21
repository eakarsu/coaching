import {NextResponse}from'next/server';
export async function POST(){const response=new NextResponse(null,{status:204});response.cookies.set('coaching_session','',{httpOnly:true,secure:process.env.NODE_ENV==='production',sameSite:'strict',expires:new Date(0),path:'/'});return response;}
