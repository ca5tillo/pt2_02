/*      Constantes para la camara    */
const FOV = 45;
const ASPECT = window.innerWidth / window.innerHeight;
const NEAR = 0.1;
const FAR = 1000;

/*      constantes unidades de medida   */

const TAM_GRAL = 4;
const NUM_LOSETAS = 22;

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
var lstElements   = null; //nodo raiz
var lstIDsMetodos = {id:0,  children:[], descripcion:"lstIDsMetodos"};
var idNodoFinal   = null;


function setupThreeJS(){

    /*ESCENA*/
    scene             = new THREE.Scene();
    //scene.fog = new THREE.FogExp2(0xdcf7e7, 0.001); // efecto neblina, no funciona con logarithmicDepthBuffer

    /*CAMARA*/
    camera            = new THREE.PerspectiveCamera( FOV, ASPECT, NEAR, FAR );
    //camera.position.set(0,TAM_GRAL*16,TAM_GRAL*22);
    //camera.lookAt(scene.position);
    camera.position.x = -30;
    camera.position.y = 40;
    camera.position.z = 30;

    camera.lookAt(scene.position);

    /*RENDER*/
    renderer          = new THREE.WebGLRenderer();//antialias: true, mejora los bordes | logarithmicDepthBuffer: true , es para soportar grandes distancias
    renderer.setSize( window.innerWidth, window.innerHeight );
    renderer.setClearColor(0x000000, 1.0);
    renderer.shadowMap.enabled = true;
    //renderer.setClearColor( scene.fog.color );




    document.getElementById("representacion_3D").appendChild(renderer.domElement);
}
var      setupAxis = () => scene.add( new THREE.AxisHelper( 1e19 ) );

var      ambientLight  = () => scene.add( new THREE.AmbientLight( 0xffffff ) );// Luz blanca suave

function spotLight(){
    var spotLight = new THREE.SpotLight( 0xffffff );
        spotLight.position.set( 0, 60, 60 );
        spotLight.name = 'Spot Light';
        spotLight.angle = Math.PI / 5;
        spotLight.penumbra = 0.3;
        spotLight.castShadow = true;
        spotLight.shadow.camera.near = 8;
        spotLight.shadow.camera.far = 30;
        spotLight.shadow.mapSize.width = 1024;
        spotLight.shadow.mapSize.height = 1024;
        scene.add( spotLight );
        scene.add( new THREE.CameraHelper( spotLight.shadow.camera ) );
} 

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
function setupZonaLibrerias(){
    var geo = new THREE.BoxGeometry(TAM_GRAL, TAM_GRAL, TAM_GRAL);
    var mat = new THREE.MeshPhongMaterial({color: 'red', transparent:false, opacity:1,visible:true});
    zonaLibrerias = new THREE.Mesh(geo, mat);

    zonaLibrerias.castShadow = true;
    zonaLibrerias.receiveShadow = true;

    zonaLibrerias = new THREE.Group();

    zonaLibrerias.position.x= -((TAM_GRAL*METODO_SCALE_X)/2+(TAM_GRAL*LIB_SCALE_X));
    zonaLibrerias.position.y= 0;
    zonaLibrerias.position.z= 0;

    scene.add(zonaLibrerias);
}
function setupGroupBase(){
    groupBase      = new THREE.Group();
    groupBase.name = "group_general";
    scene.add(groupBase);

    lstElements = new Element();
    lstElements.name = "Elemento Raiz";
    lstElements.idPadre = lstElements.id;
    lstElements.idContenedor = lstElements.id;
}

