"use strict";
var R01 = {
    'lstElements'          : null,//nodo raiz
    '_lstIDsMetodos'       : {id:0,  children:[], descripcion:"lstIDsMetodos"},
    '_idNodoFinal'         : null,// ?

    'LIB_SCALE_X'          : 2,
    'LIB_SCALE_Y'          : 1,
    'LIB_SCALE_Z'          : 2,
    'METODO_SCALE_X'       : 7,
    'METODO_SCALE_Y'       : 1,
    'METODO_SCALE_Z'       : 5,

    'zoneLib'              : null, // zonaLibrerias  representa la zona donde se apilaran las librerias
    'groupBase'            : null, // group_ejecucion  representa la zona donde se ejecutara el programa de entrada

    _addAncestro_1         : function(element, descripcion){
        this._lstIDsMetodos.children.push(
            {
                id           : element.id, 
                children     : [], 
                descripcion  : descripcion
            });
    },
    _addAncestro_2         : function(element, descripcion){
        let obj = {
            id           : element.id, 
            children     : [], 
            descripcion  : descripcion
        };
        this._lstIDsMetodos.children[this._lstIDsMetodos.children.length-1].children.push(obj);
    },
    _popAncestro_1         : function (){
        
        this._lstIDsMetodos.children.pop();
    },
    _popAncestro_2         : function (){
       
        this._lstIDsMetodos.children[this._lstIDsMetodos.children.length-1].children.pop();
    },
    reset                  : function(){
        MyThreeJS.scene.remove(this.zoneLib);
        MyThreeJS.scene.remove(this.groupBase);
        this.zoneLib              = null;
        this.groupBase            = null;
        this.lstElements          = null;
        this._lstIDsMetodos       = {id:0,  children:[], descripcion:"lstIDsMetodos"};
    },
    getIdsAncestros        : function(){
        let ids = {p:0,c:0};// padre y contenedor
        if (R01._lstIDsMetodos.children.length > 0){        
            let index_1 = R01._lstIDsMetodos.children.length-1;
            let index_2 = R01._lstIDsMetodos.children[index_1].children.length;

            ids.c       = R01._lstIDsMetodos.children[index_1].id;
            ids.p       = index_2 > 0 ? R01._lstIDsMetodos.children[index_1].children[index_2-1].id  :  ids.c;
        }
        return ids;
    },
    getElementLibByName    : function(name){
        let x = null;
        for(let i of R01.lstElements.children){
            if (i.name == name)
                x = i;
        }
        return x;
    },
    setupZoneLib           : function(){
        this.zoneLib = new THREE.Group();

        this.zoneLib.position.x= ((Config_R01.TAM_GRAL*this.METODO_SCALE_X)/2+(Config_R01.TAM_GRAL*this.LIB_SCALE_X));
        this.zoneLib.position.y= 0;
        this.zoneLib.position.z= 0;

        MyThreeJS.scene.add(this.zoneLib);
    },
    setupGroupBase         : function(){
        this.lstElements              = new Element();
        this.lstElements.name         = "Elemento Raiz";
        this.lstElements.idPadre      = this.lstElements.id;
        this.lstElements.idContenedor = this.lstElements.id;

        this.groupBase               = new THREE.Group();
        this.groupBase.name          = "group_general";
        MyThreeJS.scene.add(this.groupBase);
    },
    crearLibreria          : function(instruccion, minum, numLibs){
        let element   = new Libreria(instruccion);
        let libreria  = element.element;
        
        this.lstElements.children.push(element);

        this.groupBase.add(libreria);
        element.in(minum,numLibs);
    },
    llamarMetodoMain       : function(declaracion){
        let padre     = this.getElementLibByName(declaracion.padre.name);
        let element   = new MetodoMain(declaracion);
        this._addAncestro_1(element,"MetodoMain");

        padre.children.push(element);
        padre.sons.add(element.element);

        element.in(declaracion);
        return element.id;
    },
    llamarMetodo           : function(llamada, declaracion, destino){
        /*javaEditor_markText_Clean();
        javaEditor_markText(declaracion.lineaInicial, declaracion.lineaFinal);
        javaEditor_markText(llamada.lineaInicial);*/


        let idPadre         = this.getIdsAncestros().p;
        let idContenedor    = this.getIdsAncestros().c;
        let contenedor      = this.lstElements.getChildrenById(idContenedor);
        let padre           = this.lstElements.getChildrenById(idPadre);

        let element         = new Metodo(llamada,declaracion);
            element.returnA = destino;

        this._addAncestro_1(element,"Metodo");

        padre.children.push(element);
        padre.sons.add(element.element);

        element.in(declaracion);

        return element.id;
    },
    crearVariable          : function(instruccion){
        /*  Para Representar :
            int     a;
            String  cadena = "texto";
        */
        let idPadre  = this.getIdsAncestros().p;
        let padre    = this.lstElements.getChildrenById(idPadre);
        let element  = new Variable(instruccion);

        padre.children.push(element);
        padre.sons.add(element.element);

        element.in();
    },
    asignacion_01          : function(instruccion){
        let idContenedor  = this.getIdsAncestros().c;
        let A_quien       = `${instruccion.name}`;
        let variable      = this.lstElements.getChildrenById(idContenedor).getChildrenByName(A_quien,true);

        if(variable){

            let valor         = variable.value;
            if(['INT','FLOAT','DOUBLE'].find(function(i){return(i==variable.type);})){
                valor = parseFloat(valor);
            } 

            let nuevoValor    = valor + 1;

            let arr = [
                    {ext:'ext',string:instruccion.string.replace(";","")},
                    {symbol:'NAME',string:variable.name},
                    {ext:'ext',string:'='},
                    {ext:'ext',string:nuevoValor}
                ];
            variable.asignacion(arr);
        }
    },
    asignarValorVariable   : function(instruccion){
        let A_quien       = `${instruccion.name}`;
        let valor         = instruccion.valor;
        let siguientePaso = true;
        let animar        = true;
        let idContenedor  = this.getIdsAncestros().c;

        let variable      = this.lstElements.getChildrenById(idContenedor).getChildrenByName(A_quien,true);
        if(variable){
            //variable.setTextValue(valor,siguientePaso,animar); 
            variable.value = valor;

            let arr = [{ext:'ext',string:valor}];
            variable.asignacion(arr);
        }else{
            // Error en tiempo de ejecucion
        }
    },
    crearArreglo           : function(instruccion){
        let _crearArregloValor = function(instruccion, TriggerNextStep = false){
            
            let idPadre         = R01.getIdsAncestros().p;
            let padre           = R01.lstElements.getChildrenById(idPadre);
            let element         = new ArregloValor(instruccion);

            padre.children.push(element);
            padre.sons.add(element.element);
            element.in(TriggerNextStep);
        }
        let idPadre           = this.getIdsAncestros().p;
        let padre             = this.lstElements.getChildrenById(idPadre);

        let numSubE           = instruccion.hijos.length;

        let element           = new Arreglo(instruccion);


        // inserto el arreglo al _lstIDsMetodos para poder despues insertar los subelementos
        this._addAncestro_2(element, "Arreglo");
        
        padre.children.push(element);
        padre.sons.add(element.element);
        element.in();

        for(let i = 0; i < numSubE; i++){
            if(i == numSubE-1){// si es el ultimo
                _crearArregloValor(instruccion.hijos[i], true);
            }else{
                _crearArregloValor(instruccion.hijos[i]);
            }
        }
        this._popAncestro_2();
    },
    MethodOut              : function(){
        let idMetodoActual   = this.getIdsAncestros().c;
        let metodo           = this.lstElements.getChildrenById(idMetodoActual);

        if(metodo){
            metodo.out();
            this._popAncestro_1();
            // ya no se usa  "Main.popPasos_Level_1();" aqui porque cuando simplemente se terminan las reglas de un metodo
            // es "Main.getInstruccion" quien saca el generador de la pila           
        }
    },
    crearVariable_2        : function(instruccion){
        /*
            existe ya que en la exppresion 
                int e = otroMetodo(a, b, b);
            se crea una variable y al mismo tiempo se llama al metodo 
            en modo fluido las dos llamaban al siguiente paso y eso creaba conflicto 
            con esta funcion el crear la variable ya no llama al siguiente paso 
        */       
        let idPadre         = this.getIdsAncestros().p;
        let padre           = this.lstElements.getChildrenById(idPadre);
        let element         = new Variable(instruccion);
        let TriggerNextStep = false;

        padre.children.push(element);
        padre.sons.add(element.element);

        element.in(TriggerNextStep);
    },
    crearParametros        : function(argumento, parametros){
        let idContenedor    = this.getIdsAncestros().c;

        let metodoDestino   = this.lstElements.getChildrenById(idContenedor);
        let metodoOrigen    = this.lstElements.getChildrenById(metodoDestino.idContenedor);
        let elementoOrigen  = null;
        let valor           = "";
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
            element.in(elementoOrigen.value,elementoOrigen);
        }else{
            let ins = {name:parametros[indice].name,value:valor, type:parametros[indice].type};
            element  = new Variable(ins);
            metodoDestino.children.push(element);
            metodoDestino.sons.add(element.element);
            element.in();
        }
    },
    returnVariable         : function(instruccion){
        let siguientePaso   = false; // es false ya que el  MethodOut() ara el siguiente paso
        let idPadre         = this.getIdsAncestros().p;
        let idContenedor    = this.getIdsAncestros().c;
        let contenedor      = this.lstElements.getChildrenById(idContenedor);
        let padre           = this.lstElements.getChildrenById(idPadre);

        if(contenedor.returnA){

            let value           = contenedor.getChildrenByName(instruccion.name,true).value;
            let destino         = this.lstElements.getChildrenById(contenedor.idContenedor).getChildrenByName(contenedor.returnA);
            destino.value       = value;

            
            let arr = [
                {symbol: 'NAME', string:instruccion.name},
                {ext:'ext',string:value}
                ];
            destino.retornar(arr);

            Main.popPasos_Level_1(); // cuando existe un return se fuerza el borrar los paso q ya fueron cargados

        }
        //this.MethodOut();// se ejecuta en la animacion de setText5
    },
    returnNum              : function(instruccion){

        let siguientePaso   = false; // es false ya que el  MethodOut() ara el siguiente paso
        let idPadre         = this.getIdsAncestros().p;
        let idContenedor    = this.getIdsAncestros().c;
        let contenedor      = this.lstElements.getChildrenById(idContenedor);
        let padre           = this.lstElements.getChildrenById(idPadre);

        if(contenedor.returnA){

            let value           = instruccion.num;
            let destino         = this.lstElements.getChildrenById(contenedor.idContenedor).getChildrenByName(contenedor.returnA);
            destino.value       = value;
            let arr = [{ext:'ext',string:value},{ext:'ext',string:value}];// se coloca dos veccecs ya q 1 es animacion y 2 es el resultado
            destino.retornar(arr);
            Main.popPasos_Level_1(); // cuando existe un return se fuerza el borrar los paso q ya fueron cargados

        }
        //this.MethodOut();// se ejecuta en la animacion de setText5
    },
    asignacion2            : function(instruccion){
        /*
            Para representar Operaciones matematicas 
            i = 5+9; i = a + b;
        */
        let siguientePaso   = true;
        let animar          = true;
        let idPadre         = this.getIdsAncestros().p;
        let idContenedor    = this.getIdsAncestros().c;
        let contenedor      = this.lstElements.getChildrenById(idContenedor);
        let padre           = this.lstElements.getChildrenById(idPadre);        
        let destino         = this.lstElements.getChildrenById(idContenedor).getChildrenByName(instruccion.destinoName);


        let expresion  = "";
        let expresion2 = "";
        let resultado  = "?";

        for(let i of instruccion.expresion){            
            expresion += expresion == "" ? i.string : " "+i.string;
            if(i.symbol == 'NAME'){
                let valval = contenedor.getChildrenByName(i.string, true).value;
                expresion2 += expresion2 == "" ? valval   : " "+valval;
            }else{
                expresion2 += expresion2 == "" ? i.string : " "+i.string;
            }
        }
        destino.exp_matematica = expresion2;
        try{
            resultado = eval(expresion2);
        }catch(err){
            alert("Error en tiempo de ejecucion");
            console.log("Error en tiempo de ejecucion");
        }

        let arr = [{ext:'ext',string:expresion}];
        let as = [{ext:'ext',string:'='},{ext:'ext',string:resultado}];
        let myarr = arr.concat(instruccion.expresion, as);  
        destino.asignacion(myarr);

        destino.value = resultado;
    },
    for                    : function(instruccion){

        let idPadre         = this.getIdsAncestros().p;
        let idContenedor    = this.getIdsAncestros().c;
        let contenedor      = this.lstElements.getChildrenById(idContenedor);
        let padre           = this.lstElements.getChildrenById(idPadre);

        let element  = new CFor(instruccion);
        this._addAncestro_2(element, "CFor");
        padre.add(element);
        element.in();
    },
    forend                 : function(instruccion){
        let idPadre         = this.getIdsAncestros().p;
        let idContenedor    = this.getIdsAncestros().c;
        let contenedor      = this.lstElements.getChildrenById(idContenedor);
        let padre           = this.lstElements.getChildrenById(idPadre);

        padre.in2();
    },
    for_r1                 : function(instruccion){

        let siguientePaso   = true;
        let idPadre         = this.getIdsAncestros().p;
        let idContenedor    = this.getIdsAncestros().c;
        let contenedor      = this.lstElements.getChildrenById(idContenedor);
        let padre           = this.lstElements.getChildrenById(idPadre);

        let expresion  = "";
        let expresion2 = "";
        let resultado  = false;
        for(let i of instruccion.arr){            
            expresion += expresion == "" ? i.string : " "+i.string;
            if(i.symbol == 'NAME'){
                let valval = contenedor.getChildrenByName(i.string,true).value;
                expresion2 += expresion2 == "" ? valval   : " "+valval;
            }else{
                expresion2 += expresion2 == "" ? i.string : " "+i.string;
            }
        }        
        try{ resultado = eval(expresion2); }catch(err){
            alert("Error evaluacion");
        }
        padre.value = resultado;


        let miarr = [{ext:'ext',string:expresion}].concat(instruccion.arr,[{ext:'ext',string:'='},{ext:'ext',string:resultado+""}]);

        padre.asignacion(miarr);
    },
    drawIF                 : function(instruccion){

        let siguientePaso   = true;
        let idPadre         = this.getIdsAncestros().p;
        let idContenedor    = this.getIdsAncestros().c;
        let contenedor      = this.lstElements.getChildrenById(idContenedor);
        let padre           = this.lstElements.getChildrenById(idPadre);

        let expresion  = "";
        let expresion2 = "";
        let resultado  = false;

        for(let i of instruccion.condicionales){            
            expresion += expresion == "" ? i.string : " "+i.string;
            if(i.symbol == 'NAME'){
                let valval = contenedor.getChildrenByName(i.string).value;
                expresion2 += expresion2 == "" ? valval   : " "+valval;
            }else{
                expresion2 += expresion2 == "" ? i.string : " "+i.string;
            }
        }

        
        try{ resultado = eval(expresion2); }catch(err){
            alert("Error evaluacion");
        }

        instruccion.value = resultado;

        let arr = [{ext:'ext',string:expresion}];
        let as = [{ext:'ext',string:'='},{ext:'ext',string:resultado+""}];
        let myarr = arr.concat(instruccion.condicionales, as);  


        let element  = new CIf(instruccion);
        this._addAncestro_2(element, "CIf");
        padre.add(element);
        element.in(myarr);


        return resultado;
    },
    ifOutfalse             : function(){
        let idPadre         = this.getIdsAncestros().p;
        let padre           = this.lstElements.getChildrenById(idPadre);
        padre.out();
        this._popAncestro_2();
    },
    viewElse               : function(instruccion){
        let siguientePaso   = true;
        let idPadre         = this.getIdsAncestros().p;
        let idContenedor    = this.getIdsAncestros().c;
        let contenedor      = this.lstElements.getChildrenById(idContenedor);
        let padre           = this.lstElements.getChildrenById(idPadre);

        
        let element  = new CElse(instruccion);
        this._addAncestro_2(element, "CIf");
        padre.add(element);
        element.in();
    }

};














