import { Component, h, Prop, State } from "@stencil/core";
import $ from "jquery";
import { togliPunti, urlParamSimPrest, parseToObj } from "./helper";
// import { ga } from  'google.analytics'

@Component({
  tag: "calcolo-prestito",
  styleUrl: "prestito.css",
  shadow: true
})
export class Prestito {
  // PROP
  @Prop() tipocanale: string;
  @Prop() tipoprestito: string;

  // STATE
  @State() jqSimPrest = $.noConflict();
  @State() amountSimPrest = 130000;
  @State() amountSimPrestFin = this.amountSimPrest;
  @State() reddito = 0;
  @State() durataSimPrest;
  // @State() rataSimPrest; //var is not used anywhere in the code
  @State() CPISimPrest = "SI";
  @State() finalitaSimPrest = 1;
  @State() valoreStartSimPrest;
  @State() siglaPrestito = "TF";
  @State() limitaMinValoreRedditoPrest = 0;
  @State() limitaMinImportoPrest = 5000;
  @State() limitaMaxAquistoPrest = 99000;
  @State() limitaMaxImportoPrest = this.limitaMaxAquistoPrest;
  @State() limitaMaxValoreRedditoPrest = 9999999;
  @State() mutuoObj = {};
  @State() importo;

  // APR(TAEG) decimal rounding threshold
  // soglia di arrotondamento decimale TAEG
  @State() thresholdTaeg = 8;

