//Call LIVE UPDATE function repeatedly
//var reloadPage = setInterval(function(){fnReload()}, 1000); 
//var reloadTime = setInterval(function(){fnDateToday()},1000);


// =================================================
// Date and Clock
// =================================================
var ampm = "";

function fnDateToday() {
    $("#dateTodayWeekday").html(moment().format('dddd'));
    $("#dateTodayDate").html(moment().format("Do of MMM, YYYY"));
    $("#clockHour").html(moment().format('h'));
    $("#clockMinute").html(moment().format('mm'));
    ampm = moment().format('hh:mm:ss A');

    ampm = ampm.substring(15, 8);
    $("#clockAMPM").html(ampm);
}

// ========================================================
// Live Update: Counters, Headlines, Urgent,  Alerts, etc.
// ========================================================
var underload = 20; //Underload value
var capacity = 60; //Total capacity per day
var timeOut = 60000; //Timeout from data sync in milliseconds
var timeOut_layback = 3600000; //Timeout from layback script's idleness in milliseconds

//Flags and temp data holders
var headline = "";
var trakit = 0;
var trakitData = "";
var encStatus = "";
var transferStatus = "";
var laybackStatus = "";
var lastUpdate = "";
var lastUpdate_layback = "";
var attentionSeeker = 0;
var barHeightChecker = 0;

// ========================================================
// Audio container
// ========================================================
var audio = new Audio("doorbell.wav");

/*
$( document ).ready(function() {

    $(".loadSummaryNumber, .loadSummaryLabel, #divHeader, #divFooter, #footerLeft").blurjs({
                source: 'body', 
                overlay: 'rgba(255,255,255,0.2)',
                radius: 30,
                cache: true
                
        });
}); 
*/

