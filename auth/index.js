const router = require("express").Router();
const User = require("../models/User");
const jwt = require("jsonwebtoken");
const { OAuth2Client } = require("google-auth-library");
const roles = require("./roles");
const client = new OAuth2Client(process.env.CLIENT_ID);

router.post("/google/login", async (req, res) => {
  try {
    const { tokenId } = req.body;
    let resp = await client.verifyIdToken({
      idToken: tokenId,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const { email_verified, given_name, family_name, picture, email } =
      resp.payload;

    if (email_verified) {
      User.findOne({
        email,
      }).exec((err, user) => {
        if (err) res.status(400).send("Something went wrong");
        if (user) {
          const payload = {
            id: user._id,
            email: user.email,
            name: user.firstName + " " + user.lastName,
            avatar: user.avatar,
            role: user.role,
          };

          jwt.sign(
            payload,
            process.env.JWT_SECRET,
            { expiresIn: 2000 },
            (err, token) => {
              if (err) throw err;
              return res.json({ success: true, token });
            }
          );
        } else {
          let newUser = new User({
            firstName: given_name,
            lastName: family_name,
            email: email,
            password: email + given_name + process.env.JWT_SECRET,
            role: roles.USER,
            avatar: picture,
          });

          newUser
            .save()
            .then((user) => {
              const payload = {
                id: user._id,
                email: user.email,
                name: user.firstName + " " + user.lastName,
                avatar: user.avatar,
                role: user.role,
              };

              jwt.sign(
                payload,
                process.env.JWT_SECRET,
                { expiresIn: 2000 },
                (err, token) => {
                  if (err) throw err;
                  return res.json({ success: true, token });
                }
              );
            })
            .catch((err) => {
              console.log(err);
              res.status(500).json({ message: "internal Server Error" });
            });
        }
      });
    }
  } catch (error) {
    console.log(error);
    res.status(400).send({ message: "Internal Server Error" });
  }
});

module.exports = router;
