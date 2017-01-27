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
window.addEventListener('load',init);
window.addEventListener('resize', MyThreeJS.onResize, false);


var Main = {
    'lstPasos'             : {id:0, generador:null, children:[], descripcion:"lstPasos", obj: null},
    'esAnimacionFluida'    : false,
    'ejecutado'            : false,
    'existenErrores'       : false,
    'nextInstruccion'      : null,

    reset                  : function(){
        this.lstPasos            = {id:0, generador:null, children:[], descripcion:"lstPasos", obj: null};
        this.esAnimacionFluida   = false;
        this.ejecutado           = false;
        this.existenErrores      = false;
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
    },
    preparar               : function(){//BTN
        this.existenErrores = false;
        this.analizarCodigoFuente();    

        let main         = as_GetFunctionByName("main");
        if( main && !this.existenErrores && !this.ejecutado){
            ctrl_fun__Preparar();
            this.precompilacion();

            this.ejecutado       = true;
            this.nextInstruccion = main;      
            javaEditor_markText_Clean();
            javaEditor_markText_InstuccionSiguiente(main.lineaInicial);  
            javaEditor_enableReadOnly();
            MyThreeJS.enableCameraControl();
        }
    },
    animacionFluida        : function(){// BTN
        this.esAnimacionFluida = true;
        this.pasoApaso();
    },
    pausa                  : function(){// BTN

        this.esAnimacionFluida = false;
    },
    pasoApaso              : function(){// BTN
        javaEditor_markText_Clean();
        let instruccion = null;
        let tipo        = null;
        ctrl_fun_desactiva__PorPaso   ();Controls.pasos += 1;   

        if(this.nextInstruccion){            
            
            this.dibujar(this.nextInstruccion);

            instruccion =  this.getInstruccion();
            if(instruccion){
                instruccion = instruccion.value; // esto es porq aun era el obj del generador
                this.nextInstruccion = instruccion;
                if(instruccion.lineaInicial && instruccion.lineaFinal ){
                    javaEditor_markText_InstuccionSiguiente(instruccion.lineaInicial, instruccion.lineaFinal); 
                }
            }
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

        document.getElementById("representacion_arbolSintactico").innerHTML="";
        document.getElementById("representacion_arbolDeLlamadas").innerHTML="";//pintarArbolDeLlamadas();
        document.getElementById("representacionarreglo1").innerHTML="";//pintarArbol("representacionarreglo1", lstIDsMetodos, ["id","descripcion"]);
        document.getElementById("representacionarreglo2").innerHTML="";//pintarArbol("representacionarreglo2", Main.lstPasos, ["id","descripcion"]);
    },
    TriggerNextStep        : function(){
        if(Main.esAnimacionFluida){
            this.pasoApaso();
        }else{                            
            ctrl_fun_Activa__PorPaso();                            
        }
    },
    _addlstPasos_Level_1     : function(padre, id_3D){
        this.lstPasos.children.push(
            {
                id:id_3D, 
                generador:appCreateGenerador(padre.hijos),
                children:[], 
                descripcion:"metodo", 
                obj:padre
            });
    },
    _addlstPasos_Level_2     : function(padre, des){
        let as = {
            generador:appCreateGenerador(padre),
            children:[], 
            descripcion: des,
        }
        this.lstPasos.children[this.lstPasos.children.length-1].children.push(as);
    },
    dibujar                : function(instruccion){
        let O_o = instruccion.reglaP
       
        if( (O_o) == "metodo" && instruccion.name == "main"){
            javaEditor_markText_InstuccionActual(instruccion.lineaInicial);
            
            let id           = R01.llamarMetodoMain(instruccion);
            this._addlstPasos_Level_1(instruccion, id);
        }
        else if( (O_o) == "finDeGenerador"  ){
            javaEditor_markText_InstuccionActual(instruccion.lineaInicial, instruccion.lineaFinal);
            R01.MethodOut();
        }
        else if( (O_o) == "variable"        ){
            /*  Para Representar :
                int     a;
                String  cadena = "texto";
            */
            javaEditor_markText_InstuccionActual(instruccion.lineaInicial, instruccion.lineaFinal);
            R01.crearVariable(instruccion);
        }
        else if( (O_o) == "asignacion"      ){
            javaEditor_markText_InstuccionActual(instruccion.lineaInicial, instruccion.lineaFinal);
            R01.asignarValorVariable(instruccion);  
        }        
        else if( (O_o) == "arreglo"         ){
            javaEditor_markText_InstuccionActual(instruccion.lineaInicial, instruccion.lineaFinal);
            R01.crearArreglo(instruccion);  
        }
        else if( (O_o) == "llamada"         ){
            /*  Para Representar :
                int e = pasoParametros(a, b, "envio");
                    e = pasoParametros(a, e, "texto");
                    metodo();
            */
            javaEditor_markText_InstuccionActual(instruccion.lineaInicial, instruccion.lineaFinal);
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

            this._addlstPasos_Level_1(declaracion, id);

            javaEditor_markText_InstuccionSiguiente(declaracion.lineaInicial, declaracion.lineaFinal);

            if(instruccion.argumentos.length > 0 ){
                this._addlstPasos_Level_2(instruccion.argumentos,"argumentos");
            }
        }
        else if( (O_o) == "argumento"       ){    

            R01.crearParametros(instruccion, as_GetFunctionByName(instruccion.namePadre).parametros); 
        }
        else if( (O_o) == "return_variable" ){    

            returnVariable(instruccion);
        }
        else if( (O_o) == "return_num" ){    

            returnNum(instruccion);
        }
        else if( (O_o) == "asignacion2"         ){    

            asignacion2(instruccion);  
        }
        else if( (O_o) == "Condicional_if"         ){    
            let resultado = drawIF(instruccion);
            if(resultado){
                
                instruccion.evaluadoEn = true;
                let as = {generador:appCreateGenerador(instruccion.hijos),children:[], descripcion:"if"}
                Main.lstPasos.children[Main.lstPasos.children.length-1].children.push(as);//level2
            }else{
                instruccion.evaluadoEn = false;
            }
            ctrl_fun_Activa__PorPaso();
            if(Main.esAnimacionFluida){
                Main.pasoApaso();
            }
            
        }
        else if( (O_o) == "Condicional_else"         ){    

            if( ! instruccion.hermanoMayor.evaluadoEn){
                let as = {generador:appCreateGenerador(instruccion.hijos),children:[], descripcion:"else"}
                Main.lstPasos.children[Main.lstPasos.children.length-1].children.push(as)
            }else{

            }
            Main.pasoApaso();
        }else{        
            alert("Error en tiempo de ejecucion");
            Controls.Reiniciar();
        }
    },
    getInstruccion         : function(){
        let i = null;
        if(Main.lstPasos.children.length > 0){
            let index_1 = Main.lstPasos.children.length-1;    // indice del ultimo generador
            let index_2 = Main.lstPasos.children[index_1].children.length-1;  // indice del ultimo hijo del ultimo generador
            let n       = Main.lstPasos.children[index_1].children.length;  // numero de hijos del ultimo generador

            if(n > 0){// Tienen prioridad los Main.lstPasos de segundo nivel
                i = Main.lstPasos.children[index_1].children[index_2].generador.next();
                if(i.done){
                    Main.lstPasos.children[index_1].children.pop();
                    i = this.getInstruccion();
                }
                
            }else{// Si no hay Main.lstPasos de segundo nivel
                i = Main.lstPasos.children[index_1].generador.next();
                if(i.done){                    
                    let instruccion = {reglaP: 'finDeGenerador'};
                    instruccion.lineaInicial = Main.lstPasos.children[index_1].obj.lineaFinal;
                    instruccion.lineaFinal   = Main.lstPasos.children[index_1].obj.lineaFinal;
                    i = { value: instruccion, done: true };
                }
            }
        }

        return i;
    }
};


function init(){
    MyThreeJS.init();

    setup_javaEditor();
    javaEditor_setText(ejemploDeCodigo_02);

    setupControls();

    render();
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

        document.getElementById("representacion_arbolDeLlamadas").innerHTML="";
        document.getElementById("representacion_arbolDeLlamadas").appendChild(ul);  

        $('#representacion_arbolDeLlamadas ul#arbol').bonsai({
            expandAll: true,
            createInputs: "radio"
        });

    }
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
        //ul.addEventListener("change", as_infoNodo);

        document.getElementById(destino).innerHTML="";
        document.getElementById(destino).appendChild(ul);  

        $('#'+destino+' ul#arbol').bonsai({
            expandAll: true,
            createInputs: "radio"
        });

    }
}

