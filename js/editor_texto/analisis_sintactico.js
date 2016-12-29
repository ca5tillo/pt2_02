const RE_IS_ARREGLO = /^(BYTE|SHORT|INT|LONG|FLOAT|DOUBLE|BOOLEAN_LITERAL|CHAR|STRING)LBRACKRBRACK/;

const RE_DEF_CLASE  = /^(PUBLIC|PRIVATE)?CLASSNAME(?=LBRACE)/;
const RE_DEF_METODO = /^(PUBLIC|PRIVATE)?(STATIC)?(VOID|BOOLEAN|INT|FLOAT|DOUBLE|STRING)NAMELPAREN.*(?=RPARENLBRACE)/;
const RE_DEF_VAR_INICIALIZADA = /^(VOID|BOOLEAN|INT|FLOAT|DOUBLE|STRING)NAME(EQ)(NUM|CADENA|BOOLEAN_LITERAL)(?=SEMICOLON)/;
const RE_DEF_VAR_NO_INICIALIZADA = /^(VOID|BOOLEAN|INT|FLOAT|DOUBLE|STRING)NAME(?=SEMICOLON)/;
const RE_ASIGNACION_DE_VALOR = /^NAMEEQ(NUM|CADENA|BOOLEAN_LITERAL)(?=SEMICOLON)/;
const RE_ARREGLO = /^(PUBLIC|PRIVATE)?(BYTE|SHORT|INT|LONG|FLOAT|DOUBLE|BOOLEAN_LITERAL|CHAR|STRING)LBRACKRBRACKNAMEEQLBRACE.*(?=RBRACESEMICOLON)/;
const RE_LLAMADA_FUNCION_SIN_PARAMETROS_SIN_RETORNO = /^NAMELPARENRPAREN(?=SEMICOLON)/;
const RE_LLAMADA_FUNCION_CON_PARAMETROS_SIN_RETORNO = /^NAMELPAREN.+RPAREN(?=SEMICOLON)/;

