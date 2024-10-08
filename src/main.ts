import { NestFactory } from '@nestjs/core'
import { SwaggerModule } from '@nestjs/swagger'
import { AppModule } from './app.module'
import { getOpenApiDocument } from './get-open-api-document'

async function bootstrap() {
  const app = await NestFactory.create(AppModule)

  const document = getOpenApiDocument()

  SwaggerModule.setup('/swagger', app, document, {
    yamlDocumentUrl: '/swagger.yaml',
  })

  app.enableCors({
    origin: '*',
  })

  await app.listen(3123)
}
bootstrap()
