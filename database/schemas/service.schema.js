const { Schema } = require('mongoose');

const PriceSchema = new Schema(
  {
    small: {
      type: Number,
      required: [true, 'Enter a Price for small'],
    },
    medium: {
      type: Number,
      required: [true, 'Enter a Price for medium'],
    },
    large: {
      type: Number,
      required: [true, 'Enter a Price for large'],
    },
  },
  {
    _id: false,
  }
);

const ServiceSchema = new Schema(
  {
    serviceName: {
      type: String,
      required: [true, 'Enter a Service Name'],
    },
    serviceDescription: {
      type: String,
      required: [true, 'Enter a Service Description'],
    },
    prices: {
      type: PriceSchema,
      required: [true, 'Enter a Price'],
    },
    serviceCategory: {
      type: Schema.Types.ObjectId,
      ref: 'service_category',
      required: [true, 'Enter a Service Category'],
    },
    patner: {
      type: Schema.Types.ObjectId,
      ref: 'patner',
      required: [true, 'Enter a Patner'],
    },
    serviceImage: {
      type: String,
    },
    isMultiple: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
    collection: 'service',
  }
);

ServiceSchema.index({ serviceName: 1, patner: 1 });

module.exports = ServiceSchema;
