public class FileUploaderController {
  @AuraEnabled
  public static void saveFileRelation(Id accountId, String fileName, String fileURL) {
    // Update the account record with the file URL
    Account account = new Account(Id = accountId);
    // account.website = fileURL;
    account.put(fileName, fileURL);

    // Update the account record
    System.debug(account);
    update account;
  }
}
