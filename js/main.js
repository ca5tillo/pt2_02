/**************************************************************\
 *                            \\|//                           *
 *                            (O O)                           *
 *            +----------oOO---------------------+            *
 *            | Desarrollado por Miguel Castillo |            *
 *            +-------------------oOO------------+            *
 *                          |__|__|                           *
 *                           || ||                            *
 *                         ooO Ooo                            *
\**************************************************************/

window.addEventListener('load',init);

var arbolSintactico = null;
var esAnimacionFluida = false;
var guionDeEjecucion = [];


var velocidad = 200;
var indicepaso = 0; //usado para el boton animacion paso a paso

function init(){
    setup_javaEditor();
    javaEditor_setText(ejemploDeCodigo_04);

    setupThreeJS();
    //setupGroupBase();
    setupLuz();
    setupAxis();
    setupSuelo();
    setupZonaLibrerias();
    //setupGroupEjecucion();
    cameraControl = new THREE.OrbitControls(camera);

    render();
       
}

function render(){
    
    cameraControl.update();
    TWEEN.update();

    requestAnimationFrame(render);
    renderer.render(scene, camera);
}

/******************************************************************************************************\
  ____                                                     _   _                  _                 
 |  _ \   _ __    ___    ___    ___    _ __ ___    _ __   (_) | |   __ _    ___  (_)   ___    _ __  
 | |_) | | '__|  / _ \  / __|  / _ \  | '_ ` _ \  | '_ \  | | | |  / _` |  / __| | |  / _ \  | '_ \ 
 |  __/  | |    |  __/ | (__  | (_) | | | | | | | | |_) | | | | | | (_| | | (__  | | | (_) | | | | |
 |_|     |_|     \___|  \___|  \___/  |_| |_| |_| | .__/  |_| |_|  \__,_|  \___| |_|  \___/  |_| |_|
                                                  |_|                                                                                           
\******************************************************************************************************/


/*
Recorre el ** arbolSintactico ** para identificar las librerias q seran usadas 
Inserta las instrucciones a ** guionDePreCompilacion ** estas instrucciones establecen 
que FUNCIONES usaran de los helpers de dibujado

Finalmente lleva a cabo la ejecucion de todas las instrucciones que se contienen en 
el ** guionDePreCompilacion **
*/
function crearGuionPrecompilacion(){
    let _guion = [];  //guionDePreCompilacion
    _run = function (){
        for(let i of _guion){
            self[   i.metodo    ] (i.parametro);
        }
    }
    _add = function (O_o){
        if(O_o.tipo == "defClase"){
            _guion.push({parametro:O_o, metodo:"crearLibreria"});
        }
        for(let i of O_o.hijos){
            _add(i);
        }
    };
    _guion.push({parametro:{},                                 metodo:"setupGroupBase"});
    _guion.push({parametro:{name:"System",tipo: "defClase"}, metodo:"crearLibreria" });

    _add(arbolSintactico);
    _run();
}

/******************************************************************************************************/

/******************************************************************************************************\                 _                              _                 
     _              _                              _                 
    / \     _ __   (_)  _ __ ___     __ _    ___  (_)   ___    _ __  
   / _ \   | '_ \  | | | '_ ` _ \   / _` |  / __| | |  / _ \  | '_ \ 
  / ___ \  | | | | | | | | | | | | | (_| | | (__  | | | (_) | | | | |
 /_/   \_\ |_| |_| |_| |_| |_| |_|  \__,_|  \___| |_|  \___/  |_| |_|
                                                                     
\******************************************************************************************************/

/*
Busca la funcion main en el ** arbolSintactico **
inserta el el arreglo ** guionDeEjecucion** los pasos de la ejecucion

*/
function addPaso(i){
    // i de instruccion
    switch(i.tipo){
        case "defVariable":
            guionDeEjecucion.push({parametro:[i],metodo:"crearVariable"});
        break;

        case "asignacionDeValor":
            guionDeEjecucion.push({parametro:[i],metodo:"asignarValorVariable"});             
        break;

        case "defArreglo":
            guionDeEjecucion.push({parametro:[i],metodo:"crearArreglo"});
        break;

        case "llamada_funcion_sinparametros_sinretorno":
            recorrerMetodo(i);
        break;

        case "llamada_funcion_conparametros_sinretorno":
            llamada_metodo_con_parametros(i);
        break;

        

    }
}
function llamada_metodo_con_parametros(instruccion){
    let metodo = arbolSintactico_GetFunctionByName(instruccion.name);

    if(metodo){// Si existe el metodo lo centramos en la escena

        guionDeEjecucion.push({parametro:[instruccion,metodo], metodo:"llamada_metodo_con_parametrosA"   });


        for(let i of metodo.hijos){ //Recorremos los hijos del metodo 
            addPaso(i);
        }
        
        guionDeEjecucion.push({parametro:[metodo],metodo:"MethodOut"});

    }else{
        console.log("No se encontro funcion main",metodo);
    }
}
function recorrerMetodo(instruccion){
    let declaracion = arbolSintactico_GetFunctionByName(instruccion.name);


    if(declaracion){// Si existe el metodo lo centramos en la escena

        guionDeEjecucion.push({parametro:[instruccion,declaracion], metodo:"crearMetodo"   });
        for(let i of declaracion.hijos){ //Recorremos los hijos del metodo 
            addPaso(i);
        }
        
        guionDeEjecucion.push({parametro:[declaracion],metodo:"MethodOut"});

    }else{
        console.log("No se encontro funcion main",declaracion);
    }
}
function crearGuionAnimacion(){
    recorrerMetodo({name:"main"});
}



