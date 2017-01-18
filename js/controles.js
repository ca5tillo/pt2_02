var ctrl_Preparar              = null;
var ctrl_Animar                = null;
var ctrl_Animar_Paso           = null;
var ctrl_Pausa                 = null;
var ctrl_Reiniciar             = null;
var ctrl_Ejemplos              = [];

var isActive_ctrl_Preparar     = true;
var isActive_ctrl_Animar       = false;
var isActive_ctrl_Animar_Paso  = false;
var isActive_ctrl_Pausa        = false;
var isActive_ctrl_Reiniciar    = false;

var isActive_ctrl_Ejemplos     = true;
var Controls = {
        velocidad: 200,
        pasos: 0,
        Preparar: function () {
        	if(isActive_ctrl_Preparar){
				btn_Compilar();
        	}
        },
        Animar: function () {
            if(isActive_ctrl_Animar){
                btn_Ejecutar();
            }
        },
        Animar_Paso: function () {
        	if(isActive_ctrl_Animar_Paso){
				btn_pasoApaso();				
        	}
        },
        Pausa:function (){
            if(isActive_ctrl_Pausa){
                btn_pausa();                
            }            
        },
        Reiniciar:function (){
            if(isActive_ctrl_Reiniciar){
                ctrl_fun_Reiniciar();
            }
        },


        Ejemplo_01:function (){
            if(isActive_ctrl_Ejemplos){                
                ctrl_fun_Reiniciar();
                javaEditor_setText(ejemploDeCodigo_01);
            }
        },
        Ejemplo_02:function (){
            if(isActive_ctrl_Ejemplos){                
                ctrl_fun_Reiniciar();
                javaEditor_setText(ejemploDeCodigo_02);
            }
        },


        fullScreen: false,
        Opacidad:0.3,


        'Arbol Sintactico':false,
        'Arbol de LLamadas':false,
        a1:false,
        a2:false,
        a3:false,
message: 'Hello World',
    };

function ctrl_fun_ActivaControles() {
    // Despues de prepara el AnalisadorSintactico y 
    // mostrar en pantalla las librerias se puede ejecutar esta funcion
    // js\dibujando\models\Libreria.js:


    ctrl_fun_Activa__PorPaso();

}
function ctrl_fun_Reiniciar(){
    btn_reiniciar();

    isActive_ctrl_Preparar     = true;
    isActive_ctrl_Animar       = false;
    isActive_ctrl_Animar_Paso  = false;
    isActive_ctrl_Pausa        = false;

    

    ctrl_Preparar.__li.setAttribute    ("style", "border-left: 3px solid green;"); 
    ctrl_Animar.__li.setAttribute      ("style", "border-left: 3px solid red;"  ); 
    ctrl_Animar_Paso.__li.setAttribute ("style", "border-left: 3px solid red;"  ); 
    ctrl_Pausa.__li.setAttribute       ("style", "border-left: 3px solid red;"  );
    ctrl_Reiniciar.__li.setAttribute   ("style", "border-left: 3px solid red;"  );    
    

    
    ctrl_fun_Activa__Ejemplos  ();
}

function ctrl_fun_desactiva__PorPaso(){
    isActive_ctrl_Animar_Paso  = false;
    ctrl_Animar_Paso.__li.setAttribute ("style", "border-left: 3px solid red;"  );
    ctrl_fun_desactiva__Animar    ();
    ctrl_fun_desactiva__Reiniciar ();
    ctrl_fun_desactiva__Ejemplos  ();
}
function ctrl_fun_Activa__PorPaso(){
    isActive_ctrl_Animar_Paso  = true;
    ctrl_Animar_Paso.__li.setAttribute ("style", "border-left: 3px solid green;"  );
    ctrl_fun_Activa__Animar    ();
    ctrl_fun_Activa__Reiniciar ();
    ctrl_fun_Activa__Ejemplos  ();
}


function ctrl_fun_desactiva__Animar(){
    isActive_ctrl_Animar        = false;
    ctrl_Animar.__li.setAttribute      ("style", "border-left: 3px solid red;"  );
    if(esAnimacionFluida){
        isActive_ctrl_Pausa     = true;
        ctrl_Pausa.__li.setAttribute       ("style", "border-left: 3px solid green;");
    }
}
function ctrl_fun_desactiva__Reiniciar(){
    isActive_ctrl_Reiniciar  = false;
    ctrl_Reiniciar.__li.setAttribute ("style", "border-left: 3px solid red;"  );
}
function ctrl_fun_Activa__Animar(){
    isActive_ctrl_Animar       = true;
    ctrl_Animar.__li.setAttribute      ("style", "border-left: 3px solid green;"  );
}
function ctrl_fun_Activa__Reiniciar(){
    isActive_ctrl_Reiniciar  = true;
    ctrl_Reiniciar.__li.setAttribute ("style", "border-left: 3px solid green;"  );
}

