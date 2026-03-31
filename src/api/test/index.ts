import { http } from '@/utils/request'

export function testGetMethod() {
  return http.Get('/test')
}

export function testPostMethod() {
  return http.Post('/test')
}

export function testPutMethod() {
  return http.Put('/test')
}

export function testDeleteMethod() {
  return http.Delete('/test')
}