var as_nivelAnidamiento = 0;
function *GenerateID(){
    var i = 0;
    while(true){
        yield i;
        i++;
    }
}
var _generateID = GenerateID();
class ModelParametro{
	constructor(tipo,nombre){
		this.tipo = tipo;
        this.nombre = nombre;
	}

}
class ModelArbol  {
	constructor(
		arr 			 = [], 
		nivelAnidamiento = 0,
		tipo             = "ElementoRaiz"

		){
        this.id                         = _generateID.next().value;
        this.idPadre                    = -1;
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
	let isFor          = false;
	let isArray        = false;
	let raiz           = new ModelArbol();

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
	       
	        
	        lst_token = [];
	        isFor = false;
	        isArray = false;
	        str = "";


	    }else if(i.symbol == "RBRACE"  && !isArray){
            if(! /^RBRACE/.test(str) ){ // Si str contiene algo mas que RBRACE se concidera error 
                let error = new ModelArbol(lst_token,-1,"ERROR_SINTACTICO");//el nivel se coloca en -1 ya q estos no tendran hijos asignados
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

	let strmap            = {};
    let dev_frase         = ""; //contiene los string de la frase solo para ver por consola
    let dev_str           = ""
    let _RE_              = null;
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
       let obj = new ModelArbol(arr,nivel,"defClase");
        obj.nombre = strmap.NAME;
        obj.lineaInicial = arr[0].line;
        return obj; 
    }
    /*    RECONOCIENDO DEFINICION DE METODO                                    */
    if( _RE_ = str.match(RE_DEF_METODO)              ){
    	let obj = new ModelArbol(arr,nivel,"defMetodo");
    	obj.restriccion = _RE_[1]; 
    	obj.static = _RE_[2] ? true:false;
    	obj.retorno = _RE_[3];
    	obj.nombre = strmap.NAME;
    	obj.parametros = _as_getparametros(arr);    	
        obj.lineaInicial = arr[0].line;

    	return obj;     	
    }
    /*    RECONOCIENDO DECLARACION DE VARIABLES INICIALIZADAS                  */
    if( _RE_ = str.match(RE_DEF_VAR_INICIALIZADA)    ){
    	let obj = new ModelArbol(arr,-1,"defVariable");//el nivel se coloca en -1 ya q estos no tendran hijos asignados
    	obj.nivelAnidamiento = nivel;//se asigna nivel de anidamiento para que al imprimirlo en consola saber cuanto espacio separarlo
    	obj.tipoDeDato = _RE_[1] || "";
    	obj.nombre = strmap.NAME;
		obj.valor = strmap[_RE_[3]];
		obj.valor_tipoDeDato = _RE_[3];
        obj.lineaInicial = arr[0].line;
    	return obj; 
    }
    /*    RECONOCIENDO DECLARACION DE VARIABLES NO INICIALIZADAS               */
    if( _RE_ = str.match(RE_DEF_VAR_NO_INICIALIZADA) ){
        let obj = new ModelArbol(arr,-1,"defVariable");//el nivel se coloca en -1 ya q estos no tendran hijos asignados
        obj.nivelAnidamiento = nivel;//se asigna nivel de anidamiento para que al imprimirlo en consola saber cuanto espacio separarlo
        obj.tipoDeDato = _RE_[1] || "";
        obj.nombre = strmap.NAME;
        obj.valor = "?";
        obj.valor_tipoDeDato = "?";
        obj.lineaInicial = arr[0].line;
        return obj; 
    }
    /*    RECONOCIENDO ASIGNACION DE VALORES A VARIABLES                       */
    if( _RE_ = str.match(RE_ASIGNACION_DE_VALOR)     ){
    	let obj = new ModelArbol(arr,-1,"asignacionDeValor");//el nivel se coloca en -1 ya q estos no tendran hijos asignados
    	obj.nivelAnidamiento = nivel;//se asigna nivel de anidamiento para que al imprimirlo en consola saber cuanto espacio separarlo
		obj.valor = strmap[_RE_[1]];
		obj.valor_tipoDeDato = _RE_[1];
    	obj.nombre = strmap.NAME;
        obj.lineaInicial = arr[0].line;
        return obj; 
    }
    /*    RECONOCIENDO UN ARRAY TIPO Tipo_de_variable[ ] Nombre_del_array = {};*/
    if( _RE_ = str.match(RE_ARREGLO)                 ){
        let obj = new ModelArbol(arr,-1,"defArreglo");
        obj.nivelAnidamiento = nivel;
        obj.tipoDeDato = _RE_[2];
        obj.nombre = strmap.NAME;
        obj.valor_tipoDeDato = _RE_[2];
        obj.lineaInicial = arr[0].line;
        obj.hijos = _getContenidoArreglo(arr,obj,nivel+1,obj.tipoDeDato,obj.nombre);
        return obj; 
    }
    /*    RECONOCIENDO LLAMADA A METODO*/
    if( _RE_ = str.match(RE_LLAMADA_FUNCION_SIN_PARAMETROS_SIN_RETORNO)){
        let obj = new ModelArbol(arr,-1,"llamada_funcion_sinparametros_sinretorno");//el nivel se coloca en -1 ya q estos no tendran hijos asignados
        obj.nivelAnidamiento = nivel;//se asigna nivel de anidamiento para que al imprimirlo en consola saber cuanto espacio separarlo
        obj.nombre = strmap.NAME;
        obj.lineaInicial = arr[0].line;
        return obj; 
    }
    /*    RECONOCIENDO LLAMADA A METODO*/
    if( _RE_ = str.match(RE_LLAMADA_FUNCION_CON_PARAMETROS_SIN_RETORNO)){
        let obj = new ModelArbol(arr,-1,"llamada_funcion_conparametros_sinretorno");//el nivel se coloca en -1 ya q estos no tendran hijos asignados
        obj.nivelAnidamiento = nivel;//se asigna nivel de anidamiento para que al imprimirlo en consola saber cuanto espacio separarlo
        obj.nombre = strmap.NAME;
        obj.lineaInicial = arr[0].line;
        obj.envioParametros=_envioParametros(arr);
        
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



    /*    SI NO COINCIDE CON NINGUNA REGLA SE CONSIDERA ERROR       */
    let error = new ModelArbol(arr,-1,"ERROR_SINTACTICO");//el nivel se coloca en -1 ya q estos no tendran hijos asignados
    error.nivelAnidamiento=nivel;
    error.lineaInicial = arr[0].line;
    return error;
}

function _envioParametros(arr){

    let strmap            = {};
    let insertinparam = false;

    let str="";
    let _re;
    let lstParametros = [];


    for(let i of arr){
       // if(i.symbol == "RPAREN")insertinparam=false;
        if(insertinparam){
            
            str     += `${i.symbol}`;
            if(strmap[i.symbol] == undefined)
                strmap[i.symbol]=i.string;

            if( _re = str.match(/^(VOID|BOOLEAN|INT|FLOAT|DOUBLE|STRING|NAME|NUM|CADENA|BOOLEAN_LITERAL)(COMMA|RPAREN)/)){


                let modelParametro = new ModelParametro(_re[1],strmap[_re[1]]);
                lstParametros.push(modelParametro);
                str="";
                strmap={};
            }
          
        

        }
        if(i.symbol == "LPAREN")insertinparam=true;
    }
  
    return lstParametros;
}
function _as_getparametros(arr){

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
       

        
        let hijo = new ModelArbol(arr,-1,"defVariable");
    	hijo.nivelAnidamiento = nivel;
        hijo.tipoDeDato = tipoDeDato;
        hijo.valor = i;
        hijo.nombre = nombre+`[${y}]`;
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

function as_imprimirArbol(O_o){
    console.log(

        O_o.id,
        ",",
        O_o.idPadre,
    	"    ".repeat(O_o.nivelAnidamiento),
    	O_o.tipo,
    	O_o.nombre,
    	O_o.valor,
    	O_o.parametros
    	);
    for(let i of O_o.hijos){
        as_imprimirArbol(i);
    }
}


