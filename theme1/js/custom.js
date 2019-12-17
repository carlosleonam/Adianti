$(function() {
    // close side menu on small devices
    $('#side-menu a[generator="adianti"]').click(function() {
        $('body').removeClass('sidebar-open');
        $('body').scrollTop(0);
    })

    setTimeout( function() {
        $('#envelope_notifications a').click(function() { $(this).closest('.dropdown.open').removeClass('open'); });
    }, 500);
});

$( document ).on( 'click', 'ul.dropdown-menu a[generator="adianti"]', function() {
    $(this).parents(".dropdown.show").removeClass("show");
    $(this).parents(".dropdown-menu.show").removeClass("show");
});

/** JS para utilização das tabs. **/

// Evento para fechar a tab.
$( function () {

    $( "#app-content-tab" ).on( 'click', 'li > a > button', function () {
        var tabContentId = $( this ).parent().attr( "href" );
        var esta_ativada = $( this ).parent().parent().hasClass( 'active' );
        $( tabContentId ).remove(); //remove respective tab content
        $( this ).parent().parent().remove(); //remove li of tab
        if ( esta_ativada ) {
            $( '#app-content-tab a:last' ).tab( 'show' ); // Select first tab
        }
    } );

    $( '#app-content-tab' ).on( 'click', 'a', function ( e ) {
        e.preventDefault();
        $( this ).tab( 'show' );
    } );

    // ------------------------------------------------------- //
    // Multi Level dropdowns
    // ------------------------------------------------------ //
    $("ul.dropdown-menu [data-toggle='dropdown']").on("click", function(event) {
        event.preventDefault();
        event.stopPropagation();

        $(this).siblings().toggleClass("show");


        if (!$(this).next().hasClass('show')) {
            $(this).parents('.dropdown-menu').first().find('.show').removeClass("show");
        }
        $(this).parents('li.nav-item.dropdown.show').on('hidden.bs.dropdown', function(e) {
            $('.dropdown-submenu .show').removeClass("show");
        });

    });
} );


/**
 * Loads an HTML content
 */
function __adianti_load_html( content, afterCallback, url ) {
    var match_container = content.match('adianti_target_container\\s?=\\s?"([0-z-]*)"');

    var match_title = content.match( 'adianti_target_title="(.*?)"' );

    if (match_container == null && content.indexOf('widget="TWindow"') == -1){
        var match_container = url.split('class=');
        var verList = match_container[1].indexOf('List');
        if (verList > 0){
            match_container[1] = match_container[1].substring(0,(verList));
        }
        var verForm = match_container[1].indexOf('Form&');
        if (verForm > 0){
            match_container[1] = match_container[1].substring(0,(verForm));
        }
        var match_title = content.split( '<li><span>');
        if (match_title.length > 1) {
            match_title = match_title[1].split( '</span>' );
            match_title[1] = match_title[0];
        }else{
            match_container = null;
        }
    }

    if ( match_container !== null ) {
        $( '#app-content-tab' ).show();
        var target_container = match_container[1];

        var title = target_container;
        if ( match_title !== null ) {
            title = match_title[1];
        }

        var element = $( '#' + target_container );

        if ( element.length === 0 ) {
            var abas_total = $( '#app-content-tab li' ).length;
            if ( abas_total < 10 ) {
                $( '#app-content-tab.nav-tabs' ).append( '<li class="nav-item"><a class="nav-link active" href="#' + target_container + '" role="tab">' +
                                                         '<button class="close closeTab" type="button">x</button>' + title + '</a></li>' );
                $(".nav").find(".active").removeClass("active");
                $( '#tab-content-page' ).append( '<div class="tab-pane fade active" role="tabpanel" id="' + target_container + '"></div>' );
            } else {
                __adianti_error( 'Limite de Abas em aberto', 'Você esta com muitas abas em aberto, operação cancelada', function () {
                } );
                if ( typeof afterCallback == "function" ) {
                    afterCallback(url, content);                }
                return;
            }
        }
        var t_container = $( '#' + target_container );
        t_container.empty();
        t_container.html( content );
        $( '#app-content-tab' ).find( 'a[href="#' + target_container + '"]' ).tab( 'show' );
    }else if ($('[widget="TWindow"]').length > 0 && (content.indexOf('widget="TWindow"') > 0)){
        $( '[widget="TWindow"]' ).attr( 'remove', 'yes' );
        $( '#adianti_online_content' ).empty();
        content = content.replace( new RegExp( '__adianti_append_page', 'g' ), '__adianti_append_page2' ); // chamadas presentes em botões seekbutton em window, abrem em outra janela
        $( '#adianti_online_content' ).html( content );
        $( '[widget="TWindow"][remove="yes"]' ).remove();
    } else {
        if ( content && content.indexOf( "TWindow" ) > 0 ) {
            content = content.replace( new RegExp( '__adianti_append_page', 'g' ), '__adianti_append_page2' ); // chamadas presentes em botões seekbutton em window, abrem em outra janela
            $( '#adianti_online_content' ).html( content );
        } else {
            if ( typeof Adianti.onClearDOM == "function" ) {
                Adianti.onClearDOM();
            }

            $( '[widget="TWindow"]' ).remove();
            $( '#adianti_div_content' ).html( content );
            $( '#app-content-tab' ).hide();
        }
    }

    if ( typeof afterCallback == "function" ) {
        afterCallback(url, content);
    }
}
