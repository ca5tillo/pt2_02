class Metodo extends Element{
	constructor(instruccion){
		super();	
		let nameInterno             = `${instruccion.tipo}_${instruccion.nombre}`;
		
		this._id                    = `${instruccion.id}`;
        this._idPadre               = `${instruccion.idPadre}`;
		this._name                  = nameInterno;	
	}
}