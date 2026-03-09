const axios = require("axios");

const headers = {
  "X-EBAY-API-CALL-NAME": "GetUser",
  "X-EBAY-API-SITEID": "3",
  "X-EBAY-API-APP-NAME": "BLMotorc-Bikeitsy-PRD-9471f0ac8-7600a277",
  "X-EBAY-API-DEV-NAME": "8cb9bb9c-70d3-4409-8d8f-4c9eac24fec3",
  "X-EBAY-API-CERT-NAME": "PRD-471f0ac800ad-fd45-4df6-87ab-a208",
  "X-EBAY-API-COMPATIBILITY-LEVEL": "967",
  "Content-Type": "text/xml"
};

const data = `<?xml version="1.0" encoding="utf-8"?>
<GetUserRequest xmlns="urn:ebay:apis:eBLBaseComponents">
  <RequesterCredentials>
    <eBayAuthToken>v^1.1#i^1#r^0#f^0#p^3#I^3#t^H4sIAAAAAAAA/+VabWwbZx2781Lo2hSxMVYNCsYrFC2c/dyL7btT4nFJnMaNHbu2kzaByTx395zzJOc7c/c4iSPRpdWoGEJIUIQ0hLp+GPsAjIkPqDCNAVVR+QTiAxJSxbaWoVRakZhKGaxFcGfnxQ3QxnYGJ+Ev1vPc/+33f3v+fnxgZdfuR0+PnX6rz/+urnMrYKXL76f3gN27evv3dXc93OsDTQT+cysHV3pOdV8bsGFZr4g5ZFdMw0aBpbJu2GJ9czBYtQzRhDa2RQOWkS0SRcxL6ZTIhIBYsUxiKqYeDCRHBoM0rTERVRZgVFZYAKGza6zLLJiDQcgzTITmeaDILFQR7Ty37SpKGjaBBhkMMoCJUCBKAaFAcyLHijQdEmLCTDAwhSwbm4ZDEgLBeN1csc5rNdl6d1OhbSOLOEKC8aQ0ms9IyZHERGEg3CQrvuaHPIGkat+5GjZVFJiCehXdXY1dpxbzVUVBth0Mxxsa7hQqSuvGtGF+3dU8g3go8DQvAMQIEOyIK0dNqwzJ3e1wd7BKaXVSERkEk9q9POp4Q55DCllbTTgikiMB9+toFepYw8gaDCaGpOnJfCIXDOSzWctcwCpS60kFhGgU8HSUCcZlDVoxFjBrOhqC1jy8RcmwaajY9ZcdmDDJEHIMRlvdwja5xSHKGBlL0ohrTDNddMN97Iwbz0YAq2TWcEOKyo4PAvXlvZ2/ng2b8d+pfFAYjmMUGJGZGKfG2Ni/zwe31lvLibgbFimbDbu2IBnWqDK05hGp6FBBlOK4t1pGFlZFNqIxLK8hSo0KGsUJmkbJETVK0RpCACFZVgT+/yQ1CLGwXCVoIz22PqjjGwzmFbOCsqaOlVpwK0m906wlw5I9GJwlpCKGw4uLi6FFNmRapTADAB0+nk7llVlUdlrtOi2+NzGF62mhIIfLxiKpVRxrlpysc5QbpWCctdQstEgtj3Td2VjP2Ttsi2/d/Q8gh3XseKDgqPAWxjHTJkjtCJqKFrCCilj1FrL6GStE3VrnQQQAviOQulnCRhqRWdNjMN2GkBzpCJvTPyHxFqqm7gJi612I5ihnAUBHYGHJQvVu1BhEvAVbGh5OZAuJzsIpVSrJcrlKoKyjpMeyNcIIAh/ZmQAm1oauTTK31v/3GN1jujicSacTueFEcXK8mCp0FtBKteq15ipJU/TxuaMLeYnqCJo7SokYaiIx55HhveMxlxjNJfJjxUJmPDHREdIc0ixkzxZcnF6rSumoNC45n/ThCiPM9I8mD6tqZi47AiYS/VHtCDsztrCc5MrzR8bo8BJfOB4DUuZYfjQPp44wJUVbniwXjk5YZnZWGhzsyEl5pFhoe0eRW+v/NQcNJSKjY0lmbDwxPT5lL6eml6Jj1oSS4+eSgqXW4FAupUwDdXqpnOzMAemS1yp9bYzagRGq4M0StxqFWax3oKKz6ghkouS5Xh2hGU6maZYWYgBG5YjGygyHNFbT+EiE4+mOh413HK9b6y0WbCptEtNSqCE8jzCxa1Q2N0IJXIzWAFR4KhYFADKxWIfnstdCvVPH8saM5S69BTErTacTE4U8UwRF97dPUTqcSyTSmzdu7SG23UsIbyF1+W1HAKzgkDsnhRSzHDZhlcy6W8W6xYHtEIVtpOuhxoWVIzlkIaiahl5rh7kFHmwsOBlkWrWWFLq1vlVAC0qhophVg7SDcY21BQ6tqmtY191CaUdhE3srZhpQrxGs2G2pxIabcXYLLBVYqwNUsV1x62VbnM5eGVkKCmG1cTfejrEWchTC+nVwO0wtqtww2TAJ1rDSkGFXZVuxcGX7VtxbTju+sJ06aClsDYZtqWriQirS8QLabsltYHVYzNb7r1vrzReJZhkrWPdYGz481NnlGlKxhRRSrFrYW8CGiqliY0qqKTqyqS0zE1WbX4Sks2nYTRcvXppmpXz+WCbX2bXMCFrw2g95XpEFWRYUKgZUluI4IFC8ymsUpwgIKgynIYXtCHP7F8U9Jy++Q6DpGCdwPHB+pW4X2paNpj+o/uVvyfCdrwTEffUPfcp/AZzyv9zl94MB8FH6EfCRXd2TPd17H7YxcQ49qIVsXDIgqVooNI9qFYitrgd8v9qXUk+OpW6uyNXzx/78GO/ra3oj4dzjYP/GOwm7u+k9TS8ogA9uPuml3/NQHxMBUSDQHMfS9Ax4ZPNpD/3+nvf95kbx6Z8br7/s+8o0PfD4k7/7wvJb10DfBpHf3+vrOeX3ifLFT9e+fGO8+OOffedF0v+L4VfgZ/df7b3+/fuC9x80fddnz7zEnv/xWd+Vffy7A/+4fencs4xxe3f8i398cHX5+dVD92dil489AJ75du1Dt59aPRH+3I2uk+EZ5uzzvZPPMPBypqt05cReo+vvh75664j/pQ/8LXP+tb2f/MzXP186cRWv3Op9rO9m/+Se69rSmdjVjz90+bsfe+7So385feF07MDv/3rh7fv2jf6kWx3/4UzX2Tffpn/wbPnal+S514YffOXie0/tf+MA/8Srl594g/npzwpPX/jTwRWU/162Yt88c+gTq72vP5W7eMD69XMLv52YXT1564U3v/WNT1169cU//JIduPK1b9649uTt1Asjpg+sjjdi+U/tuaSaKyIAAA==</eBayAuthToken>
  </RequesterCredentials>
</GetUserRequest>`;

axios.post("https://api.ebay.com/ws/api.dll", data, { headers })
  .then(res => {
    console.log("✅ User Info Retrieved:");
    console.log(res.data);
  })
  .catch(err => {
    console.error("❌ Error calling Trading API:");
    console.error(err.response?.data || err.message);
  });
