const adminAuth= function(req, res, next) {
  console.log("Admin Middleware is called");
  const token = "xyz";
  const isAdminAuthorised = token === "xyz";
  if (!isAdminAuthorised) {
    return res.status(403).send("Unauthorized access");
  } else {
    next();
  }
}

const userAuth= function(req, res, next) {
  console.log("User Middleware is called");
  const token = "xyz";
  const isuserAuthorised = token === "xyz";
  if (!isuserAuthorised) {
    return res.status(403).send("Unauthorized access");
  } else {
    next();
  }
}
module.exports = {adminAuth,userAuth};