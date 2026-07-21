import { NextResponse } from 'next/server';
// eslint-disable-next-line @typescript-eslint/no-require-imports
const {loadConfig}=require('@/governance/config.cjs');
export async function GET(){return NextResponse.redirect(loadConfig().oidcLoginUrl,303);}
