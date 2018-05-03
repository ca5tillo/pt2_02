var ejemploDeCodigo_01 = 
`/**************************************************************\
 *                            \\|//                           *
 *                            (O O)                           *
 *            +----------oOO---------------------+            *
 *            | Desarrollado por Miguel Castillo |            *
 *            +-------------------oOO------------+            *
 *                          |__|__|                           *
 *                           || ||                            *
 *                         ooO Ooo                            *
\**************************************************************/`;

var ejemploDeCodigo_02 =
`public class MyClass {
    public static void metodo(){
        int a = 9;
    }
    public static int pasoParametros(int a, int b,String txt){
        a = 69;
        metodo();
        return 999;
    }
    public static void main() {
        int a = 10; int b = 20;
        int e = pasoParametros(a, b, "envio");
            a = pasoParametros(a, e, "texto");
    }
}`;
var ejemploDeCodigo_03 =
`public class MyClass {   
    public static int resta(int y, int z){
        int a; a = y - z; return a;
    }
    public static int suma(int y, int z){
        int a;
        a = y + z;
        return a;
    }
    public static void main() {
        int a = 10; int b = 20;
        int e = suma(a, b);
            a = resta(a, e);
    }
}`;

var ejemploDeCodigo_04 =
`public class MyClass {
    public static void main() {
        int a = 5;
        int b = 5;
        int c;
            c = a + b + a;
    }
}`;
var ejemploDeCodigo_05 =
`public class MyClass {
    public static void main() {
        int a = 0;
            a = ((5+8-3)*(2+1+(0*(52552+7))))/2;
            a = 5;
            a = 100*2;
        double b;
            b = 5/2;
        double c;
            c = a / b;
    }
}`;
var ejemploDeCodigo_06 =
`public class MyClass {
    public static int factorial (int numero) {
        int temp;
        int temp2;
        int temp3;
        if (numero == 0){
            return 1;
        }
        else{
            temp  = numero-1; 
            temp2 = factorial(temp);
            temp3 = numero * temp2;
            return temp3;
            // return numero * factorial(numero-1);
        }
    }
    public static void main() {
        int resultado = factorial(3);
        
    }
}`;

//http://enrrike87.blogspot.mx/2011/06/metodos-de-ordenamiento-java_21.html
var ejemploDeCodigo_07 =
`public class MyClass {
    public static void main() {
        //METODO BURBUJA

        int temp; int i; int j; int tam; int[] array = {25,24,22,15,9,5,1,0};
        tam = array.length;

        for( i=1;i < tam;i++){
            for ( j=0 ; j < tam - 1; j++){
                int temp2; 
                int temp3;
                temp2 = array[j];
                temp3 = array[j+1];

                if ( temp2 > temp3 ){
                    temp       = array[j];
                    array[j]   = array[j+1];
                    array[j+1] = temp;
                }
            }
        }
    }
}`;
var ejemploDeCodigo_08 =
`public class MyClass {
    public static void main() {
        //METODO INSERCION 

        int i; int tam; int[] array = {25,24,22,15,9,5,1,0};
        tam = array.length;

        for ( i=1; i < tam; i++) {
            int j; int aux; int aux2;
            j    = i-1;
            aux  = array[i];
            aux2 = array[j];

            for ( j=i-1; j >= 0 && aux2 > aux; j--){
                if(j > 0){
                    aux2 = array[j-1];
                }
                array[j+1] = array[j];
            }
            array[j+1] = aux;
      }
    }
}`;
var ejemploDeCodigo_09 =
`
public class OtraClase{
    
}
public class MyClass {
    public static void main(String[] args, int z) {
        int[]  array = {25,24,22,15,9,5,1,0};
        String c     = "Hola mundo ";
        int    i     = 0, 
               b;
        
    }
    public int suma(int a, int b){

    }
}

`;
var ejemploDeCodigo_10 =
`public class MyClass {
    public static void main() {
        if (1 == 0){
        }
        else{
        }
    }
}
/* Ejemplo - aprenderaprogramar.com */
public class Taxi { //El nombre de la clase
 
    private String ciudad; //Ciudad de cada objeto taxi
    private String matricula; //Matrícula de cada objeto taxi
    private String distrito; //Distrito asignado a cada objeto taxi
    private int tipoMotor; //Tipo de motor asignado a cada objeto taxi. 0 = desconocido, 1 = gasolina, 2 = diesel
 
    //Constructor: cuando se cree un objeto taxi se ejecutará el código que incluyamos en el constructor
    public Taxi (String valorMatricula, String valorDistrito, int valorTipoMotor) {
        ciudad = "México D.F.";
        matricula = valorMatricula;
        distrito = valorDistrito;
        tipoMotor = valorTipoMotor;
    } //Cierre del constructor
 
      //Método para obtener la matrícula del objeto taxi
    public String getMatricula () { return matricula; } //Cierre del método
 
    //Método para obtener el distrito del objeto taxi
    public String getDistrito () { return distrito; } //Cierre del método  
 
    //Método para obtener el tipo de motor del objeto taxi
    public int getTipoMotor () { return tipoMotor; } //Cierre del método
 
} //Cierre de la clase
`;



//https://dcrazed.com/free-responsive-html5-css3-templates/
//https://html5up.net/
//https://html5up.net/spectral

//http://finalmesh.com/webgl/industry/
//https://threejs.org/examples/#webgl_multiple_elements
//https://threejs.org/examples/#webgl_geometry_extrude_splines
//http://idflood.github.io/ThreeNodes.js/index_optimized.html#ExportImage
//http://peoplebehindthepixels.com/
