
var as_arbol            = null;
var as_generateID       = GenerateID();
var as_ids              = [];

class ASArgumento{
    constructor(type, value, name){
        this.reglaP      = "argumento";
        this.type        = type;
        this.value       = value;
        this.namePadre   = name; 
    }
}
class ASParametro{
	constructor(type,nombre){
        this.reglaP    = "parametro";
		this.type      = type;
        this.name      = nombre;
	}

}
class ASElemento  {
	constructor(

		){

        this.reglaP                     = null;
        this.id                         = as_generateID.next().value;
        this.idPadre                    = 0;
		this.padre						= {};
		this.hijos                      = [];

        this.type                       = null;
        this.name                       = null;
        this.value                      = null;
        this.valueType                  = null;

        this.destinoCreate              = false; //existe o no 
        this.destinoName                = null;
        this.argumentos                 = []; // Se refiere al valor que se envia
        this.parametros                 = []; // Se refiere a la variable en la declaración del método
        this.arrays                     = []; // Seran sol sub elementos de un array


        this.tipoDeDato = "";// si es variable
        this.valor = "";// si es variable
		this.static = false;
		this.retorno =""
		this.restriccion="";//private, public ...
		
		this.lineaInicial               = 0;
		this.lineaFinal                 = 0;
        this.li_columnaInicial          = 0;
        this.li_columnaFinal            = 0;
        this.lf_columnaInicial          = 0;
        this.lf_columnaFinal            = 0;



        this.isNodoFinal                = true; // los q no son finales tiene sub elementos Ej. un metodo o un for

		
	}
}
function analisisSintactico(){
	let tokens           = javaEditor_analisisLexico();

	let lst_token        = [];
	let str              = "";
	let isFor            = false;
	let isArray          = false;
    
    as_arbol             = new ASElemento();
    as_arbol.name        = "ElementoRaiz";
    as_arbol.isNodoFinal = false;
    as_ids.push(as_arbol.id);

	for(let i of tokens){
	    lst_token.push(i);
	    str     += `${i.symbol}`;
	    
	    RE_IS_ARREGLO.test(str) ? isArray = true :"";
	    i.symbol == "FOR" ? isFor = true:""; 

	    if(   (i.symbol == "LBRACE"    && !isArray)
	        ||(i.symbol == "SEMICOLON" && !isFor)
	        ){

	        let obj = _reglasProduccion(str, lst_token);  
            _addNodo(obj);
            if(! obj.isNodoFinal){as_ids.push(obj.id);}
	       
	        
	        lst_token = [];
	        isFor = false;
	        isArray = false;
	        str = "";


	    }else if(i.symbol == "RBRACE"  && !isArray){
            if(! /^RBRACE/.test(str) ){ // Si str contiene algo mas que RBRACE se concidera error 

                let error = new ASElemento();
                    error.reglaP             = "ERROR_SINTACTICO";
                    error.lineaInicial       = lst_token[0].line;
                    error.lineaFinal         = lst_token[lst_token.length-1].line;
                _addNodo(error);
            }
	        _as_finalizarRama(i);// tambien disminuye en uno al as_nivelAnidamiento

            lst_token = [];
            isFor = false;
            isArray = false;
            str = "";

	    }


	}
	//*/
	return as_arbol;

}
function _reglasProduccion(str, arr){
    //console.log("*********************************************************");
    //console.log(str_dev);
    //console.log(str);



	let RE_FOR = /^FOR\s?LPAREN.*SEMICOLON.*SEMICOLON.*RPAREN/;
	let RE_ASIGNACION_DE_VALOR_ARRAY = /(NAME) LBRACK (NAME|BYTE|SHORT|INT|LONG|FLOAT|DOUBLE|BOOLEAN_LITERAL|CHAR|STRING)\s?RBRACK EQ /;

    let _RE_              = null;
    let strmap            = {};
    let dev_frase         = ""; //contiene los string de la frase solo para ver por consola
    let dev_str           = ""
	let temporalcontador  = 0;

    for(let i of arr){
        dev_frase += `${i.string} `;
        dev_str     += `${i.symbol} `;
    	if(strmap[i.symbol] == undefined){
			strmap[i.symbol]=i.string;
    	}else{
    		strmap[i.symbol+"_"+temporalcontador]=i.string;
    		temporalcontador+=1;
    	}	
    }
    
    //console.log("*********************************************************");
    //console.log(dev_frase);
    //console.log(str);


     /*    RECONOCIENDO DEFINICION DE CLASE                                    */
    if( _RE_ = str.match(RE_DEF_CLASE) ){
        let obj             = new ASElemento();
        obj.reglaP          = "clase";

        obj.name            = strmap.NAME;
        obj.lineaInicial    = arr[0].line;

        obj.isNodoFinal     = false;
        return obj; 
    }
    /*    RECONOCIENDO DEFINICION DE METODO                                    */
    if( _RE_ = str.match(RE_DEF_METODO)              ){
    	let obj             = new ASElemento();
        obj.reglaP          = "metodo";

    	obj.name            = strmap.NAME;
    	obj.parametros      = _as_getParametros(arr);    	

        obj.restriccion     = _RE_[1]; 
        obj.static          = _RE_[2] ? true:false;
        obj.retorno         = _RE_[3];
        obj.lineaInicial    = arr[0].line;

        obj.isNodoFinal     = false;
    	return obj;     	
    }
    /*    RECONOCIENDO DECLARACION DE VARIABLES INICIALIZADAS                  */
    if( _RE_ = str.match(RE_DEF_VAR_INICIALIZADA)    ){
    	let obj              = new ASElemento();
        obj.reglaP           = "variable";

    	obj.type             = _RE_[1] || "";
    	obj.name             = strmap.NAME;
		obj.value            = strmap[_RE_[3]];
		obj.valueType        = _RE_[3];

        obj.lineaInicial     = arr[0].line;
        obj.lineaFinal       = arr[arr.length-1].line;
    	return obj; 
    }
    /*    RECONOCIENDO DECLARACION DE VARIABLES NO INICIALIZADAS               */
    if( _RE_ = str.match(RE_DEF_VAR_NO_INICIALIZADA) ){
        let obj              = new ASElemento();
        obj.reglaP           = "variable";

        obj.type             = _RE_[1] || "";
        obj.name             = strmap.NAME;
        obj.value            = "?";

        obj.lineaInicial = arr[0].line;
        return obj; 
    }
    /*    RECONOCIENDO ASIGNACION DE VALORES A VARIABLES                       */
    if( _RE_ = str.match(RE_ASIGNACION_DE_VALOR)     ){
    	let obj              = new ASElemento();
        obj.reglaP           = "asignacion";
    	
        obj.name             = strmap.NAME;
        obj.valor            = strmap[_RE_[1]];
        obj.valueType        = _RE_[1];

        obj.lineaInicial     = arr[0].line;
        return obj; 
    }

    /*    RECONOCIENDO LLAMADA A METODO*/
    if( _RE_ = str.match(RE_LLAMADA_FUNCION)){
        let obj              = new ASElemento();
        obj.reglaP           = "llamada";

        obj.name             = strmap.NAME;
        obj.argumentos       = _as_getArgumentos(arr, obj.name);
        
        obj.lineaInicial     = arr[0].line;
        
        return obj; 
    }
    /* RECONOCIENDO LLAMADA A METODO CON ASIGNACION */
    if( _RE_ = str.match(RE_LLAMADA_FUNCION_RETURN)){
        let obj              = new ASElemento();
        obj.reglaP           = "llamada";

        obj.destinoName      = strmap.NAME; // destino al hacer return 
        obj.name             = strmap.NAME_0;
        obj.argumentos       = _as_getArgumentos(arr, obj.name);
        obj.lineaInicial     = arr[0].line;

        return obj; 
    }
    /* RECONOCIENDO LLAMADA A METODO CON ASIGNACION Y DECLARACION DE VARIABLE*/
    if( _RE_ = str.match(RE_LLAMADA_FUNCION_RETURN_1)){
        let obj              = new ASElemento();
        obj.reglaP           = "llamada";

        obj.destinoCreate    = true;
        obj.type             = _RE_[1] || "";
        obj.destinoName      = strmap.NAME; // destino al hacer return 
        obj.name             = strmap.NAME_0;
        obj.argumentos       = _as_getArgumentos(arr, obj.name);
        obj.lineaInicial     = arr[0].line;

        return obj; 
    }
    /*    RECONOCIENDO RETURN VARIABLE*/
    if( _RE_ = str.match(RE_RETURN_VARIABLE)){
        let obj              = new ASElemento();
        obj.reglaP           = "return_variable";

        obj.name             = strmap.NAME;
        
        obj.lineaInicial     = arr[0].line;
        return obj; 
    }


    /*    RECONOCIENDO UN ARRAY TIPO Tipo_de_variable[ ] Nombre_del_array = {};*/
    if( _RE_ = str.match(RE_ARREGLO)                 ){
        let obj              = new ASElemento();
        obj.reglaP           = "arreglo";

        obj.type             = _RE_[2];
        obj.name             = strmap.NAME;
        obj.hijos            = _getContenidoArreglo(arr, obj, obj.type, obj.name);

        obj.lineaInicial = arr[0].line;
        return obj; 
    }
    



    /*    RECONOCIENDO UN CICLO FOR    */
    if(RE_FOR.test(str)){
        /*
    	let obj = new ASElemento();
    	obj.parametros = lstParametros;    	
        obj.lineaInicial = arr[0].line;
        return obj;
        */ 
    }

    

    /*    RECONOCIENDO ASIGNACION ARRAY TIPO Tipo_de_variable[i]=21;*/
    if(RE_ASIGNACION_DE_VALOR_ARRAY.test(str)){

		let RE_Txt = str.match(RE_ASIGNACION_DE_VALOR_ARRAY);
		//console.log(str,RE_Txt,strmap[RE_Txt[1]],strmap)
    	let obj = new ASElemento(-1,"asignacionDeValorArray");//el nivel se coloca en -1 ya q estos no tendran hijos asignados
    	obj.valor = strmap["NAME_1"];
		obj.valor_tipoDeDato = RE_Txt[1];
    	obj.name = strmap.NAME;
    	obj.indice = strmap["NAME_0"];// esta propiedad no se ecncuentra en el modelo 
        obj.lineaInicial = arr[0].line;
        return obj; 
    }



    /*    SI NO COINCIDE CON NINGUNA REGLA SE CONSIDERA ERROR       */
    let error = new ASElemento();
        error.reglaP             = "ERROR_SINTACTICO";
        error.lineaInicial       = arr[0].line;
        error.lineaFinal         = arr[arr.length-1].line;


    return error;
}

