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

function getQueryVariable(variable) {
    //https://css-tricks.com/snippets/javascript/get-url-variables/
   var query = window.location.search.substring(1);
   var vars = query.split("&");
   for (var i=0;i<vars.length;i++) {
           var pair = vars[i].split("=");
           if(pair[0] == variable){return pair[1];}
   }
   return(false);
}
function getCodigoFuente(){
    //Trae el codigo fuente de la Base de Datos
    //Esta funcion es usada en editor_texto/Editor.js
    var xhttp;    
    var codigo_fuente = "";
    var id            = getQueryVariable('n');
    console.log(id);
    if(id != false){
        
        xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function() {
            if (this.readyState == 4 && this.status == 200) {
                codigo_fuente = this.responseText;
            }
        };
        // En controlador se encuentra fuera de este proyecto
        // Se encuentra en la parte de la pagina web que administra a los usuarios
        xhttp.open("GET", "../controladores/getcodigofuente.php?id="+id, false);
        xhttp.send();
        //https://developer.mozilla.org/en-US/docs/Web/API/WindowBase64/Base64_encoding_and_decoding
        //ejemploDeCodigo_09 = btoa(ejemploDeCodigo_09); // cifrar
        codigo_fuente = atob(codigo_fuente);   //decifrar 
    }
    return codigo_fuente;
}