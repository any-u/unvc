import consola from 'consola'
import path from 'node:path'
import { execSync } from 'node:child_process'
import { version } from '../package.json'

execSync('npm run build', { stdio: 'inherit' })

let command = 'npm publish --registry=https://registry.npmjs.org/'

if (version.includes('beta')) {
  command += ' --tag beta'
}

execSync(command, { stdio: 'inherit', cwd: path.join(__dirname, '../')})
consola.success(`Published unvc`)
