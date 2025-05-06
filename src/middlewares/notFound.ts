import { httpStatusCode } from 'enum/statusCode'
import { Request, Response } from 'express'

const notFound = (req: Request, res: Response) => {
  console.info('Request of Invalid URL', req)
  return res.status(httpStatusCode.NOT_FOUND).send({
    status: httpStatusCode.NOT_FOUND,
    success: false,
    message: 'API Not Found or Invalid URL!!',
  })
}

export default notFound
