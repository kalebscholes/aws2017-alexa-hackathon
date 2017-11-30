const atob = require('atob')

class Svc {
  constructor(rk){
    this.rk = rk
  }

  async add(name, b64, collectionId){
    const foo = await this.rk.indexFacesAsync({
      CollectionId: collectionId,
      ExternalImageId: name,
      Image: {
        Bytes: getBinary(b64)
      }
    })
    return foo 
  }

  async findMatch(b64, collectionId){
    const foo = await this.rk.searchFacesByImageAsync({
      CollectionId: collectionId, 
      FaceMatchThreshold: 50, 
      Image: {
       Bytes: getBinary(b64)
      }, 
      MaxFaces: 5
    })
    return foo
  }

}

function getBinary(base64Image) {
  
     var binaryImg = atob(base64Image);
     var length = binaryImg.length;
     var ab = new ArrayBuffer(length);
     var ua = new Uint8Array(ab);
     for (var i = 0; i < length; i++) {
       ua[i] = binaryImg.charCodeAt(i);
      }
  
      return ab;
  }
  
module.exports = (rk) => new Svc(rk)