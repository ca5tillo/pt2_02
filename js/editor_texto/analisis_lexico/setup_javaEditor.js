var javaEditor    = null;
var _marcatextos   = null; // es un arreglo de marcadores

function setup_javaEditor(){
    _marcatextos = [];

	javaEditor   = CodeMirror.fromTextArea(document.getElementById("javaEditor"), {
        indentUnit:4,
        tabSize:4,
        dragDrop:true,
        lineNumbers: true,
        matchBrackets: true,
        autoCloseBrackets: true,
        styleActiveLine: true,//Resalta la linea activa (solo donde esta el prom o puntero)
        styleSelectedText: "CodeMirror-selectedtext",
        mode: {name: "text/x-java",number:/^(?:0x[a-f\d]+|0b[01]+|(?:\d+\.?\d*|\.\d+)(?:e[-+]?\d+)?)/i},
        //theme: 'monokai',
        autofocus:false,
        gutters: ["CodeMirror-my-markers"],
        readOnly:false,
    });
    /*
        javaEditor.display.input.onContextMenu= function(){}; 

        onContextMenu  :   Es presionar el boton derecho del mouse

        Codemirror valida este evento para un uso posterior, no se cual   

        https://codemirror.net/mode/htmlmixed/index.html
        selecciona parte del texto y da clic derecho y muestra un menu para copiar cortar ...

        Estoy sobrescribiendo el metodo a una funcion vacia, ya que 
        causaba conflicto con orbilControl de THREE.JS,
        Sobre el editor no podia mover el mundo con el boton derecho del mouse.
        Al sobrescribir la funcion a un metodo vacio se a conseguido solucionar de momento 
        el moverse sobre el mundo 3D
    */
    javaEditor.display.input.onContextMenu= function(){}; 
    
    javaEditor_extraKeys();

    //  Evento inputRead que se desencadena con nuevas entradas 
    javaEditor.on("inputRead", function(javaEditor, inputRead) {
        //console.log(javaEditor.getTokenAt(javaEditor.getCursor()));
        //  Si no existen espacios en blanco muestra el autocompletador
        if(javaEditor.getTokenAt(javaEditor.getCursor()).string.indexOf(' ') == -1 && javaEditor.getTokenAt(javaEditor.getCursor()).string.indexOf(';') == -1){
            javaEditor.showHint({completeSingle: true});
        }
    });
    //  Evento change 
    javaEditor.on("change", function(javaEditor, inputRead) {    

    });

    
    javaEditor.setOption("fullScreen", Controles.funcion.FullScreen);
    javaEditor_setTheme(Controles.funcion.Tema);
    javaEditor_setOpacity();

    //$(".CodeMirror").css({ "background":'rgba(255,255,255,'+Controles.funcion.Opacidad+')' });
}
function javaEditor_setTheme(theme){
    javaEditor.setOption("theme", theme);
}
function javaEditor_setOpacity(){
    let theme = javaEditor.getOption("theme");
    if(theme == 'default'){            
        $(".CodeMirror").css({ "background":'rgba(255,255,255,'+Controles.funcion.Opacidad+')' });
    }else if(theme == 'monokai'){
        $(".CodeMirror").css({ "background":'rgba(0,0,0,'+Controles.funcion.Opacidad+')' });
    }
}
function javaEditor_setText(value){
	javaEditor.setValue(value);
}
function javaEditor_enableReadOnly(){
    function _makeMarker() {
        var marker        = document.createElement("div");
        let tooltip       = document.createElement("div");
        let tooltiptext   = document.createTextNode("Modo Solo Lectura"); 

        marker.className  = "CodeMirror-my-mark-error lock fa fa-lock";
        tooltip.className = "CodeMirror-my-mark-tooltiptext";

        tooltip.appendChild(tooltiptext);  
        marker.appendChild(tooltip);  

        return marker;
    }
    javaEditor.setOption("readOnly","nocursor");
    javaEditor.setGutterMarker(0, "CodeMirror-my-markers", _makeMarker());
    javaEditor.setOption("styleActiveLine",false);
    javaEditor.setOption("styleSelectedText",false);
}
function javaEditor_disableReadOnly(){
    javaEditor.setOption("readOnly",false);
    javaEditor.setOption("styleActiveLine",true);
    javaEditor.setOption("styleSelectedText","CodeMirror-selectedtext");
}
function javaEditor_addHintWords(){
	/*Con esta linea reescribe el hintWords que hereda del mode */
    //CodeMirror.registerHelper("hintWords", "text/x-java",["for(int i = 0; i<10; i++){\n\n}","for"]);

    /*Con esta linea solo añade palabras al hintWords*/
    javaEditor.getHelpers(0,"hintWords")[0]
        .push(
            'codigojava'
        );
    //*/
}
function javaEditor_markError(lineaInicial,lineaFinal){
    function _makeMarker() {
        var marker        = document.createElement("div");
        let tooltip       = document.createElement("div");
        let tooltiptext   = document.createTextNode("Aun no Implementado"); 

        marker.className  = "CodeMirror-my-mark-error fa fa-times";
        tooltip.className = "CodeMirror-my-mark-tooltiptext";

        tooltip.appendChild(tooltiptext);  
        marker.appendChild(tooltip);  

        return marker;
    }
    if(lineaInicial < lineaFinal){
        for (var i = lineaInicial; i <= lineaFinal; i++) {
            javaEditor.setGutterMarker(i, "CodeMirror-my-markers", _makeMarker());
        }
    }else{
        javaEditor.setGutterMarker(lineaInicial, "CodeMirror-my-markers", _makeMarker());
    }
}
function javaEditor_clearMarkError(){
    for (var i = 0; i < javaEditor.lineCount(); i++) {
        javaEditor.setGutterMarker(i, "CodeMirror-my-markers", null);
    }
}
function javaEditor_markText_InstuccionSiguiente(position){
    let tem = javaEditor.markText(
                                    {line: position.y1, ch: position.x1}, 
                                    {line: position.y2, ch: position.x2}, 
                                    {className: "EditorTooltipMarcatexto siguiente_instruccion",
                                     css:"background: #ffa2ab; color: #000; ",
                                     title:"Se ejecutara en el siguiente paso.",
                                    });

    _marcatextos.push(tem);
    $(".siguiente_instruccion").attr('title','Se ejecutara en el siguiente paso.');
    
}
function javaEditor_markText_InstuccionActual(position){

    let tem = javaEditor.markText(
                                    {line: position.y1, ch: position.x1}, 
                                    {line: position.y2, ch: position.x2},  
                                    {className: "EditorTooltipMarcatexto",
                                     css:"background: orange; color: #000; ",
                                     title:"Instruccion ejecutada.",
                                    });

    _marcatextos.push(tem);
}
function javaEditor_markText_Clean(){
    for(let i of _marcatextos){
        i.clear();
    }
    _marcatextos = [];
}
function javaEditor_extraKeys(){
	//  Nuevas funciones de teclado
    javaEditor.setOption("extraKeys", {
        "F12": function(cm) 
        {
            cm.setOption("fullScreen", !cm.getOption("fullScreen"));
        },
        "Esc": function(cm) 
        {
            if (cm.getOption("fullScreen")) cm.setOption("fullScreen", false);
        },
        "Tab": function(cm) 
        {
            var cursor = javaEditor.getCursor();
            var token = javaEditor.getTokenAt(cursor);
            var tabulador = Array(cm.getOption("indentUnit") + 1).join(" ");
            var indentado = " ".repeat(token.start);
            var brackets = `{\n${indentado}    \n${indentado}}`;
            var abreviaturas = [];
                abreviaturas["for"]         = `for (int i = 0; i < 10; i++)${brackets}`;
                abreviaturas["psvm"]        = `public static void main(String[] args)${brackets}`;
                abreviaturas["sout"]        = `System.out.println("");`;

            //console.log(cursor,token);
            
            if ( abreviaturas[token.string] !== undefined ) {
                //  Remplazar la abreviatura
                cm.replaceRange(
                    abreviaturas[token.string],
                    {line: cursor.line, ch: token.start},
                    {line: cursor.line, ch: token.end}
                    );

                //  Reubicar cursor
                cursor = javaEditor.getCursor();
                if(abreviaturas[token.string].indexOf('{') != -1){//si es el bloque de brackets
                    javaEditor.setCursor({line: cursor.line-1, ch: cursor.ch+3});
                }else if (abreviaturas[token.string].indexOf('""') != -1){
                    javaEditor.setCursor({line: cursor.line, ch: cursor.ch-3});
                }
                
                
            }else{
                cm.replaceSelection(tabulador);
            }
            
        }
    });
}
function javaEditor_analisisLexico(){

    var tokens = [];
    for (var i = 0; i < javaEditor.lineCount(); i++) {
        [].forEach.call(javaEditor.getLineTokens(i),function (nodo){
            
            if(!nodo.string.match(/^\s+$/) && nodo.type != 'comment'){// ignorara los espacios, tabuladores y comentarios 
                tokens.push({
                        string:nodo.string,
                        symbol:tab_symbol[nodo.string] || tab_symbol_Type[nodo.type]  || (nodo.string.match(/^[a-zA-Z _]+[a-zA-Z _ 0-9]*$/) ? 'NAME':'SyntaxError'),
                        line:i,
                        start:nodo.start,
                        end:nodo.end,
                        type:nodo.type
                    });
                
            }
        });
        
    }
    /*
    console.log(tokens);
    console.log("cursor-->",javaEditor.getCursor());
    console.log("getHelpers-->",javaEditor.getHelpers({line: 0, ch: 3}));
    console.log("getLine-->",javaEditor.getLine(0));
    console.log("lineCount-->",javaEditor.lineCount());
    console.log("lastLine-->",javaEditor.lastLine());
    console.log("getLineHandle-->",javaEditor.getLineHandle(0));
    console.log("getLineTokens-->",javaEditor.getLineTokens(    3   ));
    console.log(javaEditor.getTokenTypeAt(  {line: 0, ch: 3}  ));
    console.log("getMode-->",javaEditor.getMode());
    //*/
    return tokens;
}
