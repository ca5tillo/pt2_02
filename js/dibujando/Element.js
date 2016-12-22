class Element{
    constructor(){
        this._element       = new THREE.Group();
        this._graphics      = new THREE.Group();
        this._texto         = new THREE.Group();
        this._sons          = new THREE.Group();
        this._cube          = this._setcube();
        this._name          = "";

        this._graphics.name = "graphics";
        this._sons.name     = "sons";

        this._graphics.add(this._cube);
        this._graphics.add(this._texto);

        this._element.add(this._graphics);
        this._element.add(this._sons);
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

    
    get name(){
        return this._name;  
    }
    get element(){
        return this._element;  
    }
    get graphics(){
        return this._graphics;  
    }
    get texto(){
        return this._texto; 
    }
    get sons(){
        return this._sons;    
    }
    get cube(){
        return this._cube;
    }

    getSonByIndex(index){
        return this._sons.children[index];    
    }
    _setText(txt,name,indice, visible=true, valorAnterior = null){

        let element = this._element;
        let cube = this._cube;
        let texto = this._texto;

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

                let tam = cube.geometry.parameters;//depth,height,width
                let scale = cube.scale;//x, y , z
                let x = tam.width*scale.x;
                let y = tam.height*scale.y; 
                let z = tam.depth*scale.z; 

                textMesh1.visible = visible;
                textMesh1.position.set(
                    -element.position.x,
                    -element.position.y,
                    -element.position.z
                    );

                //textMesh1.position.set(-(x/2)+4,(y/2)-(20)*textos,z/2);
                let tween = new TWEEN.Tween(textMesh1.position)
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
                    });

                tween.start();
                    

                texto.add(textMesh1);                                
            } );
    }
    setTextName(txt,visible=true){
        this._setText(txt, "name",1, visible);
    }
    setTextValue(txt,visible=true){
        let valorAnterior = this._texto.getObjectByName("value");

        this._setText(txt, "value",2, visible,valorAnterior);
    }
    setValue(){
        this._texto.getObjectByName()
    }

}