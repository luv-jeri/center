const { model } = require('mongoose');

const { ServiceSchema } = require('../schemas');

const ServiceModal = model('Service', ServiceSchema);

module.exports = ServiceModal;
