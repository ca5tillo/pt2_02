class CIf extends Element{
	constructor(){
		super();	


		this.cube.material.opacity = 1;
        this.cube.material.visible = true;
	}
	_setcube(){

        var geo = new THREE.BoxGeometry(Config_R01.TAM_GRAL, Config_R01.TAM_GRAL, Config_R01.TAM_GRAL);
        //var mat = new THREE.MeshPhongMaterial({color: 'green',map: mapBg3, transparent:true, opacity:0,visible:false});
        var mat = new THREE.MeshPhongMaterial({map: R01_utileria.lib.texture, transparent:true, opacity:0,visible:false});


        var malla = new THREE.Mesh(geo, mat);

        malla.castShadow = true;
        malla.receiveShadow = true;
        malla.name = "my_geometria";

        return malla;
    }


	in(){
			
		let _this    = this;

	    var position = new TWEEN.Tween(this.element.position)
		    .to({ x: 0, 
		          y: 0 + Config_R01.TAM_GRAL*2, 
		          z: 0 + Config_R01.TAM_GRAL*2 
		      }, Controles.getVelocidad())
		    .easing(TWEEN.Easing.Quadratic.In)
		    .onStart(function (){})
		    .onComplete(function () {});

	    var scale = new TWEEN.Tween(this.cube.scale)
		    .to({ x: R01.METODO_SCALE_X-2,
		    	  y: R01.METODO_SCALE_Y,
		    	  z: R01.METODO_SCALE_Z-1,}, Controles.getVelocidad()/2)
		    .easing(TWEEN.Easing.Quadratic.In)
		    .onComplete(function () {    
		        let siguientePaso = true;
		        let animar        = false;
		        _this.setTextName(_this.name, siguientePaso, animar); 
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

	  
            Main.TriggerNextStep();
        

	    });
	    tweenB.start();   
	    
	}
}