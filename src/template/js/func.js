function GetNotificationByOID(oid) {

	var result = null;

	$.ajax({
		type : "POST",
		async : false,
		url : "/getnotificationbyoid",
		data : {
			"oid" : oid,
			"agentip" : $('#tagentip').val()
		},
		success : function(r) {
			if (r.length > 0) {
				UpdateMessageinWeb(JSON.parse(r));
				result = r;
			}
		}
	});
	return result;
}

function UpdateGetAgentStatus(uniqueIndex) {
	var result = GetAgentStatus();

	$('#tbagentstatus').appendGrid('setCtrlValue', 'AgentStatus', uniqueIndex - 1, result.AgentStatus);
	$('#tbagentstatus').appendGrid('setCtrlValue', 'CacheTimeOut', uniqueIndex - 1, result.CacheTimeOut);
	$('#tbagentstatus').appendGrid('setCtrlValue', 'DataReady', uniqueIndex - 1, result.DataReady);
	$('#tbagentstatus').appendGrid('setCtrlValue', 'Datetime', uniqueIndex - 1, result.Datetime);
	$('#tbagentstatus').appendGrid('setCtrlValue', 'JobStatus', uniqueIndex - 1, result.JobStatus);
	$('#tbagentstatus').appendGrid('setCtrlValue', 'LastUpdate', uniqueIndex - 1, result.LastUpdate);
	$('#tbagentstatus').appendGrid('setCtrlValue', 'ServerAvailable', uniqueIndex - 1, result.ServerAvailable);
	$('#tbagentstatus').appendGrid('setCtrlValue', 'ServerStatus', uniqueIndex - 1, result.ServerStatus);
	$('#tbagentstatus').appendGrid('setCtrlValue', 'Timestamp', uniqueIndex - 1, result.Timestamp);
	$('#tbagentstatus').appendGrid('setCtrlValue', 'UploadTime', uniqueIndex - 1, result.UploadTime);
	$('#tbagentstatus').appendGrid('setCtrlValue', 'DownloadTime', uniqueIndex - 1, result.DownloadTime);
}

function UpgradeSoftware(data) {
	$.ajax({
		type : "POST",
		url : "/upgradesoftware",
		data : {
			"oid" : data.Oid,
			"pertinent_type" : data.PertinentType,
			"pertinent_identifier" : data.PertinentIdentifier,
			"part_number" : data.PartNumber,
			"revision" : data.Revision,
			"softwarename" : data.Name,
			"agentip" : $('#tagentip').val()

		},
		success : function(result) {
			if (result.length > 0) {
				UpdateMessageinWeb(JSON.parse(result));
			}
		}
	});
}

function SendInstallStatus(data, status) {
	$.ajax({
		type : "POST",
		url : "/sendinstallstatus",
		data : {
			"oid" : data.Oid,
			"pertinent_type" : data.PertinentType,
			"pertinent_identifier" : data.PertinentIdentifier,
			"part_number" : data.PartNumber,
			"revision" : data.Revision,
			"softwarename" : data.Name,
			"agentip" : $('#tagentip').val(),
			"installstatus" : status

		},
		success : function(result) {
			if (result.length > 0) {
				UpdateMessageinWeb(JSON.parse(result));
			}
		}
	});
}

function ViewDocument(data) {

	$.ajax({
		type : "POST",
		url : "/viewdocument",
		data : {
			"oid" : data.Oid,
			"pertinent_type" : data.PertinentType,
			"file_size" : data.Filesize * 1024000,
			"md5" : data.MD5,
			"location" : data.Location,
			"agentip" : $('#tagentip').val()
		},
		success : function(result) {
			if (result.length > 0) {
				UpdateMessageinWeb(JSON.parse(result));
			}
		}
	});

}

function UpdateMessageinWeb(result) {
	$('#tarequest').html(result.Request);
	$('#taresponse').html(result.Response);
	$('#tastatus').html(result.Status);

}

