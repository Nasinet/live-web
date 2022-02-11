export function loadScript(src, variable) {
  if (variable && window[variable]) {
    return Promise.resolve()
  }
  return new Promise(resolve => {
    const ele = document.createElement('script')
    ele.src = src
    document.getElementsByTagName('head')[0].appendChild(ele)
    // 兼容ie10
    ele.onload = ele.onreadystatechange = function() {
      if (
        !this.readyState ||
        this.readyState === 'loaded' ||
        this.readyState === 'complete'
      ) {
        resolve()
      }
    }
  })
}