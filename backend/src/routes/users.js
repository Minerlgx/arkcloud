"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const db_1 = require("../lib/db");
const crypto_1 = __importDefault(require("crypto"));
const router = (0, express_1.Router)();
// 注册
router.post('/register', async (req, res) => {
    try {
        const { email, password, name, company } = req.body;
        const existing = await db_1.prisma.user.findUnique({ where: { email } });
        if (existing)
            return res.status(400).json({ error: 'Email already registered' });
        const hashedPassword = crypto_1.default.createHash('sha256').update(password).digest('hex');
        const user = await db_1.prisma.user.create({
            data: { email, password: hashedPassword, name, company }
        });
        res.json({ user: { id: user.id, email: user.email, name: user.name } });
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to register' });
    }
});
// 登录
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const hashedPassword = crypto_1.default.createHash('sha256').update(password).digest('hex');
        const user = await db_1.prisma.user.findUnique({ where: { email } });
        if (!user || user.password !== hashedPassword) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }
        res.json({ user: { id: user.id, email: user.email, name: user.name, role: user.role } });
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to login' });
    }
});
// 获取所有用户 (管理员)
router.get('/', async (req, res) => {
    try {
        const users = await db_1.prisma.user.findMany({
            select: { id: true, email: true, name: true, company: true, role: true, status: true, createdAt: true }
        });
        res.json({ users });
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to fetch users' });
    }
});
exports.default = router;
//# sourceMappingURL=users.js.map