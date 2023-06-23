public class CustomFileUploadLWCCtrl {
  @AuraEnabled
  public static String uploadFile(
    String fileName,
    String base64Data,
    Id recordId
  ) {
    // Decoding the base64Data
    base64Data = EncodingUtil.urlDecode(base64Data, 'UTF-8');
    ContentVersion cv = new ContentVersion();
    cv.Title = fileName;
    cv.PathOnClient = '/' + fileName;
    cv.FirstPublishLocationId = recordId;
    cv.VersionData = EncodingUtil.base64Decode(base64Data);
    cv.IsMajorVersion = true;
    insert cv;
    return 'File upload successfully!';
  }
}
