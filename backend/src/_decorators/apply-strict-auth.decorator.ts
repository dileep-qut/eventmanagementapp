import { applyDecorators } from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';
import { AuthGuard } from '@/_guard/auth.guard';
import { UseGuards } from '@nestjs/common';

/**
 * Apply strict auth decorator
 * @param strict
 * @constructor
 */
export function ApplyStrictAuth(strict: boolean = true) {
  const decoratorsArr: any = [];
  decoratorsArr.push(ApiBearerAuth());
  if (strict) {
    decoratorsArr.push(UseGuards(new AuthGuard()));
  }

  return applyDecorators(...decoratorsArr);
}
