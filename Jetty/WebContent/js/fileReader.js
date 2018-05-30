var _selectedFiles;
var _totalProteinsCount = 0;
var _uploadedProteinsCount = 0;
var _fastaList = [];
var _firstfasta = true;
var _sparkInfoIntervalId;

//browse clicked
function getFilesFromEvent(evt) {
	$("#spinner_browse").css("display", "inherit");
	disableInputButtons();
	_selectedFiles = evt.target.files
    readSelectedFiles();
}

function disableInputButtons(){
	$("#button_send_again").prop('disabled', true);
}

function enableInputButtons(){
	$("#button_send_again").prop('disabled', false);
	$(".spinner").css("display", "none");
}

function readSelectedFiles(){
	_totalProteinsCount = 0;
	_uploadedProteinsCount = 0;
	_firstfasta = true;
	$("#progress_bar").css("display", "block");
	$('.progress-bar').attr('aria-valuenow', 0+'%').css('width', 0+'%');
	
	
	if (_selectedFiles) {
        for (var i = 0, f; f = _selectedFiles[i]; i++) {
        	var r = new FileReader();
            
            r.onload = (function (f) {
                return function (e) {
                	_totalProteinsCount += (e.target.result.match(/>/g) || []).length;
                    parseFile(e.target.result);
                };
            })(f);
            r.readAsText(f);
            
        }
    } else {
    	console.log("Failed to load selected files");
    }
}
document.getElementById('openFile').addEventListener('change', getFilesFromEvent, false);

/**
 * This method parses the mgf file and maps all fastatra to type fastatrum.
 * fastatra are stored in a list
 * uploadJson is called when first spetrum is parsed
 *
 * @param content - content of mgf file
 */

function parseFile(content){
	while(content.indexOf(">") > -1){
		var fasta = new FastaObject();
		console.log("test");
		try{
		    fasta.db = content.substring(content.indexOf(">")+1,content.indexOf("|"));
		    content = content.substring(content.indexOf("|")+1, content.length);
		    fasta.accession = content.substring(0, content.indexOf("|"));
		    content = content.substring(content.indexOf("|")+1, content.length);
		    fasta.description = content.substring(0,content.indexOf("\n"));
	        content = content.substring(content.indexOf("\n")+1, content.length);
	        fasta.amino = content.substring(0,content.indexOf("\n"));
	        content = content.substring(content.indexOf("\n")+1, content.length);
		}catch(e){
			console.log(e);
		}

        _fastaList.push(fasta);
        if(_firstfasta == true){
        	uploadJson();
        	_firstfasta = false;
//        	setTimeout(() => {
//        		_sparkInfoIntervalId = setInterval(() => {
//            		getSparkInfo();
//            	}, 2000);
//        	}, 3000);
        }
        	
    }
    
}

/**
 * This method sends one item of fastaList to rest interface as json
 * recursive as long as list isn't empty
 * progress is set accordingly
 * 
 */

function uploadJson(){
	$.ajax({
    	type: "POST",
    	contentType: "application/json",
    	url: "rest/fasta/sendfasta",
    	data: JSON.stringify(_fastaList.splice(0,1)[0]),
    	cache: false,
    	success: function(msg){
    		_uploadedProteinsCount++; 
            let progress = (_uploadedProteinsCount / _totalProteinsCount) * 100;
            $('.progress-bar').attr('aria-valuenow', (progress)+'%').css('width', progress+'%').text(_uploadedProteinsCount+' fastatra uploaded.');
            if(_uploadedProteinsCount >= _totalProteinsCount)
            	enableInputButtons();
            
            if(_fastaList.length > 0)
            	uploadJson();
    	}
    });
}

function sendFilesAgain(){
	if(_selectedFiles != undefined){
		$("#spinner_send_again").css("display", "inherit");
		disableInputButtons();
		readSelectedFiles();
	}
}

