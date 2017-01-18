class ArregloValor extends Element{
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
	in(instruccion){
		let my_valor         = instruccion.value;
		let nombre        = `${instruccion.name}`;

        let _this = this;
		let cubo = this._cube;
        let graphics =this._graphics;
        let element = this._element;
 
		
		let tween = new TWEEN.Tween(element.position)// se usa obj para mover todo el grupo
	        .to({ x: (TAM_GRAL+TAM_GRAL/3)+(TAM_GRAL+TAM_GRAL/3)*element.my_indice, 
	             // y:  ((TAM_GRAL)+(TAM_GRAL+TAM_GRAL/3)), 
	              //z: -((TAM_GRAL*METODO_SCALE_Z)/2-TAM_GRAL/2)
	               }, Controls.velocidad)
	        .easing(TWEEN.Easing.Quadratic.In)
	        .onStart(function (){
	        })
	        .onUpdate(function () {
            })
	        .onComplete(function () {
			    _this.setTextName(nombre);
			    _this.setTextValue(my_valor);
	        	
	        });

		tween.start();
	}
}
class Arreglo extends Element{
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
	in(instruccion){
		let type          = `${instruccion.type}`;
		let nombre        = `${instruccion.name}`;

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
	          	}, Controls.velocidad)
	        .easing(TWEEN.Easing.Quadratic.In)
	        .onStart(function (){
	        })
	        .onUpdate(function () {
            })
	        .onComplete(function () {
	        	let siguientePaso = true;
			    _this.setTextType(type+"[]");
			    _this.setTextName(nombre+"=",siguientePaso);
	        	
	        });

		tween.start();
		
		
		
	
	}
}