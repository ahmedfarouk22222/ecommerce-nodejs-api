const asyncHandler = require("express-async-handler");
const ApiError = require("../utils/api_error");

exports.deleteOne = (model) =>
  asyncHandler(async (req, res, next) => {
    const { id } = req.params;
    const deleteDocument = await model.findByIdAndDelete(id);

    if (!deleteDocument) {
      return next(new ApiError(`Document not found by this id: ${id}`, 404));
    }
    res.status(204).send();
  });
exports.updateOne = (model) =>
  asyncHandler(async (req, res, next) => {
    const updateDocument = await model.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
      },
    );

    if (!updateDocument) {
      return next(
        new ApiError(`Brand not found by this id: ${req.params.id}`, 404),
      );
    }

    res.status(200).json({ data: updateDocument });
  });
