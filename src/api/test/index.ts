export function testGetApi() {
  return useGet('/test')
}

export function testPostApi() {
  return usePost('/test')
}

export function testPutApi() {
  return usePut('/test')
}

export function testDeleteApi() {
  return useDelete('/test')
}
