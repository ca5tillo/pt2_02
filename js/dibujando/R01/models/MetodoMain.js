class MetodoMain extends Element{
	constructor(declaracion){
		super();	
        this._idPadre               =  R01.getElementLibByName(declaracion.padre.name).id;
		this._idContenedor          =  R01.getElementLibByName(declaracion.padre.name).id;
		this._name                  = `${declaracion.name}`;			
	}
	_setcube(){

        var geo = new THREE.BoxGeometry(Config_R01.TAM_GRAL, Config_R01.TAM_GRAL, Config_R01.TAM_GRAL);
        //var mat = new THREE.MeshPhongMaterial({color: 'green',map: mapBg3, transparent:true, opacity:0,visible:false});
        var mat = new THREE.MeshPhongMaterial({map: R01_utileria.metodo.texture, transparent:true, opacity:0,visible:false});


        var malla = new THREE.Mesh(geo, mat);

        malla.castShadow = true;
        malla.receiveShadow = true;
        malla.name = "my_geometria";

        return malla;
    }
	_getLibBy_idAS(idAS){
		/*Ya que son metodos estaticos necesito conoser la posicion de la libreria*/
		let x = null;
	    for(let i of R01.lstElements.children){
	        if (i.idAS == idAS)
	            x = i;
	    }
	    return x;
	}
	in(declaracion){			
		let _this    = this;
	    let libreria = _this._getLibBy_idAS(declaracion.idPadre).element;

	    //solo si es main se encuentra en el area de las librerias ya q se genera la instancia en el metodo q lo llama 
	    let position = new TWEEN.Tween(_this.element.position)
				    .to({ x: -libreria.position.x, 
				          y: -libreria.position.y, 
				          z: -libreria.position.z 
				      }, Controles.getVelocidad())
				    .easing(TWEEN.Easing.Quadratic.In)
				    .onStart(function (){
				        _this.cube.material.opacity = 1;
				        _this.cube.material.visible = true;
				    })
				    .onComplete(function () {

				    });
	    let scale = new TWEEN.Tween(_this.cube.scale)
				    .to({ x: R01.METODO_SCALE_X,
				    	  y: R01.METODO_SCALE_Y,
				    	  z: R01.METODO_SCALE_Z,}, Controles.getVelocidad()/2)
				    .easing(TWEEN.Easing.Quadratic.In)
				    .onComplete(function () {    
				        _this.setTextName(_this.name);
				        Main.TriggerNextStep();   
				    });
	    position.chain(scale);
	    position.start();   
	}
	out(){


	    let padre    = R01.lstElements.getChildrenById(this.idPadre);
	    let metodo   = this;
	    let hijos    = metodo.children;
	    let cube     = metodo.cube;
	    let index    = padre.children.findIndex(nodo => nodo.id == metodo.id);

	    for(let i of hijos){
	        new TWEEN.Tween(i.cube.scale)
	            .to({ x:0.001,Y:0.001,z: 0.001,}, Controles.getVelocidad())
	            .easing(TWEEN.Easing.Quadratic.In)
	            .onStart(function (){
	                i.graphics.remove(i.text);  
	            })
	            .onComplete(function () {                
	            }).start(); 
	    }
	    var tweenB = new TWEEN.Tween(cube.scale)
	    .to({ x:0.001,Y:0.001,z: 0.001,}, Controles.getVelocidad())
	    .easing(TWEEN.Easing.Quadratic.In)
	    .onStart(function (){
	        metodo.graphics.remove(metodo.text);  
	    })
	    .onComplete(function () {  

	        padre.sons.remove(metodo.element);
	        padre.children.splice(index, 1);


	        pintarArbolDeLlamadas();
	         if(Main.lstPasos.children.length == 0 && Main.ejecutado ){//si el programa termino 
	         	Controles.activar__botones()
		        Controles.funcion.Reiniciar();
		    }

	    });
	    tweenB.start();   
	    
	}
}