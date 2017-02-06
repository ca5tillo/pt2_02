var dibujando_generateID = GenerateID();
class Element{
    constructor(){
        this._id            = dibujando_generateID.next().value;
        this._idPadre       = null; // Es el padre directo Ej. si declaro una variable dentro de un for el for es el padre directo
        this._idContenedor  = null; // EJ. si es una variable a que metodo pertenece sin importa si antes pertenece a un for 
        this._children      = [];
        this._name          = "";
        R01._idNodoFinal    = this._id;

        this._element       = new THREE.Group();
        this._graphics      = new THREE.Group();
        this._text          = new THREE.Group();
        this._sons          = new THREE.Group();        
        this._cube          = this._setcube();
        
        this._element.name  = "";
        this._graphics.name = "graphics";
        this._sons.name     = "sons";
        this._text.name     = "text";

        this._graphics.add(this._cube);
        this._graphics.add(this._text);

        this._element.add(this._graphics);
        this._element.add(this._sons);
    }

    set id           (a){  this._id           = a;     }
    set idPadre      (a){  this._idPadre      = a;     }
    set idContenedor (a){  this._idContenedor = a;     }
    set name         (a){  this._name         = a;     }
    get id           ( ){  return this._id;            }
    get idPadre      ( ){  return this._idPadre;       }
    get idContenedor ( ){  return this._idContenedor;  }
    get children     ( ){  return this._children;      }
    get name         ( ){  return this._name;          }
    get element      ( ){  return this._element;       }
    get graphics     ( ){  return this._graphics;      }
    get text         ( ){  return this._text;          }
    get sons         ( ){  return this._sons;          }
    get cube         ( ){  return this._cube;          }

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
    __setText(name,txt,visible = true){//crea e inserta en escena el texto en posicion 0,0,0
        /* Create Texto */    
            let groupText       = this._text;
            let size            = 70;
            let height          = 20;
            let curveSegments   = 4;
            let bevelThickness  = 2;
            let bevelSize       = 1.5;
            let bevelEnabled    = false;// este valor en true para fuentes muy pequeñas (size) se distorciona el texto

            let textGeo = new THREE.TextGeometry( txt, {
                font: R01_utileria.font.font,
                size: size,
                height: height,
                ///*
                size: Config_R01.TAM_GRAL/6,
                height: (Config_R01.TAM_GRAL/20)/2,
                //*/
                curveSegments: curveSegments,
                bevelThickness: bevelThickness,
                bevelSize: bevelSize,
                bevelEnabled: bevelEnabled,
                material: 0,
                extrudeMaterial: 1
            });
            //textGeo.center();
            textGeo.computeBoundingBox();
            textGeo.computeVertexNormals();

            let material = new THREE.MultiMaterial([
                new THREE.MeshPhongMaterial( { color: 0xffffff, shading: THREE.FlatShading   } ), // front
                new THREE.MeshPhongMaterial( { color: 0xffffff, shading: THREE.SmoothShading } )  // side
            ]);
            
            if ( ! bevelEnabled ) {
                /*
                "Fijar" las normales laterales eliminando la componente z de las normales 
                para las caras laterales (esto no funciona bien para la geometría biselada 
                ya que entonces perdemos una curvatura agradable alrededor del eje z)
                */

                let triangleAreaHeuristics = 0.1 * ( height * size );

                for ( let i = 0; i < textGeo.faces.length; i ++ ) {

                    let face = textGeo.faces[ i ];

                    if ( face.materialIndex == 1 ) {

                        for ( let j = 0; j < face.vertexNormals.length; j ++ ) {

                            face.vertexNormals[ j ].z = 0;
                            face.vertexNormals[ j ].normalize();

                        }

                        let va = textGeo.vertices[ face.a ];
                        let vb = textGeo.vertices[ face.b ];
                        let vc = textGeo.vertices[ face.c ];

                        let s = THREE.GeometryUtils.triangleArea( va, vb, vc );

                        if ( s > triangleAreaHeuristics ) {

                            for ( let j = 0; j < face.vertexNormals.length; j ++ ) {

                                face.vertexNormals[ j ].copy( face.normal );

                            }

                        }

                    }

                }
            }// ./ if ( ! bevelEnabled ) 

            let textMesh1     = new THREE.Mesh( textGeo, material );
            textMesh1.name    = name;
            textMesh1.visible = visible; //valor booleano
            textMesh1.string  = txt;

            groupText.add(textMesh1);
            return {mesh:textMesh1,geo:textGeo};
        /* FIN Create Texto */      
    }
    __setTextPosition_1(indice){
        /* Establecer Posicion del texto sobre su cubo */
            // Es el tamaño real del cubo operando por su escala 
            let tam       = this._cube.geometry.parameters;//depth,height,width
            let scale     = this._cube.scale;//x, y , z
            let x         = tam.width  * scale.x;
            let y         = tam.height * scale.y; 
            let z         = tam.depth  * scale.z; 

            // Destino del texto sobre su cubo (realizo x/2 para obtener la distancia del centro a la orilla despues le sumo un margen para q no quede al raz del cubo)
            let xi        = -(x/2)+Config_R01.TAM_GRAL/25;
            let yi        = (y/2)-(Config_R01.TAM_GRAL/5)*indice;
            let zi        = z/2;
            let position  = {x:xi,y:yi,z:zi};
            return position;
        /* FIN Establecer Posicion del texto sobre su cubo */
    }
    __setTextPosition_2(origen,receptor,textMesh1){
        /* Calcula la posicion origen (desde donde iniciara la animacion)*/
        let WorldPosition_A = new THREE.Vector3(); // El elemento origen "Variable"
        let WorldPosition_B = new THREE.Vector3(); // El elemento receptor "Variable"
        let WorldPosition_C = new THREE.Vector3();

        WorldPosition_A.setFromMatrixPosition ( origen.element.matrixWorld );
        WorldPosition_B.setFromMatrixPosition ( receptor.element.matrixWorld );
             

        WorldPosition_C.x = (0 - WorldPosition_B.x)+(WorldPosition_A.x);
        WorldPosition_C.y = (0 - WorldPosition_B.y)+(WorldPosition_A.y);
        WorldPosition_C.z = (0 - WorldPosition_B.z)+(WorldPosition_A.z);

        return WorldPosition_C;
    }
    _setText( name, indice, txt, siguientePaso, animar, valorAnterior = null){
        let _this           = this;
        let groupText       = this._text;
        let textMesh1       = this.__setText(name,txt).mesh;
        let position_A      = this.__setTextPosition_1(indice);// DESTINO


        if( animar == false){ //si no se desea animar el texto solo aparecera en la pared del cubo
            textMesh1.position.set(position_A.x, position_A.y, position_A.z);    

            if(valorAnterior){
                groupText.remove(valorAnterior);
            }
            if(siguientePaso){
                Main.TriggerNextStep();
            }
        }else{
            textMesh1.position.set(
                -this._element.position.x,
                -this._element.position.y,
                -this._element.position.z
                );     // lo envio al centro del metodo o padre

            let tween = new TWEEN.Tween(textMesh1.position,valorAnterior)
                .to         ({ x:position_A.x, y:position_A.y, z:position_A.z },Controles.getVelocidad())
                .easing     (TWEEN.Easing.Quadratic.In)
                .onStart    ( function (){} )
                .onUpdate   ( function (){} )
                .onComplete ( function (){
                    if(valorAnterior){
                        groupText.remove(valorAnterior);
                    }                            
                    if(siguientePaso){
                        Main.TriggerNextStep();
                    }
                });                    
            tween.start();
        
        }        
    }
    _setText2( name, indice, txt, siguientePaso=false, animar=true, valorAnterior = null, elementoOrigen = null){
        let _this           = this;
        let groupText       = this._text;
        let textMesh1       = this.__setText(name,txt,false).mesh;
        let position_A      = this.__setTextPosition_1(indice);// DESTINO/* Establecer Posicion del texto sobre su cubo */
        let origenPos_X     = elementoOrigen.element.position.x;
        let origenPos_Xi    = origenPos_X - (Config_R01.TAM_GRAL*2);


        let mo =new TWEEN.Tween(elementoOrigen.element.position)
                    .to         ({ x:origenPos_Xi },Controles.getVelocidad())
                    .easing     (TWEEN.Easing.Quadratic.In)
                    .onStart    ( function (){} )
                    .onUpdate   ( function (){} )
                    .onComplete ( function (){
                        let position_B = _this.__setTextPosition_2(elementoOrigen, _this, textMesh1);// Origen
                        textMesh1.position.set(position_B.x, position_B.y, position_B.z);  
                        textMesh1.visible = true;
                    });
        
        let tween = new TWEEN.Tween(textMesh1.position,valorAnterior)
            .to         ({ x:position_A.x, y:position_A.y, z:position_A.z },Controles.getVelocidad())
            .easing     (TWEEN.Easing.Quadratic.In)
            .onStart    ( function (){} )
            .onUpdate   ( function (){} )
            .onComplete ( function (){ if(valorAnterior) groupText.remove(valorAnterior);_this.value=textMesh1.string; });    

        let mo2 =new TWEEN.Tween(elementoOrigen.element.position)
                    .to         ({ x:origenPos_X },Controles.getVelocidad())
                    .easing     (TWEEN.Easing.Quadratic.In)
                    .onStart    ( function (){} )
                    .onUpdate   ( function (){} )
                    .onComplete ( function (){ if(siguientePaso) Main.TriggerNextStep();});


        mo.chain(tween);
        tween.chain(mo2);               
        mo.start();                          
    }
    _setText3(arr, i, f){

        let _this       = this;
        let idPadre         = R01.getIdsAncestros().p;
        let idContenedor    = R01.getIdsAncestros().c;
        let contenedor      = R01.lstElements.getChildrenById(idContenedor);
        let padre           = R01.lstElements.getChildrenById(idPadre);



        let pos_mesa    = this.__setTextPosition_2(padre, this);// sobre de la mesa
        pos_mesa.y += Config_R01.TAM_GRAL;


        if(i <= f){
            if(arr[i].symbol && arr[i].symbol == 'NAME'){
                let variable      = contenedor.getChildrenByName(arr[i].string);
                let posVar        = new THREE.Vector3();
                let origenPos_X   = variable.element.position.x;
                let origenPos_Xi  = origenPos_X - (Config_R01.TAM_GRAL*2);
                let __a           = this.__setText("value",variable.value,false).mesh;

                posVar.setFromMatrixPosition ( variable.element.matrixWorld );

                let varIzq = new TWEEN.Tween(variable.element.position)
                    .to         ({ x:origenPos_Xi },Controles.getVelocidad())
                    .easing     (TWEEN.Easing.Quadratic.In)
                    .onComplete ( function (){
                        let position_B = _this.__setTextPosition_2(variable, _this);// Origen
                        __a.position.set(position_B.x, position_B.y, position_B.z); 
                        __a.visible = true;
                    });

                let txtPos = new TWEEN.Tween(__a.position)
                    .to         (pos_mesa,Controles.getVelocidad()).easing(TWEEN.Easing.Quadratic.In)
                    .onComplete ( function (){
                        let value_3     = _this.text.children[4] || null;
                        if(value_3){
                            let value_2     = _this.text.children[3] || null;
                            let string = value_2.string;
                            string = string.replace(arr[i].string, value_3.string);
                            _this.text.remove(value_2);
                            _this.text.remove(value_3);

                            let pato = _this.__setText("value",string);
                            pato.mesh.position.set(pos_mesa.x, pos_mesa.y, pos_mesa.z);
                            pato.geo.center();
                        }
                        _this._setText3( arr, i+1, f);
                    });
                let varDer = new TWEEN.Tween(variable.element.position)
                    .to         ({ x:origenPos_X },Controles.getVelocidad())
                    .easing     (TWEEN.Easing.Quadratic.In);
                
                varIzq.chain(txtPos);
                txtPos.chain(varDer);
                varIzq.start();            
            }
            else if(arr[i].ext == 'ext'){
                let _a = this.__setText("value",arr[i].string,false);
                let __a = _a.mesh;
                     _a.geo.center();
                    __a.position.set(pos_mesa.x, pos_mesa.y-Config_R01.TAM_GRAL, pos_mesa.z);
                    __a.visible = true;
           
                 new TWEEN.Tween(__a.position)
                    .to         ({y:pos_mesa.y},Controles.getVelocidad())
                    .easing     (TWEEN.Easing.Quadratic.In)
                    .onComplete ( function (){                            
                        let value_3     = _this.text.children[4] || null;
                        if(value_3){
                            let value_2     = _this.text.children[3] || null;
                            let string = value_2.string + " "+value_3.string;
                            _this.text.remove(value_2);
                            _this.text.remove(value_3);

                            let pato = _this.__setText("value",string);

                            pato.mesh.position.set(pos_mesa.x, pos_mesa.y, pos_mesa.z);
                            pato.geo.center();

                        }
                        _this._setText3( arr, i+1, f);
                    }).start();
            }
            else{

                _this._setText3( arr, i+1, f);
            }
        }
        else if(i == f+1){

            let a = new TWEEN.Tween({x:0})
                .to         ({x:20},Controles.getVelocidad())
                .easing     (TWEEN.Easing.Quadratic.In)
                .onComplete ( function (){                            
                    let value_2     = _this.text.children[3] || null;
                    if(value_2){

                        let string = arr[arr.length-1].string;
                        _this.text.remove(value_2);

                        let pato = _this.__setText("value",string);
                        pato.mesh.position.set(pos_mesa.x, pos_mesa.y, pos_mesa.z);
                        //pato.geo.center();

                        let po = _this.__setTextPosition_1(3);
                        let b = new TWEEN.Tween(pato.mesh.position)
                            .to         (po,Controles.getVelocidad())
                            .easing     (TWEEN.Easing.Quadratic.In)
                            .onComplete ( function (){    
                                let value_1     = _this.text.children[2] || null;
                                let value_2     = _this.text.children[3] || null;   

                                _this.text.remove(value_1);

                                Main.TriggerNextStep();                  
                                
                            }).start();
                    }
                });
            a.start();            
        }
    }

