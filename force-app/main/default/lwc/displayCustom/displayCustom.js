import { LightningElement, api, wire } from 'lwc';
import { getRecord, getFieldValue } from 'lightning/uiRecordApi';
import { getObjectInfo } from 'lightning/uiObjectInfoApi';
import ACCOUNT_OBJECT from '@salesforce/schema/Account';
import FIELD1_FIELD from '@salesforce/schema/Account.File_Field_1__c';
import FIELD2_FIELD from '@salesforce/schema/Account.File_Field_2__c';
// Add more field imports as needed

export default class DisplayCustom extends LightningElement {
    @api recordId;
    customFields = [];

    @wire(getObjectInfo, { objectApiName: ACCOUNT_OBJECT })
    objectInfo;

    @wire(getRecord, { recordId: '$recordId', fields: [FIELD1_FIELD, FIELD2_FIELD] })
    wiredAccount({ error, data }) {
        if (data) {
            this.customFields = [
                { fieldApiName: FIELD1_FIELD.fieldApiName, label: this.getFieldLabel(FIELD1_FIELD), value: getFieldValue(data, FIELD1_FIELD) },
                { fieldApiName: FIELD2_FIELD.fieldApiName, label: this.getFieldLabel(FIELD2_FIELD), value: getFieldValue(data, FIELD2_FIELD) },
                // Add more fields as needed
            ];
        } else if (error) {
            // Handle error
        }
    }

    getFieldLabel(field) {
        return this.objectInfo.data.fields[field.fieldApiName].label;
    }
}
