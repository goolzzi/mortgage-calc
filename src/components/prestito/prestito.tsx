import {Component, h, Prop, State, Event} from '@stencil/core';
import $ from "jquery";
// import {ga} from  'google.analytics'

@Component({
  tag: 'calcolo-prestito',
  styleUrl: 'prestito.css',
  shadow: true
})


export class Prestito {
  
  // PROP
  @Prop() tipocanale: string;
  @Prop() tipoprestito: string;
  
  
  // STATE
  @State() jqSimPrest = $.noConflict();
  @State() amountSimPrest=130000;
  @State() amountSimPrestFin=this.amountSimPrest;
  @State() reddito=0;
  @State() durataSimPrest;
  // @State() rataSimPrest; //var is not used anywhere in the code
  @State() CPISimPrest='SI';
  @State() finalitaSimPrest=1;
  @State() valoreStartSimPrest;
  @State() siglaPrestito='TF';
  @State() limitaMinValoreRedditoPrest = 0;
  @State() limitaMinImportoPrest = 5000;
  @State() limitaMaxAquistoPrest = 99000;
  @State() limitaMaxImportoPrest = this.limitaMaxAquistoPrest;
  @State() limitaMaxValoreRedditoPrest = 9999999;
  @State() mutuoObj={};
  @State() importo;
  
  // APR(TAEG) decimal rounding threshold
  // soglia di arrotondamento decimale TAEG
  @State() thresholdTaeg = 8;
  
