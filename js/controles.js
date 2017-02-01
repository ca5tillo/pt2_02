
var Controles = { 
    gui                   : null,
    _botones              : {
        preparar     :{ isEnabled:false, btn:null },
        animar       :{ isEnabled:false, btn:null },
        pasoApaso    :{ isEnabled:false, btn:null },
        pausa        :{ isEnabled:false, btn:null },
        reiniciar    :{ isEnabled:false, btn:null },
        velocidad    :{ isEnabled:false, btn:null },
        npasos       :{ isEnabled:false, btn:null },
        fullScreen   :{ isEnabled:false, btn:null },
        opacidad     :{ isEnabled:false, btn:null },
        opacidad     :{ isEnabled:false, btn:null },
        ejemplos     :{ isEnabled:false, eje: []  },
        tema         :{ isEnabled:false, btn:null },
    },
    _activar              : function(key){
        Controles._botones[key].isEnabled  = true;
        Controles._botones[key].btn.__li.setAttribute("style", "border-left: 3px solid #1ed36f;");         
    },
    _desactivar           : function(key){
        Controles._botones[key].isEnabled  = false;
        Controles._botones[key].btn.__li.setAttribute("style", "border-left: 3px solid red;"); 
    },
    _activar_Ejemplos     : function(){
        this._botones.ejemplos.isEnabled = true;
        for(let i of this._botones.ejemplos.eje){
            i.__li.setAttribute("style", "border-left: 3px solid #1ed36f;"); 
        }
    },
    _desactivar_Ejemplos  : function(){
        this._botones.ejemplos.isEnabled = false;
        for(let i of this._botones.ejemplos.eje){
            i.__li.setAttribute("style", "border-left: 3px solid red;"); 
        }
    },
    _teclado              : function(){
        $(document).keydown(function (tecla) {
            if (tecla.keyCode == 78) { // letra n
                if(Controles._botones.pasoApaso.isEnabled){
                    Controles.funcion['Paso a paso']();
                }        
            }
            if(tecla.keyCode == 65){// letra a
                if(Controles._botones.animar.isEnabled){
                    Controles.funcion.Animar();
                } 
            }
            if(tecla.keyCode == 80){// letra p
                if(Controles._botones.pausa.isEnabled){
                    Controles.funcion.Pausa();
                } 
            }
        });
    },
    getVelocidad          : function(){
        let velocidad = 100;
        if( Controles.funcion.Velocidad != Controles._botones.velocidad.btn.__max ){
            velocidad = 5000/Controles.funcion.Velocidad;
        }
        return velocidad;
    },
    activar__botones      : function(){// Al terminar una animacion se llama esta funcion
        // La primeta activacion la tiene en el modelo librerias al terminar la animacion
        Controles._activar("animar");
        Controles._activar("pasoApaso");
        Controles._activar("reiniciar");

        Controles._activar_Ejemplos();

        if(this.gui.closed){
            $(".close-button").css({"background-color": "#000", "color": "#eee"}); 
        }
    },
    desactivar__botones   : function(){
        Controles._desactivar("pasoApaso");
        Controles._desactivar("animar");
        Controles._desactivar("reiniciar");

        Controles._desactivar_Ejemplos();

        if(this.gui.closed){
            $(".close-button").css({"background-color": "red", "color": "#000"}); 
        }
    },
    funcion               : {
        Velocidad          : 5,
        Pasos              : 0,
        Mensaje            : "Hola mundo",
        FullScreen         : true, // para el editor
        Opacidad           : 0,// para el editor
        'Linea Actual'     : true,
        'Linea Siguiente'  : true,
        'Panel'            : false, // Panel de detalles
        'Tema'             : 'monokai',
        Comodin            : function(){
            //console.log(MyThreeJS.cameraControl)
            //let json = JSON.stringify(R01.lstElements.children[1].children[0],['name', 'children']);
            //console.log(json);
              //  /*

            console.log(javaEditor.getOption("theme"));
            //*/
        },
        Preparar        : function(){
            if(Controles._botones.preparar.isEnabled){
                if(Main.preparar()){
                    Controles.funcion.Pasos = 0;
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
                Controles._activar_Ejemplos();

                

                Main.reiniciar();
            }
        },
        Ejemplos:{
            e01:function (){
                if(Controles._botones.ejemplos.isEnabled){                
                    Controles.funcion.Reiniciar();
                    javaEditor_setText(ejemploDeCodigo_01);
                }
            },
            e02:function (){
                if(Controles._botones.ejemplos.isEnabled){                
                    Controles.funcion.Reiniciar();
                    javaEditor_setText(ejemploDeCodigo_02);
                }
            },
            e03:function (){
                if(Controles._botones.ejemplos.isEnabled){                
                    Controles.funcion.Reiniciar();
                    javaEditor_setText(ejemploDeCodigo_03);
                }
            },
            e04:function (){
                if(Controles._botones.ejemplos.isEnabled){ 
                    Controles.funcion.Reiniciar();          
                    javaEditor_setText(ejemploDeCodigo_04);
                }
            },
        },
    },
};
Controles.setupControles = function (){
    this.gui = new dat.GUI();
    $(".dg.ac").css( "z-index", "18" );// explicacion en el archivo helpers
    $(this.gui.domElement).attr("id","MyControlesDataGui");

    this.gui.add(this.funcion,"Comodin");
    this.gui.add(this.funcion,"Mensaje");// Funciona al desactivar el orbitControl de Three.js

    /***************************************************************************************************/
    let f1                        = this.gui.addFolder('Animacion');
    this._botones.preparar.btn    = f1.add(this.funcion, 'Preparar');
    this._botones.animar.btn      = f1.add(this.funcion, 'Animar');
    this._botones.pasoApaso.btn   = f1.add(this.funcion, 'Paso a paso');
    this._botones.pausa.btn       = f1.add(this.funcion, 'Pausa');
    this._botones.reiniciar.btn   = f1.add(this.funcion, 'Reiniciar');
    this._botones.velocidad.btn   = f1.add(this.funcion, 'Velocidad').min(1).max(5).step(1);
    this._botones.npasos.btn      = f1.add(this.funcion, 'Pasos').listen();
    this._activar("preparar");


    let f2 = this.gui.addFolder('Editor');
    this._botones.tema.btn       = f2.add(this.funcion, 'Tema',{Negro: 'monokai', Blanco:'default'});
    this._botones.fullScreen.btn = f2.add(this.funcion, 'FullScreen');
    this._botones.opacidad.btn   = f2.add(this.funcion, 'Opacidad').min(0).max(1).step(.1);
    f2.add(this.funcion, 'Linea Actual');
    f2.add(this.funcion, 'Linea Siguiente');

    this._botones.tema.btn.onFinishChange(function(value) {
        javaEditor_setTheme(value);
        javaEditor_setOpacity();
    });
    this._botones.fullScreen.btn.onFinishChange(function(value) {
        javaEditor.setOption("fullScreen", Controles.funcion.FullScreen)
    });
    this._botones.opacidad.btn.onChange(function(value) {
        javaEditor_setOpacity();
    });


    let f3 = this.gui.addFolder('Ejemplos');
    for(let i in this.funcion.Ejemplos){
        this._botones.ejemplos.eje.push(f3.add(this.funcion.Ejemplos, i));
    }
    this._activar_Ejemplos();

    let f4 = this.gui.addFolder('Detalles');
    
    if(this.funcion.Panel){
        $('#detalles, #detalles-content').css({'visibility': 'visible', 'height': '250px'});
    }
    f4.add(this.funcion,'Panel').onFinishChange(function(v){
        v ? $('#detalles, #detalles-content').css({'visibility': 'visible', 'height': '250px'}):
        $('#detalles, #detalles-content').css('visibility', 'hidden');
    });


    

    f1.open();
    f2.open();
    //f3.open();
    f4.open();
    this._teclado();
}


