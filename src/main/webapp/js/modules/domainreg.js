/**
 * @author goofy
 */
var domainregwindow;
function createDomainregWindow() {
	if ( !domainregwindow )
	domainregwindow = new Ext.Window({
		height: 410,
		closable: true,
		collapsible: false,
		resizable: false,
		width: 420,
		closeAction: 'hide',
		layout: 'border',
		modal: true,
		items: [new Ext.grid.GridPanel({
			loadMask: true,
			forceFit: true,
			region: 'center',
			title: Lang.register_domain,
			store: new Ext.data.ArrayStore({
				data: DetailedDomains,
				fields: ['sale', 'domain', 'cost', 'desc']
			}),
			viewConfig: {
		        forceFit: true
			},
			columns: [{
				header: 'Akció',
				width: 55,
				renderer: function( value ){
					if ( value ) {
						return "<b>!!AKCIÓ!!</b>";
					}
					else return "";
				}
			},{
				header: 'Domain',
				width: 40,
				align: 'center'
			},{
				header: 'Ár/év',
				align: 'right',
				renderer: function( value ) {
					return "<b>" + GWS.utils.formatNumber( value ) + " HUF</b>";
				}
			},{
				header: 'Leirás',
				renderer: function( value ) {
					return "<div qtip='" + value + "'>" + value + "</div>";
				}
			}]
		}),formka = new Ext.form.FormPanel({
			height: 80,
			region: 'south',
			layout: 'column',
			frame: true,
			border: false,
			labelWidth: 90,
			buttonAlign: 'center',
			monitorValid: true,
			scope: this,
			items: [{
				xtype: 'label',
				style: 'padding-top: 5px',
				text: 'http://www.'
			},{
				xtype: 'textfield',
				name: 'domain',
				regex: /^[a-zA-Z0-9\-]{1,50}$/,
				allowBlank: false,
				width: 210,
				height: 22
			},{
				xtype: 'combo',
				name: 'ltd',
				height: 22,
				store: new Ext.data.Store({
					proxy: new Ext.data.HttpProxy({
						method: 'GET',
						url: 'ajax/listltd.do'
					}),
					reader: new Ext.data.JsonReader({
						root: 'row',
						fields: [{name: 'ltd'}]
					})
				}),
				triggerAction: 'all',
				valueField: 'ltd',
				displayField: 'ltd',
				selectOnFocus: true,
				editable: false,
				allowBlank: false,
				width: 80
			}],
			buttons: [{
				text: Lang.cancel,
				handler: function() {
					domainregwindow.hide();
				}
			},{
				formBind: true,
				xtype: 'button',
				text: Lang.check,
				handler: function() {
					formka.getForm().submit({
						waitMsg: Lang.wait,
						url: 'ajax/checkdomain.do',
						method: 'POST',
				  		success: function() {
							alert( 'OK' );
						},
						failure: function() {
							Ext.MessageBox.alert( Lang.warning, Lang.alreadyregistred );
						}
					});
				}
			}]
		})]
	});
	
	domainregwindow.show( 'head_logo' );
};