  @State() activeAnimPrest = true;
  @State() tassoUsuraPrest = 15;
  @State() isPariSimPrest = false;
  @State() presetValoriSimPrest = {
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

  // minimum loan term limit
  // limite minimo durata prestito
  @State() limitaMinDurata = this.presetValoriSimPrest.minDurata;
  // maximum loan term limit
  // limite massimo durata prestito
  @State() limitaMaxDurata = this.presetValoriSimPrest.maxDurata;

  @State() breakP;
  //@State() touchDeviceSimPrest=this.is_touch_deviceSimPrest();

  // check if localhost
  @State() localhost = location.href.indexOf("localhost") != -1;
  @State() dev = location.href.indexOf("fantasyindustries") != -1;
  @State() secureemanon =
    location.href.indexOf("banking.secure.emanon.it") != -1;

  @State() standardCall = "https://emanon.it/";

  @State() pressTimerSimPrest;
  @State() urlSimPrestProd =
    this.standardCall + "rsc/comunicazione/calcolo-prestiti/xml/";
  @State() urlSimPrestCol =
    this.standardCall + "rsc/comunicazione/calcolo-prestiti/xml/";

  @State() urlSimPrestSvil = "xml/";
  @State() urlSimPrestFin = this.urlSimPrestProd;
  @State() presetValoriSim = {
    isPrivate: false
  };

  @State() xmlDefSimPrest: string = "bnlLoansDefaultPrestito.xml";
  @State() IEBCCSimPrest: string = "IEBCC.html";
  @State() AllegatoSimPrest: string = "allegato.html";

  @State() xmlSimPrest: string = "bnlLoansPrestito.xml";

  connectedCallback() {
    console.log("^^^^^^^^^^");
    const isCollaudo = urlParamSimPrest("collaudo");
    const isSviluppo = urlParamSimPrest("sviluppo");

    if (isCollaudo) {
      this.xmlSimPrest = "bnlLoans_colPrestito.xml";
      this.xmlDefSimPrest = "bnlLoansDefaultPrestito_col.xml";
    } else if (isSviluppo) {
      this.urlSimPrestFin = this.urlSimPrestSvil;
    }

    parseToObj({ xmlToParse: this.xmlSimPrest, xmlToParseDef: this.xmlDefSimPrest });
    // this.getContent();
    // jqSimPrest('.SimPrest-container').tooltip({ tooltipClass: "calculator-amortization"});

    // resizeBg();

    setTimeout(function() {
      // resizeBg();
    }, 200);
  }
  //Prestito Engine
  setInitData() {
    console.log("setInitData");
    if (this.secureemanon) {
      this.standardCall = "https://banking.secure.emanon.it/";
      this.presetValoriSim.isPrivate = true;
    }
    // DEV ENVIRONMENT
    if (this.localhost) {
      this.standardCall = "http://localhost:63342/calcolaprestito/";
    }
    console.log("setInitData - this.localhost => " + this.localhost);

    if (this.dev) {
      this.standardCall = "http://www.fantasyindustries.it/dist/";
    }
    console.log("setInitData - this.dev => " + this.dev);

    console.log("setInitData - this.standardCall => " + this.standardCall);

    // DEV ENVIRONMENT
    if (this.localhost || this.dev) {
      this.urlSimPrestFin = this.standardCall + this.urlSimPrestSvil;
    }
    console.log("setInitData - this.urlSimPrestFin => " + this.urlSimPrestFin);
    if (this.localhost) {
      this.xmlSimPrest = "emanonLoansPrestito_Prod.xml";
    }
  }

  toFixed = (digits: number) => {
    var re = new RegExp("(\\d+\\.\\d{" + digits + "})(\\d)"),
      m = this.toFixed(0).match(re);
    // se esiste terzo decimale...
    // if there is a third decimal ...
    if (m) {
      // se il terzo decimale del taeg è uguale o superiore a 8 allora arrotondiamo per eccesso
      // if the third decimal of the taeg is equal to or greater than 8 then we round up
      if (m[2] >= this.thresholdTaeg) {
        var taeg = Number(m[0]);
        return taeg.toFixed(digits);
      } else {
        // altrimenti mostriamo il dato senza arrotondamenti
        // if the third decimal of the taeg is equal to or greater than 8 then we round up
        return m ? parseFloat(m[1]) : this.valueOf();
      }
      // ... altrimenti restituiamo il dato iniziale cosi come ci è stato fornito in input
      // ... otherwise we return the initial data as it was provided to us in input
    } else {
      return this.valueOf();
    }
  };

  logg = (msg: string) => {
    if (this.localhost) {
      console.log(msg);
    }
  };

  isTouchDeviceSimPrest = () => {
    return (
      "ontouchstart" in window ||
      navigator.maxTouchPoints > 0 ||
      navigator.msMaxTouchPoints > 0
    );
  };

  Reset() {
    /* ORIGINAL VERSION
    $('#accordionSimPrest').html('');
    $('#actPlanPrest,#actPlanPrest2').html('');
    */
  }
  // // // // // // // // // // // // // //  ALL FUNCTIONS // // // // // // // // // // // // // //

  handleBackPrest = (evt: Event) => {
    console.log("########", evt.target);
  };

  handleSelectFinalita = evt => {
    const value: string = evt.target.value;
    const title = evt.target.options[parseInt(value) - 1].title;
    window.ga("send", "event", "Prestiti", "finalita", title);
  };

  SistemaMesi = txtbox => {
    var valoreCorrente = this.jqSimPrest(txtbox).val();

    if (this.valoreStartSimPrest == valoreCorrente) return;
    var num = parseInt(valoreCorrente);
    this.jqSimPrest(txtbox)
      .next()
      .val(parseInt(togliPunti(this.jqSimPrest(txtbox)), 10));
    this.jqSimPrest(txtbox).val(valoreCorrente);
  };

  SistemaPunteggiaturaSimPrestText = (txt: string) => {
    var valoreCorrente = txt.toString();
    var decimali = "";
    if (valoreCorrente.indexOf(".") != -1) {
      decimali =
        "," +
        valoreCorrente.substring(
          valoreCorrente.indexOf(".") + 1,
          valoreCorrente.length
        );
      valoreCorrente = valoreCorrente.substring(0, valoreCorrente.indexOf("."));
    }

    var num = valoreCorrente.replace(/\D/g, ""); //solo caratteri numerici
    valoreCorrente = num.replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1.") + decimali;
    return valoreCorrente;
  };

  SalvaValoreInizialeSimPrest = txtbox => {
    this.Reset();
    this.valoreStartSimPrest = txtbox.value;
  };

  //   init() {
  //     console.log("init");
  //     this.setInitData()
  //   }
  render() {
    // this.init();
    return (
      <div class={"component-parent"}>
        Tipo canale: {this.tipocanale}
        <br />
        Tipo prestito: {this.tipoprestito}
        <br />
        urlSimPrestFin: {this.urlSimPrestFin}
        <div class="SimPrest-container">
          <div id="SimPrest-background">
            <div class="SimPrest-bgInt"></div>
          </div>

          <div class="calculator-amortization">
            <div class="SimPrest-content">
              <div class="SimPrest-container-step-1">
                <h1 id="startSimPrest">Calcola la rata del tuo prestito</h1>

                <div class="SimPrest-descr">
                  Inserisci i dati per conoscere la{" "}
                  <strong>rata del tuo prestito emanon</strong>; potrai
                  richiedere di essere ricontattato o prendere un appuntamento
                  in agenzia. Il servizio &egrave; gratuito e senza impegno.
                </div>

                <div class="SimPrest-slider-wrapper">
                  <div class="SimPrest-single-slider">
                    <label>Importo richiesto</label> <span class="meno">-</span>
                    <div id="sliderImportoPrest" class="SimPrest-slider"></div>
                    <span class="piu">+</span>
                    <div class="completeFormSimPrest">
                      <input
                        name="txtImportoPrest"
                        class="simPrestFocus"
                        type="text"
                        maxlength="9"
                        id="txtImportoPrest"
                        onKeyDown={e => this.SalvaValoreInizialeSimPrest(e)}
                        // onKeyUp={(e) => this.parserXMLPrestito.SistemaPunteggiatura(e)}
                        // onBlur={parserXMLPrestito.verificaLimitiTextbox(txtImportoPrest,5000,500000,true,false)}
                      />

                      <input
                        class="nextPrest"
                        maxlength="7"
                        type="number"
                        // onBlur="parserXMLPrestito.verificaLimitiTextbox2(this,5000,500000,true,false);"
                      />
                      <span class="unitSimPrest">&euro;</span>
                    </div>
                  </div>

                  <div class="SimPrest-single-slider">
                    <label>Durata</label> <span class="meno">-</span>
                    <div id="sliderDurataPrest" class="SimPrest-slider"></div>
                    <span class="piu">+</span>
                    <div class="completeFormSimPrest">
                      <input
                        type="text"
                        class="simPrestFocus"
                        id="cboDurataPrest"
                        maxlength="3"
                        // onKeyDown={(e) => parserXMLPrestito.SalvaValoreInizialeSimPrest(e)}
                        // onBlur="parserXMLPrestito.verificaLimitiTextbox(cboDurataPrest,36,120,false,false,true);"
                      />

                      <input
                        class="nextPrest"
                        maxlength="3"
                        type="number"
                        // onBlur="parserXMLPrestito.verificaLimitiTextbox2(this,36,120,false,false,true);"
                      />
                      <span class="unitSimPrest">Mesi</span>
                    </div>
                  </div>

                  <div class="SimPrest-single-slider last">
                    <label
                    //  for="cboFinalitaPrest"
                    >
                      Finalit&agrave;
                    </label>

                    <div class="SimPrest-styled-select">
                      <select
                        id="cboFinalitaPrest"
                        onInput={this.handleSelectFinalita}
                        // onchange={parserXMLPrestito.Reset()(parserXMLPrestito.aggiornaLimiteImporto(cboFinalitaPrest,txtImportoPrest,5000,500000,true))}
                      >
                        <option value="1" data-label="Auto" title="Auto">
                          Auto Moto camper nautica
                        </option>

                        <option value="2" data-label="Casa" title="Casa">
                          Casa
                        </option>

                        <option
                          value="3"
                          data-label="estinzione prestiti"
                          title="estinzione prestiti"
                        >
                          Estinzione prestiti
                        </option>

                        <option
                          value="4"
                          data-label="Efficientamento energetico dell'abitazione"
                          title="Efficientamento energetico dell'abitazione"
                        >
                          Efficientamento energetico dell'abitazione
                        </option>

                        <option
                          value="5"
                          data-label="spese personali, altro"
                          title="spese personali, altro"
                        >
                          Spese personali, altro
                        </option>
                      </select>
                    </div>
                  </div>
                </div>

                <div class="SimPrest-col-right">
                  <div class="SimPrest-box-wrapper">
                    <label
                    // for="txtValoreRedditoPrest"
                    >
                      Reddito mensile netto
                    </label>

                    <div class="completeFormSimPrest">
                      <input
                        type="text"
                        class="simPrestFocus"
                        maxlength="9"
                        id="txtValoreRedditoPrest"
                        // onKeyDown={(e) => parserXMLPrestito.SalvaValoreInizialeSimPrest(e)}
                        // onKeyUp={(e) => parserXMLPrestito.SistemaPunteggiatura(e)}
                        // onBlur="parserXMLPrestito.verificaLimitiTextbox(txtValoreRedditoPrest,0,9999999,false,false);"
                      />
                      <input
                        class="nextPrest"
                        maxlength="7"
                        type="number"
                        // onBlur="parserXMLPrestito.verificaLimitiTextbox2(this,0,9999999,false,false);"
                      />
                      <span class="unitSimPrest">&euro;</span>
                    </div>
                    <label
                    // for="txtEtaPrest"
                    >
                      Et&agrave; del richiedente
                    </label>

                    <div class="completeFormSimPrest">
                      <input
                        type="text"
                        id="txtEtaPrest"
                        // onKeyDown={(e) => parserXMLPrestito.SalvaValoreInizialeSimPrest(e)}
                        // onBlur="parserXMLPrestito.verificaLimitiTextbox(txtEtaPrest,18,99,false,false);"
                        class="simPrestFocus"
                        maxlength="2"
                      />

                      <input
                        class="nextPrest"
                        maxlength="2"
                        type="number"
                        // onBlur="parserXMLPrestito.verificaLimitiTextbox2(this,18,99,false,false);"
                      />
                      <span class="unitSimPrest">anni</span>
                    </div>
                  </div>

                  <div class="SimPrest-assicurazione">
                    <strong>Assicurazione (facoltativa)</strong>

                    <div class="SimPrest-groupCheckbox">
                      <input
                        id="cboCPIPrest"
                        // onchange="parserXMLPrestito.Reset();parserXMLPrestito.aggiornaLimiteImporto(cboCPIPrest,txtImportoPrest,5000,500000,true);"
                        type="checkbox"
                        value="NO"
                        title="Polizza CPI"
                      />
                      <label
                      // for="cboCPIPrest"
                      >
                        S&igrave;, voglio includere l'assicurazione sul prestito
                        *
                      </label>

                      <div class="label" style={{ paddingLeft: "30px" }}>
                        <a
                          href="https://emanon.it/rsc/contrib/document/Individui-e-Famiglie/SP_Prestiti/Informativa_assicurazione.pdf"
                          target="_blank"
                        >
                          (Leggi l'informativa)
                        </a>
                      </div>
                    </div>
                  </div>
                </div>

                <div class="SimPrest-clear"></div>
                <a
                  id="SimPrest-calcola"
                  href="#"
                  class="SimPrest-submit-button"
                  // name="SimPrest-calcola"
                >
                  CALCOLA RATA
                </a>
              </div>

              <div class="SimPrest-container-step-2">
                <h1 id="afterSimPrest">
                  <a
                    href="#"
                    id="come-backPrest2"
                    // name="come-backPrest2"
                    onClick={this.handleBackPrest}
                  >
                    CALCOLA LA RATA DEL TUO PRESTITO
                  </a>
                </h1>

                <div class="simResult">
                  <div class="SimPrest-recap">
                    <div class="SimPrest-col importo">
                      <h3>
                        Importo
                        <br />
                        richiesto
                      </h3>

                      <p id="importoRicPrest"></p>
                    </div>

                    <div class="SimPrest-col durata">
                      <h3>Durata</h3>

                      <p>
                        <span id="durataPrest"></span> mesi
                      </p>
                    </div>

                    <div class="SimPrest-col valore">
                      <h3>
                        Reddito
                        <br />
                        men. netto
                      </h3>

                      <p id="valoreRedd"></p>
                    </div>

                    <div class="SimPrest-col eta">
                      <h3>Et&agrave;</h3>

                      <p id="etaPrest"></p>
                    </div>

                    <div class="SimPrest-col assicurazione">
                      <h3>Assicurazione</h3>

                      <p id="CPIPrest"></p>
                    </div>

                    <div class="SimPrest-col cambia-dati">
                      <a
                        href="#"
                        id="come-backPrest"
                        // name="come-backPrest"
                      >
                        Cambia
                        <br />i dati
                      </a>
                    </div>
                  </div>

                  <div id="accordionSimPrest">
                    {" "}
                    {/* in original version was hardcoded in js */}
                    <div>
                      <div class="accSimPrestCont">
                        <div class="rowSimPrest line-1">
                          <div class="cellSimPrest importo-mensile">
                            <h3>
                              <span class="SimPrestHideMob">Importo </span>rata
                              mensile
                            </h3>
                            <p>157,11 €</p>
                          </div>
                          <div class="cellSimPrest taeg arrange">
                            <h3>TAEG</h3>
                            <p>8,50 %</p>
                          </div>
                        </div>
                        <div class="SimPrestWhite">
                          <div class="SimPrestLine"></div>
                        </div>
                        <div class="detailAccSimPrest">
                          <div class="expandedTableSimPrest fl">
                            <div class="subRowSimPrest tan">
                              <div class="subRowCell">
                                <h3>IMPORTO NETTO EROGATO</h3>
                              </div>
                              <div class="subRowCell">
                                <p>5.000 €</p>
                              </div>
                            </div>
                            <div class="subRowSimPrest tan">
                              <div class="subRowCell">
                                <h3>TAN FISSO</h3>
                              </div>
                              <div class="subRowCell">
                                <p>6,99 %</p>
                              </div>
                            </div>
                          </div>
                          <div class="expandedTableSimPrest contactSimPrestTable fr">
                            <div class="subRowSimPrest tan">
                              <div class="subRowCell">
                                <h3>SPESE INIZIALI</h3>
                              </div>
                              <div class="subRowCell arrange">
                                <p>89,06 €</p>
                              </div>
                            </div>
                            <div class="subRowSimPrest tan">
                              <div class="subRowCell">
                                <h3>IMPORTO FINANZIATO</h3>
                              </div>
                              <div class="subRowCell arrange">
                                <p>5.089,06 €</p>
                              </div>
                            </div>
                            <div class="subRowSimPrest perizia">
                              <div class="subRowCell">
                                <h3>Premio assicurativo *</h3>
                              </div>
                              <div class="subRowCell arrange">
                                <p>0,00 €</p>
                              </div>
                            </div>
                          </div>
                          <div class="subRowSimPrest links">
                            <div class="subRowCell">
                              <a
                                class="schedaSimPrest"
                                target="_blank"
                                href="https://emanon.it/rsc/contrib/document/Individui-e-Famiglie/SP_Prestiti/PERSONALE_INNOVO_PRESTITO.pdf"
                                data-index="0"
                              >
                                {" "}
                                Scheda prodotto
                              </a>
                            </div>
                            <div class="subRowCell">
                              <a class="calcolaSimPrest" data-index="0">
                                {" "}
                                Informativa IEBCC
                              </a>
                            </div>
                            <div class="subRowCell"></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div class="accSimPrestCont">
                  <div class="subRowSimPrest recall">
                    <div class="subRowCell">
                      <div class="SimPrestText">
                        <span>Vuoi maggiori dettagli?</span>
                      </div>
                    </div>

                    <div class="subRowCell">
                      <a
                        class="SimPrest-submit-button SimPrest-button-recall"
                        data-index="0"
                      >
                        TI CHIAMIAMO NOI
                      </a>
                    </div>

                    <div class="subRowCell">
                      <a
                        class="SimPrest-submit-button SimPrest-button-appointment"
                        data-index="0"
                      >
                        CHIEDI IN FILIALE
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* <SimPrestDisclaimer /> */}
          {/* <div class="SimPrest-disclaimer">
            <strong>* Polizza emanon Prestiti Personali e Polizza emanon Prestiti Personali Premium
              sono coperture assicurative facoltative - emesse da Cardif Assurance Vie e Cardif
              Assurances Risques Divers e distribuite da emanon - che hanno l'obiettivo di tutelare
              il Cliente fornendo una protezione dagli eventi che possono compromettere la
              capacit&agrave; di rimborsare il finanziamento. A titolo esemplificativo si mostra
              l'informativa e il premio relativo alla Polizza emanon Prestiti Personali dedicata a
              tutti i clienti che prevede le garanzie Decesso, Invalidit&agrave; Permanente e
              Inabilit&agrave; Temporanea Totale. Si informa che Polizza emanon Prestiti Personali
              Premium con garanzia Perdita d'Impiego, dedicata esclusivamente ai clienti
              lavoratori dipendenti di azienda privata, &egrave; disponibile presso tutte le
              agenzie emanon. Prima dell'adesione leggere le Condizioni di Assicurazione disponibili
              presso tutte le Filiali emanon e sui siti <a href="https://www.emanon.it">www.emanon.it</a>
              e <a href=
                     "http://www.bnpparibascardif.it">www.bnpparibascardif.it</a></strong><br />
            <br />
            Le informazioni ottenute attraverso il sistema di preventivazione on line, e
            contenute nel modulo IEBCC, sono rappresentative delle condizioni offerte dalla
            Banca alla data dell'effettuazione del preventivo (e della relativa produzione del
            modulo); esse non possono dunque considerarsi vincolanti qualora, all'effettiva
            data di conclusione del contratto, le condizioni pubblicizzate dalla Banca in
            relazione al prodotto oggetto del presente documento dovessero essere nel frattempo
            mutate. Inoltre, per motivazioni di carattere strettamente tecnico, le suddette
            informazioni potrebbero differire in misura non significativa rispetto a quelle
            contenute nel modulo IEBCC consegnato al cliente nelle Agenzie emanon.
          </div>*/}
        </div>
        <div id="actPlanPrest2"></div>
      </div>
    );
  }
}
