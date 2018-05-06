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
"use strict";

window.addEventListener('load', init);
window.addEventListener('resize', MyThreeJS.onResize, false);

var ApiInfo = {
    'llamada_terminada'    : false,
    'existe'               : false,
    'logueado'             : false,
    'id_proyecto'          : 0,
    'user_name'            : "",
    'permiso_edicion'      : false
};
var Main = {
    'ejecutado'            : false, // <<#6>>
    'mousedown'            : false, // <<#7>>  // usada en setup_EventosMouse();


    'lstPasos'             : {id:Main_generateID.next().value, children:[], generador:null,  descripcion:"lstPasos"},
    'esAnimacionFluida'    : false,
    'existenErrores'       : false, // as_imprimirArbol
    'actualInstruccion'    : null,// {value.reglaP, value.name}
    'nextInstruccion'      : null,
    'llamadas'             : [], // llamadas a metodos
    'errorEnEjecucion'     : false, // si se genera un error en ejecucion por evemplo q no encuentre una variable o un eval sanga mal se reiniciara el sistema
    reset                  : function(){
        this.lstPasos            = {id:Main_generateID.next().value, children:[], generador:null, descripcion:"lstPasos"};
        this.esAnimacionFluida   = false;
        this.ejecutado           = false;
        this.existenErrores      = false;
        this.errorEnEjecucion    = false;       
        this.llamadas            = []; 
    },
    marktext               : function(){
        Editor.java.cleanMarksTexts();
        if(this.actualInstruccion)
            this._marcarLinea_1(this.actualInstruccion.value);
        if(this.nextInstruccion)
            this._marcarLinea_2(this.nextInstruccion.value);   
    },
    analizarCodigoFuente   : function(){
        Editor.java.cleanMarksErrors();
        Editor.java.cleanMarksTexts();

        AS.run();
    },
    animacion_de_entrada         : function(){
        //<<#9>>
        
        let _run = function (){
            for(let i = 0; i < _guion.length; i++){
                R01[   _guion[i].metodo    ] (_guion[i].parametro, i, _guion.length-1);
            }
        }
        let _add = function (clases){
            for(let i of clases){
                _guion.push({parametro:i, metodo:"crearLibreria"});
            }
        };
        let _guion = [];  //guionDePreCompilacion
        _guion.push({parametro:{},              metodo:"setupZoneLib"  });
        _guion.push({parametro:{},              metodo:"setupGroupBase"});
        _guion.push({parametro:{name:{identifier:"System"}}, metodo:"crearLibreria" });

        let _clases = null;
        if( ( _clases = AS.filter(function(attr, obj){return (obj[attr] == "TypeDeclaration" );}) ) ){
            _add(_clases);
        }
        _run();

        new TWEEN.Tween(MyThreeJS.camera.position)
            .to         ({y:Config_R01.TAM_GRAL*6, z:Config_R01.TAM_GRAL*12 },4000)
            .easing     (TWEEN.Easing.Quadratic.Out)
            .onStart    ( function (){} )
            .onUpdate   ( function (){ MyThreeJS.camera.lookAt(MyThreeJS.scene.position); } )
            .onComplete ( function (){ Controles.activar__botones(); } )
            .start(); 
    },
    preparar               : function(){//BTN
        //https://github.com/pegjs/pegjs/blob/master/CHANGELOG.md
        //https://github.com/pegjs/pegjs/commit/4f7145e360b274807a483ebdcef4bea5ed460464
            
        let objMain = null;
        this.analizarCodigoFuente();
        //si no existe error sintactico y existe la funcion main
        if(
            ! AS.err 
            && (  objMain = AS.find(function(attr, obj){return (obj[attr] == "MethodDeclaration" && obj.name.identifier == "main");})  )
            //&& (  objMain = AS.find(function(attr, obj){return (obj[attr] == "Block");})  )
        ){
            /*
                MethodDeclaration
                    body{node:Block}
                        VariableDeclarationStatement
                            VariableDeclarationFragment
            */
            this.ejecutado            = true;
            Editor.sintactico.value   = jsDump.parse( AS.node );
            createdendrograma();

            this.nextInstruccion = { value: objMain, done: true, nodo: null }; // La estructura es una simulacion de la que devuelve el generador
            this._marcarLinea_2(objMain); 

            this.animacion_de_entrada();
            Editor.java.enableReadOnly();
            MyThreeJS.enableCameraControl();
        }else{
            if(! AS.err) Editor.java.markError(0,0,"No se encuentra el metodo main()");
            else         Editor.java.markError(0,0,AS.node);
        } 
        return  objMain?true:false;
    },
    animacionFluida        : function(){// BTN
        this.esAnimacionFluida = true;
        this.pasoApaso();
    },
    pausa                  : function(){// BTN

        this.esAnimacionFluida = false;
    },
    pasoApaso              : function(){// BTN
        let instruccion = null;
        let tipo        = null;

        Controles.funcion.Pasos  += 1; 
        if(Controles.funcion.Pasos == Controles.funcion.DetenerseEn)this.pausa();        

        if(this.nextInstruccion){            
            this.dibujar(this.nextInstruccion);

            this.actualInstruccion = this.nextInstruccion;
            this.nextInstruccion   = this.getInstruccion();

            // Si se ejecuto el if y le sigue un else este no se ejecutara y pedira el siguiente paso
            if(this.actualInstruccion.value.reglaP == "finGenerador2_Condicional_if"){
                if(this.nextInstruccion.value.reglaP == "Condicional_else" ){
                    this.nextInstruccion   = this.getInstruccion();
                }
            }
  
            this.marktext();                        
        }

    },    
    reiniciar              : function(){// BTN
        R01.reset();
        this.reset();

        as_arbol            = null;
        as_ids              = [];
        javaEditor_markText_Clean();
        javaEditor_clearMarkError();
        javaEditor_disableReadOnly();
        MyThreeJS.disableCameraControl();
        MyThreeJS.resetCameraControl();

        document.getElementById("representacion_arbolSintactico").innerHTML="";
    },
    TriggerNextStep        : function(){
        if(! Main.errorEnEjecucion){
            if(Main.esAnimacionFluida){
                this.pasoApaso();
            }else{                            
                Controles.activar__botones();                            
            }
        }else{
            Controles.activar__botones()
            Controles.funcion.Reiniciar();
        }
    },
    _addlstPasos_Level_1   : function(padre){
        this.lstPasos.children.push(
            {
                id           : Main_generateID.next().value, 
                children     : [], 
                generador    : appCreateGenerador(padre.hijos),
                
                obj          : padre,
                pasos        : padre.hijos,
                descripcion  : "metodo", 
            });
    },
    _addlstPasos_Level_2   : function(padre, hijos, des, val){
        let as = {
            id               : Main_generateID.next().value, 
            children         : [], 
            generador        : appCreateGenerador(hijos),
            
            obj              : padre,
            pasos            : hijos, // para retomar los mismos paso para los ciclos (for, ...)
            descripcion      : des,
            value            : val, // usado para saber si la primera instruccion de un for ya se ejecuto
        }
        this.lstPasos.children[this.lstPasos.children.length-1].children.push(as);
    },
    popPasos_Level_1       : function() {
        
        this.lstPasos.children.pop();
    },
    popPasos_Level_2       : function() {
        let index_1 = this.lstPasos.children.length-1;    // indice del ultimo generador
        this.lstPasos.children[index_1].children.pop();
    },
    _marcarLinea_1         : function(i){
        // Marcara line ejecutada
        if(Controles.funcion['Linea Actual']){
            if(i.location){
                Editor.java.markText_InstuccionActual(i.location); 
            }else{
                console.log("El Elemento enviado no tiene datos de posision.")
            }
            /*
            if(i.reglaP == "metodo" && i.name == "main"){
                javaEditor_markText_InstuccionActual(i.position.regla); 
            }
            else if(i.reglaP == "finDeGenerador"){
                javaEditor_markText_InstuccionActual(i.position.cierre); 
                if(this.llamadas.length > 0){
                    javaEditor_markText_InstuccionActual(this.llamadas[this.llamadas.length-1].position.regla); 
                    this.llamadas.pop();
                }
            }
            else if(i.reglaP == "finGenerador2_Condicional_if"){
                            
                javaEditor_markText_InstuccionActual(i.position.cierre); 
                   
            }
            else if(i.reglaP == "finGenerador2_RE_FOR_0"){
                            
                javaEditor_markText_InstuccionActual(i.position.cierre); 
                   
            }
            else if(i.reglaP == "finGenerador2_while"){
                            
                javaEditor_markText_InstuccionActual(i.position.cierre); 
                   
            }



            else if(i.reglaP == "llamada"){
                let declaracion = as_GetFunctionByName(this.actualInstruccion.value.name);
                javaEditor_markText_InstuccionActual(i.position.regla); 
                javaEditor_markText_InstuccionActual(declaracion.position.regla); 
            }
            else if(i.reglaP == "argumento"){
                let parametros = as_GetFunctionByName(i.namePadre).parametros;
                let parametro = null;
                for(let param of parametros){
                    if(param.indice == i.indice){
                        parametro = param;
                    }

                }
                javaEditor_markText_InstuccionActual(parametro.position.regla); 
                javaEditor_markText_InstuccionActual(i.position.regla); 
            }
            else if(i.reglaP == "return_variable" || i.reglaP == "return_num"){
                javaEditor_markText_InstuccionActual(i.position.regla); 
                if(this.llamadas.length > 0){
                    javaEditor_markText_InstuccionActual(this.llamadas[this.llamadas.length-1].position.regla); 
                    this.llamadas.pop();
                }
            }
            else{
                javaEditor_markText_InstuccionActual(i.position.regla); 
            }
            //*/

        }
    },
    _marcarLinea_2         : function(i){
        // Marcara la siguiente linea a ejecutar
        if(Controles.funcion['Linea Siguiente']){
            if(i.location){
                Editor.java.markText_InstuccionSiguiente(i.location); 
            }else{
                console.log("El Elemento enviado no tiene datos de posision.")
            }

            /*

            if(i.node == "MethodDeclaration" ){
                Editor.java.markText_InstuccionSiguiente(i.location); 
            }

            if(i.reglaP == "metodo" && i.name == "main"){
                javaEditor_markText_InstuccionSiguiente(i.position.bloque); 
            }
            else if(i.reglaP == "finDeGenerador"){
                javaEditor_markText_InstuccionSiguiente(i.position.cierre); 
            }
            else if(i.reglaP == "finGenerador2_Condicional_if"){
                javaEditor_markText_InstuccionSiguiente(i.position.cierre); 
            }
            else if(i.reglaP == "finGenerador2_Condicional_else"){
                javaEditor_markText_InstuccionSiguiente(i.position.cierre); 
            }

            else if(i.reglaP == "finGenerador2_RE_FOR_0"){
                javaEditor_markText_InstuccionSiguiente(i.position.cierre); 
            }
            else if(i.reglaP == "finGenerador2_while"){
                javaEditor_markText_InstuccionSiguiente(i.position.cierre); 
            }


            else if(i.reglaP == "llamada"){
                let declaracion = as_GetFunctionByName(this.nextInstruccion.value.name);
                javaEditor_markText_InstuccionSiguiente(i.position.regla); 
                i.name == this.lstPasos.children[this.lstPasos.children.length-1].obj.name ? 
                javaEditor_markText_InstuccionSiguiente(declaracion.position.regla)
                :
                javaEditor_markText_InstuccionSiguiente(declaracion.position.bloque);                 
                this.llamadas.push(i);
            }
            else if(i.reglaP == "argumento"){
                let parametros = as_GetFunctionByName(i.namePadre).parametros;
                let parametro = null;
                for(let param of parametros){
                    if(param.indice == i.indice){
                        parametro = param;
                    }

                }
                javaEditor_markText_InstuccionSiguiente(parametro.position.regla); 
                javaEditor_markText_InstuccionSiguiente(i.position.regla); 
            }
            else{
                javaEditor_markText_InstuccionSiguiente(i.position.regla); 
            } 
            //*/
        }
    },
    dibujar                : function(generador){
        let declaracion = generador.value;
       
        if( (generador.value.node) == "MethodDeclaration" && (generador.value.name.identifier) == "main"){                        
            let id           = R01.llamarMetodoMain(declaracion);
            this._addlstPasos_Level_1(declaracion);
        }


        else{        

            new TWEEN.Tween({x:0}).to({x:2 },10)
            .onStart    ( function (){R01._error("Error Main.dibujando linea 461");} )
            .onComplete ( function (){ Main.TriggerNextStep(); })
            .start();           
        }
    },
    getInstruccion         : function(){
        let i = null;
        if(Main.lstPasos.children.length > 0){
            let index_1 = Main.lstPasos.children.length-1;    // indice del ultimo generador
            let index_2 = Main.lstPasos.children[index_1].children.length-1;  // indice del ultimo hijo del ultimo generador
            let n       = Main.lstPasos.children[index_1].children.length;  // numero de hijos del ultimo generador

            if(n > 0){// Tienen prioridad los Main.lstPasos de segundo nivel
                let nodo = Main.lstPasos.children[index_1].children[index_2];
                i        = nodo.generador.next();
                i.nodo   = nodo;

                if(i.done){
                    ///*
                    let instruccion = {
                        reglaP   : `finGenerador2_${nodo.obj.reglaP}`,
                        position : nodo.obj.position,
                    };
                    i = { value: instruccion, done: true, nodo: nodo };
                    //*/
                    Main.lstPasos.children[index_1].children.pop();
                    if(    nodo.obj.reglaP != "Condicional_if" 
                        && nodo.obj.reglaP != "RE_FOR_0" 
                        && nodo.obj.reglaP != "Condicional_else"
                        && nodo.obj.reglaP != "while"
                        )
                        i = this.getInstruccion();
                }
                
            }else{// Si no hay Main.lstPasos de segundo nivel
                let nodo = Main.lstPasos.children[index_1];
                i        = nodo.generador.next();
                i.nodo   = nodo;
                if(i.done){                    
                    let instruccion = {
                        reglaP   : 'finDeGenerador',
                        position : nodo.obj.position,
                    };
                    i = { value: instruccion, done: true, nodo: nodo };
                    Main.lstPasos.children.pop();
                }
            }
        }

        return i;
    }
};






