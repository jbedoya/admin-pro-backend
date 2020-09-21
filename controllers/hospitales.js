const { response } = require("express");

const Hospital = require('../models/hospital');

const getHospitales = async (req, res = response) => {

    const hospitales = await Hospital.find()
                                     .populate('usuario', 'nombre img');

    res.json({
        ok: true,
        hospitales
    })
}

const crearHospital = async (req, res = response) => {

    const uid = req.uid;
    const hospital = new Hospital ( {
        usuario: uid,
        ...req.body} );

    console.log(uid);
    
    try {

        const hospitalDB = await hospital.save();


        return res.json({
            ok: true,
            hospital: hospitalDB
        })
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Error al crear hospital'
        })
    }
    
}

const actualizarHospital = (req, res = response) => {
    res.json({
        ok: true,
        msg: 'Actualizar Hospital'
    })
}

const borrarHospital = (req, res = response) => {
    res.json({
        ok: true,
        msg: 'Borrar Hospital'
    })
}

module.exports = {
    getHospitales,
    crearHospital,
    actualizarHospital,
    borrarHospital
}