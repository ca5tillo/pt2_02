class Metodo extends Element{
	constructor(nombre,my_padre){
		super();	
		this._name                  = "element_metodo-" + nombre;	
		this._element.my_padre      = "group_libreria-" + my_padre;// libreria a la que pretenece
		this._element.name          = "group_metodo-"   + nombre;
    	this._element.my_name       = nombre;
	}
}