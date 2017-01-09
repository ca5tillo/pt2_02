

var as_nivelAnidamiento = 0;

var as_generateID = GenerateID();

class ModelArgumento{
    constructor(type, value){
        this.instruccion = "argumento";
        this.type        = type;
        this.value       = value;
    }
}
class ModelParametro{
	constructor(type,nombre){
        this.instruccion = "parametro";
		this.type = type;
        this.name = nombre;
	}

}
class ModelMetodo {
    constructor(){
        
    }
}
class ModelArbol  {
	constructor(
		nivelAnidamiento = 0,
		tipo             = "ElementoRaiz"

		){

        this.instruccion               = "";
        this.id                         = as_generateID.next().value;
        this.idPadre                    = 0;
		this.padre						= {};
		this.hijos                      = [];

        this.name                       = "";

        this.argumentos                 = []; // Se refiere al valor que se envia
		this.parametros                 = []; // sE refiere a la variable en la declaración del método

        this.tipo = tipo;//defClase, defMetodo, defVariable, asignarValor,llamadaAmetodos
        this.tipoDeDato = "";// si es variable
        this.valor = "";// si es variable
        this.valor_tipoDeDato="";
		this.static = false;
		this.retorno =""
		this.restriccion="";//private, public ...
		
		this.lineaInicial               = 0;
		this.lineaFinal                 = 0;
        this.li_columnaInicial          = 0;
        this.li_columnaFinal            = 0;
        this.lf_columnaInicial          = 0;
        this.lf_columnaFinal            = 0;



        this.nivelAnidamiento_temporal  = nivelAnidamiento;
        this.nivelAnidamiento           = nivelAnidamiento;
        this.isNodoFinal                = true; // los q no son finales tiene sub elementos Ej. un metodo o un for

		
	}
}
function analisisSintactico_getArbol(){
	let tokens = javaEditor_analisisLexico();

	let lst_token      = [];
	let str            = "";
	let isFor          = false;
	let isArray        = false;
	let raiz           = new ModelArbol();
        raiz.name      = "ElementoRaiz";

	for(let i of tokens){
	    lst_token.push(i);
	    str     += `${i.symbol}`;
	    
	    RE_IS_ARREGLO.test(str) ? isArray = true :"";
	    i.symbol == "FOR" ? isFor = true:""; 

	    if(   (i.symbol == "LBRACE"    && !isArray)
	        ||(i.symbol == "SEMICOLON" && !isFor)
	        ){

	        let obj = _reglasProduccion(str, lst_token,as_nivelAnidamiento+1);    
        	_addNodo(raiz,obj,as_nivelAnidamiento);
        	if(! obj.isNodoFinal){
        		as_nivelAnidamiento += 1;
        	}
	       
	        
	        lst_token = [];
	        isFor = false;
	        isArray = false;
	        str = "";


	    }else if(i.symbol == "RBRACE"  && !isArray){
            if(! /^RBRACE/.test(str) ){ // Si str contiene algo mas que RBRACE se concidera error 
                let error = new ModelArbol(-1,"ERROR_SINTACTICO");//el nivel se coloca en -1 ya q estos no tendran hijos asignados
                error.nivelAnidamiento=as_nivelAnidamiento+1;
                error.lineaInicial = lst_token[0].line;
                _addNodo(raiz,error,as_nivelAnidamiento);
            }
	        _as_finalizarRama(raiz,as_nivelAnidamiento,i);// tambien disminuye en uno al as_nivelAnidamiento

            lst_token = [];
            isFor = false;
            isArray = false;
            str = "";

	    }


	}
	//*/
    //as_imprimirArbol(raiz);
	return raiz;

}
function _reglasProduccion(str, arr, nivel){
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
        let obj             = new ModelArbol(nivel,"defClase");
        obj.name            = strmap.NAME;
        obj.lineaInicial    = arr[0].line;
        obj.isNodoFinal     = false;
        return obj; 
    }
    /*    RECONOCIENDO DEFINICION DE METODO                                    */
    if( _RE_ = str.match(RE_DEF_METODO)              ){
    	let obj             = new ModelArbol(nivel,"defMetodo");
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
    	let obj = new ModelArbol(-1,"defVariable");//el nivel se coloca en -1 ya q estos no tendran hijos asignados
    	obj.nivelAnidamiento = nivel;//se asigna nivel de anidamiento para que al imprimirlo en consola saber cuanto espacio separarlo
    	obj.tipoDeDato = _RE_[1] || "";
    	obj.name = strmap.NAME;
		obj.valor = strmap[_RE_[3]];
		obj.valor_tipoDeDato = _RE_[3];
        obj.lineaInicial = arr[0].line;


    	return obj; 
    }
    /*    RECONOCIENDO DECLARACION DE VARIABLES NO INICIALIZADAS               */
    if( _RE_ = str.match(RE_DEF_VAR_NO_INICIALIZADA) ){
        let obj = new ModelArbol(-1,"defVariable");//el nivel se coloca en -1 ya q estos no tendran hijos asignados
        obj.nivelAnidamiento = nivel;//se asigna nivel de anidamiento para que al imprimirlo en consola saber cuanto espacio separarlo
        obj.tipoDeDato = _RE_[1] || "";
        obj.name = strmap.NAME;
        obj.valor = "?";
        obj.valor_tipoDeDato = "?";
        obj.lineaInicial = arr[0].line;
        return obj; 
    }
    /*    RECONOCIENDO ASIGNACION DE VALORES A VARIABLES                       */
    if( _RE_ = str.match(RE_ASIGNACION_DE_VALOR)     ){
    	let obj = new ModelArbol(-1,"asignacionDeValor");//el nivel se coloca en -1 ya q estos no tendran hijos asignados
    	obj.nivelAnidamiento = nivel;//se asigna nivel de anidamiento para que al imprimirlo en consola saber cuanto espacio separarlo
		obj.valor = strmap[_RE_[1]];
		obj.valor_tipoDeDato = _RE_[1];
    	obj.name = strmap.NAME;
        obj.lineaInicial = arr[0].line;
        return obj; 
    }
    /*    RECONOCIENDO UN ARRAY TIPO Tipo_de_variable[ ] Nombre_del_array = {};*/
    if( _RE_ = str.match(RE_ARREGLO)                 ){
        let obj = new ModelArbol(-1,"defArreglo");
        obj.nivelAnidamiento = nivel;
        obj.tipoDeDato = _RE_[2];
        obj.name = strmap.NAME;
        obj.valor_tipoDeDato = _RE_[2];
        obj.lineaInicial = arr[0].line;
        obj.hijos = _getContenidoArreglo(arr,obj,nivel+1,obj.tipoDeDato,obj.name);
        return obj; 
    }
    /*    RECONOCIENDO LLAMADA A METODO*/
    if( _RE_ = str.match(RE_LLAMADA_FUNCION_SIN_PARAMETROS_SIN_RETORNO)){
        let obj = new ModelArbol(-1,"llamada_funcion_sinparametros_sinretorno");//el nivel se coloca en -1 ya q estos no tendran hijos asignados
        obj.nivelAnidamiento = nivel;//se asigna nivel de anidamiento para que al imprimirlo en consola saber cuanto espacio separarlo
        obj.name = strmap.NAME;
        obj.lineaInicial = arr[0].line;
        return obj; 
    }
    /*    RECONOCIENDO LLAMADA A METODO*/
    if( _RE_ = str.match(RE_LLAMADA_FUNCION_CON_PARAMETROS_SIN_RETORNO)){
        let obj = new ModelArbol(-1,"llamada_funcion_conparametros_sinretorno");//el nivel se coloca en -1 ya q estos no tendran hijos asignados
        obj.name = strmap.NAME;
        obj.argumentos=_as_getArgumentos(arr);
        

        obj.nivelAnidamiento = nivel;//se asigna nivel de anidamiento para que al imprimirlo en consola saber cuanto espacio separarlo
        obj.lineaInicial = arr[0].line;
        
        return obj; 
    }
    /*    RECONOCIENDO RETURN VARIABLE*/
    if( _RE_ = str.match(RE_RETURN_VARIABLE)){
        let obj = new ModelArbol(-1,"return_variable");//el nivel se coloca en -1 ya q estos no tendran hijos asignados
        obj.nivelAnidamiento = nivel;//se asigna nivel de anidamiento para que al imprimirlo en consola saber cuanto espacio separarlo
        obj.name = strmap.NAME;
        obj.lineaInicial = arr[0].line;
        
        return obj; 
    }
    /* RE_ASIGNARAVARIALEDESDEMETODO */
    if( _RE_ = str.match(RE_ASIGNARAVARIALEDESDEMETODO)){
        console.log(_RE_)
        let obj = new ModelArbol(-1,"ASIGNARAVARIALEDESDEMETODO");//el nivel se coloca en -1 ya q estos no tendran hijos asignados
        obj.nivelAnidamiento = nivel;//se asigna nivel de anidamiento para que al imprimirlo en consola saber cuanto espacio separarlo
        obj.nameDestino      = strmap.NAME; // destino al hacer return 
        obj.name             = strmap.NAME_0;
        obj.argumentos       = _as_getArgumentos(arr);
        obj.lineaInicial     = arr[0].line;

        return obj; 
    }



    /*    RECONOCIENDO UN CICLO FOR    */
    if(RE_FOR.test(str)){
    	let obj = new ModelArbol(nivel,"defFor");
    	obj.parametros = lstParametros;    	
        obj.lineaInicial = arr[0].line;
        return obj; 
    }

    

    /*    RECONOCIENDO ASIGNACION ARRAY TIPO Tipo_de_variable[i]=21;*/
    if(RE_ASIGNACION_DE_VALOR_ARRAY.test(str)){

		let RE_Txt = str.match(RE_ASIGNACION_DE_VALOR_ARRAY);
		//console.log(str,RE_Txt,strmap[RE_Txt[1]],strmap)
    	let obj = new ModelArbol(-1,"asignacionDeValorArray");//el nivel se coloca en -1 ya q estos no tendran hijos asignados
    	obj.nivelAnidamiento = nivel;//se asigna nivel de anidamiento para que al imprimirlo en consola saber cuanto espacio separarlo
		obj.valor = strmap["NAME_1"];
		obj.valor_tipoDeDato = RE_Txt[1];
    	obj.name = strmap.NAME;
    	obj.indice = strmap["NAME_0"];// esta propiedad no se ecncuentra en el modelo 
        obj.lineaInicial = arr[0].line;
        return obj; 
    }



    /*    SI NO COINCIDE CON NINGUNA REGLA SE CONSIDERA ERROR       */
    let error = new ModelArbol(-1,"ERROR_SINTACTICO");//el nivel se coloca en -1 ya q estos no tendran hijos asignados
    error.nivelAnidamiento=nivel;
    error.lineaInicial = arr[0].line;

    console.log(str);
    return error;
}

