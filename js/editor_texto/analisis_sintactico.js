const RE_IS_ARREGLO = /^(BYTE|SHORT|INT|LONG|FLOAT|DOUBLE|BOOLEAN_LITERAL|CHAR|STRING)\s?LBRACK\s?RBRACK/;

const RE_DEF_CLASE  = /^(PUBLIC|PRIVATE)?CLASSNAME(?=LBRACE)/;
const RE_DEF_METODO = /^(PUBLIC|PRIVATE)?(STATIC)?(VOID|BOOLEAN|INT|FLOAT|DOUBLE|STRING)NAMELPAREN.*(?=RPARENLBRACE)/;
const RE_DEF_VAR_INICIALIZADA = /^(PUBLIC|PRIVATE)?(STATIC)?(VOID|BOOLEAN|INT|FLOAT|DOUBLE|STRING)NAME(EQ)(NUM|CADENA|BOOLEAN_LITERAL)(?=SEMICOLON)/;
const RE_DEF_VAR_NO_INICIALIZADA = /^(PUBLIC|PRIVATE)?(STATIC)?(VOID|BOOLEAN|INT|FLOAT|DOUBLE|STRING)NAME(?=SEMICOLON)/;
const RE_ASIGNACION_DE_VALOR = /^NAMEEQ(NUM|CADENA|BOOLEAN_LITERAL)(?=SEMICOLON)/;
const RE_ARREGLO = /^(PUBLIC|PRIVATE)?(BYTE|SHORT|INT|LONG|FLOAT|DOUBLE|BOOLEAN_LITERAL|CHAR|STRING)LBRACKRBRACKNAMEEQLBRACE.*(?=RBRACESEMICOLON)/;
    

var as_nivelAnidamiento = 0;
var ERROR_SINTACTICO    = false;

