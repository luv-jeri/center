const { model } = require('mongoose');

const { ServiceCategorySchema } = require('../schemas');

const ServiceCategoryModal = model('ServiceCategory', ServiceCategorySchema);

module.exports = ServiceCategoryModal;
