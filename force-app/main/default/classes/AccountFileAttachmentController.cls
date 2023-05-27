public class AccountFileAttachmentController {
  @AuraEnabled
  public static void saveFileToAccount(
    Id accountId,
    String fileName,
    String contentType,
    Blob fileBody
  ) {
    try {
      Account account = new Account(Id = accountId);

      Attachment attachment = new Attachment();
      attachment.ParentId = account.Id;
      attachment.Name = fileName;
      attachment.ContentType = contentType;
      attachment.Body = fileBody;

      insert attachment;
    } catch (Exception e) {
      throw new AuraHandledException(e.getMessage());
    }
  }
}
