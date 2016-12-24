class Variable extends Element{
	constructor(name3D,nameInterno,namePadre, valor){
		super();
		this._name                  = nameInterno;
		this._element.name          = nameInterno;
		this._element.my_padre      = namePadre;
    	this._element.my_name       = name3D;
    	this._element.my_indice     = groupBase.getObjectByName(namePadre,true).getObjectByName("sons").children.length;

    	
    	this._cube.material.visible = true; 
    	this._cube.material.opacity = 1;	    

	    this._animate(name3D, valor);	  
	}

	_animate(nombre, my_valor){
		let _this = this;
        let graphics =this._graphics;
        let element = this._element;
        
		let thisCubo = this._cube;
        let thisCuboTamano = thisCubo.geometry.parameters;//depth,height,width
        let thisCuboScale = thisCubo.scale;//x, y , z
        

        let padreCube = getElementByName(this._element.my_padre).cube;
        let padreCubeTamano = padreCube.geometry.parameters;//depth,height,width
        let padreCubeScale = padreCube.scale;//x, y , z
 
		
		let tween = new TWEEN.Tween(element.position)// se usa obj para mover todo el grupo
	        .to({ x: -(((padreCubeTamano.width*padreCubeScale.x)/2)-(thisCuboTamano.width*thisCuboScale.x)/2), 
	              y:  ((TAM_GRAL)+(TAM_GRAL+TAM_GRAL/3)*element.my_indice), 
	              z: -(((padreCubeTamano.depth*padreCubeScale.z)/2)-(thisCuboTamano.depth*thisCuboScale.z)/2)  }, velocidad)
	        .easing(TWEEN.Easing.Quadratic.In)
	        .onStart(function (){
	        })
	        .onUpdate(function () {
            })
	        .onComplete(function () {
	        	let siguientePaso = true;
	        	_this.setTextName(nombre+"=");
			    _this.setTextValue(my_valor,siguientePaso);
	        	
	        });

		tween.start();
		
		
		
	
	}

}