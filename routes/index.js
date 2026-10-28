const categoryRoute = require("./category/category_route");
const subCategoryRoute = require("./category/sub_category_route");
const brandRoute = require("./brand/brands_route");
const productRoute = require("./product/product_route");
const UserRoute = require("./user/user_route");
const AuthRoute = require("./auth/auth_route");
const ReviewsRoute = require("./reviews/reviews_route");
const AddToWishListRoute = require("./user/add_to_wishlist");
const AddToAddressesRoute = require("./user/addreses_route");
const CouponeRoute = require("./coupon/coupon_route");
const cartRoute = require("./cart/cart_route");

const mountRoutes = (app) => {
  app.use("/api/v1/subcategories", subCategoryRoute);
  app.use("/api/v1/Brands", brandRoute);
  app.use("/api/v1/Products", productRoute);
  app.use("/api/v1/Users", UserRoute);
  app.use("/api/v1/auth", AuthRoute);
  app.use("/api/v1/Reviews", ReviewsRoute);
  app.use("/api/v1/wishlist", AddToWishListRoute);
  app.use("/api/v1/addresses", AddToAddressesRoute);
  app.use("/api/v1/coupons", CouponeRoute);
  app.use("/api/v1/cart", cartRoute);
};
module.exports = mountRoutes;
