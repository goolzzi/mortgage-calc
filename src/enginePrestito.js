var amountSimPrest=130000;
var amountSimPrestFin=amountSimPrest;
var reddito=0;
var durataSimPrest;
var rataSimPrest;
var CPISimPrest='SI';
var finalitaSimPrest=1;
var valoreStartSimPrest;
var siglaPrestito='TF';
var limitaMinValoreRedditoPrest = 0;
var limitaMinImportoPrest = 5000;
var limitaMaxAquistoPrest = 99000;
var limitaMaxImportoPrest = limitaMaxAquistoPrest;
var limitaMaxValoreRedditoPrest = 9999999;
var mutuoObj={};

// soglia di arrotondamento decimale TAEG
var thresholdTaeg = 8;

var activeAnimPrest=true;
var tassoUsuraPrest=15;
var isPariSimPrest=false;
var presetValoriSimPrest={
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

// limite minimo durata prestito
var limitaMinDurata = presetValoriSimPrest.minDurata;
// limite massimo durata prestito
var limitaMaxDurata = presetValoriSimPrest.maxDurata;

var breakP;
var touchDeviceSimPrest=is_touch_deviceSimPrest();

// check if localhost
var localhost = location.href.indexOf('localhost')!=-1 ? true : false;

var standardCall='https://emanon.it/';

if(location.href.indexOf('banking.secure.emanon.it')!=-1){
    standardCall='https://banking.secure.emanon.it/';
    presetValoriSim.isPrivate=true;
}

// DEV ENVIRONMENT
if(localhost){
    standardCall='http://localhost:63342/webcomponent/original-html/original-calcolaprestito/';
}

var pressTimerSimPrest;
var urlSimPrestProd=standardCall+'rsc/comunicazione/calcolo-prestiti/xml/';
var urlSimPrestCol=standardCall+'rsc/comunicazione/calcolo-prestiti/xml/';


var urlSimPrestSvil='xml/';
var urlSimPrestFin=urlSimPrestProd;


// DEV ENVIRONMENT
if(localhost){
    urlSimPrestFin=standardCall+urlSimPrestSvil;
}

Number.prototype.toFixedDown = function(digits) {
    var re = new RegExp("(\\d+\\.\\d{" + digits + "})(\\d)"),
        m = this.toString().match(re);
    // se esiste terzo decimale...
    if (m) {
        // se il terzo decimale del taeg è uguale o superiore a 8 allora arrotondiamo per eccesso
        if (m[2]>=thresholdTaeg) {
            var taeg = Number(m[0]);
            return taeg.toFixed(digits);
        } else {
            // altrimenti mostriamo il dato senza arrotondamenti
            return m ? parseFloat(m[1]) : this.valueOf();
        }
    // ... altrimenti restituiamo il dato iniziale cosi come ci è stato fornito in input
    } else {
        return this.valueOf();
    }
};


function logg(msg) {
    if (localhost) {
        console.log(msg);
    }
}



function is_touch_deviceSimPrest() {
 return (('ontouchstart' in window)
      || (navigator.MaxTouchPoints > 0)
      || (navigator.msMaxTouchPoints > 0));
}

var xmlSimPrest='emanonLoansPrestito.xml';
// DEV ENVIRONMENT
// se in localhost prendiamo l'xml che è presente in produzione per testare
// if in localhost we take the xml that is present in production to test
if(localhost){
    var xmlSimPrest='emanonLoansPrestito_Prod.xml';
}

var xmlDefSimPrest='emanonLoansDefaultPrestito.xml';
var IEBCCSimPrest='IEBCC.html';
var AllegatoSimPrest='allegato.html';



// oggettone JS che contiene dati e metodi per il calcolo della rata del prestito
// JS object containing data and methods for calculating the loan installment
var parserXMLPrestito = (function parser() {
    return {
        cache:{
            content:[]
        },
        config: {
            content:{
                xmlToParse: xmlSimPrest,
                xmlToParseDef: xmlDefSimPrest,
                getObj: function getObj() {
                    parserXMLPrestito.parseToObj(this);
                }
            }
        },
        changeRangeData: function changeRangeData() {
            
            //var valoreReddito=Number(jqSimPrest('#txtValoreRedditoPrest').val().replace('.','').replace(',','.'));
            
            var importo=parseInt(parserXMLPrestito.togliPunti(jqSimPrest('#txtImportoPrest')), 10);
            //var importo=Number(jqSimPrest('#txtImportoPrest').val().replace('.','').replace(',','.'));
            durataSimPrest=parseInt(jqSimPrest('#cboDurataPrest').val(),10);
            CPISimPrest=(jqSimPrest('#cboCPIPrest').is(':checked'))? 'SI':'NO';
            
            
        
            jqSimPrest('#CPIPrest').text(CPISimPrest);

            amountSimPrest=importo;
            
            reddito=parseInt(parserXMLPrestito.togliPunti(jqSimPrest('#txtValoreRedditoPrest')), 10);
        
            finalitaSimPrest=Number(jqSimPrest('#cboFinalitaPrest').val());
        
            
            jqSimPrest('#finalitaPrest').text(jqSimPrest('#cboFinalitaPrest option[value='+finalitaSimPrest+']').attr('title'));
            jqSimPrest('#valoreRedd').text(jqSimPrest('#txtValoreRedditoPrest').val()+ '\u20AC');
            jqSimPrest('#importoRicPrest').text(jqSimPrest('#txtImportoPrest').val() + '\u20AC');
            jqSimPrest('#etaPrest').text(jqSimPrest('#txtEtaPrest').val() + ' anni');
            
            
            
            
            jqSimPrest('#durataPrest').text(durataSimPrest);
             jqSimPrest.each(parserXMLPrestito.cache.content,function(i,el){
                    /*recupero i valori*/
                    /* recover the values */
                
                    var obj=parserXMLPrestito.cache.content[i];
                                        
                    
                    
                    
                        
                        /*setto i valori con soglia rispetto a quelli inseriti*/
                        /* septum values with threshold compared to those entered */
                        /*###############################*/
                        
                        obj.name=parserXMLPrestito.functionRange(i,'nameStart');
                        
                        obj.fix=parserXMLPrestito.functionRange(i,'fixCalc');
                        
                        obj.url=parserXMLPrestito.functionRange(i,'urlStart');
                        obj.url2=parserXMLPrestito.functionRange(i,'urlStart2');
                                                
                        obj.invFunc=(1-obj.discInv)*parserXMLPrestito.functionRange(i,'inv');
                        obj.reportsFunc=parserXMLPrestito.functionRange(i,'reports');
                        obj.taxFunc=parserXMLPrestito.functionRange(i,'tax');
                        
                        obj.tanS=parserXMLPrestito.functionRange(i,'tanSCalc');
                        
                        obj.cap=parserXMLPrestito.functionRange(i,'capCalc');
                        
                        obj.spread=parserXMLPrestito.functionRange(i,'spreadCalc');
                            
                    
                });
        
        
        },

        start: function start() {
            jqSimPrest('body').append('<div class="modalSimPrestPrest"><div class="SimPrestCont"><a class="frameClose">X</a><iframe id="SimPrestFrame" src="" frameborder="0"></iframe></div></div>');
            jqSimPrest('body').append('<div id="dialogSimPrestPrest"></div>');
            jqSimPrest('body').append('<div class="modalPianoPrest"><div class="SimPrestCont"><a class="frameClose SimPrest-close-fixed">X</a><div id="actPlanPrest"></div></div></div>');
                
            
            jqSimPrest('.frameClose').click(function(e){
                e.preventDefault();
                
                parserXMLPrestito.closeWindowSimPrest();
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
            jqSimPrest.each(parserXMLPrestito.cache.content,function(i,el){
                var obj=parserXMLPrestito.cache.content[i];
                if(obj.type==presetValoriSimPrest.firstType){
                    orderedObj.push(obj);
                    
                }
                if(i==(parserXMLPrestito.cache.content.lenght-1)){
                
                    parserXMLPrestito.presetValoriSimPrestFunc();
                }
            })
            
            
            jqSimPrest.each(parserXMLPrestito.cache.content,function(i,el){
                var obj=parserXMLPrestito.cache.content[i];
                if(obj.type!=presetValoriSimPrest.firstType){
                    orderedObj.push(obj);
                    
                }
            })
            logg ("BEFORE: => "+ JSON.stringify(parserXMLPrestito.cache.content));
            parserXMLPrestito.cache.content=orderedObj;
            logg ("AFTER: => "+ JSON.stringify(parserXMLPrestito.cache.content));


            /*click al primo calcolo su bottone CALCOLA RATA*/
            /* click on the first calculation on button CALCULATE INSTALLMENT */
            jqSimPrest('#SimPrest-calcola').click(function(e){
                
                e.preventDefault();

                 var status = parserXMLPrestito.ValidaFiltri();
                isPariSimPrest=(isPariSimPrest==true)? false : true;
                 var divContenuto = document.getElementById('divContenuto');
            
            if (status) {
                ga('send', 'event', 'Prestiti', 'calcola ora', 'calcola ora')
                 parserXMLPrestito.Reset();
                 
                 if(activeAnimPrest){
                    jqSimPrest('.SimPrest-container-step-1' ).hide("slide", { direction: "left" }, 500);
                    jqSimPrest('.SimPrest-container-step-2').delay(500).show("slide", { direction: "left" }, 500);
                    
                    
                }
                
                 jqSimPrest.each(parserXMLPrestito.cache.content,function(i,el){
                     logg("------------------ CALCOLO RATA BEGIN -------------------------");


                    /*recupero i valori*/
                    /* I recover the values */
                    var obj=parserXMLPrestito.cache.content[i];


                    logg("parserXMLPrestito.cache.content => "+JSON.stringify(parserXMLPrestito.cache.content));
                                        
                    
                    //jqSimPrest('#txtImportoPrest').val(amount)
                    
                    if(true){
                        
                        logg ("CALCOLO RATA tanS => "+obj.tanS);
                        obj.tanR=obj.tanS;
                        
                        
                        
                        /*stampo i risultati*/
                        /*print the result*/

                        var rata=0;
                        var rataCap=0;
                        var rataInt=0;
                        var rataFin=0;
                        
                        /*per semplitita' uso il nome delle variabili dell'excel*/
                        /* for simplicity use the name of the excel variables */

                        // RACCOLTA VARIABILI E DATI
                        // VARIABLE AND DATA COLLECTION
                        
                        var C2=obj.cap; //cap
                    
                        var C3=amountSimPrest; //importo / amount
                        var C4=obj.tanS; //tan
                        CPISimPrest=(jqSimPrest('#cboCPIPrest').is(':checked'))? 'SI':'NO';

                        var C5=CPISimPrest; //cpi
                        var C6=Number(durataSimPrest); //durata mesi / # of months

                        var E2=C6;
                        // C4 = tanS
                        var E3=C4;
                        // C6 DURATA MESI / # of months
                        var E4=C6;

                        //var H7=H11:H311; //Totale dovuto 
                        //var H8=H7-H6; //Totale dovuto netto CPI 
                        var M4=obj.discInv //Sconto Spese  Istruttoria / Discount on preliminary expenses

                        var C7=0;
                        var C72=0;

                        // calcolo int1
                        var int1=0;
                        // Se la durata mesi (C6) è maggiore di 18 allora si calcola int1 in questo modo
                        // If the duration of months (C6) is greater than 18 then int1 is calculated in this way
                        if(C6>18){int1=0.25/100};
                        var I5=int1;

                        // calcolo int2
                        var int2=1.08/100*C6/12;
                        // Se invece la durata mesi (C6) è maggiore di 60 allora si calcola nel seguente modo
                        // If the duration of months (C6) is greater than 60, then it is calculated as follows
                        if(C6>60){int2=0.6/100*C6/12}

                        // calcolo int3
                        var int3=0;
                        if(C5=="SI"){
                            int3=int2
                        } 

                        var I4=int3;

                        // CALCOLO IMPORTO FINANZIATO
                        // CALCULATION OF THE FINANCED AMOUNT
                                            
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
                        // C2 is the ???

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
                        // CALCULATION OF INQUIRY EXPENSES
                        obj.inv=Math.min.apply(Math, [C2,0.5/100*C7*C6/12])*(1-M4);
                        var H4=obj.inv;

                        // CALCOLO IMPOSTA SOSTITUTIVA
                        // CALCULATION OF SUBSTITUTE TAX
                        var H5=0 //IF(C6>18;0.25/100*C7;0); // Imposta sostitutiva / Substitutive tax
                        if(C6>18){
                            H5=0.25/100*C7;
                        }
                        
                        // PREMIO ASSICURATIVO
                        // INSURANCE PREMIUM
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
                        /* calculate the number of days in the next month */
                        var nowSimPrest=new Date();
                        var thisM=new Date(nowSimPrest);
                        thisM.setDate(thisM.getDate()-1);
                        var nextM2=new Date(thisM); 
                        var nextM3=new Date((thisM.getMonth()+1)+'/'+thisM.monthDays()+'/'+thisM.getFullYear());
                        var testDate=new Date(nextM3);  
                        testDate.setDate(nextM3.getDate()+1);
                        nextM3.setDate(nextM3.getDate()+testDate.monthDays());
                        giorniStart=nextM3.monthDays();
                        
                        var D10=nextM3.monthDays();

                        logg ("H10 (giorni prox mese) => ",JSON.stringify(D10));


                        // CALCOLO RATA
                        /*calcolo rata con la formula standard*/
                        // questa è la rata mostrata all'utente


                        // CALCULATION OF INSTALLMENT
                        /* installment calculation with the standard formula */
                        // this is the installment shown to the user
                        rata = parserXMLPrestito.PMT(E3/1200,E4,-C7);

                        logg ("rata => "+ rata);

                        /*calcolo rata capita con la formula standard*/
                        /* installment calculation happens with the standard formula */
                        rataCap=rata-C7*E3/1200;
                        logg ("rataCap => "+ rataCap);

                        var giorni=D10;

                        rataInt=C7*E2/36000*D10;
                        logg ("rataInt => "+ rataInt);

                        rataFin=rataCap+rataInt;
                        logg ("rataFin => "+ rataFin);

                        var rataStandard=rata;
                        logg("CALCOLO RATA rataStandard => "+rataStandard);
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
                        for (j=C4*100;j<(maxVal);j++){
                            test = primoPagamento;
                            L4Test=j/100;
                            logg("CALCOLO RATA 1° SERIE CALCOLI TAEG - L4Test => "+L4Test);
                            var i=0;
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
                        for (j=(taegFinAprox-0.2)*1000;j<((Number(taegFinAprox)+0.2)*1000);j++){
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
                        for (j=(taegFin-0.02)*10000;j<((Number(taegFinAprox)+0.02)*10000);j++){
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

                        var rataFinale=rataFin.toFixed(2);
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
                    var obj=parserXMLPrestito.cache.content[index];
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
                        var obj=parserXMLPrestito.cache.content[index];


                        ga('send', 'event', 'Prestiti', siglaPrestito, jqSimPrest(this).text());


                        if(presetValoriSimPrest.isPrivate){
                            popupFattiRicontattare(argSimPrest)
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
                            popupFattiRicontattare(argSimPrest)
                        } else {


                            if(jqSimPrest(window).width()>640){
                                e.preventDefault();
                                parserXMLPrestito.openWindowSimPrest(url,'recall');
                            }

                        }


                    });


                jqSimPrest('.SimPrest-button-appointment').each(function(){
                    var index=Number(jqSimPrest(this).attr('data-index'));
                        var obj=parserXMLPrestito.cache.content[index];
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
                        var obj=parserXMLPrestito.cache.content[index];


                        ga('send', 'event', 'Prestiti', siglaPrestito, jqSimPrest(this).text());



                    FLOOD1('landi593', 'botto000');

                    if(presetValoriSimPrest.isPrivate){
                        popupPrendiApp(argSimPrest)
                    } else {


                        if(jqSimPrest(window).width()>640){
                            e.preventDefault();
                            parserXMLPrestito.openWindowSimPrest(url,'appointment');
                        }
                    }



                });


                jqSimPrest('.schedaSimPrest').click(function(e){

                    var index=Number(jqSimPrest(this).attr('data-index'));
                    var obj=parserXMLPrestito.cache.content[index];


                    ga('send', 'event', 'Prestiti', siglaPrestito, jqSimPrest(this).text());


                });





                jqSimPrest('.calcolaSimPrest').click(function(e){
                    e.preventDefault();
                    var index=Number(jqSimPrest(this).attr('data-index'));
                    var obj=parserXMLPrestito.cache.content[index];


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
        
        
        },

        // metodo iniziale
        init: function init() {
            /*parso l'xml*/
            var isCollaudo=jqSimPrest.urlParamSimPrest('collaudo');
            var isSviluppo=jqSimPrest.urlParamSimPrest('sviluppo');
    
            if(isCollaudo){
                xmlSimPrest='emanonLoans_colPrestito.xml';
                xmlDefSimPrest='emanonLoansDefaultPrestito_col.xml';
                
                parserXMLPrestito.config.content.xmlToParse=xmlSimPrest;
                parserXMLPrestito.config.content.xmlToParseDef=xmlDefSimPrest;
            } else if (isSviluppo){
                urlSimPrestFin=urlSimPrestSvil;
            }
            
            this.getContent();
             // jqSimPrest('.SimPrest-container').tooltip({ tooltipClass: "calculator-amortization"});

            resizeBg();

            setTimeout(function(){resizeBg()},200);
        },

        calcolaPiano: function (obj){
            jqSimPrest('#actPlanPrest,#actPlanPrest2').html('');
            
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

            jqSimPrest.ajax({url:urlSimPrestFin+IEBCCSimPrest,cache:false,dataType:'html'}).done(function(html){
                var template = html;
                Mustache.parse(template); 
                 var rendered = Mustache.render(template, mutuoObj);
                jqSimPrest('#actPlanPrest,#actPlanPrest2').prepend(rendered);
                // uso l'attributo data-index come indice
                var value=Number(jqSimPrest(obj).attr('data-index'));
                var thisObj=parserXMLPrestito.cache.content[value];
        
                var table=jqSimPrest('<table class="SimPrest-table-ammortamento" width="100%"></table>');
    
                
                var header='<tr><th>PR.</th><th class="optional">TIPO RATA</th><th>Q. CAPIT.</th><th>Q. INTER.</th><th>TOT. RATA    </th><th>CAP. RES.</th></tr>' ;
                jqSimPrest(table).append(header);
                
                
                var nowSimPrest=new Date();
                var thisM=new Date(nowSimPrest);
                thisM.setDate(thisM.getDate()-1);
                var nextM2=new Date(thisM); 
                /*
                    nextM2.setDate(nextM2.getDate()+nextM2.monthDays());
                    var nextM3=new Date((nextM2.getMonth()+1)+'/'+nextM2.monthDays()+'/'+nextM2.getFullYear());
                */
                var nextM3=new Date((thisM.getMonth()+1)+'/'+thisM.monthDays()+'/'+thisM.getFullYear());
                
    
                /*sommo i giorni da ieri alla fine del prosSimPresto mese*/
                var giorniStart=Math.ceil((nextM3-thisM)/86400000);
                //commentato per risultati come sito
                //thisM.setDate(thisM.getDate()+nowSimPrest.monthDays());
                
                var rataRecesso=0;
                            
                
                /*setto due variabili totale separate, che cambiano prima e dopo la visualizzazione*/
                var tot=amountSimPrestFin;
                var tot2=amountSimPrestFin;
                for (g=0;g<=durataSimPrest;g++){
                    /*Setto per comodita' le stesse variabili dell'excel*/
                    var I9=tot2;
                    var B2=amountSimPrestFin;
                    var E2=thisObj.tanR;
                    var E3=durataSimPrest ;
                    var B6=thisObj.cap;
                    var D10=giorniStart;
                    
                    if(g==0){
                        // gestisco il caso prima rata
                        rata=0;
                        rataCap=0;
                        rataInt=0;
                        rataFin=0;
                        rataRecesso=0;
                    } else {
                        /* gestisco il caso di default sul numero giorni del mese*/             
                        rata = parserXMLPrestito.PMT(E2/1200,E3,-B2);
                        rataCap=rata-I9*E2/1200;
                        rataInt=I9*E2/36000*D10;
                        rataFin=rataCap+rataInt;
                        
                        
                        /* per il mutuo fisso bypasso i giorni del mese e uso la formula standard*/
                            rataFin=rata;
                            rataInt=I9*E2/1200;
                            rataRecesso=I9*E2/1200/thisM.monthDays();
                            tot2=(tot*(1+E2/1200))-rataFin;
                        
                        
                        
                    }
                    
                    
                                
                    var td='<tr><td>'+g+'</td><td class="optional">ammortamento</td><td>'+parserXMLPrestito.SistemaPunteggiaturaSimPrestText(rataCap.toFixed(2).toString())+'</td><td>'+parserXMLPrestito.SistemaPunteggiaturaSimPrestText(rataInt.toFixed(2).toString())+'</td><td>'+parserXMLPrestito.SistemaPunteggiaturaSimPrestText(rataFin.toFixed(2).toString())+'</td><td>'+parserXMLPrestito.SistemaPunteggiaturaSimPrestText(Math.abs(tot2).toFixed(2).toString())+'</td></tr>' ;
    
    
                    // cambio il totale per il calcolo successivo
                    tot=tot2;
                    
                    
                    
                    
                    // cambio la data di inizio per il calcolo successivo
                    var testDate=new Date(nextM3);  
                    testDate.setDate(nextM3.getDate()+1);
                    nextM3.setDate(nextM3.getDate()+testDate.monthDays());
                    giorniStart=nextM3.monthDays();
                        
                    
                    jqSimPrest(table).append(td);
                    
                }
                
                
                
                
                
                
                
                
                var button='';
                if (window.print) button=jqSimPrest('<a id="SimPrest-print" href="#" class="SimPrest-submit-button">Stampa</a>');
                
                jqSimPrest('#actPlanPrest,#actPlanPrest2').append('<div class="page-break"></div>');
                jqSimPrest('#actPlanPrest,#actPlanPrest2').append(table);
                
                
                
                jqSimPrest.ajax({url:urlSimPrestFin+AllegatoSimPrest,cache:false,dataType:'html'}).done(function(html){
                    var template = html;
                    Mustache.parse(template); 
                    var rendered = Mustache.render(template, mutuoObj);
                    jqSimPrest('#actPlanPrest,#actPlanPrest2').append('<div class="page-break"></div>');
                    jqSimPrest('#actPlanPrest,#actPlanPrest2').append(rendered);
                
                    jqSimPrest('#actPlanPrest,#actPlanPrest2').append(button);
                    jqSimPrest('#actPlanPrest .SimPrest-submit-button').click(function(e){
                        e.preventDefault();
                
                        if (window.print) {
                            
                            window.print()
                        }
                    
                    });
                    parserXMLPrestito.openWindowPiano();
                
                
                })
                
                
                
                
                
            })
            
            
            
            
        
        },

        calcolaRecesso: function (obj){

                var thisObj=obj;
                var nowSimPrest=new Date();
                var thisM=new Date(nowSimPrest);
                thisM.setDate(thisM.getDate()-1);
                var nextM3=new Date((thisM.getMonth()+1)+'/'+thisM.monthDays()+'/'+thisM.getFullYear());
                var rataRecesso;
                            
                
                /*setto due variabili totale separate, che cambiano prima e dopo la visualizzazione*/
                
                var I9=amountSimPrestFin;
                var E2=thisObj.tanR;
                
                //rataRecesso=(I9*E2/1200/thisM.monthDays());
                //rataRecesso2=(I9*E2/1200/nextM3.monthDays());
                rataRecesso=(I9*E2/36500);
                
                return  rataRecesso;
            
            
        
        },
        
        calcolaMedia: function (obj,notInteressi){
            var valori=[];
            var thisObj=obj;
            
            var nowSimPrest=new Date();
            var thisM=new Date(nowSimPrest);
            thisM.setDate(thisM.getDate()-1);
            var nextM2=new Date(thisM); 
            /*
                nextM2.setDate(nextM2.getDate()+nextM2.monthDays());
                var nextM3=new Date((nextM2.getMonth()+1)+'/'+nextM2.monthDays()+'/'+nextM2.getFullYear());
            */
            var nextM3=new Date((thisM.getMonth()+1)+'/'+thisM.monthDays()+'/'+thisM.getFullYear());
            

            /*sommo i giorni da ieri alla fine del prosSimPresto mese*/
            var giorniStart=Math.ceil((nextM3-thisM)/86400000);
            //commentato per risultati come sito
            //thisM.setDate(thisM.getDate()+nowSimPrest.monthDays());
        
            /*setto due variabili totale separate, che cambiano prima e dopo la visualizzazione*/
            var tot=amountSimPrestFin;
            var tot2=amountSimPrestFin;
                    
            
            for (g=0;g<=durataSimPrest;g++){
                /*Setto per comodita' le stesse variabili dell'excel*/
                
                
                var I9=tot2;
                var B2=amountSimPrestFin;
                var E2=thisObj.tanR;
                var E3=durataSimPrest ;
                var B6=thisObj.cap;
                var D10=giorniStart;
                
                if(g==0){
                    // gestisco il caso prima rata
                    rata=0;
                    rataCap=0;
                    rataInt=0;
                    rataFin=0;
                } else {
                    /* gestisco il caso di default sul numero giorni del mese*/             
                    rata = parserXMLPrestito.PMT(E2/1200,E3,-B2);
                    rataCap=rata-I9*E2/1200;
                    rataInt=I9*E2/36000*D10;
                    rataFin=rataCap+rataInt;
                
                        rataFin=rata;
                        rataInt=I9*E2/1200;
                        tot2=(tot*(1+E2/1200))-rataFin;
                    
                    //per il mutuo fisso bypasso i giorni del mese e uso la formula standard
                        rataFin=rata;
                        rataInt=I9*E2/1200;
                        if(!notInteressi) mutuoObj.interessi+=rataInt;
                        tot2=(tot*(1+E2/1200))-rataFin;
                    
                
                }
                
                                
                
                if(g!=0){
                    valori.push(rataFin.toFixed(2))
                }       
                

                // cambio il totale per il calcolo successivo
                tot=tot2;
                
                
                // cambio la data di inizio per il calcolo successivo
                var testDate=new Date(nextM3);  
                testDate.setDate(nextM3.getDate()+1);
                nextM3.setDate(nextM3.getDate()+testDate.monthDays());
                giorniStart=nextM3.monthDays();
                
                
            }
            return valori;
            
            
        
        },

        parseToObj: function parseToObj(objToParse){
            var variable=this;
            // carico l'xml
            
            jqSimPrest.get(urlSimPrestFin+objToParse.xmlToParse, function(xml){
                jqSimPrest(xml).find( "loan" ).each(function(i,el){
                    // costruisco l'oggetto
                    var obj={};

                    //elementi presenti all'interno della radice float dell'xml
                    obj.type=jqSimPrest(this).attr('type');
            
                    obj.cap=Number(jqSimPrest('cap',this).text().replace(',','.'));
                
                    obj.fire=Number(jqSimPrest('fire',this).text().replace(',','.'))/100;

                    obj.discInv=Number(jqSimPrest('discInv',this).text().replace(',','.'))/100;

                    obj.discRep=Number(jqSimPrest('discRep',this).text().replace(',','.'))/100;
                    // creo gli oggetti per il calcolo dei valori a soglia


                    // creo gli oggetti per il calcolo dei valori a soglia
                    // array di dati presi da ogni nodo con il nome nodeName cercato in findRange
                    obj.nameStart=[];
                    obj.nameStart=parserXMLPrestito.findRange('name',this);
                
                    
                    obj.urlStart=[];
                    obj.urlStart=parserXMLPrestito.findRange('url',this);
                    
                    obj.urlStart2=[];
                    obj.urlStart2=parserXMLPrestito.findRange('url2',this);
                    
                    obj.inv=[];
                    obj.inv=parserXMLPrestito.findRange('inv',this);
                    
                    obj.reports=[];
                    obj.reports=parserXMLPrestito.findRange('reports',this);
                    obj.tax=[];
                    obj.tax=parserXMLPrestito.findRange('tax',this);
                    
                    obj.tanSCalc=[];
                    obj.tanSCalc=parserXMLPrestito.findRange('tan',this);
                
                
                    obj.capCalc=[];
                    obj.capCalc=parserXMLPrestito.findRange('cap',this);
                    
                    
                    
                    obj.spreadCalc=[];
                    
                    obj.spreadCalc=parserXMLPrestito.findRange('spread',this);

                    logg ("enginePrestito parseToObj obj => "+JSON.stringify(obj));

                    parserXMLPrestito.cache.content.push(obj);
                    
                    if(i==(jqSimPrest(xml).find( "loan" ).size()-1)){
                        logg("enginePrestito i => "+i);
                        logg("enginePrestito jqSimPrest(xml).find( loan ).size()-1) => "+(jqSimPrest(xml).find( "loan" ).size()-1));
                        logg("i==(jqSimPrest(xml).find( \"loan\" ).size()-1)) => ", (i==(jqSimPrest(xml).find( "loan" ).size()-1)));
                        logg("enginePrestito urlSimPrestFin+objToParse.xmlToParseDef => "+urlSimPrestFin+objToParse.xmlToParseDef);

                        jqSimPrest.get(urlSimPrestFin+objToParse.xmlToParseDef, function(xml){
                            jqSimPrest(xml).find( "exception" ).each(function(i,el){
                                // costruisco l'oggetto
                                var actUrl=location.href;
                                //logg ("actUrl => "+actUrl);
                                var elUrl=jqSimPrest(el).attr('url');
                                // se troviamo tra i nodi exception uno con attributo url uguale a actUrl...
                                if(actUrl.indexOf(elUrl)!=-1){
                                    jqSimPrest(el).find('*').each(function(i2,el2){
                                        logg ("enginePrestito jqSimPrest(el2).get(0).tagName => ", jqSimPrest(el2).get(0).tagName);
                                        presetValoriSimPrest[jqSimPrest(el2).get(0).tagName]=jqSimPrest(el2).text();
                                        
                                    });
                                    
                                }
                                
                                if(i==(jqSimPrest(xml).find( "exception" ).size()-1)){
                                    parserXMLPrestito.presetValoriSimPrestFunc();
                                    parserXMLPrestito.start();
                                }
                                
                            });
                            
                        });
                            
                    
                    }
                    
                });
                
                
                
            });
            
            
            
            
            
        },

        functionRange:function(obj,prop){
            // funzione per la corrispondenza con le soglie dei valori inseriti
            var thisObj=parserXMLPrestito.cache.content[obj];
            
            
            var thisProp=thisObj[prop];
        
            var confronto=0;
            var type='max';
        
            
            
            if(thisProp){
                if((thisProp.type!='')&&(thisProp.type!=null)){
                    type=thisProp.type;
                    
                    
                } 
                
                
                
                // creo una variabile per fermare il ciclo for quando trova il risultato
                var breakP=false;
                var valueFin=0;
                jqSimPrest.each(thisProp,function(i,el){
                    if(!breakP){
                        /* gestisco due diversi valori per la corrispondenza: "<" su calcolo da importo, "=" su tipo di mutuo */
                        var variable= amountSimPrest;
                        var variableToS='amount';
                        
                        if(el.durata!=null){
                            variable= durataSimPrest;
                            variableToS='durata';
                        }
                        
                        if(el.ltype!=null){
                            variable= el.ltype;
                            variableToS='ltype';
                        }
                        
                        if(el.eta!=null){
                            variable= el.eta;
                            variableToS='eta';
                        }
                        
                        
                        if(el.importo!=null){
                            variable= el.importo;
                            variableToS='importo';
                        }
                        
                        if(el.reddito!=null){
                        
                            variable= reddito;
                            variableToS='reddito';
                            
                            
                        }
                        
                        
                        
                        var controlloValidita=(variable<el[variableToS]) ? true: false;
                        
                    
                        
                        if((variableToS=='ltype')){
                            controlloValidita=(variable==finalitaSimPrest)? true: false;
                            
                            
                            if(variable==0){
                                // gestisco l'otherwise su tipo di mutuo
                                controlloValidita=true;
                            }
                        }
                    
                        if((variableToS=='durata')){
                            controlloValidita=(variable<=el[variableToS])? true: false;
                            
                        }
                    
                        //logg(variableToS+' '+controlloValidita+ ' '+variable+' '+el[variableToS])
                        
                        
                        
                        
                        if(controlloValidita){
    
                            confronto=(el[variableToS]);
                            
                            var arrayEl=[];
                            
                            
                            
                            if(el.rangeValues[0]=== Object(el.rangeValues[0])){
                                breakP=false;
                                
                            
                                var value=parserXMLPrestito.functionRangeMatrix(el);
                            
                                arrayEl.push(value);
                
                                
                            } else {
                                
                            
                                type=el.type;
                                        
                                                
                                            // ciclo i valori di confronto
                                jqSimPrest.each(el.rangeValues,function(i2,el2){
                                        
                                    //logg(el2)
                                    
                                    if(el2.type){
                                        // se il valore e' a sua volta un confronto
                                        var subType=el2.type;
                                        
                                        
                                        
                                        var subArray=[];
                                                
                                            // ciclo i valori di confronto (sempre numeri)
                                        jqSimPrest.each(el2.rangeValues,function(i3,el3){
                                            
                                            var val=Number(el3);
                                                if(el3.indexOf('%')!=-1){
                                                    val=Number(el3.split('%')[0])*amountSimPrest/100;
                                                }
                                                
                                                subArray.push(val);
                                            
                                        })
                                        
                                        // controllo minimo o masSimPresto in base alla contribuzione
                                        var value=Math.max.apply(Math, subArray);
                                        if(subType=='min'){
                                            value=Math.min.apply(Math, subArray);
                                        }
                                        
                                        arrayEl.push(value);
    
                                    }else{
                                        // se il valore e' un numero
                                        
                                                                                
                                        
                                        var val=Number(el2);
                                        if(el2.indexOf('%')!=-1){
                                            val=Number(el2.split('%')[0])*amountSimPrest/100;
                                        } else {
                                            if(isNaN(val)){
                                                val=el2;
                                            }
                                        
                                        }
                                    
                                        arrayEl.push(val);
                                    }
                                    
                                })
                            
                            }
                            
                                    
                        
                            // controllo minimo o masSimPresto in base alla contribuzione
                            
                            
                            
                            if(isNaN(Number(arrayEl[0]))){
                                value=arrayEl[0];
                            } else {
                                var value=Math.max.apply(Math, arrayEl);
                                if(type=='min'){
                                    value=Math.min.apply(Math, arrayEl);
                                }
                            
                            
                                    
                            
                            }
                            
                            
                            
                            
                            
                            valueFin=value;
                            breakP=true;
                        }
                    }
                    
                })
                return valueFin;
            
            }
            
        },

        IsValidoLTV: function(campoFinalita, campoValoreReddito, campoImporto, txtDurataMutuo) {
            var limit = 10000;
            var codFinalita = campoFinalita.value;
            var valoreReddito = parseFloat(campoValoreReddito.value.replace(/\D/g, ""));
            var importoPrestRichiesto = parseFloat(campoImporto.value.replace(/\D/g, ""));


            if (importoPrestRichiesto < limit && txtDurataMutuo.value>60) {
                parserXMLPrestito.InfoAlertSimPrest('Per prestiti inferiori a 10.000€ la durata massima è di 60 mesi', campoImporto);
                return false;
            }
            
            /*
            
            ##################################################
            
            // inserire in controllo per reddito
            var ltvMasSimPresto = parserXMLPrestito.CalcolaLTVMasSimPresto(codFinalita);
            var ltv = valoreReddito/importoRicPresthiesto;
            var articolo='il ';
            if (ltvMasSimPresto==0.8){
                articolo='l\'';
            }

            if (ltv > ltvMasSimPresto) {
                parserXMLPrestito.InfoAlertSimPrest('Il rapporto tra valore richiesto e valore dell\'immobile non pu\u00f2 superare '+articolo+ltvMasSimPresto*100+'%', campoImporto);
                return false;
            }
            
            */
            parserXMLPrestito.changeRangeData();
            
            
            
            return true;
        },

        CalcolaLTVMasSimPresto: function(codFinalita) {
            //validazione calcola masSimPresto muto erogabile in base alla finalita
            if (codFinalita == 16)
                return 0.8;
            else if (codFinalita == 3)
                return 0.3; 
            else
                return 0.8;
        },

        ValidaFiltri: function() {
           
          
            var txtImportoPrest = document.getElementById('txtImportoPrest');
            var txtDurataMutuo = document.getElementById('cboDurataPrest');
            var txtEtaPrest = document.getElementById('txtEtaPrest');
        
        
        
            return parserXMLPrestito.IsValidoLTV(cboFinalitaPrest, txtValoreRedditoPrest, txtImportoPrest, txtDurataMutuo) && parserXMLPrestito.ValidaEta(txtDurataMutuo, txtEtaPrest);
        },

        ValidaEta: function(campoDurataMutuo, campoEta) {
            //validazione eta' richiedente
            var etaRichiedente = parseInt(parserXMLPrestito.togliPunti(campoEta), 10);
            
            var etaAScadenza = etaRichiedente + parseInt(campoDurataMutuo.value, 10)/12;
            
            
            
            
            if (isNaN(etaRichiedente)) {
                parserXMLPrestito.InfoAlertSimPrest('Per richiedere un prestito devi inserire la tua et\u00e0.', campoDurataMutuo);
                return false;
            }
            
            if (etaRichiedente < 18) {
                parserXMLPrestito.InfoAlertSimPrest('Per richiedere un prestito devi avere almeno 18 anni.', campoDurataMutuo);
                return false;
            }
            
            if (etaRichiedente > 99) {
                parserXMLPrestito.InfoAlertSimPrest('Per richiedere un prestito devi avere meno di 99 anni.', campoDurataMutuo);
                return false;
            }
            
            if (etaAScadenza > 80) {
                parserXMLPrestito.InfoAlertSimPrest('Hai superato la soglia massimaa di durata del prestito. La somma tra questa e la tua et\u00e0 deve essere inferiore a 80 anni! Riprova modificando la durata.', campoDurataMutuo);
                return false;
            }
            return true;
        },

        // rata = parserXMLPrestito.PMT(E3/1200,E4,-C7);
        PMT: function(i, n, p){
            // i => tan/1200
            logg("CALCOLO RATA PMT i -> tan/1200 =>"+i);
            // p => importo finanziato
            logg("CALCOLO RATA PMT p -> importo finanziato =>"+p);
            // n => durata mesi
            logg("CALCOLO RATA PMT n -> durata mesi =>"+n);

            // funzione per calcolo dell'interesse
            let firstPart = i * p * Math.pow((1 + i), n);
            logg("CALCOLO RATA PMT firstPart =>"+firstPart);
            let secondPart = (1 - Math.pow((1 + i), n));
            logg("CALCOLO RATA PMT secondPart =>"+secondPart);
            let pmt = firstPart / secondPart;
            logg("CALCOLO RATA PMT pmt =>"+pmt);
            logg(" \n ");

            return pmt;

            //return i * p * Math.pow((1 + i), n) / (1 - Math.pow((1 + i), n));
        },
        
        InfoAlertSimPrest : function (cosa,campo){
            //apre il dialog
        
            jqSimPrest( "#dialogSimPrestPrest" ).dialog({
              dialogClass: "alertSimPrest",
              buttons: [
                {
                  text: cosa,
                  click: function() {
                    jqSimPrest( this ).dialog( "close" );
                    jqSimPrest(campo).focus();
                  }
                }
              ]
            });
            
        },

        functionRangeMatrix: function(obj,value){
            
            var valoreReddito=parseInt(parserXMLPrestito.togliPunti(jqSimPrest('#txtValoreRedditoPrest')), 10);
            var importo=parseInt(parserXMLPrestito.togliPunti(jqSimPrest('#txtImportoPrest')), 10);
            var durata=parseInt(jqSimPrest('#cboDurataPrest').val(),10);
            var eta=Number(jqSimPrest('#txtEtaPrest').val());
            var finalita=Number(jqSimPrest('#cboFinalitaPrest').val());
                //logg(obj)
            
            //aggiungere in caso discriminante du importo/reddito
            //##########################################
            var diffImporto=importo/valoreReddito;
            var importoV;
            var etaV;
            var redditoV;

            
            
            jqSimPrest.each(obj.rangeValues,function(i,el){
                
                var continua;
                
                
                
                if(!breakP){
                    //logg(el)
                    if(el.importo){
                        
                        if((el.type=='less')){
                            importoV=Number(el.importo);
                            if(diffImporto<=Number(el.importo)){
                                continua=el;
                                breakP=true;
                                
                            } else {
                                breakP=false;
                            }
                        } else {
                            if(diffImporto>importoV){
                                continua=el;
                                breakP=true;
                                
                            } else {
                                breakP=false;
                            }
                        }
                        
                        
                    } else if(el.reddito){
                        
                        if((el.type=='less')){
                            redditoV=Number(el.reddito);
                            
                            if(valoreReddito<=Number(el.reddito)){
                                continua=el;
                                breakP=true;
                            
                                
                            } else {
                                breakP=false;
                            }
                        } else {
                        
                            redditoV=Number(el.reddito);
                            
                            if(valoreReddito>redditoV){
                                
                                continua=el;
                                breakP=true;
                                
                            } else {
                                
                                breakP=false;
                            }
                        }
                        
                        
                    }  else if(el.amount){
                        
                        if((el.type=='less')){
                            amountV=Number(el.amount);
                            if(importo<=Number(el.amount)){
                                continua=el;
                                breakP=true;
                                
                            } else {
                                breakP=false;
                            }
                        } else {
                            amountV=Number(el.amount);
                            if(importo>amountV){
                                continua=el;
                                breakP=true;
                                
                            } else {
                                breakP=false;
                            }
                        }
                        
                        
                    } else if(el.ltype){
                        //logg(finalita+' '+el.ltype)
                        if((el.ltype==finalita)){
                            continua=el;
                            breakP=true;
                            
                        } else {
                            breakP=false;
                        }
                    } else  if(el.durata){
                        
                        if((el.durata==durata)){
                            
                            continua=el;
                            breakP=true;
                            
                        } else {
                            breakP=false;
                        }
                        
                    } else if(el.eta){
                        
                        if(el.type=='less'){
                            etaV=Number(el.eta);
                            if(eta<=Number(el.eta)){
                                continua=el;
                                breakP=true;
                            } else {
                                breakP=false;
                            }
                            
                        } else {
                            if(eta>etaV){
                                continua=el;
                                breakP=true;
                                
                            } else {
                                breakP=false;
                            }
                        }
                    } else {
                        value=el;
                    }
                    
                    
                    
                                    
                    
                    if(continua){
                
                        breakP=false;
                        value=parserXMLPrestito.functionRangeMatrix(continua,value)
                        
                    }
                    
                
                
                }
                
            })
        
            
            return value;
        },

        openWindowSimPrest: function(quale,type){
            //apre l'iframe se pc o tablet, pagina se mobile
            /*
            if(jqSimPrest(window).width()>760){
                jqSimPrest('#SimPrestFrame').attr('src',unescape(quale));
                jqSimPrest('body').addClass('modalSimPrestPrestOpen');
                parserXMLPrestito.resizeIframeSimPrest();
                jqSimPrest('#SimPrestFrame').width(760).height(520);
                if(type=='recall'){
                    jqSimPrest('#SimPrestFrame').width(486);
                } 
            } else {
                location.href=quale;
            }
            */
            
            jqSimPrest('#SimPrestFrame').attr('src',unescape(quale));
            jqSimPrest('body').addClass('modalSimPrestPrestOpen');
            parserXMLPrestito.resizeIframeSimPrest();

            if(type=='recall'){
                    jqSimPrest('#SimPrestFrame').removeClass('scheda').addClass('recall');
                    
                
            } else {
                jqSimPrest('#SimPrestFrame').removeClass('scheda').removeClass('recall');
            }
            
        },

        openWindowScheda: function(quale){
            //apre l'iframe se pc o tablet, pagina se mobile
            /*
            if(jqSimPrest(window).width()>760){
                jqSimPrest('#SimPrestFrame').attr('src',unescape(quale));
                jqSimPrest('body').addClass('modalSimPrestPrestOpen');
                parserXMLPrestito.resizeIframeSimPrest();
                jqSimPrest('#SimPrestFrame').width(760).height(520);
                
            } else {
                location.href=quale;
            }
            */
            jqSimPrest('#SimPrestFrame').attr('src',unescape(quale));
            jqSimPrest('body').addClass('modalSimPrestPrestOpen');
            parserXMLPrestito.resizeIframeSimPrest();
            
            jqSimPrest('#SimPrestFrame').addClass('scheda').removeClass('recall');
        },

        closeWindowSimPrest: function(){
            //chiude l'iframe
            
            //jqSimPrest('#SimPrestFrame').removeAttr('src');
            
            jqSimPrest('#actPlanPrest,#actPlanPrest2').html('');
        
            jqSimPrest('#modalPianoPrest .SimPrestCont').css({'height':'0'});
            
            
            jqSimPrest('body').removeClass('modalSimPrestPrestOpen');
            jqSimPrest('body').removeClass('modalPianoPrestOpen');
        },

        openWindowPiano: function(){
            //apre l'iframe se pc o tablet, pagina se mobile
            jqSimPrest('body').addClass('modalPianoPrestOpen');
            jqSimPrest('#modalPianoPrest .SimPrestCont').css({'height':'100%'});
        },

        resizeIframeSimPrest: function(){
            //riposizione l'iframe
            var margin=(jqSimPrest('.modalSimPrestPrest').eq(0).height()-520)/2;
            jqSimPrest('.modalSimPrestPrest .SimPrestCont').css({'margin-top':margin+'px'});
        },

        presetValoriSimPrestFunc: function(){
            //reimposta i valori in base ai default
            
            limitaMinDurata=Number(presetValoriSimPrest.minDurata);
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
            
            
            
            
            
            durataSimPrest=Number(presetValoriSimPrest.defDurata);
        
            jqSimPrest('#txtEtaPrest').val(Number(presetValoriSimPrest.defAge));
            
            jqSimPrest('#txtEtaPrest').next().val(Number(presetValoriSimPrest.defAge));
            
            jqSimPrest('#cboFinalitaPrest').val((presetValoriSimPrest.defFinalita));
        
            
            
            
            durataSimPrest=Number(presetValoriSimPrest.defDurata);
        
            jqSimPrest('#txtEtaPrest').val(Number(presetValoriSimPrest.defAge));
            
            jqSimPrest('#cboFinalitaPrest').val((presetValoriSimPrest.defFinalita));
        
        
            
            
            
            
            
            parserXMLPrestito.SistemaPunteggiatura(jqSimPrest('#txtValoreRedditoPrest').get(0));
            parserXMLPrestito.SistemaPunteggiatura(jqSimPrest('#txtImportoPrest').get(0));
            
            parserXMLPrestito.SistemaMesi(jqSimPrest('#cboDurataPrest').get(0));
        
        
          parserXMLPrestito.inizializzaSlider('#sliderDurataPrest','#cboDurataPrest',-12,12,1,0,false,false,false,true);
        
            
            parserXMLPrestito.inizializzaSlider('#sliderRedditoPrest','#txtValoreRedditoPrest',-100,100,500,0,true,false,false);
            parserXMLPrestito.inizializzaSlider('#sliderImportoPrest','#txtImportoPrest',-5000,5000,500,0,true,true,false);
        
        
        /*#####################################################*/
        /*  parserXMLPrestito.inizializzaSlider('#sliderDurataPrest','#cboDurataPrest',limitaMinDurata,limitaMaxDurata,1,parseInt(jqSimPrest('#cboDurataPrest').val()),false,false,true);
        
*/
            
            //parserXMLPrestito.inizializzaSlider('#sliderEta','#txtEtaPrest',18,75,1,undefined,false,false);
                    
            
        },

        aggiornaSlider: function(txtbox, slider, verificaLimitaFinalita,verificaLimitiDurata,verificaLimitiDurata2) {
            var min = jqSimPrest(slider).slider("option", "min");
            var max = jqSimPrest(slider).slider("option", "max");
            var value = parserXMLPrestito.togliPunti(txtbox);
            parserXMLPrestito.verificaLimitiTextbox(txtbox, min, max, verificaLimitaFinalita,verificaLimitiDurata,verificaLimitiDurata2);
            jqSimPrest(slider).slider("value", value);
        },

        verificaLimitiTextbox2: function(txtbox, min, max, verificaLimitaFinalita,verificaLimitiDurata,verificaLimitiDurata2) {
            var newForm=jqSimPrest(txtbox).prev();
             parserXMLPrestito.ImpostaValoreConPunteggiatura(jqSimPrest(txtbox).val(), newForm)

            
            
            var value = parserXMLPrestito.togliPunti(jqSimPrest(newForm));
            
                        
            if (verificaLimitaFinalita) {
                max = limitaMaxImportoPrest;
            }
            if (value == "" || value < min) {
                value = min;
                parserXMLPrestito.ImpostaValoreConPunteggiatura(value, newForm);
            } else if (value > max) {
                value = max;
                parserXMLPrestito.ImpostaValoreConPunteggiatura(value, newForm);
            }
            
            if(verificaLimitiDurata){
                parserXMLPrestito.ImpostaDurata(value, newForm);
            
            }
            
            jqSimPrest(txtbox).hide();
            jqSimPrest(newForm).show();
            
            
        },

        verificaLimitiTextbox: function(txtbox, min, max, verificaLimitaFinalita,verificaLimitiDurata,verificaLimitiDurata2) {
            var value = parserXMLPrestito.togliPunti(jqSimPrest(txtbox));
            
                        
            if (verificaLimitaFinalita) {
                max = limitaMaxImportoPrest;
            }
            if (value == "" || value < min) {
                value = min;
                parserXMLPrestito.ImpostaValoreConPunteggiatura(value, txtbox);
            } else if (value > max) {
                value = max;
                parserXMLPrestito.ImpostaValoreConPunteggiatura(value, txtbox);
            }
            
            if(verificaLimitiDurata){
                parserXMLPrestito.ImpostaDurata(value, txtbox);
            
            }
            
            jqSimPrest(txtbox).next().val(parseInt(value,10))
            
        },
        
        aggiornaLimiteSlider: function(combo, txtbox, slider, verificaLimitaFinalita) {
        
            parserXMLPrestito.setLimiteMaxImporto(combo);
        
            jqSimPrest(slider).slider("option", "max", limitaMaxImportoPrest);
        
            parserXMLPrestito.aggiornaSlider(txtbox, slider, verificaLimitaFinalita);
        },

        // metodo chiamato nel momento in cui cambiamo la finalità dell'importo o se attiviamo/disattiviamo assicurazione
        // INPUT:
        aggiornaLimiteImporto: function(combo, txtbox, min, max, verificaLimitaFinalita) {
           parserXMLPrestito.setLimiteMaxImporto(combo);
        
            parserXMLPrestito.verificaLimitiTextbox(txtbox, min, max, verificaLimitaFinalita);
        },
        
        setLimiteMaxImporto: function(combo) {
            var valCombo = jqSimPrest(combo).find('option:selected').val();
            limitaMaxImportoPrest = limitaMaxAquistoPrest;
        },
        
        togliPunti: function(textbox) {
            var valuta =jqSimPrest(textbox).val();
            if(jqSimPrest(textbox).size()>0 && jqSimPrest(textbox).val() && jqSimPrest(textbox).val().indexOf('.')!=-1){
                 valuta = jqSimPrest(textbox).val().replace(/\./g, "").replace(/\,/g, "");
            }
           
            return valuta;
        },

        ImpostaDurata: function(value, txtbox) {

            parserXMLPrestito.SalvaValoreInizialeSimPrest(txtbox);
            jqSimPrest(txtbox).val(value);
            jqSimPrest('#sliderDurataPrest').slider( "value", value);
            
            parserXMLPrestito.SistemaMesi(txtbox);
        },

        ImpostaValoreConPunteggiatura: function(value, txtbox) {
            parserXMLPrestito.SalvaValoreInizialeSimPrest(txtbox);
        
            jqSimPrest(txtbox).val(value);
            parserXMLPrestito.SistemaPunteggiaturaSimPrest(txtbox);
        },

        incrementaValori: function(objForm,valueStep, verificaLimiti,verificaLimitiDurata,verificaLimitiDurata2) {
            
            
            var value=parseInt(parserXMLPrestito.togliPunti(jqSimPrest(objForm)));
            
            
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
                parserXMLPrestito.SalvaValoreInizialeSimPrest(objForm);
                jqSimPrest(objForm).val(result);
                parserXMLPrestito.SistemaMesi(objForm);
                
            } else if(verificaLimitiDurata2){
                parserXMLPrestito.SalvaValoreInizialeSimPrest(objForm);
                ga('send', 'event', 'Prestiti', 'durata finanziamento', result);
                jqSimPrest(objForm).val(result);
                parserXMLPrestito.SistemaMesi(objForm);
                
            }else {
                parserXMLPrestito.SalvaValoreInizialeSimPrest(objForm);
                ga('send', 'event', 'Prestiti', 'importo finanziamento', result);
                jqSimPrest(objForm).val(result);
                parserXMLPrestito.SistemaPunteggiaturaSimPrest(objForm);
            
            }
            
            
        },

        incrementaStart: function(el,txtbox, verificaLimiti,verificaLimitiDurata,verificaLimitiDurata2) {
            jqSimPrest(el).on('click', function () {
                clearInterval(pressTimerSimPrest);
                var valueStep=Number(jqSimPrest(this).attr('data-step'));
                
                parserXMLPrestito.incrementaValori(txtbox,valueStep, verificaLimiti,verificaLimitiDurata,verificaLimitiDurata2);
                
            }).on('blur', function () {
                    clearInterval(pressTimerSimPrest); //clear time on mouseup
                });
                    
            if(touchDeviceSimPrest){
                jqSimPrest('input').focus(function(){
                    clearInterval(pressTimerSimPrest);
                
                });
                
                
                jqSimPrest('.simPrestFocus').focus(function(){
            
                    jqSimPrest(this).hide();
                    jqSimPrest(this).next().show().focus();
                    clearInterval(pressTimerSimPrest);
                
                });
                
                if(jqSimPrest(el).size()>0){
                
                    jqSimPrest(el).get(0).addEventListener( 'touchleave', function(){
                        clearInterval(pressTimerSimPrest);
                    }, false );
                    jqSimPrest(el).get(0).addEventListener( 'touchend', function(){
                        clearInterval(pressTimerSimPrest);
                    }, false );
                    jqSimPrest(el).get(0).addEventListener( 'touchstart', function(){
                        var valueStep=Number(jqSimPrest(this).attr('data-step'));
                        var objForm=txtbox;
                        clearInterval(pressTimerSimPrest);
                        pressTimerSimPrest = window.setInterval(function(){
                            parserXMLPrestito.incrementaValori(objForm,valueStep, verificaLimiti,verificaLimitiDurata,verificaLimitiDurata2);
                        },100);
                    }, false );
                }
            }else{
                jqSimPrest(el).on('mousedown', function () {
                    var valueStep=Number(jqSimPrest(this).attr('data-step'));
                    var objForm=txtbox;
                    pressTimerSimPrest = window.setInterval(function(){
                        parserXMLPrestito.incrementaValori(objForm,valueStep, verificaLimiti,verificaLimitiDurata,verificaLimitiDurata2);
                    },100);
                }).on('mouseup', function () {
                    clearInterval(pressTimerSimPrest); //clear time on mouseup
                });
            }
            
            
        },

        changeRange: function(obj,slider, txtbox, min, max, step, val, verificaPunteggiatura, verificaLimiti,verificaLimitiDurata,verificaLimitiDurata2) {
        
            if (eval(jqSimPrest(obj).attr('data-verificaPunteggiatura'))) {
                  parserXMLPrestito.SalvaValoreInizialeSimPrest(txtbox);
                  parserXMLPrestito.increaseSimPrestValueRange(obj, txtbox, verificaLimiti,verificaLimitiDurata,verificaLimitiDurata2);
                  parserXMLPrestito.SistemaPunteggiaturaSimPrest(txtbox);
                 
                  jqSimPrest(obj).unbind('change');
                  setTimeout(function(){
                    jqSimPrest(obj).bind('change',function(){
                    
                    parserXMLPrestito.changeRange(obj,slider, txtbox, min, max, step, val, verificaPunteggiatura, verificaLimiti,verificaLimitiDurata,verificaLimitiDurata2)
                    })
                  },400)
          }
                    
        
        },

        inizializzaSlider: function(slider, txtbox, min, max, step, val, verificaPunteggiatura, verificaLimiti,verificaLimitiDurata,verificaLimitiDurata2) {
            var timerSimPrest = true;
            var increaseSimPrest;
    
            jqSimPrest(slider).prev('.meno').attr('data-step',step*(-1));
            jqSimPrest(slider).next('.piu').attr('data-step',step);
            
            
            var el=jqSimPrest(slider).prev('.meno');
            var el2=jqSimPrest(slider).next('.piu');
            
            
            
            parserXMLPrestito.incrementaStart(el,txtbox, verificaLimiti,verificaLimitiDurata,verificaLimitiDurata2);
            parserXMLPrestito.incrementaStart(el2,txtbox, verificaLimiti,verificaLimitiDurata,verificaLimitiDurata2);
            
            
            
                
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
                                        parserXMLPrestito.SalvaValoreInizialeSimPrest(txtbox);
                                        
                                        
                                        
                                        parserXMLPrestito.increaseSimPrestValue(slider, txtbox, verificaLimiti,verificaLimitiDurata,verificaLimitiDurata2);
                                        parserXMLPrestito.SistemaPunteggiaturaSimPrest(txtbox);
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
                        
                        
                        
                         parserXMLPrestito.Reset();
                        parserXMLPrestito.SistemaPunteggiaturaSimPrest(txtbox);
                        
                        
                        if(verificaLimitiDurata||verificaLimitiDurata2){
                             parserXMLPrestito.SistemaMesi(txtbox);
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
            
                parserXMLPrestito.ImpostaDurata(jqSimPrest(slider).slider("value"), txtbox);
                
            } 
             else {
        
                if (!verificaPunteggiatura&&!verificaLimitiDurata2) {
                    parserXMLPrestito.ImpostaValoreConPunteggiatura(jqSimPrest(slider).slider("value"), txtbox);
                }
            }
            
        
            
        },
        
        increaseSimPrestValue: function(slider, txtbox, verificaLimiti,verificaLimitiDurata,verificaLimitiDurata2) {
        
            var valoreIniziale = parseInt(parserXMLPrestito.togliPunti(txtbox));
            
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
        },

        resetValoreIniziale: function (txtbox, valore) {
            parserXMLPrestito.ImpostaValoreConPunteggiatura(valore, txtbox);
            parserXMLPrestito.ImpostaDurata(valore, txtbox);
        },
        
        clickBottone: function(button) {
            jqSimPrest(button).click();
        },
        
        SistemaPunteggiaturaSimPrest: function(txtbox) {
        
            var valoreCorrente = jqSimPrest(txtbox).val();
        
            if (valoreStartSimPrest == valoreCorrente) return;
            //var num = valoreCorrente.replace(/\./g, "").replace(/\,/g, "");
            var num = valoreCorrente.replace(/\D/g, ""); //solo caratteri numerici
            valoreCorrente = num.replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1.");
            
            jqSimPrest(txtbox).next().val(parseInt(parserXMLPrestito.togliPunti(jqSimPrest(txtbox)), 10));
            jqSimPrest(txtbox).val(valoreCorrente);
        },

        SistemaMesi: function(txtbox) {
        
            var valoreCorrente = jqSimPrest(txtbox).val();
        
            if (valoreStartSimPrest == valoreCorrente) return;
            var num = parseInt(valoreCorrente); 
            jqSimPrest(txtbox).next().val(parseInt(parserXMLPrestito.togliPunti(jqSimPrest(txtbox)), 10));
            jqSimPrest(txtbox).val(valoreCorrente);
        },
        
        SistemaPunteggiaturaSimPrestText: function(txt) {
        
            var valoreCorrente = txt.toString();
            var decimali='';
            if(valoreCorrente.indexOf('.')!=-1){
            
                decimali=','+valoreCorrente.substring(valoreCorrente.indexOf('.')+1,valoreCorrente.length);
                valoreCorrente=valoreCorrente.substring(0,valoreCorrente.indexOf('.'));
                
            }
        
            var num = valoreCorrente.replace(/\D/g, ""); //solo caratteri numerici
            valoreCorrente = num.replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1.")+decimali;
            return valoreCorrente;
        },
        
        SalvaValoreInizialeSimPrest: function(txtbox) {
            parserXMLPrestito.Reset();
            valoreStartSimPrest = jqSimPrest(txtbox).val();
        },
        
        ArrotondaValore: function(txtbox, multiplo) {
            var valore = parserXMLPrestito.togliPunti(txtbox);
            var nuovaValore = parserXMLPrestito.Arrotonda(valore, multiplo);
            parserXMLPrestito.ImpostaValoreConPunteggiatura(nuovaValore, txtbox);
        },
        
        Arrotonda: function(valore, multiplo) {
            return Math.round(valore / multiplo) * multiplo;
        },

        Reset: function() {
            jqSimPrest('#accordionSimPrest').html('');
            jqSimPrest('#actPlanPrest,#actPlanPrest2').html('');
        },
        
        SalvaValoreIniziale: function(input) {
            valoreStartSimPrest = input.value;
        },
        
        SistemaPunteggiatura: function(input) {
        
            var valoreCorrente = input.value;
        
            if (valoreStartSimPrest == valoreCorrente) return;
        
            var posIniziale = parserXMLPrestito.getPosizioneCursor(input);
            var lenIniziale = valoreCorrente.length;
        
            //var num = valoreCorrente.replace(/\./g, "").replace(/\,/g, "");
            var num = valoreCorrente.replace(/\D/g, ""); //solo caratteri numerici
            valoreCorrente = num.replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1.");
            input.value = valoreCorrente;
    
        
            parserXMLPrestito.setPosizioneCursor(input, posIniziale + (valoreCorrente.length - lenIniziale));
        },

        TrimStartZero: function(input) {
            while (input.value.substr(0, 1) == "0" || input.value.substr(0, 1) == ".") {
                if (input.value.length > 1) {
                    input.value = input.value.substr(1, input.value.length - 1)
                } else {
                    input.value = "";
                }
            }
        },
        
        SistemaData: function(input) {
        
            var valoreCorrente = input.value;
        
            if (valoreStartSimPrest == valoreCorrente) return;
        
            var posIniziale = parserXMLPrestito.getPosizioneCursor(input);
            var lenIniziale = valoreCorrente.length;
        
            var num = valoreCorrente.replace(/\D/g, ""); //solo caratteri numerici
        
            var giornoMese = num.length >= 4 ? num.substr(0, 4) : num;
            giornoMese = giornoMese.replace(/(\d)(?=(\d{2})+(?!\d))/g, "jqSimPrest1/");
        
            var anno = num.length >= 4 ? num.substr(4, num.length - 4) : '';
            var separatoreAnno = anno == '' ? '' : '/';
        
            valoreCorrente = giornoMese + separatoreAnno + anno;
            input.value = valoreCorrente;
        
            parserXMLPrestito.setPosizioneCursor(input, posIniziale + (valoreCorrente.length - lenIniziale));
        },
        
        SistemaDataOnBlur: function(input) {
            //metodo nel validazioni.js
            if (!validaData(input)) {
                input.value = '';
            }
        },
        
        getPosizioneCursor: function(input) {
        
            var textLength = input.value.length;
        
            if (input.createTextRange && document.selection) {
                //IE <= 9
                var range = document.selection.createRange().duplicate();     
                range.moveStart('character', -textLength);
                return range.text.length;
            }
            else {
                //Non IE + IE > 9
                return input.selectionStart;
            }
        },
        
        setPosizioneCursor: function(input, posizione) {
        
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
        },
        
        findRange: function(nodeName,parent){
            // funzione per la memorizzazione e la normalizzazione delle soglie
            var values=[];
            
            
            jqSimPrest(nodeName,parent).find('range').each(function(i,el){
                var range={}
                
                parserXMLPrestito.addType(range,el);
                
                range.type =jqSimPrest(el).attr('type');
                range.rangeValues=[];
                
                if(jqSimPrest(el).children('rangeMatrix').size()!=0){
                    jqSimPrest(el).children('rangeMatrix').each(function(i2,el2){
                        var nodeValue2=parserXMLPrestito.detectMatrix(jqSimPrest(el2));
                        range.rangeValues.push(nodeValue2);
                    })
                }
                
                jqSimPrest(el).children('rangeValue,rangeFunct').each(function(i2,el2){
                    var nodeValue;
                    // se il valore e' un numero
                    if(jqSimPrest(el2).prop("nodeName")=='rangeValue'){
                        nodeValue=jqSimPrest(el2).attr('fixed');
                        
                        if (jqSimPrest(el2).attr('perc')!=null){
                            // se e' in percentuale aggiungo "%"
                            nodeValue=jqSimPrest(el2).attr('perc').replace(',','.')+'%';
                            nodeValue=nodeValue.replace(',','.');
                        } else if (jqSimPrest(el2).attr('string')!=null){
                            
                            nodeValue=jqSimPrest(el2).attr('string');
                            
                        } else {
                            nodeValue=nodeValue.replace(',','.');
                        }
                        
                    } else{
                        // se il valore e' un ulteriore confronto
                        nodeValue={};
                        nodeValue.type=jqSimPrest(el2).attr('type');
                        nodeValue.rangeValues=[];
                        // ciclo i valori del nuovo confronto
                        jqSimPrest(el2).children('rangeValue,rangeFunct').each(function(i3,el3){
                            var nodeValue2;
                            nodeValue2=jqSimPrest(el3).attr('fixed');
                            if (jqSimPrest(el3).attr('perc')!=null){
                                // se e' in percentuale aggiungo "%"
                                nodeValue2=jqSimPrest(el3).attr('perc').replace(',','.')+'%';
                            } else if (jqSimPrest(el2).attr('string')!=null){
                                
                                nodeValue2=jqSimPrest(el3).attr('string');
                            
                            }else {
                                nodeValue2=nodeValue2.replace(',','.');
                            }
                            nodeValue.rangeValues.push(nodeValue2);
                        })
                    }
                    
                    range.rangeValues.push(nodeValue);
                })
            
                values.push(range);
                
            });
            
            return values;
        },

        detectMatrix: function detectMatrix(el){
            var nodeValue={};
            nodeValue.type=jqSimPrest(el).attr('type');
            nodeValue.matrix=true;
            nodeValue.rangeValues=[];
            parserXMLPrestito.addType(nodeValue,el);
        
            jqSimPrest(el).children('rangeValue,rangeMatrix').each(function(i2,el2){
                if(jqSimPrest(el2).prop("nodeName")=='rangeValue'){
                    var nodeValue2;
                    nodeValue2=jqSimPrest(el2).attr('fixed');
                    if (jqSimPrest(el2).attr('perc')!=null){
                        // se e' in percentuale aggiungo "%"
                        nodeValue2=jqSimPrest(el2).attr('perc').replace(',','.')+'%';
                    }
                    nodeValue2=nodeValue2.replace(',','.');
                    nodeValue.rangeValues.push(nodeValue2);
                } else {
                    var nodeValue2=parserXMLPrestito.detectMatrix(jqSimPrest(el2));
                    nodeValue.rangeValues.push(nodeValue2);
                    
                    
                }
            })
        

            return nodeValue;
        
        },

        addType: function addType(obj,el){
            if(jqSimPrest(el).attr('amount')!=null) {
                obj.amount =Number(jqSimPrest(el).attr('amount'));
                if(obj.amount==''){
                    // setto un numero altisSimPresto per creare il default
                    obj.amount=100000000000000;
                }
            }
            
            if(jqSimPrest(el).attr('reddito')!=null) {
                obj.reddito =Number(jqSimPrest(el).attr('reddito'));
                if(obj.reddito==''){
                    // setto un numero altisSimPresto per creare il default
                    obj.reddito=100000000000000;
                }
            }
            
            if(jqSimPrest(el).attr('durata')!=null) {
                obj.durata =Number(jqSimPrest(el).attr('durata'));
                if(obj.durata==''){
                    // setto un numero altisSimPresto per creare il default
                    obj.durata=100000000000000;
                }
            }
            if(jqSimPrest(el).attr('ltype')!=null) {
                obj.ltype =Number(jqSimPrest(el).attr('ltype'));
                // setto 0 per creare il default
                if(obj.ltype==''){
                    obj.ltype=0;
                }
            }
            if(jqSimPrest(el).attr('eta')!=null) {
                obj.eta =Number(jqSimPrest(el).attr('eta'));
                // setto 0 per creare il default
                if(obj.eta==''){
                    obj.eta=100000000000000;
                }
            }
            if(jqSimPrest(el).attr('importo')!=null) {
                obj.importo =Number(jqSimPrest(el).attr('importo').replace(',','.'));
                // setto 0 per creare il default
                if(obj.importo==''){
                    obj.importo=100000000000000;
                }
            }
        
        
        },

        getContent: function content(){
            var jsonContent = this.config.content.getObj();
        }
    }
}());


     
       
       
        


// estensione per calcolo giorni del mese
Date.prototype.monthDays= function(){
    var d= new Date(this.getFullYear(), this.getMonth()+1, 0);
    return d.getDate();
}

jqSimPrest(window).resize(function(){
    parserXMLPrestito.resizeIframeSimPrest();
    resizeBg();
});





jqSimPrest(function ready() {
    parserXMLPrestito.init();
    
    if(activeAnimPrest){
        jqSimPrest('#come-backPrest,#come-backPrest2').click(function (e) {
            e.preventDefault();
            
            ga('send', 'event', 'Prestiti', 'cambia dati', 'cambia dati');
            jqSimPrest('.SimPrest-container-step-2' ).hide("slide", { direction: "right" }, 500);
            jqSimPrest('.SimPrest-container-step-1').delay(500).show("slide", { direction: "right" }, 500);
            jqSimPrest("#SimPrest-background").removeClass('blurred').addClass('no-blurred');
        });
    }

    
    jqSimPrest('#cboFinalitaPrest').change(function(e){
        e.preventDefault();
        var val=jqSimPrest(this).val();
        var valueFin=(jqSimPrest('#cboFinalitaPrest option[value='+val+']').attr('title'));
        ga('send', 'event', 'Prestiti', 'finalita', valueFin);

    });
    
    // setto l'input hidden con il radio selezionato
    jqSimPrest('.SimPrest-years-point').click(function () {
        var yearsChecked = jqSimPrest('input[name=radio]:checked', '.SimPrest-years-points').val();
        jqSimPrest('input[name=radio]').parents('.SimPrest-years-point').removeClass('SimPrestactive');
        
        jqSimPrest('input[name=radio]:checked').parents('.SimPrest-years-point').addClass('SimPrestactive');
        jqSimPrest('.SimPrest-years-points input[name=cboDurataPrest]').val(yearsChecked);
        ga('send', 'event', 'Prestiti', 'durata finanziamento', yearsChecked);
        
        
    });
});

jqSimPrest.urlParamSimPrest = function(name){
    var results = new RegExp('[\?&]' + name + '=([^&#]*)').exec(window.location.href);
    if (results==null){
       return null;
    }
    else{
       return results[1] || 0;
    }
}


function resizeBg() {
                 var theWindow        = jqSimPrest('.SimPrest-container').eq(0),
                jqSimPrestbg              = jqSimPrest("#SimPrest-background img"),
                aspectRatio      = jqSimPrestbg.width() / jqSimPrestbg.height();
                
                if ( (theWindow.width() / theWindow.height()) < aspectRatio ) {
                    jqSimPrestbg
                        .removeClass('backgroundwidth').removeClass('backgroundheight').addClass('backgroundheight');
                } else {
                    jqSimPrestbg
                        .removeClass('backgroundwidth').removeClass('backgroundheight').addClass('backgroundwidth');
                }
                if ( theWindow.width() < 769 ) {
                    jqSimPrest("#SimPrest-background").addClass('blurred');
                }
            }
            
if (typeof Element.prototype.addEventListener === 'undefined') {
    Element.prototype.addEventListener = function (e, callback) {
      e = 'on' + e;
      return this.attachEvent(e, callback);
    };
  }         