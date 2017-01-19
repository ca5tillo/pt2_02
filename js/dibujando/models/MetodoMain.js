class MetodoMain extends Element{
	constructor(declaracion){
		super();	

		

        this._idPadre               =  getElementLibByName(declaracion.padre.name).id;
		this._idContenedor          =  getElementLibByName(declaracion.padre.name).id;
		this._name                  = `${declaracion.name}`;	

		
	}
	_getLibBy_idAS(idAS){
		/*Ya que son metodos estaticos necesito conoser la posicion de la libreria*/
		let x = null;
	    for(let i of lstElements.children){
	        if (i.idAS == idAS)
	            x = i;
	    }
	    return x;
	}
	in(declaracion){
			
		let _this    = this;
	    let cubo     = _this.cube;
	    let element  = _this.element;
	    let libreria = _this._getLibBy_idAS(declaracion.idPadre).element;
	


	    //solo si es main se encuentra en el area de las librerias ya q se genera la instancia en el metodo q lo llama 
	    var tweenA = new TWEEN.Tween(element.position)
	    .to({ x: -libreria.position.x, 
	          y: -libreria.position.y, 
	          z: -libreria.position.z 
	      }, Controls.velocidad)
	    .easing(TWEEN.Easing.Quadratic.In)
	    .onStart(function (){
	        cubo.material.opacity = 1;
	        cubo.material.visible = true;
	    })
	    .onComplete(function () {

	    });

	    var tweenB = new TWEEN.Tween(cubo.scale)
	    .to({ x:METODO_SCALE_X,Y:METODO_SCALE_Y,z: METODO_SCALE_Z,}, Controls.velocidad/2)
	    .easing(TWEEN.Easing.Quadratic.In)
	    .onComplete(function () {    
	        let siguientePaso = true;
	        let animar        = false;
	        _this.setTextName(_this.name, siguientePaso, animar);   
	    });

	    tweenA.chain(tweenB);
	    tweenA.start();   
	

	}
	out(){


	    let padre    = lstElements.getChildrenById(this.idPadre);
	    let metodo   = this;
	    let hijos    = metodo.children;
	    let cube     = metodo.cube;
	    let index    = padre.children.findIndex(nodo => nodo.id == metodo.id);

	    for(let i of hijos){
	        new TWEEN.Tween(i.cube.scale)
	            .to({ x:0.001,Y:0.001,z: 0.001,}, Controls.velocidad)
	            .easing(TWEEN.Easing.Quadratic.In)
	            .onStart(function (){
	                i.graphics.remove(i.text);  
	            })
	            .onComplete(function () {                
	            }).start(); 
	    }
	    var tweenB = new TWEEN.Tween(cube.scale)
	    .to({ x:0.001,Y:0.001,z: 0.001,}, Controls.velocidad)
	    .easing(TWEEN.Easing.Quadratic.In)
	    .onStart(function (){
	        metodo.graphics.remove(metodo.text);  
	    })
	    .onComplete(function () {  

	        padre.sons.remove(metodo.element);
	        padre.children.splice(index, 1);


	        pintarArbolDeLlamadas();
	         if(main_LstPasos.children.length == 0 && ejecutado ){//si el programa termino 
		        ctrl_fun_Reiniciar();
		    }

	    });
	    tweenB.start();   
	    
	}
}