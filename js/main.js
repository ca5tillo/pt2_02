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

var main_LstPasos      = {id:0, generador:null, children:[], descripcion:"main_LstPasos"};
var esAnimacionFluida  = false;
var ejecutado          = false;
var velocidad          = 200;


function init(){
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

/*
Recorre el ** arbolSintactico ** para identificar las librerias q seran usadas 
Inserta las instrucciones a ** guionDePreCompilacion ** estas instrucciones establecen 
que FUNCIONES usaran de los helpers de dibujado

Finalmente lleva a cabo la ejecucion de todas las instrucciones que se contienen en 
el ** guionDePreCompilacion **
*/
function crearGuionPrecompilacion(){
    //http://www.forosdelweb.com/f13/llamar-funcion-con-nombre-por-cadena-808443/
    _run = function (){
        for(let i of _guion){
            self[   i.metodo    ] (i.parametro);
        }
    }
    _add = function (O_o){
        if(O_o.reglaP == "clase"){
            _guion.push({parametro:O_o, metodo:"crearLibreria"});
        }
        for(let i of O_o.hijos){
            _add(i);
        }
    };
    let _guion = [];  //guionDePreCompilacion
    _guion.push({parametro:{},                               metodo:"setupGroupBase"});
    _guion.push({parametro:{name:"System",tipo: "defClase"}, metodo:"crearLibreria" });

    _add(as_arbol);
    _run();
}


function btn_Compilar(){
    analisisSintactico();

    crearGuionPrecompilacion();
    pintarArbolDeLlamadas();


    $("#Compilar").addClass("desactivado");
    $("#Ejecutar").removeClass("desactivado");
    $("#PorPasos").removeClass("desactivado");  


}

function btn_Ejecutar(){
    esAnimacionFluida = true;
    btn_pasoApaso();
}

function btn_camara (){
    esAnimacionFluida = false;
}
function btn_pasoApaso(){
    let instruccion = null;
    let tipo        = null;

    
    if(main_LstPasos.children.length > 0){
        instruccion = getInstruccion();
        if(instruccion){
            instruccion = instruccion.value; // esto es porq aun era el obj del generador
            ejecutarDibujado(instruccion);
        }
    }
    if(main_LstPasos.children.length == 0 && !ejecutado ){
        ejecutado   = true;
        let main    = as_GetFunctionByName("main");
        let id      = crearMetodoMain(main);
        main_LstPasos.children.push({id:id, generador:MainGenerador(main.hijos), children:[], descripcion:"metodo"});
    }

    pintarArbolDeLlamadas();
    pintarArbol("representacionarreglo1", lstIDsMetodos, ["id","descripcion"]);
    pintarArbol("representacionarreglo2", main_LstPasos, ["id","descripcion"]);
}
function ejecutarDibujado(instruccion){
    O_o = instruccion.reglaP

    if(      (O_o) == "ERROR_SINTACTICO"){}
    else if( (O_o) == "llamada"         ){
        if(instruccion.destinoCreate){
            crearVariable_2({
                lineaInicial:instruccion.lineaInicial, 
                type:instruccion.type,
                name:instruccion.destinoName,
                value: "?",
            });  
        }

        let destino     = instruccion.destinoName;
        let declaracion = as_GetFunctionByName(instruccion.name);
        let id          = llamarMetodo(instruccion, declaracion, destino);

        main_LstPasos.children.push({id:id, generador:MainGenerador(declaracion.hijos),children:[], descripcion:"metodo"});

        if(instruccion.argumentos.length > 0 ){
            let as = {generador:MainGenerador(instruccion.argumentos),children:[], descripcion:"argumentos"}
            main_LstPasos.children[main_LstPasos.children.length-1].children.push(as)
        }
    }
    else if( (O_o) == "argumento"       ){

        crearParametros(instruccion, as_GetFunctionByName(instruccion.namePadre).parametros); 
    }
    else if( (O_o) == "return_variable" ){

        returnVariable(instruccion);
    }
    else if( (O_o) == "variable"        ){

        crearVariable(instruccion);
    }
    else if( (O_o) == "asignacion"      ){

        asignarValorVariable(instruccion);  
    }
    else if( (O_o) == "arreglo"         ){

        crearArreglo(instruccion);  
    }

}
function getInstruccion(){
    let i = null;
    if(main_LstPasos.children.length > 0){
        let index_1 = main_LstPasos.children.length-1;    // indice del ultimo generador
        let index_2 = main_LstPasos.children[index_1].children.length-1;  // indice del ultimo hijo del ultimo generador
        let n       = main_LstPasos.children[index_1].children.length;  // numero de hijos del ultimo generador

        if(n > 0){// Tienen prioridad los main_LstPasos de segundo nivel
            i = main_LstPasos.children[index_1].children[index_2].generador.next();
            if(i.done){
                main_LstPasos.children[index_1].children.pop();
                i = getInstruccion();
            }
        }else{// Si no hay main_LstPasos de segundo nivel
            i = main_LstPasos.children[index_1].generador.next();
            if(i.done){
                MethodOut();
                i = null;
            }
        }
    }
    return i;
}





//PARA BUSCAR UNA FUNCION EN EL ARBOL SINTACTICO

function as_GetFunctionByName(nodoNombre){
    //http://jsfiddle.net/dystroy/MDsyr/
    let getSubMenuItem = function (subMenuItems, nodoNombre) {
        if (subMenuItems) {
            for (let i = 0; i < subMenuItems.length; i++) {
                if (subMenuItems[i].reglaP == "metodo" && subMenuItems[i].name == nodoNombre ){
                    return subMenuItems[i];
                };
                let found = getSubMenuItem(subMenuItems[i].hijos, nodoNombre);
                if (found) return found;
            }
        }
    };

    let searchedItem = getSubMenuItem([as_arbol], nodoNombre) || null;
    return searchedItem;
}









function pintarArbolDeLlamadas(){
    _createLista = function (nodo){
        let texto = document.createTextNode(`[${nodo.id},${nodo.idPadre},${nodo.idContenedor},${nodo.idAS || ""}]  ${nodo.name}`); 
        let li    = document.createElement("li");      
        li.setAttribute("data-value", `${nodo.id}`); 
        li.appendChild(texto);  
        if(nodo.children.length > 0){
            let ul = document.createElement("ul"); 
            li.appendChild(ul);                          
            for(let i of nodo.children){
                ul.appendChild(_createLista(i));  
            }
        } 
        return li;
    }
    if(lstElements){
        let ul    = document.createElement("ul"); 
        ul.setAttribute("id", "arbol"); 
        ul.appendChild(_createLista(lstElements));   

        document.getElementById("representacion_arbolDeLlamadas").innerHTML="";
        document.getElementById("representacion_arbolDeLlamadas").appendChild(ul);  

        $('#representacion_arbolDeLlamadas ul#arbol').bonsai({
            expandAll: true,
            createInputs: "radio"
        });

    }
}
function pintarArbol(destino, arbol, items){
    
    _createText  = function (nodo,items){
        let t    = "";
        for (let i of items){if(nodo[i]) t += nodo[i]+" ";}
        return t;
    }
    _createLista = function (nodo){
        let texto = document.createTextNode(_createText(nodo,items)); 
        let li    = document.createElement("li");        
        li.setAttribute("data-value", `${nodo.id}`); 
        li.appendChild(texto);  
        if(nodo.children.length > 0){
            let ul = document.createElement("ul"); 
            li.appendChild(ul);                          
            for(let i of nodo.children){
                ul.appendChild(_createLista(i));  
            }
        } 
        return li;
    }
    if(arbol){
        let ul    = document.createElement("ul"); 
        ul.setAttribute("id", "arbol"); 
        ul.setAttribute("data-name", destino);  
        ul.appendChild(_createLista(arbol));   
        //ul.addEventListener("change", as_infoNodo);

        document.getElementById(destino).innerHTML="";
        document.getElementById(destino).appendChild(ul);  

        $('#'+destino+' ul#arbol').bonsai({
            expandAll: true,
            createInputs: "radio"
        });

    }
}
