/// returns list of numbers range provided
function range(start: number, end: number) {
  let l = [];
  for (let i = start; i <= end; i++) {
    l.push(i);
  }
  return l;
}

/// read file as data url
function readFileAsDataUrl(file: File) {
  return new Promise<string>((resolve) => {
    const reader = new FileReader();
    reader.addEventListener('load', () => resolve(reader.result!.toString()), false);
    reader.readAsDataURL(file);
  });
}

/// read data url as blob
function readDataUrlAsBlob(dataURI: string) {
  const byteString = atob(dataURI.split(',')[1]);
  const mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0]
  const ab = new ArrayBuffer(byteString.length);
  const ia = new Uint8Array(ab);
  for (var i = 0; i < byteString.length; i++) ia[i] = byteString.charCodeAt(i);
  return new Blob([ab], {type: mimeString});
}

/// returns cookie value of provided name as key
function getCookie(name: string) {
  let cookieValue = null;
  if (document.cookie && document.cookie !== '') {
    const cookies = document.cookie.split(';');
    for (let i = 0; i < cookies.length; i++) {
      const cookie = cookies[i].trim();
      if (cookie.substring(0, name.length + 1) === (name + '=')) {
        cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
        break;
      }
    }
  }
  return cookieValue;
}

/// validator class for validating email, password etc.
class Validator {
  static isEmail(email: string) {
    return email.toLowerCase().match(/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/);
  }

  static isPassword(password: String) {
    let containsNum = false, containsAlpha = false;
    for (let i = 0; i < password.length; i++) {
      const ascii = password.charCodeAt(i);
      if (!containsAlpha && ((ascii >= 65 && ascii <= 90) || (ascii >= 97 && ascii <= 122))) {
        containsAlpha = true;
      }
      if (!containsNum && (ascii >= 48 && ascii <= 57)) {
        containsNum = true;
      }
      if (containsNum && containsAlpha) {
        return true;
      }
    }
    return false
  }

  static isValidUrl(url: string) {
    const urlPattern = new RegExp('^(https?:\\/\\/)?' +
      '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|' +
      '((\\d{1,3}\\.){3}\\d{1,3}))' +
      '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' +
      '(\\?[;&a-z\\d%_.~+=-]*)?' +
      '(\\#[-a-z\\d_]*)?$', 'i');
    return !!urlPattern.test(url);
  }
}

export { range, readFileAsDataUrl, readDataUrlAsBlob, getCookie, Validator };