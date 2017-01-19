const RE_IS_ARREGLO = /^(BYTE|SHORT|INT|LONG|FLOAT|DOUBLE|BOOLEAN_LITERAL|CHAR|STRING)LBRACKRBRACK/;

const RE_DEF_CLASE  = /^(PUBLIC|PRIVATE)?CLASSNAME(?=LBRACE)/;
const RE_DEF_METODO = /^(PUBLIC|PRIVATE)?(STATIC)(VOID|BOOLEAN|INT|FLOAT|DOUBLE|STRING)NAMELPAREN.*(?=RPARENLBRACE)/;
const RE_DEF_VAR_INICIALIZADA = /^(VOID|BOOLEAN|INT|FLOAT|DOUBLE|STRING)NAME(EQ)(NUM|CADENA|BOOLEAN_LITERAL)(?=SEMICOLON)/;
const RE_DEF_VAR_NO_INICIALIZADA = /^(VOID|BOOLEAN|INT|FLOAT|DOUBLE|STRING)NAME(?=SEMICOLON)/;
const RE_ASIGNACION_DE_VALOR = /^NAMEEQ(NUM|CADENA|BOOLEAN_LITERAL)(?=SEMICOLON)/;
const RE_ARREGLO = /^(PUBLIC|PRIVATE)?(BYTE|SHORT|INT|LONG|FLOAT|DOUBLE|BOOLEAN_LITERAL|CHAR|STRING)LBRACKRBRACKNAMEEQLBRACE.*(?=RBRACESEMICOLON)/;

const RE_LLAMADA_FUNCION = /^NAMELPAREN.*RPAREN(?=SEMICOLON)/;
const RE_LLAMADA_FUNCION_RETURN   = /^(NAME)EQ(NAME)LPAREN.+RPAREN(?=SEMICOLON)/;
const RE_LLAMADA_FUNCION_RETURN_1 = /^(VOID|BOOLEAN|INT|FLOAT|DOUBLE|STRING)(NAME)EQ(NAME)LPAREN.+RPAREN(?=SEMICOLON)/;
const RE_RETURN_VARIABLE = /^RETURNNAME(?=SEMICOLON)/;


const RE_SUMARESTADIVMULT = /^NAMEEQ(LPAREN)*NUM((LPAREN|RPAREN)*(PLUS|MINUS|MULT|DIV|MOD)(LPAREN|RPAREN)*NUM)+(RPAREN)*(?=SEMICOLON)/;
const RE_IF = /^IFLPAREN.*(?=RPARENLBRACE)/;
const RE_ELSE = /^ELSE(?=LBRACE)/;