function refreshText() {
    scene.remove( textMesh1 );
    createText();
}
function createText(sa) {
    let text            = "three.js";
    let size            = 70;
    let height          = 20;
    let curveSegments   = 4;
    let bevelThickness  = 2;
    let bevelSize       = 1.5;
    let bevelEnabled    = false;// este valor en true para fuentes muy pequeñas (size) se distorciona el texto

     


    material = new THREE.MultiMaterial( [
        new THREE.MeshPhongMaterial( { color: 0xffffff, shading: THREE.FlatShading } ), // front
        new THREE.MeshPhongMaterial( { color: 0xffffff, shading: THREE.SmoothShading } ) // side
    ] );


    textGeo = new THREE.TextGeometry( text, {

        font: font,

        size: size,
        height: height,
        ///*
        size: TAM_GRAL/6,
        height: (TAM_GRAL/20)/2,
        //*/
        curveSegments: curveSegments,

        bevelThickness: bevelThickness,
        bevelSize: bevelSize,
        bevelEnabled: bevelEnabled,
        material: 0,
        extrudeMaterial: 1

    });
    //textGeo.center();
    textGeo.computeBoundingBox();
    textGeo.computeVertexNormals();


    if ( ! bevelEnabled ) {
        /*
        "Fijar" las normales laterales eliminando la componente z de las normales 
        para las caras laterales (esto no funciona bien para la geometría biselada 
        ya que entonces perdemos una curvatura agradable alrededor del eje z)
        */

        var triangleAreaHeuristics = 0.1 * ( height * size );

        for ( var i = 0; i < textGeo.faces.length; i ++ ) {

            var face = textGeo.faces[ i ];

            if ( face.materialIndex == 1 ) {

                for ( var j = 0; j < face.vertexNormals.length; j ++ ) {

                    face.vertexNormals[ j ].z = 0;
                    face.vertexNormals[ j ].normalize();

                }

                var va = textGeo.vertices[ face.a ];
                var vb = textGeo.vertices[ face.b ];
                var vc = textGeo.vertices[ face.c ];

                var s = THREE.GeometryUtils.triangleArea( va, vb, vc );

                if ( s > triangleAreaHeuristics ) {

                    for ( var j = 0; j < face.vertexNormals.length; j ++ ) {

                        face.vertexNormals[ j ].copy( face.normal );

                    }

                }

            }

        }

    }

    var centerOffset = -0.5 * ( textGeo.boundingBox.max.x - textGeo.boundingBox.min.x );

    textMesh1 = new THREE.Mesh( textGeo, material );
    textMesh1.position.x = centerOffset;


    scene.add( textMesh1 );

    

}

























function crearFORold(my_padre,lineaInicial){
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


    javaEditor_markText_Clean();
    javaEditor_markText(lineaInicial);
}
function eliminarForold(my_padre){
    ciclo = group_librerias.getObjectByName("metodo_group-" +my_padre,true).getObjectByName("cicloFor_group-",true);
    group_librerias.getObjectByName("metodo_group-" +my_padre,true).children[1].remove(ciclo);
}




function asignarValorArregloold(A_quien,indice,valor,lineaInicial){
    dibujitos = scene.getObjectByName( "variable_group-" + A_quien,true).children[1].children[indice].children[0];
    //console.log(dibujitos)
    textito = dibujitos.getObjectByName("textito",true);
    dibujitos.remove(textito);
    setupText(dibujitos,valor,true,true);

    javaEditor_markText_Clean();
    javaEditor_markText(lineaInicial);
   // console.log(A_quien,valor,dibujitos,textito);
}








