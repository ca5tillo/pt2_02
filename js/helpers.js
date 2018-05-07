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

var routes = {
    'api-info'           : '../pt/api/info.php',
    'api-set_codigo'     : '../pt/api/codigoFuente/set.php',
    'api-get_codigo'     : '../pt/api/codigoFuente/get.php',
    'api'                : '../pt/index.php',
    'api-proyectos'      : '../pt/proyectos.php',
    'api-textruras'      : '../pt/api/texturas/textura.php'
};


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

/*
 * Funciones para comunicarse con el sistema 
 * que gestiona a los usuarios y proyectos 
 */
function _GET(variable) {
    //https://css-tricks.com/snippets/javascript/get-url-variables/
   var query = window.location.search.substring(1);
   var vars = query.split("&");
   for (var i=0;i<vars.length;i++) {
           var pair = vars[i].split("=");
           if(pair[0] == variable){return pair[1];}
   }
   return(false);
}
function getApiInfo(){
    // https://openclassrooms.com/courses/crea-paginas-webs-interactivas-con-javascript/envia-peticiones-ajax-al-servidor
    var id  = _GET('n');
    var req = new XMLHttpRequest();
    req.open("GET",`${routes['api-info']}?id_proyecto=${id}`, true);
    req.addEventListener("load", function() {
    if (req.status >= 200 && req.status < 400) {
        res = JSON.parse(this.responseText);
        ApiInfo.llamada_terminada = true;
        ApiInfo.existe            = true;
        ApiInfo.logueado          = res.logueado;
        ApiInfo.id_proyecto       = res.id_proyecto;
        ApiInfo.user_name         = res.user_name;
        ApiInfo.permiso_edicion   = res.permiso_edicion;
        
    } else {
        ApiInfo.llamada_terminada = true;
        //console.error(req.status + " " + req.statusText);
    }
    });
    req.addEventListener("error", function(){
        ApiInfo.llamada_terminada = true;
        //console.error("Error de red");
    });
    req.send(null);
}
function getCodigoFuente(){
    var id            = _GET('n');
    
    if(id != false){
        var req = new XMLHttpRequest();
        req.open("GET", `${routes['api-get_codigo']}?id=${id}`, true);
        req.addEventListener("load", function() {
        if (req.status >= 200 && req.status < 400) {
            codigoFuente = JSON.parse(this.responseText);
            if(codigoFuente.status){
                Editor.java.value        = atob(codigoFuente.codigo);   //decifrar ;
            }
        } else {
            //console.error(req.status + " " + req.statusText);
        }
        });
        req.addEventListener("error", function(){
            //console.error("Error de red");
        });
        req.send(null);
    }else{
        Editor.java.value = ejemploDeCodigo_01;
    }
        //https://developer.mozilla.org/en-US/docs/Web/API/WindowBase64/Base64_encoding_and_decoding
        //ejemploDeCodigo_09 = btoa(ejemploDeCodigo_09); // cifrar
}
function setCodigoFuente(){

    var codigo = Editor.java.value;
    codigo = btoa(codigo);// cifrar

    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            alert("El proyecto ha sido guardado.");
        }
    };
    xhttp.open("POST", routes['api-set_codigo'], true);
    xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");


    var id_proyecto = ApiInfo.id_proyecto;
    xhttp.send(`id_proyecto=${id_proyecto}&&codigo=${codigo}`);
}