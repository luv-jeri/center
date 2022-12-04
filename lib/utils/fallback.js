const Mongoose = require('mongoose');

module.exports = (fun) => {
  const to_return = async (req, res, next) => {
    const session = await Mongoose.startSession();
    session.startTransaction();
    fun(req, res, next, session)
      .then(async () => {
        console.log('DONE !!');
        await session.commitTransaction();
      })
      .catch(async (error) => {
        console.log('FAIL', error);
        await session.abortTransaction();

        next(error);
      })
      .finally(() => {
        console.log('FINALLY');
        session.endSession();
      });
  };
  return to_return;
};
