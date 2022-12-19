import '@testing-library/jest-dom/extend-expect'
import path from 'path'
import { unflatten } from 'flat'
import { getHashiConfig } from '../config'
import 'isomorphic-unfetch'

const env = process.env.HASHI_ENV || 'development'
const envConfigPath = path.join(process.cwd(), 'config', `${env}.json`)

global.__config = unflatten(getHashiConfig(envConfigPath))