$(function() {
    // body...
    $('.loadDetails').scrollbox();

    var socket = io();


    function reloadData() {

        function displayProgressBar(directories) {
            var percentage = (directories.length / capacity) * 100;
            var barHeight = 550 * (percentage / 100);

            $('#super-skill').animate({ height: barHeight + 'px' }, 2500);

        }

        $("#workloadHK").load("/hongkong", function(data) {

            var directories = JSON.parse(data);

            if (directories.length == 0) {
                $("#workloadHK").html("&#10004");
            } else {
                $("#workloadHK").html(directories.length);
            }

            $('#workloadHKFiles ul').empty();

            directories.forEach(function(folder) {
                var html = "<li>" + folder.name + " - file count: " + folder.fileCount + "</li>"
                $('#workloadHKFiles ul').append(html);
            });

            //color coding: GREEN = No Workload / BLUE = Normal workload / RED = High volume
            if (directories.length == 0) {
                $("#loadSummaryLabel1").css("background-color", "#689f38")
            } else if (directories.length >= underload) {
                $("#loadSummaryLabel1").css("background-color", "#d32f2f")
            } else {
                $("#loadSummaryLabel1").css("background-color", "#1976d2")
            }

            displayProgressBar(directories);

        });

        $("#workloadTW").load("/taiwan", function(data) {

            var directories = JSON.parse(data);

            if (directories.length == 0) {
                $("#workloadTW").html("&#10004");
            } else {
                $("#workloadTW").html(directories.length);
            }

            $('#workloadTWFiles ul').empty();

            directories.forEach(function(folder) {
                var html = "<li>" + folder.name + " - file count: " + folder.fileCount + "</li>"
                $('#workloadTWFiles ul').append(html);
            });

            //color coding: GREEN = No Workload / BLUE = Normal workload / RED = High volume
            if (directories.length == 0) {
                $("#loadSummaryLabel1").css("background-color", "#689f38")
            } else if (directories.length >= underload) {
                $("#loadSummaryLabel1").css("background-color", "#d32f2f")
            } else {
                $("#loadSummaryLabel1").css("background-color", "#1976d2")
            }
        });


        $("#workloadFullQC").load("/fullqc", function(data) {

            var directories = JSON.parse(data);

            if (directories.length == 0) {
                $("#workloadFullQC").html("&#10004");
            } else {
                $("#workloadFullQC").html(directories.length);
            }

            $('#workloadFullQCFiles ul').empty();

            directories.forEach(function(folder) {
                var html = "<li>" + folder.name + " - file count: " + folder.fileCount + "</li>"
                $('#workloadFullQCFiles ul').append(html);
            });

            //color coding: GREEN = No Workload / BLUE = Normal workload / RED = High volume
            if (directories.length == 0) {
                $("#loadSummaryLabel1").css("background-color", "#689f38")
            } else if (directories.length >= underload) {
                $("#loadSummaryLabel1").css("background-color", "#d32f2f")
            } else {
                $("#loadSummaryLabel1").css("background-color", "#1976d2")
            }
        });

        $("#workloadDubbed").load("/dubbed", function(data) {

            var directories = JSON.parse(data);

            if (directories.length == 0) {
                $("#workloadDubbed").html("&#10004");
            } else {
                $("#workloadDubbed").html(directories.length);
            }

            $('#workloadDubbedFiles ul').empty();

            directories.forEach(function(folder) {
                var html = "<li>" + folder.name + " - file count: " + folder.fileCount + "</li>"
                $('#workloadDubbedFiles ul').append(html);
            });

            //color coding: GREEN = No Workload / BLUE = Normal workload / RED = High volume
            if (directories.length == 0) {
                $("#loadSummaryLabel1").css("background-color", "#689f38")
            } else if (directories.length >= underload) {
                $("#loadSummaryLabel1").css("background-color", "#d32f2f")
            } else {
                $("#loadSummaryLabel1").css("background-color", "#1976d2")
            }
        });

        $("#workloadMixed").load("/mixed", function(data) {

            var directories = JSON.parse(data);

            if (directories.length == 0) {
                $("#workloadMixed").html("&#10004");
            } else {
                $("#workloadMixed").html(directories.length);
            }

            $('#workloadDubbedFiles ul').empty();

            directories.forEach(function(folder) {
                var html = "<li>" + folder.name + " - file count: " + folder.fileCount + "</li>"
                $('#workloadMixedFiles ul').append(html);
            });

            //color coding: GREEN = No Workload / BLUE = Normal workload / RED = High volume
            if (directories.length == 0) {
                $("#loadSummaryLabel1").css("background-color", "#689f38")
            } else if (directories.length >= underload) {
                $("#loadSummaryLabel1").css("background-color", "#d32f2f")
            } else {
                $("#loadSummaryLabel1").css("background-color", "#1976d2")
            }
        });

        $("#workloadTQC").load("/tqc", function(data) {

            var directories = JSON.parse(data);

            if (directories.length == 0) {
                $("#workloadTQC").html("&#10004");
            } else {
                $("#workloadTQC").html(directories.length);
            }

            $('#workloadTQCFiles ul').empty();

            directories.forEach(function(folder) {
                var html = "<li>" + folder.name + " - file count: " + folder.fileCount + "</li>"
                $('#workloadTQCFiles ul').append(html);
            });

            //color coding: GREEN = No Workload / BLUE = Normal workload / RED = High volume
            if (directories.length == 0) {
                $("#loadSummaryLabel1").css("background-color", "#689f38")
            } else if (directories.length >= underload) {
                $("#loadSummaryLabel1").css("background-color", "#d32f2f")
            } else {
                $("#loadSummaryLabel1").css("background-color", "#1976d2")
            }
        });

        $("#workloadFailed").load("/failed", function(data) {

            var directories = JSON.parse(data);

            if (directories.length == 0) {
                $("#workloadFailed").html("&#10004");
            } else {
                $("#workloadFailed").html(directories.length);
            }

            $('#workloadFailedFiles ul').empty();

            directories.forEach(function(folder) {
                var html = "<li>" + folder.name + " - file count: " + folder.fileCount + "</li>"
                $('#workloadFailedFiles ul').append(html);
            });

            //color coding: GREEN = No Workload / BLUE = Normal workload / RED = High volume
            if (directories.length == 0) {
                $("#loadSummaryLabel1").css("background-color", "#689f38")
            } else if (directories.length >= underload) {
                $("#loadSummaryLabel1").css("background-color", "#d32f2f")
            } else {
                $("#loadSummaryLabel1").css("background-color", "#1976d2")
            }
        });
    }

    reloadData();

    socket.on('file create', function(data) {
        reloadData();
    });

    // socket.on('file delete', function(data) {
    //     $('#servermsg').html(data + "was deleted");
    // });
});

