public class FileUploaderController {
  @AuraEnabled
  public static void saveFile(Id recordId, String fileName, String fileURL) {
    // // Create a ContentDocumentLink record to relate the file to the account
    // ContentDocumentLink cdl = new ContentDocumentLink();
    // cdl.ContentDocumentId = [
    //   SELECT Id
    //   FROM ContentVersion
    //   WHERE Title = :fileName
    // ]
    // .ContentDocumentId;
    // cdl.LinkedEntityId = accountId;
    // cdl.ShareType = 'V';

    // // Insert the ContentDocumentLink record
    // insert cdl;
    // Create a new ContentVersion record
    ContentVersion contentVersion = new ContentVersion();
    contentVersion.Title = 'My File';
    contentVersion.PathOnClient = 'path/to/myfile.txt';
    contentVersion.VersionData = Blob.valueOf('File content'); // Replace with actual file content

    // Insert the ContentVersion record
    insert contentVersion;

    // Create a new ContentDocumentLink record to link the ContentVersion to the Account
    ContentDocumentLink contentLink = new ContentDocumentLink();
    contentLink.ContentDocumentId = contentVersion.ContentDocumentId;
    contentLink.LinkedEntityId = recordId; // Replace with the Account ID
    contentLink.ShareType = 'V'; // 'V' for Viewer access, 'C' for Collaborator access, 'I' for Inferred access

    // Insert the ContentDocumentLink record
    insert contentLink;
  }

  @AuraEnabled
  public static void saveFileRelation(
    Id accountId,
    String fileName,
    String fileURL
  ) {
    // Update the account record with the file URL
    Account account = new Account(Id = accountId);
    // account.website = fileURL;
    account.put(fileName, fileURL);

    // Update the account record
    System.debug(account);
    update account;
  }
}
