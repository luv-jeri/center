const { Schema } = require('mongoose');

const ServiceCategorySchema = new Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide a name for the service category'],
    },
    patner: {
      type: Schema.Types.ObjectId,
      ref: 'Patner',
    },
    description: {
      type: String,
    },
  },
  {
    timestamps: true,
    collection: 'service',
  }
);

ServiceCategorySchema.index({ name: 1, patner: 1 }, { unique: true });

module.exports = ServiceCategorySchema;
