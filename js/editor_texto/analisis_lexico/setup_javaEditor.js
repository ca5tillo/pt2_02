var javaEditor;
var javaEditor_lineasError = [];
var marcatextos_1 = null;
var marcatextos_2 = null;

function setup_javaEditor(){
	javaEditor = CodeMirror.fromTextArea(document.getElementById("javaEditor"), {
        indentUnit:4,
        tabSize:4,
        dragDrop:true,
        lineNumbers: true,
        matchBrackets: true,
        autoCloseBrackets: true,
        //styleActiveLine: true,
        styleSelectedText: true,
        mode: {name: "text/x-java",number:/^(?:0x[a-f\d]+|0b[01]+|(?:\d+\.?\d*|\.\d+)(?:e[-+]?\d+)?)/i},
        theme: 'monokai',
        autofocus:false,
        gutters: ["CodeMirror-my-markers"],
    });
    $(".CodeMirror").css({ "background":'rgba(0,0,0,0.3)' });

    javaEditor_extraKeys();


    //  Evento inputRead que se desencadena con nuevas entradas 
    javaEditor.on("inputRead", function(javaEditor, inputRead) {
        //console.log(javaEditor.getTokenAt(javaEditor.getCursor()));
        //  Si no existen espacios en blanco muestra el autocompletador
        if(javaEditor.getTokenAt(javaEditor.getCursor()).string.indexOf(' ') == -1 && javaEditor.getTokenAt(javaEditor.getCursor()).string.indexOf(';') == -1){
            javaEditor.showHint({completeSingle: false});
        }
    });
}
function javaEditor_setText(value){
	javaEditor.setValue(value);
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
            javaEditor_lineasError.push(i);
        }
    }else{
        javaEditor.setGutterMarker(lineaInicial, "CodeMirror-my-markers", _makeMarker());
        javaEditor_lineasError.push(lineaInicial);
    }
}
function javaEditor_clearMarkError(){
    for(let i of javaEditor_lineasError){
        javaEditor.setGutterMarker(i, "CodeMirror-my-markers", null);
    }
}
function javaEditor_markText(lineaI,lineaF = null){
    let _lineaF = lineaF ? lineaF : lineaI;
    //javaEditor.markText({line: 2, ch: 0}, {line: 2, ch: 20}, {className: "styled-background"});
    marcatextos_1 = javaEditor.markText({line: lineaI, ch: 0}, {line: _lineaF, ch: 200}, {className: "styled-background"});
}
function javaEditor_markText2(lineaI,lineaF = null){
    let _lineaF = lineaF ? lineaF : lineaI;
    //javaEditor.markText({line: 2, ch: 0}, {line: 2, ch: 20}, {className: "styled-background"});
    marcatextos_2 = javaEditor.markText({line: lineaI, ch: 0}, {line: _lineaF, ch: 200}, {className: "styled-background"});
}
function javaEditor_markClean(){
    if(marcatextos_1 != null)
        marcatextos_1.clear();
    if(marcatextos_2 != null)
        marcatextos_2.clear();
   // javaEditor.clear ({line: linea, ch: 0}, {line: linea, ch: 200})
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
