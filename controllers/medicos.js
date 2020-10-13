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

const getMedicosById = async (req, res = response) => {

    const id = req.params.id;

    try {
        
        const medico = await Medico.findById(id)
                                    .populate('usuario', 'nombre img')
                                    .populate('hospital', 'nombre img');
    
        res.json({
            ok: true,
            medico
        })
        
    } catch (error) {
        console.log(error);
        res.json({
            ok: false,
            msg: ''
        })
    }
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

const actualizarMedico = async (req, res = response) => {

    const id  = req.params.id;
    const uid = req.uid;

    try {
        const medicoDB = await Medico.findById(id);

        if ( !medicoDB ) {
            return res.status(404).json({
                ok: false,
                msg: 'Medico no encontrado por Id'
            });           
        }

        const cambiosMedico = {
            ... req.body,
            usuario: uid
        }

        const medicoActualizado = await Medico.findByIdAndUpdate( id, cambiosMedico, { new: true });

        res.json({
            ok: true,
            medico: medicoActualizado
        }) 

    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Error al actualizar Medico'
        });
    }

}

const borrarMedico = async (req, res = response) => {

    const id  = req.params.id;

    try {
        const medicoDB = await Medico.findById(id);

        if ( !medicoDB ) {
            return res.status(404).json({
                ok: false,
                msg: 'Medico no encontrado por Id'
            });           
        }

        await Medico.findByIdAndDelete( id );

        res.json({
            ok: true,
            msg: 'Medico eliminado'
        }) 

    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Error al eliminar Medico'
        });
    }
}

module.exports = {
    getMedicos,
    crearMedico,
    actualizarMedico,
    borrarMedico,
    getMedicosById
}