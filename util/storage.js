export const getItem = (key) => {
  const data = localStorage.getItem(key)
  if (data && data.indexOf('{') === 0) return JSON.parse(data)
  return data
}

export const setItem = (key, data) => {
  if (typeof data !== 'string') data = JSON.stringify(data)
  localStorage.setItem(key, data)
}

export const removeItem = (key) => {
  localStorage.removeItem(key)
}
