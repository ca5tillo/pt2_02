class ArregloValor extends Element{
	constructor(instruccion){
		super();

	    let nameInterno   = `${instruccion.tipo}_${instruccion.nombre}`;
	    let valor         = instruccion.valor;
	    let my_indice     = getElementByID(instruccion.idPadre).sons.children.length;

	    this._id                    = `${instruccion.id}`;
        this._idPadre               = `${instruccion.idPadre}`;
		this._name                  = nameInterno;
		this._element.name          = nameInterno;
    	this._element.my_indice     = my_indice;

    	
    	this._cube.material.visible = true; 
    	this._cube.material.opacity = 1;	

    	this._animate(valor);	 
	}
	_animate(my_valor){

		let cubo = this._cube;
        let graphics =this._graphics;
        let element = this._element;
        let _this = this;
 
		
		let tween = new TWEEN.Tween(element.position)// se usa obj para mover todo el grupo
	        .to({ x: (TAM_GRAL+TAM_GRAL/3)+(TAM_GRAL+TAM_GRAL/3)*element.my_indice, 
	             // y:  ((TAM_GRAL)+(TAM_GRAL+TAM_GRAL/3)), 
	              //z: -((TAM_GRAL*METODO_SCALE_Z)/2-TAM_GRAL/2)
	               }, velocidad)
	        .easing(TWEEN.Easing.Quadratic.In)
	        .onStart(function (){
	        })
	        .onUpdate(function () {
            })
	        .onComplete(function () {
	        	let siguientePaso = true;
			    _this.setTextValue(my_valor);
	        	
	        });

		tween.start();
		
		
		
	
	}
}
class Arreglo extends Element{
	constructor(instruccion){
		super();

		let tipoDeDato    = `${instruccion.tipoDeDato}`;
		let name3D        = `${instruccion.nombre}`;
	    let nameInterno   = `${instruccion.tipo}_${instruccion.nombre}`;
	    let my_indice     = getElementByID(instruccion.idPadre).sons.children.length;

	    this._id                    = `${instruccion.id}`;
        this._idPadre               = `${instruccion.idPadre}`;
		this._name                  = nameInterno;
		this._element.name          = nameInterno;
    	this._element.my_indice     = my_indice;

    	
    	this._cube.material.visible = true; 
    	this._cube.material.opacity = 1;	    

	    this._animate(tipoDeDato, name3D);
	}
	_animate(tipoDeDato, nombre){
		let _this = this;
        let graphics =this._graphics;
        let element = this._element;
        
		let thisCubo = this._cube;
        let thisCuboTamano = thisCubo.geometry.parameters;//depth,height,width
        let thisCuboScale = thisCubo.scale;//x, y , z
        

        let padreCube = getElementByID(this._idPadre).cube;
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
			    _this.setTextType(tipoDeDato+"[]");
			    _this.setTextName(nombre+"=",siguientePaso);
	        	
	        });

		tween.start();
		
		
		
	
	}
}