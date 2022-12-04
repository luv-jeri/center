const catch_async = require('../utils/catch_async');
const Models = require('../helpers/models.helper');
const APIAddons = require('../utils/api_addons');
const _Error = require('../utils/_error');

exports.create = (collection, methods) =>
  catch_async(async (req, res, next) => {
    const document = await Models[collection].create(
      req.body
    );

    if (!document) {
      return next(
        new _Error(`${collection} not created`, 404)
      );
    }

    // to call document methods from Mongoose.Schema methods
    if (methods) {
      methods.forEach(async (method) => {
        await document[method]();
      });
    }

    res.status(201).json({
      status: 201,
      data: document,
    });
  });

exports.find = (collection) =>
  catch_async(async (req, res) => {
    const with_addons = new APIAddons(
      Models[collection],
      req.query
    )
      .filter()
      .sort()
      .select()
      .paginate()
      .populate();

    const documents = await with_addons.query;

    res.status(201).json({
      status: 201,
      data: documents,
      message: `'${documents.length}' : ${collection} fetched successfully !`,
    });
  });

exports.find_by_id = (collection) =>
  catch_async(async (req, res, next) => {
    if (!req.params.id) {
      return next(
        new _Error(
          `No ID found in the request params`,
          404
        )
      );
    }
    req.query = { ...req.query, _id: req.params.id };

    const with_addons = new APIAddons(
      Models[collection],
      req.query,
      true
    )
      .filter()
      .sort()
      .select()
      .paginate()
      .populate();

    const document = await with_addons.query;

    if (!document) {
      return next(
        new _Error(
          `No document found with ID : ${req.params.id}`,
          404
        )
      );
    }

    res.status(201).json({
      status: 201,
      data: document,
      message: `${
        document.name || document._id
      } :  ${collection} retrieved`,
    });
  });

exports.update = (collection, fields_array) =>
  catch_async(async (req, res, next) => {
    // Get the properties from the req.body that are in the fields_array

    const filtered_body = fields_array.reduce(
      (acc, field) => {
        acc[field] = req.body[field];
        return acc;
      },
      {}
    );

    const updated_document = await Models[
      collection
    ].findByIdAndUpdate(req.params.id, filtered_body, {
      new: true,
      runValidators: true,
    });

    if (!updated_document) {
      return next(
        new _Error(
          `No document found with ID : ${req.params.id}`,
          204
        )
      );
    }
    res.status(202).json({
      status: 202,
      data: updated_document,
      message: `${
        updated_document.name || updated_document._id
      } :  ${collection} updated successfully with data: ${
        req.body
      }`,
    });
  });

exports.delete = (collection, fields_array, references) =>
  catch_async(async (req, res, next) => {
    const document = await Models[collection].findById(
      req.params.id
    );
    if (
      fields_array.some((field) => document[field] !== null)
    ) {
      return next(
        new _Error(
          `${
            document.name || document._id
          } :  ${collection} is not empty and can't be deleted`,
          400
        )
      );
    }

    references.forEach(async (reference) => {
      const { ref_collection, field } = reference;
      await Models[ref_collection].findByIdAndUpdate(
        req.params.id,
        {
          $pull: {
            [field]: req.params.id,
          },
        },
        {
          new: true,
          runValidators: true,
        }
      );
    });

    const deleted_document = await Models[
      collection
    ].findByIdAndDelete(req.params.id);

    if (!deleted_document) {
      return next(
        new _Error(
          `No document found with ID : ${req.params.id}`,
          404
        )
      );
    }

    res.status(204).json({
      status: 201,
      data: {},
      message: `${req.params.id} :  ${collection} deleted successfully`,
    });
  });
