var AS = {
    node:null, // Es el arbol generado por "JavaParser.parse"
    err:false, // Si "JavaParser.parse" detecta un error esto se vuelve true
    omitir:["location"], // Elementos que son omitidos al momento de colocarles un ID a los nodos
    run               : function(){
        try{//<<#8>>
            this.err  = false;
            this.node = JavaParser.parse(Editor.java.value);
            //this.node = parser.parse(Editor.java.value);
            
            
            this.setIDs(); 
        }catch(e){
            this.err  = true;
            this.node = this.buildErrorMessage(e);
        }
    },
    buildErrorMessage : function(e){
        return e.location !== undefined
          ? "Line " + e.location.start.line + ", column " + e.location.start.column + ": " + e.message
          : e.message;
    },
    setIDs            : function(obj = this.node, id = null){
        if( obj != null && typeof obj === 'object' && ! Array.isArray(obj)   ){
                obj.my_id       = AS_generateID.next().value;
                obj.my_idParent = id;
                id              = obj.my_id; 
        }
        for( let attr in obj ){
            if(typeof obj[attr] === 'object' && obj[attr] != null && ! AS.omitir.includes( attr ) ){
                this.setIDs( obj[attr], id  );
            }
        }
    },
    find              : function(condicion, obj = this.node){
        //<<#10>>
        for( let attr in obj ){
            if( condicion(attr, obj) ) return obj;
            if(typeof obj[attr] === 'object'){
               let found = this.find(condicion, obj[attr]);
               if (found) return found;
            }
        }
        return null;
    },
    filter            : function(condicion, obj = this.node){
        let _find = function(condicion, obj){
            for( let attr in obj ){
                if( condicion(attr, obj) )
                    arr.push(obj);
                if(typeof obj[attr] === 'object')
                   _find(condicion, obj[attr]);
            }
        };
        let arr = [];
        _find(condicion, obj);
        return (arr.length > 0) ? arr:null;
    }
}
