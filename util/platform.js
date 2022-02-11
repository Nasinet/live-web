/**
 * 获取平台
 * @param req {node request}
 * @return {string}
 */
function getPlatform(req) {
  const deviceAgent = req.headers["user-agent"].toLowerCase()
  const agentID = deviceAgent.match(/(iphone|ipod|ipad|android)/)
  if(agentID){
    return 'h5'
  }else{
    return 'pc'
  }
}

export default getPlatform