/*
    return un array basio o con argumentos
*/
function _as_getArgumentos(arr, name){

    let strmap            = {};
    let insertinparam = false;

    let str="";
    let _re;
    let lstArgumentos = [];


    for(let i of arr){
       // if(i.symbol == "RPAREN")insertinparam=false;
        if(insertinparam){
            
            str     += `${i.symbol}`;
            if(strmap[i.symbol] == undefined)
                strmap[i.symbol]=i.string;

            if( _re = str.match(/^(VOID|BOOLEAN|INT|FLOAT|DOUBLE|STRING|NAME|NUM|CADENA|BOOLEAN_LITERAL)(COMMA|RPAREN)/)){


                let modelArgumento = new ASArgumento(_re[1], strmap[_re[1]], name);
                lstArgumentos.push(modelArgumento);
                str="";
                strmap={};
            }
          
        

        }
        if(i.symbol == "LPAREN")insertinparam=true;
    }
  
    return lstArgumentos;
}
function _as_getParametros(arr){

    let strmap            = {};
    let insertinparam = false;

    let str="";
    let _re;
    let lstParametros = [];


    for(let i of arr){
        if(i.symbol == "RPAREN")insertinparam=false;
        if(insertinparam){
            if(i.symbol != "COMMA"){
                str     += `${i.symbol}`;
                if(strmap[i.symbol] == undefined)
                    strmap[i.symbol]=i.string;

                if( _re = str.match(/^(VOID|BOOLEAN|INT|FLOAT|DOUBLE|STRING)NAME$/)){


                    let modelParametro = new ASParametro(_re[1],strmap.NAME);
                    lstParametros.push(modelParametro);
                    str="";
                    strmap={};
                }
            }

        }
        if(i.symbol == "LPAREN")insertinparam=true;
    }
    

    return lstParametros;
}
function _getContenidoArreglo(arr,padre,type,nombre){
	let str = "";
	let parametros = [];
    let insertinparam = false;
    let hijos = [];
    let parametro = [];

    for(let i of arr){
        if(i.symbol == "RBRACE")insertinparam=false;
        if(insertinparam)str += `${i.string}`;
        if(i.symbol == "LBRACE")insertinparam=true;
    }
    str = str.split(","); 

   
 	let y = 0;
    for(let i of str){
       

        
        let hijo = new ASElemento();
  
        hijo.type = type;
        hijo.value = i;
        hijo.name = nombre+`[${y}]`;
        hijo.idPadre = padre.id;
        hijo.padre=padre;

        hijo.lineaInicial = 1;
        hijos.push(hijo);

     
 
      	y+=1;
    }
    return hijos;
}

