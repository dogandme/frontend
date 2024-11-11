export const getMockMarkerList = ()=> Array.from({length  : 100} , (_,index)=>({
  markingId : index + 1,
  previewImage : "fa805c91-8228-4ec4-927f-9eb876a480c3",
  lat : 37.123456 + Math.random() * 0.1,
  lng : 127.123456 + Math.random() * 0.1,
}))