    _setText4(arr, i, f){

        let _this       = this;
        let idPadre         = R01.getIdsAncestros().p;
        let idContenedor    = R01.getIdsAncestros().c;
        let contenedor      = R01.lstElements.getChildrenById(idContenedor);
        let padre           = R01.lstElements.getChildrenById(idPadre);



        let pos_mesa    = this.__setTextPosition_2(padre, this);// sobre de la mesa
        pos_mesa.y += Config_R01.TAM_GRAL;


        if(i <= f){
            if(arr[i].symbol && arr[i].symbol == 'NAME'){
                let variable      = contenedor.getChildrenByName(arr[i].string);
                let posVar        = new THREE.Vector3();
                let origenPos_X   = variable.element.position.x;
                let origenPos_Xi  = origenPos_X - (Config_R01.TAM_GRAL*2);
                let __a           = this.__setText("value",variable.value,false).mesh;

                posVar.setFromMatrixPosition ( variable.element.matrixWorld );

                let varIzq = new TWEEN.Tween(variable.element.position)
                    .to         ({ x:origenPos_Xi },Controles.getVelocidad())
                    .easing     (TWEEN.Easing.Quadratic.In)
                    .onComplete ( function (){
                        let position_B = _this.__setTextPosition_2(variable, _this);// Origen
                        __a.position.set(position_B.x, position_B.y, position_B.z); 
                        __a.visible = true;
                    });

                let txtPos = new TWEEN.Tween(__a.position)
                    .to         (pos_mesa,Controles.getVelocidad()).easing(TWEEN.Easing.Quadratic.In)
                    .onComplete ( function (){
                        let value_3     = _this.text.children[4] || null;
                        if(value_3){
                            let value_2     = _this.text.children[3] || null;
                            let string = value_2.string;
                            string = string.replace(arr[i].string, value_3.string);
                            _this.text.remove(value_2);
                            _this.text.remove(value_3);

                            let pato = _this.__setText("value",string);
                            pato.mesh.position.set(pos_mesa.x, pos_mesa.y, pos_mesa.z);
                            pato.geo.center();
                        }
                        _this._setText4( arr, i+1, f);
                    });
                let varDer = new TWEEN.Tween(variable.element.position)
                    .to         ({ x:origenPos_X },Controles.getVelocidad())
                    .easing     (TWEEN.Easing.Quadratic.In);
                
                varIzq.chain(txtPos);
                txtPos.chain(varDer);
                varIzq.start();            
            }
            else if(arr[i].ext == 'ext'){
                let _a = this.__setText("value",arr[i].string,false);
                let __a = _a.mesh;
                     _a.geo.center();
                    __a.position.set(pos_mesa.x, pos_mesa.y-Config_R01.TAM_GRAL, pos_mesa.z);
                    __a.visible = true;
           
                 new TWEEN.Tween(__a.position)
                    .to         ({y:pos_mesa.y},Controles.getVelocidad())
                    .easing     (TWEEN.Easing.Quadratic.In)
                    .onComplete ( function (){                            
                        let value_3     = _this.text.children[4] || null;
                        if(value_3){
                            let value_2     = _this.text.children[3] || null;
                            let string = value_2.string + " "+value_3.string;
                            _this.text.remove(value_2);
                            _this.text.remove(value_3);

                            let pato = _this.__setText("value",string);

                            pato.mesh.position.set(pos_mesa.x, pos_mesa.y, pos_mesa.z);
                            pato.geo.center();

                        }
                        _this._setText4( arr, i+1, f);
                    }).start();
            }
            else{
                _this._setText4( arr, i+1, f);
            }
        }
        else if(i == f+1){

            new TWEEN.Tween({x:0})
                .to         ({x:20},Controles.getVelocidad())
                .easing     (TWEEN.Easing.Quadratic.In)
                .onComplete ( function (){                            
                    let value_2     = _this.text.children[3] || null;
                    if(value_2){

                        let string = arr[arr.length-1].string;
                        _this.text.remove(value_2);

                        let pato = _this.__setText("value",string);
                        pato.mesh.position.set(pos_mesa.x, pos_mesa.y, pos_mesa.z);
                        //pato.geo.center();

                        let po = _this.__setTextPosition_1(3);

                        new TWEEN.Tween(pato.mesh.position)
                            .to         (po,Controles.getVelocidad())
                            .easing     (TWEEN.Easing.Quadratic.In)
                            .onComplete ( function (){    
                                let value_1     = _this.text.children[2] || null;
                                let value_2     = _this.text.children[3] || null;   

                                _this.text.remove(value_1);
                                if(_this.value == 'false'){
                                    R01.ifOutfalse();
                                }else{
                                    Main.TriggerNextStep();
                                }
                                                             
                            }).start();
                    }
                }).start();            
        }
    }
    _setText5(arr, i, f){

        let _this       = this;
        let idPadre         = R01.getIdsAncestros().p;
        let idContenedor    = R01.getIdsAncestros().c;
        let contenedor      = R01.lstElements.getChildrenById(idContenedor);
        let padre           = R01.lstElements.getChildrenById(idPadre);



        let pos_mesa    = this.__setTextPosition_2(padre, this);// sobre de la mesa
        pos_mesa.y += Config_R01.TAM_GRAL;


        if(i <= f){
            if(arr[i].symbol && arr[i].symbol == 'NAME'){
                let variable      = contenedor.getChildrenByName(arr[i].string);
                let posVar        = new THREE.Vector3();
                let origenPos_X   = variable.element.position.x;
                let origenPos_Xi  = origenPos_X - (Config_R01.TAM_GRAL*2);
                let __a           = this.__setText("value",variable.value,false).mesh;

                posVar.setFromMatrixPosition ( variable.element.matrixWorld );

                let varIzq = new TWEEN.Tween(variable.element.position)
                    .to         ({ x:origenPos_Xi },Controles.getVelocidad())
                    .easing     (TWEEN.Easing.Quadratic.In)
                    .onComplete ( function (){
                        let position_B = _this.__setTextPosition_2(variable, _this);// Origen
                        __a.position.set(position_B.x, position_B.y, position_B.z); 
                        __a.visible = true;
                    });

                let txtPos = new TWEEN.Tween(__a.position)
                    .to         (pos_mesa,Controles.getVelocidad()).easing(TWEEN.Easing.Quadratic.In)
                    .onComplete ( function (){
                        let value_3     = _this.text.children[4] || null;
                        if(value_3){
                            let value_2     = _this.text.children[3] || null;
                            let string = value_2.string;
                            string = string.replace(arr[i].string, value_3.string);
                            _this.text.remove(value_2);
                            _this.text.remove(value_3);

                            let pato = _this.__setText("value",string);
                            pato.mesh.position.set(pos_mesa.x, pos_mesa.y, pos_mesa.z);
                            pato.geo.center();
                        }
                        _this._setText5( arr, i+1, f);
                    });
                let varDer = new TWEEN.Tween(variable.element.position)
                    .to         ({ x:origenPos_X },Controles.getVelocidad())
                    .easing     (TWEEN.Easing.Quadratic.In);
                
                varIzq.chain(txtPos);
                txtPos.chain(varDer);
                varIzq.start();            
            }
            else if(arr[i].ext == 'ext'){
                let _a = this.__setText("value",arr[i].string,false);
                let __a = _a.mesh;
                     _a.geo.center();
                    __a.position.set(pos_mesa.x, pos_mesa.y-Config_R01.TAM_GRAL, pos_mesa.z);
                    __a.visible = true;
           
                 new TWEEN.Tween(__a.position)
                    .to         ({y:pos_mesa.y},Controles.getVelocidad())
                    .easing     (TWEEN.Easing.Quadratic.In)
                    .onComplete ( function (){                            
                        let value_3     = _this.text.children[4] || null;
                        if(value_3){
                            let value_2     = _this.text.children[3] || null;
                            let string = value_2.string + " "+value_3.string;
                            _this.text.remove(value_2);
                            _this.text.remove(value_3);

                            let pato = _this.__setText("value",string);

                            pato.mesh.position.set(pos_mesa.x, pos_mesa.y, pos_mesa.z);
                            pato.geo.center();

                        }
                        _this._setText5( arr, i+1, f);
                    }).start();
            }
            else{
                _this._setText5( arr, i+1, f);
            }
        }
        else if(i == f+1){

            new TWEEN.Tween({x:0})
                .to         ({x:10},Controles.getVelocidad())
                .easing     (TWEEN.Easing.Quadratic.In)
                .onComplete ( function (){                            
                    let value_2     = _this.text.children[3] || null;
                    if(value_2){

                        let string = arr[arr.length-1].string;
                        _this.text.remove(value_2);

                        let pato = _this.__setText("value",string);
                        pato.mesh.position.set(pos_mesa.x, pos_mesa.y, pos_mesa.z);
                        //pato.geo.center();

                        let po = _this.__setTextPosition_1(3);

                        R01.MethodOut();
                        let a = new TWEEN.Tween({x:0})
                            .to         ({x:20},Controles.getVelocidad())
                            .easing     (TWEEN.Easing.Quadratic.In);

                        let b = new TWEEN.Tween(pato.mesh.position)
                            .to         (po,Controles.getVelocidad())
                            .easing     (TWEEN.Easing.Quadratic.In)
                            .onComplete ( function (){    
                                let value_1     = _this.text.children[2] || null;
                                let value_2     = _this.text.children[3] || null;   

                                _this.text.remove(value_1);
                                
                                
                                                             
                            });
                        a.chain(b);
                        a.start();
                    }
                }).start();            
        }
    }
    getSonByIndex(index){

        return this._sons.children[index];    
    }
    setTextType (txt, siguientePaso=false, animar=false){
        
        this._setText("type",  1, txt, siguientePaso, animar, null);
    }
    setTextName (txt, siguientePaso=false, animar=false){

        this._setText("name",  2, txt, siguientePaso, animar, null);
    }
    setTextValue(txt, siguientePaso=false, animar=false){
        let valorAnterior = this._text.getObjectByName("value") || null;
        this._setText("value", 3, txt, siguientePaso, animar, valorAnterior);
    }
    setTextValueParam(txt, origen, siguientePaso=false, animar=true){
        let valorAnterior = this._text.getObjectByName("value");
        this._setText2("value", 3, txt, siguientePaso, animar, valorAnterior, origen);
    }
    getChildrenByName(name, profundidad = false){
        // http://jsfiddle.net/dystroy/MDsyr/
        // Retorna la primera coincidencia
        let getSubMenuItem = function (subMenuItems, name) {
            if (subMenuItems) {
                for (let i = 0; i < subMenuItems.length; i++) {
                    if (subMenuItems[i].name == name) {
                        return subMenuItems[i];
                    };
                    if(profundidad){
                        let found = getSubMenuItem(subMenuItems[i].children, name);
                        if (found) return found;
                    }
                }
            }
        };

        let searchedItem = getSubMenuItem(this._children, name) || null;
        return searchedItem;
    }
    getChildrenById(id){
        // http://jsfiddle.net/dystroy/MDsyr/
        // Retorna la primera coincidencia
        let getSubMenuItem = function (subMenuItems, id) {
            if (subMenuItems) {
                for (let i = 0; i < subMenuItems.length; i++) {
                    if (subMenuItems[i].id == id) {
                        return subMenuItems[i];
                    };
                    let found = getSubMenuItem(subMenuItems[i].children, id);
                    if (found) return found;
                
                }
            }
        };
        let searchedItem = getSubMenuItem(this._children, id) || null;
        return searchedItem;
    }
    add(element){
        this.children.push(element); // añade al arbol 
        this.sons.add(element.element); // añade a la escena
    }

}