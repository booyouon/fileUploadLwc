import { LightningElement, api } from "lwc";

export default class CustomFileUpload extends LightningElement {
  @api acceptedFormats = "";
  file;

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

  formatFileSize(size) {
    if (typeof size !== "number") {
      return "";
    }
    if (size < 1024) {
      return size + " B";
    }
    const units = ["KB", "MB", "GB"];
    let i = 0;
    while (size >= 1024) {
      size /= 1024;
      i++;
    }
    return size.toFixed(2) + " " + units[i];
  }
}
