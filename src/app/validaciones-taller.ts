import { AbstractControl, ValidationErrors } from "@angular/forms";

export class ValidacionesTaller {

    static noNum(control: AbstractControl): ValidationErrors| null{
        let valor = control.value;
        
        if (valor === null || valor === '') return null;

        if (Number.isInteger(Number(valor))) {
        return { noNum: true };
        }

        return null;
    }

    static actual(control: AbstractControl): ValidationErrors| null{
        let fecha = control.value;
        
        if (fecha === null || fecha === '') return null;

        let [dia, mes, anio] = fecha.split('/').map(Number);
        let fechas = new Date(anio, mes - 1, dia);

        // para comprobar que la fecha existe
        if (fechas.getFullYear() !== anio || fechas.getMonth() !== mes - 1 || fechas.getDate() !== dia) {
            return { actual: true };
        }

        return null;
    }

    static noLetras(control: AbstractControl): ValidationErrors| null{
        let valor = control.value;
        
        if (valor === null || valor === '') return null;

        if (!Number.isInteger(Number(valor)) || Number(valor) < 1) {
        return { noLetras: true };
        }

        return null;
    }

    public static provincias: { [codigo: string]: string } = {"01":"Álava","02":"Albacete","03":"Alicante","04":"Almería","05":"Ávila","06":"Badajoz","07":"Islas Baleares","08":"Barcelona","09":"Burgos","10":"Cáceres","11":"Cádiz","12":"Castellón","13":"Ciudad Real","14":"Córdoba","15":"A Coruña","16":"Cuenca","17":"Girona","18":"Granada","19":"Guadalajara","20":"Guipúzcoa","21":"Huelva","22":"Huesca","23":"Jaén","24":"León","25":"Lleida","26":"La Rioja","27":"Lugo","28":"Madrid","29":"Málaga","30":"Murcia","31":"Navarra","32":"Ourense","33":"Asturias","34":"Palencia","35":"Las Palmas","36":"Pontevedra","37":"Salamanca","38":"Santa Cruz de Tenerife","39":"Cantabria","40":"Segovia","41":"Sevilla","42":"Soria","43":"Tarragona","44":"Teruel","45":"Toledo","46":"Valencia","47":"Valladolid","48":"Vizcaya","49":"Zamora","50":"Zaragoza","51":"Ceuta","52":"Melilla"};

    static provicias(control: AbstractControl): ValidationErrors| null{
        let cp = control.value;
        
        const digitos = cp.slice(0, 2);
        return ValidacionesTaller.provincias[digitos]
        ? null
        : { provicias: true };
    }


    public static ciudads = { "A Coruña": true, "Álava": true, "Albacete": true, "Alicante": true, "Almería": true, "Asturias": true, "Ávila": true, "Badajoz": true, "Barcelona": true, "Burgos": true, "Cáceres": true, "Cádiz": true, "Cantabria": true, "Castellón": true, "Ciudad Real": true, "Córdoba": true, "Cuenca": true, "Girona": true, "Granada": true, "Guadalajara": true, "Gipuzkoa": true, "Huelva": true, "Huesca": true, "Islas Baleares": true, "Jaén": true, "La Rioja": true, "Las Palmas": true, "León": true, "Lleida": true, "Lugo": true, "Madrid": true, "Málaga": true, "Murcia": true, "Navarra": true, "Ourense": true, "Palencia": true, "Pontevedra": true, "Salamanca": true, "Santa Cruz de Tenerife": true, "Segovia": true, "Sevilla": true, "Soria": true, "Tarragona": true, "Teruel": true, "Toledo": true, "Valencia": true, "Valladolid": true, "Bizkaia": true, "Zamora": true, "Zaragoza": true, "Alcalá de Henares": true, "Móstoles": true, "Fuenlabrada": true, "Leganés": true, "Getafe": true, "Torrejón de Ardoz": true, "Alcobendas": true, "Santander": true, "Gijón": true, "Vigo": true, "Elche": true, "Reus": true, "Tarrasa": true, "Sabadell": true, "Badalona": true, "Hospitalet de Llobregat": true, "Pamplona": true, "Donostia-San Sebastián": true, "Vitoria-Gasteiz": true, "Granollers": true, "Castellón de la Plana": true, "Algeciras": true, "Jerez de la Frontera": true, "Marbella": true, "Torremolinos": true, "Benidorm": true, "Cartagena": true, "Lorca": true };

    static ciudades(control: AbstractControl): ValidationErrors| null{

        const ciudad = control.value as string | null;

        if (!ciudad || !(ciudad in ValidacionesTaller.ciudads)) {
            return { ciudades: true }; 
        }
        
        return null;
    }

    static numInvalido(num1: number, num2: number){
        console.log(num1 + 'y' + num2)
        return (control: AbstractControl): ValidationErrors | null => {
            if (control.value === null || control.value === undefined) return null;

            const valor = Number(control.value);
            const resultado = num1 + num2;

            if (isNaN(valor)) return { numInvalido: true };

            return valor !== resultado ? { numInvalido: true } : null;
        };
    }
   

}
