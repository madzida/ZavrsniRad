const valid = (values) => {
  let errors = {};
  if (!values.number) {
    errors.number = "Potrebno je unijeti broj razreda";
  }
  if (
    (values.number < 1 || values.number > 4 || isNaN(values.number)) &&
    values.number
  ) {
    errors.number = "Niste unijeli razred u rasponu od prvog do četvrtog";
  }
  if (!values.letter) {
    errors.letter = "Potrebno je unijeti slovo razreda";
  }
  if (values.letter && !isNaN(values.letter)) {
    errors.letter = "Niste unijeli slovo";
  }
  if (!values.name) {
    errors.name = "Potrebno je unijeti ime škole";
  }
  return errors;
};
export default valid;
