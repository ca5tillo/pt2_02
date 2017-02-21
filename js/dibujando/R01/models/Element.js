class Element{
    constructor(){
        this._id            = dibujando_generateID.next().value;
        this._idPadre       = null; // Es el padre directo Ej. si declaro una variable dentro de un for el for es el padre directo
        this._idContenedor  = null; // EJ. si es una variable a que metodo pertenece sin importa si antes pertenece a un for 
        this._children      = [];   // Contienen los objetos creados con los modelos


        this._element       = new THREE.Group(); // Es el 3D de este objeto
        this._graphics      = new THREE.Group(); // Es el 3D de este objeto
        this._text          = new THREE.Group(); // Es el 3D de este objeto
        this._sons          = new THREE.Group(); // contiene los 3D de cada hijo        
        this._cube          = this._setcube();
        
        this._element.name  = "";
        this._graphics.name = "graphics";
        this._sons.name     = "sons";
        this._text.name     = "text";

        this._graphics.add(this._cube);
        this._graphics.add(this._text);

        this._element.add(this._graphics);
        this._element.add(this._sons);

        this._type                  = null;
        this._name                  = null;  
        this._value                 = null;
    }

    set id           (a){  this._id           = a;     }
    set idPadre      (a){  this._idPadre      = a;     }
    set idContenedor (a){  this._idContenedor = a;     }
    set type         (a){  this._type         = a;     }
    set name         (a){  this._name         = a;     }
    set value        (a){  this._value        = a;     }
    get id           ( ){  return this._id;            }
    get idPadre      ( ){  return this._idPadre;       }
    get idContenedor ( ){  return this._idContenedor;  }
    get children     ( ){  return this._children;      }
    get name         ( ){  return this._name;          }
    get element      ( ){  return this._element;       }
    get graphics     ( ){  return this._graphics;      }
    get text         ( ){  return this._text;          }
    get sons         ( ){  return this._sons;          }
    get cube         ( ){  return this._cube;          }
    get type         ( ){  return this._type;          }
    get name         ( ){  return this._name;          }
    get value        ( ){  return this._value;         }

    _setcube(){
        var geo = new THREE.BoxGeometry(Config_R01.TAM_GRAL, Config_R01.TAM_GRAL, Config_R01.TAM_GRAL);
        //var mat = new THREE.MeshPhongMaterial({color: 'green',map: mapBg3, transparent:true, opacity:0,visible:false});
        var mat = new THREE.MeshPhongMaterial({map: R01_utileria.metodo.texture, transparent:true, opacity:0,visible:false});


        var malla = new THREE.Mesh(geo, mat);

        malla.castShadow = true;
        malla.receiveShadow = true;
        malla.name = "my_geometria";

        return malla;
    }
    __setText(name,txt,visible = true){//crea e inserta en escena el texto en posicion 0,0,0
        /* Create Texto */    
            let groupText       = this._text;
            let size            = 70;
            let height          = 20;
            let curveSegments   = 4;
            let bevelThickness  = 2;
            let bevelSize       = 1.5;
            let bevelEnabled    = false;// este valor en true para fuentes muy pequeñas (size) se distorciona el texto

            let textGeo = new THREE.TextGeometry( txt, {
                font: R01_utileria.font.font,
                size: size,
                height: height,
                ///*
                size: Config_R01.TAM_GRAL/6,
                height: (Config_R01.TAM_GRAL/20)/2,
                //*/
                curveSegments: curveSegments,
                bevelThickness: bevelThickness,
                bevelSize: bevelSize,
                bevelEnabled: bevelEnabled,
                material: 0,
                extrudeMaterial: 1
            });
            //textGeo.center();
            textGeo.computeBoundingBox();
            textGeo.computeVertexNormals();

            let material = new THREE.MultiMaterial([
                new THREE.MeshPhongMaterial( { color: 0xffffff, shading: THREE.FlatShading   } ), // front
                new THREE.MeshPhongMaterial( { color: 0xffffff, shading: THREE.SmoothShading } )  // side
            ]);
            
            if ( ! bevelEnabled ) {
                /*
                "Fijar" las normales laterales eliminando la componente z de las normales 
                para las caras laterales (esto no funciona bien para la geometría biselada 
                ya que entonces perdemos una curvatura agradable alrededor del eje z)
                */

                let triangleAreaHeuristics = 0.1 * ( height * size );

                for ( let i = 0; i < textGeo.faces.length; i ++ ) {

                    let face = textGeo.faces[ i ];

                    if ( face.materialIndex == 1 ) {

                        for ( let j = 0; j < face.vertexNormals.length; j ++ ) {

                            face.vertexNormals[ j ].z = 0;
                            face.vertexNormals[ j ].normalize();

                        }

                        let va = textGeo.vertices[ face.a ];
                        let vb = textGeo.vertices[ face.b ];
                        let vc = textGeo.vertices[ face.c ];

                        let s = THREE.GeometryUtils.triangleArea( va, vb, vc );

                        if ( s > triangleAreaHeuristics ) {

                            for ( let j = 0; j < face.vertexNormals.length; j ++ ) {

                                face.vertexNormals[ j ].copy( face.normal );

                            }

                        }

                    }

                }
            }// ./ if ( ! bevelEnabled ) 

            let textMesh1     = new THREE.Mesh( textGeo, material );
            textMesh1.name    = name;
            textMesh1.visible = visible; //valor booleano
            textMesh1.string  = txt;

            groupText.add(textMesh1);
            return {mesh:textMesh1,geo:textGeo};
        /* FIN Create Texto */      
    }
    __getTextPosition_1(indice){
        /* Establecer Posicion del texto sobre su cubo */
            // Es el tamaño real del cubo operando por su escala 
            let tam       = this._cube.geometry.parameters;//depth,height,width
            let scale     = this._cube.scale;//x, y , z
            let x         = tam.width  * scale.x;
            let y         = tam.height * scale.y; 
            let z         = tam.depth  * scale.z; 

            // Destino del texto sobre su cubo (realizo x/2 para obtener la distancia del centro a la orilla despues le sumo un margen para q no quede al raz del cubo)
            let xi        = -(x/2)+Config_R01.TAM_GRAL/25;
            let yi        = (y/2)-(Config_R01.TAM_GRAL/5)*indice;
            let zi        = z/2;
            let position  = {x:xi,y:yi,z:zi};
            return position;
        /* FIN Establecer Posicion del texto sobre su cubo */
    }
    __getTextPosition_2(origen,receptor){
        /* Calcula la posicion origen (desde donde iniciara la animacion)*/
        let WorldPosition_A = new THREE.Vector3(); // El elemento origen "Variable"
        let WorldPosition_B = new THREE.Vector3(); // El elemento receptor "Variable"
        let WorldPosition_C = new THREE.Vector3();

        WorldPosition_A.setFromMatrixPosition ( origen.element.matrixWorld );
        WorldPosition_B.setFromMatrixPosition ( receptor.element.matrixWorld );
             

        WorldPosition_C.x = (0 - WorldPosition_B.x)+(WorldPosition_A.x);
        WorldPosition_C.y = (0 - WorldPosition_B.y)+(WorldPosition_A.y);
        WorldPosition_C.z = (0 - WorldPosition_B.z)+(WorldPosition_A.z);

        return WorldPosition_C;
    }
    _setText( name, indice, txt){
        let _this           = this;
        let groupText       = this._text;
        let textMesh1       = this.__setText(name,txt).mesh;
        let position_A      = this.__getTextPosition_1(indice);// DESTINO
        textMesh1.position.set(position_A.x, position_A.y, position_A.z);       
    }
    _setText2( name, indice, txt, siguientePaso=false, elementoOrigen = null){
        /* Para crear el paso de parametros */
        let _this           = this;
        let groupText       = this._text;
        let textMesh1       = this.__setText(name,txt,false).mesh;
        let position_A      = this.__getTextPosition_1(indice);// DESTINO/* Establecer Posicion del texto sobre su cubo */
        let origenPos_X     = elementoOrigen.element.position.x;
        let origenPos_Xi    = origenPos_X - (Config_R01.TAM_GRAL*2);


        let mo =new TWEEN.Tween(elementoOrigen.element.position)
                    .to         ({ x:origenPos_Xi },Controles.getVelocidad())
                    .easing     (TWEEN.Easing.Quadratic.In)
                    .onStart    ( function (){} )
                    .onUpdate   ( function (){} )
                    .onComplete ( function (){
                        let position_B = _this.__getTextPosition_2(elementoOrigen, _this);// Origen
                        textMesh1.position.set(position_B.x, position_B.y, position_B.z);  
                        textMesh1.visible = true;
                    });
        
        let tween = new TWEEN.Tween(textMesh1.position)
            .to         ({ x:position_A.x, y:position_A.y, z:position_A.z },Controles.getVelocidad())
            .easing     (TWEEN.Easing.Quadratic.In)
            .onStart    ( function (){} )
            .onUpdate   ( function (){} )
            .onComplete ( function (){ 
                let value = _this.text.children[2] || null;
                if(value) _this.text.remove(value);
                _this.value=textMesh1.string; 
            });    

        let mo2 =new TWEEN.Tween(elementoOrigen.element.position)
                    .to         ({ x:origenPos_X },Controles.getVelocidad())
                    .easing     (TWEEN.Easing.Quadratic.In)
                    .onStart    ( function (){} )
                    .onUpdate   ( function (){} )
                    .onComplete ( function (){ if(siguientePaso) Main.TriggerNextStep();});


        mo.chain(tween);
        tween.chain(mo2);               
        mo.start();                          
    }
    _eval_2(arr){
        /* Remplazara todo el texto sobre la mesa con el valor final (resultado) */
        /* se juega con tres valores de value en textos (el q se encuentra en el elemento,
        el que esta sobre la mesa y el que llegara a fusionarse con el de la sobre mesa) 
        type  -> [0]
        name  -> [1]
        value -> [2]
        val2  -> [3]
        val3  -> [4] 
        */  
        let _this             = this;
        let value_1           = this.text.children[2] || null;
        let value_2           = this.text.children[3] || null;
        let padre             = R01.lstElements.getChildrenById(R01.getIdsAncestros().p);
        let pos_mesa          = this.__getTextPosition_2(padre, this);// dentro de la mesa 
            pos_mesa.y       += Config_R01.TAM_GRAL;// sobre de la mesa
        let position_destino  = this.__getTextPosition_1(3);
        /* Es el resultado (valor final) */
        let value             = arr[arr.length-1].string;
        let pato = _this.__setText("value",value);
            pato.mesh.position.set(pos_mesa.x, pos_mesa.y, pos_mesa.z); // Sobre la mesa 
                        
        if(value_2){
            _this.text.remove(value_2);
        }
        /* Llevar el texto a su posicion destino */
        new TWEEN.Tween(pato.mesh.position)
            .to         (position_destino, Controles.getVelocidad()).easing(TWEEN.Easing.Quadratic.In)
            .onComplete ( function (){    
                
                _this.text.remove(value_1);
                _this.value = value;

                Main.TriggerNextStep();                  
                
            }).start();
    }
    _eval_return(arr){
        /* Remplazara todo el texto sobre la mesa con el valor final (resultado) */
        /* se juega con tres valores de value en textos (el q se encuentra en el elemento,
        el que esta sobre la mesa y el que llegara a fusionarse con el de la sobre mesa) 
        type  -> [0]
        name  -> [1]
        value -> [2]
        val2  -> [3]
        val3  -> [4] 
        */  
        let _this             = this;
        let value_1           = this.text.children[2] || null;
        let value_2           = this.text.children[3] || null;
        let padre             = R01.lstElements.getChildrenById(R01.getIdsAncestros().p);
        let pos_mesa          = this.__getTextPosition_2(padre, this);// dentro de la mesa 
            pos_mesa.y       += Config_R01.TAM_GRAL;// sobre de la mesa
        let position_destino  = this.__getTextPosition_1(3);
        /* Es el resultado (valor final) */
        let value             = arr[arr.length-1].string;
        let pato = _this.__setText("value",value);
            pato.mesh.position.set(pos_mesa.x, pos_mesa.y, pos_mesa.z); // Sobre la mesa 
                        
        if(value_2){
            _this.text.remove(value_2);
        }
        /* Llevar el texto a su posicion destino */
        R01.MethodOut();
        let a = new TWEEN.Tween({x:0}).to({x:20},Controles.getVelocidad()).easing(TWEEN.Easing.Quadratic.In);
        let b = new TWEEN.Tween(pato.mesh.position)
            .to         (position_destino, Controles.getVelocidad())
            .easing     (TWEEN.Easing.Quadratic.In)
            .onComplete ( function (){    
                _this.text.remove(value_1);
                _this.value = value;
                // no se da la indicacion del siguiente habilitar los botones 
                // ya que esa orden la ejecuta el R01.MethodOut();
            });
        a.chain(b);
        a.start();
    }
    _evaluacion(arr, i, f, regla){
        /* Realiza operaciones sobre la mesa de trabajo actual */
        /*
            recibe un array de obj tipo 
            [
                {symbol: 'NAME', string:instruccion.name},
                {ext:'ext',string:value} 
            ]
        */
        let _this           = this;
        let idPadre         = R01.getIdsAncestros().p;
        let idContenedor    = R01.getIdsAncestros().c;
        let contenedor      = R01.lstElements.getChildrenById(idContenedor);
        let padre           = R01.lstElements.getChildrenById(idPadre);

        let pos_mesa        = this.__getTextPosition_2(padre, this);// dentro de la mesa 
        pos_mesa.y         += Config_R01.TAM_GRAL;// sobre de la mesa

        /* Coloca el value de una variable sobre la mesa fusionandolo con el que ya se encuentra sobre la mesa */
        if(i <= f){
            if(arr[i].symbol && arr[i].symbol == 'NAME'){
                /* Busco la variable */
                let variable      = contenedor.getChildrenByName(arr[i].string);
                /* Guardo posicion actual del elemento origen (variable) */
                let origenPos_X   = variable.element.position.x; 
                /* Muevo elemento origen a la izquierda (variable) */
                let origenPos_Xi  = origenPos_X - (Config_R01.TAM_GRAL*2);
                /* Creo el texto con con el value del origen y visibilidad false */
                let __a           = this.__setText("value",variable.value,false).mesh;

                /* Animar a la Izquierda */
                let varIzq = new TWEEN.Tween(variable.element.position)
                    .to         ({ x:origenPos_Xi }, Controles.getVelocidad()).easing(TWEEN.Easing.Quadratic.In)
                    .onComplete ( function (){
                        /* Pido la nueva posicion de elemento origen (variable) */
                        let position_B = _this.__getTextPosition_2(variable, _this);
                        /* Cambio la posicion del texto pa colocarlo dentro del elemento origen */
                        /* Aunque en realidad el texto no pertenece a ese elemento por eso lo cambio de posicion */
                        __a.position.set(position_B.x, position_B.y, position_B.z); 
                        __a.visible = true;
                    });
                /* Animar texto */
                let txtPos = new TWEEN.Tween(__a.position)
                    .to         (pos_mesa, Controles.getVelocidad()).easing(TWEEN.Easing.Quadratic.In)
                    .onComplete ( function (){
                        /* se juega con tres valores de value en textos (el q se encuentra en el elemento,
                        el que esta sobre la mesa y el que llegara a fusionarse con el de la sobre mesa) 
                        type  -> [0]
                        name  -> [1]
                        value -> [2]
                        val2  -> [3]
                        val3  -> [4] 
                        */
                        /* pregunta por val3 porq esta oensado en que el primer elemento sea la expresion */
                        let value_2     = _this.text.children[3] || null;
                        let value_3     = _this.text.children[4] || null;
                        /* Si no existe value_3 solo dejara sobre la mesa el texto que se mueve actualmente si fucionar texto*/
                        if(value_3){// si existe "fusionara" el texto 
                            /* Obtengo el texto de val2 */
                            let string = value_2.string;
                            /* Remplazo en nombre del origen con el valor de val3 quien contiene el value del origen */
                            string = string.replace(arr[i].string, value_3.string);
                            /* Remuevo textos */
                            _this.text.remove(value_2);
                            _this.text.remove(value_3);

                            /* Creo un nuevo texto con el texto ya remplazado */
                            let pato = _this.__setText("value",string);
                            pato.mesh.position.set(pos_mesa.x, pos_mesa.y, pos_mesa.z);
                            /* Coloco el pibote en el centro del texto  */
                            pato.geo.center();
                        }
                        _this._evaluacion( arr, i+1, f, regla);
                    });
                /* Animar a la derecha */
                let varDer = new TWEEN.Tween(variable.element.position)
                    .to         ({ x:origenPos_X }, Controles.getVelocidad())
                    .easing     (TWEEN.Easing.Quadratic.In);
                
                /* Si la variable origen es la misma q la asignacion 
                NO se animara a derecha e izquierda ya que esto mueve el texto por ser parte de su grupo  */
                if(_this.name == variable.name){
                    let position_B = _this.__getTextPosition_2(variable, _this);
                        __a.position.set(position_B.x, position_B.y, position_B.z); 
                        __a.visible = true;
                    txtPos.start();                       
                }else{                    
                    varIzq.chain(txtPos);
                    txtPos.chain(varDer);
                    varIzq.start();            
                }
            }
            else if(arr[i].ext == 'ext'){
                /* Creo un texto con visibilidad en false */
                let _a = this.__setText("value",arr[i].string,false);
                /* Coloco el pibote en el centro del texto  */
                    _a.geo.center();
                let __a = _a.mesh;
                /* coloco el texto dentro de la mesa */
                    __a.position.set(pos_mesa.x, pos_mesa.y-Config_R01.TAM_GRAL, pos_mesa.z);
                    __a.visible = true;
                /* Animar texto para colocarlo sobre la mesa */
                new TWEEN.Tween(__a.position)
                    .to         ({y:pos_mesa.y},Controles.getVelocidad())
                    .easing     (TWEEN.Easing.Quadratic.In)
                    .onComplete ( function (){                            
                        let value_2     = _this.text.children[3] || null;
                        let value_3     = _this.text.children[4] || null;
                        if(value_3){ // si existe "fusionara" el texto 
                            let string = value_2.string + " "+value_3.string;
                            _this.text.remove(value_2);
                            _this.text.remove(value_3);

                            let pato = _this.__setText("value",string);

                            pato.mesh.position.set(pos_mesa.x, pos_mesa.y, pos_mesa.z);
                            pato.geo.center();

                        }
                        _this._evaluacion( arr, i+1, f, regla);
                    }).start();
            }
            else{
                /* Si no es una variable o un texto podria ser un simbolo de + o - 
                en ese caso solo pasa al siguiente indice.
                el arreglo puede tener esos simbolos porque solo la lista de tokens directamente
                lo que le paso a esta funcion
                 */
                _this._evaluacion( arr, i+1, f, regla);
            }
        }
        else if(i == f+1){
            /* Remplazara todo el texto sobre la mesa con el valor final (resultado) */
            /* Esto me da una pausa antes de remplazar todo el texto por el resultado */
            new TWEEN.Tween({x:0})
                .to         ({x:10},Controles.getVelocidad()/3)
                .easing     (TWEEN.Easing.Quadratic.In)
                .onComplete ( function (){
                    _this[regla](arr); 
                }).start();            
        }
    }
    getSonByIndex(index){

        return this._sons.children[index];    
    }
    setTextType (txt){
        let type = this.text.children[0] || null;
        if(type) this.text.remove(type);
        
        this._setText("type",  1, txt);
    }
    setTextName (txt){
        let name = this.text.children[1] || null;
        if(name) this.text.remove(name);
        this._setText("name",  2, txt);
    }
    setTextValue(txt){
        let value = this.text.children[2] || null;
        if(value) this.text.remove(value);
        this._setText("value", 3, txt);
    }
    setTextValueParam(txt, origen, siguientePaso=false){
        
        this._setText2("value", 3, txt, siguientePaso, origen);
    }
    asignacion0(arr){
        // no mueve el valor de resultado desde dento de la mesa 
        this._evaluacion(arr, 0, arr.length-2,'_eval_2');
    }
    asignacion(arr){
        // mueve el resultado desde dentro de la mesa -- pensado para que represente el simbolo de = y el resultado
        this._evaluacion(arr, 0, arr.length-1,'_eval_2');
    }
    retornar(arr){

        this._evaluacion(arr, 0, arr.length-2, '_eval_return');
    }
    getChildrenByName(name){
        // http://jsfiddle.net/dystroy/MDsyr/
        // Retorna la primera coincidencia
        let getSubMenuItem = function (subMenuItems, name) {
            if (subMenuItems) {
                for (let i = 0; i < subMenuItems.length; i++) {
                    if (subMenuItems[i].name == name) {
                        return subMenuItems[i];
                    };
                    if(true){
                        let found = getSubMenuItem(subMenuItems[i].children, name);
                        if (found) return found;
                    }
                }
            }
        };

        let searchedItem = getSubMenuItem(this._children, name) || null;
        return searchedItem;
    }
    getChildrenById(id){
        // http://jsfiddle.net/dystroy/MDsyr/
        // Retorna la primera coincidencia
        let getSubMenuItem = function (subMenuItems, id) {
            if (subMenuItems) {
                for (let i = 0; i < subMenuItems.length; i++) {
                    if (subMenuItems[i].id == id) {
                        return subMenuItems[i];
                    };
                    let found = getSubMenuItem(subMenuItems[i].children, id);
                    if (found) return found;
                
                }
            }
        };
        let searchedItem = getSubMenuItem(this._children, id) || null;
        return searchedItem;
    }
    add(element){
        this.children.push(element); // añade al arbol 
        this.sons.add(element.element); // añade a la escena
    }

}