function getStorageType(type = 'local') {
  return type === 'local' ? localStorage : sessionStorage;
}

class Storage {
  get(key, type = 'local') {
    let result = null;
    const storage = getStorageType(type);
    result = storage.getItem(key);
    if (result) {
      try {
        return JSON.parse(result);
      } catch (e) {
        return result;
      }
    }
    return null;
  }
  set(key, value, type = 'local') {
    const storage = getStorageType(type);
    storage.setItem(key, JSON.stringify(value));
  }
  remove(key, type = 'local') {
    const storage = getStorageType(type);
    storage.removeItem(key);
  }
  clear(type = 'local') {
    const storage = getStorageType(type);
    storage.clear();
  }
}

export default new Storage();
