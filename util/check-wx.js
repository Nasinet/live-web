function isWeiXin(){
  var ua = window.navigator.userAgent.toLowerCase();
  if(ua.match(/MicroMessenger/i) == 'micromessenger' || ua.match(/QQ/i) == "qq"){
    return true;
  } else {
    return false;
  }
}

export default isWeiXin
