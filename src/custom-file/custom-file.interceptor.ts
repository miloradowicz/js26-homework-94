import {
  CallHandler,
  ExecutionContext,
  Injectable,
  mixin,
  NestInterceptor,
} from '@nestjs/common';
import * as multer from 'multer';
import { promises as fs } from 'fs';
import { Observable } from 'rxjs';
import { extname } from 'path';
import { randomUUID } from 'crypto';

export function CustomFileInterceptor(fieldName: string, dest: string) {
  @Injectable()
  class MixinInterceptor implements NestInterceptor {
    multer: multer.Multer;

    constructor() {
      const imageStorage = multer.diskStorage({
        destination: (_req, _file, cb) => {
          (async () => {
            await fs.mkdir(dest, { recursive: true });
            cb(null, dest);
          })().catch(console.error);
        },
        filename: (_req, file, cb) => {
          const extension = extname(file.originalname);
          cb(null, randomUUID() + extension);
        },
      });

      this.multer = multer({ storage: imageStorage });
    }

    async intercept(
      context: ExecutionContext,
      next: CallHandler,
    ): Promise<Observable<any>> {
      const ctx = context.switchToHttp();

      await new Promise<void>(
        (resolve, reject) =>
          void this.multer.single(fieldName)(
            ctx.getRequest(),
            ctx.getResponse(),
            (err: any) => {
              if (err) {
                return reject(
                  err instanceof Error ? err : new Error('Unknown error'),
                );
              }
              resolve();
            },
          ),
      );

      return next.handle();
    }
  }

  const Interceptor = mixin(MixinInterceptor);
  return Interceptor;
}
