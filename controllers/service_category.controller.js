const catcher = require('../lib/utils/catcher');
const fallback = require('../lib/utils/fallback');
const { Service, ServiceCategory } = require('../database/models');
const _Error = require('../lib/utils/_Error');
const Features = require('../lib/handlers/features.handler');

module.exports.add = catcher(async (req, res) => {
  const { name, description } = req.body;

  const serviceCategory = await ServiceCategory.create({
    name,
    description,
    patner: req.patner._id,
  });

  res.status(201).json({
    status: 'success',
    message: 'Service category created successfully 😀',
    content: {
      serviceCategory,
    },
  });
});

module.exports.get = catcher(async (req, res) => {
  const { query } = req;

  const features = new Features(
    ServiceCategory.find({
      patner: req.patner._id,
    }),
    query
  )
    .filter()
    .sort()
    .select()
    .populate()
    .search()
    .paginate();

  const serviceCategories = await features.query;

  res.status(200).json({
    status: 'success',
    message: 'Service categories fetched successfully 😀',
    content: {
      serviceCategories,
    },
  });
});

module.exports.get_by_id = catcher(async (req, res, next) => {
  const { id } = req.params;

  if (!id) return next(new _Error('Please provide a service category id', 400));

  const serviceCategory = await ServiceCategory.find({
    _id: id,
    patner: req.patner._id,
  });

  if (!serviceCategory) return next(new _Error('Service category not found', 404));

  res.status(200).json({
    status: 'success',
    message: 'Service category fetched successfully 😀',
    content: {
      serviceCategory,
    },
  });
});

module.exports.update = catcher(async (req, res, next) => {
  const { id } = req.params;

  if (!id) return next(new _Error('Please provide a service category id', 400));

  const { name, description } = req.body;

  const serviceCategory = await ServiceCategory.findOne({
    _id: id,
    patner: req.patner._id,
  });

  if (!serviceCategory) return next(new _Error('Service category not found', 404));

  if (name) serviceCategory.name = name;
  if (description) serviceCategory.description = description;

  res.status(200).json({
    status: 'success',
    message: 'Service category updated successfully 😀',
    content: {
      serviceCategory,
    },
  });
});

module.exports.remove = fallback(async (req, res, next, session) => {
  const { id, moveTo } = req.params;

  if (!id) return next(new _Error('Please provide a service category id', 400));

  const services = await Service.find({
    serviceCategory: id,
    patner: req.patner._id,
  });

  if (services.length > 0 && !moveTo)
    return next(new _Error('Service category has services attached to it', 400));

  if (services.length > 0 && moveTo) {
    await Service.updateMany(
      {
        serviceCategory: id,
        patner: req.patner._id,
      },
      {
        serviceCategory: moveTo,
      },
      {
        session,
      }
    );
  }

  const serviceCategory = await ServiceCategory.findOneAndDelete(
    {
      _id: id,
      patner: req.patner._id,
    },
    {
      session,
    }
  );

  if (!serviceCategory) return next(new _Error('Service category not found', 404));

  res.status(200).json({
    status: 'success',
    message: 'Service category deleted successfully 😀',
    content: {
      serviceCategory,
    },
  });
});
