const { response } = require('express');
const bcrypt = require('bcryptjs');

const Usuario = require('../models/usuario');
const { generarJWT } = require('../helpers/jwt');
const { googleVerify } = require('../helpers/google-verify');

const login = async( req, res= response ) => {

    const { email, password } = req.body;
    try {

        // Verificar email
        const usuarioDB = await Usuario.findOne({ email });

        if(!usuarioDB) {
            return res.status(404).json({
                ok: false,
                msg: 'Email no se encontro'
            })
        }

        // Verificar contraseña
        const validPassword = bcrypt.compareSync( password, usuarioDB.password );
        if ( !validPassword ) {
            return res.status(400).json({
                ok: false,
                msg: 'Contraseña no es valida'
            })            
        }

        // Generar Token
        const token = await generarJWT(usuarioDB.id);

        return res.json({
            ok: true,
            token
        })
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Algo fallo..'
        })
    }
}

const googleSignIn = async (req, res = response) => {

    const googleToken = req.body.token;

    try {
        const {name, email, picture} = await googleVerify( googleToken);

        const usuarioDB = await Usuario.findOne({ email });
        let usuario;

        if ( !usuarioDB ) {
            // Si no existe el usuario
            usuario = new Usuario({
                nombre: name,
                email,
                password: '@@@',
                img: picture,
                google: true
            });
        } else {
            // Existe el usuario
            //console.log(usuarioDB);
            usuario = usuarioDB;
            usuario.google = true;
        }

        // guardar en DB
        await usuario.save();

        // Generar Token
        const token = await generarJWT(usuario.id);

        res.json({
            ok: true,
            token
        });
    } catch (error) {
        console.log(error);
        res.status(401).json({
            ok: false,
            msg: 'Token de Google no es correcto'
        });
    }
}

const renewToken = async (req, res = response) => {

    const uid = req.uid;

    // Generar Token
    const token = await generarJWT(uid);

    res.json({
        ok: true,
        token
    });
}


module.exports = {
    login,
    googleSignIn,
    renewToken
}