function init(){
    getApiInfo(); // Llamada ascincrona al servidor
    R01_utileria.load();// Inicia carga de componentes comoimagenes
    load();    // Se mantiene en espera hasta que esten cargados los componentes
}
function load(){


    let _id = requestAnimationFrame(load);
    if( R01_utileria.allLoaded() && ApiInfo.llamada_terminada ){ // si ha terminado de cargar todo lo requerido ejecuta y termina este bucle 

        //console.log("Utilerias Cargadas Satisfactoriamente")

        Controles.setupControles();
        crearEditorJava();
        crearEditorAnSintactico(); // ventanas flotantes 
        crearEditorAnSintactico2();

        MyThreeJS.init();

        setup_EEDOCDG();

        render();
        
        // finalizara este ciclo cuando todo este cargado R01_utileria.allLoaded();
        cancelAnimationFrame(_id); 
    }
    console.log(_id);
}

function render(){   
    TWEEN.update();

    MyThreeJS.renderer.render(MyThreeJS.scene, MyThreeJS.camera);
    MyThreeJS.cameraControl.update();    
    /*
    if(lstElements){    
        //https://github.com/mrdoob/three.js/issues/434
        //camera.lookAt(lstElements.getChildrenById(idNodoFinal).graphics.children[0].matrixWorld.getPosition());
    }
    //*/

 
    // La luz que emite sombras seguira la posicion de la camara 
    MyThreeJS.scene.getObjectByName( 'Spot Light'  ).position.y = MyThreeJS.camera.position.y+40;
    MyThreeJS.scene.getObjectByName( 'Spot Light'  ).position.x = MyThreeJS.camera.position.x-100;
    MyThreeJS.scene.getObjectByName( 'Spot Light'  ).position.z = MyThreeJS.camera.position.z+60;




    requestAnimationFrame(render);
}



        

