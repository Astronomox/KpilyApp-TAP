import { spawnSync } from 'node:child_process'

const npmCommand = process.platform === 'win32' ? 'npx.cmd' : 'npx'
const result = spawnSync(npmCommand, ['next', 'build', '--webpack'], {
  stdio: 'inherit',
  env: { ...process.env, NODE_ENV: 'production' },
})

if (result.error) throw result.error
process.exit(result.status ?? 1)
