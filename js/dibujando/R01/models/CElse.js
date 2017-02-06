
class CElse extends Element{
	constructor(instruccion){
		super();	
		let my_indice               = R01.lstElements.getChildrenById(R01.getIdsAncestros().p).sons.children.length;

        this._idPadre               =  R01.getIdsAncestros().p;
		this._idContenedor          =  R01.getIdsAncestros().c;
		
		this._type                  = `_condicional`;
		this._name                  = `if`;	
		this._value                 = `${instruccion.value}`;
		this._element.name          = `if`;	
    	this._element.my_indice     = my_indice;


		this.cube.material.opacity = 1;
        this.cube.material.visible = true;

        
	}
	set value(v){ this._value = v;    }
	get name ( ){ return this._name;  }
	get value( ){ return this._value; }
	get type ( ){ return this._type;  }
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
		    .to({ x: R01.METODO_SCALE_X-2,z: R01.METODO_SCALE_Z-1,}, Controles.getVelocidad()/2)
		    .easing(TWEEN.Easing.Quadratic.In)
		    .onComplete(function () {    
		    	_this.setTextType("");
		    	_this.setTextName(`else`);
			    _this.setTextValue("");  

                Main.TriggerNextStep();
		    });

	    position.chain(scale);
	    position.start();   
	

	}
	out(){


	    let padre    = R01.lstElements.getChildrenById(this.idPadre);
	    let _this    = this;
	    let hijos    = this.children;
	    let cube     = this.cube;
	    let index    = padre.children.findIndex(nodo => nodo.id == this.id);

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
	        _this.graphics.remove(this.text);  
	    })
	    .onComplete(function () {  

	        padre.sons.remove(_this.element);
	        padre.children.splice(index, 1);


	        pintarArbolDeLlamadas();

	  
            Main.TriggerNextStep();
        

	    });
	    tweenB.start();   
	    
	}
}