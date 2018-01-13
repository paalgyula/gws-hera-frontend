/**
 * @author goofy
 */
Ext.onReady(function(){
    var hideMask = function(){
        Ext.get('loading').remove();
        Ext.fly('loading-mask').fadeOut({
            remove: true
        });
    }
    hideMask.defer(250);
    
    Ext.getBody().on('contextmenu', function(e){
        e.preventDefault();
    });
});
