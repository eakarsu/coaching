const{Pool}=require('pg');let singleton;
function createPool(config){return new Pool({connectionString:config.databaseUrl,ssl:config.databaseSsl,max:12,idleTimeoutMillis:10000});}
function getPool(config){if(!singleton)singleton=createPool(config);return singleton;}
async function tx(pool,work){const client=await pool.connect();try{await client.query('BEGIN');const result=await work(client);await client.query('COMMIT');return result;}catch(e){await client.query('ROLLBACK');throw e;}finally{client.release();}}
async function register(client,p){await client.query(`INSERT INTO coaching_identities(tenant_id,subject,role,email)VALUES($1,$2,$3,$4)ON CONFLICT(tenant_id,subject)DO UPDATE SET role=EXCLUDED.role,email=EXCLUDED.email,active=true`,[p.tenantId,p.subject,p.role,p.email]);}
async function audit(client,p,action,type,id,from,to,metadata={}){await client.query(`INSERT INTO coaching_audit_events(tenant_id,actor_subject,action,resource_type,resource_id,from_state,to_state,metadata)VALUES($1,$2,$3,$4,$5,$6,$7,$8)`,[p.tenantId,p.subject,action,type,id||null,from||null,to||null,metadata]);}
module.exports={createPool,getPool,tx,register,audit};