function _as_getArgumentos(arr){

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


                let modelArgumento = new ModelArgumento(_re[1],strmap[_re[1]]);
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


                    let modelParametro = new ModelParametro(_re[1],strmap.NAME);
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
function _getContenidoArreglo(arr,padre,nivel,tipoDeDato,nombre){
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
       

        
        let hijo = new ModelArbol(-1,"defVariable");
    	hijo.nivelAnidamiento = nivel;
        hijo.tipoDeDato = tipoDeDato;
        hijo.valor = i;
        hijo.name = nombre+`[${y}]`;
        hijo.idPadre = padre.id;
        hijo.padre=padre;

        hijo.lineaInicial = 1;
        hijos.push(hijo);

     
 
      	y+=1;
    }
    return hijos;
}

function _addNodo(padre,hijo,nivel){
    if(padre.nivelAnidamiento_temporal == nivel){
        hijo.idPadre = padre.id;
    	hijo.padre=padre;
        padre.hijos.push(hijo);
    }else{
        for(let i of padre.hijos){
            _addNodo(i,hijo,nivel);
        }
    }
}
function _as_finalizarRama(padre,nivels,rbrace){

    if(padre.nivelAnidamiento_temporal == nivels){

        padre.nivelAnidamiento_temporal = -1;
        padre.lineaFinal = rbrace.line;
        as_nivelAnidamiento -= 1;
    }else{
        for(let i of padre.hijos){
            _as_finalizarRama(i,nivels,rbrace);
        }
    }
}

function as_imprimirArbol(nodo){
    $('#representacion_arbolSintactico').empty();

    _createLista = function (nodo){
        let li    = document.createElement("li");        
        let texto = document.createTextNode(`[${nodo.id},${nodo.idPadre}]${nodo.name}`); 
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
        textito += `<tr><td>${i}</td><td> ${nodo[i]}</td></tr>`;
    }
    textito += `</table>`;
    $('#infonodo_as').html(textito);
    console.log(nodo)
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

    let searchedItem = getSubMenuItem([arbolSintactico], id) || null;
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


