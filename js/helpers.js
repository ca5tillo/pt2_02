/*
INFO
Un elemento con mayor orden de pila siempre está delante de un elemento con un orden de pila inferior.

Code mirror-----------------------------------tiene un z-index = 9;  // Definido en \lib\codemirror\addon\display\fullscreen.css
.EditorTooltipMarcatexto:hover:after----------tiene un z-index = 10;
#detalles-------------------------------------tiene un z-index = 14;
Cuadros resizable y draggable-----------------tiene un z-index = 17;
Data.gui--------------------------------------tiene un z-index = 18;
*/

function *appCreateGenerador(arr){ for(let i of arr){ yield i; } }
function *GenerateID   (){var i = 0;while(true){yield i;i++;}}

var Main_generateID      = GenerateID();
var dibujando_generateID = GenerateID();
var AS_generateID        = GenerateID();


function setup_EEDOCDG(){
    // inicializar propiedades 
    $(".cuadro").resizable({containment:'parent',minHeight: 150,minWidth: 150,autoHide: true});
    $(".cuadro").draggable({containment:'parent',handle: ".cuadro-header"});


	//setup_EstilosPanelDetalles();
	//setup_PestanasPanelDetalles();
	setup_EventosMouse();
}
function setup_EventosMouse(){  /*  <<#7>>  */  /* Desactivar OrbilControl de THREE.js */
	$("body").mouseup(function()  { Main.mousedown=false; });// dejar de presionar boton izquierdo del mouse
    $("body").mousedown(function(){ Main.mousedown=true;  });// presionar boton izquierdo del mouse
    $("#MyControlesDataGui").mouseover(function(){ if(!Main.mousedown ) MyThreeJS.disableCameraControl();  });
    $("#MyControlesDataGui").mouseout (function(){ if( Main.ejecutado ) MyThreeJS.enableCameraControl();   });

    $(".cuadro-header").mouseover(function(){ if(!Main.mousedown ) MyThreeJS.disableCameraControl();  });
    $(".cuadro-header").mouseout (function(){ if( Main.ejecutado ) MyThreeJS.enableCameraControl();   });

    $(".ui-resizable-handle").mouseover(function(){ if(!Main.mousedown ) MyThreeJS.disableCameraControl();  });
    $(".ui-resizable-handle").mouseout (function(){ if( Main.ejecutado ) MyThreeJS.enableCameraControl();   });



    //$("#detalles-content").mouseover(function()  { MyThreeJS.disableCameraControl();                      });
    //$("#detalles-content").mouseout(function()   { if(Main.ejecutado)MyThreeJS.enableCameraControl();     }); 
}
function setup_PestanasPanelDetalles(){

	$("#detalles-tabs").tabs();
}
function setup_EstilosPanelDetalles(){	
    //http://jsfiddle.net/Ka7P2/732/
    let resizable = {
    	handles: {
            'n': '#handle'
        },
        start: function(event, ui) {
            MyThreeJS.disableCameraControl();
        },
        stop: function(event, ui) {
            if(Main.ejecutado)MyThreeJS.enableCameraControl();            
        },
        resize: function( event, ui ){
        	let height_detallesMenu = ui.size.height - parseInt($("#detalles-menu").css('height').replace("px", ""))-10;
        	$('#detalles-content').css({'height':`${height_detallesMenu}px`});

        }
    };
	$('#detalles').resizable(resizable);
}
function helper_detalles(){
    if(as_arbol)
        as_imprimirArbol(as_arbol);
    if(R01.lstElements)
        pintarArbolDeLlamadas();
    if(R01._lstIDsMetodos)
        pintarArbol("representacionarreglo1", R01._lstIDsMetodos, ["id","descripcion"]);
    if(Main.lstPasos)
        pintarArbol("representacionarreglo2", Main.lstPasos, ["id","descripcion"]);  
}
