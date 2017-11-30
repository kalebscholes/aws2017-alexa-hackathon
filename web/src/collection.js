

async function setup(rk, id){

  const result = {}
  try { 
    await rk.createCollectionAsync({ CollectionId: id})
    result.created = true
  }catch(e){
    if( e.message && e.message.indexOf('already exists') >= 0 ){
      result.created = false
    }else{
      throw e
    }
  }

  return result 
}

module.exports = { 
  setup
}