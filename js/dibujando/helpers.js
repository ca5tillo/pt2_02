
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

    document.body.appendChild(renderer.domElement);
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
    let nombre    = instruccion.nombre;

    let element   = new Libreria(nombre);
    let libreria  = element.element;
    
    lstElements.push(element);
    groupBase.add(libreria);
}

function crearMetodo(instruccion){
    let nombre    = instruccion.nombre;
    let my_padre  = instruccion.padre.nombre;

    var element   = new Metodo(nombre,my_padre);
    var metodo    = element.element;

    lstElements.push(element);
    groupBase.getObjectByName(metodo.my_padre).getObjectByName("sons").add(metodo);
}

function crearVariable(instruccion){
    let nombre        = instruccion.nombre;
    let my_padre      = instruccion.padre.nombre;
    let my_valor      = instruccion.valor;
    let lineaInicial  = instruccion.lineaInicial;

    javaEditor_markClean();
    javaEditor_markText(lineaInicial);

    var element = new Variable(nombre,my_padre, my_valor);
    var variable = element.element;

    lstElements.push(element);
    groupBase.getObjectByName(variable.my_padre,true).getObjectByName("sons").add(variable);
}

function asignarValor(instruccion){
    let A_quien       = instruccion.nombre;
    let valor         = instruccion.valor;
    let lineaInicial  = instruccion.lineaInicial;
    let siguientePaso = true;

    javaEditor_markClean();
    javaEditor_markText(lineaInicial);

    let variable = getElementByName("element_variable-" + A_quien);
    if(variable) variable.setTextValue(valor,siguientePaso);
}
function crearArreglo(instruccion){
    console.log(instruccion);
}
function crearArregloold(my_padre, my_visibilidad, my_static, my_tipo, nombre, my_valor,lineaInicial){
    // Grupo q representa la variable
    var variable = new THREE.Group();
    variable.my_padre = "group_metodo-" + my_padre;

    variable.name = "variable_group-" + nombre;
    variable.my_valor = my_valor;
    variable.my_indice = groupBase.getObjectByName(variable.my_padre,true).getObjectByName("sons").children.length;
                        // subir la altira para q se apilen           // aumentarle la separacion entre objetos
    variable.position.y =  ((TAM_GRAL)+(TAM_GRAL+TAM_GRAL/3)*variable.my_indice);
    variable.position.x =  -((TAM_GRAL*METODO_SCALE_X)/2-TAM_GRAL/2);
    variable.position.z =  -((TAM_GRAL*METODO_SCALE_Z)/2-TAM_GRAL/2);
    groupBase.getObjectByName(variable.my_padre,true).getObjectByName("sons").add(variable);

    // Crear grupo de representacion visual
    var dibujitos = new THREE.Group();
    dibujitos.name="dibujitos";
    variable.add(dibujitos);

    // Crear grupo que contendra los hijos como metodos , variables etc
    var hijos = new THREE.Group();
    hijos.name="hijos";
    variable.add(hijos);

    // crear cubo
    var geo = new THREE.BoxGeometry(TAM_GRAL*2, TAM_GRAL, TAM_GRAL);
    var mat = new THREE.MeshPhongMaterial({color: 'green', transparent:true, opacity:0.6});
    var malla = new THREE.Mesh(geo, mat);

    malla.castShadow = true;
    malla.receiveShadow = true;
    malla.name = "my_geometria";

    dibujitos.add(malla);
    setText(dibujitos,"[ ]"+nombre,true);

    for(let i of my_valor){
        var valor = new THREE.Group();
        hijos.add(valor);
        valor.position.x = ((TAM_GRAL)+(TAM_GRAL+TAM_GRAL/3)*hijos.children.length);   
        // Crear grupo de representacion visual
        var dibujitos2 = new THREE.Group();
        dibujitos2.name="dibujitos";
        valor.add(dibujitos2);

        // Crear grupo que contendra los hijos como metodos , variables etc
        var hijos2 = new THREE.Group();
        hijos2.name="hijos";
        valor.add(hijos2);

        // crear cubo
        var geo = new THREE.BoxGeometry(TAM_GRAL, TAM_GRAL, TAM_GRAL);
        var mat = new THREE.MeshPhongMaterial({color: 'green', transparent:true, opacity:0.6});
        var malla = new THREE.Mesh(geo, mat);

        malla.castShadow = true;
        malla.receiveShadow = true;
        malla.name = "my_geometria";

        dibujitos2.add(malla);
        setText(dibujitos2,i,true);

    }
    javaEditor_markClean();
    javaEditor_markText(lineaInicial);
    
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
    javaEditor_markText(lineaInicial);
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
    javaEditor_markText(lineaInicial);
   // console.log(A_quien,valor,dibujitos,textito);
}
function finMain(){
    scene.remove(groupBase);
    javaEditor_markClean();
}



function getElementByName(name){
    let x = null;
    //console.log(lstElements);
    for(let i of lstElements){
        if(i.name == name)x=i;
    }
    return x;
}

function callStaticMethod(instruccion){
    let metodo   = getElementByName("element_metodo-"+instruccion.nombre);
    let cubo     = metodo.cube;
    let element  = metodo.element;
    let padre    = groupBase.getObjectByName(element.my_padre,true);


 

    var tweenA = new TWEEN.Tween(element.position)
    .to({ x: -padre.position.x, 
          y: -padre.position.y, 
          z: -padre.position.z }, velocidad)
    .easing(TWEEN.Easing.Quadratic.In)
    .onStart(function (){
        cubo.material.opacity = 1;
        cubo.material.visible = true;
    })
    .onComplete(function () {
    });

    var tweenB = new TWEEN.Tween(cubo.scale)
    .to({ x:METODO_SCALE_X,Y:METODO_SCALE_Y,z: METODO_SCALE_Z,}, velocidad/2)
    .easing(TWEEN.Easing.Quadratic.In)
    .onComplete(function () {    
        let siguientePaso = true;
        let animar        = false;
        metodo.setTextName(instruccion.nombre, siguientePaso, animar);   
    });

    tweenA.chain(tweenB);
    tweenA.start();   
}
