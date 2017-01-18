var ejemploDeCodigo_01 = 
`public class Clase{
    public static void main(String[] args){
        int     a;
        String  cadena = "texto";
        int     b      = 10;
        boolean c      = true;
        int[]   edad   = {45, 23, 11, 9};

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
        return a;
    }
    public static void main() {
        int a = 10; int b = 20;
        int e = pasoParametros(a, b, "envio");
            a = pasoParametros(a, e, "texto");
    }
}`;

var ejemploDeCodigo_03 =
`public class MyClass {
    public static void main() {
        int i = 0;
            i = 5+8;
    }
}`;
var ejemploDeCodigo_04 =`public class MyClass {
        public static void otroMetodo2(){
            int i = 9;
            i=100;
            int[] edad = {45, 23, 11, 9};   
        }
        public static void otroMetodo(){
            int i = 9;
            i=100;
            int[] edad = {45, 23, 11, 9};  
            otroMetodo2();  
        }
        public static void main() {
            int[] edad = {45, 23, 11, 9};    
            otroMetodo();  
            int i = 0;
            otroMetodo();  
            int b;
            otroMetodo(); 
            i=55;
            otroMetodo(); 
        }
    }
`;




//https://dcrazed.com/free-responsive-html5-css3-templates/
//https://html5up.net/
//https://html5up.net/spectral

//http://finalmesh.com/webgl/industry/
//https://threejs.org/examples/#webgl_multiple_elements
//https://threejs.org/examples/#webgl_geometry_extrude_splines
//http://idflood.github.io/ThreeNodes.js/index_optimized.html#ExportImage
//http://peoplebehindthepixels.com/

/*

package test;

public class Test {
    public int numerito = 9;
 
    public static void main(String[] args) {
        Test t = new Test();
        System.out.println(t.numerito);
        t.test();
        Test.test();
        test();
    }
    public static void test(){
    int i=9;
    String f = "Hola mundo";
    double[ ] estatura = {1.73, 1.67, 1.56}; //Array de 3 elementos
    String[ ] nombre = {"María", "Gerson"};   //Array de 2 elementos
    
     int[][]  matriz = new int[3][2];
     
     matriz[0][0] = 1; matriz[0][1] = 2; matriz[1][0] = 3; matriz[1][1] = 4; matriz[2][0] = 5; matriz[2][1] = 6;
        
        for(int j =0; j<nombre.length; j++){
             System.out.println(nombre[j]);
        }
    }
    
}




*/