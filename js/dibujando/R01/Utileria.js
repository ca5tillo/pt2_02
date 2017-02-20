var R01_utileria = {
	'font'  : { isLoaded:false, font:null    },
	'floor' : { isLoaded:false, texture:null },
	'var'   : { isLoaded:false, texture:null },
	'metodo': { isLoaded:false, texture:null },
	'lib'   : { isLoaded:false, texture:null },

	load          : function(){		
		this.loadFont();
		this.loadFloor();
		this.loadVar();
		this.loadMetodo();
		this.loadLib();
	},
	allLoaded    : function (){
		let a = true;
		let x = ['font','floor','var','metodo','lib'];
		for(let i of x){
			if( R01_utileria[i].isLoaded === false){
				a = false;
			} 
		}
		return a;
	},
	loadFont 		: function(){
		let loader = new THREE.FontLoader();
	    loader.load( 'lib/three-js/examples/fonts/optimer_bold.typeface.json', function ( response ) {
	        R01_utileria.font.font      = response;
	        R01_utileria.font.isLoaded  = true;
	    });
	},
	loadFloor     : function(){
	    let loader = new THREE.TextureLoader();
	    loader.load('img/textures/floor_2-1024x1024.png',
	        function ( texture ) {
	            R01_utileria.floor.texture  = texture;
	            R01_utileria.floor.isLoaded = true;	         
	        },	        
	        function ( xhr ) {},// Function called when download progresses //console.log( (xhr.loaded / xhr.total * 100) + '% loaded' );	        
	        function ( xhr ) {}// Function called when download errors
	    );
	},
	loadVar   : function(){
		let loader = new THREE.TextureLoader();
	    loader.load('img/textures/var.jpg',
	        function ( texture ) {
	            R01_utileria.var.texture  = texture;
	            R01_utileria.var.isLoaded = true;	         
	        },	        
	        function ( xhr ) {},// Function called when download progresses //console.log( (xhr.loaded / xhr.total * 100) + '% loaded' );	        
	        function ( xhr ) {}// Function called when download errors
	    );
	},
	loadMetodo   : function(){
		let loader = new THREE.TextureLoader();
	    loader.load('img/textures/nave.jpg',
	        function ( texture ) {
	            R01_utileria.metodo.texture  = texture;
	            R01_utileria.metodo.isLoaded = true;	         
	        },	        
	        function ( xhr ) {},// Function called when download progresses //console.log( (xhr.loaded / xhr.total * 100) + '% loaded' );	        
	        function ( xhr ) {}// Function called when download errors
	    );
	},
	loadLib   : function(){
		let loader = new THREE.TextureLoader();
	    loader.load('img/textures/lib.jpg',
	        function ( texture ) {
	            R01_utileria.lib.texture  = texture;
	            R01_utileria.lib.isLoaded = true;	         
	        },	        
	        function ( xhr ) {},// Function called when download progresses //console.log( (xhr.loaded / xhr.total * 100) + '% loaded' );	        
	        function ( xhr ) {}// Function called when download errors
	    );
	}
};