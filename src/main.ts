import { NestFactory } from '@nestjs/core'
import { SwaggerModule } from '@nestjs/swagger'
import { generateOpenApi } from '@ts-rest/open-api'
import { AppModule } from './app.module'
import { contract } from './contract'

async function bootstrap() {
  const app = await NestFactory.create(AppModule)

  const document = generateOpenApi(
    contract,
    {
      info: {
        title: 'My API',
        version: '1.0.0',
      },
    },
    {
      setOperationId: true,
    },
  )

  SwaggerModule.setup('/swagger', app, document, {
    yamlDocumentUrl: '/swagger.yaml',
  })

  app.enableCors({
    origin: '*',
  })

  await app.listen(3123)
}
bootstrap()
