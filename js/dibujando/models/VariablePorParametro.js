class VariablePorParametro extends Element{
	constructor(instruccion){
		super();




	    let my_indice     = lstElements.getChildrenById(lstIDsRamas[lstIDsRamas.length-1]).sons.children.length;


        this._idPadre               = lstIDsRamas[lstIDsRamas.length-1];
        this._idContenedor          = lstIDsMetodos[lstIDsMetodos.length-1];
		
		this._type                  = `${instruccion.tipoDeDato}`;
		this._name                  = `${instruccion.name}`;	
		this._value                 = `${instruccion.valor}`;
		this._element.name          = `${instruccion.name}`;	
    	this._element.my_indice     = my_indice;

    	
    	this._cube.material.visible = true; 
    	this._cube.material.opacity = 1;	    

  
	}
	get name(){
		return this._name;
	}
	get value(){
		return this._value;
	}
	get typeData(){
		return this._typeData;
	}
	in(instruccion,elementoOrigen){
		let tipoDeDato    = `${instruccion.tipoDeDato}`;
		let name3D        = `${instruccion.name}`;
	    let valor         = `${instruccion.valor}`;

		let _this = this;
        let graphics =this._graphics;
        let element = this._element;

		let thisCubo = this._cube;
        let thisCuboTamano = thisCubo.geometry.parameters;//depth,height,width
        let thisCuboScale = thisCubo.scale;//x, y , z
        

        let padreCube = lstElements.getChildrenById(_this.idPadre).cube;
        let padreCubeTamano = padreCube.geometry.parameters;//depth,height,width
        let padreCubeScale = padreCube.scale;//x, y , z
 
		
		let tween = new TWEEN.Tween(element.position)// se usa obj para mover todo el grupo
	        .to({ 
					x: -(((padreCubeTamano.width*padreCubeScale.x)/2)-(thisCuboTamano.width*thisCuboScale.x)/2), 
					y:  ((thisCuboTamano.height*thisCuboScale.y)+((thisCuboTamano.height*thisCuboScale.y)+TAM_GRAL/3)*element.my_indice), 
					z: -(((padreCubeTamano.depth*padreCubeScale.z)/2)-(thisCuboTamano.depth*thisCuboScale.z)/2)  	
	          	}, velocidad)
	        .easing(TWEEN.Easing.Quadratic.In)
	        .onStart(function (){
	        })
	        .onUpdate(function () {
            })
	        .onComplete(function () {
	        	let siguientePaso = true;
	        	_this.setTextType(tipoDeDato);
	        	_this.setTextName(name3D+"=");
			    _this.setTextValue(elementoOrigen, valor,siguientePaso);
	        	
	        });

		tween.start();
		
		
		
	
	}
	setTextValue(elementoOrigen, txt, siguientePaso=false, animar=true){
        let valorAnterior = this._text.getObjectByName("value");
        this._mysetText(elementoOrigen,"value", 3, txt, siguientePaso, animar, valorAnterior);
    }
	_mysetText(elementoOrigen, name, indice, txt, siguientePaso=false, animar=true, valorAnterior = null){

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
                        0 - TAM_GRAL*2 ,
                        0 - element.position.y - TAM_GRAL*2 + elementoOrigen.position.y,
                        0 - TAM_GRAL*2 
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

}