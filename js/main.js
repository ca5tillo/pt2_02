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

var Main = {
    'lstPasos'             : {id:Main_generateID.next().value, children:[], generador:null,  descripcion:"lstPasos"},
    'esAnimacionFluida'    : false,
    'ejecutado'            : false,
    'existeMain'           : false, // Existe metodo main en el editor
    'existenErrores'       : false, // as_imprimirArbol
    'actualInstruccion'    : null,
    'nextInstruccion'      : null,
    'llamadas'             : [], // llamadas a metodos
    'mousedown'            : false, // usada en setup_EventosMouse();
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
        javaEditor_markText_Clean();
        if(this.actualInstruccion)
            this._marcarLinea_1(this.actualInstruccion.value);
        if(this.nextInstruccion)
            this._marcarLinea_2(this.nextInstruccion.value);   
    },
    analizarCodigoFuente   : function(){
        javaEditor_clearMarkError();
        javaEditor_markText_Clean();
        analisisSintactico();
        as_imprimirArbol(as_arbol);
    },
    precompilacion         : function(){
        //http://www.forosdelweb.com/f13/llamar-funcion-con-nombre-por-cadena-808443/
        /*
            Recorre el ** arbolSintactico ** para identificar las librerias q seran usadas 
            Inserta las instrucciones a ** guionDePreCompilacion ** estas instrucciones establecen 
            que FUNCIONES usaran de los helpers de dibujado

            Finalmente lleva a cabo la ejecucion de todas las instrucciones que se contienen en 
            el ** guionDePreCompilacion **
        */
        let _run = function (){
            for(let i = 0; i < _guion.length; i++){
                R01[   _guion[i].metodo    ] (_guion[i].parametro,i,_guion.length-1);
            }
        }
        let _add = function (O_o){
            if(O_o.reglaP == "clase"){
                _guion.push({parametro:O_o, metodo:"crearLibreria"});
            }
            for(let i of O_o.hijos){
                _add(i);
            }
        };
        let _guion = [];  //guionDePreCompilacion
        _guion.push({parametro:{},              metodo:"setupZoneLib"  });
        _guion.push({parametro:{},              metodo:"setupGroupBase"});
        _guion.push({parametro:{name:"System"}, metodo:"crearLibreria" });

        _add(as_arbol);
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
        this.analizarCodigoFuente();  

        let main         = as_GetFunctionByName("main");
        if( this.existeMain && !this.existenErrores && !this.ejecutado){
           
            this.nextInstruccion = { value: main, done: true, nodo: null };      
            this.ejecutado       = true;
            this._marcarLinea_2(main);
            
            this.precompilacion();

            javaEditor_enableReadOnly();
            MyThreeJS.enableCameraControl();
        }
        if(! this.existeMain || as_arbol.hijos.length == 0){
            javaEditor_markError(0,50);
        }
        return this.existeMain && !this.existenErrores;
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

        pintarArbolDeLlamadas();
        pintarArbol("representacionarreglo1", R01._lstIDsMetodos, ["id","descripcion"]);
        pintarArbol("representacionarreglo2", this.lstPasos, ["id","descripcion"]);  
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
        document.getElementById("representacion_arbolDeLlamadas").innerHTML="";//pintarArbolDeLlamadas();
        document.getElementById("representacionarreglo1").innerHTML="";//pintarArbol("representacionarreglo1", lstIDsMetodos, ["id","descripcion"]);
        document.getElementById("representacionarreglo2").innerHTML="";//pintarArbol("representacionarreglo2", Main.lstPasos, ["id","descripcion"]);
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

        }
    },
    _marcarLinea_2         : function(i){
        
        if(Controles.funcion['Linea Siguiente']){
            // Marcara la siguiente linea a ejecutar
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
        }
    },
    dibujar                : function(generador){
        let O_o = generador.value.reglaP;
        let instruccion = generador.value;
       
        if( (O_o) == "metodo" && instruccion.name == "main"){                        
            let id           = R01.llamarMetodoMain(instruccion);
            this._addlstPasos_Level_1(instruccion);
        }
        else if( (O_o) == "finDeGenerador"  ){

            R01.MethodOut();
        }
        else if( (O_o) == "variable"        ){
            /*  Para Representar :
                int     a;
                String  cadena = "texto";
            */
            R01.crearVariable(instruccion);
        }
        else if( (O_o) == "asignacion_01"      ){
            /* i++;*/
            R01.asignacion_01(instruccion);  
        } 
        else if( (O_o) == "asignacion_02"      ){
            /* i--;*/
            R01.asignacion_02(instruccion);  
        } 
        else if( (O_o) == "asignacion_03"      ){
            /* a = b; */
            R01.asignacion_03(instruccion);    
        } 
        else if( (O_o) == "asignacion_04"      ){
            /* a = 3; a = "texto"; a = true; */
            R01.asignacion_04(instruccion);  
        }   
        else if( (O_o) == "asignacion_05"      ){
            /*   i = 5+9; i = a + b;   */
            R01.asignacion_05(instruccion);  
        }     
        else if( (O_o) == "asignacion_07"      ){
            /*  b = a.length; */
            R01.asignacion_07(instruccion);  
        }      
        else if( (O_o) == "asignacion_08"      ){
            /*  b = a[.*]; */
            R01.asignacion_08(instruccion);  
        }     
        else if( (O_o) == "asignacion_09"      ){
            /*  b[.*] = a[.*]; */
            R01.asignacion_09(instruccion);  
        } 
        else if( (O_o) == "asignacion_10"      ){
            /*  b[.*] = a; */
            R01.asignacion_10(instruccion);  
        }     
        else if( (O_o) == "arreglo"         ){

            R01.crearArreglo(instruccion);  
        }
        else if( (O_o) == "llamada"         ){
            /*  Para Representar :
                int e = pasoParametros(a, b, "envio");
                    e = pasoParametros(a, e, "texto");
                    metodo();
            */
            if(instruccion.destinoCreate){// Para int e = pasoParametros(a, b, "envio");
                R01.crearVariable_2({
                    lineaInicial:instruccion.lineaInicial, 
                    type:instruccion.type,
                    name:instruccion.destinoName,
                    value: "?",
                });  
            }

            let destino     = instruccion.destinoName;
            let declaracion = as_GetFunctionByName(instruccion.name);
            let id          = R01.llamarMetodo(instruccion, declaracion, destino);

            // Add Pasos para ejecutar el contenido  de la declaracion del metodo
            this._addlstPasos_Level_1(declaracion);

            // Add Pasos al generador para la creacion de los argumentos
            if(instruccion.argumentos.length > 0 ){
                this._addlstPasos_Level_2(instruccion, instruccion.argumentos,"argumentos",false);
            }
        }
        else if( (O_o) == "finGenerador2_llamada"){
            
            Controles.activar__botones();
        }
        else if( (O_o) == "argumento"       ){

            R01.crearParametros(instruccion, as_GetFunctionByName(instruccion.namePadre).parametros); 
        }
        
        else if( (O_o) == "return_variable" ){    

            R01.returnVariable(instruccion);
        }
        else if( (O_o) == "return_num" ){    

            R01.returnNum(instruccion);
        }
        else if( (O_o) == "Condicional_if"         ){   
            
            let resultado = R01.drawIF(instruccion);
            if(resultado){                
                this._addlstPasos_Level_2(instruccion, instruccion.hijos,"Condicional_if");
            }

                /*
            if(this.esAnimacionFluida){
                    se vielve infinita por crear multipes instancias 
                    se puede llamar a un siguiente paso desde una animacion ya q 
                    la animagion se ejecuta en otro hilo 
                //Main.pasoApaso();//se vielve infinita por crear multipes instancias 
            }  
                */
        }
        else if( (O_o) == "finGenerador2_Condicional_if"){
            
            R01.ifOut();
        }
        else if( (O_o) == "Condicional_else"         ){    
            // Aqui No valido si se ejecuto el if este se valida en la funcion paso a paso 
            // si existe el " finGenerador2_Condicional_if " significa que se evaluo en TRUE
            // y se brincara la instruccion q contenfa el else 
            this._addlstPasos_Level_2(instruccion, instruccion.hijos,"Condicional_else");
            R01.viewElse(instruccion);
        }
        else if( (O_o) == "finGenerador2_Condicional_else"){

            R01.elseOut();
        }
        else if( (O_o) == "RE_FOR_0"){
            R01.for(instruccion);
            let hijos = instruccion.hijos.concat([]);
                hijos.unshift(instruccion.reglas[1]);
                hijos.unshift(instruccion.reglas[0]);
                hijos.push(instruccion.reglas[2]);

            this._addlstPasos_Level_2(instruccion, hijos,"for",true);
        } 
        else if( (O_o) == "FOR_R1"){
        
            R01.for_r1(instruccion);
        }
        else if( (O_o) == "finGenerador2_RE_FOR_0"){
            instruccion.reglaP = "RE_FOR_0";
            R01.forend(instruccion);
            if(generador.nodo.value === true){
                generador.nodo.pasos.shift();
                
            }

            this._addlstPasos_Level_2(instruccion, generador.nodo.pasos,"for",false);
        }
        else if( (O_o) == "while"         ){   
            R01.whileIn(instruccion);
            let hijos = instruccion.hijos.concat([]);
                hijos.unshift(instruccion.condicionales);

            this._addlstPasos_Level_2(instruccion, hijos,"while");
           
        }
        else if( (O_o) == "while_R"         ){   
           

            let resultado = R01.while_eval(instruccion);
            if(resultado){                
                this._addlstPasos_Level_2(instruccion, instruccion.hijos,"while");
            }
        }
        else if( (O_o) == "finGenerador2_while"){
            instruccion.reglaP = "while";
            R01.whileOut(instruccion);
        
            this._addlstPasos_Level_2(instruccion, generador.nodo.pasos,"while");
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
    Controles.setupControles();


    R01_utileria.load();
    load();
}
function load(){


    let _id = requestAnimationFrame(load);
    if( R01_utileria.allLoaded() ){

        //console.log("Utilerias Cargadas Satisfactoriamente")

        setup_javaEditor();
        javaEditor_setText(ejemploDeCodigo_09);

        MyThreeJS.init();

        setup_EEDOCDG();

        render();

        cancelAnimationFrame(_id);
    }
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
    if(R01.lstElements){
        let ul    = document.createElement("ul"); 
        ul.setAttribute("id", "arbol"); 
        ul.appendChild(_createLista(R01.lstElements)); 
        ul.addEventListener("change", info_elemento3D);  

        document.getElementById("representacion_arbolDeLlamadas").innerHTML="";
        document.getElementById("representacion_arbolDeLlamadas").appendChild(ul);  

        $('#representacion_arbolDeLlamadas ul#arbol').bonsai({
            expandAll: true,
            createInputs: "radio"
        });

    }
}
function info_elemento3D(ev) {
    let id = ev.target.value;
    let element = R01.lstElements.getChildrenById(id);
    console.clear();
    console.log(element)
}
function pintarArbol(destino, arbol, items){
    
    let _createText  = function (nodo,items){
        let t    = "";
        for (let i of items){if(nodo[i]) t += nodo[i]+" ";}
        return t;
    }
    let _createLista = function (nodo){
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
        if("representacionarreglo2" == destino){            
            ul.addEventListener("change", infoMainPasos);
        }else if("representacionarreglo1"){
            ul.addEventListener("change", info_elemento3D);
        }
        //ul.addEventListener("change", as_infoNodo);

        document.getElementById(destino).innerHTML="";
        document.getElementById(destino).appendChild(ul);  

        $('#'+destino+' ul#arbol').bonsai({
            expandAll: true,
            createInputs: "radio"
        });

    }
}

function infoMainPasos(ev) {
    let id = ev.target.value;
    let element = helperGetById([Main.lstPasos],id);
    console.clear();
    console.log(element)
}

function helperGetById(lista,id){
    // http://jsfiddle.net/dystroy/MDsyr/
    // Retorna la primera coincidencia
    let getSubMenuItem = function (subMenuItems, id) {
        if (subMenuItems) {
            for (let i = 0; i < subMenuItems.length; i++) {
                if (subMenuItems[i].id == id) {
                    return subMenuItems[i];
                };
                let found = getSubMenuItem(subMenuItems[i].children, id);
                if (found) return found;
            
            }
        }
    };
    let searchedItem = getSubMenuItem(lista, id) || null;
    return searchedItem;
}

