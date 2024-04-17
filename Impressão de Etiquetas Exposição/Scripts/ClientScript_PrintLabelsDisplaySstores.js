/**
 *@NApiVersion 2.x
 *@NScriptType ClientScript
 */
define([
      'N/currentRecord',
      'N/http',
      'N/url',
      'N/runtime',
      'N/record',
      'N/format'
   ],
   function (
      currentRecord,
      http,
      url,
      runtime,
      record,
      _format
   ) {

      function pageInit(context) {
         var currentRecord = context.currentRecord;
         var mode = context.mode;
         var tipo = currentRecord.getValue({
            fieldId: 'custpage_type'
         });
         console.log(mode);
         diplayFields(currentRecord);

      }

      function saveRecord(context) {

         var currentRecord = context.currentRecord;
 
         var tipo = currentRecord.getValue({
            fieldId: 'custpage_type'
         });

         var codBarras = currentRecord.getValue({
            fieldId:'custpage_cod_barras'
         });

         var produto = currentRecord.getValue({
            fieldId:'custpage_produto'
         });

         var tipoArmacaoOlculos = currentRecord.getValue({
            fieldId:'custpage_tipo_armacao_oculos'
         });

         var notaFiscalNo = currentRecord.getValue({
            fieldId: 'custpage_nota_fiscal_no'
         });
         var subsidiaria = currentRecord.getValue({
            fieldId: 'custpage_subsidiaria'
         });
         var dataDe = currentRecord.getValue({
            fieldId: 'custpage_date_de'
         });
         var dataAte = currentRecord.getValue({
            fieldId: 'custpage_date_ate'
         });
         var marca = currentRecord.getValue({
            fieldId: 'custpage_marca'
         });

         if (tipo == 'Selecione') {
            alert("Selecione um tipo de filtro.");
            return false;
         }
         if (tipo == 'transacao') {

            if (!dataDe) {
               alert("Campo Data De é obrigatorio.");
               return false;
            }
            if (!dataAte) {
               alert("Campo Data Até é obrigatorio.");
               return false;
            }

            if (!marca && !notaFiscalNo && !subsidiaria) {
               alert("É obrigatorio preencher Marca ou Nº Nota Fiscal ou Subsidiária");
               return false;
            }
            
         }else{
            if(!codBarras && !produto && tipoArmacaoOlculos[0] == "" && !marca){
               alert("Voce deve selecionar ao menos um filtro.");
               return false;
            }
         }
         return true;
      }

      function validateField(context) {
         return true;
      }

      function fieldChanged(context) {
         var currentRecord = context.currentRecord;
         var fieldId = context.fieldId;

         diplayFields(currentRecord, fieldId);
      }

      function diplayFields(currentRecord, fieldId) {
         var fieldValue = currentRecord.getValue({
            fieldId: fieldId || 'custpage_type'
         });

         //Campo do Item
         var codBarraField = currentRecord.getField({
            fieldId: 'custpage_cod_barras'
         });
         //Campo do Item
         var produtoField = currentRecord.getField({
            fieldId: 'custpage_produto'
         });
         //Campo do Item
         var tipoArmacaoOculosField = currentRecord.getField({
            fieldId: 'custpage_tipo_armacao_oculos'
         });
         //Campo do Item e Transação
         var marcaField = currentRecord.getField({
            fieldId: 'custpage_marca'
         });
         //Campo da Transação
         var notaFiscalNo = currentRecord.getField({
            fieldId: 'custpage_nota_fiscal_no'
         });
         //Campo da Transação
         var subsidiaria = currentRecord.getField({
            fieldId: 'custpage_subsidiaria'
         });
         //Campo da Transação
         var dataDe = currentRecord.getField({
            fieldId: 'custpage_date_de'
         });
         //Campo da Transação
         var dataAte = currentRecord.getField({
            fieldId: 'custpage_date_ate'
         });
         var inicioEmField = currentRecord.getField({
            fieldId: 'custpage_inicio_em'
         });
         // var sublistResultFields = currentRecord.getSublistFields({
         //    sublistId: 'sublist_resultrecords'
         // });
         if (fieldValue === 'Selecione') {
            codBarraField.isDisplay = false;
            produtoField.isDisplay = false;
            tipoArmacaoOculosField.isDisplay = false;
            notaFiscalNo.isDisplay = false;
            subsidiaria.isDisplay = false;
            dataDe.isDisplay = false;
            dataAte.isDisplay = false;
            marcaField.isDisplay = false;
            inicioEmField.isDisplay = false;

         } else if (fieldValue === 'transacao') {
            //campos visiveis
            codBarraField.isDisplay = false;
            produtoField.isDisplay = false;
            tipoArmacaoOculosField.isDisplay = false;
            notaFiscalNo.isDisplay = true;
            subsidiaria.isDisplay = true;
            dataDe.isDisplay = true;
            dataAte.isDisplay = true;
            marcaField.isDisplay = false;
            inicioEmField.isDisplay = true;
            //campos limpos
            currentRecord.setValue({
               fieldId: 'custpage_cod_barras',
               value: ''
            });
            currentRecord.setValue({
               fieldId: 'custpage_produto',
               value: ''
            });
            currentRecord.setValue({
               fieldId: 'custpage_tipo_armacao_oculos',
               value: ''
            });
            currentRecord.setValue({
               fieldId: 'custpage_nota_fiscal_no',
               value: ''
            });
            currentRecord.setValue({
               fieldId: 'custpage_subsidiaria',
               value: ''
            });
            currentRecord.setValue({
               fieldId: 'custpage_date_de',
               value: ''
            });
            currentRecord.setValue({
               fieldId: 'custpage_date_ate',
               value: ''
            });
            currentRecord.setValue({
               fieldId: 'custpage_marca',
               value: ''
            });
            currentRecord.setValue({
               fieldId: 'custpage_inicio_em',
               value: ''
            });

            var listResult = currentRecord.getLineCount({
               sublistId: 'sublist_resultrecords'
            });
            if (listResult) {
               for (var int = 0; int < listResult; int++) {
                  currentRecord.removeLine({
                     sublistId: 'sublist_resultrecords',
                     line: int,
                     ignoreRecalc: true
                  });
               }


            }

         } else if (fieldValue === 'item') {
            //campos visiveis
            codBarraField.isDisplay = true;
            produtoField.isDisplay = true;
            tipoArmacaoOculosField.isDisplay = true;
            notaFiscalNo.isDisplay = false;
            subsidiaria.isDisplay = false;
            dataDe.isDisplay = false;
            dataAte.isDisplay = false;
            marcaField.isDisplay = true;
            inicioEmField.isDisplay = true;
            //campos limpos
            currentRecord.setValue({
               fieldId: 'custpage_cod_barras',
               value: ''
            });
            currentRecord.setValue({
               fieldId: 'custpage_produto',
               value: ''
            });
            currentRecord.setValue({
               fieldId: 'custpage_tipo_armacao_oculos',
               value: ''
            });
            currentRecord.setValue({
               fieldId: 'custpage_nota_fiscal_no',
               value: ''
            });
            currentRecord.setValue({
               fieldId: 'custpage_subsidiaria',
               value: ''
            });
            currentRecord.setValue({
               fieldId: 'custpage_date_de',
               value: ''
            });
            currentRecord.setValue({
               fieldId: 'custpage_date_ate',
               value: ''
            });
            currentRecord.setValue({
               fieldId: 'custpage_marca',
               value: ''
            });
            currentRecord.setValue({
               fieldId: 'custpage_inicio_em',
               value: ''
            });

            var listResult = currentRecord.getLineCount({
               sublistId: 'sublist_resultrecords'
            });
            if (listResult) {
               for (var int = 0; int < listResult; int++) {
                  currentRecord.removeLine({
                     sublistId: 'sublist_resultrecords',
                     line: int,
                     ignoreRecalc: true
                  });
               }
 
            }

         }


      }

      function postSourcing(context) {

      }

      function lineInit(context) {

      }

      function validateDelete(context) {

      }

      function validateInsert(context) {
         return true;
      }

      function validateLine(context) {
         return true;
      }

      function sublistChanged(context) {

      }

      function print() {
        
         var currentRec = currentRecord.get();
         var lang = runtime.getCurrentUser().getPreference("LANGUAGE").toString();
         var inicioEM = currentRec.getValue({
            fieldId: 'custpage_inicio_em'
         });
         if (!inicioEM) {
            alert("Campo Inciar EM é obrigatorio");
            return false;
         }
         var checkedLinessArr = [];

         var listLinesResult = currentRec.getLineCount({
            sublistId: 'sublist_resultrecords'
         });

         for (var count = 0; count < listLinesResult; count++) {
            var checkbox = currentRec.getSublistValue({
               sublistId: 'sublist_resultrecords',
               fieldId: 'sublistfield_print',
               line: count
            });
            if (!checkbox) {
               continue;
            }
            var listResultObj = {};
            listResultObj.checkbox = checkbox;


            listResultObj.barCode = currentRec.getSublistValue({
               sublistId: 'sublist_resultrecords',
               fieldId: 'sublistfield_barcode',
               line: count
            });

            listResultObj.item = currentRec.getSublistValue({
               sublistId: 'sublist_resultrecords',
               fieldId: 'sublistfield_item',
               line: count
            });

            listResultObj.brand = currentRec.getSublistValue({
               sublistId: 'sublist_resultrecords',
               fieldId: 'sublistfield_brand',
               line: count
            });

            listResultObj.material = currentRec.getSublistValue({
               sublistId: 'sublist_resultrecords',
               fieldId: 'sublistfield_material',
               line: count
            });

            listResultObj.salePrice = currentRec.getSublistValue({
               sublistId: 'sublist_resultrecords',
               fieldId: 'sublistfield_saleprice',
               line: count
            });
            listResultObj.date = parseAndFormatDateString(currentRec.getSublistValue({
               sublistId: 'sublist_resultrecords',
               fieldId: 'sublistfield_date',
               line: count
            }));
            checkedLinessArr.push(listResultObj);

         }
         if (checkedLinessArr.length < 1) {

            if (lang == "pt_BR") {
               alert("Você deve selecionar pelo menos uma linha!");

            } else if (lang.match("es-*")) {
               alert("¡Debe seleccionar al menos una línea!");
            } else {
               alert("You must check at least one line!");
            }
            return false;
         }
         
         record.submitFields({
            type: 'scriptdeployment',
            id: 7159,
            values: {
               'custscript_oav_listitem': JSON.stringify(checkedLinessArr)
            },
         });

         var _url = url.resolveScript({ 
            scriptId: 'customscript_oav_sl_retprintdisplaystore',
             deploymentId: 1,
            //  returnExternalUrl: true,
            params: {
               // custscript_oav_listitem: JSON.stringify(checkedLinessArr),
               iniciar:inicioEM -1
            }
         });
         // var resp = http.post({
         //    url: _url,
         //    body: JSON.parse(checkedLinessArr)
         //    });
         // var respObj = (resp.body);
         // log.debug({title:'respObjArray', details:util.isArray(resp)});
         // log.debug({title:'respObjString', details:util.isString(resp)});
         // log.debug({title:'respObjObject', details:util.isObject(resp)});
         // console.log(resp);
         
         // var _response = http.post({ url: _url });
    		// _response = JSON.parse(_response.body);

         window.open(_url);
      }
      //***Função para formatação de data***/
      function parseAndFormatDateString(initialFormattedDateString) {
         // Assume Date format is MM/DD/YYYY
         // var initialFormattedDateString = "07/28/2015";
         var parsedDateStringAsRawDateObject = _format.parse({
            value: initialFormattedDateString,
            type: _format.Type.DATE
         });
         var dia = parsedDateStringAsRawDateObject.getDate()
         var mes = parsedDateStringAsRawDateObject.getMonth()
         var ano = parsedDateStringAsRawDateObject.getFullYear()
         if (dia < 10) {
            dia = "0" + dia
         }
         if (mes < 9) {
            mes = "0" + (mes + 1)
         } else {
            mes = (mes + 1)
         }

         return dia + "/" + mes + "/" + ano
      }

      return {
         pageInit: pageInit,
         print: print,
         saveRecord: saveRecord,
         validateField: validateField,
         fieldChanged: fieldChanged,
         postSourcing: postSourcing,
         lineInit: lineInit,
         validateDelete: validateDelete,
         validateInsert: validateInsert,
         validateLine: validateLine,
         sublistChanged: sublistChanged
      }
   });