/******************************************************************************************************/

/*
Metodo privado usado en btn_pasoApaso()
http://www.forosdelweb.com/f13/llamar-funcion-con-nombre-por-cadena-808443/
*/
var _ejecutarpaso = (i) => self[   guionDeEjecucion[i].metodo    ] (...guionDeEjecucion[i].parametro);


function btn_Compilar(){
    arbolSintactico = analisisSintactico_getArbol();
    //as_imprimirArbol(arbolSintactico)
A522(arbolSintactico);

    crearGuionPrecompilacion();
pintarArbolDeLlamadas();
    crearGuionAnimacion();

    $("#Compilar").addClass("desactivado");
    $("#Ejecutar").removeClass("desactivado");
    $("#PorPasos").removeClass("desactivado");
}

function btn_Ejecutar(){
    esAnimacionFluida = true;
    btn_pasoApaso()
}

function btn_pasoApaso(){
    if(indicepaso < guionDeEjecucion.length){
        _ejecutarpaso(indicepaso)
        pintarArbolDeLlamadas();
        indicepaso += 1; 
    }
}
function btn_camara(){
    console.log(lstElements.getChildrenById(4,true))
    esAnimacionFluida = false;
}



//PARA BUSCAR UNA FUNCION EN EL ARBOL SINTACTICO

function arbolSintactico_GetFunctionByName(nodoNombre){
    //http://jsfiddle.net/dystroy/MDsyr/
    let getSubMenuItem = function (subMenuItems, nodoNombre) {
        if (subMenuItems) {
            for (let i = 0; i < subMenuItems.length; i++) {
                if (subMenuItems[i].tipo == "defMetodo" && subMenuItems[i].name == nodoNombre ){
                    return subMenuItems[i];
                };
                let found = getSubMenuItem(subMenuItems[i].hijos, nodoNombre);
                if (found) return found;
            }
        }
    };

    let searchedItem = getSubMenuItem(arbolSintactico.hijos, nodoNombre) || null;
    return searchedItem;
}









function pintarArbolDeLlamadas(){
    document.getElementById("representacionarreglo1").innerHTML = lstIDsMetodos.join(" * ");
    document.getElementById("representacionarreglo2").innerHTML = lstIDsRamas.join(" * ");
    $('#representacion_arbolDeLlamadas').empty();

    _createLista = function (nodo){
        let li    = document.createElement("li");        
        let texto = document.createTextNode(`[${nodo.id},${nodo.idPadre},${nodo.idContenedor},${nodo.idAS || ""}]  ${nodo.name}`); 
        li.appendChild(texto);  
        if(nodo.subElements.length > 0){
            let ul = document.createElement("ul"); 
            li.appendChild(ul);                          
            for(let i of nodo.subElements){
                ul.appendChild(_createLista(i));  
            }
        } 
        return li;
    }
    let ul    = document.createElement("ul"); 
    ul.setAttribute("id", "arbol"); 
    if(lstElements){
        ul.appendChild(_createLista(lstElements));   

        document.getElementById("representacion_arbolDeLlamadas").appendChild(ul);  

        $('#representacion_arbolDeLlamadas ul#arbol').bonsai({
            expandAll: true,
            createInputs: "radio"
        });

    }
}

function A522(nodo){
    $('#representacion_arbolSintactico').empty();

    _createLista = function (nodo){
        let li    = document.createElement("li");        
        let texto = document.createTextNode(`[${nodo.id},${nodo.idPadre}]${nodo.name}`); 
        li.appendChild(texto);  
        if(nodo.hijos.length > 0){
            let ul = document.createElement("ul"); 
            li.appendChild(ul);                          
            for(let i of nodo.hijos){
                ul.appendChild(_createLista(i));  
            }
        } 
        return li;
    }
    let ul    = document.createElement("ul");          
    ul.setAttribute("id", "arbol"); 

    ul.appendChild(_createLista(nodo));   

    document.getElementById("representacion_arbolSintactico").appendChild(ul);  

    $('#representacion_arbolSintactico ul#arbol').bonsai({
        expandAll: true,
        createInputs: "radio"
    });


}