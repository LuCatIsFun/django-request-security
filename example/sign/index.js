import md5 from 'js-md5';
import type { AxiosRequestConfig } from 'axios';

const REGULAR = /[^a-zA-Z0-9]/g;
const RANDOM_STRING = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';

/**
 * @description: 生成随机字符串
 */
function randomString(length) {
  let result = '';
  const r = Math.floor(Math.random() * (27 - 1 + 1) + 1);
  for (let i = length; i > 0; --i) {
    result += i !== r ? RANDOM_STRING[Math.floor(Math.random() * RANDOM_STRING.length)] : '_';
  }
  return result;
}

/**
 * @description: 判断url参数是否为空
 */
function isUrlEmpty(parameter: any): boolean {
  // 为undefined, null, [] 时忽略参数
  if ([undefined, null, ''].indexOf(parameter) === -1) {
    return parameter instanceof Array && JSON.stringify(parameter) === '[]';
  }
  return true;
}

/**
 * @description: 解析合并参数
 */
function handleParameter(parameter: any): string {
  // 去除空参数
  const tmp = {};
  if (parameter) {
    Object.keys(parameter).forEach(function (key) {
      if (!isUrlEmpty(parameter[key])) {
        tmp[key] = parameter[key];
      }
    });
    return JSON.stringify(tmp).replace(REGULAR, '');
  }
  return '';
}

export function CreateSign(config: AxiosRequestConfig): AxiosRequestConfig {
  const SECRET = 'xxxxxxxxxxxxxxxxxxxxxxxxxxx';
  const nonce = randomString(28);
  const timestamp = parseInt(new Date().valueOf() / 1000);
  console.log(handleParameter(config.data), handleParameter(config.params))
  const s = [
    handleParameter(config.data),
    handleParameter(config.params),
    SECRET,
    nonce,
    timestamp.toString(),
  ]
    .join('')
    .split('')
    .sort()
    .join('')
    .split('_');

  [s[0], s[1]] = [s[1], s[0]];

  config.headers['N'] = nonce;
  config.headers['T'] = timestamp;
  config.headers['S'] = md5(s.join(''));

  return config;
}
