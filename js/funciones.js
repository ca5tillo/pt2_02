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
var guionDePreCompilacion = [];
var guionDeEjecucion = [];


var velocidad = 200;
var indicepaso = 0; //usado para el boton animacion paso a paso

function init(){
    console.log("a"+5)
    setup_javaEditor();
    javaEditor_setText(ejemploDeCodigo_05);

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
Recorre el ** arbolSintactico **
Inserta obj al arreglo ** guionDePreCompilacion **
En estos objetos indica que FUNCIONES usara de los helpers de dibujado

El ultimo objeto hace referencia a la funcion moverlibrerias(),  esta funcion es quien inicia la animacion
*/
function crearGuionPrecompilacion(){

    guionAdd_libMeto = function (O_o){
        switch(O_o.tipo){
            case  "defClase":
                guionDePreCompilacion.push({parametro:O_o, metodo:"crearLibreria"});
            break;
            
            case "defMetodo":
                //guionDePreCompilacion.push({parametro:O_o, metodo:"crearMetodo"   });
            break;
        }
        for(let i of O_o.hijos){
            guionAdd_libMeto(i);
        }
    };
    guionDePreCompilacion.push({parametro:{},                metodo:"setupGroupBase"});
    guionDePreCompilacion.push({parametro:{nombre:"System",tipo: "defClase"}, metodo:"crearLibreria"});


    guionAdd_libMeto(arbolSintactico);

}



/* 
Ejecuta las instrucciones que contiene el arreglo ** guionDePreCompilacion **
La animacion inicia dado que la ultima instruccion de esta lista es la llamada a moverlibrerias() quien desencadena las animaciones
de precompilacion
*/
function run_guionDePreCompilacion (){
    for(let i of guionDePreCompilacion){
        self[   i.metodo    ] (i.parametro);
    }
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
            recorrerMetodo(i.nombre,i.lineaInicial);
        break;

        case "llamada_funcion_conparametros_sinretorno":
            llamada_metodo_con_parametros(i);
        break;

        case "defFor":
            guionDeEjecucion.push(
                {
                    metodo:"crearFOR",
                    parametros:[i.padre.nombre,i.lineaInicial]

                }
            );
            for(let i = 0 ; i<4; i++){
                guionDeEjecucion.push(
                    {
                        metodo:"asignarValorArreglo",
                        parametros:["edad",i,i,9]

                    }
                );
            }
            guionDeEjecucion.push(
                {
                    metodo:"eliminarFor",
                    parametros:[i.padre.nombre]

                }
            );
            //console.log(i);
        break;

    }
}
function llamada_metodo_con_parametros(instruccion){
    let metodo = arbolSintactico_GetFunctionByName(instruccion.nombre);
    let envioParametros = instruccion.envioParametros;
}
function recorrerMetodo(name,l=0){
    let metodo = arbolSintactico_GetFunctionByName(name);



    if(metodo){// Si existe el metodo lo centramos en la escena

        guionDeEjecucion.push({parametro:[metodo,l], metodo:"crearMetodo"   });
        for(let i of metodo.hijos){ //Recorremos los hijos del metodo 
            addPaso(i);
        }
        
        guionDeEjecucion.push({parametro:[metodo],metodo:"MethodOut"});

    }else{
        console.log("No se encontro funcion main",metodo);
    }
}
function crearGuionAnimacion(){
    recorrerMetodo("main");
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

    crearGuionPrecompilacion();
    run_guionDePreCompilacion();

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
        indicepaso += 1; 
    }
}
function btn_camara(){
    console.log(lstElements)
    esAnimacionFluida = false;

    /*
    let o1 = getElementByID(4);
    let o2 = getElementByID(o1._idPadre);
    //o1.sons.remove(o2.element);
    //lstElements.splice(3, 1);
    console.log(o2);
    console.log(o1);
    let index = o2.subElements.findIndex(nodo => nodo.id == 4);
    console.log(index);
    o2.subElements.splice(index, 1);
    console.log("**************");
    console.log(o2);
    //*/
}



//PARA BUSCAR UNA FUNCION EN EL ARBOL SINTACTICO

function arbolSintactico_GetFunctionByName(nodoNombre){
    //http://jsfiddle.net/dystroy/MDsyr/
    let getSubMenuItem = function (subMenuItems, nodoNombre) {
        if (subMenuItems) {
            for (let i = 0; i < subMenuItems.length; i++) {
                if (subMenuItems[i].tipo == "defMetodo" && subMenuItems[i].nombre == nodoNombre ){
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









