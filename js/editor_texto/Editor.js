"use strict";
var   Editor = {};

class EditorDeTexto{
    constructor(id){
        this.id          = id;
        this.idpadre     = "";
        this.idabuelo    = "";

        this.marcatextos = [];
        this.Editor      = CodeMirror.fromTextArea(document.getElementById(id), { // this.Editor  == this.cm
            indentUnit         : 4,
            tabSize            : 4,
            dragDrop           : true,
            lineNumbers        : true,
            firstLineNumber    : 0,
            matchBrackets      : true,
            autoCloseBrackets  : true,
            styleActiveLine    : true,//Resalta la linea activa (solo donde esta el prom o puntero)
            styleSelectedText  : "CodeMirror-selectedtext",
            mode               : {name: "text/x-java",number:/^(?:0x[a-f\d]+|0b[01]+|(?:\d+\.?\d*|\.\d+)(?:e[-+]?\d+)?)/i},
            foldGutter         : true,// para contraer bloques de codigo
            theme              : 'monokai',
            autofocus          : false,
            gutters            : ["CodeMirror-my-markers","CodeMirror-linenumbers", "CodeMirror-foldgutter"],
            readOnly           :false, });
        this.EditorDOM   = $(`#${id} + .CodeMirror`);
        
        this.Editor.display.input.onContextMenu= function(){}; //<<#0>> 
        this.EditorDOM.attr("id",`CodeMirror_${id}`); // add ID  
    }
    set lineNumbers (d){ this.Editor.setOption("lineNumbers", d); }
    set value       (d){ this.Editor.setValue(d); }
    get value       ( ){ return this.Editor.getValue(); }
    set theme       (control = Controles.funcion.Tema)  {
     
        this.Editor.setOption("theme", control);
    }
    get theme(){ return this.Editor.getOption("theme"); }

