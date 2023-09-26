const valid = (values) => {
  let errors = {};
  if (!values.question) {
    errors.question = "Potrebno je unijeti pitanje";
  }
  if (!values.correct) {
    errors.correct = "Potrebno je unijeti točan odgovor";
  }
  if (values.suggested && values.suggested.indexOf(values.correct) === -1) {
    errors.suggested = "Niste unijeli točan odgovor u ponuđenim odgovorima";
  }
  if (values.suggested && values.suggested.split(",").length === 1) {
    errors.suggested = "Niste odvojili ponuđene odgovore zarezom";
  }
  if (values.suggested && values.suggested.split(",").length > 3) {
    errors.suggested = "Maksimalan broj ponuđenih odgovora je tri";
  }

  return errors;
};
export default valid;
