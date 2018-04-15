
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
        
        tema         :{ isEnabled:false, btn:null },
        opacidad     :{ isEnabled:false, btn:null },
        fullScreen   :{ isEnabled:false, btn:null },
        l1           :{ isEnabled:false, btn:null },//linea actual
        l2           :{ isEnabled:false, btn:null },
        
        det_as       :{ isEnabled:false, btn:null },
    },
    _activar              : function(key){
        Controles._botones[key].isEnabled  = true;
        Controles._botones[key].btn.__li.setAttribute("style", "border-left: 3px solid #1ed36f;");         
    },
    _desactivar           : function(key){
        Controles._botones[key].isEnabled  = false;
        Controles._botones[key].btn.__li.setAttribute("style", "border-left: 3px solid red;"); 
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
            if(tecla.keyCode == 81){// q
                if(Controles._botones.preparar.isEnabled){
                    Controles.funcion.Preparar();
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


        if(this.gui.closed){
            $(".close-button").css({"background-color": "#000", "color": "#eee"}); 
        }
    },
    desactivar__botones   : function(){
        Controles._desactivar("pasoApaso");
        Controles._desactivar("animar");
        Controles._desactivar("reiniciar");


        if(this.gui.closed){
            $(".close-button").css({"background-color": "red", "color": "#000"}); 
        }
    },
    funcion               : {
        Velocidad          : 5,
        Pasos              : 0,
        DetenerseEn        : 0,
        Mensaje            : "Hola mundo",
        FullScreen         : true, // para el editor
        Opacidad           : 0,// para el editor 0-1
        'Linea Actual'     : true,
        'Linea Siguiente'  : true,
        'Panel'            : false, // Panel de detalles
        'Tema'             : 'monokai',
        'Autocompletar'    : true,
        Comodin            : function(){
            //console.log(MyThreeJS.cameraControl)
            //let json = JSON.stringify(R01.lstElements.children[1].children[0],['name', 'children']);
            //console.log(json);
              //  /*
            console.clear();
            console.log("Actual",Main.actualInstruccion);
            console.log("");
            console.log("Next",Main.nextInstruccion);
            //*/
        },
        Preparar        : function(){
            if(Controles._botones.preparar.isEnabled){
                if(Main.preparar()){
                    Controles.funcion.Pasos  = 0;
                    Controles._desactivar("preparar");
                    /*
                     * Despues de presionar prepara 
                     * los demas botones se activan al finalizar la animacion
                     * Main.animacion_de_entrada();
                     */
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
        Pausa           : function (){
            if(Controles._botones.pausa.isEnabled){                
                Controles._desactivar("pausa");
                Main.pausa();                
            }            
        },
        Reiniciar       : function (){
            if(Controles._botones.reiniciar.isEnabled){
                Controles.desactivar__botones();                              
                Controles._desactivar("pausa");
                Controles._activar("preparar");
                $(".close-button").css({"background-color": "#000", "color": "#eee"}); 

                

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
            e05:function (){
                if(Controles._botones.ejemplos.isEnabled){ 
                    Controles.funcion.Reiniciar();          
                    javaEditor_setText(ejemploDeCodigo_05);
                }
            },
            e06:function (){
                if(Controles._botones.ejemplos.isEnabled){ 
                    Controles.funcion.Reiniciar();          
                    javaEditor_setText(ejemploDeCodigo_06);
                }
            },
            e07:function (){
                if(Controles._botones.ejemplos.isEnabled){ 
                    Controles.funcion.Reiniciar();          
                    javaEditor_setText(ejemploDeCodigo_07);
                }
            },
            e08:function (){
                if(Controles._botones.ejemplos.isEnabled){ 
                    Controles.funcion.Reiniciar();          
                    javaEditor_setText(ejemploDeCodigo_08);
                }
            },
        },
        
        'Arbol Sintactico': false,
    },
};
Controles.setupControles = function (){
    dat.GUI.toggleHide = function(){};// <<#3>>
    this.gui = new dat.GUI();
    $(".dg.ac").css( "z-index", "18" );// explicacion en el archivo helpers
    $(this.gui.domElement).attr("id","MyControlesDataGui");
    //this.gui.add(this.funcion,"Mensaje");// Funciona al desactivar el orbitControl de Three.js

    /***************************************************************************************************/
    let _Botones             = this._botones;
    let _f1                  = this.gui.addFolder('Animacion');
    let _f2                  = this.gui.addFolder('Editor');
    let _f3                  = this.gui.addFolder('Detalles');
    //let _f4                  = this.gui.addFolder('Detalles');

    _Botones.preparar.btn    = _f1.add(this.funcion, 'Preparar');
    _Botones.animar.btn      = _f1.add(this.funcion, 'Animar');
    _Botones.pasoApaso.btn   = _f1.add(this.funcion, 'Paso a paso');
    _Botones.pausa.btn       = _f1.add(this.funcion, 'Pausa');
    _Botones.reiniciar.btn   = _f1.add(this.funcion, 'Reiniciar');
    _Botones.velocidad.btn   = _f1.add(this.funcion, 'Velocidad').min(1).max(5).step(1);
    _Botones.npasos.btn      = _f1.add(this.funcion, 'Pasos').min(0).listen();
    _Botones.npasos.btn      = _f1.add(this.funcion, 'DetenerseEn').min(0);

    _Botones.tema.btn        = _f2.add(this.funcion, 'Tema',{Negro: 'monokai', Blanco:'default'});
    _Botones.opacidad.btn    = _f2.add(this.funcion, 'Opacidad').min(0).max(1).step(.1);
    _Botones.fullScreen.btn  = _f2.add(this.funcion, 'FullScreen');
                               _f2.add(this.funcion, 'Autocompletar');
    _Botones.l1.btn          = _f2.add(this.funcion, 'Linea Actual');
    _Botones.l2.btn          = _f2.add(this.funcion, 'Linea Siguiente');
    
    _Botones.det_as.btn      = _f3.add(this.funcion, 'Arbol Sintactico');
    
    /*
     * Todos los botones inician en rojo por defecto de dat.gui 
     * y desactibado ya que tienen su propiedad en false (preparar:{ isEnabled:false, btn:null })
     * Asi que el boton "preparar", esto es cambiar su color y su propiedad.
     */
    this._activar("preparar");
    
    
    
/*  Eventos  */
    
    /*
     * Evento que se dispara al seleccionar un Tema
     * Se establece el tema y la opacidad del editor de texto
     */
    _Botones.tema.btn.onFinishChange       (function(value) { // Tema
        Editor.java.theme = value;
        Editor.java.setOpacity(Controles.funcion.Opacidad);
    });
    _Botones.fullScreen.btn.onFinishChange (function(value) { // FullScreen
        Editor.java.changeFullScreen(value);
        /*
        (Controles.funcion.FullScreen) 
            ? $("#editor").removeClass("CodeMirror-myborder") 
            : $("#editor").addClass("CodeMirror-myborder");
            //*/
    });
    _Botones.opacidad.btn.onChange         (function(value) { // Opacidad
        Editor.java.setOpacity(value);
    });

    /*
    _Botones.l1.btn.onFinishChange         (function(value) {
        Main.marktext();
    });
    _Botones.l2.btn.onFinishChange         (function(value) {
        Main.marktext();
    });
    
    //*/
    
    _Botones.det_as.btn.onFinishChange (function(value) { // 
        value ? $('.cuadro').css('visibility', 'visible'):
        $('.cuadro').css('visibility', 'hidden');
    });
    

    _f1.open();
    this._teclado();
}


