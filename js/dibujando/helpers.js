var metodosEnEscena = 0;
/*      Constantes para la camara    */
const FOV = 45;
const ASPECT = window.innerWidth / window.innerHeight;
const NEAR = 1e-6;
const FAR = 1e27;

/*      constantes unidades de medida   */
const TAM_GRAL3 = 9.4605284e15;
const TAM_GRAL = 100;
const NUM_LOSETAS = 15;

/*      Variables globales del mundo*/
var scene;
var renderer;
var camera;

/*      Areas de dibujado       */
// zonaLibrerias  representa la zona donde se apilaran las librerias
// group_ejecucion  representa la zona donde se ejecutara el programa de entrada

const LIB_SCALE_X = 2;
const LIB_SCALE_Y = 1;
const LIB_SCALE_Z = 1;
const METODO_SCALE_X = 13;
const METODO_SCALE_Y = 1;
const METODO_SCALE_Z = 5;


var groupBase;
var zonaLibrerias;
var lstElements = [];


function setupThreeJS(){

    /*ESCENA*/
    scene = new THREE.Scene();
    //scene.fog = new THREE.FogExp2(0xdcf7e7, 0.001); // efecto neblina, no funciona con logarithmicDepthBuffer

    /*CAMARA*/
    camera = new THREE.PerspectiveCamera( FOV, ASPECT, NEAR, FAR );
    //camera.position.set(0,TAM_GRAL*16,TAM_GRAL*22);
    //camera.lookAt(scene.position);
    camera.position.x = 1.310480405193;
    camera.position.y = 550.2232636098454;
    camera.position.z = 1242.453572914064;

    camera.lookAt(scene.position);

    /*RENDER*/
    renderer = new THREE.WebGLRenderer({antialias: true,logarithmicDepthBuffer: true});//antialias: true, mejora los bordes | logarithmicDepthBuffer: true , es para soportar grandes distancias
    renderer.setSize( window.innerWidth, window.innerHeight );
    //renderer.setClearColor(0x000000, 1.0);
    renderer.shadowMap.enabled = true;
    //renderer.setClearColor( scene.fog.color );


    document.getElementById("representacion_3D").appendChild(renderer.domElement);
}
var      setupAxis = () => scene.add( new THREE.AxisHelper( 1e19 ) );

var      setupLuz  = () => scene.add( new THREE.AmbientLight( 0xffffff ) );// Luz blanca suave

function setupSuelo(){
    var materiales = [
        new THREE.MeshPhongMaterial({color: "#ccc", side: THREE.DoubleSide}),
        new THREE.MeshBasicMaterial( { color: 0x000000, wireframe: true } )
    ];
    var geometria = new THREE.PlaneGeometry(NUM_LOSETAS*TAM_GRAL,NUM_LOSETAS*TAM_GRAL,NUM_LOSETAS,NUM_LOSETAS);
    var plane = THREE.SceneUtils.createMultiMaterialObject(geometria,materiales);

    plane.rotation.x = -Math.PI/2;
    plane.position.y = -TAM_GRAL/2;// bajo el piso para no tener q recalcular cada elemento a la altura del piso
    plane.children.forEach(function(e) {e.receiveShadow=true});


    scene.add(plane);
}



function setupGroupBase(){
    groupBase      = new THREE.Group();
    groupBase.name = "group_general";
    scene.add(groupBase);
}

function setupZonaLibrerias(){
    var geo = new THREE.BoxGeometry(TAM_GRAL, TAM_GRAL, TAM_GRAL);
    var mat = new THREE.MeshPhongMaterial({color: 'red', transparent:false, opacity:1,visible:true});
    zonaLibrerias = new THREE.Mesh(geo, mat);

    zonaLibrerias.castShadow = true;
    zonaLibrerias.receiveShadow = true;

    zonaLibrerias = new THREE.Group();

    zonaLibrerias.position.x= -((TAM_GRAL*NUM_LOSETAS)/2+(TAM_GRAL*LIB_SCALE_X));
    zonaLibrerias.position.y= 0;
    zonaLibrerias.position.z= 0;

    scene.add(zonaLibrerias);
}

function crearLibreria(instruccion){
    let element   = new Libreria(instruccion);
    let libreria  = element.element;
    
    lstElements.push(element);
    groupBase.add(libreria);
}

function crearMetodo(instruccion,l){

    javaEditor_markClean();
    javaEditor_markText(instruccion.lineaInicial, instruccion.lineaFinal);
    javaEditor_markText2(l, l);

    let padre     = getElementByID(instruccion.idPadre);
    let element   = new Metodo(instruccion);
    padre.subElements.push(element);
    padre.sons.add(element.element);

    element.MethodIn(instruccion);
}
function llamada_metodo_con_parametrosA(instruccion,metodo){
    console.log("estupidin")
    let envioParametros = instruccion.envioParametros;
    let parametros = [];
    for(let i of envioParametros){
        let nombre = i.nombre;
        let idPadre = instruccion.idPadre;
        parametros.push(getElementByName(nombre,idPadre));
    }


    let padre     = getElementByID(metodo.idPadre);
    let element   = new Metodo(metodo);
    padre.subElements.push(element);
    padre.sons.add(element.element);

    element.MethodIn(metodo);
    console.log("instruccion",instruccion)
    console.log("metodo",metodo)
    console.log("envioParametros",envioParametros)
    console.log("parametros",parametros)
}
function MethodOut(instruccion){
    javaEditor_markClean();
    let metodo   = getElementByID(instruccion.id);
    metodo.MethodOut(instruccion);
}

