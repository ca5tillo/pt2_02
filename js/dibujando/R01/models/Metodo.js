class Metodo extends Element{
	constructor(llamada,declaracion){
		super();	

        this._idPadre               =  R01.getIdsAncestros().p;
		this._idContenedor          =  R01.getIdsAncestros().c;
		this._name                  = `${declaracion.name}`;	
		this._returnA				= `${declaracion.returnA}`;	

		this.cube.material.opacity = 1;
        this.cube.material.visible = true;
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
	set returnA(d){ this._returnA = d;    }
	get returnA( ){ return this._returnA; }

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
		/*
			https://github.com/mrdoob/three.js/issues/2967
			http://stackoverflow.com/questions/22881676/what-is-the-equivalent-of-camera-matrixworld-getposition-x-using-the-getpositi
		*/
		let libreria_WorldPosition   = new THREE.Vector3();
		let contenedor_WorldPosition = new THREE.Vector3();
		let Yopli__ = new THREE.Vector3();

		libreria_WorldPosition.setFromMatrixPosition  ( _this._getLibBy_idAS(declaracion.idPadre).element.matrixWorld )
    	contenedor_WorldPosition.setFromMatrixPosition( R01.lstElements.getChildrenById(this._idContenedor).element.matrixWorld )
    	Yopli__.setFromMatrixPosition(_this.element.matrixWorld);
    	/*
	    	console.log("libreria_WorldPosition",libreria_WorldPosition);
	    	console.log("contenedor_WorldPosition",contenedor_WorldPosition);
	    	console.log("Yopli__",Yopli__);
    	*/
		let xi = (this.element.position.x - contenedor_WorldPosition.x)+(libreria_WorldPosition.x);
		let yi = (this.element.position.y - contenedor_WorldPosition.y)+(libreria_WorldPosition.y);
		let zi = (this.element.position.z - contenedor_WorldPosition.z)+(libreria_WorldPosition.z);

	    // cambiamos el punto de origen ya que son metodos estaticos que se llaman desde su libreria
	    this.element.position.set(xi,yi,zi);

	    var position = new TWEEN.Tween(this.element.position)
		    .to({ x: 0, 
		          y: 0 + Config_R01.TAM_GRAL*2, 
		          z: 0 + Config_R01.TAM_GRAL*2 
		      }, Controles.getVelocidad())
		    .easing(TWEEN.Easing.Quadratic.In)
		    .onStart(function (){})
		    .onComplete(function () {});

	    var scale = new TWEEN.Tween(this.cube.scale)
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

	  
            Main.TriggerNextStep();
        

	    });
	    tweenB.start();   
	    
	}
}