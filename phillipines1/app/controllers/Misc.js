function sendEmail() {
	
	var emailDialog = Titanium.UI.createEmailDialog();
	emailDialog.setSubject('Candidate info as CSV');
	emailDialog.setToRecipients(['naoya_takahashi@relationsgroup.co.jp', 'takayuki_imanishi@relationsgroup.co.jp']);

	if (Ti.Platform.name == 'iPhone OS') {
		emailDialog.setMessageBody(getCandidatesAsCSV());
		emailDialog.setHtml(true);
		emailDialog.setBarColor('#336699');
	} else {
		emailDialog.setMessageBody(getCandidatesAsCSV());
	}
	
	//var file = saveAsCSV();
	//emailDialog.addAttachment(file);

	emailDialog.addEventListener('complete', function(e) {
		if (e.result == emailDialog.SENT) {
			if (Ti.Platform.osname != 'android') {
				// android doesn't give us useful result codes.
				// it anyway shows a toast.
				alert("message was sent");
			}
		} else {
			alert("message was not sent. result = " + e.result);
		}
	});
	emailDialog.open();
}

function sendEmailWithAttachment() {
	
	var emailDialog = Titanium.UI.createEmailDialog();
	emailDialog.setSubject('Candidate info as CSV');
	emailDialog.setToRecipients(['naoya_takahashi@relationsgroup.co.jp', 'takayuki_imanishi@relationsgroup.co.jp']);

	if (Ti.Platform.name == 'iPhone OS') {
		//emailDialog.setMessageBody(getCandidatesAsCSV());
		emailDialog.setMessageBody("Sending CSV");
		emailDialog.setHtml(true);
		emailDialog.setBarColor('#336699');
	} else {
		//emailDialog.setMessageBody(getCandidatesAsCSV());
		emailDialog.setMessageBody("Sending CSV");
	}
	
	var file = saveAsCSV();
	emailDialog.addAttachment(file);

	emailDialog.addEventListener('complete', function(e) {
		if (e.result == emailDialog.SENT) {
			if (Ti.Platform.osname != 'android') {
				// android doesn't give us useful result codes.
				// it anyway shows a toast.
				alert("message was sent");
			}
		} else {
			alert("message was not sent. result = " + e.result);
		}
	});
	emailDialog.open();
}

function getCandidatesAsCSV(){
	
	Alloy.Collections.Candidate.fetch();	
	return convertTocsv(Alloy.Collections.Candidate);
}

function convertTocsv(candidates) {
	
	var csv = '';
	var counter = 0;
	candidates.forEach(function(row){
    	
    	var json = JSON.parse(JSON.stringify(row));
    	
    	// ヘッダを出力する
    	if(counter == 0){
	    	for(key in json){
	    		//console.log("key: " + key);
	    		csv += '"' + key + '",';
	    	}
	    	csv += "\r\n";
   		}
   		for(key in json){
    		//console.log("val: " + json[key]);
    		csv += '"' + json[key] + '",';
    	}
    	csv += "\r\n";
    	counter ++;
	});

    return csv;
};

function saveAsCSV() {

	var data = getCandidatesAsCSV();

	if (Ti.Platform.osname == 'iphone') {

	} else {
		
		var file = Ti.Filesystem.getFile(Ti.Filesystem.applicationDataDirectory, "candidate.csv");
		file.write(data);
		
		return file;
	}

}

//[ERROR] :  EmailDialogProxy: (KrollRuntimeThread) [9870,18655] Unable to attach file generated_filename.txt: /mnt/sdcard/jp.co.relationsgroup.phillipines1/temp/generated_filename.txt (Permission denied)
//[ERROR] :  EmailDialogProxy: java.io.FileNotFoundException: /mnt/sdcard/jp.co.relationsgroup.phillipines1/temp/generated_filename.txt (Permission denied)
