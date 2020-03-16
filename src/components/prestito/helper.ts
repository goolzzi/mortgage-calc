import $ from "jquery";
const jqSimPrest = $.noConflict();

const amountSimPrest = 130000;
let amountSimPrestFin = amountSimPrest;
const reddito = 0;
let durataSimPrest = 0;
// const rataSimPrest;
let CPISimPrest = "SI";
const finalitaSimPrest = 1;
let valoreStartSimPrest = "";
const siglaPrestito = "TF";
const limitaMinValoreRedditoPrest = 0;
const limitaMinImportoPrest = 5000;
const limitaMaxAquistoPrest = 99000;
const limitaMaxImportoPrest = limitaMaxAquistoPrest;
const limitaMaxValoreRedditoPrest = 9999999;
const mutuoObj:any = {};

// soglia di arrotondamento decimale TAEG
const thresholdTaeg = 8;

const activeAnimPrest = true;
const tassoUsuraPrest = 15;
let isPariSimPrest = false;
const presetValoriSimPrest:any = {
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
let limitaMinDurata = presetValoriSimPrest.minDurata;
// limite massimo durata prestito
let limitaMaxDurata = presetValoriSimPrest.maxDurata;

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


let pressTimerSimPrest = null;
const urlSimPrestProd = '/assets/'

const urlSimPrestSvil = "xml/";
let urlSimPrestFin = 'assets/';

// DEV ENVIRONMENT
if (localhost) {
  urlSimPrestFin = standardCall + urlSimPrestSvil;
}

let cacheContent = []

const Reset = () => {
  jqSimPrest('#accordionSimPrest').html('');
  jqSimPrest('#actPlanPrest,#actPlanPrest2').html('');
}

const FLOOD1 = (type, cat, u1?: string) => {
  var axel: any = Math.random()+"";
  var a = axel * 10000000000000000;
  var flDiv=document.body.appendChild(document.createElement("div"));
  flDiv.setAttribute("id","DCLK_FLDiv1");
  flDiv.style.position="absolute";
  flDiv.style.top="0";
  flDiv.style.left="0";
  flDiv.style.width="1px";
  flDiv.style.height="1px";
  flDiv.style.display="none";
  
  flDiv.innerHTML='<iframe id="DCLK_FLIframe1" src="http://2836706.fls.doubleclick.net/activityi;src=2836706;type=' + type + ';cat=' + cat + ';ord=' + a + '?" width="1" height="1" frameborder="0"><\/iframe>';

}

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

  if (valoreStartSimPrest == valoreCorrente) return;
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

export const getPosizioneCursor = (input) => {
        
  var textLength = input.value.length;
  // @ts-ignore:disable-next-line
  if (input.createTextRange && document.selection) {
      //IE <= 9
      // @ts-ignore:disable-next-line
      var range = document.selection.createRange().duplicate();     
      range.moveStart('character', -textLength);
      return range.text.length;
  }
  else {
      //Non IE + IE > 9
      return input.selectionStart;
  }
}

export const setPosizioneCursor = (input, posizione) => {
  // @ts-ignore:disable-next-line
  if (document.selection) {
      //IE
      var range = input.createTextRange();
      range.move('character', posizione);
      range.select();
  }
  else {
      //Non IE
      input.selectionStart = posizione;
      input.selectionEnd = posizione;
  }
}

export const SistemaPunteggiatura = (input) => {
        
  var valoreCorrente = input.value;

  if (valoreStartSimPrest == valoreCorrente) return;

  var posIniziale = getPosizioneCursor(input);
  var lenIniziale = valoreCorrente.length;

  //var num = valoreCorrente.replace(/\./g, "").replace(/\,/g, "");
  var num = valoreCorrente.replace(/\D/g, ""); //solo caratteri numerici
  valoreCorrente = num.replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1.");
  input.value = valoreCorrente;


  setPosizioneCursor(input, posIniziale + (valoreCorrente.length - lenIniziale));
}

const SistemaPunteggiaturaSimPrest = (txtbox) => {
        
  var valoreCorrente = jqSimPrest(txtbox).val();

  if (valoreStartSimPrest == valoreCorrente) return;
  //var num = valoreCorrente.replace(/\./g, "").replace(/\,/g, "");
  var num = valoreCorrente.replace(/\D/g, ""); //solo caratteri numerici
  valoreCorrente = num.replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1.");
  
  jqSimPrest(txtbox).next().val(parseInt(togliPunti(jqSimPrest(txtbox)), 10));
  jqSimPrest(txtbox).val(valoreCorrente);
}

const SalvaValoreInizialeSimPrest = (txtbox) => {
  Reset();
  valoreStartSimPrest = jqSimPrest(txtbox).val();
}

const SistemaPunteggiaturaSimPrestText = (txt) => {
        
  var valoreCorrente = txt.toString();
  var decimali='';
  if(valoreCorrente.indexOf('.')!=-1){
  
      decimali=','+valoreCorrente.substring(valoreCorrente.indexOf('.')+1,valoreCorrente.length);
      valoreCorrente=valoreCorrente.substring(0,valoreCorrente.indexOf('.'));
      
  }

  var num = valoreCorrente.replace(/\D/g, ""); //solo caratteri numerici
  valoreCorrente = num.replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1.")+decimali;
  return valoreCorrente;
}

export const incrementaValori = (objForm,valueStep, verificaLimiti,verificaLimitiDurata,verificaLimitiDurata2) => {
            
            
  var value=parseInt(togliPunti(jqSimPrest(objForm)));
  
  
  var result=value+valueStep;
  
  var minV = limitaMinValoreRedditoPrest;
  var maxV = limitaMaxValoreRedditoPrest;
  
  
  if(verificaLimitiDurata||verificaLimitiDurata2){
      minV = presetValoriSimPrest.minDurata;
      maxV = limitaMaxDurata ;
  }
  

  if (verificaLimiti) {
      minV = limitaMinImportoPrest;
      maxV = limitaMaxImportoPrest;
  }

  if (result <= minV) {
      result = minV
      clearInterval(pressTimerSimPrest);
  } 
  
  if(result >= maxV) {
      result = maxV;
      clearInterval(pressTimerSimPrest);
  }
  
  
  
  
  if(verificaLimitiDurata){
      
      jqSimPrest('#sliderDurataPrest').slider( "value", result);
      SalvaValoreInizialeSimPrest(objForm);
      jqSimPrest(objForm).val(result);
      SistemaMesi(objForm);
      
  } else if(verificaLimitiDurata2){
      SalvaValoreInizialeSimPrest(objForm);
      ga('send', 'event', 'Prestiti', 'durata finanziamento', result);
      jqSimPrest(objForm).val(result);
      SistemaMesi(objForm);
      
  }else {
      SalvaValoreInizialeSimPrest(objForm);
      ga('send', 'event', 'Prestiti', 'importo finanziamento', result);
      jqSimPrest(objForm).val(result);
      SistemaPunteggiaturaSimPrest(objForm);
  
  }
  
  
}

export const incrementaStart = (
  el,
  txtbox,
  verificaLimiti,
  verificaLimitiDurata,
  verificaLimitiDurata2
) => {
  jqSimPrest(el)
    .on("click", function() {
      clearInterval(pressTimerSimPrest);
      var valueStep = Number(jqSimPrest(this).attr("data-step"));

      incrementaValori(
        txtbox,
        valueStep,
        verificaLimiti,
        verificaLimitiDurata,
        verificaLimitiDurata2
      );
    })
    .on("blur", function() {
      clearInterval(pressTimerSimPrest); //clear time on mouseup
    });

  if (touchDeviceSimPrest) {
    jqSimPrest("input").focus(function() {
      clearInterval(pressTimerSimPrest);
    });

    jqSimPrest(".simPrestFocus").focus(function() {
      jqSimPrest(this).hide();
      jqSimPrest(this)
        .next()
        .show()
        .focus();
      clearInterval(pressTimerSimPrest);
    });

    if (jqSimPrest(el).size() > 0) {
      jqSimPrest(el)
        .get(0)
        .addEventListener(
          "touchleave",
          function() {
            clearInterval(pressTimerSimPrest);
          },
          false
        );
      jqSimPrest(el)
        .get(0)
        .addEventListener(
          "touchend",
          function() {
            clearInterval(pressTimerSimPrest);
          },
          false
        );
      jqSimPrest(el)
        .get(0)
        .addEventListener(
          "touchstart",
          function() {
            var valueStep = Number(jqSimPrest(this).attr("data-step"));
            var objForm = txtbox;
            clearInterval(pressTimerSimPrest);
            pressTimerSimPrest = window.setInterval(function() {
              incrementaValori(
                objForm,
                valueStep,
                verificaLimiti,
                verificaLimitiDurata,
                verificaLimitiDurata2
              );
            }, 100);
          },
          false
        );
    }
  } else {
    jqSimPrest(el)
      .on("mousedown", function() {
        var valueStep = Number(jqSimPrest(this).attr("data-step"));
        var objForm = txtbox;
        pressTimerSimPrest = window.setInterval(function() {
          incrementaValori(
            objForm,
            valueStep,
            verificaLimiti,
            verificaLimitiDurata,
            verificaLimitiDurata2
          );
        }, 100);
      })
      .on("mouseup", function() {
        clearInterval(pressTimerSimPrest); //clear time on mouseup
      });
  }
};

const increaseSimPrestValue = (slider, txtbox, verificaLimiti,verificaLimitiDurata,verificaLimitiDurata2) => {
        
  var valoreIniziale = parseInt(togliPunti(txtbox));
  
  var valoreSlider = jqSimPrest(slider).slider("option", "value");
  
  
  var result = valoreIniziale + valoreSlider;
  
  

  var min = limitaMinValoreRedditoPrest;
  var max = limitaMaxValoreRedditoPrest;

  if (verificaLimitiDurata||verificaLimitiDurata2) {
      ga('send', 'event', 'Prestiti', 'durata finanziamento', result);
      min = presetValoriSimPrest.minDurata;
      max = limitaMaxDurata;
  }

  if (verificaLimiti) {
      ga('send', 'event', 'Prestiti', 'importo finanziamento', result);
      min = limitaMinImportoPrest;
      max = limitaMaxImportoPrest;
  }

  if (result < min) {
      result = min
  }
  if (result > max) {
      result = max;
  }
  jqSimPrest(txtbox).val(result);
}

/**
 * init
 * @param slider 
 * @param txtbox 
 * @param min 
 * @param max 
 * @param step 
 * @param val 
 * @param verificaPunteggiatura 
 * @param verificaLimiti 
 * @param verificaLimitiDurata 
 * @param verificaLimitiDurata2 
 */
export const inizializzaSlider = (slider, txtbox, min, max, step, val, verificaPunteggiatura, verificaLimiti,verificaLimitiDurata,verificaLimitiDurata2) => {
  var timerSimPrest = true;
  var increaseSimPrest;

  jqSimPrest(slider).prev('.meno').attr('data-step',step*(-1));
  jqSimPrest(slider).next('.piu').attr('data-step',step);
  
  
  var el=jqSimPrest(slider).prev('.meno');
  var el2=jqSimPrest(slider).next('.piu');
  
  
  
  incrementaStart(el,txtbox, verificaLimiti,verificaLimitiDurata,verificaLimitiDurata2);
  incrementaStart(el2,txtbox, verificaLimiti,verificaLimitiDurata,verificaLimitiDurata2);
  
  
  
      
  jqSimPrest(slider).slider({
          animate: true,
          range: "min",
          value: val == undefined ? parseInt(txtbox,10) : val,
          min: min,
          max: max,
          step: step,
          start: function (event, ui) {
              increaseSimPrest = true;
              if (verificaPunteggiatura||verificaLimitiDurata2) {
                  if (timerSimPrest) {
                      timerSimPrest = jqSimPrest.timer(function () {
              
                          if (increaseSimPrest) {
                              SalvaValoreInizialeSimPrest(txtbox);
                              
                              
                              
                              increaseSimPrestValue(slider, txtbox, verificaLimiti,verificaLimitiDurata,verificaLimitiDurata2);
                              SistemaPunteggiaturaSimPrest(txtbox);
                          }
                          
                          
                      }, 100, true);
                  }
              }
              
              
              
          },
          slide: function (event, ui) {
              clearInterval(pressTimerSimPrest);

              if (ui.value < 0) {
                  jqSimPrest(slider).children('.ui-widget-header').removeClass('onSlide');
                  jqSimPrest(slider).addClass('onSlide');
              } else {
                  jqSimPrest(slider).children('.ui-widget-header').addClass('onSlide');
                  jqSimPrest(slider).removeClass('onSlide');
              }
  
              if (!verificaPunteggiatura&&(!verificaLimitiDurata2)) {
                  jqSimPrest(txtbox).val(ui.value);
  
              }
              
              
              
              Reset();
              SistemaPunteggiaturaSimPrest(txtbox);
              
              
              if(verificaLimitiDurata||verificaLimitiDurata2){
                   SistemaMesi(txtbox);
              }
          },
          stop: function (event, ui) {
              jqSimPrest(slider).removeClass('onSlide');
              if (verificaPunteggiatura||verificaLimitiDurata2) {
                  timerSimPrest = false;
                  increaseSimPrest = false;
      
                  if(verificaLimitiDurata2){
                  
                      jqSimPrest(slider).slider("option", "value", 0);
                  }else{
                  
                      jqSimPrest(slider).slider("option", "value", 0);
                  } 
              }
          }
      });
  

  
  if(verificaLimitiDurata){
  
      ImpostaDurata(jqSimPrest(slider).slider("value"), txtbox);
      
  } 
   else {

      if (!verificaPunteggiatura&&!verificaLimitiDurata2) {
          ImpostaValoreConPunteggiatura(jqSimPrest(slider).slider("value"), txtbox);
      }
  }
}

const ImpostaDurata = (value, txtbox) => {
  SalvaValoreInizialeSimPrest(txtbox);
  jqSimPrest(txtbox).val(value);
  jqSimPrest('#sliderDurataPrest').slider( "value", value);
  
  SistemaMesi(txtbox);
}

const ImpostaValoreConPunteggiatura = (value, txtbox) => {
  SalvaValoreInizialeSimPrest(txtbox);

  jqSimPrest(txtbox).val(value);
  SistemaPunteggiaturaSimPrest(txtbox);
}


export const presetValoriSimPrestFunc = () => {
  //reimposta i valori in base ai default
  
  limitaMinDurata = Number(presetValoriSimPrest.minDurata);
  limitaMaxDurata = Number(presetValoriSimPrest.maxDurata);

  
  //jqSimPrest('#sliderDurataPrest').slider( "option", "min", limitaMinDurata);

  
  
  jqSimPrest('#txtValoreRedditoPrest').val(Number(presetValoriSimPrest.defReddito));
  
              
  jqSimPrest('#txtImportoPrest').val(Number(presetValoriSimPrest.defImporto));
  
  
  jqSimPrest('#cboDurataPrest').val(Number(presetValoriSimPrest.defDurata));
  
  
  jqSimPrest('#txtValoreRedditoPrest').next().val(Number(presetValoriSimPrest.defReddito));
  
              
  jqSimPrest('#txtImportoPrest').next().val(Number(presetValoriSimPrest.defImporto));
  
  
  jqSimPrest('#cboDurataPrest').next().val(Number(presetValoriSimPrest.defDurata));
  
  
  
  //jqSimPrest('#cboDurataPrest').val(Number(presetValoriSimPrest.defDurata));
  //limitaMinDurata
  
  if(presetValoriSimPrest.defCPI=='SI'){
      jqSimPrest('#cboCPIPrest').prop('checked',true);
  } else {
      jqSimPrest('#cboCPIPrest').prop('checked',false);
  }
  
  
  
  
  
  durataSimPrest = Number(presetValoriSimPrest.defDurata);

  jqSimPrest('#txtEtaPrest').val(Number(presetValoriSimPrest.defAge));
  
  jqSimPrest('#txtEtaPrest').next().val(Number(presetValoriSimPrest.defAge));
  
  jqSimPrest('#cboFinalitaPrest').val((presetValoriSimPrest.defFinalita));

  
  
  
  durataSimPrest = Number(presetValoriSimPrest.defDurata);

  jqSimPrest('#txtEtaPrest').val(Number(presetValoriSimPrest.defAge));
  
  jqSimPrest('#cboFinalitaPrest').val((presetValoriSimPrest.defFinalita));
  
  
  SistemaPunteggiatura(jqSimPrest('#txtValoreRedditoPrest').get(0));
  SistemaPunteggiatura(jqSimPrest('#txtImportoPrest').get(0));
  
  SistemaMesi(jqSimPrest('#cboDurataPrest').get(0));


  inizializzaSlider('#sliderDurataPrest','#cboDurataPrest',-12,12,1,0,false,false,false,true);

  
  inizializzaSlider('#sliderRedditoPrest','#txtValoreRedditoPrest',-100,100,500,0,true,false,false, false);
  inizializzaSlider('#sliderImportoPrest','#txtImportoPrest',-5000,5000,500,0,true,true,false, false);

/*#####################################################*/
/*  inizializzaSlider('#sliderDurataPrest','#cboDurataPrest',limitaMinDurata,limitaMaxDurata,1,parseInt(jqSimPrest('#cboDurataPrest').val()),false,false,true);

*/
  
  //inizializzaSlider('#sliderEta','#txtEtaPrest',18,75,1,undefined,false,false);
          
  
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

        cacheContent.push(obj);
        // cacheContent.push(obj);

        if (i == jqSimPrest(xml).find("loan").length - 1) {
          jqSimPrest.get(urlSimPrestFin + objToParse.xmlToParseDef, function (xml) {
            jqSimPrest(xml)
              .find("exception")
              .each(function (i, el) {
                console.log('***********', el);
                // costruisco l'oggetto
                var actUrl = location.href;
                //logg ("actUrl => "+actUrl);
                var elUrl = jqSimPrest(el).attr("url");
                // se troviamo tra i nodi exception uno con attributo url uguale a actUrl...
                if (actUrl.indexOf(elUrl) != -1) {
                  jqSimPrest(el)
                    .find("*")
                    .each(function (i2, el2) {
                      console.log(
                        "enginePrestito jqSimPrest(el2).get(0).tagName => ",
                        jqSimPrest(el2).get(0).tagName
                      );
                      presetValoriSimPrest[jqSimPrest(el2).get(0).tagName] = jqSimPrest(el2).text();
                    });
                }

                if (
                  i ==
                  jqSimPrest(xml)
                    .find("exception")
                    .size() -
                  1
                ) {
                  presetValoriSimPrestFunc();
                  start();
                }
              });
          });
        }
      });
  });
};

