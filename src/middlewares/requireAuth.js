const requireAuth = (req, res, next) => {
  // ✅ Vérifie si une session utilisateur existe
  if (!req.session || !req.session.user) {
    return res.redirect("/auth");
  }

  next();
};

export default requireAuth;