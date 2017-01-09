var tab_symbol = [];
var tab_symbol_Type = [];
  /* keywords */
  tab_symbol['abstract']                     ='ABSTRACT';
  tab_symbol['boolean']                      ='BOOLEAN';
  tab_symbol['break']                        ='BREAK';
  tab_symbol['byte']                         ='BYTE';
  tab_symbol['case']                         ='CASE';
  tab_symbol['catch']                        ='CATCH';
  tab_symbol['char']                         ='CHAR';
  tab_symbol['class']                        ='CLASS';
  tab_symbol['const']                        ='CONST';
  tab_symbol['continue']                     ='CONTINUE';
  tab_symbol['do']                           ='DO';
  tab_symbol['double']                       ='DOUBLE';
  tab_symbol['else']                         ='ELSE';
  tab_symbol['extends']                      ='EXTENDS';
  tab_symbol['final']                        ='FINAL';
  tab_symbol['finally']                      ='FINALLY';
  tab_symbol['float']                        ='FLOAT';
  tab_symbol['for']                          ='FOR';
  tab_symbol['default']                      ='DEFAULT';
  tab_symbol['implements']                   ='IMPLEMENTS';
  tab_symbol['import']                       ='IMPORT';
  tab_symbol['instanceof']                   ='INSTANCEOF';
  tab_symbol['int']                          ='INT';
  tab_symbol['interface']                    ='INTERFACE';
  tab_symbol['long']                         ='LONG';
  tab_symbol['native']                       ='NATIVE';
  tab_symbol['new']                          ='NEW';
  tab_symbol['goto']                         ='GOTO';
  tab_symbol['if']                           ='IF';
  tab_symbol['public']                       ='PUBLIC';
  tab_symbol['short']                        ='SHORT';
  tab_symbol['super']                        ='SUPER';
  tab_symbol['switch']                       ='SWITCH';
  tab_symbol['synchronized']                 ='SYNCHRONIZED';
  tab_symbol['package']                      ='PACKAGE';
  tab_symbol['private']                      ='PRIVATE';
  tab_symbol['protected']                    ='PROTECTED';
  tab_symbol['transient']                    ='TRANSIENT';
  tab_symbol['return']                       ='RETURN';
  tab_symbol['void']                         ='VOID';
  tab_symbol['static']                       ='STATIC';
  tab_symbol['while']                        ='WHILE';
  tab_symbol['this']                         ='THIS';
  tab_symbol['throw']                        ='THROW';
  tab_symbol['throws']                       ='THROWS';
  tab_symbol['try']                          ='TRY';
  tab_symbol['volatile']                     ='VOLATILE';
  tab_symbol['strictfp']                     ='STRICTFP';
  
  /* boolean literals */
  tab_symbol['true']                         ='BOOLEAN_LITERAL';
  tab_symbol['false']                        ='BOOLEAN_LITERAL';
  
  /* null literal */
  tab_symbol['null']                         ='NULL_LITERAL';
  
  
  /* separators */
  tab_symbol['(']                            ='LPAREN';
  tab_symbol[')']                            ='RPAREN';
  tab_symbol['{']                            ='LBRACE';
  tab_symbol['}']                            ='RBRACE';
  tab_symbol['[']                            ='LBRACK';
  tab_symbol[']']                            ='RBRACK';
  tab_symbol[';']                            ='SEMICOLON';
  tab_symbol[',']                            ='COMMA';
  tab_symbol['.']                            ='DOT';
  
  /* operators */
  tab_symbol['=']                            ='EQ';
  tab_symbol['>']                            ='GT';
  tab_symbol['<']                            ='LT';
  tab_symbol['!']                            ='NOT';
  tab_symbol['~']                            ='COMP';
  tab_symbol['?']                            ='QUESTION';
  tab_symbol[':']                            ='COLON';
  tab_symbol['==']                           ='EQEQ';
  tab_symbol['<=']                           ='LTEQ';
  tab_symbol['>=']                           ='GTEQ';
  tab_symbol['!=']                           ='NOTEQ';
  tab_symbol['&&']                           ='ANDAND';
  tab_symbol['||']                           ='OROR';
  tab_symbol['++']                           ='PLUSPLUS';
  tab_symbol['--']                           ='MINUSMINUS';
  tab_symbol['+']                            ='PLUS';
  tab_symbol['-']                            ='MINUS';
  tab_symbol['*']                            ='MULT';
  tab_symbol['/']                            ='DIV';
  tab_symbol['&']                            ='AND';
  tab_symbol['|']                            ='OR';
  tab_symbol['^']                            ='XOR';
  tab_symbol['%']                            ='MOD';
  tab_symbol['<<']                           ='LSHIFT';
  tab_symbol['>>']                           ='RSHIFT';
  tab_symbol['>>>']                          ='URSHIFT';
  tab_symbol['+=']                           ='PLUSEQ';
  tab_symbol['-=']                           ='MINUSEQ';
  tab_symbol['*=']                           ='MULTEQ';
  tab_symbol['/=']                           ='DIVEQ';
  tab_symbol['&=']                           ='ANDEQ';
  tab_symbol['|=']                           ='OREQ';
  tab_symbol['^=']                           ='XOREQ';
  tab_symbol['%=']                           ='MODEQ';
  tab_symbol['<<=']                          ='LSHIFTEQ';
  tab_symbol['>>=']                          ='RSHIFTEQ';
  tab_symbol['>>>=']                         ='URSHIFTEQ';
  

  /*Extras*/

  tab_symbol['String']                       ='STRING';

  /*por tipo */
  tab_symbol_Type['number']                       ='NUM';
  tab_symbol_Type['string']                       ='CADENA';
  tab_symbol_Type['comment']                      ='COMMENT';