function crearLibreria(instruccion,minum,numLibs){
    let element   = new Libreria(instruccion);
    let libreria  = element.element;
    
    lstElements.children.push(element);
    groupBase.add(libreria);
    element.in(minum,numLibs);
}
function crearMetodoMain(declaracion){
    javaEditor_markClean();
    javaEditor_markText(declaracion.lineaInicial, declaracion.lineaFinal);

    let padre     = getElementLibByName(declaracion.padre.name);
    let element   = new MetodoMain(declaracion);
    lstIDsMetodos.children.push({id:element.id, children:[], descripcion:"metodo"});

    padre.children.push(element);
    padre.sons.add(element.element);

    element.in(declaracion);
    return element.id;
}
function llamarMetodo(llamada, declaracion, destino){
    javaEditor_markClean();
    javaEditor_markText(declaracion.lineaInicial, declaracion.lineaFinal);
    javaEditor_markText2(llamada.lineaInicial);


    let idPadre         = getIdsAncestros().p;
    let idContenedor    = getIdsAncestros().c;
    let contenedor      = lstElements.getChildrenById(idContenedor);
    let padre           = lstElements.getChildrenById(idPadre);

    let element   = new Metodo(llamada,declaracion);
        element.returnA = destino;

    lstIDsMetodos.children.push({id:element.id, children:[], descripcion:"metodo"});

    padre.children.push(element);
    padre.sons.add(element.element);

    element.in(declaracion);

    return element.id;
}
function crearParametros(argumento, parametros){
    /*if(instruccion.lineaInicial){
        javaEditor_markClean();
        javaEditor_markText(instruccion.lineaInicial);
    }//*/


    let idContenedor    = getIdsAncestros().c;

    let metodoDestino   = lstElements.getChildrenById(idContenedor);
    let metodoOrigen    = lstElements.getChildrenById(metodoDestino.idContenedor);
    let elementoOrigen  = null;
    let valor 			= "";
    let indice          = metodoDestino.children.length;
    let element         = null;

    if(argumento.type == "NAME"){
    	elementoOrigen  = metodoOrigen.getChildrenByName(argumento.value,true);
    }else{
    	valor = argumento.value;
    }

    if(elementoOrigen){
    	let ins = {name:parametros[indice].name,value:elementoOrigen.value, type:parametros[indice].type};
    	element  = new VariablePorParametro(ins);
	    metodoDestino.children.push(element);
	    metodoDestino.sons.add(element.element);
	    element.in(ins,elementoOrigen.element);

    }else{
    	let ins = {name:parametros[indice].name,value:valor, type:parametros[indice].type};
    	element  = new Variable(ins);
	    metodoDestino.children.push(element);
	    metodoDestino.sons.add(element.element);
	    element.in(ins);
    }
}
function returnVariable(instruccion){
    if(instruccion.lineaInicial){
        javaEditor_markClean();
        javaEditor_markText(instruccion.lineaInicial);
    }

    let siguientePaso   = false; // es false ya que el  MethodOut() ara el siguiente paso
    let idPadre         = getIdsAncestros().p;
    let idContenedor    = getIdsAncestros().c;
    let contenedor      = lstElements.getChildrenById(idContenedor);
    let padre           = lstElements.getChildrenById(idPadre);

    if(contenedor.returnA){

	    let value           = contenedor.getChildrenByName(instruccion.name,true).value;
	    let destino         = lstElements.getChildrenById(contenedor.idContenedor).getChildrenByName(contenedor.returnA);
	    destino.value       = value;
        destino.setTextValue(value,siguientePaso);

    }
    MethodOut();
}
function MethodOut(){
    javaEditor_markClean();
    let idMetodoActual   = getIdsAncestros().c;
    let metodo           = lstElements.getChildrenById(idMetodoActual);
    if(metodo){
    	metodo.out();
    	lstIDsMetodos.children.pop();
    	main_LstPasos.children.pop();
    }
}
function crearVariable(instruccion){
    if(instruccion.lineaInicial){
        javaEditor_markClean();
        javaEditor_markText(instruccion.lineaInicial);
    }

    let idPadre  = getIdsAncestros().p;
    let padre    = lstElements.getChildrenById(idPadre);
    let element  = new Variable(instruccion);

    padre.children.push(element);
    padre.sons.add(element.element);

    element.in(instruccion);
}
function crearVariable_2(instruccion){
	/*existe ya que en la exppresion 
            int e = otroMetodo(a, b, b);
      se crea una variable y al mismo tiempo se llama al metodo 
      en modo fluido las dos llamaban al siguiente paso y eso creaba conflicto 
      con esta funcion el crear la variable ya no llama al siguiente paso 
	*/
    if(instruccion.lineaInicial){
        javaEditor_markClean();
        javaEditor_markText(instruccion.lineaInicial);
    }

    let idPadre  = getIdsAncestros().p;
    let padre    = lstElements.getChildrenById(idPadre);
    let element  = new Variable(instruccion);

    padre.children.push(element);
    padre.sons.add(element.element);

    element.in2(instruccion);
}
function asignarValorVariable(instruccion){
    javaEditor_markClean();
    javaEditor_markText(instruccion.lineaInicial);

    let A_quien       = `${instruccion.name}`;
    let valor         = instruccion.valor;
    let siguientePaso = true;
    let idContenedor  = getIdsAncestros().c;

    let variable    = lstElements.getChildrenById(idContenedor).getChildrenByName(A_quien,true);
    if(variable){
		variable.setTextValue(valor,siguientePaso);	
		variable.value = valor;
    }
}
function crearArreglo(instruccion){
    javaEditor_markClean();
    javaEditor_markText(instruccion.lineaInicial);

    let idPadre         = getIdsAncestros().p;
    let padre           = lstElements.getChildrenById(idPadre);

    let element  		= new Arreglo(instruccion);


    lstIDsMetodos.children[lstIDsMetodos.children.length-1].children.push({id:element.id, children:[], descripcion:"arreglo"});
    padre.children.push(element);
    padre.sons.add(element.element)
    element.in(instruccion);
    for(let i of instruccion.hijos){
        crearArregloValor(i);
    }
    lstIDsMetodos.children[lstIDsMetodos.children.length-1].children.pop();
}
function crearArregloValor(instruccion){
    //javaEditor_markClean();
    //javaEditor_markText(instruccion.lineaInicial);

    let idPadre         = getIdsAncestros().p;
    let padre           = lstElements.getChildrenById(idPadre);
    let element 		= new ArregloValor(instruccion);

    padre.children.push(element);
    padre.sons.add(element.element);
    element.in(instruccion);
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








