/*
INFO

Code mirror                                   tiene un z-index = 9;
.EditorTooltipMarcatexto:hover:after          tiene un z-index = 10;
#detalles                                     tiene un z-index = 14;
Data.gui                                      tiene un z-index = 18;
*/

function *appCreateGenerador(arr){ for(let i of arr){ yield i; } }
function *GenerateID   (){var i = 0;while(true){yield i;i++;}}


function setup_EEDOCDG(){
	setup_EstilosPanelDetalles();
	setup_PestanasPanelDetalles();
	setup_EventosMouse();
}
function setup_EventosMouse(){/* Desactivar OrbilControl de THREE.js */
	/*	mousedown
		Es lanzado cuando el btn del mouse esta presionado
		es usado para desactivar el OrbirControl de THREE.js en 
		combinacion con "mouseover" y "mouseout" para "#MyControlesDataGui"
		para poder cambiar el tema del Editor de texto desde los controles
	*/
	$("body").mouseup(function()  { Main.mousedown=false; }); 
    $("body").mousedown(function(){ Main.mousedown=true;  });
	$("#MyControlesDataGui").mouseover(function(){ if(!Main.mousedown) MyThreeJS.disableCameraControl();  });
    $("#MyControlesDataGui").mouseout(function() { if( Main.ejecutado)MyThreeJS.enableCameraControl();    });

	$("#detalles-content").mouseover(function()  { MyThreeJS.disableCameraControl();                      });
    $("#detalles-content").mouseout(function()   { if(Main.ejecutado)MyThreeJS.enableCameraControl();     });	
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

