export class HttpException extends Error {
  public code: number
  public message: string

  constructor(code: number = 500, message: string = 'Internal Server Error') {
    super(message)
    this.code = code >= 400 && code <= 599 ? code : 500
    this.message = message
  }
}
