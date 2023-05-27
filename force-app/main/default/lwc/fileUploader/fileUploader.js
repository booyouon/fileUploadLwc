import { LightningElement, api, wire } from "lwc";
import { getRecord } from "lightning/uiRecordApi";

import saveFileRelation from "@salesforce/apex/FileUploaderController.saveFileRelation";

export default class FileUploader extends LightningElement {
  @api recordId;
  acceptedFormats = [".pdf", ".png", ".jpeg", ".jpg"];
  multipleBoolean = false;

  @wire(getRecord, { recordId: "$recordId", fields: ["Account.Name"] })
  account;

  handleUploadFinished(event) {
    // Get the uploaded files
    const uploadedFiles = event.detail.files;

    // Process the uploaded files
    uploadedFiles.forEach((file) => {
      // Access file attributes
      console.log("File Name: " + file.name);
      console.log("Content Type: " + file.type);
      console.log("File Size: " + file.size);
      console.log("Document Id: " + file.documentId);

      // Save the file URL to the account record
      if (this.recordId) {
        saveFileRelation({
          accountId: this.recordId,
          fileName: 'website',
          fileURL: "/sfc/servlet.shepherd/document/download/" + file.documentId
        })
          .then((result) => {
            console.log("File URL saved successfully:", result);
          })
          .catch((error) => {
            console.error("Error saving file URL:", error);
          });
      }
    });
  }
}
