/**
 * @author goofy
 */
var loanbalancewindow = null;
function createLoanBalanceWindow(){
    if (!loanbalancewindow) {
        loanbalancewindow = new Ext.Window({
            collapsible: true,
            closable: true,
            resizable: true,
            frame: true,
            height: 400,
            width: 400,
            layout: 'fit',
            closeAction: 'hide',
            title: 'Egyenleg',
            tbar: {
                items: [{
                    xtype: 'buttongroup',
                    title: 'Gyorslinkek',
                    defaults: {
                        scale: 'small',
                        iconAlign: 'top'
                    },
                    items: [{
                        xtype: 'tbbutton',
                        text: 'Bankkártyás feltöltés',
                        scale: 'large',
                        width: 100,
                        iconCls: 'creditcard32_icon',
                        handler: function(){
                        
                        }
                    }, {
                        text: 'SMS-es feltöltés',
                        scale: 'large',
                        iconCls: 'mobileadd32_icon',
                        handler: function(){
                        
                        }
                    }, {
                        text: 'Ugrás a dokumentumokra',
                        scale: 'large',
                        iconCls: '',
                        handler: function(){
                        
                        }
                    }]
                }]
            },
            items: [loanGrid = new Ext.grid.GridPanel({
                loadMask: true,
                ds: new Ext.data.Store({
                    url: 'ajax/loanhistory.do',
                    autoLoad: true,
                    reader: new Ext.data.JsonReader({
                        root: 'row'
                    }, [{
                        name: 'method'
                    }, {
                        name: 'money'
                    }, {
                        name: 'time'
                    }, {
                        name: 'comment'
                    }])
                }),
                colModel: new Ext.grid.ColumnModel({
                    columns: [new Ext.grid.RowNumberer({
                        width: 30
                    }), {
                        header: '&nbsp;',
                        width: 450,
                        dataIndex: 'time',
                        sortable: true,
                        menuDisabled: true,
                        sortInfo: {
                            field: 'time',
                            direction: 'ASC'
                        },
                        renderer: function(value, p, record){
                            if (record.data.method.toLowerCase() == "inbound") {
                                return String.format("Összeg: <b><span style='color: #009900'>{0}</span> <img src='images/icons/up16.png'/></b> Időpont: <b>{1}</b><br/><b>Megjegyzés:</b> {2}", GWS.utils.formatNumber( record.data.money ), record.data.time, record.data.comment );
                            }
                            else {
                                return String.format("Összeg: <b><span style='color: #990000'>{0}</span> <img src='images/icons/down16.png'/></b> Időpont: <b>{1}</b><br/><b>Megjegyzés:</b> {2}", GWS.utils.formatNumber( record.data.money ), record.data.time, record.data.comment );
                            }
                        }
                    }]
                })
            })]
        });
    }
    loanbalancewindow.show();
}
