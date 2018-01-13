/**
 * @author goofy
 */

var chatboxwindow;
function createChatboxWindow(){
    if (!chatboxwindow) { 
        chatboxwindow = new Ext.Window({
            height: 300,
            width: 600,
            closable: true,
            collapsible: false,
            layout: 'fit',
            title: Lang.supportchat,
            iconCls: 'chat16_icon',
            closeAction: 'hide',
            resizable: true,
            scope: this,
            monitorValid: true,
            items: [{
              xtype: 'box', 
              html: '<iframe style="overflow:auto;width:100%;height:100%;" frameborder="0"  src="https://www.gw-systems.com/chat/?nick=gws...&channels=gw-systems"></iframe>'
            }]
        });
   } else {
     
   }
   chatboxwindow.show('head_logo');  
}