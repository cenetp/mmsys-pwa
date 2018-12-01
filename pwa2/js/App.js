function addAll() {
  return function() {
    let sumAll = 0;
    let summands = document.querySelectorAll('.summand > input');
    for (let i = 0; i < summands.length; i++) {
      let s = summands[i].value;
      if (parseFloat(s).toString() === 'NaN') {
        if (s.length > 0) {
          sumAll = 'Summe ungültig.';
          break;
        } else {
          continue;
        }
      } else {
        sumAll += parseFloat(s);
      }
    }
    ReactDOM.render(
      <EqualsField sum={sumAll} />,
      document.getElementById('result')
    );
  }
}

function InputField() {
  return (
    <div className="summand" onChange={addAll()}><input/>
    <div className="plus">+</div></div>
  );
}

function EqualsField({sum}) {
  return (
    <p id="equals">{sum}</p>
  );
}

function CalcForm({howMany}) {
  let inputFields = [];
  for (let i = 0; i < parseInt(howMany); i++) {
    inputFields.push(InputField());
  }
  return <form>
    {inputFields} =
    <div id="result"></div>
  </form>;
}

ReactDOM.render(<CalcForm howMany='3' />, document.getElementById('root'));
