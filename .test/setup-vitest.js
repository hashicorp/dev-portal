import '@testing-library/jest-dom/vitest'
import path from 'path'
import { unflatten } from 'flat'
import { getHashiConfig } from '../config'

const env = process.env.HASHI_ENV || 'development'
const envConfigPath = path.join(process.cwd(), 'config', `${env}.json`)

global.__config = unflatten(getHashiConfig(envConfigPath))
