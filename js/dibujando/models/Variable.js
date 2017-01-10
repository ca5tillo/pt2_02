class Variable extends Element{
	constructor(instruccion){
		super();




	    let my_indice     = lstElements.getChildrenById(getIdsAncestros().p).sons.children.length;


        this._idPadre               =  getIdsAncestros().p;
		this._idContenedor          =  getIdsAncestros().c;
		
		this._type                  = `${instruccion.type}`;
		this._name                  = `${instruccion.name}`;	
		this._value                 = `${instruccion.value}`;
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
	set value(v){
		this._value = v;
	}
	get type(){
		return this._type;
	}
	in(instruccion){
		let tipoDeDato    = `${instruccion.type}`;
		let name3D        = `${instruccion.name}`;
	    let valor         = `${instruccion.value}`;

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
			    _this.setTextValue(valor,siguientePaso);
	        	
	        });

		tween.start();		
	}
	in2(instruccion){
		let tipoDeDato    = `${instruccion.type}`;
		let name3D        = `${instruccion.name}`;
	    let valor         = `${instruccion.value}`;

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
	        	let siguientePaso = false;
	        	_this.setTextType(tipoDeDato);
	        	_this.setTextName(name3D+"=");
			    _this.setTextValue(valor,siguientePaso);
	        	
	        });

		tween.start();		
	}

}