var smsmanagerwindow = null;
function GenerateSMSGrid(){
    url = "ajax/sms/simplesmslist.do";
    baseParameters = {};
    if (arguments[0] != null) {
        url = "ajax/sms/" + arguments[0]
    }
    if (arguments[1] != null) {
        baseParameters = arguments[1]
    }
    return new Ext.grid.GridPanel({
        title: "SMS lista",
        loadMask: true,
        columns: [new Ext.grid.RowNumberer({
            width: 30
        }), {
            header: Lang.payed,
            width: 60,
            align: "center",
            dataIndex: "payed",
            renderer: function(a){
                return "<img src='images/icons/" + (a == "yes" ? "accept.png" : "delete.png") + "'/>"
            }
        }, {
            header: Lang.provider,
            width: 80,
            sortable: true,
            align: "center",
            dataIndex: "provider",
            renderer: function(a){
                return "<img src='images/providers/" + a + ".png' alt='' title=''/>"
            }
        }, {
            header: Lang.telnumber,
            sortable: true,
            dataIndex: "number"
        }, {
            header: Lang.prefix,
            sortable: true,
            align: "center",
            dataIndex: "prefix",
            renderer: function(a){
                return "<b>" + a + "</b>"
            }
        }, {
            header: Lang.smscontent,
            sortable: true,
            width: 180,
            dataIndex: "text",
            renderer: function(a){
                if (typeof a == "object") {
                    return ""
                }
                else {
                    return "<i>" + a + "</i>"
                }
            }
        }, {
            header: Lang.category,
            sortable: true,
            dataIndex: "category"
        }, {
            header: Lang.answer,
            dataIndex: "answer",
            width: 300,
            renderer: function(a){
                return '<div qtip="' + a + '">' + a + "</div>"
            },
            sortable: false
        }, {
            header: Lang.sentdate,
            width: 140,
            dataIndex: "date",
            sortable: true
        }],
        ds: dSource = new Ext.data.Store({
            baseParams: baseParameters,
            proxy: new Ext.data.HttpProxy({
                url: url,
                method: "POST"
            }),
            reader: new Ext.data.JsonReader({
                root: "row",
                totalProperty: "totalcount"
            }, [{
                name: "number",
                type: "string",
                mapping: "number"
            }, {
                name: "prefix",
                type: "string",
                mapping: "prefix"
            }, {
                name: "text",
                mapping: "text"
            }, {
                name: "category",
                type: "string",
                mapping: "category"
            }, {
                name: "provider",
                type: "string",
                mapping: "provider"
            }, {
                name: "answer",
                type: "string",
                mapping: "answer"
            }, {
                name: "date",
                type: "string",
                mapping: "date"
            }, {
                name: "payed",
                type: "string",
                mapping: "payed"
            }]),
            sortInfo: {
                field: "date",
                direction: "DESC"
            },
            autoLoad: true
        }),
        bbar: new Ext.PagingToolbar({
            store: dSource,
            pageSize: 200
        })
    })
}