const closeWindowSimPrest = () => {
  //chiude l'iframe
  
  //jqSimPrest('#SimPrestFrame').removeAttr('src');
  
  jqSimPrest('#actPlanPrest,#actPlanPrest2').html('');

  jqSimPrest('#modalPianoPrest .SimPrestCont').css({'height':'0'});
  
  
  jqSimPrest('body').removeClass('modalSimPrestPrestOpen');
  jqSimPrest('body').removeClass('modalPianoPrestOpen');
}


const start = () => {
  jqSimPrest('body').append('<div class="modalSimPrestPrest"><div class="SimPrestCont"><a class="frameClose">X</a><iframe id="SimPrestFrame" src="" frameborder="0"></iframe></div></div>');
  jqSimPrest('body').append('<div id="dialogSimPrestPrest"></div>');
  jqSimPrest('body').append('<div class="modalPianoPrest"><div class="SimPrestCont"><a class="frameClose SimPrest-close-fixed">X</a><div id="actPlanPrest"></div></div></div>');
      
  
  jqSimPrest('.frameClose').click(function(e){
      e.preventDefault();
      
      closeWindowSimPrest();
  });
  
  jqSimPrest('a[href]').click(function(e){
      
      ga('send', 'event', 'Prestiti', siglaPrestito, jqSimPrest(this).text());
      
  });
  
  jqSimPrest('.simPrestFocus').focus(function(){
      if(touchDeviceSimPrest){
          jqSimPrest(this).hide();
          jqSimPrest(this).next().show().focus();
      }
      
  });
  
  
  var orderedObj=[];
  jqSimPrest.each(cacheContent,function(i,el){
      var obj=cacheContent[i];
      if(obj.type==presetValoriSimPrest.firstType){
          orderedObj.push(obj);
          
      }
      if(i==(cacheContent.length-1)){
      
          presetValoriSimPrestFunc();
      }
  })
  
  
  jqSimPrest.each(cacheContent,function(i,el){
      var obj=cacheContent[i];
      if(obj.type!=presetValoriSimPrest.firstType){
          orderedObj.push(obj);
          
      }
  })
  logg ("BEFORE: => "+ JSON.stringify(cacheContent));
  cacheContent=orderedObj;
  logg ("AFTER: => "+ JSON.stringify(cacheContent));


  /*click al primo calcolo su bottone CALCOLA RATA*/
  jqSimPrest('#SimPrest-calcola').click(function(e){
      
      e.preventDefault();

       var status = ValidaFiltri();
      isPariSimPrest=(isPariSimPrest==true)? false : true;
       var divContenuto = document.getElementById('divContenuto');
  
  if (status) {
      ga('send', 'event', 'Prestiti', 'calcola ora', 'calcola ora')
       parserXMLPrestito.Reset();
       
       if(activeAnimPrest){
          jqSimPrest('.SimPrest-container-step-1' ).hide("slide", { direction: "left" }, 500);
          jqSimPrest('.SimPrest-container-step-2').delay(500).show("slide", { direction: "left" }, 500);
          
          
      }
      
       jqSimPrest.each(cacheContent,function(i,el){
           logg("------------------ CALCOLO RATA BEGIN -------------------------");


          /*recupero i valori*/
          var obj=cacheContent[i];


          logg("cacheContent => "+JSON.stringify(cacheContent));
                              
          
          //jqSimPrest('#txtImportoPrest').val(amount)
          
          if(true){
              
              logg ("CALCOLO RATA tanS => "+obj.tanS);
              obj.tanR=obj.tanS;
              
              
              
              /*stampo i risultati*/
              

              var rata=0;
              var rataCap=0;
              var rataInt=0;
              var rataFin=0;
              
              /*per semplitita' uso il nome delle variabili dell'excel*/

              // RACCOLTA VARIABILI E DATI
              
              
              var C2=obj.cap; //cap
          
              var C3=amountSimPrest; //importo
              var C4=obj.tanS; //tan
              CPISimPrest=(jqSimPrest('#cboCPIPrest').is(':checked'))? 'SI':'NO';

              var C5=CPISimPrest; //cpi
              var C6=Number(durataSimPrest); //durata mesi

              var E2=C6;
              // C4 = tanS
              var E3=C4;
              // C6 DURATA MESI
              var E4=C6;

              //var H7=H11:H311; //Totale dovuto 
              //var H8=H7-H6; //Totale dovuto netto CPI 
              var M4=obj.discInv //Sconto Spese  Istruttoria

              var C7=0;
              var C72=0;

              // calcolo int1
              var int1=0;
              // Se la durata mesi (C6) è maggiore di 18 allora si calcola int1 in questo modo
              if(C6>18){int1=0.25/100};
              var I5=int1;

              // calcolo int2
              var int2=1.08/100*C6/12;
              // Se invece la durata mesi (C6) è maggiore di 60 allora si calcola nel seguente modo
              if(C6>60){int2=0.6/100*C6/12}

              // calcolo int3
              var int3=0;
              if(C5=="SI"){
                  int3=int2
              } 

              var I4=int3;

              // CALCOLO IMPORTO FINANZIATO
                                  
              var I7=(C3/(1-((0.5/100*C6/12)*(1-M4)+int1+int3)));
              var I72=(C3/(1-((0.5/100*C6/12)*(1-M4)+int1+int2)));

              var I6=0.5/100*(I7)*C6/12;

              var C72=I72;
              C7=I7;

              var control=(0.5/100*(C3/(1-((0.5/100*C6/12)*(1-M4)+I5+I4)))*C6/12);

              // I8 = importo finanziato
              logg("IMPORTO FINANZIATO int1 => "+int1);
              logg("IMPORTO FINANZIATO int2 => "+int2);
              logg("IMPORTO FINANZIATO int3 => "+int3);
              logg("IMPORTO FINANZIATO C2 (cap) => "+C2);
              logg("IMPORTO FINANZIATO C3 (importo del prestito) => "+C3);
              //var I8=(Number(Number(C3)+Number(C2))/(1-Number(Number(int1)+Number(int3))));
              // C2 è il cap
              let firstPartI8 = (Number(C3)+Number(C2));
              logg("IMPORTO FINANZIATO firstPartI8 => "+firstPartI8);
              let secondPartI8 = (1-Number(Number(int1)+Number(int3)));
              logg("IMPORTO FINANZIATO secondPartI8 => "+secondPartI8);
              let I8Final = (Number (firstPartI8 / secondPartI8));
              logg("IMPORTO FINANZIATO I8Final => "+I8Final);
              let I8 = I8Final;
              logg("IMPORTO FINANZIATO I8 => "+I8);
              var I82=(Number(Number(C3)+Number(C2))/(1-Number(Number(int1)+Number(int2))));

              logg("IMPORTO FINANZIATO C7 => "+C7);
              logg("IMPORTO FINANZIATO C72 => "+C72);
              logg("IMPORTO FINANZIATO I8 => "+I8);
                  
              if(control>C2){
                  C7=I8;
                  C72=I82;
              }
              
              amountSimPrestFin=C7;



              // CALCOLO SPESE ISTRUTTORIA
              obj.inv=Math.min.apply(Math, [C2,0.5/100*C7*C6/12])*(1-M4);
              var H4=obj.inv;

              // CALCOLO IMPOSTA SOSTITUTIVA
              var H5=0 //IF(C6>18;0.25/100*C7;0); // Imposta sostitutiva
              if(C6>18){
                  H5=0.25/100*C7;
              }
              
              // PREMIO ASSICURATIVO
              var H6=0 // IF(C5="SI";IF(C6>60;0.6/100*C7*C6/12;1.08/100*C7*C6/12);0); // Polizza CPI 
              var H62=0;
              if(C6>60){
                  H62=0.6/100*C72*C6/12
              } else {
                  H62=1.08/100*C72*C6/12
              }
              if(C5=='SI'){
                  if(C6>60){
                      H6=0.6/100*C7*C6/12
                  } else {
                      H6=1.08/100*C7*C6/12
                  }
              } else {
                  H6=0;
              }

              
              /*calcolo il numero di giorni del prosSimPresto mese*/
              
              var nowSimPrest=new Date();
              var thisM=new Date(nowSimPrest);
              thisM.setDate(thisM.getDate()-1);
              var nextM2=new Date(thisM);
              // @ts-ignore
              var nextM3=new Date((thisM.getMonth()+1)+'/'+thisM.monthDays()+'/'+thisM.getFullYear());
              var testDate=new Date(nextM3);  
              testDate.setDate(nextM3.getDate()+1);
              // @ts-ignore
              nextM3.setDate(nextM3.getDate()+testDate.monthDays());
              // @ts-ignore
              let giorniStart=nextM3.monthDays();
              // @ts-ignore
              var D10=nextM3.monthDays();
              // @ts-ignore
              logg ("H10 (giorni prox mese) => ",JSON.stringify(D10));


              // CALCOLO RATA
              /*calcolo rata con la formula standard*/
              // questa è la rata mostrata all'utente
              rata = parserXMLPrestito.PMT(E3/1200,E4,-C7);

              logg ("rata => "+ rata);

              /*calcolo rata capita con la formula standard*/
              rataCap=rata-C7*E3/1200;
              logg ("rataCap => "+ rataCap);

              var giorni=D10;

              rataInt=C7*E2/36000*D10;
              logg ("rataInt => "+ rataInt);

              rataFin=rataCap+rataInt;
              logg ("rataFin => "+ rataFin);

              var rataStandard=rata;
              logg("CALCOLO RATA rataStandard => "+rataStandard);
              // @ts-ignore
              mutuoObj.interessi=0;
              var valori=parserXMLPrestito.calcolaMedia(obj);
              
              var primoPagamento=0;



              // TAEG
              /* calcolo gli interessi con la formula che tiene conto dei giorni del prosSimPresto mese per il variabile*/
              var taegTest=C4;
              // taeg finale
              var taegFin=0;
              // taeg intermedio
              var taegFinAprox=0;
              //var pagamentiTaeg=amountSimPrest;
              //####### chiedere
              // importo del prestito richiesto + premio assicurativo
              var pagamentiTaeg=amountSimPrest+H6;
              var calcoloPagamentiConTaeg=0;
              // costante che indica il massimo valore possibile per il TAEG prima di rientrare nella categoria usurante
              var maxVal=(tassoUsuraPrest*100);
              // rata TAEG provvisoria (serve per controllarla durante il ciclo di calcoli successivi)
              var L4Test=0;
              var altreSpese=0;
              // variabile di appoggio per calcolare, ad ogni ciclo, il valore della somma delle rate + TAEG
              var test=0;

              // la variabile valori contiene l'elenco delle rate mensili calcolate
              logg("CALCOLO RATA 1° SERIE CALCOLI TAEG - valori => "+valori);
              logg("CALCOLO RATA 1° SERIE CALCOLI TAEG - valori.length => "+valori.length);
              
              // PRIMA SERIE DI CALCOLI TAEG
              // si inizia dal tan*100 fino ad arrivare al tasso di usura per i prestiti
              for (let j=C4*100;j<(maxVal);j++){
                  test = primoPagamento;
                  L4Test=j/100;
                  logg("CALCOLO RATA 1° SERIE CALCOLI TAEG - L4Test => "+L4Test);
                  var i:any =0;
                  // nel ciclo interno secondario si sommano le rate fino ad arrivare all'importo finanziato
                  // qui si cerca di capire quale sia il taeg da usare per questo tipo di importo e rateazione
                  logg("CALCOLO RATA 1° SERIE CALCOLI TAEG **************************** ");
                  jqSimPrest.each(valori,function(i,el){
                      logg("CALCOLO RATA 1° SERIE CALCOLI TAEG ------------------------- ");
                      var elevazione=Math.pow((1+L4Test/100),-((i+1)/12));
                      logg("CALCOLO RATA 1° SERIE CALCOLI TAEG - elevazione => "+elevazione);
                      var valoreSpesa=(Number(el)+(altreSpese));
                      logg("CALCOLO RATA 1° SERIE CALCOLI TAEG - valoreSpesa => "+valoreSpesa);
                      logg("CALCOLO RATA 1° SERIE CALCOLI TAEG - valore test singolo => "+Number((valoreSpesa*elevazione)));
                      test+=Number((valoreSpesa*elevazione));
                      logg("CALCOLO RATA 1° SERIE CALCOLI TAEG - test => "+test);
                      logg("CALCOLO RATA 1° SERIE CALCOLI TAEG - pagamentiTaeg => "+pagamentiTaeg);
                      logg("CALCOLO RATA 1° SERIE CALCOLI TAEG ------------------------- ");
                  });
                  logg("CALCOLO RATA 1° SERIE CALCOLI TAEG **************************** ");
                   if (test-pagamentiTaeg<0) { break } else {
                      calcoloPagamentiConTaeg=test;
                      taegFinAprox=(j/100);
                   }
              }
              logg("CALCOLO RATA 1° SERIE CALCOLI TAEG - test-pagamentiTaeg<0 ");
              logg("CALCOLO RATA 1° SERIE CALCOLI TAEG ------------------------- ");
              logg("CALCOLO RATA 1° SERIE CALCOLI TAEG - L4Test final => "+L4Test);
              logg("CALCOLO RATA 1° SERIE CALCOLI TAEG - test final => "+test);
              logg("CALCOLO RATA 1° SERIE CALCOLI TAEG - calcoloPagamentiConTaeg final => "+calcoloPagamentiConTaeg);
              logg("CALCOLO RATA 1° SERIE CALCOLI TAEG ------------------------- ");
              logg("CALCOLO RATA 1° SERIE CALCOLI TAEG - taegFinAprox => "+taegFinAprox);
              
              
              var L4Test=0;

              // SECONDA SERIE DI CALCOLI TAEG con delta da -0.02 a +0.002 rispetto al taeg precedentemente calcolato
              for (let j=(taegFinAprox-0.2)*1000;j<((Number(taegFinAprox)+0.2)*1000);j++){
                  var test = primoPagamento;
                  
                  L4Test=j/1000;
                  jqSimPrest.each(valori,function(i,el){
                      var elevazione=Math.pow((1+L4Test/100),-((i+1)/12));
                      var valoreSpesa=(Number(el)+(altreSpese));
                      test+=Number((valoreSpesa*elevazione));
                  });
                  
                   if (test-pagamentiTaeg<0) { break } else {
                      calcoloPagamentiConTaeg=test;
                      taegFin=(j/1000);
                   }
              }
              obj.taeg=taegFin;
              logg("CALCOLO RATA 2° SERIE CALCOLI TAEG - taegFin => "+taegFin);


              // TERZA SERIE DI CALCOLI TAEG con delta da -0.02 a +0.002 rispetto al taeg precedentemente calcolato
              var L4Test=0;
              var taegFin2=0;
              for (let j=(taegFin-0.02)*10000;j<((Number(taegFinAprox)+0.02)*10000);j++){
                  var test = primoPagamento;
                  
                  L4Test=j/10000;
                  jqSimPrest.each(valori,function(i,el){
                      
                      var elevazione=Math.pow((1+L4Test/100),-((i+1)/12));
                      var valoreSpesa=(Number(el)+(altreSpese));
                      
                      test+=Number((valoreSpesa*elevazione));
                  });
                  
                   if (test-pagamentiTaeg<0) { break } else {
                      calcoloPagamentiConTaeg=test;
                      taegFin2=(j/10000);
                   }
              }
              logg("CALCOLO RATA 3° SERIE CALCOLI TAEG - taegFin2 => "+taegFin2);
              
              
              // dato TAEG finale
              obj.taeg=taegFin2;

              var taeg='<div>Taeg: '+obj.taeg+'</div>';


              // IMPORTO RATA MENSILE
              var toString='rata mensile:'+rataFin.toFixed(2);

              var rataFinale: any=rataFin.toFixed(2);
              rataFinale = rataFin;

              rataFin=rata;
              /*nel caso di tasso fisso uso sempre la formula standard*/
              rataInt=C7*C4/1200;

              // importo definitivo, prendiamo il dato da rataStandard
              rataFinale=rataStandard.toFixed(2);

              obj.rata=rataFin.toFixed(2);
              obj.durata=durataSimPrest;



              // INSERIMENTO VALORI E DATI IN PAGINA ALL'INTERNO DELL'OGGETTO mutuoObj
                                      
              var spreadString='';
              
              var speseIniziali=H5+H4;
              var importoFinanziato=C7;
              var interessi=mutuoObj.interessi;
              mutuoObj.name=obj.name;
              mutuoObj.importoRata=parserXMLPrestito.SistemaPunteggiaturaSimPrestText(rataFinale.toString());
              // taeg
              mutuoObj.taeg=obj.taeg.toFixedDown(2).toString().replace('.',',');
              mutuoObj.taegNum=Number(obj.taeg);
              mutuoObj.tan=Number(obj.tanR).toFixed(2).toString().replace('.',',');
              mutuoObj.istruttoria=parserXMLPrestito.SistemaPunteggiaturaSimPrestText(H4.toFixed(2).toString());
              mutuoObj.imposta=parserXMLPrestito.SistemaPunteggiaturaSimPrestText(H5.toFixed(2).toString())
              mutuoObj.importoRichiesto=jqSimPrest('#txtImportoPrest').val();
              mutuoObj.importoRichiesto2=parserXMLPrestito.SistemaPunteggiaturaSimPrestText(C3)+',00';
              mutuoObj.importoRichiestoNum=amountSimPrest;
              mutuoObj.numeroRate=parseInt(jqSimPrest('#cboDurataPrest').val(),10);
              mutuoObj.spese=parserXMLPrestito.SistemaPunteggiaturaSimPrestText(speseIniziali.toFixed(2).toString());
              mutuoObj.importoFinanziato=parserXMLPrestito.SistemaPunteggiaturaSimPrestText(importoFinanziato.toFixed(2).toString())
              // premio assicurativo
              mutuoObj.assicurazione=parserXMLPrestito.SistemaPunteggiaturaSimPrestText(H6.toFixed(2).toString());
              mutuoObj.interessi=parserXMLPrestito.SistemaPunteggiaturaSimPrestText(interessi.toFixed(2).toString())
              mutuoObj.costoTotale=parserXMLPrestito.SistemaPunteggiaturaSimPrestText((interessi+H5+H4).toFixed(2).toString());
              mutuoObj.importoTotale=parserXMLPrestito.SistemaPunteggiaturaSimPrestText((interessi+H5+H4+C3).toFixed(2).toString());
              mutuoObj.tanE=((Math.pow((1 + obj.tanR/100/12),12) - 1)*100).toFixed(8).toString().replace('.',',');
              mutuoObj.assicurazioneNum=H62;
              mutuoObj.assicurazioneNumStart=H6;
              mutuoObj.recesso= parserXMLPrestito.calcolaRecesso(obj).toFixed(2).toString().replace('.',',');
              
          mutuoObj.interessi=parserXMLPrestito.SistemaPunteggiaturaSimPrestText(interessi.toFixed(2).toString())
              amountSimPrestFin=C72;
              mutuoObj.valori=parserXMLPrestito.calcolaMedia(obj,true);
              
              mutuoObj.tan2=mutuoObj.tan+'0';
          
              var tipoTan='tasso variabile';
              
              
              /*
              var maxVal2=Number(mutuoObj.taegNum)+10;
              var taegFin3=0;
              var pagamentiTaeg2=mutuoObj.importoRichiestoNum+mutuoObj.assicurazioneNum;
              
  
              var primoPagamento2=mutuoObj.assicurazioneNum;
              
              
              
              var L4Test2=0;
              var altreSpese2=0;
      
              
              for (j=(mutuoObj.taegNum)*1000;j<(maxVal2*1000);j++){
                  var test2 = primoPagamento2;
                  
                  L4Test2=j/1000;
                  jqSimPrest.each(mutuoObj.valori,function(i2,el2){
                      
                      var elevazione2=Math.pow((1+L4Test2/100),-((i2+1)/12));
                      var valoreSpesa2=(Number(el2)+(altreSpese2));
                      
                      test2+=Number((valoreSpesa2*elevazione2));
                      //logg((test)+' '+pagamentiTaeg+' '+j+' '+elevazione+' '+valoreSpesa)
                  });
                  
                   if (test2-pagamentiTaeg2<0) { break } else {
                      
                      calcoloPagamentiConTaeg2=test2;
                      taegFin3=(j/1000);
                      
                   }
                  
              }
      
              mutuoObj.taegWithInsurance=taegFin3.toFixed(2).toString().replace('.',',');
              logg(mutuoObj.taeg)
              logg(mutuoObj.taegWithInsurance)
              logg(mutuoObj)
      */      
              
              var scheda=jqSimPrest('<div><div class="accSimPrestCont"><div class="rowSimPrest line-'+(i+1)+'"><!-- <div class="cellSimPrest mutuo"><p >'+obj.name+'</p></div> --><div class="cellSimPrest importo-mensile"><h3><span class="SimPrestHideMob">Importo </span>rata mensile</h3><p>'+mutuoObj.importoRata+'  \u20AC</p></div><div class="cellSimPrest taeg arrange"><h3>TAEG</h3><p>'+mutuoObj.taeg+' %</p></div></div><div class="SimPrestWhite"><div class="SimPrestLine"></div></div><div class="detailAccSimPrest"><div class="expandedTableSimPrest fl"><div class="subRowSimPrest tan"><div class="subRowCell"><h3>IMPORTO NETTO EROGATO</h3></div><div class="subRowCell"><p>'+mutuoObj.importoRichiesto + ''+' &euro;</p></div></div><div class="subRowSimPrest tan"><div class="subRowCell"><h3>TAN FISSO</h3></div><div class="subRowCell"><p>'+mutuoObj.tan+' %</p></div></div><!-- <div class="subRowSimPrest istruttoria"><div class="subRowCell"><h3>Spese istruttoria</h3></div><div class="subRowCell"><p>'+mutuoObj.istruttoria+' \u20AC</p></div></div><div class="subRowSimPrest perizia"><div class="subRowCell"><h3>Imposta sostitutiva</h3></div><div class="subRowCell"><p>'+mutuoObj.imposta+' \u20AC</p></div></div> --></div><div class="expandedTableSimPrest contactSimPrestTable fr"><div class="subRowSimPrest tan"><div class="subRowCell"><h3>SPESE INIZIALI</h3></div><div class="subRowCell arrange"><p>'+mutuoObj.spese + ''+' &euro;</p></div></div><div class="subRowSimPrest tan"><div class="subRowCell"><h3>IMPORTO FINANZIATO</h3></div><div class="subRowCell arrange"><p>'+mutuoObj.importoFinanziato + ' '+'&euro;</p></div></div><div class="subRowSimPrest perizia"><div class="subRowCell"><h3>Premio assicurativo *</h3></div><div class="subRowCell arrange"><p>'+mutuoObj.assicurazione+' \u20AC</p></div></div></div><div class="subRowSimPrest links"><div class="subRowCell"><a class="schedaSimPrest" target="_blank" href="'+obj.url+'" data-index="'+ i +'"> Scheda prodotto</a></div><div class="subRowCell"><a class="calcolaSimPrest"  data-index="'+i+'" data-index="'+ i +'"> Informativa IEBCC</a></div><div class="subRowCell"></div></div></div></div></div>');
              
              
              jqSimPrest('#accordionSimPrest').append(scheda);
              
          
          }



           logg("--------------------- CALCOLO RATA END ----------------------");
          
      });
          
          
      jqSimPrest('.expandSimPrest').off().on('click', function() {
              var parent=jqSimPrest(this).parents('.accSimPrestCont').eq(0);
              jqSimPrest('.rowSimPrest').removeClass('SimPrest-accordion-colored');

              if(jqSimPrest(parent).hasClass('SimPrestAccOpen')){
                  jqSimPrest(this).removeClass('contractSimPrest');
                  jqSimPrest(parent).removeClass('SimPrestAccOpen');
                  jqSimPrest('.detailAccSimPrest',parent).slideUp();
              } else {
                  jqSimPrest('.accSimPrestCont').removeClass('SimPrestAccOpen');
                  jqSimPrest(parent).addClass('SimPrestAccOpen');
                  jqSimPrest('.expandSimPrest').removeClass('contractSimPrest');
                  jqSimPrest(this).addClass('contractSimPrest');
                  jqSimPrest(this).parent().addClass('no-radius SimPrest-accordion-colored');
                  jqSimPrest('.detailAccSimPrest').slideUp();
                  jqSimPrest('.detailAccSimPrest',parent).slideDown();


              }
          })



      //click nel richiama

      jqSimPrest('.SimPrest-button-recall').each(function(){
          var index=Number(jqSimPrest(this).attr('data-index'));
          var obj=cacheContent[index];
          var argomento = (obj.name+' '+obj.rata+'\u20AC '+durataSimPrest+' mesi');
          var CPITitle = '';
          jqSimPrest(this).attr('target','_blank');

          var argSimPrest='Tool Prestito '+siglaPrestito+' '+amountSimPrest+'E '+durataSimPrest+'mesi '+ obj.rata.toString().replace('.',',') + 'E ' + CPITitle;

          var etaSimPrest=jqSimPrest('#txtEtaPrest').val();


          //  var segmentoSimPrest='Immobile_'+jqSimPrest('#txtValoreRedditoPrest').val()+'_eta_'+etaSimPrest+'_rata_'+obj.rata+'_taeg_'+obj.taeg+'_tasso_'+obj.tanR+'_istruttoria_'+obj.invFunc+'_perizia_'+obj.reportsFunc+'';
          var segmentoSimPrest=presetValoriSimPrest.segmento;

          var url = 'https://emanon.it/cconlinenew/CCONLINE/ExecuteRichiestaMail.do?CodProv=M&abilitaCF=true&Segmento='+escape(segmentoSimPrest)+'&ArgInt='+escape(argSimPrest)+'&ACTION_TO_CALL=/ToCCOnlineAction.do';

          jqSimPrest(this).attr('href',(url));
          jqSimPrest(this).attr('data-argSimPrest',escape(argSimPrest));
      });


      jqSimPrest('.SimPrest-button-recall').off().on('click', function(e) {


              var url=jqSimPrest(this).attr('href');
              var argSimPrest=jqSimPrest(this).attr('data-argSimPrest');

              FLOOD1('landi593', 'botto00');

              var index=Number(jqSimPrest(this).attr('data-index'));
              var obj=cacheContent[index];


              ga('send', 'event', 'Prestiti', siglaPrestito, jqSimPrest(this).text());


              if(presetValoriSimPrest.isPrivate){
                  // popupFattiRicontattare(argSimPrest)
              } else {



                  if(jqSimPrest(window).width()>640){
                      e.preventDefault();
                      parserXMLPrestito.openWindowSimPrest(url,'recall');
                  }
              }


          });


      jqSimPrest('#SimPrest-richiamare').each(function(){
          var CPITitle = '';
          jqSimPrest(this).attr('target','_blank');
          var argSimPrest='Tool Prestito '+siglaPrestito+' '+amountSimPrest+'E '+durataSimPrest+'mesi ' + CPITitle;
          var etaSimPrest=jqSimPrest('#txtEtaPrest').val();
          //var segmentoSimPrest='Immobile_'+jqSimPrest('#txtValoreRedditoPrest').val()+'_eta_'+etaSimPrest;
          var segmentoSimPrest=presetValoriSimPrest.segmento;
          var url = 'https://emanon.it/cconlinenew/CCONLINE/ExecuteRichiestaMail.do?CodProv=M&abilitaCF=true&Segmento='+escape(segmentoSimPrest)+'&ArgInt='+escape(argSimPrest)+'&ACTION_TO_CALL=/ToCCOnlineAction.do';
          jqSimPrest(this).attr('href',(url));
          jqSimPrest(this).attr('data-argSimPrest',escape(argSimPrest));

      })

      jqSimPrest('#SimPrest-richiamare').off().on('click', function(e) {


              ga('send', 'event', 'Tool Prestiti', 'non sai quale scegliere', 'ti chiamiamo noi');
              var url=jqSimPrest(this).attr('href');
              var argSimPrest=jqSimPrest(this).attr('data-argSimPrest');

              FLOOD1('landi593', 'botto001');

              if(presetValoriSimPrest.isPrivate){
                  // popupFattiRicontattare(argSimPrest)
              } else {


                  if(jqSimPrest(window).width()>640){
                      e.preventDefault();
                      parserXMLPrestito.openWindowSimPrest(url,'recall');
                  }

              }


          });


      jqSimPrest('.SimPrest-button-appointment').each(function(){
          var index=Number(jqSimPrest(this).attr('data-index'));
              var obj=cacheContent[index];
          jqSimPrest(this).attr('target','_blank');


          var CPITitle = '';

          var argSimPrest='Tool Prestito '+siglaPrestito+' '+amountSimPrest+'E '+durataSimPrest+'mesi '+ obj.rata.toString().replace('.',',') + 'E ' + CPITitle;




          var argomento = (obj.name+' '+obj.rata+'\u20AC '+durataSimPrest+' mesi');

          var url = 'https://emanon.it/trovaFilialenew/InitTrovaFiliale.do?lingua=it&type='+presetValoriSimPrest.segmento+'&idpass=&source=prendiappuntamentoCF&source_params=' + escape(argSimPrest);
          jqSimPrest(this).attr('href',(url));
          jqSimPrest(this).attr('data-argSimPrest',escape(argSimPrest));

      })

      //click nel prendi appuntamento
      jqSimPrest('.SimPrest-button-appointment').off().on('click', function(e) {


          var url=jqSimPrest(this).attr('href');
          var argSimPrest=jqSimPrest(this).attr('data-argSimPrest');

          var index=Number(jqSimPrest(this).attr('data-index'));
              var obj=cacheContent[index];


              ga('send', 'event', 'Prestiti', siglaPrestito, jqSimPrest(this).text());



          FLOOD1('landi593', 'botto000');

          if(presetValoriSimPrest.isPrivate){
              // popupPrendiApp(argSimPrest)
          } else {


              if(jqSimPrest(window).width()>640){
                  e.preventDefault();
                  parserXMLPrestito.openWindowSimPrest(url,'appointment');
              }
          }



      });


      jqSimPrest('.schedaSimPrest').click(function(e){

          var index=Number(jqSimPrest(this).attr('data-index'));
          var obj=cacheContent[index];


          ga('send', 'event', 'Prestiti', siglaPrestito, jqSimPrest(this).text());


      });





      jqSimPrest('.calcolaSimPrest').click(function(e){
          e.preventDefault();
          var index=Number(jqSimPrest(this).attr('data-index'));
          var obj=cacheContent[index];


          ga('send', 'event', 'Prestiti', siglaPrestito, jqSimPrest(this).text());

          parserXMLPrestito.calcolaPiano(this);
      });


      //questa è la stringa per controllare che il primo valore venga aperto di default

      if(presetValoriSimPrest.defaultOpen){
          jqSimPrest('.expandSimPrest').eq(0).click();

      }


              
  }
  return status;

      
  
  });


}