function ChangeFeatureStatus(feature) {
	$.ajax({
		type : "POST",
		url : "/changefeaturestatus",
		data : {
			"serialnumber" : $('#serialnumber').val(),
			"devicetype" : $('#devicetype').val(),
			"id" : feature.ID,
			"name" : feature.Name,
			"duration" : feature.Duration,
			"startdate" : new Date(feature.StartDate).getTime() / 1000,
			"term" : feature.Term - 1,
			"licensekey" : feature.LicenseKey,
			"licenseserialnumber" : feature.LicenseSerialNumber,
			"agentip" : $('#tagentip').val(),
			"status" : feature.Status

		},
		success : function(result) {
			if (result.length > 0) {
				UpdateMessageinWeb(JSON.parse(result));
			}
		}
	});
}

function UploadLog(log) {
	$.ajax({
		type : "POST",
		url : "/uploadlog",
		data : {
			"serialnumber" : $('#serialnumber').val(),
			"devicetype" : $('#devicetype').val(),
			"agentip" : $('#tagentip').val(),
			"type" : log.Type,
			"location" : log.Location

		},
		success : function(result) {
			if (result.length > 0) {
				UpdateMessageinWeb(JSON.parse(result));
			}
		}
	});

}

function UpdateFeatures(result) {
	var initData_available = new Array();
	var initData_entitled = new Array();
	var initData_enabled = new Array();
	if (result.ResMsg.Response.Notifications != null) {
		if (result.ResMsg.Response.Notifications.Notification[0].Body.Features != null) {
			var features = result.ResMsg.Response.Notifications.Notification[0].Body.Features.Feature;
			for (var i = 0; i < features.length; i++) {

				var feature = {
					"Type" : features[i].Type,
					"ID" : features[i].ID,
					"Name" : features[i].Name,
					"Description" : features[i].Description,
					"Duration" : features[i].Duration,
					"Term" : parseInt(features[i].Term) + 1,
					"agentip" : $('#tagentip').val(),
					"Status" : features[i].Status,
					"UpgradeRequired" : features[i].SoftwareUpgradeRequired
				};
				if (features[i].StartDate != "") {
					var t = new Date();
					t.setTime(features[i].StartDate * 1000);
					feature.StartDate = $.formatDateTime('mm/dd/yy', t);
				}
				if (features[i].Type == "entitledfeature") {
					initData_entitled.push(feature);

				} else if (features[i].Type == "enabledfeature" || features[i].Type == "demofeature") {
					initData_enabled.push(feature);

				} else if (features[i].Type == "availablefeature") {
					initData_available.push(feature);

				} else {
				}

			}

		}
	}
	$('#tbfeature_available').appendGrid('load', initData_available);
	$('#tbfeature_entitled').appendGrid('load', initData_entitled);
	$('#tbfeature_enabled').appendGrid('load', initData_enabled);
}

function UpdateHwSwComponent(result) {

	if (result.ResMsg.Response.Notifications != null) {
		var initData_hw = new Array();
		var initData_sw = new Array();
		components = result.ResMsg.Response.Notifications.Notification[0].Body.Components.Component;
		for (var i = 0; i < components.length; i++) {
			var component = {
				'ComponentType' : components[i].ComponentType,
				'Name' : components[i].Name,
				'PartNumber' : components[i].PartNumber,
				'Revision' : components[i].Revision
			};
			if (components[i].ComponentType == "hardware") {

				initData_hw.push(component);
			} else if (components[i].ComponentType == "software") {
				initData_sw.push(component);

			}

		}
		$('#tbhardware').appendGrid('load', initData_hw);
		$('#tbsoftware').appendGrid('load', initData_sw);

	}

}

