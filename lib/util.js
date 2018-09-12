import {URL} from 'url';

export function absUrl(url, base) {
  return new URL(url, base).href;
}
