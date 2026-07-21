import { NextResponse } from 'next/server';
// CommonJS keeps the same governed service executable in Next.js and the real-HTTP test harness.
// eslint-disable-next-line @typescript-eslint/no-require-imports
const { loadConfig } = require('@/governance/config.cjs');
// eslint-disable-next-line @typescript-eslint/no-require-imports
const { getPool } = require('@/governance/db.cjs');
// eslint-disable-next-line @typescript-eslint/no-require-imports
const { createProviders } = require('@/governance/providers.cjs');
// eslint-disable-next-line @typescript-eslint/no-require-imports
const { createService } = require('@/governance/service.cjs');

let service: ReturnType<typeof createService> | undefined;
function governedService(){if(!service){const config=loadConfig();service=createService({config,pool:getPool(config),providers:createProviders(config)});}return service;}
async function dispatch(request:Request,context:{params:Promise<{path?:string[]}>}){const {path=[]}=await context.params;const rawBody=['POST','PUT','PATCH'].includes(request.method)?await request.text():'';let body={};if(rawBody){try{body=JSON.parse(rawBody);}catch{return NextResponse.json({error:'Request body must be valid JSON'},{status:400});}}const headers=Object.fromEntries(request.headers.entries());const result=await governedService()({method:request.method,path:`coaching/${path.join('/')}`,headers,body,rawBody});return NextResponse.json(result.body,{status:result.status});}
export const GET=dispatch;export const POST=dispatch;export const PATCH=dispatch;
