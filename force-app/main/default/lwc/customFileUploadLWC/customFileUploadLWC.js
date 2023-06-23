import { LightningElement, track, api } from "lwc";
import uploadFile from "@salesforce/apex/CustomFileUploadLWCCtrl.uploadFile";
import { ShowToastEvent } from "lightning/platformShowToastEvent";
export default class CustomFileUploadLWC extends LightningElement {
  @track showSpinner = false;
  @track fileData;
  @api recordId;
  @track fileName;
  // getting file
  handleFileChange(event) {
    if (event.target.files.length > 0) {
      const file = event.target.files[0];
      var reader = new FileReader();
      reader.onload = () => {
        var base64 = reader.result.split(",")[1];
        this.fileName = file.name;
        this.fileData = {
          filename: file.name,
          base64: base64
        };
        console.log(this.fileData);
      };
      reader.readAsDataURL(file);
    }
  }

  uploadFile() {
    this.handleSpinner();
    const { base64, filename } = this.fileData;

    uploadFile({
      fileName: this.fileName,
      base64Data: base64,
      recordId: this.recordId
    })
      .then((result) => {
        this.fileData = null;
        let title = `${filename} uploaded successfully!!`;
        this.ShowToast("Success!", title, "success", "dismissable");
        this.updateRecordView(this.recordId);
      })
      .catch((err) => {
        this.ShowToast("Error!!", err.body.message, "error", "dismissable");
      })
      .finally(() => {
        this.handleSpinner();
      });
  }

  handleSpinner() {
    this.showSpinner = !this.showSpinner;
  }

  ShowToast(title, message, variant, mode) {
    const evt = new ShowToastEvent({
      title: title,
      message: message,
      variant: variant,
      mode: mode
    });
    this.dispatchEvent(evt);
  }

  //update the record page
  updateRecordView() {
    setTimeout(() => {
      eval("$A.get('e.force:refreshView').fire();");
    }, 1000);
  }
}
