var dibujando_generateID = GenerateID();
class Element{
    constructor(){
        this._id            = dibujando_generateID.next().value;
        this._idPadre       = null; // Es el padre directo Ej. si declaro una variable dentro de un for el for es el padre directo
        this._idContenedor  = null; // EJ. si es una variable a que metodo pertenece sin importa si antes pertenece a un for 
        this._children      = [];
        this._name          = "";
        R01._idNodoFinal    = this._id;

        this._element       = new THREE.Group();
        this._graphics      = new THREE.Group();
        this._text          = new THREE.Group();
        this._sons          = new THREE.Group();        
        this._cube          = this._setcube();
        
        this._element.name  = "";
        this._graphics.name = "graphics";
        this._sons.name     = "sons";
        this._text.name     = "text";

        this._graphics.add(this._cube);
        this._graphics.add(this._text);

        this._element.add(this._graphics);
        this._element.add(this._sons);
    }

    set id           (a){  this._id           = a;     }
    set idPadre      (a){  this._idPadre      = a;     }
    set idContenedor (a){  this._idContenedor = a;     }
    set name         (a){  this._name         = a;     }
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
    __setTextPosition_1(indice){
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
    __setTextPosition_2(origen,receptor,textMesh1){
        /* Calcula la posicion origen (desde donde iniciara la animacion)*/
        let WorldPosition_A = new THREE.Vector3(); // El elemento origen "Variable"
        let WorldPosition_B = new THREE.Vector3(); // El elemento receptor "Variable"
        let WorldPosition_C = new THREE.Vector3();

        WorldPosition_A.setFromMatrixPosition ( origen.element.matrixWorld );
        WorldPosition_B.setFromMatrixPosition ( receptor.element.matrixWorld );
             

        WorldPosition_C.x = (textMesh1.position.x - WorldPosition_B.x)+(WorldPosition_A.x);
        WorldPosition_C.y = (textMesh1.position.y - WorldPosition_B.y)+(WorldPosition_A.y);
        WorldPosition_C.z = (textMesh1.position.z - WorldPosition_B.z)+(WorldPosition_A.z);

        return WorldPosition_C;
    }
    _setText( name, indice, txt, siguientePaso, animar, valorAnterior = null){
        let _this           = this;
        let groupText       = this._text;
        let textMesh1       = this.__setText(name,txt).mesh;
        let position_A      = this.__setTextPosition_1(indice);// DESTINO


        if( animar == false){ //si no se desea animar el texto solo aparecera en la pared del cubo
            textMesh1.position.set(position_A.x, position_A.y, position_A.z);    

            if(valorAnterior){
                groupText.remove(valorAnterior);
            }
            if(siguientePaso){
                Main.TriggerNextStep();
            }
        }else{
            textMesh1.position.set(
                -this._element.position.x,
                -this._element.position.y,
                -this._element.position.z
                );     // lo envio al centro del metodo o padre

            let tween = new TWEEN.Tween(textMesh1.position,valorAnterior)
                .to         ({ x:position_A.x, y:position_A.y, z:position_A.z },Controles.getVelocidad())
                .easing     (TWEEN.Easing.Quadratic.In)
                .onStart    ( function (){} )
                .onUpdate   ( function (){} )
                .onComplete ( function (){
                    if(valorAnterior){
                        groupText.remove(valorAnterior);
                    }                            
                    if(siguientePaso){
                        Main.TriggerNextStep();
                    }
                });                    
            tween.start();
        
        }        
    }
    _setText2( name, indice, txt, siguientePaso=false, animar=true, valorAnterior = null, elementoOrigen = null){
        let _this           = this;
        let groupText       = this._text;
        let textMesh1       = this.__setText(name,txt,false).mesh;
        let position_A      = this.__setTextPosition_1(indice);// DESTINO/* Establecer Posicion del texto sobre su cubo */
        let origenPos_X     = elementoOrigen.element.position.x;
        let origenPos_Xi    = origenPos_X - (Config_R01.TAM_GRAL*2);


        let mo =new TWEEN.Tween(elementoOrigen.element.position)
                    .to         ({ x:origenPos_Xi },Controles.getVelocidad())
                    .easing     (TWEEN.Easing.Quadratic.In)
                    .onStart    ( function (){} )
                    .onUpdate   ( function (){} )
                    .onComplete ( function (){
                        let position_B = _this.__setTextPosition_2(elementoOrigen, _this, textMesh1);// Origen
                        textMesh1.position.set(position_B.x, position_B.y, position_B.z);  
                        textMesh1.visible = true;
                    });
        
        let tween = new TWEEN.Tween(textMesh1.position,valorAnterior)
            .to         ({ x:position_A.x, y:position_A.y, z:position_A.z },Controles.getVelocidad())
            .easing     (TWEEN.Easing.Quadratic.In)
            .onStart    ( function (){} )
            .onUpdate   ( function (){} )
            .onComplete ( function (){ if(valorAnterior) groupText.remove(valorAnterior); });    

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
    __cafecitocon_pan(result){
        let _this = this;
        let positionDestino = this.__setTextPosition_1(3);

        let a1 = new TWEEN.Tween(result.mesh.position)
                        .to         (positionDestino,Controles.getVelocidad())
                        .easing     (TWEEN.Easing.Quadratic.In)
                        .onComplete ( function (){
                            _this._text.remove(_this._text.children[2]);

                        }).start();
        console.log("ya es muy tarde y no se que estoy haciendo",this);
    }
    __cafe( textMesh1, position,txt, arr, i, f){
        let _this = this;
        let idPadre         = R01.getIdsAncestros().p;
        let idContenedor    = R01.getIdsAncestros().c;
        let contenedor      = R01.lstElements.getChildrenById(idContenedor);
        let padre           = R01.lstElements.getChildrenById(idPadre);        
        //     let destino         = R01.lstElements.getChildrenById(idContenedor).getChildrenByName(instruccion.destinoName);
        let WorldPosition_A = new THREE.Vector3();

        let text            = null;
        let originalisimo = null;
        if(i > f){ 
            let ante = textMesh1.position.y;
            let nuevoY = ante - Config_R01.TAM_GRAL; 
            let a1 = new TWEEN.Tween(textMesh1.position)
                        .to         ({y:nuevoY},Controles.getVelocidad())
                        .easing     (TWEEN.Easing.Quadratic.In)
                        .onComplete ( function (){
       
                            _this._text.remove(textMesh1);

                            textMesh1 = _this.__setText("value",eval(_this.exp_matematica));
                 
                            textMesh1.mesh.position.set(position.x,nuevoY , position.z);

            let a2 = new TWEEN.Tween(textMesh1.mesh.position)
                        .to         ({y:ante},Controles.getVelocidad())
                        .easing     (TWEEN.Easing.Quadratic.In)
                        .onComplete ( function (){
                            
                            _this.__cafecitocon_pan(textMesh1);

                        }).start();

                        }).start();
            
  

           
            
        }else{
            if(arr[i].symbol && arr[i].symbol == 'NAME'){
                originalisimo = contenedor.getChildrenByName(arr[i].string);     

                WorldPosition_A.setFromMatrixPosition ( originalisimo.element.matrixWorld );
                txt = txt.replace(arr[i].string, originalisimo.value); 
                text            = this.__setText("value",originalisimo.value).mesh;
                let position_B = _this.__setTextPosition_2(originalisimo, _this, text);

                //text.position.set(position_B.x, position_B.y, position_B.z);


let origenPos_X     = originalisimo.element.position.x;
        let origenPos_Xi    = origenPos_X - (Config_R01.TAM_GRAL*2);


let mo =new TWEEN.Tween(originalisimo.element.position)
                    .to         ({ x:origenPos_Xi },Controles.getVelocidad())
                    .easing     (TWEEN.Easing.Quadratic.In)
                    .onStart    ( function (){} )
                    .onUpdate   ( function (){} )
                    .onComplete ( function (){
                        let position_B = _this.__setTextPosition_2(originalisimo, _this, text);// Origen
                        text.position.set(position_B.x, position_B.y, position_B.z); 
                        textMesh1.visible = true;
                    });




                let a1 = new TWEEN.Tween(text.position)
                        .to         (position,Controles.getVelocidad())
                        .easing     (TWEEN.Easing.Quadratic.In)
                        .onComplete ( function (){
                            _this._text.remove(textMesh1);
                            _this._text.remove(text);
                            let pato = _this.__setText("value",txt);

                            pato.geo.center();
                            pato.mesh.position.set(position.x, position.y, position.z);
                            _this.__cafe( pato.mesh, position,txt, arr, i+1, f);
                        });


        let mo2 =new TWEEN.Tween(originalisimo.element.position)
                    .to         ({ x:origenPos_X },Controles.getVelocidad())
                    .easing     (TWEEN.Easing.Quadratic.In)
                    .onStart    ( function (){} )
                    .onUpdate   ( function (){} )
                    .onComplete ( function (){});


                mo.chain(a1);
                a1.chain(mo2);
                mo.start();
            }else if(arr[i].ext == 'ext'){
                text            = this.__setText("value",arr[i].string).mesh;
                text.position.set(position.x, position.y-Config_R01.TAM_GRAL, position.z);
                txt += arr[i].string;
                let a1 = new TWEEN.Tween(text.position)
                        .to         (position,Controles.getVelocidad())
                        .easing     (TWEEN.Easing.Quadratic.In)
                        .onComplete ( function (){
                            _this._text.remove(textMesh1);
                            _this._text.remove(text);
                            let pato = _this.__setText("value",txt);

                            pato.geo.center();
                            pato.mesh.position.set(position.x, position.y, position.z);
                            _this.__cafe( pato.mesh, position,txt, arr, i+1, f);
                        }).start();
            }else{

                _this.__cafe( textMesh1, position,txt, arr, i+1, f);
            }
        
        }

        //a1.start();
    }
    _setText3(txt, padre, expresion){
        let _this           = this;

        let text            = this.__setText("value",txt);
        let textMesh1       = text.mesh;
        let textGeo         = text.geo;

        let position_B      = this.__setTextPosition_2(padre, this, textMesh1);// Origen
        textGeo.center();
        textMesh1.position.set(position_B.x, position_B.y, position_B.z);

        let pos1 = textMesh1.position.y + Config_R01.TAM_GRAL;

        let a1 = new TWEEN.Tween(textMesh1.position)
                    .to         ({ y:pos1 },Controles.getVelocidad())
                    .easing     (TWEEN.Easing.Quadratic.In)
                    .onComplete ( function (){
                        _this.__cafe( textMesh1, textMesh1.position, txt, expresion, 0, expresion.length-1);
                    });

        a1.start();


        /*
        let centerOffset = -0.5 * ( textGeo.boundingBox.max.x - textGeo.boundingBox.min.x );
        textMesh1.position.x = centerOffset;
        //*/
        //textMesh1.position.set(position_A.x, position_A.y, position_A.z);  

    }
    getSonByIndex(index){

        return this._sons.children[index];    
    }
    setTextType (txt, siguientePaso=false, animar=false){
        
        this._setText("type",  1, txt, siguientePaso, animar, null);
    }
    setTextName (txt, siguientePaso=false, animar=false){

        this._setText("name",  2, txt, siguientePaso, animar, null);
    }
    setTextValue(txt, siguientePaso=false, animar=false){
        let valorAnterior = this._text.getObjectByName("value") || null;
        this._setText("value", 3, txt, siguientePaso, animar, valorAnterior);
    }
    setTextValueParam(txt, origen, siguientePaso=false, animar=true){
        let valorAnterior = this._text.getObjectByName("value");
        this._setText2("value", 3, txt, siguientePaso, animar, valorAnterior, origen);
    }
    getChildrenByName(name, profundidad = false){
        // http://jsfiddle.net/dystroy/MDsyr/
        // Retorna la primera coincidencia
        let getSubMenuItem = function (subMenuItems, name) {
            if (subMenuItems) {
                for (let i = 0; i < subMenuItems.length; i++) {
                    if (subMenuItems[i].name == name) {
                        return subMenuItems[i];
                    };
                    if(profundidad){
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

}