function crearVariable(instruccion){
    javaEditor_markClean();
    javaEditor_markText(instruccion.lineaInicial,instruccion.lineaInicial);

    let padre    = getElementByID(instruccion.idPadre);
    let element  = new Variable(instruccion);

    padre.subElements.push(element);
    padre.sons.add(element.element)

}

function asignarValorVariable(instruccion){
    javaEditor_markClean();
    javaEditor_markText(instruccion.lineaInicial,instruccion.lineaInicial);

    let A_quien       = `${instruccion.nombre}`;
    let valor         = instruccion.valor;
    let siguientePaso = true;

    let variable = getElementByName(A_quien, instruccion.idPadre);
    if(variable) variable.setTextValue(valor,siguientePaso);
}
function crearArreglo(instruccion){
    javaEditor_markClean();
    javaEditor_markText(instruccion.lineaInicial,instruccion.lineaInicial);

    let padre    = getElementByID(instruccion.idPadre);
    let element  = new Arreglo(instruccion);

    padre.subElements.push(element);
    padre.sons.add(element.element)

    for(let i of instruccion.hijos){
        crearArregloValor(i);
    }

}
function crearArregloValor(instruccion){
    //javaEditor_markClean();
    //javaEditor_markText(instruccion.lineaInicial);

    let padre    = getElementByID(instruccion.idPadre);
    let element = new ArregloValor(instruccion);

    padre.subElements.push(element);
    padre.sons.add(element.element)
}


function crearFOR(my_padre,lineaInicial){
    // Crear grupo q representa el cicloFor
    var cicloFor = new THREE.Group();
    cicloFor.name = "cicloFor_group-";
    cicloFor.my_name = "cicloFor";
    cicloFor.my_padre = "metodo_group-" + my_padre;// libreria a la que pretenece



    // add a la libreria

    group_librerias.getObjectByName(cicloFor.my_padre,true).getObjectByName("hijos").add(cicloFor);

    // Crear grupo de representacion visual
    var dibujitos = new THREE.Group();
    dibujitos.name="dibujitos";
    cicloFor.add(dibujitos);

    // Crear grupo que contendra los hijos como cicloFors , variables etc
    var hijos = new THREE.Group();
    hijos.name="hijos";
    cicloFor.add(hijos);

    // crear cubo
    var geo = new THREE.BoxGeometry(TAM_GRAL*4, TAM_GRAL, TAM_GRAL);
    var mat = new THREE.MeshPhongMaterial({color: 'orange', transparent:true, opacity:1,visible:true});
    var malla = new THREE.Mesh(geo, mat);
    cicloFor.position.y = TAM_GRAL;
    cicloFor.position.z = TAM_GRAL*2;


    malla.castShadow = true;
    malla.receiveShadow = true;
    malla.name = "my_geometria";
    
    // add los dibujitos
    dibujitos.add(malla);
    setupText(dibujitos,"for()",true,false);


    javaEditor_markClean();
    javaEditor_markText(lineaInicial,lineaInicial);
}
function eliminarFor(my_padre){
    ciclo = group_librerias.getObjectByName("metodo_group-" +my_padre,true).getObjectByName("cicloFor_group-",true);
    group_librerias.getObjectByName("metodo_group-" +my_padre,true).children[1].remove(ciclo);
}




function asignarValorArreglo(A_quien,indice,valor,lineaInicial){
    dibujitos = scene.getObjectByName( "variable_group-" + A_quien,true).children[1].children[indice].children[0];
    //console.log(dibujitos)
    textito = dibujitos.getObjectByName("textito",true);
    dibujitos.remove(textito);
    setupText(dibujitos,valor,true,true);

    javaEditor_markClean();
    javaEditor_markText(lineaInicial,lineaInicial);
   // console.log(A_quien,valor,dibujitos,textito);
}
function finMain(){
    scene.remove(groupBase);
    javaEditor_markClean();
}



function getElementByID(id){
    //http://jsfiddle.net/dystroy/MDsyr/
    let getSubMenuItem = function (subMenuItems, id) {
        if (subMenuItems) {
            for (let i = 0; i < subMenuItems.length; i++) {
                if (subMenuItems[i].id == id) {
                    return subMenuItems[i];
                };
                let found = getSubMenuItem(subMenuItems[i].subElements, id);
                if (found) return found;
            }
        }
    };

    let searchedItem = getSubMenuItem(lstElements, id) || null;
    return searchedItem;
}
function getElementByName(name, idPadre){
    //http://jsfiddle.net/dystroy/MDsyr/
    let getSubMenuItem = function (subMenuItems, name, idPadre) {
        if (subMenuItems) {
            for (let i = 0; i < subMenuItems.length; i++) {
                if (subMenuItems[i].name == name && subMenuItems[i].idPadre == idPadre) {
                    return subMenuItems[i];
                };
                let found = getSubMenuItem(subMenuItems[i].subElements, name, idPadre);
                if (found) return found;
            }
        }
    };

    let searchedItem = getSubMenuItem(lstElements, name, idPadre) || null;
    return searchedItem;
}




