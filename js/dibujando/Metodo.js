class Metodo extends Element{
	constructor(instruccion){
		super();	
		let nameInterno             = `${instruccion.tipo}_${instruccion.nombre}`;
		
		this._id                    = `${instruccion.id}`;
        this._idPadre               = `${instruccion.idPadre}`;
		this._name                  = `${instruccion.nombre}`;	
		this._element.name          = nameInterno;
		
	}
	MethodIn(instruccion){
			
	    let metodo   = getElementByID(instruccion.id);
	    let cubo     = metodo.cube;
	    let element  = metodo.element;
	    let padre    = getElementByID(instruccion.idPadre).element;

	    var tweenA = new TWEEN.Tween(element.position)
	    .to({ x: -padre.position.x+TAM_GRAL*2*metodosEnEscena, 
	          y: -padre.position.y+TAM_GRAL*2*metodosEnEscena, 
	          z: -padre.position.z+TAM_GRAL*2*metodosEnEscena }, velocidad)
	    .easing(TWEEN.Easing.Quadratic.In)
	    .onStart(function (){
	        cubo.material.opacity = 1;
	        cubo.material.visible = true;
	    })
	    .onComplete(function () {
	    });

	    var tweenB = new TWEEN.Tween(cubo.scale)
	    .to({ x:METODO_SCALE_X,Y:METODO_SCALE_Y,z: METODO_SCALE_Z,}, velocidad/2)
	    .easing(TWEEN.Easing.Quadratic.In)
	    .onComplete(function () {    
	        let siguientePaso = true;
	        let animar        = false;
	        metodo.setTextName(instruccion.nombre, siguientePaso, animar);   
	    });

	    tweenA.chain(tweenB);
	    tweenA.start();   
	    metodosEnEscena +=1;

	}
	MethodOut(instruccion){
	    let padre    = getElementByID(instruccion.idPadre);
	    let metodo   = getElementByID(instruccion.id);
	    let hijos    = metodo.subElements;
	    let cube     = metodo.cube;
	    let index    = padre.subElements.findIndex(nodo => nodo.id == instruccion.id);
	    
	    for(let i of hijos){
	        new TWEEN.Tween(i.cube.scale)
	            .to({ x:0.001,Y:0.001,z: 0.001,}, velocidad)
	            .easing(TWEEN.Easing.Quadratic.In)
	            .onStart(function (){
	                i.graphics.remove(i.text);  
	            })
	            .onComplete(function () {                
	            }).start(); 
	    }
	    var tweenB = new TWEEN.Tween(cube.scale)
	    .to({ x:0.001,Y:0.001,z: 0.001,}, velocidad)
	    .easing(TWEEN.Easing.Quadratic.In)
	    .onStart(function (){
	        metodo.graphics.remove(metodo.text);  
	    })
	    .onComplete(function () {  
	        padre.sons.remove(metodo.element);
	        padre.subElements.splice(index, 1);

	        if(esAnimacionFluida)btn_pasoApaso();
	      
	    });
	    tweenB.start();   
	    

	    metodosEnEscena -=1;
	}
}