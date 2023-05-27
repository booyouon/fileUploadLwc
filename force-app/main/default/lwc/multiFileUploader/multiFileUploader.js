import { LightningElement, api } from "lwc";

import saveFileRelation from "@salesforce/apex/FileUploaderController.saveFileRelation";

export default class FileUploader extends LightningElement {
  @api recordId;
  @api cardTitle = 'File Upload';
  @api fileFields = [
    {
      fieldApiName: "file_field_1__c",
      label: "Field 1"
    },
    {
      fieldApiName: "file_field_2__c",
      label: "Field 2"
    }
    // Add more file fields as needed
  ];

  handleUploadFinished(event) {
    const uploadedFile = event.detail.files[0];
    const fieldName = event.target.name;

    // Access file attributes
    console.log("Field Name: " + fieldName);
    console.log("File Name: " + uploadedFile.name);
    console.log("Content Type: " + uploadedFile.type);
    console.log("File Size: " + uploadedFile.size);
    console.log("Document Id: " + uploadedFile.documentId);

    this.saveFileField(uploadedFile, fieldName);
  }

  saveFileField(file, name) {
    if (this.recordId) {
      saveFileRelation({
        accountId: this.recordId,
        fileName: name,
        fileURL: "/sfc/servlet.shepherd/document/download/" + file.documentId
      })
        .then((result) => {
          console.log("File URL saved successfully:", result);
        })
        .catch((error) => {
          console.error("Error saving file URL:", error);
        });
    }
  }
}