function ctrl_fun_desactiva__Ejemplos(){
    isActive_ctrl_Ejemplos = false;
    for(let i of ctrl_Ejemplos){
        i.__li.setAttribute ("style", "border-left: 3px solid red;"  );
    }
}
function ctrl_fun_Activa__Ejemplos(){
    isActive_ctrl_Ejemplos = true;
    for(let i of ctrl_Ejemplos){
        i.__li.setAttribute ("style", "border-left: 3px solid green;"  );
    }
}
function ctrl_fun__Preparar(){
    if(isActive_ctrl_Preparar){                
        Controls.pasos = 0;
        isActive_ctrl_Preparar = false;
        ctrl_Preparar.__li.setAttribute    ("style", "border-left: 3px solid red;"  );  
    }
}
function setupControls(){
	
    let gui = new dat.GUI();
    $(".dg.ac").css( "z-index", "9" );




/***************************************************************************************************/
    let f1               = gui.addFolder('Animacion');
    	ctrl_Preparar    = f1.add(Controls, 'Preparar');
    	ctrl_Animar      = f1.add(Controls, 'Animar');
    	ctrl_Animar_Paso = f1.add(Controls, 'Animar_Paso');
    	ctrl_Pausa       = f1.add(Controls, 'Pausa');
    	ctrl_Reiniciar   = f1.add(Controls, 'Reiniciar');
    let ctrl_velocidad   = f1.add(Controls, 'velocidad').min(100).max(5000).step(100);
    					   f1.add(Controls, 'pasos').listen();

    	
	    ctrl_Preparar.__li.setAttribute        ("style", "border-left: 3px solid green;"); 
	    ctrl_Animar.__li.setAttribute          ("style", "border-left: 3px solid red;"  ); 
	    ctrl_Animar_Paso.__li.setAttribute     ("style", "border-left: 3px solid red;"  ); 
	    ctrl_Pausa.__li.setAttribute           ("style", "border-left: 3px solid red;"  );
        ctrl_Reiniciar.__li.setAttribute       ("style", "border-left: 3px solid red;"  );  


        /*eventos*/

	    ctrl_Animar.onFinishChange(function(value) {
            if(isActive_ctrl_Animar){            
                isActive_ctrl_Animar       = false;
    	    	isActive_ctrl_Animar_Paso  = false;
                isActive_ctrl_Pausa        = true;
                ctrl_Animar.__li.setAttribute      ("style", "border-left: 3px solid red;"  ); 
                ctrl_Animar_Paso.__li.setAttribute ("style", "border-left: 3px solid red;"  ); 
                ctrl_Pausa.__li.setAttribute       ("style", "border-left: 3px solid green;");
            }
	    });
	    ctrl_Pausa.onFinishChange(function(value) {
            isActive_ctrl_Pausa        = false;
            ctrl_Pausa.__li.setAttribute       ("style", "border-left: 3px solid red;"  );
	    });

	    f1.open();

/***************************************************************************************************/
    let f2 = gui.addFolder('Ejemplos');
	    ctrl_Ejemplos.push(f2.add(Controls, 'Ejemplo_01'));
	    ctrl_Ejemplos.push(f2.add(Controls, 'Ejemplo_02'));

    for(let i of ctrl_Ejemplos){
        i.__li.setAttribute       ("style", "border-left: 3px solid green;");
    }



/***************************************************************************************************/
    let f3 = gui.addFolder('Editor');

    let ctrl_fullScreen = f3.add(Controls, 'fullScreen');
    let ctrl_Opacidad   = f3.add(Controls, 'Opacidad').min(0).max(1).step(.1);

	    ctrl_fullScreen.onFinishChange(function(value) {
	    	javaEditor.setOption("fullScreen", Controls.fullScreen)
	    });
	    ctrl_Opacidad.onChange(function(value) {
	    	$(".CodeMirror").css({ "background":'rgba(0,0,0,'+Controls.Opacidad+')' });
	    });
	    ctrl_Opacidad.onFinishChange(function(value) {
	    	$(".CodeMirror").css({ "background":'rgba(0,0,0,'+Controls.Opacidad+')' });
	    });

/***************************************************************************************************/
	let f4         = gui.addFolder('Informacion');

    let ctrl_as    = f4.add(Controls,'Arbol Sintactico');
    let ctrl_aCall = f4.add(Controls, 'Arbol de LLamadas');

    let ctrl_a1    = f4.add(Controls, 'a1');
    let ctrl_a2    = f4.add(Controls, 'a2');
    let ctrl_a3    = f4.add(Controls, 'a3');

	$('#representacion_arbolSintactico').css({'visibility': 'hidden'});
	$('#representacion_arbolDeLlamadas').css({'visibility': 'hidden'});

	$('#representacionarreglo1').css({'visibility': 'hidden'});
	$('#representacionarreglo2').css({'visibility': 'hidden'});
	$('#infonodo_as').css({'visibility': 'hidden'});

    ctrl_as.onFinishChange(function(value) {
    	if(Controls['Arbol Sintactico']){
    		$('#representacion_arbolSintactico').css({'visibility': 'visible'});
    	}else{
    		$('#representacion_arbolSintactico').css({'visibility': 'hidden'});
    	}
    });
    ctrl_aCall.onFinishChange(function(value) {
    	if(Controls['Arbol de LLamadas']){
    		$('#representacion_arbolDeLlamadas').css({'visibility': 'visible'});
    	}else{
    		$('#representacion_arbolDeLlamadas').css({'visibility': 'hidden'});
    	}
    });




    ctrl_a1.onFinishChange(function(value) {
    	if(!this.__prev){
    		$('#representacionarreglo1').css({'visibility': 'visible'});
    	}else{
    		$('#representacionarreglo1').css({'visibility': 'hidden'});
    	}
    });
    ctrl_a2.onFinishChange(function(value) {
    	if(!this.__prev){
    		$('#representacionarreglo2').css({'visibility': 'visible'});
    	}else{
    		$('#representacionarreglo2').css({'visibility': 'hidden'});
    	}
    });
    ctrl_a3.onFinishChange(function(value) {
    	if(!this.__prev){
    		$('#infonodo_as').css({'visibility': 'visible'});
    	}else{
    		$('#infonodo_as').css({'visibility': 'hidden'});
    	}
    });
    
    f4.open();



/***************************************************************************************************/
    
}