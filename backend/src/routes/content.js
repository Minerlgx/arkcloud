"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const db_1 = require("../lib/db");
const router = (0, express_1.Router)();
// 获取内容
router.get('/', async (req, res) => {
    try {
        const contents = await db_1.prisma.siteContent.findMany();
        const result = {};
        contents.forEach(c => { result[c.key] = c.value; });
        res.json(result);
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to fetch content' });
    }
});
// 更新内容
router.put('/:key', async (req, res) => {
    try {
        const content = await db_1.prisma.siteContent.upsert({
            where: { key: req.params.key },
            create: { key: req.params.key, value: req.body.value },
            update: { value: req.body.value }
        });
        res.json(content);
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to update content' });
    }
});
exports.default = router;
//# sourceMappingURL=content.js.map