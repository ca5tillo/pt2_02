class Libreria extends Element{
	constructor(nombre){
		super();
		this._name                  = "element_libreria-" + nombre;		
		this._element.my_padre      = "group_general"             ;
	    this._element.name          = "group_libreria-"   + nombre;
	    this._element.my_indice     = groupBase.children.length;

	    this._cube.scale.x          = LIB_SCALE_X;
	    this._cube.scale.y          = LIB_SCALE_Y;
	    this._cube.scale.z          = LIB_SCALE_Z;

	    this.setTextName(nombre);

	    this._animate();
	}


    _animate(){
        var cubo = this._cube;
        var graphics =this._graphics;
        var element = this._element;
 


        new TWEEN.Tween(cubo.material)
        .to({ opacity: 1 }, velocidad)
        .easing(TWEEN.Easing.Quadratic.In)
        .onStart(function (){
            cubo.material.visible = true; 
        })
        .onComplete(function () {
         
        }).start();

 		// MOVER A LA BLOQUE DE LAS LIBRERIAS
///*
	    new TWEEN.Tween(element.position)
	    .to({ 
	        x: zonaLibrerias.position.x, 
	        y:(TAM_GRAL*LIB_SCALE_Y)*this._element.my_indice + TAM_GRAL/4*this._element.my_indice,
	        z: zonaLibrerias.position.z 
	   	}, velocidad)
	    .easing(TWEEN.Easing.Quadratic.In)
	    .onComplete(function () {

	    }).start();

//*/

    }
} 