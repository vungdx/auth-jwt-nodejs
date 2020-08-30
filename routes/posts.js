const router = require('express').Router();
const verify = require("../routes/verifyToken")

router.get("/", verify, (req, res) => {
    res.json({
        posts: {
            title: 'my first post',
            description: 'random data you should access'
        }
    })
})

module.exports = router;