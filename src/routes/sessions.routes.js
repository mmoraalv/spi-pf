import { Router } from "express";
import { userModel } from "../models/users.model.js";
import { validatePassword } from "../utils/bcrypt.js";
import passport from "passport";

const sessionRouter = Router();

//Session
sessionRouter.get('/logout', (req,res) => {
    try {
        if (req.session.login){
            req.session.destroy();
        }
        res.redirect("/static/login");
    } catch (error) {
        res.status(400).send({ error: `Error al terminar sesion: ${error} `});
    }
});

 /*const {email,password} = req.body
    try {
        if(req.session.login)
            res.status(200).send({ error: `Login ya existente`});
        const user = await userModel.findOne({email: email});
        if(user) {
            if (validatePassword(password, user.password)) {
                req.session.login = true;
                res.redirect(`/static/products?info=${user.first_name}`);
                return;
            } else {
                res.send("login", { message: 'Password Incorrecto'});
            }
        }else {
            res.status(404).send({ error: 'Usuario no existe'});
        }
    } catch(error) {
        res.render("login", { message: "Error en login"})
    }*/

sessionRouter.post('/login', passport.authenticate('login'), async (req, res) => {
    try {
        if (!req.user) {
            return res.status(401).send({ mensaje: "Invalidate user" })
        }

        req.session.user = {
            first_name: req.user.first_name,
            last_name: req.user.last_name,
            age: req.user.age,
            email: req.user.email
        }

        res.status(200).send({ payload: req.user })
    } catch (error) {
        res.status(500).send({ mensaje: `Error al iniciar sesion ${error}` })
    }
})

sessionRouter.get('/github', passport.authenticate('github', { scope: ['user:email'] }), async (req, res) => {
    res.status(200).send({ mensaje: 'Usuario creado' })
})

sessionRouter.get('/githubSession', passport.authenticate('github'), async (req, res) => {
    req.session.user = req.user
    res.status(200).send({ mensaje: 'Session creada' })
})

export default sessionRouter