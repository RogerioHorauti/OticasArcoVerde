/**
 * @NApiVersion 2.x
 * @NScriptType Suitelet
 */

define([
   'N/record',
   'N/task',
   'N/search',
   'N/file',
   'N/render',
   'N/action',
   'N/cache',
   'N/format',
   'N/runtime',
   'N/config',
   'N/url',
   'N/xml',
   'N/https'
],

   function (
      record,
      task,
      search,
      file,
      render,
      action,
      cache,
      format,
      runtime,
      config,
      url,
      xml,
      https
      
   ) {

      function onRequest(context) {

         printReport(context);

      }

      function printReport(context){

         var response = context.response;

         var inciar = context.request.parameters['iniciar'];
         var installmentQty = context.request.parameters['installmentQty'];
         log.debug('installmentQty',installmentQty);
         // var listItem = runtime.getCurrentScript().getParameter({name: 'custscript_oav_listitem'})

         var rec = record.load({
            type: 'scriptdeployment',
            id: '7159'
         });

         var listItem = rec.getValue({
            fieldId: 'custscript_oav_listitem'
         });
         
         listItem = JSON.parse(listItem);
		   log.debug('listItem',listItem);
         var layout = file.load("../Relatorios/custtmpl_oav_resultprintlabelsdisplaysotres.html");

         var renderer = new render.create();
         renderer.templateContent = layout.getContents();

         ////////////////////////////////////////////////////////////////////////////////////////////////////

         var qtyOfInvisibleCells = inciar;
         var objToRender = {};

         objToRender.arrayDataToRender = [];

         for(var count = 0; count < qtyOfInvisibleCells; count++){

            objToRender.arrayDataToRender.push(createStandardObjs());

         }

         ////////////////////////////////////////////////////////////////////////////////////////////////////
         listItem.forEach(function(itemObj){
            
            var objTesteOne = createStandardObjs();

            objTesteOne.visible = true;
            objTesteOne.description = itemObj.item;
            //objTesteOne.description = objTesteOne.description.toLocaleLowerCase();
            objTesteOne.description = objTesteOne.description.replace(/\&/g, '&amp;');
            objTesteOne.description = objTesteOne.description.replace(/\n/g, '');
            objTesteOne.price =itemObj.salePrice;

            objTesteOne.installmentQty = installmentQty
            objTesteOne.installmentPrice = (itemObj.salePrice / objTesteOne.installmentQty).toFixed(2)

            // log.debug('objTesteOne.price',objTesteOne.price);
            objTesteOne.date = itemObj.date;
            // log.debug('objTesteOne.data',objTesteOne.data);
            objTesteOne.itemId = itemObj.barCode;
            objTesteOne.brand = itemObj.brand;
            objTesteOne.brand = objTesteOne.brand.replace(/\&/g, '&amp;');
            objTesteOne.materialOfManufacture = itemObj.material;
            objTesteOne.materialOfManufacture = objTesteOne.materialOfManufacture.replace(/\&/g, '&amp;');

            // var itemLookup = search.lookupFields({
            //    type: 'item',
            //    id: itemObj.barCode,
            //    columns: [
            //       'custitem_oav_dataultimorecebimento'
            //    ]
            // });

            objTesteOne.itemData = objTesteOne.date; //'25/11/2021';
            log.debug('objTesteOne',objTesteOne);
            objToRender.arrayDataToRender.push(objTesteOne);
            objToRender.arrayDataToRender.push(objTesteOne);
         });


         ////////////////////////////////////////////////////////////////////////////////////////////////////


         objToRender.qtyTotal = objToRender.arrayDataToRender.length;

         ////////////////////////////////////////////////////////////////////////////////////////////////////

         renderer.addCustomDataSource({
            format: render.DataSource.OBJECT,
            alias: "objToRender",
            data: objToRender
         });

         var pdfString = renderer.renderAsString();
         response.renderPdf({xmlString: pdfString});

      }

      function createStandardObjs(){

         var obj = {}

         obj.visible = false;
         obj.description = '';
         obj.price = '';
         obj.itemId = '';
         obj.brand = '';
         obj.materialOfManufacture = '';
         obj.date = '';
         obj.installmentQty = 0
         obj.installmentPrice = 0
         return obj;

      }

       return {
         onRequest: onRequest
      }

   });