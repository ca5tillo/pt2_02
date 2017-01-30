
var Controles = { 
    gui:null,
    _botones:{
        preparar     :{ isEnabled:false,  btn:null },
        animar       :{ isEnabled:false, btn:null },
        pasoApaso    :{ isEnabled:false, btn:null },
        pausa        :{ isEnabled:false, btn:null },
        reiniciar    :{ isEnabled:false, btn:null },
        velocidad    :{ isEnabled:false, btn:null },
        npasos       :{ isEnabled:false, btn:null },
        fullScreen   :{ isEnabled:false, btn:null },
        opacidad     :{ isEnabled:false, btn:null },
        opacidad     :{ isEnabled:false, btn:null },
    },
    _activar : function(key){
        Controles._botones[key].isEnabled  = true;
        Controles._botones[key].btn.__li.setAttribute("style", "border-left: 3px solid #1ed36f;");         
    },
    _desactivar : function(key){
        Controles._botones[key].isEnabled  = false;
        Controles._botones[key].btn.__li.setAttribute("style", "border-left: 3px solid red;"); 
    },
    getVelocidad : function(){
        let velocidad = 100;
        if( Controles.funcion.Velocidad == 10 ){
            velocidad = 100;
        }else{
            velocidad = 5000/Controles.funcion.Velocidad;
        }
        console.log(velocidad)
        return velocidad;
    },
    activar__botones    : function(){// Al terminar una animacion se llama esta funcion
        // La primeta activacion la tiene en el modelo librerias al terminar la animacion
        Controles._activar("animar");
        Controles._activar("pasoApaso");
        Controles._activar("reiniciar");

        //ctrl_fun_Activa__Ejemplos  ();

        if(this.gui.closed){
            $(".close-button").css({"background-color": "#000", "color": "#eee"}); 
        }
    },
    desactivar__botones : function(){
        Controles._desactivar("pasoApaso");
        Controles._desactivar("animar");
        Controles._desactivar("reiniciar");

        //ctrl_fun_desactiva__Ejemplos  ();

        if(this.gui.closed){
            $(".close-button").css({"background-color": "red", "color": "#000"}); 
        }
    },
    funcion             : {
        Velocidad       : 10,
        Pasos           : 0,
        Mensaje         : "Hola mundo",
        FullScreen      : true, // para el editor
        Opacidad        : 0,// para el editor
        Comodin         : function(){
            
            console.log(Controles.getVelocidad());
        },
        Preparar        : function(){
            if(Controles._botones.preparar.isEnabled){
                if(Main.preparar()){
                    this.pasos = 0;
                    Controles._desactivar("preparar");
                }
            }
        },
        Animar          : function () {
            if(Controles._botones.animar.isEnabled){

                Controles.desactivar__botones();
                Controles._activar("pausa");

                Main.animacionFluida();
            }
        },
        'Paso a paso'   : function () {
            if(Controles._botones.pasoApaso.isEnabled){
                Controles.funcion.pasos += 1; 
                Controles.desactivar__botones();
                Main.pasoApaso();               
            }
        },
        Pausa           :function (){
            if(Controles._botones.pausa.isEnabled){                
                Controles._desactivar("pausa");
                Main.pausa();                
            }            
        },
        Reiniciar       :function (){
            if(Controles._botones.reiniciar.isEnabled){
                Controles.desactivar__botones();                              
                Controles._desactivar("pausa");
                Controles._activar("preparar");
                $(".close-button").css({"background-color": "#000", "color": "#eee"}); 
                //ctrl_fun_Activa__Ejemplos  ();
                

                Main.reiniciar();
            }
        },
    },
    

};
Controles.setupControles = function (){
    this.gui = new dat.GUI();
    $(".dg.ac").css( "z-index", "11" );// tiene valor de 11 ya que el editor de texto es de 10

    this.gui.add(this.funcion,"Comodin");
    this.gui.add(this.funcion,"Mensaje");

    /***************************************************************************************************/
    let f1                        = this.gui.addFolder('Animacion');
    this._botones.preparar.btn    = f1.add(this.funcion, 'Preparar');
    this._botones.animar.btn      = f1.add(this.funcion, 'Animar');
    this._botones.pasoApaso.btn   = f1.add(this.funcion, 'Paso a paso');
    this._botones.pausa.btn       = f1.add(this.funcion, 'Pausa');
    this._botones.reiniciar.btn   = f1.add(this.funcion, 'Reiniciar');
    this._botones.velocidad.btn   = f1.add(this.funcion, 'Velocidad').min(1).max(10).step(1);
    this._botones.npasos.btn      = f1.add(this.funcion, 'Pasos').listen();
    this._activar("preparar");


    let f2 = this.gui.addFolder('Editor');
    this._botones.fullScreen.btn = f2.add(this.funcion, 'FullScreen');
    this._botones.opacidad.btn   = f2.add(this.funcion, 'Opacidad').min(0).max(1).step(.1);

    this._botones.fullScreen.btn.onFinishChange(function(value) {
        javaEditor.setOption("fullScreen", Controles.funcion.FullScreen)
    });
    this._botones.opacidad.btn.onChange(function(value) {
        $(".CodeMirror").css({ "background":'rgba(0,0,0,'+Controles.funcion.Opacidad+')' });
    });


    f1.open();
    f2.open();
}


