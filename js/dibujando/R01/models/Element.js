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
    _setText( name, indice, txt, siguientePaso, animar, valorAnterior = null){
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

        groupText.add(textMesh1);


        // Es el tamaño real del cubo operando por su escala 
        let tam   = this._cube.geometry.parameters;//depth,height,width
        let scale = this._cube.scale;//x, y , z
        let x     = tam.width  * scale.x;
        let y     = tam.height * scale.y; 
        let z     = tam.depth  * scale.z; 

        // Destino del texto sobre su cubo (realizo x/2 para obtener la distancia del centro a la orilla despues le sumo un margen para q no quede al raz del cubo)
        let xi = -(x/2)+Config_R01.TAM_GRAL/25;
        let yi = (y/2)-(Config_R01.TAM_GRAL/5)*indice;
        let zi = z/2;

        // Cambiamos la posicion del texto
        if( animar == false){ //si no se desea animar el texto solo aparecera en la pared del cubo
            textMesh1.position.set(xi, yi, zi);    

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
                .to         ({ x:xi, y:yi, z:zi },Controles.getVelocidad())
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
        // _setText2 NACE PARA AGREGAR EL VALUE A LAS VARIABLES Q SE PASAN COMO PARAMETROS
        let element   = this._element;
        let cube      = this._cube;
        let texto     = this._text;
        let loader    = new THREE.FontLoader();
        let textMesh1;

        loader.load( 'lib/three-js/examples/fonts/optimer_bold.typeface.json', function ( response ) {
                let material = new THREE.MultiMaterial( [
                    new THREE.MeshPhongMaterial( { color: 0xffffff, shading: THREE.FlatShading } ), // front
                    new THREE.MeshPhongMaterial( { color: 0xffffff, shading: THREE.SmoothShading } ) // side
                ] );
                let textGeo = new THREE.TextGeometry( txt, {
                    font: response,
                    size: Config_R01.TAM_GRAL/6,
                    height: (Config_R01.TAM_GRAL/20)/2
                });
                textGeo.computeBoundingBox();
                textGeo.computeVertexNormals();

                textMesh1         = new THREE.Mesh( textGeo, material );
                textMesh1.name    = name;
                textMesh1.visible = true;

                texto.add(textMesh1);  

                // Es el tamaño real del cubo operando por su escala 
                let tam   = cube.geometry.parameters;//depth,height,width
                let scale = cube.scale;//x, y , z
                let x     = tam.width*scale.x;
                let y     = tam.height*scale.y; 
                let z     = tam.depth*scale.z; 

                // Destino del texto sobre su cubo (realizo x/2 para obtener la distancia del centro a la orilla despues le sumo un margen para q no quede al raz del cubo)
                let xi = -(x/2)+Config_R01.TAM_GRAL/25;
                let yi = (y/2)-(Config_R01.TAM_GRAL/5)*indice;
                let zi = z/2;

               
                textMesh1.position.set(
                    0 - Config_R01.TAM_GRAL*2 ,
                    0 - element.position.y - Config_R01.TAM_GRAL*2 + elementoOrigen.position.y,
                    0 - Config_R01.TAM_GRAL*2 
                    );     // lo envio al centro del metodo o padre

                let tween = new TWEEN.Tween(textMesh1.position,valorAnterior)
                    .to         ({ x:xi, y:yi, z:zi },Controles.getVelocidad())
                    .easing     (TWEEN.Easing.Quadratic.In)
                    .onStart    ( function (){} )
                    .onUpdate   ( function (){} )
                    .onComplete ( function (){
                        if(valorAnterior){
                            texto.remove(valorAnterior);
                        }                            
                        if(siguientePaso){
                            if(Main.esAnimacionFluida){
                                Main.pasoApaso();
                            }else{
                                Controles.activar__botones();
                            }
                        }
                    });                    
                tween.start();
                
          

                                          
            });// ./loader.load({})
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
        let valorAnterior = this._text.getObjectByName("value");
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