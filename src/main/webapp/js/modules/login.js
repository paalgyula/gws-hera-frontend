/**
 * @author goofy
 */
var id = 0;

var login = new Ext.Window({
        closable: false,
        resizable: false,
        height: 390,
        width: 400,
        modal: true,
        layout: 'border',
        items: [loginForm = new Ext.form.FormPanel({
            region: 'center',
            title: Lang.login,
            border: false,
            frame: true,
            labelAlign: 'right',
            labelWidth: 90,
            monitorValid: true,
            buttonAlign: 'center',
            defaults: {
                allowBlank: false,
                width: 270
            },
            items: [{
                xtype: 'box',
                width: 370,
                autoEl: {
                    tag: 'img',
                    src: 'images/kulcs.png',
                    alt: 'GW-Systems Login',
                    title: 'GW-Systems Login'
                }
            }, {
                xtype: 'textfield',
                vtype: 'email',
                name: 'user',
                fieldLabel: Lang.username
            }, {
                xtype: 'textfield',
                inputType: 'password',
                name: 'pass',
                fieldLabel: Lang.password
            }, {
                xtype: 'box',
                width: 370,
                height: 80,
				id: 'captcha',
				html: '<img src="simpleCaptcha" title="Captcha" alt="Captcha" />'
            }, {
                xtype: 'textfield',
                name: 'captcha',
                fieldLabel: Lang.captcha
            }],
            buttons: [{
                xtype: 'box',
                width: 245,
                html: '<a href="http://www.gw-systems.com">www.gw-systems.com</a>'
            },{
				xtype: 'button',
				qtip: Lang.captcha_refresh,
				iconCls: 'refresh',
				handler: function() {
					id++;
					var cap = Ext.get( 'captcha' );
					cap.dom.innerHTML = '<img src="simpleCaptcha?id='+ id +'" title="Captcha" alt="Captcha" />';
				}
			},{
                text: Lang.login,
                formBind: true,
                handler: function(){
                    loginForm.getForm().submit({
                        url: 'ajax/login.do',
                        method: 'POST',
                        waitTitle: Lang.wait,
                        waitMsg: Lang.login_check_msg,
                        success: function(response, request){
                            window.location.href = "main.jsp";
                        },
                        failure: function(response, request){
                            Ext.MessageBox.alert(Lang.warning, Lang.login_failed);
                        }
                    });
                }
            }],
            keys: [{
                key: [Ext.EventObject.ENTER],
                handler: function(){
                    if (loginForm.getForm().isValid()) {
                        loginForm.getForm().submit({
                            url: 'ajax/login.do',
                            method: 'POST',
                            waitTitle: Lang.wait,
                            waitMsg: Lang.login_check_msg,
                            success: function(response, request){
                                window.location.href = "main.jsp";
                            },
                            failure: function(response, request){
                                Ext.MessageBox.alert(Lang.warning, Lang.login_failed);
                            }
                        });
                    }
                }
            }]
        
        })]
    });
    
Ext.onReady(function() {
	Ext.QuickTips.init();
	login.show();
});
