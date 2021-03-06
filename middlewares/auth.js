const jwt = require("jsonwebtoken");
const ErrorResponse = require("../utils/errorResponse");
const User = require("../models/User");

//Protect routes
exports.protect = async (req, res, next) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    //set token from header
    token = req.headers.authorization.split(" ")[1];
  }
  //set token from cookie
  //   else if (req.cookies.token) {
  //     token = req.cookies.token;
  //   }

  //Make sure token exists
  if (!token)
    return next(new ErrorResponse(`Not authorized to access this route`, 401));

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id);
    next();
  } catch (e) {
    return next(new ErrorResponse(`Not authorized to access this route`, 401));
  }
};

//Grant access to specific roles
exports.authorize = (...roles) => (req, res, next) => {
  if (!roles.includes(req.user.role))
    return next(
      new ErrorResponse(
        `User role ${req.user.role} is unauthorized to access this route`,
        403
      )
    );
  next();
};
