
Este es un proyecto que nace con el objetivo de apoyar a estudiantes de programación. 
Realiza a partir de código fuente escrito en lenguaje Java una animación que representa la ejecución del código que se le ha proporcionado. La interfaz consta de un menú con los controles, un editor de texto y un área de representación.

CodeMirror     Version 5.36.0.
D3.js          Version 5.0.0
DAT.GUI        Version 2.0 
font-awesome   Version 4.6.3
Three-js       Version 0.91.0
tween.js       Version 17.2.0




JavaParser.js fue generado por PEG.js 0.10.0.  en  http://pegjs.org/   con la gramatica design/javaparser/java.1.7.pegjs 
Se definio como Parser variable: "JavaParser.parse"
https://github.com/mazko/jsjavaparser
https://github.com/mazko/jsjavaparser/blob/master/src/Java.1.7.pegjs
https://pegjs.org/documentation#installation











//http://jsfiddle.net/Ka7P2/732/



1° se carga el panel de controles
2° se cargan las utilerias de three.js como las imagenes
3° se carga el editor de texto



      rest:GenericMethodOrConstructorRest              // Generic Method or Constructor
    { 
      return mergeProps(rest, {
        node           : 'MethodDeclaration',
        typeParameters : params,
        location       : location(),
      });
    }
    / type:Type id:Identifier 


    cd C:\Users\MG\Documents\GitHub\pt2_02\lib\javaparser
    pegjs -O speed -e JavaParser --format globals -o JavaParser.js My_java.1.7.pegjs