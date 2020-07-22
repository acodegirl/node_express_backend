module.exports = function(handler) {
  return async (req, res, next) => {
    console.log('Inside async middleware');
    try {
      await handler(req, res);
    } catch (ex) {
      console.log('exception raised');
      next(ex);
    }
  };
};
