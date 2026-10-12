import { Pool } from 'pg';
// The native local session and receipt store are shared with the tested HTTP service.
// eslint-disable-next-line @typescript-eslint/no-require-imports
const localAuth = require('@/governance/local-auth.cjs');
// eslint-disable-next-line @typescript-eslint/no-require-imports
const { createAdviceHandler } = require('@/governance/runtime-ai.cjs');
let handle: ((request: Request) => Promise<Response>) | undefined;
function advice(request: Request): Promise<Response> {
  if (!handle) handle = createAdviceHandler({ pool: new Pool({ connectionString: process.env.DATABASE_URL }), localAuth });
  return handle!(request);
}
export const GET = advice;
export const POST = advice;
