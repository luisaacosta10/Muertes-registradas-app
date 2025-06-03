
import Papa from 'https://cdn.jsdelivr.net/npm/papaparse@5.4.1/+esm';

const select = document.getElementById('pais');
const chartDiv = document.getElementById('chart');

let data = [];

Papa.parse('./data/share-of-deaths-registered.csv', {
  download: true,
  header: true,
  complete: function(results) {
    data = results.data.filter(d => d['Proporción de muertes registradas']);
    const paises = [...new Set(data.map(d => d['Entidad']))].sort();

    paises.forEach(pais => {
      const option = document.createElement('option');
      option.value = pais;
      option.textContent = pais;
      select.appendChild(option);
    });

    select.addEventListener('change', e => {
      mostrarGrafico(e.target.value);
    });

    mostrarGrafico(paises[0]);
  }
});

function mostrarGrafico(pais) {
  const datosPais = data.filter(d => d['Entidad'] === pais);

  const trace = {
    x: datosPais.map(d => d['Año']),
    y: datosPais.map(d => parseFloat(d['Proporción de muertes registradas'])),
    mode: 'lines+markers',
    type: 'scatter',
    line: { color: '#2a7ae2' }
  };

  Plotly.newPlot(chartDiv, [trace], {
    title: `Proporción de muertes registradas en ${pais}`,
    xaxis: { title: 'Año' },
    yaxis: { title: '%' }
  });
}
