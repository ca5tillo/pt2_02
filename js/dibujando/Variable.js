class Variable extends Element{
	constructor(nombre,my_padre, my_valor){
		super();
		this._name                  = "element_variable-" + nombre;
		this._element.my_padre      = "group_metodo-" + my_padre;// libreria a la que pretenece
		this._element.name          = "group_variable-" + nombre;
    	this._element.my_name       = nombre;
    	this._element.my_indice     = groupBase.getObjectByName(this._element.my_padre,true).getObjectByName("sons").children.length;

    	this._cube.material.visible = true; 
    	this._cube.material.opacity = 1;


	    this.setTextName(nombre+"=");
	    this.setTextValue(my_valor);

	    this._animate();
	}
	_animate(){

		var cubo = this._cube;
        var graphics =this._graphics;
        var element = this._element;
 
		var tween = new TWEEN.Tween(element.position)// se usa obj para mover todo el grupo
	        .to({ x: -((TAM_GRAL*METODO_SCALE_X)/2-TAM_GRAL/2), 
	              y:  ((TAM_GRAL)+(TAM_GRAL+TAM_GRAL/3)*element.my_indice), 
	              z: -((TAM_GRAL*METODO_SCALE_Z)/2-TAM_GRAL/2) }, velocidad)
	        .easing(TWEEN.Easing.Quadratic.In)
	        .onStart(function (){
	        })
	        .onUpdate(function () {
            })
	        .onComplete(function () {
	        	
	        });

	
		tween.start();
	
	}
}