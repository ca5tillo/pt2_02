"use strict";
var MyThreeJS = {
	'scene'         : null,
	'renderer'      : null,
	'camera'        : null,

	'_FOV'          : 45,
	'_ASPECT'       : window.innerWidth / window.innerHeight,
	'_NEAR'         : 0.1,
	'_FAR'          : 10000,

	'cameraControl' : null,


	'init'			: function(){
		this.setupThreeJS();
		this.addFloor();
		this.ambientLight();
		//this.spotLight();
	},
	'setupThreeJS'  : function(){
	    /*ESCENA*/
	    this.scene             = new THREE.Scene();
	    this.scene.fog         = new THREE.Fog( 0x000000, 250, 1400 );
	    //this.scene.fog         = new THREE.FogExp2(0xdcf7e7, 0.001); // efecto neblina, no funciona con logarithmicDepthBuffer

	    /*CAMARA*/
	    this.camera            = new THREE.PerspectiveCamera( this._FOV, this._ASPECT, this._NEAR, this._FAR );
	    //this.camera.position.set(0,TAM_GRAL*16,TAM_GRAL*22);
	    //this.camera.lookAt(scene.position);
	    this.camera.position.x = 0;
	    this.camera.position.y = 20;
	    this.camera.position.z = 60;

	    this.camera.position.y = 400;
		this.camera.position.z = 400;
		this.camera.rotation.x = -45 * Math.PI / 180;


	    this.camera.lookAt(this.scene.position);

	    this.cameraControl = new THREE.OrbitControls(this.camera);
	    this.cameraControl.enabled = false;   // Inicia desactivado

	    /*
	    this.cameraControl.minDistance   = Config_R01.TAM_GRAL*6;
	    this.cameraControl.maxDistance   = 1000;
	    this.cameraControl.maxPolarAngle = Math.PI * 0.5;
	    //*/   

	    /*RENDER*/
	    this.renderer = new THREE.WebGLRenderer({ antialias: true });//antialias: true, mejora los bordes | logarithmicDepthBuffer: true , es para soportar grandes distancias
	    this.renderer.shadowMap.enabled = true;
	    this.renderer.setSize( $("#representacion_3D").width() ,  $("#representacion_3D").height() );
	    this.renderer.setClearColor( this.scene.fog.color );
	    this.renderer.setPixelRatio( window.devicePixelRatio );

	    document.getElementById("representacion_3D").appendChild(this.renderer.domElement);
	},
	'enableCameraControl' : function(){
		
		this.cameraControl.enabled = true;
	},
	'disableCameraControl' : function(){
		//http://stackoverflow.com/questions/16525043/reset-camera-using-orbitcontrols-js
	    this.cameraControl.enabled = false;
	},
	'resetCameraControl' : function(){
		this.cameraControl.reset();	 
	},
	'onResize'		: function(){
	    MyThreeJS.camera.aspect = MyThreeJS._ASPECT;
	    MyThreeJS.camera.updateProjectionMatrix();
	    MyThreeJS.renderer.setSize( $("#representacion_3D").width() ,  $("#representacion_3D").height() );
	},
	'setupAxis' 	: function(){

		this.scene.add( new THREE.AxisHelper( 1e19 ) );
	},
	'ambientLight'  : function(){

		this.scene.add( new THREE.AmbientLight( 0xffffff , 0.6 ) );// Luz blanca suave
	},
	'spotLight'     : function(){
	    let spotLight = new THREE.SpotLight( 0xffffff );
	        spotLight.position.set( 0, 60, 60 );
	        spotLight.name = 'Spot Light';
	        spotLight.angle = Math.PI / 5;
	        spotLight.penumbra = 0.3;
	        spotLight.castShadow = true;
	        spotLight.shadow.camera.near = 8;
	        spotLight.shadow.camera.far = 30;
	        spotLight.shadow.mapSize.width = 1024;
	        spotLight.shadow.mapSize.height = 1024;

	        this.scene.add( spotLight );
	        //scene.add( new THREE.CameraHelper( spotLight.shadow.camera ) );
	        //*/
	},
	'addFloor'      : function(){
        let floorMaterial = new THREE.MeshPhongMaterial();
            floorMaterial.map = R01_utileria.floor.texture;
            floorMaterial.map.wrapS = floorMaterial.map.wrapT = THREE.RepeatWrapping;
            floorMaterial.map.repeat.set(8, 8);
        let floorGeometry = new THREE.PlaneGeometry(2000, 2000, 20, 20);
        
        let floorMesh = new THREE.Mesh(floorGeometry, floorMaterial);
            floorMesh.receiveShadow = true;
            floorMesh.rotation.x = -0.5 * Math.PI;
            floorMesh.position.y = -Config_R01.TAM_GRAL/2;// bajo el piso para no tener q recalcular cada elemento a la altura del piso
        MyThreeJS.scene.add(floorMesh);	  
	}
	
};