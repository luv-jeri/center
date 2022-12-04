const { Schema } = require('mongoose');

const VehicleSchema = new Schema(
  {
    model: {
      type: String,
      required: [true, 'Please provide a model for the vehicle'],
    },
    patner: {
      type: Schema.Types.ObjectId,
      ref: 'Patner',
    },
    type: {
      type: String,
      required: [true, 'Please provide a type for the vehicle'],
      enum: ['car', 'bike', 'truck', 'bus', 'van', 'scooter', 'other'],
      default: 'car',
    },
    description: {
      type: String,
    },
    images: [
      {
        type: String,
      },
    ],
  },
  {
    timestamps: true,
    collection: 'service',
  }
);

VehicleSchema.index({
  model: 1,
  patner: 1,
  type : 1
});

module.exports = VehicleSchema;
