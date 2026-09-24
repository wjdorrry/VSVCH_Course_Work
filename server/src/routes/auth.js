import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { Role, User } from '../models/index.js';
import { requireAuth } from '../middleware/auth.js';

const router = express.Router();
const secret = process.env.JWT_SECRET || 'course-project-secret-change-me';

function safeUser(user) {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    phone: user.phone,
    role: user.Role?.name,
  };
}

router.post('/register', async (req, res) => {
  try {
    const { name, email, password, phone } = req.body;
    if (!name || !email || !password) return res.status(400).json({ message: 'Заполните обязательные поля' });
    if (password.length < 6) return res.status(400).json({ message: 'Пароль должен содержать минимум 6 символов' });

    const exists = await User.findOne({ where: { email: email.toLowerCase() } });
    if (exists) return res.status(409).json({ message: 'Пользователь с таким email уже существует' });

    const clientRole = await Role.findOne({ where: { name: 'CLIENT' } });
    const user = await User.create({
      name,
      email: email.toLowerCase(),
      phone: phone || null,
      passwordHash: await bcrypt.hash(password, 10),
      roleId: clientRole.id,
    });
    await user.reload({ include: Role });
    const token = jwt.sign({ userId: user.id }, secret, { expiresIn: '7d' });
    res.status(201).json({ token, user: safeUser(user) });
  } catch (error) {
    res.status(500).json({ message: 'Ошибка регистрации' });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ where: { email: String(email || '').toLowerCase() }, include: Role });
    if (!user || !(await bcrypt.compare(password || '', user.passwordHash))) {
      return res.status(401).json({ message: 'Неверный email или пароль' });
    }
    const token = jwt.sign({ userId: user.id }, secret, { expiresIn: '7d' });
    res.json({ token, user: safeUser(user) });
  } catch (error) {
    res.status(500).json({ message: 'Ошибка авторизации' });
  }
});

router.get('/me', requireAuth, async (req, res) => {
  res.json({ user: safeUser(req.user) });
});

export default router;
