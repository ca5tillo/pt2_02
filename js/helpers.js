/*
INFO
Un elemento con mayor orden de pila siempre está delante de un elemento 
con un orden de pila inferior.

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

}

