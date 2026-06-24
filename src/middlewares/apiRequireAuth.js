export const requireApiAuth = (req, res, next) => {
  if (!req.session?.user?.uid) {
    return res.status(401).json({
      success: false,
      message: "Authentification requise"
    });
  }

  next();
};

export const requireApiAdmin = (req, res, next) => {
  if (!req.session?.user?.uid) {
    return res.status(401).json({
      success: false,
      message: "Authentification requise"
    });
  }

  if (!req.session.user.admin) {
    return res.status(403).json({
      success: false,
      message: "Vous n'avez pas les droits pour cette action"
    });
  }

  next();
};