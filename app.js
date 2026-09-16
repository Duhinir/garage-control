const receiptsInput = document.getElementById("receiptsInput");
const bankInput = document.getElementById("bankInput");
const monthInput = document.getElementById("monthInput");
const receiptsStatus = document.getElementById("receiptsStatus");
const bankStatus = document.getElementById("bankStatus");
const generateButton = document.getElementById("generateButton");
const resultsSection = document.getElementById("resultsSection");
const receiptCount = document.getElementById("receiptCount");
const bankLoaded = document.getElementById("bankLoaded");
const periodValue = document.getElementById("periodValue");
const reportTitle = document.getElementById("reportTitle");
const downloadButton = document.getElementById("downloadButton");

let generatedReportHtml = "";

function formatMonth(value) {
  if (!value) return "-";

  const [year, month] = value.split("-");
  const date = new Date(Number(year), Number(month) - 1, 1);

  return new Intl.DateTimeFormat("es-UY", {
    month: "long",
    year: "numeric",
  }).format(date);
}

function updateFormState() {
  const hasReceipts = receiptsInput.files.length > 0;
  const hasBankFile = bankInput.files.length > 0;
  const hasMonth = Boolean(monthInput.value);

  generateButton.disabled = !(hasReceipts && hasBankFile && hasMonth);
}

receiptsInput.addEventListener("change", () => {
  const count = receiptsInput.files.length;

  receiptsStatus.textContent =
    count === 0
      ? "Ningún archivo seleccionado"
      : `${count} archivo${count === 1 ? "" : "s"} seleccionado${count === 1 ? "" : "s"}`;

  updateFormState();
});

bankInput.addEventListener("change", () => {
  bankStatus.textContent =
    bankInput.files.length === 0
      ? "Ningún archivo seleccionado"
      : bankInput.files[0].name;

  updateFormState();
});

monthInput.addEventListener("change", updateFormState);

generateButton.addEventListener("click", () => {
  const period = formatMonth(monthInput.value);
  const receipts = receiptsInput.files.length;
  const bankFileName = bankInput.files[0]?.name ?? "-";

  receiptCount.textContent = receipts;
  bankLoaded.textContent = "Sí";
  periodValue.textContent = period;
  reportTitle.textContent = `Reporte · ${period}`;

  generatedReportHtml = createReportHtml({
    period,
    receipts,
    bankFileName,
  });

  resultsSection.classList.remove("hidden");
  resultsSection.scrollIntoView({
    behavior: "smooth",
    block: "start",
  });
});

downloadButton.addEventListener("click", () => {
  if (!generatedReportHtml) return;

  const blob = new Blob([generatedReportHtml], {
    type: "text/html;charset=utf-8",
  });

  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");

  link.href = url;
  link.download = `reporte-garage-${monthInput.value || "sin-periodo"}.html`;

  document.body.appendChild(link);
  link.click();
  link.remove();

  URL.revokeObjectURL(url);
});

function createReportHtml({ period, receipts, bankFileName }) {
  return `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Reporte Garage - ${period}</title>
  <style>
    body {
      margin: 0;
      padding: 40px;
      font-family: Arial, sans-serif;
      color: #172033;
      background: #f4f6f8;
    }

    .report {
      max-width: 900px;
      margin: 0 auto;
      padding: 36px;
      background: white;
      border-radius: 18px;
    }

    h1 {
      margin-top: 0;
    }

    .summary {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 16px;
      margin-top: 28px;
    }

    .item {
      padding: 18px;
      border-radius: 14px;
      background: #f7f9fb;
    }

    .item span {
      display: block;
      color: #667085;
      font-size: 13px;
      margin-bottom: 8px;
    }

    .placeholder {
      margin-top: 28px;
      padding: 20px;
      border-left: 4px solid #98a2b3;
      background: #f8fafc;
      line-height: 1.6;
    }
  </style>
</head>
<body>
  <main class="report">
    <p>CONTROL DE COBROS</p>
    <h1>Reporte Garage · ${period}</h1>

    <div class="summary">
      <div class="item">
        <span>Comprobantes cargados</span>
        <strong>${receipts}</strong>
      </div>

      <div class="item">
        <span>Estado bancario</span>
        <strong>${bankFileName}</strong>
      </div>

      <div class="item">
        <span>Período</span>
        <strong>${period}</strong>
      </div>
    </div>

    <div class="placeholder">
      <strong>Reporte de prueba</strong><br />
      Esta versión confirma que el flujo de carga y generación funciona.
      La próxima versión incluirá el cruce real entre comprobantes,
      clientes y movimientos del banco.
    </div>
  </main>
</body>
</html>`;
}
