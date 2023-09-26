
const validation=(values)=>{
  let errors ={};
  if(!values.fullname){
    errors.fullname="Potrebno je unijeti ime";
  }
  if(!values.email){
    errors.email="Potrebno je unijeti e-mail";
  }else if(!/.+@.+/.test(values.email)){
    errors.email="E-mail je neispravan";
  }
  if(!values.password){
    errors.password="Potrebno je unijeti lozinku"
  }else if(values.password.length<6){
    errors.password="Lozinka se mora sastojati od barem šest znakova"
  }
  return errors;
}
export default validation;