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
