Ext.onReady(function(){
    Ext.QuickTips.init();
    
    userconsole = new Ext.Window({
        width: 467,
        autoHeight: true,
        closable: false,
        resizable: false,
        id: 'mainconsole',
        title: 'GW-Systems Admin Console',
        tbar: {
            items: [{
                xtype: 'buttongroup',
                title: Lang.usable_modules,
                columns: 4,
                defaults: {
                    iconAlign: 'top',
                    disabled: true,
                    scale: 'small'
                },
                items: [{
                    scale: 'large',
                    text: Lang.handle_mailboxes,
                    id: 'button_mailbox',
                    iconCls: 'mail32_icon',
                    width: 110,
                    tooltip: Lang.handle_mailboxes,
                    handler: function(){
                        createMailboxWindow();
                    }
                }, {
                    scale: 'large',
                    text: Lang.register_domain,
                    id: 'button_domainreg',
                    iconCls: 'globe32_icon',
                    width: 110,
                    tooltip: Lang.register_domain,
                    handler: function(){
                        createDomainregWindow();
                    }
                }, {
                    scale: 'large',
                    text: Lang.dnsmanager,
                    iconCls: 'dns32_icon',
                    id: 'button_dnsmanager',
                    width: 110,
                    tooltip: Lang.dnsmanager,
                    handler: function(){
                        createDNSManagerWindow();
                    }
                }, {
                    scale: 'large',
                    text: Lang.smsmanager,
                    iconCls: 'sms32_icon',
                    id: 'button_smsmanager',
                    width: 110,
                    tooltip: Lang.smsmanager,
                    handler: function(){
                        createSMSManagerWindow();
                    }
                },/** Masodik sor **/ {
                    scale: 'large',
                    text: Lang.documents,
                    iconCls: 'page32_icon',
                    id: 'button_documents',
                    width: 110,
                    tooltip: Lang.documents,
                    handler: function(){
                    
                    }
                }, {
                    scale: 'large',
                    text: Lang.virtualhost,
                    iconCls: 'vhost32_icon',
                    id: 'button_vhostmanager',
                    width: 110,
                    tooltip: Lang.virtualhost,
                    handler: function(){
                    
                    }
                }, {
                    scale: 'large',
                    text: Lang.dbmanager,
					id: 'button_databasemanager',
                    iconCls: 'database32_icon',
                    width: 110,
                    tooltip: Lang.dbmanager,
                    handler: function(){
                    
                    }
                }, {
                    scale: 'large',
                    text: Lang.statistics,
                    iconCls: 'chart32_icon',
                    id: 'button_statisticmanager',
                    width: 110,
                    tooltip: Lang.statistics,
                    handler: function(){
                    
                    }
                }, {
                    scale: 'large',
                    text: Lang.supportchat,
                    iconCls: 'chat32_icon',
                    id: 'button_supportchat',
                    width: 110,
                    tooltip: Lang.supportchat,
                    handler: function(){
                        createChatboxWindow();
                    }
                },                /*{
                 scale: 'large',
                 text: Lang.smsmanager,
                 iconCls: 'sms32_icon',
                 width: 110,
                 tooltip: Lang.smsmanager,
                 handler: function(){
                 
                 }
                 },*/
                {
                    scale: 'large',
                    text: Lang.paywithcreditcard,
                    iconCls: 'creditcard32_icon',
                    id: 'button_paywithcredit',
                    width: 110,
                    tooltip: Lang.paywithcreditcard,
                    handler: function(){
                    
                    }
                }, {
                    scale: 'large',
                    text: Lang.paywithmobile,
                    iconCls: 'mobileadd32_icon',
                    id: 'button_paywithmobile',
                    width: 110,
                    tooltip: Lang.paywithmobile,
                    handler: function(){
                    
                    }
                }, {
                    scale: 'large',
                    text: Lang.loanhistory,
                    iconCls: 'dollar32_icon',
                    id: 'button_loanmanager',
                    width: 110,
                    tooltip: Lang.loanhistory,
                    handler: function(){
                        createLoanBalanceWindow();
                    }
                }, {
                    scale: 'large',
                    text: Lang.logout,
                    iconCls: 'eject32_icon',
                    disabled: false,
                    width: 110,
                    tooltip: Lang.logout,
                    handler: function(){
                        Ext.Ajax.request({
                            url: 'ajax/logout.do',
                            waitMsg: Lang.logoutprogress,
                            success: function(){
                                window.location.href = 'index.jsp';
                            }
                        });
                    }
                }]
            }]
        },
        bbar: new Ext.Toolbar()
    }).show();
    
    this.showMask = function(){
        var w = Ext.getCmp('mainconsole');
        w.getEl().mask('Jogosultságok betöltése...');
    }
    
    this.hideMask = function(){
        var w = Ext.getCmp('mainconsole');
        w.getEl().unmask();
    }
    
    
    Ext.Ajax.on('beforerequest', this.showMask, this);
    Ext.Ajax.on('requestcomplete', this.hideMask, this);
    Ext.Ajax.on('requestexception', this.hideMask, this);
    
    function IsNumeric(input){
        return (input - 0) == input && input.length > 0;
    }
    
    Ext.Ajax.request({
        url: 'ajax/userdetails.do',
        method: 'POST',
        waitTitle: 'Betoltes',
        waitMsg: 'Jogosultsagok betoltese',
        success: function(response, request){
            var rJson = Ext.util.JSON.decode(response.responseText);
            toolbar = userconsole.getBottomToolbar();
            toolbar.items.clear();
            toolbar.add(Lang.username + ': ' + rJson.username);
            toolbar.add('-');
            toolbar.add(Lang.act_loan + ': <b>' + GWS.utils.formatNumber(rJson.loan) + '</b> HUF');
            toolbar.doLayout();
            for (i in rJson.permissions.row) {
                try {
                    if (IsNumeric(i)) {
                        Ext.getCmp('button_' + rJson.permissions.row[i]["module"].toLowerCase()).enable();
                    }
                } 
                catch (Exception) {
                    // Nincs meg az element. Ki a szart erdekel?! :)
                }
            }
            
            Ext.Ajax.removeListener('beforerequest', this.showMask, this);
            Ext.Ajax.removeListener('requestcomplete', this.hideMask, this);
            Ext.Ajax.removeListener('requestexception', this.hideMask, this);
        }
    })
    
});
