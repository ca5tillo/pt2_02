

function *MainGenerador(arr){ for(let i of arr){ yield i; } }
function *GenerateID   (){var i = 0;while(true){yield i;i++;}}



function getElementLibByName(name){
    let x = null;
    for(let i of lstElements.children){
        if (i.name == name)
            x = i;
    }
    return x;
}