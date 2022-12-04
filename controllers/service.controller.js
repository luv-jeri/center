const catcher = require('../lib/utils/catcher');
const { Service, ServiceCategory } = require('../database/models');
const _Error = require('../lib/utils/_Error');
const mail = require('../lib/functions/mail.function');
const Features = require('../lib/handlers/features.handler');

module.exports.add = catcher(async (req, res) => {
  const {
    serviceName,
    serviceDescription,
    prices,
    serviceCategory,
    serviceImage,
    isMultiple,
  } = req.body;
  const { small, medium, large } = prices;

  const new_service = await Service.create({
    serviceName,
    serviceDescription,
    prices: { small, medium, large },
    serviceCategory,
    serviceImage,
    isMultiple,
    patner: req.patner._id,
  });

  res.status(201).json({
    status: 'success',
    message: 'Service created successfully 😀',
    content: {
      service: new_service,
    },
  });
});

module.exports.get = catcher(async (req, res) => {
  const { query } = req;

  const features = new Features(
    Service.find({
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

  const services = await features.query;

  res.status(200).json({
    status: 'success',
    message: 'Services fetched successfully 😀',
    content: {
      results: services.length,
      services,
    },
  });
});

module.exports.get_by_id = catcher(async (req, res, next) => {
  const { serviceId } = req.params;

  const service = await Service.findById(serviceId);

  if (!service) return next(new _Error('No service found with that ID', 404));

  res.status(200).json({
    status: 'success',
    message: 'Service fetched successfully 😀',
    content: {
      service,
    },
  });
});

module.exports.update = catcher(async (req, res, next) => {
  const { id } = req.params;
  const {
    serviceName,
    serviceDescription,
    prices,
    serviceCategory,
    patner,
    serviceImage,
    isMultiple,
  } = req.body;
  const { small, medium, large } = prices || {};

  if (!id) return next(new _Error('Please provide all required fields', 400));

  if (serviceCategory) {
    const category = await ServiceCategory.findById({
      _id: serviceCategory,
    });
    if (!category) return next(new _Error('No category found with that ID', 404));
  }

  const service = await Service.findOne({
    _id: id,
    patner: req.patner._id,
  });

  if (!service) return next(new _Error('No service found with that ID', 404));

  if (serviceName) service.serviceName = serviceName;
  if (serviceDescription) service.serviceDescription = serviceDescription;
  if (small) service.prices.small = small;
  if (medium) service.prices.medium = medium;
  if (large) service.prices.large = large;
  if (serviceCategory) service.serviceCategory = serviceCategory;
  if (patner) service.patner = patner;
  if (serviceImage) service.serviceImage = serviceImage;
  if (isMultiple) service.isMultiple = isMultiple;

  await service.save({
    validateBeforeSave: true,
  });

  res.status(200).json({
    status: 'success',
    message: 'Service updated successfully 😀',
    content: {
      service,
    },
  });
});

module.exports.remove = catcher(async (req, res, next) => {
  const { serviceId } = req.params;

  const service = await Service.findOne({
    _id: serviceId,
    patner: req.patner._id,
  });

  if (!service) return next(new _Error('No service found with that ID', 404));

  await service.remove();

  res.status(200).json({
    status: 'success',
    message: 'Service deleted successfully 😀',
    content: {
      result: 1,
    },
  });
});
