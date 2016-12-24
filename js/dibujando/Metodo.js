class Metodo extends Element{
	constructor(nameInterno,namePadre){
		super();	
		this._name                  = nameInterno;	
		this._element.my_padre      = namePadre;// libreria a la que pretenece
		this._element.name          = nameInterno;
    	this._element.my_name       = nameInterno;
	}
}