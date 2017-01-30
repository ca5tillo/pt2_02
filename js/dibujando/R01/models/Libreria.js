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
	get idAS(){ return this._idAS; }
    in(minum, numLibs){
    	let _this   = this;
        let cubo    = this._cube;
        let element = this._element;

        let opacity = new TWEEN.Tween(cubo.material)
	        .to({ opacity: 1 }, Controles.getVelocidad())
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
		   	}, Controles.getVelocidad())
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