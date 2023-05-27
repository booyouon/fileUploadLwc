import { LightningElement, wire, api } from "lwc";
import { getRecord, getFieldValue } from "lightning/uiRecordApi";
import { getObjectInfo } from "lightning/uiObjectInfoApi";
import saveFileToAccount from "@salesforce/apex/AccountFileAttachmentController.saveFileToAccount";
import ACCOUNT_OBJECT from "@salesforce/schema/Account";

const FIELDS = ["Account.Name"];

export default class CustomFileUpload extends LightningElement {
  @api recordId;
  @api acceptedFormats = "";
  file;

  @wire(getObjectInfo, { objectApiName: ACCOUNT_OBJECT })
  objectInfo;

  @wire(getRecord, {
    recordId: "$recordId",
    fields: FIELDS
  })
  account;

  handleFileChange(event) {
    const fileInput = event.target.files[0];
    if (fileInput) {
      this.file = fileInput;
      // Perform any additional logic or actions with the file here
    }
  }

  handleRemoveFile() {
    this.file = null;
  }

  handleSaveFile() {
    // console.log(this.account.data);
    console.log(this.recordId);
    console.log("=======");
    console.log(this.file);
    if (this.recordId) {
      console.log("uploading");
      const accountId = this.recordId;
      const fileName = this.file.name;
      const contentType = this.file.type;
      const fileBody = this.file;
      // Call the Apex method to save the file to the Account
      saveFileToAccount({
        accountId,
        fileName,
        contentType,
        fileBody
      })
        .then(() => {
          // File saved successfully
          // Perform any additional logic or actions
        })
        .catch((error) => {
          // Handle any error that occurred
          console.error("Error saving file:", error);
        });
    }
  }
}
