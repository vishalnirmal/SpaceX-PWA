const router = require("express").Router();
const mainController = require("../controller/mainController");
router.get("/", mainController.home);
router.get("/falcon-9", mainController.falcon9);
router.get("/falcon-heavy", mainController.falconHeavy);
router.get("/dragon", mainController.dragon);
router.get("/starship", mainController.startship);
router.get("/journey", mainController.journey);

module.exports = router;