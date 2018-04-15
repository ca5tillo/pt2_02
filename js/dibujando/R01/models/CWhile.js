
class CWhile extends Element{
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
    	this._string                = instruccion.string;


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

    _eval_2(arr){ 
        let _this             = this;
        let value_1           = this.text.children[2] || null;
        let value_2           = this.text.children[3] || null;
        let padre             = R01.lstElements.getChildrenById(R01.getIdsAncestros().p);
        let pos_mesa          = this.__getTextPosition_2(padre, this);// dentro de la mesa 
            pos_mesa.y       += Config_R01.TAM_GRAL;// sobre de la mesa
        let position_destino  = this.__getTextPosition_1(3);
        /* Es el resultado (valor final) */
        let value             = arr[arr.length-1].string;
        let pato = _this.__setText("value",value);
            pato.mesh.position.set(pos_mesa.x, pos_mesa.y, pos_mesa.z); // Sobre la mesa 
                        
        if(value_2){
            _this.text.remove(value_2);
        }
        /* Llevar el texto a su posicion destino */
        new TWEEN.Tween(pato.mesh.position)
            .to         (position_destino, Controles.getVelocidad()).easing(TWEEN.Easing.Quadratic.In)
            .onComplete ( function (){    
                
                _this.text.remove(value_1);

                if( _this.value){
                	Main.TriggerNextStep();                  
                }else{
                	_this.out();
                }              
            }).start();
    }in(){
			
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
		    .to({ x: R01.METODO_SCALE_X-2, z: R01.METODO_SCALE_Z-1,}, Controles.getVelocidad()/2)
		    .easing(TWEEN.Easing.Quadratic.In)
		    .onComplete(function () {    
		    	_this.setTextType("");
		    	_this.setTextName(_this._string);
			    _this.setTextValue("");  

		       	Main.TriggerNextStep();
		    });

	    position.chain(scale);
	    position.start();   
	}

	in2(){
			
		let _this    = this;
		

		//this.element.rotation.x = Math.PI * 2;
	    var position = new TWEEN.Tween(this.element.rotation)
		    .to({ x: -Math.PI * 2,
		      }, Controles.getVelocidad())
		    .easing(TWEEN.Easing.Quadratic.In)
		    .onStart(function (){

			    _this.setTextValue("");  
			    let hijos = _this.children;
			    for(let i of hijos){
			        
	            	_this.sons.remove(i.element);
			          
			    }
			    _this._children = [];
		    })
	        .onUpdate(function () {})
		    .onComplete(function () {
		    	_this.element.rotation.x = 0;
		    	Main.TriggerNextStep();
		    }).start();
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

	        Main.popPasos_Level_2();
            Main.nextInstruccion =  Main.getInstruccion();
            Main.marktext(); 

            R01._popAncestro_2();


	  		
            Main.TriggerNextStep();
        

	    });
	    tweenB.start();   
	}
}