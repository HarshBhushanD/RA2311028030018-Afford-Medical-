const ACCESS_TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJNYXBDbGFpbXMiOnsiYXVkIjoiaHR0cDovLzIwLjI0NC41Ni4xNDQvZXZhbHVhdGlvbi1zZXJ2aWNlIiwiZW1haWwiOiJoZDY4NDNAc3JtaXN0LmVkdS5pbiIsImV4cCI6MTc3NzcwNjY4MCwiaWF0IjoxNzc3NzA1NzgwLCJpc3MiOiJBZmZvcmQgTWVkaWNhbCBUZWNobm9sb2dpZXMgUHJpdmF0ZSBMaW1pdGVkIiwianRpIjoiZjU4NmYxMGQtMWMxMy00ODcxLTlhNDEtOTJiYjg3OWE2OTFlIiwibG9jYWxlIjoiZW4tSU4iLCJuYW1lIjoiaGFyc2ggYmh1c2hhbiBkaXhpdCIsInN1YiI6IjE1MGY1NTMwLWQ2ZjctNGQwMy1hM2RjLTNkZjE3MWUzNzAyMyJ9LCJlbWFpbCI6ImhkNjg0M0Bzcm1pc3QuZWR1LmluIiwibmFtZSI6ImhhcnNoIGJodXNoYW4gZGl4aXQiLCJyb2xsTm8iOiJyYTIzMTEwMjgwMzAwMTgiLCJhY2Nlc3NDb2RlIjoiUWticHhIIiwiY2xpZW50SUQiOiIxNTBmNTUzMC1kNmY3LTRkMDMtYTNkYy0zZGYxNzFlMzcwMjMiLCJjbGllbnRTZWNyZXQiOiJ2UHVITlRIZEtKZ3FZQkNIIn0.jgjmKmj5WbcyrFryW2cV2oH-atvr35sjsFGf2B5qb_4";
const API_ENDPOINT = "http://20.207.122.201/evaluation-service/logs";

const ALLOWED_STACKS = new Set(['backend', 'frontend']);
const ALLOWED_LEVELS = new Set(['debug', 'info', 'warn', 'error', 'fatal']);
const ALLOWED_PACKAGES = new Set([
  'cache', 'controller', 'cron_job', 'db', 'domain',
  'handler', 'repository', 'route', 'service'
]);

async function Log(stack, level, pkg, message) {
  if (!ALLOWED_STACKS.has(stack)) throw new Error(`Invalid stack: ${stack}`);
  if (!ALLOWED_LEVELS.has(level)) throw new Error(`Invalid level: ${level}`);
  if (stack === 'backend' && !ALLOWED_PACKAGES.has(pkg)) throw new Error(`Invalid package: ${pkg}`);

  const payload = { stack, level, package: pkg, message };

  try {
    const response = await fetch(API_ENDPOINT, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${ACCESS_TOKEN}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.warn(`[Logging Middleware] Failed. Status: ${response.status}, Body: ${errorText}`);
    } else {
      console.log(`[Logging Middleware] Sent ${level} log to ${API_ENDPOINT}`);
    }
    return response;
  } catch (error) {
    console.error(`[Logging Middleware] Error:`, error.message);
    throw error;
  }
}

module.exports = { Log, ACCESS_TOKEN };
