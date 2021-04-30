const userController = require("./userController");

let login = (req, res) => {
    let details = req.body;
    userController.getUser({
        username: details.username,
        password: details.password
    }).then(user => {
        res.json({
            code: 200,
            data: {
                username: user.username,
                likes: user.likes,
                dislikes: user.dislikes,
                id: user._id,
                name: user.name
            },
            message: "Login successfull"
        });
    }).catch(err => {
        res.json({
            code: 402,
            message: "Wrong Credentials"
        });
    });
}

let register = (req, res) => {
    let details = req.body;
    userController.getUser({
        username: details.username
    }).then(_ => {
        res.json({
            code: 403,
            message: "Username already taken"
        });
    }).catch(_ => {
        userController.addUser(details).then(user => {
            res.json({
                code: 200,
                data: {
                    username: user.username,
                    likes: user.likes,
                    dislikes: user.dislikes,
                    id: user._id,
                    name: user.name
                },
                message: "Registeration successfull"
            });
        }).catch(_ => {
            res.json({
                code: 409,
                message: "Wasn't able to register, please try again"
            });
        });
    });
}

module.exports = {
    login,
    register
};