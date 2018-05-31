$(function() {
    console.log('Hello World:Jeisson');
    //alert("hola");

    var listaActiva='';

    
    function scanear(){
        $('#query_docs').bind("DOMSubtreeModified",function(){
          if( $( "#query_docs a" ).length > 0 ){

            var informe={
                dep:$("#select_dep option:selected").text(),
                mpio:$("#mpio option:selected").text(),
                zona:$("#zona option:selected").text(),
                pto:$("#pto option:selected").text(),
                url:"",
                mesa:"",
                calificacion:0
            };

            console.log("dep: "+$("#select_dep option:selected").text());
            console.log("mpio: "+$("#mpio option:selected").text());
            console.log("zona: "+$("#zona option:selected").text());
            console.log("pto: "+$("#pto option:selected").text());
            
            var lista=[];
            $( "#query_docs a" ).each(function( i,element ) {
                console.log($(element).text()+": "+ $(element).attr("href"));
                var nuevo=informe;
                nuevo.url=$(element).attr("href");
                nuevo.mesa=$(element).text();
                lista.push(nuevo);
            });

            $.ajax({
                    url: 'https://us-central1-elecciones2018-f1737.cloudfunctions.net/guardar',
                    dataType: "json",
                    method: 'POST',
                    crossDomain: true,
                    data: {
                        lista: lista
                    },
                    success: function(data){
                      console.log('succes: '+data);
                    }
                  });


          }

        });
    }


    function terminar(){
        if (listaActiva=='#pto') {
            listaActiva='#zona';
            recorrer();
        }else if (listaActiva=='#zona') {
            listaActiva='#mpio';
            recorrer();
        }
    }


    function procesar(){

        if ($("#zona option:selected").text()!="SELECCIONE") {
            if (listaActiva=='#pto') {
                console.log("Procesando: zona: "+$("#zona option:selected").text() + " - Puesto: "+$("#pto option:selected").text());
                cargar_mesas();
                return true;
            }else if (listaActiva=='#zona'){
                console.log("Procesando: zona: "+$("#zona option:selected").text() + " - municipio: "+$("#mpio option:selected").text());
                cambiar_zona();
                listaActiva='#pto';
                trigger();
                return false;
            }else if (listaActiva=='#mpio'){
                console.log("Procesando: municipio: "+$("#mpio option:selected").text());
                seleccionar_mun();
                listaActiva='#zona';
                trigger();
                return false;
            }
        }else{
            recorrer();
        }

    }



    function recorrer(){
        if($(listaActiva+' option').size() > 0){
            $(listaActiva).find('option').get(0).remove();

            if($(listaActiva+' option').size() > 0){
               $(listaActiva+' option:first').attr('selected','selected');
                if (procesar()) {
                    setTimeout(recorrer, 3000);
                } 
            }else{
                terminar();
            }
        }else{
            console.log("Terminamos de recorrer la lista "+ listaActiva);
            terminar();
        }
    }

    function trigger(){
        $(listaActiva).bind("DOMSubtreeModified",function(){
            //console.log("ddr mesas modificado");
            if( $(listaActiva+' option').size() > 0 ){
                console.log("existen "+$(listaActiva+' option').size()+" elementos");
                $( listaActiva ).unbind();
                if (procesar()) {
                    setTimeout(recorrer, 3000);
                }
            }
        });
    }



    var r= $('<div class="the-box no-border property-list text-center"><button class="btn btn-cons" id="procesarInformacion" value="COMENZAR CONTEO"><i class="fa fa-search-plus"></i> Procesar información</button><div>');
    $("#select_corp").after(r);


    $('#procesarInformacion').on( "click",function(e){

        listaActiva='#zona';
        scanear();
        recorrer();
    });


});