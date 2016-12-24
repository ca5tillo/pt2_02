class ArregloValor extends Element{
	constructor(nameInterno,namePadre,valor){
		super();
		this._name                  = nameInterno;
		this._element.my_padre      = namePadre;
		this._element.name          = nameInterno;
    	this._element.my_name       = nameInterno;
    	this._element.my_indice     = groupBase.getObjectByName(namePadre,true).getObjectByName("sons").children.length;

    	
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
	constructor(name3D,nameInterno,namePadre){
		super();
		this._name                  = nameInterno;
		this._element.my_padre      = namePadre;
		this._element.name          = nameInterno;
    	this._element.my_name       = nameInterno;
    	this._element.my_indice     = groupBase.getObjectByName(namePadre,true).getObjectByName("sons").children.length;

    	
    	this._cube.material.visible = true; 
    	this._cube.material.opacity = 1;	    

	    this._animate(name3D);
	}
	_animate(nombre){

		let cubo = this._cube;
        let graphics =this._graphics;
        let element = this._element;
        let _this = this;
 
		
		let tween = new TWEEN.Tween(element.position)// se usa obj para mover todo el grupo
	        .to({ x: -((TAM_GRAL*METODO_SCALE_X)/2-TAM_GRAL/2), 
	              y:  ((TAM_GRAL)+(TAM_GRAL+TAM_GRAL/3)*element.my_indice), 
	              z: -((TAM_GRAL*METODO_SCALE_Z)/2-TAM_GRAL/2) }, velocidad)
	        .easing(TWEEN.Easing.Quadratic.In)
	        .onStart(function (){
	        })
	        .onUpdate(function () {
            })
	        .onComplete(function () {
	        	let siguientePaso = true;
			    _this.setTextValue(nombre+"=",siguientePaso);
	        	
	        });

		tween.start();
		
		
		
	
	}
}