import $ from "jquery";
const jqSimPrest = $.noConflict();

const amountSimPrest = 130000;
const amountSimPrestFin = amountSimPrest;
const reddito = 0;
const durataSimPrest;
const rataSimPrest;
const CPISimPrest = "SI";
const finalitaSimPrest = 1;
const valoreStartSimPrest;
const siglaPrestito = "TF";
const limitaMinValoreRedditoPrest = 0;
const limitaMinImportoPrest = 5000;
const limitaMaxAquistoPrest = 99000;
const limitaMaxImportoPrest = limitaMaxAquistoPrest;
const limitaMaxValoreRedditoPrest = 9999999;
const mutuoObj = {};

// soglia di arrotondamento decimale TAEG
const thresholdTaeg = 8;

const activeAnimPrest = true;
const tassoUsuraPrest = 15;
const isPariSimPrest = false;
const presetValoriSimPrest = {
  defFinalita: "5",
  defImporto: 5000,
  defReddito: 2500,
  defAge: 37,
  defDurata: 36,
  defCPI: "NO",
  minDurata: 36,
  maxDurata: 120,
  segmento: "individuiefamiglie",
  defaultOpen: false,
  isPrivate: false
};

const is_touch_deviceSimPrest = () => {
  return (
    "ontouchstart" in window ||
    navigator.MaxTouchPoints > 0 ||
    navigator.msMaxTouchPoints > 0
  );
};

// limite minimo durata prestito
const limitaMinDurata = presetValoriSimPrest.minDurata;
// limite massimo durata prestito
const limitaMaxDurata = presetValoriSimPrest.maxDurata;

const breakP;
const touchDeviceSimPrest = is_touch_deviceSimPrest();

const presetValoriSim = { isPrivate: false };

// check if localhost
const localhost = location.href.indexOf("localhost") != -1 ? true : false;

let standardCall = "https://emanon.it/";

if (location.href.indexOf("banking.secure.emanon.it") != -1) {
  standardCall = "https://banking.secure.emanon.it/";
  presetValoriSim.isPrivate = true;
}

// DEV ENVIRONMENT
if (localhost) {
  standardCall =
    "http://localhost:63342/webcomponent/original-html/original-calcolaprestito/";
}

const pressTimerSimPrest;
const urlSimPrestProd =
  standardCall + "rsc/comunicazione/calcolo-prestiti/xml/";
const urlSimPrestCol = standardCall + "rsc/comunicazione/calcolo-prestiti/xml/";

const urlSimPrestSvil = "xml/";
let urlSimPrestFin = urlSimPrestProd;

// DEV ENVIRONMENT
if (localhost) {
  urlSimPrestFin = standardCall + urlSimPrestSvil;
}

export const togliPunti = textbox => {
  let valuta = jqSimPrest(textbox).val();
  if (
    jqSimPrest(textbox).size() > 0 &&
    jqSimPrest(textbox).val() &&
    jqSimPrest(textbox)
      .val()
      .indexOf(".") != -1
  ) {
    valuta = jqSimPrest(textbox)
      .val()
      .replace(/\./g, "")
      .replace(/\,/g, "");
  }

  return valuta;
};

export const SistemaMesi = txtbox => {
  const valoreCorrente = jqSimPrest(txtbox).val();

  if (this.valoreStartSimPrest == valoreCorrente) return;
  // const num = parseInt(valoreCorrente);
  jqSimPrest(txtbox)
    .next()
    .val(parseInt(togliPunti(jqSimPrest(txtbox)), 10));
  jqSimPrest(txtbox).val(valoreCorrente);
};
