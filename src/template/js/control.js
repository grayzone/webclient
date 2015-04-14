$(document).ready(function() {

	$("#leftDiv").droppable();
	$("#rightDiv").droppable();

	$('#btngeturl').click(function() {
		$.ajax({
			type : "POST",
			url : "/getserviceurl",
			success : function(result) {
				$("#turl").val(result);

			}
		});
	})

	$('#btnupdateurl').click(function() {
		$.ajax({
			type : "POST",
			url : "/updateserviceurl",
			data : {
				"url" : $("#turl").val()
			},
			success : function(result) {
			}
		});
	});

	$('#btngetloglevel').click(function() {
		$.ajax({
			type : "POST",
			url : "/getloglevel",
			success : function(result) {
				$("#tloglevel").val(result);

			}
		});
	})

	$('#btnupdateLoglevel').click(function() {
		$.ajax({
			type : "POST",
			url : "/updateloglevel",
			data : {
				"loglevel" : $("#tloglevel").val()
			},
			success : function(result) {
			}
		});
	});

	$('#btnemptylog').click(function() {
		$.ajax({
			type : "POST",
			url : "/emptylog",
			success : function(result) {
			}
		});
	});


	var timer = null;

	$('#tbagentstatus').appendGrid({
		caption : 'Agent Status',
		initData : [ {} ],
		hideRowNumColumn : true,
		columns : [ {
			name : 'AgentStatus',
			display : 'Agent Status',
			resizable : true
		}, {
			name : 'ServerStatus',
			display : 'Server Status',
			resizable : true
		}, {
			name : 'ServerAvailable',
			display : 'Server Available',
			resizable : true
		}, {
			name : 'CacheTimeOut',
			display : 'Cache Time Out',
			resizable : true
		}, {
			name : 'DataReady',
			display : 'Data Ready',
			resizable : true
		}, {
			name : 'Datetime',
			display : 'Datetime',
			resizable : true
		}, {
			name : 'JobStatus',
			display : 'Job Status',
			resizable : true
		}, {
			name : 'LastUpdate',
			display : 'Last Update',
			resizable : true
		}, {
			name : 'Timestamp',
			display : 'Timestamp',
			resizable : true
		}, {
			name : 'UploadTime',
			display : 'Upload Time',
			resizable : true
		}, {
			name : 'DownloadTime',
			display : 'Download Time',
			resizable : true
		} ],
		customRowButtons : [ {
			uiButton : {
				label : 'Get'
			},
			click : function(evtObj, uniqueIndex, rowData) {
				if (timer) {
					clearInterval(timer);
					timer = null;
				} else {
					timer = setInterval('UpdateGetAgentStatus(1)', 2000);
				}

			},
			atTheFront : true
		} ],
		hideButtons : {
			insert : true,
			moveUp : true,
			moveDown : true,
			removeLast : true,
			remove : true,
			append : true
		}

	});

	var initswdata = [ {
		'ComponentType' : 'software',
		'Name' : 'Control',
		'PartNumber' : '0',
		'Revision' : '01.08.01'
	} ];

	$('#tbsoftware').appendGrid({
		caption : 'Software',
		initData : initswdata,
		columns : [ {
			name : 'ComponentType',
			display : 'Type',
			resizable : true,
			type : 'select',
			ctrlOptions : 'software;business rules'

		}, {
			name : 'Name',
			display : 'Name',
			resizable : true
		}, {
			name : 'PartNumber',
			display : 'Part Number',
			resizable : true
		}, {
			name : 'Revision',
			display : 'Revision',
			resizable : true
		} ],
		hideButtons : {
			insert : true,
			moveUp : true,
			moveDown : true,
			removeLast : true
		}
	});

	var inithwdata = [ {
		'Name' : 'WINTEL',
		'PartNumber' : 'ABC',
		'Revision' : '1.0'
	}, {
		'Name' : 'Control Board',
		'PartNumber' : '0',
		'Revision' : '0'
	} ];
	$('#tbhardware').appendGrid({
		caption : 'Hardware',
		initData : inithwdata,
		columns : [ {
			name : 'Name',
			display : 'Name',
			resizable : true
		}, {
			name : 'PartNumber',
			display : 'Part Number',
			resizable : true
		}, {
			name : 'Revision',
			display : 'Revision',
			resizable : true
		} ],
		hideButtons : {
			insert : true,
			moveUp : true,
			moveDown : true,
			removeLast : true
		}

	});

	$('#tbnotificationsw').appendGrid({
		caption : 'Notifications-SOFTWARE',
		initData : [ {} ],
		columns : [ {
			name : 'Oid',
			display : 'OID',
			resizable : true
		}, {
			name : 'SoftwareStatus',
			display : 'Software Status',
			resizable : true
		}, {
			name : 'Name',
			display : 'Name',
			resizable : true
		}, {
			name : 'Revision',
			display : 'Revision',
			resizable : true
		}, {
			name : 'PartNumber',
			display : 'Part Number',
			resizable : true
		}, {
			name : 'Language',
			display : 'Language',
			resizable : true
		}, {
			name : 'PertinentType',
			display : 'Pertinent Type',
			resizable : true,
			invisible : true
		}, {
			name : 'PertinentIdentifier',
			display : 'Pertinent Identifier',
			resizable : true,
			invisible : true
		},{
			name : 'Features',
			display : 'Features',
//			type : 'select',
			resizable : true,
			invisible : false
		} 
		],
		customRowButtons : [ {
			uiButton : {
				label : 'Get'
			},
			click : function(evtObj, uniqueIndex, rowData) {
				var result = GetNotificationByOID(rowData.Oid)
				var s = JSON.parse(result);
				var component = s.ResMsg.Response.Notifications.Notification[0].Body.Components.Component[0];
				$('#tbnotificationsw').appendGrid('setCtrlValue', 'Name', uniqueIndex - 1, component.Name);
				$('#tbnotificationsw').appendGrid('setCtrlValue', 'SoftwareStatus', uniqueIndex - 1, component.SoftwareStatus);
				$('#tbnotificationsw').appendGrid('setCtrlValue', 'Revision', uniqueIndex - 1, component.Revision);
				$('#tbnotificationsw').appendGrid('setCtrlValue', 'PartNumber', uniqueIndex - 1, component.PartNumber);
				$('#tbnotificationsw').appendGrid('setCtrlValue', 'Language', uniqueIndex - 1, component.Language);

				$('#tbnotificationsw').appendGrid('setCtrlValue', 'PertinentType', uniqueIndex - 1, s.ResMsg.Response.Notifications.Notification[0].Header.PertinentType);
				$('#tbnotificationsw').appendGrid('setCtrlValue', 'PertinentIdentifier', uniqueIndex - 1, s.ResMsg.Response.Notifications.Notification[0].Header.PertinentIdentifier);
			},
			atTheFront : true
		}, {
			uiButton : {
				label : 'Upgrade'
			},
			click : function(evtObj, uniqueIndex, rowData) {
				UpgradeSoftware(rowData)
			},
			atTheFront : true
		}, {
			uiButton : {
				label : 'OK'
			},
			click : function(evtObj, uniqueIndex, rowData) {
				SendInstallStatus(rowData, "installed")
			},
			atTheFront : true
		}, {
			uiButton : {
				label : 'Failed'
			},
			click : function(evtObj, uniqueIndex, rowData) {
				SendInstallStatus(rowData, "failed")
			},
			atTheFront : true
		}, {
			uiButton : {
				label : 'Not Attempted'
			},
			click : function(evtObj, uniqueIndex, rowData) {
				SendInstallStatus(rowData, "not attempted")
			},
			atTheFront : true
		} ],
		hideButtons : {
			insert : true,
			moveUp : true,
			moveDown : true,
			removeLast : true,
			remove : true,
			append : true
		}

	});

	$('#tbnotificationdoc').appendGrid({
		caption : 'Notifications-DOCUMENT',
		initData : [ {} ],
		columns : [ {
			name : 'Oid',
			display : 'OID',
			resizable : true
		}, {
			name : 'Type',
			display : 'Type',
			resizable : true
		}, {
			name : 'Name',
			display : 'Name',
			resizable : true
		}, {
			name : 'Filesize',
			display : 'File Size(MB)',
			resizable : true
		}, {
			name : 'PertinentType',
			display : 'Pertinent Type',
			resizable : true,
			invisible : true
		}, {
			name : 'MD5',
			display : 'MD5',
			resizable : true,
			invisible : true
		}, {
			name : 'Location',
			display : 'Location',
			resizable : true,
			invisible : true
		} ],
		customRowButtons : [ {
			uiButton : {
				label : 'Get'
			},
			click : function(evtObj, uniqueIndex, rowData) {
				GetNotificationByOID(rowData.Oid)

				var result = GetNotificationByOID(rowData.Oid)
				var s = JSON.parse(result);
				var component = s.ResMsg.Response.Notifications.Notification[0].Body.Components.Component[0];
				/*
				 * $.session.set("pertinent_type",
				 * s.ResMsg.Response.Notifications.Notification[0].Header.PertinentType);
				 * $.session.set("file_size", component.Filesize);
				 * $.session.set("md5", component.MD5);
				 * $.session.set("location", component.Location);
				 */

				$('#tbnotificationdoc').appendGrid('setCtrlValue', 'Name', uniqueIndex - 1, component.Name);
				$('#tbnotificationdoc').appendGrid('setCtrlValue', 'Type', uniqueIndex - 1, component.DocumentType);
				$('#tbnotificationdoc').appendGrid('setCtrlValue', 'Filesize', uniqueIndex - 1, component.Filesize / 1024000);

				$('#tbnotificationdoc').appendGrid('setCtrlValue', 'PertinentType', uniqueIndex - 1, s.ResMsg.Response.Notifications.Notification[0].Header.PertinentType);
				$('#tbnotificationdoc').appendGrid('setCtrlValue', 'MD5', uniqueIndex - 1, component.MD5);
				$('#tbnotificationdoc').appendGrid('setCtrlValue', 'Location', uniqueIndex - 1, component.Location);

			},
			atTheFront : true
		}, {
			uiButton : {
				label : 'View'
			},
			click : function(evtObj, uniqueIndex, rowData) {
				ViewDocument(rowData)
			}
		} ],
		hideButtons : {
			insert : true,
			moveUp : true,
			moveDown : true,
			removeLast : true,
			remove : true,
			append : true
		}

	});

	$('#tbnotificationrule').appendGrid({
		caption : 'Notifications - Business Rules',
		initData : [ {} ],
		columns : [ {
			name : 'Oid',
			display : 'OID',
			resizable : true
		}, {
			name : 'Type',
			display : 'Type',
			resizable : true
		}, {
			name : 'Name',
			display : 'Name',
			resizable : true
		}, {
			name : 'Filesize',
			display : 'File Size(MB)',
			resizable : true
		}, {
			name : 'PertinentType',
			display : 'Pertinent Type',
			resizable : true,
			invisible : true
		}, {
			name : 'MD5',
			display : 'MD5',
			resizable : true,
			invisible : true
		}, {
			name : 'Location',
			display : 'Location',
			resizable : true,
			invisible : true
		} ],
		customRowButtons : [ {
			uiButton : {
				label : 'Get'
			},
			click : function(evtObj, uniqueIndex, rowData) {
				GetNotificationByOID(rowData.Oid)

				var result = GetNotificationByOID(rowData.Oid)
				var s = JSON.parse(result);
				var component = s.ResMsg.Response.Notifications.Notification[0].Body.Components.Component[0];


				$('#tbnotificationrule').appendGrid('setCtrlValue', 'Name', uniqueIndex - 1, component.Name);
				$('#tbnotificationrule').appendGrid('setCtrlValue', 'Type', uniqueIndex - 1, component.ComponentType);
				$('#tbnotificationrule').appendGrid('setCtrlValue', 'Filesize', uniqueIndex - 1, component.Filesize / 1024000);

				$('#tbnotificationrule').appendGrid('setCtrlValue', 'PertinentType', uniqueIndex - 1, s.ResMsg.Response.Notifications.Notification[0].Header.PertinentType);
				$('#tbnotificationrule').appendGrid('setCtrlValue', 'MD5', uniqueIndex - 1, component.MD5);
				$('#tbnotificationrule').appendGrid('setCtrlValue', 'Location', uniqueIndex - 1, component.Location);

			},
			atTheFront : true
		} ],
		hideButtons : {
			insert : true,
			moveUp : true,
			moveDown : true,
			removeLast : true,
			remove : true,
			append : true
		}

	});

	$('#tbfeature_available').appendGrid({
		caption : 'Features-Available',
		initData : [ {} ],
		columns : [ {
			name : 'ID',
			display : 'ID',
			resizable : true
		}, {
			name : 'Name',
			display : 'Name',
			resizable : true
		}, {
			name : 'Description',
			display : 'Description',
			resizable : true
		}, {
			name : 'Term',
			display : 'Term',
			resizable : true,
			type : 'select',
			ctrlOptions : {
				0 : '',
				1 : 'Permanent',
				2 : 'Temporary',
				3 : 'Demo'
			}
		}, {
			name : 'StartDate',
			display : 'Start Date',
			type : 'ui-datepicker',
			uiOption : {
				dateFormat : 'mm/dd/yy'
			},
			resizable : true
		}, {
			name : 'Duration',
			display : 'Duration',
			resizable : true
		}, {
			name : 'LicenseKey',
			display : 'License Key',
			resizable : true
		}, {
			name : 'LicenseSerialNumber',
			display : 'License Serial Number',
			resizable : true,
			invisible : true
		}, {
			name : 'UpgradeRequired',
			display : 'Upgrade?',
			resizable : true
		} ],
		customRowButtons : [ {
			uiButton : {
				label : 'Start'
			},
			click : function(evtObj, uniqueIndex, rowData) {
				rowData.Status = "start";
				ChangeFeatureStatus(rowData);

			},
			atTheFront : true
		}, {
			uiButton : {
				label : 'Demo'
			},
			click : function(evtObj, uniqueIndex, rowData) {
				rowData.Status = "demo";
				ChangeFeatureStatus(rowData);
			},
			atTheFront : true
		}, {
			uiButton : {
				label : 'Failed'
			},
			click : function(evtObj, uniqueIndex, rowData) {
				rowData.Status = "failed";
				ChangeFeatureStatus(rowData);
			},
			atTheFront : true
		}, {
			uiButton : {
				label : 'Not Attempted'
			},
			click : function(evtObj, uniqueIndex, rowData) {
				rowData.Status = "not attempted";
				ChangeFeatureStatus(rowData);
			},
			atTheFront : true
		} ],
		hideButtons : {
			insert : true,
			moveUp : true,
			moveDown : true,
			removeLast : true,
			remove : true,
			append : true
		}

	});

	$('#tbfeature_entitled').appendGrid({
		caption : 'Features-Entitled',
		initData : [ {} ],
		columns : [ {
			name : 'ID',
			display : 'ID',
			resizable : true
		}, {
			name : 'Name',
			display : 'Name',
			resizable : true
		}, {
			name : 'Description',
			display : 'Description',
			resizable : true
		}, {
			name : 'Term',
			display : 'Term',
			resizable : true,
			type : 'select',
			ctrlOptions : {
				0 : '',
				1 : 'Permanent',
				2 : 'Temporary',
				3 : 'Demo'
			}
		}, {
			name : 'StartDate',
			display : 'Start Date',
			type : 'ui-datepicker',
			uiOption : {
				dateFormat : 'mm/dd/yy'
			},
			resizable : true
		}, {
			name : 'Duration',
			display : 'Duration',
			resizable : true
		}, {
			name : 'UpgradeRequired',
			display : 'Upgrade?',
			resizable : true
		} ],
		customRowButtons : [ {
			uiButton : {
				label : 'Start'
			},
			click : function(evtObj, uniqueIndex, rowData) {
				rowData.Status = "start";
				ChangeFeatureStatus(rowData);

			},
			atTheFront : true
		}, {
			uiButton : {
				label : 'Enabled'
			},
			click : function(evtObj, uniqueIndex, rowData) {
				rowData.Status = "enabled";
				ChangeFeatureStatus(rowData);
			},
			atTheFront : true
		}, {
			uiButton : {
				label : 'Failed'
			},
			click : function(evtObj, uniqueIndex, rowData) {
				rowData.Status = "failed";
				ChangeFeatureStatus(rowData);
			},
			atTheFront : true
		}, {
			uiButton : {
				label : 'Not Attempted'
			},
			click : function(evtObj, uniqueIndex, rowData) {
				rowData.Status = "not attempted";
				ChangeFeatureStatus(rowData);
			},
			atTheFront : true
		} ],
		hideButtons : {
			insert : true,
			moveUp : true,
			moveDown : true,
			removeLast : true,
			remove : true,
			append : true
		}

	});

	$('#tbfeature_enabled').appendGrid({
		caption : 'Features-Enabled',
		initData : [ {} ],
		columns : [ {
			name : 'ID',
			display : 'ID',
			resizable : true
		}, {
			name : 'Name',
			display : 'Name',
			resizable : true
		}, {
			name : 'Description',
			display : 'Description',
			resizable : true
		}, {
			name : 'Term',
			display : 'Term',
			resizable : true,
			type : 'select',
			ctrlOptions : {
				0 : '',
				1 : 'Permanent',
				2 : 'Temporary',
				3 : 'Demo'
			}
		}, {
			name : 'StartDate',
			display : 'Start Date',
			type : 'ui-datepicker',
			uiOption : {
				dateFormat : 'mm/dd/yy'
			},
			resizable : true
		}, {
			name : 'Duration',
			display : 'Duration',
			resizable : true
		}, {
			name : 'UpgradeRequired',
			display : 'Upgrade?',
			resizable : true
		} ],
		customRowButtons : [ {
			uiButton : {
				label : 'Start'
			},
			click : function(evtObj, uniqueIndex, rowData) {
				rowData.Status = "start";
				ChangeFeatureStatus(rowData);

			},
			atTheFront : true
		}, {
			uiButton : {
				label : 'Disabled'
			},
			click : function(evtObj, uniqueIndex, rowData) {
				rowData.Status = "disabled";
				ChangeFeatureStatus(rowData);
			},
			atTheFront : true
		}, {
			uiButton : {
				label : 'Failed'
			},
			click : function(evtObj, uniqueIndex, rowData) {
				rowData.Status = "failed";
				ChangeFeatureStatus(rowData);
			},
			atTheFront : true
		}, {
			uiButton : {
				label : 'Not Attempted'
			},
			click : function(evtObj, uniqueIndex, rowData) {
				rowData.Status = "not attempted";
				ChangeFeatureStatus(rowData);
			},
			atTheFront : true
		} ],
		hideButtons : {
			insert : true,
			moveUp : true,
			moveDown : true,
			removeLast : true,
			remove : true,
			append : true
		}

	});

	$('#btncreatesession').click(function() {
		$.ajax({
			type : "POST",
			url : "/createsession",
			data : {
				"agentip" : $('#tagentip').val()
			},
			success : function(result) {
				if (result.length > 0) {
					UpdateMessageinWeb(JSON.parse(result));
				}
			}
		});
	})

	var SERVICE_NAME_LAPTOPAGENT = "DeviceManagementAgent"
	var SERVICE_NAME_BOOTLOADER = "DeviceManagementAgentBootLoader"

	$('#btnstopbootloader').click(function() {
		$.ajax({
			type : "POST",
			url : "/servicemanage",
			data : {
				"name" : SERVICE_NAME_BOOTLOADER,
				"command" : "stop"
			},
			success : function(result) {
				/*
				 * if (result.length > 0) {
				 * UpdateMessageinWeb(JSON.parse(result)); }
				 * 
				 */
			}
		});
	})

	$('#btnstartbootloader').click(function() {
		$.ajax({
			type : "POST",
			url : "/servicemanage",
			data : {
				"name" : SERVICE_NAME_BOOTLOADER,
				"command" : "start"
			},
			success : function(result) {
				/*
				 * if (result.length > 0) {
				 * UpdateMessageinWeb(JSON.parse(result)); }
				 * 
				 */
			}
		});
	})

	$('#btnstopagent').click(function() {
		$.ajax({
			type : "POST",
			url : "/servicemanage",
			data : {
				"name" : SERVICE_NAME_LAPTOPAGENT,
				"command" : "stop"
			},
			success : function(result) {
				/*
				 * if (result.length > 0) {
				 * UpdateMessageinWeb(JSON.parse(result)); }
				 * 
				 */
			}
		});
	})

	$('#btnstartagent').click(function() {
		$.ajax({
			type : "POST",
			url : "/servicemanage",
			data : {
				"name" : SERVICE_NAME_LAPTOPAGENT,
				"command" : "start"
			},
			success : function(result) {
				/*
				 * if (result.length > 0) {
				 * UpdateMessageinWeb(JSON.parse(result)); }
				 * 
				 */
			}
		});
	})

	$('#btnclosesession').click(function() {
		$.ajax({
			type : "POST",
			url : "/closesession",
			data : {
				"agentip" : $('#tagentip').val()
			},
			success : function(result) {
				if (result.length > 0) {
					UpdateMessageinWeb(JSON.parse(result));
				}
			}
		});
	})

	$('#btnlogin').click(function() {
		$.ajax({
			type : "POST",
			url : "/login",
			data : {
				"username" : $('#username').val(),
				"password" : $('#password').val(),
				"agentip" : $('#tagentip').val()
			},
			success : function(result) {
				if (result.length > 0) {
					UpdateMessageinWeb(JSON.parse(result));
				}
			}
		});
	})

	$('#btnlogoff').click(function() {
		$.ajax({
			type : "POST",
			url : "/logoff",
			data : {
				"username" : $('#username').val(),
				"agentip" : $('#tagentip').val()
			},
			success : function(result) {
				if (result.length > 0) {
					UpdateMessageinWeb(JSON.parse(result));
				}
			}
		});
	})
	
		
	$('#btnselfreg').click(function() {
		$.ajax({
			type : "POST",
			url : "/selfreg",
			data : {
				"agentip" : $('#tagentip').val()
			},
			success : function(result) {
				if (result.length > 0) {
					UpdateMessageinWeb(JSON.parse(result));
					var url = GetSelfRegURL(JSON.parse(result));
					$('#aselfreg').attr('href', url);
					$('#aselfreg').text(url);
				}			
			}
		});
	});

	$('#btnstatdevice').click(function() {
		$.ajax({
			type : "POST",
			url : "/statdevice",
			data : {
				"serialnumber" : $('#serialnumber').val(),
				"devicetype" : $('#devicetype').val(),
				"country" : $('#country').val(),
				"agentip" : $('#tagentip').val(),
				"usenc": $('#checkusenc').prop('checked')
			},
			success : function(result) {

				if (result.length > 0) {
					UpdateMessageinWeb(JSON.parse(result));
					UpdateFeatures(JSON.parse(result));
					UpdateHwSwComponent(JSON.parse(result));
				}

			}
		});
	})

	$('#btncreatedevice').click(function() {
		$.ajax({
			type : "POST",
			url : "/createdevice",
			data : {
				"serialnumber" : $('#serialnumber').val(),
				"devicetype" : $('#devicetype').val(),
				"country" : $('#country').val(),
				"agentip" : $('#tagentip').val()
			},
			success : function(result) {
				if (result.length > 0) {
					UpdateMessageinWeb(JSON.parse(result));
				}
			}
		});
	})
	
	$('#btnsyncdevicecfg').click(function() {
		var sw = $('#tbsoftware').appendGrid('getAllValue');
		var hw = $('#tbhardware').appendGrid('getAllValue');
		
		$.ajax({
			type : "POST",
			url : "/syncdevicecfg",
			data : {
				"serialnumber" : $('#serialnumber').val(),
				"devicetype" : $('#devicetype').val(),
				"country" : $('#country').val(),
				"software" : JSON.stringify(sw),
				"hardware" : JSON.stringify(hw),
				"agentip" : $('#tagentip').val()
			},
			success : function(result) {
				if (result.length > 0) {
					UpdateMessageinWeb(JSON.parse(result));
				}
			}
		});
	})
	
	

	$('#btngetheaders').click(function() {
		$.ajax({
			type : "POST",
			url : "/getheaders",
			data : {
				"serialnumber" : $('#serialnumber').val(),
				"devicetype" : $('#devicetype').val(),
				"agentip" : $('#tagentip').val()
			},
			success : function(result) {
				if (result.length > 0) {
					UpdateMessageinWeb(JSON.parse(result));
					ProcHeaders(JSON.parse(result));
				}

			}
		});
	})

	$('#btngetrules').click(function() {
		$.ajax({
			type : "POST",
			url : "/getrules",
			data : {
				"serialnumber" : $('#serialnumber').val(),
				"devicetypename" : $('#devicetype')[0].options[$('#devicetype')[0].selectedIndex].text,
				"devicetype" : $('#devicetype').val(),
				"agentip" : $('#tagentip').val()
			},
			success : function(result) {
				if (result.length > 0) {
					UpdateMessageinWeb(JSON.parse(result));
					ProcRules(JSON.parse(result));
				}

			}
		});
	})

	$('#btnpostnotification').click(function() {
		var sw = $('#tbsoftware').appendGrid('getAllValue');
		var hw = $('#tbhardware').appendGrid('getAllValue');

		$.ajax({
			type : "POST",
			url : "/postnotification",
			data : {
				"serialnumber" : $('#serialnumber').val(),
				"devicetype" : $('#devicetype').val(),
				"country" : $('#country').val(),
				"software" : JSON.stringify(sw),
				"hardware" : JSON.stringify(hw),
				"agentip" : $('#tagentip').val()
			},
			success : function(result) {
				if (result.length > 0) {
					UpdateMessageinWeb(JSON.parse(result));
				}
			}
		});

	});
	$('#btnsend').click(function() {
		$.ajax({
			type : "POST",
			url : "/sendMessage",
			data : {
				"request" : $('#tarequest').val(),
				"agentip" : $('#tagentip').val()
			},
			success : function(result) {
				if (result.length > 0) {
					UpdateMessageinWeb(JSON.parse(result));
				}
			}
		});
	})

	$('#btnrandomserialnumber').click(function() {

		var snpattern = ""
		var devicetype = $('#devicetype').val()
		if (devicetype == '7a85f0c9-531e-4754-ad68-04c77ed63657') {
			snpattern = /35[Bb]((\d{2}[Pp]\d{4})|\d{7})/
		} else if (devicetype == '61e08b77-df3c-4735-9f3b-0b42efb7bdcf') {
			snpattern = /[Vv](\d{7})([Ss]|[Aa]|(([AaBbCcSs])[Xx]))/
		} else if (devicetype == '3B682913-6D1E-4355-9E48-208EB7061A3D') {
			snpattern = /[Tt]\d[A-La-l]((\d{4})[Ee]|(\d{5})([Ee]|[Ee][Xx]))/
		} else if (devicetype == 'DACD7FA1-9D67-4057-9952-C55F8EA6227B') {
			snpattern = /[Tt]\d[A-La-l]((\d{4})[Ee]|(\d{5})([Ee]|[Ee][Xx]))/
		} else if (devicetype == 'BD5CE934-26AE-484A-8395-EB0FD29F6838') {
			snpattern = /[Pp]\d[A-La-l](\d{4})([Tt]|[Jj]|([JjTt][Xx]))/
		} else if (devicetype == 'C1FF0EB8-1CD7-4448-BD06-406B2F93E725') {
			snpattern = /[Pp]\d[A-La-l](\d{4})([Tt]|[Jj]|([JjTt][Xx]))/
		} else {

		}
		var sn = new RandExp(snpattern).gen()

		$('#serialnumber').val(sn)

	})

	$("#devicetype").change(function() {

		var devicetype = $('#devicetype').val()
		if (devicetype == '7a85f0c9-531e-4754-ad68-04c77ed63657') {

			initswdata = [ {
				'ComponentType' : 'software',
				'Name' : 'BdSoftware',
				'PartNumber' : '10125908',
				'Revision' : 'A'
			} ];

			inithwdata = [ {
				'Name' : 'BdPcba',
				'PartNumber' : '11111111',
				'Revision' : 'X00'
			}, {
				'Name' : 'GuiPcba',
				'PartNumber' : '21111111',
				'Revision' : 'X00'
			} ];

		} else if (devicetype == '61e08b77-df3c-4735-9f3b-0b42efb7bdcf') {

			initswdata = [ {
				'ComponentType' : 'software',
				'Name' : 'Control',
				'PartNumber' : '0',
				'Revision' : '01.08.01'
			} ];

			inithwdata = [ {
				'Name' : 'WINTEL',
				'PartNumber' : 'ABC',
				'Revision' : '1.0'
			}, {
				'Name' : 'Control Board',
				'PartNumber' : '0',
				'Revision' : '0'
			} ];

		} else if (devicetype == '3B682913-6D1E-4355-9E48-208EB7061A3D') {

			initswdata = [ {
				'ComponentType' : 'software',
				'Name' : 'Valleylab LS10 Software Package',
				'PartNumber' : '0',
				'Revision' : '00.62'
			} ];
			inithwdata = [ {
				'Name' : 'Main PCBA',
				'PartNumber' : '0008675309',
				'Revision' : '00'
			}, {
				'Name' : 'VIBE',
				'PartNumber' : 'JDK-1901',
				'Revision' : 'F'
			} ];

		}else if (devicetype == 'CEFC1E07-CFF6-4F27-AB05-4577A33A1BA8'){
			initswdata = [ {
				'ComponentType' : 'software',
				'Name' : 'Perc',
				'PartNumber' : '',
				'Revision' : '46'
			} ];
			inithwdata = [ {
				'Name' : 'Controller',
				'PartNumber' : '1078620',
				'Revision' : 'A'
			}, {
				'Name' : 'SteeringRelay',
				'PartNumber' : '1070817',
				'Revision' : 'A'
			} , {
				'Name' : 'Rf',
				'PartNumber' : '1070821',
				'Revision' : 'B'
			}, {
				'Name' : 'PowerSupply',
				'PartNumber' : '1054954',
				'Revision' : 'B'
			}, {
				'Name' : 'FrontPanel',
				'PartNumber' : '1078579',
				'Revision' : 'A'
			}, {
				'Name' : 'Vibe',
				'PartNumber' : '1070817',
				'Revision' : 'A'
			}];
			
			
			
		}else if (devicetype == '61BF648E-3181-41e4-9EF2-222F8DF8B538'){
			
			
		}else {
			initswdata = null;
			inithwdata = null;
		}

		$('#tbhardware').appendGrid('load', inithwdata);
		$('#tbsoftware').appendGrid('load', initswdata);

	});

	$('#btnuploadlog').click(function() {
		var file = $('#uploadfile').prop("files")[0];
		var form_data = new FormData();
		form_data.append("uploadfile", file);
		form_data.append("devicetype", $('#devicetype').val());
		form_data.append("logtype", $('#logtype').val());
		form_data.append("serialnumber", $('#serialnumber').val());
		form_data.append("agentip", $('#tagentip').val());

		$.ajax({
			type : "POST",
			url : "/uploadlog",
			data : form_data,
			contentType : false,
			processData : false,
			success : function(result) {
				UpdateMessageinWeb(JSON.parse(result));
			}
		});

	});

	$('#btnclientupdate').click(function() {
		var sw = $('#tbsoftware').appendGrid('getAllValue');
		$.ajax({
			type : "POST",
			url : "/clientupdate",
			data : {
				"serialnumber" : $('#serialnumber').val(),
				"devicetypename" : $('#devicetype')[0].options[$('#devicetype')[0].selectedIndex].text,
				"country" : $('#country').val(),
				"devicetypeuid" : $('#devicetype').val(),
				"software" : JSON.stringify(sw),
				"agentip" : $('#tagentip').val()
			},
			success : function(result) {
				if (result.length > 0) {
					UpdateMessageinWeb(JSON.parse(result));
				}
			}
		});

	})

})