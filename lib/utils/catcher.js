module.exports = (fun) => {
  const to_return = async (req, res, next) => {
    fun(req, res, next)
      .then(async () => {
        console.log(`completed successfully.`);
      })
      .catch(async (error) => {
        console.log(error);
        next(error);
      });
  };
  return to_return;
};
