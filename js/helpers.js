

function *MainGenerador(arr){ for(let i of arr){ yield i; } }
function *GenerateID   (){var i = 0;while(true){yield i;i++;}}



function getElementLibByName(name){
    let x = null;
    for(let i of lstElements.children){
        if (i.name == name)
            x = i;
    }
    return x;
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
        for(let i = 0; i < _guion.length; i++){
            self[   _guion[i].metodo    ] (_guion[i].parametro,i,_guion.length-1);
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