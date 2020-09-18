const Usuarios = require('../models/Usuarios');
const enviarEmail = require('../handlers/emails');

exports.formCrearCuenta = (req,res) => {
    res.render ('crear-cuenta',{
        nombrePagina : 'Crea tu cuenta'
    })
}

exports.crearNuevaCuenta = async(req,res) => {
    const usuario = req.body;

    req.checkBody('confirmar', 'El password confirmado no puede ir vacio').notEmpty();
    req.checkBody('confirmar', 'El password es diferente').equals(req.body.password);

    //leer los errores de express
    const erroresExpress = req.validationErrors();

    // console.log(erroresExpress);

    //console.log(usuario);
    
    try {
        await Usuarios.create(usuario);

        //Url de confirmación
        const url = `http://${req.headers.host}/confirmar-cuenta/${usuario.email}`;

        //enviar email de confirmacion
        enviarEmail.enviarEmail({
            usuario,
            url,
            subject : 'confirma tu cuenta de Meeti',
            archivo : 'confirmar-cuenta'
        })

        //FLASh message
        req.flash('exito','hemos enviado un E-mail, confirma tu cuenta');
        res.redirect('/iniciar-sesion');

        //console.log('Usuario creado', nuevoUsuario);
        
    } catch (error) {
        // console.log(error.errors);
        
        // Extraer el message de los errores
        const erroresSequelize = error.errors.map(err => err.message);
        // console.log(erroresSequelize);
        // Extraer el msg de los errores
        const errExp = erroresExpress.map(err => err.msg);
        // console.log(errExp);
        // Unir los mensajes message y msg
        const listaErrores =[...erroresSequelize, ...errExp];
        
        req.flash('error', listaErrores);
        res.redirect('/crear-cuenta');

    }

    // //TODO : Flash message y redireccionamiento
    // console.log('Usuario creado', nuevoUsuario);
}

//confirmar la suscripcion del usuario
exports.confirmarCuenta = async (req,res,next) => {
    //verificar que el usuario existe
    const usuario = await Usuarios.findOne({ where : { email: req.params.correo }});

    //sino xiste redirecciona
    if(!usuario){
        req.flash('error', 'No existe esa cuenta');
        res.redirect('/crear-cuenta');
        return next();
    }
}

//formulario para iniciar sesion 
exports.formIniciarSesion =(req,res) => {
    res.render('iniciar-sesion',{ 
        nombrePagina : 'Iniciar Sesión'
    })
}