    changeFullScreen(control = Controles.funcion.FullScreen){
  
        this.Editor.setOption("fullScreen", control);
    }
    addHintWords(){
        // add palabras para el autocompletado

        /*Con esta linea reescribe el hintWords que hereda del mode */
        //CodeMirror.registerHelper("hintWords", "text/x-java",["for(int i = 0; i<10; i++){\n\n}","for"]);

        /*Con esta linea solo añade palabras al hintWords*/
        this.Editor.getHelpers(0,"hintWords")[0]
            .push(
                'codigojava','length'
            );
    }
    extraKeys(){
        //  Nuevas funciones de teclado
        let __Editor = this.Editor;
        this.Editor.setOption("extraKeys", {
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
                let cursor                   = __Editor.getCursor();
                let token                    = __Editor.getTokenAt(cursor);
                let tabulador                = Array(cm.getOption("indentUnit") + 1).join(" ");
                let indentado                = " ".repeat(token.start);
                let brackets                 = `{\n${indentado}    \n${indentado}}`;
                let abreviaturas             = [];
                    abreviaturas["for"]      = `for (int i = 0; i < 10; i++)${brackets}`;
                    abreviaturas["if"]       = `if (true)${brackets}`;
                    abreviaturas["psvm"]     = `public static void main(String[] args)${brackets}`;
                    abreviaturas["sout"]     = `System.out.println("");`;

                //console.log(cursor,token);
                
                if ( abreviaturas[token.string] !== undefined ) {
                    //  Remplazar la abreviatura
                    cm.replaceRange(
                        abreviaturas[token.string],
                        {line: cursor.line, ch: token.start},
                        {line: cursor.line, ch: token.end}
                        );

                    //  Reubicar cursor
                    cursor = __Editor.getCursor();
                    if(abreviaturas[token.string].indexOf('{') != -1){//si es el bloque de brackets
                        __Editor.setCursor({line: cursor.line-1, ch: cursor.ch+3});
                    }else if (abreviaturas[token.string].indexOf('""') != -1){
                        __Editor.setCursor({line: cursor.line, ch: cursor.ch-3});
                    }
                }else{
                    cm.replaceSelection(tabulador);
                }
            }
        });
    }
    autoFill(){
        this.Editor.on("inputRead", function(__editor, inputRead) { //<<#4>>
            if(    Controles.funcion.Autocompletar
                && __editor.getTokenAt(__editor.getCursor()).string.indexOf(' ') == -1 
                && __editor.getTokenAt(__editor.getCursor()).string.indexOf(';') == -1
                && __editor.getTokenAt(__editor.getCursor()).string.indexOf('.') == -1
            ){
                let re = new RegExp("^"+__editor.getTokenAt(__editor.getCursor()).string);
                for(let i of __editor.getHelpers(0,"hintWords")[0]){
                    if (re.test(i)) {
                        __editor.showHint({completeSingle: true});
                    }
                }
            }
        });
    }
    drop(){
        this.Editor.on("drop", function(_editor, inputRead) {    
            //  Al dejar caer un archivo se borrara el contenido actual del editor
            _editor.setValue("");
        });
    }
    setOpacity(control = Controles.funcion.Opacidad){
        let theme = this.Editor.getOption("theme");
        if(theme == 'default'){            
            this.EditorDOM.css({ "background":'rgba(255,255,255,'+control+')' });
        }else if(theme == 'monokai'){
            this.EditorDOM.css({ "background":'rgba(0,0,0,'+control+')' });
        }
    }
    enableReadOnly(){
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
        this.Editor.setOption("readOnly","nocursor");
        this.Editor.setGutterMarker(0, "CodeMirror-my-markers", _makeMarker());
        this.Editor.setOption("styleActiveLine",false);
        this.Editor.setOption("styleSelectedText",false);
    }
    disableReadOnly(){
        this.Editor.setGutterMarker(0, "CodeMirror-my-markers", null);
        this.Editor.setOption("readOnly",false);
        this.Editor.setOption("styleActiveLine",true);
        this.Editor.setOption("styleSelectedText","CodeMirror-selectedtext");
    }
    cleanMarksErrors(){
        for (var i = 0; i < this.Editor.lineCount(); i++) {
            this.Editor.setGutterMarker(i, "CodeMirror-my-markers", null);
        }
    }
    cleanMarksTexts(){
        for(let i of this.marcatextos){
            i.clear();
        }
        this.marcatextos = [];
    }
    markError(lineaInicial, lineaFinal, msn = "Aun no Implementado"){
        function _makeMarker() {
            var marker        = document.createElement("div");
            let tooltip       = document.createElement("div");
            let tooltiptext   = document.createTextNode(msn); 

            marker.className  = "CodeMirror-my-mark-error fa fa-times";
            tooltip.className = "CodeMirror-my-mark-tooltiptext";

            tooltip.appendChild(tooltiptext);  
            marker.appendChild(tooltip);  

            return marker;
        }
        if(lineaInicial < lineaFinal){
            for (let i = lineaInicial; i <= lineaFinal; i++) {
                this.Editor.setGutterMarker(i, "CodeMirror-my-markers", _makeMarker());
            }
        }else{
            this.Editor.setGutterMarker(lineaInicial, "CodeMirror-my-markers", _makeMarker());
        }
    }
    analisisLexico(){
        var tokens = [];
        for (var i = 0; i < this.Editor.lineCount(); i++) {
            [].forEach.call(this.Editor.getLineTokens(i),function (nodo){
                
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
            console.log("cursor-->",this.Editor.getCursor());
            console.log("getHelpers-->",this.Editor.getHelpers({line: 0, ch: 3}));
            console.log("getLine-->",this.Editor.getLine(0));
            console.log("lineCount-->",this.Editor.lineCount());
            console.log("lastLine-->",this.Editor.lastLine());
            console.log("getLineHandle-->",this.Editor.getLineHandle(0));
            console.log("getLineTokens-->",this.Editor.getLineTokens(    3   ));
            console.log(this.Editor.getTokenTypeAt(  {line: 0, ch: 3}  ));
            console.log("getMode-->",this.Editor.getMode());
        //*/
        return tokens;
    }
    markText_InstuccionSiguiente(position){
        var tester;
        /*
        console.log(
            tester=this.Editor.getLineHandle(2)
            );
        console.log(this.Editor.getLineNumber(tester));
        console.log(
            position.start.column,
            position.start.offset,
            position.start.column-position.start.offset,
            position.start.offset-position.start.column);
        console.log(
            position.end.column,
            position.end.offset,
            position.end.column-position.end.offset,
            position.end.offset-position.end.column);
        console.log(position);
        //*/

        let tem = this.Editor.markText(
                                        {line: position.start.line-1, ch: position.start.column-1}, 
                                        {line: position.end.line-1, ch: position.end.column-1}, 
                                        {className: "EditorTooltipMarcatexto siguiente_instruccion",
                                         css:"background: #ffa2ab; color: #000; ",
                                         title:"Se ejecutara en el siguiente paso.",
                                        });

        this.marcatextos.push(tem);
        $(".siguiente_instruccion").attr('title','Se ejecutara en el siguiente paso.');
    }
    markText_InstuccionActual(position){

        let tem = this.Editor.markText(
                                        {line: position.start.line-1, ch: position.start.column-1}, 
                                        {line: position.start.line-1, ch: 90},  
                                        {className: "EditorTooltipMarcatexto",
                                         css:"background: orange; color: #000; ",
                                         title:"Instruccion ejecutada.",
                                        });

        this.marcatextos.push(tem);
    }


}

function crearEditorJava(){
    Editor.java              = new EditorDeTexto("javaEditor");
    Editor.java.value        = "";
    //Editor.java.value        = codigoFuente;
    Editor.java.theme        = Controles.funcion.Tema;
    Editor.java.changeFullScreen(Controles.funcion.FullScreen);
    Editor.java.addHintWords();
    Editor.java.autoFill();
    Editor.java.extraKeys();
    Editor.java.drop();
    Editor.java.setOpacity();
    Editor.java.enableReadOnly();
    Editor.java.disableReadOnly();
    getCodigoFuente();


    //http://jsfiddle.net/1kg2y0w5/
    //var nuevo = CodeMirror.Doc("hola mundo")

    //var docOld = Editor.java.Editor.swapDoc(nuevo);

    //var nuevo  = Editor.java.Editor.swapDoc(docOld);

    //console.log(Editor.java.Editor.getDoc());

    //console.log(docOld.getValue());
    //console.log(Editor.java);
    

}
function crearEditorAnSintactico(){
    

    Editor.sintactico              = new EditorDeTexto("arbol_sintactico");
    Editor.sintactico.theme        = "default";
    Editor.sintactico.changeFullScreen(false);
    Editor.sintactico.lineNumbers = false;
    Editor.sintactico.addHintWords();
    Editor.sintactico.autoFill();
    Editor.sintactico.extraKeys();
    Editor.sintactico.drop();
    Editor.sintactico.setOpacity(1);
}
function crearEditorAnSintactico2(){
    

    Editor.sintactico2              = new EditorDeTexto("arbol_sintactico2");
    Editor.sintactico2.theme        = "default";
    Editor.sintactico2.changeFullScreen(false);
    Editor.sintactico2.lineNumbers = false;
    Editor.sintactico2.addHintWords();
    Editor.sintactico2.autoFill();
    Editor.sintactico2.extraKeys();
    Editor.sintactico2.drop();
    Editor.sintactico2.setOpacity(1);
}