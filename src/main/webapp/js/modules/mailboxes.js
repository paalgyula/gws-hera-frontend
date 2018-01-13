/**
 * @author goofy
 */
var mailboxwindow;
var newmailboxwin;

function createNewMailboxWindow() {
    if (!newmailboxwin) {
		newmailboxwin = new Ext.Window({
			height: 200,
			width: 150,
			layout: 'fit',
			items: [{
				xtype: 'compositefield',
				items: [
					new Ext.form.DateField(),
					new Ext.form.TimeField()
				]
			}]
		});
	}
	
	newmailboxwin.show();
}

function createMailboxWindow(){
    if (!mailboxwindow) 
        mailboxwindow = new Ext.Window({
            height: 400,
            width: 500,
            closable: true,
            collapsible: true,
            layout: 'fit',
            id: 'mailboxwin',
            title: Lang.mailboxes,
            iconCls: 'email-simple',
            closeAction: 'hide',
            items: [new Ext.grid.GridPanel({
                loadMask: true,
                tbar: [{
                    xtype: 'buttongroup',
                    title: 'Mail funkciók',
                    columns: 4,
                    defaults: {
                        width: 110,
                        scale: 'small',
                        iconAlign: 'top'
                    },
                    items: [{
                        xtype: 'tbbutton',
                        text: 'Új postafiók',
                        scale: 'large',
                        iconCls: 'mail_add32_icon',
                        handler: function() {
                        	new Ext.Window({
                        		title: 'Új mailbox',
                        		width: 435,
                        		height: 310,
								layout: 'fit',
								resizable: false,
                        		items: [newmboxform = new Ext.form.FormPanel({
                        			frame: true,
                        			labelWidth: 1,
                        			buttons: [{
                        				handler: function() {
                        					newmboxform.getForm().submit({
                        						url: 'ajax/mailbox/create.do',
                        						method: 'POST'
                        					});
                        				},
                        				text: 'Új postafiók felvitele'
                        			}],
                        			items: [{
                        				xtype: 'compositefield',
                        				fieldLabel: ' ',
                    					labelSeparator: '',
                        				items: [{
                        					xtype: 'label',
                        					text: 'E-Mail cím:'
                        				},{
                        					xtype: 'textfield',
                        					name: 'mailbox'
                        				},{
                        					xtype: 'label',
                        					text: '@'
                        				},{
                        					xtype: 'textfield',
                        					name: 'domain'
                        				}]
                        			},{
										xtype: 'box',
										fieldLabel: ' ',
										labelSeparator: '',
										html: 'Kösztöntő e-mail: <small>(Hagyja üresen amennyiben nem kíván üdvözlő e-mailt küldeni)</small>'
									},{
                        				xtype: 'htmleditor',
                        				width: 398,
										name: 'mailcontent'
                        			}]
                        		})]
                        	}).show('head_logo');
                        }
                    }, {
                        xtype: 'tbbutton',
                        text: 'Postafiók törlése',
                        iconCls: 'mail_delete32_icon',
                        scale: 'large',
                        handler: function(){
                        
                        }
                    }, {
                        xtype: 'tbbutton',
                        text: 'Postafiók módosítása',
                        iconCls: 'mail_edit32_icon',
                        scale: 'large',
                        handler: function(){
                        
                        }
                    }, {
                        xtype: 'tbbutton',
                        text: 'Új mailbox domain',
                        iconCls: 'globe_add32_icon',
                        scale: 'large',
                        handler: function(){
                        
                        }
                    }]
                }],
                ds: store = new Ext.data.GroupingStore({
                    autoLoad: true,
                    url: 'ajax/mailboxes.do',
                    groupOnSort: false,
                    remoteGroup: true,
                    groupField: 'domain',
                    sortInfo: {
                        field: 'domain',
                        direction: 'ASC'
                    },
                    reader: new Ext.data.JsonReader({
                        root: 'row',
                        id: 'email'
                    }, [{
                        name: 'email'
                    }, {
                        name: 'password'
                    }, {
                        name: 'quota'
                    }, {
                        name: 'domain'
                    }])
                }),
                view: new Ext.grid.GroupingView({
                    forceFit: true,
                    groupTextTpl: '<span style="color: #006400">{text}</span> ({[values.rs.length]} Mailbox)'
                }),
                columns: [{
                    header: "E-Mail",
                    width: 210,
                    dataIndex: 'email',
                    sortable: true
                }, {
                    header: 'Domain',
                    width: 200,
                    dataIndex: 'domain',
                    sortable: true
                }, {
                    header: "Password",
                    width: 120,
                    dataIndex: 'password',
                    sortable: true
                }, {
                    header: "Quota (in bytes)",
                    width: 120,
                    dataIndex: 'quota',
					renderer: function( val ) {
						return Ext.util.Format.fileSize( val );
					},
                    sortable: true
                }]
            })]
        });
    
    mailboxwindow.show('head_logo');
}