  @State() activeAnimPrest=true;
  @State() tassoUsuraPrest=15;
  @State() isPariSimPrest=false;
  @State() presetValoriSimPrest={
    defFinalita:'5',
    defImporto:5000,
    defReddito:2500,
    defAge:37,
    defDurata:36,
    defCPI:'NO',
    minDurata:36,
    maxDurata:120,
    segmento:'individuiefamiglie',
    defaultOpen:false,
    isPrivate:false
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
  @State() localhost = location.href.indexOf('localhost') != -1;
  @State() dev = location.href.indexOf('fantasyindustries') != -1;
  @State() secureemanon = location.href.indexOf('banking.secure.emanon.it')!=-1;

  @State() standardCall='https://emanon.it/';

  @State() pressTimerSimPrest;
  @State() urlSimPrestProd=this.standardCall+'rsc/comunicazione/calcolo-prestiti/xml/';
  @State() urlSimPrestCol=this.standardCall+'rsc/comunicazione/calcolo-prestiti/xml/';


  @State() urlSimPrestSvil='xml/';
  @State() urlSimPrestFin=this.urlSimPrestProd;
  @State() presetValoriSim={
    isPrivate: false
  };
    
  @State() xmlDefSimPrest: string = 'emanonLoansDefaultPrestito.xml';
  @State() IEBCCSimPrest: string = 'IEBCC.html';
  @State() AllegatoSimPrest: string  ='allegato.html';

  @State() xmlSimPrest: string ='emanonLoansPrestito.xml';


//Prestito Engine
  setInitData() {
    console.log("setInitData");
    if (this.secureemanon) {
      this.standardCall='https://banking.secure.emanon.it/';
      this.presetValoriSim.isPrivate=true;
    }
    // DEV ENVIRONMENT
    if(this.localhost){
      this.standardCall='http://localhost:63342/calcolaprestito/';
    }
    console.log("setInitData - this.localhost => "+this.localhost);

    if(this.dev){
      this.standardCall='http://www.fantasyindustries.it/dist/';
    }
    console.log("setInitData - this.dev => "+this.dev);

    console.log("setInitData - this.standardCall => "+this.standardCall);

    // DEV ENVIRONMENT
    if(this.localhost || this.dev){
      this.urlSimPrestFin=this.standardCall+this.urlSimPrestSvil;
    }
    console.log("setInitData - this.urlSimPrestFin => "+this.urlSimPrestFin);
    if(this.localhost){
      this.xmlSimPrest='emanonLoansPrestito_Prod.xml';
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
    if (this.localhost) { console.log(msg);}
  }
  
  

  isTouchDeviceSimPrest = () => {
    return (('ontouchstart' in window) || (navigator.maxTouchPoints > 0) || (navigator.msMaxTouchPoints > 0));
  }


  Reset() {
    /* ORIGINAL VERSION
    $('#accordionSimPrest').html('');
    $('#actPlanPrest,#actPlanPrest2').html('');
    */
  }
// // // // // // // // // // // // // //  ALL FUNCTIONS // // // // // // // // // // // // // //

// parserXMLPrestito = () => {
//   return {
//       cache:{
//           content:[]
//       },
//       config: {
//           content:{
//               xmlToParse: xmlSimPrest,
//               xmlToParseDef: xmlDefSimPrest,
//                getObj() {
//                   parserXMLPrestito.parseToObj(this);
//               }
//           }
//       },

// changeRangeData = () => {
            
//   //var valoreReddito=Number(jqSimPrest('#txtValoreRedditoPrest').val().replace('.','').replace(',','.'));
  
//   var importo=parseInt(parserXMLPrestito.togliPunti(jqSimPrest('#txtImportoPrest')), 10);
//   //var importo=Number(jqSimPrest('#txtImportoPrest').val().replace('.','').replace(',','.'));
//   durataSimPrest=parseInt(jqSimPrest('#cboDurataPrest').val(),10);
//   CPISimPrest=(jqSimPrest('#cboCPIPrest').is(':checked'))? 'SI':'NO';
  
  

//   jqSimPrest('#CPIPrest').text(CPISimPrest);

//   amountSimPrest=importo;
  
//   reddito=parseInt(parserXMLPrestito.togliPunti(jqSimPrest('#txtValoreRedditoPrest')), 10);

//   finalitaSimPrest=Number(jqSimPrest('#cboFinalitaPrest').val());

  
//   jqSimPrest('#finalitaPrest').text(jqSimPrest('#cboFinalitaPrest option[value='+finalitaSimPrest+']').attr('title'));
//   jqSimPrest('#valoreRedd').text(jqSimPrest('#txtValoreRedditoPrest').val()+ '\u20AC');
//   jqSimPrest('#importoRicPrest').text(jqSimPrest('#txtImportoPrest').val() + '\u20AC');
//   jqSimPrest('#etaPrest').text(jqSimPrest('#txtEtaPrest').val() + ' anni');
  
  
  
  
//   jqSimPrest('#durataPrest').text(durataSimPrest);
//    jqSimPrest.each(parserXMLPrestito.cache.content,function(i,el){
//           /*recupero i valori*/
//           var obj=parserXMLPrestito.cache.content[i];
                              
          
          
          
              
//               /*setto i valori con soglia rispetto a quelli inseriti*/
              
//               /*###############################*/
              
//               obj.name=parserXMLPrestito.functionRange(i,'nameStart');
              
//               obj.fix=parserXMLPrestito.functionRange(i,'fixCalc');
              
//               obj.url=parserXMLPrestito.functionRange(i,'urlStart');
//               obj.url2=parserXMLPrestito.functionRange(i,'urlStart2');
                                      
//               obj.invFunc=(1-obj.discInv)*parserXMLPrestito.functionRange(i,'inv');
//               obj.reportsFunc=parserXMLPrestito.functionRange(i,'reports');
//               obj.taxFunc=parserXMLPrestito.functionRange(i,'tax');
              
//               obj.tanS=parserXMLPrestito.functionRange(i,'tanSCalc');
              
//               obj.cap=parserXMLPrestito.functionRange(i,'capCalc');
              
//               obj.spread=parserXMLPrestito.functionRange(i,'spreadCalc');
                  
          
//       });
// },

// start = () => {
//   jqSimPrest('body').append('<div class="modalSimPrestPrest"><div class="SimPrestCont"><a class="frameClose">X</a><iframe id="SimPrestFrame" src="" frameborder="0"></iframe></div></div>');
//   jqSimPrest('body').append('<div id="dialogSimPrestPrest"></div>');
//   jqSimPrest('body').append('<div class="modalPianoPrest"><div class="SimPrestCont"><a class="frameClose SimPrest-close-fixed">X</a><div id="actPlanPrest"></div></div></div>');
      
  
//   jqSimPrest('.frameClose').click(function(e){
//       e.preventDefault();
      
//       parserXMLPrestito.closeWindowSimPrest();
//   });
  
//   jqSimPrest('a[href]').click(function(e){
      
//       ga('send', 'event', 'Prestiti', siglaPrestito, jqSimPrest(this).text());
      
//   });
  
//   jqSimPrest('.simPrestFocus').focus(function(){
//       if(touchDeviceSimPrest){
//           jqSimPrest(this).hide();
//           jqSimPrest(this).next().show().focus();
//       }
      
//   });
  
  
//   var orderedObj=[];
//   jqSimPrest.each(parserXMLPrestito.cache.content,function(i,el){
//       var obj=parserXMLPrestito.cache.content[i];
//       if(obj.type==presetValoriSimPrest.firstType){
//           orderedObj.push(obj);
          
//       }
//       if(i==(parserXMLPrestito.cache.content.lenght-1)){
      
//           parserXMLPrestito.presetValoriSimPrestFunc();
//       }
//   })
  
  
//   jqSimPrest.each(parserXMLPrestito.cache.content,function(i,el){
//       var obj=parserXMLPrestito.cache.content[i];
//       if(obj.type!=presetValoriSimPrest.firstType){
//           orderedObj.push(obj);
          
//       }
//   })
//   logg ("BEFORE: => "+ JSON.stringify(parserXMLPrestito.cache.content));
//   parserXMLPrestito.cache.content=orderedObj;
//   logg ("AFTER: => "+ JSON.stringify(parserXMLPrestito.cache.content));


//   /*click al primo calcolo su bottone CALCOLA RATA*/
//   /* click on the first calculation on the button CALCULATE INSTALLMENT*/

//   jqSimPrest('#SimPrest-calcola').click(function(e){
      
//       e.preventDefault();

//        var status = parserXMLPrestito.ValidaFiltri();
//       isPariSimPrest=(isPariSimPrest==true)? false : true;
//        var divContenuto = document.getElementById('divContenuto');
  
//   if (status) {
//       ga('send', 'event', 'Prestiti', 'calcola ora', 'calcola ora')
//        parserXMLPrestito.Reset();
       
//        if(activeAnimPrest){
//           jqSimPrest('.SimPrest-container-step-1' ).hide("slide", { direction: "left" }, 500);
//           jqSimPrest('.SimPrest-container-step-2').delay(500).show("slide", { direction: "left" }, 500);
          
          
//       }
      
//        jqSimPrest.each(parserXMLPrestito.cache.content,function(i,el){
//            logg("------------------ CALCOLO RATA BEGIN -------------------------");


//           /*recupero i valori*/
//           /* I recover the values */
//           var obj=parserXMLPrestito.cache.content[i];


//           logg("parserXMLPrestito.cache.content => "+JSON.stringify(parserXMLPrestito.cache.content));
                              
          
//           //jqSimPrest('#txtImportoPrest').val(amount)
          
//           if(true){
              
//               logg ("CALCOLO RATA tanS => "+obj.tanS);
//               obj.tanR=obj.tanS;
              
              
              
//               /*stampo i risultati*/
//               /* print the results */
              

//               var rata=0;
//               var rataCap=0;
//               var rataInt=0;
//               var rataFin=0;
              
//               /*per semplitita' uso il nome delle variabili dell'excel*/
//               // RACCOLTA VARIABILI E DATI
              
//               /* for simplicity I use the name of the excel variables */
//               // VARIABLE AND DATA COLLECTION
              
//               var C2=obj.cap; //cap
          
//               var C3=amountSimPrest; //importo (amount)
//               var C4=obj.tanS; //tan
//               CPISimPrest=(jqSimPrest('#cboCPIPrest').is(':checked'))? 'SI':'NO';

//               var C5=CPISimPrest; //cpi
//               var C6=Number(durataSimPrest); //durata mesi (# of months)

//               var E2=C6;
//               // C4 = tanS
//               var E3=C4;
//               // C6 DURATA MESI (C6 MONTH DURATION)
//               var E4=C6;

//               //var H7=H11:H311; //Totale dovuto (Total due)
//               //var H8=H7-H6; //Totale dovuto netto CPI (Total net CPI payable)
//               var M4=obj.discInv //Sconto Spese  Istruttoria ( Discount on preliminary fees)

//               var C7=0;
//               var C72=0;

//               // calcolo int1
//               var int1=0;
//               // Se la durata mesi (C6) è maggiore di 18 allora si calcola int1 in questo modo
//               // If the duration of months (C6) is greater than 18 then we calculate int1 in this way
//               if(C6>18){int1=0.25/100};
//               var I5=int1;

//               // calcolo int2
//               var int2=1.08/100*C6/12;
//               // Se invece la durata mesi (C6) è maggiore di 60 allora si calcola nel seguente modo
//               // If the duration of months (C6) is greater than 60, then it is calculated as follows
//               if(C6>60){int2=0.6/100*C6/12}

//               // calcolo int3
//               // calculation int3
//               var int3=0;
//               if(C5=="SI"){
//                   int3=int2
//               } 

//               var I4=int3;

//               // CALCOLO IMPORTO FINANZIATO
//               // CALCULATION OF THE FINANCED AMOUNT
//               var I7=(C3/(1-((0.5/100*C6/12)*(1-M4)+int1+int3)));
//               var I72=(C3/(1-((0.5/100*C6/12)*(1-M4)+int1+int2)));

//               var I6=0.5/100*(I7)*C6/12;

//               var C72=I72;
//               C7=I7;

//               var control=(0.5/100*(C3/(1-((0.5/100*C6/12)*(1-M4)+I5+I4)))*C6/12);

//               // I8 = importo finanziato
//               // I8 = amount financed
//               logg("IMPORTO FINANZIATO int1 => "+int1);
//               logg("IMPORTO FINANZIATO int2 => "+int2);
//               logg("IMPORTO FINANZIATO int3 => "+int3);
//               logg("IMPORTO FINANZIATO C2 (cap) => "+C2);
//               logg("IMPORTO FINANZIATO C3 (importo del prestito) => "+C3);
//               //var I8=(Number(Number(C3)+Number(C2))/(1-Number(Number(int1)+Number(int3))));
//               // C2 è il cap
//               // C2 is the cap
//               let firstPartI8 = (Number(C3)+Number(C2));
//               logg("IMPORTO FINANZIATO firstPartI8 => "+firstPartI8);
//               let secondPartI8 = (1-Number(Number(int1)+Number(int3)));
//               logg("IMPORTO FINANZIATO secondPartI8 => "+secondPartI8);
//               let I8Final = (Number (firstPartI8 / secondPartI8));
//               logg("IMPORTO FINANZIATO I8Final => "+I8Final);
//               let I8 = I8Final;
//               logg("IMPORTO FINANZIATO I8 => "+I8);
//               var I82=(Number(Number(C3)+Number(C2))/(1-Number(Number(int1)+Number(int2))));

//               logg("IMPORTO FINANZIATO C7 => "+C7);
//               logg("IMPORTO FINANZIATO C72 => "+C72);
//               logg("IMPORTO FINANZIATO I8 => "+I8);
                  
//               if(control>C2){
//                   C7=I8;
//                   C72=I82;
//               }
              
//               amountSimPrestFin=C7;



//               // CALCOLO SPESE ISTRUTTORIA
//               // CALCULATION OF INQUIRY EXPENSES
//               obj.inv=Math.min.apply(Math, [C2,0.5/100*C7*C6/12])*(1-M4);
//               var H4=obj.inv;

//               // CALCOLO IMPOSTA SOSTITUTIVA
//               // CALCULATION OF SUBSTITUTE TAX
//               var H5=0 //IF(C6>18;0.25/100*C7;0); // Imposta sostitutiva (Substitutive tax)
//               if(C6>18){
//                   H5=0.25/100*C7;
//               }
              
//               // PREMIO ASSICURATIVO
//               // INSURANCE PREMIUM
//               var H6=0 // IF(C5="SI";IF(C6>60;0.6/100*C7*C6/12;1.08/100*C7*C6/12);0); // Polizza CPI (CPI policy)
//               var H62=0;
//               if(C6>60){
//                   H62=0.6/100*C72*C6/12
//               } else {
//                   H62=1.08/100*C72*C6/12
//               }
//               if(C5=='SI'){
//                   if(C6>60){
//                       H6=0.6/100*C7*C6/12
//                   } else {
//                       H6=1.08/100*C7*C6/12
//                   }
//               } else {
//                   H6=0;
//               }

              
//               /*calcolo il numero di giorni del prosSimPresto mese*/
//               /* calculate the number of days in the next month */
//               var nowSimPrest=new Date();
//               var thisM=new Date(nowSimPrest);
//               thisM.setDate(thisM.getDate()-1);
//               var nextM2=new Date(thisM); 
//               var nextM3=new Date((thisM.getMonth()+1)+'/'+thisM.monthDays()+'/'+thisM.getFullYear());
//               var testDate=new Date(nextM3);  
//               testDate.setDate(nextM3.getDate()+1);
//               nextM3.setDate(nextM3.getDate()+testDate.monthDays());
//               giorniStart=nextM3.monthDays();
              
//               var D10=nextM3.monthDays();

//               logg ("H10 (giorni prox mese) => ",JSON.stringify(D10));


//               // CALCOLO RATA
//               /*calcolo rata con la formula standard*/
//               // questa è la rata mostrata all'utente

//               // CALCULATION OF INSTALLMENT
//               /* installment calculation with the standard formula */
//               // this is the installment shown to the user
//               rata = parserXMLPrestito.PMT(E3/1200,E4,-C7);

//               logg ("rata => "+ rata);

//               /*calcolo rata capita con la formula standard*/
//               /* installment calculation happens with the standard formula*/
//               rataCap=rata-C7*E3/1200;
//               logg ("rataCap => "+ rataCap);

//               var giorni=D10;

//               rataInt=C7*E2/36000*D10;
//               logg ("rataInt => "+ rataInt);

//               rataFin=rataCap+rataInt;
//               logg ("rataFin => "+ rataFin);

//               var rataStandard=rata;
//               logg("CALCOLO RATA rataStandard => "+rataStandard);
//               mutuoObj.interessi=0;
//               var valori=parserXMLPrestito.calcolaMedia(obj);
              
//               var primoPagamento=0;



//               // TAEG
//               /* calcolo gli interessi con la formula che tiene conto dei giorni del prosSimPresto mese per il variabile*/
//               /* I calculate interest with the formula that takes into account the days of the next month for the variable */
//               var taegTest=C4;
//               // taeg finale
//               var taegFin=0;
//               // taeg intermedio
//               // intermediate taeg
//               var taegFinAprox=0;
//               //var pagamentiTaeg=amountSimPrest;
//               //####### chiedere
//               // importo del prestito richiesto + premio assicurativo
              
//               //####### to ask
//               // amount of the loan requested + insurance premium
//               var pagamentiTaeg=amountSimPrest+H6;
//               var calcoloPagamentiConTaeg=0;
//               // costante che indica il massimo valore possibile per il TAEG prima di rientrare nella categoria usurante
//               // constant indicating the maximum possible value for the APR before falling into the wearing category
//               var maxVal=(tassoUsuraPrest*100);
//               // rata TAEG provvisoria (serve per controllarla durante il ciclo di calcoli successivi)
//               // temporary APR installment (used to check it during the cycle of subsequent calculations)
//               var L4Test=0;
//               var altreSpese=0;
//               // variabile di appoggio per calcolare, ad ogni ciclo, il valore della somma delle rate + TAEG
//               // support variable to calculate, at each cycle, the value of the sum of the installments + APR
//               var test=0;

//               // la variabile valori contiene l'elenco delle rate mensili calcolate
//               // the variable values contains the list of calculated monthly installments
//               logg("CALCOLO RATA 1° SERIE CALCOLI TAEG - valori => "+valori);
//               logg("CALCOLO RATA 1° SERIE CALCOLI TAEG - valori.length => "+valori.length);
              
//               // PRIMA SERIE DI CALCOLI TAEG
//               // si inizia dal tan*100 fino ad arrivare al tasso di usura per i prestiti

//               // FIRST SERIES OF APR CALCULATIONS
//               // we start from tan * 100 up to the loan usury rate
//               for (j=C4*100;j<(maxVal);j++){
//                   test = primoPagamento;
//                   L4Test=j/100;
//                   logg("CALCOLO RATA 1° SERIE CALCOLI TAEG - L4Test => "+L4Test);
//                   var i=0;
//                   // nel ciclo interno secondario si sommano le rate fino ad arrivare all'importo finanziato
//                   // qui si cerca di capire quale sia il taeg da usare per questo tipo di importo e rateazione

//                   // in the internal secondary cycle, the installments are added up to the amount financed
//                   // here we try to understand which taeg to use for this type of amount and installments

//                   logg("CALCOLO RATA 1° SERIE CALCOLI TAEG **************************** ");
//                   jqSimPrest.each(valori,function(i,el){
//                       logg("CALCOLO RATA 1° SERIE CALCOLI TAEG ------------------------- ");
//                       var elevazione=Math.pow((1+L4Test/100),-((i+1)/12));
//                       logg("CALCOLO RATA 1° SERIE CALCOLI TAEG - elevazione => "+elevazione);
//                       var valoreSpesa=(Number(el)+(altreSpese));
//                       logg("CALCOLO RATA 1° SERIE CALCOLI TAEG - valoreSpesa => "+valoreSpesa);
//                       logg("CALCOLO RATA 1° SERIE CALCOLI TAEG - valore test singolo => "+Number((valoreSpesa*elevazione)));
//                       test+=Number((valoreSpesa*elevazione));
//                       logg("CALCOLO RATA 1° SERIE CALCOLI TAEG - test => "+test);
//                       logg("CALCOLO RATA 1° SERIE CALCOLI TAEG - pagamentiTaeg => "+pagamentiTaeg);
//                       logg("CALCOLO RATA 1° SERIE CALCOLI TAEG ------------------------- ");
//                   });
//                   logg("CALCOLO RATA 1° SERIE CALCOLI TAEG **************************** ");
//                    if (test-pagamentiTaeg<0) { break } else {
//                       calcoloPagamentiConTaeg=test;
//                       taegFinAprox=(j/100);
//                    }
//               }
//               logg("CALCOLO RATA 1° SERIE CALCOLI TAEG - test-pagamentiTaeg<0 ");
//               logg("CALCOLO RATA 1° SERIE CALCOLI TAEG ------------------------- ");
//               logg("CALCOLO RATA 1° SERIE CALCOLI TAEG - L4Test final => "+L4Test);
//               logg("CALCOLO RATA 1° SERIE CALCOLI TAEG - test final => "+test);
//               logg("CALCOLO RATA 1° SERIE CALCOLI TAEG - calcoloPagamentiConTaeg final => "+calcoloPagamentiConTaeg);
//               logg("CALCOLO RATA 1° SERIE CALCOLI TAEG ------------------------- ");
//               logg("CALCOLO RATA 1° SERIE CALCOLI TAEG - taegFinAprox => "+taegFinAprox);
              
              
//               var L4Test=0;
//               // SECOND SERIES OF APR CALCULATIONS with delta from -0.02 to +0.002 compared to the taeg previously calculated
//               // SECONDA SERIE DI CALCOLI TAEG con delta da -0.02 a +0.002 rispetto al taeg precedentemente calcolato
//               for (j=(taegFinAprox-0.2)*1000;j<((Number(taegFinAprox)+0.2)*1000);j++){
//                   var test = primoPagamento;
                  
//                   L4Test=j/1000;
//                   jqSimPrest.each(valori,function(i,el){
//                       var elevazione=Math.pow((1+L4Test/100),-((i+1)/12));
//                       var valoreSpesa=(Number(el)+(altreSpese));
//                       test+=Number((valoreSpesa*elevazione));
//                   });
                  
//                    if (test-pagamentiTaeg<0) { break } else {
//                       calcoloPagamentiConTaeg=test;
//                       taegFin=(j/1000);
//                    }
//               }
//               obj.taeg=taegFin;
//               logg("CALCOLO RATA 2° SERIE CALCOLI TAEG - taegFin => "+taegFin);


//               // TERZA SERIE DI CALCOLI TAEG con delta da -0.02 a +0.002 rispetto al taeg precedentemente calcolato
//               // THIRD SERIES OF APR CALCULATIONS with delta from -0.02 to +0.002 compared to the taeg previously calculated
//               var L4Test=0;
//               var taegFin2=0;
//               for (j=(taegFin-0.02)*10000;j<((Number(taegFinAprox)+0.02)*10000);j++){
//                   var test = primoPagamento;
                  
//                   L4Test=j/10000;
//                   jqSimPrest.each(valori,function(i,el){
                      
//                       var elevazione=Math.pow((1+L4Test/100),-((i+1)/12));
//                       var valoreSpesa=(Number(el)+(altreSpese));
                      
//                       test+=Number((valoreSpesa*elevazione));
//                   });
                  
//                    if (test-pagamentiTaeg<0) { break } else {
//                       calcoloPagamentiConTaeg=test;
//                       taegFin2=(j/10000);
//                    }
//               }
//               logg("CALCOLO RATA 3° SERIE CALCOLI TAEG - taegFin2 => "+taegFin2);
              
              
//               // dato TAEG finale
//               obj.taeg=taegFin2;

//               var taeg='<div>Taeg: '+obj.taeg+'</div>';


//               // IMPORTO RATA MENSILE
//               // MONTHLY INSTALLMENT AMOUNT
//               var toString='rata mensile:'+rataFin.toFixed(2);

//               var rataFinale=rataFin.toFixed(2);
//               rataFinale = rataFin;

//               rataFin=rata;
//               /*nel caso di tasso fisso uso sempre la formula standard*/
//               rataInt=C7*C4/1200;

//               // importo definitivo, prendiamo il dato da rataStandard
//               rataFinale=rataStandard.toFixed(2);

//               obj.rata=rataFin.toFixed(2);
//               obj.durata=durataSimPrest;



//               // INSERIMENTO VALORI E DATI IN PAGINA ALL'INTERNO DELL'OGGETTO mutuoObj
//               // ENTERING VALUES AND DATA ON THE PAGE INSIDE THE OBJECT mortgage Obj                  
//               var spreadString='';
              
//               var speseIniziali=H5+H4;
//               var importoFinanziato=C7;
//               var interessi=mutuoObj.interessi;
//               mutuoObj.name=obj.name;
//               mutuoObj.importoRata=parserXMLPrestito.SistemaPunteggiaturaSimPrestText(rataFinale.toString());
//               // taeg
//               mutuoObj.taeg=obj.taeg.toFixedDown(2).toString().replace('.',',');
//               mutuoObj.taegNum=Number(obj.taeg);
//               mutuoObj.tan=Number(obj.tanR).toFixed(2).toString().replace('.',',');
//               mutuoObj.istruttoria=parserXMLPrestito.SistemaPunteggiaturaSimPrestText(H4.toFixed(2).toString());
//               mutuoObj.imposta=parserXMLPrestito.SistemaPunteggiaturaSimPrestText(H5.toFixed(2).toString())
//               mutuoObj.importoRichiesto=jqSimPrest('#txtImportoPrest').val();
//               mutuoObj.importoRichiesto2=parserXMLPrestito.SistemaPunteggiaturaSimPrestText(C3)+',00';
//               mutuoObj.importoRichiestoNum=amountSimPrest;
//               mutuoObj.numeroRate=parseInt(jqSimPrest('#cboDurataPrest').val(),10);
//               mutuoObj.spese=parserXMLPrestito.SistemaPunteggiaturaSimPrestText(speseIniziali.toFixed(2).toString());
//               mutuoObj.importoFinanziato=parserXMLPrestito.SistemaPunteggiaturaSimPrestText(importoFinanziato.toFixed(2).toString())
//               // premio assicurativo
//               mutuoObj.assicurazione=parserXMLPrestito.SistemaPunteggiaturaSimPrestText(H6.toFixed(2).toString());
//               mutuoObj.interessi=parserXMLPrestito.SistemaPunteggiaturaSimPrestText(interessi.toFixed(2).toString())
//               mutuoObj.costoTotale=parserXMLPrestito.SistemaPunteggiaturaSimPrestText((interessi+H5+H4).toFixed(2).toString());
//               mutuoObj.importoTotale=parserXMLPrestito.SistemaPunteggiaturaSimPrestText((interessi+H5+H4+C3).toFixed(2).toString());
//               mutuoObj.tanE=((Math.pow((1 + obj.tanR/100/12),12) - 1)*100).toFixed(8).toString().replace('.',',');
//               mutuoObj.assicurazioneNum=H62;
//               mutuoObj.assicurazioneNumStart=H6;
//               mutuoObj.recesso= parserXMLPrestito.calcolaRecesso(obj).toFixed(2).toString().replace('.',',');
              
//           mutuoObj.interessi=parserXMLPrestito.SistemaPunteggiaturaSimPrestText(interessi.toFixed(2).toString())
//               amountSimPrestFin=C72;
//               mutuoObj.valori=parserXMLPrestito.calcolaMedia(obj,true);
              
//               mutuoObj.tan2=mutuoObj.tan+'0';
          
//               var tipoTan='tasso variabile';
              
              
//               /*
//               var maxVal2=Number(mutuoObj.taegNum)+10;
//               var taegFin3=0;
//               var pagamentiTaeg2=mutuoObj.importoRichiestoNum+mutuoObj.assicurazioneNum;
              
  
//               var primoPagamento2=mutuoObj.assicurazioneNum;
              
              
              
//               var L4Test2=0;
//               var altreSpese2=0;
      
              
//               for (j=(mutuoObj.taegNum)*1000;j<(maxVal2*1000);j++){
//                   var test2 = primoPagamento2;
                  
//                   L4Test2=j/1000;
//                   jqSimPrest.each(mutuoObj.valori,function(i2,el2){
                      
//                       var elevazione2=Math.pow((1+L4Test2/100),-((i2+1)/12));
//                       var valoreSpesa2=(Number(el2)+(altreSpese2));
                      
//                       test2+=Number((valoreSpesa2*elevazione2));
//                       //logg((test)+' '+pagamentiTaeg+' '+j+' '+elevazione+' '+valoreSpesa)
//                   });
                  
//                    if (test2-pagamentiTaeg2<0) { break } else {
                      
//                       calcoloPagamentiConTaeg2=test2;
//                       taegFin3=(j/1000);
                      
//                    }
                  
//               }
      
//               mutuoObj.taegWithInsurance=taegFin3.toFixed(2).toString().replace('.',',');
//               logg(mutuoObj.taeg)
//               logg(mutuoObj.taegWithInsurance)
//               logg(mutuoObj)
//       */      
              
//               var scheda=jqSimPrest('<div><div class="accSimPrestCont"><div class="rowSimPrest line-'+(i+1)+'"><!-- <div class="cellSimPrest mutuo"><p >'+obj.name+'</p></div> --><div class="cellSimPrest importo-mensile"><h3><span class="SimPrestHideMob">Importo </span>rata mensile</h3><p>'+mutuoObj.importoRata+'  \u20AC</p></div><div class="cellSimPrest taeg arrange"><h3>TAEG</h3><p>'+mutuoObj.taeg+' %</p></div></div><div class="SimPrestWhite"><div class="SimPrestLine"></div></div><div class="detailAccSimPrest"><div class="expandedTableSimPrest fl"><div class="subRowSimPrest tan"><div class="subRowCell"><h3>IMPORTO NETTO EROGATO</h3></div><div class="subRowCell"><p>'+mutuoObj.importoRichiesto + ''+' &euro;</p></div></div><div class="subRowSimPrest tan"><div class="subRowCell"><h3>TAN FISSO</h3></div><div class="subRowCell"><p>'+mutuoObj.tan+' %</p></div></div><!-- <div class="subRowSimPrest istruttoria"><div class="subRowCell"><h3>Spese istruttoria</h3></div><div class="subRowCell"><p>'+mutuoObj.istruttoria+' \u20AC</p></div></div><div class="subRowSimPrest perizia"><div class="subRowCell"><h3>Imposta sostitutiva</h3></div><div class="subRowCell"><p>'+mutuoObj.imposta+' \u20AC</p></div></div> --></div><div class="expandedTableSimPrest contactSimPrestTable fr"><div class="subRowSimPrest tan"><div class="subRowCell"><h3>SPESE INIZIALI</h3></div><div class="subRowCell arrange"><p>'+mutuoObj.spese + ''+' &euro;</p></div></div><div class="subRowSimPrest tan"><div class="subRowCell"><h3>IMPORTO FINANZIATO</h3></div><div class="subRowCell arrange"><p>'+mutuoObj.importoFinanziato + ' '+'&euro;</p></div></div><div class="subRowSimPrest perizia"><div class="subRowCell"><h3>Premio assicurativo *</h3></div><div class="subRowCell arrange"><p>'+mutuoObj.assicurazione+' \u20AC</p></div></div></div><div class="subRowSimPrest links"><div class="subRowCell"><a class="schedaSimPrest" target="_blank" href="'+obj.url+'" data-index="'+ i +'"> Scheda prodotto</a></div><div class="subRowCell"><a class="calcolaSimPrest"  data-index="'+i+'" data-index="'+ i +'"> Informativa IEBCC</a></div><div class="subRowCell"></div></div></div></div></div>');
              
              
//               jqSimPrest('#accordionSimPrest').append(scheda);
              
          
//           }
//            logg("--------------------- CALCOLO RATA END ----------------------");
//       });
          
          
//       jqSimPrest('.expandSimPrest').off().on('click', function() {
//               var parent=jqSimPrest(this).parents('.accSimPrestCont').eq(0);
//               jqSimPrest('.rowSimPrest').removeClass('SimPrest-accordion-colored');

//               if(jqSimPrest(parent).hasClass('SimPrestAccOpen')){
//                   jqSimPrest(this).removeClass('contractSimPrest');
//                   jqSimPrest(parent).removeClass('SimPrestAccOpen');
//                   jqSimPrest('.detailAccSimPrest',parent).slideUp();
//               } else {
//                   jqSimPrest('.accSimPrestCont').removeClass('SimPrestAccOpen');
//                   jqSimPrest(parent).addClass('SimPrestAccOpen');
//                   jqSimPrest('.expandSimPrest').removeClass('contractSimPrest');
//                   jqSimPrest(this).addClass('contractSimPrest');
//                   jqSimPrest(this).parent().addClass('no-radius SimPrest-accordion-colored');
//                   jqSimPrest('.detailAccSimPrest').slideUp();
//                   jqSimPrest('.detailAccSimPrest',parent).slideDown();


//               }
//           })



//       //click nel richiama
//       // click in the call
//       jqSimPrest('.SimPrest-button-recall').each(function(){
//           var index=Number(jqSimPrest(this).attr('data-index'));
//           var obj=parserXMLPrestito.cache.content[index];
//           var argomento = (obj.name+' '+obj.rata+'\u20AC '+durataSimPrest+' mesi');
//           var CPITitle = '';
//           jqSimPrest(this).attr('target','_blank');

//           var argSimPrest='Tool Prestito '+siglaPrestito+' '+amountSimPrest+'E '+durataSimPrest+'mesi '+ obj.rata.toString().replace('.',',') + 'E ' + CPITitle;

//           var etaSimPrest=jqSimPrest('#txtEtaPrest').val();


//           //  var segmentoSimPrest='Immobile_'+jqSimPrest('#txtValoreRedditoPrest').val()+'_eta_'+etaSimPrest+'_rata_'+obj.rata+'_taeg_'+obj.taeg+'_tasso_'+obj.tanR+'_istruttoria_'+obj.invFunc+'_perizia_'+obj.reportsFunc+'';
//           var segmentoSimPrest=presetValoriSimPrest.segmento;

//           var url = 'https://emanon.it/cconlinenew/CCONLINE/ExecuteRichiestaMail.do?CodProv=M&abilitaCF=true&Segmento='+escape(segmentoSimPrest)+'&ArgInt='+escape(argSimPrest)+'&ACTION_TO_CALL=/ToCCOnlineAction.do';

//           jqSimPrest(this).attr('href',(url));
//           jqSimPrest(this).attr('data-argSimPrest',escape(argSimPrest));
//       });


//       jqSimPrest('.SimPrest-button-recall').off().on('click', function(e) {


//               var url=jqSimPrest(this).attr('href');
//               var argSimPrest=jqSimPrest(this).attr('data-argSimPrest');

//               FLOOD1('landi593', 'botto00');

//               var index=Number(jqSimPrest(this).attr('data-index'));
//               var obj=parserXMLPrestito.cache.content[index];


//               ga('send', 'event', 'Prestiti', siglaPrestito, jqSimPrest(this).text());


//               if(presetValoriSimPrest.isPrivate){
//                   popupFattiRicontattare(argSimPrest)
//               } else {



//                   if(jqSimPrest(window).width()>640){
//                       e.preventDefault();
//                       parserXMLPrestito.openWindowSimPrest(url,'recall');
//                   }
//               }


//           });


//       jqSimPrest('#SimPrest-richiamare').each(function(){
//           var CPITitle = '';
//           jqSimPrest(this).attr('target','_blank');
//           var argSimPrest='Tool Prestito '+siglaPrestito+' '+amountSimPrest+'E '+durataSimPrest+'mesi ' + CPITitle;
//           var etaSimPrest=jqSimPrest('#txtEtaPrest').val();
//           //var segmentoSimPrest='Immobile_'+jqSimPrest('#txtValoreRedditoPrest').val()+'_eta_'+etaSimPrest;
//           var segmentoSimPrest=presetValoriSimPrest.segmento;
//           var url = 'https://emanon.it/cconlinenew/CCONLINE/ExecuteRichiestaMail.do?CodProv=M&abilitaCF=true&Segmento='+escape(segmentoSimPrest)+'&ArgInt='+escape(argSimPrest)+'&ACTION_TO_CALL=/ToCCOnlineAction.do';
//           jqSimPrest(this).attr('href',(url));
//           jqSimPrest(this).attr('data-argSimPrest',escape(argSimPrest));

//       })

//       jqSimPrest('#SimPrest-richiamare').off().on('click', function(e) {


//               ga('send', 'event', 'Tool Prestiti', 'non sai quale scegliere', 'ti chiamiamo noi');
//               var url=jqSimPrest(this).attr('href');
//               var argSimPrest=jqSimPrest(this).attr('data-argSimPrest');

//               FLOOD1('landi593', 'botto001');

//               if(presetValoriSimPrest.isPrivate){
//                   popupFattiRicontattare(argSimPrest)
//               } else {


//                   if(jqSimPrest(window).width()>640){
//                       e.preventDefault();
//                       parserXMLPrestito.openWindowSimPrest(url,'recall');
//                   }

//               }


//           });


//       jqSimPrest('.SimPrest-button-appointment').each(function(){
//           var index=Number(jqSimPrest(this).attr('data-index'));
//               var obj=parserXMLPrestito.cache.content[index];
//           jqSimPrest(this).attr('target','_blank');


//           var CPITitle = '';

//           var argSimPrest='Tool Prestito '+siglaPrestito+' '+amountSimPrest+'E '+durataSimPrest+'mesi '+ obj.rata.toString().replace('.',',') + 'E ' + CPITitle;




//           var argomento = (obj.name+' '+obj.rata+'\u20AC '+durataSimPrest+' mesi');

//           var url = 'https://emanon.it/trovaFilialenew/InitTrovaFiliale.do?lingua=it&type='+presetValoriSimPrest.segmento+'&idpass=&source=prendiappuntamentoCF&source_params=' + escape(argSimPrest);
//           jqSimPrest(this).attr('href',(url));
//           jqSimPrest(this).attr('data-argSimPrest',escape(argSimPrest));

//       })

//       //click nel prendi appuntamento
//       // click on make an appointment
//       jqSimPrest('.SimPrest-button-appointment').off().on('click', function(e) {


//           var url=jqSimPrest(this).attr('href');
//           var argSimPrest=jqSimPrest(this).attr('data-argSimPrest');

//           var index=Number(jqSimPrest(this).attr('data-index'));
//               var obj=parserXMLPrestito.cache.content[index];


//               ga('send', 'event', 'Prestiti', siglaPrestito, jqSimPrest(this).text());



//           FLOOD1('landi593', 'botto000');

//           if(presetValoriSimPrest.isPrivate){
//               popupPrendiApp(argSimPrest)
//           } else {


//               if(jqSimPrest(window).width()>640){
//                   e.preventDefault();
//                   parserXMLPrestito.openWindowSimPrest(url,'appointment');
//               }
//           }



//       });


//       jqSimPrest('.schedaSimPrest').click(function(e){

//           var index=Number(jqSimPrest(this).attr('data-index'));
//           var obj=parserXMLPrestito.cache.content[index];


//           ga('send', 'event', 'Prestiti', siglaPrestito, jqSimPrest(this).text());


//       });





//       jqSimPrest('.calcolaSimPrest').click(function(e){
//           e.preventDefault();
//           var index=Number(jqSimPrest(this).attr('data-index'));
//           var obj=parserXMLPrestito.cache.content[index];


//           ga('send', 'event', 'Prestiti', siglaPrestito, jqSimPrest(this).text());

//           parserXMLPrestito.calcolaPiano(this);
//       });


//       //questa è la stringa per controllare che il primo valore venga aperto di default
//       // this is the string to check that the first value is opened by default
//       if(presetValoriSimPrest.defaultOpen){
//           jqSimPrest('.expandSimPrest').eq(0).click();

//       }
//   }
//   return status;
//   });
// },


//         // metodo iniziale
//         init = () => {
//           /*parso l'xml*/
//           var isCollaudo=jqSimPrest.urlParamSimPrest('collaudo');
//           var isSviluppo=jqSimPrest.urlParamSimPrest('sviluppo');
  
//           if(isCollaudo){
//               xmlSimPrest='emanonLoans_colPrestito.xml';
//               xmlDefSimPrest='emanonLoansDefaultPrestito_col.xml';
              
//               parserXMLPrestito.config.content.xmlToParse=xmlSimPrest;
//               parserXMLPrestito.config.content.xmlToParseDef=xmlDefSimPrest;
//           } else if (isSviluppo){
//               urlSimPrestFin=urlSimPrestSvil;
//           }
          
//           this.getContent();
//            // jqSimPrest('.SimPrest-container').tooltip({ tooltipClass: "calculator-amortization"});

//           resizeBg();

//           setTimeout(function(){resizeBg()},200);
//       },

// calcolaPiano = (obj) => {
//   jqSimPrest('#actPlanPrest,#actPlanPrest2').html('');
  
//   var maxVal2=Number(mutuoObj.taegNum)+10;
//   var taegFin3=0;
//   var pagamentiTaeg2=mutuoObj.importoRichiestoNum+mutuoObj.assicurazioneNum;
  

//   var primoPagamento2=mutuoObj.assicurazioneNum;
  
  
  
//   var L4Test2=0;
//   var altreSpese2=0;

  
//   for (j=(mutuoObj.taegNum)*1000;j<(maxVal2*1000);j++){
//       var test2 = primoPagamento2;
      
//       L4Test2=j/1000;
//       jqSimPrest.each(mutuoObj.valori,function(i2,el2){
          
//           var elevazione2=Math.pow((1+L4Test2/100),-((i2+1)/12));
//           var valoreSpesa2=(Number(el2)+(altreSpese2));
          
//           test2+=Number((valoreSpesa2*elevazione2));
//           //logg((test)+' '+pagamentiTaeg+' '+j+' '+elevazione+' '+valoreSpesa)
//       });
      
//        if (test2-pagamentiTaeg2<0) { break } else {
          
//           calcoloPagamentiConTaeg2=test2;
//           taegFin3=(j/1000);
          
//        }
      
//   }

//   mutuoObj.taegWithInsurance=taegFin3.toFixed(2).toString().replace('.',',');

//   jqSimPrest.ajax({url:urlSimPrestFin+IEBCCSimPrest,cache:false,dataType:'html'}).done(function(html){
//       var template = html;
//       Mustache.parse(template); 
//        var rendered = Mustache.render(template, mutuoObj);
//       jqSimPrest('#actPlanPrest,#actPlanPrest2').prepend(rendered);
//       // uso l'attributo data-index come indice
//       var value=Number(jqSimPrest(obj).attr('data-index'));
//       var thisObj=parserXMLPrestito.cache.content[value];

//       var table=jqSimPrest('<table class="SimPrest-table-ammortamento" width="100%"></table>');

      
//       var header='<tr><th>PR.</th><th class="optional">TIPO RATA</th><th>Q. CAPIT.</th><th>Q. INTER.</th><th>TOT. RATA    </th><th>CAP. RES.</th></tr>' ;
//       jqSimPrest(table).append(header);
      
      
//       var nowSimPrest=new Date();
//       var thisM=new Date(nowSimPrest);
//       thisM.setDate(thisM.getDate()-1);
//       var nextM2=new Date(thisM); 
//       /*
//           nextM2.setDate(nextM2.getDate()+nextM2.monthDays());
//           var nextM3=new Date((nextM2.getMonth()+1)+'/'+nextM2.monthDays()+'/'+nextM2.getFullYear());
//       */
//       var nextM3=new Date((thisM.getMonth()+1)+'/'+thisM.monthDays()+'/'+thisM.getFullYear());
      

//       /*sommo i giorni da ieri alla fine del prosSimPresto mese*/
//       var giorniStart=Math.ceil((nextM3-thisM)/86400000);
//       //commentato per risultati come sito
//       //thisM.setDate(thisM.getDate()+nowSimPrest.monthDays());
      
//       var rataRecesso=0;

//       /*setto due variabili totale separate, che cambiano prima e dopo la visualizzazione*/
//       var tot=amountSimPrestFin;
//       var tot2=amountSimPrestFin;
//       for (g=0;g<=durataSimPrest;g++){
//           /*Setto per comodita' le stesse variabili dell'excel*/
//           var I9=tot2;
//           var B2=amountSimPrestFin;
//           var E2=thisObj.tanR;
//           var E3=durataSimPrest ;
//           var B6=thisObj.cap;
//           var D10=giorniStart;
          
//           if(g==0){
//               // gestisco il caso prima rata
//               rata=0;
//               rataCap=0;
//               rataInt=0;
//               rataFin=0;
//               rataRecesso=0;
//           } else {
//               /* gestisco il caso di default sul numero giorni del mese*/             
//               rata = parserXMLPrestito.PMT(E2/1200,E3,-B2);
//               rataCap=rata-I9*E2/1200;
//               rataInt=I9*E2/36000*D10;
//               rataFin=rataCap+rataInt;
              
              
//               /* per il mutuo fisso bypasso i giorni del mese e uso la formula standard*/
//                   rataFin=rata;
//                   rataInt=I9*E2/1200;
//                   rataRecesso=I9*E2/1200/thisM.monthDays();
//                   tot2=(tot*(1+E2/1200))-rataFin;
              
              
              
//           }

//           var td='<tr><td>'+g+'</td><td class="optional">ammortamento</td><td>'+parserXMLPrestito.SistemaPunteggiaturaSimPrestText(rataCap.toFixed(2).toString())+'</td><td>'+parserXMLPrestito.SistemaPunteggiaturaSimPrestText(rataInt.toFixed(2).toString())+'</td><td>'+parserXMLPrestito.SistemaPunteggiaturaSimPrestText(rataFin.toFixed(2).toString())+'</td><td>'+parserXMLPrestito.SistemaPunteggiaturaSimPrestText(Math.abs(tot2).toFixed(2).toString())+'</td></tr>' ;


//           // cambio il totale per il calcolo successivo
//           tot=tot2;

//           // cambio la data di inizio per il calcolo successivo
//           var testDate=new Date(nextM3);  
//           testDate.setDate(nextM3.getDate()+1);
//           nextM3.setDate(nextM3.getDate()+testDate.monthDays());
//           giorniStart=nextM3.monthDays();
              
          
//           jqSimPrest(table).append(td);
          
//       }

//       var button='';
//       if (window.print) button=jqSimPrest('<a id="SimPrest-print" href="#" class="SimPrest-submit-button">Stampa</a>');
      
//       jqSimPrest('#actPlanPrest,#actPlanPrest2').append('<div class="page-break"></div>');
//       jqSimPrest('#actPlanPrest,#actPlanPrest2').append(table);
      
      
      
//       jqSimPrest.ajax({url:urlSimPrestFin+AllegatoSimPrest,cache:false,dataType:'html'}).done(function(html){
//           var template = html;
//           Mustache.parse(template); 
//           var rendered = Mustache.render(template, mutuoObj);
//           jqSimPrest('#actPlanPrest,#actPlanPrest2').append('<div class="page-break"></div>');
//           jqSimPrest('#actPlanPrest,#actPlanPrest2').append(rendered);
      
//           jqSimPrest('#actPlanPrest,#actPlanPrest2').append(button);
//           jqSimPrest('#actPlanPrest .SimPrest-submit-button').click(function(e){
//               e.preventDefault();
      
//               if (window.print) {
                  
//                   window.print()
//               }
          
//           });
//           parserXMLPrestito.openWindowPiano();
      
      
//       })

//   })
// },
// calcolaRecesso = (obj) => {

//   var thisObj=obj;
//   var nowSimPrest=new Date();
//   var thisM=new Date(nowSimPrest);
//   thisM.setDate(thisM.getDate()-1);
//   var nextM3=new Date((thisM.getMonth()+1)+'/'+thisM.monthDays()+'/'+thisM.getFullYear());
//   var rataRecesso;
              
  
//   /*setto due variabili totale separate, che cambiano prima e dopo la visualizzazione*/
  
//   var I9=amountSimPrestFin;
//   var E2=thisObj.tanR;
  
//   //rataRecesso=(I9*E2/1200/thisM.monthDays());
//   //rataRecesso2=(I9*E2/1200/nextM3.monthDays());
//   rataRecesso=(I9*E2/36500);
  
//   return  rataRecesso;
// },

// calcolaMedia = (obj,notInteressi) => {
//   var valori=[];
//   var thisObj=obj;
  
//   var nowSimPrest=new Date();
//   var thisM=new Date(nowSimPrest);
//   thisM.setDate(thisM.getDate()-1);
//   var nextM2=new Date(thisM); 
//   /*
//       nextM2.setDate(nextM2.getDate()+nextM2.monthDays());
//       var nextM3=new Date((nextM2.getMonth()+1)+'/'+nextM2.monthDays()+'/'+nextM2.getFullYear());
//   */
//   var nextM3=new Date((thisM.getMonth()+1)+'/'+thisM.monthDays()+'/'+thisM.getFullYear());
  

//   /*sommo i giorni da ieri alla fine del prosSimPresto mese*/
//   var giorniStart=Math.ceil((nextM3-thisM)/86400000);
//   //commentato per risultati come sito
//   //thisM.setDate(thisM.getDate()+nowSimPrest.monthDays());

//   /*setto due variabili totale separate, che cambiano prima e dopo la visualizzazione*/
//   var tot=amountSimPrestFin;
//   var tot2=amountSimPrestFin;
          
  
//   for (g=0;g<=durataSimPrest;g++){
//       /*Setto per comodita' le stesse variabili dell'excel*/
      
      
//       var I9=tot2;
//       var B2=amountSimPrestFin;
//       var E2=thisObj.tanR;
//       var E3=durataSimPrest ;
//       var B6=thisObj.cap;
//       var D10=giorniStart;
      
//       if(g==0){
//           // gestisco il caso prima rata
//           rata=0;
//           rataCap=0;
//           rataInt=0;
//           rataFin=0;
//       } else {
//           /* gestisco il caso di default sul numero giorni del mese*/             
//           rata = parserXMLPrestito.PMT(E2/1200,E3,-B2);
//           rataCap=rata-I9*E2/1200;
//           rataInt=I9*E2/36000*D10;
//           rataFin=rataCap+rataInt;
      
//               rataFin=rata;
//               rataInt=I9*E2/1200;
//               tot2=(tot*(1+E2/1200))-rataFin;
          
//           //per il mutuo fisso bypasso i giorni del mese e uso la formula standard
//               rataFin=rata;
//               rataInt=I9*E2/1200;
//               if(!notInteressi) mutuoObj.interessi+=rataInt;
//               tot2=(tot*(1+E2/1200))-rataFin;
          
      
//       }
      
                      
      
//       if(g!=0){
//           valori.push(rataFin.toFixed(2))
//       }       
      

//       // cambio il totale per il calcolo successivo
//       tot=tot2;
      
      
//       // cambio la data di inizio per il calcolo successivo
//       var testDate=new Date(nextM3);  
//       testDate.setDate(nextM3.getDate()+1);
//       nextM3.setDate(nextM3.getDate()+testDate.monthDays());
//       giorniStart=nextM3.monthDays();
      
      
//   }
//   return valori;
// },


// parseToObj = (objToParse) => {
//   var variable=this;
//   // carico l'xml
  
//   jqSimPrest.get(urlSimPrestFin+objToParse.xmlToParse, function(xml){
//       jqSimPrest(xml).find( "loan" ).each(function(i,el){
//           // costruisco l'oggetto
//           var obj={};

//           //elementi presenti all'interno della radice float dell'xml
//           obj.type=jqSimPrest(this).attr('type');
  
//           obj.cap=Number(jqSimPrest('cap',this).text().replace(',','.'));
      
//           obj.fire=Number(jqSimPrest('fire',this).text().replace(',','.'))/100;

//           obj.discInv=Number(jqSimPrest('discInv',this).text().replace(',','.'))/100;

//           obj.discRep=Number(jqSimPrest('discRep',this).text().replace(',','.'))/100;
//           // creo gli oggetti per il calcolo dei valori a soglia


//           // creo gli oggetti per il calcolo dei valori a soglia
//           // array di dati presi da ogni nodo con il nome nodeName cercato in findRange
//           obj.nameStart=[];
//           obj.nameStart=parserXMLPrestito.findRange('name',this);
      
          
//           obj.urlStart=[];
//           obj.urlStart=parserXMLPrestito.findRange('url',this);
          
//           obj.urlStart2=[];
//           obj.urlStart2=parserXMLPrestito.findRange('url2',this);
          
//           obj.inv=[];
//           obj.inv=parserXMLPrestito.findRange('inv',this);
          
//           obj.reports=[];
//           obj.reports=parserXMLPrestito.findRange('reports',this);
//           obj.tax=[];
//           obj.tax=parserXMLPrestito.findRange('tax',this);
          
//           obj.tanSCalc=[];
//           obj.tanSCalc=parserXMLPrestito.findRange('tan',this);
      
      
//           obj.capCalc=[];
//           obj.capCalc=parserXMLPrestito.findRange('cap',this);
          
          
          
//           obj.spreadCalc=[];
          
//           obj.spreadCalc=parserXMLPrestito.findRange('spread',this);

//           logg ("enginePrestito parseToObj obj => "+JSON.stringify(obj));

//           parserXMLPrestito.cache.content.push(obj);
          
//           if(i==(jqSimPrest(xml).find( "loan" ).size()-1)){
//               logg("enginePrestito i => "+i);
//               logg("enginePrestito jqSimPrest(xml).find( loan ).size()-1) => "+(jqSimPrest(xml).find( "loan" ).size()-1));
//               logg("i==(jqSimPrest(xml).find( \"loan\" ).size()-1)) => ", (i==(jqSimPrest(xml).find( "loan" ).size()-1)));
//               logg("enginePrestito urlSimPrestFin+objToParse.xmlToParseDef => "+urlSimPrestFin+objToParse.xmlToParseDef);

//               jqSimPrest.get(urlSimPrestFin+objToParse.xmlToParseDef, function(xml){
//                   jqSimPrest(xml).find( "exception" ).each(function(i,el){
//                       // costruisco l'oggetto
//                       var actUrl=location.href;
//                       //logg ("actUrl => "+actUrl);
//                       var elUrl=jqSimPrest(el).attr('url');
//                       // se troviamo tra i nodi exception uno con attributo url uguale a actUrl...
//                       if(actUrl.indexOf(elUrl)!=-1){
//                           jqSimPrest(el).find('*').each(function(i2,el2){
//                               logg ("enginePrestito jqSimPrest(el2).get(0).tagName => ", jqSimPrest(el2).get(0).tagName);
//                               presetValoriSimPrest[jqSimPrest(el2).get(0).tagName]=jqSimPrest(el2).text();
                              
//                           });
                          
//                       }
                      
//                       if(i==(jqSimPrest(xml).find( "exception" ).size()-1)){
//                           parserXMLPrestito.presetValoriSimPrestFunc();
//                           parserXMLPrestito.start();
//                       }
                      
//                   });
                  
//               });
                  
          
//           }
          
//       }); 
//   }); 
// },


// functionRange = (obj,prop) => {
//   // funzione per la corrispondenza con le soglie dei valori inseriti
//   var thisObj=parserXMLPrestito.cache.content[obj];
  
  
//   var thisProp=thisObj[prop];

//   var confronto=0;
//   var type='max';

  
  
//   if(thisProp){
//       if((thisProp.type!='')&&(thisProp.type!=null)){
//           type=thisProp.type;
          
          
//       } 
      
      
      
//       // creo una variabile per fermare il ciclo for quando trova il risultato
//       var breakP=false;
//       var valueFin=0;
//       jqSimPrest.each(thisProp,function(i,el){
//           if(!breakP){
//               /* gestisco due diversi valori per la corrispondenza: "<" su calcolo da importo, "=" su tipo di mutuo */
//               var variable= amountSimPrest;
//               var variableToS='amount';
              
//               if(el.durata!=null){
//                   variable= durataSimPrest;
//                   variableToS='durata';
//               }
              
//               if(el.ltype!=null){
//                   variable= el.ltype;
//                   variableToS='ltype';
//               }
              
//               if(el.eta!=null){
//                   variable= el.eta;
//                   variableToS='eta';
//               }
              
              
//               if(el.importo!=null){
//                   variable= el.importo;
//                   variableToS='importo';
//               }
              
//               if(el.reddito!=null){
              
//                   variable= reddito;
//                   variableToS='reddito';
                  
                  
//               }
              
              
              
//               var controlloValidita=(variable<el[variableToS]) ? true: false;
              
          
              
//               if((variableToS=='ltype')){
//                   controlloValidita=(variable==finalitaSimPrest)? true: false;
                  
                  
//                   if(variable==0){
//                       // gestisco l'otherwise su tipo di mutuo
//                       controlloValidita=true;
//                   }
//               }
          
//               if((variableToS=='durata')){
//                   controlloValidita=(variable<=el[variableToS])? true: false;
                  
//               }
          
//               //logg(variableToS+' '+controlloValidita+ ' '+variable+' '+el[variableToS])
              
              
              
              
//               if(controlloValidita){

//                   confronto=(el[variableToS]);
                  
//                   var arrayEl=[];
                  
                  
                  
//                   if(el.rangeValues[0]=== Object(el.rangeValues[0])){
//                       breakP=false;
                      
                  
//                       var value=parserXMLPrestito.functionRangeMatrix(el);
                  
//                       arrayEl.push(value);
      
                      
//                   } else {
                      
                  
//                       type=el.type;
                              
                                      
//                                   // ciclo i valori di confronto
//                       jqSimPrest.each(el.rangeValues,function(i2,el2){
                              
//                           //logg(el2)
                          
//                           if(el2.type){
//                               // se il valore e' a sua volta un confronto
//                               var subType=el2.type;
                              
                              
                              
//                               var subArray=[];
                                      
//                                   // ciclo i valori di confronto (sempre numeri)
//                               jqSimPrest.each(el2.rangeValues,function(i3,el3){
                                  
//                                   var val=Number(el3);
//                                       if(el3.indexOf('%')!=-1){
//                                           val=Number(el3.split('%')[0])*amountSimPrest/100;
//                                       }
                                      
//                                       subArray.push(val);
                                  
//                               })
                              
//                               // controllo minimo o masSimPresto in base alla contribuzione
//                               var value=Math.max.apply(Math, subArray);
//                               if(subType=='min'){
//                                   value=Math.min.apply(Math, subArray);
//                               }
                              
//                               arrayEl.push(value);

//                           }else{
//                               // se il valore e' un numero
                              
                                                                      
                              
//                               var val=Number(el2);
//                               if(el2.indexOf('%')!=-1){
//                                   val=Number(el2.split('%')[0])*amountSimPrest/100;
//                               } else {
//                                   if(isNaN(val)){
//                                       val=el2;
//                                   }
                              
//                               }
                          
//                               arrayEl.push(val);
//                           }
                          
//                       })
                  
//                   }
                  
                          
              
//                   // controllo minimo o masSimPresto in base alla contribuzione
                  
                  
                  
//                   if(isNaN(Number(arrayEl[0]))){
//                       value=arrayEl[0];
//                   } else {
//                       var value=Math.max.apply(Math, arrayEl);
//                       if(type=='min'){
//                           value=Math.min.apply(Math, arrayEl);
//                       }

//                   }

//                   valueFin=value;
//                   breakP=true;
//               }
//           }
          
//       })
//       return valueFin;
  
//   }
  
// },

// IsValidoLTV = (campoFinalita, campoValoreReddito, campoImporto, txtDurataMutuo) => {
//   var limit = 10000;
//   var codFinalita = campoFinalita.value;
//   var valoreReddito = parseFloat(campoValoreReddito.value.replace(/\D/g, ""));
//   var importoPrestRichiesto = parseFloat(campoImporto.value.replace(/\D/g, ""));


//   if (importoPrestRichiesto < limit && txtDurataMutuo.value>60) {
//       parserXMLPrestito.InfoAlertSimPrest('Per prestiti inferiori a 10.000€ la durata massima è di 60 mesi', campoImporto);
//       return false;
//   }
  
//   /*
  
//   ##################################################
  
//   // inserire in controllo per reddito
//   var ltvMasSimPresto = parserXMLPrestito.CalcolaLTVMasSimPresto(codFinalita);
//   var ltv = valoreReddito/importoRicPresthiesto;
//   var articolo='il ';
//   if (ltvMasSimPresto==0.8){
//       articolo='l\'';
//   }

//   if (ltv > ltvMasSimPresto) {
//       parserXMLPrestito.InfoAlertSimPrest('Il rapporto tra valore richiesto e valore dell\'immobile non pu\u00f2 superare '+articolo+ltvMasSimPresto*100+'%', campoImporto);
//       return false;
//   }
  
//   */
//   parserXMLPrestito.changeRangeData();
  
  
  
//   return true;
// },


// CalcolaLTVMasSimPresto = (codFinalita) => {
//   //validazione calcola masSimPresto muto erogabile in base alla finalita
//   if (codFinalita == 16)
//       return 0.8;
//   else if (codFinalita == 3)
//       return 0.3; 
//   else
//       return 0.8;
// },

// ValidaFiltri = () => {          
//   var txtImportoPrest = document.getElementById('txtImportoPrest');
//   var txtDurataMutuo = document.getElementById('cboDurataPrest');
//   var txtEtaPrest = document.getElementById('txtEtaPrest');

//   return parserXMLPrestito.IsValidoLTV(cboFinalitaPrest, txtValoreRedditoPrest, txtImportoPrest, txtDurataMutuo) && parserXMLPrestito.ValidaEta(txtDurataMutuo, txtEtaPrest);
// },

// ValidaEta = (campoDurataMutuo, campoEta) => {
//   //validazione eta' richiedente
//   var etaRichiedente = parseInt(parserXMLPrestito.togliPunti(campoEta), 10);
  
//   var etaAScadenza = etaRichiedente + parseInt(campoDurataMutuo.value, 10)/12;
  
//   if (isNaN(etaRichiedente)) {
//       parserXMLPrestito.InfoAlertSimPrest('Per richiedere un prestito devi inserire la tua et\u00e0.', campoDurataMutuo);
//       return false;
//   }
  
//   if (etaRichiedente < 18) {
//       parserXMLPrestito.InfoAlertSimPrest('Per richiedere un prestito devi avere almeno 18 anni.', campoDurataMutuo);
//       return false;
//   }
  
//   if (etaRichiedente > 99) {
//       parserXMLPrestito.InfoAlertSimPrest('Per richiedere un prestito devi avere meno di 99 anni.', campoDurataMutuo);
//       return false;
//   }
  
//   if (etaAScadenza > 80) {
//       parserXMLPrestito.InfoAlertSimPrest('Hai superato la soglia massimaa di durata del prestito. La somma tra questa e la tua et\u00e0 deve essere inferiore a 80 anni! Riprova modificando la durata.', campoDurataMutuo);
//       return false;
//   }
//   return true;
// },

// PMT = (i, n, p) => {
//   // i => tan/1200
//   logg("CALCOLO RATA PMT i -> tan/1200 =>"+i);
//   // p => importo finanziato
//   logg("CALCOLO RATA PMT p -> importo finanziato =>"+p);
//   // n => durata mesi
//   logg("CALCOLO RATA PMT n -> durata mesi =>"+n);

//   // funzione per calcolo dell'interesse
//   let firstPart = i * p * Math.pow((1 + i), n);
//   logg("CALCOLO RATA PMT firstPart =>"+firstPart);
//   let secondPart = (1 - Math.pow((1 + i), n));
//   logg("CALCOLO RATA PMT secondPart =>"+secondPart);
//   let pmt = firstPart / secondPart;
//   logg("CALCOLO RATA PMT pmt =>"+pmt);
//   logg(" \n ");

//   return pmt;

//   //return i * p * Math.pow((1 + i), n) / (1 - Math.pow((1 + i), n));
// },


// InfoAlertSimPrest = (cosa,campo) => {
//   //apre il dialog
//   // open the dialogue
//   jqSimPrest( "#dialogSimPrestPrest" ).dialog({
//     dialogClass: "alertSimPrest",
//     buttons: [
//       {
//         text: cosa,
//         click: function() {
//           jqSimPrest( this ).dialog( "close" );
//           jqSimPrest(campo).focus();
//         }
//       }
//     ]
//   });
// },

// functionRangeMatrix =(obj,value) => {
            
//   var valoreReddito=parseInt(parserXMLPrestito.togliPunti(jqSimPrest('#txtValoreRedditoPrest')), 10);
//   var importo=parseInt(parserXMLPrestito.togliPunti(jqSimPrest('#txtImportoPrest')), 10);
//   var durata=parseInt(jqSimPrest('#cboDurataPrest').val(),10);
//   var eta=Number(jqSimPrest('#txtEtaPrest').val());
//   var finalita=Number(jqSimPrest('#cboFinalitaPrest').val());
//       //logg(obj)
  
//   //aggiungere in caso discriminante du importo/reddito
//   //##########################################
//   var diffImporto=importo/valoreReddito;
//   var importoV;
//   var etaV;
//   var redditoV;

  
  
//   jqSimPrest.each(obj.rangeValues,function(i,el){
      
//       var continua;
      
      
      
//       if(!breakP){
//           //logg(el)
//           if(el.importo){
              
//               if((el.type=='less')){
//                   importoV=Number(el.importo);
//                   if(diffImporto<=Number(el.importo)){
//                       continua=el;
//                       breakP=true;
                      
//                   } else {
//                       breakP=false;
//                   }
//               } else {
//                   if(diffImporto>importoV){
//                       continua=el;
//                       breakP=true;
                      
//                   } else {
//                       breakP=false;
//                   }
//               }
              
              
//           } else if(el.reddito){
              
//               if((el.type=='less')){
//                   redditoV=Number(el.reddito);
                  
//                   if(valoreReddito<=Number(el.reddito)){
//                       continua=el;
//                       breakP=true;
                  
                      
//                   } else {
//                       breakP=false;
//                   }
//               } else {
              
//                   redditoV=Number(el.reddito);
                  
//                   if(valoreReddito>redditoV){
                      
//                       continua=el;
//                       breakP=true;
                      
//                   } else {
                      
//                       breakP=false;
//                   }
//               }
              
              
//           }  else if(el.amount){
              
//               if((el.type=='less')){
//                   amountV=Number(el.amount);
//                   if(importo<=Number(el.amount)){
//                       continua=el;
//                       breakP=true;
                      
//                   } else {
//                       breakP=false;
//                   }
//               } else {
//                   amountV=Number(el.amount);
//                   if(importo>amountV){
//                       continua=el;
//                       breakP=true;
                      
//                   } else {
//                       breakP=false;
//                   }
//               }
              
              
//           } else if(el.ltype){
//               //logg(finalita+' '+el.ltype)
//               if((el.ltype==finalita)){
//                   continua=el;
//                   breakP=true;
                  
//               } else {
//                   breakP=false;
//               }
//           } else  if(el.durata){
              
//               if((el.durata==durata)){
                  
//                   continua=el;
//                   breakP=true;
                  
//               } else {
//                   breakP=false;
//               }
              
//           } else if(el.eta){
              
//               if(el.type=='less'){
//                   etaV=Number(el.eta);
//                   if(eta<=Number(el.eta)){
//                       continua=el;
//                       breakP=true;
//                   } else {
//                       breakP=false;
//                   }
                  
//               } else {
//                   if(eta>etaV){
//                       continua=el;
//                       breakP=true;
                      
//                   } else {
//                       breakP=false;
//                   }
//               }
//           } else {
//               value=el;
//           }
          
          
          
                          
          
//           if(continua){
      
//               breakP=false;
//               value=parserXMLPrestito.functionRangeMatrix(continua,value)
              
//           }
//       }     
//   })
//   return value;
// },

// openWindowSimPrest = (quale,type) => {  
//   jqSimPrest('#SimPrestFrame').attr('src',unescape(quale));
//   jqSimPrest('body').addClass('modalSimPrestPrestOpen');
//   parserXMLPrestito.resizeIframeSimPrest();

//   if(type=='recall'){
//           jqSimPrest('#SimPrestFrame').removeClass('scheda').addClass('recall');
          
      
//   } else {
//       jqSimPrest('#SimPrestFrame').removeClass('scheda').removeClass('recall');
//   }
  
// },

// openWindowScheda = (quale) => {
//   jqSimPrest('#SimPrestFrame').attr('src',unescape(quale));
//   jqSimPrest('body').addClass('modalSimPrestPrestOpen');
//   parserXMLPrestito.resizeIframeSimPrest();
  
//   jqSimPrest('#SimPrestFrame').addClass('scheda').removeClass('recall');
// },

// closeWindowSimPrest (){
//   //chiude l'iframe
  
//   //jqSimPrest('#SimPrestFrame').removeAttr('src');
  
//   jqSimPrest('#actPlanPrest,#actPlanPrest2').html('');

//   jqSimPrest('#modalPianoPrest .SimPrestCont').css({'height':'0'});
  
  
//   jqSimPrest('body').removeClass('modalSimPrestPrestOpen');
//   jqSimPrest('body').removeClass('modalPianoPrestOpen');
// },

// openWindowPiano (){
//   //apre l'iframe se pc o tablet, pagina se mobile
//   jqSimPrest('body').addClass('modalPianoPrestOpen');
//   jqSimPrest('#modalPianoPrest .SimPrestCont').css({'height':'100%'});
// },

// resizeIframeSimPrest (){
//   //riposizione l'iframe
//   var margin=(jqSimPrest('.modalSimPrestPrest').eq(0).height()-520)/2;
//   jqSimPrest('.modalSimPrestPrest .SimPrestCont').css({'margin-top':margin+'px'});
// },


// presetValoriSimPrestFunc = () => {
//   //reimposta i valori in base ai default
  
//   limitaMinDurata=Number(presetValoriSimPrest.minDurata);
//   limitaMaxDurata = Number(presetValoriSimPrest.maxDurata);

  
//   //jqSimPrest('#sliderDurataPrest').slider( "option", "min", limitaMinDurata);

  
  
//   jqSimPrest('#txtValoreRedditoPrest').val(Number(presetValoriSimPrest.defReddito));
  
              
//   jqSimPrest('#txtImportoPrest').val(Number(presetValoriSimPrest.defImporto));
  
  
//   jqSimPrest('#cboDurataPrest').val(Number(presetValoriSimPrest.defDurata));
  
  
//   jqSimPrest('#txtValoreRedditoPrest').next().val(Number(presetValoriSimPrest.defReddito));
  
              
//   jqSimPrest('#txtImportoPrest').next().val(Number(presetValoriSimPrest.defImporto));
  
  
//   jqSimPrest('#cboDurataPrest').next().val(Number(presetValoriSimPrest.defDurata));
  
  
  
//   //jqSimPrest('#cboDurataPrest').val(Number(presetValoriSimPrest.defDurata));
//   //limitaMinDurata
  
//   if(presetValoriSimPrest.defCPI=='SI'){
//       jqSimPrest('#cboCPIPrest').prop('checked',true);
//   } else {
//       jqSimPrest('#cboCPIPrest').prop('checked',false);
//   }
  
  
  
  
  
//   durataSimPrest=Number(presetValoriSimPrest.defDurata);

//   jqSimPrest('#txtEtaPrest').val(Number(presetValoriSimPrest.defAge));
  
//   jqSimPrest('#txtEtaPrest').next().val(Number(presetValoriSimPrest.defAge));
  
//   jqSimPrest('#cboFinalitaPrest').val((presetValoriSimPrest.defFinalita));

  
  
  
//   durataSimPrest=Number(presetValoriSimPrest.defDurata);

//   jqSimPrest('#txtEtaPrest').val(Number(presetValoriSimPrest.defAge));
  
//   jqSimPrest('#cboFinalitaPrest').val((presetValoriSimPrest.defFinalita));


  
  
  
  
  
//   parserXMLPrestito.SistemaPunteggiatura(jqSimPrest('#txtValoreRedditoPrest').get(0));
//   parserXMLPrestito.SistemaPunteggiatura(jqSimPrest('#txtImportoPrest').get(0));
  
//   parserXMLPrestito.SistemaMesi(jqSimPrest('#cboDurataPrest').get(0));


//   parserXMLPrestito.inizializzaSlider('#sliderDurataPrest','#cboDurataPrest',-12,12,1,0,false,false,false,true);

  
//   parserXMLPrestito.inizializzaSlider('#sliderRedditoPrest','#txtValoreRedditoPrest',-100,100,500,0,true,false,false);
//   parserXMLPrestito.inizializzaSlider('#sliderImportoPrest','#txtImportoPrest',-5000,5000,500,0,true,true,false);
 
// },

// aggiornaSlider = (txtbox, slider, verificaLimitaFinalita,verificaLimitiDurata,verificaLimitiDurata2) => {
//   var min = jqSimPrest(slider).slider("option", "min");
//   var max = jqSimPrest(slider).slider("option", "max");
//   var value = parserXMLPrestito.togliPunti(txtbox);
//   parserXMLPrestito.verificaLimitiTextbox(txtbox, min, max, verificaLimitaFinalita,verificaLimitiDurata,verificaLimitiDurata2);
//   jqSimPrest(slider).slider("value", value);
// },


// verificaLimitiTextbox2 =(txtbox, min, max, verificaLimitaFinalita,verificaLimitiDurata,verificaLimitiDurata2) => {
//   var newForm=jqSimPrest(txtbox).prev();
//    parserXMLPrestito.ImpostaValoreConPunteggiatura(jqSimPrest(txtbox).val(), newForm)

  
  
//   var value = parserXMLPrestito.togliPunti(jqSimPrest(newForm));
  
              
//   if (verificaLimitaFinalita) {
//       max = limitaMaxImportoPrest;
//   }
//   if (value == "" || value < min) {
//       value = min;
//       parserXMLPrestito.ImpostaValoreConPunteggiatura(value, newForm);
//   } else if (value > max) {
//       value = max;
//       parserXMLPrestito.ImpostaValoreConPunteggiatura(value, newForm);
//   }
  
//   if(verificaLimitiDurata){
//       parserXMLPrestito.ImpostaDurata(value, newForm);
  
//   }
  
//   jqSimPrest(txtbox).hide();
//   jqSimPrest(newForm).show();
   
// }

// verificaLimitiTextbox = (txtbox, min, max, verificaLimitaFinalita,verificaLimitiDurata,verificaLimitiDurata2) => {
//   var value = parserXMLPrestito.togliPunti(jqSimPrest(txtbox));
  
              
//   if (verificaLimitaFinalita) {
//       max = limitaMaxImportoPrest;
//   }
//   if (value == "" || value < min) {
//       value = min;
//       parserXMLPrestito.ImpostaValoreConPunteggiatura(value, txtbox);
//   } else if (value > max) {
//       value = max;
//       parserXMLPrestito.ImpostaValoreConPunteggiatura(value, txtbox);
//   }
  
//   if(verificaLimitiDurata){
//       parserXMLPrestito.ImpostaDurata(value, txtbox);
  
//   }
  
//   jqSimPrest(txtbox).next().val(parseInt(value,10))
  
// },


// aggiornaLimiteSlider = (combo, txtbox, slider, verificaLimitaFinalita) => {
        
//   parserXMLPrestito.setLimiteMaxImporto(combo);

//   jqSimPrest(slider).slider("option", "max", limitaMaxImportoPrest);

//   parserXMLPrestito.aggiornaSlider(txtbox, slider, verificaLimitaFinalita);
// },

// // https://github.com/Microsoft/TypeScript/issues/8101

// // metodo chiamato nel momento in cui cambiamo la finalità dell'importo o se attiviamo/disattiviamo assicurazione
// // method called when we change the purpose of the amount or if we activate / deactivate insurance
// // INPUT:
// aggiornaLimiteImporto (combo, txtbox, min, max, verificaLimitaFinalita) => {
//   parserXMLPrestito.setLimiteMaxImporto(combo);
//    parserXMLPrestito.verificaLimitiTextbox(txtbox, min, max, verificaLimitaFinalita);
// },

// setLimiteMaxImporto = (combo) => {
//   var valCombo = jqSimPrest(combo).find('option:selected').val();
//   limitaMaxImportoPrest = limitaMaxAquistoPrest;
// },

// togliPunti = (textbox) => {
//   var valuta =jqSimPrest(textbox).val();
//   if(jqSimPrest(textbox).size()>0 && jqSimPrest(textbox).val() && jqSimPrest(textbox).val().indexOf('.')!=-1){
//        valuta = jqSimPrest(textbox).val().replace(/\./g, "").replace(/\,/g, "");
//   }
//   return val,uta;
// },

// ImpostaDurata = (value, txtbox) => {

//   parserXMLPrestito.SalvaValoreInizialeSimPrest(txtbox);
//   jqSimPrest(txtbox).val(value);
//   jqSimPrest('#sliderDurataPrest').slider( "value", value);
  
//   parserXMLPrestito.SistemaMesi(txtbox);
// },

// ImpostaValoreConPunteggiatura = (value, txtbox) => {
//   parserXMLPrestito.SalvaValoreInizialeSimPrest(txtbox);

//   jqSimPrest(txtbox).val(value);
//   parserXMLPrestito.SistemaPunteggiaturaSimPrest(txtbox);
// },

//   // https://github.com/Microsoft/TypeScript/issues/8101
//   incrementaValori = (objForm,valueStep, verificaLimiti,verificaLimitiDurata,verificaLimitiDurata2) => {
            
            
//     var value=parseInt(parserXMLPrestito.togliPunti(jqSimPrest(objForm)));
    
    
//     var result=value+valueStep;
    
//     var minV = limitaMinValoreRedditoPrest;
//     var maxV = limitaMaxValoreRedditoPrest;
    
    
//     if(verificaLimitiDurata||verificaLimitiDurata2){
//         minV = presetValoriSimPrest.minDurata;
//         maxV = limitaMaxDurata ;
//     }
    

//     if (verificaLimiti) {
//         minV = limitaMinImportoPrest;
//         maxV = limitaMaxImportoPrest;
//     }

//     if (result <= minV) {
//         result = minV
//         clearInterval(pressTimerSimPrest);
//     } 
    
//     if(result >= maxV) {
//         result = maxV;
//         clearInterval(pressTimerSimPrest);
//     }

//     if(verificaLimitiDurata){
        
//         jqSimPrest('#sliderDurataPrest').slider( "value", result);
//         parserXMLPrestito.SalvaValoreInizialeSimPrest(objForm);
//         jqSimPrest(objForm).val(result);
//         parserXMLPrestito.SistemaMesi(objForm);
        
//     } else if(verificaLimitiDurata2){
//         parserXMLPrestito.SalvaValoreInizialeSimPrest(objForm);
//         ga('send', 'event', 'Prestiti', 'durata finanziamento', result);
//         jqSimPrest(objForm).val(result);
//         parserXMLPrestito.SistemaMesi(objForm);
        
//     }else {
//         parserXMLPrestito.SalvaValoreInizialeSimPrest(objForm);
//         ga('send', 'event', 'Prestiti', 'importo finanziamento', result);
//         jqSimPrest(objForm).val(result);
//         parserXMLPrestito.SistemaPunteggiaturaSimPrest(objForm);
    
//     }   
// },

// // https://github.com/Microsoft/TypeScript/issues/8101
//   incrementaStart = (el,txtbox, verificaLimiti,verificaLimitiDurata,verificaLimitiDurata2) => {
//     jqSimPrest(el).on('click', function () {
//         clearInterval(pressTimerSimPrest);
//         var valueStep=Number(jqSimPrest(this).attr('data-step'));
        
//         parserXMLPrestito.incrementaValori(txtbox,valueStep, verificaLimiti,verificaLimitiDurata,verificaLimitiDurata2);
        
//     }).on('blur', function () {
//             clearInterval(pressTimerSimPrest); //clear time on mouseup
//         });
            
//     if(touchDeviceSimPrest){
//         jqSimPrest('input').focus(function(){
//             clearInterval(pressTimerSimPrest);
        
//         });
        
        
//         jqSimPrest('.simPrestFocus').focus(function(){
    
//             jqSimPrest(this).hide();
//             jqSimPrest(this).next().show().focus();
//             clearInterval(pressTimerSimPrest);
        
//         });
        
//         if(jqSimPrest(el).size()>0){
        
//             jqSimPrest(el).get(0).addEventListener( 'touchleave', function(){
//                 clearInterval(pressTimerSimPrest);
//             }, false );
//             jqSimPrest(el).get(0).addEventListener( 'touchend', function(){
//                 clearInterval(pressTimerSimPrest);
//             }, false );
//             jqSimPrest(el).get(0).addEventListener( 'touchstart', function(){
//                 var valueStep=Number(jqSimPrest(this).attr('data-step'));
//                 var objForm=txtbox;
//                 clearInterval(pressTimerSimPrest);
//                 pressTimerSimPrest = window.setInterval(function(){
//                     parserXMLPrestito.incrementaValori(objForm,valueStep, verificaLimiti,verificaLimitiDurata,verificaLimitiDurata2);
//                 },100);
//             }, false );
//         }
//     }else{
//         jqSimPrest(el).on('mousedown', function () {
//             var valueStep=Number(jqSimPrest(this).attr('data-step'));
//             var objForm=txtbox;
//             pressTimerSimPrest = window.setInterval(function(){
//                 parserXMLPrestito.incrementaValori(objForm,valueStep, verificaLimiti,verificaLimitiDurata,verificaLimitiDurata2);
//             },100);
//         }).on('mouseup', function () {
//             clearInterval(pressTimerSimPrest); //clear time on mouseup
//         });
//     }
// },

//   changeRange = (obj,slider, txtbox, min, max, step, val, verificaPunteggiatura, verificaLimiti,verificaLimitiDurata,verificaLimitiDurata2) => {     
//     if (eval(jqSimPrest(obj).attr('data-verificaPunteggiatura'))) {
//           parserXMLPrestito.SalvaValoreInizialeSimPrest(txtbox);
//           parserXMLPrestito.increaseSimPrestValueRange(obj, txtbox, verificaLimiti,verificaLimitiDurata,verificaLimitiDurata2);
//           parserXMLPrestito.SistemaPunteggiaturaSimPrest(txtbox);
         
//           jqSimPrest(obj).unbind('change');
//           setTimeout(function(){
//             jqSimPrest(obj).bind('change',function(){
            
//             parserXMLPrestito.changeRange(obj,slider, txtbox, min, max, step, val, verificaPunteggiatura, verificaLimiti,verificaLimitiDurata,verificaLimitiDurata2)
//             })
//           },400)
//   }
// },


//   inizializzaSlider =(slider, txtbox, min, max, step, val, verificaPunteggiatura, verificaLimiti,verificaLimitiDurata,verificaLimitiDurata2) => {
//     var timerSimPrest = true;
//     var increaseSimPrest;

//     jqSimPrest(slider).prev('.meno').attr('data-step',step*(-1));
//     jqSimPrest(slider).next('.piu').attr('data-step',step);
    
    
//     var el=jqSimPrest(slider).prev('.meno');
//     var el2=jqSimPrest(slider).next('.piu');
    
    
    
//     parserXMLPrestito.incrementaStart(el,txtbox, verificaLimiti,verificaLimitiDurata,verificaLimitiDurata2);
//     parserXMLPrestito.incrementaStart(el2,txtbox, verificaLimiti,verificaLimitiDurata,verificaLimitiDurata2);
    
    
    
        
//     jqSimPrest(slider).slider({
//             animate: true,
//             range: "min",
//             value: val == undefined ? parseInt(txtbox,10) : val,
//             min: min,
//             max: max,
//             step: step,
//             start: function (event, ui) {
//                 increaseSimPrest = true;
//                 if (verificaPunteggiatura||verificaLimitiDurata2) {
//                     if (timerSimPrest) {
//                         timerSimPrest = jqSimPrest.timer(function () {
                
//                             if (increaseSimPrest) {
//                                 parserXMLPrestito.SalvaValoreInizialeSimPrest(txtbox);
                                
                                
                                
//                                 parserXMLPrestito.increaseSimPrestValue(slider, txtbox, verificaLimiti,verificaLimitiDurata,verificaLimitiDurata2);
//                                 parserXMLPrestito.SistemaPunteggiaturaSimPrest(txtbox);
//                             }
                            
                            
//                         }, 100, true);
//                     }
//                 }
                
                
                
//             },
//             slide: function (event, ui) {
//                 clearInterval(pressTimerSimPrest);

//                 if (ui.value < 0) {
//                     jqSimPrest(slider).children('.ui-widget-header').removeClass('onSlide');
//                     jqSimPrest(slider).addClass('onSlide');
//                 } else {
//                     jqSimPrest(slider).children('.ui-widget-header').addClass('onSlide');
//                     jqSimPrest(slider).removeClass('onSlide');
//                 }
    
//                 if (!verificaPunteggiatura&&(!verificaLimitiDurata2)) {
//                     jqSimPrest(txtbox).val(ui.value);
    
//                 }
                
                
                
//                  parserXMLPrestito.Reset();
//                 parserXMLPrestito.SistemaPunteggiaturaSimPrest(txtbox);
                
                
//                 if(verificaLimitiDurata||verificaLimitiDurata2){
//                      parserXMLPrestito.SistemaMesi(txtbox);
//                 }
//             },
//             stop: function (event, ui) {
//                 jqSimPrest(slider).removeClass('onSlide');
//                 if (verificaPunteggiatura||verificaLimitiDurata2) {
//                     timerSimPrest = false;
//                     increaseSimPrest = false;
        
//                     if(verificaLimitiDurata2){
                    
//                         jqSimPrest(slider).slider("option", "value", 0);
//                     }else{
                    
//                         jqSimPrest(slider).slider("option", "value", 0);
//                     } 
//                 }
//             }
//         });
    

    
//     if(verificaLimitiDurata){
    
//         parserXMLPrestito.ImpostaDurata(jqSimPrest(slider).slider("value"), txtbox);
        
//     } 
//      else {

//         if (!verificaPunteggiatura&&!verificaLimitiDurata2) {
//             parserXMLPrestito.ImpostaValoreConPunteggiatura(jqSimPrest(slider).slider("value"), txtbox);
//         }
//     }
    

    

//   increaseSimPrestValue = (slider, txtbox, verificaLimiti,verificaLimitiDurata,verificaLimitiDurata2) => {
        
//     var valoreIniziale = parseInt(parserXMLPrestito.togliPunti(txtbox));
    
//     var valoreSlider = jqSimPrest(slider).slider("option", "value");
    
    
//     var result = valoreIniziale + valoreSlider;
    
    

//     var min = limitaMinValoreRedditoPrest;
//     var max = limitaMaxValoreRedditoPrest;

//     if (verificaLimitiDurata||verificaLimitiDurata2) {
//         ga('send', 'event', 'Prestiti', 'durata finanziamento', result);
//         min = presetValoriSimPrest.minDurata;
//         max = limitaMaxDurata;
//     }

//     if (verificaLimiti) {
//         ga('send', 'event', 'Prestiti', 'importo finanziamento', result);
//         min = limitaMinImportoPrest;
//         max = limitaMaxImportoPrest;
//     }

//     if (result < min) {
//         result = min
//     }
//     if (result > max) {
//         result = max;
//     }
//     jqSimPrest(txtbox).val(result);
// }


//   resetValoreIniziale = (txtbox, valore) => {
//     parserXMLPrestito.ImpostaValoreConPunteggiatura(valore, txtbox);
//     parserXMLPrestito.ImpostaDurata(valore, txtbox);
//   }
//   // clickButton = (button) => {
//   //   this.jqSimPrest(button).click();
//   // } 

//   SistemaPunteggiaturaSimPrest = (txtbox) => {

//     let valoreCorrente = $(txtbox).val();

//     if (this.valoreStartSimPrest == valoreCorrente) return;
//     //var num = valoreCorrente.replace(/\./g, "").replace(/\,/g, "");
//     let num = valoreCorrente.replace(/\D/g, ""); //solo caratteri numerici
//     valoreCorrente = num.replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1.");

//     $('.txtbox').next().val(parseInt(valoreCorrente.togliPunti($('.txtbox')), 10));
//     $('.txtbox').val(valoreCorrente);
//   }

  handleBackPrest = (evt: Event) => {
    console.log('########', evt.target)
  }

  
  SistemaMesi = (txtbox) => {
        
    var valoreCorrente = this.jqSimPrest(txtbox).val();

    if (this.valoreStartSimPrest == valoreCorrente) return;
    var num = parseInt(valoreCorrente); 
    this.jqSimPrest(txtbox).next().val(parseInt(parserXMLPrestito.togliPunti(this.jqSimPrest(txtbox)), 10));
    this.jqSimPrest(txtbox).val(valoreCorrente);
}

  SistemaPunteggiaturaSimPrestText = (txt: string) => {
        
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

  SalvaValoreInizialeSimPrest = (txtbox) => {
    this.Reset();
    this.valoreStartSimPrest = txtbox.value;
  }

//   init() {
//     console.log("init");
//     this.setInitData()
//   }
  render() {
    // this.init();
    return (
      <div class={"component-parent"}>
        Tipo canale: {this.tipocanale}
        <br/>
        Tipo prestito: {this.tipoprestito}
        <br/>
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
                  Inserisci i dati per conoscere la <strong>rata del tuo prestito emanon</strong>;
                  potrai richiedere di essere ricontattato o prendere un appuntamento in
                  agenzia. Il servizio &egrave; gratuito e senza impegno.
                </div>

                <div class="SimPrest-slider-wrapper">
                  <div class="SimPrest-single-slider">
                    <label>Importo richiesto</label> <span class="meno">-</span>

                    <div id="sliderImportoPrest" class="SimPrest-slider"></div><span class="piu">+</span>

                    <div class="completeFormSimPrest">
                      <input 
                          name="txtImportoPrest"
                          class="simPrestFocus"
                          type="text"
                          maxlength="9"
                          id="txtImportoPrest" 
                          onKeyDown={(e) => this.SalvaValoreInizialeSimPrest(e)} 
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

                    <div id="sliderDurataPrest" class="SimPrest-slider"></div><span class="piu">+</span>

                    <div class="completeFormSimPrest">
                      <input 
                          type="text" 
                          class="simPrestFocus" 
                          id="cboDurataPrest" 
                          maxlength="3"
                          // onKeyDown={(e) => parserXMLPrestito.SalvaValoreInizialeSimPrest(e)} 
                          // onBlur="parserXMLPrestito.verificaLimitiTextbox(cboDurataPrest,36,120,false,false,true);"
                          />
                          
                          <input class="nextPrest"
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
                     >Finalit&agrave;</label>

                    <div class="SimPrest-styled-select">
                      <select 
                        id="cboFinalitaPrest"
                        // onchange={parserXMLPrestito.Reset()(parserXMLPrestito.aggiornaLimiteImporto(cboFinalitaPrest,txtImportoPrest,5000,500000,true))}
                        >
                        <option value="1" data-label="Auto" title="Auto">
                          Auto Moto camper nautica
                        </option>

                        <option value="2" data-label="Casa" title="Casa">
                          Casa
                        </option>

                        <option value="3" data-label="estinzione prestiti" title="estinzione prestiti">
                          Estinzione prestiti
                        </option>

                        <option value="4" data-label="Efficientamento energetico dell'abitazione" title="Efficientamento energetico dell'abitazione">
                          Efficientamento energetico dell'abitazione
                        </option>

                        <option value="5" data-label="spese personali, altro" title="spese personali, altro">
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
                    >Reddito mensile netto</label>

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
                          <input class="nextPrest"
                            maxlength="7"
                            type="number"
                            // onBlur="parserXMLPrestito.verificaLimitiTextbox2(this,0,9999999,false,false);"
                             />
                      <span class="unitSimPrest">&euro;</span>
                    </div>
                    <label
                    // for="txtEtaPrest"
                    >Et&agrave; del richiedente</label>

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
                        >S&igrave;, voglio includere l'assicurazione sul prestito *</label>

                      <div class="label" style={{paddingLeft: '30px'}}>
                        <a href=
                             "https://emanon.it/rsc/contrib/document/Individui-e-Famiglie/SP_Prestiti/Informativa_assicurazione.pdf"
                           target="_blank">(Leggi l'informativa)</a>
                      </div>
                    </div>
                  </div>
                </div>

                <div class="SimPrest-clear">
                  </div>
                  <a 
                    id="SimPrest-calcola"
                    href="#"
                    class="SimPrest-submit-button"
                    // name="SimPrest-calcola"
                    >CALCOLA RATA</a>
              </div>

              <div class="SimPrest-container-step-2">
                <h1 id="afterSimPrest">
                  <a 
                    href="#" 
                    id="come-backPrest2"
                    // name="come-backPrest2"
                    onClick={this.handleBackPrest}
                    >CALCOLA LA RATA DEL TUO PRESTITO
                  </a>
                </h1>

                <div class="simResult">
                  <div class="SimPrest-recap">
                    <div class="SimPrest-col importo">
                      <h3>Importo<br />
                        richiesto</h3>

                      <p id="importoRicPrest"></p>
                  </div>

                    <div class="SimPrest-col durata">
                      <h3>Durata</h3>

                      <p><span id="durataPrest"></span> mesi</p>
                    </div>

                    <div class="SimPrest-col valore">
                      <h3>Reddito<br />
                        men. netto</h3>

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
                        >Cambia<br />
                        i dati</a>
                    </div>
                  </div>

                  <div id="accordionSimPrest"> {/* in original version was hardcoded in js */}
                    <div>
                      <div class="accSimPrestCont">
                        <div class="rowSimPrest line-1">
                          <div class="cellSimPrest importo-mensile">
                            <h3><span class="SimPrestHideMob">Importo </span>rata mensile</h3><p>157,11  €</p>
                          </div>
                          <div class="cellSimPrest taeg arrange">
                            <h3>TAEG</h3><p>8,50 %</p>
                          </div>
                        </div>
                        <div class="SimPrestWhite">
                          <div class="SimPrestLine">
                          </div>
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
                              <a class="schedaSimPrest" target="_blank" href="https://emanon.it/rsc/contrib/document/Individui-e-Famiglie/SP_Prestiti/PERSONALE_INNOVO_PRESTITO.pdf" data-index="0"> Scheda prodotto</a>
                            </div>
                            <div class="subRowCell">
                              <a class="calcolaSimPrest" data-index="0"> Informativa IEBCC</a>
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
                      <a class="SimPrest-submit-button SimPrest-button-recall" data-index=
                        "0">TI CHIAMIAMO NOI</a>
                    </div>

                    <div class="subRowCell">
                      <a class="SimPrest-submit-button SimPrest-button-appointment" data-index=
                        "0">CHIEDI IN FILIALE</a>
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