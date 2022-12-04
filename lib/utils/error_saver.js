const { error } = require("../../database/models")

const errorSaver = async (req, app, e) => {
  
  const error_ = new error({
    params: req.params,
    queries: req.query,
    body: req.body,
    headers: req.headers,
    message: e?.message || "Something went wrong",
    stackTrace: e?.stack || "",
    url: req.get('host') + req.originalUrl,
    clientIp: req.headers['x-forwarded-for'] || req.socket.remoteAddress,
    app,
    ctx: req.ctx
  })

  
  await error_.save();
}

module.exports = {
  errorSaver
}