function Select({opts, id, cls}) {
  function Option({opt}) {
    return <option className="opt" value={opt}>{opt}</option>;
  }
  let optionFields = [];
  for (let i = 0; i < opts.length; i++) {
    let opt = opts[i];
    optionFields.push(new Option({opt}));
  }
  return <select className={cls} id={id}>{optionFields}</select>;
}

function Cell(value) {
  return <td>{value}</td>;
}

function Row(values) {
  let cells = [];
  for (let i = 0; i < values.length; i++) {
    let f = values[i];
    cells.push(Cell(f));
  }
  return <tr>{cells}</tr>;
}

function ResultTable({resultValues}) {
  if (resultValues.length===0) {
    return <div className="w3-panel w3-red"><p>
    Keine Ergebnisse gefunden</p></div>
  }
  let rows = [];
  for (let i = 0; i < resultValues.length; i++) {
    let values = resultValues[i];
    rows.push(Row(values));
  }
  return <table className="w3-table-all w3-card-4">{rows}</table>;
}

async function createOptions(option) {
  let queryResult = await getRecords();
  // Optionen aus dem Gesamtergebnis extrahieren
  // und Duplikate entfernen
  var opts = queryResult.map(function (result) {
    return result[option];
  }).filter(function(value ,index, self) {
    return self.indexOf(value) === index;
  });
  let id = 'select_' + option;
  let cls = 'selectOption';
  ReactDOM.render(
    <Select opts={opts} id={id} cls={cls}/>,
    document.getElementById(option));
}

function renderResults(results) {
  let resultValues = [];
  for (let i = 0; i < results.length; i++) {
    let res = results[i];
    let values = Object.values(res);
    resultValues.push(values);
  }
  console.log(resultValues);
  ReactDOM.render(
    <ResultTable resultValues={resultValues} />,
    document.getElementById('result'));
}

function getResults(keys, operator) {
  let cursor = getRecords(keys, fieldsToShow, operator).then(renderResults);
}

class ShowResults extends React.Component {
  constructor(props) {
    super(props);
    this.state = { resultsPending : false };
  }
  onClick() {
    this.setState({ resultsPending : true });
    // Zunächst die alten Ergebnisse entfernen, falls vorhanden
    ReactDOM.unmountComponentAtNode(document.getElementById('result'));
    //
    var selectedOptions = document.querySelectorAll('.selectOption');
    let options = [];
    for (var i = 0; i < selectedOptions.length; i++) {
      let index = selectedOptions[i].selectedIndex;
      options.push(selectedOptions[i][index].value);
    }
    let chkbx = document.querySelector('input[type=checkbox]');
    if (chkbx.checked) {
      getResults(options, chkbx.value); // chkbx.value = OR
    } else {
      getResults(options, '');
    }
    this.setState({ resultsPending : false });
  }
  render() {
    if (this.state.resultsPending) {
      return <button type="button" className="w3-btn w3-disabled" disabled>
      Warten auf Ergebnisse...</button>;
    } else {
      return <button type="button" className="w3-btn w3-black"
      onClick={this.onClick.bind(this)}>Ergebnisse anzeigen</button>;
    }
  }
}
ReactDOM.render(<ShowResults />, document.getElementById('send'));

// Auswahllisten erstellen
createOptions('room');
createOptions('topic');

// Welche Informationen sollen im Gesamtergebnis angezeigt werden?
var fieldsToShow = ['topic', 'title', 'room', 'time'];
