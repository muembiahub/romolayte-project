const requireApiAuth = (req, res, next) => {
  if (!req.session?.user?.uid) {
    return res.status(401).json({
      success: false,
      message: "Authentification requise"
    });
  }

  next();
};

export default requireApiAuth;