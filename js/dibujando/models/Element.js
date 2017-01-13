var dibujando_generateID = GenerateID();
class Element{
    constructor(){
        this._id            = dibujando_generateID.next().value;
        this._idPadre       = null; // Es el padre directo Ej. si declaro una variable dentro de un for el for es el padre directo
        this._idContenedor  = null; // EJ. si es una variable a que metodo pertenece sin importa si antes pertenece a un for 
        this._children      = [];
        this._name          = "";
        idNodoFinal         = this._id;

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

    get id(){
        return this._id; 
    }
    set id(id){
        this._id = id;
    }
    get idPadre(){
        return this._idPadre; 
    }
    set idPadre(idPadre){
        this._idPadre = idPadre;
    }
    get idContenedor(){
        return this._idContenedor;
    }
    set idContenedor(idContenedor){
        this._idContenedor = idContenedor;
    }
    get children(){
        return this._children; 
    }
    get name(){
        return this._name;  
    }
    set name(name){
        this._name = name;
    }
    get element(){
        return this._element;  
    }
    get graphics(){
        return this._graphics;  
    }
    get text(){
        return this._text; 
    }
    get sons(){
        return this._sons;    
    }
    get cube(){
        return this._cube;
    }

    _setcube(){
        var geo = new THREE.BoxGeometry(TAM_GRAL, TAM_GRAL, TAM_GRAL);
        var mat = new THREE.MeshPhongMaterial({color: 'green', transparent:true, opacity:0,visible:false});
        var malla = new THREE.Mesh(geo, mat);

        malla.castShadow = true;
        malla.receiveShadow = true;
        malla.name = "my_geometria";

        return malla;
    }
    _setText( name, indice, txt, siguientePaso=false, animar=true, valorAnterior = null){
        let element   = this._element;
        let cube      = this._cube;
        let texto     = this._text;
        let loader    = new THREE.FontLoader();
        let textMesh1;

        loader.load( 'lib/three-js/examples/fonts/optimer_bold.typeface.json', function ( response ) {
                let material = new THREE.MultiMaterial( [
                    new THREE.MeshPhongMaterial( { color: 0xffffff, shading: THREE.FlatShading   } ), // front
                    new THREE.MeshPhongMaterial( { color: 0xffffff, shading: THREE.SmoothShading } ) // side
                ] );

                let textGeo = new THREE.TextGeometry( txt, {
                    font: response,
                    size: TAM_GRAL/6,
                    height: TAM_GRAL/20
                });
                //textGeo.center();
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
                let xi = -(x/2)+TAM_GRAL/25;
                let yi = (y/2)-(TAM_GRAL/5)*indice;
                let zi = z/2;

                // Cambiamos la posicion del texto
                if( ! animar){ //si no se desea animar el texto solo aparecera en la pared del cubo
                    textMesh1.position.set(xi, yi, zi);    
                    if(siguientePaso){
                        if(esAnimacionFluida){
                            btn_pasoApaso();
                        }else{                            
                            ctrl_fun_Activa__PorPaso();                            
                        }
                    }
                }else{
                    textMesh1.position.set(
                        -element.position.x,
                        -element.position.y,
                        -element.position.z
                        );     // lo envio al centro del metodo o padre

                    let tween = new TWEEN.Tween(textMesh1.position,valorAnterior)
                        .to         ({ x:xi, y:yi, z:zi },velocidad)
                        .easing     (TWEEN.Easing.Quadratic.In)
                        .onStart    ( function (){} )
                        .onUpdate   ( function (){} )
                        .onComplete ( function (){
                            if(valorAnterior){
                                texto.remove(valorAnterior);
                            }                            
                            if(siguientePaso){
                                if(esAnimacionFluida){
                                    btn_pasoApaso();
                                }else{
                                    ctrl_fun_Activa__PorPaso();
                                }
                            }
                        });                    
                    tween.start();
                
                }

                                          
            });// ./loader.load({})
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
                    size: TAM_GRAL/6,
                    height: TAM_GRAL/20
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
                let xi = -(x/2)+TAM_GRAL/25;
                let yi = (y/2)-(TAM_GRAL/5)*indice;
                let zi = z/2;

               
                textMesh1.position.set(
                    0 - TAM_GRAL*2 ,
                    0 - element.position.y - TAM_GRAL*2 + elementoOrigen.position.y,
                    0 - TAM_GRAL*2 
                    );     // lo envio al centro del metodo o padre

                let tween = new TWEEN.Tween(textMesh1.position,valorAnterior)
                    .to         ({ x:xi, y:yi, z:zi },velocidad)
                    .easing     (TWEEN.Easing.Quadratic.In)
                    .onStart    ( function (){} )
                    .onUpdate   ( function (){} )
                    .onComplete ( function (){
                        if(valorAnterior){
                            texto.remove(valorAnterior);
                        }                            
                        if(siguientePaso){
                            if(esAnimacionFluida){
                                btn_pasoApaso();
                            }else{
                                ctrl_fun_Activa__PorPaso();
                            }
                        }
                    });                    
                tween.start();
                
          

                                          
            });// ./loader.load({})
    }
    getSonByIndex(index){

        return this._sons.children[index];    
    }
    setTextType (txt, siguientePaso=false, animar=true){
        
        this._setText("type",  1, txt, siguientePaso, animar, null);
    }
    setTextName (txt, siguientePaso=false, animar=true){

        this._setText("name",  2, txt, siguientePaso, animar, null);
    }
    setTextValue(txt, siguientePaso=false, animar=true){
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