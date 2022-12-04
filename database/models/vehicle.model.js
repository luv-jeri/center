const { model } = require('mongoose');

const { VehicleSchema } = require('../schemas');

const VehicleModal = model('Vehicle', VehicleSchema);

module.exports = VehicleModal;
