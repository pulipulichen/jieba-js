
import ConfigDevelopment from './ConfigDevelopment.js'
import ConfigSession from './ConfigSession.js'
import ConfigState from './ConfigState.js'


let config = {
  version: '20240508-2352',
  debug: {
    ErrorHandler: {
      verbose: true
    }
  },
  locale: 'zh-TW',
  inited: false,
  development: {
    ...ConfigDevelopment
  },
  session: {
    ...ConfigSession
  },
  state: {
    ...ConfigState
  }
}

import styleConfig from './styles/style.config.js'
config.styleConfig = styleConfig

//import readingConfig from './../config/reading.js'
//config.readingConfig = readingConfig

import productionConfig from './config.production.js'
if (process.env.NODE_ENV === 'production') {
  for (let name in productionConfig) {
    config[name] = productionConfig[name]
  }
}

export default config