function _addNodo(hijo){
    let u        = as_ids.length-1;
    let padre    = as_GetElementById(as_ids[u]);

    hijo.idPadre = padre.id;
    hijo.padre   = padre;
    padre.hijos.push(hijo);

}
function _as_finalizarRama(rbrace){
    let u        = as_ids.length-1;
    let padre    = as_GetElementById(as_ids[u]);

    padre.lineaFinal = rbrace.line;
    as_ids.pop();
    
}

function as_imprimirArbol(nodo){

    _createLista = function (nodo){
        if(nodo.reglaP == "ERROR_SINTACTICO"){
            javaEditor_markError(nodo.lineaInicial,nodo.lineaFinal);
            existenErrores = true;
        }
        let li    = document.createElement("li");        
        let texto = document.createTextNode(`[${nodo.id},${nodo.idPadre}] (${nodo.reglaP}) ${nodo.name}`); 
        li.setAttribute("data-value", `${nodo.id}`); 
        li.appendChild(texto);  

        if(nodo.hijos.length > 0){
            let ul = document.createElement("ul"); 
            li.appendChild(ul);                          
            for(let i of nodo.hijos){
                ul.appendChild(_createLista(i));  
            }
        } 
        return li;
    }
    let ul    = document.createElement("ul");          
    ul.setAttribute("id", "arbol");       
    ul.setAttribute("data-name", "arbolSintactico"); 
    ul.addEventListener("change", as_infoNodo);
    ul.appendChild(_createLista(nodo));   

    document.getElementById("representacion_arbolSintactico").innerHTML="";
    document.getElementById("representacion_arbolSintactico").appendChild(ul);  

    $('#representacion_arbolSintactico ul#arbol').bonsai({
        expandAll: true,
        createInputs: "radio",
        idAttribute: 'id'
    });


}
function as_infoNodo(ev){
    let id = ev.target.value;
    let nodo = as_GetElementById(id);
    let textito = "<table border='1'>";
    for(let i in nodo){
        if(nodo[i] && i != "hijos" && i != "padre")
        textito += `<tr><td>${i}</td><td> ${nodo[i]||""}</td></tr>`;
    }
    textito += `</table>`;
    $('#infonodo_as').html(textito);

}
function as_GetElementById(id){
    //http://jsfiddle.net/dystroy/MDsyr/
    let getSubMenuItem = function (subMenuItems, id) {
        if (subMenuItems) {
            for (let i = 0; i < subMenuItems.length; i++) {
                if (subMenuItems[i].id == id ){
                    return subMenuItems[i];
                };
                let found = getSubMenuItem(subMenuItems[i].hijos, id);
                if (found) return found;
            }
        }
    };

    let searchedItem = getSubMenuItem([as_arbol], id) || null;
    return searchedItem;
}

function as_imprimirArbolConsola(O_o){
    console.log(

        O_o.id,
        ",",
        O_o.idPadre,
    	"    ".repeat(O_o.nivelAnidamiento),
    	O_o.tipo,
    	O_o.name,
    	O_o.valor,
    	O_o.parametros
    	);
    for(let i of O_o.hijos){
        as_imprimirArbol(i);
    }
}