function fnReload() {
    $(document).ready(function() {
        // Disable caching of AJAX responses
        $.ajaxSetup({
            cache: false
        });



        //COUNTERS = data1: Transcoding | data2: For Calibration | data3: Trakit | data4: Atlas
        $("#dailyCapacity").load("data/data0.txt", function(data) {
            var barHeight = 0; // 0 - 600
            var labelYPos = 200; // 200 - 800 (+200)
            var myPercentage = parseFloat(data / capacity * 100);

            barHeight = parseFloat((data / capacity) * 600).toFixed(0);

            if (myPercentage > 100) {
                $("#myBar").css("background-color", "#b71c1c");
            } else if (myPercentage == 100) {
                $("#myBar").css("background-color", "#c62828");
                $("#myBar").css("height", barHeight + "px");
            } else if (myPercentage >= 90 && myPercentage < 100) {
                $("#myBar").css("height", barHeight + "px");
                $("#myBar").css("background-color", "#d32f2f");
            } else if (myPercentage >= 80 && myPercentage < 90) {
                $("#myBar").css("height", barHeight + "px");
                $("#myBar").css("background-color", "#558b2f");
            } else {
                $("#myBar").css("height", barHeight + "px");
                $("#myBar").css("background-color", "#7cb342");
            }

            labelYPos = parseInt($("#myBar").css("height")) + 190;
            $("#dailyCapacity").css("bottom", labelYPos + "px");
            $("#totalFiles").css("bottom", parseInt(labelYPos - 22) + "px");
            $("#dailyCapacity").html(parseFloat(data / capacity * 100).toFixed(1) + "% -");
            $("#totalFiles").html(data + " file/s");
        });

        $("#workloadData1").load("data/data1.txt", function(data) {
            if (data == 0) {
                $("#workloadData1").html("&#10004");
            } else {
                $("#workloadData1").html(data);
            }

            //color coding: GREEN = No Workload / BLUE = Normal workload / RED = High volume
            if (data == 0) {
                $("#loadSummaryLabel1").css("background-color", "#689f38")
            } else if (data >= underload) {
                $("#loadSummaryLabel1").css("background-color", "#d32f2f")
            } else {
                $("#loadSummaryLabel1").css("background-color", "#1976d2")
            }
        });

        $("#workloadData2").load("data/data2.txt", function(data) {
            if (data == 0) {
                $("#workloadData2").html("&#10004");
            } else {
                $("#workloadData2").html(data);
            }

            //color coding: GREEN = No Workload / BLUE = Normal workload / RED = High volume
            if (data == 0) {
                $("#loadSummaryLabel2").css("background-color", "#689f38")
            } else if (data >= underload) {
                $("#loadSummaryLabel2").css("background-color", "#d32f2f")
            } else {
                $("#loadSummaryLabel2").css("background-color", "#1976d2")
            }
        });

        $("#loader").load("data/data3.txt", function(data) {
            trakit = data;
            //$("#workloadData3").html(data);
            //if (data <= underload) {$("#workloadData3").css("color","black")} else {$("#workloadData3").css("color","red")}
        });

        $("#workloadData4").load("data/data4.txt", function(data) {
            data = parseFloat(data.trim()) + parseFloat(trakit);
            if (data == 0) {
                $("#workloadData4").html("&#10004");
            } else {
                $("#workloadData4").html(data);
            }

            //color coding: GREEN = No Workload / BLUE = Normal workload / RED = High volume
            if (data == 0) {
                $("#loadSummaryLabel3").css("background-color", "#689f38")
            } else if (data >= underload) {
                $("#loadSummaryLabel3").css("background-color", "#d32f2f")
            } else {
                $("#loadSummaryLabel3").css("background-color", "#1976d2")
            }
        });



        //SERVICES = Encryption, File Transfer, and Layback (MPGX.bat ; !DONE.bat ; LAYBACK.bat)
        $("#workloadMPGXScript").load("data/service_encryption.txt", function(data) {
            encStatus = data.replace(/\n/g, "");
            if (data.replace(/\n/g, "").substring(0, 4) == "Idle") { $("#loaderEnc").css("visibility", "hidden"); } else { $("#loaderEnc").css("visibility", "visible"); }
            $("#workloadMPGXScript").html(data);
            $("#workloadMPGXScript").css("text-align", "left");
        });

        $("#workloadDoneScript").load("data/service_filetransfer.txt", function(data) {
            transferStatus = data.replace(/\n/g, "");
            if (data.replace(/\n/g, "").substring(0, 4) == "Idle") { $("#loaderTransf").css("visibility", "hidden"); } else { $("#loaderTransf").css("visibility", "visible"); }
            $("#workloadDoneScript").html(data);
            $("#workloadDoneScript").css("text-align", "left");
        });

        if (parseFloat(Date.now()) > parseFloat(lastUpdate_layback + timeOut_layback) && parseFloat(lastUpdate_layback + timeOut_layback) > timeOut_layback) {
            $("#workloadLaybackScript").html("<font color=yellow><b>ERROR</b> :</font> Script is not running");
        } else {
            $("#workloadLaybackScript").load("data/service_layback.txt", function(data) {
                laybackStatus = data.replace(/\n/g, "");
                if (data.replace(/\n/g, "").substring(0, 4) == "Idle") { $("#loaderLayback").css("visibility", "hidden"); } else { $("#loaderLayback").css("visibility", "visible"); }
                $("#workloadLaybackScript").html(data);
                $("#workloadLaybackScript").css("text-align", "left");
            });
        }


        //PROGRAM VERSION
        //$("#workloadLU").load("data/lu.txt");
        $("#workloadCopyright").load("data/copyright.txt");

        //SHOW URGENT (Z:\!DVIMMP\!URGENT)
        $("#workloadData5").load("data/data5.txt", function(data) {
            data = parseFloat(data.trim());
            if (data == 0) {
                $("#workloadData5").html("&#10004");
            } else {
                $("#workloadData5").html(data);
            }
        });

        $("#workloadData6").load("data/data6.txt", function(data) {
            data = parseFloat(data.trim());
            if (data == 0) {
                $("#workloadData6").html("&#10004");
            } else {
                $("#workloadData6").html(data);
            }
        });

        $("#workloadUrgent").load("data/urgent.txt", function(data) {
            if (data == "") {
                $("#urgentCAL").css("display", "none");
            } else {
                $("#workloadUrgent").html(data.replace(/\n/g, "<br />"));
                $("#urgentCAL").css("display", "inline-block");
                //$("#tblUrgent").css("display","block");
            }
        });

        $("#workloadUrgent_QA").load("data/urgent_qa.txt", function(data) {
            if (data == "") {
                $("#urgentQA").css("display", "none");
            } else {
                $("#workloadUrgent_QA").html(data.replace(/\n/g, "<br />"));
                $("#urgentQA").css("display", "inline-block");
                //$("#tblUrgent").css("display","block");
            }
        });

        if ($("#workloadUrgent_QA").html() || $("#workloadUrgent").html() != "") {
            $(".urgentContainer").css("visibility", "visible");
        } else {
            $(".urgentContainer").css("visibility", "hidden");
        }


        //SHOW MESSAGE BOX FOR FAILURES (Encryption failed & Invalid filenaming of mpgx,dvi,mmp)
        /**
        if (parseFloat(Date.now()) > parseFloat(lastUpdate + timeOut) && parseFloat(lastUpdate + timeOut) > timeOut) {
            $(".messageBoxLabel").css("background-color","#d50000");
            $("#messageBoxLabelText").html("Displayed Information is Outdated");
            $("#messageBoxLabelDesc").html("The information that is displayed on this screen is not in real-time mode.");
            $("#messageBoxBodyText").html("Please check if the batch scripts are running properly or if PH-DTW-RHOZET is overloaded (CPU and Network usage). These are the possible factors which might be causing the slowdown of sending real-time data to this screen.<br><br>");
            $(".messageBox").css("visibility","visible");
        } else if (encStatus.substring(0,21) == "Encryption has failed") {
            $(".messageBoxLabel").css("background-color","#d50000"); //background-color: BLUE for information, RED for error/warning
            $("#messageBoxLabelText").html("MPEG1 Encryption Failure"); //Title
            $("#messageBoxLabelDesc").html("One or more title is at risk, please check below."); //Title description
            $("#messageBoxBodyText").html("CmdEncrypt.exe has failed to encrypt the file/s from the path below. Please check if it requires to be reprocessed and proceed accordingly. An email has been sent to you as well.<br><br>Z:\!_MPGXCACHE\!_ENCRYPTFAILED"); //Body text
            $(".messageBox").css("visibility","visible");
        } else if (transferStatus.substring(0,26) == "Integrity check has failed") {
            $(".messageBoxLabel").css("background-color","#0d47a1");
            $("#messageBoxLabelText").html("Invalid GTS File");
            $("#messageBoxLabelDesc").html("Filename integrity check has failed, see details below.");
            $("#messageBoxBodyText").html("We cannot proceed because of an invalid renaming of MPGX, DVI, and MMP. Please check this ASAP. An email has been sent to you as well.<br><br>Z:\!DVIMMP\!DONE");
            $(".messageBox").css("visibility","visible");
        } else {
            $(".messageBox").css("visibility","hidden");
        }
        
        if ($(".messageBox").css("visibility") == "visible" || $(".urgentContainer").css("visibility") == "visible"){//} || $(".weatherUpdate").css("visibility") == "visible"){
            if (attentionSeeker == 0){
                audio.play();
                $("#cover").fadeIn();
                $("#cover").fadeOut(200);
                $("#cover").fadeIn();
                $("#cover").fadeOut(200);
                $("#cover").fadeIn();
                $("#cover").fadeOut(200);
                $("#cover").fadeIn();
                $("#cover").fadeOut(200);
                $("#cover").fadeIn();
                $("#cover").fadeOut(200);
                $("#cover").fadeIn();
                attentionSeeker = 1;
            } else {
                // DO NOTHING
            }
        } else {
            $("#cover").fadeOut(1500);
            attentionSeeker = 0;
        }
        **/




        //FOOTER ANNOUNCEMENT
        /*
        $("#loader").load("data/headline.txt", function(data){
            if (data == ""){
                $("#workloadFooter").css("visibility","hidden");
            } else {
                if (headline == data) {
                } else {
                    headline = data;
                    $("#workloadFooter").html(""+data+"");
                    $("#workloadFooter").css("visibility","visible");
                    $("#webticker").webTicker({speed:200});
                }
            }
        }); */


        //LIST OF ACTUAL FILES
        $("#workloadTranscoding").load("data/list1.txt", function(data) {
            if (data == "") {
                $("#workloadTranscoding").html("<h1>There are no files being transcoded right now.</h1>Probably, some files are still being downloaded.");
            } else {
                $("#workloadTranscoding").html(data.replace(/\n/g, "<br />"));
            }
        });

        $("#workloadForCalib").load("data/list2.txt", function(data) {
            if (data == "") {
                $("#workloadForCalib").html("<h1>No pending files for calibration.</h1>Calibrator may help with other task/s.");
            } else {
                $("#workloadForCalib").html(data.replace(/\n/g, "<br />"));
            }
        });

        $("#loader").load("data/list3.txt", function(data) {
            trakitData = data.replace(/\n/g, "<br />"); //retrieve Trakit data
        });
        $("#workloadAtlas").load("data/list4.txt", function(data) {
            if (data == "" && trakitData == "") {
                $("#workloadAtlas").html("<h1>All QAs were already released.</h1>QA releaser may help with other task/s.");
            } else {
                $("#workloadAtlas").html(data.replace(/\n/g, "<br />") + trakitData);
            }
        });

        //$("#workloadTransferring").load("data/list5.txt", function(data){$("#workloadTransferring").html(data.replace(/\n/g, "<br />"))});
        //$("#workloadOnHold").load("data/list6.txt", function(data){$("#workloadOnHold").html(data.replace(/\n/g, "<br />"))});

        $("#loader").css("visibility", "hidden");
    });
}
