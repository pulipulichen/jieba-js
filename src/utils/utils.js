import Async from './AsyncUtils.js'
import File from './FileUtils.js'
import Sheet from './utilsSheet.js'
import utilsString from './utilsString.js'
import ClipboardUtils from './ClipboardUtils.js'
import utilDate from './date-helper.js'
import TransUtils from './TransUtils.js'
import AxiosUtils from './AxiosUtils.js'

import postMessageAPI from '../utils/puli-post-message-api/puli-post-message-api.js'


export default {
  Async,
  Sheet,
  File,
  Date: utilDate,
  Trans: TransUtils,
  Axios: AxiosUtils,
  postMessageAPI,
  String: utilsString,
  ClipboardUtils
}