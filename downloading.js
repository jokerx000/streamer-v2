const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const { getFullLink } = require('./dist/getlink.js');

const router = express.Router();

function containsOnlyNumbers(str) {
    return /^\d+$/.test(str);
}

const dwnp = createProxyMiddleware({
    changeOrigin: true,
    ws: false,
    target: 'https://cdn.discordapp.com/attachments/',
    pathRewrite: async (path, req) => {
        const { cid, fid } = req.params;
        const parameters = await getFullLink(`https://cdn.discordapp.com/attachments/${cid}/${fid}/blob`);
        const fullpath = parameters.split('?')[1];
        // console.log(parameters);
        return `${cid}/${fid}/blob?${fullpath}`;
    },
    logger: console,
})
router.get('/:cid/:fid', (req, res, next) => {
    const { cid, fid } = req.params;
    if (containsOnlyNumbers(cid) && containsOnlyNumbers(fid) && cid.length === 19 && fid.length === 19) {
        res.setHeader('Access-Control-Allow-Origin', '*');
        next();
    } else {
        return res.status(400).send("Bad parameters");
    }
}, dwnp)

module.exports = router;