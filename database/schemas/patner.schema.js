const { Schema } = require('mongoose');
const {
  validEmail,
  validPhoneNumber,
  validPhotoURL,
} = require('../../lib/utils/validators');

const PatnerSchema = new Schema(
  {
    patnerName: {
      type: String,
      required: [true, 'Enter a Patner Name'],
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
    employeePrefix: {
      type: String,
      required: [true, 'Enter a Employee Prefix'],
      default: function () {
        return `EMP-${this.patnerName.trim().slice(0, 3).toUpperCase()}`;
      },
    },
    invoicePrefix: {
      type: String,
      required: [true, 'Enter a Invoice Prefix'],
      default: function () {
        return this.patnerName.trim().slice(0, 3).toUpperCase();
      },
    },
    inoiceNumber: {
      type: Number,
      default: 0,
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

PatnerSchema.index(
  { patnerName: 'text', email: 'text', phoneNumber: 'text' },
  { unique: true }
);

module.exports = PatnerSchema;
