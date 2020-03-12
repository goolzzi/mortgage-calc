import $ from "jquery";
const jqSimPrest = $.noConflict();

const amountSimPrest = 130000;
const amountSimPrestFin = amountSimPrest;
const reddito = 0;
const durataSimPrest = 0;
// const rataSimPrest;
const CPISimPrest = "SI";
const finalitaSimPrest = 1;
const valoreStartSimPrest = "";
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
    navigator.maxTouchPoints > 0 ||
    navigator.msMaxTouchPoints > 0
  );
};

// limite minimo durata prestito
const limitaMinDurata = presetValoriSimPrest.minDurata;
// limite massimo durata prestito
const limitaMaxDurata = presetValoriSimPrest.maxDurata;

const breakP = false;
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
  standardCall = 'assets/';
}

let xmlSimPrest = 'emanonLoansPrestito.xml';
// DEV ENVIRONMENT
// se in localhost prendiamo l'xml che è presente in produzione per testare
if (localhost) {
  xmlSimPrest = 'emanonLoansPrestito_Prod.xml';
}


const pressTimerSimPrest = null;
const urlSimPrestProd = '/assets/'

const urlSimPrestSvil = "xml/";
let urlSimPrestFin = 'assets/';

// DEV ENVIRONMENT
if (localhost) {
  urlSimPrestFin = standardCall + urlSimPrestSvil;
}

const cashContent = []

export const urlParamSimPrest = name => {
  var results = new RegExp("[?&]" + name + "=([^&#]*)").exec(
    window.location.href
  );
  if (results == null) {
    return null;
  } else {
    return results[1] || 0;
  }
};

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

export const detectMatrix = el => {
  let nodeValue: any = {};
  nodeValue.type = jqSimPrest(el).attr("type");
  nodeValue.matrix = true;
  nodeValue.rangeValues = [];
  nodeValue = { ...nodeValue, ...addType(el) };

  jqSimPrest(el)
    .children("rangeValue,rangeMatrix")
    .each(function (i2, el2) {
      if (jqSimPrest(el2).prop("nodeName") == "rangeValue") {
        var nodeValue2;
        nodeValue2 = jqSimPrest(el2).attr("fixed");
        if (jqSimPrest(el2).attr("perc") != null) {
          // se e' in percentuale aggiungo "%"
          nodeValue2 =
            jqSimPrest(el2)
              .attr("perc")
              .replace(",", ".") + "%";
        }
        nodeValue2 = nodeValue2.replace(",", ".");
        nodeValue.rangeValues.push(nodeValue2);
      } else {
        const nodeValue2 = detectMatrix(jqSimPrest(el2));
        nodeValue.rangeValues.push(nodeValue2);
      }
    });

  return nodeValue;
};

export const addType = (el) => {
  const obj: any = {};
  if (jqSimPrest(el).attr('amount') != null) {
    obj.amount = Number(jqSimPrest(el).attr('amount'));
    if (obj.amount == '') {
      // setto un numero altisSimPresto per creare il default
      obj.amount = 100000000000000;
    }
  }

  if (jqSimPrest(el).attr('reddito') != null) {
    obj.reddito = Number(jqSimPrest(el).attr('reddito'));
    if (obj.reddito == '') {
      // setto un numero altisSimPresto per creare il default
      obj.reddito = 100000000000000;
    }
  }

  if (jqSimPrest(el).attr('durata') != null) {
    obj.durata = Number(jqSimPrest(el).attr('durata'));
    if (obj.durata == '') {
      // setto un numero altisSimPresto per creare il default
      obj.durata = 100000000000000;
    }
  }
  if (jqSimPrest(el).attr('ltype') != null) {
    obj.ltype = Number(jqSimPrest(el).attr('ltype'));
    // setto 0 per creare il default
    if (obj.ltype == '') {
      obj.ltype = 0;
    }
  }
  if (jqSimPrest(el).attr('eta') != null) {
    obj.eta = Number(jqSimPrest(el).attr('eta'));
    // setto 0 per creare il default
    if (obj.eta == '') {
      obj.eta = 100000000000000;
    }
  }
  if (jqSimPrest(el).attr('importo') != null) {
    obj.importo = Number(jqSimPrest(el).attr('importo').replace(',', '.'));
    // setto 0 per creare il default
    if (obj.importo == '') {
      obj.importo = 100000000000000;
    }
  }

  return obj;
}

