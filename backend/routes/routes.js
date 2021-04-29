const router = require("express").Router();
const mainController = require("../controller/mainController");
const loginController = require("../controller/loginController");
const apiController = require("../controller/apiController");

router.get("/", mainController.home);
router.get("/falcon-9", mainController.falcon9);
router.get("/falcon-heavy", mainController.falconHeavy);
router.get("/dragon", mainController.dragon);
router.get("/starship", mainController.startship);
router.get("/journey", mainController.journey);
router.get("/fallback", mainController.fallback);
router.route("/user/login")
    .get(mainController.login)
    .post(loginController.login);
router.route("/user/register")
    .get(mainController.register)
    .post(loginController.register);
router.route("/api/comments/addComment")
    .post(apiController.addComment);
router.route("/api/comments/deleteComment")
    .post(apiController.deleteComment);
router.route("/api/comments/getComments/:post_id")
    .get(apiController.getComments);
router.route("/api/comments/getComments/:post_id/:id")
    .get(apiController.getComments);
router.route("/api/comments/updateComment/:type")
    .post(apiController.updateComment);
router.route("/api/posts/addPost")
    .post(apiController.addPost);
router.route("/api/posts/getPost")
    .post(apiController.getPost);
router.route("/api/posts/deletePost")
    .post(apiController.deletePost);



module.exports = router;