import { showError } from "./helper";

//verifying document's format and size 
export const verifyDoc = async (doc, type) => {
    //formats which are alloweded
    var allowedFormats = [
        'image/png',
        'image/jpeg',
        'image/jpg',
        'application/pdf',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document', // for .docx
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', // for .xlsx
        'application/vnd.ms-excel', // for .xls
        'text/plain' // for .txt
    ];


    // getting file-size 
    var size = type == "fileType" ? doc[0].size : doc.size;
    // getting file-type
    var fileType = type == "fileType" ? doc[0].type : doc.mime;



    //converting to MB 
    var sizeInMb = (size / (1024 * 1024));
    // console.log("Size of doc (in MB):", sizeInMb);



    //if filesize greater than 20Mb showError
    if (sizeInMb >= 21) {
        showError("file more than 20MB is not allowed");
        return { isValid: false, message: "" };

    }
    //if  the filetype other than the allowedformats showError 

    else if (!allowedFormats.includes(fileType)) {
        console.log("filetypes:", fileType);
        showError("Unsupported file type. Please upload a file in PNG, JPEG, PDF, DOC, or Excel format.");
        return { isValid: false, message: "" };
    }
    //if filesize<20 and formats included in allowed format
    else {
        console.log("sizeInMb < 21 && allowedFormats.includes(fileType")

        return { isValid: true, message: doc };
    }
}