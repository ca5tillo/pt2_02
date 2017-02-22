var ejemploDeCodigo_01 = 
`public class Clase{
    public static void main(String[] args){
        int[]   edad       = {45, 23, 11, 9};
        double[ ] estatura = {1.73, 1.67, 1.56}; //Array de 3 elementos
        String[ ] nombre   = {"María", "Gerson"};   //Array de 2 elementos
        int     a;
        String  cadena = "texto";
        int     b      = 10;
        boolean c      = true;

        a              = 10;
        cadena         = "nuevo";
        b              = 0;
        c              = false;            
    }
}`;

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
`public class MyClass {
    public static void main() {
        int i=0;
        while(i<10){
            i++;
        }
    }
}`;
var ejemploDeCodigo_10 =
`public class MyClass {
    public static void main() {
        if (1 == 0){
        }
        else{
        }
    }
}`;



//https://dcrazed.com/free-responsive-html5-css3-templates/
//https://html5up.net/
//https://html5up.net/spectral

//http://finalmesh.com/webgl/industry/
//https://threejs.org/examples/#webgl_multiple_elements
//https://threejs.org/examples/#webgl_geometry_extrude_splines
//http://idflood.github.io/ThreeNodes.js/index_optimized.html#ExportImage
//http://peoplebehindthepixels.com/
