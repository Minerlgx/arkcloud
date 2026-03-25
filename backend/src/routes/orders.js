"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const db_1 = require("../lib/db");
const crypto_1 = __importDefault(require("crypto"));
const router = (0, express_1.Router)();
// 创建订单
router.post('/', async (req, res) => {
    try {
        const { userId, productId, quantity = 1, billingCycle } = req.body;
        const product = await db_1.prisma.product.findUnique({ where: { id: productId } });
        if (!product)
            return res.status(404).json({ error: 'Product not found' });
        // 计算价格
        let basePrice = billingCycle === 'MONTHLY' ? product.priceMonthly
            : billingCycle === 'QUARTERLY' ? product.priceMonthly * 3
                : billingCycle === 'YEARLY' ? product.priceMonthly * 12
                    : product.priceHourly;
        let discount = 1;
        if (billingCycle === 'MONTHLY')
            discount = 0.86;
        else if (billingCycle === 'QUARTERLY')
            discount = 0.80;
        else if (billingCycle === 'YEARLY')
            discount = 0.75;
        const totalPrice = basePrice * quantity * discount;
        // 生成实例信息
        const instances = [];
        for (let i = 0; i < quantity; i++) {
            instances.push({
                userId,
                productId,
                productName: product.name,
                status: 'PENDING', // 支付后变成 RUNNING
                ipAddress: `203.0.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`,
                port: 22,
                password: crypto_1.default.randomBytes(8).toString('hex'),
            });
        }
        const order = await db_1.prisma.order.create({
            data: {
                userId,
                billingCycle,
                totalAmount: totalPrice,
                status: 'PENDING',
                items: {
                    create: { productId, price: basePrice * discount, quantity }
                },
                instances: {
                    create: instances
                }
            },
            include: { instances: true, items: { include: { product: true } } }
        });
        res.json({ order, instance: order.instances[0] });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to create order' });
    }
});
// 获取用户订单
router.get('/user/:userId', async (req, res) => {
    try {
        const orders = await db_1.prisma.order.findMany({
            where: { userId: req.params.userId },
            include: { items: { include: { product: true } }, instances: true },
            orderBy: { createdAt: 'desc' }
        });
        res.json({ orders });
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to fetch orders' });
    }
});
// 支付订单
router.post('/:id/pay', async (req, res) => {
    try {
        const order = await db_1.prisma.order.update({
            where: { id: req.params.id },
            data: { status: 'PAID' },
            include: { instances: true }
        });
        // 激活实例
        await db_1.prisma.instance.updateMany({
            where: { orderId: req.params.id },
            data: {
                status: 'RUNNING',
                startedAt: new Date()
            }
        });
        res.json({ success: true, order });
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to pay order' });
    }
});
exports.default = router;
//# sourceMappingURL=orders.js.map