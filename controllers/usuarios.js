const { response } = require('express');
const bcrypt = require('bcryptjs');

const Usuario = require('../models/usuario');
const usuario = require('../models/usuario');
const { generarJWT } = require('../helpers/jwt');

const getUsuarios = async(req, res) => {

    const desde = Number(req.query.desde) || 0;

    // const usuarios = await Usuario
    //                         .find({}, ' nombre email role google')
    //                         .skip( desde )
    //                         .limit( 5 );
    // const total = await Usuario.count();

    const [usuarios, total] = await Promise.all([
        Usuario
            .find({}, ' nombre email role google img')
            .skip( desde )
            .limit( 5 ),

        Usuario.count()
    ]);


    res.json({
        ok: true,
        usuarios,
        total
    });
}

const crearUsuario = async(req, res = response) => {

    const { password, email } = req.body;

     try {

        const existeEmail = await Usuario.findOne({ email });

        if ( existeEmail ) {
            res.status(400).json({
                ok: false,
                msg: 'Error: El email ya existe '
            });
        }
        
        const usuario = new Usuario( req.body );

        // encriptar contraseña
        const salt = bcrypt.genSaltSync();
        usuario.password = bcrypt.hashSync( password, salt )

        // guardar usuario
        await usuario.save();

        // Generar Token
        const token = await generarJWT(usuario.id);
        res.json({
            ok: true,
            usuario,
            token
        });  
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Error inesperado... revisar Logs '
        });
    }

}

const actualizarUsuario = async(req, res = response) => {
    // TODO: Validar token y comprobar si es el usuario correcto
    const uid = req.params.id;

    try {
        
        const usuarioDB = await Usuario.findById( uid );

        if(!usuarioDB) {
            return res.status(404).json({
                ok: false,
                msg: 'Usuario no encontrado '
            });
        }

        // Actualizaciones
        const { password, google, email, ...campos } = req.body;

        if( usuarioDB.email !== email ) {
            const existeEmail = await Usuario.findOne({email});
            if ( existeEmail ) {
                return res.status(400).json({
                    ok: false,
                    msg: 'Ya existe un usuario con ese email '
                });
            }
        }

        campos.email = email;
        const usuarioActualizado = await usuario.findByIdAndUpdate( uid, campos, { new: true } );


        res.json({
            ok: true,
            usuario: usuarioActualizado
        });         
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            ok: false,
            msg: 'Error inesperado... revisar Logs '
        });
    }
}

const borrarUsuario = async(req, res = response) => {
    const uid = req.params.id;
    try {

        const usuarioDB = await Usuario.findById( uid );

        if(!usuarioDB) {
            return res.status(404).json({
                ok: false,
                msg: 'Usuario no encontrado '
            });
        }

        await Usuario.findByIdAndDelete( uid );

        return res.status(500).json({
            ok: true,
            msg: 'Usuario eliminado'
        });        
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            ok: false,
            msg: 'Error inesperado... revisar Logs '
        });       
    }

}

module.exports = {
      getUsuarios, 
      crearUsuario,
      actualizarUsuario,
      borrarUsuario
}