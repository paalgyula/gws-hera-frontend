/**
 * @author goofy
 */
var dnsmanagerwindow;
function createDNSManagerWindow(){
    if (!dnsmanagerwindow) 
        dnsmanagerwindow = new Ext.Window({
            height: 100,
            width: 360,
            closable: true,
            collapsible: true,
            layout: 'fit',
            id: 'dnsmanagerwin',
            title: Lang.dnsmanager,
            iconCls: 'world',
            closeAction: 'hide',
            resizable: false,
            scope: this,
            monitorValid: true,
            items: [dnsformpanel = new Ext.form.FormPanel({
                frame: true,
                labelWidth: 120,
                border: false,
                items: [{
                    xtype: 'combo',
                    id: 'selectedDomain',
                    height: 22,
                    fieldLabel: Lang.selectdomain,
                    store: comboStore = new Ext.data.Store({
                        proxy: new Ext.data.HttpProxy({
                            method: 'GET',
                            url: 'ajax/dns/listmydomains.do'
                        }),
                        reader: new Ext.data.JsonReader({
                            root: 'row',
                            fields: [{
                                name: 'domain'
                            }]
                        })
                    }),
                    triggerAction: 'all',
                    valueField: 'domain',
                    displayField: 'domain',
                    selectOnFocus: true,
                    editable: false,
                    allowBlank: false,
                    width: 200
                }],
                buttons: [{
                    iconCls: 'refresh',
                    qtip: 'Refresh',
                    handler: function(){
                        comboStore.reload();
                    }
                }, {
                    text: 'Ugras DNS kezelő panelra',
                    formBind: true,
                    scope: this,
                    handler: function(){
						dnsmanagerwindow.hide();
                        if (dnsformpanel.getForm().isValid()) {
                            managerWindow = new Ext.Window({
                                width: 600,
                                height: 400,
                                title: 'DNS Manager - ' + Ext.get('selectedDomain').getValue(),
                                layout: 'fit',
                                resizable: true,
                                collapsible: true,
                                items: [new Ext.grid.GridPanel({
                                    loadMask: true,
                                    ds: store = new Ext.data.GroupingStore({
                                        autoLoad: true,
                                        url: 'ajax/dns/listrecords.do',
                                        method: 'POST',
                                        iconCls: 'world',
                                        groupOnSort: false,
                                        remoteGroup: true,
                                        groupField: 'type',
                                        sortInfo: {
                                            field: 'name',
                                            direction: 'ASC'
                                        },
                                        baseParams: {
                                            domain: Ext.get('selectedDomain').getValue()
                                        },
                                        reader: new Ext.data.JsonReader({
                                            root: 'row',
                                        }, [{
                                            name: 'name'
                                        }, {
                                            name: 'type'
                                        }, {
                                            name: 'content'
                                        }, {
                                            name: 'priority'
                                        }, {
                                            name: 'ttl'
                                        }, {
                                            name: 'changed'
                                        }])
                                    }),
                                    colModel: new Ext.grid.ColumnModel({
                                        columns: [new Ext.grid.RowNumberer({width: 30}),{
                                            header: 'name',
                                            dataIndex: 'name',
                                            sortable: true
                                        }, {
                                            header: 'type',
                                            dataIndex: 'type',
                                            sortable: true
                                        }, {
                                            header: 'content',
                                            dataIndex: 'content',
                                            sortable: true
                                        }, {
                                            header: 'priority',
                                            dataIndex: 'priority',
                                            sortable: true
                                        }, {
                                            header: 'ttl',
                                            dataIndex: 'ttl',
                                            sortable: true
                                        }, {
                                            header: 'changed',
                                            dataIndex: 'changed',
                                            sortable: true
                                        }],
                                        defaults: {
                                            menuDisabled: true
                                        }
                                    }),
                                    view: new Ext.grid.GroupingView({
                                        forceFit: true,
                                        groupTextTpl: '{text} ({[values.rs.length]} {[values.rs.length > 1 ? "Records" : "Record"]})'
                                    }),
                                    listeners: {
                                        contextmenu: function( event ) {
											event.stopEvent();
                                            var contextMenu = new Ext.menu.Menu({
                                                items: [{
                                                    text: Lang.refresh,
													iconCls: 'refresh',
                                                    handler: function(){
                                                        store.reload();
                                                    }
                                                },'-'
												,{
													text: 'Add A record',
													iconCls: 'add',
													handler: function() {
														
													}
												},{
													text: 'Add CNAME record',
													iconCls: 'add',
													handler: function() {
														
													}
												},{
													text: 'Add MX record',
													iconCls: 'add',
													handler: function() {
														
													}
												},{
													text: 'Add SOA record',
													iconCls: 'add',
													handler: function() {
														
													}
												},'-',{
													text: 'Delete selected record',
													iconCls: 'del',
													handler: function() {
														
													}
												}]
                                            });
                                            contextMenu.showAt( event.xy );
                                        }
                                    }
                                })]
                            });
                            managerWindow.show();
                        }
                    }
                }]
            })]
        });
    
    dnsmanagerwindow.show('head_logo');
}
