/**
 *@NApiVersion 2.x
 *@NScriptType Suitelet
 */
define([
      'N/ui/serverWidget',
      'N/search',
      'N/url',
      'N/runtime',
      'N/format'
   ],
   function (
      serverWidget,
      search,
      url,
      runtime,
      _format
   ) {
      /**
       * Definition of the SuiteLet script trigger point.
       *
       * @param {Object} context
       * @param {ServerRequest} context.request - Encapsulation of the incoming request
       * @param {ServerResponse} context.response - Encapsulation of the SuiteLet response
       * @Since 2015.2
       */
      function onRequest(context) {
         log.debug({
            title: 'Parameters',
            details: context.request.parameters
         })
         var mode = context.request.parameters['mode'];
         log.debug({
            title: 'mode',
            details: mode
         });
         var _scriptObj = runtime.getCurrentScript();
         log.debug({
            title: '_scriptObj',
            details: _scriptObj
         });

         //*** Start Label Translation *******************************************************
         var lang = runtime.getCurrentUser().getPreference('LANGUAGE');

         var TITLEFORM = 'Exhibition Label Printing';
         var BUTTONFILTER = 'Filter';
         var BUTTONPRINT = 'Print out';
         //Labels da Sublista
         var RESULT = 'Results';
         var CHECKBOX = 'Mark';
         var BARCODE = 'Bar Code';
         var ITEM = 'Produto';
         var BRAND = 'Brand';
         var MATERIAL = 'Material';
         var SALEPRICE = 'Sale Price';
         var DATE = 'Date';
         if (lang == 'pt_BR') { //Portugues(Brasil)
            TITLEFORM = 'Impressão de Etiquetas Exposição';
            BUTTONFILTER = 'Filtrar';
            BUTTONPRINT = 'Imprimir';
            //Labels da Sublista
            RESULT = 'Resultados';
            CHECKBOX = 'Marcar';
            BARCODE = 'Código de Barras';
            ITEM = 'Produto';
            BRAND = 'Marca';
            MATERIAL = 'Material';
            SALEPRICE = 'Preço de Venda';
            DATE = 'Data';
         } else if (lang == 'es_ES') { //Espanol(Espana)
            TITLEFORM = 'Impresión de etiquetas de exposición';
            BUTTONFILTER = 'Filtrar';
            BUTTONPRINT = 'Imprimir';
            //Labels da Sublista
            RESULT = 'Resultados';
            CHECKBOX = 'Marcar';
            BARCODE = 'Código de Barras';
            ITEM = 'Produto';
            BRAND = 'Marca';
            MATERIAL = 'Material';
            SALEPRICE = 'Precio de Venta';
            DATE = 'Fecha';
         }
         //*** End Label Translation *******************************************************
         switch (context.request.method) {
            case 'GET':
               handleGet(context);
               break;
            case 'POST':
               handlePost(context);
               break;
            default:
               context.response.write({
                  output: "Metodo nao suportado: " + context.request.method
               })
         } 
         function handleGet(context) {
            var form = createformFilters(context)

            context.response.writePage(form);
         }

         function handlePost(context) {
            var form = createformFilters(context)
            form = createFormList(form)
            context.response.writePage(form);

         }
         //////Função para criar o formulario da Sublista////////
         function createFormList(form) {
            var parametersObj = getParameters(context);
            log.debug({title:'parametersObj',details:parametersObj});

            var ResultRecordsSublist = form.addSublist({
               id: 'sublist_resultrecords',
               // type: serverWidget.SublistType.INLINEEDITOR,  //STATICLIST,
               type: serverWidget.SublistType.LIST,
               label: RESULT
            });

            ResultRecordsSublist.addField({
               id: 'sublistfield_print',
               type: serverWidget.FieldType.CHECKBOX,
               label: CHECKBOX
            });

            ResultRecordsSublist.addField({
               id: 'sublistfield_barcode',
               type: serverWidget.FieldType.TEXT,
               label: BARCODE
            });

            ResultRecordsSublist.addField({
               id: 'sublistfield_item',
               type: serverWidget.FieldType.TEXT,
               label: ITEM
            });

            ResultRecordsSublist.addField({
               id: 'sublistfield_brand',
               type: serverWidget.FieldType.TEXT,
               label: BRAND
            });

            ResultRecordsSublist.addField({
               id: 'sublistfield_material',
               type: serverWidget.FieldType.TEXT,
               label: MATERIAL
            });

            ResultRecordsSublist.addField({
               id: 'sublistfield_saleprice',
               type: serverWidget.FieldType.TEXT,
               label: SALEPRICE
            });
            ResultRecordsSublist.addField({
               id: 'sublistfield_date',
               type: serverWidget.FieldType.DATE,
               label: DATE
            });

            ResultRecordsSublist.addMarkAllButtons();
            //////////////////////////////////////////////////////////////////////////////////////////////////
            if(parametersObj.tipo == "item"){
                  var filtersArray = [];

                  if (parametersObj.codBarras) { 
                     filtersArray.push( [ "internalid", "is", parametersObj.codBarras ] );
                  };

                  if (filtersArray.length > 0) {
                     filtersArray.push("AND");
                  }
                  filtersArray.push( ["type","anyof","InvtPart"] );
                  
                  if (parametersObj.produto) { 
                     if (filtersArray.length > 0) {
                        filtersArray.push("AND");
                     }
                     filtersArray.push( ["itemid","is", parametersObj.produto] );
                  };
                  if (parametersObj.marca) { 
                     if (filtersArray.length > 0) {
                        filtersArray.push("AND");
                     }
                     filtersArray.push( ["custitem_oav_marcadasarmacoeseoculos","anyof", parametersObj.marca] );
                  };
                  if (parametersObj.tipoArmacaoOlculos) { 
                     if (filtersArray.length > 0) {
                        filtersArray.push("AND");
                     }
                     filtersArray.push( ["custitem_oav_tipodearmacaoeoculos","anyof", parametersObj.tipoArmacaoOlculos] );
                  }

               var itemSearchObj = search.create({
                  type: "item",
                  filters:filtersArray,
                  columns:
                  [
                     search.createColumn({name: "internalid", label: "Código de Barras"}),
                     search.createColumn({name: "itemid",sort: search.Sort.ASC,label: "Produto"}),
                     search.createColumn({name: "custitem_oav_marcadasarmacoeseoculos", label: "Marca"}),
                     search.createColumn({name: "custitem_oav_materialdosoculos", label: "Material"}),
                     search.createColumn({name: "baseprice", label: "Preço de Venda"}),
                     search.createColumn({name: "created", label: "data da Criação"})
                     // search.createColumn({name: "lastmodifieddate", label: "data da última modificação"})
                  ]
               });
                     var pagedData = itemSearchObj.runPaged({pageSize:1000});
                     log.debug("pagedData result count",pagedData);
                     // for(var i=0; i < pagedData.pageRanges.length; i++){
                        // var currentPage = pagedData.fetch(i);

                        pagedData.pageRanges.forEach(function(pageRange){
                        var myPage = pagedData.fetch({index: pageRange.index});
                        // currentPage.data.forEach(function(result,line){
                        myPage.data.forEach(function(result,line){
                        var itemObj = {};
                        itemObj.barCode = result.getValue({name:'internalid'});
                        itemObj.produto = result.getValue({name:'itemid'});
                        itemObj.marca = result.getText({name:'custitem_oav_marcadasarmacoeseoculos'});
                        itemObj.material = result.getText({name:'custitem_oav_materialdosoculos'});
                        itemObj.saleprice = result.getValue({name:'baseprice'});
                        itemObj.date = parseAndFormatDateString(result.getValue({name:'created'}));
                        // itemObj.data = result.getValue({name:'lastmodifieddate'});
                        //carregando os campos da sublista
                        ResultRecordsSublist.setSublistValue({
                           id: 'sublistfield_print',
                           line: line,
                           value: 'T'
                        });
                        if(itemObj.barCode){
                           ResultRecordsSublist.setSublistValue({
                              id: 'sublistfield_barcode',
                              line: line,
                              value: itemObj.barCode
                           });
                        }
                        if(itemObj.produto){
                           ResultRecordsSublist.setSublistValue({
                              id: 'sublistfield_item',
                              line: line,
                              value: itemObj.produto
                           });
                        }
                        if(itemObj.marca){
                           ResultRecordsSublist.setSublistValue({
                              id: 'sublistfield_brand',
                              line: line,
                              value: itemObj.marca
                           });
                        }
                        if(itemObj.material){
                           ResultRecordsSublist.setSublistValue({
                              id: 'sublistfield_material',
                              line: line,
                              value: itemObj.material
                           });
                        }
                        if(itemObj.saleprice){
                           ResultRecordsSublist.setSublistValue({
                              id: 'sublistfield_saleprice',
                              line: line,
                              value: itemObj.saleprice
                           });
                        }
                        if(itemObj.date){
                           ResultRecordsSublist.setSublistValue({
                              id: 'sublistfield_date',
                              line: line,
                              value: itemObj.date
                           });
                        }

                           return true;
                     });
                     // }
                  });
            }else{
               var transacaoFiltersArray = [];

               if (parametersObj.notaFiscalNo) { 
                  transacaoFiltersArray.push( [ "custbody_sit_transaction_i_numero_nfe", "is", parametersObj.notaFiscalNo ] );
               };

               if (transacaoFiltersArray.length > 0) {
                  transacaoFiltersArray.push("AND");
               }
               transacaoFiltersArray.push( ["item.type","anyof","InvtPart"] );
               
               if (parametersObj.subsidiaria) { 
                  if (transacaoFiltersArray.length > 0) {
                     transacaoFiltersArray.push("AND");
                  }
                  transacaoFiltersArray.push( ["subsidiary","anyof", parametersObj.subsidiaria] );
               };
               if (parametersObj.marca) { 
                  if (transacaoFiltersArray.length > 0) {
                     transacaoFiltersArray.push("AND");
                  }
                  transacaoFiltersArray.push( ["item.custitem_oav_marcadasarmacoeseoculos","anyof", parametersObj.marca] );
               };
               if (parametersObj.dateDe && parametersObj.dateAte) { 
                  if (transacaoFiltersArray.length > 0) {
                     transacaoFiltersArray.push("AND");
                  }
                  transacaoFiltersArray.push(  ["trandate","within",parametersObj.dateDe, parametersObj.dateAte] );
               }

               log.debug({
                  title: 'transacaoFiltersArray',
                  details: transacaoFiltersArray
               });

               var transacaoSearchObj = search.create({
                  type: "vendorbill",
                  filters: transacaoFiltersArray,
                  columns:
                  [
                     search.createColumn({name: "internalid",join: "item",label: "Código de Barras"}),
                     search.createColumn({name: "custbody_sit_transaction_i_numero_nfe", label: "Nota Fiscal"}),
                     search.createColumn({name: "othervendor",join: "item",label: "Fornecedor"}),
                     search.createColumn({name: "itemid",join: "item",label: "Produto"}),
                     search.createColumn({name: "custitem_oav_marcadasarmacoeseoculos",join: "item",label: "Marca"}),
                     search.createColumn({name: "custitem_oav_materialdosoculos",join: "item",label: "Material"}),
                     search.createColumn({name: "baseprice",join: "item",label: "Preço de venda"}),
                     search.createColumn({name: "trandate",sort: search.Sort.ASC,label: "Data"}),
                     search.createColumn({name: "subsidiary", label: "Subsidiária"})
                  ]
               });
               var pagedData = transacaoSearchObj.runPaged({pageSize:1000});
               log.debug("pagedData result count",pagedData);
               // for(var i=0; i < pagedData.pageRanges.length; i++){
                  // var currentPage = pagedData.fetch(i);

                  pagedData.pageRanges.forEach(function(pageRange){
                  var myPage = pagedData.fetch({index: pageRange.index});
                  // currentPage.data.forEach(function(result,line){
                  myPage.data.forEach(function(result,line){
                  var transacaoObj = {};
                  transacaoObj.barCode = result.getValue({name:'internalid',join: "item"});
                  transacaoObj.produto = result.getValue({name:'itemid',join: "item"});
                  transacaoObj.marca = result.getText({name:'custitem_oav_marcadasarmacoeseoculos',join: "item"});
                  transacaoObj.material = result.getText({name:'custitem_oav_materialdosoculos',join: "item"});
                  transacaoObj.saleprice = result.getValue({name:'baseprice',join: "item"});
                  transacaoObj.date = parseAndFormatDateString(result.getValue({name:'trandate'}));
                  log.debug({
                     title: 'transacaoObj',
                     details: transacaoObj
                  });
                  //carregando os campos da sublista
                  ResultRecordsSublist.setSublistValue({
                     id: 'sublistfield_print',
                     line: line,
                     value: 'T'
                  });
                  if(transacaoObj.barCode){
                     ResultRecordsSublist.setSublistValue({
                        id: 'sublistfield_barcode',
                        line: line,
                        value: transacaoObj.barCode
                     });
                  }
                  if(transacaoObj.produto){
                     ResultRecordsSublist.setSublistValue({
                        id: 'sublistfield_item',
                        line: line,
                        value: transacaoObj.produto
                     });
                  }
                  if(transacaoObj.marca){
                     ResultRecordsSublist.setSublistValue({
                        id: 'sublistfield_brand',
                        line: line,
                        value: transacaoObj.marca
                     });
                  }
                  if(transacaoObj.material){
                     ResultRecordsSublist.setSublistValue({
                        id: 'sublistfield_material',
                        line: line,
                        value: transacaoObj.material
                     });
                  }
                  if(transacaoObj.saleprice){
                     ResultRecordsSublist.setSublistValue({
                        id: 'sublistfield_saleprice',
                        line: line,
                        value: transacaoObj.saleprice
                     });
                  }
                  if(transacaoObj.date){
                     ResultRecordsSublist.setSublistValue({
                        id: 'sublistfield_date',
                        line: line,
                        value: transacaoObj.date
                     });
                  }

                     return true;
                  });
               // }
               });
            }

            return form
         }
         //////Função para criar o formulario dos filtros////////
         function createformFilters(context) {

            var parametersObj = getParameters(context);
            log.debug({title:'parametersObj',details:parametersObj});

            var form = serverWidget.createForm({
               title: TITLEFORM
            });
            form.clientScriptModulePath = './ClientScript_PrintLabelsDisplaySstores.js';
            //////////////////////////////////////////////////////////////////////////////////////////////////
            form.addButton({
               id: 'button_print',
               label: BUTTONPRINT,
               functionName: 'print'
            });
            //////////////////////////////////////////////////////////////////////////////////////////////////
            //Campo tipo de opção de filtro 
            var type_field = form.addField({
               id: 'custpage_type',
               type: serverWidget.FieldType.SELECT,
               label: 'TIPO'
               // source:'customrecord_mts_fiscaldoctype'
            });
            type_field.isMandatory = true;
            //Campo da transação 
            var dateDe = form.addField({
               id: 'custpage_date_de',
               type: serverWidget.FieldType.DATE,
               label: 'DATA DE:'
            });

            //Campo da transação 
            var dateAte = form.addField({
               id: 'custpage_date_ate',
               type: serverWidget.FieldType.DATE,
               label: 'DATA ATÉ:'
            });
            var typeValue = parametersObj.tipo||'Selecione';
            log.debug({title:'typeValue',details:typeValue});
            type_field.addSelectOption({
               value: 'Selecione',
               text: 'Selecione um tipo'
            });

            type_field.addSelectOption({
               value: 'item',
               text: 'Item'
            });
            type_field.addSelectOption({
               value: 'transacao',
               text: 'Transação'
            }); 
            //Campo do Item
            var codBarras = form.addField({
               id: 'custpage_cod_barras',
               type: serverWidget.FieldType.SELECT,
               label: 'CÓDIGO DE BARRAS'
            });
            codBarras.addSelectOption({
               value: '',
               // line: count,
               text: 'Selecione'
            });
            //Campo do Item 
            var produto = form.addField({
               id: 'custpage_produto',
               type: serverWidget.FieldType.TEXT,
               label: 'PRODUTO'
            });
            //Campo da transação 
            var subsidiaria = form.addField({
               id: 'custpage_subsidiaria',
               type: serverWidget.FieldType.SELECT,
               label: 'SUBSIDIÁRIA'

            });
            // subsidiaria.isMandatory = true;
            subsidiaria.addSelectOption({
               value: '',
               // line: count,
               text: 'Selecione'
            });
            //Campo da transação
            var notaFiscalNo = form.addField({
               id: 'custpage_nota_fiscal_no',
               type: serverWidget.FieldType.TEXT,
               label: 'NUMERO NOTA FISCAL'
            });
            var marca = form.addField({
               id: 'custpage_marca',
               type: serverWidget.FieldType.SELECT,
               label: 'MARCA',
               source: 'customlist_oav_marcaarmacoeseoculos'
            });
            //Campo do Item 
            var tipoArmacaoOlculos = form.addField({
               id: 'custpage_tipo_armacao_oculos',
               type: serverWidget.FieldType.MULTISELECT,
               label: 'TIPO DE ARMAÇÃO E ÓCULOS',
               source: 'customlist_oav_tiposarmacoeseoculos'
            });

            //Campo da transação e Item 
            var inicioEm = form.addField({
               id: 'custpage_inicio_em',
               type: serverWidget.FieldType.INTEGER,
               label: 'INICIO EM'
            });
            form.updateDefaultValues({
               "custpage_type":typeValue,
               "custpage_cod_barras":parametersObj.codBarras,
               "custpage_produto": parametersObj.produto,
               "custpage_tipo_armacao_oculos":parametersObj.tipoArmacaoOlculos,
               "custpage_marca":parametersObj.marca,
               "custpage_nota_fiscal_no":parametersObj.notaFiscalNo,
               "custpage_subsidiaria":parametersObj.subsidiaria,
               "custpage_date_de":parametersObj.dateDe,
               "custpage_date_ate":parametersObj.dateAte,
               "custpage_inicio_em":parametersObj.inicioEm
            })

            var installmentQtyField = form.addField({
               id: 'custpage_installmentqty',
               type: serverWidget.FieldType.INTEGER,
               label: 'Quantidade de parcelamento'
            });
            installmentQtyField.defaultValue = 10

            // Busca para carregar as informações dos IDs do Item denominado Codigo Barras/////
            var itemSearchObj = search.create({
               type: "item",
               filters: [
                  ["custitem_oav_tipodearmacaoeoculos", "anyof", "1", "2", "5", "3", "4", "6"],
                  // "AND",
                  // ["transaction.mainline","is","T"],
                  // "AND",
                  // ["created", "within", "1/5/2018 12:00 manhã"]
               ],
               columns: [
                  search.createColumn({
                     name: "created",
                     label: "Data de criação"
                  }),
                  search.createColumn({
                     name: "internalid",
                     sort: search.Sort.ASC,
                     label: "Código de barras"
                  }),
                  search.createColumn({
                     name: "itemid",
                     sort: search.Sort.ASC,
                     label: "Produto"
                  }),
                  search.createColumn({
                     name: "custitem_oav_marcadasarmacoeseoculos",
                     label: "Marca"
                  }),
                  search.createColumn({
                     name: "custitem_oav_materialdosoculos",
                     label: "Material"
                  }),
                  search.createColumn({
                     name: "custitem_oav_tipodearmacaoeoculos",
                     label: "Tipo de armação e óculos"
                  }),
                  search.createColumn({
                     name: "baseprice",
                     label: "Preço de venda"
                  })
               ]
            });
            var itemRecordsSearchData = itemSearchObj.runPaged();
            // log.debug("itemRecordsSearchData result count", itemRecordsSearchData);
            itemRecordsSearchData.pageRanges.forEach(function(pageRange){
               var myPage = itemRecordsSearchData.fetch({index: pageRange.index});
               myPage.data.forEach(function(result,count){

            // itemSearchObj.run().each(function (result) {
               var objItem = {};
               objItem.codigoBarras = result.getValue({
                  name: 'internalid'
               });
               objItem.produto = result.getValue({
                  name: 'itemid'
               });
               codBarras.addSelectOption({
                  id:'custpage_cod_barras',
                  line:count,
                  value: objItem.codigoBarras,
                  text: objItem.codigoBarras
               });
               return true;
            });
         });
         //Busca para carregar as informações da Subsidiária//////
            var subsidiarySearchObj = search.create({
               type: "subsidiary",
               filters:
               [
               ],
               columns:
               [
                  search.createColumn({name: "name",sort: search.Sort.ASC, label: "Nome"}),
                  search.createColumn({name: "city", label: "Cidade"}),
                  search.createColumn({name: "state", label: "Estado/município"}),
                  search.createColumn({name: "country", label: "País"}),
                  search.createColumn({name: "currency", label: "Moeda"}),
                  search.createColumn({name: "internalid", label: "ID"})
               ]
            });
            var searchResultCount = subsidiarySearchObj.runPaged().count;
            log.debug("subsidiarySearchObj result count",searchResultCount);
            subsidiarySearchObj.run().each(function(result,count){
            var subsidiariaResult = result.getValue({
               name:'name'
            });
            var subsidiariaId = result.getValue({
               name:'internalid'
            });
            subsidiaria.addSelectOption({
               id:'custpage_subsidiaria',
               line:count,
               value: subsidiariaId,
               text: subsidiariaResult
            });
               return true;
            });
            //////////////////////////////////////////////////////////////////////////////////////////////////
            form.addSubmitButton({
               id: 'button_filter',
               label: BUTTONFILTER,
            });
            ////////////////////////////////////////////////////////////////////////////////////////////////////

            return form;

         }
         ////Função para os parametros/////////////
         function getParameters(context){
            //Campos do Item
            var codBarras = context.request.parameters['custpage_cod_barras'];
            log.debug({title: 'codBarras',details: codBarras});

            var produto = context.request.parameters['custpage_produto'];
            var tipoArmacaoOlculos = context.request.parameters['custpage_tipo_armacao_oculos'];
            tipoArmacaoOlculos = tipoArmacaoOlculos?tipoArmacaoOlculos.split('\u0005'):'' ;//esse \u0005 representa esse caracter especial --> 
            log.debug({ title: 'tipoArmacaoOlculos',details: tipoArmacaoOlculos});

            //Campos da transação
            var notaFiscalNo = context.request.parameters['custpage_nota_fiscal_no'];
            var subsidiaria = context.request.parameters['custpage_subsidiaria'];
            var dateDe = context.request.parameters['custpage_date_de'];
            var dateAte = context.request.parameters['custpage_date_ate'];

            //Campo do Item e Transação
            var tipo = context.request.parameters['custpage_type'];
            var marca = context.request.parameters['custpage_marca'];
            var inicioEm = context.request.parameters['custpage_inicio_em'];

            return {
               codBarras:codBarras,
               produto:produto,
               tipoArmacaoOlculos:tipoArmacaoOlculos,
               notaFiscalNo:notaFiscalNo,
               subsidiaria:subsidiaria,
               dateDe:dateDe,
               dateAte:dateAte,
               tipo:tipo,
               marca:marca,
               inicioEm:inicioEm
            }
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

   }

   return {
      onRequest: onRequest
   }
   });