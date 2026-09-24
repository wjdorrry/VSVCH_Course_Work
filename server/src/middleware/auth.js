import jwt from 'jsonwebtoken';
import { User, Role } from '../models/index.js';

const secret = process.env.JWT_SECRET || 'course-project-secret-change-me';

export async function requireAuth(req, res, next) {
  try {
    const header = req.headers.authorization || '';
    const token = header.startsWith('Bearer ') ? header.slice(7) : null;
    if (!token) return res.status(401).json({ message: 'Требуется авторизация' });

    const payload = jwt.verify(token, secret);
    const user = await User.findByPk(payload.userId, { include: Role });
    if (!user) return res.status(401).json({ message: 'Пользователь не найден' });

    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Недействительный токен' });
  }
}

export function requireManager(req, res, next) {
  if (req.user?.Role?.name !== 'MANAGER') {
    return res.status(403).json({ message: 'Доступ только для менеджера' });
  }
  next();
}