class ModelParametro{
	constructor(arr){
		this.arr = arr;
		this.tipo = "parametro";
	}

}
class ModelArbol  {
	constructor(
		arr 			 = [], 
		nivelAnidamiento = 0,
		tipo             = "ElementoRaiz"

		){
		this.arr 						= arr;
		this.nivelAnidamiento_temporal  = nivelAnidamiento;
		this.nivelAnidamiento 			= nivelAnidamiento;
		this.padre						={};

		this.tipo = tipo;//defClase, defMetodo, defVariable, asignarValor,llamadaAmetodos
		this.tipoDeDato = "";// si es variable
		this.nombre = "";
		this.valor = "";// si es variable
		this.valor_tipoDeDato="";
		this.hijos = [];
		this.parametros = [];// si es un metodo
		this.static = false;
		this.retorno =""
		this.restriccion="";//private, public ...
		
		this.lineaInicial=0;
		this.lineaFinal= 0;
        this.li_columnaInicial = 0;
        this.li_columnaFinal = 0;
        this.lf_columnaInicial = 0;
        this.lf_columnaFinal = 0;






		
	}
}
function analisisSintactico_getArbol(){
	//console.log(new ModelArbol())
	let tokens = javaEditor_analisisLexico();

	let lst_token      = [];
	let str            = "";
    let str_dev        = "";
	let isFor          = false;
	let isArray        = false;
	let raiz           = new ModelArbol();

	for(let i of tokens){
	    lst_token.push(i);
	    str     += `${i.symbol}`;
        str_dev += `${i.symbol} `;
	    
	    RE_IS_ARREGLO.test(str) ? isArray = true :"";
	    i.symbol == "FOR" ? isFor = true:""; 

	    if(   (i.symbol == "LBRACE"    && !isArray)
	        ||(i.symbol == "SEMICOLON" && !isFor)
	        ){

            str = str.trim();
	        let obj = _as_reglasDeProduccion(str, str_dev, lst_token,as_nivelAnidamiento+1);

	        //declarar variable, definicion de clase
	        if(obj != null){
	        	_as_addNodoEnArbol(raiz,obj,as_nivelAnidamiento);
	        	switch(obj.tipo){
	        		case "defClase":
	        		case "defMetodo":
	        		case "defFor":
	            		as_nivelAnidamiento += 1;
	        			break;
	        		case "defVariable":
	        		case "asignacionDeValor":
	        		case "defArreglo":
	        		case "asignacionDeValorArray":
	        			

	        	}
	        }else{
	        	//ERROR_SINTACTICO = true;
	        	let error = new ModelArbol();
	        	error.nombre="--> ERROR_SINTACTICO <--"+str;
	        	error.tipo="";
	        	error.nivelAnidamiento=as_nivelAnidamiento+1;
	        	error.parametros.push(lst_token);
	        	_as_addNodoEnArbol(raiz,error,as_nivelAnidamiento);
	        }
	        
	        lst_token = [];
	        isFor = false;
	        isArray = false;
	        str = "";
            str_dev = "";

	    }else if(i.symbol == "RBRACE"  && !isArray){
	        _as_finalizarRama(raiz,as_nivelAnidamiento,i);// tambien disminuye en uno al as_nivelAnidamiento
	       
            lst_token = [];
            isFor = false;
            isArray = false;
            str = "";
            str_dev = "";
	    }


	}
	//*/
	return raiz;

}
function _as_reglasDeProduccion(str, str_dev, arr,nivel){
    //console.log("*********************************************************");
   // console.log(str_dev);
   // console.log(str);
	// RegExp:


	let RE_FOR = /^FOR\s?LPAREN.*SEMICOLON.*SEMICOLON.*RPAREN/;
	let RE_ASIGNACION_DE_VALOR_ARRAY = /(NAME) LBRACK (NAME|BYTE|SHORT|INT|LONG|FLOAT|DOUBLE|BOOLEAN_LITERAL|CHAR|STRING)\s?RBRACK EQ /;

	let strmap            = {};
    let palabrasDev       = "-> "; //contiene los string de la frase solo para ver por consola
    let _RE_              = null;
	let temporalcontador  = 0;

    for(let i of arr){
        palabrasDev += `${i.string} `;
    	if(strmap[i.symbol] == undefined){
			strmap[i.symbol]=i.string;
    	}else{
    		strmap[i.symbol+"_"+temporalcontador]=i.string;
    		temporalcontador+=1;
    	}	
    }
    
   // console.log(palabrasDev)
    //console.log("**************************************")

    let lstParametros = _as_getparametros(arr);

     /*    RECONOCIENDO DEFINICION DE CLASE    */
    if( _RE_ = str.match(RE_DEF_CLASE) ){
       let obj = new ModelArbol(arr,nivel,"defClase");
        obj.nombre = strmap.NAME;
        obj.lineaInicial = arr[0].line;
        return obj; 
    }
    /*    RECONOCIENDO DEFINICION DE METODO    */
    if( _RE_ = str.match(RE_DEF_METODO) ){
    	let obj = new ModelArbol(arr,nivel,"defMetodo");
    	obj.restriccion = _RE_[1]; 
    	obj.static = _RE_[2] ? true:false;
    	obj.retorno = _RE_[3];
    	obj.nombre = strmap.NAME;
    	obj.parametros = lstParametros;    	
        obj.lineaInicial = arr[0].line;
    	return obj;     	
    }
    /*    RECONOCIENDO DECLARACION DE VARIABLES INICIALIZADAS   */
    if( _RE_ = str.match(RE_DEF_VAR_INICIALIZADA) ){

    	let obj = new ModelArbol(arr,-1,"defVariable");//el nivel se coloca en -1 ya q estos no tendran hijos asignados
    	obj.nivelAnidamiento = nivel;//se asigna nivel de anidamiento para que al imprimirlo en consola saber cuanto espacio separarlo
    	obj.restriccion = _RE_[1] || ""; 
    	obj.static = _RE_[2] ? true:false;
    	obj.tipoDeDato = _RE_[3] || "";
    	obj.nombre = strmap.NAME;
		obj.valor = strmap[_RE_[5]];
		obj.valor_tipoDeDato = _RE_[5];
        obj.lineaInicial = arr[0].line;
    	return obj; 
    }
    /*    RECONOCIENDO DECLARACION DE VARIABLES NO INICIALIZADAS   */
    if( _RE_ = str.match(RE_DEF_VAR_NO_INICIALIZADA) ){
        let obj = new ModelArbol(arr,-1,"defVariable");//el nivel se coloca en -1 ya q estos no tendran hijos asignados
        obj.nivelAnidamiento = nivel;//se asigna nivel de anidamiento para que al imprimirlo en consola saber cuanto espacio separarlo
        obj.restriccion = _RE_[1] || ""; 
        obj.static = _RE_[2] ? true:false;
        obj.tipoDeDato = _RE_[3] || "";
        obj.nombre = strmap.NAME;
        obj.valor = "?";
        obj.valor_tipoDeDato = "?";
        obj.lineaInicial = arr[0].line;
        return obj; 
    }
    /*    RECONOCIENDO ASIGNACION DE VALORES A VARIABLES    */
    if( _RE_ = str.match(RE_ASIGNACION_DE_VALOR) ){
    	let obj = new ModelArbol(arr,-1,"asignacionDeValor");//el nivel se coloca en -1 ya q estos no tendran hijos asignados
    	obj.nivelAnidamiento = nivel;//se asigna nivel de anidamiento para que al imprimirlo en consola saber cuanto espacio separarlo
		obj.valor = strmap[_RE_[1]];
		obj.valor_tipoDeDato = _RE_[1];
    	obj.nombre = strmap.NAME;
        obj.lineaInicial = arr[0].line;
        return obj; 
    }
    /*    RECONOCIENDO UN ARRAY TIPO Tipo_de_variable[ ] Nombre_del_array = {};*/
    if( _RE_ = str.match(RE_ARREGLO)){
        let obj = new ModelArbol(arr,-1,"defArreglo");
        obj.nivelAnidamiento = nivel;
        obj.tipoDeDato = _RE_[2];
        obj.nombre = strmap.NAME;
        obj.lineaInicial = arr[0].line;

        obj.hijos = _as_getContenido(arr,obj,nivel+1,obj.tipoDeDato,obj.nombre);
        return obj; 
    }




    /*    RECONOCIENDO UN CICLO FOR    */
    if(RE_FOR.test(str)){
    	let obj = new ModelArbol(arr,nivel,"defFor");
    	obj.parametros = lstParametros;    	
        obj.lineaInicial = arr[0].line;
        return obj; 
    }

    

    /*    RECONOCIENDO ASIGNACION ARRAY TIPO Tipo_de_variable[i]=21;*/
    if(RE_ASIGNACION_DE_VALOR_ARRAY.test(str)){

		let RE_Txt = str.match(RE_ASIGNACION_DE_VALOR_ARRAY);
		//console.log(str,RE_Txt,strmap[RE_Txt[1]],strmap)
    	let obj = new ModelArbol(arr,-1,"asignacionDeValorArray");//el nivel se coloca en -1 ya q estos no tendran hijos asignados
    	obj.nivelAnidamiento = nivel;//se asigna nivel de anidamiento para que al imprimirlo en consola saber cuanto espacio separarlo
		obj.valor = strmap["NAME_1"];
		obj.valor_tipoDeDato = RE_Txt[1];
    	obj.nombre = strmap.NAME;
    	obj.indice = strmap["NAME_0"];// esta propiedad no se ecncuentra en el modelo 
        obj.lineaInicial = arr[0].line;
        return obj; 
    }

    return null;
}

