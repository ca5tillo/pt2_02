function getIdsAncestros(){
    let ids = {p:0,c:0};
    if (lstIDsMetodos.children.length > 0){        
        let index_1 = lstIDsMetodos.children.length-1;
        let index_2 = lstIDsMetodos.children[index_1].children.length;

        ids.c       =  lstIDsMetodos.children[index_1].id;
        ids.p       =  index_2 > 0 ? lstIDsMetodos.children[index_1].children[index_2-1].id  :  ids.c;
    }
    return ids;
}