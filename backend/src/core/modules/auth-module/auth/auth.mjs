import jwt from 'jsonwebtoken';

export const authenticateToken = (req, res, next) => {
  let token = null;
  const authHeader = req.headers['authorization'];

  if (authHeader) {
    token = authHeader.split(' ')[1];
  } else if (req.cookies && req.cookies.token) {
    token = req.cookies.token;
    req.headers['authorization'] = `Bearer ${token}`;
  }

  if (token == null) return res.sendStatus(401);

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
};