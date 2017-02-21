class ArregloValor extends Element{
	constructor(instruccion){
		super();
	    let my_indice     = R01.lstElements.getChildrenById(R01.getIdsAncestros().p).sons.children.length;

	    this._idPadre               =  R01.getIdsAncestros().p;
		this._idContenedor          =  R01.getIdsAncestros().c;


		this._type                  = `${instruccion.type}`;
		this._name                  = `${instruccion.name}`;	
		this._value                 = `${instruccion.value}`;	
		this._element.name          = `${instruccion.name}`;	
    	this._element.my_indice     = my_indice;

    	
    	this._cube.material.visible = true; 
    	this._cube.material.opacity = 1;	

    	this.setTextType ("");
    	this.setTextName(this._name);
	    this.setTextValue(this._value);
	}
	_setcube(){
        var geo = new THREE.BoxGeometry(Config_R01.TAM_GRAL, Config_R01.TAM_GRAL, Config_R01.TAM_GRAL);
        var mat = new THREE.MeshPhongMaterial({map: R01_utileria.var.texture, transparent:true, opacity:0,visible:false});
        var malla = new THREE.Mesh(geo, mat);

        malla.castShadow = true;
        malla.receiveShadow = true;
        malla.name = "my_geometria";

        return malla;
    }
	in(TriggerNextStep = false){
		
        let element = this._element;
 
		let u  = Config_R01.TAM_GRAL/3;
		let tween = new TWEEN.Tween(element.position)// se usa obj para mover todo el grupo
	        .to({ x: ((Config_R01.TAM_GRAL+Config_R01.TAM_GRAL/3)+(Config_R01.TAM_GRAL+Config_R01.TAM_GRAL/3)*element.my_indice) + u, 
	             // y:  ((TAM_GRAL)+(TAM_GRAL+TAM_GRAL/3)), 
	              //z: -((TAM_GRAL*METODO_SCALE_Z)/2-TAM_GRAL/2)
	               }, Controles.getVelocidad())
	        .easing(TWEEN.Easing.Quadratic.In)
	        .onStart(function (){})
	        .onUpdate(function () {})
	        .onComplete(function () {
	        	if(TriggerNextStep){
	        		Main.TriggerNextStep();
	        	}
	        });

		tween.start();
	}
}
class Arreglo extends Element{
	constructor(instruccion){
		super();

	    let my_indice     = R01.lstElements.getChildrenById(R01.getIdsAncestros().p).sons.children.length;

	    this._idPadre               =  R01.getIdsAncestros().p;
		this._idContenedor          =  R01.getIdsAncestros().c;


		this._type                  = `${instruccion.type}`;
		this._name                  = `${instruccion.name}`;	
		this._value                 = `${instruccion.value}`;
		this._element.name          = `${instruccion.name}`;	
    	this._element.my_indice     = my_indice;

    	
    	this._cube.material.visible = true; 
    	this._cube.material.opacity = 1;	    

    	this.setTextType(this._type+"[]");
	    this.setTextName(this._name +"=");
	}
	_setcube(){
        var geo = new THREE.BoxGeometry(Config_R01.TAM_GRAL*2, Config_R01.TAM_GRAL, Config_R01.TAM_GRAL);
        var mat = new THREE.MeshPhongMaterial({map: R01_utileria.var.texture, transparent:true, opacity:0,visible:false});
        var malla = new THREE.Mesh(geo, mat);

        malla.castShadow = true;
        malla.receiveShadow = true;
        malla.name = "my_geometria";

        return malla;
    }
    get length(){
    	return this._children.length;
    }
	in(){		
        let element = this._element;
        
		let thisCubo = this._cube;
        let thisCuboTamano = thisCubo.geometry.parameters;//depth,height,width
        let thisCuboScale = thisCubo.scale;//x, y , z
        
        let padreCube = R01.lstElements.getChildrenById(this.idPadre).cube;
        let padreCubeTamano = padreCube.geometry.parameters;//depth,height,width
        let padreCubeScale = padreCube.scale;//x, y , z
 		
		let position = new TWEEN.Tween(element.position)// se usa obj para mover todo el grupo
	        .to({ 
					x: -(((padreCubeTamano.width*padreCubeScale.x)/2)-(thisCuboTamano.width*thisCuboScale.x)/2), 
					y:  ((thisCuboTamano.height*thisCuboScale.y)+((thisCuboTamano.height*thisCuboScale.y)+Config_R01.TAM_GRAL/3)*element.my_indice), 
					z: -(((padreCubeTamano.depth*padreCubeScale.z)/2)-(thisCuboTamano.depth*thisCuboScale.z)/2)  	
	          	}, Controles.getVelocidad())
	        .easing(TWEEN.Easing.Quadratic.In)
	        .onStart(function (){})
	        .onUpdate(function () {})
	        .onComplete(function () {
	        		        	
	        });

		position.start();	
	}
}