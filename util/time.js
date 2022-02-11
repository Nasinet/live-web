export const getDuration = (stamp, tem) => {
  const hour = Math.floor(stamp / (1000 * 60 * 60))
  let ms = stamp - hour * 1000 * 60 * 60
  const min = Math.floor(ms / (1000 * 60))
  ms = ms - min * 1000 * 60
  const sec = Math.floor(ms / 1000)
  return tem.replace('hh', hour > 0 ? hour : '0' + hour).replace('mm', min > 9 ? min : '0' + min).replace('ss', sec > 9 ? sec : '0' + sec)
}

export const getMonth = (date, tem) => {
  const year = date.getFullYear()
  const mon = date.getMonth() + 1
  return tem.replace('yy', year).replace('mm', mon > 9 ? mon : '0' + mon)
}
