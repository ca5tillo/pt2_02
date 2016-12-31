class Element{
    constructor(){
        this._id            = dibujando_generateID.next().value;
        this._idPadre       = null; // Es el padre directo Ej. si declaro una variable dentro de un for el for es el padre directo
        this._idContenedor  = null; // EJ. si es una variable a que metodo pertenece sin importa si antes pertenece a un for 
        this._subElements   = [];
        this._name          = "";

        this._element       = new THREE.Group();
        this._graphics      = new THREE.Group();
        this._text          = new THREE.Group();
        this._sons          = new THREE.Group();        
        this._cube          = this._setcube();
        
        this._element.name  = "";
        this._graphics.name = "graphics";
        this._sons.name     = "sons";

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
    get subElements(){
        return this._subElements; 
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

        let element = this._element;
        let cube = this._cube;
        let texto = this._text;

        let loader = new THREE.FontLoader();
        let textMesh1;
        loader.load( 'lib/three-js/examples/fonts/optimer_bold.typeface.json', function ( response ) {


                let material = new THREE.MultiMaterial( [
                    new THREE.MeshPhongMaterial( { color: 0xffffff, shading: THREE.FlatShading } ), // front
                    new THREE.MeshPhongMaterial( { color: 0xffffff, shading: THREE.SmoothShading } ) // side
                ] );
                let textGeo = new THREE.TextGeometry( txt, {
                    font: response,
                    size: TAM_GRAL/8,
                    height: 2,
                });

                textGeo.computeBoundingBox();
                textGeo.computeVertexNormals();

                textMesh1 = new THREE.Mesh( textGeo, material );
                textMesh1.name=name;
                texto.add(textMesh1);  

                let tam = cube.geometry.parameters;//depth,height,width
                let scale = cube.scale;//x, y , z
                let x = tam.width*scale.x;
                let y = tam.height*scale.y; 
                let z = tam.depth*scale.z; 

                textMesh1.visible = true;

                if( ! animar){
                    textMesh1.position.set(
                    -(x/2)+TAM_GRAL/25, 
                    (y/2)-(TAM_GRAL/5)*indice,
                    z/2
                    );
                    if(siguientePaso){
                        if(esAnimacionFluida)btn_pasoApaso();
                    }
                }else{

                    textMesh1.position.set(
                        -element.position.x,
                        -element.position.y,
                        -element.position.z
                        );     
                    let tween = new TWEEN.Tween(textMesh1.position,valorAnterior)
                        .to({ x: -(x/2)+TAM_GRAL/25, 
                              y: (y/2)-(TAM_GRAL/5)*indice, 
                              z: z/2 
                          },velocidad)
                        .easing(TWEEN.Easing.Quadratic.In)
                        .onStart(function (){

                        })
                        .onUpdate(function () {
                            
                        })
                        .onComplete(function () {
                            if(valorAnterior){
                                texto.remove(valorAnterior);
                            }
                            
                            if(siguientePaso){
                                if(esAnimacionFluida)btn_pasoApaso();
                            }
                        });

                    
                    tween.start();
                
                }

                                          
            } );
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
    getChildrenByName(name, profundidad = false){
        //http://jsfiddle.net/dystroy/MDsyr/
        let getSubMenuItem = function (subMenuItems, name) {
            if (subMenuItems) {
                for (let i = 0; i < subMenuItems.length; i++) {
                    if (subMenuItems[i].name == name) {
                        return subMenuItems[i];
                    };
                    if(profundidad){
                        let found = getSubMenuItem(subMenuItems[i].subElements, name);
                        if (found) return found;
                    }
                }
            }
        };

        let searchedItem = getSubMenuItem(this._subElements, name) || null;
        return searchedItem;
    }
    getChildrenById(id){
        //http://jsfiddle.net/dystroy/MDsyr/
        let getSubMenuItem = function (subMenuItems, id) {
            if (subMenuItems) {
                for (let i = 0; i < subMenuItems.length; i++) {
                    if (subMenuItems[i].id == id) {
                        return subMenuItems[i];
                    };
                    let found = getSubMenuItem(subMenuItems[i].subElements, id);
                    if (found) return found;
                
                }
            }
        };
        let searchedItem = getSubMenuItem(this._subElements, id) || null;
        return searchedItem;
    }

}