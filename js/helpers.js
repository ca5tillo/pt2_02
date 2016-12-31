function *GenerateID(){
    var i = 0;
    while(true){
        yield i;
        i++;
    }
}
var analisisSintactico_generateID = GenerateID();
var dibujando_generateID = GenerateID();

function getElementLibByName(name){
    let x = null;
    for(let i of lstElements.subElements){
        if (i.name == name)
            x = i;
    }
    return x;
}