function createdendrograma(){
    


    var svg      = d3.select("#dendrograma").append('svg')
            .attr('width',640)
            .attr('height',800)
            
    var     diameter = +svg.attr("width"),
            g        = svg.append("g").attr("transform", "translate(2,2)")
    var format   = d3.format(",d");


    var pack = d3.pack()
        .size([diameter - 4, diameter - 4])
        .padding([40]);

    var root = d3.hierarchy(AS.node,function(d){
                //console.log(d);
                if (     d.node == "CompilationUnit") { // nodo raiz

                    return d.types;
                }else if(d.node == "TypeDeclaration"){ // declaracion de clase

                    return d.bodyDeclarations;
                }else if(d.node == "MethodDeclaration"){ // Declaracion de metodo

                    return d.parameters.concat(d.body.statements); // un metodo tendra como hijos a su <<contenido>> y a sus <<parametros>>;
                }else if(d.node == "SingleVariableDeclaration"){ // Declaracion de Parametros // Se refiere a la variable en la declaración del método

                    return null; // los parametros no tienen hijos 
                }else if(d.node == "VariableDeclarationStatement"){// Declaracion de grupo de variables

                    return d.fragments;
                }else if(d.node == "VariableDeclarationFragment"){// declaracion Variable (cada fragmento)

                    return null; // cada fragmento de variable no tendra mas hijos
                }

                
                return  null ;
            })
        .count();

    var getNombres = function (d){
        var info = {nombre:"",parent:""};

        if (d.data.node == "CompilationUnit") {
            info.name = "/"
        }else if(d.data.node == "TypeDeclaration"){//clases
            info.name   = d.data.name.identifier;
            info.parent = d.parent.data.name ? d.parent.data.name.identifier : d.parent.data.node;
        }else if(d.data.node == "MethodDeclaration"){ //metodos
            info.name = d.data.name.identifier;
            info.parent = d.parent.data.name.identifier;
        }else if(d.data.node == "SingleVariableDeclaration"){ // parametros
            info.name = d.data.name.identifier;
            info.parent = d.parent.data.name.identifier;
        }else if(d.data.node == "VariableDeclarationStatement"){
            //console.log(d);
            info.name = d.data.type.name?d.data.type.name.identifier : "";
            info.parent = d.parent.data.name.identifier; // porse su padre directo es el tipo de dato
        }else if(d.data.node == "VariableDeclarationFragment"){
            info.name = d.data.name.identifier;
            info.parent = d.parent.parent.data.name.identifier; // por que su padre directo es el tipo de dato
        }
        return info;

    };
    var node = g.selectAll(".node")
        .data(pack(root).descendants())
        .enter().append("g")
        .attr("class", function(d) { return d.children ? "node" : "leaf node"; })
        .attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; });

        node.append("title")
            .text(function(d) { 
                //console.log(d);
                var info = getNombres(d);
                return `${info.name}\n${info.parent}`; 
            });

        node.append("circle")
            .attr("r", function(d) { 
                return d.r;
            })
            .on("click", function(d) {
                console.clear();
                console.log(d);
                Editor.sintactico2.value   = jsDump.parse( d.data );
            })
            ;

        node.filter(function(d) { return !d.children; }).append("text")
        .attr("dy", "0.3em")
        .text(function(d) { 
                var info = getNombres(d);
                return info.name;
            });

}