export const findRange = (nodeName, parent) => {
  // funzione per la memorizzazione e la normalizzazione delle soglie
  var values = [];

  jqSimPrest(nodeName, parent).find('range').each(function (i, el) {
    const range: any = { ...addType(el) };

    range.type = jqSimPrest(el).attr("type");
    range.rangeValues = [];

    if (!!jqSimPrest(el).children("rangeMatrix").length) {
      jqSimPrest(el)
        .children("rangeMatrix")
        .each(function (i2, el2) {
          var nodeValue2 = detectMatrix(jqSimPrest(el2));
          range.rangeValues.push(nodeValue2);
        });
    }

    jqSimPrest(el).children('rangeValue,rangeFunct').each(function (i2, el2) {
      var nodeValue;
      // se il valore e' un numero
      if (jqSimPrest(el2).prop("nodeName") == 'rangeValue') {
        nodeValue = jqSimPrest(el2).attr('fixed');

        if (jqSimPrest(el2).attr('perc') != null) {
          // se e' in percentuale aggiungo "%"
          nodeValue = jqSimPrest(el2).attr('perc').replace(',', '.') + '%';
          nodeValue = nodeValue.replace(',', '.');
        } else if (jqSimPrest(el2).attr('string') != null) {

          nodeValue = jqSimPrest(el2).attr('string');

        } else {
          nodeValue = nodeValue.replace(',', '.');
        }

      } else {
        // se il valore e' un ulteriore confronto
        nodeValue = {};
        nodeValue.type = jqSimPrest(el2).attr('type');
        nodeValue.rangeValues = [];
        // ciclo i valori del nuovo confronto
        jqSimPrest(el2).children('rangeValue,rangeFunct').each(function (i3, el3) {
          var nodeValue2;
          nodeValue2 = jqSimPrest(el3).attr('fixed');
          if (jqSimPrest(el3).attr('perc') != null) {
            // se e' in percentuale aggiungo "%"
            nodeValue2 = jqSimPrest(el3).attr('perc').replace(',', '.') + '%';
          } else if (jqSimPrest(el2).attr('string') != null) {

            nodeValue2 = jqSimPrest(el3).attr('string');

          } else {
            nodeValue2 = nodeValue2.replace(',', '.');
          }
          nodeValue.rangeValues.push(nodeValue2);
        })
      }

      range.rangeValues.push(nodeValue);
    })

    values.push(range);
  });

  return values;
}

export const parseToObj = objToParse => {
  var variable = this;
  // carico l'xml

  jqSimPrest.get(urlSimPrestFin + objToParse.xmlToParse, function (xml) {
    jqSimPrest(xml)
      .find("loan")
      .each(function (i, el) {
        // costruisco l'oggetto
        const obj: any = {};

        //elementi presenti all'interno della radice float dell'xml
        obj.type = jqSimPrest(el).attr("type");


        obj.cap = Number(jqSimPrest("cap", el).text().replace(",", "."));

        obj.fire = Number(jqSimPrest("fire", this).text().replace(",", ".")) / 100;

        obj.discInv = Number(jqSimPrest("discInv", this).text().replace(",", ".")) / 100;

        obj.discRep = Number(jqSimPrest("discRep", this).text().replace(",", ".")) / 100;


        // creo gli oggetti per il calcolo dei valori a soglia

        // creo gli oggetti per il calcolo dei valori a soglia
        // array di dati presi da ogni nodo con il nome nodeName cercato in findRange
        obj.nameStart = [];
        obj.nameStart = findRange("name", el);

        obj.urlStart = [];
        obj.urlStart = findRange("url", el);

        obj.urlStart2 = [];
        obj.urlStart2 = findRange("url2", el);

        obj.inv = [];
        obj.inv = findRange("inv", el);

        obj.reports = [];
        obj.reports = findRange("reports", el);
        obj.tax = [];
        obj.tax = findRange("tax", el);

        obj.tanSCalc = [];
        obj.tanSCalc = findRange("tan", el);

        obj.capCalc = [];
        obj.capCalc = findRange("cap", el);

        obj.spreadCalc = [];

        obj.spreadCalc = findRange("spread", el);

        console.log('############', obj);

        // logg("enginePrestito parseToObj obj => " + JSON.stringify(obj));

        cashContent.push(obj);
        // parserXMLPrestito.cache.content.push(obj);

        // if (i == jqSimPrest(xml).find("loan").size() - 1) {
        //   jqSimPrest.get(urlSimPrestFin + objToParse.xmlToParseDef, function (xml) {
        //     jqSimPrest(xml)
        //       .find("exception")
        //       .each(function (i, el) {
        //         // costruisco l'oggetto
        //         var actUrl = location.href;
        //         //logg ("actUrl => "+actUrl);
        //         var elUrl = jqSimPrest(el).attr("url");
        //         // se troviamo tra i nodi exception uno con attributo url uguale a actUrl...
        //         if (actUrl.indexOf(elUrl) != -1) {
        //           jqSimPrest(el)
        //             .find("*")
        //             .each(function (i2, el2) {
        //               logg(
        //                 "enginePrestito jqSimPrest(el2).get(0).tagName => " +
        //                 jqSimPrest(el2).get(0).tagName
        //               );
        //               presetValoriSimPrest[jqSimPrest(el2).get(0).tagName] = jqSimPrest(el2).text();
        //             });
        //         }

        //         if (
        //           i ==
        //           jqSimPrest(xml)
        //             .find("exception")
        //             .size() -
        //           1
        //         ) {
        //           parserXMLPrestito.presetValoriSimPrestFunc();
        //           parserXMLPrestito.start();
        //         }
        //       });
        //   });
        // }
      });
  });
};
