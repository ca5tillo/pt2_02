const RE_IS_ARREGLO    = /^(BYTE|SHORT|INT|LONG|FLOAT|DOUBLE|BOOLEAN_LITERAL|CHAR|STRING)LBRACKRBRACK/;

const RE_DEF_CLASE     = /^(PUBLIC|PRIVATE)?CLASSNAME(?=LBRACE)/;
const RE_DEF_METODO    = /^(PUBLIC|PRIVATE)?(STATIC)(VOID|BOOLEAN|INT|FLOAT|DOUBLE|STRING)NAMELPAREN.*(?=RPARENLBRACE)/;
const RE_VAR_01        = /^(VOID|BOOLEAN|INT|FLOAT|DOUBLE|STRING)NAME(?=SEMICOLON)/;
const RE_VAR_02        = /^(VOID|BOOLEAN|INT|FLOAT|DOUBLE|STRING)NAME(EQ)(NUM|CADENA|BOOLEAN_LITERAL)(?=SEMICOLON)/;

const RE_ASIGNACION_01 = /^NAME(PLUSPLUS)(?=SEMICOLON)/;
const RE_ASIGNACION_02 = /^NAME(MINUSMINUS)(?=SEMICOLON)/;
const RE_ASIGNACION_03 = /^NAMEEQ(NAME)(?=SEMICOLON)/;
const RE_ASIGNACION_04 = /^NAMEEQ(PLUS|MINUS)?(NUM)(?=SEMICOLON)/;
const RE_ASIGNACION_05 = /^NAMEEQ(LPAREN)*(NUM|NAME|CADENA)((LPAREN|RPAREN)*(PLUS|MINUS|MULT|DIV|MOD)(LPAREN|RPAREN)*(NUM|NAME|CADENA))+(RPAREN)*(?=SEMICOLON)/;
const RE_ASIGNACION_06 = /^NAMEEQ(CADENA|BOOLEAN_LITERAL)(?=SEMICOLON)/;


const RE_ARREGLO = /^(PUBLIC|PRIVATE)?(BYTE|SHORT|INT|LONG|FLOAT|DOUBLE|BOOLEAN_LITERAL|CHAR|STRING)LBRACKRBRACKNAMEEQLBRACE.*(?=RBRACESEMICOLON)/;

const RE_LLAMADA_FUNCION = /^NAMELPAREN.*RPAREN(?=SEMICOLON)/;
const RE_LLAMADA_FUNCION_RETURN   = /^(NAME)EQ(NAME)LPAREN.+RPAREN(?=SEMICOLON)/;
const RE_LLAMADA_FUNCION_RETURN_1 = /^(VOID|BOOLEAN|INT|FLOAT|DOUBLE|STRING)(NAME)EQ(NAME)LPAREN.+RPAREN(?=SEMICOLON)/;
const RE_RETURN_VARIABLE = /^RETURNNAME(?=SEMICOLON)/;
const RE_RERUEN_NUM = /^RETURNNUM(?=SEMICOLON)/;


const RE_IF = /^IFLPAREN.*(?=RPARENLBRACE)/;
const RE_ELSE = /^ELSE(?=LBRACE)/;

//	for (  j = 0 ; j < 10 ; j ++ ) { 
const RE_FOR_0 = /^FORLPARENNAMEEQNUM(SEMICOLON)NAME(GT|LT|LTEQ|GTEQ|NOTEQ)(NUM)(SEMICOLON)NAME(PLUSPLUS|MINUSMINUS)(?=RPARENLBRACE)/;

