class Libreria extends Element{
	constructor(instruccion){
		super();
		let name                    = `${instruccion.name}`;



		this._idPadre               = lstElements.id;
		this._idContenedor          = lstElements.id;
		this._idAS                  = instruccion.id;
		this._name                  = name;
		this._element.name          = name;	
	    this._element.my_indice     = groupBase.children.length;

	    this._cube.scale.x          = LIB_SCALE_X;
	    this._cube.scale.y          = LIB_SCALE_Y;
	    this._cube.scale.z          = LIB_SCALE_Z;

	    this.setTextName(name);


	}
	get idAS(){
		return this._idAS;
	}

    in(){
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

	    new TWEEN.Tween(element.position)
	    .to({ 
	        x: zonaLibrerias.position.x, 
	        y:(TAM_GRAL*LIB_SCALE_Y)*this._element.my_indice + TAM_GRAL/4*this._element.my_indice,
	        z: zonaLibrerias.position.z 
	   	}, velocidad)
	    .easing(TWEEN.Easing.Quadratic.In)
	    .onComplete(function () {

	    }).start();


    }
} 