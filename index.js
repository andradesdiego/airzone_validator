
'use strict'
const validator = require('validator'); 

/*  funcion que valida los datos de entrada de una petición a una api  */

exports.validateData = (data) => {
  
  //Control de la fx; si devuelve true, la petición se procesa
  let isValid = true;
  //Control de errores; se añaden los objetos que describen el error en cada validación
  let error = [];
 
  //Para cada objeto a validar en la estructura de datos de entrada
  data.forEach(function(input) {

    //Cada objeto a validar tiene estas 3 propiedades
    const name = input.name;
    const value = input.value;
    const rules = input.validate;
    //Contiene los errores de cada validación concreta
    let inputError = [];

    //Para cada regla a validar en cada objeto 
    rules.forEach(function(rule) {

      //Control temporal para usar en negación de validaciones (ej: !isEmpty)
      const temp = true;

      //Si necesitamos validar el opuesto de la regla (la regla empieza por !)
      if (rule.name[0] === '!') {
       
        //Sustraemos el caracter ! para poder realizar la validación
        rule.name = rule.name.substr(1);
       
        // Si la regla devuelve lo mismo que la temporal
        // implica que el dato no pasa la validación 
        if (validator[rule.name](value, rule.options) === temp) {
       
          //Seteamos el return de la función
          isValid = false;
          
          //Añadimos el error al array de errores de este dato traducido a texto
          inputError.push(translateError(rule.name));
        }

        //Devolvemos la regla a su estado original para que el flujo sea correcto
        rule.name = '!' + rule.name;

        //Si la regla no viene negada ('!')
      } else {

        //Efectuamos la validación y, si es distinta de la variable 
        //de control temporal, entonces el dato no pasa la validación
        if (validator[rule.name](value, rule.options) !== temp) {

          //Seteamos el return de la función 
          isValid = false;
          
          //Añadimos el error al array de errores de este dato traducido a texto
          inputError.push(translateError(rule.name));
        }
      }
    });

    //Si el array contiene errores, los añadimos a una lista de errores del objeto
    if(inputError.length) {
      const inputListError = {};
      inputListError[name] = inputError;
      error.push(inputListError);
    }
  })
 
  //El result de la fx es un objeto con 2 propiedades;
  const result = {}
  //El .succes determina la validación de los datos en su conjunto
  result.success = isValid;
  //El .error contiene un array de objetos con los errores encontrados
  result.error = error;
  //Devuelve el objeto
  return result;
}

/*  funcion que devuelve los errores encontrados 
    en la validación de datos de entrada en la llamada a una api
*/
function translateError(error) {
  switch (error) {
    case 'isEmail':
      return `El email no es válido`
    case 'isEmpty':
      return `El campo está vacío`
    case '!isEmpty':
      return `El campo no está vacío`
    default:
      return 'error no definido';
  }
}
