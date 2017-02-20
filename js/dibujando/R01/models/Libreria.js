"use strict";
class Libreria extends Element{
	constructor(instruccion){
		super();
		let name                    = `${instruccion.name}`;

		this._idPadre               = R01.lstElements.id;
		this._idContenedor          = R01.lstElements.id;
		this._idAS                  = instruccion.id;
		this._name                  = name;
		this._element.name          = name;	
	    this._element.my_indice     = R01.groupBase.children.length;

	    this._cube.scale.x          = R01.LIB_SCALE_X;
	    this._cube.scale.y          = R01.LIB_SCALE_Y;
	    this._cube.scale.z          = R01.LIB_SCALE_Z;

	    
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
	get idAS(){ return this._idAS; }
    in(minum, numLibs){
    	let _this   = this;
        let cubo    = this._cube;
        let element = this._element;

        let opacity = new TWEEN.Tween(cubo.material)
	        .to({ opacity: 1 }, 20)
	        .easing(TWEEN.Easing.Quadratic.In)
	        .onStart(function (){
	            cubo.material.visible = true; 
	        })
	        .onComplete(function () {         
	        });

 		// MOVER A LA BLOQUE DE LAS LIBRERIAS
	    let position = new TWEEN.Tween(element.position)
		    .to({ 
		        x: R01.zoneLib.position.x, 
		        y:(Config_R01.TAM_GRAL*R01.LIB_SCALE_Y)*this._element.my_indice + Config_R01.TAM_GRAL/4*this._element.my_indice,
		        z: R01.zoneLib.position.z 
		   	}, 20)
		    .easing(TWEEN.Easing.Quadratic.In)
		    .onComplete(function () {
		    	_this.setTextName(_this._name,false,false);
		    	if(minum == numLibs){
		    		Controles.activar__botones();
		    	}
		    });

		opacity.chain(position);
	    opacity.start(); 
    }
} 