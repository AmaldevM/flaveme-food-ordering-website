const jwt = require("jsonwebtoken");


const authRest = async (req, res, next) => {
    try {
       // Log cookies to check if token is present
       console.log(req.cookies);

        // Retrieve token from cookies or Authorization header
        let token = req.cookies.token;
        if (!token && req.headers.authorization) {
          const authHeader = req.headers.authorization;
          token = authHeader.startsWith("Bearer ") ? authHeader.split(" ")[1] : authHeader;
        }

        if (!token) {
          return res
            .status(401)
            .json({ success: false, message: "unauthoraized restaurant" });
        }
        // verify token using jwt verify
        const verifiedToken = jwt.verify(token, process.env.RESTAURANT_JWT_SECRET_KEY);
    
        if (!verifiedToken) {
          return res
            .status(401)
            .json({ succuss: false, message: "unauthoraized restaurant" });
        }
        // to get restaurant data from jwt
        req.restaurant = verifiedToken;
        // next middleware function
        next();
      } catch (error) {
        res
        .status(error.status || 500)
        .json({ message: error.message || "interal server error" });
      }
    };

module.exports = { authRest };