function _as_getparametros(arr){
	let parametros = [];
    let insertinparam = false;
    let lstParametros = [];
    let parametro = [];

    for(let i of arr){
        if(i.symbol == "RPAREN")insertinparam=false;
        if(insertinparam)parametros.push(i);
        if(i.symbol == "LPAREN")insertinparam=true;
    }
    if(parametros.length > 0){
        let y = 0;
        for(let i of parametros){
            y+=1;
            if(i.symbol != "COMMA")
            	parametro.push(i);
            if(i.symbol == "COMMA" || parametros.length == y){
                let modelParametro = new ModelParametro(parametro);
                lstParametros.push(modelParametro);
                parametro=[];
            }
        }
    }
    return lstParametros;
}
function _as_getContenido(arr,padre,nivel,tipoDeDato,nombre){
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
       

        
        let hijo = new ModelArbol(arr,-1,"defVariable");
    	hijo.nivelAnidamiento = nivel;
        hijo.tipoDeDato = tipoDeDato;
        hijo.valor = i;
        hijo.nombre = nombre+`[${y}]`;
        hijo.padre=padre;

        hijo.lineaInicial = 1;
        hijos.push(hijo);

     
 
      	y+=1;
    }
    return hijos;
}

function _as_addNodoEnArbol(padre,hijo,nivel){
    if(padre.nivelAnidamiento_temporal == nivel){
    	hijo.padre=padre;
        padre.hijos.push(hijo);
    }else{
        for(let i of padre.hijos){
            _as_addNodoEnArbol(i,hijo,nivel);
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

function as_imprimirArbol(O_o){
	///*
	if(! ERROR_SINTACTICO){
	    console.log(
	    	"    ".repeat(O_o.nivelAnidamiento),
	
	    	O_o.tipo,
	    	O_o.nombre,
	    	O_o.valor,
	    	O_o.parametros
	    	);
	    for(let i of O_o.hijos){
	        as_imprimirArbol(i);
	    }
	}else{
		console.log("ERROR SINTACTICO")
	}
//*/
}


