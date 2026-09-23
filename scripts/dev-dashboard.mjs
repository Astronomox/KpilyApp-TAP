import { spawn } from 'node:child_process'
import { fileURLToPath } from 'node:url'
import path from 'node:path'

const npmCommand = process.platform === 'win32' ? 'npm.cmd' : 'npm'
const dashboardDirectory = path.resolve(
  fileURLToPath(new URL('../packages/dashboard/', import.meta.url))
)

const child = spawn(npmCommand, ['start'], {
  cwd: dashboardDirectory,
  env: { ...process.env, PORT: '3001' },
  stdio: 'inherit',
})

child.on('error', (error) => {
  console.error(error)
  process.exit(1)
})

child.on('exit', (code, signal) => {
  if (signal) {
    process.kill(process.pid, signal)
  } else {
    process.exit(code ?? 1)
  }
})
