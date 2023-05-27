import { LightningElement, api } from "lwc";
import { updateRecord, createRecord } from "lightning/uiRecordApi";

export default class parentComponent extends LightningElement {
  @api accountId; // Account Id where the file will be uploaded
  allowedFormats = ".pdf,.png,.jpg"; // Allowed file formats separated by commas
  fileName = ""; // Property to store the selected file name

  handleFileChange(event) {
    const file = event.target.files[0];
    if (file) {
      this.fileName = file.name; // Update the selected file name
      this.uploadFile(file);
    }
  }

  uploadFile(file) {
    const reader = new FileReader();

    reader.onloadend = () => {
      const base64Data = reader.result.split(",")[1];
      this.saveFileToAccount(file.name, base64Data);
    };

    reader.readAsDataURL(file);
  }

  saveFileToAccount(fileName, fileData) {
    // Create a ContentVersion record
    const fields = {};
    fields.Title = fileName;
    fields.VersionData = fileData;
    fields.PathOnClient = fileName;

    const recordInput = { apiName: "ContentVersion", fields };

    // Create the ContentVersion record using LDS
    createRecord(recordInput)
      .then((result) => {
        const contentVersionId = result.id;
        this.saveFileUrlToAccount(contentVersionId);
      })
      .catch((error) => {
        // Handle error
        console.error("Error creating ContentVersion:", error);
      });
  }

  saveFileUrlToAccount(contentVersionId) {
    // Update the Account record with the file URL
    const fields = {};
    fields.Id = this.accountId;
    fields.File_Field_1__c = `/lightning/r/ContentDocument/${contentVersionId}/view`;

    const recordInput = { fields };

    // Update the Account record using LDS
    updateRecord(recordInput)
      .then(() => {
        // File URL saved successfully
      })
      .catch((error) => {
        // Handle error
        console.error("Error updating Account:", error);
      });
  }

  handleDeleteFile() {
    this.fileName = ""; // Reset the selected file name
  }
}
