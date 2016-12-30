class Metodo extends Element{
	constructor(llamada,declaracion){
		super();	

		
		this._id                    =  declaracion.id;
        this._idPadre               =  llamada.name == "main" ? declaracion.idPadre : llamada.idPadre;
		this._name                  = `${declaracion.name}`;	

		
	}
	in(declaracion){
			
		let _this    = this;
	    let metodo   = getElementByID(_this.id);
	    let cubo     = metodo.cube;
	    let element  = metodo.element;
	    let padre    = getElementByID(declaracion.idPadre).element;

	    // cambiamos el punto de origen ya que son metodos estaticos que se llaman desde su libreria
	    if(metodo.name != "main")element.position.set(padre.position.x,padre.position.y,padre.position.z);

	    //solo si es main se encuentra en el area de las librerias ya q se genera la instancia en el metodo q lo llama 
	    var tweenA = new TWEEN.Tween(element.position)
	    .to({ x: metodo.name == "main" ? -padre.position.x : 0 + TAM_GRAL*2, 
	          y: metodo.name == "main" ? -padre.position.y : 0 + TAM_GRAL*2, 
	          z: metodo.name == "main" ? -padre.position.z : 0 + TAM_GRAL*2 
	      }, velocidad)
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
	        metodo.setTextName(_this.name, siguientePaso, animar);   
	    });

	    tweenA.chain(tweenB);
	    tweenA.start();   
	    metodosEnEscena +=1;

	}
	out(instruccion){
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
	        pintarArbolDeLlamadas();
	        if(esAnimacionFluida)btn_pasoApaso();
	      
	    });
	    tweenB.start();   
	    

	    metodosEnEscena -=1;
	}
}