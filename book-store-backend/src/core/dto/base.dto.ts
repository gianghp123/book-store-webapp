import {
  ClassTransformOptions,
  instanceToPlain,
  plainToInstance,
} from 'class-transformer';

export abstract class BaseResponseDto {
  static fromEntity<E>(
    this: new () => any,
    entity: E,
    opts?: ClassTransformOptions,
  ) {
    const plain = instanceToPlain(entity);
    return plainToInstance(this, plain, {
      excludeExtraneousValues: true,
      ...opts,
    });
  }

  static fromEntities<T, E>(
    this: new () => T,
    entities: E[],
    opts?: ClassTransformOptions,
  ): T[] {
    const plain = instanceToPlain(entities);
    return plainToInstance(this, plain, {
      excludeExtraneousValues: true,
      ...opts,
    }) as T[];
  }
}
