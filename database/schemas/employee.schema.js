const { Schema } = require('mongoose');
const {
  validEmail,
  validPhoneNumber,
  validPhotoURL,
} = require('../../lib/utils/validators');

const EmployeeSchema = new Schema(
  {
    empName: {
      type: String,
      required: [true, 'Enter a Patner Name'],
    },
    patner: {
      type: Schema.Types.ObjectId,
      ref: 'Patner',
    },
    email: {
      type: String,
      required: [true, 'Enter a Email'],
      validate(value) {
        validEmail(value);
      },
      unique: [
        true,
        'This email is already registered. Please try logging in or use a different email.',
      ],
    },
    phoneNumber: {
      type: String,
      required: [true, 'Enter a Phone Number'],
      validate(value) {
        validPhoneNumber(value);
      },
      unique: [
        true,
        'This phone number is already registered. Please try logging in or use a different phone number.',
      ],
    },
    password: {
      type: String,
      required: [true, 'Enter a Password'],
    },
    confirmPassword: {
      type: String,
      required: [true, 'Enter a Confirm Password'],
      select: false,
      validate: {
        validator: function (el) {
          return el === this.password;
        },
        message: 'Passwords are not the same!',
      },
    },
    photoURL: {
      type: String,
      validate(value) {
        validPhotoURL(value);
      },
    },
    address: {
      addressLine: {
        type: String,
        required: [true, 'Enter a Address Line'],
      },
      addressLine2: {
        type: String,
      },
      city: {
        type: String,
        required: [true, 'Enter a City'],
      },
      state: {
        type: String,
        required: [true, 'Enter a State'],
      },
      pinCode: {
        type: String,
        required: [true, 'Enter a Pin Code'],
      },
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    passwordChangedAt: {
      type: Date,
      default: new Date(),
    },
    OTP: {
      type: String,
      default: null,
    },
    OTPExpiresIn: {
      type: Date,
      default: null,
    },
    resetToken: {
      type: String,
      default: null,
    },
    resetTokenExpiresIn: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
    collection: 'patner',
  }
);

EmployeeSchema.index(
  {
    email: 1,
    phoneNumber: 1,
  },
  { unique: true }
);

EmployeeSchema.index({ empName: 1, patner: 1 });

module.exports = EmployeeSchema;
