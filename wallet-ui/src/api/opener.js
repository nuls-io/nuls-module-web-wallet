import { RUN_PATTERN } from '@/config/index'
export function openner(url) {
  if (RUN_PATTERN) {
    const {shell} = require('electron');
    shell.openExternal(url);
  } else {
    window.open(url, '_blank');
  }
}

export function openWeb(url) {
  window.open(url, '_blank');
}

