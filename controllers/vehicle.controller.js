const catcher = require('../lib/utils/catcher');
const fallback = require('../lib/utils/fallback');
const { Vehicle } = require('../database/models');
const _Error = require('../lib/utils/_Error');
const mail = require('../lib/functions/mail.function');
const Features = require('../lib/handlers/features.handler');

module.exports.add = catcher(async (req, res, next) => {
  const { model, type, description, images } = req.body;

  if (images && Array.isArray(images) && images.length > 0) {
    images.forEach((image) => {
      if (!image.startsWith('http')) {
        return next(new _Error('Please provide a valid image url', 400));
      }
    });
  }

  const vehicle = await Vehicle.create({
    model,
    type,
    description,
    images,
    patner: req.user._id,
  });

  res.status(201).json({
    status: 'success',
    message: 'Vehicle added successfully',
    content: {
      vehicle,
    },
  });
});

module.exports.update = catcher(async (req, res, next) => {});
