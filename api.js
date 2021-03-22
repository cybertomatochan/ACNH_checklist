// ACNH base api
const ACNHAPI = axios.create({
  baseURL: 'http://acnhapi.com/v1/'
});


//art
export const artData = data =>ACNHAPI.get('/art',data);