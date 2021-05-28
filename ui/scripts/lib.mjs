export async function lint() {
  return $`yarn prettier --config .prettierrc -c '**/*.{vue,ts,json}'`;
}

export async function lintQuick() {
  return $`yarn pretty-quick --staged --pattern 'ui/**/*.{vue,ts,js,json}'`;
}

export async function e2eTest(opt) {
  if (opt?.port) process.env.PORT = opt.port;
  return $`cd e2e && ./scripts/test.sh`;
}

export async function e2eTestDebug() {
  return $`cd e2e && DEBUG=pw:api NOSTACK=1 ./scripts/test.sh`;
}

export async function serveBuiltApp() {
  return $`yarn serve app/dist`;
}

export async function waitOn(...requirements) {
  return $`wait-on ${requirements}`;
}