function CheckNotificationObjectType(s) {
	var software = "24637560-edb3-4961-b17d-14e74f74457c";
	var releasenotes = "02d7aa7b-25e0-423f-8f98-c15612e6a7c0";
	var servicemanual = "c250c8db-b532-4d18-8956-420c3d637a41";
	var userguide = "f520b9ce-c641-5e29-9167-531d4e748b52";
	var other = "5789f84e-7f582-6e30-8289-692C57e59d63";

	if (s.search(software) > 0) {
		return "SOFTWARE";
	} else if (s.search(releasenotes) > 0) {
		return "RELEASE NOTES";
	} else if (s.search(servicemanual) > 0) {
		return "SERVICE MANUAL";
	} else if (s.search(userguide) > 0) {
		return "USER GUIDE";
	} else if (s.search(other) > 0) {
		return "OTHER";
	} else {
		return "";
	}
	return "";
}

function ProcHeaders(result) {

	var notes = result.ResMsg.Response.Notes.Note;

	var initdatasw = new Array();
	var initdatadoc = new Array();

	if (notes != null) {
		for (var i = 0; i < notes.length; i++) {
			var note = notes[i];
			var type = CheckNotificationObjectType(note.Header.PertinentType);

			var v = {
				"Oid" : note.Oid,
				
				"agentip" : $('#tagentip').val()
			}

			if (type == "SOFTWARE") {
				if (note.Components != null){
					v["Name"] = note.Components.Component[0].Name;
					v["Language"] = note.Components.Component[0].Language;
					v["Revision"] = note.Components.Component[0].Revision;
					v["PartNumber"] = note.Components.Component[0].PartNumber;
					v["Revision"] = note.Components.Component[0].Revision;
					
					if (note.Components.Component[0].Features != null){
						var featurenames = new Array();
						var feature = note.Components.Component[0].Features.Feature;
						for (var j = 0 ; j < feature.length; j++){
							featurenames.push(feature[j].Name);							
						}
						v["Features"] = featurenames.join(';');						
					}					
				}	
				initdatasw.push(v);
			} else {
				if (note.Components != null){
					v["Name"] = note.Components.Component[0].Name;
				}				
				initdatadoc.push(v);

			}

		}
	}

	$('#tbnotificationsw').appendGrid('load', initdatasw)
	$('#tbnotificationdoc').appendGrid('load', initdatadoc)

}

function ProcRules(result){
	var notes = result.ResMsg.Response.Notes.Note;

	var initdatarule = new Array();

	if (notes != null) {
		for (var i = 0; i < notes.length; i++) {
			var note = notes[i];
			var type = CheckNotificationObjectType(note.Header.PertinentType);

			var v = {
				"Oid" : note.Oid,
				"agentip" : $('#tagentip').val()
			}
			
			initdatarule.push(v);


		}
	}

	$('#tbnotificationrule').appendGrid('load', initdatarule)

}

function GetAgentStatus() {
	var initData = [ {
		AgentStatus : "",
		CacheTimeOut : "",
		DataReady : "",
		Datetime : "",
		JobStatus : "",
		LastUpdate : "",
		ServerAvailable : "",
		ServerStatus : "",
		Timestamp : "",
		UploadTime : "",
		DownloadTime : "",

	} ];
	$.ajax({
		type : "POST",
		url : "/getstatus",
		data : {
			"agentip" : $('#tagentip').val()
		},
		async : false,
		success : function(result) {

			if (result.length > 0) {
				var s = JSON.parse(result);
				var param = s.ResMsg.Response.Params;

				initData.AgentStatus = param.AgentStatus;
				initData.CacheTimeOut = param.CacheTimeOut;
				initData.DataReady = param.DataReady;
				initData.Datetime = param.Datetime;
				initData.JobStatus = param.JobStatus;
				initData.LastUpdate = param.LastUpdate;
				initData.ServerAvailable = param.ServerAvailable;
				initData.ServerStatus = param.ServerStatus;
				initData.Timestamp = param.Timestamp;
				initData.UploadTime = param.UploadTime;
				initData.DownloadTime = param.DownloadTime;

				UpdateMessageinWeb(JSON.parse(result));
			}

		}

	});

	return initData;
}

function GetSelfRegURL(result){
	return result.ResMsg.Response.Params.URL;
	
}
