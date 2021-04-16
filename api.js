// ACNH base api
const ACNHAPI = axios.create({
  baseURL: 'https://acnhapi.com/v1/'
});


//art
export const artData = data =>ACNHAPI.get('/art',data);
export const seaData = data =>ACNHAPI.get('/sea',data);