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

var esAnimacionFluida = false;
var guionDePreCompilacion = [];
var guionDeEjecucion = [];
var lstTweens = [];//usada para la animacion fluida

var velocidad = 300;
var arbolSintactico = null;
var indicepaso = 0;

function init(){
    setup_javaEditor();
    javaEditor_setText(
    `class Clase{
        public static void main(String[] args){
  
            String cadena = "texto";
            int numero;
            numero =5;
            String cadena2 = "texto texto texto texto ";
            cadena = "nuevo contenido";
            int i;

     
        }
    }`);

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
                guionDePreCompilacion.push({parametro:O_o, metodo:"crearMetodo"   });
            break;
        }
        for(let i of O_o.hijos){
            guionAdd_libMeto(i);
        }
    };
    guionDePreCompilacion.push({parametro:{},                metodo:"setupGroupBase"});
    guionDePreCompilacion.push({parametro:{nombre:"System"}, metodo:"crearLibreria"});


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
function crearGuionAnimacion(){


    funcionMain = buscarFuncion(arbolSintactico, "main");


    if(funcionMain){// Si existe main lo centramos en la escena
        guionDeEjecucion.push({parametro:funcionMain,metodo:"callStaticMethod"});
    }


    for(let i of funcionMain.hijos){ //Recorremos los hijos de main 
        switch(i.tipo){
            case "defVariable":
                guionDeEjecucion.push({parametro:i,metodo:"crearVariable"});
            break;

            case "asignacionDeValor":
                guionDeEjecucion.push({parametro:i,metodo:"asignarValor"});             
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


}

/*
Es la animacion de centrar la representacion de la funcion main()
*/


/*
Busca una funcion en el arbol sintactico
*/
function buscarFuncion (rrr , name){
    if(rrr.tipo == "defMetodo" && rrr.nombre == name ){       
        return rrr;
    }else{
        for(let i of rrr.hijos){
             return buscarFuncion (i , name);
        }   
    }
}
/******************************************************************************************************/

/*
Metodo privado usado en btn_pasoApaso()
http://www.forosdelweb.com/f13/llamar-funcion-con-nombre-por-cadena-808443/
*/
var _ejecutarpaso = (i) => self[   guionDeEjecucion[i].metodo    ] (guionDeEjecucion[i].parametro);


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
function btn_Camara(){
    finMain();
}