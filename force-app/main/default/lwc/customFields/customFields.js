import { LightningElement, api, wire } from "lwc";
import { getRecord, getFieldValue } from "lightning/uiRecordApi";
import { getObjectInfo } from "lightning/uiObjectInfoApi";
import ACCOUNT_OBJECT from "@salesforce/schema/Account";
import FIELD1_FIELD from "@salesforce/schema/Account.File_Field_1__c";
import FIELD2_FIELD from "@salesforce/schema/Account.File_Field_2__c";
// Add more field imports as needed

import saveFileRelation from "@salesforce/apex/FileUploaderController.saveFileRelation";

export default class customFields extends LightningElement {
  @api recordId;
  customFields = [];
  @api cardTitle = "File Upload";
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

  @wire(getObjectInfo, { objectApiName: ACCOUNT_OBJECT })
  objectInfo;

  @wire(getRecord, {
    recordId: "$recordId",
    fields: [FIELD1_FIELD, FIELD2_FIELD]
  })
  wiredAccount({ error, data }) {
    if (data) {
      this.customFields = [
        {
          fieldApiName: FIELD1_FIELD.fieldApiName,
          label: this.getFieldLabel(FIELD1_FIELD),
          value: getFieldValue(data, FIELD1_FIELD)
        },
        {
          fieldApiName: FIELD2_FIELD.fieldApiName,
          label: this.getFieldLabel(FIELD2_FIELD),
          value: getFieldValue(data, FIELD2_FIELD)
        }
        // Add more fields as needed
      ];
    } else if (error) {
      // Handle error
    }
  }

  getFieldLabel(field) {
    return this.objectInfo.data.fields[field.fieldApiName].label;
  }

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
