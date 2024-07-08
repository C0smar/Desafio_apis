const ingresarPedido = document.getElementById("ingresoPedido");
const seleccionar = document.getElementById("seleccionador");
const btn = document.getElementById("boton");
const result = document.getElementById("resultado");
let consulta = false;

async function obtenerMonedas() {
  try {
    let data;
    let html = "";
    const res = await fetch("https://mindicador.cl/api");
    data = await res.json();
    const indicadores = Object.keys(data).filter((key) => key !== "version" && key !== "autor" && key !== "fecha").map((key) => ({
        codigo: data[key].codigo,
        valor: data[key].valor,
      }));
    for (indicador of indicadores) {
      html += `<option value="${indicador.codigo}">${indicador.codigo}</option>`;
    }
    seleccionar.innerHTML = html;
  } catch (error) {
    alert("Fallo conexión con API");
  }
}

async function obtenerYCrearDatosMoneda() {
  try {
    const selectMoneda = seleccionar.value;
    let clp = ingresarPedido.value;
    const res = await fetch(`https://mindicador.cl/api/${selectMoneda}`);
    const coin = await res.json();
    let valor = coin.serie[0].valor;
    let total = clp / valor;
    result.innerHTML = `<p id="resultado"> Resultado : ${total.toFixed(2)} </p>`;

    const ultimosDiezDias = coin.serie.slice(0, 10).reverse();
    const labels = ultimosDiezDias.map((dia) => {
      return dia.fecha;
    });

    const data = ultimosDiezDias.map((dia) => {
      const valor = dia.valor;
      return Number(valor);
    });

    const datasets = [
      {
        label: selectMoneda,
        borderColor: "rgb(255,99,132)",
        data,
      },
    ];
    return { labels, datasets };
  } catch (error) {
    alert("Fallo conexión con API");
  }
}

async function renderGrafica() {
  try {
    const data = await obtenerYCrearDatosMoneda();
    const config = {
      type: "line",
      data,
    };
    const myChart = document.getElementById("myChart");
    myChart.style.backgroundColor = "white";
    if (myChart.chart) {
      myChart.chart.destroy();
    }
    myChart.chart = new Chart(myChart, config);
  } catch (error) {
    alert("Fallo conexión con API");
  }
}

document.addEventListener("DOMContentLoaded", () => {
  if (!consulta) { 
    console.log("consulta api");
    obtenerMonedas();
    consulta = true;
  }
});
btn.addEventListener("click", renderGrafica);