function createSMSManagerWindow(){
    if (!smsmanagerwindow) {
        smsmanagerwindow = new Ext.Window({
            height: 500,
            width: 660,
            closable: true,
            collapsible: false,
            layout: "fit",
            iconCls: "sms16_icon",
            title: Lang.smsmanager,
            closeAction: "hide",
            resizable: true,
            autoScroll: false,
            tbar: [{
                xtype: "buttongroup",
                title: Lang.smsfunctions,
                columns: 4,
                defaults: {
                    scale: "small",
                    iconAlign: "top"
                },
                items: [{
                    xtype: "splitbutton",
                    text: Lang.smslist,
                    iconCls: "sms32_icon",
                    scale: "large",
                    arrowAlign: "bottom",
                    rowspan: 3,
                    handler: function(){
                        smsmanagerwindow.items.clear();
                        smsmanagerwindow.items.add(GenerateSMSGrid());
                        smsmanagerwindow.doLayout()
                    },
                    menu: [{
                        text: Lang.smslist,
                        iconCls: "list-view_icon",
                        handler: function(){
                            smsmanagerwindow.items.clear();
                            smsmanagerwindow.items.add(GenerateSMSGrid());
                            smsmanagerwindow.doLayout()
                        }
                    }, {
                        text: Lang.listbyprefix,
                        iconCls: "list-view_icon",
                        handler: function(){
                            smsmanagerwindow.items.clear();
                            smsmanagerwindow.items.add(GenerateSMSGrid("smslistbyprefix.do", {
                                prefix: Ext.get("prefixchooser").getValue()
                            }));
                            smsmanagerwindow.doLayout()
                        }
                    }]
                }, {
                    xtype: "button",
                    text: Lang.modifyprefix,
                    iconCls: "edit32_icon",
                    cls: "x-btn-as-arrow",
                    scale: "large",
                    rowspan: 3,
                    handler: function(){
                        smsmanagerwindow.items.clear();
                        smsmanagerwindow.items.add(new Ext.Panel({
                            layout: "anchor",
                            frame: true,
                            items: [newprefixform = new Ext.form.FormPanel({
                                region: "center",
                                title: Lang.requestPrefix,
                                frame: true,
                                width: 540,
                                height: 200,
                                labelWidth: 200,
                                labelAlign: "right",
                                monitorValid: true,
                                scope: this,
                                defaults: {
                                    width: 300
                                },
                                items: [{
                                    xtype: "combo",
                                    fieldLabel: "Prefix",
                                    id: "editprefixcombo",
                                    store: new Ext.data.Store({
                                        proxy: new Ext.data.HttpProxy({
                                            method: "POST",
                                            url: "ajax/sms/prefixlist.do"
                                        }),
                                        reader: new Ext.data.JsonReader({
                                            root: "row",
                                            fields: ["prefix", "active", "url", "answer"]
                                        })
                                    }),
                                    listeners: {
                                        select: function(c, b, a){
                                            Ext.get("answertext").update(b.data.answer);
                                            if (typeof b.data.url == "object") {
                                                Ext.getCmp("answerurl").setValue()
                                            }
                                            else {
                                                Ext.getCmp("answerurl").setValue(b.data.url)
                                            }
                                        }
                                    },
                                    triggerAction: "all",
                                    displayField: "prefix",
                                    valueField: "prefix",
                                    editable: false
                                }, {
                                    xtype: "textarea",
                                    id: "answertext",
                                    allowBlank: false,
                                    minLength: 10,
                                    maxLength: 160,
                                    fieldLabel: "Valaszüzenet"
                                }, {
                                    xtype: "textfield",
                                    id: "answerurl",
                                    allowBlank: true,
                                    blankText: "http://www.exampleurl.com/smsreceiver.php",
                                    fieldLabel: "Feldolgozó URL",
                                    minLength: 7
                                }],
                                buttons: [{
                                    text: "Prefix adatainak frissitese",
                                    formBind: true,
                                    scope: this,
                                    handler: function(){
                                        newprefixform.getForm().submit({
                                            waitMsg: Lang.loadinprogress,
                                            url: "ajax/sms/editprefix.do",
                                            success: function(){
                                                combo = Ext.getCmp("editprefixcombo");
                                                combo.store.reload();
                                                combo = Ext.getCmp("prefixchooser");
                                                combo.store.reload();
                                                combo.clearValue("");
                                                Ext.MessageBox.alert(Lang.INFO, "A módosításokat eltároltuk.")
                                            },
                                            failure: function(b, a){
                                                Ext.MessageBox.show({
                                                    title: Lang.ERROR,
                                                    msg: "Belso hiba miatt nem sikerult tarolni a modositasokat. Szerver hibauzenet:<br/><b>" + Ext.util.JSON.decode(a.response.responseText).errorString + "</b>",
                                                    icon: Ext.MessageBox.ERROR,
                                                    buttons: Ext.MessageBox.OK
                                                })
                                            }
                                        })
                                    }
                                }]
                            })]
                        }));
                        smsmanagerwindow.doLayout()
                    }
                }, {
                    xtype: "button",
                    text: "Teszt SMS küldés",
                    iconCls: "sms_send32_icon",
                    cls: "x-btn-as-arrow",
                    scale: "large",
                    rowspan: 3,
                    handler: function(){
                        smsmanagerwindow.items.clear();
                        smsmanagerwindow.items.add(new Ext.Panel({
                            layout: "anchor",
                            frame: true,
                            items: [testprefixform = new Ext.form.FormPanel({
                                region: "center",
                                title: "SMS Teszt",
                                frame: true,
                                width: 520,
                                height: 260,
                                labelWidth: 200,
                                labelAlign: "right",
                                monitorValid: true,
                                scope: this,
                                defaults: {
                                    width: 300
                                },
                                items: [{
                                    xtype: "combo",
                                    store: smsStore,
                                    displayField: "prefix",
                                    valueField: "prefix",
                                    triggerAction: "all",
                                    editable: false,
                                    allowBlank: false,
                                    id: "SMSTesztPrefix",
                                    fieldLabel: "SMS Prefix"
                                }, {
                                    xtype: "combo",
                                    mode: "local",
                                    fieldLabel: "Kategória",
                                    store: new Ext.data.ArrayStore({
                                        fields: ["val", "text"],
                                        data: [[0, "240 HUF + Áfa"], [1, "400 HUF + Áfa"], [2, "750 HUF + Áfa"], [3, "1600 HUF + Áfa"]]
                                    }),
                                    displayField: "text",
                                    valueField: "val",
									hiddenName: 'SMSTesztCategory',
                                    triggerAction: "all",
                                    editable: false,
                                    allowBlank: false,
                                    id: "SMSTesztCategory",
									name: 'CategoryTemp'
                                }, {
                                    xtype: "textarea",
                                    name: "data",
                                    maxLength: 160,
                                    fieldLabel: "Text",
                                    id: "SMSTesztData"
                                }, {
                                    xtype: "textarea",
                                    name: "answerSMSText",
                                    allowBlank: true,
                                    fieldLabel: "Válasz",
                                    readOnly: true,
                                    id: "SMSTesztAnswer"
                                }],
                                buttons: [{
                                    text: "Prefix felvétele",
                                    formBind: true,
                                    scope: this,
                                    handler: function(){
                                        testprefixform.getForm().submit({
                                            waitMsg: Lang.loadinprogress,
                                            url: "ajax/sms/testprefix.do",
                                            params: {
                                                text: Ext.get("SMSTesztPrefix").getValue() + " " + Ext.get("SMSTesztData").getValue(),
                                                category: Ext.get("SMSTesztCategory").getValue()
                                            },
                                            success: function(b, a){
                                                Ext.get("SMSTesztAnswer").update(Ext.util.JSON.decode(a.response.responseText).responseText)
                                            },
                                            failure: function(){
                                                Ext.MessageBox.alert(Lang.ERROR, "Hiba tortent az SMS feldolgozasa kozben!")
                                            }
                                        })
                                    }
                                }]
                            })]
                        }));
                        smsmanagerwindow.doLayout()
                    }
                }, {
                    text: Lang.removePrefix,
                    iconCls: "del",
                    iconAlign: "left",
                    handler: function(){
                        if (Ext.get("prefixchooser").getValue() != "") {
                            Ext.Msg.show({
                                title: Lang.QUESTION,
                                msg: String.format("Biztosan törölni kívánja a következő prefixet: <b>{0}</b>?", Ext.get("prefixchooser").getValue()),
                                buttons: Ext.Msg.YESNO,
                                icon: Ext.MessageBox.QUESTION,
                                fn: function(a, b){
                                    if (a == "yes") {
                                        Ext.Ajax.request({
                                            waitMsg: Lang.loadinprogress,
                                            url: "ajax/sms/removeprefix.do",
                                            method: "POST",
                                            params: {
                                                prefix: Ext.get("prefixchooser").getValue()
                                            },
                                            failure: function(d, c){
                                                Ext.Msg.show({
                                                    title: Lang.ERROR,
                                                    msg: 'Belső hiba miatt nem sikerült törölni a megadott prefixet. Kérjük forduljon ezügyben a rendszer üzemeltetőjéhez, vagy vegye fel a kapcsolatot e-mailben: <a href="mailto:info@gw-systems.com">info@gw-systems.com</a>',
                                                    buttons: Ext.Msg.OK,
                                                    icon: Ext.Msg.ERROR
                                                })
                                            },
                                            success: function(d, c){
                                                combo = Ext.getCmp("prefixchooser");
                                                combo.store.reload();
                                                combo.clearValue("");
                                                Ext.Msg.show({
                                                    title: Lang.INFO,
                                                    msg: "A prefixet sikeresen eltávolítottuk.",
                                                    buttons: Ext.Msg.OK,
                                                    icon: Ext.Msg.INFO
                                                })
                                            }
                                        })
                                    }
                                }
                            })
                        }
                    }
                }, {
                    text: Lang.requestPrefix,
                    iconCls: "add",
                    iconAlign: "left",
                    handler: function(){
                        smsmanagerwindow.items.clear();
                        smsmanagerwindow.items.add(new Ext.Panel({
                            layout: "anchor",
                            frame: true,
                            items: [newprefixform = new Ext.form.FormPanel({
                                region: "center",
                                title: "Prefix igenyles",
                                frame: true,
                                width: 540,
                                height: 200,
                                labelWidth: 200,
                                labelAlign: "right",
                                monitorValid: true,
                                scope: this,
                                defaults: {
                                    width: 300
                                },
                                items: [{
                                    xtype: "textfield",
                                    fieldLabel: "Az igényelni kívánt prefix",
                                    value: Ext.get("prefixchooser").getValue(),
                                    allowBlank: false,
                                    name: "prefix",
                                    maxLength: 10,
                                    minLength: 3,
                                    readOnly: false
                                }, {
                                    xtype: "textarea",
                                    name: "answertext",
                                    allowBlank: false,
                                    minLength: 10,
                                    maxLength: 160,
                                    fieldLabel: "Valaszüzenet"
                                }, {
                                    xtype: "textfield",
                                    name: "answerurl",
                                    allowBlank: true,
                                    fieldLabel: "Feldolgozó URL",
                                    minLength: 7
                                }],
                                buttons: [{
                                    text: "Prefix felvétele",
                                    formBind: true,
                                    scope: this,
                                    handler: function(){
                                        newprefixform.getForm().submit({
                                            waitMsg: Lang.loadinprogress,
                                            url: "ajax/sms/orderprefix.do",
                                            success: function(){
                                                combo = Ext.getCmp("prefixchooser");
                                                combo.store.reload();
                                                combo.clearValue("");
                                                Ext.MessageBox.alert(Lang.INFO, "A prefix elbiralasa megkezdodott. Az elbiralas maximum 1 munkanapot vesz igénybe.")
                                            },
                                            failure: function(){
                                                Ext.MessageBox.alert(Lang.INFO, "Ez a prefix már használatban van. Kérjük próbáljon felvenni másikat.")
                                            }
                                        })
                                    }
                                }]
                            })]
                        }));
                        smsmanagerwindow.doLayout()
                    }
                }, {
                    xtype: "combo",
                    width: 140,
                    id: "prefixchooser",
                    store: smsStore = new Ext.data.Store({
                        proxy: new Ext.data.HttpProxy({
                            method: "POST",
                            url: "ajax/sms/prefixlist.do"
                        }),
                        reader: new Ext.data.JsonReader({
                            root: "row",
                            fields: ["prefix", "active", "url", "answer"]
                        })
                    }),
                    tpl: '<tpl for="."><div ext:qtip="<b>URL:</b> {[typeof values.url != "object" ? values.url : ""]}<br/><b>' + Lang.answer + ":</b> {answer}<br/><b>" + Lang.status + '</b>: {[values.active == true ? "' + Lang.active + '" : "' + Lang.inactive + '"]}" class="x-combo-list-item"><b><img src="images/icons/{[values.active == true ? "accept.png" : "delete.png"]}"/>&nbsp;&nbsp;&nbsp;{prefix}</b>{[typeof values.url != "object" ? " - URL: " + values.url : ""]}</div></tpl>',
                    triggerAction: "all",
                    displayField: "prefix",
                    valueField: "prefix",
                    editable: false
                }]
            }],
            items: [GenerateSMSGrid()]
        })
    }
    smsmanagerwindow.show("head_logo")
};
