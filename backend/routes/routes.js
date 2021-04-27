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
router.route("/api/comments/updateComment")
    .post(apiController.updateComment);
router.route("/api/comments/deleteComment")
    .post(apiController.deleteComment);
router.route("/api/comments/getComments/:post_id")
    .get(apiController.getComments);
router.route("/api/comments/getComments/:post_id/:id")
    .get(apiController.getComments);
router.route("/api/comments/addLike")
    .post(apiController.addLike);
router.route("/api/comments/removeLike")
    .post(apiController.removeLike);
router.route("/api/comments/addDislike")
    .post(apiController.addDislike);
router.route("/api/comments/removeDislike")
    .post(apiController.removeDislike);
router.route("/api/posts/addPost")
    .post(apiController.addPost);
router.route("/api/posts/getPost")
    .post(apiController.getPost);
router.route("/api/posts/deletePost")
    .post(apiController.deletePost);



module.exports = router;