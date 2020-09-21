const { response } = require("express")

const Medico = require('../models/medico');

const getMedicos = async (req, res = response) => {

    const medicos = await Medico.find()
                                .populate('usuario', 'nombre')
                                .populate('hospital', 'nombre');

    res.json({
        ok: true,
        medicos
    })
}

const crearMedico = async (req, res = response) => {

    const uid = req.uid;
    const medico = new Medico({
        usuario: uid,
        ...req.body });

    console.log(uid);
    
    try {

        const medicoDB = await medico.save();

        return res.json({
            ok: true,
            medico: medicoDB
        })
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Error al crear medico'
        })
    }

}

const actualizarMedico = (req, res = response) => {
    res.json({
        ok: true,
        msg: 'Actualizar Medico'
    })
}

const borrarMedico = (req, res = response) => {
    res.json({
        ok: true,
        msg: 'Borrar Medico'
    })
}

module.exports = {
    getMedicos,
    crearMedico,
    actualizarMedico,
    borrarMedico
}